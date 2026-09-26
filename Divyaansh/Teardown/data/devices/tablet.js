/* Teardown :: tablet */
TD.device({
  id: 'tablet',
  name: 'Tablet',
  icon: 'tablet',
  category: 'Consumer computing',
  tagline: 'One company still sets the terms of this market, chip and all.',
  unit: { volume: '~152m units shipped (2025)', price: 'USD ~400 average' },
  intro: 'The tablet never became the open, merchant-chip market phones and laptops did. One company designs ' +
         'its own processor, builds its own operating system and still ships a third of all tablets sold, ' +
         'fifteen years after inventing the modern category. The rest of the market genuinely competes; the ' +
         'top of it does not.',
  view: { w: 1000, h: 980 },
  nodes: [
    {
      id: 'soc', name: 'SoC / application processor', short: 'SoC',
      shape: { x: 150, y: 90, w: 220, h: 160 },
      blurb: 'The processor. Captive on the market leading platform, merchant silicon everywhere else.',
      bomPct: 20, layout: 'chain',
      market: { size: 'not sized separately', year: 2025, basis: 'structural finding, not a percentage market; see note' },
      asOf: '2025', confidence: 'low', chokepoint: true,
      shares: [ { c: 'Apple', p: 33 } ],
      note: 'Every iPad runs Apple\'s own silicon, never sold to another device maker: a captive supply chain, ' +
            'not a merchant one. The 33% shown is a proxy: Apple\'s share of tablet units overall, which is the ' +
            'closest defensible figure to "share of the SoC market" this device can honestly claim. The ' +
            'remaining two thirds of the market splits across Qualcomm Snapdragon, MediaTek Dimensity and ' +
            'Samsung Exynos, but no source gives a clean tablet-specific vendor split the way one exists for ' +
            'smartphone chips: treat that portion as unmeasured rather than absent.',
      sources: ['Company filings']
    },
    {
      id: 'tablet-foundry', parent: 'soc', name: 'Foundry', short: 'Foundry',
      blurb: 'Who actually manufactures the chip.',
      market: { size: 'USD ~165bn', year: 2025, basis: 'pure play foundry revenue, whole market not tablet specific' },
      asOf: '2025', confidence: 'medium', chokepoint: true,
      shares: [ { c: 'TSMC', p: 90 } ],
      note: 'TSMC has fabricated every generation of Apple Silicon since 2016, a well documented exclusive ' +
            'relationship. The 90% figure itself is a broader proxy, TSMC\'s reported share of smartphone-class ' +
            'SoCs at advanced nodes generally, rather than a tablet-specific measurement.',
      sources: ['Company filings']
    },
    {
      id: 'tablet-panel', name: 'Display panel', short: 'Panel',
      shape: { x: 390, y: 90, w: 220, h: 160 },
      blurb: 'The screen. The single largest line item after the processor.',
      bomPct: 22,
      market: { size: 'USD 50bn to 115bn', year: 2025, basis: 'figures vary by more than double depending on source and market definition: the spread itself says something about how weakly this category is measured' },
      asOf: '2025', confidence: 'low',
      shares: [ { c: 'BOE', p: 16 }, { c: 'Samsung Display', p: 13 }, { c: 'LG Display', p: 9 }, { c: 'Innolux', p: 7 }, { c: 'AU Optronics', p: 6 } ],
      note: 'No tablet-specific panel share breakdown was found. These are general flat panel display market ' +
            'shares, shown as the closest available proxy: the IT segment covering tablets, laptops and ' +
            'monitors is growing but not broken out on its own by any source found.',
      sources: ['Company filings']
    },
    {
      id: 'tablet-enclosure', name: 'Enclosure', short: 'Enclosure',
      shape: { x: 630, y: 90, w: 220, h: 160 },
      blurb: 'The unibody metal or glass back that gives a tablet its rigidity.',
      market: { size: 'not tracked', year: 2025, basis: 'not applicable' },
      asOf: '2025', confidence: 'low',
      note: 'No supplier share data found for this layer as a distinct market.'
    },
    {
      id: 'tablet-battery', name: 'Battery', short: 'Battery',
      shape: { x: 150, y: 270, w: 220, h: 160 },
      blurb: 'A lithium polymer cell filling most of the tablet\'s interior volume.',
      bomPct: 6,
      market: { size: 'not sized, tablet specific', year: 2025, basis: 'general lithium battery cell market, not broken out by device category' },
      asOf: '2025', confidence: 'low',
      shares: [ { c: 'CATL', p: 25 }, { c: 'LG Energy Solution', p: 13 }, { c: 'BYD', p: 12 } ],
      note: 'These are general lithium battery cell shares across all consumer and vehicle applications combined ' +
            ': the closest available proxy, not a tablet-specific breakdown, which no source publishes.',
      sources: ['Company filings']
    },
    {
      id: 'tablet-dram', name: 'DRAM', short: 'DRAM',
      shape: { x: 390, y: 270, w: 220, h: 160 },
      blurb: 'Working memory soldered directly to the board.',
      bomPct: 5,
      market: { size: 'not sized, tablet specific', year: 2025, basis: 'general DRAM revenue, not a tablet-specific breakdown' },
      asOf: '2025', confidence: 'low',
      shares: [ { c: 'Samsung', p: 39 }, { c: 'SK hynix', p: 29 }, { c: 'Micron', p: 22 } ],
      note: 'General DRAM market shares shown as a proxy. No tablet-specific breakdown found.',
      sources: ['Company filings']
    },
    {
      id: 'tablet-storage', name: 'NAND storage', short: 'Storage',
      shape: { x: 630, y: 270, w: 220, h: 160 },
      blurb: 'Flash storage for the operating system and files, soldered rather than removable.',
      bomPct: 5,
      market: { size: 'not sized, tablet specific', year: 2025, basis: 'general NAND flash revenue, not a tablet-specific breakdown' },
      asOf: '2025', confidence: 'low',
      shares: [ { c: 'Samsung', p: 32 }, { c: 'SK hynix', p: 20 }, { c: 'Kioxia', p: 15 }, { c: 'Western Digital', p: 13 } ],
      note: 'General NAND flash market shares shown as a proxy. No tablet-specific breakdown found.',
      sources: ['Company filings']
    },
    {
      id: 'tablet-camera', name: 'Camera modules', short: 'Camera',
      shape: { x: 150, y: 450, w: 220, h: 150 },
      blurb: 'Front and rear camera modules: a smaller line item than on a phone, still a real one.',
      market: { size: 'not tracked, tablet specific', year: 2025, basis: 'not applicable' },
      asOf: '2025', confidence: 'low',
      note: 'No tablet-specific supplier share data found. Likely draws on the same camera module and sensor ' +
            'suppliers used on phones (Sony, Samsung, OmniVision) but that could not be confirmed as tablet-specific.'
    },
    {
      id: 'tablet-modem', name: 'Cellular modem', short: 'Modem',
      shape: { x: 390, y: 450, w: 220, h: 150 },
      blurb: 'Fitted only to cellular models: WiFi-only tablets, the majority, skip this part entirely.',
      market: { size: 'not tracked, tablet specific', year: 2025, basis: 'not applicable' },
      asOf: '2025', confidence: 'low',
      note: 'No tablet-specific supplier share data found. Apple uses its own modem in newer iPads; Android ' +
            'tablets typically use Qualcomm.'
    },
    {
      id: 'tablet-wifi', name: 'WiFi / Bluetooth', short: 'WiFi / BT',
      shape: { x: 630, y: 450, w: 220, h: 150 },
      blurb: 'The combo chip handling wireless connectivity, fitted to every tablet regardless of cellular option.',
      market: { size: 'not tracked, tablet specific', year: 2025, basis: 'not applicable' },
      asOf: '2025', confidence: 'low',
      note: 'No tablet-specific supplier share data found.'
    },
    {
      id: 'tablet-pmic', name: 'Power management', short: 'PMIC',
      shape: { x: 150, y: 620, w: 220, h: 150 },
      blurb: 'Regulates power from the battery to every other chip on the board.',
      market: { size: 'not tracked, tablet specific', year: 2025, basis: 'not applicable' },
      asOf: '2025', confidence: 'low',
      note: 'No tablet-specific supplier share data found.'
    },
    {
      id: 'tablet-connector', name: 'Charging port', short: 'Connector',
      shape: { x: 390, y: 620, w: 220, h: 150 },
      blurb: 'USB-C on essentially every current tablet, following regulatory pressure in the EU and elsewhere.',
      market: { size: 'not tracked', year: 2025, basis: 'not applicable' },
      asOf: '2025', confidence: 'low',
      note: 'No supplier share data found for this component as a distinct market.'
    },
    {
      id: 'tablet-speakers', name: 'Speakers', short: 'Speakers',
      shape: { x: 630, y: 620, w: 220, h: 150 },
      blurb: 'Usually two or four small drivers built into the enclosure.',
      market: { size: 'not tracked', year: 2025, basis: 'not applicable' },
      asOf: '2025', confidence: 'low',
      note: 'No supplier share data found.'
    },
    {
      id: 'tablet-biometric', name: 'Biometric sensor', short: 'Biometric',
      shape: { x: 150, y: 790, w: 220, h: 150 },
      blurb: 'A fingerprint sensor in the power button or home button, or face-unlock camera hardware.',
      market: { size: 'not tracked', year: 2025, basis: 'not applicable' },
      asOf: '2025', confidence: 'low',
      note: 'No supplier share data found for this component as a distinct market.'
    },
    {
      id: 'tablet-odm', name: 'Contract assembly', short: 'Assembly',
      shape: { x: 390, y: 790, w: 460, h: 150 },
      blurb: 'Who physically builds the tablet for the brand on the box.',
      bomPct: 5,
      market: { size: 'not sized separately', year: 2025, basis: 'no tablet-specific market tracker found' },
      asOf: '2025', confidence: 'low',
      note: 'Named suppliers, not a measured market: Foxconn and BYD Electronics build iPads in China, ' +
            'Vietnam and India, Compal specialises in the education-market iPad, and Wistron and Pegatron ' +
            'assemble in India. Apple deliberately qualifies more than one supplier per category. No source ' +
            'gives a percentage split between them.',
      sources: ['Company filings']
    },

    /* meta */
    {
      id: 'tablet-brand', name: 'Brand', short: 'Brand', kind: 'meta',
      blurb: 'Whose logo is on the back.',
      market: { size: '~152m units (2025)', year: 2025, basis: 'unit shipment share, IDC' },
      asOf: '2025', confidence: 'high',
      shares: [ { c: 'Apple', p: 33 }, { c: 'Samsung', p: 19 }, { c: 'Lenovo', p: 8 }, { c: 'Amazon', p: 8 }, { c: 'Xiaomi', p: 7 } ],
      note: 'The one genuinely well measured figure on this device, IDC sourced. The market itself is volatile ' +
            'quarter to quarter, global shipments fell 4.4% in the third quarter of 2025 even as Apple\'s own ' +
            'shipments grew, which is a share gain inside a shrinking market rather than a simple growth story.',
      sources: ['Company filings']
    }
  ]
});
