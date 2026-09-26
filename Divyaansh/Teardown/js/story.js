/* Teardown :: long-form device story
 *
 * The full analysis rendered below a device's teardown, for devices that
 * carry a `story` block in their data file. A device without one never
 * reaches this code and renders exactly as it did before: that is what
 * keeps the flagship treatment scoped to one device at a time.
 *
 * Every number drawn here is read from the device's own nodes at render
 * time. Nothing in this file introduces, estimates or rounds a market
 * figure, and where the data does not support a chart the section says so
 * rather than filling the space.
 */
(function (TD) {
  'use strict';

  var esc = TD.esc;
  var viz = TD.viz;
  var SRC_TYPE_LABEL = {
    primary: 'Primary', 'third-party': 'Third-party', derived: 'Derived'
  };

  /* ---------- shared helpers ---------- */

  function nodesOf(dev, ids) {
    return (ids || []).map(function (id) { return dev.byId[id]; }).filter(Boolean);
  }

  function measured(list) {
    return list.filter(function (n) { return (n.shares || []).length > 0; });
  }

  /* depth in the supply chain, 1 = the part you can see and touch */
  function depthOf(n) {
    var d = 1, cur = n;
    while (cur.parentNode) { d++; cur = cur.parentNode; }
    return d;
  }

  /* Market sizes are free text in the device files ("USD ~24bn"). This reads
     the magnitude back out; anything that does not parse is dropped from the
     chart rather than guessed at. A basis mentioning "all applications" is
     flagged, because those figures cover more than the device in question and
     a chart that ranked them against device-specific layers without saying so
     would be quietly misleading. */
  function marketUSDbn(n) {
    var s = (n.market && n.market.size) || '';
    var m = /([\d.]+)\s*(bn|m)\b/i.exec(s);
    if (!m) return null;
    var v = parseFloat(m[1]);
    if (!isFinite(v)) return null;
    return /m$/i.test(m[2]) ? v / 1000 : v;
  }

  function isWholeMarket(n) {
    return /all applications|all uses/i.test((n.market && n.market.basis) || '');
  }

  function section(id, kicker, title, lede, body) {
    return '<section class="st-sec" id="st-' + id + '">' +
      '<div class="st-head">' +
        '<div class="st-kicker">' + esc(kicker) + '</div>' +
        '<h2>' + title + '</h2>' +
        (lede ? '<p class="st-lede">' + lede + '</p>' : '') +
      '</div>' + body +
    '</section>';
  }

  function card(title, sub, body, foot) {
    return '<div class="st-card">' +
      '<div class="st-card-head"><h3>' + esc(title) + '</h3>' +
        (sub ? '<p>' + esc(sub) + '</p>' : '') + '</div>' +
      body + (foot || '') +
    '</div>';
  }

  /* ---------- 1. overview ---------- */

  function overviewSection(dev) {
    var s = dev.story;
    var findings = (s.findings || []).map(function (f) {
      var links = nodesOf(dev, f.nodes).map(function (n) {
        return '<button class="st-chip" data-node="' + esc(n.id) + '">' +
          esc(n.short || n.name) + '</button>';
      }).join('');
      return '<div class="st-box">' +
        '<h4>' + esc(f.title) + '</h4>' +
        '<p>' + esc(f.body) + '</p>' +
        (links ? '<div class="st-chips">' + links + '</div>' : '') +
      '</div>';
    }).join('');

    return section('overview', s.kicker || 'Overview',
      esc(s.headline || dev.name),
      esc(s.lede || ''),
      viz.metricsHTML(dev) +
      (findings ? '<div class="st-boxes">' + findings + '</div>' : ''));
  }

  /* ---------- 2. how it is built ----------
   * Stage cards carry their key stat pulled live from the nodes they name,
   * so the editorial copy in the data file cannot drift away from the
   * figures underneath it.
   */
  function stageStat(stage) {
    var meas = measured(stage.nodes);
    if (!meas.length) return null;
    /* the stage's tightest layer is the interesting one: that is what makes
       a stage a chokepoint rather than just a step */
    var worst = meas.slice().sort(function (a, b) { return TD.hhi(b) - TD.hhi(a); })[0];
    var lead = TD.rankShares(worst).named[0];
    return {
      node: worst,
      label: esc(lead.c) + ' ' + TD.pct(lead.p),
      sub: esc(worst.short || worst.name),
      band: TD.concentration(TD.hhi(worst))
    };
  }

  function journeySection(dev) {
    var stages = (dev.story.stages || []).map(function (st) {
      return { id: st.id, name: st.name, note: st.note, nodes: nodesOf(dev, st.nodes) };
    });

    var cards = stages.map(function (st, i) {
      var stat = stageStat(st);
      return '<li class="st-stage">' +
        '<div class="st-stage-top">' +
          '<span class="st-stage-n">' + (i < 9 ? '0' : '') + (i + 1) + '</span>' +
          '<span class="st-stage-count">' + st.nodes.length +
            ' layer' + (st.nodes.length === 1 ? '' : 's') + '</span>' +
        '</div>' +
        '<h4>' + esc(st.name) + '</h4>' +
        '<p>' + esc(st.note || '') + '</p>' +
        (stat
          ? '<div class="st-stage-stat conc-fg-' + stat.band.key + '">' +
              '<b>' + stat.label + '</b><span>' + stat.sub + '</span></div>'
          : '<div class="st-stage-stat none"><span>No share table at this stage</span></div>') +
        '<div class="st-chips">' + st.nodes.map(function (n) {
          return '<button class="st-chip" data-node="' + esc(n.id) + '">' +
            esc(n.short || n.name) + '</button>';
        }).join('') + '</div>' +
      '</li>';
    }).join('');

    /* counted, not typed: the stage list is data and has changed twice */
    var COUNT = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven',
                 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen',
                 'Fourteen', 'Fifteen', 'Sixteen'];
    var n = stages.length;

    return section('journey', 'Mapped end to end',
      'How a ' + esc(dev.name.toLowerCase()) + ' is built',
      (COUNT[n] || n) + ' stages, upstream to downstream, covering every one of the ' +
      dev.nodes.length + ' layers in this teardown. Each stage shows its tightest market, ' +
      'the layer within it where the fewest suppliers exist.',
      '<ol class="st-stages">' + cards + '</ol>' + flowHTML(dev) + stageGeoChart(dev, stages));
  }

  /* The journey again, read geographically. The stage cards say what happens
     at each step; this says where. It is the one view that makes the shape of
     the chain obvious: design in the United States, the tools in the
     Netherlands and Japan, the fabrication in Taiwan, the materials in China,
     without anyone having to assert it in prose. */
  function stageGeoChart(dev, stages) {
    var rows = stages.map(function (st) {
      var meas = measured(st.nodes);
      if (!meas.length) return { name: st.name, empty: true };

      var pts = {}, total = 0;
      meas.forEach(function (n) {
        (n.shares || []).forEach(function (s) {
          var g = TD.geoOf(s.c);
          pts[g] = (pts[g] || 0) + s.p;
          total += s.p;
        });
      });
      if (!total) return { name: st.name, empty: true };

      var segs = Object.keys(pts).map(function (k) {
        return { geo: k, p: pts[k] / total * 100,
                 meta: TD.GEO[k] || TD.GEO.ROW, color: TD.geoColor(k) };
      }).sort(function (a, b) { return b.p - a.p; });

      return { name: st.name, segs: segs, top: segs[0], n: meas.length };
    });

    if (rows.filter(function (r) { return !r.empty; }).length < 3) return '';

    /* one legend for the chart, ordered by total weight across all stages */
    var totals = {};
    rows.forEach(function (r) {
      if (r.empty) return;
      r.segs.forEach(function (s) { totals[s.geo] = (totals[s.geo] || 0) + s.p; });
    });
    var legend = Object.keys(totals).sort(function (a, b) { return totals[b] - totals[a]; })
      .map(function (k) {
        var meta = TD.GEO[k] || TD.GEO.ROW;
        return '<span class="ovgeo-item"><i style="background:' + TD.geoColor(k) + '"></i>' +
          esc(meta.label) + '</span>';
      }).join('');

    var body = rows.map(function (r, i) {
      var num = '<span class="st-heat-n">' + (i < 9 ? '0' : '') + (i + 1) + '</span>';
      if (r.empty) {
        return '<li class="st-heat-row empty">' + num +
          '<span class="st-heat-name">' + esc(r.name) + '</span>' +
          '<span class="st-heat-bar"></span>' +
          '<span class="st-heat-top">no share table</span></li>';
      }
      var segs = r.segs.map(function (s) {
        return '<span class="st-heat-seg" style="width:' + s.p.toFixed(1) + '%;background:' +
          s.color + '" title="' + esc(s.meta.label) + ' ' + TD.pct(s.p) + '"></span>';
      }).join('');
      return '<li class="st-heat-row">' + num +
        '<span class="st-heat-name">' + esc(r.name) + '</span>' +
        '<span class="st-heat-bar">' + segs + '</span>' +
        '<span class="st-heat-top" style="color:' + TD.geoInk(r.top.geo) + '">' +
          esc(r.top.meta.label) + ' ' + TD.pct(r.top.p) + '</span></li>';
    }).join('');

    return card('Where each stage happens',
      'Supplier home countries within each stage, as a share of that stage\'s share points',
      '<ul class="st-heat">' + body + '</ul>' +
      '<div class="ovgeo-key">' + legend + '</div>' +
      '<p class="ovc-gap">Each row is normalised to its own stage, so the strips compare ' +
      'composition, not size. A stage with one measured layer is one company\'s home country.</p>',
      viz.footer(measured(dev.nodes),
        'Share points by supplier home country, normalised within each stage',
        'Supplier headquarters, not manufacturing location'));
  }

  /* the value chain as it actually runs: parallel routes converging on
     final assembly, which is the shape a linear strip cannot show */
  function flowHTML(dev) {
    var f = dev.story.flow;
    if (!f) return '';

    function step(n) {
      var meas = (n.shares || []).length ? TD.rankShares(n).named[0] : null;
      var band = meas ? TD.concentration(TD.hhi(n)) : null;
      return '<button class="st-flow-step' + (n.chokepoint ? ' choke' : '') +
        '" data-node="' + esc(n.id) + '">' +
        '<span class="st-flow-name">' + esc(n.short || n.name) + '</span>' +
        (meas ? '<span class="st-flow-lead' + (band ? ' conc-fg-' + band.key : '') + '">' +
                  esc(meas.c) + ' ' + TD.pct(meas.p) + '</span>' : '') +
      '</button>';
    }

    function chain(nodes) {
      return nodes.map(function (n, i) {
        return (i ? '<span class="st-flow-arrow" aria-hidden="true">&rarr;</span>' : '') + step(n);
      }).join('');
    }

    var lanes = (f.lanes || []).map(function (l) {
      var steps = nodesOf(dev, l.steps);
      if (!steps.length) return '';
      var feed = l.feed ? nodesOf(dev, l.feed.steps) : [];
      return '<div class="st-lane">' +
        '<div class="st-lane-label">' + esc(l.label) + '</div>' +
        '<div class="st-lane-row">' + chain(steps) + '</div>' +
        (feed.length
          ? '<div class="st-feed">' +
              '<div class="st-feed-label">' + esc(l.feed.label) + '</div>' +
              '<div class="st-lane-row">' + feed.map(step).join('') + '</div>' +
            '</div>'
          : '') +
      '</div>';
    }).join('');

    var converge = nodesOf(dev, f.converge);

    return '<div class="st-flow">' +
      '<div class="st-flow-head">The value chain, as it actually runs</div>' +
      '<div class="st-flow-body">' +
        '<div class="st-lanes">' + lanes + '</div>' +
        (converge.length
          ? '<div class="st-converge">' +
              '<div class="st-converge-label">Converges at</div>' +
              '<div class="st-lane-row">' + chain(converge) + '</div>' +
            '</div>'
          : '') +
      '</div>' +
    '</div>';
  }

  /* ---------- 3. where the value sits ---------- */

  function costChart(dev) {
    var rows = dev.nodes.filter(function (n) {
      return !n.parent && n.kind !== 'meta' && typeof n.bomPct === 'number' && n.bomPct > 0;
    }).sort(function (a, b) { return b.bomPct - a.bomPct; });
    if (rows.length < 2) return '';

    var mapped = Math.round(rows.reduce(function (a, n) { return a + n.bomPct; }, 0) * 10) / 10;
    var remainder = Math.round((100 - mapped) * 10) / 10;
    var max = Math.max(rows[0].bomPct, remainder > 0 ? remainder : 0);

    var bars = rows.map(function (n) {
      return viz.bar({
        node: n.id, name: n.short || n.name, value: TD.pct(n.bomPct),
        fill: 'cost', width: n.bomPct / max * 100
      });
    }).join('');

    if (remainder > 0.4) {
      bars += viz.bar({
        name: 'Not mapped to a component', value: TD.pct(remainder),
        fill: 'hatch', width: remainder / max * 100, ghost: true
      });
    }

    return card('Cost by subsystem',
      'Share of the bill of materials, top-level components only',
      '<div class="ovbars">' + bars + '</div>',
      viz.footer(rows, 'Share of device bill-of-materials cost', 'Not geography-specific'));
  }

  /* Log scale, because the layers span three orders of magnitude: the same
     reason Mineral Watch plots mine production on a log axis. Two-tone
     because some of these markets are specific to the device and some are the
     whole world market for that component; ranking them together without
     marking which is which would overstate the device-specific layers. */
  function marketChart(dev) {
    var rows = dev.nodes.map(function (n) {
      var v = marketUSDbn(n);
      return v == null ? null : { n: n, v: v, whole: isWholeMarket(n) };
    }).filter(Boolean).sort(function (a, b) { return b.v - a.v; }).slice(0, 12);
    if (rows.length < 3) return '';

    var max = Math.log10(rows[0].v + 1);
    var bars = rows.map(function (r) {
      var w = Math.max(2, Math.log10(r.v + 1) / max * 100);
      return viz.bar({
        node: r.n.id,
        name: r.n.short || r.n.name,
        mark: r.whole ? '<i class="st-whole" title="Whole world market for this component, not ' +
              esc(dev.name.toLowerCase()) + '-only"></i>' : '',
        value: 'USD ' + (r.v >= 1 ? r.v.toFixed(0) : r.v.toFixed(1)) + 'bn',
        fill: r.whole ? 'market whole' : 'market',
        width: w,
        sub: esc((r.n.market && r.n.market.basis) || '')
      });
    }).join('');

    return card('Market size by layer',
      'Log scale. Hollow bars are whole-world markets for that component, not ' +
        dev.name.toLowerCase() + '-only',
      '<div class="ovbars">' + bars + '</div>',
      viz.footer(rows.map(function (r) { return r.n; }),
        'Stated market size for each layer, log scale',
        'Global; some layers are the whole world market for that component'));
  }

  /* Cost against concentration, which is the whole argument of the section
     in one picture: the bill of materials and the pricing power are close to
     unrelated. Two axes only: the dot size carries market size where the
     data states one, and says so where it does not, rather than defaulting a
     missing figure to a visible area. */
  function costPowerChart(dev) {
    var pts = dev.nodes.filter(function (n) {
      return !n.parent && n.kind !== 'meta' && (n.shares || []).length &&
             typeof n.bomPct === 'number' && n.bomPct > 0;
    }).map(function (n) {
      return { n: n, x: n.bomPct, y: TD.hhi(n), m: marketUSDbn(n) };
    });
    if (pts.length < 4) return '';

    var W = 640, H = 400, L = 56, R = 96, T = 22, B = 46;
    var pw = W - L - R, ph = H - T - B;
    var maxX = Math.max(20, Math.ceil(Math.max.apply(null,
      pts.map(function (p) { return p.x; })) / 5) * 5);
    var maxM = Math.max.apply(null, pts.map(function (p) { return p.m || 0; })) || 1;

    function px(v) { return L + v / maxX * pw; }
    function py(v) { return T + ph - Math.min(v, 10000) / 10000 * ph; }
    function rad(m) { return m ? 5 + Math.sqrt(m / maxM) * 11 : 4.5; }

    var g = '';

    /* horizontal gridlines every 2,500 HHI */
    [0, 2500, 5000, 7500, 10000].forEach(function (v) {
      var y = py(v);
      g += '<line class="sc-grid' + (v === 2500 ? ' thresh' : '') + '" x1="' + L +
        '" y1="' + y.toFixed(1) + '" x2="' + (L + pw) + '" y2="' + y.toFixed(1) + '"/>' +
        '<text class="sc-ax" x="' + (L - 8) + '" y="' + (y + 4).toFixed(1) +
        '" text-anchor="end">' + v.toLocaleString('en-US') + '</text>';
    });
    /* right-anchored: at the left it printed on top of the 2,500 axis label */
    g += '<text class="sc-note" x="' + (L + pw) + '" y="' + (py(2500) - 7).toFixed(1) +
      '" text-anchor="end">2,500: the line a competition regulator draws</text>';

    /* x ticks */
    for (var t = 0; t <= maxX; t += 5) {
      g += '<text class="sc-ax" x="' + px(t).toFixed(1) + '" y="' + (T + ph + 18) +
        '" text-anchor="middle">' + t + '%</text>';
    }
    g += '<text class="sc-axtitle" x="' + (L + pw / 2).toFixed(1) + '" y="' + (H - 6) +
      '" text-anchor="middle">Share of the bill of materials</text>' +
      '<text class="sc-axtitle" transform="translate(14,' + (T + ph / 2).toFixed(1) +
      ') rotate(-90)" text-anchor="middle">Concentration (HHI)</text>';

    /* Labels are emitted next to their dot and then resolved by measurement
       once the SVG is in the document; see layoutScatter(). Placing them
       here from estimated widths is the same mistake the schematic renderer
       used to make: these points cluster in the bottom-left, so a naive
       vertical push turns every label into one long right-hand column joined
       by crossing leader lines. */
    var labels = pts.map(function (p) {
      return '<g class="sc-pt" data-cx="' + px(p.x).toFixed(1) + '" data-cy="' +
        py(p.y).toFixed(1) + '" data-r="' + rad(p.m).toFixed(1) + '">' +
        '<line class="sc-leader" x1="0" y1="0" x2="0" y2="0" visibility="hidden"/>' +
        '<text class="sc-lab">' + esc(p.n.short || p.n.name) + '</text></g>';
    }).join('');

    var dots = pts.map(function (p) {
      var band = TD.concentration(p.y);
      var lead = TD.rankShares(p.n).named[0];
      return '<circle class="sc-dot conc-' + band.key + (p.m ? '' : ' nosize') +
        '" cx="' + px(p.x).toFixed(1) + '" cy="' + py(p.y).toFixed(1) +
        '" r="' + rad(p.m).toFixed(1) + '"><title>' +
        esc(p.n.short || p.n.name) + ': ' + TD.pct(p.x) + ' of cost, HHI ' +
        p.y.toLocaleString('en-US') + ' (' + band.label + '), led by ' +
        esc(lead.c) + ' ' + TD.pct(lead.p) +
        (p.m ? '. Market USD ' + (p.m >= 1 ? p.m.toFixed(0) : p.m.toFixed(1)) + 'bn'
             : '. No market size stated') +
        '</title></circle>';
    }).join('');

    var noSize = pts.filter(function (p) { return !p.m; }).length;
    var big = pts.slice().sort(function (a, b) { return b.x - a.x; })[0];
    var tight = pts.slice().sort(function (a, b) { return b.y - a.y; })[0];

    return card('Cost against concentration',
      'Every top-level component with both a cost weight and a share table',
      '<div class="st-scatter"><svg viewBox="0 0 ' + W + ' ' + H +
        '" role="img" aria-label="Scatter plot of cost share against market concentration"' +
        ' data-l="' + L + '" data-t="' + T + '" data-w="' + pw + '" data-h="' + ph + '">' +
        g + dots + labels + '</svg></div>' +
      '<p class="ovc-gap">' +
        (big.n.id === tight.n.id
          ? esc(big.n.short || big.n.name) + ' is both the largest cost line and the tightest market.'
          : '<b>' + esc(big.n.short || big.n.name) + '</b> is the largest cost line at ' +
            TD.pct(big.x) + ', but its market scores ' + big.y.toLocaleString('en-US') + '. ' +
            '<b>' + esc(tight.n.short || tight.n.name) + '</b> is the tightest at ' +
            tight.y.toLocaleString('en-US') + ' on ' + TD.pct(tight.x) + ' of cost. ' +
            'Spending and leverage sit in different places.') +
        ' Dot size is market size where a figure is stated' +
        (noSize ? '; ' + noSize + ' component' + (noSize === 1 ? ' has' : 's have') +
                  ' none and are drawn as small hollow dots' : '') + '.</p>',
      viz.footer(pts.map(function (p) { return p.n; }),
        'Bill-of-materials share against Herfindahl-Hirschman Index',
        'Global, unless a component states otherwise'));
  }

  /* Resolve the scatter's labels against real geometry, after the SVG is in
     the document. Each label tries four positions around its own dot before
     it is allowed to drift; only a label that had to move gets a leader
     line, so the chart stays quiet when nothing collides. */
  function layoutScatter(root) {
    var svgs = root.querySelectorAll('.st-scatter svg');
    Array.prototype.forEach.call(svgs, function (svg) {
      var L = +svg.getAttribute('data-l'), T = +svg.getAttribute('data-t');
      var PW = +svg.getAttribute('data-w'), PH = +svg.getAttribute('data-h');
      var groups = Array.prototype.slice.call(svg.querySelectorAll('.sc-pt'));
      var taken = [];

      function hits(b) {
        for (var i = 0; i < taken.length; i++) {
          var o = taken[i];
          if (b.x + b.w > o.x && o.x + o.w > b.x &&
              b.y + b.h > o.y && o.y + o.h > b.y) return true;
        }
        return false;
      }

      /* biggest dots first: they have the least room to give */
      groups.sort(function (a, b) { return +b.getAttribute('data-r') - +a.getAttribute('data-r'); });

      groups.forEach(function (gp) {
        var cx = +gp.getAttribute('data-cx'), cy = +gp.getAttribute('data-cy');
        var r = +gp.getAttribute('data-r');
        var t = gp.querySelector('.sc-lab');
        var line = gp.querySelector('.sc-leader');

        t.setAttribute('text-anchor', 'start');
        t.setAttribute('x', 0); t.setAttribute('y', 0);
        var bb = t.getBBox();
        var w = bb.width, h = bb.height;

        var d = r + 6;
        var cands = [
          { x: cx + d, y: cy + 4, anchor: 'start' },
          { x: cx - d, y: cy + 4, anchor: 'end' },
          { x: cx, y: cy - r - 7, anchor: 'middle' },
          { x: cx, y: cy + r + h - 2, anchor: 'middle' },
          /* diagonals before giving up on being next to the dot at all */
          { x: cx + d * 0.8, y: cy - r - 5, anchor: 'start' },
          { x: cx - d * 0.8, y: cy - r - 5, anchor: 'end' },
          { x: cx + d * 0.8, y: cy + r + h - 3, anchor: 'start' },
          { x: cx - d * 0.8, y: cy + r + h - 3, anchor: 'end' },
          { x: cx + d + 26, y: cy + 4, anchor: 'start' },
          { x: cx - d - 26, y: cy + 4, anchor: 'end' }
        ];
        /* Last resort is the right margin, searched outward from the dot's own
           row rather than from the top of the plot: a label that has to leave
           its dot should still end up beside it, not at the other end of a
           leader line drawn across the whole chart. */
        var home = Math.round((cy - T - 10) / 14);
        for (var k = 0; k < 30; k++) {
          var step = (k % 2 ? -1 : 1) * Math.ceil(k / 2);
          var slot = home + step;
          if (slot < 0 || slot > 26) continue;
          cands.push({ x: L + PW + 8, y: T + 10 + slot * 14, anchor: 'start', far: true });
        }

        var chosen = null;
        for (var i = 0; i < cands.length; i++) {
          var c = cands[i];
          var bx = c.anchor === 'start' ? c.x : (c.anchor === 'end' ? c.x - w : c.x - w / 2);
          var box = { x: bx, y: c.y - h + 3, w: w, h: h };
          if (!c.far && (box.x < L - 2 || box.x + box.w > L + PW + 2 ||
                         box.y < T - 4 || box.y + box.h > T + PH + 2)) continue;
          if (hits(box)) continue;
          chosen = { c: c, box: box };
          break;
        }
        if (!chosen) return;                       /* nothing fits; leave it off */

        t.setAttribute('x', chosen.c.x.toFixed(1));
        t.setAttribute('y', chosen.c.y.toFixed(1));
        t.setAttribute('text-anchor', chosen.c.anchor);
        taken.push(chosen.box);

        if (chosen.c.far) {
          line.setAttribute('x1', (cx + r + 2).toFixed(1));
          line.setAttribute('y1', cy.toFixed(1));
          line.setAttribute('x2', (chosen.c.x - 3).toFixed(1));
          line.setAttribute('y2', (chosen.c.y - 4).toFixed(1));
          line.removeAttribute('visibility');
        }
      });
    });
  }

  /* Pack the chart cards instead of queueing them into rows.
   *
   * A grid row is as tall as its tallest card, so a short chart beside a long
   * one leaves a hole and the next chart starts below both. This measures
   * each card and expresses its height as a span of fine-grained rows, which
   * lets every card sit directly under the one above it in its own column,
   * the card rises into the gap rather than waiting for the next row.
   *
   * Heights are read BEFORE the sizing class goes on, because once the row
   * track is 4px an unspanned card is being measured against a layout it has
   * already broken. Cleared and recomputed on resize, since the column count
   * and the wrapping inside each card both change with width.
   */
  var MASONRY_ROW = 4, MASONRY_GAP = 14;

  function layoutMasonry(root) {
    var grids = Array.prototype.slice.call(root.querySelectorAll('.st-grid'));
    grids.forEach(function (g) {
      var kids = Array.prototype.slice.call(g.children);
      g.classList.remove('masonry');
      kids.forEach(function (c) { c.style.gridRowEnd = ''; });

      /* one column: the natural flow is already correct */
      var cols = getComputedStyle(g).gridTemplateColumns.split(/\s+/).length;
      if (cols < 2 || kids.length < 3) return;

      var heights = kids.map(function (c) { return c.getBoundingClientRect().height; });
      g.classList.add('masonry');
      kids.forEach(function (c, i) {
        c.style.gridRowEnd = 'span ' +
          Math.ceil((heights[i] + MASONRY_GAP) / MASONRY_ROW);
      });
    });
  }

  function valueSection(dev) {
    var charts = costChart(dev) + marketChart(dev) + costPowerChart(dev);
    if (!charts) return '';
    var roots = dev.nodes.filter(function (n) {
      return !n.parent && n.kind !== 'meta' && typeof n.bomPct === 'number' && n.bomPct > 0;
    }).sort(function (a, b) { return b.bomPct - a.bomPct; });
    var lede = roots.length
      ? '<b>' + esc(roots[0].short || roots[0].name) + '</b> is the single largest line in the ' +
        'bill of materials at ' + TD.pct(roots[0].bomPct) + '. But cost and control are different ' +
        'questions: the biggest line is not the tightest market.'
      : '';
    return section('value', 'Cost structure', 'Where the value sits', lede,
      '<div class="st-grid">' + charts + '</div>');
  }

  /* ---------- 4. where the power sits ---------- */

  /* The site's central claim, drawn rather than asserted: concentration
     rises as you move away from the finished product. */
  function tierChart(dev) {
    var tiers = {};
    measured(dev.nodes).forEach(function (n) {
      var d = depthOf(n);
      (tiers[d] = tiers[d] || []).push(n);
    });
    var keys = Object.keys(tiers).map(Number).sort(function (a, b) { return a - b; });
    if (keys.length < 2) return '';

    var TIER_NAME = {
      1: 'The device itself',
      2: 'Its components',
      3: 'Their inputs',
      4: 'Tools and materials',
      5: 'Single-source layers'
    };

    var rows = keys.map(function (d) {
      var list = tiers[d];
      var avg = Math.round(list.reduce(function (a, n) { return a + TD.hhi(n); }, 0) / list.length);
      return { d: d, avg: avg, n: list.length };
    });

    var bars = rows.map(function (r) {
      var band = TD.concentration(r.avg);
      return viz.bar({
        name: 'Tier ' + r.d + ': ' + (TIER_NAME[r.d] || 'deeper still'),
        value: r.avg.toLocaleString('en-US'),
        fill: 'conc-' + band.key,
        width: Math.min(100, r.avg / 100),
        sub: r.n + ' measured layer' + (r.n === 1 ? '' : 's') + ' · average HHI · ' + band.label
      });
    }).join('');

    var first = rows[0], last = rows[rows.length - 1];

    return card('Concentration by tier',
      'Average HHI at each step away from the finished product',
      '<div class="ovc-scale"><span>0</span><span class="ovc-thresh">2,500</span>' +
      '<span>10,000</span></div><div class="ovbars">' + bars + '</div>' +
      '<p class="ovc-gap">Tier 1 averages ' + first.avg.toLocaleString('en-US') +
      '. Tier ' + last.d + ' averages ' + last.avg.toLocaleString('en-US') +
      '. ' + esc((dev.story && dev.story.tierNote) ||
        ('Nothing about a ' + dev.name.toLowerCase() + ' is concentrated until you stop looking at the ' +
         dev.name.toLowerCase() + '.')) + '</p>',
      viz.footer(measured(dev.nodes),
        'Average Herfindahl-Hirschman Index of the layers at each tier',
        'Global, unless a component states otherwise'));
  }

  function powerChart(dev) {
    var meas = measured(dev.nodes);
    if (meas.length < 3) return '';
    var ranked = meas.slice().sort(function (a, b) { return TD.hhi(b) - TD.hhi(a); }).slice(0, 12);

    var bars = ranked.map(function (n) {
      var h = TD.hhi(n), c = TD.concentration(h);
      var lead = TD.rankShares(n).named[0];
      var where = n.parentNode ? esc(n.parentNode.short || n.parentNode.name) + ' · ' : '';
      return viz.bar({
        node: n.id, title: c.label + ': ' + c.hint,
        name: n.short || n.name,
        mark: n.chokepoint ? '<i class="ovbar-choke" title="Chokepoint"></i>' : '',
        value: h.toLocaleString('en-US'),
        fill: 'conc-' + c.key, width: Math.min(100, h / 100),
        sub: where + esc(lead.c) + ' ' + TD.pct(lead.p)
      });
    }).join('');

    var chokes = dev.nodes.filter(function (n) { return n.chokepoint; }).length;

    return card('The tightest layers',
      'Ranked by HHI on a fixed 0–10,000 scale. Dots mark hand-flagged chokepoints',
      '<div class="ovc-scale"><span>0</span><span class="ovc-thresh">2,500</span>' +
      '<span>10,000</span></div><div class="ovbars">' + bars + '</div>' +
      '<p class="ovc-gap">' + chokes + ' layers in this teardown are flagged as chokepoints, ' +
      'narrow enough that a disruption propagates through everything above them.</p>',
      viz.footer(ranked, 'Herfindahl-Hirschman Index on named shares only',
        'Global, unless a component states otherwise'));
  }

  function powerSection(dev) {
    var charts = tierChart(dev) + powerChart(dev);
    if (!charts) return '';
    return section('power', 'Market structure', 'Where the pricing power sits',
      'A regulator calls anything above 2,500 HHI highly concentrated. The interesting question ' +
      'is not which layers cross that line, but how reliably they cross it the deeper you go.',
      '<div class="st-grid">' + charts + '</div>');
  }

  /* ---------- 5. where it breaks ----------
   * The chokepoints are already flagged in the data and already dotted on the
   * charts, but nowhere does the page say what a chokepoint actually costs
   * you. Everything printed here is derived: who holds the layer, what sits
   * above it, and what else in this teardown names it as an input. No
   * scenario is invented: the consequence of a stoppage is simply the list
   * of layers that depend on it.
   */
  function chainAbove(n) {
    var out = [], cur = n.parentNode;
    while (cur) { out.push(cur); cur = cur.parentNode; }
    return out;
  }

  function chokeSection(dev) {
    var chokes = dev.nodes.filter(function (n) { return n.chokepoint; });
    if (chokes.length < 3) return '';

    /* dependants are declared, not guessed: a node names its inputs in
       `upstream`, so the reverse index is exact */
    var dependants = {};
    dev.nodes.forEach(function (n) {
      (n.upstream || []).forEach(function (id) {
        (dependants[id] = dependants[id] || []).push(n);
      });
    });

    chokes.sort(function (a, b) { return TD.hhi(b) - TD.hhi(a); });

    var boxes = chokes.map(function (n) {
      var h = TD.hhi(n), band = TD.concentration(h);
      var r = TD.rankShares(n);
      var lead = r.named[0];
      var above = chainAbove(n);
      var root = above.length ? above[above.length - 1] : n;
      var deps = dependants[n.id] || [];
      var measuredLayer = !!r.named.length;

      var holders = r.named.slice(0, 3).map(function (s) {
        return '<span class="st-holder"><b>' + esc(s.c) + '</b>' + TD.pct(s.p) + '</span>';
      }).join('');

      /* What makes a chokepoint matter, all of it computed: what it sits
         inside, what names it as an input, and what that path is worth. The
         cost rides on the last chip in the chain rather than repeating as a
         sentence on every card, most of these roll up into the same
         component, and thirteen identical closing lines is noise. */
      var reach = [];
      if (above.length) {
        reach.push('Sits inside ' + above.map(function (a, i) {
          var isRoot = (i === above.length - 1);
          var cost = (isRoot && typeof a.bomPct === 'number' && a.bomPct > 0)
            ? '<i class="st-chip-cost">' + TD.pct(a.bomPct) + ' of build cost</i>' : '';
          return '<button class="st-chip" data-node="' + esc(a.id) + '">' +
            esc(a.short || a.name) + cost + '</button>';
        }).join('<span class="st-flow-arrow"> &rarr; </span>'));
      } else if (typeof n.bomPct === 'number' && n.bomPct > 0) {
        reach.push('A top-level component in its own right, ' + TD.pct(n.bomPct) +
          ' of what the device costs to build.');
      }
      if (deps.length) {
        reach.push((deps.length === 1 ? 'One layer names it' : deps.length + ' layers name it') +
          ' as an input: ' + deps.map(function (d) {
            return '<button class="st-chip" data-node="' + esc(d.id) + '">' +
              esc(d.short || d.name) + '</button>';
          }).join(''));
      }

      return '<li class="st-choke conc-fg-' + band.key + '">' +
        '<div class="st-choke-head">' +
          '<button class="st-choke-name" data-node="' + esc(n.id) + '">' +
            esc(n.short || n.name) + '</button>' +
          '<span class="pill conc-' + band.key + '">' + esc(band.label) + '</span>' +
        '</div>' +
        (measuredLayer
          ? '<div class="st-choke-hhi"><b>' + h.toLocaleString('en-US') + '</b> HHI · tier ' +
              depthOf(n) + '</div><div class="st-holders">' + holders + '</div>'
          : '<div class="st-choke-hhi none">Flagged as a chokepoint, but no published ' +
              'share table exists for this layer</div>') +
        '<div class="st-choke-reach">' + reach.map(function (x) {
          return '<p>' + x + '</p>';
        }).join('') + '</div>' +
      '</li>';
    }).join('');

    var single = chokes.filter(function (n) {
      var r = TD.rankShares(n);
      return r.named.length && r.named[0].p >= 50;
    });

    return section('breaks', 'Single points of failure', 'Where it breaks',
      chokes.length + ' of the ' + dev.nodes.length + ' layers in this teardown are ' +
      'flagged as chokepoints, narrow enough that losing the supply propagates upward ' +
      'through everything built on top of them. ' +
      (single.length
        ? single.length + ' of those have a single supplier holding half the layer or more.'
        : ''),
      '<ul class="st-chokes">' + boxes + '</ul>' +
      viz.footer(chokes, 'Layers hand-flagged as chokepoints, ranked by HHI',
        'Global, unless a component states otherwise'));
  }

  /* ---------- 6. where it comes from ---------- */

  function geoStripChart(dev) {
    var rows = dev.nodes.filter(function (n) {
      return !n.parent && n.kind !== 'meta' && (n.shares || []).length &&
             typeof n.bomPct === 'number' && n.bomPct > 0;
    });
    if (rows.length < 2) return '';

    var mix = {}, weight = 0;
    rows.forEach(function (n) {
      weight += n.bomPct;
      TD.geoMix(n).forEach(function (g) { mix[g.geo] = (mix[g.geo] || 0) + g.p * n.bomPct; });
    });
    var total = 0;
    Object.keys(mix).forEach(function (k) { total += mix[k]; });
    if (!total) return '';

    var list = Object.keys(mix).map(function (k) {
      return { p: Math.round(mix[k] / total * 1000) / 10,
               meta: TD.GEO[k] || TD.GEO.ROW, color: TD.geoColor(k) };
    }).sort(function (a, b) { return b.p - a.p; });

    var cover = Math.round(weight * 10) / 10;

    return card('Supplier mix by cost',
      'Every top-level component, weighted by its share of device cost',
      '<div class="ovgeo">' + list.map(function (g) {
        return '<span class="ovgeo-seg" style="width:' + g.p + '%;background:' + g.color +
          '" title="' + esc(g.meta.label) + ' ' + TD.pct(g.p) + '"></span>';
      }).join('') + '</div>' +
      '<div class="ovgeo-key">' + list.map(function (g) {
        return '<span class="ovgeo-item"><i style="background:' + g.color + '"></i>' +
          esc(g.meta.label) + '<b>' + TD.pct(g.p) + '</b></span>';
      }).join('') + '</div>' +
      (cover < 99.5
        ? '<p class="ovc-gap">Covers ' + TD.pct(cover) + ' of device cost: the components with ' +
          'both a share table and a cost weight.</p>'
        : ''),
      viz.footer(rows, 'Supplier home country, weighted by share of device cost',
        'Supplier headquarters, not manufacturing location'));
  }

  /* Deliberately a different weighting from the strip above: this counts
     share points across every measured layer at any depth, which is why the
     Netherlands appears at all: one company, one layer, ninety-one points. */
  function geoRankChart(dev) {
    var pts = {}, positions = {};
    measured(dev.nodes).forEach(function (n) {
      (n.shares || []).forEach(function (s) {
        var g = TD.geoOf(s.c);
        pts[g] = (pts[g] || 0) + s.p;
        positions[g] = (positions[g] || 0) + 1;
      });
    });
    var keys = Object.keys(pts);
    if (keys.length < 2) return '';

    var rows = keys.map(function (k) {
      return { geo: k, pts: Math.round(pts[k]), n: positions[k],
               meta: TD.GEO[k] || TD.GEO.ROW, color: TD.geoColor(k) };
    }).sort(function (a, b) { return b.pts - a.pts; });
    var max = rows[0].pts;

    var bars = rows.map(function (r) {
      return '<div class="ovbar">' +
        '<span class="ovbar-top">' +
          '<span class="ovbar-name">' + esc(r.meta.label) + '</span>' +
          '<span class="ovbar-val">' + r.pts.toLocaleString('en-US') + '</span>' +
        '</span>' +
        '<span class="ovbar-track"><span class="ovbar-fill" style="width:' +
          (r.pts / max * 100) + '%;background:' + r.color + '"></span></span>' +
        '<span class="ovbar-sub">' + r.n + ' supplier position' + (r.n === 1 ? '' : 's') +
          ' across the teardown</span>' +
      '</div>';
    }).join('');

    return card('Countries by share points',
      'Summed percentage points across every measured layer, at any depth',
      '<div class="ovbars">' + bars + '</div>' +
      '<p class="ovc-gap">Share points, not company counts: one supplier holding 91% of one ' +
      'layer outweighs a dozen holding 5% each. That is why this ranks differently from the ' +
      'cost-weighted mix beside it.</p>',
      viz.footer(measured(dev.nodes), 'Summed share points by supplier home country',
        'Supplier headquarters, not manufacturing location'));
  }

  function geoSection(dev) {
    var charts = geoStripChart(dev) + geoRankChart(dev);
    if (!charts) return '';
    /* Device-specific editorial: the point of this section is which single
       country reading contradicts the cost reading, and that differs per
       device. Supplied by the data, with a neutral fallback rather than a
       claim this file is in no position to make. */
    return section('geography', 'Supply geography', 'Where it comes from',
      esc((dev.story && dev.story.geoLede) ||
        ('Two readings of the same question: where the cost of a ' + dev.name.toLowerCase() +
         ' goes, and where its structural leverage actually sits. They are not the same map.')),
      '<div class="st-grid">' + charts + '</div>');
  }

  /* ---------- 7. how it got this way ----------
   * Deliberately not plotted against a value axis. Deal values in this data
   * are free text: "undisclosed", "abandoned", "USD ~8.9bn for ~10%", two in
   * euros, and a chart with a money axis would have to drop, convert or
   * invent every one of those to draw a single bar. Sequence is the honest
   * dimension, so sequence is what this shows.
   */
  function dealTimeline(dev) {
    var all = [];
    dev.nodes.forEach(function (n) {
      (n.deals || []).forEach(function (d) { all.push({ d: d, n: n }); });
    });
    if (all.length < 4) return '';

    all.sort(function (a, b) {
      if (a.d.y !== b.d.y) return a.d.y - b.d.y;
      return String(a.d.a).localeCompare(String(b.d.a));
    });

    var years = [], byYear = {};
    all.forEach(function (x) {
      if (!byYear[x.d.y]) { byYear[x.d.y] = []; years.push(x.d.y); }
      byYear[x.d.y].push(x);
    });

    var body = years.map(function (y) {
      var items = byYear[y].map(function (x) {
        var band = (x.n.shares || []).length
          ? TD.concentration(TD.hhi(x.n)) : null;
        return '<li class="st-deal' + (x.n.chokepoint ? ' choke' : '') + '">' +
          '<div class="st-deal-head">' +
            '<span class="st-deal-party">' + esc(x.d.a) + '</span>' +
            '<span class="st-deal-arrow" aria-label="acquires">&rarr;</span>' +
            '<span class="st-deal-party target">' + esc(x.d.t) + '</span>' +
          '</div>' +
          '<div class="st-deal-meta">' +
            '<button class="st-chip" data-node="' + esc(x.n.id) + '">' +
              esc(x.n.short || x.n.name) + '</button>' +
            (band ? '<span class="st-deal-band conc-fg-' + band.key + '">' +
                      esc(band.short) + '</span>' : '') +
            '<span class="st-deal-v">' + esc(x.d.v || 'value not stated') + '</span>' +
          '</div>' +
          (x.d.n ? '<p class="st-deal-note">' + esc(x.d.n) + '</p>' : '') +
        '</li>';
      }).join('');
      return '<li class="st-year"><div class="st-year-n">' + y + '</div>' +
        '<ol class="st-deal-list">' + items + '</ol></li>';
    }).join('');

    var chokeDeals = all.filter(function (x) { return x.n.chokepoint; }).length;
    var layers = uniqIds(all.map(function (x) { return x.n.id; })).length;

    return section('history', 'Transactions on the record', 'How it got this way',
      all.length + ' recorded transactions between ' + years[0] + ' and ' +
      years[years.length - 1] + ', across ' + layers + ' layers of this teardown. ' +
      (chokeDeals ? chokeDeals + ' of them touch a layer already flagged as a chokepoint. ' : '') +
      'Ordered by date, not by size: the values in this data are stated as reported, ' +
      'and several were never disclosed at all.',
      '<ol class="st-timeline">' + body + '</ol>' +
      viz.footer(uniqNodes(all.map(function (x) { return x.n; })),
        'Announced or completed transactions recorded against each layer',
        'Global'));
  }

  function uniqIds(list) {
    var seen = {}, out = [];
    list.forEach(function (v) { if (!seen[v]) { seen[v] = 1; out.push(v); } });
    return out;
  }

  function uniqNodes(list) {
    var seen = {}, out = [];
    list.forEach(function (n) { if (!seen[n.id]) { seen[n.id] = 1; out.push(n); } });
    return out;
  }

  /* ---------- 8. data and method ---------- */

  function methodSection(dev) {
    var counts = {};
    dev.nodes.forEach(function (n) {
      (n.sources || []).forEach(function (s) {
        var p = TD.sourceMeta(s).publisher;
        counts[p] = (counts[p] || 0) + 1;
      });
    });
    var srcs = Object.keys(counts).sort(function (a, b) { return counts[b] - counts[a]; });

    var conf = { high: 0, medium: 0, low: 0 };
    dev.nodes.forEach(function (n) { conf[n.confidence || 'low']++; });

    var noShares = dev.nodes.filter(function (n) { return !(n.shares || []).length; }).length;

    return section('method', 'Provenance', 'Data and method',
      'Every figure above is read from this teardown\'s own component data. Nothing on this ' +
      'page is interpolated, averaged across devices, or estimated to fill a gap.',
      '<div class="st-grid">' +
        card('Sources behind this teardown',
          srcs.length + ' distinct sources across ' + dev.nodes.length + ' layers',
          '<ul class="st-srclist">' + srcs.map(function (p) {
            var meta = TD.sourceMeta(p);
            return '<li><span class="srctype ' + meta.type + '">' +
              esc(SRC_TYPE_LABEL[meta.type] || meta.type) + '</span>' +
              TD.sourceLink(p) + '<span class="st-srccount">' + counts[p] + '</span></li>';
          }).join('') + '</ul>',
          '<div class="src"><div class="src-row"><span class="src-k">Note</span><span>' +
          'Counts are how many layers cite each source, not how many figures it supports. ' +
          'Every publisher here links to the page it was read from. Four of them name no ' +
          'single retrievable document (they aggregate filings or trade coverage) and are ' +
          'marked rather than linked, with the reason on hover. ' +
          'The full registry is on the <a href="#/sources">sources page</a>.' +
          '</span></div></div>') +
        card('Confidence and coverage',
          'How well measured this teardown actually is',
          '<div class="st-conf">' +
            '<div><span class="conf high">high</span><b>' + conf.high + '</b>' +
              '<span>well covered by trackers and reporting</span></div>' +
            '<div><span class="conf medium">medium</span><b>' + conf.medium + '</b>' +
              '<span>contested definition, or sources disagree</span></div>' +
            '<div><span class="conf low">low</span><b>' + conf.low + '</b>' +
              '<span>reasoned estimate, order of magnitude only</span></div>' +
          '</div>' +
          /* both figures computed, so this paragraph cannot quietly become
             wrong the next time a layer is added or a grade is revised */
          '<p class="ovc-gap">' + noShares + ' of ' + dev.nodes.length + ' layer' +
          (noShares === 1 ? ' carries' : 's carry') + ' no published share table at all and ' +
          (noShares === 1 ? 'is' : 'are') + ' named and placed rather than measured. ' +
          Math.round(conf.low / dev.nodes.length * 100) + '% of this teardown is marked low ' +
          'confidence, mostly the mechanical layers no analyst house covers properly because ' +
          'there is no money in covering them.</p>', '')
      + '</div>');
  }

  /* ---------- integrity ----------
   * The stage strip claims to account for the whole teardown. If that stops
   * being true: a node added without being placed, an id renamed, a stage
   * listing something twice: the page would quietly tell an incomplete
   * story. Better to say so in the console than to look correct.
   */
  function auditStages(dev) {
    var seen = {}, dupes = [], unknown = [];
    (dev.story.stages || []).forEach(function (st) {
      (st.nodes || []).forEach(function (id) {
        if (!dev.byId[id]) unknown.push(st.id + '/' + id);
        else if (seen[id]) dupes.push(id);
        else seen[id] = 1;
      });
    });
    var missing = dev.nodes.filter(function (n) { return !seen[n.id]; })
      .map(function (n) { return n.id; });

    if (unknown.length || dupes.length || missing.length) {
      console.warn('Teardown: "' + dev.id + '" story stages do not account for every node.',
        { unknownIds: unknown, duplicated: dupes, notPlaced: missing });
    }
    return { unknown: unknown, dupes: dupes, missing: missing };
  }

  /* ---------- public ---------- */

  TD.hasStory = function (dev) { return !!(dev && dev.story); };

  TD.renderStory = function (host, dev, h) {
    if (!dev.story) { host.innerHTML = ''; host.hidden = true; return; }
    host.hidden = false;
    TD.storyAudit = auditStages(dev);
    TD.sourceWarnings = TD.auditSources();

    /* A section that has nothing to draw returns '' and is dropped from both
       the page and the nav, so the nav can never point at an anchor that is
       not there. */
    var BUILD = [
      ['overview', 'Overview', overviewSection],
      ['journey', 'How it is built', journeySection],
      ['value', 'Value', valueSection],
      ['power', 'Power', powerSection],
      ['breaks', 'Chokepoints', chokeSection],
      ['geography', 'Geography', geoSection],
      ['history', 'Deals', dealTimeline],
      ['method', 'Method', methodSection]
    ];

    var sections = '', nav = '';
    BUILD.forEach(function (s) {
      var html = s[2](dev);
      if (!html) return;
      sections += html;
      nav += '<button class="st-nav-btn" data-sec="' + s[0] + '">' + esc(s[1]) + '</button>';
    });

    host.innerHTML =
      '<nav class="st-nav" aria-label="Analysis sections"><div class="st-nav-inner">' +
        '<span class="st-nav-label">' + esc(dev.name) + '</span>' + nav +
      '</div></nav>' +
      '<div class="st-body">' + sections + '</div>';

    viz.wireNodes(host, dev, h);
    layoutScatter(host);
    layoutMasonry(host);

    /* Card heights change with width: the column count flips and the text
       inside each card re-wraps, so the packing has to be recomputed. */
    if (host.__storyResize) window.removeEventListener('resize', host.__storyResize);
    var pending = null;
    host.__storyResize = function () {
      if (pending) clearTimeout(pending);
      pending = setTimeout(function () { layoutMasonry(host); }, 120);
    };
    window.addEventListener('resize', host.__storyResize);

    host.querySelectorAll('[data-sec]').forEach(function (b) {
      b.addEventListener('click', function () {
        var t = document.getElementById('st-' + b.getAttribute('data-sec'));
        if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });

    /* highlight the section currently in view */
    if (window.IntersectionObserver) {
      var btns = {};
      host.querySelectorAll('[data-sec]').forEach(function (b) {
        btns[b.getAttribute('data-sec')] = b;
      });
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          var id = e.target.id.replace(/^st-/, '');
          Object.keys(btns).forEach(function (k) { btns[k].classList.toggle('on', k === id); });
        });
      }, { rootMargin: '-45% 0px -50% 0px' });
      host.querySelectorAll('.st-sec').forEach(function (s) { io.observe(s); });
      host.__storyIO = io;
    }
  };

  TD.disposeStory = function (host) {
    if (!host) return;
    if (host.__storyIO) { host.__storyIO.disconnect(); host.__storyIO = null; }
    if (host.__storyResize) {
      window.removeEventListener('resize', host.__storyResize);
      host.__storyResize = null;
    }
  };

})(window.TD);
