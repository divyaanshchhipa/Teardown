"""The guided tour must still point at things that exist.

The tour in js/tour.js anchors each step to a live selector and, for several
steps, drives the real UI to get there. That is what keeps it honest -- it
cannot describe a control that was removed -- but it also means a rename in
app.js silently turns a step into a no-op, and a tour that quietly skips half
its steps is worse than no tour at all.

So this walks the whole tour the way a reader would: click the trigger, press
Next once per step, and assert at each stop that the step's anchor resolved,
that the spotlight actually landed on it, and that the caption is not sitting
on top of the thing it is describing.

It synchronises on the tour's own busy flag rather than on a timer. See
await_step below; that distinction is the difference between this gate being
trustworthy and it reporting a different result per build.

Two allowances, both deliberate:

  optional steps   The 3D controls do not exist when WebGL is unavailable, and
                   the tour is supposed to skip them rather than break. A step
                   marked `optional` may be absent; a step not marked optional
                   may not.
  clamping         A target taller than the viewport is clipped to the visible
                   region on purpose, so the ring legitimately differs from the
                   element's own rect. Only the on-screen portion is compared.

Run:  python tools/tourcheck.py [src] [theme]
"""
import sys

from _common import Checks, browser, open_src, settle, args_src_theme

# The tour marks itself busy with a `swapping` class while a step's action is
# running, and clears it once the caption and spotlight are in their final
# place. Polling that is the only reliable synchronisation: an earlier version
# waited a flat 1600ms, which was enough on the multi-file source and not
# enough on the 2.1MB single-file build, so the same tour passed one build and
# failed the other. Never go back to a fixed delay here.
SETTLE_CAP_MS = 8000
POLL_MS = 120


def await_step(page):
    """Block until the tour has finished painting the current step."""
    waited = 0
    while waited < SETTLE_CAP_MS:
        busy = page.evaluate(
            "() => { const t = document.querySelector('.tour');"
            " return !t || t.hasAttribute('hidden') ? false"
            " : t.classList.contains('swapping'); }")
        if not busy:
            # the late reposition that corrects for scroll easing
            page.wait_for_timeout(420)
            return
        page.wait_for_timeout(POLL_MS)
        waited += POLL_MS

# Nothing the reader can click may sit on top of anything else the reader can
# click. This exists because the close icon, absolutely positioned in the
# corner of the full card, landed squarely on the Next button once the card
# collapsed into the Explore bar: fine in the state it was designed for, broken
# in the other. Geometry is now checked in BOTH states, because "it looks
# right" only ever means "it looks right here".
OVERLAP_JS = r"""() => {
  const els = Array.from(document.querySelectorAll(
      '.tour-card button, .tour-card h3, .tour-card .tour-count'))
    .filter(e => { const r = e.getBoundingClientRect();
                   return r.width > 0 && r.height > 0; });
  const hits = [];
  for (let i = 0; i < els.length; i++) {
    for (let j = i + 1; j < els.length; j++) {
      const a = els[i].getBoundingClientRect(), b = els[j].getBoundingClientRect();
      if (a.right > b.left && b.right > a.left && a.bottom > b.top && b.bottom > a.top) {
        hits.push((els[i].className || els[i].tagName) + ' over ' +
                  (els[j].className || els[j].tagName));
      }
    }
  }
  return hits;
}"""


def assert_no_overlap(page, c, where):
    """No control may cover another, in whichever state the card is in."""
    c.eq(page.evaluate(OVERLAP_JS), [], "%s: no two controls overlap" % where)


STEP_JS = r"""() => {
  const tour = document.querySelector('.tour');
  if (!tour || tour.hasAttribute('hidden')) return null;
  const i = TD.tour.index();
  const s = TD.tour.list()[i];
  const el = s.target ? document.querySelector(s.target) : null;
  const r = el ? el.getBoundingClientRect() : null;
  const ring = document.querySelector('.tour-ring');
  const rr = ring.getBoundingClientRect();
  const card = document.querySelector('.tour-card').getBoundingClientRect();

  // the ring is clamped to the viewport, so compare against the clamped rect
  const PAD = 6;
  let want = null;
  if (r) {
    want = {
      left: Math.max(0, r.left - PAD),
      top: Math.max(0, r.top - PAD),
      right: Math.min(innerWidth, r.right + PAD),
      bottom: Math.min(innerHeight, r.bottom + PAD)
    };
  }
  const overlaps = r && !(card.right < r.left || card.left > r.right ||
                          card.bottom < r.top || card.top > r.bottom);
  const need = s.need || {};
  return {
    i: i,
    title: s.title,
    target: s.target || null,
    optional: !!s.optional,
    found: !s.target || !!el,
    visible: !s.target || !!(r && r.width > 0 && r.height > 0),
    // the declared precondition, and what the page is actually showing
    wantView: need.view || null,
    gotView: TD.tour.view(),
    wantRoute: need.route || null,
    gotRoute: location.hash.replace(/^#\//, ''),
    hasNeed: !!s.need,
    ringOff: want ? Math.max(Math.abs(rr.left - want.left),
                             Math.abs(rr.top - want.top),
                             Math.abs(rr.right - want.right),
                             Math.abs(rr.bottom - want.bottom)) : 0,
    cardOverlapsTarget: !!overlaps,
    cardOnScreen: card.top >= -1 && card.left >= -1 &&
                  card.bottom <= innerHeight + 1 && card.right <= innerWidth + 1,
    chapter: (document.querySelector('.tour-chapter') || {}).textContent || '',
    hasTitle: !!(document.querySelector('#tour-title') || {}).textContent,
    hasBody: !!(document.querySelector('.tour-text') || {}).textContent
  };
}"""


def assert_step(c, d, where):
    """Everything that must be true whichever direction we arrived from."""
    tag = "%s step %2d %-30s" % (where, d["i"] + 1, d["title"][:30])

    if not d["optional"]:
        c.ok(d["found"], "%s anchor %r resolves" % (tag, d["target"]))
        c.ok(d["visible"], "%s anchor has a visible box" % tag)
    c.ok(d["hasTitle"], "%s has a title" % tag)
    c.ok(d["hasBody"], "%s has body copy" % tag)
    c.ok(bool(d["chapter"]), "%s names its chapter" % tag)
    c.ok(d["cardOnScreen"], "%s caption is fully on screen" % tag)

    # The precondition the step declared must actually hold now. This is what
    # catches a caption describing something the page is not showing.
    c.ok(d["hasNeed"], "%s declares its preconditions" % tag)
    if d["wantView"]:
        c.eq(d["gotView"], d["wantView"], "%s is in the view it needs" % tag)
    if d["wantRoute"]:
        c.eq(d["gotRoute"], d["wantRoute"], "%s is on the route it needs" % tag)

    if d["found"] and d["visible"]:
        c.ok(d["ringOff"] <= 2,
             "%s spotlight lands on the anchor (off by %.0fpx)" % (tag, d["ringOff"]))
        c.ok(not d["cardOverlapsTarget"],
             "%s caption does not cover what it describes" % tag)


def main():
    src, theme = args_src_theme(sys.argv)
    c = Checks("tourcheck %-20s" % src)

    with browser() as b:
        ctx, page = open_src(b, src, theme, viewport=(1440, 950))
        settle(page, 700)

        c.ok(bool(page.query_selector("#tour-btn")), "the tour trigger exists")
        c.ok(page.evaluate("() => !!(window.TD && TD.tour)"), "TD.tour is published")

        # It must not run until asked -- interact.py drives this same page.
        c.ok(page.evaluate("() => document.querySelector('.tour') === null "
                           "|| document.querySelector('.tour').hasAttribute('hidden')"),
             "the tour does not start by itself")

        total = page.evaluate("() => TD.tour.steps.length")
        c.ok(total >= 12, "the tour is substantive (%d steps)" % total)

        # Every step must declare where it wants the page to be. A step with no
        # `need` inherits whatever the previous one left behind, which is the
        # whole bug class this gate exists to prevent.
        undeclared = page.evaluate(
            "() => TD.tour.steps.map((s, i) => (s.need && s.need.route) ? null"
            " : (i + 1) + ' ' + s.title).filter(Boolean)")
        c.eq(undeclared, [], "every step declares the route it needs")

        # The trigger opens a chooser now rather than launching straight into
        # thirty-one steps. Both lengths are asserted, because a short tour
        # built by filtering the long one can still break on a step that only
        # worked because its neighbour ran first.
        page.click("#tour-btn")
        page.wait_for_timeout(400)
        c.ok(page.evaluate("() => { const c = document.querySelector('.tour-choose');"
                           " return !!c && !c.hasAttribute('hidden'); }"),
             "the trigger offers a choice of tour length")
        c.eq(page.evaluate("() => document.querySelectorAll('.tour-opt').length"), 2,
             "the chooser offers exactly two lengths")

        short_n = page.evaluate("() => TD.tour.steps.filter(s => s.short).length")
        c.ok(4 <= short_n <= 8, "the quick tour is genuinely short (%d steps)" % short_n)

        page.click(".tour-opt[data-mode='short']")
        await_step(page)
        c.eq(page.evaluate("() => TD.tour.list().length"), short_n,
             "picking the quick tour walks only the short steps")
        c.eq(page.evaluate("() => TD.tour.mode()"), "short", "the quick tour reports its mode")
        for _ in range(short_n - 1):
            page.click(".tour-next")
            await_step(page)
        c.eq(page.evaluate("() => TD.tour.index()"), short_n - 1,
             "the quick tour reaches its last step")
        page.keyboard.press("Escape")
        page.wait_for_timeout(1300)

        # the close affordance is an icon on the card, not a text button
        page.click("#tour-btn")
        page.wait_for_timeout(400)
        page.click(".tour-opt[data-mode='full']")
        await_step(page)
        c.eq(page.evaluate("() => TD.tour.mode()"), "full", "the full tour reports its mode")
        c.ok(page.evaluate("() => !!document.querySelector('.tour-card .tour-x')"),
             "the card carries a close icon")
        c.eq(page.evaluate("() => document.querySelectorAll('.tour-end').length"), 0,
             "the End tour text button is gone")

        # both states, because the bug this catches existed in only one of them
        assert_no_overlap(page, c, "expanded card")
        page.click(".tour-min")
        page.wait_for_timeout(600)
        c.ok(page.evaluate("() => document.querySelector('.tour').classList.contains('min')"),
             "Explore collapses the card")
        assert_no_overlap(page, c, "Explore bar")
        c.ok(page.evaluate(
            "() => { const r = document.querySelector('.tour-card').getBoundingClientRect();"
            " return r.left >= -1 && r.right <= innerWidth + 1 && r.bottom <= innerHeight + 1; }"),
            "the Explore bar stays fully on screen")
        page.click(".tour-min")
        page.wait_for_timeout(600)
        assert_no_overlap(page, c, "expanded again")

        # autoplay says how long is left rather than moving on unannounced
        c.ok(page.evaluate("() => !!document.querySelector('.tour-autofill')"),
             "autoplay has a countdown bar")
        page.click(".tour-auto")
        page.wait_for_timeout(900)
        w1 = page.evaluate("() => document.querySelector('.tour-autofill').getBoundingClientRect().width")
        page.wait_for_timeout(1300)
        w2 = page.evaluate("() => document.querySelector('.tour-autofill').getBoundingClientRect().width")
        c.ok(w2 > w1, "the countdown advances while autoplay runs (%.0f to %.0f)" % (w1, w2))
        page.click(".tour-auto")
        page.wait_for_timeout(400)
        c.ok(page.evaluate("() => document.querySelector('.tour-autofill').getBoundingClientRect().width") < 2,
             "turning autoplay off clears the countdown")

        # back to step one for the walk
        page.keyboard.press("Escape")
        page.wait_for_timeout(1300)
        page.click("#tour-btn")
        page.wait_for_timeout(400)
        page.click(".tour-opt[data-mode='full']")
        await_step(page)
        total = page.evaluate("() => TD.tour.list().length")

        # ---- forwards ----
        seen = 0
        for n in range(total):
            await_step(page)
            d = page.evaluate(STEP_JS)
            if d is None:
                c.ok(False, "forward step %d: the tour closed early" % (n + 1))
                break
            seen += 1
            assert_step(c, d, "fwd")
            if n < total - 1:
                page.click(".tour-next")

        c.eq(seen, total, "every step was reachable going forwards")

        # ---- backwards ----
        # The direction nothing used to test, and the one that produced the
        # reported fault: arriving at a step from the step after it. A step
        # that only works when approached from above is a step that inherits
        # state instead of establishing it.
        back = 0
        for n in range(total - 1):
            page.click(".tour-back")
            await_step(page)
            d = page.evaluate(STEP_JS)
            if d is None:
                c.ok(False, "backward step: the tour closed early")
                break
            back += 1
            assert_step(c, d, "back")

        c.eq(back, total - 1, "every step was reachable going backwards")
        c.eq(page.evaluate("() => TD.tour.index()"), 0,
             "walking back through the whole tour lands on the first step")

        # ---- rapid presses must not interleave two transitions ----
        page.evaluate("() => { for (let k = 0; k < 3; k++)"
                      " document.querySelector('.tour-next').click(); }")
        await_step(page)
        await_step(page)
        d = page.evaluate(STEP_JS)
        c.eq(d["i"], 3, "three quick Next presses advance exactly three steps")
        assert_step(c, d, "rush")

        # Escape must leave the page usable, not three levels deep.
        page.keyboard.press("Escape")
        page.wait_for_timeout(1400)
        c.ok(page.evaluate("() => document.querySelector('.tour').hasAttribute('hidden')"),
             "Escape closes the tour")
        c.eq(page.evaluate("() => location.hash"), "#/laptop",
             "exiting restores the laptop at its top level")
        c.ok(page.evaluate("() => window.scrollY < 40"), "exiting scrolls back to the top")

        ctx.close()

    return 0 if c.report() else 1


if __name__ == "__main__":
    sys.exit(main())
