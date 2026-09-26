/* Teardown :: Combustion car
 *
 * Fifth flagship. Shares are indicative unit or revenue shares for the stated
 * year and basis; confidence is stated per node; every `sources` entry keys
 * into data/sources.js.
 *
 * ---- how this device relates to the others ----
 *
 * The site already has an Electric vehicle teardown. This is deliberately the
 * *other* one: the machine the EV is replacing, with the roughly two thousand
 * moving parts an electric drivetrain deletes. Read together they are the
 * clearest before-and-after on the site.
 *
 * The exhaust chain here bottoms out in platinum group metals, which the
 * tractor teardown already maps in depth. That branch is therefore kept
 * deliberately short and cross-linked rather than re-derived; see `pgm-c`.
 * A flagship that repeated another flagship's terminus would be one teardown
 * told twice.
 *
 * The car's own deep chain is somewhere nothing else on this site goes: an
 * alloying additive. Follow the body down and it ends in magnesium, which is
 * not a part, appears in no bill of materials, is about five percent of an
 * automotive aluminium alloy, and comes almost entirely from one country.
 */
TD.device({
  id: 'car',
  name: 'Combustion car',
  icon: 'car',
  category: 'Mobility',
  tagline: 'Thirty thousand parts, and the one that stopped Europe cost about forty dollars.',
  unit: { volume: '~75m combustion and hybrid light vehicles built (2025)', price: 'USD ~38,000 average transaction' },
  intro: 'A car is the most complex thing most people will ever own, and the most studied supply ' +
         'chain in the world: it is the only industry here with a formal, publicly ranked supplier ' +
         'hierarchy. That makes the top of the chain unusually well evidenced. It also makes the ' +
         'bottom easy to miss: the two things that have actually halted car production this decade ' +
         'were a hand-assembled bundle of wire and a metal nobody thinks of as a car part.',
  view: { w: 1000, h: 640 },
  frames: [{ label: 'Powertrain', x: 130, y: 60, w: 740, h: 176 },
           { label: 'Structure and chassis', x: 130, y: 248, w: 740, h: 176 },
           { label: 'Interior, electrical and body', x: 130, y: 436, w: 740, h: 190 }],

  /* ============================ STORY ============================
   * `stages` must account for all 51 nodes exactly once, tools/storycheck.py
   * asserts it and fails on a miss, a duplicate or an unknown id.
   */
  story: {
    kicker: 'Flagship teardown',
    headline: 'The parts that stop a car factory are never the expensive ones.',
    lede: 'Fifty-one mapped layers, five tiers deep. Every supplier at the top of this chain is ' +
          'public, ranked and analysed to death. Then you follow the body down four levels and ' +
          'arrive at a metal that is five percent of an alloy, appears on no bill of materials, ' +
          'and comes ninety percent from one country, and it very nearly stopped every aluminium ' +
          'plant in Europe.',

    tierNote: 'The visible half of this chain is the best-documented in manufacturing. The half underneath it is not.',
    geoLede: 'Three readings. By assembly the car is Japanese, German, Korean and increasingly ' +
             'Chinese. By component it is a German and Japanese tier-one oligopoly. And by ' +
             'material it runs through China for magnesium and South Africa for the catalyst, ' +
             'neither of which appears anywhere in the cost stack.',

    findings: [
      { title: 'The part that stopped Europe cost about forty dollars',
        body: 'In 2022 the wiring harness plants in western Ukraine shut. Harnesses are bundles of ' +
              'wire, cut and taped largely by hand, worth a few tens of dollars and impossible to ' +
              'automate, which is exactly why they are built where labour is cheap. Volkswagen, ' +
              'BMW, Mercedes and Porsche idled plants within weeks, and analysts put ten to fifteen ' +
              'percent of European output at risk. Nothing in the semiconductor chain has ever ' +
              'stopped this industry that fast. Unit cost tells you nothing about fragility.',
        nodes: ['harness-c', 'harness-labour'] },
      { title: 'Nobody thinks of magnesium as a car part',
        body: 'Because it is not one. Magnesium is an alloying element, roughly five percent of the ' +
              'aluminium used for automotive castings and body panels, invisible in every bill of ' +
              'materials. China produces something close to ninety percent of it, and Europe sources ' +
              'about ninety-seven percent of its supply from there. When Chinese output was cut in ' +
              'late 2021, European aluminium trade bodies used the word catastrophic in public. The ' +
              'deepest dependency in this machine is a rounding error in its cost.',
        nodes: ['aluminium-c', 'magnesium-c', 'mg-smelting'] },
      { title: 'The supplier pyramid is the industry',
        body: 'No other device on this site has a formal supplier hierarchy with a published annual ' +
              'ranking. A carmaker does not buy parts, it buys systems from perhaps two hundred ' +
              'tier-one suppliers, who buy from thousands of tier twos. Bosch alone books more ' +
              'automotive revenue than most carmakers make in profit. The assemblers own the ' +
              'customer and the brand; the tier ones own most of the engineering, and increasingly ' +
              'set the pace of what a car can do.',
        nodes: ['tier1-c', 'oem-c'] }
    ],

    /* upstream -> downstream. Node counts here must sum to 51. */
    stages: [
      { id: 'materials', name: 'Metal and materials',
        note: 'Where the car starts: smelted metal and refined catalyst, several steps before ' +
              'anyone thinks about a vehicle.',
        nodes: ['mg-smelting', 'magnesium-c', 'aluminium-c', 'pgm-c'] },
      { id: 'bodyshop', name: 'Body in white',
        note: 'Stamped steel, cast aluminium, adhesive and paint. The largest single capital ' +
              'investment in any car plant and the least outsourced step in the whole chain.',
        nodes: ['castings-c', 'stamping-c', 'paint-c', 'sealing-c', 'body-c'] },
      { id: 'engine', name: 'Engine',
        note: 'The part an electric car deletes entirely, and about two thousand moving pieces ' +
              'with it. Still the single most valuable subsystem in this machine.',
        nodes: ['engine-block', 'fuel-injection', 'turbocharger', 'pistons-rings', 'engine-c'] },
      { id: 'driveline', name: 'Transmission and driveline',
        note: 'Eight to ten ratios, a torque converter, and shafts to whichever wheels are driven. ' +
              'Deleted almost entirely by an electric drivetrain.',
        nodes: ['transmission-c', 'driveshafts', 'clutch-torque', 'driveline-c'] },
      { id: 'emissions', name: 'Exhaust and aftertreatment',
        note: 'The regulatory tax on combustion, and the branch that runs into the same South ' +
              'African orebody as the tractor.',
        nodes: ['catalytic-conv', 'muffler-pipe', 'exhaust-c'] },
      { id: 'chassis', name: 'Chassis, brakes and steering',
        note: 'Everything between the body and the road. Mature, heavy, regional, and mostly ' +
              'supplied by firms older than the companies they sell to.',
        nodes: ['suspension-c', 'brakes-c', 'steering-c', 'wheels-tyres-c', 'chassis-c'] },
      { id: 'electrical', name: 'Electrical and electronic',
        note: 'Fifty kilograms of wire, a hundred controllers and a screen. The fastest-growing ' +
              'share of the cost, and the source of both production stoppages this decade.',
        nodes: ['auto-semi', 'ecu-c', 'harness-labour', 'harness-c', 'infotainment-c',
                'battery-12v', 'electrical-c'] },
      { id: 'interior', name: 'Interior and safety',
        note: 'What the buyer actually touches, plus the pyrotechnics behind it that nobody ever ' +
              'wants to see work.',
        nodes: ['seats-c', 'cockpit-c', 'trim-c', 'inflator-c', 'airbags-c', 'interior-c'] },
      { id: 'exterior', name: 'Glass, lighting and climate',
        note: 'Glazing, lamps and the air conditioning: three categories that have quietly become ' +
              'far more concentrated than the car industry they serve.',
        nodes: ['glass-c', 'lighting-c', 'mirrors-trim', 'hvac-c', 'cooling-c',
                'exterior-c', 'thermal-c'] },
      { id: 'channel', name: 'Who builds and sells it',
        note: 'The assembler, the supplier pyramid underneath, and the two channels that make more ' +
              'money from the car after it is sold than the maker did selling it.',
        nodes: ['unpriced-c', 'oem-c', 'tier1-c', 'dealers-c', 'aftermarket-c'] }
    ],

    flow: {
      lanes: [
        { label: 'Body', steps: ['mg-smelting', 'magnesium-c', 'aluminium-c', 'castings-c', 'body-c'] },
        { label: 'Powertrain', steps: ['engine-block', 'engine-c', 'transmission-c', 'driveline-c'],
          feed: { label: 'Emissions', steps: ['pgm-c', 'catalytic-conv', 'exhaust-c'] } },
        { label: 'Electrical', steps: ['auto-semi', 'ecu-c', 'harness-c', 'electrical-c'] },
        { label: 'Interior', steps: ['inflator-c', 'airbags-c', 'seats-c', 'interior-c'] }
      ],
      converge: ['tier1-c', 'oem-c']
    }
  },

  nodes: [

    /* ==================== ROW 1 :: POWERTRAIN ==================== */
    {
      id: 'engine-c', name: 'Engine', short: 'Engine',
      shape: { x: 150, y: 80, w: 220, h: 146 },
      blurb: 'A three to six cylinder turbocharged petrol or diesel, and the two thousand moving parts an electric car does without.',
      bomPct: 15, layout: 'board',
      market: { size: 'USD ~112bn', year: 2025, basis: 'light vehicle engine content value, in-house and merchant' },
      asOf: '2025', confidence: 'low',
      shares: [
        { c: 'Toyota', p: 11 }, { c: 'Volkswagen Group', p: 9 }, { c: 'Hyundai-Kia', p: 8 },
        { c: 'General Motors', p: 6 }, { c: 'Ford', p: 5 }, { c: 'Stellantis', p: 5 }
      ],
      note: 'Almost every carmaker builds its own engines, which is why this table looks like the ' +
            'vehicle table rather than a supplier table. That vertical integration is the whole ' +
            'reason the electric transition is existentially difficult for incumbents: the engine ' +
            'plant is owned, depreciated and staffed by the same company that has to walk away from ' +
            'it. There is no supplier to renegotiate with.',
      sources: ['S&P Global Mobility', 'Company filings']
    },
    {
      id: 'driveline-c', name: 'Transmission and driveline', short: 'Driveline',
      shape: { x: 390, y: 80, w: 220, h: 146 },
      blurb: 'Eight to ten speeds, a torque converter, driveshafts and differentials.',
      bomPct: 11, layout: 'board',
      market: { size: 'USD ~78bn', year: 2025, basis: 'light vehicle transmission and driveline content value' },
      asOf: '2025', confidence: 'low',
      shares: [
        { c: 'Aisin', p: 17 }, { c: 'ZF', p: 14 }, { c: 'Jatco', p: 7 },
        { c: 'Magna', p: 6 }, { c: 'BorgWarner', p: 5 }
      ],
      note: 'Unlike engines, transmissions are genuinely bought in, ZF\'s eight-speed automatic has ' +
            'been fitted by half the premium industry, and Aisin supplies Toyota and most of its ' +
            'competitors. A multi-speed gearbox is one of the hardest things in the car to ' +
            'engineer and one of the first things an electric drivetrain throws away, which makes ' +
            'this the most directly threatened supplier position in the machine.',
      sources: ['Automotive News Top Suppliers', 'Company filings']
    },
    {
      id: 'exhaust-c', name: 'Exhaust and aftertreatment', short: 'Exhaust',
      shape: { x: 630, y: 80, w: 220, h: 146 },
      blurb: 'Manifold, catalytic converter, particulate filter and the silencer at the end.',
      bomPct: 5, layout: 'chain',
      market: { size: 'USD ~36bn', year: 2025, basis: 'light vehicle exhaust and aftertreatment system revenue' },
      asOf: '2025', confidence: 'low',
      shares: [
        { c: 'Tenneco', p: 24 }, { c: 'Forvia', p: 18 }, { c: 'Eberspächer', p: 12 },
        { c: 'Katcon', p: 5 }
      ],
      note: 'A category created by regulation and scheduled for deletion by it. Exhaust suppliers ' +
            'have been managing a declining asset for a decade while trying to buy their way into ' +
            'thermal management for electric vehicles: Tenneco went private with Apollo in 2022, ' +
            'which is what that transition looks like when the public markets stop funding it.',
      sources: ['Automotive News Top Suppliers', 'Company filings'],
      deals: [
        { y: 2022, a: 'Apollo Global Management', t: 'Tenneco', v: 'USD 7.1bn', n: 'Take-private of the largest exhaust supplier as combustion volumes began their decline.' }
      ]
    },

    /* ================ ROW 2 :: STRUCTURE AND CHASSIS ================ */
    {
      id: 'body-c', name: 'Body and structure', short: 'Body',
      shape: { x: 150, y: 268, w: 220, h: 146 },
      blurb: 'Stamped steel and cast aluminium welded and bonded into a body in white, then painted.',
      bomPct: 14, layout: 'board',
      market: { size: 'USD ~104bn', year: 2025, basis: 'light vehicle body structure and stamping content value' },
      asOf: '2025', confidence: 'low',
      shares: [
        { c: 'Magna', p: 9 }, { c: 'Gestamp', p: 7 }, { c: 'Benteler', p: 5 },
        { c: 'thyssenkrupp', p: 4 }
      ],
      note: 'The least outsourced part of a car and the most capital-intensive: a body shop is ' +
            'hundreds of robots and a press line costing more than most companies are worth, which ' +
            'is why carmakers keep it and why plant closures are so hard to reverse. Follow it ' +
            'down, though, and the metal itself comes from somewhere much narrower than the ' +
            'stamping does.',
      sources: ['Automotive News Top Suppliers', 'Company filings']
    },
    {
      id: 'chassis-c', name: 'Chassis, brakes and steering', short: 'Chassis',
      shape: { x: 390, y: 268, w: 220, h: 146 },
      blurb: 'Suspension, brakes, steering rack, wheels and tyres: everything between body and road.',
      bomPct: 12, layout: 'board',
      market: { size: 'USD ~92bn', year: 2025, basis: 'light vehicle chassis system content value' },
      asOf: '2025', confidence: 'low',
      shares: [
        { c: 'ZF', p: 13 }, { c: 'Bosch', p: 11 }, { c: 'Continental', p: 9 },
        { c: 'Aisin', p: 6 }, { c: 'Hyundai Mobis', p: 6 }
      ],
      note: 'Mature and unglamorous, and quietly the layer where the tier ones have most ' +
            'successfully defended their position. Braking in particular went from a mechanical ' +
            'part to a safety-critical electronic system, and the firms that made that transition, ' +
            'Bosch, ZF, Continental, turned a commodity into an engineering franchise nobody has ' +
            'displaced.',
      sources: ['Automotive News Top Suppliers', 'Company filings']
    },
    {
      id: 'thermal-c', name: 'Climate and cooling', short: 'Thermal',
      shape: { x: 630, y: 268, w: 220, h: 146 },
      blurb: 'Air conditioning, radiator, and the pumps and hoses that keep everything at temperature.',
      bomPct: 4, layout: 'board',
      market: { size: 'USD ~30bn', year: 2025, basis: 'light vehicle thermal management system revenue' },
      asOf: '2025', confidence: 'low',
      shares: [
        { c: 'Denso', p: 21 }, { c: 'Valeo', p: 16 }, { c: 'MAHLE', p: 11 },
        { c: 'Hanon Systems', p: 10 }, { c: 'Marelli', p: 5 }
      ],
      note: 'One of the few categories that gets *larger* in an electric car rather than smaller, ' +
            'because a battery has to be held in a narrow temperature band and there is no waste ' +
            'engine heat to do it with. Thermal suppliers are therefore the rare tier ones with a ' +
            'genuinely better position after the transition than before it.',
      sources: ['Automotive News Top Suppliers', 'Company filings']
    },

    /* =========== ROW 3 :: INTERIOR, ELECTRICAL AND BODY =========== */
    {
      id: 'electrical-c', name: 'Electrical and electronic', short: 'Electrical',
      shape: { x: 150, y: 456, w: 220, h: 158 },
      blurb: 'Fifty kilograms of harness, a hundred controllers, the infotainment stack and a lead-acid battery.',
      bomPct: 15, layout: 'board',
      market: { size: 'USD ~118bn', year: 2025, basis: 'light vehicle electrical and electronic content value' },
      asOf: '2025', confidence: 'low', chokepoint: true,
      shares: [
        { c: 'Bosch', p: 14 }, { c: 'Continental', p: 9 }, { c: 'Denso', p: 8 },
        { c: 'Aptiv', p: 7 }, { c: 'Hyundai Mobis', p: 5 }
      ],
      note: 'The fastest-growing share of a car\'s cost and the source of both production ' +
            'stoppages this decade: semiconductors in 2021, wiring harness in 2022. Electronics ' +
            'content has roughly doubled as a share of vehicle value in fifteen years, and the ' +
            'firms that supply it have become the ones setting what a car can actually do.',
      sources: ['Automotive News Top Suppliers', 'S&P Global Mobility']
    },
    {
      id: 'interior-c', name: 'Interior and safety', short: 'Interior',
      shape: { x: 390, y: 456, w: 220, h: 158 },
      blurb: 'Seats, instrument panel, trim, and the airbags and belts behind all of it.',
      bomPct: 14, layout: 'board',
      market: { size: 'USD ~106bn', year: 2025, basis: 'light vehicle interior and occupant safety content value' },
      asOf: '2025', confidence: 'low',
      shares: [
        { c: 'Adient', p: 12 }, { c: 'Lear', p: 11 }, { c: 'Forvia', p: 10 },
        { c: 'Magna', p: 7 }, { c: 'Toyota Boshoku', p: 5 }
      ],
      note: 'Seats alone are around half of this and are among the least glamorous, lowest-margin ' +
            'and most logistically demanding parts of the industry: they are bulky, endlessly ' +
            'variable and delivered in build sequence, several times a day, to a plant that cannot ' +
            'stockpile them. That operational difficulty is the moat: the product is simple and the ' +
            'delivery is not.',
      sources: ['Automotive News Top Suppliers', 'Company filings']
    },
    {
      id: 'exterior-c', name: 'Glass, lighting and trim', short: 'Exterior',
      shape: { x: 630, y: 456, w: 220, h: 158 },
      blurb: 'Glazing, headlamps, mirrors, bumpers and the exterior trim that carries the brand.',
      bomPct: 6, layout: 'board',
      market: { size: 'USD ~48bn', year: 2025, basis: 'light vehicle glazing, lighting and exterior trim revenue' },
      asOf: '2025', confidence: 'low',
      shares: [
        { c: 'Koito', p: 11 }, { c: 'Fuyao', p: 9 }, { c: 'Marelli', p: 8 },
        { c: 'Saint-Gobain', p: 7 }, { c: 'HELLA', p: 6 }
      ],
      note: 'Lighting is the interesting half. A headlamp went from a sealed beam costing a few ' +
            'dollars to an adaptive LED matrix module costing several hundred, and the Japanese ' +
            'and German specialists who made that transition now hold a category that used to be ' +
            'a commodity. It is one of the clearest examples in the car of value migrating into a ' +
            'part nobody used to think about.',
      sources: ['Automotive News Top Suppliers', 'Company filings']
    },
    {
      id: 'unpriced-c', name: 'Not separately priced', short: 'Unpriced',
      blurb: 'Fasteners, adhesives, fluids, sound deadening, logistics and the assembly labour itself.',
      bomPct: 4,
      market: { size: null, year: 2025, basis: 'residual share of vehicle build cost, not a market' },
      asOf: '2025', confidence: 'low',
      shares: [],
      note: 'A car contains several thousand fasteners and tens of kilograms of adhesive, sealant ' +
            'and sound deadening, none of which any published source splits by supplier. Inbound ' +
            'logistics belongs here too and is genuinely large: a modern plant runs on sequenced ' +
            'deliveries from hundreds of suppliers, and the coordination cost of that is real money ' +
            'attributed to nothing.',
      sources: ['S&P Global Mobility', 'Company filings']
    },

    /* ============================ META ============================ */
    {
      id: 'oem-c', name: 'Vehicle makers', short: 'Assemblers', kind: 'meta',
      blurb: 'Who puts it together and puts a badge on it.',
      market: { size: 'USD ~2.9tn', year: 2025, basis: 'light vehicle sales value, combustion and hybrid, by manufacturer group' },
      asOf: '2025', confidence: 'medium',
      shares: [
        { c: 'Toyota', p: 12 }, { c: 'Volkswagen Group', p: 9 }, { c: 'Hyundai-Kia', p: 8 },
        { c: 'Stellantis', p: 6 }, { c: 'General Motors', p: 6 }, { c: 'Ford', p: 5 },
        { c: 'Honda', p: 4 }, { c: 'Nissan', p: 3 }
      ],
      note: 'The most fragmented top layer on this site, no assembler reaches an eighth of the ' +
            'market, and the industry has spent forty years failing to consolidate past that. ' +
            'Toyota has led on volume and, unusually, on margin, having bet on hybrids while ' +
            'competitors went straight to battery electric. Note the basis: this is combustion and ' +
            'hybrid only, so the Chinese groups that dominate battery electric appear far smaller ' +
            'here than they do in the electric vehicle teardown.',
      sources: ['S&P Global Mobility', 'Company filings']
    },
    {
      id: 'tier1-c', name: 'Tier one suppliers', short: 'Tier ones', kind: 'meta',
      blurb: 'The two hundred firms that sell complete systems to the assemblers, and dwarf them in engineering headcount.',
      market: { size: 'USD ~1.1tn', year: 2025, basis: 'global original-equipment automotive parts revenue, top suppliers' },
      asOf: '2025', confidence: 'medium', chokepoint: true,
      shares: [
        { c: 'Bosch', p: 6 }, { c: 'Denso', p: 5 }, { c: 'ZF', p: 4 },
        { c: 'Magna', p: 4 }, { c: 'Continental', p: 3 }, { c: 'Aisin', p: 3 },
        { c: 'Hyundai Mobis', p: 3 }, { c: 'Forvia', p: 3 }
      ],
      note: 'No other device on this site has a formal supplier hierarchy with a published annual ' +
            'ranking, and that is the single most useful thing about automotive as a market to ' +
            'study. The shares look small because the denominator is every part of every car, but ' +
            'the structure is what matters: a carmaker buys systems from a couple of hundred tier ' +
            'ones, who buy from thousands of tier twos, who buy from a long tail nobody maps. Bosch ' +
            'books more automotive revenue than most carmakers earn in profit, and it is privately ' +
            'controlled by a charitable foundation, so it cannot be bought.',
      sources: ['Automotive News Top Suppliers', 'Company filings']
    },
    {
      id: 'dealers-c', name: 'Dealers and distribution', short: 'Dealers', kind: 'meta',
      blurb: 'The franchise network, and the legal structure that has protected it for eighty years.',
      market: { size: 'USD ~1.4tn', year: 2025, basis: 'new vehicle retail revenue, franchised dealers, global' },
      asOf: '2025', confidence: 'low',
      shares: [
        { c: 'Penske Automotive', p: 2 }, { c: 'AutoNation', p: 2 },
        { c: 'Lithia Motors', p: 2 }, { c: 'Emil Frey', p: 1 }
      ],
      note: 'Extraordinarily fragmented and legally defended: US franchise laws in most states ' +
            'prevent a manufacturer selling directly, which is why the direct-sales model arrived ' +
            'with new entrants rather than incumbents. Consolidation is running steadily: the ' +
            'listed US groups have been buying stores for two decades, but nobody is close to ' +
            'five percent, and the profit sits in service and finance rather than in the car.',
      sources: ['Automotive News Top Suppliers', 'Company filings']
    },
    {
      id: 'aftermarket-c', name: 'Parts aftermarket', short: 'Aftermarket', kind: 'meta',
      blurb: 'Everything sold for the car after it is sold, and a larger profit pool than building it.',
      market: { size: 'USD ~0.5tn', year: 2025, basis: 'light vehicle replacement parts and service revenue' },
      asOf: '2025', confidence: 'low', chokepoint: true,
      shares: [
        { c: 'Bosch', p: 4 }, { c: 'Denso', p: 3 }, { c: 'ZF', p: 3 },
        { c: 'Genuine Parts', p: 3 }, { c: 'LKQ', p: 3 }
      ],
      note: 'The part of the industry that actually makes money. A combustion car needs servicing ' +
            'for fifteen years and a long tail of wear parts (filters, brakes, belts, fluids) ' +
            'that an electric car largely does not, which is why the transition threatens dealer ' +
            'and aftermarket economics more than it threatens vehicle margin. The tier ones sell ' +
            'the same parts twice: once to the assembler at contract price, once to the aftermarket ' +
            'at retail.',
      sources: ['Automotive News Top Suppliers', 'Company filings']
    },

    /* ==================== ENGINE CHILDREN ==================== */
    {
      id: 'engine-block', name: 'Block, head and castings', short: 'Castings', parent: 'engine-c',
      blurb: 'Cast iron or aluminium block and head, machined to tolerances of a few microns.',
      market: { size: 'USD ~24bn', year: 2025, basis: 'light vehicle engine casting and machining revenue' },
      asOf: '2025', confidence: 'low',
      shares: [
        { c: 'Nemak', p: 12 }, { c: 'Tupy', p: 9 }, { c: 'Georg Fischer', p: 6 },
        { c: 'Ryobi', p: 4 }
      ],
      note: 'Aluminium engine casting is a consolidating business with a fixed end date, which is ' +
            'an unusual and difficult combination: Nemak and Tupy have both been repositioning ' +
            'toward structural and electric-vehicle castings using the same furnaces. The skill ' +
            'transfers; the volume does not arrive at the same rate it leaves.',
      sources: ['Company filings', 'Automotive News Top Suppliers']
    },
    {
      id: 'fuel-injection', name: 'Fuel injection', short: 'Injection', parent: 'engine-c',
      blurb: 'Direct injection at up to 350 bar, plus the pump, rail and injectors that survive it.',
      market: { size: 'USD ~21bn', year: 2025, basis: 'light vehicle fuel injection system revenue' },
      asOf: '2025', confidence: 'low', chokepoint: true,
      shares: [
        { c: 'Bosch', p: 37 }, { c: 'Denso', p: 21 }, { c: 'Delphi Technologies', p: 11 },
        { c: 'Vitesco', p: 8 }, { c: 'Marelli', p: 5 }
      ],
      note: 'The most concentrated layer in the powertrain, and the one that made modern emissions ' +
            'limits achievable. Bosch has held the leading position in diesel and petrol injection ' +
            'for decades on manufacturing tolerance rather than patent: it is watchmaking at ' +
            'automotive volume, and the barrier is that almost nobody else can hold the tolerance ' +
            'profitably.',
      sources: ['Automotive News Top Suppliers', 'Company filings']
    },
    {
      id: 'turbocharger', name: 'Turbocharger', short: 'Turbo', parent: 'engine-c',
      blurb: 'Variable geometry turbines spinning past 200,000 rpm in exhaust gas at 1,000°C.',
      market: { size: 'USD ~14bn', year: 2025, basis: 'light vehicle turbocharger revenue' },
      asOf: '2025', confidence: 'low',
      shares: [
        { c: 'Garrett Motion', p: 27 }, { c: 'BorgWarner', p: 25 },
        { c: 'Mitsubishi Heavy Industries', p: 12 }, { c: 'IHI', p: 10 }
      ],
      note: 'A tight four-firm oligopoly created by downsizing: emissions rules pushed engines ' +
            'smaller, and a smaller engine needs a turbo to keep its power, so a category that was ' +
            'once a performance option became near-universal fitment in about a decade. It is one ' +
            'of the cleanest cases on the site of regulation creating a market rather than ' +
            'constraining one.',
      sources: ['Automotive News Top Suppliers', 'Company filings']
    },
    {
      id: 'pistons-rings', name: 'Pistons, rings and bearings', short: 'Pistons', parent: 'engine-c',
      blurb: 'The reciprocating parts, and the plain bearings they run on.',
      market: { size: 'USD ~11bn', year: 2025, basis: 'engine reciprocating component and bearing revenue' },
      asOf: '2025', confidence: 'low',
      shares: [
        { c: 'MAHLE', p: 19 }, { c: 'Federal-Mogul', p: 14 }, { c: 'Riken', p: 8 },
        { c: 'Aisin', p: 5 }
      ],
      note: 'A genuinely old business with genuinely deep process knowledge, piston ring coatings ' +
            'and bearing metallurgy are the sort of thing that takes fifty years to learn and is ' +
            'never written down anywhere useful. It is also the purest example on this teardown of ' +
            'expertise that has nowhere to go: an electric motor has no reciprocating parts at all.',
      sources: ['Company filings', 'Automotive News Top Suppliers']
    },

    /* ==================== DRIVELINE CHILDREN ==================== */
    {
      id: 'transmission-c', name: 'Transmission', short: 'Gearbox', parent: 'driveline-c',
      blurb: 'Eight to ten planetary ratios, or a continuously variable belt, plus its control unit.',
      market: { size: 'USD ~52bn', year: 2025, basis: 'light vehicle transmission revenue' },
      asOf: '2025', confidence: 'low',
      shares: [
        { c: 'Aisin', p: 22 }, { c: 'ZF', p: 18 }, { c: 'Jatco', p: 10 },
        { c: 'Hyundai Transys', p: 7 }, { c: 'Magna', p: 5 }
      ],
      note: 'ZF\'s eight-speed automatic is one of the most widely licensed pieces of engineering ' +
            'in the industry, fitted by BMW, Jaguar Land Rover, Stellantis and others who compete ' +
            'fiercely everywhere else. That willingness to share a component while fighting over ' +
            'the car around it is characteristic of automotive and almost unheard of in consumer ' +
            'electronics.',
      sources: ['Automotive News Top Suppliers', 'Company filings']
    },
    {
      id: 'driveshafts', name: 'Driveshafts and axles', short: 'Shafts', parent: 'driveline-c',
      blurb: 'Constant velocity joints, halfshafts and the differential that lets wheels turn at different speeds.',
      market: { size: 'USD ~18bn', year: 2025, basis: 'light vehicle driveshaft and axle revenue' },
      asOf: '2025', confidence: 'low',
      shares: [
        { c: 'GKN Automotive', p: 24 }, { c: 'NTN', p: 14 }, { c: 'Nexteer', p: 8 },
        { c: 'American Axle', p: 7 }
      ],
      note: 'GKN has held the constant-velocity joint category for so long that the company predates ' +
            'the car, it made cannonballs in the eighteenth century. It is one of very few driveline ' +
            'positions that survives electrification intact, because an electric car still has to get ' +
            'torque to a wheel through a joint that bends while it spins.',
      sources: ['Automotive News Top Suppliers', 'Company filings']
    },
    {
      id: 'clutch-torque', name: 'Clutch and torque converter', short: 'Clutch', parent: 'driveline-c',
      blurb: 'The coupling between engine and gearbox: a friction plate, or a fluid turbine.',
      market: { size: 'USD ~9bn', year: 2025, basis: 'clutch and torque converter revenue' },
      asOf: '2025', confidence: 'low',
      shares: [
        { c: 'Schaeffler', p: 26 }, { c: 'Aisin', p: 17 }, { c: 'Valeo', p: 12 },
        { c: 'Exedy', p: 9 }
      ],
      note: 'Deleted outright by an electric drivetrain: there is no gearbox to disconnect from ' +
            'nothing. Schaeffler\'s dominance here is a good measure of how exposed a supplier can ' +
            'be to a single technical assumption holding: the company is excellent at this, and ' +
            'this is going away.',
      sources: ['Automotive News Top Suppliers', 'Company filings']
    },

    /* ==================== EXHAUST CHILDREN ==================== */
    {
      id: 'catalytic-conv', name: 'Catalytic converter', short: 'Catalyst', parent: 'exhaust-c',
      blurb: 'A ceramic honeycomb washcoated with platinum, palladium and rhodium.',
      layout: 'chain',
      market: { size: 'USD ~19bn', year: 2025, basis: 'light vehicle catalytic converter and coated substrate revenue' },
      asOf: '2025', confidence: 'medium', chokepoint: true,
      shares: [
        { c: 'BASF', p: 25 }, { c: 'Johnson Matthey', p: 24 }, { c: 'Umicore', p: 21 },
        { c: 'Cataler', p: 9 }
      ],
      note: 'Three chemical companies hold roughly seventy percent of the world\'s autocatalyst, and ' +
            'the value in the part is mostly the metal rather than the manufacture, which is why ' +
            'catalytic converter theft became a global crime wave when rhodium prices spiked. The ' +
            'substrate underneath is its own narrow business, with NGK and Corning supplying most ' +
            'of the world\'s ceramic honeycomb.',
      sources: ['Johnson Matthey PGM Market Report', 'Company filings']
    },
    {
      id: 'muffler-pipe', name: 'Manifold, pipe and silencer', short: 'Pipework', parent: 'exhaust-c',
      blurb: 'Stainless steel tube, flexible couplings and the acoustic tuning that decides how the car sounds.',
      market: { size: 'USD ~13bn', year: 2025, basis: 'exhaust manifold, pipe and silencer revenue' },
      asOf: '2025', confidence: 'low',
      shares: [
        { c: 'Tenneco', p: 26 }, { c: 'Forvia', p: 19 }, { c: 'Eberspächer', p: 13 },
        { c: 'Boysen', p: 6 }
      ],
      note: 'More engineering than it looks, exhaust note is tuned deliberately and is part of how ' +
            'a brand sounds, which is a genuine reason some buyers reject electric cars and a ' +
            'genuine reason manufacturers now synthesise engine noise through the speakers. The ' +
            'physical part is disappearing; the requirement it served is not.',
      sources: ['Automotive News Top Suppliers', 'Company filings']
    },
    {
      id: 'pgm-c', name: 'Platinum group metals', short: 'PGM', parent: 'catalytic-conv',
      /* Cross-linked to the tractor rather than re-derived. That teardown maps
         PGM refining and mining across three further tiers; repeating it here
         would make two flagships tell the same story. */
      upstream: ['exhaust-c'],
      blurb: 'Platinum, palladium and rhodium. The reason a catalytic converter is worth stealing.',
      market: { size: 'USD ~18bn', year: 2025, basis: 'primary PGM mine production value' },
      asOf: '2025', confidence: 'medium', chokepoint: true,
      shares: [
        { c: 'Valterra Platinum', p: 21 }, { c: 'Impala Platinum', p: 19 },
        { c: 'Sibanye-Stillwater', p: 17 }, { c: 'Nornickel', p: 16 },
        { c: 'Northam Platinum', p: 8 }
      ],
      note: 'Around seventy percent of world platinum and most of its rhodium comes out of one ' +
            'orebody in South Africa. This layer is deliberately shallow here: the tractor teardown ' +
            'follows the same chain down through refining to the mine in full, and duplicating it ' +
            'would tell the same story twice. What is worth noting from the car\'s side is scale, ' +
            'autocatalyst is the largest single use of PGMs on earth, so this is the demand that ' +
            'sets the price the tractor pays.',
      sources: ['USGS Mineral Commodity Summaries', 'Johnson Matthey PGM Market Report']
    },

    /* ==================== BODY CHILDREN ==================== */
    {
      id: 'stamping-c', name: 'Stamped steel', short: 'Stamping', parent: 'body-c',
      blurb: 'Advanced high strength and hot-formed steel, pressed into panels at thousands of tonnes.',
      market: { size: 'USD ~46bn', year: 2025, basis: 'automotive stamping and pressed component revenue' },
      asOf: '2025', confidence: 'low',
      shares: [
        { c: 'Gestamp', p: 14 }, { c: 'Magna', p: 11 }, { c: 'Benteler', p: 8 },
        { c: 'thyssenkrupp', p: 6 }
      ],
      note: 'Press tooling is the reason car platforms last seven years: a die set costs millions ' +
            'and takes a year to make, so the shape of the metal is committed long before the car ' +
            'is launched and cannot be meaningfully changed afterwards. It is the single biggest ' +
            'source of inertia in vehicle design.',
      sources: ['Automotive News Top Suppliers', 'Company filings']
    },
    {
      id: 'castings-c', name: 'Structural castings', short: 'Castings', parent: 'body-c',
      blurb: 'Large aluminium die castings replacing dozens of stamped and welded steel parts.',
      layout: 'chain',
      market: { size: 'USD ~28bn', year: 2025, basis: 'automotive aluminium structural casting revenue' },
      asOf: '2025', confidence: 'low', chokepoint: true,
      shares: [
        { c: 'Nemak', p: 11 }, { c: 'Georg Fischer', p: 8 }, { c: 'Ryobi', p: 6 },
        { c: 'Magna', p: 5 }
      ],
      note: 'The fastest-moving part of body engineering: very large single castings can replace ' +
            'seventy or eighty separate pressed parts and the robots that used to join them, which ' +
            'is a genuine step change in factory cost. It also increases aluminium content ' +
            'substantially, and every kilogram of automotive aluminium alloy carries several ' +
            'percent of an element from one country, which is where this chain goes next.',
      sources: ['Company filings', 'Automotive News Top Suppliers']
    },
    {
      id: 'paint-c', name: 'Paint and coatings', short: 'Paint', parent: 'body-c',
      blurb: 'Phosphate, e-coat, primer, base and clear: six passes through the most expensive building in the plant.',
      market: { size: 'USD ~11bn', year: 2025, basis: 'automotive OEM coatings revenue' },
      asOf: '2025', confidence: 'medium', chokepoint: true,
      shares: [
        { c: 'PPG', p: 24 }, { c: 'BASF Coatings', p: 21 }, { c: 'Axalta', p: 18 },
        { c: 'Kansai Paint', p: 11 }, { c: 'Nippon Paint', p: 8 }
      ],
      note: 'A concentrated, high-margin chemistry business hiding inside a car plant. The paint ' +
            'shop is the most energy-intensive and most capital-intensive part of vehicle assembly ' +
            'and the hardest to relocate, which is why a carmaker will keep an old plant open ' +
            'largely because it already has one. Four firms supply most of the world.',
      sources: ['Company filings', 'Automotive News Top Suppliers']
    },
    {
      id: 'sealing-c', name: 'Sealing and adhesives', short: 'Sealing', parent: 'body-c',
      blurb: 'Structural adhesive, seam sealer and the rubber that keeps water and noise out.',
      market: { size: 'USD ~14bn', year: 2025, basis: 'automotive sealing system and adhesive revenue' },
      asOf: '2025', confidence: 'low',
      shares: [
        { c: 'Cooper Standard', p: 13 }, { c: 'Toyoda Gosei', p: 11 },
        { c: 'Henkel', p: 9 }, { c: 'Sika', p: 7 }
      ],
      note: 'Structural adhesive quietly became load-bearing: modern bodies are bonded as much as ' +
            'welded, because glue joins dissimilar metals that cannot be spot welded together and ' +
            'stiffens the structure at the same time. It is a chemistry company selling into a ' +
            'metalworking process, and it is why a body shop now has as many adhesive robots as ' +
            'welding guns.',
      sources: ['Automotive News Top Suppliers', 'Company filings']
    },

    /* ---- the aluminium chain, four and five tiers down ---- */
    {
      id: 'aluminium-c', name: 'Aluminium and alloys', short: 'Aluminium', parent: 'castings-c',
      blurb: 'Rolled sheet and casting alloy. Around a fifth of a modern car by weight, and rising.',
      layout: 'chain',
      market: { size: 'USD ~180bn', year: 2025, basis: 'primary aluminium production value, all applications' },
      asOf: '2025', confidence: 'medium',
      shares: [
        { c: 'China (all firms combined)', p: 59 }, { c: 'Chalco', p: 8 },
        { c: 'Norsk Hydro', p: 4 }, { c: 'Alcoa', p: 3 }, { c: 'Novelis', p: 3 }
      ],
      note: 'China smelts well over half the world\'s aluminium, which is a familiar shape by now. ' +
            'The unfamiliar part is one layer further down: an automotive aluminium alloy is not ' +
            'pure aluminium. It contains a few percent of magnesium, without which it will not ' +
            'form, will not weld and will not hold the strength the body engineer specified, and ' +
            'the magnesium market is very much narrower than this one.',
      sources: ['USGS Mineral Commodity Summaries', 'European Aluminium']
    },
    {
      id: 'magnesium-c', name: 'Magnesium', short: 'Magnesium', parent: 'aluminium-c',
      blurb: 'An alloying element at roughly five percent of automotive aluminium, and a structural die casting in its own right.',
      layout: 'chain',
      market: { size: 'USD ~5bn', year: 2025, basis: 'primary magnesium metal production value, all applications' },
      asOf: '2025', confidence: 'medium', chokepoint: true,
      shares: [
        { c: 'China (all firms combined)', p: 87 }, { c: 'Magontec', p: 3 },
        { c: 'US Magnesium', p: 2 }
      ],
      note: 'The deepest dependency in this machine, and it appears in no bill of materials because ' +
            'it is not a part. China produces something close to ninety percent of the world\'s ' +
            'magnesium, and Europe sources roughly ninety-seven percent of its supply from there. ' +
            'When Chinese output was curtailed in late 2021, European aluminium trade bodies warned ' +
            'publicly of catastrophic consequences for the whole value chain, not because ' +
            'magnesium is expensive, but because there is no aluminium alloy without it and there ' +
            'was, at the time, about eight weeks of stock in Europe.',
      sources: ['USGS Mineral Commodity Summaries', 'European Aluminium']
    },
    {
      id: 'mg-smelting', name: 'Magnesium smelting', short: 'Smelting', parent: 'magnesium-c',
      blurb: 'The Pidgeon process: dolomite reduced with ferrosilicon in retorts, largely in one Chinese province.',
      market: { size: 'USD ~3bn', year: 2025, basis: 'magnesium smelting capacity value, by process and location' },
      asOf: '2025', confidence: 'low', chokepoint: true,
      shares: [
        { c: 'China (all firms combined)', p: 89 }, { c: 'Israel (all producers)', p: 3 },
        { c: 'Brazil (all producers)', p: 2 }
      ],
      note: 'The bottom of this teardown, and it is a *process* concentrated in a *place*. Most of ' +
            'the world\'s magnesium is made by the Pidgeon process, which is energy-hungry, ' +
            'coal-fired and heavily concentrated in Shaanxi province, so magnesium supply moves ' +
            'with Chinese electricity policy rather than with demand for cars. That is why the 2021 ' +
            'shortage arrived with no warning from any automotive indicator: the signal was in a ' +
            'provincial power curtailment order, and nobody in the industry was reading those.',
      sources: ['USGS Mineral Commodity Summaries', 'European Aluminium']
    },

    /* ==================== CHASSIS CHILDREN ==================== */
    {
      id: 'suspension-c', name: 'Suspension', short: 'Suspension', parent: 'chassis-c',
      blurb: 'Struts, dampers, springs, bushings and the subframes that carry them.',
      market: { size: 'USD ~34bn', year: 2025, basis: 'light vehicle suspension system revenue' },
      asOf: '2025', confidence: 'low',
      shares: [
        { c: 'ZF', p: 15 }, { c: 'Tenneco', p: 12 }, { c: 'KYB', p: 9 },
        { c: 'Hitachi Astemo', p: 8 }, { c: 'Magna', p: 5 }
      ],
      note: 'Increasingly electronic: adaptive dampers turned a purely mechanical part into a ' +
            'controlled system, and the suppliers who made that jump kept the category while the ' +
            'ones who did not became commodity spring makers. A recurring pattern across this whole ' +
            'teardown: the tier ones that survived added a control loop to something mechanical.',
      sources: ['Automotive News Top Suppliers', 'Company filings']
    },
    {
      id: 'brakes-c', name: 'Brakes', short: 'Brakes', parent: 'chassis-c',
      blurb: 'Calipers, discs, pads and the electronic stability control that decides when to use them.',
      market: { size: 'USD ~31bn', year: 2025, basis: 'light vehicle braking system revenue' },
      asOf: '2025', confidence: 'medium', chokepoint: true,
      shares: [
        { c: 'Bosch', p: 22 }, { c: 'Continental', p: 18 }, { c: 'ZF', p: 14 },
        { c: 'Hitachi Astemo', p: 8 }, { c: 'Brembo', p: 6 }
      ],
      note: 'One of the most concentrated systems in the car, and a genuine safety-critical ' +
            'chokepoint: anti-lock braking and stability control are legally mandated in most ' +
            'markets and supplied by three firms. A carmaker cannot ship a vehicle in Europe or ' +
            'North America without a system from a very short list, which gives those suppliers a ' +
            'negotiating position nothing else in the chassis has.',
      sources: ['Automotive News Top Suppliers', 'Company filings']
    },
    {
      id: 'steering-c', name: 'Steering', short: 'Steering', parent: 'chassis-c',
      blurb: 'Electric power assisted rack and column, and the actuator every driver-assistance feature steers through.',
      market: { size: 'USD ~22bn', year: 2025, basis: 'light vehicle steering system revenue' },
      asOf: '2025', confidence: 'low', chokepoint: true,
      shares: [
        { c: 'Bosch', p: 20 }, { c: 'JTEKT', p: 17 }, { c: 'Nexteer', p: 13 },
        { c: 'ZF', p: 11 }, { c: 'Hyundai Mobis', p: 7 }
      ],
      note: 'Quietly one of the most strategic parts in a modern car. Every lane-keeping and ' +
            'self-parking function in the industry works by commanding the electric steering rack, ' +
            'so whoever supplies steering holds the actuator that driver assistance depends on. ' +
            'It is the same lesson as the tractor\'s hydraulics: guidance is worth nothing without ' +
            'something to move the wheels.',
      sources: ['Automotive News Top Suppliers', 'Company filings']
    },
    {
      id: 'wheels-tyres-c', name: 'Wheels and tyres', short: 'Wheels', parent: 'chassis-c',
      blurb: 'Cast or forged aluminium wheels, and four contact patches the size of a hand each.',
      market: { size: 'USD ~130bn', year: 2025, basis: 'light vehicle tyre and wheel revenue, original equipment and replacement' },
      asOf: '2025', confidence: 'medium',
      shares: [
        { c: 'Michelin', p: 15 }, { c: 'Bridgestone', p: 14 }, { c: 'Goodyear', p: 8 },
        { c: 'Continental', p: 7 }, { c: 'Sumitomo Rubber', p: 4 }, { c: 'Pirelli', p: 4 }
      ],
      note: 'The tyre is the only part of the car that touches the road and one of the very few ' +
            'that a buyer replaces several times, which makes the replacement market larger than ' +
            'the original-equipment one and much more profitable. The natural rubber chain ' +
            'underneath is mapped in depth on the tractor teardown, where a large agricultural ' +
            'casing depends on it far more acutely than a car tyre does.',
      sources: ['Company filings', 'Tire Business']
    },

    /* ==================== ELECTRICAL CHILDREN ==================== */
    {
      id: 'harness-c', name: 'Wiring harness', short: 'Harness', parent: 'electrical-c',
      blurb: 'Up to fifty kilograms and three kilometres of wire, cut, crimped and taped largely by hand.',
      layout: 'chain',
      market: { size: 'USD ~68bn', year: 2025, basis: 'light vehicle wiring harness revenue' },
      asOf: '2025', confidence: 'medium', chokepoint: true,
      shares: [
        { c: 'Yazaki', p: 26 }, { c: 'Sumitomo Electric', p: 23 }, { c: 'Aptiv', p: 15 },
        { c: 'Leoni', p: 7 }, { c: 'Furukawa Electric', p: 6 }
      ],
      note: 'The single most instructive component on this teardown. A harness is cheap, low ' +
            'technology, and completely bespoke to one vehicle: it cannot be substituted, ' +
            'stockpiled economically, or automated, because the bundles are floppy and every trim ' +
            'level is different. Two Japanese firms hold half the world market. It is not the ' +
            'expensive part of a car and it is the part most able to stop one being built.',
      sources: ['Automotive News Top Suppliers', 'Company filings']
    },
    {
      id: 'ecu-c', name: 'Electronic control units', short: 'ECUs', parent: 'electrical-c',
      blurb: 'Seventy to a hundred networked controllers, from the engine management down to the seat memory.',
      layout: 'chain',
      market: { size: 'USD ~44bn', year: 2025, basis: 'light vehicle electronic control unit revenue' },
      asOf: '2025', confidence: 'low',
      shares: [
        { c: 'Bosch', p: 19 }, { c: 'Continental', p: 13 }, { c: 'Denso', p: 12 },
        { c: 'Aptiv', p: 8 }, { c: 'Marelli', p: 5 }
      ],
      note: 'The number of separate controllers is the problem the whole industry is trying to ' +
            'solve: a hundred boxes from a dozen suppliers, each with its own software, is why a ' +
            'car cannot be updated the way a phone can. The move to a handful of zonal computers is ' +
            'the biggest architectural change in the car since fuel injection, and it threatens the ' +
            'tier ones whose position rests on owning one box each.',
      sources: ['Automotive News Top Suppliers', 'Company filings']
    },
    {
      id: 'infotainment-c', name: 'Infotainment and cluster', short: 'Infotainment', parent: 'electrical-c',
      blurb: 'The centre screen, the instrument cluster, and the phone projection everyone actually uses.',
      market: { size: 'USD ~34bn', year: 2025, basis: 'light vehicle infotainment and display system revenue' },
      asOf: '2025', confidence: 'low',
      shares: [
        { c: 'Harman', p: 14 }, { c: 'Panasonic', p: 11 }, { c: 'LG Electronics', p: 10 },
        { c: 'Bosch', p: 8 }, { c: 'Continental', p: 7 }
      ],
      note: 'The layer where the car industry lost a fight it did not realise it was in. Buyers ' +
            'overwhelmingly use phone projection rather than the manufacturer\'s own interface, ' +
            'which means the most-used software in most cars is written by Apple or Google and the ' +
            'carmaker supplies a screen for it. Several manufacturers have tried to refuse it and ' +
            'nearly all have backed down.',
      sources: ['Automotive News Top Suppliers', 'Company filings']
    },
    {
      id: 'battery-12v', name: 'Low-voltage battery', short: '12V battery', parent: 'electrical-c',
      blurb: 'The lead-acid battery that starts the engine: still fitted to electric cars too.',
      market: { size: 'USD ~26bn', year: 2025, basis: 'automotive lead-acid battery revenue, original equipment and replacement' },
      asOf: '2025', confidence: 'low',
      shares: [
        { c: 'Clarios', p: 30 }, { c: 'Exide', p: 9 }, { c: 'GS Yuasa', p: 8 },
        { c: 'East Penn', p: 7 }
      ],
      note: 'A remarkably durable business: the lead-acid battery is nineteenth-century technology, ' +
            'has been declared obsolete for thirty years, and is still fitted to essentially every ' +
            'vehicle including battery electric ones, because something has to run the door locks ' +
            'when the main system is asleep. Clarios was carved out of Johnson Controls by ' +
            'Brookfield in 2019 for USD 13.2bn: an unusually large sponsor bet on a mature product.',
      sources: ['Company filings', 'Automotive News Top Suppliers'],
      deals: [
        { y: 2019, a: 'Brookfield and CDPQ', t: 'Johnson Controls Power Solutions (now Clarios)', v: 'USD 13.2bn', n: 'One of the largest automotive carve-outs on record, for a lead-acid battery business.' }
      ]
    },
    {
      id: 'harness-labour', name: 'Harness assembly labour', short: 'Harness labour', parent: 'harness-c',
      blurb: 'Tens of thousands of people cutting, crimping and taping wire in low-cost countries near the plants they serve.',
      market: { size: null, year: 2025, basis: 'geographic concentration of harness assembly employment: a labour footprint, not a market' },
      asOf: '2025', confidence: 'medium', chokepoint: true,
      shares: [],
      note: 'Not a market, and the clearest chokepoint on the teardown. Harness assembly resists ' +
            'automation, so it is done by hand wherever wages are low and freight to the assembly ' +
            'plant is short: Morocco and Tunisia for Europe, Mexico for North America, and, until ' +
            '2022: western Ukraine, which had seventeen harness plants. When those shut, ' +
            'Volkswagen, BMW, Mercedes and Porsche idled European factories within weeks and ' +
            'analysts put ten to fifteen percent of the region\'s output at risk. Production moved ' +
            'to North Africa, but a harness cannot be re-sourced quickly: the tooling is ' +
            'vehicle-specific and the people have to be trained.',
      sources: ['S&P Global Mobility', 'Company statements']
    },
    {
      id: 'auto-semi', name: 'Automotive semiconductors', short: 'Semis', parent: 'ecu-c',
      blurb: 'Microcontrollers, analog and power devices, mostly on processes two decades old.',
      market: { size: 'USD ~76bn', year: 2025, basis: 'automotive semiconductor revenue, all applications' },
      asOf: '2025', confidence: 'medium', chokepoint: true,
      shares: [
        { c: 'Infineon', p: 14 }, { c: 'NXP', p: 11 }, { c: 'STMicroelectronics', p: 10 },
        { c: 'Texas Instruments', p: 9 }, { c: 'Renesas', p: 9 }, { c: 'Bosch', p: 7 }
      ],
      note: 'The 2021 shortage was not a shortage of advanced chips. It was a shortage of cheap ' +
            'mature-node parts that carmakers had cancelled at the start of the pandemic and could ' +
            'not get back in the queue for, because the same capacity had been reallocated to ' +
            'consumer electronics buying far more of it. A car needs a few hundred dollars of ' +
            'silicon and cannot ship without any of it: an asymmetry the industry had never priced ' +
            'and has been trying to fix with direct foundry contracts ever since.',
      sources: ['Company filings', 'S&P Global Mobility']
    },

    /* ==================== INTERIOR CHILDREN ==================== */
    {
      id: 'seats-c', name: 'Seats', short: 'Seats', parent: 'interior-c',
      blurb: 'Frame, foam, trim, heating, ventilation and motors: delivered in build sequence several times a day.',
      market: { size: 'USD ~58bn', year: 2025, basis: 'light vehicle seating system revenue' },
      asOf: '2025', confidence: 'medium',
      shares: [
        { c: 'Adient', p: 24 }, { c: 'Lear', p: 22 }, { c: 'Toyota Boshoku', p: 10 },
        { c: 'Magna', p: 8 }, { c: 'Forvia', p: 7 }
      ],
      note: 'A duopoly in an unglamorous category, protected by logistics rather than technology. ' +
            'Seats are too bulky to stockpile and too variable to batch, so they arrive at the line ' +
            'in the exact order the cars are being built, usually from a plant within an hour of it. ' +
            'That requirement, not the product, is what keeps two firms holding half the world.',
      sources: ['Automotive News Top Suppliers', 'Company filings']
    },
    {
      id: 'cockpit-c', name: 'Instrument panel and cockpit', short: 'Cockpit', parent: 'interior-c',
      blurb: 'The moulded dashboard, the cross-car beam behind it, and everything mounted to both.',
      market: { size: 'USD ~26bn', year: 2025, basis: 'light vehicle cockpit and instrument panel module revenue' },
      asOf: '2025', confidence: 'low',
      shares: [
        { c: 'Forvia', p: 17 }, { c: 'Yanfeng', p: 15 }, { c: 'Marelli', p: 9 },
        { c: 'Hyundai Mobis', p: 8 }
      ],
      note: 'Yanfeng is the largest Chinese automotive supplier by some distance and barely known ' +
            'outside the industry, which is a reasonable measure of how much of this business has ' +
            'moved without anyone noticing. The cockpit module is also where the tier one integrates ' +
            'other people\'s parts, so it is a systems-integration franchise as much as a moulding ' +
            'one.',
      sources: ['Automotive News Top Suppliers', 'Company filings']
    },
    {
      id: 'trim-c', name: 'Trim, carpet and headliner', short: 'Trim', parent: 'interior-c',
      blurb: 'Door panels, pillars, carpet, headliner and the acoustic material behind all of it.',
      market: { size: 'USD ~19bn', year: 2025, basis: 'light vehicle interior trim and acoustic material revenue' },
      asOf: '2025', confidence: 'low',
      shares: [
        { c: 'Forvia', p: 12 }, { c: 'Adler Pelzer', p: 9 }, { c: 'Autoneum', p: 8 },
        { c: 'Yanfeng', p: 7 }
      ],
      note: 'Half of this is acoustics rather than decoration: a quiet cabin is engineered with ' +
            'mass, absorption and damping distributed through the trim, and it is one of the ' +
            'clearest measurable differences between a cheap car and an expensive one. Electric ' +
            'vehicles have made it harder, not easier: with no engine noise to mask it, road and ' +
            'wind noise become audible.',
      sources: ['Automotive News Top Suppliers', 'Company filings']
    },
    {
      id: 'airbags-c', name: 'Airbags and restraints', short: 'Airbags', parent: 'interior-c',
      blurb: 'Eight to ten bags, the belts and pretensioners, and the crash sensing that fires them in milliseconds.',
      layout: 'chain',
      market: { size: 'USD ~28bn', year: 2025, basis: 'light vehicle occupant restraint system revenue' },
      asOf: '2025', confidence: 'medium', chokepoint: true,
      shares: [
        { c: 'Autoliv', p: 42 }, { c: 'Joyson Safety', p: 21 }, { c: 'ZF', p: 15 },
        { c: 'Toyoda Gosei', p: 7 }
      ],
      note: 'The most concentrated system in the car, and the concentration is a direct result of a ' +
            'failure. Takata\'s ammonium nitrate inflators degraded in humidity and fired with ' +
            'enough force to kill; the recall reached roughly a hundred million vehicles, the ' +
            'largest in automotive history, and the company went bankrupt in 2017. Its assets ' +
            'became Joyson Safety. A three-firm market became a two-and-a-half-firm one because ' +
            'one of them made a chemistry choice that took twenty years to reveal itself.',
      sources: ['Automotive News Top Suppliers', 'Company filings'],
      deals: [
        { y: 2018, a: 'Ningbo Joyson', t: 'Takata (assets)', v: 'USD 1.6bn', n: 'Bought the operating business out of the largest recall bankruptcy in automotive history; became Joyson Safety Systems.' }
      ]
    },
    {
      id: 'inflator-c', name: 'Inflator and propellant', short: 'Inflator', parent: 'airbags-c',
      blurb: 'A small pyrotechnic charge that must fire correctly after fifteen years in a hot car, and never otherwise.',
      market: { size: 'USD ~6bn', year: 2025, basis: 'airbag inflator and propellant revenue' },
      asOf: '2025', confidence: 'low', chokepoint: true,
      shares: [
        { c: 'Autoliv', p: 38 }, { c: 'Joyson Safety', p: 24 }, { c: 'ZF', p: 14 },
        { c: 'Daicel', p: 11 }
      ],
      note: 'The hardest reliability problem in the car and the reason the layer above it is so ' +
            'concentrated. An inflator sits in a dashboard through fifteen summers and has to ' +
            'deploy in about thirty milliseconds when asked and never when not, which is a ' +
            'specification closer to munitions than to automotive. Takata\'s failure was precisely ' +
            'here, in the propellant chemistry rather than in the bag, and it is why nobody new has ' +
            'entered this business since.',
      sources: ['Company filings', 'Automotive News Top Suppliers']
    },

    /* ============ EXTERIOR AND THERMAL CHILDREN ============ */
    {
      id: 'glass-c', name: 'Glazing', short: 'Glass', parent: 'exterior-c',
      blurb: 'Laminated windscreen and tempered side glass, increasingly with coatings, heating and antennas in it.',
      market: { size: 'USD ~24bn', year: 2025, basis: 'automotive glazing revenue' },
      asOf: '2025', confidence: 'medium', chokepoint: true,
      shares: [
        { c: 'Fuyao', p: 26 }, { c: 'Saint-Gobain', p: 20 }, { c: 'AGC', p: 17 },
        { c: 'NSG', p: 12 }, { c: 'Xinyi Glass', p: 8 }
      ],
      note: 'Four firms supply most of the world\'s automotive glass, and Fuyao took the leading ' +
            'position from the European and Japanese incumbents within about two decades. A ' +
            'windscreen is also no longer just glass: it carries the camera for driver assistance, ' +
            'heating elements, acoustic interlayers and antennas, which is why replacing one now ' +
            'requires recalibrating the car.',
      sources: ['Company filings', 'Automotive News Top Suppliers']
    },
    {
      id: 'lighting-c', name: 'Lighting', short: 'Lighting', parent: 'exterior-c',
      blurb: 'Adaptive LED matrix headlamps: a category that went from commodity to several hundred dollars a corner.',
      market: { size: 'USD ~32bn', year: 2025, basis: 'light vehicle lighting revenue' },
      asOf: '2025', confidence: 'medium',
      shares: [
        { c: 'Koito', p: 23 }, { c: 'Marelli', p: 16 }, { c: 'HELLA', p: 14 },
        { c: 'Valeo', p: 12 }, { c: 'Stanley Electric', p: 9 }
      ],
      note: 'One of the great quiet value migrations in the car. A sealed-beam headlamp was a ' +
            'commodity worth a few dollars; an adaptive matrix LED unit is a controlled optical ' +
            'system worth several hundred, and it is also now a styling signature that brands ' +
            'compete on directly. The five firms that own it are the same ones that owned the ' +
            'commodity version, which is unusual, normally a technology shift changes the ' +
            'supplier list.',
      sources: ['Automotive News Top Suppliers', 'Company filings']
    },
    {
      id: 'mirrors-trim', name: 'Mirrors and exterior trim', short: 'Mirrors', parent: 'exterior-c',
      blurb: 'Mirrors, bumpers, grilles and the brightwork that carries most of a brand\'s visual identity.',
      market: { size: 'USD ~16bn', year: 2025, basis: 'exterior mirror and trim component revenue' },
      asOf: '2025', confidence: 'low',
      shares: [
        { c: 'Magna', p: 18 }, { c: 'Gentex', p: 14 }, { c: 'Motherson', p: 11 },
        { c: 'Ficosa', p: 8 }
      ],
      note: 'Gentex is worth a look as a business: it holds most of the world market for ' +
            'auto-dimming mirrors on an electrochromic technology it has defended for decades, and ' +
            'earns software-like margins on a piece of glass. Motherson, meanwhile, built a global ' +
            'position from India largely by acquisition, and is one of the few genuinely successful ' +
            'roll-ups in automotive componentry.',
      sources: ['Automotive News Top Suppliers', 'Company filings']
    },
    {
      id: 'hvac-c', name: 'Air conditioning', short: 'HVAC', parent: 'thermal-c',
      blurb: 'Compressor, condenser, evaporator and the module that blends and directs the air.',
      market: { size: 'USD ~21bn', year: 2025, basis: 'light vehicle HVAC system revenue' },
      asOf: '2025', confidence: 'low',
      shares: [
        { c: 'Denso', p: 25 }, { c: 'Valeo', p: 18 }, { c: 'Hanon Systems', p: 14 },
        { c: 'MAHLE', p: 10 }
      ],
      note: 'A concentrated Japanese, French and Korean category, and one of the few that grows ' +
            'with electrification: a heat pump for an electric car is a considerably more valuable ' +
            'piece of equipment than a belt-driven compressor, because it has to heat the cabin ' +
            'without an engine to borrow warmth from.',
      sources: ['Automotive News Top Suppliers', 'Company filings']
    },
    {
      id: 'cooling-c', name: 'Engine cooling', short: 'Cooling', parent: 'thermal-c',
      blurb: 'Radiator, water pump, thermostat, fans and hoses: the loop that keeps combustion survivable.',
      market: { size: 'USD ~13bn', year: 2025, basis: 'engine cooling system revenue' },
      asOf: '2025', confidence: 'low',
      shares: [
        { c: 'MAHLE', p: 17 }, { c: 'Denso', p: 15 }, { c: 'Valeo', p: 11 },
        { c: 'Hanon Systems', p: 8 }
      ],
      note: 'A combustion engine converts roughly two thirds of its fuel energy into heat that has ' +
            'to be thrown away, and this is the system that throws it. It shrinks dramatically in ' +
            'an electric car, which is the mirror image of the air conditioning line above it, ' +
            'the same suppliers, one category growing and one shrinking, which is why the thermal ' +
            'firms have handled the transition better than the exhaust ones.',
      sources: ['Automotive News Top Suppliers', 'Company filings']
    }
  ]
});
