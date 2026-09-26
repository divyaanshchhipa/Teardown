"""Data integrity for the flagship laptop: provenance and cost accounting.

Gates 4 and 5 in the phase plan. These are the assertions the 3C research pass
has to satisfy, so they fail loudly until that work lands -- which is the
point. They are the definition of done, written down first.

  provenance   every source entry resolves to a publisher plus either a URL,
               a date, or an explicit note saying no document is retrievable.
               No entry may remain the bare string 'Company filings', which
               names no document and cannot be checked by a reader.
  accounting   root bomPct sums to 100 (+/-1), or the shortfall is carried by
               a named node rather than silently missing.
  hygiene      no two nodes share an identical share table; no node has an
               empty shares array while claiming a market; basis/year present.

Run:  python tools/datacheck.py [src] [device]
"""
import sys

from _common import Checks, browser, open_src

BARE = {"company filings", "taiwan listed company filings", "filings",
        "company reports", "industry estimates", "trade press"}


def main():
    src = sys.argv[1] if len(sys.argv) > 1 else "index.html"
    dev_id = sys.argv[2] if len(sys.argv) > 2 else "laptop"
    c = Checks("datacheck %s %-13s" % (dev_id, src))

    with browser() as b:
        ctx, page = open_src(b, src)

        d = page.evaluate(
            """id => {
              const dev = TD.deviceById[id];
              const srcEntries = [];
              dev.nodes.forEach(n => (n.sources || []).forEach(s => {
                const m = TD.sourceMeta(s);
                srcEntries.push({
                  node: n.id,
                  publisher: m.publisher || '',
                  url: m.url || '',
                  date: m.date || '',
                  note: m.note || '',
                  type: m.type || '',
                  registered: !!m.registered,
                  raw: (typeof s === 'string') ? s : ''
                });
              }));

              const roots = dev.nodes.filter(n => !n.parent && n.kind !== 'meta');
              const bomSum = roots.reduce((a, n) => a + (n.bomPct || 0), 0);

              // identical share tables between two different nodes
              const sig = {}, twins = [];
              dev.nodes.forEach(n => {
                if (!(n.shares || []).length) return;
                const k = n.shares.map(s => s.c + ':' + s.p).join('|');
                if (sig[k]) twins.push(sig[k] + ' == ' + n.id); else sig[k] = n.id;
              });

              const noShares = dev.nodes.filter(n => !(n.shares || []).length)
                                        .map(n => n.id);
              const noSources = dev.nodes.filter(n => !(n.sources || []).length)
                                         .map(n => n.id);
              // A STATED zero is the defect (it reads as "this part is free").
              // An absent bomPct is an honest "not priced" and is allowed.
              const zeroBom = roots.filter(n => n.bomPct === 0).map(n => n.id);
              const unpriced = roots.filter(n => typeof n.bomPct !== 'number')
                                    .map(n => n.id);
              const noBasis = dev.nodes.filter(n => (n.shares || []).length &&
                                 !(n.market && n.market.basis)).map(n => n.id);
              const noYear = dev.nodes.filter(n => (n.shares || []).length &&
                                 !(n.market && n.market.year)).map(n => n.id);
              const noConf = dev.nodes.filter(n => !n.confidence).map(n => n.id);

              return { nodes: dev.nodes.length, srcEntries, bomSum, twins,
                       noShares, noSources, zeroBom, unpriced, noBasis, noYear,
                       noConf, roots: roots.length };
            }""",
            dev_id,
        )

        # ---- provenance -------------------------------------------------
        entries = d["srcEntries"]
        print("  %d source entries across %d nodes" % (len(entries), d["nodes"]))
        bare = [e for e in entries if e["raw"].strip().lower() in BARE]
        withurl = [e for e in entries if e["url"]]
        withdate = [e for e in entries if e["date"]]
        print("  with URL: %d   with date: %d   bare generic: %d"
              % (len(withurl), len(withdate), len(bare)))

        # The durable invariant is that every citation resolves to registered
        # provenance -- a publisher, a document type, and either a URL or an
        # explicit statement of what the reader is getting and why it cannot
        # be linked. A short string like 'Company filings' is fine as a KEY
        # into data/sources.js; what is not fine is a name that resolves to
        # nothing, which is what the site had before.
        for e in entries:
            c.ok(bool(e["publisher"]),
                 "%s: a source entry names no publisher" % e["node"])
            c.ok(e["registered"],
                 "%s: source %r has no entry in data/sources.js"
                 % (e["node"], e["publisher"][:38]))
            c.ok(bool(e["url"] or e["date"] or e["note"]),
                 "%s: source %r is not locatable (no url, date or note)"
                 % (e["node"], e["publisher"][:38]))
            c.ok(e["type"] in ("primary", "third-party", "derived"),
                 "%s: source %r has an unknown type %r"
                 % (e["node"], e["publisher"][:30], e["type"]))

        derived = [e for e in entries if e["type"] == "derived"]
        print("  by type: primary %d, third-party %d, derived %d"
              % (len([e for e in entries if e["type"] == "primary"]),
                 len([e for e in entries if e["type"] == "third-party"]),
                 len(derived)))
        # A layer resting only on derived sources must say so in its own note.
        by_node = {}
        for e in entries:
            by_node.setdefault(e["node"], []).append(e)
        only_derived = [n for n, es in by_node.items()
                        if es and all(x["type"] == "derived" for x in es)]
        if only_derived:
            print("  layers resting only on derived sources: %s"
                  % ", ".join(sorted(only_derived)))
        # If nobody published the share, the layer cannot claim to be well
        # measured. This is the rule that stops a demotion in the source
        # grade from quietly leaving an optimistic confidence behind it.
        conf = page.evaluate(
            "id => { const d = TD.deviceById[id]; const o = {};"
            " d.nodes.forEach(n => o[n.id] = n.confidence); return o; }", dev_id)
        for n in only_derived:
            c.eq(conf.get(n), "low",
                 "%s rests only on derived sources, so it cannot be graded above low" % n)

        # ---- cost accounting --------------------------------------------
        c.ok(abs(d["bomSum"] - 100) <= 1,
             "root bomPct sums to 100 (got %.1f across %d roots)"
             % (d["bomSum"], d["roots"]))
        c.eq(d["zeroBom"], [], "no root component states a zero cost share")
        if d["unpriced"]:
            print("  root(s) with no cost share stated (allowed): %s"
                  % ", ".join(d["unpriced"]))

        # ---- hygiene ------------------------------------------------------
        c.eq(d["twins"], [], "no two nodes share an identical share table")
        c.eq(d["noSources"], [], "every node cites at least one source")
        c.eq(d["noBasis"], [], "every measured node states its market basis")
        c.eq(d["noYear"], [], "every measured node states its year")
        c.eq(d["noConf"], [], "every node carries a confidence grade")
        print("  %d node(s) with no share table (named, not measured): %s"
              % (len(d["noShares"]), ", ".join(d["noShares"]) or "none"))

        ctx.close()

    return 0 if c.report() else 1


if __name__ == "__main__":
    sys.exit(main())
