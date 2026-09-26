"""Schematic text fit: no label may overrun its tile or collide with another.

Gate 3 in the phase plan, and the reason the schematic fix is a fix rather
than a nudge. It measures real rendered geometry with getBBox() -- the same
thing the renderer itself now uses -- across every device and every openable
sub-board, so a regression on any of the twelve devices shows up here.

Checks per tile:
  * every <text> box sits inside the tile rect, with a small tolerance
  * no two text boxes inside one tile overlap
  * no text box overlaps the tile's share bar
  * no tile is pushed outside the SVG viewBox by the explode slider
  * frame captions are not painted over by a tile

Run:  python tools/schematic.py [src] [theme]
"""
import sys

from _common import Checks, browser, open_src, goto_hash, args_src_theme

# A couple of px of slack: SVG text metrics include font hinting overhang and
# we care about visible overrun, not sub-pixel purity.
TOL = 1.5


PROBE = r"""
(explode) => {
  // Drive the separation slider first so the assertion covers the exploded
  // state too -- bug 8 was tiles leaving the viewBox only when exploded.
  const ex = document.getElementById('ex');
  if (ex) {
    ex.value = String(Math.round(explode * 100));
    ex.dispatchEvent(new Event('input', { bubbles: true }));
  }
  const svg = document.querySelector('#board svg');
  if (!svg) return null;

  const vb = svg.viewBox.baseVal;
  const out = { viewBox: { w: vb.width, h: vb.height }, tiles: [], frames: [] };

  // Frame captions. Overlap alone is not a defect -- a caption drawn on an
  // opaque plate AFTER the tiles is perfectly legible sitting over one. What
  // matters is paint order, so record it: a caption painted before a tile it
  // overlaps is the failure.
  const kids = Array.prototype.slice.call(svg.children);
  let lastTile = -1;
  kids.forEach((n, i) => { if (n.classList && n.classList.contains('part')) lastTile = i; });
  svg.querySelectorAll('g.frame text').forEach(t => {
    const b = t.getBBox();
    const order = kids.indexOf(t.closest('g.frame'));
    out.frames.push({ label: t.textContent, box: [b.x, b.y, b.width, b.height],
                      onTop: order > lastTile });
  });

  svg.querySelectorAll('g.part').forEach(g => {
    const rect = g.querySelector('rect.tile');
    if (!rect) return;
    const r = { x: +rect.getAttribute('x'), y: +rect.getAttribute('y'),
                w: +rect.getAttribute('width'), h: +rect.getAttribute('height') };

    // the explode transform moves the whole group; apply it to compare against
    // the viewBox, but tile-relative checks are already in the same space
    let dx = 0, dy = 0;
    const tr = g.getAttribute('transform') || '';
    const m = /translate\(([-\d.]+),([-\d.]+)\)/.exec(tr);
    if (m) { dx = parseFloat(m[1]); dy = parseFloat(m[2]); }

    const texts = [];
    g.querySelectorAll('text').forEach(t => {
      const b = t.getBBox();
      texts.push({ s: t.textContent, cls: t.getAttribute('class') || '',
                   box: [b.x, b.y, b.width, b.height],
                   anchor: t.getAttribute('text-anchor') || 'start' });
    });

    // the mini stacked share bar, if this tile drew one: the first plain rect
    // after the tile that is exactly 7px tall
    let bar = null;
    g.querySelectorAll('rect').forEach(rc => {
      if (rc === rect || bar) return;
      const h = +rc.getAttribute('height');
      if (Math.abs(h - 7) < 0.01) {
        bar = [+rc.getAttribute('x'), +rc.getAttribute('y'), +rc.getAttribute('width'), h];
      }
    });

    out.tiles.push({ id: g.getAttribute('data-id'), rect: r, shift: [dx, dy],
                     texts, bar });
  });
  return out;
}
"""


def overlaps(a, b, tol=0.0):
    ax, ay, aw, ah = a
    bx, by, bw, bh = b
    return (ax + aw - tol > bx and bx + bw - tol > ax
            and ay + ah - tol > by and by + bh - tol > ay)


def check_board(c, data, where):
    if data is None:
        return
    vb = data["viewBox"]
    for t in data["tiles"]:
        r, tid = t["rect"], t["id"]
        dx, dy = t["shift"]

        # 1. tile stays inside the viewBox even when exploded
        c.ok(r["x"] + dx >= -TOL and r["y"] + dy >= -TOL
             and r["x"] + dx + r["w"] <= vb["w"] + TOL
             and r["y"] + dy + r["h"] <= vb["h"] + TOL,
             "%s/%s tile stays inside the viewBox when exploded" % (where, tid))

        boxes = []
        for tx in t["texts"]:
            bx, by, bw, bh = tx["box"]
            label = "%s/%s %r" % (where, tid, tx["s"][:26])

            # 2. text stays inside its own tile
            c.ok(bx >= r["x"] - TOL and bx + bw <= r["x"] + r["w"] + TOL
                 and by >= r["y"] - TOL and by + bh <= r["y"] + r["h"] + TOL,
                 "%s stays inside its tile" % label)

            # 3. nothing truncates to a bare ellipsis or an empty string
            c.ok(tx["s"].strip() not in ("", "...", "…", "..", "-"),
                 "%s is not an empty truncation" % label)

            boxes.append((tx["box"], label, tx["cls"]))

        # 4. no two labels in one tile collide.
        #    Successive lines of one wrapped title are excluded: they stack by
        #    design at a line height slightly tighter than the em box, so their
        #    bounding boxes touch on purpose.
        for i in range(len(boxes)):
            for j in range(i + 1, len(boxes)):
                (b1, l1, c1), (b2, l2, c2) = boxes[i], boxes[j]
                if c1 == c2 == "pname":
                    continue
                c.ok(not overlaps(b1, b2, tol=1.0),
                     "%s does not overlap %s" % (l1, l2.split(" ", 1)[-1]))

        # 5. no label sits on top of the share bar
        if t["bar"]:
            for b, label, _ in boxes:
                c.ok(not overlaps(b, t["bar"], tol=1.0),
                     "%s does not overlap the share bar" % label)

    # 6. a frame caption must not be painted over by an opaque tile
    for f in data["frames"]:
        if f["onTop"]:
            c.passed += 1
            continue
        for t in data["tiles"]:
            r = t["rect"]
            tile_box = (r["x"] + t["shift"][0], r["y"] + t["shift"][1], r["w"], r["h"])
            c.ok(not overlaps(f["box"], tile_box, tol=1.0),
                 "%s frame caption %r is covered by tile %s"
                 % (where, f["label"][:24], t["id"]))


def main():
    src, theme = args_src_theme(sys.argv)
    c = Checks("schematic %s %-14s" % (theme or "auto", src))

    with browser() as b:
        ctx, page = open_src(b, src, theme, viewport=(1440, 950))

        devices = page.evaluate("() => TD.devices.map(d => d.id)")

        for dev in devices:
            goto_hash(page, "#/" + dev)
            # force the schematic renderer regardless of whether a 3D model exists
            page.evaluate("() => { const b = document.getElementById('btn-mode');"
                          " if (b && b.textContent.indexOf('Schematic') >= 0) b.click(); }")
            page.wait_for_timeout(300)

            for ex in (0.0, 1.0):
                data = page.evaluate(PROBE, ex)
                c.ok(data is not None, "%s renders a schematic board" % dev)
                check_board(c, data, "%s@%d" % (dev, ex * 100))

            # every openable sub-board too -- the deep chain layouts are where
            # the long names live
            boards = page.evaluate(
                """() => {
                  const d = TD.deviceById[location.hash.split('/')[1]];
                  return d.nodes.filter(n => TD.canOpen(n)).map(n => n.id);
                }"""
            )
            for bid in boards:
                goto_hash(page, "#/" + dev + "/" + bid)
                page.evaluate("() => { const b = document.getElementById('btn-mode');"
                              " if (b && b.textContent.indexOf('Schematic') >= 0) b.click(); }")
                page.wait_for_timeout(220)
                data = page.evaluate(PROBE, 0.0)
                check_board(c, data, dev + "/" + bid)

        ctx.close()

    return 0 if c.report() else 1


if __name__ == "__main__":
    sys.exit(main())
