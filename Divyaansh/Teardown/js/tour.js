/* Teardown :: guided tour
 *
 * A "Run tour" walkthrough of the laptop, the flagship teardown, that
 * drives the real interface rather than describing it. Every step points at a
 * live element and, where it helps, performs the action itself: it clicks the
 * real Dismantle button, moves the real separation slider, and navigates to
 * the real routes. Nothing here is a mock-up or a screenshot, which is the
 * whole reason it cannot drift out of date, if a control is renamed or
 * removed, its step stops resolving and is skipped rather than lying.
 *
 * Three decisions worth knowing before editing:
 *
 *  - **It never starts by itself.** No autoplay on first visit, no
 *    localStorage nag. Partly manners, and partly the harness: interact.py
 *    drives the real page with 221 assertions, and an overlay that appeared
 *    unbidden would break all of them. The tour is opt-in from one button.
 *  - **Every step establishes its own state.** A step declares what the page
 *    must be showing (`need`: route, view, slider positions, drawer) and that
 *    is re-applied on arrival, idempotently, from either direction. Steps used
 *    to inherit whatever the previous step left behind, which broke the moment
 *    anyone pressed Back: the colour-key step described a legend that only
 *    exists in schematic view, so arriving from the step after it (which
 *    returns to 3D) left the caption explaining a key that was not on screen.
 *    Add a step by declaring its `need`, never by relying on its neighbour.
 *  - **Steps degrade instead of failing.** A step whose target is missing is
 *    skipped at runtime: the 3D controls do not exist when WebGL is
 *    unavailable, and the tour still has to work there. `TD.tour.audit()`
 *    reports what would be skipped, so the degradation is inspectable rather
 *    than invisible, and tools/tourcheck.py fails on a non-optional miss.
 *    tourcheck walks the tour forwards *and backwards*, and asserts each
 *    step's declared state actually holds when it is painted.
 *  - **Exiting restores the page.** A tour that leaves you three levels deep
 *    with a part selected and the model half apart has made the product
 *    harder to use. Ending (by button, by Escape, or by finishing) puts
 *    the laptop back at its top level, scrolled to the top.
 *
 * The spotlight is four solid panels arranged around the target, not an SVG
 * mask or a spread box-shadow. Both alternatives were tried: the mask needs
 * its own coordinate space and drifts on scroll, and a spread shadow cannot
 * take a radius matching the element beneath it. Four rectangles are dull and
 * correct.
 */
(function (TD) {
  'use strict';

  var PAD = 6;              /* breathing room around a spotlit element */
  var AUTO_MS = 5600;       /* dwell per step when autoplay is on */

  function reduceMotion() {
    return !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
  }

  function $(sel) {
    try { return document.querySelector(sel); } catch (e) { return null; }
  }

  /* ---------- driving the real UI ----------
   * The app is a closed IIFE exporting no navigation API, which is useful
   * here: it forces the tour to do what a person would do, change the hash,
   * click the button, so there is no privileged path that could keep
   * working after the real one broke.
   */

  /* Rendering is synchronous, but the 3D board mounts its canvas
     asynchronously and the story section is built after its own layout pass,
     so polling is the honest way to wait for either. */
  function waitFor(sel, done, timeout) {
    var t0 = Date.now(), limit = timeout || 2500;
    (function poll() {
      if ($(sel) || Date.now() - t0 > limit) { done($(sel)); return; }
      setTimeout(poll, 60);
    })();
  }

  /* Present is not the same as shown. `#partindex` exists in the DOM while the
     schematic is up and only gains a box when the 3D view comes back, so
     waiting on existence alone returned too early and the spotlight landed
     where the element used to be. */
  function waitVisible(sel, done, timeout) {
    var t0 = Date.now(), limit = timeout || 3000;
    (function poll() {
      var t = $(sel);
      if ((t && t.getBoundingClientRect().height > 0) || Date.now() - t0 > limit) { done(t); return; }
      setTimeout(poll, 60);
    })();
  }

  function routeTo(route, done) {
    var url = '#/' + route;
    if (location.hash === url) { setTimeout(done, 40); return; }
    location.hash = url;
    setTimeout(done, 280);
  }

  function clickIt(sel, done) {
    var t = $(sel);
    if (t) t.click();
    setTimeout(done, 240);
  }

  /* A range input tells the app nothing when you only assign `.value`,
     the app listens for `input`. */
  function setRange(sel, value, done) {
    var t = $(sel);
    if (t) {
      t.value = value;
      t.dispatchEvent(new Event('input', { bubbles: true }));
    }
    setTimeout(done, 340);
  }

  /* Wait for smooth scrolling to actually stop, rather than guessing how long
     it takes. A fixed delay is a bet on how fast the page is, and that bet was
     lost on the single-file build: 2.1MB parses slower, a long scroll from the
     bottom of the story to the top was still running when the spotlight was
     placed, and the ring landed a whole viewport away from the breadcrumbs.
     Two identical readings means it has settled. */
  var SETTLE_FLOOR = 420;   /* minimum dwell before a step may be painted */

  function afterScroll(done, cap) {
    var last = null, still = 0, t0 = Date.now(), limit = cap || 2400;
    (function poll() {
      var y = Math.round(window.scrollY);
      if (y === last) still++; else { still = 0; last = y; }
      var elapsed = Date.now() - t0;
      /* The floor is not padding. Several steps re-render the device view
         before scrolling (switching back to 3D, routing up a level), and the
         scroll settles instantly while the new layout is still being built.
         Waiting only for scroll stability measured the old DOM and put the
         ring a whole viewport from its anchor. Both conditions must hold. */
      if ((still >= 2 && elapsed >= SETTLE_FLOOR) || elapsed > limit) { done(); return; }
      setTimeout(poll, 70);
    })();
  }

  function scrollIntoView(sel, done, block) {
    var t = $(sel);
    if (t) {
      t.scrollIntoView({
        behavior: reduceMotion() ? 'auto' : 'smooth',
        block: block || 'center'
      });
    }
    if (reduceMotion()) { setTimeout(done, 120); return; }
    afterScroll(done);
  }

  function toTop(done) {
    window.scrollTo({ top: 0, behavior: reduceMotion() ? 'auto' : 'smooth' });
    if (reduceMotion()) { setTimeout(done, 80); return; }
    afterScroll(done);
  }

  /* ---------- preconditions ----------
   *
   * Every step declares the state the page must be in for its caption to be
   * true, and that state is re-established on arrival no matter which
   * direction you came from. This replaces the previous arrangement, where a
   * step inherited whatever the step before it happened to leave behind.
   *
   * That inheritance produced three separate faults, all of the same shape:
   *
   *   - "Colour means country" spotlit the legend expecting the country key,
   *     but the key only exists in schematic view. Arriving from the step
   *     after it, which switches back to 3D, left the caption describing a
   *     key while the ring sat on "Click a solid to highlight it".
   *   - Walking backwards through the schematic steps skipped three steps at
   *     once, because the separation and lid controls do not exist in
   *     schematic view, so their anchors did not resolve and the tour kept
   *     going the way it was already travelling.
   *   - The dismantle step *toggled* separation, so re-entering it reassembled
   *     the machine instead of taking it apart.
   *
   * Hence: `need` is declarative and every helper below is idempotent. Running
   * a step twice, or reaching it from either side, must produce the same page.
   */

  /* Read from the toggle's own label rather than from what is in the board.
     Sniffing for a <canvas> looks obvious and is wrong: with WebGL
     unavailable the model view falls back to the axonometric SVG renderer,
     which has no canvas, so a canvas test reports "schematic" for a board
     that is not schematic at all, and ensureView would helpfully toggle the
     reader *out* of the view they were already in. The button says which view
     you are not currently in, which is the same signal a person uses. */
  function currentView() {
    if (!$('#board')) return 'none';
    var btn = $('#btn-mode');
    if (btn) return /3D view/i.test(btn.textContent || '') ? 'schematic' : '3d';
    /* no toggle at all: the device has no model, so schematic is all there is */
    return 'schematic';
  }

  function ensureRoute(route, done) {
    if (!route) { done(); return; }
    routeTo(route, function () { waitVisible('#board', function () { done(); }, 2000); });
  }

  /* Toggling is what a person does, but a toggle cannot be asked for a
     specific state, so this checks first and only clicks if it has to. A
     device with no 3D model has no toggle at all and is left as it is. */
  function ensureView(want, done) {
    if (!want || currentView() === 'none') { done(); return; }
    if (currentView() === want) { done(); return; }
    var btn = $('#btn-mode');
    if (!btn) { done(); return; }
    btn.click();
    setTimeout(function () {
      waitVisible('#board', function () { setTimeout(done, 300); }, 2500);
    }, 140);
  }

  /* Separation is set through the slider rather than the Dismantle button for
     the same reason: the button toggles, the slider is a value. */
  function ensureRange(sel, value, done) {
    if (value === undefined || value === null) { done(); return; }
    var t = $(sel);
    if (!t) { done(); return; }
    if (Math.abs(Number(t.value) - Number(value)) < 0.5) { done(); return; }
    setRange(sel, value, done);
  }

  function ensureDrawer(open, done) {
    if (open === undefined) { done(); return; }
    var d = $('#inspector .srcdrawer');
    if (!d) { done(); return; }
    if (!!d.open === !!open) { done(); return; }
    var sum = $('#inspector .srcsum');
    if (sum) sum.click(); else d.open = !!open;
    setTimeout(done, 240);
  }

  /* Applied in a fixed order, because each stage can rebuild what the next
     one looks for: routing replaces the whole device view, switching view
     replaces the toolbar the sliders live in, and the drawer only exists once
     the inspector has rendered. */
  function applyNeeds(step, done) {
    var need = step.need || {};
    ensureRoute(need.route, function () {
      ensureView(need.view, function () {
        ensureRange('#ex', need.explode, function () {
          ensureRange('#lidr', need.lid, function () {
            ensureDrawer(need.drawer, function () {
              if (!step.scroll) { done(); return; }
              waitVisible(step.scroll, function () {
                scrollIntoView(step.scroll, done, step.scrollBlock);
              }, 1800);
            });
          });
        });
      });
    });
  }

  /* ---------- the script ----------
   * `target` is the element to spotlight. `act` runs before the step is shown
   * and calls its callback once the page has settled. `optional` marks a step
   * expected to be absent in some environments: the 3D controls with WebGL
   * off, so tourcheck does not report it as a break.
   */
  var STEPS = [
    {
      chapter: 'Getting started',
      title: 'Welcome to a teardown',
      short: true,
      body: 'This is the laptop, the most detailed teardown on the site. Over the next few minutes ' +
            'you will take it apart, find out who makes each piece, follow one part down to a single ' +
            'company, and read every chart in the analysis underneath. Nothing is locked while the ' +
            'tour runs: click anything you like, and press Explore if you want the tour out of the ' +
            'way for a moment. Arrow keys work. Escape leaves.',
      need: { route: 'laptop', view: '3d', explode: 0 },
      top: true
    },

    /* ---- the machine ---- */
    {
      chapter: 'The machine',
      title: 'What you are looking at',
      body: 'Every teardown opens the same way: what the device is, how many ship in a year, and what ' +
            'one costs. Those two figures are the denominator for every market share you are about ' +
            'to see.',
      target: '.stagehead',
      need: { route: 'laptop', view: '3d' },
      top: true
    },
    {
      chapter: 'The machine',
      title: 'A real model, not a picture',
      body: 'The laptop is drawn as actual geometry. Drag it to spin, scroll to zoom, click any solid ' +
            'to see who supplies it. Go ahead and try it now: the tour waits for you, and it will ' +
            'still be here when you look back.',
      target: '#board',
      need: { route: 'laptop', view: '3d', explode: 0 }
    },
    {
      chapter: 'The machine',
      title: 'Take it apart',
      short: true,
      body: 'This is the whole point of the site. One control, and the machine separates into the ' +
            'components it is built from. Watch it come apart.',
      target: '#btn-explode',
      optional: true,
      need: { route: 'laptop', view: '3d', explode: 100 }
    },
    {
      chapter: 'The machine',
      title: 'Or take it apart slowly',
      body: 'The slider gives you every position in between, which is usually where you can actually ' +
            'see how something is stacked. It is being dragged for you here. Try it yourself after.',
      target: '#ex',
      optional: true,
      need: { route: 'laptop', view: '3d', explode: 55 }
    },
    {
      chapter: 'The machine',
      title: 'Open the lid',
      body: 'The laptop is hinged, so it gets a control nothing else on the site has. The display ' +
            'assembly swings on the hinge the way the real one does.',
      target: '#lidr',
      optional: true,
      need: { route: 'laptop', view: '3d', explode: 55, lid: 95 }
    },
    {
      chapter: 'The machine',
      title: 'Prefer it flat?',
      body: 'Schematic view drops the 3D entirely and lays the device out as a board. Every teardown ' +
            'works this way, including the ones with no 3D model at all, so nothing is ever hidden ' +
            'behind a graphics card.',
      target: '#board',
      need: { route: 'laptop', view: 'schematic' }
    },
    {
      chapter: 'The machine',
      title: 'Colour means country',
      body: 'Now the key appears: every colour is a supplier home country, and it is the same key ' +
            'across the whole site. This is why you can read the geography of a supply chain here ' +
            'without reading a single number.',
      target: '#legend',
      need: { route: 'laptop', view: 'schematic' }
    },
    {
      chapter: 'The machine',
      title: 'Every part, listed',
      body: 'Back in 3D. If spinning a model is not your thing, everything in view is also a plain ' +
            'list, and hovering a name highlights that part in the model.',
      target: '#partindex',
      optional: true,
      need: { route: 'laptop', view: '3d' },
      scroll: '#partindex'
    },

    /* ---- who supplies it ---- */
    {
      chapter: 'Who supplies it',
      title: 'Pick a part, get its suppliers',
      short: true,
      body: 'Selecting the processor opens the panel on the right. This is the core of the site: for ' +
            'each layer, who actually makes it and what share each of them holds.',
      target: '#inspector-shell',
      need: { route: 'laptop/cpu' },
      scroll: '#inspector-shell', scrollBlock: 'start'
    },
    {
      chapter: 'Who supplies it',
      title: 'How concentrated is it, really',
      body: 'Each layer carries an HHI, the measure a competition regulator actually uses. Anything ' +
            'above 2,500 counts as highly concentrated. The coloured band saves you having to ' +
            'remember the scale.',
      target: '#inspector-shell',
      need: { route: 'laptop/cpu' },
      scroll: '#inspector-shell', scrollBlock: 'start'
    },
    {
      chapter: 'Who supplies it',
      title: 'Where the number came from',
      body: 'Open this and you get the receipts: what was measured, which year, how confident we are, ' +
            'and who published it. If nobody published a figure, the site says so instead of ' +
            'inventing one.',
      target: '#inspector .srcdrawer',
      optional: true,
      need: { route: 'laptop/cpu', drawer: true },
      scroll: '#inspector .srcdrawer'
    },
    {
      chapter: 'Who supplies it',
      title: 'Now go deeper',
      short: true,
      body: 'Parts have parts. The mainboard holds the processor, the processor is made by a foundry, ' +
            'and the foundry runs on lithography machines. Five levels down from a laptop you reach ' +
            'one company, Zeiss, making the optics, with no alternative supplier anywhere on earth. ' +
            'That descent is what this site is for.',
      target: '#inspector-shell',
      need: { route: 'laptop/euv-optics' },
      scroll: '#inspector-shell', scrollBlock: 'start'
    },
    {
      chapter: 'Who supplies it',
      title: 'Finding your way back',
      body: 'The trail along the top shows how deep you have gone and takes you back up a level at a ' +
            'time. We are returning to the whole machine now.',
      target: '#crumbs',
      need: { route: 'laptop' },
      top: true
    },
    {
      chapter: 'Who supplies it',
      title: 'Things that are not parts',
      body: 'Some of what decides a market is not a component at all: the brand on the lid, the firm ' +
            'that assembles it, the operating system. Those sit separately, because they are markets ' +
            'the device sits inside rather than pieces of it.',
      target: '.metabar',
      optional: true,
      need: { route: 'laptop' },
      scroll: '.metabar'
    },

    /* ---- the analysis: one step per visualisation ---- */
    {
      chapter: 'The analysis',
      title: 'The long-form analysis',
      body: 'Ten of the fifteen teardowns carry a full written analysis below the model. Every figure ' +
            'in it is read from the same component data you were just clicking, so the prose can ' +
            'never drift away from the numbers underneath it. These tiles are the headline measures ' +
            'for the whole device.',
      target: '#st-overview',
      need: { route: 'laptop' },
      scroll: '#st-overview', scrollBlock: 'start'
    },
    {
      chapter: 'The analysis',
      title: 'What the teardown found',
      body: 'The findings are the argument in three boxes. Each one names the layers it rests on, and ' +
            'the chips underneath jump you straight to them.',
      target: '#st-overview .st-boxes',
      optional: true,
      need: { route: 'laptop' },
      scroll: '#st-overview .st-boxes'
    },
    {
      chapter: 'The analysis',
      title: 'How it is built, stage by stage',
      body: 'Twelve stages, upstream to downstream, accounting for every one of the 48 layers in this ' +
            'teardown. Each card shows the tightest market inside that stage, which is what makes a ' +
            'stage a chokepoint rather than just a step.',
      target: '#st-journey .st-stage',
      optional: true,
      need: { route: 'laptop' },
      scroll: '#st-journey .st-stages', scrollBlock: 'start'
    },
    {
      chapter: 'The analysis',
      title: 'The value chain, as it actually runs',
      body: 'A list implies one thing follows another. Real supply chains run in parallel lanes that ' +
            'converge at assembly, and this is that shape: silicon, display and mechanical arriving ' +
            'separately, meeting at the end.',
      target: '.st-flow .st-lane',
      optional: true,
      need: { route: 'laptop' },
      scroll: '.st-flow'
    },
    {
      chapter: 'The analysis',
      title: 'Where each stage happens',
      body: 'The same journey read geographically. Each bar is one stage, coloured by supplier home ' +
            'country. Design in the United States, tools in the Netherlands and Japan, fabrication in ' +
            'Taiwan, materials in China. Nobody has to assert it: the strip just shows it.',
      target: '#st-journey .st-heat',
      optional: true,
      need: { route: 'laptop' },
      scroll: '#st-journey .st-heat'
    },
    {
      chapter: 'The analysis',
      title: 'Where the money goes',
      body: 'Cost by subsystem, top-level components only. Anything the teardown cannot attribute is ' +
            'drawn as a hatched bar rather than quietly folded into the rest, so the gaps stay ' +
            'visible.',
      target: '#st-value .st-card',
      optional: true,
      need: { route: 'laptop' },
      scroll: '#st-value', scrollBlock: 'start'
    },
    {
      chapter: 'The analysis',
      title: 'How big each market is',
      body: 'Market size by layer, on a log scale because these span three orders of magnitude. ' +
            'Hollow bars are whole-world markets for that component rather than laptop-only, and ' +
            'ranking them together without saying so would flatter the device-specific layers.',
      target: '#st-value .st-card:nth-of-type(2)',
      optional: true,
      need: { route: 'laptop' },
      scroll: '#st-value .st-card:nth-of-type(2)'
    },
    {
      chapter: 'The analysis',
      title: 'Cost against power',
      body: 'The whole section in one picture. Horizontal is share of the bill of materials, vertical ' +
            'is concentration. They are close to unrelated: the biggest thing you buy is rarely the ' +
            'market with the least competition. Spending and leverage sit in different places.',
      target: '#st-value .st-scatter',
      optional: true,
      need: { route: 'laptop' },
      scroll: '#st-value .st-scatter'
    },
    {
      chapter: 'The analysis',
      title: 'The central claim, drawn',
      short: true,
      body: 'This is the chart the site exists to make. Concentration rises at every step away from ' +
            'the finished product: laptops are a competitive market, and five layers underneath they ' +
            'are a monopoly. Nothing about a laptop is concentrated until you stop looking at the ' +
            'laptop.',
      target: '#st-power .st-card',
      need: { route: 'laptop' },
      scroll: '#st-power', scrollBlock: 'start'
    },
    {
      chapter: 'The analysis',
      title: 'The tightest layers anywhere in it',
      body: 'The same data ranked flat, on a fixed nought to ten thousand scale so nothing is ' +
            'exaggerated by autoscaling. The dots mark layers flagged by hand as chokepoints.',
      target: '#st-power .st-card:nth-of-type(2)',
      optional: true,
      need: { route: 'laptop' },
      scroll: '#st-power .st-card:nth-of-type(2)'
    },
    {
      chapter: 'The analysis',
      title: 'Where it breaks',
      body: 'Each chokepoint gets a card: who holds it, what sits above it, and what else in the ' +
            'teardown names it as an input. None of that is written by hand. It is the dependency ' +
            'graph read back to you, so the consequence of a stoppage is a fact rather than a guess.',
      target: '#st-breaks .st-choke',
      need: { route: 'laptop' },
      scroll: '#st-breaks', scrollBlock: 'start'
    },
    {
      chapter: 'The analysis',
      title: 'Two maps that disagree',
      body: 'Where the cost goes, and where the leverage sits. The first weights every component by ' +
            'what it costs; the second counts share points at any depth. One supplier holding 91% of ' +
            'one obscure layer outranks a dozen holding 5% each, which is why these two charts do not ' +
            'agree and why both are here.',
      target: '#st-geography .st-card',
      optional: true,
      need: { route: 'laptop' },
      scroll: '#st-geography', scrollBlock: 'start'
    },
    {
      chapter: 'The analysis',
      title: 'How it got this way',
      body: 'Every recorded transaction against every layer, in date order. Deliberately not plotted ' +
            'against a value axis: several of these were never disclosed, and a money axis would have ' +
            'to drop or invent them. Sequence is the honest dimension.',
      target: '#st-history .st-deal',
      optional: true,
      need: { route: 'laptop' },
      scroll: '#st-history', scrollBlock: 'start'
    },
    {
      chapter: 'The analysis',
      title: 'Show your working',
      body: 'The last section is the provenance: every publisher behind the teardown, how many layers ' +
            'cite each, and how much of the device is well measured against merely estimated. A site ' +
            'making claims this strong owes you this page.',
      target: '#st-method .st-card',
      optional: true,
      need: { route: 'laptop' },
      scroll: '#st-method', scrollBlock: 'start'
    },

    /* ---- the rest of the site ---- */
    {
      chapter: 'Across the site',
      title: 'Search anything',
      body: 'Any part, any company, across all fifteen teardowns. Searching a supplier shows you ' +
            'every device it turns up in, which is usually more places than you expect.',
      target: '.searchwrap',
      need: { route: 'laptop' },
      top: true
    },
    {
      chapter: 'Across the site',
      title: 'The same questions, every device',
      short: true,
      body: 'Findings runs these tables across the whole catalogue at once: the tightest layers ' +
            'anywhere, and the ones where nobody has won yet. That is the tour. Go and take ' +
            'something apart.',
      target: '.navtabs',
      need: { route: 'laptop' },
      top: true
    }
  ];

  /* The steps the current run walks. A short tour is a *filter* over the one
     script rather than a second list, so the two can never describe the site
     differently: a step fixed for the full tour is fixed for both. `short`
     marks the six that carry the argument on their own. */
  var ACTIVE = STEPS;

  function pickSteps(mode) {
    if (mode !== 'short') return STEPS;
    var few = STEPS.filter(function (st) { return st.short; });
    return few.length ? few : STEPS;
  }

  /* ---------- overlay ---------- */

  var el = {};
  var idx = -1;
  var running = false;
  var autoplay = false;
  var autoTimer = null;
  var lastFocus = null;
  var current = null;
  var minimised = false;
  var chooserFocus = null;
  var tourMode = 'full';

  function build() {
    if (el.root) return;
    var root = document.createElement('div');
    root.className = 'tour';
    root.setAttribute('hidden', '');
    root.innerHTML =
      '<div class="tour-scrim tour-n"></div>' +
      '<div class="tour-scrim tour-s"></div>' +
      '<div class="tour-scrim tour-w"></div>' +
      '<div class="tour-scrim tour-e"></div>' +
      '<div class="tour-ring" hidden></div>' +
      '<div class="tour-card" role="dialog" aria-modal="true" aria-labelledby="tour-title" tabindex="-1">' +
        '<button type="button" class="tour-x" aria-label="End tour" title="End tour">&times;</button>' +
        '<div class="tour-track">' +
          '<i class="tour-fill"></i>' +
          /* second bar on the same track: step progress underneath, autoplay
             countdown over it, so one strip answers both "how far in am I"
             and "how long until this moves on" */
          '<i class="tour-autofill"></i>' +
        '</div>' +
        '<div class="tour-head">' +
          '<span class="tour-chapter"></span>' +
          '<span class="tour-count"></span>' +
        '</div>' +
        '<h3 id="tour-title"></h3>' +
        '<p class="tour-text"></p>' +
        '<div class="tour-foot">' +
          '<div class="tour-nav">' +
            '<button type="button" class="tour-btn tour-min" aria-pressed="false" ' +
              'title="Hide the tour so you can explore. It keeps your place.">Explore</button>' +
            '<button type="button" class="tour-btn tour-auto" aria-pressed="false">Autoplay</button>' +
            '<button type="button" class="tour-btn tour-back">Back</button>' +
            '<button type="button" class="tour-btn primary tour-next">Next</button>' +
          '</div>' +
        '</div>' +
      '</div>';
    document.body.appendChild(root);

    el.root = root;
    el.ring = root.querySelector('.tour-ring');
    el.card = root.querySelector('.tour-card');
    el.fill = root.querySelector('.tour-fill');
    el.chapter = root.querySelector('.tour-chapter');
    el.count = root.querySelector('.tour-count');
    el.title = root.querySelector('#tour-title');
    el.text = root.querySelector('.tour-text');
    el.back = root.querySelector('.tour-back');
    el.next = root.querySelector('.tour-next');
    el.auto = root.querySelector('.tour-auto');
    el.n = root.querySelector('.tour-n');
    el.s = root.querySelector('.tour-s');
    el.w = root.querySelector('.tour-w');
    el.e = root.querySelector('.tour-e');

    el.min = root.querySelector('.tour-min');

    el.next.addEventListener('click', function () { stopAuto(); next(); });
    el.back.addEventListener('click', function () { stopAuto(); prev(); });
    el.auto.addEventListener('click', toggleAuto);
    el.min.addEventListener('click', toggleMin);
    el.autofill = root.querySelector('.tour-autofill');
    root.querySelector('.tour-x').addEventListener('click', function () { stop(); });
  }

  /* Collapse to a bar at the bottom of the screen. The scrim and ring go
     away entirely, the step and progress are kept, and one more click brings
     it back exactly where it was. This is the answer to "let me look at the
     thing myself for a minute". */
  function toggleMin() {
    minimised = !minimised;
    el.root.classList.toggle('min', minimised);
    el.min.setAttribute('aria-pressed', String(minimised));
    el.min.textContent = minimised ? 'Resume tour' : 'Explore';
    if (minimised) {
      if (autoTimer) { clearTimeout(autoTimer); autoTimer = null; }
      clearCountdown();
    }
    else { reposition(); pulse(); if (autoplay) queueAuto(); }
  }

  /* Position the four panels so the target is the only lit region. Recomputed
     on resize and scroll, because the page underneath stays a live document. */
  function place(rect) {
    var W = window.innerWidth, H = window.innerHeight;
    if (!rect) {
      el.n.style.cssText = 'top:0;left:0;width:100%;height:100%';
      el.s.style.cssText = el.w.style.cssText = el.e.style.cssText = 'width:0;height:0';
      el.ring.hidden = true;
      return;
    }
    var t = Math.max(0, rect.top - PAD), b = Math.min(H, rect.bottom + PAD);
    var l = Math.max(0, rect.left - PAD), r = Math.min(W, rect.right + PAD);

    el.n.style.cssText = 'top:0;left:0;width:100%;height:' + t + 'px';
    el.s.style.cssText = 'top:' + b + 'px;left:0;width:100%;height:' + Math.max(0, H - b) + 'px';
    el.w.style.cssText = 'top:' + t + 'px;left:0;width:' + l + 'px;height:' + Math.max(0, b - t) + 'px';
    el.e.style.cssText = 'top:' + t + 'px;left:' + r + 'px;width:' + Math.max(0, W - r) +
                         'px;height:' + Math.max(0, b - t) + 'px';

    el.ring.hidden = false;
    el.ring.style.cssText = 'top:' + t + 'px;left:' + l + 'px;width:' + Math.max(0, r - l) +
                            'px;height:' + Math.max(0, b - t) + 'px';
  }

  /* Restart the ring's arrival pulse. Removing the class is not enough on its
     own: the browser coalesces the remove and the re-add into no change at
     all, so the layout read in between is what actually forces the restart. */
  function pulse() {
    if (!el.ring || el.ring.hidden) return;
    el.ring.classList.remove('pulse');
    void el.ring.offsetWidth;
    el.ring.classList.add('pulse');
  }

  /* Put the card where it does not cover the thing it is describing.
   *
   * Below and above are tried first because a caption under its subject reads
   * most naturally. The side placements exist for the tall targets, the
   * inspector panel and the story sections run most of the viewport height,
   * and an earlier version centred the card horizontally on them, which put
   * the explanation directly on top of the thing being explained.
   *
   * The last resort deliberately picks the emptiest corner rather than giving
   * up at a fixed position: on a narrow window a full-height target can leave
   * no clean placement at all, and covering a corner of it beats covering the
   * middle.
   */
  function placeCard(rect) {
    var card = el.card;
    card.style.left = card.style.top = '';
    var cw = card.offsetWidth, ch = card.offsetHeight;
    var W = window.innerWidth, H = window.innerHeight, M = 16;
    var gap = M + PAD;

    function put(left, top) {
      card.style.left = Math.round(Math.min(Math.max(M, left), Math.max(M, W - cw - M))) + 'px';
      card.style.top = Math.round(Math.min(Math.max(M, top), Math.max(M, H - ch - M))) + 'px';
    }

    if (!rect) { put((W - cw) / 2, (H - ch) / 2); return; }

    var midX = rect.left + rect.width / 2 - cw / 2;
    var midY = rect.top + rect.height / 2 - ch / 2;

    if (H - rect.bottom >= ch + gap) { put(midX, rect.bottom + gap); return; }
    if (rect.top >= ch + gap)        { put(midX, rect.top - gap - ch); return; }
    if (W - rect.right >= cw + gap)  { put(rect.right + gap, midY); return; }
    if (rect.left >= cw + gap)       { put(rect.left - gap - cw, midY); return; }

    /* nothing clears it, take the corner with the most free space */
    var corners = [
      { l: M, t: M, free: rect.top * rect.left },
      { l: W - cw - M, t: M, free: rect.top * (W - rect.right) },
      { l: M, t: H - ch - M, free: (H - rect.bottom) * rect.left },
      { l: W - cw - M, t: H - ch - M, free: (H - rect.bottom) * (W - rect.right) }
    ].sort(function (a, b) { return b.free - a.free; });
    put(corners[0].l, corners[0].t);
  }

  function targetRect(step) {
    if (!step.target) return null;
    var t = $(step.target);
    if (!t) return null;
    var r = t.getBoundingClientRect();
    if (!r.width && !r.height) return null;
    /* an element scrolled fully out of view is worse than no spotlight */
    if (r.bottom < 0 || r.top > window.innerHeight) return null;
    return r;
  }

  function reposition() {
    if (!running || !current) return;
    var r = targetRect(current);
    place(r);
    placeCard(r);
  }

  /* Present is not the same as usable. `#legend` and `#partindex` both exist
     in the DOM in views where they are empty, so existence alone is not
     enough to spotlight something: a zero-height anchor gets a ring around
     nothing. */
  function visibleTarget(step) {
    if (!step.target) return true;
    var t = $(step.target);
    if (!t) return false;
    var r = t.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  }

  function resolvable(step) { return !step.target || !!$(step.target); }

  var FADE_MS = 170;         /* must match the .swapping transition in the CSS */

  function setContent(step, i) {
    el.chapter.textContent = step.chapter || '';
    el.count.textContent = 'Step ' + (i + 1) + ' of ' + ACTIVE.length;
    el.title.textContent = step.title;
    el.text.textContent = step.body;
    el.fill.style.width = Math.round((i + 1) / ACTIVE.length * 100) + '%';
    el.back.disabled = (i === 0);
    el.next.textContent = (i === ACTIVE.length - 1) ? 'Finish' : 'Next';
  }

  /* The order here is the whole reason step changes feel settled rather than
     jumpy: fade out, THEN put the page into the state the step needs, THEN
     swap the text and move, THEN fade back in. Writing the new caption before
     the navigation is what made the card appear to sit in the middle of the
     screen describing the next step while the page was still on the previous
     one.
     `token` makes a transition abandonable. Two Next presses in quick
     succession used to run both steps' actions concurrently, and whichever
     finished last won, which is how the separation slider ended up at a value
     no step had asked for. */
  var token = 0;

  function show(i, dir) {
    if (i < 0) { show(0, 1); return; }
    if (i >= ACTIVE.length) { stop(); return; }
    var mine = ++token;
    idx = i;
    var step = ACTIVE[i];
    current = step;
    el.root.classList.add('swapping');

    function stale() { return mine !== token || !running; }

    function arrive() {
      if (stale()) return;
      setContent(step, i);

      /* The anchor genuinely is not in this build: skip past it. Steps now
         establish their own state, so a miss here means the control does not
         exist at all (no WebGL, say) rather than that we arrived from the
         wrong direction. */
      if (!resolvable(step)) {
        var nxt = i + (dir === -1 ? -1 : 1);
        if (nxt < 0 || nxt >= ACTIVE.length) { stop(); return; }
        show(nxt, dir);
        return;
      }
      /* Exists but has no box yet: the view was just rebuilt and layout has
         not caught up. Measuring now puts the ring around nothing, so give it
         a few frames before deciding. */
      if (!visibleTarget(step)) {
        var tries = 0;
        (function settleTarget() {
          if (stale()) return;
          if (visibleTarget(step) || ++tries > 12) { paint(); return; }
          setTimeout(settleTarget, 60);
        })();
        return;
      }
      paint();
    }

    function paint() {
      if (stale()) return;
      reposition();
      el.root.classList.remove('swapping');
      if (pending) { drainPending(); return; }
      pulse();
      /* One late correction. Smooth scrolling can still be easing out when the
         first measurement is taken, which left the ring a few pixels adrift of
         the element it was supposed to be circling. */
      setTimeout(function () { if (!stale()) reposition(); }, 280);
      try { el.card.focus({ preventScroll: true }); } catch (e) { el.card.focus(); }
      if (autoplay) queueAuto();
    }

    /* let the fade actually start before the page moves under it */
    setTimeout(function () {
      if (stale()) return;
      applyNeeds(step, function () {
        if (stale()) return;
        if (step.top) { toTop(function () { runAct(step, arrive, stale); }); }
        else runAct(step, arrive, stale);
      });
    }, reduceMotion() ? 0 : FADE_MS);
  }

  function runAct(step, arrive, stale) {
    if (stale()) return;
    if (step.act) step.act(function () { if (!stale()) arrive(); });
    else arrive();
  }

  /* A step change takes up to a second while the page is routed and settled,
     and running two of them at once is what left the separation slider at a
     value no step had asked for. Rather than ignore the second press, which
     just feels broken, the latest request is held and applied when the
     current transition lands. Pressing Next three times quickly moves three
     steps; it simply does not move three steps *simultaneously*. */
  function busy() { return el.root && el.root.classList.contains('swapping'); }

  var pending = null;

  function request(i, dir) {
    if (i < 0 || i > ACTIVE.length) return;
    if (busy()) { pending = { i: i, dir: dir }; return; }
    pending = null;
    show(i, dir);
  }

  function drainPending() {
    if (!pending) return;
    var q = pending;
    pending = null;
    show(q.i, q.dir);
  }

  /* queued presses count from where the queue has got to, not from the step
     currently painted, or a fast double-press would ask for the same step */
  function cursor() { return pending ? pending.i : idx; }

  function next() { request(cursor() + 1, 1); }
  function prev() { request(cursor() - 1, -1); }

  /* The countdown is the bar itself rather than a number: width 0 with the
     transition off, one forced layout read to make the browser believe it,
     then width 100% over exactly the dwell. Restarting it needs that reflow
     or the browser coalesces the two writes and nothing animates. */
  function runCountdown() {
    if (!el.autofill) return;
    el.autofill.style.transition = 'none';
    el.autofill.style.width = '0%';
    void el.autofill.offsetWidth;
    el.autofill.style.transition = 'width ' + AUTO_MS + 'ms linear';
    el.autofill.style.width = '100%';
  }

  function clearCountdown() {
    if (!el.autofill) return;
    el.autofill.style.transition = 'none';
    el.autofill.style.width = '0%';
  }

  function queueAuto() {
    if (autoTimer) { clearTimeout(autoTimer); autoTimer = null; }
    runCountdown();
    autoTimer = setTimeout(function () {
      if (idx >= ACTIVE.length - 1) { stop(); return; }
      next();
    }, AUTO_MS);
  }

  function stopAuto() {
    if (autoTimer) { clearTimeout(autoTimer); autoTimer = null; }
    clearCountdown();
    autoplay = false;
    if (el.auto) {
      el.auto.setAttribute('aria-pressed', 'false');
      el.auto.classList.remove('on');
    }
  }

  function toggleAuto() {
    autoplay = !autoplay;
    el.auto.setAttribute('aria-pressed', String(autoplay));
    el.auto.classList.toggle('on', autoplay);
    if (autoplay) queueAuto();
    else { if (autoTimer) { clearTimeout(autoTimer); autoTimer = null; } clearCountdown(); }
  }

  function onKey(e) {
    if (!running) return;
    if (e.key === 'Escape') { e.preventDefault(); stop(); return; }
    if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'Enter') {
      e.preventDefault(); stopAuto(); next(); return;
    }
    if (e.key === 'ArrowLeft') { e.preventDefault(); stopAuto(); prev(); }
  }

  /* ---------- choosing a length ----------
   * Thirty-one steps is the right length for someone who wants the whole
   * argument and far too long for someone who just clicked a button to see
   * what this is. Asking first costs one click and stops the tour being a
   * commitment, which is what made it feel overwhelming.
   */
  function buildChooser() {
    if (el.choose) return;
    var c = document.createElement('div');
    c.className = 'tour-choose';
    c.setAttribute('hidden', '');
    var shortN = pickSteps('short').length;
    c.innerHTML =
      '<div class="tour-choose-scrim"></div>' +
      '<div class="tour-choose-card" role="dialog" aria-modal="true" ' +
        'aria-labelledby="tour-choose-title" tabindex="-1">' +
        '<button type="button" class="tour-x" aria-label="Close" title="Close">&times;</button>' +
        '<h3 id="tour-choose-title">Take a look around</h3>' +
        '<p>A guided walk through the laptop teardown. Nothing is locked while ' +
          'it runs, so you can click anything you like as you go.</p>' +
        '<div class="tour-choose-opts">' +
          '<button type="button" class="tour-opt" data-mode="short">' +
            '<b>Quick tour</b>' +
            '<span>' + shortN + ' steps, about a minute. The idea, and the one ' +
            'chart it rests on.</span>' +
          '</button>' +
          '<button type="button" class="tour-opt" data-mode="full">' +
            '<b>Full tour</b>' +
            '<span>' + STEPS.length + ' steps. Every control, every chart, and ' +
            'the whole descent to a single supplier.</span>' +
          '</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(c);
    el.choose = c;
    el.chooseCard = c.querySelector('.tour-choose-card');

    c.querySelector('.tour-choose-scrim').addEventListener('click', closeChooser);
    c.querySelector('.tour-x').addEventListener('click', closeChooser);
    c.querySelectorAll('[data-mode]').forEach(function (b) {
      b.addEventListener('click', function () {
        var mode = b.getAttribute('data-mode');
        closeChooser();
        start(mode);
      });
    });
    c.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { e.preventDefault(); closeChooser(); }
    });
  }

  function openChooser() {
    if (running) return;
    buildChooser();
    el.choose.removeAttribute('hidden');
    chooserFocus = document.activeElement;
    try { el.chooseCard.focus({ preventScroll: true }); } catch (e) { el.chooseCard.focus(); }
  }

  function closeChooser() {
    if (!el.choose) return;
    el.choose.setAttribute('hidden', '');
    try {
      if (chooserFocus && chooserFocus.focus && document.contains(chooserFocus)) chooserFocus.focus();
    } catch (e) { /* the trigger was re-rendered */ }
  }

  function start(mode) {
    build();
    if (running) return;
    ACTIVE = pickSteps(mode);
    tourMode = (mode === 'short') ? 'short' : 'full';
    running = true;
    minimised = false;
    lastFocus = document.activeElement;
    el.root.classList.remove('min', 'swapping');
    el.min.setAttribute('aria-pressed', 'false');
    el.min.textContent = 'Explore';
    el.root.removeAttribute('hidden');
    document.body.classList.add('tour-on');
    window.addEventListener('resize', reposition, true);
    window.addEventListener('scroll', reposition, true);
    document.addEventListener('keydown', onKey, true);
    show(0, 1);
  }

  /* Leaving hands the page back in a state someone can use: top level of the
     laptop, nothing selected, scrolled to the top. */
  function stop() {
    if (!running) return;
    running = false;
    stopAuto();
    pending = null;
    token++;              /* abandon any transition still in flight */
    current = null;
    minimised = false;
    el.root.classList.remove('min', 'swapping');
    el.root.setAttribute('hidden', '');
    document.body.classList.remove('tour-on');
    window.removeEventListener('resize', reposition, true);
    window.removeEventListener('scroll', reposition, true);
    document.removeEventListener('keydown', onKey, true);
    routeTo('laptop', function () {
      toTop(function () {
        var btn = document.getElementById('tour-btn');
        try {
          if (lastFocus && lastFocus.focus && document.contains(lastFocus)) lastFocus.focus();
          else if (btn) btn.focus();
        } catch (e) { /* the element went away with a re-render */ }
      });
    });
  }

  /* ---------- wiring ---------- */

  function wire() {
    var btn = document.getElementById('tour-btn');
    if (btn && !btn.__tourWired) {
      btn.__tourWired = true;
      btn.addEventListener('click', function () { openChooser(); });
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', wire);
  else wire();

  TD.tour = {
    start: start,
    open: openChooser,
    mode: function () { return tourMode; },
    stop: stop,
    next: next,
    prev: prev,
    steps: STEPS,
    list: function () { return ACTIVE; },
    isRunning: function () { return running; },
    index: function () { return idx; },
    /* what the page is actually showing, for the gate to compare against the
       step's declared `need` */
    view: currentView,
    /* Which steps resolve right now. tools/tourcheck.py drives the tour to
       each step and fails on a non-optional miss, so a step quietly pointing
       at a removed element is a build failure rather than something a reader
       finds before we do. */
    audit: function () {
      return STEPS.map(function (s, i) {
        return {
          i: i,
          title: s.title,
          target: s.target || null,
          optional: !!s.optional,
          need: s.need || null,
          found: !s.target || !!$(s.target),
          visible: visibleTarget(s)
        };
      });
    }
  };

})(window.TD);
