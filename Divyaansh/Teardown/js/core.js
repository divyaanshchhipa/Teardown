/* Teardown :: core registry and analytics helpers
 * Plain classic script, no modules, so the site runs by double clicking index.html.
 */
(function (global) {
  'use strict';

  var TD = {
    devices: [],
    deviceById: {},
    companies: {},
    nodeIndex: {},      // "deviceId/nodeId" -> node
    companyIndex: {}    // "Company Name" -> [{device, node, share}]
  };

  /* ---------- registration ---------- */

  TD.company = function (map) {
    for (var k in map) {
      if (Object.prototype.hasOwnProperty.call(map, k)) {
        TD.companies[k] = map[k];
        TD.companies[k].name = k;
      }
    }
  };

  TD.sections = [];
  TD.sectionById = {};

  TD.section = function (list) {
    list.forEach(function (s) {
      s.devices = s.devices || [];
      s.planned = s.planned || [];
      TD.sections.push(s);
      TD.sectionById[s.id] = s;
    });
  };

  /* devices resolved for a section, skipping any not yet loaded */
  TD.sectionDevices = function (s) {
    return s.devices.map(function (id) { return TD.deviceById[id]; }).filter(Boolean);
  };

  TD.sectionOf = function (deviceId) {
    for (var i = 0; i < TD.sections.length; i++) {
      if (TD.sections[i].devices.indexOf(deviceId) > -1) return TD.sections[i];
    }
    return null;
  };

  TD.device = function (def) {
    def.nodes = def.nodes || [];
    // build parent / child links
    var byId = {};
    def.nodes.forEach(function (n) {
      n.device = def.id;
      n.children = [];
      n.shares = n.shares || [];
      byId[n.id] = n;
    });
    def.nodes.forEach(function (n) {
      if (n.parent && byId[n.parent]) {
        byId[n.parent].children.push(n);
        n.parentNode = byId[n.parent];
      }
    });
    def.byId = byId;

    TD.devices.push(def);
    TD.deviceById[def.id] = def;

    // global indexes
    def.nodes.forEach(function (n) {
      TD.nodeIndex[def.id + '/' + n.id] = n;
      n.shares.forEach(function (s) {
        (TD.companyIndex[s.c] = TD.companyIndex[s.c] || []).push({
          device: def, node: n, share: s.p
        });
      });
    });
  };

  /* ---------- structure helpers ----------
   * A "root part" is a physical top-level component of the device: no parent,
   * and not a `meta` node (brand, OS, assembly and the like are markets the
   * device sits inside, not pieces of it). This predicate decides what the
   * cost stack sums over, what the schematic draws at the top level, and what
   * `bomPct` has to add up to, so it gets one definition. It used to be
   * written out inline in seven places, plus a `def.roots` on every device
   * that omitted the meta exclusion and was read by nothing.
   */
  TD.rootParts = function (dev) {
    return (dev.nodes || []).filter(function (n) {
      return !n.parent && n.kind !== 'meta';
    });
  };

  /* ---------- validation ----------
   * The registry is the most trusted input in the system and, until this
   * existed, checked nothing: a typo'd `parent` silently promoted a node to
   * the top level, a duplicate id silently overwrote its twin, and shares
   * summing to 130% were accepted and fed to the HHI. All three are quiet
   * data corruption: nothing renders wrong, the numbers are just false.
   *
   * Scope is deliberately *structural* only: things that are unambiguously
   * bugs in the data, not editorial policy. Whether a layer's confidence is
   * justified by its sources, or whether bomPct sums to 100, is judgement the
   * Python gates own, putting it here would print a wall of warnings on
   * every page load for devices that are simply not finished yet, and a
   * warning everyone scrolls past is worse than no warning.
   *
   * Returns an array of { level, device, node, msg }. Call with no arguments
   * to sweep every registered device.
   */
  TD.validate = function (dev) {
    var out = [];
    function bad(d, n, msg) {
      out.push({ level: 'error', device: d.id, node: n, msg: msg });
    }

    (dev ? [dev] : TD.devices).forEach(function (d) {
      var seen = {};
      (d.nodes || []).forEach(function (n) {
        /* duplicate id: byId keeps the last one, so the first silently
           disappears from every lookup while still sitting in `nodes` */
        if (seen[n.id]) bad(d, n.id, 'duplicate node id');
        seen[n.id] = 1;

        /* a parent that does not resolve. TD.device() skips the link without
           complaint, so the node quietly becomes a top-level part and joins
           the cost stack it was never meant to be in. */
        if (n.parent && !n.parentNode) {
          bad(d, n.id, 'parent "' + n.parent + '" does not exist in this device');
        }

        var shares = n.shares || [];
        var sum = 0;
        shares.forEach(function (s) {
          if (!s || typeof s.c !== 'string' || !s.c) {
            bad(d, n.id, 'a share entry names no company');
            return;
          }
          if (typeof s.p !== 'number' || !isFinite(s.p) || s.p < 0) {
            bad(d, n.id, 'share for "' + s.c + '" is not a positive number');
            return;
          }
          sum += s.p;
          if (!TD.companies[s.c]) {
            bad(d, n.id, 'company "' + s.c + '" is not in data/companies.js');
          }
        });
        /* a little slack for rounding across a dozen hand-entered figures */
        if (sum > 100.5) {
          bad(d, n.id, 'shares sum to ' + (Math.round(sum * 10) / 10) + '%');
        }

        /* an explicit residual that contradicts the table it belongs to */
        if (typeof n.others === 'number' && n.others < 0) {
          bad(d, n.id, 'others is negative');
        }
      });
    });

    /* 3D geometry pointing at parts that do not exist */
    Object.keys(TD.models || {}).forEach(function (key) {
      var devId = key.split('/')[0], d = TD.deviceById[devId];
      if (dev && devId !== dev.id) return;
      if (!d) {
        out.push({ level: 'error', device: devId, node: null,
                   msg: 'model "' + key + '" has no matching device' });
        return;
      }
      (TD.models[key].parts || []).forEach(function (p) {
        if (!d.byId[p.node]) {
          out.push({ level: 'error', device: devId, node: p.node,
                     msg: 'model "' + key + '" references a node that does not exist' });
        }
      });
    });

    return out;
  };

  /* Console report, called once at boot from js/app.js. Grouped by device so
     one broken file reads as one problem rather than forty. */
  TD.reportValidation = function () {
    var probs = TD.validate();
    if (!probs.length) return probs;
    var byDevice = {};
    probs.forEach(function (p) {
      (byDevice[p.device] = byDevice[p.device] || []).push(
        (p.node ? p.node + ': ' : '') + p.msg);
    });
    console.warn('Teardown: ' + probs.length + ' data integrity problem' +
      (probs.length === 1 ? '' : 's') + ' found at load. These are structural ' +
      'defects, not unfinished research, run tools/datacheck.py for the ' +
      'editorial gates.');
    Object.keys(byDevice).forEach(function (k) {
      console.warn('  ' + k + ' (' + byDevice[k].length + ')', byDevice[k]);
    });
    return probs;
  };

  /* ---------- share list logic ----------
   * House rule, applied everywhere:
   *   1. Any player at 10.0% or above is always named.
   *   2. The top 5 are always named, however small they are, so that a
   *      near monopoly still shows who the remaining alternatives are.
   *   3. Beyond that, keep naming in descending order until cumulative
   *      coverage reaches 85%, capped at 15 names.
   *   4. Everything left over collapses into "Others".
   * Rule 1 alone would print one name for lithography and nothing at all for
   * fragmented layers like hinges. Rules 2 and 3 fill both gaps.
   */
  TD.COVERAGE_TARGET = 85;
  TD.HARD_FLOOR = 10;
  TD.MIN_NAMED = 5;
  TD.MAX_NAMED = 15;

  TD.rankShares = function (node) {
    var list = (node.shares || []).slice().sort(function (a, b) { return b.p - a.p; });
    var named = [], cum = 0;
    for (var i = 0; i < list.length; i++) {
      var s = list[i];
      var mustName = s.p >= TD.HARD_FLOOR;
      var underMin = named.length < TD.MIN_NAMED;
      var underTarget = cum < TD.COVERAGE_TARGET;
      if ((mustName || underMin || underTarget) && named.length < TD.MAX_NAMED) {
        named.push(s);
        cum += s.p;
      } else break;
    }
    var namedTotal = named.reduce(function (a, s) { return a + s.p; }, 0);
    var others = Math.max(0, Math.round((100 - namedTotal) * 10) / 10);
    if (typeof node.others === 'number') others = node.others;
    return { named: named, others: others, coverage: namedTotal };
  };

  /* ---------- sources ----------
   * A node's `sources` array has always just been a list of publisher name
   * strings ('TrendForce', 'Company filings'). Rather than migrating every
   * device file to a richer object shape (a real risk of touching values by
   * hand across ~150 nodes), sourceMeta() reads either shape at render time:
   * a string stays a bare publisher name, an object can carry url/date/type/
   * note going forward. `type` defaults from the name itself when absent,
   * "…filings", "…disclosures" and "…statements" read as the company or a
   * regulator speaking directly (primary); everything else (trackers, trade
   * associations, government stats agencies) is a third party compiling or
   * estimating the figure. This is inferred from wording already in the
   * data, not fabricated: nothing here invents a link, a date or a fact. */
  /* Publisher-level provenance, registered once by data/sources.js. Keeping
     it here rather than inline on every node means a citation added anywhere
     inherits a URL, a document type and a statement of what is really being
     cited, and that the same publisher cannot end up described two ways on
     two different components. */
  TD.SOURCES = {};
  TD.sourceRegistry = function (table) {
    for (var k in table) if (table.hasOwnProperty(k)) TD.SOURCES[k] = table[k];
  };

  /* One definition of what a citation looks like on screen, because there are
     four places that render one (the inspector drawer, every chart footer,
     the story's method section and the sources page) and they had drifted:
     only the inspector linked anything, so the same publisher was clickable
     in one panel and inert in the next.

     A publisher with no URL is not silently rendered as plain text either.
     Four of the ninety-nine are genuine catch-alls that name no single
     retrievable document, and between them they carry 40% of all citations,
     so they get a marker and their reason on hover rather than looking like
     a link that failed. Saying "there is nothing to link to, and here is why"
     is the honest version. */
  TD.sourceLink = function (entry, cls) {
    var m = TD.sourceMeta(entry);
    var name = TD.esc(m.publisher);
    var extra = cls ? ' ' + cls : '';
    if (m.url) {
      return '<a class="srclink' + extra + '" href="' + TD.esc(m.url) +
             '" target="_blank" rel="noopener noreferrer"' +
             (m.note ? ' title="' + TD.esc(m.note) + '"' : '') + '>' + name + '</a>';
    }
    return '<span class="srclink nolink' + extra + '"' +
           ' title="' + TD.esc(m.note || 'No single retrievable document for this source.') +
           '">' + name + '</span>';
  };

  TD.sourceMeta = function (entry) {
    var s = (typeof entry === 'string') ? { publisher: entry } : (entry || {});
    var name = s.publisher || '';
    var reg = TD.SOURCES[name] || {};
    /* Fallback for a publisher not yet in the registry: infer the type from
       the wording, as before, so an unregistered citation still renders. It
       is reported as unlocatable rather than silently passing for sourced. */
    var inferred = /filing|disclosure|statement/i.test(name) ? 'primary' : 'third-party';
    return {
      publisher: name || 'Unattributed',
      type: s.type || reg.type || inferred,
      url: s.url || reg.url || null,
      date: s.date || reg.date || null,
      note: s.note || reg.note || null,
      registered: !!TD.SOURCES[name]
    };
  };

  /* Every publisher named by a device, with how many layers cite it. Drives
     the method section and the provenance gate.
     Pass a device to audit one; omit it to audit every loaded device. */
  TD.sourceAudit = function (dev) {
    var counts = {}, unregistered = [];
    (dev ? [dev] : TD.devices).forEach(function (d) {
      d.nodes.forEach(function (n) {
        (n.sources || []).forEach(function (s) {
          var m = TD.sourceMeta(s);
          counts[m.publisher] = (counts[m.publisher] || 0) + 1;
          if (!m.registered && unregistered.indexOf(m.publisher) < 0) {
            unregistered.push(m.publisher);
          }
        });
      });
    });
    return { counts: counts, unregistered: unregistered };
  };

  /* Warn only for devices that have been through a provenance pass, the
     ones carrying a `story` block. The rest are queued for the same
     treatment, and warning about all of them on every load would train
     everyone to ignore the message before it ever caught a real regression. */
  TD.auditSources = function () {
    var missing = [];
    TD.devices.forEach(function (d) {
      if (!d.story) return;
      TD.sourceAudit(d).unregistered.forEach(function (p) {
        missing.push(d.id + ': ' + p);
      });
    });
    if (missing.length) {
      console.warn('Teardown: sources with no entry in data/sources.js, ' +
        'they render without provenance.', missing);
    }
    return missing;
  };

  TD.CONFIDENCE = {
    high:   { label: 'High',   hint: 'Well covered by published trackers and company reporting. Unlikely to be off by more than two or three points.' },
    medium: { label: 'Medium', hint: 'The market definition is contested, or sources disagree with each other.' },
    low:    { label: 'Low',    hint: 'A reasoned estimate from filings and fragmentary coverage. Treat as an order of magnitude, not a measurement.' }
  };

  /* ---------- concentration ---------- */

  // Herfindahl-Hirschman Index on the disclosed shares. Residual "others" is
  // treated as many small players, which is the conservative reading.
  TD.hhi = function (node) {
    var r = TD.rankShares(node);
    var h = r.named.reduce(function (a, s) { return a + s.p * s.p; }, 0);
    return Math.round(h);
  };

  /* How much of the market the named players actually account for.
     HHI is computed over named shares only, so a layer where the research
     named three suppliers covering 12% of the market scores a very low HHI
     and sorts to the top of any "most fragmented" list: when what was
     really measured is how little has been published, not how the market
     is structured. Coverage is the one number that separates those two
     readings, so anything ranking *by* low concentration has to consult it.
     The residual is conservative in the concentration direction and
     anti-conservative in the fragmentation direction; this is that second
     case, and it needs its own guard. */
  TD.MIN_COVERAGE = 60;

  TD.coverage = function (node) {
    return TD.rankShares(node).coverage;
  };

  /* True when too little of the layer is named for its band to be read as a
     statement about market structure. */
  TD.isProvisional = function (node) {
    return !(node.shares || []).length || TD.coverage(node) < TD.MIN_COVERAGE;
  };

  // short labels are used on the schematic tiles, where width is scarce.
  // `coverage` is optional: pass it and a thinly-named layer is flagged
  // provisional rather than silently presented as a measured structure.
  TD.concentration = function (hhi, coverage) {
    var band;
    if (hhi >= 5000) band = { key: 'monopoly', label: 'Near monopoly', short: 'NEAR MONOPOLY', hint: 'One player sets the terms. Entry is capital or IP blocked.' };
    else if (hhi >= 2500) band = { key: 'high', label: 'Highly concentrated', short: 'CONCENTRATED', hint: 'Oligopoly. Pricing power sits with two or three firms.' };
    else if (hhi >= 1500) band = { key: 'moderate', label: 'Moderately concentrated', short: 'MODERATE', hint: 'Clear leaders, but the tail still competes.' };
    else if (hhi >= 750) band = { key: 'competitive', label: 'Competitive', short: 'COMPETITIVE', hint: 'No structural winner. Scale is earned, not owned.' };
    else band = { key: 'fragmented', label: 'Fragmented', short: 'FRAGMENTED', hint: 'Roll up territory. Nobody has escaped the pack.' };

    if (typeof coverage === 'number' && coverage < TD.MIN_COVERAGE) {
      band.provisional = true;
      band.hint = 'Only ' + TD.pct(coverage) + ' of this market is named, so this band ' +
        'reports how little is published as much as how the market is structured. ' +
        'Read it as a gap, not as a finding.';
    }
    return band;
  };

  TD.cr4 = function (node) {
    var list = (node.shares || []).slice().sort(function (a, b) { return b.p - a.p; });
    return Math.round(list.slice(0, 4).reduce(function (a, s) { return a + s.p; }, 0) * 10) / 10;
  };

  /* ---------- geography ---------- */

  /* Geography is the site's second analytical colour ramp, and the only one
     applied as an inline style rather than a CSS class, so unlike the
     concentration bands it cannot be re-themed by a stylesheet override.
     Each region therefore carries both readings. Hue is identical in both:
     Taiwan is orange either way. Only lightness moves, so that a slate or
     an olive still separates from a dark ground instead of sinking into it. */
  /* `color` is the swatch: a filled block, where a mid-tone reads fine.
     `ink` is the same region used as *type*, which needs far more contrast:
     Taiwan's orange measures 2.80:1 against the page as text. The dark
     readings are light enough to serve as both. */
  TD.GEO = {
    'US':  { label: 'United States',  color: '#2f6fd0', ink: '#2f6fd0', dark: '#5a90e8' },
    'TW':  { label: 'Taiwan',         color: '#e07a2b', ink: '#af5b1a', dark: '#f0913f' },
    'KR':  { label: 'South Korea',    color: '#7a5cc7', ink: '#7a5cc7', dark: '#9b7ee0' },
    'CN':  { label: 'Mainland China', color: '#c9403f', ink: '#c9403f', dark: '#e0625f' },
    'JP':  { label: 'Japan',          color: '#1e9a8a', ink: '#197e71', dark: '#2fb8a5' },
    'NL':  { label: 'Netherlands',    color: '#0f8fb0', ink: '#0d7a96', dark: '#2aa8c9' },
    'DE':  { label: 'Germany',        color: '#5a6b7d', ink: '#5a6b7d', dark: '#8ea3ba' },
    'IN':  { label: 'India',          color: '#2e9147', ink: '#29823f', dark: '#48b062' },
    /* Added for the tractor's emissions chain. South Africa is ~70% of world
       platinum and the largest source of rhodium, which gates every diesel
       aftertreatment system on the site, and it turns up again in the EV and
       aircraft chains. Folding that into "rest of world" hid the single most
       concentrated geography in the mechanical half of the catalogue. */
    'ZA':  { label: 'South Africa',   color: '#b8791f', ink: '#8a5712', dark: '#d99a3d' },
    'EU':  { label: 'Europe (other)', color: '#8a7f5c', ink: '#7b7152', dark: '#b5a578' },
    'ROW': { label: 'Rest of world',  color: '#98a2ae', ink: '#667382', dark: '#9daabb' }
  };

  TD.geoOf = function (companyName) {
    var c = TD.companies[companyName];
    return (c && c.hq) || 'ROW';
  };

  /* the one place a region's colour is resolved, call this rather than
     reading `.color`, or half the site stops following the theme */
  TD.geoColor = function (geoKey) {
    var g = TD.GEO[geoKey] || TD.GEO.ROW;
    return (TD.theme() === 'dark' && g.dark) ? g.dark : g.color;
  };

  /* the same region set as *type* rather than as a filled swatch */
  TD.geoInk = function (geoKey) {
    var g = TD.GEO[geoKey] || TD.GEO.ROW;
    return (TD.theme() === 'dark') ? (g.dark || g.color) : (g.ink || g.color);
  };

  TD.colorOf = function (companyName) {
    return TD.geoColor(TD.geoOf(companyName));
  };

  /* ---------- theme ----------
   * A `data-theme` attribute on the root element is the single source of
   * truth. index.html sets it before first paint so nothing flashes.
   * Everything that bakes a colour at draw time (the three renderers, the
   * inline geography swatches) subscribes here and redraws.
   */
  var themeSubs = [];

  /* Same resolution as the inline bootstrap, applied again here and
   * idempotently. The embed build is styles-plus-body only, so it drops the
   * head bootstrap entirely, without this, a host page embedding Teardown
   * would always get light regardless of the reader's preference. Runs
   * before any view is drawn, so it costs at most one frame there and
   * nothing at all in the full build, where the attribute is already set. */
  (function bootstrapTheme() {
    var root = global.document && global.document.documentElement;
    if (!root || root.getAttribute('data-theme')) return;
    var t;
    try { t = localStorage.getItem('td-theme'); } catch (e) { /* file:// may refuse */ }
    if (t !== 'light' && t !== 'dark') {
      t = (global.matchMedia && global.matchMedia('(prefers-color-scheme: dark)').matches)
        ? 'dark' : 'light';
    }
    root.setAttribute('data-theme', t);
  })();

  TD.theme = function () {
    return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  };

  TD.setTheme = function (t) {
    t = (t === 'dark') ? 'dark' : 'light';
    if (TD.theme() === t) return t;
    document.documentElement.setAttribute('data-theme', t);
    /* file:// origins can refuse storage entirely; losing the preference is
       acceptable, losing the theme switch is not */
    try { localStorage.setItem('td-theme', t); } catch (e) { /* no persistence */ }
    themeSubs.forEach(function (fn) { try { fn(t); } catch (e) { console.warn(e); } });
    return t;
  };

  TD.onTheme = function (fn) { themeSubs.push(fn); };

  // Supply chain geography of a single node, by summed share.
  TD.geoMix = function (node) {
    var mix = {};
    (node.shares || []).forEach(function (s) {
      var g = TD.geoOf(s.c);
      mix[g] = (mix[g] || 0) + s.p;
    });
    return Object.keys(mix).map(function (k) {
      return { geo: k, p: Math.round(mix[k] * 10) / 10 };
    }).sort(function (a, b) { return b.p - a.p; });
  };

  /* ---------- tree helpers ---------- */

  TD.path = function (node) {
    var out = [], cur = node;
    while (cur) { out.unshift(cur); cur = cur.parentNode; }
    return out;
  };

  TD.descendants = function (node) {
    var out = [];
    (function walk(n) {
      (n.children || []).forEach(function (c) { out.push(c); walk(c); });
    })(node);
    return out;
  };

  /* ---------- search ---------- */

  TD.search = function (q) {
    q = (q || '').trim().toLowerCase();
    if (q.length < 2) return [];
    var hits = [];

    TD.devices.forEach(function (d) {
      if (d.name.toLowerCase().indexOf(q) > -1) {
        hits.push({ kind: 'device', label: d.name, sub: d.category, device: d });
      }
      d.nodes.forEach(function (n) {
        var hay = (n.name + ' ' + (n.blurb || '')).toLowerCase();
        if (hay.indexOf(q) > -1) {
          hits.push({ kind: 'node', label: n.name, sub: d.name, device: d, node: n });
        }
      });
    });

    Object.keys(TD.companyIndex).forEach(function (name) {
      if (name.toLowerCase().indexOf(q) > -1) {
        hits.push({
          kind: 'company', label: name,
          sub: TD.companyIndex[name].length + ' position' + (TD.companyIndex[name].length === 1 ? '' : 's'),
          company: name
        });
      }
    });

    var order = { company: 0, node: 1, device: 2 };
    hits.sort(function (a, b) {
      var ka = a.label.toLowerCase().indexOf(q) === 0 ? 0 : 1;
      var kb = b.label.toLowerCase().indexOf(q) === 0 ? 0 : 1;
      if (ka !== kb) return ka - kb;
      return order[a.kind] - order[b.kind];
    });
    return hits.slice(0, 24);
  };

  /* ---------- formatting ---------- */

  TD.pct = function (v) {
    return (Math.round(v * 10) / 10).toString().replace(/\.0$/, '') + '%';
  };

  TD.esc = function (s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  };

  global.TD = TD;
})(window);
