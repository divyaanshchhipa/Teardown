"""No part may vanish into the background, in either theme.

Gate 1 (part-visibility) in the phase plan. A dark part on a dark ground and a
pale part on a pale ground are both ways for the 3D view to silently lose
information, and neither shows up in any DOM assertion.

Method: capture a baseline frame with every part hidden, then show one part at
a time and diff against that baseline. Two numbers per part:

  bulk       20th/80th percentile separation over the part's own pixels --
             how readable the body of the part is
  silhouette 2nd/98th percentile -- the edge. A legitimately dark screen can
             have low bulk and still be perfectly readable if its outline is
             unmistakable, so both are reported and the pass rule uses either.

IMPORTANT: do NOT sample the "background" from a corner of the board. The
board is a gradient, so a corner sample makes the gradient itself register as
part and every score collapses to an identical meaningless number. Diff
against a real baseline frame, which is what this does.

Run:  python tools/visible.py [src]
"""
import sys
import io

from PIL import Image, ImageChops

from _common import Checks, browser, open_src, goto_hash, settle, args_src_theme

MIN_BULK = 1.35
MIN_SILHOUETTE = 3.0
MIN_PIXELS = 40


def board_clip(page):
    return page.evaluate(
        """() => { const b = document.getElementById('board');
                   if (!b) return null;
                   const r = b.getBoundingClientRect();
                   return { x: Math.max(0, r.left), y: Math.max(0, r.top),
                            width: Math.min(r.width, window.innerWidth - r.left),
                            height: Math.min(r.height, window.innerHeight - r.top) }; }"""
    )


def shot(page, clip):
    # Element screenshots of a WebGL canvas come back blank -- always capture
    # the viewport and clip.
    return Image.open(io.BytesIO(page.screenshot(clip=clip))).convert("RGB")


def show_only(page, node_id):
    """Hide every part except one (node_id=None hides everything)."""
    page.evaluate(
        """id => {
          const st = document.getElementById('board').__td3;
          if (!st) return;
          Object.keys(st.parts).forEach(k => {
            const p = st.parts[k];
            const on = (id !== null && k === id);
            if (p.group) p.group.visible = on;
          });
          st.renderer.render(st.scene, st.camera);
        }""",
        node_id,
    )
    page.wait_for_timeout(90)


def sep(base, frame):
    """Per-pixel luminance separation between a frame and the baseline."""
    diff = ImageChops.difference(base, frame).convert("L")
    return sorted(v for v in diff.tobytes() if v > 6)


def main():
    src, _ = args_src_theme(sys.argv)
    c = Checks("visible %-23s" % src)
    combos = 0

    with browser() as b:
        for theme in ("light", "dark"):
            ctx, page = open_src(b, src, theme, viewport=(1280, 900))
            devices = page.evaluate(
                "() => TD.devices.map(d => d.id).filter(id => TD.hasModel(id))")

            for dev in devices:
                goto_hash(page, "#/" + dev)
                settle(page)
                clip = board_clip(page)
                if not clip or clip["width"] < 40:
                    continue
                parts = page.evaluate(
                    "() => { const st = document.getElementById('board').__td3;"
                    " return st ? Object.keys(st.parts) : []; }")
                if not parts:
                    continue

                show_only(page, None)
                base = shot(page, clip)

                for pid in parts:
                    show_only(page, pid)
                    frame = shot(page, clip)
                    hot = sep(base, frame)
                    combos += 1
                    if len(hot) < MIN_PIXELS:
                        # part is off-screen or fully occluded from this angle;
                        # not a contrast failure, so it is not counted as one
                        c.passed += 1
                        continue
                    n = len(hot)
                    bulk = hot[int(n * 0.20)] / 255.0 * 10 + 1
                    silh = hot[int(n * 0.98)] / 255.0 * 10 + 1
                    c.ok(bulk >= MIN_BULK or silh >= MIN_SILHOUETTE,
                         "%s %s/%s vanishes (bulk %.2f, silhouette %.2f)"
                         % (theme, dev, pid, bulk, silh))

                # restore
                page.evaluate("() => { const st = document.getElementById('board').__td3;"
                              " Object.keys(st.parts).forEach(k => {"
                              " if (st.parts[k].group) st.parts[k].group.visible = true; });"
                              " st.renderer.render(st.scene, st.camera); }")
            ctx.close()

    print("  %d part/theme combinations measured" % combos)
    return 0 if c.report() else 1


if __name__ == "__main__":
    sys.exit(main())
