"""WCAG AA contrast audit over every visible piece of text, in both themes.

Gate 1 in the phase plan. This walks the real DOM rather than the token list,
because a token that passes in isolation still fails when it lands on a
translucent card over a gradient -- which is exactly how the pre-existing
light-mode failures went unnoticed for so long.

Background is composited through every ancestor until an opaque layer is
found, so a colour behind 8% alpha is measured as what the eye actually sees.

Run:  python tools/contrast.py [src]
"""
import sys

from _common import (Checks, browser, open_src, goto_hash, args_src_theme,
                     story_device_ids, devices_with)

# Static pages, plus every flagship discovered at runtime -- see pages_for().
STATIC_PAGES = ["#/home", "#/findings", "#/about", "#/company/TSMC"]


def pages_for(page):
    """Every page worth walking, derived from what the site actually contains.

    This used to be a literal list naming the laptop and the smartphone. It
    was written when those were the only two flagships and never revisited, so
    six later flagships -- tractor, subsea cable, car, microwave, AI server,
    EV -- have never had their story sections contrast-checked at all. The
    suite reported 1,000+ passing pairs the whole time, which is exactly why
    nobody looked.

    Flagships carry the story renderer and therefore nearly every chart
    component on the site, so all of them are walked. One non-flagship device
    is included as well, because the plain device view has its own layout that
    no flagship exercises.
    """
    flagships = ["#/" + d for d in story_device_ids(page)]
    plain = devices_with(page, "no-story")
    return STATIC_PAGES + flagships + (["#/" + plain[0]] if plain else [])

AA_BODY = 4.5
AA_LARGE = 3.0

PROBE = r"""
() => {
  const lum = (r, g, b) => {
    const f = v => { v /= 255; return v <= 0.03928 ? v/12.92 : Math.pow((v+0.055)/1.055, 2.4); };
    return 0.2126*f(r) + 0.7152*f(g) + 0.0722*f(b);
  };
  const parse = s => {
    const m = /rgba?\(([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:[,/\s]+([\d.]+))?\)/.exec(s || '');
    return m ? [+m[1], +m[2], +m[3], m[4] === undefined ? 1 : +m[4]] : null;
  };
  const over = (fg, bg) => {  // fg composited onto opaque bg
    const a = fg[3];
    return [fg[0]*a + bg[0]*(1-a), fg[1]*a + bg[1]*(1-a), fg[2]*a + bg[2]*(1-a), 1];
  };

  // Walk up the ancestor chain compositing every translucent background until
  // an opaque one is reached. Sampling only the element's own background is
  // how you convince yourself a transparent chip is high contrast.
  const bgOf = el => {
    const stack = [];
    let cur = el;
    while (cur && cur !== document.documentElement) {
      const c = parse(getComputedStyle(cur).backgroundColor);
      if (c && c[3] > 0) { stack.push(c); if (c[3] >= 0.999) break; }
      cur = cur.parentElement;
    }
    const rootBg = parse(getComputedStyle(document.documentElement).backgroundColor)
                || parse(getComputedStyle(document.body).backgroundColor) || [255,255,255,1];
    let acc = rootBg[3] >= 0.999 ? rootBg : [255,255,255,1];
    for (let i = stack.length - 1; i >= 0; i--) acc = over(stack[i], acc);
    return acc;
  };

  const out = [];
  const seen = new Set();
  document.querySelectorAll('body *').forEach(el => {
    // only elements with their own directly-rendered text
    let txt = '';
    for (const n of el.childNodes) if (n.nodeType === 3) txt += n.textContent;
    txt = txt.trim();
    if (!txt) return;

    const r = el.getBoundingClientRect();
    if (r.width < 1 || r.height < 1) return;
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.display === 'none' || +cs.opacity === 0) return;
    if (el.closest('[hidden]')) return;

    const fg = parse(cs.color);
    if (!fg) return;
    const bg = bgOf(el);
    const eff = fg[3] < 1 ? over(fg, bg) : fg;

    const L1 = lum(eff[0], eff[1], eff[2]), L2 = lum(bg[0], bg[1], bg[2]);
    const ratio = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);

    const size = parseFloat(cs.fontSize);
    const weight = parseInt(cs.fontWeight, 10) || 400;
    const large = size >= 24 || (size >= 18.66 && weight >= 700);

    const key = cs.color + '|' + bg.join(',') + '|' + (large ? 'L' : 'B') + '|'
              + (el.className || el.tagName);
    if (seen.has(key)) return;
    seen.add(key);

    out.push({ sel: (el.tagName + '.' + (typeof el.className === 'string' ? el.className : ''))
                      .slice(0, 46),
               text: txt.slice(0, 28), ratio: Math.round(ratio * 100) / 100,
               large, size });
  });
  return out;
}
"""


def audit(page, c, theme, where):
    rows = page.evaluate(PROBE)
    for r in rows:
        need = AA_LARGE if r["large"] else AA_BODY
        c.ok(r["ratio"] >= need,
             "%s %s  %s %r  %.2f:1 < %.1f" % (theme, where, r["sel"], r["text"],
                                              r["ratio"], need))
    return len(rows)


def main():
    src, _ = args_src_theme(sys.argv)
    c = Checks("contrast %-22s" % src)
    pairs = 0

    with browser() as b:
        for theme in ("light", "dark"):
            ctx, page = open_src(b, src, theme, viewport=(1440, 950))
            pages = pages_for(page)
            for h in pages:
                goto_hash(page, h)
                pairs += audit(page, c, theme, h)

                # Open the inspector too -- half the site's text lives there.
                # Attempted on every device page rather than on two named ones:
                # if there is no selectable part the click finds nothing and
                # the extra audit is a no-op, which is the correct behaviour.
                if h not in STATIC_PAGES:
                    try:
                        page.evaluate("() => { const g = document.querySelector('#board g.part,"
                                      " #board .ovbar'); if (g) g.dispatchEvent("
                                      "new MouseEvent('click', {bubbles: true})); }")
                        page.wait_for_timeout(400)
                        pairs += audit(page, c, theme, h + " (inspector)")
                    except Exception:
                        pass
            ctx.close()
    print("  walked %d pages per theme" % len(pages))

    print("  %d distinct text/background pairs measured" % pairs)
    return 0 if c.report() else 1


if __name__ == "__main__":
    sys.exit(main())
