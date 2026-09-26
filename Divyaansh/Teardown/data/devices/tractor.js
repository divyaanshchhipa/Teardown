/* Teardown :: Agricultural tractor
 *
 * Third flagship. Shares are indicative unit or revenue shares for the stated
 * year and basis; confidence is stated per node; every `sources` entry keys
 * into data/sources.js.
 *
 * The deep chain here is neither the notebook's nor the phone's. Both of those
 * bottom out in a machine or a material made by one firm. A tractor bottoms
 * out somewhere else entirely: in a South African mine, and in a satellite
 * constellation operated by a government that never invoices anyone. The
 * mechanical half of this machine is the least concentrated thing on the site.
 * Its two hard chokepoints are a metal and a signal.
 */
TD.device({
  id: 'tractor',
  name: 'Tractor',
  icon: 'tractor',
  category: 'Agriculture technology',
  tagline: 'A diesel engine, a hydraulic system, and a satellite guided computer worth more than either.',
  unit: { volume: '~2.1m units sold globally (2025)', price: 'USD ~28,000 global average, USD ~350,000 for a large row crop machine' },
  intro: 'The best example on this site of a market where units and revenue tell opposite stories. ' +
         'India builds roughly half the world\'s tractors and captures a small share of the profit pool. ' +
         'The value has migrated to guidance, telematics and the data layer, which is exactly where the deals are, ' +
         'and the two things the machine genuinely cannot be built without are mined in one country and ' +
         'broadcast by another.',
  view: { w: 1000, h: 640 },
  frames: [{ label: 'Powertrain', x: 130, y: 70, w: 740, h: 188 },
           { label: 'Electronics and intelligence', x: 130, y: 270, w: 740, h: 178 },
           { label: 'Structure and ground contact', x: 130, y: 450, w: 740, h: 178 }],

  /* ============================ STORY ============================
   * `stages` must account for all 51 nodes exactly once, tools/storycheck.py
   * asserts it and fails on a miss, a duplicate or an unknown id.
   */
  story: {
    kicker: 'Flagship teardown',
    headline: 'Nothing on this machine is concentrated. Two things underneath it are.',
    lede: 'Fifty-one mapped layers, five tiers deep. A tractor is the least concentrated device on this ' +
          'site, no measured layer on the machine itself reaches the threshold a competition regulator ' +
          'would call highly concentrated. Then you reach the catalyst in the exhaust and the signal in ' +
          'the roof, and the picture inverts completely.',

    tierNote: 'The machine is a competitive market sitting on top of two things that are not.',
    geoLede: 'Three readings, not two. India builds the units. Germany, Italy and Japan supply the ' +
             'driveline and the bearings. And the emissions system is gated by South Africa, which ' +
             'appears nowhere in the machine\'s cost stack and cannot be designed around.',

    findings: [
      { title: 'The tractor is competitive. The mine is not.',
        body: 'Engines, transmissions, hydraulics, cabs, tyres, castings, every one is a real market ' +
              'with four or more credible suppliers and no player near control. Then the exhaust ' +
              'aftertreatment needs platinum, palladium and rhodium, and roughly seventy percent of the ' +
              'world\'s platinum and most of its rhodium comes out of one country. Emissions regulation ' +
              'did not just consolidate engine makers: it wired every diesel machine on earth into the ' +
              'Bushveld Complex.',
        nodes: ['aftertreatment', 'pgm-mining'] },
      { title: 'Units and revenue are two different industries',
        body: 'Mahindra sells more tractors than anyone on earth (over 420,000 in FY2025) and the ' +
              'Indian market it leads is about half of world volume. Deere sells a fraction of that ' +
              'number and takes roughly a quarter of world revenue. These are not two positions in one ' +
              'market. They are two industries that happen to share a product name, and almost every ' +
              'wrong conclusion about agricultural equipment comes from reading one table as the other.',
        nodes: ['oem-units-t', 'oem-rev-t'] },
      { title: 'The most valuable part is a subscription to something nobody sells',
        body: 'Guidance is about a tenth of the build cost and the single largest reason a farmer cannot ' +
              'change brand. Underneath it, the correction service is the real product, and underneath ' +
              'that is a constellation of satellites operated by four governments, free at the point of ' +
              'use, with no supplier, no price and no contract. The most defensible position in the ' +
              'machine rests on infrastructure nobody in the industry owns.',
        nodes: ['precision', 'rtk-network', 'constellation'] }
    ],

    /* upstream -> downstream. Node counts here must sum to 51. */
    stages: [
      { id: 'materials', name: 'Mined and milled inputs',
        note: 'Before anything is machined, something is dug up or grown. This is the narrowest tier ' +
              'in the teardown and the one furthest from anybody\'s purchase order.',
        nodes: ['pgm-mining', 'pgm-refining', 'nat-rubber', 'special-steel'] },
      { id: 'emissions', name: 'Emissions control',
        note: 'The chemistry that turns exhaust into something legal. Regulation created this tier ' +
              'from nothing in about fifteen years.',
        nodes: ['catalyst', 'aftertreatment'] },
      { id: 'powertrain', name: 'Engine and driveline',
        note: 'Combustion, and everything that turns it into torque at the wheel. Roughly a third of ' +
              'the machine\'s cost sits in this stage.',
        nodes: ['fuel-system', 'turbo', 'engine-cast', 'engine',
                'gears-shafts', 'bearings', 'clutch-pto', 'transmission'] },
      { id: 'hydraulic', name: 'Hydraulics',
        note: 'A tractor is a hydraulic machine with an engine attached. Every implement it pulls runs ' +
              'on pressure supplied from here.',
        nodes: ['hyd-pumps', 'hyd-valves', 'hyd-cylinders', 'hoses-fittings', 'hydraulics'] },
      { id: 'electronics', name: 'Electrical and electronic',
        note: 'Thirty-odd controllers and several kilometres of cable. Mature-node silicon, which is ' +
              'why the 2021 shortage hit this industry harder than it hit consumer electronics.',
        nodes: ['ag-semi', 'ecus', 'harness', 'lighting', 'electrical-t'] },
      { id: 'positioning', name: 'Positioning and guidance',
        note: 'Read bottom up: a state-operated constellation, a correction network, a chipset, a ' +
              'receiver, and finally the steering and spraying decisions all of it exists to make.',
        nodes: ['constellation', 'rtk-network', 'gnss-chipset', 'gnss',
                'autosteer', 'ag-vision', 'display-console', 'precision'] },
      { id: 'connectivity', name: 'Connectivity',
        note: 'Two percent of the bill of materials, and the layer that turns a machine sale into a ' +
              'recurring relationship.',
        nodes: ['telematics'] },
      { id: 'ground', name: 'Ground contact',
        note: 'Where the power finally meets soil. The tyre is the only part of the machine whose ' +
              'supply chain starts on a smallholding.',
        nodes: ['tyre-rubber', 'steel-cord', 'tyres-t'] },
      { id: 'structure', name: 'Structure and operator',
        note: 'Iron, sheet metal, glass and the cab the operator spends twelve hours a day inside. ' +
              'Fragmented, regional, and covered by nobody.',
        nodes: ['castings-forgings', 'sheet-metal', 'chassis-t',
                'cab-hvac', 'cab-seat', 'cab-glass', 'cab'] },
      { id: 'attachments', name: 'What the tractor pulls',
        note: 'The implement is a separate machine, bought separately, often from a different brand, ' +
              'which is why attach rate rather than share is the number that matters here.',
        nodes: ['seeding-planting', 'spraying-application', 'implements'] },
      { id: 'channel', name: 'Brand, dealer and finance',
        note: 'The three layers that touch the farmer and build none of the machine. One of them lends ' +
              'the money to buy it, which is where a surprising amount of the profit actually sits.',
        nodes: ['unpriced-t', 'oem-units-t', 'oem-rev-t', 'dealers-t', 'finance-t'] }
    ],

    /* The value chain as it actually runs: four routes converging on the
       machine and its channel. Every step is a node id defined below. */
    flow: {
      lanes: [
        { label: 'Powertrain', steps: ['pgm-mining', 'catalyst', 'aftertreatment', 'engine', 'transmission'],
          feed: { label: 'Metal and materials',
                  steps: ['special-steel', 'engine-cast', 'bearings'] } },
        { label: 'Guidance', steps: ['constellation', 'rtk-network', 'gnss-chipset', 'gnss', 'precision'] },
        { label: 'Hydraulics', steps: ['hyd-pumps', 'hyd-valves', 'hydraulics'] },
        { label: 'Ground contact', steps: ['nat-rubber', 'tyre-rubber', 'tyres-t'] }
      ],
      converge: ['oem-rev-t', 'dealers-t']
    }
  },

  nodes: [

    /* ==================== ROW 1 :: POWERTRAIN ==================== */
    {
      id: 'engine', name: 'Diesel engine', short: 'Engine',
      shape: { x: 150, y: 90, w: 220, h: 160 },
      blurb: 'A four to nine litre turbocharged diesel plus the aftertreatment needed to meet Stage V and Tier 4 Final.',
      bomPct: 21, layout: 'board',
      market: { size: 'USD ~19bn', year: 2025, basis: 'off-highway agricultural engine revenue' },
      asOf: '2025', confidence: 'medium',
      shares: [
        { c: 'John Deere', p: 21 }, { c: 'FPT Industrial', p: 15 }, { c: 'Cummins', p: 13 },
        { c: 'Kubota', p: 12 }, { c: 'Perkins', p: 10 }, { c: 'Deutz', p: 7 }, { c: 'Yanmar', p: 6 }
      ],
      note: 'The large OEMs are mostly vertically integrated here, which is why Deere, CNH through FPT, and Kubota appear ' +
            'as their own suppliers. Cummins and Perkins take the merchant market and everything the OEMs will not build. ' +
            'Emissions regulation was the great consolidator: aftertreatment engineering priced small engine makers out ' +
            'of the market entirely between Tier 3 and Tier 4 Final.',
      sources: ['Power Systems Research', 'Company filings']
    },
    {
      id: 'transmission', name: 'Transmission and axles', short: 'Driveline',
      shape: { x: 390, y: 90, w: 220, h: 160 },
      blurb: 'Powershift or continuously variable transmission, front axle, and the differentials in between.',
      bomPct: 16, layout: 'board',
      market: { size: 'USD ~11bn', year: 2025, basis: 'agricultural driveline component revenue' },
      asOf: '2025', confidence: 'low',
      shares: [
        { c: 'ZF', p: 19 }, { c: 'Carraro', p: 15 }, { c: 'Dana', p: 13 },
        { c: 'Bonfiglioli', p: 8 }, { c: 'Comer Industries', p: 7 }
      ],
      note: 'A northern Italian cluster supplies a surprising amount of the world\'s agricultural driveline. ' +
            'These are family influenced, listed, mid cap industrials with real technology and no obvious succession plan, ' +
            'which is a recurring sponsor thesis in the region.',
      sources: ['Company filings', 'Off-Highway Research']
    },
    {
      id: 'hydraulics', name: 'Hydraulics', short: 'Hydraulics',
      shape: { x: 630, y: 90, w: 220, h: 160 },
      blurb: 'Pumps, valves, cylinders and the closed centre load sensing system that runs every implement.',
      bomPct: 11, layout: 'board',
      market: { size: 'USD ~18bn', year: 2025, basis: 'mobile hydraulics revenue, agriculture and construction' },
      asOf: '2025', confidence: 'medium',
      shares: [
        { c: 'Bosch Rexroth', p: 18 }, { c: 'Danfoss', p: 16 }, { c: 'Parker Hannifin', p: 14 },
        { c: 'Kawasaki', p: 8 }, { c: 'HYDAC', p: 5 }
      ],
      note: 'Danfoss bought Eaton\'s hydraulics business for USD 3.3bn in 2021 and became a genuine number two overnight. ' +
            'It is the clearest recent example of scale being bought rather than built in mobile hydraulics.',
      sources: ['Company filings', 'Off-Highway Research'],
      deals: [
        { y: 2021, a: 'Danfoss', t: 'Eaton Hydraulics', v: 'USD 3.3bn', n: 'Roughly doubled Danfoss Power Solutions and reshaped the competitive set.' }
      ]
    },

    /* ============ ROW 2 :: ELECTRONICS AND INTELLIGENCE ============ */
    {
      id: 'precision', name: 'Precision guidance', short: 'Guidance',
      shape: { x: 145, y: 290, w: 168, h: 150 },
      blurb: 'RTK corrected satellite positioning, automated steering, section control and variable rate application.',
      bomPct: 9, layout: 'board',
      market: { size: 'USD ~11bn', year: 2025, basis: 'precision agriculture hardware and software revenue' },
      asOf: '2025', confidence: 'medium', chokepoint: true,
      shares: [
        { c: 'John Deere', p: 36 }, { c: 'Trimble', p: 17 }, { c: 'Topcon', p: 12 },
        { c: 'CNH', p: 11 }, { c: 'AGCO', p: 9 }, { c: 'Hexagon', p: 5 }
      ],
      note: 'This is the whole M&A story in agriculture. Deere built it in house and locked it to green machines. ' +
            'Everyone else had to buy: CNH took Raven for USD 2.1bn, AGCO put USD 2bn into a joint venture for Trimble\'s ' +
            'agriculture division. Guidance is now the switching cost that keeps a farmer on one colour of equipment, ' +
            'and it is the only layer on this machine where a single supplier is anywhere near control.',
      sources: ['Company filings', 'Verdant Partners'],
      deals: [
        { y: 2021, a: 'CNH', t: 'Raven Industries', v: 'USD 2.1bn', n: 'Bought precision agriculture and autonomy capability outright.' },
        { y: 2024, a: 'AGCO', t: 'Trimble agriculture division', v: 'USD ~2bn for 85%', n: 'Formed PTx Trimble. Trimble kept 15% and exited the segment as an operator.' },
        { y: 2021, a: 'John Deere', t: 'Bear Flag Robotics', v: 'USD 250m', n: 'Autonomous retrofit technology, folded into the autonomy roadmap.' },
        { y: 2025, a: 'John Deere', t: 'Sentera', v: 'undisclosed', n: 'Aerial imagery and high-frequency crop data, closing the loop on Deere\'s digital stack.' },
        { y: 2025, a: 'John Deere', t: 'GUSS Automation', v: 'undisclosed', n: 'Autonomous orchard and vineyard spraying: Deere\'s second precision acquisition in three months.' },
        { y: 2025, a: 'CNH', t: 'Advanced Farm Technologies (assets)', v: 'undisclosed', n: 'Robotic harvesting IP, picked up as the autonomy field consolidated.' }
      ]
    },
    {
      id: 'electrical-t', name: 'Electrical and electronic', short: 'Electrical',
      shape: { x: 333, y: 290, w: 168, h: 150 },
      blurb: 'Thirty-odd controllers, several kilometres of harness, the alternator, battery and lighting.',
      bomPct: 7, layout: 'board',
      market: { size: 'USD ~8bn', year: 2025, basis: 'off-highway vehicle electrical and electronic content revenue' },
      asOf: '2025', confidence: 'low',
      shares: [
        { c: 'Bosch', p: 16 }, { c: 'Aptiv', p: 9 }, { c: 'Yazaki', p: 8 },
        { c: 'Sumitomo Electric', p: 7 }, { c: 'Leoni', p: 5 }
      ],
      note: 'Split out from the unpriced residual because agricultural electronics stopped being an afterthought ' +
            'about a decade ago. A modern tractor carries more controllers than a mid-range car and roughly three ' +
            'kilometres of harness. Suppliers are the automotive tier ones working to off-highway volumes, which ' +
            'means agriculture is a rounding error to them, and that asymmetry is exactly why the 2021 ' +
            'semiconductor shortage stopped tractor lines before it stopped car lines.',
      sources: ['Off-Highway Research', 'Company filings']
    },
    {
      id: 'telematics', name: 'Telematics and connectivity', short: 'Telematics',
      shape: { x: 521, y: 290, w: 168, h: 150 },
      blurb: 'The cellular modem, the gateway and the cloud account that turns a machine into a subscription.',
      bomPct: 2,
      market: { size: 'USD ~4bn', year: 2025, basis: 'agricultural telematics and farm management software revenue' },
      asOf: '2025', confidence: 'low', chokepoint: true,
      shares: [
        { c: 'John Deere', p: 34 }, { c: 'Bayer', p: 15 }, { c: 'Trimble', p: 11 },
        { c: 'CNH', p: 10 }, { c: 'AGCO', p: 8 }
      ],
      note: 'Bayer appears here because of Climate FieldView, which came from the USD 1bn acquisition of Climate Corporation ' +
            'by Monsanto in 2013. An input company buying a software company to own the agronomic decision is still the ' +
            'most strategically interesting deal in the sector, and it is the reason a seed and chemical business now ' +
            'holds a top-three position in a market for machine data.',
      sources: ['Company filings', 'AgFunder'],
      deals: [
        { y: 2013, a: 'Monsanto', t: 'Climate Corporation', v: 'USD ~1bn', n: 'Now Bayer Climate FieldView. Established the data layer as a strategic asset in agriculture.' }
      ]
    },
    {
      id: 'cab', name: 'Cab and controls', short: 'Cab',
      shape: { x: 709, y: 290, w: 161, h: 150 },
      blurb: 'Suspended cab, climate control, armrest console and a display stack that now looks like a cockpit.',
      bomPct: 10, layout: 'board',
      market: { size: 'USD ~6bn', year: 2025, basis: 'off-highway cab systems and operator interface revenue' },
      asOf: '2025', confidence: 'low',
      shares: [
        { c: 'Crenlo', p: 14 }, { c: 'Sirco', p: 9 }, { c: 'Grammer', p: 8 }, { c: 'Bosch', p: 7 }
      ],
      note: 'Genuinely fragmented, mostly regional fabricators building to OEM print: one of the clearest roll-up ' +
            'shapes on the site if the coverage on this table were better. The displays and controllers inside are ' +
            'where the technology and the margin sit, and those come from the guidance vendors rather than from ' +
            'whoever welded the structure.',
      sources: ['Company filings', 'Off-Highway Research']
    },

    /* ========== ROW 3 :: STRUCTURE AND GROUND CONTACT ========== */
    {
      id: 'tyres-t', name: 'Tyres and wheels', short: 'Tyres',
      shape: { x: 150, y: 470, w: 220, h: 150 },
      blurb: 'Radial agricultural tyres engineered for low ground pressure. A large rear tyre costs more than a small car.',
      bomPct: 8, layout: 'chain',
      market: { size: 'USD ~9bn', year: 2025, basis: 'agricultural tyre revenue' },
      asOf: '2025', confidence: 'medium',
      shares: [
        { c: 'Michelin', p: 21 }, { c: 'Trelleborg', p: 15 }, { c: 'Bridgestone', p: 14 },
        { c: 'BKT', p: 13 }, { c: 'Titan International', p: 10 }, { c: 'Continental', p: 6 }
      ],
      note: 'Yokohama has been rolling this category up quietly, buying Goodyear\'s off highway business in 2022 and ' +
            'Trelleborg Wheel Systems for EUR 2.07bn in 2023. BKT built a strong position from Gujarat on cost and ' +
            'has been steadily moving up into premium radial. Note that Trelleborg is now Yokohama TWS: the table ' +
            'shows the brand because that is how the market still reports it.',
      sources: ['Tire Business', 'Company filings'],
      deals: [
        { y: 2023, a: 'Yokohama Rubber', t: 'Trelleborg Wheel Systems', v: 'EUR 2.07bn', n: 'Became Yokohama TWS. The largest agricultural tyre deal on record.' },
        { y: 2022, a: 'Yokohama Rubber', t: 'Goodyear off-highway tyre business', v: 'USD 905m', n: 'The first half of the same roll-up, a year earlier.' }
      ]
    },
    {
      id: 'chassis-t', name: 'Frame and body', short: 'Frame',
      shape: { x: 390, y: 470, w: 220, h: 150 },
      blurb: 'Cast and fabricated structural components, sheet metal, and the three point linkage at the back.',
      bomPct: 10, layout: 'board',
      market: { size: 'USD ~7bn', year: 2025, basis: 'structural component revenue, agricultural equipment' },
      asOf: '2025', confidence: 'low',
      shares: [
        { c: 'Bharat Forge', p: 6 }, { c: 'Ramkrishna Forgings', p: 4 }, { c: 'Georg Fischer', p: 4 }
      ],
      note: 'Highly fragmented casting and forging, with India taking a growing share of global supply on cost. ' +
            'No player is close to ten percent. Read the coverage before treating that as a roll-up thesis, though: ' +
            'the three names here account for well under a fifth of the market, and the rest is genuinely unmeasured ' +
            'rather than genuinely absent.',
      sources: ['Company filings', 'Off-Highway Research']
    },
    {
      id: 'implements', name: 'Implements', short: 'Implements',
      shape: { x: 630, y: 470, w: 220, h: 150 },
      blurb: 'What actually does the farming: seed drills, sprayers, balers, ploughs and harvesters.',
      layout: 'board',
      /* Deliberately carries no bomPct. An implement is not part of a
         tractor's bill of materials: it is a separate machine, bought
         separately, often from a different brand. Stating 0% here read as
         "this part is free" rather than "this is not part of the tractor". */
      market: { size: 'USD ~62bn', year: 2025, basis: 'agricultural implement and harvester revenue' },
      asOf: '2025', confidence: 'low',
      shares: [
        { c: 'John Deere', p: 18 }, { c: 'CNH', p: 12 }, { c: 'AGCO', p: 10 },
        { c: 'CLAAS', p: 7 }, { c: 'Kubota', p: 6 }, { c: 'Kuhn', p: 5 }
      ],
      note: 'Sold separately from the tractor and often by a different brand, which is why the attach rate is the ' +
            'metric that matters. Kubota bought its way into European implements with Kverneland and Great Plains. ' +
            'The implement market is larger than the tractor market it hangs off, which almost nobody expects.',
      sources: ['Company filings', 'Farm Equipment'],
      deals: [
        { y: 2016, a: 'Kubota', t: 'Great Plains Manufacturing', v: 'USD ~430m', n: 'Gave Kubota a full line implement offering in North America.' }
      ]
    },
    {
      id: 'unpriced-t', name: 'Not separately priced', short: 'Unpriced',
      blurb: 'Everything this teardown has not costed line by line: fluids, paint and corrosion protection, ' +
             'fasteners, glass fittings, and the labour, test and logistics of final assembly.',
      bomPct: 6,
      market: { size: null, year: 2025, basis: 'residual share of machine build cost, not a market' },
      asOf: '2025', confidence: 'low',
      shares: [],
      note: 'Smaller than it was, because the electrical and electronic content that used to hide in here is now ' +
            'a named layer of its own. What remains is genuinely commodity: paint systems, fluids, fasteners and ' +
            'assembly labour, none of which any published source splits by supplier for agricultural machinery. ' +
            'Read this line as the measure of how much of the machine remains unmapped.',
      sources: ['Off-Highway Research', 'Company filings']
    },

    /* ============================ META ============================ */
    {
      id: 'oem-units-t', name: 'Tractor makers, by units', short: 'By units', kind: 'meta',
      blurb: 'Who actually builds the most tractors. Not who you would guess.',
      market: { size: '~2.1m units', year: 2025, basis: 'global tractor unit shipments, all horsepower classes' },
      asOf: '2025', confidence: 'medium',
      shares: [
        { c: 'Mahindra', p: 20 }, { c: 'Sonalika', p: 6 }, { c: 'TAFE', p: 6 },
        { c: 'John Deere', p: 5 }, { c: 'Escorts Kubota', p: 5 }, { c: 'Kubota', p: 5 },
        { c: 'CNH', p: 4 }, { c: 'YTO', p: 3 }, { c: 'AGCO', p: 2 }, { c: 'CLAAS', p: 1 }
      ],
      note: 'Mahindra has been the largest tractor manufacturer in the world by volume since 2010 and sold 424,641 ' +
            'machines in its FY2025, including the Swaraj brand: the two together are over forty percent of the ' +
            'Indian market, and India is roughly half of world volume. Most of those machines are under fifty ' +
            'horsepower. Read the basis carefully: global unit counts vary by a factor of two depending on whether ' +
            'sub-twenty-horsepower Chinese and Indian machines are counted at all, which is why this table is ' +
            'graded medium and the revenue table beside it is not the same industry.',
      sources: ['Tractor and Mechanization Association', 'Company filings', 'Farm Equipment']
    },
    {
      id: 'oem-rev-t', name: 'Tractor makers, by revenue', short: 'By revenue', kind: 'meta',
      blurb: 'The same industry, weighted by money instead of machines.',
      market: { size: 'USD ~152bn', year: 2025, basis: 'global agricultural equipment revenue' },
      asOf: '2025', confidence: 'medium',
      shares: [
        { c: 'John Deere', p: 24 }, { c: 'CNH', p: 13 }, { c: 'Kubota', p: 12 },
        { c: 'AGCO', p: 8 }, { c: 'CLAAS', p: 5 }, { c: 'Mahindra', p: 4 }, { c: 'SDF', p: 3 }
      ],
      note: 'Deere goes from five percent of units to roughly a quarter of revenue, and Mahindra goes from twenty ' +
            'percent of units to four percent of revenue. High horsepower row crop machines in North America and ' +
            'Brazil carry the profit pool, and precision technology is what defends the price. Put this table beside ' +
            'the unit table and you have the entire economics of the industry in one comparison.',
      sources: ['Company filings', 'Farm Equipment']
    },
    {
      id: 'dealers-t', name: 'Dealer networks', short: 'Dealers', kind: 'meta',
      blurb: 'The distribution layer, and one of the most active mid market consolidation stories in North America.',
      market: { size: 'USD ~40bn', year: 2025, basis: 'agricultural equipment dealer revenue, North America' },
      asOf: '2025', confidence: 'low',
      shares: [
        { c: 'RDO Equipment', p: 5 }, { c: 'Titan Machinery', p: 4 }, { c: 'Ag-Pro', p: 3 }
      ],
      note: 'Deere has pushed dealer consolidation deliberately for two decades, cutting its North American dealer count ' +
            'by more than half. Nobody has ten percent, parts and service margins are defensible, and the sellers are ' +
            'families facing succession. That combination is exactly what a search fund or a lower mid market sponsor wants, ' +
            'though note that only three names are measured here, so the fragmentation is asserted rather than proven.',
      sources: ['Farm Equipment Dealer rankings', 'Company filings']
    },
    {
      id: 'finance-t', name: 'Equipment finance', short: 'Finance', kind: 'meta',
      blurb: 'Who lends the money. On a USD 350,000 machine this is not a footnote.',
      market: { size: 'USD ~55bn', year: 2025, basis: 'agricultural equipment finance receivables, captive and bank' },
      asOf: '2025', confidence: 'low', chokepoint: true,
      shares: [
        { c: 'John Deere Financial', p: 31 }, { c: 'CNH Capital', p: 14 },
        { c: 'DLL', p: 9 }, { c: 'Kubota Credit', p: 8 }, { c: 'AGCO Finance', p: 4 }
      ],
      note: 'The captive finance arms are the quietest strategic asset in agricultural equipment. Deere\'s financial ' +
            'services segment carries a receivables book in the tens of billions and earns a return that is far more ' +
            'stable than the machinery cycle it sits on top of. It also does something no product feature can: it ' +
            'sets the monthly payment, which is the number a farmer actually decides on. A competitor that matches ' +
            'the machine and not the finance has not matched the offer.',
      sources: ['Company filings', 'Farm Equipment']
    },

    /* ==================== ENGINE CHILDREN ==================== */
    {
      id: 'fuel-system', parent: 'engine', name: 'Fuel injection', short: 'Injection',
      blurb: 'Common rail injection at up to 2,500 bar, and the pump and injectors that survive it.',
      market: { size: 'USD ~6bn', year: 2025, basis: 'off-highway diesel fuel injection equipment revenue' },
      asOf: '2025', confidence: 'low', chokepoint: true,
      shares: [
        { c: 'Bosch', p: 33 }, { c: 'Denso', p: 19 }, { c: 'Delphi Technologies', p: 12 },
        { c: 'Cummins', p: 9 }, { c: 'Liebherr', p: 5 }
      ],
      note: 'One of the genuinely hard engineering positions in a diesel engine and the most concentrated layer in ' +
            'the powertrain. Injection precision is what makes Tier 4 and Stage V emissions achievable at all, and ' +
            'the tolerances involved are closer to watchmaking than to engine building. Bosch has held the leading ' +
            'position across both on-highway and off-highway diesel for decades.',
      sources: ['Power Systems Research', 'Company filings']
    },
    {
      id: 'turbo', parent: 'engine', name: 'Turbocharging', short: 'Turbo',
      blurb: 'Fixed and variable geometry turbochargers, increasingly with wastegate control by the engine ECU.',
      market: { size: 'USD ~3.4bn', year: 2025, basis: 'off-highway turbocharger revenue' },
      asOf: '2025', confidence: 'low',
      shares: [
        { c: 'Garrett Motion', p: 24 }, { c: 'BorgWarner', p: 22 }, { c: 'Cummins', p: 16 },
        { c: 'Mitsubishi Heavy Industries', p: 9 }, { c: 'IHI', p: 7 }
      ],
      note: 'A tight oligopoly of automotive turbo specialists plus Cummins, which builds its own. Garrett came out ' +
            'of Honeywell through a 2018 spin-off and a subsequent Chapter 11 restructuring, which is an unusual ' +
            'ownership history for a supplier holding a quarter of a critical category.',
      sources: ['Power Systems Research', 'Company filings']
    },
    {
      id: 'aftertreatment', parent: 'engine', name: 'Exhaust aftertreatment', short: 'Aftertreatment',
      blurb: 'Diesel oxidation catalyst, particulate filter and selective catalytic reduction, plus the urea dosing that feeds it.',
      layout: 'chain',
      market: { size: 'USD ~5.5bn', year: 2025, basis: 'off-highway exhaust aftertreatment system revenue' },
      asOf: '2025', confidence: 'low', chokepoint: true,
      shares: [
        { c: 'Tenneco', p: 21 }, { c: 'Eberspächer', p: 15 }, { c: 'Faurecia', p: 12 },
        { c: 'Donaldson', p: 10 }, { c: 'Cummins', p: 9 }
      ],
      note: 'This layer did not meaningfully exist before Tier 4. Regulation created a multi-billion dollar market, ' +
            'destroyed the small engine builders who could not fund the engineering, and quietly wired every diesel ' +
            'machine on earth to a mined input from one country. Follow the chain down: the system is a canister, ' +
            'the canister is worthless without the catalyst, and the catalyst is worthless without the metal.',
      sources: ['Power Systems Research', 'Company filings']
    },
    {
      id: 'engine-cast', parent: 'engine', name: 'Block and head castings', short: 'Castings',
      blurb: 'Grey and compacted graphite iron castings, machined to tolerances measured in microns.',
      market: { size: 'USD ~4bn', year: 2025, basis: 'off-highway engine casting revenue' },
      asOf: '2025', confidence: 'low',
      shares: [
        { c: 'Georg Fischer', p: 8 }, { c: 'Tupy', p: 8 }, { c: 'Nemak', p: 5 }
      ],
      note: 'Foundry work is capital heavy, energy intensive, environmentally constrained and structurally low return, ' +
            'and Western capacity has been closing for thirty years. Tupy in Brazil has consolidated a large share of ' +
            'compacted graphite iron, the material modern high-pressure diesels need. Only three names are measured ' +
            'here and they cover a fifth of the market, so treat the fragmentation as a gap in the data.',
      sources: ['Company filings', 'Off-Highway Research']
    },

    /* ---- the emissions chain, four tiers down ---- */
    {
      id: 'catalyst', parent: 'aftertreatment', name: 'Catalyst coating', short: 'Catalyst',
      blurb: 'The washcoat and the precious metal loading on it. This is what actually converts the exhaust.',
      layout: 'chain',
      market: { size: 'USD ~14bn', year: 2025, basis: 'mobile emissions catalyst revenue, all vehicle types' },
      asOf: '2025', confidence: 'medium', chokepoint: true,
      shares: [
        { c: 'BASF', p: 26 }, { c: 'Johnson Matthey', p: 24 }, { c: 'Umicore', p: 20 },
        { c: 'Cataler', p: 8 }, { c: 'Heraeus', p: 5 }
      ],
      note: 'Three firms hold roughly seventy percent of the world\'s mobile emissions catalyst, and all three are ' +
            'chemical companies rather than automotive suppliers, because the hard part is chemistry and precious ' +
            'metal handling rather than manufacturing. Note the basis: this is all vehicle types, not off-highway ' +
            'alone: no published source splits agricultural catalyst out, and the same three names supply it. ' +
            'Johnson Matthey has been refocusing on exactly this business, selling Catalyst Technologies to Honeywell ' +
            'to concentrate on Clean Air and platinum group metals.',
      sources: ['Johnson Matthey PGM Market Report', 'Company filings'],
      deals: [
        { y: 2025, a: 'Honeywell', t: 'Johnson Matthey Catalyst Technologies', v: 'GBP 1.325bn', n: 'Announced at GBP 1.8bn in May 2025 and renegotiated down in February 2026. Note this is the industrial catalyst arm: JM kept Clean Air and PGM Services, the parts that matter to a diesel engine.' }
      ]
    },
    {
      id: 'pgm-refining', parent: 'catalyst', name: 'PGM refining and recycling', short: 'PGM refining',
      blurb: 'Separating platinum, palladium and rhodium to purity, from ore concentrate and from scrapped catalysts.',
      layout: 'chain',
      market: { size: 'USD ~9bn', year: 2025, basis: 'platinum group metal refining and secondary recovery revenue' },
      asOf: '2025', confidence: 'low', chokepoint: true,
      shares: [
        { c: 'Johnson Matthey', p: 20 }, { c: 'Umicore', p: 18 }, { c: 'Heraeus', p: 14 },
        { c: 'Sibanye-Stillwater', p: 12 }, { c: 'Valterra Platinum', p: 10 }
      ],
      note: 'A short list of firms can refine platinum group metals to catalyst grade, and several of them are the ' +
            'same companies that make the catalyst: the chemistry, the metal trading and the recycling are one ' +
            'integrated business, which is why Johnson Matthey and Umicore appear twice in this chain. Recycling ' +
            'spent catalysts is now a material share of supply and the only part of the chain that is not ' +
            'geographically fixed.',
      sources: ['Johnson Matthey PGM Market Report', 'Company filings']
    },
    {
      id: 'pgm-mining', parent: 'pgm-refining', name: 'Platinum group metal mining', short: 'PGM mining',
      blurb: 'Platinum, palladium and rhodium, almost all of it from two geological formations on earth.',
      market: { size: 'USD ~18bn', year: 2025, basis: 'primary PGM mine production value' },
      asOf: '2025', confidence: 'medium', chokepoint: true,
      shares: [
        { c: 'Valterra Platinum', p: 21 }, { c: 'Impala Platinum', p: 19 },
        { c: 'Sibanye-Stillwater', p: 17 }, { c: 'Nornickel', p: 16 },
        { c: 'Northam Platinum', p: 8 }
      ],
      note: 'The bottom of this teardown, and the hardest constraint on it. Around seventy percent of the world\'s ' +
            'platinum and the large majority of its rhodium comes out of the Bushveld Complex in South Africa; ' +
            'most of the remaining palladium comes from Norilsk in Russia. Four of the five names here mine the same ' +
            'orebody. There is no substitute chemistry at scale, no second geology of consequence, and the supply ' +
            'responds to power cuts and shaft depth rather than to demand. Every diesel machine on this site, ' +
            'tractor, truck, aircraft ground equipment: depends on it, and none of the companies that build those ' +
            'machines has any leverage over it whatsoever.',
      sources: ['USGS Mineral Commodity Summaries', 'Johnson Matthey PGM Market Report', 'Company filings']
    },

    /* ================== TRANSMISSION CHILDREN ================== */
    {
      id: 'gears-shafts', parent: 'transmission', name: 'Gears and shafts', short: 'Gears',
      blurb: 'Case hardened gear sets, ground to profile, running for ten thousand hours under shock load.',
      layout: 'chain',
      market: { size: 'USD ~5bn', year: 2025, basis: 'off-highway gear and shaft component revenue' },
      asOf: '2025', confidence: 'low',
      shares: [
        { c: 'ZF', p: 12 }, { c: 'Carraro', p: 9 }, { c: 'Comer Industries', p: 7 },
        { c: 'Bharat Forge', p: 5 }
      ],
      note: 'Mostly made in house by the driveline firms above, with a long tail of specialist gear cutters serving ' +
            'the rest. Gear grinding capacity is the practical constraint on scaling a transmission business, and ' +
            'it is the reason driveline acquisitions in this sector are usually about capacity rather than product.',
      sources: ['Company filings', 'Off-Highway Research']
    },
    {
      id: 'bearings', parent: 'transmission', name: 'Bearings', short: 'Bearings',
      blurb: 'Tapered roller bearings carrying the axle loads, and hundreds of smaller ones everywhere else.',
      market: { size: 'USD ~13bn', year: 2025, basis: 'industrial and off-highway bearing revenue' },
      asOf: '2025', confidence: 'medium',
      shares: [
        { c: 'SKF', p: 17 }, { c: 'Schaeffler', p: 15 }, { c: 'NSK', p: 11 },
        { c: 'Timken', p: 10 }, { c: 'NTN', p: 9 }
      ],
      note: 'A stable five-firm oligopoly that has looked much the same for forty years, split between Sweden, ' +
            'Germany, Japan and the United States. Bearings are a good example of a category that is invisible in ' +
            'a bill of materials, impossible to design around, and quietly essential: the qualification cycle for ' +
            'a new bearing supplier in a transmission is measured in years.',
      sources: ['Company filings', 'Off-Highway Research']
    },
    {
      id: 'clutch-pto', parent: 'transmission', name: 'Clutch and power take-off', short: 'Clutch and PTO',
      blurb: 'Wet clutch packs, and the splined shaft at the back that drives whatever is hitched to it.',
      market: { size: 'USD ~2.2bn', year: 2025, basis: 'agricultural clutch and PTO component revenue' },
      asOf: '2025', confidence: 'low',
      shares: [
        { c: 'ZF', p: 14 }, { c: 'Comer Industries', p: 11 }, { c: 'Bondioli & Pavesi', p: 9 },
        { c: 'Dana', p: 7 }
      ],
      note: 'The power take-off is the reason a tractor is a platform rather than a vehicle: a standardised splined ' +
            'shaft turning at 540 or 1,000 rpm, unchanged for decades, which is what allows an implement built by ' +
            'anyone to be driven by a tractor built by anyone. It is one of the most successful interface standards ' +
            'in industrial history and nobody owns it.',
      sources: ['Company filings', 'Off-Highway Research']
    },
    {
      id: 'special-steel', parent: 'gears-shafts', name: 'Special bar quality steel', short: 'Steel',
      blurb: 'Clean, closely specified alloy steel: the input that decides whether a gear lasts ten thousand hours.',
      market: { size: 'USD ~40bn', year: 2025, basis: 'special bar quality and engineering steel revenue, all applications' },
      asOf: '2025', confidence: 'low',
      shares: [
        { c: 'Ovako', p: 5 }, { c: 'Sanyo Special Steel', p: 5 },
        { c: 'Gerdau', p: 4 }, { c: 'Georg Fischer', p: 3 }
      ],
      note: 'Genuinely fragmented and regional, because steel is expensive to move and every major manufacturing ' +
            'economy has its own specialist mills. The basis is all applications, not agriculture: nobody publishes ' +
            'an agricultural split and the same bar goes into cars, bearings and gearboxes. Named coverage here is ' +
            'under a fifth, so this table describes who the notable specialists are rather than how the market divides.',
      sources: ['Company filings', 'USGS Mineral Commodity Summaries']
    },

    /* ================== HYDRAULICS CHILDREN ================== */
    {
      id: 'hyd-pumps', parent: 'hydraulics', name: 'Pumps and motors', short: 'Pumps',
      blurb: 'Variable displacement axial piston pumps, the expensive heart of a load sensing system.',
      layout: 'chain',
      market: { size: 'USD ~7bn', year: 2025, basis: 'mobile hydraulic pump and motor revenue' },
      asOf: '2025', confidence: 'low',
      shares: [
        { c: 'Bosch Rexroth', p: 21 }, { c: 'Danfoss', p: 19 }, { c: 'Parker Hannifin', p: 13 },
        { c: 'Kawasaki', p: 11 }, { c: 'Liebherr', p: 5 }
      ],
      note: 'The most technically demanding part of a hydraulic system and the most concentrated. Danfoss doubled ' +
            'its position here by buying Eaton\'s hydraulics business rather than by building capacity, which is ' +
            'the pattern across this whole layer: scale in mobile hydraulics has been acquired, not grown.',
      sources: ['Company filings', 'Off-Highway Research']
    },
    {
      id: 'hyd-valves', parent: 'hydraulics', name: 'Valves and controls', short: 'Valves',
      blurb: 'Proportional and directional control valves, increasingly commanded electronically rather than by cable.',
      market: { size: 'USD ~5bn', year: 2025, basis: 'mobile hydraulic valve revenue' },
      asOf: '2025', confidence: 'low',
      shares: [
        { c: 'Bosch Rexroth', p: 18 }, { c: 'Danfoss', p: 15 }, { c: 'HYDAC', p: 9 },
        { c: 'Parker Hannifin', p: 9 }, { c: 'Walvoil', p: 6 }
      ],
      note: 'Electrohydraulic control is where hydraulics meets the guidance stack: section control on a sprayer is ' +
            'a valve opening on a satellite fix. It is a quiet reason the guidance vendors have been moving down ' +
            'into componentry, because the value of the positioning is only realised through an actuator.',
      sources: ['Company filings', 'Off-Highway Research']
    },
    {
      id: 'hyd-cylinders', parent: 'hydraulics', name: 'Cylinders', short: 'Cylinders',
      blurb: 'Honed tube, chromed rod, seals. Simple, heavy, and made close to where it is fitted.',
      market: { size: 'USD ~4bn', year: 2025, basis: 'mobile hydraulic cylinder revenue' },
      asOf: '2025', confidence: 'low',
      shares: [
        { c: 'Parker Hannifin', p: 8 }, { c: 'Ligon', p: 4 }, { c: 'Wipro Infrastructure', p: 4 }
      ],
      note: 'The most fragmented layer in the hydraulic system and one of the more genuinely fragmented on the site: ' +
            'cylinders are heavy relative to their value, so freight economics keep production regional and no ' +
            'supplier has been able to consolidate across continents. Coverage on this table is poor, which is ' +
            'itself the finding.',
      sources: ['Off-Highway Research', 'Company filings']
    },
    {
      id: 'hoses-fittings', parent: 'hydraulics', name: 'Hose and fittings', short: 'Hose',
      blurb: 'Wire braided hose, couplings and the quick connectors every implement plugs into.',
      market: { size: 'USD ~6bn', year: 2025, basis: 'hydraulic hose and fitting revenue, all mobile applications' },
      asOf: '2025', confidence: 'low',
      shares: [
        { c: 'Parker Hannifin', p: 17 }, { c: 'Gates Industrial', p: 15 },
        { c: 'Continental', p: 9 }, { c: 'Manuli', p: 6 }
      ],
      note: 'A consumable as much as a component: hose is the part of a tractor most likely to fail in a field, ' +
            'which makes the aftermarket larger than the original equipment market and gives the dealer network ' +
            'a durable parts annuity. Gates was taken public by Blackstone in 2018 and is a good worked example ' +
            'of sponsor ownership in an unglamorous industrial category.',
      sources: ['Company filings', 'Off-Highway Research']
    },

    /* ================== PRECISION CHILDREN ================== */
    {
      id: 'gnss', parent: 'precision', name: 'GNSS receivers and correction', short: 'GNSS',
      shape: { x: 150, y: 150, w: 340, h: 200 },
      blurb: 'Centimetre accurate positioning, delivered by real time kinematic correction over cellular or satellite.',
      layout: 'chain',
      market: { size: 'USD ~4.5bn', year: 2025, basis: 'high precision GNSS revenue, agriculture and construction' },
      /* Graded low, not medium. Every name here reports high-precision
         positioning inside a larger segment and none of them discloses a
         share, so this table is reconciled from filings that were never
         meant to add up to a market. */
      asOf: '2025', confidence: 'low', chokepoint: true,
      shares: [
        { c: 'Trimble', p: 28 }, { c: 'Hexagon', p: 21 }, { c: 'Topcon', p: 16 }, { c: 'John Deere', p: 14 }
      ],
      note: 'The correction subscription is the real product. Hardware is sold near cost and the recurring accuracy ' +
            'service carries software gross margin, which is why these businesses trade on software multiples. ' +
            'Treat the ranking as firmer than the numbers: all four report this inside a wider segment and none of ' +
            'them breaks it out.',
      sources: ['Company filings', 'GPS World']
    },
    {
      id: 'ag-vision', parent: 'precision', name: 'Vision and spot spraying', short: 'Vision',
      shape: { x: 510, y: 150, w: 340, h: 200 },
      blurb: 'Cameras and on board inference that identify a weed and open one nozzle instead of the whole boom.',
      market: { size: 'USD ~1.8bn', year: 2025, basis: 'targeted application and agricultural vision system revenue' },
      asOf: '2025', confidence: 'low',
      shares: [
        { c: 'John Deere', p: 31 }, { c: 'Bosch', p: 18 }, { c: 'Trimble', p: 11 }, { c: 'Ecorobotix', p: 6 }
      ],
      note: 'Deere\'s position came from buying Blue River Technology for USD 305m in 2017, which at the time looked like ' +
            'an expensive acqui hire and turned into See and Spray, now a paid feature with a measurable chemical saving. ' +
            'Bosch partnered with BASF to answer it, which tells you the chemical companies understood the threat: ' +
            'a machine that sprays a tenth as much herbicide is a machine that buys a tenth as much herbicide.',
      sources: ['Company filings', 'AgFunder'],
      deals: [
        { y: 2017, a: 'John Deere', t: 'Blue River Technology', v: 'USD 305m', n: 'Machine vision weeding. The template acquisition for agricultural autonomy.' }
      ]
    },
    {
      id: 'display-console', parent: 'precision', name: 'Display and console', short: 'Display',
      blurb: 'The armrest touchscreen that runs guidance, section control, documentation and the machine itself.',
      market: { size: 'USD ~1.4bn', year: 2025, basis: 'agricultural display and operator terminal revenue' },
      asOf: '2025', confidence: 'low', chokepoint: true,
      shares: [
        { c: 'John Deere', p: 34 }, { c: 'Topcon', p: 15 }, { c: 'CNH', p: 13 },
        { c: 'Trimble', p: 12 }, { c: 'AGCO', p: 8 }
      ],
      note: 'The display is where lock-in is actually enforced. ISOBUS was meant to make terminals interchangeable ' +
            'between brands, and in practice the advanced functions that farmers pay for sit outside the standard, ' +
            'so a mixed fleet ends up with several screens in one cab. That friction is the switching cost, and it ' +
            'is deliberate.',
      sources: ['Company filings', 'Verdant Partners']
    },
    {
      id: 'autosteer', parent: 'precision', name: 'Steering actuation', short: 'Autosteer',
      blurb: 'The electrohydraulic valve or steering motor that turns a position fix into a change of direction.',
      market: { size: 'USD ~1.1bn', year: 2025, basis: 'automated steering system revenue, agriculture' },
      asOf: '2025', confidence: 'low',
      shares: [
        { c: 'John Deere', p: 29 }, { c: 'Trimble', p: 18 }, { c: 'Topcon', p: 13 },
        { c: 'Danfoss', p: 9 }, { c: 'Hexagon', p: 7 }
      ],
      note: 'The retrofit market matters more here than anywhere else in the guidance stack: an aftermarket autosteer ' +
            'kit is how a farmer with a fifteen year old tractor buys into precision agriculture, and it is the one ' +
            'place where the independent vendors compete with the OEMs on equal terms. Danfoss appears because the ' +
            'actuation is hydraulic: the guidance layer reaches down into the hydraulic layer here.',
      sources: ['Company filings', 'GPS World']
    },

    /* ---- positioning, three and four tiers down ---- */
    {
      id: 'gnss-chipset', parent: 'gnss', name: 'GNSS chipset and module', short: 'Chipset',
      blurb: 'The multi-band receiver silicon that tracks four constellations at once and resolves the carrier phase.',
      market: { size: 'USD ~1.6bn', year: 2025, basis: 'high precision GNSS chipset and module revenue' },
      asOf: '2025', confidence: 'low',
      shares: [
        { c: 'u-blox', p: 22 }, { c: 'Hexagon', p: 18 }, { c: 'Trimble', p: 15 },
        { c: 'Septentrio', p: 10 }, { c: 'Unicore', p: 9 }, { c: 'Quectel', p: 6 }
      ],
      note: 'High precision receiver silicon used to cost thousands of dollars a unit and now costs hundreds, which ' +
            'is the single change that put centimetre accuracy on mid-range machines rather than only on flagship ' +
            'row crop tractors. Chinese entrants have taken the low end of this quickly, exactly as they did in the ' +
            'phone radio chain.',
      sources: ['GPS World', 'Company filings']
    },
    {
      id: 'rtk-network', parent: 'gnss', name: 'RTK correction network', short: 'Correction',
      blurb: 'Ground reference stations and the subscription that streams their error model to the machine.',
      layout: 'chain',
      market: { size: 'USD ~1.2bn', year: 2025, basis: 'GNSS correction service subscription revenue, all sectors' },
      asOf: '2025', confidence: 'low', chokepoint: true,
      shares: [
        { c: 'Trimble', p: 24 }, { c: 'Hexagon', p: 18 }, { c: 'Topcon', p: 13 },
        { c: 'John Deere', p: 12 }, { c: 'u-blox', p: 7 }
      ],
      note: 'The most software-like business in the machine and the one with the best economics: reference stations ' +
            'are a fixed cost, every additional subscriber is close to pure margin, and cancelling means losing the ' +
            'accuracy the whole machine was bought for. This is the layer that converts a one-off equipment sale ' +
            'into an annuity, and it is why guidance businesses are valued the way software is.',
      sources: ['Company statements', 'GPS World', 'EUSPA GNSS Market Report']
    },
    {
      id: 'constellation', parent: 'rtk-network', name: 'Satellite constellation', short: 'Constellation',
      blurb: 'The signal itself, broadcast from medium earth orbit by four governments, free to anyone with a receiver.',
      market: { size: null, year: 2025, basis: 'operational navigation satellites in service, by programme: there is no market and no price' },
      asOf: '2025', confidence: 'medium', chokepoint: true,
      shares: [
        { c: 'China (BeiDou)', p: 34 }, { c: 'United States (GPS)', p: 24 },
        { c: 'European Union (Galileo)', p: 22 }, { c: 'Russia (GLONASS)', p: 18 }
      ],
      note: 'The bottom of the guidance chain, and the strangest node on this site. There is no supplier, no price ' +
            'and no contract: four governments operate the constellations, the signal is free at the point of use, ' +
            'and the "share" here can only mean satellites in service. Every precision agriculture business on the ' +
            'page: the receivers, the correction subscriptions, the autosteer kits, the entire switching cost that ' +
            'keeps a farmer on one colour of machine: is built on infrastructure that none of them own, none of ' +
            'them pay for, and none of them could replace. It is the most valuable input in the machine and it ' +
            'appears in nobody\'s cost of goods.',
      sources: ['Constellation operator disclosures', 'EUSPA GNSS Market Report']
    },

    /* ================== ELECTRICAL CHILDREN ================== */
    {
      id: 'ecus', parent: 'electrical-t', name: 'Electronic control units', short: 'ECUs',
      blurb: 'Thirty or more networked controllers running the engine, transmission, hydraulics and implements over ISOBUS.',
      layout: 'chain',
      market: { size: 'USD ~3.2bn', year: 2025, basis: 'off-highway electronic control unit revenue' },
      asOf: '2025', confidence: 'low',
      shares: [
        { c: 'Bosch', p: 21 }, { c: 'Continental', p: 11 }, { c: 'Danfoss', p: 8 },
        { c: 'Parker Hannifin', p: 6 }
      ],
      note: 'ISOBUS is the standard that lets an implement from one maker talk to a tractor from another, and it is ' +
            'the reason the attach-rate economics of implements work at all. It is also the standard the guidance ' +
            'vendors keep extending past, because full interoperability would remove the switching cost their ' +
            'businesses depend on.',
      sources: ['Off-Highway Research', 'Company filings']
    },
    {
      id: 'harness', parent: 'electrical-t', name: 'Wiring harness', short: 'Harness',
      blurb: 'Around three kilometres of cable, cut, crimped and taped largely by hand.',
      market: { size: 'USD ~2.4bn', year: 2025, basis: 'off-highway wiring harness revenue' },
      asOf: '2025', confidence: 'low',
      shares: [
        { c: 'Aptiv', p: 14 }, { c: 'Yazaki', p: 12 }, { c: 'Sumitomo Electric', p: 10 },
        { c: 'Leoni', p: 8 }
      ],
      note: 'One of the last genuinely labour-intensive parts of a vehicle: harnesses resist automation because ' +
            'they are floppy, and they are therefore built where labour is cheap and shipped. That makes them the ' +
            'component most exposed to wage inflation and to border disruption, and the one that has stopped more ' +
            'assembly lines in the last five years than any semiconductor.',
      sources: ['Company filings', 'Off-Highway Research']
    },
    {
      id: 'lighting', parent: 'electrical-t', name: 'Lighting and visibility', short: 'Lighting',
      blurb: 'LED work lighting: the reason a modern tractor can be operated through the night.',
      market: { size: 'USD ~1.1bn', year: 2025, basis: 'off-highway work lighting revenue' },
      asOf: '2025', confidence: 'low',
      shares: [
        { c: 'HELLA', p: 15 }, { c: 'J.W. Speaker', p: 8 }, { c: 'Grote', p: 6 }
      ],
      note: 'A small category with a real productivity story behind it: LED work lighting is a large part of why ' +
            'seasonal field operations now run around the clock, and harvest windows are measured in days. Named ' +
            'coverage is under a third, so read this as a list of notable suppliers rather than a market split.',
      sources: ['Off-Highway Research', 'Company filings']
    },
    {
      id: 'ag-semi', parent: 'ecus', name: 'Mature-node semiconductors', short: 'Semis',
      blurb: 'Microcontrollers, analog and power devices on 40 to 180 nanometre processes. Nothing leading edge.',
      market: { size: 'USD ~62bn', year: 2025, basis: 'automotive and industrial microcontroller and analog revenue, all applications' },
      asOf: '2025', confidence: 'medium', chokepoint: true,
      shares: [
        { c: 'Infineon', p: 14 }, { c: 'NXP', p: 11 }, { c: 'STMicroelectronics', p: 10 },
        { c: 'Texas Instruments', p: 10 }, { c: 'Renesas', p: 9 }, { c: 'Microchip', p: 6 }
      ],
      note: 'The contrast with the laptop and phone teardowns is the point. Agriculture does not need three ' +
            'nanometre silicon; it needs parts qualified for twenty years of vibration, dust and temperature swing, ' +
            'made on processes two decades old. That sounds safer and is not: mature-node capacity is exactly what ' +
            'nobody was building in 2021, agricultural volumes are a rounding error next to automotive, and tractor ' +
            'lines stopped while the same suppliers prioritised larger customers. The basis here is all applications ' +
            ': no source splits agricultural microcontrollers out.',
      sources: ['Company filings', 'Off-Highway Research']
    },

    /* ================== TYRE CHILDREN ================== */
    {
      id: 'tyre-rubber', parent: 'tyres-t', name: 'Rubber compound', short: 'Compound',
      blurb: 'Natural and synthetic rubber, carbon black and silica. Agricultural casings lean hard on natural rubber.',
      layout: 'chain',
      market: { size: 'USD ~48bn', year: 2025, basis: 'natural and synthetic rubber consumption value, all tyre applications' },
      asOf: '2025', confidence: 'low',
      shares: [
        { c: 'Sinopec', p: 9 }, { c: 'LANXESS', p: 6 }, { c: 'Michelin', p: 5 },
        { c: 'Goodyear', p: 4 }
      ],
      note: 'Large agricultural tyres carry an unusually high natural rubber content, because synthetic compounds ' +
            'do not match natural rubber for cut and chunk resistance at low inflation pressure, which is exactly ' +
            'what a flotation tyre needs. That single material property is what connects a row crop tractor in ' +
            'Iowa to a smallholding in southern Thailand.',
      sources: ['ANRPC', 'Company filings']
    },
    {
      id: 'steel-cord', parent: 'tyres-t', name: 'Steel cord and belt', short: 'Cord',
      blurb: 'Brass coated high carbon steel filament, twisted into the cord that gives a radial tyre its shape.',
      market: { size: 'USD ~7bn', year: 2025, basis: 'tyre steel cord revenue, all applications' },
      asOf: '2025', confidence: 'low',
      shares: [
        { c: 'Bekaert', p: 25 }, { c: 'Kiswire', p: 12 }, { c: 'Xingda', p: 11 },
        { c: 'Hyosung', p: 8 }
      ],
      note: 'A concentrated and almost invisible layer. Bekaert has held the leading position in tyre steel cord for ' +
            'decades on metallurgy and drawing know-how, and the adhesion between brass-coated steel and rubber is ' +
            'one of those interface problems that looks trivial and has kept a Belgian company ahead for a century.',
      sources: ['Company filings', 'Tire Business']
    },
    {
      id: 'nat-rubber', parent: 'tyre-rubber', name: 'Natural rubber production', short: 'Natural rubber',
      blurb: 'Latex tapped by hand from Hevea trees, overwhelmingly on smallholdings of a few hectares.',
      market: { size: '~14.9m tonnes', year: 2025, basis: 'natural rubber production volume by country of origin' },
      asOf: '2025', confidence: 'medium', chokepoint: true,
      shares: [
        { c: 'Thailand (all producers)', p: 36 }, { c: 'Indonesia (all producers)', p: 14 },
        { c: 'Côte d\'Ivoire (all producers)', p: 11 }, { c: 'Vietnam (all producers)', p: 9 },
        { c: 'China (all firms combined)', p: 6 }, { c: 'India (all producers)', p: 6 }
      ],
      note: 'Named by country because there is no company to name: natural rubber is produced by millions of ' +
            'smallholdings, and roughly six million of them account for the large majority of world supply. ' +
            'Thailand alone is over a third. Production was in deficit against demand in 2025, ageing trees and ' +
            'labour shortages are constraining replanting, and the EU deforestation regulation adds a traceability ' +
            'burden that a smallholder in southern Thailand is not equipped to carry. There is no synthetic ' +
            'substitute for the large agricultural casing, which makes this a real chokepoint hiding inside the ' +
            'least glamorous component on the machine.',
      sources: ['ANRPC', 'Tire Business']
    },

    /* ================== CAB CHILDREN ================== */
    {
      id: 'cab-hvac', parent: 'cab', name: 'Climate and filtration', short: 'HVAC',
      blurb: 'Air conditioning plus carbon filtration rated to keep pesticide out of the operator\'s air.',
      market: { size: 'USD ~1.6bn', year: 2025, basis: 'off-highway cab climate and filtration revenue' },
      asOf: '2025', confidence: 'low',
      shares: [
        { c: 'MAHLE', p: 14 }, { c: 'Denso', p: 11 }, { c: 'Valeo', p: 8 }, { c: 'Donaldson', p: 7 }
      ],
      note: 'Category 4 cab filtration is a regulatory requirement when spraying, and it turned the cab from a ' +
            'weather shelter into a piece of personal protective equipment. That reclassification is why a tractor ' +
            'cab costs what it does, and why the fabricators cannot simply be replaced by cheaper welding shops.',
      sources: ['Off-Highway Research', 'Company filings']
    },
    {
      id: 'cab-seat', parent: 'cab', name: 'Operator seat', short: 'Seat',
      blurb: 'Air suspended, swivelling, with the armrest console that carries most of the machine\'s controls.',
      market: { size: 'USD ~0.9bn', year: 2025, basis: 'off-highway operator seat revenue' },
      asOf: '2025', confidence: 'low',
      shares: [
        { c: 'Grammer', p: 27 }, { c: 'Sears Seating', p: 12 }, { c: 'KAB Seating', p: 8 }
      ],
      note: 'A small market with an outsized ergonomics and liability story: whole-body vibration exposure is ' +
            'regulated in the EU, and the air-suspended seat is the control for it. Grammer is the clear leader ' +
            'and was itself the subject of a contested takeover by the Chinese Ningbo Jifeng group, which is a ' +
            'useful reminder that even a nine-hundred-million-dollar niche attracts strategic buyers.',
      sources: ['Company filings', 'Off-Highway Research']
    },
    {
      id: 'cab-glass', parent: 'cab', name: 'Cab glazing', short: 'Glass',
      blurb: 'Curved, tempered, sometimes bonded structural glass: a tractor cab is mostly window by area.',
      market: { size: 'USD ~0.7bn', year: 2025, basis: 'off-highway vehicle glazing revenue' },
      asOf: '2025', confidence: 'low',
      shares: [
        { c: 'Saint-Gobain', p: 16 }, { c: 'Fuyao', p: 12 }, { c: 'AGC', p: 9 }
      ],
      note: 'Off-highway glazing is a specialist corner of the automotive glass industry: low volume, high curvature, ' +
            'and a lot of separate part numbers. The same three groups that dominate automotive glass supply it, ' +
            'largely because nobody else has the furnace capacity or wants the tooling cost.',
      sources: ['Company filings', 'Off-Highway Research']
    },

    /* ================== CHASSIS CHILDREN ================== */
    {
      id: 'castings-forgings', parent: 'chassis-t', name: 'Castings and forgings', short: 'Castings',
      blurb: 'Axle housings, hitch components and the heavy structural iron a tractor is built around.',
      market: { size: 'USD ~4.5bn', year: 2025, basis: 'agricultural equipment casting and forging revenue' },
      asOf: '2025', confidence: 'low',
      shares: [
        { c: 'Bharat Forge', p: 9 }, { c: 'Ramkrishna Forgings', p: 6 },
        { c: 'Georg Fischer', p: 5 }, { c: 'Tupy', p: 4 }
      ],
      note: 'India has taken a growing share of global forging supply on cost and on genuine capability: Bharat ' +
            'Forge is a world-scale forger that happens to be Indian rather than an Indian supplier that forges. ' +
            'The layer remains fragmented, energy-intensive and consolidating slowly, which is the classic profile ' +
            'for a platform build, if the coverage on this table were good enough to underwrite one.',
      sources: ['Company filings', 'Off-Highway Research']
    },
    {
      id: 'sheet-metal', parent: 'chassis-t', name: 'Sheet metal and panels', short: 'Panels',
      blurb: 'Hood, fenders, grille and the paint system that has to survive a decade outdoors.',
      /* No size stated: naming a market this layer has no measured split for
         would imply the split exists somewhere. It does not. */
      market: { size: null, year: 2025, basis: 'agricultural sheet metal fabrication and coating, no published supplier split' },
      asOf: '2025', confidence: 'low',
      shares: [],
      note: 'Named but not measured. Panel fabrication and painting for agricultural equipment is done by regional ' +
            'job shops working to OEM print, frequently within a day\'s freight of the assembly plant, and no ' +
            'published tracker covers it. The suppliers are real businesses: this is genuinely one of the more ' +
            'plausible roll-up territories in the machine, but a share table assembled here would be invention, ' +
            'so the layer is placed and named rather than measured.',
      sources: ['Off-Highway Research', 'Company statements']
    },

    /* ================== IMPLEMENT CHILDREN ================== */
    {
      id: 'seeding-planting', parent: 'implements', name: 'Seeding and planting', short: 'Seeding',
      blurb: 'Planters and drills placing individual seeds at speed, increasingly with per-row electric drive.',
      market: { size: 'USD ~14bn', year: 2025, basis: 'seeding and planting equipment revenue' },
      asOf: '2025', confidence: 'low',
      shares: [
        { c: 'John Deere', p: 21 }, { c: 'AGCO', p: 12 }, { c: 'CNH', p: 11 },
        { c: 'Väderstad', p: 6 }, { c: 'Horsch', p: 5 }, { c: 'Amazone', p: 4 }
      ],
      note: 'Planting accuracy compounds through the whole season, which makes this the implement category where ' +
            'precision technology pays back most visibly and where the OEMs have therefore defended hardest. The ' +
            'strong European family firms (Väderstad, Horsch, Amazone, Lemken) are the interesting mid-market ' +
            'cohort here, and every one of them faces the same succession question.',
      sources: ['Farm Equipment', 'Company filings']
    },
    {
      id: 'spraying-application', parent: 'implements', name: 'Spraying and application', short: 'Spraying',
      blurb: 'Self propelled and trailed sprayers with booms up to fifty metres and nozzle-level control.',
      market: { size: 'USD ~11bn', year: 2025, basis: 'crop protection application equipment revenue' },
      asOf: '2025', confidence: 'low',
      shares: [
        { c: 'John Deere', p: 24 }, { c: 'AGCO', p: 14 }, { c: 'CNH', p: 10 },
        { c: 'Kuhn', p: 5 }, { c: 'Amazone', p: 4 }
      ],
      note: 'The implement where the vision layer above has the most direct economic effect: targeted spraying can ' +
            'cut herbicide use substantially, which changes the economics for the farmer and threatens the volume ' +
            'of the chemical companies at the same time. It is the clearest case on this teardown of a machine ' +
            'feature reaching across into an adjacent industry\'s revenue.',
      sources: ['Farm Equipment', 'AgFunder']
    }
  ]
});
