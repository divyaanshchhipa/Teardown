"""End-to-end interaction suite: does the thing actually work when clicked.

The broad regression net. If a change outside its own area breaks something,
this is what catches it. Covers three viewports, both renderers, the story,
the inspector, search, browse and the theme.

Run:  python tools/interact.py [src] [theme]

`theme` forces light or dark. When forced, the "theme persists across reload"
assertion is skipped -- the forcing script rewrites localStorage on the very
reload that assertion tests, so it would be checking itself.
"""
import sys

from _common import Checks, browser, open_src, goto_hash, settle, tap, args_src_theme

DESKTOP, LAPTOP_VP, MOBILE = (1440, 950), (1024, 800), (390, 844)


def board_has_pixels(page):
    """Did the renderer actually draw anything?

    NOT via readPixels: without preserveDrawingBuffer the buffer is cleared as
    soon as the frame is composited, so reading it back from Playwright always
    returns the clear colour and every 3D assertion silently passes as zero.
    Instead this asks three.js what it just rasterised -- renderer.info counts
    triangles from the last real draw call -- and falls back to counting SVG
    groups for the schematic renderer.
    """
    return page.evaluate(
        """() => {
          const host = document.getElementById('board');
          if (!host) return 0;
          const st = host.__td3;
          if (st && st.renderer) {
            const tris = st.renderer.info.render.triangles;
            return tris > 0 ? tris : -(st.pickables ? st.pickables.length : 0);
          }
          return host.querySelectorAll('svg g.part').length;
        }"""
    )


def camera(page):
    return page.evaluate(
        """() => { const h = document.getElementById('board');
                   const c = h && h.__td3 && h.__td3.camera;
                   return c ? [+c.position.x.toFixed(3), +c.position.y.toFixed(3),
                               +c.position.z.toFixed(3)] : null; }"""
    )


def run(c, page, src, theme):
    dev_ids = page.evaluate("() => TD.devices.map(d => d.id)")
    c.ok(len(dev_ids) >= 12, "all devices registered (%d)" % len(dev_ids))

    # ---------- home ----------
    goto_hash(page, "#/home")
    c.ok(page.query_selector("#app") is not None, "home renders")
    c.ok(len(page.query_selector_all("#app a, #app button, #app [data-go]")) > 5,
         "home offers navigation")

    # ---------- browse menu ----------
    page.click("#browse-btn")
    page.wait_for_timeout(220)
    c.eq(page.get_attribute("#browse-btn", "aria-expanded"), "true", "browse opens")
    c.ok(len(page.query_selector_all("#browse [data-go]")) >= 12,
         "browse lists every device")
    page.click("#browse-btn")
    page.wait_for_timeout(180)
    c.eq(page.get_attribute("#browse-btn", "aria-expanded"), "false", "browse closes")

    # ---------- search ----------
    page.fill("#q", "TSMC")
    page.wait_for_timeout(320)
    c.ok(len(page.query_selector_all("#results [role='option'], #results button, #results a")) > 0,
         "search finds a company")
    page.fill("#q", "battery")
    page.wait_for_timeout(320)
    c.ok(len(page.query_selector_all("#results button, #results a, #results [role='option']")) > 0,
         "search finds a part")
    page.fill("#q", "")
    page.keyboard.press("Escape")

    # ---------- every device renders ----------
    for d in dev_ids:
        goto_hash(page, "#/" + d)
        c.ok(page.query_selector("#board") is not None, "%s: board exists" % d)
        c.ok(board_has_pixels(page) > 0, "%s: board draws something" % d)
        c.ok(page.query_selector(".stagehead h1") is not None, "%s: has a title" % d)

    # ---------- the flagship ----------
    goto_hash(page, "#/laptop")
    settle(page)
    c.ok(board_has_pixels(page) > 0, "laptop: 3D board draws")

    story_secs = page.evaluate(
        "() => Array.from(document.querySelectorAll('#story .st-sec')).map(s => s.id)")
    c.ok(len(story_secs) >= 6, "laptop story renders sections (%d)" % len(story_secs))
    for want in ("st-overview", "st-journey", "st-value", "st-power",
                 "st-geography", "st-method"):
        c.ok(want in story_secs, "story has %s" % want)

    c.ok(len(page.query_selector_all("#story .st-stage")) >= 8,
         "story renders the build stages")
    c.ok(len(page.query_selector_all("#story .st-nav-btn")) >= 6,
         "story nav has a button per section")
    c.ok(len(page.query_selector_all("#story .src")) >= 5,
         "story charts carry source footers")

    # story nav actually scrolls
    before = page.evaluate("() => window.scrollY")
    tap(page, "#story .st-nav-btn", index=3)
    page.wait_for_timeout(500)
    c.ok(page.evaluate("() => window.scrollY") != before, "story nav scrolls the page")

    # a story chip opens the inspector on that node
    tap(page, "#story .st-chip")
    page.wait_for_timeout(450)
    c.ok(page.evaluate("() => !!(document.querySelector('#inspector') &&"
                       " document.querySelector('#inspector').textContent.trim())"),
         "story chip opens the inspector")

    # ---------- the disclaimer / story width agree ----------
    widths = page.evaluate(
        """() => {
          const d = document.querySelector('.disclaimer');
          const s = document.querySelector('.story');
          return { d: d ? Math.round(d.getBoundingClientRect().width) : null,
                   s: s ? Math.round(s.getBoundingClientRect().width) : null,
                   hasDisc: !!d };
        }"""
    )
    if widths["hasDisc"] and widths["s"]:
        c.ok(abs(widths["d"] - widths["s"]) <= 4,
             "disclaimer and story share a measure (%s vs %s)" % (widths["d"], widths["s"]))

    # ---------- 3D controls ----------
    goto_hash(page, "#/laptop")
    settle(page)
    cam0 = camera(page)
    c.ok(cam0 is not None, "3D camera is reachable for testing")

    for ctl in ("#btn-explode", "#btn-reset", "#btn-isolate", "#btn-xray"):
        c.ok(page.query_selector(ctl) is not None, "3D toolbar has %s" % ctl)

    page.click("#btn-explode")
    page.wait_for_timeout(500)
    c.ok(page.evaluate("() => +document.getElementById('ex').value") > 50,
         "Dismantle drives the separation slider")
    page.click("#btn-explode")
    page.wait_for_timeout(400)

    page.click("#btn-isolate")
    page.wait_for_timeout(300)
    c.eq(page.get_attribute("#btn-isolate", "aria-pressed"), "true", "Isolate toggles on")
    page.click("#btn-isolate")
    page.wait_for_timeout(300)
    c.eq(page.get_attribute("#btn-isolate", "aria-pressed"), "false", "Isolate toggles off")

    page.click("#btn-xray")
    page.wait_for_timeout(300)
    c.eq(page.get_attribute("#btn-xray", "aria-pressed"), "true", "X-ray toggles on")
    page.click("#btn-xray")
    page.wait_for_timeout(300)

    # orbit changes the camera; reset restores it
    box = page.query_selector("#board").bounding_box()
    page.mouse.move(box["x"] + box["width"] / 2, box["y"] + box["height"] / 2)
    page.mouse.down()
    page.mouse.move(box["x"] + box["width"] / 2 + 120, box["y"] + box["height"] / 2 + 40,
                    steps=8)
    page.mouse.up()
    page.wait_for_timeout(400)
    c.ok(camera(page) != cam0, "dragging orbits the camera")
    page.click("#btn-reset")
    settle(page)
    c.ok(board_has_pixels(page) > 0, "board still draws after reset")

    # part index
    c.ok(len(page.query_selector_all("#partindex button")) > 3,
         "part index lists the parts")
    cam_before = camera(page)
    tap(page, "#partindex button", index=2)
    page.wait_for_timeout(500)
    c.ok(page.evaluate("() => !!document.querySelector('#inspector').textContent.trim()"),
         "part index selects a part")
    c.eq(camera(page), cam_before, "selecting a part preserves the camera")

    close = page.query_selector("#ins-close")
    if close and not close.get_attribute("hidden"):
        page.click("#ins-close")
        page.wait_for_timeout(400)
        c.eq(camera(page), cam_before, "closing the inspector preserves the camera")

    # ---------- source drawer ----------
    tap(page, "#partindex button", index=1)
    page.wait_for_timeout(450)
    dr = page.query_selector("#inspector details.srcdrawer")
    c.ok(dr is not None, "inspector has a source drawer")
    if dr:
        c.ok(dr.get_attribute("open") is None, "source drawer starts closed")
        page.evaluate("() => document.querySelector('#inspector details.srcdrawer')"
                      ".setAttribute('open','')")
        page.wait_for_timeout(200)
        c.ok(page.evaluate("() => document.querySelector('.srcdrawer-body')"
                           ".getBoundingClientRect().height > 4"),
             "source drawer opens to real content")

    # ---------- renderer toggle ----------
    goto_hash(page, "#/laptop")
    settle(page)
    c.ok(page.query_selector("#board canvas") is not None, "laptop starts in 3D")
    page.click("#btn-mode")
    page.wait_for_timeout(600)
    c.ok(page.query_selector("#board svg") is not None, "toggles to the schematic")
    c.ok(board_has_pixels(page) > 0, "schematic draws parts")

    # In schematic mode the 3D-only affordances must be gone -- they did
    # nothing there, which is worse than absent.
    for gone in ("#btn-isolate", "#btn-xray", "#btn-reset", "#lidr"):
        c.ok(page.query_selector(gone) is None,
             "schematic mode hides %s" % gone)
    c.ok(page.query_selector("#btn-explode") is None,
         "schematic mode hides Dismantle")
    c.ok(page.query_selector("#ex") is None,
         "schematic mode hides Separation")

    page.click("#btn-mode")
    settle(page)
    c.ok(page.query_selector("#board canvas") is not None, "toggles back to 3D")
    c.ok(page.query_selector("#btn-explode") is not None, "Dismantle returns in 3D")

    # ---------- schematic-only device ----------
    # Found at runtime rather than hardcoded. This assertion used to name the
    # EV, and silently became a false pass the moment that device got a 3D
    # model -- the check was still running, against a device that no longer
    # had the property being tested. Ask the page which devices actually lack
    # a model instead. If every device has one, the fallback path still works
    # (schematic.py exercises it directly) but there is nothing to assert here.
    modelless = page.evaluate(
        "() => TD.devices.filter(d => !TD.hasModel(d.id)).map(d => d.id)"
    )
    if modelless:
        goto_hash(page, "#/" + modelless[0])
        c.ok(page.query_selector("#board svg") is not None,
             "a model-less device falls back to SVG (%s)" % modelless[0])
        c.ok(page.query_selector("#btn-mode") is None,
             "no renderer toggle without a model (%s)" % modelless[0])
    else:
        print("  note: every device now has a 3D model, fallback assertions skipped")

    # ---------- findings / method / company ----------
    for h, sel in (("#/findings", ".page"), ("#/about", ".page"),
                   ("#/company/TSMC", "#app")):
        goto_hash(page, h)
        c.ok(page.query_selector(sel) is not None, "%s renders" % h)
        c.ok(page.evaluate("() => document.querySelector('#app').textContent.length") > 200,
             "%s has substantive content" % h)

    # ---------- source links ----------
    # Provenance is the site's main claim on being trustworthy, so a citation
    # that renders as inert text is a real regression. Only one of the four
    # render sites used to link at all.
    goto_hash(page, "#/sources")
    settle(page)
    src = page.evaluate("""() => {
      const items = document.querySelectorAll('.srcpg-item');
      const links = Array.from(document.querySelectorAll('.srcpg-item a.srclink'));
      return {
        items: items.length,
        links: links.length,
        nolink: document.querySelectorAll('.srcpg-item .srclink.nolink').length,
        badHref: links.filter(a => !/^https?:\\/\\//.test(a.getAttribute('href') || '')).length,
        noTarget: links.filter(a => a.getAttribute('target') !== '_blank').length,
        unsafeRel: links.filter(a => !(a.getAttribute('rel') || '').includes('noopener')).length,
        untitled: document.querySelectorAll('.srcpg-item .srclink.nolink:not([title])').length
      };
    }""")
    c.ok(src["items"] >= 50, "sources page lists the registry (%d publishers)" % src["items"])
    c.ok(src["links"] >= 50, "sources page links most publishers (%d)" % src["links"])
    c.eq(src["badHref"], 0, "every source link is an absolute http(s) URL")
    c.eq(src["noTarget"], 0, "source links open in a new tab")
    c.eq(src["unsafeRel"], 0, "source links carry rel=noopener")
    c.eq(src["untitled"], 0, "an unlinkable source explains itself on hover")
    c.ok(src["nolink"] > 0, "unlinkable sources are marked rather than dropped")

    goto_hash(page, "#/laptop")
    settle(page)
    c.ok(page.evaluate(
        "() => document.querySelectorAll('.src-row a.srclink').length") > 5,
        "chart source footers link their publishers")
    c.ok(page.evaluate(
        "() => document.querySelectorAll('#st-method a.srclink').length") > 5,
        "the story method section links its publishers")

    goto_hash(page, "#/laptop/cpu")
    settle(page)
    page.evaluate("() => { const d = document.querySelector('#inspector .srcdrawer');"
                  " if (d) d.open = true; }")
    page.wait_for_timeout(300)
    c.ok(page.evaluate(
        "() => document.querySelectorAll('#inspector .srclist .srclink').length") > 0,
        "the inspector source drawer links its publishers")

    # ---------- theme ----------
    goto_hash(page, "#/laptop")
    settle(page)
    t0 = page.evaluate("() => TD.theme()")
    cam_t = camera(page)
    page.click("#theme-toggle")
    page.wait_for_timeout(700)
    t1 = page.evaluate("() => TD.theme()")
    c.ok(t0 != t1, "theme toggle switches the theme")
    c.eq(page.evaluate("() => document.documentElement.getAttribute('data-theme')"), t1,
         "data-theme follows TD.theme()")
    c.eq(camera(page), cam_t, "theme change preserves the 3D camera")
    c.ok(board_has_pixels(page) > 0, "board still draws after a theme change")

    if theme is None:
        page.reload()
        page.wait_for_function("window.TD && TD.deviceById")
        c.eq(page.evaluate("() => TD.theme()"), t1, "theme persists across a reload")
    else:
        c.ok(True, "theme persistence skipped (forced theme rewrites storage)")

    page.click("#theme-toggle")
    page.wait_for_timeout(400)


def run_mobile(c, page):
    goto_hash(page, "#/laptop")
    settle(page)
    c.ok(board_has_pixels(page) > 0, "mobile: board draws")
    tap(page, "#partindex button", index=1)
    page.wait_for_timeout(500)
    c.ok(page.evaluate("() => !!document.querySelector('#inspector').textContent.trim()"),
         "mobile: a part can be selected")
    # the toolbar must stay reachable behind the bottom sheet
    c.ok(page.evaluate(
        """() => {
          const b = document.getElementById('btn-explode') ||
                    document.getElementById('btn-mode');
          if (!b) return false;
          b.scrollIntoView({block:'center'});
          const r = b.getBoundingClientRect();
          const hit = document.elementFromPoint(r.left + r.width/2, r.top + r.height/2);
          return !!(hit && (hit === b || b.contains(hit)));
        }"""), "mobile: the toolbar is not stranded under the sheet")
    c.ok(page.evaluate(
        "() => document.documentElement.scrollWidth <= window.innerWidth + 2"),
        "mobile: no horizontal overflow")


def main():
    src, theme = args_src_theme(sys.argv)
    c = Checks("%-6s %-20s" % (theme or "auto", src))
    errors = []

    with browser() as b:
        for vp, label in ((DESKTOP, "1440"), (LAPTOP_VP, "1024")):
            ctx, page = open_src(b, src, theme, viewport=vp,
                                 on_console=lambda m: (
                                     errors.append(m.text) if m.type == "error" else None))
            run(c, page, src, theme)
            ctx.close()

        ctx, page = open_src(b, src, theme, viewport=MOBILE,
                             on_console=lambda m: (
                                 errors.append(m.text) if m.type == "error" else None))
        run_mobile(c, page)
        ctx.close()

    real = [e for e in errors if "WebGL" not in e and "context" not in e.lower()]
    c.ok(not real, "console is clean (%s)" % "; ".join(real[:3]))

    return 0 if c.report() else 1


if __name__ == "__main__":
    sys.exit(main())
