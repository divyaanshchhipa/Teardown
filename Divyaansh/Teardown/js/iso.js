/* Teardown :: 3D renderer
 *
 * Real axonometric projection with live yaw and pitch, a hinge transform so
 * lids actually open, and painter's algorithm depth sorting. Boxes in, SVG
 * polygons out. No dependencies, no WebGL, works from file://
 *
 * Model space:  x = right,  y = back,  z = up.  Units are roughly millimetres.
 */
(function (TD) {
  'use strict';

  var NS = 'http://www.w3.org/2000/svg';

  /* ---------- model registry ---------- */

  TD.models = {};
  TD.model = function (key, def) { TD.models[key] = def; };
  TD.hasModel = function (key) { return !!TD.models[key]; };

  function el(tag, attrs, parent) {
    var n = document.createElementNS(NS, tag);
    for (var k in attrs) if (attrs[k] != null) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  }

  /* ---------- colour ---------- */

  function hex2rgb(h) {
    h = h.replace('#', '');
    if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
  }
  function shade(rgb, k) {
    function c(v) { return Math.max(0, Math.min(255, Math.round(v * k))); }
    return 'rgb(' + c(rgb[0]) + ',' + c(rgb[1]) + ',' + c(rgb[2]) + ')';
  }

  /* Theme-dependent drawing colours. Part fills come from the model data and
     never change; these are the things that have to separate a part from the
     board behind it: the crease stroke and the selected-part label plate.
     A dark hairline is invisible on a dark board, so it inverts. */
  function pal() {
    var dark = TD.theme && TD.theme() === 'dark';
    return dark
      ? { stroke: 'rgba(226,236,247,.34)', sel: '#d9a441',
          plate: '#e9eef4', plateInk: '#0c1116', plateSub: '#5d4a1e',
          shadeLo: 0.52, shadeHi: 0.70 }
      : { stroke: 'rgba(13,27,42,.32)', sel: '#b5822a',
          plate: '#0d1b2a', plateInk: '#fff', plateSub: '#d8b877',
          shadeLo: 0.44, shadeHi: 0.62 };
  }

  /* light sits with the camera, so shading stays stable while you spin the model */
  var LIGHT = (function () {
    var v = [-0.38, -0.62, 0.69], m = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
    return [v[0] / m, v[1] / m, v[2] / m];
  })();

  /* ---------- geometry ---------- */

  /* corners wound counter clockwise seen from outside, so the cross product
     of the first two edges is the outward normal */
  var FACES = [
    [[0, 0, 1], [1, 0, 1], [1, 1, 1], [0, 1, 1]],   // top
    [[0, 1, 0], [1, 1, 0], [1, 0, 0], [0, 0, 0]],   // bottom
    [[0, 0, 0], [1, 0, 0], [1, 0, 1], [0, 0, 1]],   // front
    [[1, 1, 0], [0, 1, 0], [0, 1, 1], [1, 1, 1]],   // back
    [[1, 0, 0], [1, 1, 0], [1, 1, 1], [1, 0, 1]],   // right
    [[0, 1, 0], [0, 0, 0], [0, 0, 1], [0, 1, 1]]    // left
  ];

  function corners(box) {
    return function (c) {
      return {
        x: c[0] ? box.x[1] : box.x[0],
        y: c[1] ? box.y[1] : box.y[0],
        z: c[2] ? box.z[1] : box.z[0]
      };
    };
  }

  /* local -> hinge -> explode. Still model space, so axis aligned boxes stay
     comparable for the depth sort below. */
  function toWorld(p, part, model, o) {
    var x = p.x, y = p.y, z = p.z;

    if (part.hinged && model.lid) {
      var a = o.lidAngle, ca = Math.cos(a), sa = Math.sin(a);
      var dy = y - model.lid.axisY, dz = z - model.lid.axisZ;
      y = model.lid.axisY + dy * ca - dz * sa;
      z = model.lid.axisZ + dy * sa + dz * ca;
    }

    if (o.explode > 0 && part._dir) {
      var d = part._dir, k = o.explode * (part.spread || 1) * model.spread;
      x += d[0] * k; y += d[1] * k; z += d[2] * k;
    }
    return { x: x, y: y, z: z };
  }

  function yawRot(p, yaw) {
    var c = Math.cos(yaw), s = Math.sin(yaw);
    return { x: p.x * c - p.y * s, y: p.x * s + p.y * c, z: p.z };
  }

  function transform(p, part, model, o) {
    return yawRot(toWorld(p, part, model, o), o.yaw);
  }

  /* ---------- depth ordering ----------
   * Sorting faces by centroid distance is the usual quick answer and it is
   * wrong here: a large battery whose centre sits nearer the camera paints over
   * the small palm rest directly above it. These are axis aligned boxes, so the
   * correct test is the separating axis. For any two boxes that do not overlap
   * on some axis, whichever sits on the camera side of that axis is in front.
   * Those pairwise facts are then resolved into one draw order topologically.
   */

  function camInModel(yaw, pitch) {
    var ca = Math.cos(yaw), sa = Math.sin(yaw);
    var cp = Math.cos(pitch), sp = Math.sin(pitch);
    return [-cp * sa, -cp * ca, sp];   // unit vector from the scene toward the camera
  }

  function order(solids, cam) {
    var n = solids.length, eps = 1e-6;
    var edges = [], indeg = new Array(n);
    for (var i = 0; i < n; i++) { edges.push([]); indeg[i] = 0; }

    function span(A, B, k) {
      return Math.max(0, Math.min(A.max[k], B.max[k]) - Math.max(A.min[k], B.min[k]));
    }

    /* Pick the separating axis on which the two boxes genuinely face each
       other, measured by how much they overlap in the other two axes. A slab
       sitting directly on top of another gives a large cross section on z and
       that is the constraint that matters. Two boxes touching only along an
       edge give zero on every axis: they are diagonal neighbours, either order
       looks the same, and forcing one is what creates the cycles. */
    function sep(A, B) {
      var best = 0, bestCross = 0;
      for (var k = 0; k < 3; k++) {
        var dir = 0;
        if (A.max[k] <= B.min[k] + eps) dir = cam[k] > 0 ? -1 : 1;
        else if (B.max[k] <= A.min[k] + eps) dir = cam[k] > 0 ? 1 : -1;
        if (!dir) continue;
        var cross = span(A, B, (k + 1) % 3) * span(A, B, (k + 2) % 3);
        if (cross > bestCross) { bestCross = cross; best = dir; }
      }
      return bestCross > 0 ? best : 0;   // -1 draw A first, +1 draw B first
    }

    /* Only pairs that actually overlap on screen need an order. Constraining
       disjoint pairs is what manufactures cycles: a palm rest and a side wall
       are separated on two axes that disagree about which is nearer, and
       chaining that with a real constraint produces an unsatisfiable loop. */
    function overlaps2D(A, B) {
      return A.sx[0] < B.sx[1] && B.sx[0] < A.sx[1] &&
             A.sy[0] < B.sy[1] && B.sy[0] < A.sy[1];
    }

    for (var a = 0; a < n; a++) {
      for (var b = a + 1; b < n; b++) {
        if (!overlaps2D(solids[a], solids[b])) continue;
        var r = sep(solids[a], solids[b]);
        if (r < 0) { edges[a].push(b); indeg[b]++; }
        else if (r > 0) { edges[b].push(a); indeg[a]++; }
      }
    }

    /* Kahn, with ties and any cycles broken by centroid distance, furthest first */
    var out = [], ready = [];
    for (var i2 = 0; i2 < n; i2++) if (!indeg[i2]) ready.push(i2);
    var done = new Array(n);

    TD._dbg = { nodes: n, edges: 0, cycleBreaks: [] };
    edges.forEach(function (e) { TD._dbg.edges += e.length; });

    while (out.length < n) {
      if (!ready.length) {
        /* A cycle. Break it at whichever solid still has the fewest unmet
           constraints, so the smallest number of real occlusions is violated. */
        var pick = -1;
        for (var j = 0; j < n; j++) {
          if (done[j]) continue;
          if (pick < 0 || indeg[j] < indeg[pick] ||
             (indeg[j] === indeg[pick] && solids[j].far > solids[pick].far)) pick = j;
        }
        if (indeg[pick] > 0) TD._dbg.cycleBreaks.push(solids[pick].node + ' (indeg ' + indeg[pick] + ')');
        ready.push(pick);
      }
      ready.sort(function (p, q) { return solids[q].far - solids[p].far; });
      var v = ready.shift();
      if (done[v]) continue;
      done[v] = 1; out.push(solids[v]);
      edges[v].forEach(function (w) { if (!done[w] && --indeg[w] === 0) ready.push(w); });
    }
    return out;
  }

  /* Screen y grows downward, so both terms are negated: things further back
     and things higher up must both move up the page. The camera sits in front
     of the scene at -y and above it at +z, which is what the depth term encodes. */
  function projectTo2D(v, o) {
    var cp = Math.cos(o.pitch), sp = Math.sin(o.pitch);
    return {
      x: v.x,
      y: -v.y * sp - v.z * cp,
      d: v.y * cp - v.z * sp      // larger is further from the camera
    };
  }

  function cross(a, b) {
    return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  }

  /* ---------- one time model preparation ---------- */

  function prepare(model) {
    if (model._ready) return model;
    model.spread = model.spread || 46;

    var all = [], cen = [0, 0, 0], n = 0;
    model.parts.forEach(function (p) {
      p.boxes.forEach(function (b) {
        cen[0] += (b.x[0] + b.x[1]) / 2;
        cen[1] += (b.y[0] + b.y[1]) / 2;
        cen[2] += (b.z[0] + b.z[1]) / 2;
        n++; all.push(b);
      });
    });
    cen = [cen[0] / n, cen[1] / n, cen[2] / n];
    model._centre = cen;

    /* explode direction: radial from the model centre, biased upward so a
       flat product still separates into readable layers */
    model.parts.forEach(function (p) {
      if (p.dir) { p._dir = norm(p.dir); return; }
      var c = [0, 0, 0];
      p.boxes.forEach(function (b) {
        c[0] += (b.x[0] + b.x[1]) / 2; c[1] += (b.y[0] + b.y[1]) / 2; c[2] += (b.z[0] + b.z[1]) / 2;
      });
      c = [c[0] / p.boxes.length - cen[0], c[1] / p.boxes.length - cen[1], c[2] / p.boxes.length - cen[2]];
      p._dir = norm([c[0] * 0.45, c[1] * 0.45, c[2] * 1.6 + 12]);
    });

    model._ready = true;
    return model;
  }

  function norm(v) {
    var m = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]) || 1;
    return [v[0] / m, v[1] / m, v[2] / m];
  }

  /* ---------- fit ----------
   * Sampling several yaw angles and taking the union keeps the framing stable
   * while the user drags, instead of the model breathing in and out.
   */
  function fit(model, o, W, H) {
    var key = Math.round(o.explode * 20) + ':' + Math.round(o.lidAngle * 12) + ':' + Math.round(o.pitch * 12);
    model._fit = model._fit || {};
    if (model._fit[key]) return model._fit[key];

    var minX = 1e9, maxX = -1e9, minY = 1e9, maxY = -1e9;
    for (var a = 0; a < Math.PI * 2; a += Math.PI / 8) {
      var oo = { yaw: a, pitch: o.pitch, explode: o.explode, lidAngle: o.lidAngle };
      model.parts.forEach(function (p) {
        p.boxes.forEach(function (b) {
          var at = corners(b);
          for (var i = 0; i < 8; i++) {
            var c = [i & 1 ? 1 : 0, i & 2 ? 1 : 0, i & 4 ? 1 : 0];
            var q = projectTo2D(transform(at(c), p, model, oo), oo);
            if (q.x < minX) minX = q.x; if (q.x > maxX) maxX = q.x;
            if (q.y < minY) minY = q.y; if (q.y > maxY) maxY = q.y;
          }
        });
      });
    }
    var pad = 24;
    var sx = (W - pad * 2) / (maxX - minX), sy = (H - pad * 2) / (maxY - minY);
    var s = Math.min(sx, sy);
    var res = { scale: s, cx: W / 2 - (minX + maxX) / 2 * s, cy: H / 2 - (minY + maxY) / 2 * s };
    model._fit[key] = res;
    return res;
  }

  /* ---------- render ---------- */

  /**
   * TD.renderIso(host, modelKey, opts)
   * opts: { yaw, pitch, explode, lidAngle, selectedId, dim, onSelect, onOpen, nodeOf }
   */
  TD.renderIso = function (host, key, o) {
    var model = prepare(TD.models[key]);
    var W = 1000, H = 620;
    var f = fit(model, o, W, H);
    var cp = Math.cos(o.pitch), sp = Math.sin(o.pitch);
    var toCam = [0, -cp, sp];

    var cam = camInModel(o.yaw, o.pitch);
    var P = pal();
    var solidList = [];

    model.parts.forEach(function (part) {
      var rgb = hex2rgb(part.color || '#8593a4');
      var isSel = o.selectedId && part.node === o.selectedId;
      var dimmed = o.selectedId && !isSel;

      part.boxes.forEach(function (box) {
        var at = corners(box);

        /* world space bounds after the hinge and explode drive the sort,
           screen bounds decide which pairs need sorting at all */
        var mn = [1e9, 1e9, 1e9], mx = [-1e9, -1e9, -1e9];
        var sx = [1e9, -1e9], sy = [1e9, -1e9];
        for (var i = 0; i < 8; i++) {
          var c8 = [i & 1 ? 1 : 0, i & 2 ? 1 : 0, i & 4 ? 1 : 0];
          var w = toWorld(at(c8), part, model, o);
          mn[0] = Math.min(mn[0], w.x); mx[0] = Math.max(mx[0], w.x);
          mn[1] = Math.min(mn[1], w.y); mx[1] = Math.max(mx[1], w.y);
          mn[2] = Math.min(mn[2], w.z); mx[2] = Math.max(mx[2], w.z);
          var s2 = projectTo2D(yawRot(w, o.yaw), o);
          sx[0] = Math.min(sx[0], s2.x); sx[1] = Math.max(sx[1], s2.x);
          sy[0] = Math.min(sy[0], s2.y); sy[1] = Math.max(sy[1], s2.y);
        }
        var mid = [(mn[0] + mx[0]) / 2, (mn[1] + mx[1]) / 2, (mn[2] + mx[2]) / 2];
        var far = -(mid[0] * cam[0] + mid[1] * cam[1] + mid[2] * cam[2]);

        var polys = [];
        FACES.forEach(function (face) {
          var v = face.map(function (c) { return transform(at(c), part, model, o); });
          var e1 = [v[1].x - v[0].x, v[1].y - v[0].y, v[1].z - v[0].z];
          var e2 = [v[2].x - v[0].x, v[2].y - v[0].y, v[2].z - v[0].z];
          var nrm = norm(cross(e1, e2));

          /* back face culling */
          if (nrm[0] * toCam[0] + nrm[1] * toCam[1] + nrm[2] * toCam[2] <= 0.0001) return;

          var lam = Math.max(0, nrm[0] * LIGHT[0] + nrm[1] * LIGHT[1] + nrm[2] * LIGHT[2]);
          /* on a dark board the whole model is lifted a little so mid-tone
             parts do not sit at the same value as the ground behind them */
          var k = P.shadeLo + P.shadeHi * lam;
          if (isSel) k *= 1.2;

          polys.push({
            fill: shade(rgb, k),
            pts: v.map(function (q) {
              var p2 = projectTo2D(q, o);
              return (f.cx + p2.x * f.scale).toFixed(1) + ',' + (f.cy + p2.y * f.scale).toFixed(1);
            }).join(' ')
          });
        });

        solidList.push({ node: part.node, sel: isSel, dim: dimmed,
                         min: mn, max: mx, sx: sx, sy: sy, far: far, polys: polys });
      });
    });

    var sorted = order(solidList, cam);   // far to near

    var svg = el('svg', { viewBox: '0 0 ' + W + ' ' + H, 'class': 'iso' });
    var stage = el('g', { 'class': 'iso-solids' }, svg);

    /* Polygons are emitted flat in draw order. Grouping them per part would
       reorder them and undo the sort, so parts carry an id attribute instead
       and hit testing is delegated. */
    sorted.forEach(function (s) {
      s.polys.forEach(function (p) {
        el('polygon', {
          'class': 'isoface' + (s.sel ? ' sel' : '') + (s.dim ? ' dim' : ''),
          'data-id': s.node,
          points: p.pts, fill: p.fill,
          stroke: s.sel ? P.sel : P.stroke,
          'stroke-width': s.sel ? 1.9 : 0.6,
          'stroke-linejoin': 'round'
        }, stage);
      });
    });
    var solids = stage;

    /* label for the selected part, anchored to its projected centroid */
    if (o.selectedId) {
      var sel = model.parts.filter(function (p) { return p.node === o.selectedId; })[0];
      if (sel) {
        var c = [0, 0, 0], n = 0;
        sel.boxes.forEach(function (b) {
          var at = corners(b);
          for (var i = 0; i < 8; i++) {
            var q = projectTo2D(transform(at([i & 1 ? 1 : 0, i & 2 ? 1 : 0, i & 4 ? 1 : 0]), sel, model, o), o);
            c[0] += q.x; c[1] += q.y; n++;
          }
        });
        var lx = f.cx + (c[0] / n) * f.scale, ly = f.cy + (c[1] / n) * f.scale;
        var node = o.nodeOf ? o.nodeOf(o.selectedId) : null;
        var txt = node ? node.name : o.selectedId;
        var sub = '';
        if (node && (node.shares || []).length) {
          var r = TD.rankShares(node);
          sub = r.named[0].c + '  ' + TD.pct(r.named[0].p);
        }
        var g = el('g', { 'class': 'iso-label' }, svg);
        var w = Math.max(txt.length, sub.length) * 7.6 + 22;
        el('line', { x1: lx, y1: ly, x2: lx, y2: ly - 34, stroke: P.sel, 'stroke-width': 1.4 }, g);
        el('rect', { x: lx - w / 2, y: ly - 34 - (sub ? 40 : 26), width: w, height: sub ? 40 : 26, rx: 4,
                     fill: P.plate, opacity: .94 }, g);
        var t1 = el('text', { x: lx, y: ly - 34 - (sub ? 24 : 9), 'text-anchor': 'middle',
                              fill: P.plateInk, 'font-size': '14', 'font-family': 'Calibri, sans-serif' }, g);
        t1.textContent = txt;
        if (sub) {
          var t2 = el('text', { x: lx, y: ly - 42 + 34, 'text-anchor': 'middle',
                                fill: P.plateSub, 'font-size': '12.5', 'font-family': 'Calibri, sans-serif' }, g);
          t2.setAttribute('y', ly - 34 - 8);
          t2.textContent = sub;
        }
      }
    }

    host.innerHTML = '';
    host.appendChild(svg);

    /* interaction, delegated so the flat face order is preserved */
    function idAt(e) {
      var t = e.target;
      return t && t.getAttribute ? t.getAttribute('data-id') : null;
    }

    var hovered = null;
    function setHover(id) {
      if (hovered === id) return;
      hovered = id;
      solids.querySelectorAll('.isoface.hov').forEach(function (p) { p.classList.remove('hov'); });
      if (id) solids.querySelectorAll('[data-id="' + id + '"]').forEach(function (p) { p.classList.add('hov'); });
      svg.style.cursor = id ? 'pointer' : '';
    }

    svg.addEventListener('mousemove', function (e) { setHover(idAt(e)); });
    svg.addEventListener('mouseleave', function () { setHover(null); });
    svg.addEventListener('click', function (e) {
      var id = idAt(e);
      if (id && o.onSelect) o.onSelect(id);
    });
    svg.addEventListener('dblclick', function (e) {
      var id = idAt(e);
      if (id && o.onOpen) o.onOpen(id);
    });

    return svg;
  };

  /* ---------- drag to rotate ---------- */

  TD.attachOrbit = function (host, state, onChange) {
    var drag = null;

    function down(e) {
      var t = e.touches ? e.touches[0] : e;
      drag = { x: t.clientX, y: t.clientY, yaw: state.yaw, pitch: state.pitch };
      host.classList.add('grabbing');
    }
    function move(e) {
      if (!drag) return;
      var t = e.touches ? e.touches[0] : e;
      state.yaw = drag.yaw + (t.clientX - drag.x) * 0.0085;
      state.pitch = Math.max(0.12, Math.min(1.42, drag.pitch + (t.clientY - drag.y) * 0.006));
      if (e.cancelable) e.preventDefault();
      onChange();
    }
    function up() { drag = null; host.classList.remove('grabbing'); }

    host.addEventListener('mousedown', down);
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
    host.addEventListener('touchstart', down, { passive: true });
    host.addEventListener('touchmove', move, { passive: false });
    host.addEventListener('touchend', up);

    return function () {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
    };
  };

})(window.TD);
