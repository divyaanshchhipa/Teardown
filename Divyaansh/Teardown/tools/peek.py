"""Screenshot one element by selector. For looking at a single chart closely.

Run:  python tools/peek.py "<css selector>" out.png [theme] [src]
"""
import sys

from _common import browser, open_src, goto_hash, settle


def main():
    sel = sys.argv[1]
    out = sys.argv[2]
    theme = sys.argv[3] if len(sys.argv) > 3 else "light"
    src = sys.argv[4] if len(sys.argv) > 4 else "index.html"

    with browser() as b:
        ctx, page = open_src(b, src, theme, viewport=(1440, 1000))
        goto_hash(page, "#/laptop")
        settle(page, 900)
        el = page.query_selector(sel)
        if not el:
            print("no match for " + sel)
            return 1
        el.scroll_into_view_if_needed()
        page.wait_for_timeout(350)
        box = el.bounding_box()
        # clip against the viewport: element screenshots of canvas-bearing
        # regions come back blank, and a tall element exceeds the viewport
        page.screenshot(path=out, clip={
            "x": max(0, box["x"] - 6), "y": max(0, box["y"] - 6),
            "width": min(box["width"] + 12, 1440),
            "height": min(box["height"] + 12, 1000 - max(0, box["y"] - 6)),
        })
        print("wrote " + out)
        ctx.close()
    return 0


if __name__ == "__main__":
    sys.exit(main())
