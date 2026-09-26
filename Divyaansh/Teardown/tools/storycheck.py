"""Story integrity: a flagship analysis must account for the whole device.

Gate 2 in the phase plan. The 12 (or however many) build stages have to
partition the node list exactly -- every node named once, none named twice,
none invented. Adding a node to a device file without touching story.stages is
the easiest way to silently break the analysis, so this is checked
mechanically.

By default this runs against every device carrying a `story` block, so a
second flagship is gated the moment its story lands rather than whenever
someone remembers to widen the harness. Name a device to check just that one.

Run:  python tools/storycheck.py [src] [theme] [device]
      python tools/storycheck.py index.html light smartphone
"""
import sys

from _common import Checks, browser, open_src, goto_hash, args_src_theme

STAGE_JS = """id => {
  const dev = TD.deviceById[id];
  if (!dev) return null;
  const s = dev.story || {};
  const seen = {}, dupes = [], unknown = [];
  (s.stages || []).forEach(st => (st.nodes || []).forEach(nid => {
    if (!dev.byId[nid]) unknown.push(st.id + '/' + nid);
    else if (seen[nid]) dupes.push(nid);
    else seen[nid] = 1;
  }));
  const missing = dev.nodes.filter(n => !seen[n.id]).map(n => n.id);

  // every flow lane / converge reference must resolve to a node
  const flowBad = [];
  const flow = s.flow || {};
  (flow.lanes || []).forEach(l => {
    (l.steps || l.nodes || []).forEach(nid => {
      if (!dev.byId[nid]) flowBad.push('lane ' + (l.id || l.label) + '/' + nid);
    });
    const feed = l.feed || {};
    (feed.steps || []).forEach(nid => {
      if (!dev.byId[nid]) flowBad.push('feed ' + (feed.label || l.label) + '/' + nid);
    });
  });
  const conv = flow.converge;
  ((conv && conv.nodes) || (Array.isArray(conv) ? conv : [])).forEach(nid => {
    if (!dev.byId[nid]) flowBad.push('converge/' + nid);
  });

  // stages must carry a label and at least one node
  const thin = (s.stages || []).filter(st => !st.name || !(st.nodes || []).length)
                               .map(st => st.id);
  return {
    hasStory: !!dev.story,
    nodeCount: dev.nodes.length,
    stageCount: (s.stages || []).length,
    covered: Object.keys(seen).length,
    unknown, dupes, missing, flowBad, thin
  };
}"""

CARDS_JS = """() => {
  const out = [];
  document.querySelectorAll('#story .st-sec').forEach(sec => {
    if (sec.id === 'st-method') return;
    sec.querySelectorAll('.st-card').forEach(el => {
      const t = el.querySelector('.st-card-head h3');
      const foot = el.querySelector('.src');
      out.push({ title: (t ? t.textContent : '?').trim().slice(0, 40),
                 foot: !!foot });
    });
  });
  return out;
}"""


def check_device(page, c, dev_id):
    """Assert every story invariant for one device id."""
    tag = dev_id + ":"
    data = page.evaluate(STAGE_JS, dev_id)

    if data is None:
        c.ok(False, "%s device is loaded" % tag)
        return

    c.ok(data["hasStory"], "%s carries a story block" % tag)
    c.eq(data["unknown"], [], "%s no stage references an unknown node" % tag)
    c.eq(data["dupes"], [], "%s no node appears in two stages" % tag)
    c.eq(data["missing"], [], "%s no node is left out of every stage" % tag)
    c.eq(data["covered"], data["nodeCount"],
         "%s stages cover all %d nodes" % (tag, data["nodeCount"]))
    c.eq(data["flowBad"], [], "%s every flow diagram id resolves to a node" % tag)
    c.eq(data["thin"], [], "%s every stage has a title and at least one node" % tag)
    c.ok(data["stageCount"] >= 8,
         "%s stage count is substantive (got %d)" % (tag, data["stageCount"]))

    # the runtime audit must agree with this script
    goto_hash(page, "#/" + dev_id)
    audit = page.evaluate("() => TD.storyAudit || null")
    c.ok(audit is not None, "%s TD.storyAudit is published after render" % tag)
    if audit:
        c.eq(audit["missing"], [], "%s runtime audit reports no missing nodes" % tag)
        c.eq(audit["dupes"], [], "%s runtime audit reports no duplicates" % tag)
        c.eq(audit["unknown"], [], "%s runtime audit reports no unknown ids" % tag)

    # Every chart card must carry a provenance footer, or its numbers are
    # floating free. The method section is exempt: it *is* the provenance
    # summary, so demanding a source note on it would be circular.
    cards = page.evaluate(CARDS_JS)
    c.ok(len(cards) >= 6, "%s story renders its chart cards (got %d)" % (tag, len(cards)))
    for card in cards:
        c.ok(card["foot"], '%s card "%s" has a source note' % (tag, card["title"]))

    secs = page.evaluate(
        "() => Array.from(document.querySelectorAll('#story .st-sec')).map(s => s.id)"
    )
    c.ok(len(secs) >= 6, "%s story renders its sections (got %s)" % (tag, ", ".join(secs)))


def main():
    src, theme = args_src_theme(sys.argv)
    # a device id may follow src and theme; args_src_theme ignores extras
    only = None
    for a in sys.argv[1:]:
        if a in ("light", "dark") or a.endswith(".html"):
            continue
        only = a

    c = Checks("storycheck %-20s" % src)

    with browser() as b:
        ctx, page = open_src(b, src, theme)

        if only:
            targets = [only]
        else:
            targets = page.evaluate(
                "() => TD.devices.filter(d => d.story).map(d => d.id)"
            )

        c.ok(bool(targets), "at least one device carries a story block")
        for dev_id in targets:
            check_device(page, c, dev_id)

        ctx.close()

    return 0 if c.report() else 1


if __name__ == "__main__":
    sys.exit(main())
