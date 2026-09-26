/* Teardown :: device-level overview
 *
 * What a device page shows before you pick a component. Everything here is
 * derived from data already in data/devices/*.js: no figure is introduced,
 * estimated or interpolated by this file. Where a device has not been
 * researched to a given depth, the chart says so instead of filling in.
 *
 * The house position on that: an unmapped share of a cost stack, or a layer
 * with no published share table, is a *finding* about the market, not a hole
 * to be tidied away. Both are drawn as hatched bars rather than omitted.
 */
(function (TD) {
  'use strict';

  var esc = TD.esc;

  /* ---------- selectors ---------- */

  function rootParts(dev) {
    return dev.nodes.filter(function (n) { return !n.parent && n.kind !== 'meta'; });
  }
  function measured(dev) {
    return dev.nodes.filter(function (n) { return (n.shares || []).length > 0; });
  }
  function nonMeta(dev) {
    return dev.nodes.filter(function (n) { return n.kind !== 'meta'; });
  }

  /* ---------- provenance ----------
   * Every chart footer is assembled from the nodes that actually fed it, so
   * a chart can never claim a basis, a year or a source that isn't behind it.
   */
  function uniq(list) {
    var seen = {}, out = [];
    list.forEach(function (v) {
      if (v == null || v === '') return;
      var k = String(v);
      if (!seen[k]) { seen[k] = 1; out.push(v); }
    });
    return out;
  }

  function footer(nodes, measures, geography) {
    var years = uniq(nodes.map(function (n) { return n.market && n.market.year; })).sort();
    var bases = uniq(nodes.map(function (n) { return n.market && n.market.basis; }));
    var srcs = uniq([].concat.apply([], nodes.map(function (n) {
      return (n.sources || []).map(function (s) { return TD.sourceMeta(s).publisher; });
    })));

    var conf = { high: 0, medium: 0, low: 0 };
    nodes.forEach(function (n) { conf[n.confidence || 'low'] = (conf[n.confidence || 'low'] || 0) + 1; });
    var confBits = ['high', 'medium', 'low'].filter(function (k) { return conf[k]; })
      .map(function (k) { return '<span class="conf ' + k + '">' + k + '</span>' + conf[k]; });

    var yearLabel;
    if (years.length === 0) yearLabel = 'year not stated';
    else if (years.length === 1) yearLabel = String(years[0]);
    else yearLabel = years[0] + '–' + years[years.length - 1];

    /* Basis is the load-bearing line: several bases in one chart is normal
       (a device mixes unit-share and revenue-share layers) but it has to be
       visible, not averaged away. */
    var basisLabel = bases.length === 1 ? bases[0]
      : bases.length + ' market definitions, stated per component';

    return '<div class="src">' +
      '<div class="src-row"><span class="src-k">Measures</span><span>' + esc(measures) + '</span></div>' +
      '<div class="src-row"><span class="src-k">Market</span><span>' + esc(basisLabel) + '</span></div>' +
      '<div class="src-row"><span class="src-k">Year</span><span>' + esc(yearLabel) + '</span></div>' +
      '<div class="src-row"><span class="src-k">Geography</span><span>' + esc(geography) + '</span></div>' +
      '<div class="src-row"><span class="src-k">Confidence</span><span class="src-conf">' +
        (confBits.length ? confBits.join(' ') : 'not stated') + '</span></div>' +
      /* A chart drawing on forty layers can cite twenty-five publishers, and
         printing all of them turns the provenance note into the largest
         thing on the card. The named ones are the ones doing the work; the
         tail is counted rather than listed. */
      /* Linked, not printed. Every publisher named under a chart is now a
         way through to the publisher, which is the whole point of keeping a
         registry: a reader should never have to take one of these on trust
         when the document is one click away. */
      '<div class="src-row"><span class="src-k">Sources</span><span>' +
        (srcs.length
          ? srcs.slice(0, 8).map(function (p) { return TD.sourceLink(p); }).join(' · ') +
            (srcs.length > 8
              ? ' <a class="src-more" href="#/sources">and ' + (srcs.length - 8) + ' more</a>'
              : '')
          : 'none recorded for these components') + '</span></div>' +
    '</div>';
  }

  function chart(id, question, headline, body, foot) {
    return '<section class="ovc" data-chart="' + id + '">' +
      '<h3 class="ovc-q">' + question + '</h3>' +
      (headline ? '<p class="ovc-lede">' + headline + '</p>' : '') +
      body + foot +
    '</section>';
  }

  /* One bar row, used for every bar chart on the site. A bar with a `node`
     is a button that opens that component; one without is a plain div.
     `ghost` is separate from that and means something different, this bar
     stands for data that is absent (the un-mapped cost remainder), which is
     why it is styled as a gap rather than a value. A tier average has no
     node to open but is very much not a gap. */
  function bar(o) {
    return (o.node
        ? '<button class="ovbar" data-node="' + esc(o.node) + '"' +
          (o.title ? ' title="' + esc(o.title) + '"' : '') + '>'
        : '<div class="ovbar' + (o.ghost ? ' ghost' : '') + '">') +
      '<span class="ovbar-top">' +
        '<span class="ovbar-name">' + esc(o.name) + (o.mark || '') + '</span>' +
        '<span class="ovbar-val">' + o.value + '</span>' +
      '</span>' +
      '<span class="ovbar-track">' +
        '<span class="ovbar-fill ' + o.fill + '" style="width:' + o.width + '%"></span>' +
      '</span>' +
      (o.sub ? '<span class="ovbar-sub">' + o.sub + '</span>' : '') +
      (o.node ? '</button>' : '</div>');
  }

  /* every node button rendered by this file resolves the same way */
  function wireNodes(root, dev, h) {
    root.querySelectorAll('[data-node]').forEach(function (b) {
      b.addEventListener('click', function () {
        var n = dev.byId[b.getAttribute('data-node')];
        if (n && h.onSelect) h.onSelect(n);
      });
    });
  }

  /* ---------- 1. concentration ----------
   * Ranked on HHI across every measured layer at any depth, because the
   * layers with real pricing power in most of these devices are three or
   * four steps down (lithography, EDA, core IP), not at the surface.
   * Plotted on the absolute 0–10,000 HHI scale rather than scaled to the
   * largest bar, so the 2,500 regulator threshold stays where it belongs.
   */
  function concentrationChart(dev) {
    var meas = measured(dev);
    if (meas.length < 2) return '';

    var ranked = meas.slice().sort(function (a, b) { return TD.hhi(b) - TD.hhi(a); }).slice(0, 8);
    var over = meas.filter(function (n) { return TD.hhi(n) >= 2500; }).length;
    var unmeasured = nonMeta(dev).filter(function (n) { return !(n.shares || []).length; }).length;

    var headline = over
      ? '<b>' + over + ' of ' + meas.length + '</b> measured layers sit above the 2,500 HHI a competition ' +
        'regulator would call highly concentrated.'
      : 'No measured layer reaches the 2,500 HHI a competition regulator would call highly concentrated.';

    var bars = ranked.map(function (n) {
      var h = TD.hhi(n), c = TD.concentration(h);
      var lead = TD.rankShares(n).named[0];
      /* these are ranked across the whole tree, so a bar can be four levels
         down, without its parent, "Optics" or "Light source" is not a
         layer anyone can place */
      var where = n.parentNode ? esc(n.parentNode.short || n.parentNode.name) + ' · ' : '';
      return bar({
        node: n.id,
        title: c.label + ': ' + c.hint,
        name: n.short || n.name,
        mark: n.chokepoint ? '<i class="ovbar-choke" title="Chokepoint"></i>' : '',
        value: h.toLocaleString('en-US'),
        fill: 'conc-' + c.key,
        width: Math.min(100, h / 100),
        sub: where + esc(lead.c) + ' ' + TD.pct(lead.p)
      });
    }).join('');

    var gap = unmeasured > 0
      ? '<p class="ovc-gap">' + unmeasured + ' further mapped component' + (unmeasured === 1 ? '' : 's') +
        ' on this device carr' + (unmeasured === 1 ? 'ies' : 'y') + ' no published share table. ' +
        'Not estimated here.</p>'
      : '';

    return chart('conc', 'Where does the pricing power sit?', headline,
      '<div class="ovc-scale"><span>0</span><span class="ovc-thresh">2,500</span><span>10,000</span></div>' +
      '<div class="ovbars">' + bars + '</div>' + gap,
      footer(ranked, 'Herfindahl-Hirschman Index on named shares only', 'Global, unless a component states otherwise'));
  }

  /* ---------- 2. cost stack ----------
   * bomPct is per-component share of device cost. It rarely sums to 100,
   * the residual is everything not broken out as its own component. That
   * residual is drawn, hatched, rather than dropped, so the bars can't be
   * read as a complete accounting when they aren't one.
   */
  function costChart(dev) {
    var rows = rootParts(dev).filter(function (n) { return typeof n.bomPct === 'number' && n.bomPct > 0; })
      .sort(function (a, b) { return b.bomPct - a.bomPct; });
    if (rows.length < 2) return '';

    var mapped = rows.reduce(function (a, n) { return a + n.bomPct; }, 0);
    mapped = Math.round(mapped * 10) / 10;
    var remainder = Math.round((100 - mapped) * 10) / 10;
    var max = Math.max(rows[0].bomPct, remainder > 0 ? remainder : 0);

    var headline = '<b>' + esc(rows[0].short || rows[0].name) + '</b> is the largest single line at ' +
      TD.pct(rows[0].bomPct) + ' of device cost. ' +
      (remainder > 0.4
        ? 'Named components account for ' + TD.pct(mapped) + ' of the bill of materials.'
        : 'Named components account for the whole bill of materials.');

    var bars = rows.map(function (n) {
      return bar({
        node: n.id, name: n.short || n.name, value: TD.pct(n.bomPct),
        fill: 'cost', width: n.bomPct / max * 100
      });
    }).join('');

    if (remainder > 0.4) {
      bars += bar({
        name: 'Not mapped to a component', value: TD.pct(remainder),
        fill: 'hatch', width: remainder / max * 100, ghost: true
      });
    }

    return chart('cost', 'Where does the cost sit?', headline, '<div class="ovbars">' + bars + '</div>',
      footer(rows, 'Share of device bill-of-materials cost', 'Not geography-specific'));
  }

  /* ---------- 3. geography ----------
   * Each component's supplier mix weighted by that component's share of
   * device cost, so a 39%-of-cost layer counts for more than a 1% one.
   * Components with a share table but no bomPct can't be weighted and are
   * excluded rather than given an invented weight: the footer says how
   * much of the device the answer therefore covers.
   */
  function geoChart(dev) {
    var rows = rootParts(dev).filter(function (n) {
      return (n.shares || []).length && typeof n.bomPct === 'number' && n.bomPct > 0;
    });
    if (rows.length < 2) return '';

    var mix = {}, weight = 0;
    rows.forEach(function (n) {
      weight += n.bomPct;
      TD.geoMix(n).forEach(function (g) {
        mix[g.geo] = (mix[g.geo] || 0) + g.p * n.bomPct;
      });
    });
    var total = 0;
    Object.keys(mix).forEach(function (k) { total += mix[k]; });
    if (!total) return '';

    var list = Object.keys(mix).map(function (k) {
      return { p: Math.round(mix[k] / total * 1000) / 10,
               meta: TD.GEO[k] || TD.GEO.ROW, color: TD.geoColor(k) };
    }).sort(function (a, b) { return b.p - a.p; });

    var top = list[0];
    var headline = '<b>' + esc(top.meta.label) + '</b> supplies ' + TD.pct(top.p) +
      ' of this device by cost-weighted supplier share.';

    var strip = '<div class="ovgeo">' + list.map(function (g) {
      return '<span class="ovgeo-seg" style="width:' + g.p + '%;background:' + g.color + '" ' +
        'title="' + esc(g.meta.label) + ' ' + TD.pct(g.p) + '"></span>';
    }).join('') + '</div>';

    var legend = '<div class="ovgeo-key">' + list.map(function (g) {
      return '<span class="ovgeo-item"><i style="background:' + g.color + '"></i>' +
        esc(g.meta.label) + '<b>' + TD.pct(g.p) + '</b></span>';
    }).join('') + '</div>';

    var cover = Math.round(weight * 10) / 10;
    var gap = cover < 99.5
      ? '<p class="ovc-gap">Covers ' + TD.pct(cover) + ' of device cost: the components that have ' +
        'both a share table and a cost weight. The rest is not counted either way.</p>'
      : '';

    return chart('geo', 'Where does it come from?', headline, strip + legend + gap,
      footer(rows, 'Supplier home country, weighted by share of device cost',
             'Supplier headquarters, not manufacturing location'));
  }

  /* ---------- metrics ----------
   * unit.volume and unit.price are free-text in the device files ("~262m
   * units shipped (2025)"). Split on the leading figure so the card can set
   * it as a figure: this only re-cuts a string that is already there, it
   * never derives or rounds a value.
   */
  function splitUnit(s) {
    var m = /^((?:USD|EUR|GBP|CNY|JPY)?\s*[~<>]?[\d.,]+\S*)\s+([\s\S]+)$/.exec(String(s || '').trim());
    return m ? { v: m[1], sub: m[2] } : { v: s, sub: '', long: true };
  }

  function unitCard(label, text) {
    if (!text) return { k: label, v: null };
    var p = splitUnit(text);
    return { k: label, v: p.v, sub: p.sub, long: p.long };
  }

  TD.deviceMetrics = function (dev) {
    var meas = measured(dev);
    var unit = dev.unit || {};
    var cards = [
      unitCard('Annual volume', unit.volume),
      unitCard('Selling price', unit.price)
    ];

    /* counted over every node, not just the physical ones: an operating
       system or a contract manufacturer is a mapped layer of this supply
       chain that happens not to be a part you can unscrew */
    cards.push({
      k: 'Layers mapped', v: String(dev.nodes.length),
      sub: nonMeta(dev).length + ' physical, ' + meas.length + ' with a share table'
    });

    var over = meas.filter(function (n) { return TD.hhi(n) >= 2500; }).length;
    cards.push({
      k: 'Highly concentrated', v: String(over),
      sub: 'HHI 2,500+, of ' + meas.length + ' measured'
    });

    return cards;
  };

  function metricsHTML(dev) {
    return '<div class="ovmetrics">' + TD.deviceMetrics(dev).map(function (c) {
      return '<div class="ovm' + (c.v == null ? ' ovm-none' : '') + '">' +
        '<div class="ovm-k">' + esc(c.k) + '</div>' +
        '<div class="ovm-v' + (c.long ? ' ovm-v-long' : '') + '">' +
          (c.v == null ? 'Not yet sourced' : esc(c.v)) + '</div>' +
        (c.sub ? '<div class="ovm-s">' + esc(c.sub) + '</div>' : '') +
      '</div>';
    }).join('') + '</div>';
  }

  /* ---------- journey strip ----------
   * Optional per device. `stages` is an ordered list of build phases, each
   * naming components that already exist in the device tree: it groups,
   * it never introduces a component. Numbered because it genuinely is a
   * sequence: silicon exists before a board exists before a device does.
   */
  TD.renderJourney = function (host, dev, h) {
    var stages = (dev.stages || []).map(function (s) {
      return {
        id: s.id, name: s.name, note: s.note,
        nodes: (s.nodes || []).map(function (id) { return dev.byId[id]; }).filter(Boolean)
      };
    }).filter(function (s) { return s.nodes.length; });

    if (!stages.length) { host.innerHTML = ''; host.hidden = true; return; }
    host.hidden = false;

    host.innerHTML =
      '<div class="jrn-head">How this device is built</div>' +
      '<ol class="jrn">' + stages.map(function (s, i) {
        return '<li class="jrn-stage">' +
          '<button class="jrn-btn" data-stage="' + esc(s.id) + '" aria-expanded="false">' +
            '<span class="jrn-n">' + (i < 9 ? '0' : '') + (i + 1) + '</span>' +
            '<span class="jrn-name">' + esc(s.name) + '</span>' +
            '<span class="jrn-count">' + s.nodes.length + '</span>' +
          '</button>' +
        '</li>';
      }).join('') + '</ol>' +
      '<div class="jrn-open" id="jrn-open" hidden></div>';

    var drawer = host.querySelector('#jrn-open');
    /* the buttons come back in the order they were written, so a stage is
       its button's index: no id lookup, and the two lists cannot drift */
    var btns = host.querySelectorAll('[data-stage]');
    var openIndex = -1;

    btns.forEach(function (b, i) {
      b.addEventListener('click', function () {
        openIndex = (openIndex === i) ? -1 : i;

        btns.forEach(function (o, j) {
          o.classList.toggle('on', j === openIndex);
          o.setAttribute('aria-expanded', String(j === openIndex));
        });

        if (openIndex === -1) { drawer.hidden = true; drawer.innerHTML = ''; return; }
        var s = stages[i];
        drawer.hidden = false;
        drawer.innerHTML =
          (s.note ? '<p class="jrn-note">' + esc(s.note) + '</p>' : '') +
          '<div class="chips">' + s.nodes.map(function (n) {
            return '<button class="chip" data-node="' + esc(n.id) + '">' + esc(n.short || n.name) + '</button>';
          }).join('') + '</div>';
        wireNodes(drawer, dev, h);
      });
    });
  };

  /* ---------- shared chart primitives ----------
   * The long-form story (js/story.js) draws the same kind of bars against the
   * same provenance rules, so the primitives are shared rather than copied.
   * Anything that decides how a figure is *presented* belongs here; anything
   * that decides what a figure *is* stays in js/core.js.
   */
  TD.viz = {
    footer: footer,
    bar: bar,
    chart: chart,
    wireNodes: wireNodes,
    uniq: uniq,
    metricsHTML: metricsHTML
  };

  /* ---------- public ---------- */

  TD.renderDeviceOverview = function (host, dev, h) {
    var hasModel = TD.hasModel(dev.id);

    /* A device with a full story renders its charts in the narrative below
       the teardown, so the panel would otherwise show the same three twice.
       Here it stays a short orientation and hands off downwards. Devices
       with no story keep the charts in the panel, exactly as before. */
    var body = dev.story
      ? '<div class="ov-handoff">' +
          '<p>The full analysis for this device runs below the model: how it is built, ' +
          'where the cost sits, where the pricing power sits and where it comes from.</p>' +
          '<button class="btn primary" data-jump="story">Read the full analysis &darr;</button>' +
        '</div>'
      : (concentrationChart(dev) + costChart(dev) + geoChart(dev)) ||
        '<div class="sec"><div class="prov">No device-level figures have been ' +
        'researched for this teardown yet. Open a component for what is known.</div></div>';

    host.innerHTML =
      '<div class="ins-head ov-head">' +
        '<div class="ins-kicker">This device</div>' +
        '<h2>' + esc(dev.name) + '</h2>' +
        '<p class="ins-blurb">' + esc(dev.intro || dev.tagline || '') + '</p>' +
      '</div>' +
      /* a story device shows its headline metrics at the top of the analysis
         below, so repeating them in the panel would say the same thing twice
         on one screen */
      (dev.story ? '' : metricsHTML(dev)) +
      body +
      '<div class="ov-cta">' +
        (hasModel
          ? 'Click a part of the model to see who supplies it. Double click to take that part apart.'
          : 'Click a part to see who supplies it.') +
      '</div>';

    wireNodes(host, dev, h);

    var jump = host.querySelector('[data-jump]');
    if (jump) jump.addEventListener('click', function () {
      var t = document.getElementById('story');
      if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

})(window.TD);
