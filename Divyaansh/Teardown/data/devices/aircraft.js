/* Teardown :: commercial aircraft */
TD.device({
  id: 'aircraft',
  name: 'Commercial aircraft',
  icon: 'aircraft',
  category: 'Aerospace and defence',
  tagline: 'Two airframers, two engine makers, and a fuselage that just came back in house.',
  unit: { volume: '~1,400 narrowbody deliveries (2025, combined)', price: 'USD ~120m list, narrowbody' },
  intro: 'Narrowbody class: 737 MAX and A320neo family, the highest-volume, most relevant segment. Two of ' +
         'this device\'s layers are as tightly measured as anything else on this site: who assembles the plane, ' +
         'and who builds the engine. Most of what actually makes up the airframe is a genuine industrial ' +
         'structure with named suppliers and real M&A, but no publisher tracks a clean ownership percentage for ' +
         'it: those parts are still shown here, named and placed, rather than left off the model.',
  view: { w: 1000, h: 800 },
  /* Build order for the "How this device is built" strip. A grouping of the
     components below, nothing more, no supplier or figure originates here. */
  stages: [
    { id: 'structures', name: 'Airframe structures',
      note: 'The barrel and the wings. Boeing spent twenty years outsourcing this layer and ' +
            'reversed the decision in 2025.',
      nodes: ['fuselage', 'wings'] },
    { id: 'propulsion', name: 'Propulsion',
      note: 'The best-measured layer on the aircraft after final assembly, and the other real duopoly.',
      nodes: ['engines', 'apu'] },
    { id: 'systems', name: 'Systems',
      note: 'Flight controls, power, hydraulics and gear. Named suppliers throughout, but no ' +
            'published ownership percentages.',
      nodes: ['avionics', 'hydraulics', 'ecs', 'landing-gear'] },
    { id: 'cabin', name: 'Cabin',
      note: 'Seats, galleys and interior systems: bought by the airline as often as by the airframer.',
      nodes: ['interiors'] },
    { id: 'final', name: 'Final assembly',
      note: 'Two companies. No third entrant has reached this tier in decades.',
      nodes: ['airframer'] }
  ],
  nodes: [
    {
      id: 'airframer', name: 'Final assembly', short: 'Airframer',
      shape: { x: 150, y: 90, w: 330, h: 170 },
      blurb: 'Where the whole aircraft comes together: a duopoly, and has been for decades.',
      bomPct: 15,
      market: { size: '1,005 combined narrowbody orders', year: 2025, basis: 'narrowbody order share, 2025' },
      asOf: '2025', confidence: 'high', chokepoint: true,
      shares: [ { c: 'Airbus', p: 54 }, { c: 'Boeing', p: 46 } ],
      note: 'The A320neo family recently passed the 737 as the most-delivered jetliner in history, roughly 60% ' +
            'of the installed narrowbody fleet against the 737 MAX\'s 40%. On 2025 orders specifically Airbus ' +
            'led 544 to 461. Two companies, both multi-decade national-champion industrial projects, no third ' +
            'entrant has broken into this tier since the regional jet makers stopped trying.',
      sources: ['Company filings'],
      deals: []
    },
    {
      id: 'engines', name: 'Jet engines', short: 'Engines',
      shape: { x: 520, y: 90, w: 330, h: 170 },
      blurb: 'The other genuine duopoly on this aircraft, and the second-best measured layer after the airframer itself.',
      bomPct: 12,
      market: { size: 'USD ~28.6bn', year: 2025, basis: 'narrowbody engine market revenue' },
      asOf: '2025', confidence: 'high', chokepoint: true,
      shares: [ { c: 'CFM International', p: 62 }, { c: 'Pratt & Whitney', p: 35 } ],
      note: 'CFM (the GE Aerospace and Safran joint venture) has 100% of 737 MAX engine share: Boeing offers no ' +
            'alternative, plus roughly 55% selection rate on the A320neo against Pratt & Whitney\'s geared ' +
            'turbofan, which is why CFM\'s blended share runs well above its A320neo-only number.',
      sources: ['Company filings']
    },
    {
      id: 'fuselage', name: 'Fuselage structures', short: 'Fuselage',
      shape: { x: 150, y: 280, w: 330, h: 170 },
      blurb: 'The main structural barrel of the aircraft, and the subject of the most consequential aerospace deal of 2025.',
      market: { size: 'not sized separately', year: 2025, basis: 'no clean ownership percentage published for this layer' },
      asOf: '2025', confidence: 'medium', chokepoint: true,
      note: 'No share table exists, but the structure of this market changed completely in 2025. Boeing closed ' +
            'an $8.3bn deal in December 2025 to reacquire Spirit AeroSystems: the company it spun the 737 ' +
            'fuselage business out to twenty years earlier, for $4.7bn of Boeing-related operations, with ' +
            'Airbus simultaneously buying the Spirit assets that supply Airbus programmes. Spirit also built ' +
            'major structures for the 767, 777 and 787. Twenty years of outsourcing this layer just ended.',
      sources: ['Company filings'],
      deals: [
        { y: 2025, a: 'Boeing', t: 'Spirit AeroSystems (Boeing operations)', v: 'USD 4.7bn (USD 8.3bn total deal incl. Airbus\'s share)', n: 'Ended two decades of outsourced 737 fuselage production. Airbus simultaneously acquired the Spirit operations that supply it.' },
        { y: 2005, a: 'Onex / Spirit AeroSystems', t: 'Boeing Wichita division', v: 'USD 900m', n: 'The original spinout that created the outsourced structure Boeing just reversed.' }
      ]
    },
    {
      id: 'wings', name: 'Wings', short: 'Wings',
      shape: { x: 520, y: 280, w: 330, h: 170 },
      blurb: 'Structurally distinct from the fuselage, and geographically distinct from final assembly too.',
      market: { size: 'not sized', year: 2025, basis: 'not applicable' },
      asOf: '2025', confidence: 'low',
      note: 'No share data found. Airbus builds its wings in Broughton, Wales: a genuinely separate national ' +
            'supply chain from French final assembly. Mitsubishi Heavy Industries has historically supplied ' +
            'composite wing structures for Boeing\'s 787 programme. Named for the geography, not a measured market.'
    },
    {
      id: 'landing-gear', name: 'Landing gear', short: 'Landing gear',
      shape: { x: 150, y: 470, w: 220, h: 160 },
      blurb: 'The legs, wheels and retraction mechanism the aircraft actually lands on.',
      market: { size: 'USD ~5.47bn', year: 2025, basis: 'commercial aircraft landing gear market' },
      asOf: '2025', confidence: 'low',
      note: 'No per-company share found. Named suppliers: Safran, Collins Aerospace, Liebherr, Héroux-Devtek, ' +
            'Honeywell, Triumph Group and GKN Aerospace. Main-gear assemblies are roughly 75% of category ' +
            'revenue; narrowbody aircraft make up about two thirds of the whole market.',
      sources: ['Company filings']
    },
    {
      id: 'avionics', name: 'Avionics and flight controls', short: 'Avionics',
      shape: { x: 390, y: 470, w: 220, h: 160 },
      blurb: 'The flight computers, displays and control electronics that fly the aircraft.',
      market: { size: 'not sized separately', year: 2025, basis: 'not applicable' },
      asOf: '2025', confidence: 'low',
      note: 'No per-company share found. Named suppliers: Honeywell, Collins Aerospace, Thales, Garmin and ' +
            'L3Harris. Thales is specifically documented as a major A320neo avionics supplier.',
      sources: ['Company filings']
    },
    {
      id: 'interiors', name: 'Interiors and seats', short: 'Interiors',
      shape: { x: 630, y: 470, w: 220, h: 160 },
      blurb: 'Cabin seating, galleys and interior systems.',
      market: { size: 'not sized', year: 2025, basis: 'not applicable' },
      asOf: '2025', confidence: 'low',
      note: 'No share data independently verified in this research pass. Widely reported names in this space: ' +
            'Safran Seats, Collins Aerospace and Recaro Aircraft Seating.'
    },
    {
      id: 'apu', name: 'Auxiliary power unit', short: 'APU',
      shape: { x: 150, y: 650, w: 220, h: 150 },
      blurb: 'A small onboard turbine that powers systems and starts the main engines while the aircraft is on the ground.',
      market: { size: 'not sized', year: 2025, basis: 'not applicable' },
      asOf: '2025', confidence: 'low',
      note: 'No share data independently verified. Widely reported names in this space: Honeywell and Safran.'
    },
    {
      id: 'hydraulics', name: 'Hydraulics', short: 'Hydraulics',
      shape: { x: 390, y: 650, w: 220, h: 150 },
      blurb: 'The high-pressure systems that move flight control surfaces, landing gear and brakes.',
      market: { size: 'not sized', year: 2025, basis: 'not applicable' },
      asOf: '2025', confidence: 'low',
      note: 'No share data independently verified in this research pass. Parker Hannifin, Safran and Collins ' +
            'Aerospace are established players in aerospace hydraulics generally.'
    },
    {
      id: 'ecs', name: 'Environmental control system', short: 'ECS',
      shape: { x: 630, y: 650, w: 220, h: 150 },
      blurb: 'Cabin pressurisation, air conditioning and ventilation, powered off engine bleed air.',
      market: { size: 'not sized', year: 2025, basis: 'not applicable' },
      asOf: '2025', confidence: 'low',
      note: 'No share data found for this layer.'
    },

    /* meta */
    {
      id: 'tires-brakes-wheels', name: 'Tires, wheels and brakes', short: 'Tires / brakes', kind: 'meta',
      blurb: 'Not part of the airframe boxes above, but a real, separate supply chain the aircraft depends on.',
      market: { size: 'not sized', year: 2025, basis: 'not applicable' },
      asOf: '2025', confidence: 'low',
      note: 'No share data independently verified in this research pass. Michelin and Goodyear are established ' +
            'aircraft tire suppliers; Safran Landing Systems is a named aircraft brake supplier.'
    }
  ]
});
