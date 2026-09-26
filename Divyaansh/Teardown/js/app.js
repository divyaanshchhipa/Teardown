/* Teardown :: application shell, routing and views */
(function (TD) {
  'use strict';

  var esc = TD.esc;
  var S = {
    view: 'home',
    deviceId: null,
    boardId: null,      // node whose children are shown, null = device root
    selectedId: null,
    company: null,
    explode: 0,
    yaw: -0.62,
    pitch: 0.52,
    lid: -1.83,         // radians, about -105 degrees
    isolate: false,
    xray: false,
    forceSchematic: false
  };

  var $app, $tabs, $search, $results, $browse;
  var detachOrbit = null;
  var rafPending = false;

  /* ---------------- routing ---------------- */

  function hash() { return decodeURIComponent(location.hash.replace(/^#\/?/, '')); }

  function go(route) {
    if (hash() === route) render();
    else location.hash = '#/' + route;
  }

  /* Drilling into a board (open) and jumping via breadcrumbs both change
     what's on screen without going through go()/render(), they mutate
     S directly and redraw for responsiveness. Without this, the URL, and
     therefore back/forward and reload, silently stop tracking how deep
     into a device you are. pushState/replaceState don't fire hashchange,
     so this can't recurse into render(); browser Back still works because
     history navigation (unlike pushState) does fire hashchange. */
  function updateHash(route, replace) {
    var url = '#/' + route;
    if (location.hash === url) return;
    if (replace) history.replaceState(null, '', url);
    else history.pushState(null, '', url);
  }

  function parseRoute() {
    var h = hash();
    S.company = null;
    if (!h || h === 'home') { S.view = 'home'; return; }
    if (h === 'findings') { S.view = 'findings'; return; }
    if (h === 'about') { S.view = 'about'; return; }
    if (h === 'sources') { S.view = 'sources'; return; }
    if (h.indexOf('section/') === 0) {
      S.view = 'section'; S.sectionId = h.slice(8); return;
    }
    if (h.indexOf('company/') === 0) {
      S.view = 'company'; S.company = h.slice(8); return;
    }
    var parts = h.split('/');
    var dev = TD.deviceById[parts[0]];
    if (!dev) { S.view = 'home'; return; }
    S.view = 'device';
    if (S.deviceId !== dev.id) {
      S.explode = 0; S.boardId = null; S.selectedId = null;
      S.yaw = -0.62; S.pitch = 0.52; S.lid = -1.83;
    }
    S.deviceId = dev.id;

    var target = parts[1] ? dev.byId[parts[1]] : null;
    if (target) {
      S.selectedId = target.id;
      S.boardId = target.parentNode ? target.parentNode.id : null;
    } else {
      S.boardId = null; S.selectedId = null;
    }
  }

  /* ---------------- chrome ---------------- */

  function buildBrowse() {
    $browse.innerHTML =
      '<div class="browse-inner">' +
        TD.sections.map(function (s) {
          var devs = TD.sectionDevices(s);
          return '<div class="bcol">' +
            '<div class="bhead" data-go="section/' + esc(s.id) + '" role="button" tabindex="0">' + esc(s.name) +
              '<span class="bcount">' + (devs.length ? devs.length + ' live' : 'planned') + '</span>' +
            '</div>' +
            devs.map(function (d) {
              return '<button class="blink" data-go="' + esc(d.id) + '">' + esc(d.name) + '</button>';
            }).join('') +
            s.planned.slice(0, 4).map(function (p) {
              return '<span class="blink soon">' + esc(p) + '</span>';
            }).join('') +
          '</div>';
        }).join('') +
      '</div>';

    wireActivatable($browse, '[data-go]', function (b) {
      closeBrowse();
      go(b.getAttribute('data-go'));
    });
  }

  /* click + Enter/Space on any non-<button> element carrying data-go (or
     another attribute the caller reads); native buttons already get
     keyboard activation for free, so this only adds a listener where one
     is actually missing. */
  function wireActivatable(root, selector, handler) {
    root.querySelectorAll(selector).forEach(function (el) {
      el.addEventListener('click', function (e) { e.stopPropagation(); handler(el, e); });
      if (el.tagName !== 'BUTTON') {
        el.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); handler(el, e); }
        });
      }
    });
  }

  function openBrowse() {
    $browse.classList.add('on');
    var b = document.getElementById('browse-btn');
    b.classList.add('on'); b.setAttribute('aria-expanded', 'true');
  }
  function closeBrowse() {
    $browse.classList.remove('on');
    var b = document.getElementById('browse-btn');
    b.classList.remove('on'); b.setAttribute('aria-expanded', 'false');
  }

  function syncTabs() {
    $tabs.querySelectorAll('.navtab[data-go]').forEach(function (b) {
      var on = b.getAttribute('data-go') === S.view;
      b.classList.toggle('on', on);
      if (on) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current');
    });
  }

  function wireSearch() {
    function close() { $results.classList.remove('on'); $search.setAttribute('aria-expanded', 'false'); }
    $search.addEventListener('input', function () {
      var hits = TD.search($search.value);
      if (!hits.length) { close(); return; }
      $results.innerHTML = hits.map(function (h, i) {
        return '<div class="ritem" role="option" tabindex="-1" data-i="' + i + '">' +
          '<div class="rl"><span class="rkind ' + h.kind + '">' + h.kind + '</span>' + esc(h.label) + '</div>' +
          '<div class="rs">' + esc(h.sub) + '</div></div>';
      }).join('');
      $results.classList.add('on');
      $search.setAttribute('aria-expanded', 'true');
      $results.querySelectorAll('.ritem').forEach(function (r) {
        r.addEventListener('click', function () {
          var h = hits[+r.getAttribute('data-i')];
          if (h.kind === 'company') go('company/' + h.company);
          else if (h.kind === 'node') go(h.device.id + '/' + h.node.id);
          else go(h.device.id);
          $search.value = ''; close();
        });
      });
    });
    $search.addEventListener('keydown', function (e) { if (e.key === 'Escape') { $search.value = ''; close(); } });
    document.addEventListener('click', function (e) {
      if (!e.target.closest || !e.target.closest('.searchwrap')) close();
      if (!e.target.closest || (!e.target.closest('#browse') && !e.target.closest('#browse-btn'))) closeBrowse();
    });
  }

  /* ---------------- home ---------------- */

  function viewHome() {
    var totalNodes = 0, totalShares = 0, chokes = 0, planned = 0;
    TD.devices.forEach(function (d) {
      totalNodes += d.nodes.length;
      d.nodes.forEach(function (n) {
        totalShares += (n.shares || []).length;
        if (n.chokepoint) chokes++;
      });
    });
    TD.sections.forEach(function (s) { planned += s.planned.length; });

    $app.innerHTML =
      '<div class="page">' +
        '<div class="hero">' +
          '<h1>Take technology apart and see who owns the pieces.</h1>' +
          '<ol class="steps">' +
            '<li><b>Select</b> a device</li>' +
            '<li><b>Take it apart</b>, layer by layer</li>' +
            '<li><b>See who supplies</b> each piece</li>' +
            '<li><b>Read</b> the share, concentration, geography and deals behind it</li>' +
          '</ol>' +
          '<div class="herostats">' +
            '<span><b>' + TD.devices.length + '</b> teardowns live</span>' +
            '<span><b>' + totalNodes + '</b> components</span>' +
            '<span><b>' + Object.keys(TD.companyIndex).length + '</b> companies</span>' +
            '<span><b>' + chokes + '</b> chokepoints</span>' +
            '<span><b>' + planned + '</b> more planned</span>' +
          '</div>' +
        '</div>' +

        TD.sections.map(function (s) {
          var devs = TD.sectionDevices(s);
          return '<section class="sect">' +
            '<div class="secthead">' +
              '<h2>' + esc(s.name) + '</h2>' +
              '<p class="sub">' + esc(s.blurb) + '</p>' +
            '</div>' +
            '<div class="cardgrid">' +
              devs.map(function (d) {
                var parts = d.nodes.filter(function (n) { return n.kind !== 'meta'; }).length;
                var is3d = TD.hasModel(d.id);
                return '<div class="card dcard" data-go="' + esc(d.id) + '" role="button" tabindex="0" aria-label="' + esc(d.name) + '">' +
                  (is3d ? '<span class="tag3d">3D</span>' : '') +
                  '<h3>' + esc(d.name) + '</h3>' +
                  '<p>' + esc(d.tagline) + '</p>' +
                  '<div class="dstat">' + parts + ' components &nbsp;·&nbsp; ' + esc(d.unit.volume) + '</div>' +
                '</div>';
              }).join('') +
              s.planned.map(function (p) {
                return '<div class="card dcard soon"><h3>' + esc(p) + '</h3>' +
                  '<p>Not built yet.</p><div class="dstat">Planned</div></div>';
              }).join('') +
            '</div>' +
          '</section>';
        }).join('') +
      '</div>';

    wireActivatable($app, '[data-go]', function (c) { go(c.getAttribute('data-go')); });
  }

  function viewSection() {
    var s = TD.sectionById[S.sectionId];
    if (!s) { go('home'); return; }
    var devs = TD.sectionDevices(s);
    $app.innerHTML =
      '<div class="page">' +
        '<div class="ins-kicker" style="margin-bottom:6px">Section</div>' +
        '<h1>' + esc(s.name) + '</h1>' +
        '<p class="lede">' + esc(s.blurb) + '</p>' +
        '<div class="cardgrid">' +
          devs.map(function (d) {
            var parts = d.nodes.filter(function (n) { return n.kind !== 'meta'; }).length;
            return '<div class="card dcard" data-go="' + esc(d.id) + '" role="button" tabindex="0" aria-label="' + esc(d.name) + '">' +
              (TD.hasModel(d.id) ? '<span class="tag3d">3D</span>' : '') +
              '<h3>' + esc(d.name) + '</h3><p>' + esc(d.tagline) + '</p>' +
              '<div class="dstat">' + parts + ' components &nbsp;·&nbsp; ' + esc(d.unit.volume) + '</div></div>';
          }).join('') +
          s.planned.map(function (p) {
            return '<div class="card dcard soon"><h3>' + esc(p) + '</h3>' +
              '<p>Not built yet.</p><div class="dstat">Planned</div></div>';
          }).join('') +
        '</div>' +
      '</div>';
    wireActivatable($app, '[data-go]', function (c) { go(c.getAttribute('data-go')); });
  }

  /* ---------------- device ---------------- */

  function modelKey() {
    return S.boardId ? S.deviceId + '/' + S.boardId : S.deviceId;
  }

  /* three.js when it's actually usable, the old axonometric SVG renderer as
     a fallback for no-WebGL/degraded browsers, schematic for devices with
     no model at all or when the user has explicitly asked for it */
  function boardMode(key) {
    if (!TD.hasModel(key)) return 'schematic';
    if (S.forceSchematic) return 'schematic';
    return TD.canUse3D() ? '3d' : 'iso';
  }

  var PRESET_LABELS = { iso: 'Isometric', front: 'Front', back: 'Back', left: 'Left', right: 'Right', top: 'Top', bottom: 'Bottom' };

  function viewDevice() {
    if (detachOrbit) { detachOrbit(); detachOrbit = null; }
    var oldBoard = document.getElementById('board');
    if (oldBoard) TD.disposeThree(oldBoard);

    var dev = TD.deviceById[S.deviceId];
    var sect = TD.sectionOf(dev.id);
    var key = modelKey();
    var hasModel = TD.hasModel(key);
    var mode = boardMode(key);
    var model = hasModel ? TD.models[key] : null;
    var metas = dev.nodes.filter(function (n) { return n.kind === 'meta'; });
    var hasSel = !!(S.selectedId || S.company);

    $app.innerHTML =
      '<div class="layout' + (hasSel ? '' : ' overview-mode') + '" id="layout">' +
        '<div class="card stage">' +
          '<div class="stagehead">' +
            '<div>' +
              (sect ? '<div class="ins-kicker sectlink" data-go="section/' + esc(sect.id) + '" role="button" tabindex="0">' +
                       esc(sect.name) + '</div>' : '') +
              '<h1>' + esc(dev.name) + '</h1><div class="tag">' + esc(dev.tagline) + '</div>' +
            '</div>' +
            '<div class="unit"><b>' + esc(dev.unit.volume) + '</b>' + esc(dev.unit.price) + '</div>' +
          '</div>' +
          '<div class="crumbs" id="crumbs"></div>' +
          '<div class="toolbar">' +
            /* Separation is a 3D affordance. On the flat schematic it was a
               small radial nudge that could not pull co-directional
               neighbours apart and pushed edge tiles out of frame: a control
               that appeared to do something and didn't. The Lid slider was
               worse: it rendered whenever a model had a lid, including in
               schematic mode, where it did nothing at all. */
            (mode !== 'schematic' ?
              '<button class="btn primary" id="btn-explode">' +
                (S.explode > 0.5 ? 'Reassemble' : 'Dismantle') + '</button>' +
              '<div class="slider"><label for="ex">Separation</label>' +
                '<input type="range" id="ex" min="0" max="100" value="' +
                Math.round(S.explode * 100) + '"></div>' : '') +
            (mode !== 'schematic' && model && model.lid ?
              '<div class="slider"><label for="lidr">Lid</label>' +
              '<input type="range" id="lidr" min="0" max="115" value="' + Math.round(-S.lid * 180 / Math.PI) + '"></div>' : '') +
            (mode === '3d' ?
              '<label class="slider" for="viewpreset">View' +
                '<select id="viewpreset">' + Object.keys(PRESET_LABELS).map(function (k) {
                  return '<option value="' + k + '">' + PRESET_LABELS[k] + '</option>';
                }).join('') + '</select>' +
              '</label>' +
              '<button class="btn viewtoggle' + (S.isolate ? ' on' : '') + '" id="btn-isolate" aria-pressed="' + S.isolate + '">Isolate</button>' +
              '<button class="btn viewtoggle' + (S.xray ? ' on' : '') + '" id="btn-xray" aria-pressed="' + S.xray + '">X-ray</button>'
              : '') +
            (mode === '3d' || mode === 'iso' ? '<button class="btn" id="btn-reset">Reset view</button>' : '') +
            (hasModel ? '<button class="btn" id="btn-mode">' + (mode === 'schematic' ? '3D view' : 'Schematic view') + '</button>' : '') +
            '<div class="legend" id="legend"></div>' +
          '</div>' +
          (mode === '3d' || mode === 'iso'
            ? '<div class="board board3d" id="board"><div class="orbithint">' +
                (mode === '3d' ? 'Drag to orbit &middot; Scroll to zoom' : 'Drag to rotate') + '</div></div>'
            : '<div class="board" id="board"></div>') +
          '<div class="partindex" id="partindex" hidden></div>' +
          '<div class="journey" id="journey" hidden></div>' +
          (metas.length && !S.boardId ?
            '<div class="toolbar metabar">' +
              '<span class="metalabel">Not a part, but decides the market</span>' +
              '<div class="chips">' + metas.map(function (m) {
                return '<button class="chip" data-meta="' + esc(m.id) + '">' + esc(m.name) + '</button>';
              }).join('') + '</div>' +
            '</div>' : '') +
        '</div>' +
        '<div class="card inspector dev-inspector" id="inspector-shell">' +
          '<div class="dev-ins-chrome">' +
            '<button class="ins-iconbtn" id="ins-collapse" title="Collapse" aria-label="Collapse details" aria-expanded="true">&#9662;</button>' +
            '<button class="ins-iconbtn" id="ins-close" title="Close" aria-label="Close inspector">&times;</button>' +
          '</div>' +
          '<div class="ins-body" id="inspector"></div>' +
        '</div>' +
      '</div>' +
      /* The intro already appears in the panel above. On a story device the
         analysis below opens with its own lede, so a third copy of the same
         paragraph, set to a different measure than everything around it,
         was pure repetition. The other devices keep it: there it is the only
         place the framing survives once a component is selected. */
      (dev.story ? '' : '<div class="disclaimer">' + esc(dev.intro) + '</div>') +
      /* the long-form analysis, for devices that carry a story block; every
         other device leaves this empty and renders exactly as before */
      '<div class="story" id="story" hidden></div>';

    drawCrumbs();
    drawLegend(mode);
    drawPartIndex(key, mode);

    /* the build strip belongs to the whole device, not to a sub-board, so it
       only appears at the top level of a teardown */
    var jr = document.getElementById('journey');
    if (S.boardId) jr.hidden = true;
    else TD.renderJourney(jr, dev, { onSelect: select });

    document.getElementById('ins-close').addEventListener('click', closeInspector);
    document.getElementById('ins-collapse').addEventListener('click', toggleInspectorCollapse);

    $app.querySelectorAll('[data-meta]').forEach(function (b) {
      b.addEventListener('click', function () { select(dev.byId[b.getAttribute('data-meta')]); });
    });
    wireActivatable($app, '.sectlink', function (b) { go(b.getAttribute('data-go')); });

    var ex = document.getElementById('ex');
    if (ex) ex.addEventListener('input', function () {
      S.explode = ex.value / 100; syncExplodeBtn(); drawBoard();
    });

    var lidr = document.getElementById('lidr');
    if (lidr) lidr.addEventListener('input', function () {
      S.lid = -lidr.value * Math.PI / 180; drawBoard();
    });

    var explodeBtn = document.getElementById('btn-explode');
    if (explodeBtn) explodeBtn.addEventListener('click', function () {
      S.explode = S.explode > 0.5 ? 0 : 1;
      if (ex) ex.value = S.explode * 100;
      syncExplodeBtn();
      drawBoard();
    });

    var modeBtn = document.getElementById('btn-mode');
    if (modeBtn) modeBtn.addEventListener('click', function () {
      S.forceSchematic = !S.forceSchematic;
      /* the schematic has no separation control, so leaving a part-way
         explode behind would strand the board in a state nothing can undo */
      if (S.forceSchematic) S.explode = 0;
      viewDevice();
    });

    var reset = document.getElementById('btn-reset');
    if (reset) reset.addEventListener('click', function () {
      if (mode === '3d') {
        var b3 = document.getElementById('board');
        if (b3) TD.threeResetView(b3);
      } else {
        S.yaw = -0.62; S.pitch = 0.52;
      }
      if (lidr) { S.lid = -1.83; lidr.value = 105; }
      drawBoard();
    });

    var preset = document.getElementById('viewpreset');
    if (preset) preset.addEventListener('change', function () {
      var b3 = document.getElementById('board');
      if (b3) TD.threeSetView(b3, preset.value);
    });
    var isoBtn = document.getElementById('btn-isolate');
    if (isoBtn) isoBtn.addEventListener('click', function () {
      S.isolate = !S.isolate;
      isoBtn.classList.toggle('on', S.isolate);
      isoBtn.setAttribute('aria-pressed', String(S.isolate));
      drawBoard();
    });
    var xrayBtn = document.getElementById('btn-xray');
    if (xrayBtn) xrayBtn.addEventListener('click', function () {
      S.xray = !S.xray;
      xrayBtn.classList.toggle('on', S.xray);
      xrayBtn.setAttribute('aria-pressed', String(S.xray));
      drawBoard();
    });

    if (mode === 'iso') {
      var host = document.getElementById('board');
      detachOrbit = TD.attachOrbit(host, S, function () {
        if (rafPending) return;
        rafPending = true;
        requestAnimationFrame(function () { rafPending = false; drawBoard(); });
      });
    }

    drawBoard();
    drawInspector();
    syncInspectorVisibility();

    /* The story belongs to the whole device, so it is not redrawn when you
       drill into a sub-board, only at the top level of a teardown.
       The dispose here is belt-and-braces: render() already released the
       outgoing story before this view replaced the DOM, and this element is
       a fresh one. It stays because "dispose before render" is the invariant
       that keeps renderStory safe to call twice on a live element, which the
       theme handler does. */
    var story = document.getElementById('story');
    if (story) {
      TD.disposeStory(story);
      if (!S.boardId) TD.renderStory(story, dev, { onSelect: select });
      else { story.innerHTML = ''; story.hidden = true; }
    }
  }

  function syncExplodeBtn() {
    var b = document.getElementById('btn-explode');
    if (b) b.textContent = S.explode > 0.5 ? 'Reassemble' : 'Dismantle';
  }

  function drawCrumbs() {
    var dev = TD.deviceById[S.deviceId];
    var boardNode = S.boardId ? dev.byId[S.boardId] : null;
    var cr = document.getElementById('crumbs');
    if (!cr) return;
    var trail = boardNode ? TD.path(boardNode) : [];
    cr.innerHTML = '<button data-crumb="">' + esc(dev.name) + '</button>' +
      trail.map(function (t, i) {
        var last = i === trail.length - 1;
        return '<span class="sep">&rsaquo;</span>' + (last
          ? '<span class="cur">' + esc(t.name) + '</span>'
          : '<button data-crumb="' + esc(t.id) + '">' + esc(t.name) + '</button>');
      }).join('') +
      (trail.length ? '' : '<span class="sep">&rsaquo;</span><span class="cur">whole device</span>');
    cr.querySelectorAll('[data-crumb]').forEach(function (b) {
      b.addEventListener('click', function () {
        S.boardId = b.getAttribute('data-crumb') || null;
        S.selectedId = null; S.explode = 0;
        viewDevice();
        updateHash(S.boardId ? S.deviceId + '/' + S.boardId : S.deviceId, true);
      });
    });
  }

  function drawLegend(mode) {
    var lg = document.getElementById('legend');
    if (!lg) return;
    if (mode === '3d' || mode === 'iso') {
      lg.innerHTML = '<span class="hintline">Click a solid to highlight it. Double click to open it.</span>';
      return;
    }
    var dev = TD.deviceById[S.deviceId];
    var ctx = S.boardId ? dev.byId[S.boardId] : dev;
    var kids = S.boardId ? TD.drawableChildren(ctx)
                         : dev.nodes.filter(function (n) { return !n.parent && n.kind !== 'meta'; });
    var used = {};
    kids.forEach(function (n) { TD.geoMix(n).forEach(function (g) { used[g.geo] = 1; }); });
    lg.innerHTML =
      '<span class="hintline schematic-hint">Click any part to see who supplies it. Parts with an arrow open further.</span>' +
      Object.keys(used).map(function (k) {
        var g = TD.GEO[k] || TD.GEO.ROW;
        return '<span><i style="background:' + TD.geoColor(k) + '"></i>' + esc(g.label) + '</span>';
      }).join('');
  }

  /* The named index of what is in the model. A solid you can see but cannot
     identify is the main complaint against the 3D view: small internals,
     and anything faded by X-ray, are visible without being nameable. This
     lists every part the model actually contains, with the colour it is
     drawn in: hover lights it up in the scene, click selects it. It is built
     from the model data rather than the renderer, so it works the same for
     the WebGL and the SVG fallback views. */
  function drawPartIndex(key, mode) {
    var el = document.getElementById('partindex');
    if (!el) return;
    var dev = TD.deviceById[S.deviceId];
    var model = TD.hasModel(key) ? TD.models[key] : null;
    if (!model || mode === 'schematic') { el.hidden = true; el.innerHTML = ''; return; }

    var parts = model.parts.map(function (p) {
      return { id: p.node, color: p.color || '#8593a4', node: dev.byId[p.node] };
    }).filter(function (p) { return p.node; });
    if (!parts.length) { el.hidden = true; el.innerHTML = ''; return; }

    el.hidden = false;
    el.innerHTML =
      '<span class="pi-label">In this view</span>' +
      '<div class="pi-list">' + parts.map(function (p) {
        return '<button class="pi-item' + (p.id === S.selectedId ? ' on' : '') +
          '" data-part="' + esc(p.id) + '">' +
          '<i style="background:' + esc(p.color) + '"></i>' +
          esc(p.node.short || p.node.name) + '</button>';
      }).join('') + '</div>';

    var board = document.getElementById('board');
    el.querySelectorAll('[data-part]').forEach(function (b) {
      var id = b.getAttribute('data-part');
      b.addEventListener('click', function () { if (dev.byId[id]) select(dev.byId[id]); });
      b.addEventListener('mouseenter', function () { TD.threeHighlight(board, id); });
      b.addEventListener('mouseleave', function () { TD.threeHighlight(board, null); });
      b.addEventListener('focus', function () { TD.threeHighlight(board, id); });
      b.addEventListener('blur', function () { TD.threeHighlight(board, null); });
    });
  }

  function syncPartIndex() {
    var el = document.getElementById('partindex');
    if (!el) return;
    el.querySelectorAll('[data-part]').forEach(function (b) {
      b.classList.toggle('on', b.getAttribute('data-part') === S.selectedId);
    });
  }

  function drawBoard() {
    var dev = TD.deviceById[S.deviceId];
    var host = document.getElementById('board');
    if (!host) return;
    var key = modelKey();
    var mode = boardMode(key);
    var nodeOf = function (id) { return dev.byId[id]; };
    var onSelect = function (id) { if (dev.byId[id]) select(dev.byId[id]); };
    var onOpen = function (id) { if (dev.byId[id]) open(dev.byId[id]); };

    if (mode === '3d') {
      TD.renderThree(host, key, {
        explode: S.explode, lidAngle: S.lid, selectedId: S.selectedId,
        isolate: S.isolate, xray: S.xray,
        nodeOf: nodeOf, onSelect: onSelect, onOpen: onOpen
      });
      return;
    }

    if (mode === 'iso') {
      var hint = host.querySelector('.orbithint');
      TD.renderIso(host, key, {
        yaw: S.yaw, pitch: S.pitch, explode: S.explode, lidAngle: S.lid,
        selectedId: S.selectedId, nodeOf: nodeOf, onSelect: onSelect, onOpen: onOpen
      });
      if (hint) host.appendChild(hint);
      return;
    }

    TD.renderBoard(host, S.boardId ? dev.byId[S.boardId] : dev, {
      explode: S.explode, selectedId: S.selectedId, onSelect: select, onOpen: open
    });
  }

  function drawInspector() {
    var host = document.getElementById('inspector');
    if (!host) return;
    var dev = TD.deviceById[S.deviceId];

    if (S.company) {
      TD.renderCompany(host, S.company, { onGoto: function (p) { go(p); } });
      return;
    }
    var node = S.selectedId && dev ? dev.byId[S.selectedId] : null;
    if (!node) {
      /* Nothing selected is the device's own analysis, not an empty state.
         Drilled into a sub-assembly, the assembly itself is the subject,
         it has its own share table, concentration and sources. */
      if (S.boardId && dev.byId[S.boardId]) node = dev.byId[S.boardId];
      else { TD.renderDeviceOverview(host, dev, { onSelect: select }); return; }
    }
    TD.renderInspector(host, node, {
      onOpen: open,
      onSelect: select,
      onCompany: function (name) { S.company = name; drawInspector(); syncInspectorVisibility(); },
      onGoto: function (route) { go(route); }
    });
  }

  /* The panel is always mounted, with nothing selected it carries the
     device overview, so there is no empty-panel state to hide. The class
     only tells the CSS which of the two it is currently showing, and
     hides the close button on the overview (closing it would be a
     dead end: there is nothing behind the overview to go back to). */
  function syncInspectorVisibility() {
    var layout = document.getElementById('layout');
    if (!layout) return;
    var overview = !(S.selectedId || S.company);
    layout.classList.toggle('overview-mode', overview);
    var close = document.getElementById('ins-close');
    if (close) close.hidden = overview;
  }

  /* returns to the device overview; the model, its camera and its explode
     state are untouched, since drawBoard() reuses the live scene */
  function closeInspector() {
    S.selectedId = null;
    S.company = null;
    drawBoard();
    drawInspector();
    syncInspectorVisibility();
    syncPartIndex();
    var shell = document.getElementById('inspector-shell');
    if (shell) shell.scrollTop = 0;
    updateHash(S.boardId ? S.deviceId + '/' + S.boardId : S.deviceId, true);
  }

  function toggleInspectorCollapse() {
    var shell = document.getElementById('inspector-shell');
    if (!shell) return;
    var collapsed = shell.classList.toggle('collapsed');
    document.getElementById('ins-collapse').setAttribute('aria-expanded', String(!collapsed));
  }

  function select(node) {
    S.selectedId = node.id;
    S.company = null;
    var shell = document.getElementById('inspector-shell');
    if (shell) { shell.classList.remove('collapsed'); shell.scrollTop = 0; }
    drawBoard();
    drawInspector();
    syncInspectorVisibility();
    syncPartIndex();
    updateHash(S.deviceId + '/' + node.id, true);
    if (window.innerWidth < 1180) {
      var i = document.getElementById('inspector');
      if (i) i.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function open(node) {
    var key = S.deviceId + '/' + node.id;
    if (!TD.hasModel(key) && !TD.canOpen(node)) { select(node); return; }
    S.boardId = node.id;
    S.selectedId = null;
    S.company = null;
    S.explode = 0;
    viewDevice();
    updateHash(S.deviceId + '/' + node.id, false);
  }

  /* ---------------- findings ---------------- */

  /* Foundry, lithography and EDA are reached from three teardowns and describe
     the same market, so cross site tables collapse them on the stated basis. */
  function allNodes() {
    var out = [], seen = {};
    TD.devices.forEach(function (d) {
      d.nodes.forEach(function (n) {
        if (!(n.shares || []).length) return;
        var basis = (n.market && n.market.basis) ? n.market.basis.toLowerCase() : ('node:' + n.id);
        var key = basis + '|' + TD.rankShares(n).named[0].c;
        if (seen[key]) return;
        seen[key] = 1;
        out.push(n);
      });
    });
    return out;
  }

  function nodeRow(n, extraCell) {
    var d = TD.deviceById[n.device];
    var r = TD.rankShares(n);
    var c = TD.concentration(TD.hhi(n), r.coverage);
    return '<tr>' +
      '<td><span class="lnk" role="link" tabindex="0" data-goto="' + esc(d.id + '/' + n.id) + '">' + esc(n.name) + '</span></td>' +
      '<td>' + esc(d.name) + '</td>' +
      '<td>' + esc(r.named[0].c) + '</td>' +
      '<td class="num">' + TD.pct(r.named[0].p) + '</td>' +
      extraCell +
      '<td><span class="pill conc-' + c.key + '">' + esc(c.label) + '</span></td>' +
    '</tr>';
  }

  function viewFindings() {
    var nodes = allNodes();
    var byHHI = nodes.slice().sort(function (a, b) { return TD.hhi(b) - TD.hhi(a); });
    var top = byHHI.slice(0, 14);
    /* Ranking by *low* HHI rewards precisely the layers nobody has
       researched: name three suppliers covering 12% of a market and it
       scores HHI 50 and sorts to the top of this table. So the
       fragmentation table only considers layers whose named players cover
       enough of the market for the band to be a statement about structure.
       The ones held back are counted in the standfirst rather than hidden,
       a thin layer is still a finding, just a different one. */
    var covered = byHHI.filter(function (n) { return !TD.isProvisional(n); });
    var heldBack = byHHI.length - covered.length;
    var bottom = covered.slice().reverse().slice(0, 12);
    var chokes = nodes.filter(function (n) { return n.chokepoint; })
      .sort(function (a, b) { return TD.hhi(b) - TD.hhi(a); });

    var footprint = Object.keys(TD.companyIndex).filter(function (name) {
      var m = TD.companies[name];
      return !m || m.type !== 'agg';   // country aggregates are not companies
    }).map(function (name) {
      var pos = TD.companyIndex[name];
      var leads = pos.filter(function (p) { return TD.rankShares(p.node).named[0].c === name; }).length;
      return { name: name, n: pos.length, leads: leads,
               cats: new Set(pos.map(function (p) { return p.device.id; })).size };
    }).sort(function (a, b) { return (b.leads - a.leads) || (b.n - a.n); }).slice(0, 18);

    var deals = [];
    TD.devices.forEach(function (d) {
      d.nodes.forEach(function (n) {
        (n.deals || []).forEach(function (dl) { deals.push({ d: dl, n: n, dev: d }); });
      });
    });
    deals.sort(function (a, b) { return (b.d.y || 0) - (a.d.y || 0); });

    $app.innerHTML =
      '<div class="page">' +
        '<h1>Findings</h1>' +
        '<p class="lede">The same tables read across every teardown at once. This is the part that is ' +
        'actually useful for origination: where pricing power sits, where nobody has escaped the pack, ' +
        'and which single points of failure the whole industry runs through.</p>' +

        '<h2>Where the pricing power is</h2>' +
        '<p class="sub">Ranked by Herfindahl-Hirschman Index on disclosed shares. Above 2,500 a regulator ' +
        'would call the market highly concentrated. Several of these are above 5,000.</p>' +
        '<div class="tblwrap"><table class="tbl"><thead><tr><th>Component</th><th>Found in</th><th>Leader</th>' +
        '<th class="num">Share</th><th class="num">HHI</th><th>Structure</th></tr></thead><tbody>' +
        top.map(function (n) { return nodeRow(n, '<td class="num">' + TD.hhi(n) + '</td>'); }).join('') +
        '</tbody></table></div>' +

        '<h2>Where nobody has won yet</h2>' +
        '<p class="sub">The opposite end. Fragmented layers with a real market size and no player near a ' +
        'controlling position. These are where a buy and build has room to run. ' +
        'Only layers whose named suppliers account for at least ' + TD.MIN_COVERAGE + '% of the market ' +
        'are ranked here: below that, a low score measures how little has been published rather than how ' +
        'the market is structured' +
        (heldBack ? ', which holds back ' + heldBack + ' layer' + (heldBack === 1 ? '' : 's') +
                    ' that would otherwise top this table' : '') +
        '.</p>' +
        '<div class="tblwrap"><table class="tbl"><thead><tr><th>Component</th><th>Found in</th><th>Leader</th>' +
        '<th class="num">Share</th><th class="num">Named</th><th>Structure</th></tr></thead><tbody>' +
        bottom.map(function (n) { return nodeRow(n, '<td class="num">' + TD.pct(TD.coverage(n)) + '</td>'); }).join('') +
        '</tbody></table></div>' +

        '<h2>Chokepoints</h2>' +
        '<p class="sub">Layers where supply is narrow enough that a disruption propagates through everything ' +
        'above it. Flagged by hand, not by formula.</p>' +
        '<div class="tblwrap"><table class="tbl"><thead><tr><th>Component</th><th>Found in</th><th>Leader</th>' +
        '<th class="num">Share</th><th class="num">HHI</th><th>Structure</th></tr></thead><tbody>' +
        chokes.map(function (n) { return nodeRow(n, '<td class="num">' + TD.hhi(n) + '</td>'); }).join('') +
        '</tbody></table></div>' +

        '<h2>Widest footprints</h2>' +
        '<p class="sub">Companies that lead in the most separate layers across every teardown on this site. ' +
        'Breadth of leadership, not size.</p>' +
        '<div class="tblwrap"><table class="tbl"><thead><tr><th>Company</th><th>Home</th><th class="num">Leads</th>' +
        '<th class="num">Positions</th><th class="num">Categories</th></tr></thead><tbody>' +
        footprint.map(function (f) {
          var g = TD.GEO[TD.geoOf(f.name)] || TD.GEO.ROW;
          return '<tr><td><span class="lnk" role="link" tabindex="0" data-company="' + esc(f.name) + '">' + esc(f.name) + '</span></td>' +
            '<td style="color:' + TD.geoInk(TD.geoOf(f.name)) + '">' + esc(g.label) + '</td>' +
            '<td class="num">' + f.leads + '</td><td class="num">' + f.n + '</td>' +
            '<td class="num">' + f.cats + '</td></tr>';
        }).join('') +
        '</tbody></table></div>' +

        '<h2>Every transaction on this site</h2>' +
        '<p class="sub">Selected deals attached to the components above, newest first. Included where the ' +
        'deal explains the structure of the market rather than just its size.</p>' +
        '<div class="tblwrap"><table class="tbl"><thead><tr><th class="num">Year</th><th>Acquirer</th>' +
        '<th>Target</th><th>Value</th><th>Layer</th></tr></thead><tbody>' +
        deals.map(function (x) {
          return '<tr><td class="num">' + esc(x.d.y) + '</td><td>' + esc(x.d.a) + '</td>' +
            '<td>' + esc(x.d.t) + '</td><td>' + esc(x.d.v) + '</td>' +
            '<td><span class="lnk" role="link" tabindex="0" data-goto="' + esc(x.dev.id + '/' + x.n.id) + '">' +
            esc(x.n.name) + '</span></td></tr>';
        }).join('') +
        '</tbody></table></div>' +
      '</div>';

    wireActivatable($app, '[data-goto]', function (b) { go(b.getAttribute('data-goto')); });
    wireActivatable($app, '[data-company]', function (b) { go('company/' + b.getAttribute('data-company')); });
  }

  function viewCompany() {
    var name = S.company;
    var pos = TD.companyIndex[name] || [];
    $app.innerHTML =
      '<div class="layout">' +
        '<div class="card stage"><div class="stagehead"><div>' +
          '<h1>' + esc(name) + '</h1>' +
          '<div class="tag">Every position this company holds across the teardowns on this site.</div>' +
        '</div></div>' +
        '<div class="page" style="padding:16px 20px 24px">' +
          (pos.length ?
          '<div class="tblwrap"><table class="tbl"><thead><tr><th>Layer</th><th>Found in</th>' +
          '<th class="num">Share</th><th>Position</th></tr></thead><tbody>' +
          pos.slice().sort(function (a, b) { return b.share - a.share; }).map(function (p) {
            var lead = TD.rankShares(p.node).named[0].c === name;
            return '<tr><td><span class="lnk" role="link" tabindex="0" data-goto="' + esc(p.device.id + '/' + p.node.id) + '">' +
              esc(p.node.name) + '</span></td><td>' + esc(p.device.name) + '</td>' +
              '<td class="num">' + TD.pct(p.share) + '</td>' +
              '<td>' + (lead ? '<span class="pill lead">Leader</span>' : '') + '</td></tr>';
          }).join('') + '</tbody></table></div>'
          : '<div class="empty">No positions recorded.</div>') +
        '</div></div>' +
        '<div class="card inspector" id="inspector"></div>' +
      '</div>';

    TD.renderCompany(document.getElementById('inspector'), name, { onGoto: function (p) { go(p); } });
    wireActivatable($app, '[data-goto]', function (b) { go(b.getAttribute('data-goto')); });
  }

  /* The whole publisher registry on one page.
   *
   * Provenance existed before this only per component and per device, so a
   * reader could check any single figure and had no way to see what the site
   * as a whole rests on. That is the question a sceptical reader actually
   * asks first, and it was the one thing the site could not answer.
   *
   * Everything here is counted from the live data rather than written down,
   * so it cannot fall out of step with what is actually cited. */
  function viewSources() {
    var counts = {}, devicesFor = {};
    TD.devices.forEach(function (d) {
      d.nodes.forEach(function (n) {
        (n.sources || []).forEach(function (raw) {
          var p = TD.sourceMeta(raw).publisher;
          counts[p] = (counts[p] || 0) + 1;
          (devicesFor[p] = devicesFor[p] || {})[d.name] = 1;
        });
      });
    });

    var all = Object.keys(TD.SOURCES);
    var cited = all.filter(function (p) { return counts[p]; });
    var totalCitations = cited.reduce(function (a, p) { return a + counts[p]; }, 0);
    var linked = cited.filter(function (p) { return TD.SOURCES[p].url; });
    var linkedCitations = linked.reduce(function (a, p) { return a + counts[p]; }, 0);

    var GROUPS = [
      ['primary', 'Primary',
       'The company, the regulator or the government speaking directly. Strongest grade, and not always the most disinterested: a producer reporting on its own market is authoritative about the numbers and has a position.'],
      ['third-party', 'Third-party',
       'A tracker, analyst house or trade body compiling it. Most of the site rests here. Headline findings are usually public; the underlying tables are usually subscription research, and the note on each says which.'],
      ['derived', 'Derived',
       'Nobody published this share. It is reconciled from disclosures that were never meant to add up to a market. The weakest grade, and a layer resting only on derived sources cannot be graded above low confidence anywhere on this site.']
    ];

    function row(p) {
      var meta = TD.sourceMeta(p);
      var devs = Object.keys(devicesFor[p] || {}).sort();
      return '<li class="srcpg-item">' +
        '<div class="srcpg-head">' +
          '<span class="srcpg-name">' + TD.sourceLink(p) + '</span>' +
          '<span class="srcpg-count">' + counts[p] +
            ' layer' + (counts[p] === 1 ? '' : 's') + '</span>' +
        '</div>' +
        (meta.note ? '<p class="srcpg-note">' + esc(meta.note) + '</p>' : '') +
        (devs.length
          ? '<div class="srcpg-devs">' + devs.map(function (d) {
              return '<span>' + esc(d) + '</span>';
            }).join('') + '</div>'
          : '') +
      '</li>';
    }

    $app.innerHTML =
      '<div class="page">' +
        '<h1>Sources</h1>' +
        '<p class="lede">Every publisher this site rests on, what grade of evidence it is, ' +
        'how many layers cite it, and a link to the page it was read from.</p>' +

        '<div class="srcpg-stats">' +
          '<div><b>' + cited.length + '</b><span>publishers cited</span></div>' +
          '<div><b>' + totalCitations.toLocaleString('en-US') + '</b><span>citations</span></div>' +
          '<div><b>' + linked.length + '</b><span>with a working link</span></div>' +
          '<div><b>' + Math.round(linkedCitations / totalCitations * 100) + '%</b>' +
            '<span>of citations linkable</span></div>' +
        '</div>' +

        '<p class="sub">Four of these name no single retrievable document: they aggregate ' +
        'filings, company statements or trade coverage across many firms. Those are marked ' +
        'rather than linked, and hovering one says why. Pretending a catch-all is a document ' +
        'would be the dishonest option, so it carries the weakest grade instead.</p>' +

        GROUPS.map(function (g) {
          var list = cited.filter(function (p) { return TD.sourceMeta(p).type === g[0]; })
                          .sort(function (a, b) { return counts[b] - counts[a]; });
          if (!list.length) return '';
          var n = list.reduce(function (a, p) { return a + counts[p]; }, 0);
          return '<h2><span class="srctype ' + g[0] + '">' + esc(g[1]) + '</span> ' +
                 list.length + ' publishers, ' + n + ' citations</h2>' +
                 '<p class="sub">' + esc(g[2]) + '</p>' +
                 '<ul class="srcpg-list">' + list.map(row).join('') + '</ul>';
        }).join('') +

        '<h2>How to read a citation</h2>' +
        '<p class="sub">A source is a key into this registry rather than free text, so the ' +
        'same publisher is described the same way everywhere it appears and cannot end up ' +
        'with two different characters on two different components. ' +
        '<a href="#/about">The method page</a> explains what the grades mean for the numbers ' +
        'themselves.</p>' +
      '</div>';
  }

  function viewAbout() {
    $app.innerHTML =
      '<div class="page">' +
        '<h1>Method</h1>' +
        '<p class="lede">How the numbers on this site are put together, and what they are not.</p>' +

        '<h2>The naming rule</h2>' +
        '<p class="sub">Any company at ten percent or above is always named. The top five are always named ' +
        'however small they are, so a near monopoly still shows the remaining alternatives. Beyond that, ' +
        'players are named in descending order until the list covers eighty five percent of the market, ' +
        'capped at fifteen names. Everything left over is shown as Others. A pure ten percent cutoff would ' +
        'have printed a single name for lithography and nothing at all for fragmented layers like hinges ' +
        'or forging, so the extra rules fill both gaps.</p>' +

        '<h2>Basis matters more than the number</h2>' +
        '<p class="sub">Every table states what it is measuring: units or revenue, which year, and which ' +
        'market definition. Notebook processors look like a monopoly on x86 units and a competitive market ' +
        'once Apple and Arm machines are counted. Tractors look Indian by volume and American by revenue. ' +
        'Neither reading is wrong, and quoting one without the basis is how people mislead themselves.</p>' +

        '<h2>Concentration</h2>' +
        '<p class="sub">HHI is the sum of squared percentage shares of the named players. Residual Others ' +
        'is treated as many small firms, which understates concentration slightly and is the conservative ' +
        'direction to err in. The bands follow the usual competition authority convention: above 2,500 is ' +
        'highly concentrated, 1,500 to 2,500 is moderate, below that is competitive.</p>' +

        '<h2>Confidence, honestly</h2>' +
        '<p class="sub"><span class="conf high">high</span> means the figure is well covered by published ' +
        'industry trackers and company reporting, and is unlikely to be off by more than two or three ' +
        'points. <span class="conf medium">medium</span> means the market definition is contested or the ' +
        'sources disagree. <span class="conf low">low</span> means it is a reasoned estimate assembled from ' +
        'filings and fragmentary coverage, and should be treated as an order of magnitude rather than a ' +
        'measurement. Roughly a third of the components on this site are marked low, mostly the mechanical ' +
        'and assembly layers that no analyst house covers properly because there is no money in covering them.</p>' +

        '<h2>The 3D models</h2>' +
        '<p class="sub">Geometry is schematic, not a CAD import. Each part is a box or group of boxes placed ' +
        'at roughly the right position and proportion inside a representative product, so that spatial ' +
        'relationships read correctly: the battery really is the largest single volume in a notebook, the ' +
        'mainboard really does sit along the rear edge. Dimensions are indicative and vary by model.</p>' +

        '<h2>Sources</h2>' +
        '<p class="sub">Each component lists the type of source behind it: industry trackers such as IDC, ' +
        'Counterpoint, TrendForce, Omdia, Mercury Research, Yole and Dell\'Oro, plus company filings and ' +
        'regulatory disclosures. This site does not reproduce any subscription dataset. Figures are ' +
        'compiled, rounded and stated as indicative. Nothing here is investment advice and nothing here ' +
        'should be relied on for a transaction without independent verification.</p>' +
        '<p class="sub">Every publisher is registered once, with a document type and a statement of what ' +
        'is really being cited, and every citation on the site links straight through to it. ' +
        '<a class="srclink" href="#/sources">See the full source registry</a>, which counts itself from ' +
        'the live data rather than being maintained by hand.</p>' +

        '<h2>What is deliberately missing</h2>' +
        '<p class="sub">Private company revenues that are not disclosed anywhere. Captive volumes that a ' +
        'vendor does not break out. Anything where the honest answer is that nobody outside the industry ' +
        'knows. Where a category is genuinely unmeasurable it is left off rather than filled with a guess ' +
        'dressed as data.</p>' +
      '</div>';
  }

  /* ---------------- theme ----------------
     CSS re-themes itself the moment `data-theme` changes. What does not is
     anything that baked a colour at draw time: the two SVG renderers and the
     inline geography swatches. Those need a redraw. The WebGL scene is the
     exception: rebuilding it would throw the camera away, so it mutates its
     own materials in place. */

  function syncThemeToggle() {
    var b = document.getElementById('theme-toggle');
    if (!b) return;
    var dark = TD.theme() === 'dark';
    b.setAttribute('aria-pressed', String(dark));
    b.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
    b.querySelector('.themelabel').textContent = dark ? 'Dark' : 'Light';
  }

  function wireThemeToggle() {
    var b = document.getElementById('theme-toggle');
    if (!b) return;
    syncThemeToggle();
    b.addEventListener('click', function () {
      TD.setTheme(TD.theme() === 'dark' ? 'light' : 'dark');
    });

    TD.onTheme(function (t) {
      syncThemeToggle();
      var board = document.getElementById('board');
      if (board && board.__td3) TD.threeSetTheme(board, t);
      /* the SVG board, the legend swatches, the panel and the story all
         carry inline geography colours, so they are redrawn rather than
         patched: cheap, and it cannot drift out of sync */
      if (S.view === 'device') {
        var mode = boardMode(modelKey());
        if (mode !== '3d') drawBoard();
        drawLegend(mode);
        drawInspector();
        var story = document.getElementById('story');
        var dev = TD.deviceById[S.deviceId];
        if (story && dev && !S.boardId) {
          TD.disposeStory(story);
          TD.renderStory(story, dev, { onSelect: select });
        }
      } else if (S.view === 'findings' || S.view === 'company') {
        render();
      }
    });
  }

  /* ---------------- boot ---------------- */

  function render() {
    if (detachOrbit && S.view !== 'device') { detachOrbit(); detachOrbit = null; }
    /* Tear down the OUTGOING view before anything replaces its DOM.
       Both of these hang listeners off `window` (a resize handler) or off a
       global observer (IntersectionObserver), so they are not collected when
       their element is discarded: they have to be handed back explicitly.
       This has to happen here, before parseRoute() and before any view
       writes to $app.innerHTML: once innerHTML has run, the elements holding
       __storyResize / __storyIO are gone and unreachable, and disposing the
       fresh replacements is a no-op. That was the bug, disposeStory was
       being called on a newly created #story element and had therefore never
       actually disposed anything. */
    if (S.view === 'device') {
      var leavingBoard = document.getElementById('board');
      if (leavingBoard) TD.disposeThree(leavingBoard);
      var leavingStory = document.getElementById('story');
      if (leavingStory) TD.disposeStory(leavingStory);
    }
    parseRoute();
    syncTabs();
    if (S.view === 'home') viewHome();
    else if (S.view === 'section') viewSection();
    else if (S.view === 'findings') viewFindings();
    else if (S.view === 'about') viewAbout();
    else if (S.view === 'sources') viewSources();
    else if (S.view === 'company') viewCompany();
    else viewDevice();
    window.scrollTo(0, 0);
  }

  window.addEventListener('hashchange', render);

  document.addEventListener('DOMContentLoaded', function () {
    $app = document.getElementById('app');
    $tabs = document.getElementById('tabs');
    $search = document.getElementById('q');
    $results = document.getElementById('results');
    $browse = document.getElementById('browse');

    buildBrowse();
    wireSearch();

    document.getElementById('browse-btn').addEventListener('click', function (e) {
      e.stopPropagation();
      $browse.classList.contains('on') ? closeBrowse() : openBrowse();
    });
    $tabs.querySelectorAll('.navtab[data-go]').forEach(function (b) {
      b.addEventListener('click', function () { go(b.getAttribute('data-go')); });
    });
    wireActivatable(document, '.brand', function () { go('home'); });

    wireThemeToggle();

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && S.view === 'device' && (S.selectedId || S.company)) closeInspector();
    });

    /* One structural sweep over everything that registered, now that every
       device and model script has run. This replaces the two ad-hoc loops
       that used to live here (unknown companies, model/node mismatches),
       both are cases inside TD.validate() now, along with duplicate ids,
       unresolved parents and impossible share tables. */
    TD.reportValidation();

    render();
  });

})(window.TD);
