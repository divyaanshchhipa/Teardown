/* Teardown :: Wind turbine
 *
 * Tenth flagship. Utility-scale onshore machine, 5 to 7 MW class.
 *
 * Its terminus is the one genuinely new kind of ending in this catalogue: a
 * tree. Structural balsa for blade cores comes overwhelmingly from Ecuador,
 * a plantation crop with a four-to-six year growth cycle feeding an industry
 * that changes its build rate every quarter. In 2019-20 the demand ran into
 * the biology, the price roughly doubled, exports hit a record USD 570m, and
 * the shortfall was made up with illegally logged wood taken out of the
 * Amazon. Nothing else on this site bottoms out in something that has to be
 * planted four years before it is needed.
 *
 * And then the second half of that story, which is why it earns the flagship
 * rather than merely a good note: the industry engineered its way out. PET
 * foam displaced balsa across most of the shell, and the dependency that
 * caused a genuine crisis in 2020 is materially smaller now. This is the
 * only chokepoint anywhere in this catalogue that got *solved*. Every other
 * terminus here: Zeiss, the Bushveld, the DRC, tungsten, the
 * interconnection queue, is still exactly where it was.
 *
 * Two deliberate restraints on scope, both to protect chains that belong to
 * other teardowns:
 *
 *  - The magnet chain descends to sintered NdFeB manufacturing and to rare
 *    earth refining, and then stops and cross-references the submarine cable
 *    teardown, which owns the separation chemistry. The convergence is
 *    stated rather than re-walked. It is a real finding that two devices this
 *    unlike arrive at the same place from different directions.
 *  - Grid connection is not modelled at all. The interconnection queue is the
 *    AI server rack's terminus and re-walking it here would add nothing.
 *
 * Sourcing note. This is better evidenced than most of the industrial half of
 * the catalogue at the top and no better at the bottom. GWEC publishes
 * installed capacity by manufacturer in gigawatts, openly, which is the
 * cleanest supplier ranking of any industrial market here. Below the OEM
 * almost nothing is published: the single largest line in the bill of
 * materials, the tower at 26%, has no supplier share table anywhere, and
 * that absence is stated as a finding rather than filled with an estimate.
 */
TD.device({
  id: 'wind-turbine',
  name: 'Wind turbine',
  icon: 'turbine',
  category: 'Industrial and energy',
  tagline: 'The bottom of this machine is a tree that takes four years to grow.',
  unit: { volume: '178GW installed globally (2025)', price: 'USD ~1,000 per kW installed, onshore' },
  intro: 'Utility-scale onshore, 5 to 7 megawatt class. A record 178 gigawatts went up in 2025, and for ' +
         'the first time the five largest suppliers on earth were all Chinese. Underneath that headline ' +
         'sit two supply stories the OEM ranking hides: the largest single cost in the machine has no ' +
         'published supplier share at all, and the blade: the part that makes it a wind turbine ' +
         'rather than a tower: depends on a plantation crop from one country, a dependency the ' +
         'industry spent five years engineering its way out of after it broke.',
  view: { w: 1000, h: 790 },
  frames: [
    { label: 'Rotor, tower and gearbox: sixty-five per cent of the cost', x: 90, y: 62, w: 840, h: 160 },
    { label: 'Rotation, pitch and yaw', x: 90, y: 230, w: 840, h: 160 },
    { label: 'Power conversion and control', x: 90, y: 398, w: 840, h: 160 },
    { label: 'Residual', x: 90, y: 566, w: 840, h: 160 }
  ],

  /* ============================ STORY ============================
   * `stages` must account for all 47 nodes exactly once.
   */
  story: {
    kicker: 'Flagship teardown',
    headline: 'The only chokepoint on this site that got solved.',
    lede: 'Forty-seven mapped layers, five tiers deep, and a machine assembled from three separate ' +
          'supply chains that barely touch: a composite one, a heavy-forging one, and a rare earth one. ' +
          'Follow the composite chain to the bottom and it ends in a plantation in Ecuador: the ' +
          'only terminus in this catalogue that has to be planted four years before anyone needs it, ' +
          'and the only one the industry has meaningfully escaped.',

    tierNote: 'The tiers here fall into two halves that behave completely differently. The machine and ' +
              'its subsystems are moderately concentrated and reasonably competitive. The materials ' +
              'underneath (magnets, fibre, balsa) are not, and neither is the forging ' +
              'capacity that turns them into parts.',
    geoLede: 'China dominates this machine at every level, and the interesting thing is that it does so ' +
             'in three completely different ways. At the top it out-competes: five Chinese OEMs took the ' +
             'top five places on 2025 installations by building good machines cheaply. In the middle it ' +
             'out-scales: roughly seventy per cent of world blade output is now Chinese, against thirty ' +
             'per cent in 2017. At the bottom it simply holds the material, refining around nine tenths ' +
             'of the world’s rare earths and sintering a comparable share of its magnets, which is ' +
             'a position no competitor can build around. Three different kinds of dominance, and only ' +
             'the first of them is a market outcome.',

    findings: [
      { title: 'A tree with a four-year lead time',
        body: 'End-grain balsa is the structural core of a blade shell, and Ecuador supplies roughly 95% ' +
              'of the world’s commercial crop. When wind installations surged in 2019 and 2020 the ' +
              'industry discovered that a balsa tree takes four to six years to reach harvestable size, ' +
              'and no amount of price could shorten that. Prices roughly doubled, Ecuadorian exports hit ' +
              'a record USD 570m in 2020 with about three quarters of it going into blades, and the ' +
              'shortfall was met by illegal logging in the Amazon documented by investigators in both ' +
              'Ecuador and Peru. Then exports collapsed 66% to USD 196m the following year. That is a ' +
              'biological lead time colliding with an industrial one, and nothing else on this site has ' +
              'that shape.',
        nodes: ['balsa-ecuador', 'balsa', 'blade-core'] },
      { title: 'And the industry got out of it',
        body: 'This is the part worth carrying away, because no other teardown here can show it. Faced ' +
              'with a material chokepoint it could not price its way through, the industry substituted: ' +
              'PET foam, much of it made from recycled bottles, displaced balsa across most of the ' +
              'blade shell, with balsa retained mainly at the highly stressed root section where its ' +
              'compressive strength still wins. Every other terminus in this catalogue: the Zeiss ' +
              'optics, the Bushveld platinum, Congolese cobalt, Chinese tungsten, is exactly where ' +
              'it was when it was first written down. This one moved, because the constraint was a ' +
              'material property rather than a geology or a contract, and material properties can be ' +
              'engineered around given five years and a strong enough incentive.',
        nodes: ['pet-foam', 'balsa', 'blades'] },
      { title: 'The largest cost line has no supplier data at all',
        body: 'The tower is 26% of what the machine costs to build, comfortably the biggest single line, ' +
              'and there is no published supplier share table for it anywhere. That is not an oversight ' +
              'in the research. Towers are heavy, low-value-density steel structures that cost more to ' +
              'ship than to make beyond a few hundred kilometres, so the market is regional rather than ' +
              'global and no tracker sizes it as one. The named independents: CS Wind, Titan Wind, ' +
              'Arcosa, Marmen, GRI, compete inside freight catchments against the OEMs’ own ' +
              'in-house capacity. The finding is the structure: the most expensive part of a wind ' +
              'turbine is the one least exposed to global concentration, and the cheapest parts are the ' +
              'ones with a single country behind them.',
        nodes: ['tower', 'tower-steel', 'magnets'] }
    ],

    /* upstream -> downstream. Node counts here must sum to 47. */
    stages: [
      { id: 'grown', name: 'Grown and mined inputs',
        note: 'A plantation crop, a rare earth refinery, bearing-grade steel and heavy plate. The bottom ' +
              'of three separate chains that only meet inside the nacelle.',
        nodes: ['balsa-ecuador', 'balsa', 'pet-foam', 're-refine', 'bearing-steel', 'tower-steel',
                'copper-wt'] },
      { id: 'fibre', name: 'Fibre and resin',
        note: 'The polymer chain: acrylonitrile into precursor into carbon fibre, glass drawn from ' +
              'molten batch, and the epoxy that holds sixty tonnes of it together.',
        nodes: ['carbon-precursor', 'blade-carbon', 'blade-glass', 'blade-resin'] },
      { id: 'blade', name: 'The blade',
        note: 'Up to 115 metres of sandwich laminate, built in two halves and bonded: the largest ' +
              'single composite structure manufactured anywhere.',
        nodes: ['blade-core', 'blade-shell', 'blade-spar', 'blade-coating', 'blades'] },
      { id: 'forge', name: 'Forging, casting and machining',
        note: 'Where the supply chain physically narrows. Very few plants on earth can forge a ' +
              'five-metre ring or pour a twenty-tonne ductile iron hub to wind-grade specification.',
        nodes: ['large-forging', 'tower-flange', 'foundry-wt', 'hub-casting', 'gear-forging'] },
      { id: 'tower', name: 'The tower',
        note: 'The largest line in the bill of materials, the heaviest part of the machine, and the ' +
              'least globalised layer in this teardown.',
        nodes: ['tower-coating', 'tower'] },
      { id: 'drivetrain', name: 'Drivetrain',
        note: 'Taking a rotor turning at about twelve revolutions a minute and delivering something a ' +
              'generator can use, through bearings that must last twenty-five years without being ' +
              'replaced.',
        nodes: ['main-shaft', 'main-bearing', 'gear-bearing', 'gearbox'] },
      { id: 'generation', name: 'Generator and magnets',
        note: 'Copper, laminated steel and, on a direct-drive machine, roughly two hundred ' +
              'kilogrammes of rare earth magnet per megawatt.',
        nodes: ['ndfeb-sinter', 'magnets', 'gen-copper', 'generator'] },
      { id: 'electrical', name: 'Power conversion',
        note: 'Variable-frequency output at the generator, fixed-frequency at the grid, and about ' +
              'seventy metres of heavy cable between the nacelle and the base.',
        nodes: ['converter', 'transformer-wt', 'switchgear', 'cabling'] },
      { id: 'control', name: 'Control and motion',
        note: 'Pitching the blades, yawing the nacelle into the wind, and the sensors that decide when ' +
              'to shut the whole thing down.',
        nodes: ['scada', 'sensors-wt', 'control', 'pitch-drive', 'hub-pitch', 'nacelle-cover',
                'yaw-nacelle'] },
      { id: 'field', name: 'Built, lifted and eventually retired',
        note: 'Who assembled it, who could reach the top of it, and what happens to a hundred-metre ' +
              'thermoset blade after twenty-five years.',
        nodes: ['turbine-oem', 'oem-exchina', 'installation-wt', 'decommission-wt', 'unpriced-wt'] }
    ],

    flow: {
      lanes: [
        { label: 'Blade shell',
          steps: ['balsa-ecuador', 'balsa', 'blade-core', 'blade-shell', 'blades'],
          feed: { label: 'The substitute that broke the dependency', steps: ['pet-foam'] } },
        { label: 'Spar cap',
          steps: ['carbon-precursor', 'blade-carbon', 'blade-spar'] },
        { label: 'Drivetrain',
          steps: ['large-forging', 'gear-forging', 'gearbox'],
          feed: { label: 'What the rotor turns on', steps: ['bearing-steel', 'main-bearing'] } },
        { label: 'Generator',
          steps: ['re-refine', 'ndfeb-sinter', 'magnets', 'generator'] },
        { label: 'Tower',
          steps: ['tower-steel', 'tower-flange', 'tower'] }
      ],
      converge: ['turbine-oem', 'installation-wt']
    }
  },

  nodes: [

    /* =================== TOP-LEVEL COMPONENTS ===================
     * Thirteen roots whose bomPct sums to 100, following the WindEurope /
     * NREL breakdown of turbine capital cost rather than any grouping of
     * mine. Four of them: converter, transformer, main bearing and main
     * shaft, are defined further down beside their own subtrees rather
     * than here, because the material chain underneath them is the more
     * useful thing to read them next to. Grid position comes from `shape`,
     * not from file order, so this ordering is editorial only.
     */
    {
      id: 'blades', name: 'Rotor blades', short: 'Blades',
      shape: { x: 110, y: 82, w: 190, h: 130 },
      blurb: 'Three composite structures up to 115 metres long. The largest single components made of plastic anywhere.',
      bomPct: 22, layout: 'board',
      market: { size: 'USD ~51bn', year: 2025, basis: 'wind turbine blade market revenue; no publisher splits it credibly by supplier' },
      asOf: '2026', confidence: 'low', chokepoint: true,
      shares: [
        { c: 'China (all firms combined)', p: 70 }, { c: 'LM Wind Power', p: 7 },
        { c: 'TPI Composites', p: 5 }
      ],
      note: 'Read the basis before the number: this mixes a country aggregate with two named merchant ' +
            'suppliers, because that is the only way the available evidence can be stated without ' +
            'inventing a split. Chinese suppliers have gone from roughly 30% of world blade output in ' +
            '2017 to around 70% in 2025: a single-source figure, which is why this layer is ' +
            'graded low despite being 22% of the machine. That shift reflects where turbines are now ' +
            'built rather than any individual firm winning. The named merchant suppliers, LM Wind ' +
            'Power, owned by GE Vernova since 2017, and TPI Composites, compete for a market much ' +
            'smaller than the total, because Vestas, Siemens Gamesa, Goldwind and Mingyang all build ' +
            'most of their own; Sinoma, Zhongfu Lianzhong and Aeolon are the large Chinese producers ' +
            'inside the aggregate. Published “blade market share” tables that mix captive ' +
            'with merchant output are comparing different things and are not reproduced here. A modern ' +
            'blade is also, physically, remarkable: it is built ' +
            'in two halves in a heated mould, infused with resin under vacuum, and bonded, and ' +
            'the bond line is the most common structural failure point.',
      sources: ['GWEC', 'CompositesWorld'],
      deals: [
        { y: 2017, a: 'GE', t: 'LM Wind Power', v: 'USD ~1.65bn', n: 'Made GE, now GE Vernova, the owner of the largest independent blade maker: the clearest single piece of M&A in this supply chain.' }
      ]
    },
    {
      id: 'tower', name: 'Tower', short: 'Tower',
      shape: { x: 320, y: 82, w: 190, h: 130 },
      blurb: 'The largest cost in the machine and the heaviest part of it: 200 to 400 tonnes of rolled steel.',
      bomPct: 26, layout: 'chain',
      market: { size: 'USD ~32bn', year: 2026, basis: 'wind tower market revenue; no supplier share table is published for it' },
      asOf: '2026', confidence: 'medium',
      note: 'The biggest line in this bill of materials, and there is no supplier share table for it ' +
            'anywhere, which is a finding about the market rather than a gap in the research. A ' +
            'tower section is low-value-density steel that costs more to move than to make beyond a few ' +
            'hundred kilometres, so the market is a set of freight catchments rather than a global one, ' +
            'and no tracker sizes it as a single thing. Named independents: CS Wind, Titan Wind Energy, ' +
            'Arcosa, Marmen, GRI Renewable Industries, Valmont and Broadwind, all competing regionally ' +
            'against the OEMs’ own capacity. One trade estimate puts the five largest OEMs at ' +
            'about 55% of tower demand through in-house and directed supply, with the rest spread ' +
            'across regional fabricators. Read that as indicative.',
      sources: ['WindEurope', 'Company filings']
    },
    {
      id: 'hub-pitch', name: 'Hub and pitch system', short: 'Hub',
      shape: { x: 110, y: 250, w: 190, h: 130 },
      blurb: 'The casting the three blades bolt into, and the drives that twist them to control power.',
      bomPct: 5, layout: 'board',
      market: { size: 'USD ~3.3bn', year: 2025, basis: 'wind turbine casting market, hub and structural castings' },
      asOf: '2026', confidence: 'low',
      note: 'The hub is a single ductile iron casting weighing fifteen to thirty tonnes on a machine ' +
            'this size, and the pitch system inside it is what actually controls the turbine: by ' +
            'twisting each blade about its own axis it sets how much power the rotor takes from the ' +
            'wind, and in an emergency feathers the blades to stop the machine. There is no aerodynamic ' +
            'brake on a modern turbine of consequence, pitch is the brake. That makes a ' +
            'commodity-looking electromechanical subsystem safety-critical, and it is why pitch ' +
            'bearings and drives are qualified far more heavily than their cost suggests.',
      sources: ['NREL', 'CompositesWorld']
    },

    /* -------- rotation, generation, control -------- */
    {
      id: 'gearbox', name: 'Gearbox', short: 'Gearbox',
      shape: { x: 530, y: 82, w: 190, h: 130 },
      blurb: 'Steps a rotor turning at 12rpm up to about 1,500. Absent entirely on direct-drive machines.',
      bomPct: 13, layout: 'chain',
      market: { size: 'USD ~22bn', year: 2025, basis: 'wind turbine gearbox market revenue' },
      asOf: '2026', confidence: 'low', chokepoint: true,
      shares: [
        { c: 'NGC (Nanjing High Speed Gear)', p: 32 }, { c: 'ZF', p: 19 }, { c: 'Flender', p: 19 }
      ],
      note: 'Read the provenance carefully. What is actually published is that NGC, ZF and Flender hold ' +
            'roughly 70% of this market between them, and separately that NGC alone has held above 30% ' +
            'for several years. The split of the remaining forty points between ZF and Flender is ' +
            'derived and shown here as indicative only, no source separates them. The gearbox is ' +
            'also the component that historically failed most: early machines saw gearbox lives well ' +
            'short of the twenty-year design target, which is the single biggest reason the industry ' +
            'moved toward direct-drive designs that delete this row entirely and pay for it in magnets ' +
            'instead. Flender bought Moventas in 2022, taking three independents to two.',
      sources: ['Company filings', 'WindEurope'],
      deals: [
        { y: 2021, a: 'Carlyle Group', t: 'Flender', v: 'EUR ~2.0bn', n: 'Siemens sold its mechanical drives business to a sponsor, putting a top-three wind gearbox maker into private hands.' },
        { y: 2022, a: 'Flender', t: 'Moventas', v: 'undisclosed', n: 'Took the independent gearbox specialists from three to two.' }
      ]
    },
    {
      id: 'generator', name: 'Generator', short: 'Generator',
      shape: { x: 740, y: 82, w: 190, h: 130 },
      blurb: 'Turns mechanical rotation into electricity. On a direct-drive machine it is enormous and full of magnets.',
      bomPct: 4, layout: 'board',
      market: { size: 'not sized separately', year: 2026, basis: 'largely captive production, not traded as a distinct market' },
      asOf: '2026', confidence: 'low',
      note: 'Named and not measured, and for the same reason as the tractor engine on this site: it is ' +
            'mostly captive. Siemens Gamesa, GE Vernova, Goldwind and Mingyang build their own; ABB, ' +
            'Siemens and The Switch are named merchant suppliers with no published share. The choice ' +
            'that matters here is not the supplier but the architecture. A geared machine uses a small, ' +
            'fast, cheap generator and pays for a gearbox. A direct-drive permanent-magnet machine ' +
            'deletes the gearbox and uses a generator several times larger containing roughly 200kg of ' +
            'rare earth magnet per megawatt. The industry has been moving toward the second, which ' +
            'means it has been steadily trading a German and Chinese gearbox dependency for a Chinese ' +
            'magnet one.',
      sources: ['Company filings', 'IRENA']
    },
    {
      id: 'control', name: 'Control system', short: 'Control',
      shape: { x: 530, y: 418, w: 190, h: 130 },
      blurb: 'The controller and sensors that decide when to turn, how hard to work, and when to stop.',
      bomPct: 2, layout: 'board',
      market: { size: 'not tracked separately', year: 2026, basis: 'supplied as part of the turbine; no independent market' },
      asOf: '2026', confidence: 'low',
      note: 'Two per cent of the cost and effectively all of the operating value. The controller decides ' +
            'the pitch angle and yaw position several times a second against measured wind, and the ' +
            'difference between a well and a poorly controlled machine on the same site is a few per ' +
            'cent of annual energy, which, over twenty-five years, is worth more than the ' +
            'gearbox. It is also the layer where the OEM retains its aftermarket position: control ' +
            'software and the data it produces are proprietary, and independent service providers have ' +
            'fought a long and largely unsuccessful campaign for access to them. The commercial shape ' +
            'is the same one the tractor teardown finds in agricultural equipment.',
      sources: ['Company statements', 'IRENA']
    },
    {
      id: 'yaw-nacelle', name: 'Yaw system and nacelle', short: 'Yaw and nacelle',
      shape: { x: 740, y: 250, w: 190, h: 130 },
      blurb: 'The bearing and drives that rotate the whole nacelle into the wind, and the housing around it.',
      bomPct: 3, layout: 'board',
      market: { size: 'not tracked separately', year: 2026, basis: 'supplied within the nacelle assembly; no independent market' },
      asOf: '2026', confidence: 'low',
      note: 'The yaw system turns a three-hundred-tonne nacelle to follow the wind, through a large ' +
            'slewing bearing and a set of geared drives, and then holds it there against the torque of ' +
            'a rotor pushing on one side. It shares its supplier base and its manufacturing constraint ' +
            'with the main bearing: the same handful of plants able to make very large ' +
            'wind-grade slewing rings, which is why two apparently unrelated subsystems fail to ' +
            'be independent sources of supply.',
      sources: ['Company statements', 'NREL']
    },

    /* -------- wiring and residual -------- */
    {
      id: 'cabling', name: 'Cabling and connection', short: 'Cabling',
      shape: { x: 740, y: 418, w: 190, h: 130 },
      blurb: 'Roughly seventy metres of heavy power cable hanging down the tower, plus the earthing system.',
      bomPct: 3, layout: 'chain',
      market: { size: 'not tracked separately', year: 2026, basis: 'commodity cable supplied to project specification' },
      asOf: '2026', confidence: 'low',
      note: 'Unglamorous and genuinely awkward: the cable from the nacelle to the base has to hang ' +
            'freely down a rotating structure, so it is allowed to twist as the nacelle yaws and the ' +
            'controller counts the turns, untwisting the machine when it has wound up too far. A wind ' +
            'turbine periodically unwinds its own cable. The copper content is significant, ' +
            'several tonnes per machine, and is the reason this row is exposed to a commodity ' +
            'price that has nothing to do with wind.',
      sources: ['Company statements', 'IRENA']
    },
    {
      id: 'unpriced-wt', name: 'Not separately priced', short: 'Unpriced',
      shape: { x: 110, y: 586, w: 190, h: 130 },
      blurb: 'Fasteners, lubricants, lifts, ladders, fall arrest, paint, assembly labour and factory overhead.',
      bomPct: 7,
      market: { size: null, year: 2026, basis: 'residual share of turbine capital cost, not a market' },
      asOf: '2026', confidence: 'low',
      shares: [],
      note: 'Larger than it looks, and one item inside it deserves naming. A machine this size is held ' +
            'together by several thousand high-tensile bolts, and the tower flange connections alone ' +
            'carry more than a hundred of the largest, each tensioned to a specified load and ' +
            're-checked on a schedule for the life of the turbine. Bolt failures are a recurring cause ' +
            'of serious incidents. There is no published market for wind fasteners, they are a rounding ' +
            'error in the bill of materials, and they are one of the few components whose failure takes ' +
            'the whole structure down.',
      sources: ['NREL', 'Company statements']
    },

    /* ============================ META ============================ */
    {
      id: 'turbine-oem', name: 'Turbine makers, worldwide', short: 'OEM, global', kind: 'meta',
      blurb: 'Who actually built the machine. In 2025, for the first time, the top five were all Chinese.',
      market: { size: '178GW installed', year: 2025, basis: 'capacity mechanically installed during 2025, gigawatts, global' },
      asOf: '2025', confidence: 'high',
      shares: [
        { c: 'Goldwind', p: 16.7 }, { c: 'Envision', p: 12.2 }, { c: 'Windey', p: 11.1 },
        { c: 'Mingyang', p: 10.4 }, { c: 'SANY', p: 8.5 }, { c: 'Vestas', p: 7.2 },
        { c: 'Nordex', p: 4.3 }, { c: 'GE Vernova', p: 3.3 }, { c: 'Siemens Gamesa', p: 3 }
      ],
      note: 'A record 178GW was mechanically installed in 2025, a 40% increase, of which 165GW was ' +
            'actually connected to a grid: the 13GW gap being machines standing finished and ' +
            'waiting. For the first time the five largest suppliers on earth were all Chinese, together ' +
            'about 59% of the world market. Read this table beside the one next to it before drawing ' +
            'any conclusion, because it is very largely a statement about where turbines were built ' +
            'rather than about who can win a contract: China was 67% of global installations, and ' +
            'Chinese suppliers held 99.96% of their own domestic market. ' +
            'One mechanical caveat on the percentages: GWEC publishes gigawatts, not shares, so these ' +
            'are each supplier\'s installed capacity over the 178GW total. For Vestas, Nordex, GE ' +
            'Vernova and Siemens Gamesa the figure used is their capacity installed outside mainland ' +
            'China, which is very close to their global total because none of them installs materially ' +
            'inside it, but it is a floor rather than an exact number.',
      sources: ['GWEC', 'IRENA']
    },
    {
      id: 'oem-exchina', name: 'Turbine makers, outside mainland China', short: 'OEM, ex-China', kind: 'meta',
      blurb: 'The same question asked of the roughly third of the market that is contestable. A different answer.',
      market: { size: '~59GW installed', year: 2025, basis: 'capacity installed during 2025 outside mainland China, gigawatts: the denominator is derived from GWEC’s stated 67% China share, not published directly' },
      asOf: '2025', confidence: 'medium', chokepoint: true,
      shares: [
        { c: 'Vestas', p: 22 }, { c: 'Nordex', p: 13.1 }, { c: 'GE Vernova', p: 9.9 },
        { c: 'Siemens Gamesa', p: 9.2 }, { c: 'Envision', p: 7.2 }
      ],
      note: 'The GWEC gigawatt figures here are published; the shares are not. They are computed ' +
            'against an ex-China total of roughly 59GW, itself derived from GWEC stating that China ' +
            'was 67% of 2025 installations, so treat the ranking as firm and the percentages as ' +
            'approximate. ' +
            'The pair of tables is the point, exactly as unit-versus-revenue is on the tractor teardown ' +
            'and badge-versus-factory is on the microwave. Globally the top five are Chinese and Vestas ' +
            'is sixth. Outside mainland China, Vestas leads at roughly a fifth, Nordex is second, and ' +
            'Envision is the only Chinese manufacturer with a material export position. Narrow it ' +
            'further and it tightens again: in the United States, GE Vernova and Vestas hold 93% ' +
            'between them, and in Europe, European suppliers hold 94.5%. Vestas also passed 200GW ' +
            'cumulative in 2025, still the largest installed base of any manufacturer. So there are ' +
            'three defensible answers to “who leads wind” depending on the boundary drawn, and ' +
            'any of them quoted alone is misleading.',
      sources: ['GWEC', 'Company filings'],
      deals: [
        { y: 2017, a: 'Siemens Wind Power', t: 'Gamesa', v: 'merger, ~EUR 10bn combined', n: 'Created Siemens Gamesa by merging the German and Spanish businesses. The combination has underperformed both parents ever since.' },
        { y: 2020, a: 'Siemens', t: 'Siemens Energy spin-off', v: 'demerger', n: 'Listed the energy business, including the wind unit, as a separate company.' },
        { y: 2023, a: 'Siemens Energy', t: 'Siemens Gamesa minorities', v: 'EUR ~4bn', n: 'Bought out the remaining shareholders and delisted, after blade and main bearing quality failures triggered large provisions.' },
        { y: 2024, a: 'General Electric', t: 'GE Vernova spin-off', v: 'demerger', n: 'Separated the energy business, including wind, into its own listed company: the end of the conglomerate that bought LM Wind Power.' }
      ]
    },
    {
      id: 'installation-wt', name: 'Installation and cranes', short: 'Installation', kind: 'meta',
      blurb: 'The machine is useless on the ground, and the equipment that can lift it is genuinely scarce.',
      market: { size: 'not sized as a market', year: 2026, basis: 'specialist lifting equipment availability: a capacity constraint, not a traded market' },
      asOf: '2026', confidence: 'medium', chokepoint: true,
      upstream: ['tower', 'blades'],
      note: 'The sideways constraint on this teardown, in the same position as cable ships on the ' +
            'submarine cable page and wiring harness labour on the car. Setting a nacelle on a 150-metre ' +
            'tower needs a crawler crane in the very largest class, of which a limited number exist in ' +
            'any country, each requiring dozens of truckloads to move and a prepared pad to stand on. ' +
            'Crane availability, not turbine supply, is routinely what sets an installation schedule, ' +
            'and it gets harder rather than easier as hub heights rise. This is the layer the OEM ' +
            'ranking above completely hides: a manufacturer can build the machines and still not be ' +
            'able to erect them.',
      sources: ['Company statements', 'WindEurope']
    },
    {
      id: 'decommission-wt', name: 'End of life', short: 'End of life', kind: 'meta',
      blurb: 'Everything here is recyclable except the part that defines the machine.',
      market: { size: 'not sized', year: 2026, basis: 'emerging service market with no established supplier structure' },
      asOf: '2026', confidence: 'low',
      upstream: ['blades', 'blade-resin'],
      note: 'The steel tower, the copper, the castings and the magnets all have established recycling ' +
            'routes with real value. The blade does not, and the reason is chemistry rather than ' +
            'effort: it is a thermoset composite, so the epoxy cannot be melted and reformed the way a ' +
            'thermoplastic can. Blades have historically been cut up and landfilled or burned in cement ' +
            'kilns. The industry response is visible one tier down in the resin row, where recyclable ' +
            'and chemically cleavable epoxy systems are being commercialised: the same pattern as ' +
            'the balsa substitution, an engineered answer to a material constraint, but a decade behind ' +
            'it and not yet proven at scale.',
      sources: ['CompositesWorld', 'WindEurope']
    },

    /* ==================== BLADE SUBTREE (tier 2) ==================== */
    {
      id: 'blade-shell', parent: 'blades', name: 'Shell and shear webs', short: 'Shell',
      shape: { x: 150, y: 120, w: 220, h: 180 },
      blurb: 'The aerodynamic skin: a sandwich of glass laminate either side of a lightweight core.',
      layout: 'chain',
      market: { size: 'not sized separately', year: 2026, basis: 'manufactured in-house by blade makers; not separately traded' },
      asOf: '2026', confidence: 'medium', chokepoint: true,
      note: 'A blade shell is not solid composite: it is a sandwich, with thin stiff skins either ' +
            'side of a thick light core, which is how it achieves bending stiffness at a weight the hub ' +
            'can carry. That construction is why the core material one tier down matters far more than ' +
            'its cost share suggests: it occupies most of the blade’s volume while being a small ' +
            'fraction of its price, and its supply is the narrowest thing in the blade.',
      sources: ['CompositesWorld', 'NREL']
    },
    {
      id: 'blade-spar', parent: 'blades', name: 'Spar cap', short: 'Spar',
      shape: { x: 390, y: 120, w: 220, h: 180 },
      blurb: 'The structural spine running the length of the blade. Carries essentially all the bending load.',
      layout: 'chain',
      market: { size: 'not sized separately', year: 2026, basis: 'manufactured in-house; the fibre inputs below are traded, the assembly is not' },
      asOf: '2026', confidence: 'medium',
      note: 'The single most consequential design choice in a modern blade sits here. A glass spar cap ' +
            'is cheap and heavy; a carbon one is roughly twice as stiff for its weight and lets the ' +
            'blade grow longer without the mass penalty cascading into a bigger hub, a bigger bearing ' +
            'and a stronger tower. Vestas built much of its scale advantage on carbon spar caps and ' +
            'held a patent position on the pultruded process that expired in 2022, after which the ' +
            'technique spread quickly. Longer blades are the main route to cheaper wind energy, so this ' +
            'row is where the cost curve is actually being driven.',
      sources: ['CompositesWorld', 'Company statements']
    },
    {
      id: 'blade-resin', parent: 'blades', name: 'Epoxy and adhesives', short: 'Resin',
      shape: { x: 630, y: 120, w: 220, h: 180 },
      blurb: 'What turns loose fibre into a structure, and what glues the two blade halves together.',
      market: { size: 'USD ~4bn', year: 2026, basis: 'epoxy resin and structural adhesive supply to wind, estimated' },
      asOf: '2026', confidence: 'low',
      note: 'Named and not measured: epoxy is a commodity chemical sold into dozens of industries and ' +
            'no publisher separates wind-grade volumes credibly. Named suppliers: Olin and Westlake in ' +
            'base epoxy, Swancor, Hexion and Sika in formulated systems and adhesives. Two things make ' +
            'this row more interesting than a commodity input should be. The adhesive bond joining the ' +
            'two blade halves is a recurring structural failure mode and cannot be inspected easily ' +
            'once closed. And the thermoset chemistry chosen here is precisely what makes the blade ' +
            'unrecyclable twenty-five years later: Swancor’s cleavable systems and similar ' +
            'products are an attempt to design that liability out at the resin, which is the only place ' +
            'it can be designed out.',
      sources: ['CompositesWorld', 'Company filings']
    },
    {
      id: 'blade-coating', parent: 'blades', name: 'Leading edge protection', short: 'Coating',
      shape: { x: 150, y: 330, w: 220, h: 180 },
      blurb: 'A tape or coating on the blade’s leading edge, eroded by rain at 90 metres per second.',
      market: { size: 'not sized', year: 2026, basis: 'specialty coating supply; no published market series' },
      asOf: '2026', confidence: 'low',
      note: 'A genuinely surprising failure mode, and the reason this row exists. The blade tip on a ' +
            'machine this size travels at roughly 300 kilometres an hour, and at that speed ordinary ' +
            'rain erodes the leading edge like sandblasting. Erosion roughens the aerofoil, which costs ' +
            'measurable annual energy production long before it threatens anything structural, and ' +
            'repairing it means either a rope team or a crane. Named suppliers: 3M, PPG, Hempel, ' +
            'Bergolin and Polytech. It is a small consumable protecting the most expensive rotating ' +
            'component in the machine, and no tracker sizes it.',
      sources: ['CompositesWorld', 'Company statements']
    },

    /* ==================== BLADE SUBTREE (tier 3) ==================== */
    {
      id: 'blade-core', parent: 'blade-shell', name: 'Sandwich core', short: 'Core',
      shape: { x: 150, y: 120, w: 340, h: 200 },
      blurb: 'The light material filling the space between the blade’s inner and outer skins.',
      layout: 'chain',
      market: { size: 'USD ~1.4bn', year: 2026, basis: 'wind blade core material supply, balsa and structural foam combined' },
      asOf: '2026', confidence: 'medium', chokepoint: true,
      note: 'Structurally indispensable, commercially small, and for two years the tightest supply ' +
            'constraint in the entire wind industry. Named suppliers of engineered foam core: 3A ' +
            'Composites, which developed and patented PET foaming and sells AIREX; Diab, with ' +
            'Divinycell; Gurit; Armacell, whose ArmaFORM uses recycled bottles; and Evonik. Balsa is a ' +
            'different business entirely and sits one tier down. The two are now generally used ' +
            'together rather than as alternatives: a hybrid design putting balsa in the highly ' +
            'stressed root, where its compressive strength still beats foam, and PET everywhere else.',
      sources: ['CompositesWorld', 'Company statements']
    },
    {
      id: 'blade-carbon', parent: 'blade-spar', name: 'Carbon fibre', short: 'Carbon',
      shape: { x: 150, y: 120, w: 340, h: 200 },
      blurb: 'Large-tow carbon fibre, the cheap industrial grade, pultruded into spar cap planks.',
      layout: 'chain',
      market: { size: 'USD ~4bn', year: 2026, basis: 'large-tow industrial carbon fibre supply, all applications' },
      asOf: '2026', confidence: 'low',
      shares: [
        { c: 'Toray', p: 40 }, { c: 'Mitsubishi Chemical', p: 12 }, { c: 'Hexcel', p: 8 },
        { c: 'Teijin', p: 7 }, { c: 'SGL Carbon', p: 6 }, { c: 'Weihai Guangwei', p: 6 }
      ],
      note: 'Derived, and stated as a ranking rather than a measurement. Toray’s position ' +
            'includes Zoltek, which it acquired in 2014 specifically for large-tow industrial fibre and ' +
            'which supplies much of the wind market from plants in Hungary and Mexico, so the ' +
            'largest supplier of carbon fibre to European wind is a Japanese company manufacturing in ' +
            'central Europe. Wind uses the cheap grade: aerospace carbon fibre is a different and far ' +
            'more expensive product, and conflating the two is how carbon fibre market sizes end up ' +
            'disagreeing by a factor of three. Chinese producers, Weihai Guangwei and Zhongfu Shenying ' +
            'among them, have added large-tow capacity fast and are the reason the price has fallen.',
      sources: ['CompositesWorld', 'Company filings'],
      deals: [
        { y: 2014, a: 'Toray', t: 'Zoltek', v: 'USD ~584m', n: 'Bought the leading large-tow producer for industrial markets rather than aerospace, which made the largest aerospace fibre maker the largest wind fibre maker as well.' }
      ]
    },
    {
      id: 'blade-glass', parent: 'blade-spar', name: 'Glass fibre', short: 'Glass',
      shape: { x: 510, y: 120, w: 340, h: 200 },
      blurb: 'Still roughly seventy per cent of the reinforcement in a blade by weight, and far cheaper.',
      market: { size: 'USD ~18bn', year: 2025, basis: 'glass fibre reinforcement production, all applications' },
      asOf: '2026', confidence: 'low',
      shares: [
        { c: 'China Jushi', p: 22 }, { c: 'Owens Corning', p: 14 }, { c: 'Taishan Fiberglass', p: 12 },
        { c: 'CPIC', p: 8 }
      ],
      note: 'Composites are roughly 92% of blade material by weight, and glass is about seventy per ' +
            'cent of that, carbon gets the attention because it enables the long blades, but ' +
            'glass is still most of what a blade is made of. The shares here are for glass fibre across ' +
            'all applications, not wind specifically, and are derived from capacity disclosures rather ' +
            'than reported. Three of the four named are Chinese, and China Jushi is the largest ' +
            'producer in the world by capacity. Glass fibre is also extremely energy-intensive to make ' +
            ', molten batch drawn continuously through platinum bushings, which is why the ' +
            'industry has concentrated where energy is cheap and stayed there.',
      sources: ['CompositesWorld', 'Company filings']
    },

    /* ============ BLADE SUBTREE (tiers 4 and 5): the terminus ============ */
    {
      id: 'balsa', parent: 'blade-core', name: 'End-grain balsa', short: 'Balsa',
      shape: { x: 150, y: 120, w: 340, h: 200 },
      blurb: 'A fast-growing tropical hardwood, cut across the grain and glued into panels. Still the best material for the job.',
      layout: 'chain',
      market: { size: 'USD ~200m', year: 2025, basis: 'Ecuadorian balsa export value; the country is the overwhelming majority of world supply' },
      asOf: '2026', confidence: 'medium', chokepoint: true,
      note: 'It is genuinely strange that the most advanced rotating machine in the renewable energy ' +
            'industry contains structural wood, and it is there because nothing synthetic quite beats ' +
            'it on the specific measure that matters. End-grain balsa, sawn across the grain so ' +
            'the fibres run through the panel thickness, has exceptional compressive strength for ' +
            'its density and, unlike foam, does not creep under sustained load. That is why it survived ' +
            'the substitution at the blade root even after PET foam took the rest of the shell. What it ' +
            'cannot do is respond to a demand signal, for reasons one tier down.',
      sources: ['CompositesWorld', 'Argus Media']
    },
    {
      id: 'pet-foam', parent: 'blade-core', name: 'PET structural foam', short: 'PET foam',
      shape: { x: 510, y: 120, w: 340, h: 200 },
      blurb: 'The engineered substitute, much of it made from recycled bottles. The reason the balsa crisis ended.',
      market: { size: 'not sized separately', year: 2026, basis: 'reported within the core materials market; no independent series' },
      asOf: '2026', confidence: 'medium',
      upstream: ['balsa'],
      note: 'The most important node on this teardown, because it is the one that shows a chokepoint ' +
            'being deliberately dismantled. When balsa supply and price broke in 2019 and 2020, the ' +
            'industry accelerated a substitution that had been available but not urgent: foamed ' +
            'polyethylene terephthalate, produced continuously in a factory to a specified density, ' +
            'immune to moisture uptake, and available from several suppliers on three continents. ' +
            'Industry forecasts at the time put PET at around 20% of core in 2018 rising above 55% by ' +
            '2023, and the direction has held. A material that could not be made faster was replaced ' +
            'by one that can, and, read against every other terminus in this catalogue, that ' +
            'is a rare thing. Nobody can substitute their way out of the Bushveld Complex.',
      sources: ['CompositesWorld', 'Company statements']
    },
    {
      id: 'balsa-ecuador', parent: 'balsa', name: 'Ecuadorian balsa supply', short: 'Ecuador',
      shape: { x: 150, y: 120, w: 340, h: 200 },
      blurb: 'The bottom of this teardown. One country, one crop, and a lead time measured in years.',
      market: { size: 'USD ~570m at peak, ~196m the following year', year: 2025, basis: 'balsa export value by country of origin; roughly three quarters of the peak went into wind blades' },
      asOf: '2026', confidence: 'medium', chokepoint: true,
      shares: [
        { c: 'Ecuador (all producers)', p: 95 }
      ],
      note: 'Ecuador supplies roughly 95% of the world’s commercial balsa, grown mostly on ' +
            'smallholdings along the coastal river basins, and since 2018 China has bought about 95% of ' +
            'what Ecuador exports: a single origin feeding a single destination. The 2019-21 ' +
            'episode is the clearest boom-and-bust in this catalogue. Wind demand pushed the price to ' +
            'roughly double its mid-2019 level; exports hit a record USD 570m in 2020, around three ' +
            'quarters of it destined for blades; then demand fell away and the value collapsed 66% to ' +
            'about USD 196m in 2021. In between, the shortfall was met by logging that investigators ' +
            'traced to protected Amazon territory in Ecuador and across the border in Peru, cut by ' +
            'informal crews well outside the plantation system. The structural point is a lead time: a ' +
            'balsa tree needs four to six years before it can be harvested, and no price signal ' +
            'shortens that. An industry that revises its build plan every quarter was resting a ' +
            'safety-critical structural material on an agricultural cycle it could not accelerate, and ' +
            'the correct response, the one it actually took, was to stop depending on it.',
      sources: ['Argus Media', 'Environmental Investigation Agency', 'CompositesWorld']
    },
    {
      id: 'carbon-precursor', parent: 'blade-carbon', name: 'PAN precursor', short: 'Precursor',
      shape: { x: 150, y: 120, w: 340, h: 200 },
      blurb: 'The acrylic fibre that carbon fibre is made from. The genuinely hard part, and the real barrier to entry.',
      market: { size: 'not sold as a market', year: 2026, basis: 'almost entirely captive: the major producers make their own and do not sell it' },
      asOf: '2026', confidence: 'medium', chokepoint: true,
      note: 'Carbon fibre is made by taking a polyacrylonitrile fibre and cooking the non-carbon atoms ' +
            'out of it, and the difficulty of the process sits almost entirely in the precursor rather ' +
            'than the furnace. Precursor formulation and spinning determine the strength of the ' +
            'finished fibre, it is where the accumulated process knowledge lives, and the major ' +
            'producers make their own and do not sell it, which means the barrier to entering ' +
            'carbon fibre is not capital for a carbonisation line but a decade of chemistry nobody will ' +
            'license. It is the closest thing in this teardown to the photoresist and mask layers on ' +
            'the semiconductor teardowns: a low-revenue upstream step that quietly gates the ' +
            'high-revenue one above it. Upstream of it is acrylonitrile, an ordinary petrochemical with ' +
            'no wind-specific concentration, which is where this chain stops being interesting.',
      sources: ['CompositesWorld', 'Company statements']
    },

    /* ==================== TOWER SUBTREE ==================== */
    {
      id: 'tower-steel', parent: 'tower', name: 'Heavy plate steel', short: 'Plate steel',
      shape: { x: 150, y: 120, w: 220, h: 180 },
      blurb: 'Rolled steel plate, 20 to 60mm thick, cut and bent into cans and welded into sections.',
      layout: 'chain',
      market: { size: 'not sized for wind', year: 2026, basis: 'commodity plate steel; wind is a small share of a very large market' },
      asOf: '2026', confidence: 'medium',
      note: 'Named and not measured, and unusually this is a layer where concentration genuinely is not ' +
            'the story. Heavy plate is a commodity made by dozens of mills on every continent, wind ' +
            'takes a small share of it, and a tower fabricator buys locally because freight dominates. ' +
            'What does bite is price and trade policy rather than availability: plate is a large ' +
            'fraction of tower cost, tower is 26% of the machine, and so the capital cost of wind ' +
            'energy tracks a steel price nobody in the industry influences. Anti-dumping duties on ' +
            'imported towers in the United States and the European Union have repeatedly reshaped who ' +
            'supplies which market, which is why the fabricators one row up are regional.',
      sources: ['World Steel Association', 'IRENA']
    },
    {
      id: 'tower-flange', parent: 'tower', name: 'Tower flanges', short: 'Flanges',
      shape: { x: 390, y: 120, w: 220, h: 180 },
      blurb: 'Forged steel rings, up to six metres across, that bolt one tower section to the next.',
      layout: 'chain',
      market: { size: 'not sized separately', year: 2026, basis: 'large ring forging supply; no published market series for wind flanges' },
      asOf: '2026', confidence: 'low', chokepoint: true,
      note: 'A tower is a stack of sections joined at bolted flanges, and each flange is a single forged ' +
            'and rolled steel ring several metres in diameter that must stay flat to a fine tolerance ' +
            'under load. Flatness is the whole problem: a flange out of tolerance concentrates stress ' +
            'into the bolts, and flange and bolt fatigue is a documented cause of tower failures. Very ' +
            'few forging plants can make rings this large to this specification, which is why an ' +
            'apparently trivial steel component sits one tier above a genuine capacity constraint.',
      sources: ['Company statements', 'NREL']
    },
    {
      id: 'tower-coating', parent: 'tower', name: 'Coating and corrosion protection', short: 'Coating',
      shape: { x: 630, y: 120, w: 220, h: 180 },
      blurb: 'Paint systems and galvanising that have to keep steel intact outdoors for twenty-five years.',
      market: { size: 'not sized', year: 2026, basis: 'protective coatings supplied to project specification' },
      asOf: '2026', confidence: 'low',
      note: 'Named and not measured. A commodity in cost and not in consequence: the entire economic ' +
            'case for a wind farm assumes the structure survives twenty-five years in weather, and ' +
            'corrosion protection is what delivers that. Offshore machines carry a far heavier ' +
            'specification for the splash zone. Named suppliers: AkzoNobel, Hempel, Jotun, PPG and ' +
            'Sherwin-Williams: the same firms that coat ships and bridges, for the same reasons.',
      sources: ['Company statements', 'WindEurope']
    },
    {
      id: 'large-forging', parent: 'tower-flange', name: 'Large ring forging', short: 'Forging',
      shape: { x: 150, y: 150, w: 340, h: 200 },
      blurb: 'The presses and ring mills big enough to make a six-metre steel ring. There are not many.',
      market: { size: 'not sized', year: 2026, basis: 'heavy forging capacity: a physical constraint, not a traded market' },
      asOf: '2026', confidence: 'medium', chokepoint: true,
      note: 'A real capacity constraint of the kind this site keeps finding underneath unglamorous ' +
            'components. Rings of this size need a heavy forging press and a radial-axial ring rolling ' +
            'mill, both of which are enormous, capital-intensive, decades-old assets that are not built ' +
            'speculatively. The same plants serve wind flanges, slewing bearing races, and the pressure ' +
            'vessel and nuclear industries, so wind competes for the capacity rather than commanding ' +
            'it. When several of those end markets expand at once, as they have, the queue ' +
            'lengthens for everyone and no amount of turbine order book shortens it.',
      sources: ['NREL', 'Company statements']
    },

    /* ==================== GEARBOX SUBTREE ==================== */
    {
      id: 'gear-forging', parent: 'gearbox', name: 'Gear forgings and hardening', short: 'Gear blanks',
      shape: { x: 150, y: 150, w: 340, h: 200 },
      blurb: 'Forged blanks, case-carburised and ground. Where gearbox reliability is actually decided.',
      market: { size: 'not sized separately', year: 2026, basis: 'captive and contract forging supplied to gearbox makers' },
      asOf: '2026', confidence: 'low',
      upstream: ['large-forging'],
      note: 'Named and not measured. The reason it earns a row is the history: the wind industry’s ' +
            'gearbox reliability problem in the 2000s was substantially a materials and process ' +
            'problem rather than a design one, micropitting and white-etching cracks originating ' +
            'in the hardened surface layer, traced back to steel cleanliness and heat treatment. The ' +
            'fix was upstream in forging and carburising specification, not in the gear geometry. It is ' +
            'a good illustration of why this teardown descends past the component: the failure was two ' +
            'tiers below where it appeared.',
      sources: ['NREL', 'Company statements']
    },
    {
      id: 'gear-bearing', parent: 'gearbox', name: 'Gearbox bearings', short: 'Gear bearings',
      shape: { x: 510, y: 150, w: 340, h: 200 },
      blurb: 'Twenty or more bearings inside the gearbox, and historically the most common thing to fail in it.',
      market: { size: 'not sized separately', year: 2026, basis: 'supplied within the gearbox; no independent market series' },
      asOf: '2026', confidence: 'low',
      upstream: ['bearing-steel'],
      note: 'Named and not measured, and it shares its suppliers with the main bearing row: SKF, ' +
            'Schaeffler, Timken, NSK and NTN. The reliability story is specific and instructive: the ' +
            'high-speed shaft bearings suffer white-etching cracks, a failure mode that appears well ' +
            'before the calculated fatigue life and was not predicted by conventional bearing life ' +
            'models at all. It took the industry roughly a decade to characterise, and it is the single ' +
            'clearest reason the direct-drive architecture, which deletes the gearbox and every bearing ' +
            'in it, gained ground.',
      sources: ['NREL', 'Company statements']
    },

    /* ========= MAIN BEARING AND SHAFT (top-level) + steel ========= */
    {
      id: 'main-bearing', name: 'Main bearing', short: 'Main bearing',
      shape: { x: 530, y: 250, w: 190, h: 130 },
      blurb: 'One or two very large bearings carrying the entire rotor. Nine to eighteen months lead time.',
      bomPct: 3, layout: 'chain',
      market: { size: 'USD ~3.4bn', year: 2026, basis: 'wind turbine main bearing supply' },
      asOf: '2026', confidence: 'low', chokepoint: true,
      shares: [
        { c: 'Schaeffler', p: 18 }, { c: 'SKF', p: 17 }, { c: 'NTN', p: 11 }
      ],
      note: 'Three per cent of the bill of materials doing structurally the most demanding job in the ' +
            'machine, it carries the full weight and thrust of a rotor a hundred and fifty metres ' +
            'across, inside a nacelle that must not be opened for two decades, at the top of a tower ' +
            'that needs one of the largest cranes in the country to reach. Replacing one is a ' +
            'seven-figure operation before the lost generation is counted. ' +
            'What is published is that the top three hold more than 46% between them; the split shown ' +
            'here is derived from that and from relative wind exposure, and should be read as ' +
            'indicative. The more important number is not a share at all. Very few facilities anywhere ' +
            'can produce a five-metre slewing ring to wind-grade specification: SKF, Schaeffler, ' +
            'NSK, NTN, Liebherr and a small number of Chinese specialists including ZWZ and LYC hold ' +
            'most of it, and custom wind-grade rings run to nine to eighteen months of lead time. ' +
            'All three of the largest are investing in capacity and none of them expects the constraint ' +
            'to clear soon. A bearing is a small line in the bill of materials that can set the ' +
            'delivery date of the whole machine.',
      sources: ['NREL', 'Company filings']
    },
    {
      id: 'main-shaft', name: 'Main shaft', short: 'Main shaft',
      shape: { x: 320, y: 250, w: 190, h: 130 },
      blurb: 'A single forged steel shaft, ten to twenty tonnes, connecting the hub to the gearbox.',
      bomPct: 3,
      market: { size: 'not sized separately', year: 2026, basis: 'heavy forging supplied to OEM specification' },
      asOf: '2026', confidence: 'low',
      upstream: ['large-forging'],
      note: 'Named and not measured, and supplied by the same heavy forging base as the tower flanges ' +
            'and bearing races, which is the point of placing it here. Three different subsystems ' +
            'of this machine, in three different parts of the bill of materials, ultimately depend on ' +
            'the same small population of forging plants. A teardown that stopped at the component ' +
            'level would show them as independent suppliers with independent risk. They are not.',
      sources: ['NREL', 'Company statements']
    },
    {
      id: 'bearing-steel', parent: 'main-bearing', name: 'Clean bearing steel', short: 'Bearing steel',
      shape: { x: 150, y: 150, w: 340, h: 200 },
      blurb: 'Vacuum-degassed steel with the inclusions taken out. The difference between twenty-five years and five.',
      market: { size: 'not sized separately', year: 2026, basis: 'specialty steel grades; not reported separately from special bar quality steel' },
      asOf: '2026', confidence: 'medium',
      note: 'The bottom of the drivetrain chain, and a good example of a material property being the ' +
            'real specification. A rolling bearing fails when a crack initiates at a non-metallic ' +
            'inclusion under the raceway, so bearing life is governed less by the alloy than by how ' +
            'clean the steel is: how few oxide and sulphide inclusions survive the melt. That is ' +
            'achieved by vacuum degassing and tightly controlled secondary metallurgy, and the number ' +
            'of mills producing it to bearing quality at this size is small. Named producers: Ovako, ' +
            'Sanyo Special Steel, Daido Steel, Nippon Steel and Chinese specialty mills. Nobody ' +
            'publishes a share, and the grade is not separated in steel statistics.',
      sources: ['World Steel Association', 'Company statements']
    },

    /* ==================== GENERATOR SUBTREE ==================== */
    {
      id: 'magnets', parent: 'generator', name: 'Permanent magnets', short: 'Magnets',
      shape: { x: 150, y: 150, w: 340, h: 200 },
      blurb: 'About 200kg of neodymium magnet per megawatt on a direct-drive machine. None of it optional.',
      layout: 'chain',
      market: { size: 'USD ~29bn', year: 2025, basis: 'NdFeB permanent magnet market, all applications' },
      asOf: '2026', confidence: 'medium', chokepoint: true,
      note: 'The dependency the industry acquired by solving a different problem. Moving to direct ' +
            'drive removed the gearbox, which was the least reliable part of the machine, and in ' +
            'exchange required a permanent-magnet generator holding roughly two hundred kilogrammes of ' +
            'sintered NdFeB per megawatt, so a 6MW machine carries well over a tonne of it. There ' +
            'is no substitute at this power density; the alternative is going back to a wound-rotor ' +
            'machine and a gearbox. Dysprosium and terbium are added to hold coercivity at operating ' +
            'temperature, and both are heavy rare earths with even tighter supply than neodymium. ' +
            'Magnets are also a small fraction of turbine cost and an absolute constraint on building ' +
            'one, which is the combination this site treats as the definition of a chokepoint.',
      sources: ['Adamas Intelligence', 'IEA']
    },
    {
      id: 'gen-copper', parent: 'generator', name: 'Windings and laminations', short: 'Windings',
      shape: { x: 510, y: 150, w: 340, h: 200 },
      blurb: 'Several tonnes of copper wire and a stack of electrical steel laminations.',
      market: { size: 'not sized for wind', year: 2026, basis: 'commodity copper and electrical steel; wind is a small share of both' },
      asOf: '2026', confidence: 'low',
      upstream: ['copper-wt'],
      note: 'Named and not measured. Worth a row for one reason: electrical steel, thin, ' +
            'grain-oriented or non-oriented laminations that carry the magnetic flux with minimal loss ' +
            ', is a genuinely constrained material that this site meets again in the EV and grid ' +
            'chapters, and wind competes for it against transformer and motor demand that is growing ' +
            'faster than the supply of mills able to roll it. Copper is a commodity with a well-known ' +
            'concentration in refining, covered in more depth on the EV teardown, and not re-walked ' +
            'here.',
      sources: ['World Steel Association', 'IRENA']
    },
    {
      id: 'ndfeb-sinter', parent: 'magnets', name: 'Sintered magnet manufacturing', short: 'Sintering',
      shape: { x: 150, y: 150, w: 340, h: 200 },
      blurb: 'Pressing and sintering rare earth powder into finished magnet blocks. Almost entirely one country.',
      layout: 'chain',
      market: { size: 'USD ~20bn', year: 2025, basis: 'sintered NdFeB magnet production, by producing country and firm' },
      asOf: '2026', confidence: 'high', chokepoint: true,
      shares: [
        { c: 'China (all firms combined)', p: 92 }, { c: 'Proterial', p: 3 },
        { c: 'Vacuumschmelze', p: 1 }, { c: 'Daido Steel', p: 1 }, { c: 'Shin-Etsu', p: 1 }
      ],
      note: 'A manufacturing concentration rather than a geological one, which is what separates this ' +
            'from the mining stories elsewhere on the site: sintering NdFeB is a process anyone could ' +
            'in principle build, and almost nobody outside China has. The largest producers by capacity ' +
            'are Chinese and listed: JL MAG, Zhong Ke San Huan at around 10.6% and Ningbo ' +
            'Yunsheng at around 8.2% of the market by capacity, with Proterial, formerly Hitachi ' +
            'Metals and the historic holder of the core patents, Shin-Etsu, TDK and Daido Steel in ' +
            'Japan and Vacuumschmelze in Germany making up most of the remainder. Chinese export ' +
            'controls introduced in April 2025 put seven rare earth categories and certain magnets ' +
            'under licence; a broader October 2025 measure was suspended for a year in November 2025, ' +
            'but the April licensing regime remains in force. That is the live commercial risk in this ' +
            'row, and it is a policy risk rather than a supply one.',
      sources: ['Adamas Intelligence', 'CSIS']
    },
    {
      id: 're-refine', parent: 'ndfeb-sinter', name: 'Rare earth refining', short: 'RE refining',
      shape: { x: 150, y: 150, w: 340, h: 200 },
      blurb: 'Turning mixed rare earth concentrate into the separated neodymium and dysprosium oxides a magnet needs.',
      market: { size: 'not sized as a distinct market', year: 2025, basis: 'share of world rare earth processing and separation capacity' },
      asOf: '2026', confidence: 'high', chokepoint: true,
      shares: [
        { c: 'China (all firms combined)', p: 90 }, { c: 'Lynas', p: 5 },
        { c: 'Neo Performance Materials', p: 2 }, { c: 'MP Materials', p: 2 }
      ],
      note: 'Around ninety per cent of world rare earth processing capacity is Chinese, and the ' +
            'bottleneck is chemistry rather than geology, rare earths are not rare in the ground ' +
            'and are mined in several countries, but separating the individual elements from each other ' +
            'takes hundreds of solvent extraction stages, and that capacity is where the concentration ' +
            'lives. This teardown deliberately stops here rather than descending further, because the ' +
            'submarine cable teardown on this site already walks the separation chain to the bottom for ' +
            'erbium. The convergence is the finding worth stating: a hundred-metre steel machine in a ' +
            'field and a fibre optic cable on the seabed are unrelated in every respect except that ' +
            'both terminate in the same set of Chinese separation plants, reached by completely ' +
            'different routes. Capacity is being built outside China: Lynas in Malaysia and ' +
            'Australia, MP Materials in the United States, Neo Performance Materials in Estonia, ' +
            'and forecasts still put China at 85 to 90% of magnet-grade output through the late 2020s.',
      sources: ['IEA', 'CSIS', 'Adamas Intelligence']
    },

    /* ========== POWER CONVERSION (top-level) + switchgear ========== */
    {
      id: 'converter', name: 'Power converter', short: 'Converter',
      shape: { x: 110, y: 418, w: 190, h: 130 },
      blurb: 'Rectifies the generator’s variable-frequency output and inverts it back at grid frequency.',
      bomPct: 5, layout: 'board',
      market: { size: 'USD ~9bn', year: 2025, basis: 'wind power converter revenue: a figure with a very wide published spread, see note' },
      asOf: '2026', confidence: 'low',
      shares: [
        { c: 'ABB', p: 22 }, { c: 'Siemens', p: 19 }
      ],
      note: 'Graded low deliberately, and the reason is the clearest example on this teardown of why ' +
            'source discipline matters. Published market sizes for wind power conversion in 2025 range ' +
            'from about USD 8.7bn to about USD 50bn depending on the aggregator: a spread of ' +
            'nearly six times, for the same year and the same nominal category. That is not a ' +
            'disagreement about the market, it is a disagreement about what is being counted, and none ' +
            'of the publishers says which. The lower figure is used here because it is consistent with ' +
            'the converter being roughly 5% of turbine capital cost against 178GW installed. ' +
            'The shares are the two cleanest individual figures found, from a single aggregator source ' +
            'not corroborated against a second tracker, treat them as a ranking. Also named with ' +
            'no share published: Ingeteam, Danfoss, Sungrow, The Switch, AMSC, Woodward, Delta ' +
            'Electronics and GE Vernova’s in-house unit. The converter is what makes a modern ' +
            'turbine grid-compatible at all: it decouples rotor speed from grid frequency, which is why ' +
            'the rotor can turn at whatever speed extracts the most energy rather than at whatever ' +
            'speed the grid dictates. It is also the component that provides fault ride-through, and ' +
            'therefore the one that grid codes actually regulate.',
      sources: ['Company filings', 'IRENA']
    },
    {
      id: 'transformer-wt', name: 'Step-up transformer', short: 'Transformer',
      shape: { x: 320, y: 418, w: 190, h: 130 },
      blurb: 'Raises the turbine’s output to the collection network voltage, usually 33 kilovolts.',
      bomPct: 4,
      market: { size: 'not sized for wind', year: 2026, basis: 'distribution transformer supply; wind is a small share of a constrained global market' },
      asOf: '2026', confidence: 'medium', chokepoint: true,
      upstream: ['gen-copper'],
      note: 'Named and not measured, and included because it is one of the tightest real constraints on ' +
            'building anything electrical anywhere right now. Transformer lead times have extended ' +
            'dramatically across the whole industry, driven by grid replacement, electrification and ' +
            'data centre demand all arriving together against a manufacturing base that did not expand ' +
            'for two decades, and by shortages of grain-oriented electrical steel and skilled ' +
            'winders. Wind is a price taker in that queue, competing against utilities and hyperscalers ' +
            'with deeper pockets. This is the one place where this teardown and the AI server rack ' +
            'teardown are bidding for the same physical object.',
      sources: ['Wood Mackenzie', 'IRENA']
    },
    {
      id: 'switchgear', parent: 'converter', name: 'Switchgear and protection', short: 'Switchgear',
      shape: { x: 150, y: 150, w: 340, h: 200 },
      blurb: 'The medium-voltage breakers and protection that disconnect the machine when something goes wrong.',
      market: { size: 'not sized for wind', year: 2026, basis: 'medium-voltage switchgear supplied to project specification' },
      asOf: '2026', confidence: 'low',
      note: 'Named and not measured. The suppliers are the usual electrical majors: ABB, ' +
            'Schneider Electric, Siemens Energy, Eaton and Hitachi Energy, and wind is a modest ' +
            'part of their volume. The row exists because it shares the transformer’s problem: ' +
            'medium-voltage electrical equipment of every kind is currently supply-constrained for the ' +
            'same reasons, and a wind project can be complete in every other respect and still wait on ' +
            'a switchgear delivery.',
      sources: ['Wood Mackenzie', 'Company statements']
    },

    /* ==================== HUB, YAW, CONTROL, CABLE ==================== */
    {
      id: 'hub-casting', parent: 'hub-pitch', name: 'Hub casting', short: 'Hub casting',
      shape: { x: 150, y: 150, w: 340, h: 200 },
      blurb: 'A single ductile iron casting of fifteen to thirty tonnes, with three blades bolted to it.',
      layout: 'chain',
      market: { size: 'USD ~3.3bn', year: 2025, basis: 'wind turbine casting market revenue, hub and structural castings' },
      asOf: '2026', confidence: 'low', chokepoint: true,
      note: 'Named and not measured. Casting a defect-free ductile iron part of this size is genuinely ' +
            'difficult: the section thicknesses vary enormously, so the metal cools at different ' +
            'rates through the part, and a casting flaw in a component carrying the entire rotor is not ' +
            'repairable. Tariff measures introduced through 2025 raised landed costs for imported hubs ' +
            'and flanges and pushed volume toward domestic foundries in several markets, where ' +
            'capacity constraints and long setup times limited how much of it could actually be ' +
            'absorbed. That is a good illustration of a general point: trade policy can move demand ' +
            'between foundries far faster than foundries can be built.',
      sources: ['NREL', 'CompositesWorld']
    },
    {
      id: 'pitch-drive', parent: 'hub-pitch', name: 'Pitch drives and bearings', short: 'Pitch drive',
      shape: { x: 510, y: 150, w: 340, h: 200 },
      blurb: 'Three geared drives and three slewing bearings that rotate each blade about its own axis.',
      market: { size: 'not sized separately', year: 2026, basis: 'supplied within the rotor assembly; no independent market series' },
      asOf: '2026', confidence: 'low',
      upstream: ['large-forging'],
      note: 'Named and not measured, and safety-critical in a way its cost does not suggest. Pitch is ' +
            'how the machine is stopped, so each of the three drives carries its own backup power ' +
            ', historically a battery or a hydraulic accumulator, sufficient to feather that ' +
            'blade even with the turbine dead and the grid gone. A pitch system that cannot feather in ' +
            'a storm is how turbines are destroyed. The pitch bearings are slewing rings from the same ' +
            'constrained supplier base as the main and yaw bearings, which is the third time that ' +
            'population of plants appears in this teardown.',
      sources: ['NREL', 'Company statements']
    },
    {
      id: 'foundry-wt', parent: 'hub-casting', name: 'Heavy foundry capacity', short: 'Foundry',
      shape: { x: 150, y: 150, w: 340, h: 200 },
      blurb: 'The furnaces and moulding lines able to pour a twenty-tonne casting to wind specification.',
      market: { size: 'not sized', year: 2026, basis: 'heavy casting capacity: a physical constraint, not a traded market' },
      asOf: '2026', confidence: 'medium', chokepoint: true,
      note: 'The casting equivalent of the large forging row, and it behaves the same way. Foundries at ' +
            'this scale are energy-intensive, capital-heavy, environmentally permitted assets with long ' +
            'build times, and they were not expanded during the years when wind demand was flat. ' +
            'Studies of the sector put annual material demand for large wind castings on a path from ' +
            'roughly 30 million kilogrammes a year in the late 2020s toward nearly double that by ' +
            'mid-century. The constraint is not iron, which is abundant; it is permitted furnace hours ' +
            'and the skilled people who run them, neither of which responds quickly to an order book.',
      sources: ['NREL', 'Company statements']
    },
    {
      id: 'nacelle-cover', parent: 'yaw-nacelle', name: 'Nacelle housing', short: 'Nacelle cover',
      shape: { x: 150, y: 150, w: 340, h: 200 },
      blurb: 'The glass-reinforced shell around the drivetrain. Weather protection, and a working platform.',
      market: { size: 'not tracked', year: 2026, basis: 'fabricated to OEM specification; no independent market' },
      asOf: '2026', confidence: 'low',
      note: 'Named and not measured, and genuinely a commodity, but it decides the maintenance ' +
            'economics of everything inside it. The cover has to be a working environment a hundred and ' +
            'fifty metres up: it carries the crane rail and hatch through which components are lifted, ' +
            'and whether a gearbox or generator can be changed without bringing in a main crane depends ' +
            'on how it was laid out. That single design decision is worth more over twenty-five years ' +
            'than the cost of the housing many times over.',
      sources: ['Company statements', 'NREL']
    },
    {
      id: 'scada', parent: 'control', name: 'SCADA and turbine controller', short: 'SCADA',
      shape: { x: 150, y: 150, w: 340, h: 200 },
      blurb: 'The controller in each machine and the system watching the whole farm from somewhere else.',
      market: { size: 'not sized separately', year: 2026, basis: 'supplied with the turbine and bundled into service agreements' },
      asOf: '2026', confidence: 'low', chokepoint: true,
      note: 'Named and not measured, and commercially the most contested layer in the machine. The ' +
            'controller is the OEM’s: it holds the proprietary control strategy and generates the ' +
            'operating data, and access to both is what a long-term service agreement is really ' +
            'selling. Independent service providers can maintain the hardware perfectly well and are ' +
            'structurally disadvantaged on the data, which is the same aftermarket architecture the ' +
            'tractor teardown documents in agricultural equipment and for the same reason. It is also ' +
            'now a security-regulated layer: wind farms are critical infrastructure, remotely ' +
            'controllable, and increasingly in scope of network and information security rules.',
      sources: ['Company statements', 'WindEurope']
    },
    {
      id: 'sensors-wt', parent: 'control', name: 'Sensors and condition monitoring', short: 'Sensors',
      shape: { x: 510, y: 150, w: 340, h: 200 },
      blurb: 'Anemometry, vibration, temperature and strain: how the machine knows what it is doing.',
      market: { size: 'not sized separately', year: 2026, basis: 'components supplied within the turbine; no independent series' },
      asOf: '2026', confidence: 'low',
      note: 'Named and not measured. The economically interesting part is condition monitoring: ' +
            'accelerometers on the drivetrain that detect a bearing or gear defect months before ' +
            'failure, turning an unplanned replacement requiring an emergency crane into a scheduled ' +
            'one. Given what the main bearing row above says about lead times, months of warning is the ' +
            'difference between ordering a part and waiting a year for one. A few hundred dollars of ' +
            'sensor protects a seven-figure intervention, which is why this is one of the few layers ' +
            'where the industry has willingly added cost.',
      sources: ['NREL', 'Company statements']
    },
    {
      id: 'copper-wt', parent: 'cabling', name: 'Copper', short: 'Copper',
      shape: { x: 150, y: 150, w: 340, h: 200 },
      blurb: 'Several tonnes of it per machine, between the cable, the windings and the earthing system.',
      market: { size: 'not sized for wind', year: 2026, basis: 'refined copper; wind is a small share of a very large commodity market' },
      asOf: '2026', confidence: 'medium',
      note: 'Named and not measured here deliberately: refined copper concentration is walked properly ' +
            'on the electric vehicle teardown and re-walking it would add nothing. What belongs on this ' +
            'page is the exposure. A wind turbine is copper-intensive per megawatt compared with ' +
            'conventional generation, offshore machines substantially more so because of the export ' +
            'cable, and the same electrification wave driving wind demand is driving copper demand ' +
            ', so the input price rises with the industry’s own success. That is a different ' +
            'kind of supply risk from a chokepoint: not a supplier who can refuse, but a price that ' +
            'moves against you precisely when you are growing.',
      sources: ['IEA', 'IRENA']
    }
  ]
});
