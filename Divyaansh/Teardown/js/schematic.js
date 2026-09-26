/* Teardown :: SVG board renderer
 * Draws a node's children as an exploded schematic. Two layouts:
 *   board  - children carry their own shape coordinates
 *   chain  - children are laid out left to right as a supply chain with arrows
 *
 * Text is measured, never estimated. Every label on a tile is laid out
 * against getComputedTextLength(), because the previous character-count
 * approach ("about 8.4px per character") is wrong by up to a third on the
 * strings this data actually contains, "Photoresist and speciality
 * chemicals" is narrow per character, "MOTHERBOARD" is wide, and the error
 * showed up as titles overrunning their tiles and labels landing on top of
 * each other. tools/schematic.py asserts the result geometrically.
 */
(function (TD) {
  'use strict';

  var NS = 'http://www.w3.org/2000/svg';
  var EXPLODE_PX = 46;
  var ELL = '…';                        /* one glyph, narrower than "..." */

  /* vertical rhythm, in user units */
  var TITLE_ASC = 13, TITLE_LH = 17;         /* 15px semibold */
  var LEAD_GAP = 16;                         /* title baseline -> leader baseline */
  var LEAD_DESC = 4;
  var BAR_H = 7;
  var META_RESERVE = 16;                     /* room under the bar for the meta row */

  function el(tag, attrs, parent) {
    var n = document.createElementNS(NS, tag);
    for (var k in attrs) if (attrs[k] !== undefined && attrs[k] !== null) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  }

  /* ---------- text measurement ----------
   * One hidden <text> inside the live SVG, reused for every query so the
   * browser resolves the same fonts and letter-spacing the visible labels
   * get. Results are cached per (class, string): a board asks for the same
   * string many times while binary-searching a truncation point.
   */
  function makeMeasurer(svg) {
    var g = el('g', { 'aria-hidden': 'true', 'pointer-events': 'none',
                      visibility: 'hidden' }, svg);
    var probe = el('text', { x: -9999, y: -9999 }, g);
    var cache = {};

    return function measure(str, cls, size) {
      if (!str) return 0;
      var key = cls + '|' + (size || '') + '|' + str;
      if (cache[key] !== undefined) return cache[key];
      probe.setAttribute('class', cls);
      if (size) probe.setAttribute('font-size', size);
      else probe.removeAttribute('font-size');
      probe.textContent = str;
      var w = 0;
      try { w = probe.getComputedTextLength(); } catch (e) { w = 0; }
      /* A detached or display:none board measures everything as zero. Falling
         back to the old estimate keeps such a board readable rather than
         collapsing every label to nothing. */
      if (!w) w = str.length * (parseFloat(size) || 13) * 0.55;
      cache[key] = w;
      return w;
    };
  }

  /* longest prefix of s whose width (plus an optional suffix) fits maxPx */
  function clipTo(measure, s, cls, size, maxPx, suffix) {
    suffix = suffix || '';
    var lo = 0, hi = s.length;
    while (lo < hi) {
      var mid = Math.ceil((lo + hi) / 2);
      if (measure(s.slice(0, mid) + suffix, cls, size) <= maxPx) lo = mid;
      else hi = mid - 1;
    }
    return s.slice(0, lo);
  }

  /* s, shortened with an ellipsis if it does not fit. Never returns a bare
     ellipsis: a tile captioned "…" tells the reader strictly less than an
     empty one, and the old wrap() produced exactly that. */
  function ellipsize(measure, s, cls, size, maxPx) {
    if (measure(s, cls, size) <= maxPx) return s;
    var head = clipTo(measure, s, cls, size, maxPx, ELL).replace(/[\s,;:·–-]+$/, '');
    return head ? head + ELL : '';
  }

  /* Word wrap by measured width. Two things the character-count version got
     wrong: a single word longer than the line was never broken (so it just
     overran), and overflow was signalled by deleting a whole trailing word,
     which is how "Photoresist and speciality chemicals" became "Photoresist
     and" over a line reading only "...". */
  function wrapFit(measure, text, cls, size, maxPx, maxLines) {
    var words = String(text).split(/\s+/).filter(Boolean);
    var lines = [], cur = '', i = 0;

    while (i < words.length && lines.length < maxLines) {
      var w = words[i];
      var t = cur ? cur + ' ' + w : w;
      if (measure(t, cls, size) <= maxPx) { cur = t; i++; continue; }
      if (cur) { lines.push(cur); cur = ''; continue; }
      /* the word alone is wider than the line: hard-break it */
      var head = clipTo(measure, w, cls, size, maxPx);
      if (!head) break;                       /* line narrower than one glyph */
      lines.push(head);
      words[i] = w.slice(head.length);
    }
    if (cur && lines.length < maxLines) { lines.push(cur); cur = ''; i = words.length; }

    if ((cur || i < words.length) && lines.length) {
      lines[lines.length - 1] =
        ellipsize(measure, lines[lines.length - 1] + ELL, cls, size, maxPx);
    }
    return lines.filter(Boolean);
  }

  /* Reads a themed token out of the live stylesheet. The schematic paints
     straight into SVG attributes, which cannot take var(), so the value has
     to be resolved at draw time, and the board is redrawn on a theme
     change, so it never goes stale. */
  function cssVar(name) {
    var v = getComputedStyle(document.documentElement).getPropertyValue(name);
    return (v && v.trim()) || '#8593a4';
  }

  /* Children that can actually be drawn on a board */
  TD.drawableChildren = function (node) {
    var kids = (node.children || []).filter(function (c) { return c.kind !== 'meta'; });
    if (!kids.length) return [];
    var lay = node.layout || (kids[0].shape ? 'board' : null);
    if (!lay) return [];
    return kids;
  };

  TD.canOpen = function (node) {
    return TD.drawableChildren(node).length > 0;
  };

  /* Assign shapes for a chain layout */
  function chainShapes(kids, W, H) {
    var n = kids.length;
    var gapX = 26, marginX = 40;
    var avail = W - marginX * 2 - gapX * (n - 1);
    var w = Math.min(230, Math.max(120, avail / n));
    var total = w * n + gapX * (n - 1);
    var x0 = (W - total) / 2;
    var h = 210, y = (H - h) / 2 + 10;
    return kids.map(function (k, i) {
      return { x: x0 + i * (w + gapX), y: y, w: w, h: h };
    });
  }

  /**
   * render(svgHost, node, opts)
   *   node    - the node (or device) whose children are drawn
   *   opts    - { explode: 0..1, selectedId, onSelect(node), onOpen(node) }
   */
  TD.renderBoard = function (host, ctx, opts) {
    opts = opts || {};
    host.innerHTML = '';

    var device = ctx.device ? TD.deviceById[ctx.device] : ctx;   // node or device
    var isDevice = !ctx.parent && !ctx.device;
    var W = (device.view && device.view.w) || 1000;
    var H = (device.view && device.view.h) || 640;

    var kids, layout, frames = [];
    if (isDevice) {
      kids = device.nodes.filter(function (n) { return !n.parent && n.kind !== 'meta'; });
      layout = 'board';
      frames = device.frames || [];
    } else {
      kids = TD.drawableChildren(ctx);
      layout = ctx.layout || 'board';
    }
    if (!kids.length) { host.innerHTML = ''; return; }

    /* A node without a shape is not a thing you can point at on the board,
       the residual cost line, for instance, which is real in the analysis and
       has no location in the machine. Drop those here rather than letting an
       undefined shape reach the centroid loop, where it took the whole board
       down with it. */
    if (layout !== 'chain') {
      kids = kids.filter(function (k) { return k.shape; });
      if (!kids.length) { host.innerHTML = ''; return; }
    }

    var shapes;
    if (layout === 'chain') shapes = chainShapes(kids, W, H);
    else shapes = kids.map(function (k) { return k.shape; });

    var svg = el('svg', { viewBox: '0 0 ' + W + ' ' + H, role: 'img' }, host);
    var measure = makeMeasurer(svg);

    var defs = el('defs', {}, svg);
    var mk = el('marker', {
      id: 'arrow', viewBox: '0 0 10 10', refX: '9', refY: '5',
      markerWidth: '7', markerHeight: '7', orient: 'auto-start-reverse'
    }, defs);
    el('path', { d: 'M0,0 L10,5 L0,10 z', fill: cssVar('--line-2') }, mk);

    /* Frame plates go down first, their captions last. Painting both before
       the tiles meant an opaque tile sitting on a frame's top edge simply
       covered the caption, which is what hid "BASE ASSEMBLY" behind the
       motherboard, and looked like a text bug but was a paint-order one. */
    frames.forEach(function (f) {
      var g = el('g', { 'class': 'frame' }, svg);
      el('rect', { x: f.x, y: f.y, width: f.w, height: f.h, rx: 8 }, g);
    });

    /* chain arrows sit under the tiles */
    if (layout === 'chain') {
      var ag = el('g', {}, svg);
      for (var i = 0; i < shapes.length - 1; i++) {
        var a = shapes[i], b = shapes[i + 1];
        el('path', {
          'class': 'chainarrow',
          d: 'M' + (a.x + a.w + 3) + ',' + (a.y + a.h / 2) + ' L' + (b.x - 6) + ',' + (b.y + b.h / 2)
        }, ag);
      }
      var lbl = el('text', {
        x: W / 2, y: shapes[0].y - 22, 'text-anchor': 'middle',
        fill: cssVar('--muted-2'), 'font-size': '12.5', 'font-family': 'Calibri, sans-serif',
        'letter-spacing': '.9'
      }, svg);
      lbl.textContent = 'WHAT IT TAKES TO MAKE ONE, READING UPSTREAM';
    }

    /* centroid for the explode vector */
    var cx = 0, cy = 0;
    shapes.forEach(function (s) { cx += s.x + s.w / 2; cy += s.y + s.h / 2; });
    cx /= shapes.length; cy /= shapes.length;

    var ex = Math.max(0, Math.min(1, opts.explode || 0));
    /* The open arrow shares a baseline with whichever row it lands in, so it
       has to share that row's size too: a 15px glyph on the 11.5px meta row
       has a taller em box than the row is deep and sat on the share bar. */
    var META_SIZE = '11.5';
    var arrowW = measure('→', 'openmark') + 6;
    var arrowMetaW = measure('→', 'openmark', META_SIZE) + 6;

    kids.forEach(function (node, idx) {
      var s = shapes[idx];
      if (!s) return;

      var mx = s.x + s.w / 2 - cx, my = s.y + s.h / 2 - cy;
      var len = Math.sqrt(mx * mx + my * my) || 1;
      var dx = (mx / len) * EXPLODE_PX * ex;
      var dy = (my / len) * EXPLODE_PX * ex;
      /* Separation must not push a tile out of the frame. Edge tiles used to
         drift past the viewBox and get clipped, so the parts furthest from
         the centre, exactly the ones separation is meant to reveal, were
         the ones that disappeared. */
      dx = Math.max(-s.x, Math.min(W - s.x - s.w, dx));
      dy = Math.max(-s.y, Math.min(H - s.y - s.h, dy));

      var g = el('g', {
        'class': 'part' + (opts.selectedId === node.id ? ' sel' : ''),
        transform: 'translate(' + dx.toFixed(1) + ',' + dy.toFixed(1) + ')',
        tabindex: '0', role: 'button'
      }, svg);
      g.setAttribute('data-id', node.id);

      el('rect', { 'class': 'tile', x: s.x, y: s.y, width: s.w, height: s.h, rx: 5 }, g);

      var padX = 11, padY = s.h < 80 ? 8 : 11;
      var innerW = s.w - padX * 2;
      var tx = s.x + padX;
      var tiny = s.h < 42;                       /* thin strips: hinges, webcam bar */
      var roomy = s.h >= 100, medium = s.h >= 64;
      var r = TD.rankShares(node);
      var opens = TD.canOpen(node);
      var chokeReserve = node.chokepoint ? 14 : 0;
      var title = node.short || node.name;

      if (tiny) {
        /* One line: name on the left, leader on the right, sharing a width
           neither can have all of. The name is served first: a tile you
           cannot identify is worth less than one whose supplier you cannot
           read, but it is capped so a long name cannot crowd the leader out
           entirely. The share figure is never dropped before the company
           name it belongs to. */
        var midY = s.y + s.h / 2 + 5;
        var avail = innerW - chokeReserve;
        var nameRoom = Math.min(measure(title, 'pname', '13.5'),
                                Math.max(avail * 0.5, avail - 74));
        var nameTxt = ellipsize(measure, title, 'pname', '13.5', nameRoom);
        var nameW = nameTxt ? measure(nameTxt, 'pname', '13.5') : 0;

        var leadTxt = '';
        if (r.named.length) {
          var pctT = '  ' + TD.pct(r.named[0].p);
          var room = avail - nameW - 10 - measure(pctT, 'plead', '12.5');
          var co = ellipsize(measure, r.named[0].c, 'plead', '12.5', room);
          if (co) leadTxt = co + pctT;
        }

        if (nameTxt) {
          var nt = el('text', { 'class': 'pname', x: tx, y: midY, 'font-size': '13.5' }, g);
          nt.textContent = nameTxt;
        }
        if (leadTxt) {
          var rt = el('text', {
            'class': 'plead', x: s.x + s.w - padX - chokeReserve, y: midY,
            'text-anchor': 'end', 'font-size': '12.5'
          }, g);
          rt.textContent = leadTxt;
        }
        if (node.chokepoint) {
          el('circle', { 'class': 'choke-pulse', cx: s.x + s.w - padX + 1, cy: midY - 4, r: 4 }, g);
          el('circle', { 'class': 'choke', cx: s.x + s.w - padX + 1, cy: midY - 4, r: 4 }, g);
        }
        attach(g, node);
        return;
      }

      /* ---- title ---- */
      var titleRoom = innerW - chokeReserve;
      var lines = wrapFit(measure, title, 'pname', null, titleRoom, roomy ? 2 : 1);
      var base = s.y + padY + TITLE_ASC;
      lines.forEach(function (ln, li) {
        var t = el('text', { 'class': 'pname', x: tx, y: base + li * TITLE_LH }, g);
        t.textContent = ln;
      });
      var lastBase = base + Math.max(0, lines.length - 1) * TITLE_LH;

      /* ---- geometry of the bottom band, decided before anything is drawn ----
         The share bar used to be pinned to the tile's bottom edge regardless
         of how far the text stack reached, so on a 64px tile the leader line
         was painted underneath it. */
      var metaRoom = roomy ? META_RESERVE : 0;
      var barTop = s.y + s.h - padY - BAR_H - metaRoom;
      var leadBase = lastBase + LEAD_GAP;
      var wantsBar = medium && r.named.length;
      var showBar = wantsBar && barTop >= leadBase + LEAD_DESC + 2;
      /* If the bar cannot clear the text, the meta row underneath it cannot
         either, drop both rather than overlap. */
      var showMeta = showBar && roomy;

      /* ---- leader ---- */
      var arrowOnLead = opens && !showMeta;
      var leadRoom = innerW - (arrowOnLead ? arrowW : 0);
      var leadText = null;
      if (r.named.length) {
        var lead = r.named[0];
        var pctTxt = '  ' + TD.pct(lead.p);
        var pctW = measure(pctTxt, 'plead');
        leadText = ellipsize(measure, lead.c, 'plead', null, leadRoom - pctW) + pctTxt;
      } else if (opens) {
        leadText = ellipsize(measure, 'open to break down', 'plead', null, leadRoom);
      }
      if (leadText) {
        var lt = el('text', { 'class': 'plead', x: tx, y: leadBase }, g);
        lt.textContent = leadText;
      }

      /* ---- mini stacked share bar ---- */
      if (showBar) {
        var bw = innerW, bx = tx, by = barTop;
        el('rect', { x: bx, y: by, width: bw, height: BAR_H, rx: 3, fill: cssVar('--paper-3') }, g);
        var acc = 0;
        r.named.forEach(function (sh) {
          var segw = (sh.p / 100) * bw;
          if (segw < 0.7) { acc += sh.p; return; }
          el('rect', {
            x: bx + (acc / 100) * bw, y: by, width: segw, height: BAR_H,
            fill: TD.colorOf(sh.c), rx: 1.5
          }, g);
          acc += sh.p;
        });

        if (showMeta) {
          var metaBase = by + BAR_H + 12;
          var cc = TD.concentration(TD.hhi(node));
          var rightLimit = s.x + s.w - padX - (opens ? arrowMetaW : 0);
          var concW = measure(cc.short, 'pmeta');
          var costTxt = node.bomPct ? TD.pct(node.bomPct) + ' OF COST' : '';
          var costW = costTxt ? measure(costTxt, 'pmeta') : 0;
          var metaRoomW = rightLimit - tx;

          if (concW <= metaRoomW) {
            var mt = el('text', { 'class': 'pmeta', x: bx, y: metaBase }, g);
            mt.textContent = cc.short;
          }
          /* the arrow's width is part of the budget; leaving it out is what
             put "17% OF COST" underneath the open arrow */
          if (costTxt && concW + 10 + costW <= metaRoomW) {
            var bt = el('text', {
              'class': 'pmeta', x: rightLimit, y: metaBase, 'text-anchor': 'end'
            }, g);
            bt.textContent = costTxt;
          }
          if (opens) {
            var om = el('text', {
              'class': 'openmark', x: s.x + s.w - padX, y: metaBase,
              'text-anchor': 'end', 'font-size': META_SIZE
            }, g);
            om.textContent = '→';
          }
        }
      }

      /* the open affordance, when the meta row did not already place it */
      if (opens && !showMeta) {
        var om2 = el('text', {
          'class': 'openmark', x: s.x + s.w - padX, y: leadBase, 'text-anchor': 'end'
        }, g);
        om2.textContent = '→';
      }

      /* chokepoint marker */
      if (node.chokepoint) {
        var ccy = s.y + padY + 4;
        el('circle', { 'class': 'choke-pulse', cx: s.x + s.w - padX - 2, cy: ccy, r: 4.5 }, g);
        el('circle', { 'class': 'choke', cx: s.x + s.w - padX - 2, cy: ccy, r: 4.5 }, g);
      }

      attach(g, node);
    });

    /* Frame captions last, on top of everything, each on a backing plate
       measured to the text rather than to a per-character guess. */
    frames.forEach(function (f) {
      var g = el('g', { 'class': 'frame' }, svg);
      var label = ellipsize(measure, f.label, 'framelabel', null, Math.max(40, f.w - 24));
      if (!label) return;
      var lw = measure(label, 'framelabel') + 18;
      el('rect', { 'class': 'frame-label-bg', x: f.x + 4, y: f.y - 9, width: lw, height: 18, rx: 3 }, g);
      var t = el('text', { 'class': 'framelabel', x: f.x + 12, y: f.y + 4 }, g);
      t.textContent = label;
    });

    function attach(g, node) {
      function fire(e) {
        e.stopPropagation();
        var openIt = e.shiftKey || (e.target && e.target.classList && e.target.classList.contains('openmark'));
        if (openIt && TD.canOpen(node) && opts.onOpen) opts.onOpen(node);
        else if (opts.onSelect) opts.onSelect(node);
      }
      g.addEventListener('click', fire);
      g.addEventListener('dblclick', function (e) {
        e.stopPropagation();
        if (TD.canOpen(node) && opts.onOpen) opts.onOpen(node);
      });
      g.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fire(e); }
      });
    }
  };

})(window.TD);
