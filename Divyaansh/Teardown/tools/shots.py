"""Screenshots for eyeballing. Not a gate -- a way to actually look at it.

Run:  python tools/shots.py [src] [outdir]
      python tools/shots.py index.html shots laptop     # one device only

Writes <outdir>/<theme>-<vp>-<view>.png for a spread of pages, both themes,
three viewports. Use it before claiming anything looks better.

---------------------------------------------------------------------------
The view list is GENERATED, not written out.

It used to be a hand-maintained list covering the laptop and the smartphone,
plus two schematic shots. It was written when those were the only flagships
and never grew, so the tractor, subsea cable, car, microwave, AI server and EV
had no visual check of any kind -- and one entry, "ev-schematic", was actively
wrong by the time anyone looked, because the EV had gained a 3D model.

A hand-maintained fixture list in a repo that adds a device every session is a
list that is wrong most of the time. Everything below is derived from what the
site actually contains.
---------------------------------------------------------------------------
"""
import sys
import pathlib

from _common import (ROOT, browser, open_src, goto_hash, settle,
                     device_ids, story_device_ids, devices_with)

VIEWPORTS = [(1440, 950, "1440"), (1024, 800, "1024"), (390, 844, "390")]

# Story sections shot for every flagship. Ids come from js/story.js.
STORY_SECTIONS = ["journey", "value", "power", "breaks", "geography", "history"]

TO_SCHEMATIC = ("() => { const b = document.getElementById('btn-mode');"
                " if (b && b.textContent.indexOf('Schematic') >= 0) b.click(); }")


def scroll_to(section):
    return ("() => { const s = document.getElementById('st-%s');"
            " if (s) s.scrollIntoView(); }" % section)


def build_views(page, only=None):
    """(name, hash, extra) for everything worth looking at.

    `only` restricts to one device id, which is what you want while iterating
    on a single model rather than regenerating two hundred images.
    """
    views = []
    if not only:
        views.append(("home", "#/home", None))

    flagships = story_device_ids(page)
    plain = [d for d in device_ids(page) if d not in flagships]
    with_sub = devices_with(page, "sub-model")

    targets = [only] if only else (flagships + plain)

    for dev in targets:
        views.append(("%s-3d" % dev, "#/" + dev, None))
        views.append(("%s-schematic" % dev, "#/" + dev, TO_SCHEMATIC))

        # sub-models, discovered rather than listed
        if dev in with_sub:
            keys = page.evaluate(
                "id => Object.keys(TD.models)"
                ".filter(k => k.startsWith(id + '/'))", dev)
            for k in keys:
                views.append(("%s-sub-%s" % (dev, k.split("/")[1]), "#/" + k, None))

        # story sections, only for devices that actually have a story
        if dev in flagships:
            for sec in STORY_SECTIONS:
                views.append(("%s-%s" % (dev, sec), "#/" + dev, scroll_to(sec)))

    if not only:
        views.append(("findings", "#/findings", None))
        views.append(("about", "#/about", None))
    return views


def main():
    src = sys.argv[1] if len(sys.argv) > 1 else "index.html"
    out = pathlib.Path(sys.argv[2]) if len(sys.argv) > 2 else ROOT / "tools" / "shots"
    only = sys.argv[3] if len(sys.argv) > 3 else None
    out.mkdir(parents=True, exist_ok=True)

    n = 0
    with browser() as b:
        for theme in ("light", "dark"):
            for w, h, vpname in VIEWPORTS:
                ctx, page = open_src(b, src, theme, viewport=(w, h))
                views = build_views(page, only)
                for name, hsh, extra in views:
                    goto_hash(page, hsh)
                    if extra:
                        page.evaluate(extra)
                        page.wait_for_timeout(400)
                    settle(page, 900)
                    page.screenshot(path=str(out / ("%s-%s-%s.png" % (theme, vpname, name))))
                    n += 1
                ctx.close()
    print("wrote %d screenshots to %s" % (n, out))


if __name__ == "__main__":
    main()
