/* Teardown :: Smartphone
 *
 * Second flagship. Shares are indicative unit or revenue shares for the
 * stated year and basis; confidence is stated per node; every `sources`
 * entry keys into data/sources.js, where the publisher, document type and
 * a statement of what is really being cited live once.
 *
 * The deep chain here is deliberately NOT the notebook's. A laptop bottoms
 * out in lithography and EUV optics, and re-walking that would have made
 * two flagships tell the same story. A phone's own narrowest layer is its
 * display: the evaporators that pattern OLED, the masks they pattern
 * through, and the rolled alloy those masks are etched from. Three layers
 * almost nobody covers, each narrower than the one above it.
 */
TD.device({
  id: 'smartphone',
  name: 'Smartphone',
  icon: 'phone',
  category: 'Consumer computing',
  tagline: 'The most produced complex object in human history, gated by a machine shipped a few units a year.',
  unit: { volume: '~1.25bn units shipped (2025)', price: 'USD ~450 average selling price' },
  intro: 'Phones ship five times the volume of laptops and concentrate value harder at every ' +
         'layer. Two operating systems, three application processor vendors of consequence, ' +
         'one image sensor leader, one assembler that builds most of the premium tier, and, ' +
         'four layers into the display, a supplier list you can count on one hand.',
  view: { w: 1000, h: 640 },
  frames: [
    { label: 'Exploded stack', x: 322, y: 14, w: 356, h: 486 },
    { label: 'Not costed line by line', x: 40, y: 508, w: 920, h: 74 }
  ],

  /* ============================ STORY ============================
   * Rendered below the teardown by js/story.js. Editorial grouping only:
   * every id named here is a node defined further down, and every figure
   * shown beside it is read from that node at render time, so the prose
   * cannot drift away from the data.
   *
   * `stages` must account for all 48 nodes exactly once, tools/storycheck.py
   * asserts that and fails loudly on a miss, a duplicate or an unknown id.
   */
  story: {
    kicker: 'Flagship teardown',
    headline: 'The narrowest layer in a phone is not the processor. It is the machine that prints the screen.',
    lede: 'Forty-eight mapped layers, five tiers deep. Everyone knows the chip is made by one ' +
          'foundry. Almost nobody knows that the panel above it is patterned by evaporators ' +
          'built at a rate of a couple of units a year, through masks etched from an alloy ' +
          'rolled by two companies on earth.',

    tierNote: 'The phone you are holding is a competitive market. Four layers underneath it, nothing is.',
    geoLede: 'Two readings of the same question. By cost, a phone is an East Asian product and ' +
             'increasingly a Chinese one. By structural position it is still Japanese: the ' +
             'sensor, the masks, the mask stock and the machine that uses them.',

    findings: [
      { title: 'The display is the chokepoint, not the chip',
        body: 'Leading-edge foundry is famously concentrated, and it is, but there are three ' +
              'firms with a 2nm programme and vast capital behind them. The evaporators that ' +
              'pattern OLED ship at a couple of Gen-8 units a year from two suppliers, and the ' +
              'masks they print through come from essentially one Japanese printer. That is a ' +
              'harder bottleneck than the fab, and it is almost entirely untracked.',
        nodes: ['oled-deposition-m', 'fmm-m', 'invar-m'] },
      { title: 'Apple holds the unit crown and nearly all the profit',
        body: 'Apple finished 2025 as the largest smartphone brand by units on every major ' +
              'tracker, at somewhere between 240 and 247 million shipments depending on whose ' +
              'numbers you take. It has taken the large majority of industry operating profit ' +
              'throughout, on about a fifth of units, and the store layer underneath is where ' +
              'that asymmetry is actually enforced.',
        nodes: ['oem-m', 'appstore-m'] },
      { title: 'Memory stopped being a component and became the story',
        body: 'Contract DRAM prices rose roughly half again in a single quarter at the end of ' +
              '2025 as memory makers reallocated wafers to AI server demand. Memory is now the ' +
              'swing factor in a phone\'s bill of materials, and the three suppliers who set it ' +
              'have no reason to hurry more capacity into the market.',
        nodes: ['mem-m', 'dram-m'] }
    ],

    /* upstream -> downstream. Node counts here must sum to 48. */
    stages: [
      { id: 'design', name: 'Design and IP',
        note: 'Nothing physical yet. A phone processor starts as an instruction set licensed ' +
              'from one company and a design drawn in software sold by three.',
        nodes: ['soc-ip-m', 'eda-m'] },
      { id: 'equipment', name: 'Fab equipment and materials',
        note: 'The tools and consumables that make leading-edge silicon possible. Shared with ' +
              'every other advanced chip on the site, and narrow at every step.',
        nodes: ['litho-m', 'wafer-m', 'resist-m'] },
      { id: 'fab', name: 'Fabrication and packaging',
        note: 'Where the design becomes silicon, and then becomes a module small enough to fit ' +
              'a phone. One foundry does the overwhelming majority of the first part.',
        nodes: ['foundry-m', 'advpack-m'] },
      { id: 'silicon', name: 'Silicon components',
        note: 'The finished chips: processor, modem, memory, power, connectivity and the radio ' +
              'front end. Roughly half the cost of the machine converges here.',
        nodes: ['soc-m', 'modem-m', 'mem-m', 'dram-m', 'nand-m', 'pmic-m', 'wifi-m',
                'filter-m', 'pa-m'] },
      { id: 'displaychain', name: 'The display chain',
        note: 'Read bottom up, this is the narrowest sequence in the teardown: rolled alloy, ' +
              'etched mask, evaporator, emitter chemistry, panel, module.',
        nodes: ['invar-m', 'fmm-m', 'oled-deposition-m', 'oled-materials-m', 'oled-panel-m',
                'driver-ic-m', 'touch-m', 'display-m'] },
      { id: 'optics', name: 'Camera and optics',
        note: 'The clearest illustration on the site of why a component has to be opened before ' +
              'it is valued: the module is a scrap business, the parts inside it are not.',
        nodes: ['sensor-m', 'lens-m', 'vcm-m', 'camera-m'] },
      { id: 'power', name: 'Power and energy',
        note: 'Cathode and anode chemistry becomes a pouch cell, and the cell becomes a pack cut ' +
              'to whatever volume the chassis had left over.',
        nodes: ['cell-mats-m', 'battery-m', 'charger-m'] },
      { id: 'board', name: 'Board assembly',
        note: 'Substrate, passives and a high-density board that has been shrinking for a decade ' +
              'so the battery can grow into the space it gives up.',
        nodes: ['pcb-m', 'sip-m', 'passives-m', 'board-m'] },
      { id: 'mechanical', name: 'Glass, enclosure and everything you touch',
        note: 'Cover glass and its finishing, the frame, the connectors, the acoustics and the ' +
              'sensors. Low margin, largely Chinese, and thinly covered by anyone.',
        nodes: ['glass-finish-m', 'cover-glass-m', 'enclosure-m', 'mech-m', 'audio-m',
                'sensors-m', 'fingerprint-m', 'rf-m'] },
      { id: 'assembly', name: 'Final assembly, and what nobody prices',
        note: 'One contract manufacturer builds most of the premium tier, increasingly in India, ' +
              'plus the packaging, adhesives and freight that no bill of materials publishes.',
        nodes: ['assembly-m', 'unmapped-m'] },
      { id: 'channel', name: 'Brand, OS and the store',
        note: 'The badge, the operating system and the toll booth underneath it. Three layers ' +
              'that touch the buyer and manufacture nothing.',
        nodes: ['oem-m', 'os-m', 'appstore-m'] }
    ],

    /* The value chain as it actually runs: four parallel routes converging
       on final assembly. Every step is a node id defined below. */
    flow: {
      lanes: [
        { label: 'Silicon', steps: ['soc-ip-m', 'eda-m', 'foundry-m', 'advpack-m', 'board-m'],
          feed: { label: 'Equipment and materials',
                  steps: ['litho-m', 'wafer-m', 'resist-m'] } },
        { label: 'Display', steps: ['invar-m', 'fmm-m', 'oled-deposition-m', 'oled-panel-m', 'display-m'] },
        { label: 'Camera', steps: ['sensor-m', 'lens-m', 'vcm-m', 'camera-m'] },
        { label: 'Power', steps: ['cell-mats-m', 'battery-m'] }
      ],
      converge: ['assembly-m', 'oem-m']
    }
  },

  nodes: [

    /* ============ ROOT LEVEL ============ */
    {
      id: 'cover-glass-m', name: 'Cover glass', short: 'Glass',
      shape: { x: 340, y: 30, w: 320, h: 55 },
      blurb: 'Chemically strengthened alkali aluminosilicate. One brand has owned the category since the first iPhone.',
      bomPct: 3, layout: 'chain',
      market: { size: 'USD ~5.2bn', year: 2025, basis: 'mobile cover glass, glass material supplier share' },
      asOf: '2025', confidence: 'medium', chokepoint: true,
      shares: [
        { c: 'Corning', p: 62 }, { c: 'AGC', p: 15 },
        { c: 'Schott', p: 9 }, { c: 'Tunghsu', p: 6 }
      ],
      note: 'Corning has held this position for eighteen years against continuous, well-funded ' +
            'attack, which is rare enough to be worth studying on its own. The material is only ' +
            'half the business: the cutting, shaping and polishing is a separate oligopoly one ' +
            'layer down, and the two are frequently confused with each other.',
      sources: ['Corning disclosures', 'Omdia']
    },
    {
      id: 'display-m', name: 'Display assembly', short: 'Display',
      shape: { x: 340, y: 95, w: 320, h: 100 },
      blurb: 'Flexible OLED, touch layer, polariser and driver electronics laminated into one module.',
      bomPct: 17, layout: 'board',
      /* Container. The module market is real but the interesting structure is
         the panel underneath it, and printing a near-identical table twice
         would overstate how much is independently measured. */
      market: { size: null, year: 2025, basis: 'smartphone display module, container node' },
      asOf: '2025', confidence: 'medium',
      shares: [],
      note: 'The single most expensive subsystem in the phone, and the one with the deepest ' +
            'supply chain behind it. Open it: the concentration is four layers down, not here.',
      sources: ['Omdia', 'DSCC']
    },
    {
      id: 'board-m', name: 'Logic board', short: 'Board',
      shape: { x: 340, y: 205, w: 320, h: 105 },
      blurb: 'A double-sided, system-in-package board barely larger than a credit card, holding most of the value.',
      bomPct: 33, layout: 'board',
      market: { size: null, year: 2025, basis: 'smartphone logic board, container node' },
      asOf: '2025', confidence: 'medium',
      shares: [],
      note: 'A third of the bill of materials sits on a board the size of two postage stamps. ' +
            'Every layer inside it is more concentrated than the phone that contains it.',
      sources: ['Counterpoint', 'TechInsights']
    },
    {
      id: 'battery-m', name: 'Battery pack', short: 'Battery',
      shape: { x: 340, y: 320, w: 320, h: 100 },
      blurb: 'A single pouch cell, increasingly silicon-carbon anode to push past 6,000 mAh in the same volume.',
      bomPct: 4, layout: 'chain',
      market: { size: 'USD ~8.1bn', year: 2025, basis: 'smartphone battery cell and pack shipments, unit share' },
      asOf: '2025', confidence: 'medium',
      shares: [
        { c: 'ATL', p: 40 }, { c: 'Sunwoda', p: 15 }, { c: 'Samsung SDI', p: 10 },
        { c: 'LG Energy Solution', p: 9 }, { c: 'Desay', p: 8 }, { c: 'BYD', p: 6 }
      ],
      note: 'ATL is the largest supplier of smartphone cells on earth and is not listed anywhere. ' +
            'Its affiliate CATL is worth well over a hundred billion dollars. The consumer half ' +
            'stayed private, which is why almost no comparable-company screen ever surfaces it.',
      sources: ['TrendForce', 'Counterpoint']
    },
    {
      id: 'enclosure-m', name: 'Frame and back', short: 'Enclosure',
      shape: { x: 340, y: 430, w: 320, h: 60 },
      blurb: 'Aluminium or titanium midframe, glass or plastic back, and several hundred screws, gaskets and adhesives.',
      bomPct: 6,
      market: { size: 'USD ~14bn', year: 2025, basis: 'smartphone structural and casing components revenue' },
      asOf: '2025', confidence: 'low',
      shares: [
        { c: 'Lens Technology', p: 22 }, { c: 'BYD Electronic', p: 17 }, { c: 'Foxconn', p: 13 },
        { c: 'Luxshare', p: 11 }, { c: 'Ju Teng', p: 6 }
      ],
      note: 'Lens Technology bought Catcher\'s metal casing plants in 2020 and converted itself ' +
            'from a glass supplier into a structural one. It is the cleanest example on the site ' +
            'of a component maker buying its way up the value chain rather than engineering its ' +
            'way there.',
      sources: ['Company filings', 'Digitimes Research'],
      deals: [
        { y: 2020, a: 'Lens Technology', t: 'Catcher metal casing plants', v: 'USD ~1.4bn', n: 'Bought two Taiwanese casing fabs and became a structural supplier to Apple overnight.' }
      ]
    },
    {
      id: 'camera-m', name: 'Camera system', short: 'Camera',
      shape: { x: 50, y: 60, w: 260, h: 130 },
      blurb: 'Three or four modules, each a sensor, a lens stack, an actuator and stabilisation.',
      bomPct: 14, layout: 'board',
      market: { size: 'USD ~49bn', year: 2025, basis: 'smartphone camera module assembly revenue' },
      asOf: '2025', confidence: 'medium',
      shares: [
        { c: 'Sunny Optical', p: 16 }, { c: 'LG Innotek', p: 13 }, { c: 'Foxconn', p: 11 },
        { c: 'Q Tech', p: 9 }, { c: 'Cowell', p: 8 }, { c: 'Truly', p: 6 }
      ],
      note: 'Module assembly is fragmented and structurally low margin: the assembler buys the ' +
            'expensive parts and adds alignment. The sensor and the lens inside it are among the ' +
            'best businesses in the phone. This is the single clearest argument on the site for ' +
            'opening a component before valuing it.',
      sources: ['Counterpoint', 'TrendForce']
    },
    {
      id: 'audio-m', name: 'Audio and haptics', short: 'Audio',
      shape: { x: 50, y: 200, w: 260, h: 120 },
      blurb: 'Speaker box, MEMS microphones, a smart amplifier and a linear resonant actuator for the taptic feel.',
      bomPct: 3,
      market: { size: 'USD ~9.5bn', year: 2025, basis: 'smartphone acoustic and haptic components revenue' },
      asOf: '2025', confidence: 'low',
      shares: [
        { c: 'Goertek', p: 26 }, { c: 'AAC Technologies', p: 24 }, { c: 'Luxshare', p: 12 },
        { c: 'Knowles', p: 8 }, { c: 'Cirrus Logic', p: 7 }
      ],
      note: 'Goertek and AAC are a Chinese duopoly in acoustics that also took most of the true ' +
            'wireless earbud assembly business on the same competence. Cirrus Logic sits inside ' +
            'as amplifier silicon and derives the large majority of its revenue from one customer, ' +
            'which is a concentration risk rarely priced as one.',
      sources: ['Company filings', 'Yole Group']
    },
    {
      id: 'sensors-m', name: 'Sensors and biometrics', short: 'Sensors',
      shape: { x: 50, y: 330, w: 260, h: 120 },
      blurb: 'Accelerometer, gyroscope, magnetometer, ambient light, proximity and the reader under the screen.',
      bomPct: 3, layout: 'board',
      market: { size: 'USD ~8.4bn', year: 2025, basis: 'smartphone MEMS and biometric sensor revenue' },
      asOf: '2025', confidence: 'low',
      shares: [
        { c: 'Bosch', p: 23 }, { c: 'Goodix', p: 16 }, { c: 'STMicroelectronics', p: 14 },
        { c: 'TDK', p: 11 }, { c: 'Egis', p: 7 }
      ],
      note: 'Bosch is the largest MEMS maker in the world and is majority-held by a charitable ' +
            'foundation, so it never appears in a screen of listed semiconductor comparables and ' +
            'is not for sale at any price. That is worth knowing before building a thesis around ' +
            'consolidating this layer.',
      sources: ['Yole Group', 'Company filings']
    },
    {
      id: 'rf-m', name: 'RF front end', short: 'RF',
      shape: { x: 690, y: 60, w: 260, h: 130 },
      blurb: 'Power amplifiers, filters, switches and tuners. A 5G phone carries dozens, one per band combination.',
      bomPct: 7, layout: 'board',
      market: { size: 'USD ~16bn', year: 2025, basis: 'mobile RF front-end revenue' },
      asOf: '2025', confidence: 'medium', chokepoint: true,
      shares: [
        { c: 'Qualcomm', p: 21 }, { c: 'Broadcom', p: 18 }, { c: 'Murata', p: 14 },
        { c: 'Skyworks', p: 11 }, { c: 'Qorvo', p: 10 }, { c: 'Maxscend', p: 6 }
      ],
      note: 'Qualcomm passed Broadcom by selling the front end as a platform bundled with the ' +
            'processor rather than as parts. The incumbents still hold over seventy percent ' +
            'between them, but Chinese entrants have taken the low bands and are working upward, ' +
            'and the two most exposed incumbents have responded by agreeing to merge.',
      sources: ['Yole Group', 'TechInsights'],
      deals: [
        { y: 2025, a: 'Skyworks', t: 'Qorvo', v: 'USD ~22bn', n: 'Cash and stock; Skyworks holders take ~63% of the combined company. Expected to close in early 2027 subject to antitrust review: the defining consolidation of this layer.' },
        { y: 2024, a: 'Starboard Value', t: 'Qorvo (activist stake)', v: 'n/a', n: 'Forced the strategic review that ended in the Skyworks combination.' }
      ]
    },
    {
      id: 'charger-m', name: 'Charging and power delivery', short: 'Charging',
      shape: { x: 690, y: 200, w: 260, h: 120 },
      blurb: 'Fast-charge circuitry, the wireless coil, and the brick that is increasingly not in the box.',
      bomPct: 2,
      market: { size: 'USD ~6.4bn', year: 2025, basis: 'mobile charging silicon and external adapters revenue' },
      asOf: '2025', confidence: 'low',
      shares: [
        { c: 'Salcomp', p: 18 }, { c: 'Luxshare', p: 14 }, { c: 'Flex', p: 9 },
        { c: 'Navitas', p: 7 }, { c: 'Innoscience', p: 6 }
      ],
      note: 'Gallium nitride halved the size of the charger and created a genuinely new silicon ' +
            'category in the process. It is one of the very few places in mobile where a startup ' +
            'reached a real position inside a decade, largely because the incumbents treated the ' +
            'adapter as an accessory rather than a product.',
      sources: ['Yole Group', 'Company filings']
    },
    {
      id: 'mech-m', name: 'Connectors and mechanicals', short: 'Mechanicals',
      shape: { x: 690, y: 330, w: 260, h: 120 },
      blurb: 'Board-to-board connectors, flexible printed circuits, the SIM tray, gaskets and adhesives.',
      bomPct: 4,
      market: { size: 'USD ~12bn', year: 2025, basis: 'smartphone interconnect and mechanical parts revenue' },
      asOf: '2025', confidence: 'low',
      shares: [
        { c: 'Luxshare', p: 20 }, { c: 'Foxconn', p: 15 }, { c: 'Amphenol', p: 11 },
        { c: 'Molex', p: 8 }, { c: 'JAE', p: 7 }
      ],
      note: 'Luxshare went from a connector maker to an iPhone assembler in roughly a decade, ' +
            'almost entirely by acquisition. It is the most aggressive supply-chain roll-up in ' +
            'Chinese hardware and the template every other component maker on this page has ' +
            'been measured against since.',
      sources: ['Company filings', 'Digitimes Research']
    },
    {
      id: 'unmapped-m', name: 'Not costed line by line', short: 'Unmapped',
      shape: { x: 40, y: 508, w: 920, h: 74 },
      blurb: 'The remainder of the bill of materials that no public teardown splits by supplier.',
      bomPct: 4,
      /* The honest-gap node, matching the notebook's `unpriced`. A stated
         market size here would be an invention: the whole point is that
         nobody publishes one. */
      market: { size: null, year: 2025, basis: 'residual bill of materials, no published supplier split' },
      asOf: '2025', confidence: 'low',
      shares: [],
      note: 'Packaging, adhesives, thermal graphite, the SIM tray insert, screws, labels, the ' +
            'cable in the box, inbound freight and duty. Teardown houses cost these in aggregate ' +
            'and never by supplier, because the parts are commodity and the suppliers are ' +
            'interchangeable and regional. Carried as one honest line rather than split five ways ' +
            'on guesswork: it is roughly the same size as the entire camera lens market, which ' +
            'is a useful reminder of how much of a phone is simply not tracked.',
      sources: ['Counterpoint', 'TechInsights']
    },

    /* ============ META ============ */
    {
      id: 'oem-m', name: 'Brand', short: 'Brand', kind: 'meta',
      blurb: 'Who sells the phone and owns the customer.',
      market: { size: 'USD ~560bn', year: 2025, basis: 'smartphone shipments, unit share, sell-in' },
      asOf: '2025', confidence: 'high',
      shares: [
        { c: 'Apple', p: 20 }, { c: 'Samsung', p: 19 }, { c: 'Xiaomi', p: 13 },
        { c: 'Oppo', p: 11 }, { c: 'Transsion', p: 9 }, { c: 'vivo', p: 8 },
        { c: 'Honor', p: 4 }
      ],
      note: 'Apple finished 2025 as the largest smartphone brand by units, on somewhere between ' +
            '240 and 247 million shipments in a market of roughly 1.25 billion. The spread is ' +
            'the point: IDC and Counterpoint publish different totals for the same year on ' +
            'different sell-in definitions, and they disagreed outright about who led in 2023. ' +
            'Anyone quoting a single smartphone share to two decimal places has not checked ' +
            'whose tracker it came from. Units are close to evenly split at the top in any ' +
            'reading; profit is not, and never has been: Apple has taken the large majority of ' +
            'industry operating profit on about a fifth of units for a decade, which remains the ' +
            'single most important fact about this market. Oppo\'s share here includes OnePlus ' +
            'and realme, consolidated into it from January 2026.',
      sources: ['Counterpoint', 'IDC', 'Canalys', 'Omdia']
    },
    {
      id: 'assembly-m', name: 'Final assembly', short: 'Assembly', kind: 'meta',
      blurb: 'Who screws it together. Concentrated to a degree most people would not guess.',
      market: { size: 'USD ~58bn', year: 2025, basis: 'smartphone EMS and final assembly revenue' },
      asOf: '2025', confidence: 'medium', chokepoint: true,
      shares: [
        { c: 'Foxconn', p: 37 }, { c: 'Luxshare', p: 15 }, { c: 'BYD Electronic', p: 11 },
        { c: 'Pegatron', p: 8 }, { c: 'Wingtech', p: 7 }, { c: 'Longcheer', p: 6 }
      ],
      note: 'On iPhone specifically, Foxconn assembles roughly two thirds. The India shift is ' +
            'real and now material at the assembly step, but it is assembly that moved, not the ' +
            'component base around it. The displays, sensors, cells and casings still ship into ' +
            'India from the same Chinese, Korean and Japanese suppliers, which is why the value ' +
            'relocated far less than the volume did.',
      sources: ['Counterpoint', 'Digitimes Research', 'Company filings']
    },
    {
      id: 'os-m', name: 'Mobile operating system', short: 'OS', kind: 'meta',
      blurb: 'A clean global duopoly, and the subject of nearly every major platform antitrust case of the last five years.',
      market: { size: null, year: 2025, basis: 'mobile OS installed base share, measured from web traffic' },
      asOf: '2025', confidence: 'high', chokepoint: true,
      shares: [ { c: 'Google', p: 72 }, { c: 'Apple', p: 27 } ],
      note: 'Measured from web analytics tags rather than shipments, which is a different ' +
            'question from every other share on this teardown and worth stating plainly. The ' +
            'operating system itself is not where the economics sit: the store underneath it is.',
      sources: ['StatCounter']
    },
    {
      id: 'appstore-m', name: 'App distribution', short: 'Store', kind: 'meta',
      blurb: 'The toll booth under the operating system, and the layer regulators are actually attacking.',
      market: { size: 'USD ~185bn', year: 2025, basis: 'consumer spending through mobile app stores, gross' },
      asOf: '2025', confidence: 'medium', chokepoint: true,
      shares: [ { c: 'Apple', p: 62 }, { c: 'Google', p: 34 } ],
      note: 'Apple takes the clear majority of gross consumer app spending on well under half of ' +
            'installed base: the same profit asymmetry as the hardware layer, enforced through ' +
            'a different mechanism. Both platforms take roughly thirty percent of digital ' +
            'transactions, and the EU Digital Markets Act, the Epic litigation in the United ' +
            'States, and Japanese and Korean legislation are all attacking that number from ' +
            'different directions at once. This is the only layer in the teardown where the ' +
            'principal risk is statutory rather than competitive.',
      sources: ['Counterpoint', 'Company filings']
    },

    /* ============ COVER GLASS CHAIN ============ */
    {
      id: 'glass-finish-m', parent: 'cover-glass-m', name: 'Glass finishing', short: 'Finishing',
      blurb: 'Cutting, CNC shaping, polishing and coating the raw glass sheet into a finished cover.',
      market: { size: 'USD ~7bn', year: 2025, basis: 'mobile cover glass fabrication and finishing revenue' },
      asOf: '2025', confidence: 'low',
      shares: [
        { c: 'Lens Technology', p: 31 }, { c: 'Biel Crystal', p: 27 },
        { c: 'Dongxu Optoelectronic', p: 7 }, { c: 'Sunny Optical', p: 5 }
      ],
      note: 'Two Chinese firms do most of the world\'s cover glass finishing, and this is a ' +
            'genuinely different business from making the glass: Corning sells them the sheet. ' +
            'Stacking the two oligopolies is what makes the front of a phone look more ' +
            'concentrated than either layer is on its own. Biel Crystal is unlisted, which keeps ' +
            'half the layer invisible to public-market analysis.',
      sources: ['Company filings', 'Digitimes Research']
    },

    /* ============ DISPLAY CHAIN ============ */
    {
      id: 'oled-panel-m', parent: 'display-m', name: 'OLED panel', short: 'Panel',
      blurb: 'The panel itself: thin-film transistor backplane, evaporated organic stack, encapsulation.',
      layout: 'chain',
      market: { size: 'USD ~42bn', year: 2025, basis: 'smartphone OLED panel shipments, unit share' },
      asOf: '2025', confidence: 'high',
      shares: [
        { c: 'Samsung Display', p: 34 }, { c: 'BOE', p: 22 }, { c: 'CSOT', p: 11 },
        { c: 'Visionox', p: 10 }, { c: 'Tianma', p: 8 }, { c: 'LG Display', p: 6 }
      ],
      note: 'Roughly 900 million smartphone OLED panels shipped in 2025, and for the first time ' +
            'slightly more than half of them were made in China rather than Korea. That crossover ' +
            'is the most consequential thing that happened in displays this decade. Samsung ' +
            'Display still owns the premium tier and the margin; BOE broke into the iPhone ' +
            'supply chain and the rest of the Chinese base took the mid-range, and panel prices ' +
            'have fallen accordingly.',
      sources: ['UBI Research', 'Omdia', 'DSCC', 'Counterpoint']
    },
    {
      id: 'driver-ic-m', parent: 'display-m', name: 'Display driver IC', short: 'Driver IC',
      blurb: 'The chip that addresses every subpixel, bonded to the panel edge on a flexible film.',
      market: { size: 'USD ~4.6bn', year: 2025, basis: 'smartphone OLED display driver IC revenue' },
      asOf: '2025', confidence: 'medium',
      shares: [
        { c: 'Samsung LSI', p: 32 }, { c: 'LX Semicon', p: 21 }, { c: 'Novatek', p: 14 },
        { c: 'Chipone', p: 9 }, { c: 'Himax', p: 6 }
      ],
      note: 'A quietly strategic layer: OLED driver ICs are made on mature nodes that compete for ' +
            'the same foundry capacity as everything else, and a shortage here stops panel lines ' +
            'as effectively as a shortage of glass. LX Semicon was spun out of LG and remains ' +
            'heavily exposed to a single panel customer.',
      sources: ['Omdia', 'TrendForce']
    },
    {
      id: 'touch-m', parent: 'display-m', name: 'Touch and lamination', short: 'Touch',
      blurb: 'On-cell touch sensing, polariser, optical adhesive, and the lamination that bonds the stack.',
      market: { size: 'USD ~5bn', year: 2025, basis: 'smartphone touch, polariser and lamination materials revenue' },
      asOf: '2025', confidence: 'low',
      shares: [
        { c: 'Samsung Display', p: 26 }, { c: 'BOE', p: 15 },
        { c: 'Nitto Denko', p: 13 }, { c: 'Sumitomo Chemical', p: 9 }
      ],
      note: 'Increasingly not a separate business at all: touch has been integrated into the ' +
            'panel process, so the panel maker captures it and the specialist touch vendors that ' +
            'existed a decade ago have been absorbed or squeezed out. The polariser and adhesive ' +
            'underneath remain Japanese and are the part of this layer with real switching costs.',
      sources: ['Omdia', 'DSCC']
    },
    {
      id: 'oled-materials-m', parent: 'oled-panel-m', name: 'OLED emitter materials', short: 'Emitters',
      blurb: 'The organic chemistry that actually emits light, sold by the gram and licensed by the patent.',
      market: { size: 'USD ~2.4bn', year: 2025, basis: 'OLED emitter and host material revenue, all applications' },
      asOf: '2025', confidence: 'medium', chokepoint: true,
      shares: [
        { c: 'Universal Display', p: 34 }, { c: 'Idemitsu Kosan', p: 17 },
        { c: 'Samsung SDI', p: 12 }, { c: 'Duksan Neolux', p: 10 },
        { c: 'Merck', p: 8 }
      ],
      note: 'Universal Display holds the foundational phosphorescent emitter patents and takes a ' +
            'royalty as well as a materials margin, which is why it earns semiconductor-like ' +
            'returns selling grams of powder. The long-promised phosphorescent blue is the one ' +
            'technical event that would move this layer, and it has been imminent for years.',
      sources: ['Company filings', 'DSCC', 'OLED-Info']
    },
    {
      id: 'oled-deposition-m', parent: 'oled-panel-m', name: 'OLED deposition equipment', short: 'Evaporators',
      blurb: 'The vacuum evaporators that deposit the organic stack through a mask, one atomic layer at a time.',
      layout: 'chain',
      market: { size: 'USD ~2bn', year: 2025, basis: 'OLED evaporation equipment orders, smartphone-capable Gen 6 and Gen 8 tools' },
      asOf: '2025', confidence: 'medium', chokepoint: true,
      shares: [ { c: 'Canon Tokki', p: 65 }, { c: 'Sunic System', p: 25 } ],
      others: 10,
      note: 'This is the phone\'s equivalent of the notebook\'s lithography layer, and almost ' +
            'nobody outside the display industry has heard of either supplier. Canon Tokki built ' +
            'its position supplying Samsung Display through the flexible OLED build-out and has ' +
            'since sold to BOE and LG as well; Sunic System is the Korean alternative and the ' +
            'reason this is a duopoly rather than a monopoly. The binding constraint is not share ' +
            'but throughput: at Gen 8 the two of them together are reported to build on the order ' +
            'of two units a year. A panel maker that wants to add leading-edge capacity joins a ' +
            'queue measured in years, which is why OLED capacity expands in announced, dated ' +
            'steps rather than continuously.',
      sources: ['The Elec', 'OLED-Info', 'DSCC'],
      deals: [
        { y: 2025, a: 'Samsung Display', t: 'Gen 8 deposition tool orders', v: 'undisclosed', n: 'Designated Canon Tokki as supplier for its Gen 8 IT OLED line: an order, not an acquisition, but it allocates scarce capacity years ahead and functions like one.' }
      ]
    },
    {
      id: 'fmm-m', parent: 'oled-deposition-m', name: 'Fine metal mask', short: 'FMM',
      blurb: 'A foil tens of microns thick, etched with millions of holes, through which every subpixel is deposited.',
      layout: 'chain',
      market: { size: 'USD ~1.3bn', year: 2025, basis: 'AMOLED fine metal mask revenue' },
      asOf: '2025', confidence: 'medium', chokepoint: true,
      shares: [
        { c: 'Dai Nippon Printing', p: 70 }, { c: 'Toppan', p: 12 },
        { c: 'Poongwon Precision', p: 8 }
      ],
      note: 'DNP etches the masks that pattern the vast majority of the world\'s AMOLED ' +
            'smartphone panels, and for the highest resolutions it has effectively been the only ' +
            'option. Its exclusivity arrangement with Samsung Display has since been relaxed and ' +
            'BOE is now a customer, which broadened the market without meaningfully broadening ' +
            'the supplier base. A consumable, replaced constantly, with one credible supplier and ' +
            'no substitute process at high resolution: on the site\'s own definition that is a ' +
            'harder chokepoint than the panel, the evaporator or the chip.',
      sources: ['OLED-Info', 'The Elec', 'DSCC']
    },
    {
      id: 'invar-m', parent: 'fmm-m', name: 'Invar foil', short: 'Invar',
      blurb: 'The nickel-iron alloy the masks are etched from, rolled to a thickness measured in microns.',
      market: { size: 'USD ~0.3bn', year: 2025, basis: 'precision Invar foil for FMM, estimated revenue' },
      asOf: '2025', confidence: 'low', chokepoint: true,
      shares: [ { c: 'Proterial', p: 70 }, { c: 'Zapp Precision Metals', p: 20 } ],
      others: 10,
      note: 'The bottom of this teardown. Invar barely expands when heated, which is the only ' +
            'reason a mask can hold micron alignment through an evaporation cycle, and rolling it ' +
            'flat and clean enough at this thickness is a metallurgical problem two firms have ' +
            'solved: Proterial, the former Hitachi Metals now controlled by Bain, and Zapp in ' +
            'Germany. Neither publishes a share for it and neither is a pure play, so this table ' +
            'is a reasoned estimate and is graded accordingly: the ranking is far firmer than ' +
            'the numbers. Five layers above it sits a device shipped 1.25 billion times a year.',
      sources: ['OLED-Info', 'Company statements']
    },

    /* ============ BOARD CHILDREN ============ */
    {
      id: 'soc-m', parent: 'board-m', name: 'Application processor', short: 'SoC',
      blurb: 'CPU, GPU, neural engine and image signal processor on one die, usually with the modem alongside.',
      bomPct: 19, layout: 'chain',
      market: { size: 'USD ~45bn', year: 2025, basis: 'smartphone SoC shipments, unit share, FY2025 average of quarterly shares' },
      asOf: '2025', confidence: 'high', chokepoint: true,
      shares: [
        { c: 'MediaTek', p: 35 }, { c: 'Qualcomm', p: 25 }, { c: 'Apple', p: 17.5 },
        { c: 'UNISOC', p: 13 }, { c: 'Samsung LSI', p: 5.5 }, { c: 'HiSilicon', p: 4 }
      ],
      note: 'MediaTek leads on units and Qualcomm on revenue, because Qualcomm owns the premium ' +
            'tier and MediaTek owns the volume. UNISOC has quietly taken thirteen percent of the ' +
            'world\'s phone processors at the bottom of the market, which is the share nobody ' +
            'models. Advanced nodes crossed half of all smartphone SoC shipments in 2025. Apple ' +
            'designs in house and buys manufacturing: the model everyone else wants; Google, ' +
            'Xiaomi and Oppo have all attempted it and only Google has sustained it.',
      sources: ['Counterpoint', 'IDC', 'Canalys']
    },
    {
      id: 'modem-m', parent: 'board-m', name: 'Cellular modem', short: 'Modem',
      blurb: 'The baseband. Separately packaged on iPhone until Apple\'s own C1 shipped in 2025.',
      market: { size: 'USD ~19bn', year: 2025, basis: 'cellular baseband processor revenue' },
      asOf: '2025', confidence: 'medium', chokepoint: true,
      shares: [
        { c: 'Qualcomm', p: 50 }, { c: 'MediaTek', p: 31 },
        { c: 'Apple', p: 10 }, { c: 'UNISOC', p: 8 }
      ],
      note: 'Apple paid USD 1bn for Intel\'s modem unit in 2019 and needed roughly six further ' +
            'years of engineering to ship a modem of its own. That is the true cost of exiting a ' +
            'single Qualcomm socket, and it is the most useful build-versus-buy benchmark in ' +
            'consumer hardware. Qualcomm\'s share declines from here by arithmetic as Apple ' +
            'transitions its own volume across.',
      sources: ['Counterpoint', 'TechInsights'],
      deals: [
        { y: 2019, a: 'Apple', t: 'Intel smartphone modem business', v: 'USD 1bn', n: '2,200 engineers and 17,000 patents. First shipped as the C1 modem in 2025, six years later.' }
      ]
    },
    {
      id: 'mem-m', parent: 'board-m', name: 'Memory and storage', short: 'Memory',
      blurb: 'LPDDR5X stacked in the same package as the processor, plus UFS flash storage.',
      bomPct: 14, layout: 'chain',
      market: { size: 'USD ~62bn', year: 2025, basis: 'mobile DRAM and NAND revenue' },
      asOf: '2025', confidence: 'high', chokepoint: true,
      shares: [
        { c: 'Samsung', p: 33 }, { c: 'SK hynix', p: 28 }, { c: 'Micron', p: 21 },
        { c: 'Kioxia', p: 8 }, { c: 'CXMT', p: 5 }
      ],
      note: 'The defining supply story of this teardown. Contract DRAM prices rose roughly 45 to ' +
            '50 percent in a single quarter at the end of 2025 as the three suppliers reallocated ' +
            'wafer capacity toward AI server memory, and forecasts have the rally running for ' +
            'years rather than quarters. On-device AI pushes the same way from the demand side: ' +
            'running a model locally needs far more memory than a phone used to carry. Memory has ' +
            'gone from a component line to the single largest swing factor in what a phone costs ' +
            'to build.',
      sources: ['TrendForce', 'Counterpoint', 'Omdia']
    },
    {
      id: 'pmic-m', parent: 'board-m', name: 'Power management', short: 'Power',
      blurb: 'The PMIC family feeding a dozen voltage rails, plus charging and USB-C control.',
      market: { size: 'USD ~7.4bn', year: 2025, basis: 'smartphone power management silicon revenue' },
      asOf: '2025', confidence: 'low',
      shares: [
        { c: 'Qualcomm', p: 25 }, { c: 'Renesas', p: 14 }, { c: 'Texas Instruments', p: 12 },
        { c: 'MediaTek', p: 11 }, { c: 'Monolithic Power', p: 8 }
      ],
      note: 'Platform vendors bundle their own PMICs with the processor, which is why Qualcomm ' +
            'and MediaTek lead a category that on its face should belong to analog specialists. ' +
            'It is a good illustration of how platform bundling quietly forecloses an adjacent ' +
            'market without ever showing up as an acquisition.',
      sources: ['Company filings', 'Yole Group']
    },
    {
      id: 'wifi-m', parent: 'board-m', name: 'Wi-Fi, Bluetooth and UWB', short: 'Wi-Fi',
      blurb: 'Short-range connectivity, with ultra-wideband ranging on premium models.',
      market: { size: 'USD ~6.2bn', year: 2025, basis: 'mobile connectivity combo silicon revenue' },
      asOf: '2025', confidence: 'low',
      shares: [
        { c: 'Broadcom', p: 28 }, { c: 'Qualcomm', p: 24 }, { c: 'MediaTek', p: 22 },
        { c: 'Apple', p: 12 }, { c: 'UNISOC', p: 6 }
      ],
      note: 'Apple has been displacing Broadcom here with its own silicon, and unlike the modem ' +
            'it succeeded quickly. Broadcom\'s answer was to move the company\'s centre of ' +
            'gravity to enterprise software and AI networking rather than defend the socket, ' +
            'which has worked spectacularly and is the more instructive half of the story.',
      sources: ['Counterpoint', 'Company filings']
    },
    {
      id: 'sip-m', parent: 'board-m', name: 'Substrate and SiP', short: 'Substrate',
      blurb: 'Any-layer substrate and system-in-package modules that shrink a whole board into a component.',
      market: { size: 'USD ~15bn', year: 2025, basis: 'mobile package substrate and SiP module revenue' },
      asOf: '2025', confidence: 'low',
      shares: [
        { c: 'Zhen Ding', p: 17 }, { c: 'Unimicron', p: 13 }, { c: 'ASE', p: 12 },
        { c: 'Ibiden', p: 9 }, { c: 'AT&S', p: 7 }
      ],
      note: 'Apple pioneered system-in-package at volume for the Watch and pushed it into the ' +
            'phone. It deletes board area, which is how the battery kept growing while the phone ' +
            'did not, and it also deletes several discrete component suppliers per module, which ' +
            'is the part that matters to anyone underwriting one.',
      sources: ['Prismark', 'Company filings']
    },
    {
      id: 'pcb-m', parent: 'board-m', name: 'High-density board', short: 'PCB',
      blurb: 'The main board itself: ten or more laser-drilled layers, plus the flexible circuits off it.',
      market: { size: 'USD ~11bn', year: 2025, basis: 'smartphone HDI and flexible printed circuit revenue' },
      asOf: '2025', confidence: 'low',
      shares: [
        { c: 'Zhen Ding', p: 15 }, { c: 'Nippon Mektron', p: 12 },
        { c: 'Unimicron', p: 9 }, { c: 'Sumitomo Electric', p: 7 }, { c: 'Ibiden', p: 6 }
      ],
      note: 'Board fabrication is capital-heavy, cyclical and structurally low-return, and the ' +
            'Japanese incumbents have been ceding it to Taiwanese and Chinese fabricators for a ' +
            'decade. A fragmented layer with real scale economics and a shrinking incumbent base ' +
            'is a familiar shape, but note the coverage on this table before treating the ' +
            'fragmentation as measured.',
      sources: ['Prismark', 'Digitimes Research']
    },
    {
      id: 'passives-m', parent: 'board-m', name: 'Passive components', short: 'Passives',
      blurb: 'Around a thousand capacitors, inductors and resistors per phone, most of them invisible.',
      market: { size: 'USD ~13bn', year: 2025, basis: 'mobile MLCC and passive component revenue' },
      asOf: '2025', confidence: 'medium',
      shares: [
        { c: 'Murata', p: 32 }, { c: 'Samsung Electro-Mechanics', p: 20 },
        { c: 'Taiyo Yuden', p: 13 }, { c: 'Yageo', p: 10 }, { c: 'TDK', p: 8 }
      ],
      note: 'The most numerous part in a phone and among the most concentrated. Murata has held ' +
            'roughly a third of high-end MLCC for years on materials and process know-how that ' +
            'has resisted copying, and passives shortages have halted phone production more than ' +
            'once. Cheap per unit, thousands per device, two credible suppliers at the top end: ' +
            'a textbook example of why unit cost is a poor guide to supply risk.',
      sources: ['TrendForce', 'Company filings']
    },

    /* ============ SoC UPSTREAM ============ */
    {
      id: 'soc-ip-m', parent: 'soc-m', name: 'CPU and GPU IP', short: 'Core IP',
      blurb: 'Almost every phone processor on earth runs the same instruction set, licensed from one company.',
      market: { size: 'USD ~4bn', year: 2025, basis: 'mobile processor IP licensing and royalty revenue' },
      asOf: '2025', confidence: 'medium', chokepoint: true,
      shares: [ { c: 'Arm', p: 92 }, { c: 'Imagination', p: 4 }, { c: 'SiFive', p: 2 } ],
      note: 'Arm is in essentially one hundred percent of smartphone application processors. It ' +
            'collects a royalty on tens of billions of chips a year and has spent the last few ' +
            'years steadily raising the rate and pushing toward selling complete subsystems ' +
            'rather than instruction sets, which is what put it into litigation with its own ' +
            'largest customer. RISC-V is the only structural alternative and is nowhere near ' +
            'competitive at the application processor level.',
      sources: ['Arm disclosures', 'IPnest'],
      deals: [
        { y: 2024, a: 'Arm', t: 'Qualcomm licence litigation', v: 'litigation', n: 'A fight over whether an architecture licence survives an acquisition. Qualcomm largely prevailed at trial in late 2024: the first real test of Arm\'s leverage over its own licensees.' }
      ]
    },
    {
      id: 'eda-m', parent: 'soc-m', name: 'Design software', short: 'EDA',
      blurb: 'The tools the chip is drawn and verified in. Three vendors, and no fourth.',
      market: { size: 'USD ~17bn', year: 2025, basis: 'electronic design automation software revenue, all applications' },
      asOf: '2025', confidence: 'high', chokepoint: true,
      shares: [
        { c: 'Synopsys', p: 33 }, { c: 'Cadence', p: 30 }, { c: 'Siemens EDA', p: 14 }
      ],
      others: 23,
      note: 'A three-firm oligopoly with no credible fourth entrant and switching costs measured ' +
            'in engineering years. It is also the layer export controls reach first, because ' +
            'software licences can be revoked centrally in a way that shipped machines cannot, ' +
            'which briefly made this the most geopolitically active market on the site.',
      sources: ['ESD Alliance', 'Company filings']
    },
    {
      id: 'foundry-m', parent: 'soc-m', name: 'Leading-edge foundry', short: 'Foundry',
      blurb: 'Three and two nanometre production. In practice, one supplier.',
      layout: 'chain',
      market: { size: 'USD ~175bn', year: 2025, basis: 'pure-play foundry revenue, all nodes' },
      asOf: '2025', confidence: 'high', chokepoint: true,
      shares: [
        { c: 'TSMC', p: 70 }, { c: 'Samsung Foundry', p: 7 }, { c: 'SMIC', p: 5 },
        { c: 'UMC', p: 4 }, { c: 'GlobalFoundries', p: 4 }
      ],
      note: 'TSMC held just over seventy percent of all pure-play foundry revenue through 2025. ' +
            'At three nanometre and below its share is close to ninety percent, and flagship ' +
            'phone processors are the volume that fills those lines first. Samsung has fought ' +
            'yield problems across three consecutive nodes, which is the entire reason this is a ' +
            'near-monopoly rather than a duopoly: the difference between the two is a ' +
            'manufacturing execution problem, not a market structure one.',
      sources: ['TrendForce', 'Counterpoint']
    },
    {
      id: 'advpack-m', parent: 'soc-m', name: 'Advanced packaging', short: 'Packaging',
      blurb: 'Fan-out wafer-level packaging that puts processor and memory into a single module.',
      market: { size: 'USD ~52bn', year: 2025, basis: 'outsourced semiconductor assembly and test revenue' },
      asOf: '2025', confidence: 'medium',
      shares: [
        { c: 'ASE', p: 29 }, { c: 'Amkor', p: 14 }, { c: 'JCET', p: 11 },
        { c: 'Powertech', p: 6 }
      ],
      note: 'TSMC does its own advanced packaging and does not appear in this table, which ' +
            'flatters the merchant players considerably. Packaging stopped being a back-end ' +
            'afterthought when performance gains started coming from integration rather than ' +
            'lithography, and it is now the step that decides whether a phone processor and its ' +
            'memory can sit in one package at all.',
      sources: ['TrendForce', 'Yole Group']
    },

    /* ============ FOUNDRY UPSTREAM ============ */
    {
      id: 'litho-m', parent: 'foundry-m', name: 'Lithography systems', short: 'Lithography',
      blurb: 'The machines that print the circuit. One company makes the only tool capable of the leading edge.',
      upstream: ['soc-m'],
      market: { size: 'USD ~36bn', year: 2025, basis: 'lithography equipment revenue' },
      asOf: '2025', confidence: 'high', chokepoint: true,
      shares: [ { c: 'ASML', p: 91 }, { c: 'Canon', p: 5 }, { c: 'Nikon', p: 4 } ],
      note: 'In extreme ultraviolet the share is one hundred percent, and every 3nm and 2nm phone ' +
            'processor in the world was printed by a machine from Veldhoven. This layer is shared ' +
            'with the notebook teardown and is explored in far more depth there: it is included ' +
            'here because a smartphone processor is now the highest-volume leading-edge product ' +
            'on earth, and the first to move to each new node.',
      sources: ['ASML disclosures', 'SEMI']
    },
    {
      id: 'wafer-m', parent: 'foundry-m', name: 'Silicon wafers', short: 'Wafers',
      blurb: 'The polished 300mm substrate every chip in the phone starts life on.',
      market: { size: 'USD ~13bn', year: 2025, basis: 'silicon wafer revenue, all applications' },
      asOf: '2025', confidence: 'high', chokepoint: true,
      shares: [
        { c: 'Shin-Etsu', p: 30 }, { c: 'SUMCO', p: 22 }, { c: 'GlobalWafers', p: 15 },
        { c: 'Siltronic', p: 12 }, { c: 'SK Siltron', p: 10 }
      ],
      note: 'Five firms, roughly ninety percent, two of them Japanese and neither remotely ' +
            'replaceable at leading-edge specification. Wafer supply is the quietest hard ' +
            'constraint in semiconductors: capacity takes years to add, nobody adds it ' +
            'speculatively, and the entire industry has been caught short by it twice.',
      sources: ['SEMI', 'Company filings']
    },
    {
      id: 'resist-m', parent: 'foundry-m', name: 'Photoresist', short: 'Resist',
      blurb: 'The light-sensitive chemistry the circuit pattern is actually developed in.',
      market: { size: 'USD ~2.6bn', year: 2025, basis: 'semiconductor photoresist revenue, all nodes' },
      asOf: '2025', confidence: 'medium', chokepoint: true,
      shares: [
        { c: 'JSR', p: 24 }, { c: 'Tokyo Ohka', p: 22 }, { c: 'Shin-Etsu', p: 17 },
        { c: 'Sumitomo Chemical', p: 12 }, { c: 'Fujifilm', p: 10 }
      ],
      note: 'Overwhelmingly Japanese, and for EUV resist specifically the supplier list is shorter ' +
            'still. Japan restricted exports of exactly this class of material to South Korea in ' +
            '2019 and demonstrated, in about a week, how much leverage sits in a consumable ' +
            'nobody had been tracking. JSR was taken private by a Japanese state-backed fund in ' +
            '2024, which is itself a statement about how this layer is now viewed.',
      sources: ['SEMI', 'METI disclosures'],
      deals: [
        { y: 2024, a: 'Japan Investment Corporation', t: 'JSR', v: 'USD ~6.3bn', n: 'State-backed take-private of a leading resist supplier, industrial policy executed as an LBO.' }
      ]
    },

    /* ============ MEMORY CHILDREN ============ */
    {
      id: 'dram-m', parent: 'mem-m', name: 'Mobile DRAM', short: 'DRAM',
      blurb: 'LPDDR5X, stacked directly on top of the application processor package.',
      market: { size: 'USD ~38bn', year: 2025, basis: 'DRAM revenue share, all applications' },
      asOf: '2025', confidence: 'high', chokepoint: true,
      shares: [
        { c: 'Samsung', p: 38 }, { c: 'SK hynix', p: 28 }, { c: 'Micron', p: 21 },
        { c: 'CXMT', p: 7 }
      ],
      note: 'Three firms hold roughly ninety percent of the world\'s DRAM and have spent two ' +
            'decades learning not to add capacity into a downturn. The basis matters here: this ' +
            'is all-application DRAM revenue, not mobile-only, and the mobile share of it is ' +
            'being actively squeezed as wafers move to AI server memory. CXMT is the first ' +
            'credible new entrant in fifteen years and is growing from a small base with state ' +
            'support.',
      sources: ['TrendForce', 'Counterpoint']
    },
    {
      id: 'nand-m', parent: 'mem-m', name: 'NAND and UFS storage', short: 'NAND',
      blurb: 'The flash the phone stores everything on, and the controller that manages its wear.',
      market: { size: 'USD ~24bn', year: 2025, basis: 'NAND flash revenue share, all applications' },
      asOf: '2025', confidence: 'high',
      shares: [
        { c: 'Samsung', p: 31 }, { c: 'SK hynix', p: 20 }, { c: 'Kioxia', p: 17 },
        { c: 'Micron', p: 13 }, { c: 'YMTC', p: 8 }
      ],
      note: 'Structurally less concentrated than DRAM and considerably less profitable for it, ' +
            'the same five-firm shape has produced far worse returns because NAND capacity is ' +
            'easier to add and harder to differentiate. Kioxia, the former Toshiba memory ' +
            'business, has been through a decade of ownership changes that are a case study in ' +
            'how hard this asset class is to underwrite.',
      sources: ['TrendForce', 'Forward Insights']
    },

    /* ============ CAMERA CHILDREN ============ */
    {
      id: 'sensor-m', parent: 'camera-m', name: 'Image sensor', short: 'Sensor',
      blurb: 'Stacked backside-illuminated CMOS, up to 200 megapixels, with pixel binning to make that useful.',
      layout: 'chain',
      market: { size: 'USD ~17bn', year: 2025, basis: 'smartphone CMOS image sensor revenue' },
      asOf: '2025', confidence: 'medium', chokepoint: true,
      shares: [
        { c: 'Sony', p: 60 }, { c: 'Samsung LSI', p: 15 }, { c: 'OmniVision', p: 10 },
        { c: 'GalaxyCore', p: 5 }, { c: 'SK hynix', p: 3 }
      ],
      note: 'Sony passed sixty percent of smartphone image sensor revenue during 2025. Read the ' +
            'basis carefully: this is revenue, and on units the picture is completely different, ' +
            'because GalaxyCore and OmniVision ship enormous volumes of small, cheap sensors for ' +
            'the secondary cameras nobody uses. Sony supplies the main sensor in nearly every ' +
            'flagship on earth, including phones made by companies that compete with Sony in ' +
            'handsets: a supplier relationship that survives that tension is a strong one.',
      sources: ['TechInsights', 'Yole Group', 'Sony disclosures']
    },
    {
      id: 'lens-m', parent: 'camera-m', name: 'Lens set', short: 'Lens',
      blurb: 'Six to eight plastic aspheric elements, with glass on periscope telephoto modules.',
      market: { size: 'USD ~5.6bn', year: 2025, basis: 'smartphone lens set revenue' },
      asOf: '2025', confidence: 'medium',
      shares: [
        { c: 'Largan', p: 28 }, { c: 'Sunny Optical', p: 25 },
        { c: 'Genius Electronic', p: 13 }, { c: 'Kantatsu', p: 6 }
      ],
      note: 'Largan is the highest-margin business in the entire phone supply chain outside of ' +
            'silicon, built on injection tooling and yield know-how that has resisted copying for ' +
            'fifteen years despite enormous, well-capitalised effort. Sunny Optical has closed ' +
            'much of the gap on volume without closing it on margin, which tells you exactly ' +
            'where the moat is.',
      sources: ['Company filings', 'TrendForce']
    },
    {
      id: 'vcm-m', parent: 'camera-m', name: 'Actuator and stabilisation', short: 'OIS and VCM',
      blurb: 'Voice coil motors for focus, and stabilisation that moves the lens or the whole sensor.',
      market: { size: 'USD ~4.5bn', year: 2025, basis: 'smartphone VCM and OIS actuator revenue' },
      asOf: '2025', confidence: 'low',
      shares: [
        { c: 'Alps Alpine', p: 19 }, { c: 'TDK', p: 17 }, { c: 'Jahwa', p: 14 },
        { c: 'Mitsumi', p: 11 }, { c: 'Hozel', p: 7 }
      ],
      note: 'A quiet Japanese and Korean precision-mechanics category, invisible in most bills of ' +
            'materials and hard to substitute because qualifying a new actuator takes a full ' +
            'product cycle. Exactly the profile that makes a layer look fragmented on paper and ' +
            'behave like an oligopoly in a supply crisis.',
      sources: ['Company filings', 'TrendForce']
    },

    /* ============ RF CHILDREN ============ */
    {
      id: 'filter-m', parent: 'rf-m', name: 'RF filters', short: 'Filters',
      blurb: 'Acoustic wave filters that keep dozens of overlapping bands from destroying each other.',
      market: { size: 'USD ~7.5bn', year: 2025, basis: 'mobile SAW and BAW filter revenue' },
      asOf: '2025', confidence: 'medium', chokepoint: true,
      shares: [
        { c: 'Murata', p: 28 }, { c: 'Broadcom', p: 24 }, { c: 'Qorvo', p: 14 },
        { c: 'Skyworks', p: 11 }, { c: 'Maxscend', p: 8 }
      ],
      note: 'The filter is the moat in the radio, not the amplifier. Bulk acoustic wave filters ' +
            'for high-band 5G are effectively Broadcom and Qorvo, Murata dominates surface ' +
            'acoustic wave, and Chinese entrants have taken the low bands and stalled at the high ' +
            'end for close to a decade. If the Skyworks and Qorvo combination clears, two of the ' +
            'five names here become one.',
      sources: ['Yole Group', 'TechInsights']
    },
    {
      id: 'pa-m', parent: 'rf-m', name: 'Power amplifiers', short: 'PAs',
      blurb: 'Gallium arsenide amplifiers that drive the antenna, one per band group.',
      market: { size: 'USD ~4.4bn', year: 2025, basis: 'mobile power amplifier revenue' },
      asOf: '2025', confidence: 'low',
      shares: [
        { c: 'Skyworks', p: 24 }, { c: 'Qorvo', p: 20 }, { c: 'Broadcom', p: 15 },
        { c: 'Vanchip', p: 10 }, { c: 'Maxscend', p: 9 }
      ],
      note: 'The part of the radio Chinese suppliers have genuinely broken into, because the ' +
            'process is mature and the design is less defensible than a filter. Amplifier share ' +
            'has moved steadily toward Vanchip and Maxscend in the mid-range while the filter ' +
            'layer above has barely moved at all: a clean demonstration that within one ' +
            'subsystem, the defensibility can differ completely by component.',
      sources: ['Yole Group', 'Company filings']
    },

    /* ============ SENSOR CHILD ============ */
    {
      id: 'fingerprint-m', parent: 'sensors-m', name: 'Under-display fingerprint', short: 'Fingerprint',
      blurb: 'Optical or ultrasonic sensing through the panel, which only works because OLED is transparent between subpixels.',
      market: { size: 'USD ~2.2bn', year: 2025, basis: 'under-display fingerprint sensor revenue' },
      asOf: '2025', confidence: 'low',
      shares: [
        { c: 'Goodix', p: 38 }, { c: 'Qualcomm', p: 21 },
        { c: 'Egis', p: 12 }, { c: 'Silead', p: 8 }
      ],
      note: 'A layer created outright by a design decision one layer up: under-display sensing is ' +
            'only possible because OLED panels pass light between subpixels, so the whole category ' +
            'exists downstream of the display transition. Goodix took the optical volume and ' +
            'Qualcomm holds the ultrasonic premium tier that Samsung uses.',
      sources: ['Counterpoint', 'Yole Group']
    },

    /* ============ BATTERY CHILD ============ */
    {
      id: 'cell-mats-m', parent: 'battery-m', name: 'Cell materials', short: 'Cell materials',
      blurb: 'Cathode, anode, separator and electrolyte: where a battery\'s cost and its chemistry both live.',
      market: { size: 'USD ~4.8bn', year: 2025, basis: 'consumer lithium cell active material revenue' },
      asOf: '2025', confidence: 'low',
      shares: [
        { c: 'Umicore', p: 14 }, { c: 'Ningbo Shanshan', p: 13 },
        { c: 'Easpring', p: 11 }, { c: 'Nichia', p: 9 }, { c: 'BTR', p: 9 }
      ],
      note: 'Consumer cells use high-nickel and high-voltage cobalt chemistries that the vehicle ' +
            'industry has largely moved away from, so this is a genuinely separate market from ' +
            'the EV materials chain covered elsewhere on the site: smaller, less tracked and ' +
            'more Chinese. Silicon-carbon anodes are the current change: they are what allowed ' +
            'battery capacity to jump without the phone getting thicker, and they have reshuffled ' +
            'the anode supplier list.',
      sources: ['Benchmark Mineral Intelligence', 'Company filings']
    }
  ]
});
