/* Teardown :: inspector panel */
(function (TD) {
  'use strict';

  var esc = TD.esc;

  function sharesHTML(node) {
    var r = TD.rankShares(node);
    if (!r.named.length) return '<div class="prov">No share table at this level. Break it down.</div>';
    var max = r.named[0].p || 1;
    var out = r.named.map(function (s) {
      var geo = TD.GEO[TD.geoOf(s.c)] || TD.GEO.ROW;
      var known = !!TD.companies[s.c];
      return '<button class="bar" data-company="' + esc(s.c) + '"' + (known ? '' : ' disabled') + '>' +
        '<span class="brow">' +
          '<span class="bname">' + esc(s.c) + '</span>' +
          '<span class="bflag">' + esc(geo.label) + '</span>' +
          '<span class="bpct">' + TD.pct(s.p) + '</span>' +
        '</span>' +
        '<span class="btrack"><span class="bfill" style="width:' + (s.p / max * 100) + '%;background:' + TD.colorOf(s.c) + '"></span></span>' +
      '</button>';
    }).join('');

    if (r.others > 0.4) {
      out += '<button class="bar others" disabled>' +
        '<span class="brow"><span class="bname">Others</span>' +
        '<span class="bpct">' + TD.pct(r.others) + '</span></span>' +
        '<span class="btrack"><span class="bfill" style="width:' + (r.others / max * 100) + '%"></span></span>' +
      '</button>';
    }
    return out;
  }

  function concHTML(node) {
    if (!node.shares || !node.shares.length) return '';
    var h = TD.hhi(node), c = TD.concentration(h), cr = TD.cr4(node);
    var fill = Math.min(100, h / 60);
    return '<div class="sec">' +
      '<h3>Concentration</h3>' +
      '<div class="conclabel">' + esc(c.label) + '</div>' +
      '<div class="meter"><i class="conc-' + c.key + '" style="width:' + fill + '%"></i></div>' +
      '<div class="conchint">' + esc(c.hint) + '</div>' +
      '<div class="prov" style="margin-top:8px">HHI <b>' + h + '</b> on disclosed shares. ' +
      'Top four hold <b>' + TD.pct(cr) + '</b>.</div>' +
    '</div>';
  }

  function statsHTML(node) {
    var cells = [];
    if (node.market && node.market.size) {
      cells.push(['Market size', esc(node.market.size) + ' <small>' + esc(node.market.year || '') + '</small>']);
    }
    if (typeof node.bomPct === 'number' && node.bomPct > 0) {
      cells.push(['Share of device cost', TD.pct(node.bomPct)]);
    }
    if (node.shares && node.shares.length) {
      cells.push(['Named players', String(TD.rankShares(node).named.length)]);
      cells.push(['Leader', esc(TD.rankShares(node).named[0].c)]);
    }
    if (!cells.length) return '';
    if (cells.length % 2) cells.push(['', '']);
    return '<div class="stats">' + cells.map(function (c) {
      return '<div class="stat"><div class="k">' + c[0] + '</div><div class="v">' + c[1] + '</div></div>';
    }).join('') + '</div>';
  }

  function dealsHTML(node) {
    if (!node.deals || !node.deals.length) return '';
    return '<div class="sec"><h3>Selected transactions</h3>' +
      node.deals.map(function (d) {
        return '<div class="deal">' +
          '<div class="dh"><span class="dy">' + esc(d.y) + '</span> &nbsp;' + esc(d.a) + ' / ' + esc(d.t) +
          ' &nbsp;<span class="dv">' + esc(d.v) + '</span></div>' +
          '<div class="dn">' + esc(d.n) + '</div>' +
        '</div>';
      }).join('') + '</div>';
  }

  /* Three grades, not two. "Derived" is the one that matters: it marks a
     share nobody actually published, reconciled from disclosures that were
     never meant to add up to a market. It used to be filed as Primary,
     because the word "filings" appeared in the source name, which read as
     the strongest grade on the site while being the weakest. */
  var SRC_TYPE_LABEL = {
    primary: 'Primary', 'third-party': 'Third-party', derived: 'Derived'
  };

  /* Basis, confidence and sources used to sit open at the foot of every
     inspector, which meant the longest block on the panel was the one you
     read least often. It now collapses into a drawer whose summary line
     still carries the two things that must never be a click away, the
     market definition and the confidence grade. Native <details>, so it
     works with no JavaScript behind it and keyboard-toggles for free. */
  function provHTML(node) {
    var conf = node.confidence || 'low';
    var confMeta = TD.CONFIDENCE[conf];
    var sources = (node.sources || []).map(TD.sourceMeta);

    var summary =
      '<summary class="srcsum">' +
        '<span class="srcsum-lead">' +
          '<span class="conf ' + conf + '">' + conf + '</span>' +
          '<span class="srcsum-basis">' +
            (node.market && node.market.basis ? esc(node.market.basis) : 'basis not stated') +
          '</span>' +
        '</span>' +
        '<span class="srcsum-more">' +
          (sources.length ? sources.length + ' source' + (sources.length === 1 ? '' : 's') : 'No source') +
        '</span>' +
      '</summary>';

    var bits = [];
    if (node.asOf) bits.push('As of <b>' + esc(node.asOf) + '</b>.');
    if (confMeta) bits.push(esc(confMeta.hint));

    var sourceList = sources.length
      ? '<ul class="srclist">' + sources.map(function (s) {
          return '<li><span class="srctype ' + s.type + '">' + esc(SRC_TYPE_LABEL[s.type] || s.type) + '</span>' +
            TD.sourceLink(s) + (s.date ? ' <span class="srcdate">' + esc(s.date) + '</span>' : '') +
            (s.note ? '<div class="srcnote">' + esc(s.note) + '</div>' : '') + '</li>';
        }).join('') + '</ul>'
      : '<div class="prov">No source recorded for this component yet.</div>';

    return '<details class="srcdrawer">' + summary +
      '<div class="srcdrawer-body">' +
        (bits.length ? '<div class="prov">' + bits.join(' ') + '</div>' : '') +
        sourceList +
        '<div class="prov srcfoot"><b>Primary</b> is the company or a regulator speaking ' +
        'directly: a filing, a disclosure. <b>Third-party</b> is a tracker, trade association or ' +
        'analyst house compiling the figure from outside. <b>Derived</b> means nobody published this ' +
        'share at all: it is reconciled from disclosures that were never meant to add up to a market, ' +
        'so the ranking is firmer than the numbers. See <span class="lnk" role="link" tabindex="0" ' +
        'data-goto="about">Method</span> for how confidence is assessed.</div>' +
      '</div>' +
    '</details>';
  }

  function childrenHTML(node) {
    var kids = (node.children || []);
    if (!kids.length) return '';
    return '<div class="sec"><h3>Break down further</h3><div class="chips">' +
      kids.map(function (k) {
        return '<button class="chip" data-node="' + esc(k.id) + '">' + esc(k.short || k.name) + '</button>';
      }).join('') + '</div></div>';
  }

  function upstreamHTML(node) {
    if (!node.upstream || !node.upstream.length) return '';
    var links = node.upstream.map(function (id) {
      var t = TD.deviceById[node.device] && TD.deviceById[node.device].byId[id];
      return t ? '<button class="chip" data-node="' + esc(t.id) + '">' + esc(t.name) + '</button>' : '';
    }).join('');
    if (!links) return '';
    return '<div class="sec"><h3>Shares an upstream chain with</h3><div class="chips">' + links + '</div></div>';
  }

  /* ---------- public ---------- */

  TD.renderInspector = function (host, node, h) {
    var dev = TD.deviceById[node.device];
    var trail = TD.path(node).slice(0, -1).map(function (p) { return p.short || p.name; });
    var kicker = [dev ? dev.name : ''].concat(trail).filter(Boolean).join('  ›  ');

    host.innerHTML =
      '<div class="ins-head">' +
        '<div class="ins-kicker">' + esc(kicker) + '</div>' +
        '<h2>' + esc(node.name) + '</h2>' +
        (node.chokepoint ? '<span class="badge choke">Chokepoint</span>' : '') +
        (node.kind === 'meta' ? '<span class="badge meta">Not a physical part</span>' : '') +
        '<p class="ins-blurb">' + esc(node.blurb || '') + '</p>' +
        (TD.canOpen(node) ? '<button class="btn primary" id="ins-open" style="margin-top:10px">Dismantle this →</button>' : '') +
      '</div>' +
      statsHTML(node) +
      (node.shares && node.shares.length ? '<div class="sec"><h3>Who holds it</h3>' + sharesHTML(node) + '</div>' : '') +
      concHTML(node) +
      (node.note ? '<div class="sec"><h3>What that means</h3><div class="note">' + esc(node.note) + '</div></div>' : '') +
      dealsHTML(node) +
      upstreamHTML(node) +
      childrenHTML(node) +
      provHTML(node);

    var ob = host.querySelector('#ins-open');
    if (ob) ob.addEventListener('click', function () { h.onOpen(node); });

    host.querySelectorAll('[data-company]').forEach(function (b) {
      b.addEventListener('click', function () { h.onCompany(b.getAttribute('data-company')); });
    });
    host.querySelectorAll('[data-node]').forEach(function (b) {
      b.addEventListener('click', function () {
        var t = dev.byId[b.getAttribute('data-node')];
        if (t) h.onSelect(t);
      });
    });
    host.querySelectorAll('[data-goto]').forEach(function (b) {
      b.addEventListener('click', function () { h.onGoto(b.getAttribute('data-goto')); });
      b.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); h.onGoto(b.getAttribute('data-goto')); }
      });
    });
  };

  TD.renderCompany = function (host, name, h) {
    var meta = TD.companies[name] || {};
    var geo = TD.GEO[meta.hq || 'ROW'] || TD.GEO.ROW;
    var geoCol = TD.geoColor(meta.hq || 'ROW');
    var pos = (TD.companyIndex[name] || []).slice().sort(function (a, b) { return b.share - a.share; });

    var types = { pub: 'Listed', pri: 'Private', sub: 'Subsidiary', soe: 'State linked',
                  jv: 'Joint venture', agg: 'Country aggregate, not a single firm' };
    var lines = [];
    lines.push('<span style="color:' + TD.geoInk(meta.hq || 'ROW') +
               ';font-weight:600">' + esc(geo.label) + '</span>');
    if (meta.type) lines.push(esc(types[meta.type] || meta.type));
    if (meta.ticker) lines.push('<b>' + esc(meta.ticker) + '</b>');
    if (meta.note) lines.push('<em>' + esc(meta.note) + '</em>');

    var over10 = pos.filter(function (p) { return p.share >= 10; }).length;
    var lead = pos.filter(function (p) { return TD.rankShares(p.node).named[0].c === name; }).length;

    host.innerHTML =
      '<div class="ins-head">' +
        '<div class="ins-kicker">Company</div>' +
        '<h2>' + esc(name) + '</h2>' +
        '<p class="ins-blurb">' + lines.join(' &nbsp;·&nbsp; ') + '</p>' +
      '</div>' +
      '<div class="stats">' +
        '<div class="stat"><div class="k">Positions on this site</div><div class="v">' + pos.length + '</div></div>' +
        '<div class="stat"><div class="k">Where it leads</div><div class="v">' + lead + '</div></div>' +
        '<div class="stat"><div class="k">Above 10%</div><div class="v">' + over10 + '</div></div>' +
        '<div class="stat"><div class="k">Categories</div><div class="v">' +
          new Set(pos.map(function (p) { return p.device.id; })).size + '</div></div>' +
      '</div>' +
      '<div class="sec"><h3>Every position, largest first</h3>' +
        (pos.length ? pos.map(function (p) {
          var isLead = TD.rankShares(p.node).named[0].c === name;
          return '<button class="bar" data-goto="' + esc(p.device.id + '/' + p.node.id) + '">' +
            '<span class="brow">' +
              '<span class="bname">' + esc(p.node.name) + '</span>' +
              '<span class="bflag">' + esc(p.device.name) + '</span>' +
              '<span class="bpct">' + TD.pct(p.share) + '</span>' +
            '</span>' +
            '<span class="btrack"><span class="bfill" style="width:' + p.share + '%;background:' +
              (isLead ? geoCol : 'var(--line-2)') + '"></span></span>' +
          '</button>';
        }).join('') : '<div class="prov">No positions recorded.</div>') +
      '</div>' +
      '<div class="sec"><div class="prov">Bars are scaled to a full hundred percent, so the length is the ' +
      'actual share of that category. Coloured bars mark where this company is the outright leader.</div></div>';

    host.querySelectorAll('[data-goto]').forEach(function (b) {
      b.addEventListener('click', function () { h.onGoto(b.getAttribute('data-goto')); });
    });
  };

})(window.TD);
