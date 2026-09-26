/* Teardown :: smart TV */
TD.device({
  id: 'smart-tv',
  name: 'Smart TV',
  icon: 'tv',
  category: 'Consumer computing',
  tagline: 'The panel is most of the bill of materials, and the software underneath is most of the margin.',
  unit: { volume: '~220m units shipped (2025 est.)', price: 'USD ~450 average' },
  intro: 'Two supply chains stacked on top of each other. The physical set is a panel-dominated hardware ' +
         'business where Chinese makers now out-ship Korea on volume. The operating system underneath it is a ' +
         'separate, software-margin business the set maker often does not even control: this is the one ' +
         'device on this site where the box itself can be sold near cost because the real money is made after ' +
         'the sale, through the platform running on it.',
  view: { w: 1000, h: 900 },
  nodes: [
    {
      id: 'panel', name: 'Display panel', short: 'Panel',
      shape: { x: 150, y: 90, w: 350, h: 180 },
      blurb: 'The screen itself. Consistently the largest single cost in a television.',
      bomPct: 55,
      market: { size: 'not sized separately by technology', year: 2025,
                basis: 'OLED TV panel shipment and revenue share shown below: OLED is the smaller, premium ' +
                       'slice of the panel market; the larger LCD segment is ranked but no source gave a clean ' +
                       'percentage split for it' },
      asOf: '2025', confidence: 'medium', chokepoint: true,
      shares: [ { c: 'Samsung Display', p: 38 }, { c: 'LG Display', p: 21 }, { c: 'BOE', p: 14 } ],
      note: 'The figures above are OLED TV panels only, where Samsung Display leads on shipments and an even ' +
            'wider 48% on revenue. LCD is the much larger part of the market by unit volume and is ranked, not ' +
            'measured here: BOE ships the most LCD TV panels of anyone, TCL CSOT is second, Innolux and AUO ' +
            'round out a top five with no clean percentage found for any of them. LG Display\'s 21% OLED revenue ' +
            'share is also notable for the direction of travel: it was 14% the year before.',
      sources: ['Company filings'],
      deals: [
        { y: 2025, a: 'TCL CSOT', t: 'LG Display Guangzhou LCD fab', v: 'USD ~1.47bn', n: 'LG\'s formal exit from large-panel LCD manufacturing, closed 2025 after agreeing in 2024.' },
        { y: 2022, a: 'TCL CSOT', t: 'Samsung Display LCD patents', v: 'undisclosed', n: 'Followed Samsung Display\'s own earlier exit from LCD production.' },
        { y: 2023, a: 'bankruptcy', t: 'JOLED', v: 'n/a', n: 'The Panasonic and Sony backed inkjet OLED joint venture collapsed, removing one of the few non-Korean OLED challengers.' }
      ]
    },
    {
      id: 'tv-soc', name: 'TV chipset (SoC)', short: 'SoC',
      shape: { x: 520, y: 90, w: 330, h: 180 },
      blurb: 'The processor that runs the smart TV interface, decodes video and drives the panel.',
      bomPct: 6,
      market: { size: 'not found', year: 2025, basis: 'single aggregator source, not corroborated by a named tracker' },
      asOf: '2025', confidence: 'medium',
      shares: [ { c: 'MediaTek', p: 33 }, { c: 'Amlogic', p: 18 } ],
      note: 'MediaTek\'s share reflects its earlier merger with MStar. Realtek and Novatek are named as the main ' +
            'alternative suppliers, gaining share particularly among Chinese brands diversifying away from ' +
            'MediaTek dependency, but no source gave a percentage for either.',
      sources: ['Company filings']
    },
    {
      id: 'tv-ddic', name: 'Display driver IC', short: 'DDIC',
      shape: { x: 150, y: 300, w: 220, h: 180 },
      blurb: 'The chip that translates the video signal into voltages the panel\'s pixels actually respond to.',
      bomPct: 3,
      market: { size: 'not found as a single figure', year: 2025, basis: 'named leaders by revenue in their own sub-segment, not a comparable combined market' },
      asOf: '2025', confidence: 'low',
      note: 'No comparable market share table exists. Samsung LSI leads OLED panel driver revenue (an estimated ' +
            'USD ~900m in 2025); Novatek leads LCD and TV driver IC revenue separately (an estimated USD ~1.3bn ' +
            'in 2024). Himax, Fitipower, MagnaChip and Raydium are also named as players with no share found.',
      sources: ['Company filings']
    },
    {
      id: 'tv-backlight', name: 'Backlight', short: 'Backlight',
      shape: { x: 390, y: 300, w: 220, h: 180 },
      blurb: 'The LED array behind an LCD panel, not present on OLED sets, which light each pixel individually.',
      market: { size: 'not tracked', year: 2025, basis: 'not applicable' },
      asOf: '2025', confidence: 'low',
      note: 'No supplier share data found. Named for completeness: it is a real, separate bill-of-materials ' +
            'line on every LCD set, just not one any tracker publishes a market share table for.'
    },
    {
      id: 'tv-enclosure', name: 'Enclosure and stand', short: 'Enclosure',
      shape: { x: 630, y: 300, w: 220, h: 180 },
      blurb: 'The bezel, back cover and stand or wall mount.',
      market: { size: 'not tracked', year: 2025, basis: 'not applicable' },
      asOf: '2025', confidence: 'low',
      note: 'No supplier share data found for this layer as a distinct market.'
    },
    {
      id: 'tv-speakers', name: 'Speakers', short: 'Speakers',
      shape: { x: 150, y: 500, w: 210, h: 170 },
      blurb: 'Built-in audio, widely considered the weakest part of most thin television designs.',
      market: { size: 'not tracked', year: 2025, basis: 'not applicable' },
      asOf: '2025', confidence: 'low',
      note: 'No supplier share data found. This is exactly why the soundbar exists as its own product category.'
    },
    {
      id: 'tv-psu', name: 'Power supply', short: 'PSU',
      shape: { x: 380, y: 500, w: 210, h: 170 },
      blurb: 'Converts wall AC to the DC rails the panel and board need.',
      market: { size: 'not tracked', year: 2025, basis: 'not applicable' },
      asOf: '2025', confidence: 'low',
      note: 'No supplier share data found.'
    },
    {
      id: 'tv-memory', name: 'Memory (platform)', short: 'Memory',
      shape: { x: 610, y: 500, w: 210, h: 170 },
      blurb: 'DRAM and flash storage for the smart TV operating system itself, separate from the video pipeline.',
      market: { size: 'not tracked', year: 2025, basis: 'not applicable' },
      asOf: '2025', confidence: 'low',
      note: 'No TV-specific supplier share data found. Likely draws on the same general DRAM and NAND suppliers ' +
            'used elsewhere on this site (Samsung, SK hynix, Micron, Kioxia) but that could not be confirmed as ' +
            'TV-specific, so no shares are shown.'
    },
    {
      id: 'tv-odm', name: 'Contract manufacturing (ODM)', short: 'ODM',
      shape: { x: 150, y: 690, w: 340, h: 170 },
      blurb: 'Who actually builds sets for brands that do not run their own factories.',
      bomPct: 4,
      market: { size: 'USD ~108.5bn', year: 2024, basis: 'TV OEM/ODM market, whole industry' },
      asOf: '2025', confidence: 'low',
      note: 'TPV Technology, Foxconn and AmTran are the names that recur most, notably as Vizio\'s outsourced ' +
            'builders in the US. TCL runs its own ODM arm (MOKA) and BOE has moved into set assembly too. No ' +
            'source gives a percentage split between them.',
      sources: ['Company filings']
    },
    {
      id: 'tv-remote', name: 'Remote control', short: 'Remote',
      shape: { x: 510, y: 690, w: 330, h: 170 },
      blurb: 'Bundled with every set, increasingly with a microphone for voice search.',
      market: { size: 'not tracked', year: 2025, basis: 'not applicable' },
      asOf: '2025', confidence: 'low',
      note: 'No supplier share data found for this accessory as a distinct market.'
    },

    /* meta */
    {
      id: 'tv-brand', name: 'Brand', short: 'Brand', kind: 'meta',
      blurb: 'Whose logo is on the bezel.',
      market: { size: 'not applicable', year: 2025, basis: 'unit shipment share, Omdia' },
      asOf: '2025', confidence: 'high',
      shares: [ { c: 'Samsung', p: 17 }, { c: 'TCL', p: 16 }, { c: 'Hisense', p: 10 }, { c: 'LG', p: 9 } ],
      note: 'By units, this is close: Samsung and TCL are within a point of each other, and combined Chinese ' +
            'volume (TCL plus Hisense, 25% or so) has now exceeded combined Korean volume (Samsung plus LG) for ' +
            'two straight years. By revenue the picture looks completely different: Samsung leads on revenue ' +
            'alone with roughly 29%, because it sells a richer, larger-screen mix. Units and revenue are ' +
            'measuring different things here and both are worth knowing.',
      sources: ['Company filings']
    },
    {
      id: 'tv-os', name: 'Smart TV platform', short: 'Platform', kind: 'meta',
      blurb: 'The operating system, and where the advertising and data business actually sits.',
      market: { size: 'not sized', year: 2025, basis: 'global installed base share, lower tier sources: directional only' },
      asOf: '2025', confidence: 'low',
      shares: [ { c: 'Google', p: 37 }, { c: 'Samsung', p: 20 }, { c: 'LG', p: 17 }, { c: 'Roku', p: 11 } ],
      note: 'Shown as the maker of each platform: Google (Android TV / Google TV), Samsung (Tizen), LG (WebOS) ' +
            'and Roku (Roku OS), global installed base. This is directional only, sourcing is weaker than the ' +
            'site\'s usual bar, and the US market looks nothing like the global one: Roku OS actually leads in ' +
            'the US at around 25%, ahead of Amazon\'s Fire TV, Tizen, Android TV and WebOS, each in the mid ' +
            'teens. Vidaa, Hisense\'s own platform, is the smallest of the named systems globally but growing fastest.',
      sources: ['Company filings']
    }
  ]
});
