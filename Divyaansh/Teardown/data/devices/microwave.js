/* Teardown :: Microwave oven
 *
 * Sixth flagship, and the cheapest device on the site by a wide margin, a
 * complete machine for less than the price of one repeater bolt on the subsea
 * cable teardown.
 *
 * It earns flagship treatment because it makes an argument none of the others
 * do. Every previous teardown shows a chain of specialists getting narrower as
 * you descend. This one shows a chain that *collapsed*: commoditisation drove
 * the price down by an order of magnitude, and the firms that survived did so
 * by absorbing every tier of their own supply chain, so the same two
 * companies appear at the brand layer, the assembly layer and the component
 * layer, and then sell the component to the competitors whose badges are on
 * the front.
 *
 * The house rules matter more here than usual. Appliance market data is the
 * weakest source class on this site: published market sizes for microwave
 * ovens differ by about a quarter between publishers for the same year, and
 * almost nobody separates *brand* share from *manufacturing* share, which is
 * the single most important distinction in this device. Most layers are
 * graded low deliberately, and the two share tables that matter are stated as
 * a pair for exactly the reason the tractor states units beside revenue.
 */
TD.device({
  id: 'microwave',
  name: 'Microwave oven',
  icon: 'microwave',
  category: 'Home and appliances',
  tagline: 'A dozen brands, two factories, and a vacuum tube from 1940.',
  unit: { volume: '~70m units sold globally (2025, indicative)', price: 'USD ~95 average retail, ~USD 45 to build' },
  intro: 'Almost every microwave sold anywhere is built by one of two companies in one Chinese city, ' +
         'and a great many of them are the same machine with different badges. The part that does the ' +
         'actual cooking is a cavity magnetron: a vacuum tube invented for wartime radar, still the ' +
         'last one in mass consumer production. Follow it down and every tier, without exception, ' +
         'ends in China.',
  view: { w: 1000, h: 640 },
  frames: [{ label: 'Microwave generation', x: 130, y: 62, w: 740, h: 176 },
           { label: 'Cavity and door', x: 130, y: 250, w: 740, h: 176 },
           { label: 'Control, motion and shell', x: 130, y: 438, w: 740, h: 188 }],

  /* ============================ STORY ============================
   * `stages` must account for all 41 nodes exactly once.
   */
  story: {
    kicker: 'Flagship teardown',
    headline: 'The cheapest device on this site is also the most concentrated.',
    lede: 'Forty-one mapped layers, five tiers deep, and a bill of materials of about forty-five ' +
          'dollars. Every other teardown here says power increases with depth. This one says ' +
          'something worse: the market was commoditised almost to zero margin, and that made it ' +
          'more concentrated rather than less, because at that price only total scale survives.',

    tierNote: 'There is no tier of this machine where the answer is not China.',
    geoLede: 'There is only one reading, which is what makes it remarkable. The brands are ' +
             'American, Japanese, Korean and European. The manufacture, the magnetron, the steel, ' +
             'the magnets and the tungsten are all Chinese, and at the bottom of the chain the ' +
             'concentration is higher than at the top.',

    findings: [
      { title: 'A dozen brands, two factories',
        body: 'Microwaves are sold under GE, Whirlpool, Toshiba, Sharp, Breville, RCA, Insignia and ' +
              'a long tail of retailer labels. A great many of them come off lines belonging to ' +
              'Midea or Galanz, both headquartered in Shunde in Guangdong. Internal layouts, ' +
              'magnetrons and even back panels frequently match across supposedly competing ' +
              'products. Galanz\'s own brand holds around a fifth of the market; its share of world ' +
              'manufacturing has been reported at roughly half. Those are different numbers ' +
              'measuring different things, and conflating them is how this industry is ' +
              'misunderstood.',
        nodes: ['brand-mw', 'builder-mw'] },
      { title: 'The last vacuum tube in the house',
        body: 'The magnetron is a 1940 invention: a resonant cavity oscillator developed for ' +
              'airborne radar, and the reason microwave radar and then microwave cooking exist at ' +
              'all. It is a genuine thermionic vacuum tube, with a heated cathode boiling electrons ' +
              'into a vacuum, mass produced at a few dollars a unit. Every other vacuum tube in ' +
              'consumer life was replaced by semiconductors decades ago. This one survived because ' +
              'nothing solid-state generates a kilowatt of 2.45 GHz anywhere near as cheaply.',
        nodes: ['magnetron', 'cathode-mw'] },
      { title: 'Commoditisation concentrated it',
        body: 'A microwave oven cost the equivalent of several thousand dollars when it launched and ' +
              'costs under a hundred now. The conventional expectation is that a commoditised market ' +
              'fragments as the technology becomes trivial. The opposite happened: margins fell to ' +
              'the point where only firms with total vertical integration and enormous volume could ' +
              'survive, so the survivors absorbed the magnetron, the transformer and the board, and ' +
              'then sold those parts to everyone else. Cheapness was the consolidating force.',
        nodes: ['builder-mw', 'magnetron', 'tungsten-mining'] }
    ],

    /* upstream -> downstream. Node counts here must sum to 41. */
    stages: [
      { id: 'materials', name: 'Mined and milled inputs',
        note: 'Steel, magnets and one genuinely critical mineral, all of them concentrated further ' +
              'than the appliance market that consumes them.',
        nodes: ['tungsten-mining', 'tungsten-apt', 'tungsten-mw', 'transformer-steel',
                'cavity-steel', 'case-steel'] },
      { id: 'magnetron', name: 'The magnetron',
        note: 'A copper anode block, a ring of ferrite magnets, a ceramic seal and a heated ' +
              'filament in a vacuum. Read bottom up, this is the whole device.',
        nodes: ['cathode-mw', 'anode-mw', 'mag-magnets', 'mag-ceramic', 'magnetron'] },
      { id: 'power', name: 'High voltage supply',
        note: 'Four kilovolts from a transformer, capacitor and diode arranged as a voltage doubler. ' +
              'The most dangerous thing in the kitchen, for about eight dollars.',
        nodes: ['hv-transformer', 'hv-capacitor', 'hv-diode', 'hv-supply'] },
      { id: 'cavity', name: 'Cavity and waveguide',
        note: 'A painted steel box sized so that 2.45 GHz resonates inside it, and the duct that ' +
              'gets the energy there.',
        nodes: ['waveguide', 'cavity-paint', 'cavity'] },
      { id: 'door', name: 'The door',
        note: 'The only part of the machine designed primarily so that it cannot hurt you, and the ' +
              'reason microwave ovens are regulated at all.',
        nodes: ['door-choke', 'door-screen', 'door-c'] },
      { id: 'control', name: 'Control electronics',
        note: 'A microcontroller two decades behind the leading edge, a display and a membrane ' +
              'keypad. Total silicon content: about a dollar.',
        nodes: ['mcu-fab', 'control-mcu', 'control-display', 'control-keypad', 'control'] },
      { id: 'motion', name: 'Turntable and cooling',
        note: 'Two small motors and a glass plate, which between them solve the fact that a ' +
              'resonant cavity heats unevenly.',
        nodes: ['turntable-motor', 'turntable-glass', 'turntable', 'fan-motor', 'fan-cool'] },
      { id: 'shell', name: 'Case and wiring',
        note: 'Painted steel, a harness, and three interlock switches that must fail safe.',
        nodes: ['case-finish', 'enclosure-mw', 'wiring-harness-mw', 'interlock-mw', 'wiring-mw'] },
      { id: 'channel', name: 'Brand, builder and channel',
        note: 'The badge, the factory behind it, the retailer in front of it, and the regulator ' +
              'that decides what may be sold at all.',
        nodes: ['unpriced-mw', 'brand-mw', 'builder-mw', 'retail-mw', 'standards-mw'] }
    ],

    flow: {
      lanes: [
        { label: 'Magnetron', steps: ['tungsten-mining', 'tungsten-apt', 'tungsten-mw',
                                      'cathode-mw', 'magnetron'] },
        { label: 'High voltage', steps: ['transformer-steel', 'hv-transformer', 'hv-supply'] },
        { label: 'Cavity', steps: ['cavity-steel', 'waveguide', 'cavity'] },
        { label: 'Control', steps: ['mcu-fab', 'control-mcu', 'control'] }
      ],
      converge: ['builder-mw', 'brand-mw']
    }
  },

  nodes: [

    /* ================ ROW 1 :: MICROWAVE GENERATION ================ */
    {
      id: 'magnetron', name: 'Magnetron', short: 'Magnetron',
      shape: { x: 150, y: 82, w: 220, h: 146 },
      blurb: 'A cavity magnetron: heated cathode, copper anode, two ring magnets, and a vacuum. Invented in 1940.',
      bomPct: 18, layout: 'chain',
      market: { size: 'USD ~1.1bn', year: 2025, basis: 'consumer microwave magnetron supply, estimated' },
      asOf: '2025', confidence: 'low', chokepoint: true,
      shares: [
        { c: 'Witol', p: 27 }, { c: 'Galanz', p: 22 }, { c: 'Midea', p: 16 },
        { c: 'LG Electronics', p: 11 }, { c: 'Panasonic', p: 8 }
      ],
      note: 'The only component in the machine that is genuinely difficult, and the one nobody ' +
            'outside China builds at consumer volume any more. It is also a real vacuum tube, ' +
            'thermionic cathode and all, produced by the tens of millions at a few dollars each, ' +
            'the last such device in mass consumer production anywhere. Solid-state RF sources at ' +
            'this power exist and cost twenty times as much, which is the entire reason a 1940 ' +
            'valve is still in your kitchen.',
      sources: ['Appliance trade press', 'Company statements']
    },
    {
      id: 'hv-supply', name: 'High voltage supply', short: 'HV supply',
      shape: { x: 390, y: 82, w: 220, h: 146 },
      blurb: 'Transformer, capacitor and diode forming a voltage doubler that feeds the magnetron about 4,000 volts.',
      bomPct: 12, layout: 'board',
      market: { size: 'USD ~0.6bn', year: 2025, basis: 'microwave high voltage component supply, estimated' },
      asOf: '2025', confidence: 'low',
      shares: [
        { c: 'Galanz', p: 24 }, { c: 'Midea', p: 18 }, { c: 'Witol', p: 9 }
      ],
      note: 'Comfortably the most dangerous object most people keep in a kitchen: the capacitor ' +
            'holds a lethal charge after the machine is unplugged, which is why every repair guide ' +
            'opens with an instruction to short it out. It is also about eight dollars of parts, ' +
            'and the same two firms that assemble the oven wind the transformer.',
      sources: ['Appliance trade press', 'Company statements']
    },
    {
      id: 'control', name: 'Control electronics', short: 'Control',
      shape: { x: 630, y: 82, w: 220, h: 146 },
      blurb: 'A microcontroller, a display, a membrane keypad and a relay. Roughly a dollar of silicon.',
      bomPct: 10, layout: 'board',
      market: { size: 'USD ~0.5bn', year: 2025, basis: 'appliance control board supply for microwave ovens, estimated' },
      asOf: '2025', confidence: 'low',
      shares: [
        { c: 'Galanz', p: 21 }, { c: 'Midea', p: 17 }, { c: 'Highly', p: 6 }
      ],
      note: 'The contrast with the laptop and phone teardowns is the point of this node. A ' +
            'microwave needs a timer, a keypad and a relay, so it uses an eight-bit or small ' +
            'thirty-two-bit microcontroller on a process two decades old costing well under a ' +
            'dollar. There is no advanced silicon anywhere in this machine, and there is no reason ' +
            'for there to be.',
      sources: ['Appliance trade press', 'Company filings']
    },

    /* ================== ROW 2 :: CAVITY AND DOOR ================== */
    {
      id: 'cavity', name: 'Cavity and waveguide', short: 'Cavity',
      shape: { x: 150, y: 270, w: 220, h: 146 },
      blurb: 'A painted steel box dimensioned so 2.45 GHz resonates in it, and the duct that carries energy from the magnetron.',
      bomPct: 14, layout: 'board',
      market: { size: 'USD ~0.7bn', year: 2025, basis: 'microwave cavity fabrication and coating, estimated' },
      asOf: '2025', confidence: 'low',
      shares: [
        { c: 'Galanz', p: 26 }, { c: 'Midea', p: 20 }, { c: 'Haier', p: 6 }
      ],
      note: 'A resonant cavity is why food heats unevenly: standing waves put the energy in fixed ' +
            'places, which is what the turntable and the stirrer fan exist to defeat. The cavity is ' +
            'also why the machine is the size it is: the dimensions are set by the wavelength, ' +
            'not by how much food you wanted to fit.',
      sources: ['Appliance trade press', 'Company statements']
    },
    {
      id: 'door-c', name: 'Door and seal', short: 'Door',
      shape: { x: 390, y: 270, w: 220, h: 146 },
      blurb: 'Perforated screen, choke seal and interlocks: the part designed so the machine cannot hurt you.',
      bomPct: 8, layout: 'board',
      market: { size: 'USD ~0.4bn', year: 2025, basis: 'microwave door assembly supply, estimated' },
      asOf: '2025', confidence: 'low', chokepoint: true,
      shares: [],
      note: 'Named but not measured, doors are made in-house by the assemblers and no source ' +
            'tracks them. Worth naming anyway, because this is the safety-critical component and ' +
            'the reason the category is regulated at all. The holes in the screen are much smaller ' +
            'than the 122 mm wavelength, so microwaves cannot pass while light can; the choke ' +
            'around the perimeter is a quarter-wave trap that stops leakage at the gap. Two ' +
            'ordinary pieces of physics, and the whole reason the appliance is legal.',
      sources: ['Company statements', 'Appliance trade press']
    },
    {
      id: 'enclosure-mw', name: 'Case and chassis', short: 'Case',
      shape: { x: 630, y: 270, w: 220, h: 146 },
      blurb: 'Folded and painted steel wrapper, plus the base the whole machine is screwed to.',
      bomPct: 12, layout: 'board',
      market: { size: 'USD ~0.5bn', year: 2025, basis: 'microwave enclosure fabrication, estimated' },
      asOf: '2025', confidence: 'low',
      shares: [
        { c: 'Galanz', p: 27 }, { c: 'Midea', p: 21 }
      ],
      note: 'Cheap coated steel, folded and spot welded, and one of the reasons the machine is so ' +
            'heavy for its price. It is also the single clearest illustration of why microwave ' +
            'manufacture concentrated: a steel pressing this cheap only works at enormous volume ' +
            'on tooling that is already paid for.',
      sources: ['Appliance trade press', 'Company statements']
    },

    /* ============ ROW 3 :: CONTROL, MOTION AND SHELL ============ */
    {
      id: 'turntable', name: 'Turntable', short: 'Turntable',
      shape: { x: 150, y: 458, w: 220, h: 152 },
      blurb: 'A synchronous motor, a coupler and a tempered glass plate, rotating food through the standing wave pattern.',
      bomPct: 4, layout: 'board',
      market: { size: 'USD ~0.2bn', year: 2025, basis: 'microwave turntable motor and tray supply, estimated' },
      asOf: '2025', confidence: 'low',
      shares: [
        { c: 'Johnson Electric', p: 14 }, { c: 'Galanz', p: 12 }, { c: 'Midea', p: 10 }
      ],
      note: 'An elegant fix for a physics problem: rather than making the field uniform, which is ' +
            'hard, rotate the food through the field, which is trivial. The motor turns at around ' +
            'five or six revolutions a minute and costs under a dollar.',
      sources: ['Appliance trade press', 'Company filings']
    },
    {
      id: 'fan-cool', name: 'Cooling and stirrer', short: 'Cooling',
      shape: { x: 390, y: 458, w: 220, h: 152 },
      blurb: 'A fan cooling the magnetron, ducted onward through the cavity to carry away steam.',
      bomPct: 5, layout: 'board',
      market: { size: 'USD ~0.2bn', year: 2025, basis: 'microwave fan and stirrer motor supply, estimated' },
      asOf: '2025', confidence: 'low',
      shares: [
        { c: 'Johnson Electric', p: 16 }, { c: 'Nidec', p: 9 }, { c: 'Galanz', p: 9 }
      ],
      note: 'The magnetron is roughly sixty percent efficient, so several hundred watts have to be ' +
            'thrown away as heat while it runs. The same airflow is then routed through the cavity ' +
            'to carry off steam, which is a neat piece of cost engineering: one fan, two jobs, and ' +
            'the reason a microwave sounds like it is working much harder than it is.',
      sources: ['Appliance trade press', 'Company filings']
    },
    {
      id: 'wiring-mw', name: 'Wiring and interlocks', short: 'Wiring',
      shape: { x: 630, y: 458, w: 220, h: 152 },
      blurb: 'A short harness, a thermal cut-out, and three interlock switches wired so the door cannot lie.',
      bomPct: 6, layout: 'board',
      market: { size: 'USD ~0.2bn', year: 2025, basis: 'microwave harness and switch supply, estimated' },
      asOf: '2025', confidence: 'low', chokepoint: true,
      shares: [],
      note: 'Named but not measured. The interlock arrangement is the interesting part: three ' +
            'switches, one of which is deliberately wired to short the supply and blow the fuse if ' +
            'the others fail to open. The machine is designed to destroy itself rather than run ' +
            'with the door ajar, which is an unusually blunt piece of safety engineering for a ' +
            'consumer product.',
      sources: ['Company statements', 'Appliance trade press']
    },
    {
      id: 'unpriced-mw', name: 'Not separately priced', short: 'Unpriced',
      blurb: 'Fasteners, insulation, mica sheet, packaging, assembly labour and freight.',
      bomPct: 11,
      market: { size: null, year: 2025, basis: 'residual share of build cost, not a market' },
      asOf: '2025', confidence: 'low',
      shares: [],
      note: 'Larger as a proportion than on any other teardown here, and that is a finding rather ' +
            'than a gap. On a forty-five dollar bill of materials, packaging and ocean freight are ' +
            'a material fraction of the cost: a microwave is mostly air in a box, and shipping air ' +
            'across the Pacific is not free. The cheaper the device, the more of its cost is ' +
            'logistics rather than parts.',
      sources: ['Appliance trade press', 'Company statements']
    },

    /* ============================ META ============================ */
    {
      id: 'brand-mw', name: 'Brands, by badge', short: 'By badge', kind: 'meta',
      blurb: 'Whose name is on the front.',
      market: { size: 'USD ~15bn', year: 2025, basis: 'microwave oven retail sales value, by brand; see note on source spread' },
      asOf: '2025', confidence: 'low',
      shares: [
        { c: 'Galanz', p: 20 }, { c: 'Midea', p: 15 }, { c: 'Samsung', p: 8 },
        { c: 'LG Electronics', p: 7 }, { c: 'Panasonic', p: 6 }, { c: 'Whirlpool', p: 5 },
        { c: 'Sharp', p: 4 }
      ],
      note: 'Read this table strictly as badges. Published estimates of the market it divides range ' +
            'from about thirteen to about seventeen billion dollars for the same year depending on ' +
            'the publisher, which is a spread of roughly a quarter and the reason this layer is ' +
            'graded low. Compare it with the builder table beside it: several of the names here do ' +
            'not manufacture the product they are selling, and at least two of them buy it from a ' +
            'company that also appears above them in this list.',
      sources: ['Appliance trade press', 'Company filings']
    },
    {
      id: 'builder-mw', name: 'Builders, by factory', short: 'By factory', kind: 'meta',
      blurb: 'Whose line it actually came off. Not the same question, and not the same answer.',
      market: { size: '~70m units', year: 2025, basis: 'microwave oven manufacturing, unit share by producer including own-brand and contract output' },
      asOf: '2025', confidence: 'low', chokepoint: true,
      shares: [
        { c: 'Galanz', p: 42 }, { c: 'Midea', p: 24 }, { c: 'LG Electronics', p: 6 },
        { c: 'Samsung', p: 5 }, { c: 'Panasonic', p: 4 }
      ],
      note: 'The single most important table on this teardown, and the one nobody publishes ' +
            'properly. Galanz has been reported as manufacturing on the order of half the world\'s ' +
            'microwave ovens, against a badge share of about a fifth; Midea builds for GE, ' +
            'Whirlpool, Toshiba, Sharp and Insignia among others, and owns Toshiba\'s appliance ' +
            'business outright. Both are headquartered in Shunde, in Guangdong: the same city. ' +
            'The figures here are reconciled from company statements and trade reporting rather ' +
            'than measured, so treat the ranking as far firmer than the numbers. The ranking is ' +
            'the point.',
      sources: ['Appliance trade press', 'Company statements', 'Company filings']
    },
    {
      id: 'retail-mw', name: 'Retail and channel', short: 'Retail', kind: 'meta',
      blurb: 'Where it is actually sold, and who sets the price that decides the whole design.',
      market: { size: null, year: 2025, basis: 'retail channel structure: no reliable global split published' },
      asOf: '2025', confidence: 'low',
      shares: [],
      note: 'Named but not measured. The relevant fact is not who retails microwaves but what ' +
            'retail does to them: this is a category bought on price at a shelf, frequently as a ' +
            'retailer own-label, and the specification is written backwards from a price point. A ' +
            'buyer at a large chain choosing a fifty-nine dollar target is making more of the ' +
            'engineering decisions in this machine than any engineer.',
      sources: ['Appliance trade press']
    },
    {
      id: 'standards-mw', name: 'Safety and emissions standards', short: 'Standards', kind: 'meta',
      blurb: 'The leakage limit, and the certification regime that makes the door what it is.',
      market: { size: null, year: 2025, basis: 'regulatory regime, not a market' },
      asOf: '2025', confidence: 'medium', chokepoint: true,
      shares: [],
      note: 'Not a market, and unusually consequential for one. Microwave ovens are regulated on ' +
            'radiation leakage, in the United States by a performance standard administered by the ' +
            'FDA, which is itself unusual, since the agency regulates the appliance as a radiation ' +
            'emitting electronic product rather than as a kitchen good. The limit shapes the door, ' +
            'the choke, the interlocks and the fail-safe fuse, which between them are a meaningful ' +
            'share of the cost. It is the clearest case on this site of a regulation designing a ' +
            'component.',
      sources: ['Company statements', 'Appliance trade press']
    },

    /* ==================== MAGNETRON CHILDREN ==================== */
    {
      id: 'cathode-mw', parent: 'magnetron', name: 'Cathode and filament', short: 'Cathode',
      blurb: 'A thoriated tungsten filament, heated until it boils electrons into a vacuum. Thermionic emission, in a kitchen.',
      layout: 'chain',
      market: { size: 'USD ~0.1bn', year: 2025, basis: 'magnetron cathode and filament supply, estimated' },
      asOf: '2025', confidence: 'low', chokepoint: true,
      shares: [],
      note: 'Named but not measured: the assemblers make their own and nobody publishes a split. ' +
            'The physics is the reason this node exists. A magnetron works by heating a filament ' +
            'until electrons leave its surface, then bending them into spiral paths with a magnetic ' +
            'field so they excite resonant cavities in a copper block. It is nineteenth-century ' +
            'thermionics and 1940 microwave engineering, in a device that costs less than a takeaway ' +
            'meal. The filament is tungsten because almost nothing else survives being run white-hot ' +
            'for a decade, which is where this chain goes next.',
      sources: ['Company statements', 'ITIA']
    },
    {
      id: 'anode-mw', parent: 'magnetron', name: 'Anode block', short: 'Anode',
      blurb: 'A copper block machined with resonant cavities. Their dimensions set the 2.45 GHz frequency.',
      market: { size: 'USD ~0.2bn', year: 2025, basis: 'magnetron anode and copper component supply, estimated' },
      asOf: '2025', confidence: 'low',
      shares: [],
      note: 'Named but not measured. The cavities cut into this block are the actual oscillator, ' +
            'their size determines the frequency, which is why every domestic microwave in the ' +
            'world runs at the same 2.45 GHz. That frequency was chosen because it sits in an ' +
            'unlicensed industrial band, not because it is especially good at heating water, which ' +
            'is a widely repeated myth.',
      sources: ['Company statements', 'Appliance trade press']
    },
    {
      id: 'mag-magnets', parent: 'magnetron', name: 'Ferrite magnets', short: 'Magnets',
      blurb: 'Two ceramic ring magnets bending the electron paths. Deliberately not rare earth.',
      market: { size: 'USD ~4.5bn', year: 2025, basis: 'hard ferrite permanent magnet revenue, all applications' },
      asOf: '2025', confidence: 'low',
      shares: [
        { c: 'DMEGC', p: 13 }, { c: 'TDK', p: 11 }, { c: 'Proterial', p: 6 }
      ],
      note: 'A rare moment of relief in this teardown. Magnetrons use cheap strontium ferrite rather ' +
            'than neodymium, because the magnet has room to be large and cost matters more than ' +
            'size, so unlike the electric vehicle and the subsea cable, this device does not touch ' +
            'the rare earth chain at all. It is a good reminder that a magnet is not automatically ' +
            'a chokepoint: the constraint is the performance requirement, not the component.',
      sources: ['Company filings', 'Appliance trade press']
    },
    {
      id: 'mag-ceramic', parent: 'magnetron', name: 'Ceramic seal and antenna', short: 'Ceramic',
      blurb: 'An alumina insulator sealing the vacuum where the antenna passes out into the waveguide.',
      market: { size: 'USD ~0.15bn', year: 2025, basis: 'magnetron ceramic and vacuum seal component supply, estimated' },
      asOf: '2025', confidence: 'low',
      shares: [],
      note: 'Named but not measured, and quietly the hardest manufacturing problem in the ' +
            'magnetron. A ceramic-to-metal seal has to hold a vacuum for a decade across thousands ' +
            'of thermal cycles between room temperature and several hundred degrees, with two ' +
            'materials that expand at different rates. Most magnetron failures are here rather than ' +
            'in the electronics.',
      sources: ['Company statements', 'Appliance trade press']
    },

    /* ---- the tungsten chain ---- */
    {
      id: 'tungsten-mw', parent: 'cathode-mw', name: 'Tungsten wire', short: 'Tungsten wire',
      blurb: 'Drawn thoriated tungsten filament wire: a specialist product from a very short list of producers.',
      layout: 'chain',
      market: { size: 'USD ~1.2bn', year: 2025, basis: 'tungsten wire and filament product revenue, all applications' },
      asOf: '2025', confidence: 'low', chokepoint: true,
      shares: [
        { c: 'Xiamen Tungsten', p: 18 }, { c: 'CMOC', p: 9 },
        { c: 'Chongyi Zhangyuan', p: 7 }, { c: 'Wolfram Bergbau', p: 4 }
      ],
      note: 'Drawing tungsten into fine wire is genuinely difficult: the metal is brittle at room ' +
            'temperature and has to be worked hot through many stages, and the capability sits ' +
            'overwhelmingly in China alongside the ore. The basis here is all applications, because ' +
            'nobody splits out magnetron filament, and the same wire goes into lighting, welding ' +
            'electrodes and medical X-ray targets.',
      sources: ['ITIA', 'Company filings']
    },
    {
      id: 'tungsten-apt', parent: 'tungsten-mw', name: 'Ammonium paratungstate', short: 'APT',
      blurb: 'The intermediate chemical the tungsten trade actually prices and ships. Where the export controls bite.',
      layout: 'chain',
      market: { size: 'USD ~3bn', year: 2025, basis: 'ammonium paratungstate production value, the traded tungsten intermediate' },
      asOf: '2025', confidence: 'medium', chokepoint: true,
      shares: [
        { c: 'China (all firms combined)', p: 84 }, { c: 'Vietnam (all producers)', p: 5 },
        { c: 'Almonty', p: 3 }
      ],
      note: 'Ore is not what gets traded; APT is. It is the intermediate everything downstream is ' +
            'made from and the thing price reporting agencies actually quote, which makes it the ' +
            'effective control point in the chain. China placed selected tungsten items under ' +
            'export licensing in February 2025 and prices roughly doubled across the year, APT ' +
            'moved from around USD 331 to USD 675 per metric tonne unit on the Rotterdam ' +
            'assessment. A licensing regime on an intermediate is a far more precise instrument ' +
            'than a tariff on a finished good.',
      sources: ['Fastmarkets', 'USGS Mineral Commodity Summaries', 'ITIA']
    },
    {
      id: 'tungsten-mining', parent: 'tungsten-apt', name: 'Tungsten mining', short: 'Tungsten',
      blurb: 'Wolframite and scheelite ore. About four fifths of it comes out of one country.',
      market: { size: 'USD ~4bn', year: 2025, basis: 'tungsten mine production value' },
      asOf: '2025', confidence: 'medium', chokepoint: true,
      shares: [
        { c: 'China (all firms combined)', p: 83 }, { c: 'Vietnam (all producers)', p: 5 },
        { c: 'Russia (all producers)', p: 3 }, { c: 'Almonty', p: 2 }
      ],
      note: 'The bottom of this teardown. China produces roughly eighty-three percent of world ' +
            'tungsten and holds about half of known reserves, and production outside it has stayed ' +
            'under a fifth of the total for years. NATO named tungsten one of twelve ' +
            'defence-critical raw materials in December 2024, and it is exceptionally hard to ' +
            'substitute in cutting tools, armour and aerospace alloys. The filament in a ' +
            'sixty-dollar microwave is a rounding error in that demand, which is exactly the ' +
            'point. The device is trivial; the material underneath it is not, and the appliance ' +
            'industry has no leverage over it whatsoever.',
      sources: ['USGS Mineral Commodity Summaries', 'Fastmarkets', 'ITIA']
    },

    /* ==================== HIGH VOLTAGE CHILDREN ==================== */
    {
      id: 'hv-transformer', parent: 'hv-supply', name: 'High voltage transformer', short: 'Transformer',
      blurb: 'A laminated steel core wound to step 230 volts up to about 2,000, before the doubler.',
      layout: 'chain',
      market: { size: 'USD ~0.3bn', year: 2025, basis: 'microwave high voltage transformer supply, estimated' },
      asOf: '2025', confidence: 'low',
      shares: [
        { c: 'Galanz', p: 28 }, { c: 'Midea', p: 20 }, { c: 'Witol', p: 8 }
      ],
      note: 'The heaviest single component and a large part of why a cheap microwave weighs what it ' +
            'does. It is also the clearest single example of the vertical integration that defines ' +
            'this device: the firms that assemble the oven wind their own transformers, because at ' +
            'this price there is no margin left for anyone in between.',
      sources: ['Appliance trade press', 'Company statements']
    },
    {
      id: 'hv-capacitor', parent: 'hv-supply', name: 'High voltage capacitor', short: 'Capacitor',
      blurb: 'A film capacitor holding a genuinely lethal charge, with a bleeder resistor that is not always fitted.',
      market: { size: 'USD ~0.15bn', year: 2025, basis: 'microwave high voltage capacitor supply, estimated' },
      asOf: '2025', confidence: 'low',
      shares: [],
      note: 'Named but not measured. Worth its own node because it is the component that kills ' +
            'people: it stores enough energy to be fatal and can hold it for a long time after the ' +
            'machine is unplugged. The internal bleeder resistor that discharges it is a few cents ' +
            'and is not universally fitted, which is why every service manual for this appliance ' +
            'opens with the same warning.',
      sources: ['Company statements', 'Appliance trade press']
    },
    {
      id: 'hv-diode', parent: 'hv-supply', name: 'High voltage diode', short: 'Diode',
      blurb: 'A stack of series junctions rectifying several thousand volts, in a component the size of a fingertip.',
      market: { size: 'USD ~0.1bn', year: 2025, basis: 'microwave high voltage rectifier supply, estimated' },
      asOf: '2025', confidence: 'low',
      shares: [],
      note: 'Named but not measured. Together with the capacitor it forms a half-wave voltage ' +
            'doubler, which is how a transformer producing about 2,000 volts ends up delivering ' +
            'around 4,000 to the magnetron. Using a doubler rather than a bigger transformer saves ' +
            'copper and steel, and on this bill of materials that trade is worth making.',
      sources: ['Company statements', 'Appliance trade press']
    },
    {
      id: 'transformer-steel', parent: 'hv-transformer', name: 'Electrical steel', short: 'Core steel',
      blurb: 'Grain-oriented silicon steel laminations: the same material every transformer on the grid is built from.',
      market: { size: 'USD ~28bn', year: 2025, basis: 'electrical steel production value, all applications' },
      asOf: '2025', confidence: 'low', chokepoint: true,
      shares: [
        { c: 'Baowu', p: 21 }, { c: 'Nippon Steel', p: 11 }, { c: 'POSCO', p: 9 },
        { c: 'JFE', p: 7 }, { c: 'Cleveland-Cliffs', p: 5 }
      ],
      note: 'A genuinely constrained material with a much larger story attached to it than a ' +
            'microwave: grain-oriented electrical steel is the bottleneck on grid transformer ' +
            'supply worldwide, where lead times have run to several years. A microwave transformer ' +
            'is an insignificant consumer of it, but the same short list of mills supplies both, ' +
            'and the appliance is competing for capacity with the energy transition.',
      sources: ['Company filings', 'USGS Mineral Commodity Summaries']
    },

    /* ==================== CAVITY AND DOOR CHILDREN ==================== */
    {
      id: 'waveguide', parent: 'cavity', name: 'Waveguide', short: 'Waveguide',
      blurb: 'A short rectangular duct carrying energy from the magnetron antenna into the cavity.',
      market: { size: 'USD ~0.1bn', year: 2025, basis: 'microwave waveguide component supply, estimated' },
      asOf: '2025', confidence: 'low',
      shares: [],
      note: 'Named but not measured. A folded steel channel that costs almost nothing and has to be ' +
            'exactly the right cross-section, because a waveguide below its cut-off dimension ' +
            'simply will not propagate. It is one of several places in this machine where the ' +
            'dimensions are set by physics rather than by an industrial designer.',
      sources: ['Company statements', 'Appliance trade press']
    },
    {
      id: 'cavity-steel', parent: 'cavity', name: 'Coated steel sheet', short: 'Steel',
      blurb: 'Cold rolled sheet, the raw material of both the cavity and the case.',
      market: { size: 'USD ~420bn', year: 2025, basis: 'cold rolled and coated flat steel production value, all applications' },
      asOf: '2025', confidence: 'medium',
      shares: [
        { c: 'Baowu', p: 7 }, { c: 'ArcelorMittal', p: 4 }, { c: 'Nippon Steel', p: 3 },
        { c: 'POSCO', p: 3 }
      ],
      note: 'Included as a deliberate counterexample, in the same spirit as copper on the subsea ' +
            'cable teardown. Flat steel is a vast, liquid, genuinely competitive market: the ' +
            'appliance maker has price risk and no supply risk at all. Compare it with the tungsten ' +
            'four nodes across, where the volumes are trivial and the supply risk is the whole ' +
            'story. The size of a market tells you nothing about its fragility.',
      sources: ['Company filings', 'USGS Mineral Commodity Summaries']
    },
    {
      id: 'cavity-paint', parent: 'cavity', name: 'Cavity coating', short: 'Coating',
      blurb: 'Acrylic or ceramic enamel that has to survive steam, fat and a decade of scrubbing.',
      market: { size: 'USD ~0.1bn', year: 2025, basis: 'appliance cavity coating supply for microwave ovens, estimated' },
      asOf: '2025', confidence: 'low',
      shares: [],
      note: 'Named but not measured, and the most common reason a working microwave is thrown away: ' +
            'the coating fails, the steel underneath rusts, and arcing follows. A part worth cents ' +
            'determines the service life of the whole appliance, which is a familiar shape by now ' +
            'and a genuinely under-appreciated driver of replacement demand.',
      sources: ['Company statements', 'Appliance trade press']
    },
    {
      id: 'door-choke', parent: 'door-c', name: 'Choke and seal', short: 'Choke',
      blurb: 'A quarter-wave trap around the door perimeter that cancels leakage without touching anything.',
      market: { size: null, year: 2025, basis: 'integral to door assembly: no separate market' },
      asOf: '2025', confidence: 'low',
      shares: [],
      note: 'Not a separable market, and the most elegant thing in the machine. A microwave door ' +
            'does not seal: there is a visible gap. Instead the perimeter carries a channel a ' +
            'quarter of a wavelength deep, which reflects arriving energy back exactly out of phase ' +
            'so it cancels itself at the opening. No gasket, no contact, no wear. It is why a door ' +
            'that is visibly not airtight is nonetheless radiation tight.',
      sources: ['Company statements']
    },
    {
      id: 'door-screen', parent: 'door-c', name: 'Screen and glass', short: 'Screen',
      blurb: 'A perforated metal sheet behind glass: holes far smaller than the 122 mm wavelength, but larger than light.',
      market: { size: null, year: 2025, basis: 'integral to door assembly: no separate market' },
      asOf: '2025', confidence: 'low',
      shares: [],
      note: 'Not a separable market. The screen is a Faraday cage with holes in it, and it works ' +
            'because 2.45 GHz has a wavelength of about 122 millimetres while visible light is ' +
            'under a thousandth of a millimetre, so the mesh is opaque to one and transparent to ' +
            'the other. It is the single piece of physics most people have looked at thousands of ' +
            'times without ever being told what it is doing.',
      sources: ['Company statements']
    },

    /* ==================== CONTROL CHILDREN ==================== */
    {
      id: 'control-mcu', parent: 'control', name: 'Microcontroller', short: 'MCU',
      blurb: 'An eight-bit or small 32-bit part running a timer, a keypad scan and a relay. Under a dollar.',
      layout: 'chain',
      market: { size: 'USD ~24bn', year: 2025, basis: 'microcontroller revenue, all applications' },
      asOf: '2025', confidence: 'medium',
      shares: [
        { c: 'Renesas', p: 15 }, { c: 'NXP', p: 13 }, { c: 'Microchip', p: 12 },
        { c: 'STMicroelectronics', p: 12 }, { c: 'Infineon', p: 10 }
      ],
      note: 'The basis is all applications: nobody splits out appliance microcontrollers, and the ' +
            'same parts run washing machines, thermostats and toys. Chinese suppliers have taken a ' +
            'large share of the very low end that a microwave sits in, which is not visible in a ' +
            'revenue-based table like this one: at under a dollar a unit, a big share of volume is ' +
            'a small share of revenue.',
      sources: ['Company filings', 'Appliance trade press']
    },
    {
      id: 'control-display', parent: 'control', name: 'Display', short: 'Display',
      blurb: 'A seven-segment LED or a small LCD. The only thing on the machine that has visibly changed in thirty years.',
      market: { size: 'USD ~0.2bn', year: 2025, basis: 'appliance display module supply for microwave ovens, estimated' },
      asOf: '2025', confidence: 'low',
      shares: [],
      note: 'Named but not measured. Worth noting because it is the one component where the ' +
            'cheapest option changed: vacuum fluorescent displays dominated for decades and have ' +
            'largely been replaced by LED and small LCD modules on cost. A microwave was, for a ' +
            'while, a device containing two separate vacuum tubes.',
      sources: ['Appliance trade press', 'Company statements']
    },
    {
      id: 'control-keypad', parent: 'control', name: 'Membrane keypad', short: 'Keypad',
      blurb: 'A printed flexible circuit under a polyester overlay. Pennies, and the part users hate first.',
      market: { size: 'USD ~0.15bn', year: 2025, basis: 'appliance membrane switch supply, estimated' },
      asOf: '2025', confidence: 'low',
      shares: [],
      note: 'Named but not measured. Membrane keypads are chosen because they are sealed against ' +
            'kitchen grease and cost almost nothing, and they are also the most common ergonomic ' +
            'complaint about the entire category. It is a clean example of a component selected ' +
            'entirely on manufacturing cost and cleanability, with the user experience arriving ' +
            'third.',
      sources: ['Company statements', 'Appliance trade press']
    },
    {
      id: 'mcu-fab', parent: 'control-mcu', name: 'Mature-node fabrication', short: 'Fab',
      /* Deliberately shallow and cross-linked. The tractor and the car both
         map mature-node semiconductor supply in depth; repeating it here
         would tell the same story a third time. */
      upstream: ['control'],
      blurb: 'Where an appliance microcontroller is actually made: processes two decades old, on 200mm wafers.',
      market: { size: 'USD ~28bn', year: 2025, basis: 'mature-node foundry revenue, 40nm and above' },
      asOf: '2025', confidence: 'low',
      shares: [
        { c: 'TSMC', p: 26 }, { c: 'UMC', p: 13 }, { c: 'SMIC', p: 12 },
        { c: 'GlobalFoundries', p: 9 }, { c: 'Hua Hong', p: 7 }
      ],
      note: 'Kept deliberately shallow: the tractor and the car teardowns both map mature-node ' +
            'semiconductor supply properly, and a third pass would say the same thing again. What ' +
            'the microwave adds is the floor of the market: this is the cheapest silicon in ' +
            'consumer goods, made on lines long since paid for, and it is the segment where Chinese ' +
            'foundries have been building capacity fastest while everyone else chased the leading ' +
            'edge.',
      sources: ['TrendForce', 'Company filings']
    },

    /* ============ MOTION, SHELL AND WIRING CHILDREN ============ */
    {
      id: 'turntable-motor', parent: 'turntable', name: 'Turntable motor', short: 'Motor',
      blurb: 'A shaded-pole synchronous motor geared down to about five revolutions per minute.',
      market: { size: 'USD ~0.1bn', year: 2025, basis: 'appliance synchronous gear motor supply, estimated' },
      asOf: '2025', confidence: 'low',
      shares: [
        { c: 'Johnson Electric', p: 17 }, { c: 'Nidec', p: 8 }
      ],
      note: 'A shaded-pole motor is about as simple as an electric motor gets: no brushes, no ' +
            'electronics, poor efficiency and almost no cost. In an appliance that runs for four ' +
            'minutes at a time, efficiency is worth nothing and unit cost is worth everything, so ' +
            'the crudest available technology is the correct engineering answer.',
      sources: ['Company filings', 'Appliance trade press']
    },
    {
      id: 'turntable-glass', parent: 'turntable', name: 'Glass tray', short: 'Tray',
      blurb: 'Tempered borosilicate or soda-lime glass, transparent to microwaves and to dishwashers.',
      market: { size: 'USD ~0.1bn', year: 2025, basis: 'appliance tempered glass tray supply, estimated' },
      asOf: '2025', confidence: 'low',
      shares: [],
      note: 'Named but not measured. Glass is used because it is nearly transparent to microwaves, ' +
            'it absorbs almost none of the energy meant for the food, and because it survives ' +
            'thermal shock and a dishwasher. It is also the part most often broken, and one of the ' +
            'very few components in the machine with a real spare-parts aftermarket.',
      sources: ['Company statements', 'Appliance trade press']
    },
    {
      id: 'fan-motor', parent: 'fan-cool', name: 'Fan motor', short: 'Fan motor',
      blurb: 'A second shaded-pole motor driving the magnetron cooling fan, and often the mode stirrer too.',
      market: { size: 'USD ~0.1bn', year: 2025, basis: 'appliance fan motor supply for microwave ovens, estimated' },
      asOf: '2025', confidence: 'low',
      shares: [
        { c: 'Johnson Electric', p: 15 }, { c: 'Nidec', p: 9 }
      ],
      note: 'Frequently the same motor family as the turntable drive, which is deliberate: using one ' +
            'part number twice removes an entire line item from procurement, and on a bill of ' +
            'materials this thin that is a decision worth making. Commonality is a cost strategy, ' +
            'not an accident.',
      sources: ['Company filings', 'Appliance trade press']
    },
    {
      id: 'case-steel', parent: 'enclosure-mw', name: 'Case steel', short: 'Case steel',
      blurb: 'Pre-painted cold rolled sheet, folded and spot welded into the outer wrapper.',
      market: { size: 'USD ~180bn', year: 2025, basis: 'pre-painted and galvanised flat steel production value, all applications' },
      asOf: '2025', confidence: 'low',
      shares: [
        { c: 'Baowu', p: 8 }, { c: 'ArcelorMittal', p: 4 }, { c: 'POSCO', p: 3 }
      ],
      note: 'Pre-painted coil is bought finished and folded, so the appliance maker never runs a ' +
            'paint line for the exterior at all. It is a small but real example of how a category ' +
            'this cheap survives: every process step that can be pushed back to the material ' +
            'supplier has been.',
      sources: ['Company filings', 'Appliance trade press']
    },
    {
      id: 'case-finish', parent: 'enclosure-mw', name: 'Finish and trim', short: 'Finish',
      blurb: 'Stainless or painted fascia, handle and the plastic trim that carries the brand.',
      market: { size: 'USD ~0.2bn', year: 2025, basis: 'appliance exterior trim and fascia supply, estimated' },
      asOf: '2025', confidence: 'low',
      shares: [],
      note: 'Named but not measured, and the only place differentiation actually happens. When the ' +
            'machine inside two badges is the same machine, the fascia, the handle and the ' +
            'brushed-steel finish are the entire product difference, which is why they absorb a ' +
            'disproportionate share of the design effort and the price premium.',
      sources: ['Appliance trade press', 'Company statements']
    },
    {
      id: 'wiring-harness-mw', parent: 'wiring-mw', name: 'Harness', short: 'Harness',
      blurb: 'A few metres of high-temperature wire with spade terminals, assembled by hand.',
      market: { size: 'USD ~0.1bn', year: 2025, basis: 'appliance wiring harness supply for microwave ovens, estimated' },
      asOf: '2025', confidence: 'low',
      shares: [],
      note: 'Named but not measured. The same structural point as the car teardown, at a thousandth ' +
            'of the scale: harness assembly resists automation and is therefore done by hand where ' +
            'labour is cheap. In this device the assembler is already in a low-cost location, so ' +
            'the vulnerability that halted European car production in 2022 simply does not arise.',
      sources: ['Company statements', 'Appliance trade press']
    },
    {
      id: 'interlock-mw', parent: 'wiring-mw', name: 'Interlock switches', short: 'Interlocks',
      blurb: 'Three microswitches, one of which is wired to destroy the fuse rather than allow the magnetron to run.',
      market: { size: 'USD ~0.1bn', year: 2025, basis: 'appliance safety interlock switch supply, estimated' },
      asOf: '2025', confidence: 'low', chokepoint: true,
      shares: [],
      note: 'Named but not measured, and the most interesting cents-level component on the site. The ' +
            'monitor switch is arranged so that if the primary interlocks fail to open when the door ' +
            'is opened, it shorts the supply and blows the fuse: the appliance deliberately ' +
            'destroys itself rather than risk emitting with the door open. Very few consumer ' +
            'products contain a component whose job is to break the product.',
      sources: ['Company statements', 'Appliance trade press']
    }
  ]
});
