"""Shared plumbing for the Teardown verification scripts.

Everything here exists because of something that actually went wrong once.
Read the comments before "simplifying" any of it.

Usage from a sibling script:

    from _common import ROOT, browser, open_src, tap, args_src_theme
"""
import pathlib
import sys
import contextlib

# Labels quote real UI strings, which include arrows and typographic dashes.
# The Windows console defaults to cp1252 and throws on them.
for _s in (sys.stdout, sys.stderr):
    try:
        _s.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

ROOT = pathlib.Path(__file__).resolve().parent.parent

# The only two builds worth testing: the multi-file source tree and the
# single-file artifact. The embed build has no <head>, so it can only be
# tested inside a host shell -- see embedhost().
SOURCES = ["index.html", "dist/teardown.html"]

# SwiftShader gives us a real (software) WebGL context in headless Chromium.
# Without both flags three.js falls back and every 3D assertion goes vacuous.
GL_ARGS = ["--use-gl=swiftshader", "--enable-unsafe-swiftshader"]


def uri(src):
    """file:// URI for a repo-relative path. Everything is tested over
    file:// because that is how the project is actually opened."""
    return (ROOT / src).as_uri()


@contextlib.contextmanager
def browser(headless=True):
    from playwright.sync_api import sync_playwright
    with sync_playwright() as p:
        b = p.chromium.launch(headless=headless, args=GL_ARGS)
        try:
            yield b
        finally:
            b.close()


def open_src(browser_, src, theme=None, viewport=(1440, 900), on_console=None):
    """New context + page pointed at `src`.

    `theme` forces light or dark by writing localStorage before first paint.
    NOTE: doing so invalidates the "theme persists across reload" assertion,
    because it rewrites the key on the very reload being tested. Callers must
    skip that one assertion when theme is not None -- see interact.py.
    """
    ctx = browser_.new_context(viewport={"width": viewport[0], "height": viewport[1]})
    if theme:
        ctx.add_init_script("try{localStorage.setItem('td-theme','%s')}catch(e){}" % theme)
    page = ctx.new_page()
    if on_console:
        page.on("console", on_console)
    page.goto(uri(src))
    page.wait_for_function("window.TD && TD.deviceById && TD.deviceById.laptop")
    return ctx, page


"""---------------------------------------------------------------------
Device discovery.

Ask the page what exists rather than hardcoding ids. This is not tidiness:
hardcoded fixtures in this harness have produced *silent false passes* twice,
which is the worst failure mode a test can have because the gate stays green
while checking nothing.

  * storycheck.py asserted flow ids against `l.nodes`, but the data uses
    `l.steps` -- so the loop body never ran and the assertion was vacuous.
  * interact.py used `#/ev` as its "device with no 3D model" fixture. The
    moment the EV got a model, the assertion was still executing, against a
    device that no longer had the property being tested.

Both were invisible from the pass count. The rule that prevents a third is:
a gate may not name a device unless it also verifies that the device still
has the property the assertion depends on. `pick_device()` does exactly that
-- it selects by property and fails loudly when nothing qualifies.
---------------------------------------------------------------------"""


def device_ids(page):
    """Every registered device id, in load order."""
    return page.evaluate("() => TD.devices.map(d => d.id)")


def story_device_ids(page):
    """Devices carrying a `story` block -- the flagships."""
    return page.evaluate("() => TD.devices.filter(d => d.story).map(d => d.id)")


# Named properties a gate can select a fixture by. Each is a JS predicate over
# a device. Add to this rather than writing a literal id into a gate.
DEVICE_PROPS = {
    "story":      "d => !!d.story",
    "no-story":   "d => !d.story",
    "model":      "d => TD.hasModel(d.id)",
    "no-model":   "d => !TD.hasModel(d.id)",
    "sub-model":  "d => Object.keys(TD.models).some(k => k.split('/')[0] === d.id && k.includes('/'))",
    "meta":       "d => d.nodes.some(n => n.kind === 'meta')",
    "deals":      "d => d.nodes.some(n => (n.deals || []).length)",
}


def devices_with(page, prop):
    """Ids of every device satisfying a named property from DEVICE_PROPS."""
    if prop not in DEVICE_PROPS:
        raise AssertionError("unknown device property %r; add it to DEVICE_PROPS" % prop)
    return page.evaluate("() => TD.devices.filter(%s).map(d => d.id)" % DEVICE_PROPS[prop])


def pick_device(page, prop, checks=None):
    """One device id that genuinely has `prop` right now, or None.

    Use this instead of writing an id into a gate. If `checks` is given, a
    missing fixture is recorded as a real failure rather than passing quietly
    -- because "no device has this property any more" usually means the site
    changed under a test that is still claiming to check it.
    """
    ids = devices_with(page, prop)
    if checks is not None:
        checks.ok(bool(ids), "a device exists with property %r to test against" % prop)
    return ids[0] if ids else None


def goto_hash(page, h):
    """Route without page.goto(). Repeated goto() in one tab exhausts WebGL
    contexts and produces alarming-but-meaningless console warnings; hash
    navigation is what a real user does anyway."""
    page.evaluate("h => { location.hash = h; }", h)
    page.wait_for_timeout(260)
    settle(page)


def settle(page, ms=1600):
    """Wait out the bounded re-render window in three-view.js. The renderer
    re-draws for up to 1500ms after layout because of a canvas-blanking issue
    at certain widths that was never root-caused, only fenced."""
    page.wait_for_timeout(ms)


def tap(page, selector, index=0):
    """Click that survives the sticky topbar and the mobile bottom sheet.

    page.click() aims at the element's own centre, which is regularly covered
    by position:fixed chrome. This scrolls the target into the clear band and
    then clicks the point that is actually on top there.
    """
    handle = page.query_selector_all(selector)
    if not handle:
        raise AssertionError("tap: no element matches %s" % selector)
    el = handle[index]
    el.scroll_into_view_if_needed()
    page.wait_for_timeout(80)
    ok = page.evaluate(
        """el => {
            const r = el.getBoundingClientRect();
            const topGuard = 74, botGuard = window.innerHeight - 8;
            // sample a few points inside the element, prefer ones not covered
            for (const fy of [0.5, 0.25, 0.75]) {
              for (const fx of [0.5, 0.2, 0.8]) {
                const x = r.left + r.width * fx, y = r.top + r.height * fy;
                if (y < topGuard || y > botGuard) continue;
                const hit = document.elementFromPoint(x, y);
                if (hit && (hit === el || el.contains(hit))) return {x, y};
              }
            }
            return null;
        }""",
        el,
    )
    if not ok:
        # last resort: scroll so the element sits mid-viewport, then retry once
        page.evaluate(
            "el => window.scrollBy(0, el.getBoundingClientRect().top - window.innerHeight/2)", el
        )
        page.wait_for_timeout(120)
        ok = page.evaluate(
            """el => {
                const r = el.getBoundingClientRect();
                const x = r.left + r.width/2, y = r.top + r.height/2;
                const hit = document.elementFromPoint(x, y);
                return (hit && (hit === el || el.contains(hit))) ? {x, y} : null;
            }""",
            el,
        )
    if not ok:
        raise AssertionError("tap: %s[%d] is covered and could not be reached" % (selector, index))
    page.mouse.click(ok["x"], ok["y"])
    page.wait_for_timeout(150)


def full_shot(page, path, clip=None):
    """Screenshot helper. Element screenshots of a WebGL canvas come back
    BLANK -- always capture the page and crop."""
    page.screenshot(path=str(path), full_page=False, clip=clip)


class Checks(object):
    """Tiny assertion tally. Keeps going after a failure so one run reports
    every problem instead of the first one."""

    def __init__(self, label=""):
        self.label = label
        self.passed = 0
        self.failures = []

    def ok(self, cond, msg):
        if cond:
            self.passed += 1
        else:
            self.failures.append(msg)
        return bool(cond)

    def eq(self, got, want, msg):
        return self.ok(got == want, "%s (got %r, want %r)" % (msg, got, want))

    @property
    def total(self):
        return self.passed + len(self.failures)

    def report(self, prefix=""):
        head = "%s%s %d/%d passed" % (prefix, self.label, self.passed, self.total)
        print(head)
        for f in self.failures:
            print("    FAIL " + f)
        return not self.failures


def args_src_theme(argv):
    """`script.py [src] [theme]` -- both optional."""
    src = argv[1] if len(argv) > 1 else "index.html"
    theme = argv[2] if len(argv) > 2 else None
    if theme not in (None, "light", "dark"):
        print("theme must be light or dark")
        sys.exit(2)
    return src, theme
