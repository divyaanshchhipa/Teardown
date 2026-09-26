/* Teardown :: Marketing technology stack (software)
 *
 * Ninth flagship, and the only one with no physical form. It earns the
 * treatment by making an argument no hardware teardown on this site can:
 *
 *   In every other device here, the deep layers are held by *suppliers*. You
 *   buy a phone from Apple and, five tiers down, Zeiss sells the optics to
 *   ASML. Zeiss is not competing with Apple for the same customer.
 *
 *   In software the descent runs the other way. Follow marketing spend down
 *   through programmatic, through identity, through the browser, and the
 *   layer at the bottom is *owned by the company you were buying from at the
 *   top*. Google sells the advertising, writes the analytics tag, ships the
 *   tag manager, operates the largest cloud region estate, and controls the
 *   rendering engine that decides whether any of the measurement works at
 *   all. That is not a supply chain. It is a counterparty that also owns the
 *   substrate the market is conducted on.
 *
 * The other reason to build it: this is by a distance the best-evidenced
 * teardown on the site, and for an unusual reason. Several layers are
 * measured by crawling the web itself rather than by surveying vendors,
 * W3Techs publishes a daily census, openly, with its method stated. That is
 * better provenance than anything quoted in the semiconductor chapters.
 *
 * But it measures a different thing. A share of *websites* is not a share of
 * *revenue*, and a free tier inflates a site count while saying nothing about
 * money. Cloudflare sits in front of 84.6% of the sites that use a reverse
 * proxy and holds nothing like 84.6% of CDN revenue. Every layer here states
 * which of the two it means, because conflating them is the single most
 * common way people are wrong about this industry.
 */
TD.device({
  id: 'martech',
  name: 'Martech stack',
  icon: 'stack',
  category: 'Software and services',
  tagline: 'Follow the money down far enough and you arrive back at the company you were buying from.',
  unit: { volume: '~15,000 vendors catalogued (2026)', price: 'USD ~26 per employee per month, blended software spend' },
  intro: 'Software has a supply chain as real as a turbine’s, it is just invisible because nothing is ' +
         'bolted together. Every customer-facing marketing organisation sits on the same ten or eleven ' +
         'layers, and the concentration in each ranges from the most fragmented market on this site to ' +
         'three outright monopolies. Descend far enough past the applications and you stop finding ' +
         'vendors at all: a rendering engine, a government contract, a non-profit certificate authority, ' +
         'and a few thousand unpaid people.',
  view: { w: 1000, h: 830 },
  frames: [
    { label: 'Demand: media, and the agencies that place it', x: 130, y: 62, w: 740, h: 176 },
    { label: 'Engagement: the applications a marketer actually logs into', x: 130, y: 250, w: 740, h: 176 },
    { label: 'Data: where it is collected and where it is kept', x: 130, y: 438, w: 740, h: 176 },
    { label: 'Substrate: what every layer above quietly assumes', x: 130, y: 626, w: 740, h: 186 }
  ],

  /* ============================ STORY ============================
   * `stages` must account for all 53 nodes exactly once.
   */
  story: {
    kicker: 'Flagship teardown',
    headline: 'The only supply chain here where the bottom of the stack is owned by the seller at the top.',
    lede: 'Fifty-three mapped layers, five tiers deep, and no physical part anywhere in it. Every other ' +
          'teardown on this site descends into specialists who do not compete with the brand above them. ' +
          'This one descends into Google twice, Apple once, a United States government contract, a ' +
          'non-profit, and a maintainer layer that is sixty per cent unpaid.',

    tierNote: 'Concentration does not rise smoothly here: it jumps at the point where a layer stops ' +
              'being sold and starts being given away. The three tightest markets in this teardown are ' +
              'all free at the point of use.',
    geoLede: 'Reading this by supplier headquarters produces the least interesting map on the site: it ' +
             'is almost entirely the United States, and everyone already knew that. The reading that ' +
             'matters is a different axis altogether: how much of the deep substrate has no ' +
             'commercial owner at all. The certificate authority behind two thirds of the encrypted web ' +
             'is a non-profit. The registry behind .com is a government contract. The dependency layer ' +
             'under all of it is unpaid volunteers. None of those has a country in the ordinary sense, ' +
             'and none of them can be bought.',

    findings: [
      { title: 'The counterparty owns the substrate',
        body: 'Three rendering engines are left on earth. Blink is Google’s and renders about 79% of ' +
              'sessions. WebKit is Apple’s, and every browser on iOS runs on it whatever badge it ' +
              'wears. Gecko is Mozilla’s, at roughly 3%, and Mozilla’s audited accounts show ' +
              'about three quarters of its revenue arriving as search royalties, overwhelmingly ' +
              'from Google. So the two largest sellers of advertising own two of the three engines, and ' +
              'substantially fund the third. Whether a marketer can measure the advertising they bought ' +
              'is a decision taken inside the company that sold it to them. No hardware teardown on this ' +
              'site has that structure anywhere in it.',
        nodes: ['browser-engine', 'engine-funding', 'browser', 'ads'] },
      { title: 'The free layers are the concentrated ones',
        body: 'The three tightest markets in this teardown are not the expensive ones. Google Tag Manager ' +
              'holds 99.6% of the tag manager market. Google Analytics holds 83% of analytics ' +
              'installations. Cloudflare sits in front of 84.6% of sites using a reverse proxy. All three ' +
              'are free at the entry tier, and all three were won by giving the product away and ' +
              'monetising something adjacent: audience signal in Google’s case, enterprise ' +
              'upsell in Cloudflare’s. Paying for software turns out to be what keeps a market ' +
              'competitive; the layers nobody invoices for are the ones that consolidated.',
        nodes: ['tag-mgmt', 'analytics', 'cdn', 'tls'] },
      { title: 'A decade of consolidation produced the most fragmented layer on the site',
        body: 'The customer data platform was sold for ten years as the layer that would finally unify ' +
              'the stack, and it attracted the corresponding money: Twilio paid USD 3.2bn for ' +
              'Segment in 2020. The named leaders now hold roughly a quarter to a third of it between ' +
              'them, which makes it the most fragmented market in this teardown and one of the most ' +
              'fragmented anywhere on this site. The reason is underneath it: warehouses became good ' +
              'enough that a query against Snowflake or Databricks does the same job, so the category is ' +
              'being dissolved from below by the layer it was built on top of.',
        nodes: ['cdp', 'reverse-etl', 'warehouse'] }
    ],

    /* upstream -> downstream. Node counts here must sum to 53. */
    stages: [
      { id: 'substrate', name: 'The substrate nobody buys',
        note: 'Three rendering engines, the addressability they grant or withhold, and the standards ' +
              'bodies staffed by the engine vendors themselves. Nobody in marketing procures any of it.',
        nodes: ['browser-engine', 'engine-funding', 'browser', 'cookie', 'standards-mt'] },
      { id: 'trust', name: 'Naming and trust',
        note: 'Before anything can be delivered it needs a name and a certificate. One is a government ' +
              'contract, the other is mostly a non-profit.',
        nodes: ['registry-com', 'dns', 'ca-root', 'tls'] },
      { id: 'runtime', name: 'Where it actually runs',
        note: 'Three hyperscalers, one reverse proxy, several million open source packages, and the ' +
              'tooling that tells you which of them just broke.',
        nodes: ['cloud-mt', 'cdn', 'oss-deps', 'oss-maintainers', 'observability'] },
      { id: 'presence', name: 'The owned presence',
        note: 'The website and the store on it: the only part of this stack the company genuinely ' +
              'controls, running on software it mostly did not write and cannot buy.',
        nodes: ['web', 'hosting', 'plugins', 'commerce', 'checkout'] },
      { id: 'collection', name: 'Collecting the data',
        note: 'Measurement, the tag that carries it, and the decade-long attempt to stitch it into one ' +
              'customer record.',
        nodes: ['analytics', 'tag-mgmt', 'attribution', 'cdp', 'reverse-etl'] },
      { id: 'storage', name: 'Keeping it',
        note: 'The gravitational centre of the modern stack, and the format war being fought underneath ' +
              'it over who owns the table on disk.',
        nodes: ['warehouse', 'table-format', 'query-engine'] },
      { id: 'access', name: 'Identity, payment and permission',
        note: 'Who is allowed in, how they pay, and what the law says you may remember about them ' +
              'afterwards.',
        nodes: ['identity', 'payments', 'card-network', 'privacy-mt'] },
      { id: 'engagement', name: 'The owned channel',
        note: 'Email, SMS and push: the cheapest reach a marketer has, gated by two inbox ' +
              'operators who charge nothing and promise nothing.',
        nodes: ['messaging', 'esp', 'deliverability', 'sms', 'appstore-mt'] },
      { id: 'records', name: 'The system of record',
        note: 'The stickiest software a company buys, the integration layer that feeds it, and the agent ' +
              'layer every vendor is now betting the business on.',
        nodes: ['crm', 'crm-integration', 'crm-ai'] },
      { id: 'demand', name: 'Buying demand',
        note: 'Fifty-five per cent of the budget, and the machinery that places it. Two firms take more ' +
              'than half of all digital advertising on earth.',
        nodes: ['ads', 'search-ads', 'social-ads', 'retail-media', 'dsp', 'ssp', 'bidstream',
                'identity-graph', 'verification'] },
      { id: 'channel', name: 'Who places it, and what is left over',
        note: 'The agency groups, the principal-based buying nobody will quantify, and the residual this ' +
              'teardown does not price.',
        nodes: ['agency', 'holdco', 'principal-media', 'infra', 'unpriced-mt'] }
    ],

    flow: {
      lanes: [
        { label: 'Addressability',
          steps: ['browser-engine', 'browser', 'cookie', 'identity-graph', 'dsp'],
          feed: { label: 'Who pays for the third engine', steps: ['engine-funding'] } },
        { label: 'Delivery and trust',
          steps: ['registry-com', 'dns', 'tls', 'cdn', 'web'] },
        { label: 'Measurement',
          steps: ['tag-mgmt', 'analytics', 'cdp', 'warehouse'] },
        { label: 'Owned channel',
          steps: ['oss-maintainers', 'esp', 'deliverability', 'messaging'] }
      ],
      converge: ['ads', 'crm']
    }
  },

  nodes: [

    /* ================= ROW 1 :: DEMAND AND AGENCY ================= */
    {
      id: 'ads', name: 'Paid media', short: 'Paid media',
      shape: { x: 150, y: 82, w: 220, h: 146 },
      blurb: 'Where the budget actually goes. Comfortably the largest line in any marketing organisation.',
      bomPct: 55, layout: 'board',
      market: { size: 'USD ~908bn', year: 2026, basis: 'global digital advertising spend, net platform revenue' },
      asOf: '2026', confidence: 'high', chokepoint: true,
      shares: [
        { c: 'Meta', p: 26.8 }, { c: 'Google', p: 26.4 }, { c: 'Amazon', p: 9 },
        { c: 'ByteDance', p: 7.9 }
      ],
      note: 'Four names, because those are the four the published platform table covers. Alibaba and ' +
            'Tencent are both material sellers of digital advertising and sit inside the residual ' +
            'here; earlier versions of this teardown carried estimates for them, which have been ' +
            'removed because no current source states them. ' +
            'Two companies take better than half of all digital advertising on earth, and 2026 is the ' +
            'first year in which the order changed: Meta is forecast to pass Google on net worldwide ad ' +
            'revenue, in the United States and internationally at the same time. Read that as a ' +
            'reordering of a duopoly rather than a loosening of one: the combined figure did not ' +
            'move. Everything else in this teardown exists, ultimately, to make spending here more ' +
            'efficient, which is a structurally weak position for every vendor on the page. These are ' +
            'forecasts, not audited results, and eMarketer revises them after the fact.',
      sources: ['eMarketer', 'GroupM', 'MAGNA']
    },
    {
      id: 'agency', name: 'Agency and services', short: 'Agency',
      shape: { x: 390, y: 82, w: 220, h: 146 },
      blurb: 'The people who plan and place the media, and increasingly buy it as principal and resell it.',
      bomPct: 12,
      market: { size: 'USD ~150bn', year: 2025, basis: 'global advertising and marketing services revenue, estimated denominator' },
      asOf: '2025', confidence: 'low',
      shares: [
        { c: 'Omnicom', p: 17 }, { c: 'Publicis', p: 11 }, { c: 'WPP', p: 11 },
        { c: 'Dentsu', p: 6 }, { c: 'Havas', p: 3 }
      ],
      note: 'Omnicom took the top position by closing its acquisition of Interpublic in November 2025, ' +
            'creating a group with pro forma revenue above USD 25bn and removing one of the six holding ' +
            'companies the industry had been organised around for thirty years. The shares here are ' +
            'derived, and weakly: the numerators are reported revenues, but no publisher states a ' +
            'consistent denominator for “marketing services”, so the total is estimated. The ' +
            'firm part of this table is that the big five together account for roughly half of it.',
      sources: ['Digiday', 'Company filings'],
      deals: [
        { y: 2025, a: 'Omnicom', t: 'Interpublic Group', v: 'USD ~13.25bn', n: 'Closed November 2025. Reduced the holding companies from six to five and made Omnicom the largest by revenue.' },
        { y: 2024, a: 'Publicis', t: 'Influential', v: 'USD ~500m', n: 'Bought the largest influencer marketing platform, moving the holdco into creator-side inventory.' }
      ]
    },
    {
      id: 'crm', name: 'CRM and system of record', short: 'CRM',
      shape: { x: 630, y: 82, w: 220, h: 146 },
      blurb: 'The customer record itself. The stickiest software a company ever buys, and the hardest to leave.',
      bomPct: 8, layout: 'chain',
      market: { size: 'USD ~110bn', year: 2025, basis: 'CRM application revenue, vendor share of total market revenue' },
      asOf: '2025', confidence: 'high',
      shares: [
        { c: 'Salesforce', p: 20 }, { c: 'Oracle', p: 4.1 }, { c: 'Microsoft', p: 4 },
        { c: 'SAP', p: 3.1 }
      ],
      note: 'Adobe completes the published top five and is omitted from the table because IDC\'s ' +
            'release named it without stating its share; inferring one from the gap would be ' +
            'inventing a number. Microsoft is the interesting movement, it fell from 5.2% to ' +
            '4.0% in a year. ' +
            'Twenty per cent reads as unimpressive until you notice the gap: Salesforce earns roughly ' +
            'four times its nearest competitor and has led for fourteen consecutive years in a market ' +
            'with no natural monopoly and no network effect worth the name. It got there by acquisition ' +
            ': more than seventy deals, including MuleSoft, Tableau, Slack and Informatica, ' +
            'which makes it one of the more instructive serial-acquirer records in software. Note also ' +
            'that the named five cover only about a third of the market. The tail here is genuinely ' +
            'enormous, and that is a real property of CRM rather than a gap in the data.',
      sources: ['IDC Worldwide Semiannual Software Tracker', 'Gartner'],
      deals: [
        { y: 2021, a: 'Salesforce', t: 'Slack', v: 'USD 27.7bn', n: 'The largest software deal of its year, and a defensive move against Microsoft Teams.' },
        { y: 2025, a: 'Salesforce', t: 'Informatica', v: 'USD ~8bn', n: 'Bought the data management layer explicitly to feed AI agents governed enterprise data.' }
      ]
    },

    /* ================= ROW 2 :: THE APPLICATIONS ================= */
    {
      id: 'messaging', name: 'Email, SMS and push', short: 'Messaging',
      shape: { x: 150, y: 270, w: 220, h: 146 },
      blurb: 'Owned-channel delivery. Boring, measurable, and the highest return line in most budgets.',
      bomPct: 5, layout: 'chain',
      market: { size: 'USD ~21bn', year: 2026, basis: 'marketing automation and cross-channel messaging platform revenue' },
      asOf: '2026', confidence: 'low',
      shares: [
        { c: 'Salesforce', p: 15 }, { c: 'Adobe', p: 12 }, { c: 'Intuit', p: 9 },
        { c: 'Klaviyo', p: 8 }, { c: 'Braze', p: 6 }, { c: 'Twilio', p: 6 }, { c: 'HubSpot', p: 5 }
      ],
      note: 'Klaviyo is the case study worth carrying out of this row. It built a multi-billion dollar ' +
            'listed business by going all in on one ecosystem, Shopify, rather than ' +
            'competing horizontally against the suites above it. Ecosystem-specific depth beat ' +
            'generalist breadth, in a category where the generalists had a decade’s head start. ' +
            'The shares are reconciled from reported revenues against a contested market definition and ' +
            'should be read as a ranking rather than as measurements.',
      sources: ['Gartner', 'Company filings'],
      deals: [
        { y: 2021, a: 'Intuit', t: 'Mailchimp', v: 'USD 12bn', n: 'A financial software company buying the small-business marketing relationship outright.' }
      ]
    },
    {
      id: 'web', name: 'Web and content management', short: 'CMS',
      shape: { x: 390, y: 270, w: 220, h: 146 },
      blurb: 'What the website runs on. The most concentrated position in consumer software, and it is not for sale.',
      bomPct: 4, layout: 'board',
      market: { size: 'USD ~30bn', year: 2026, basis: 'share of the CMS market measured as detected installations across the top 10 million sites' },
      asOf: '2026', confidence: 'high', chokepoint: true,
      shares: [
        { c: 'Automattic', p: 58.9 }, { c: 'Shopify', p: 7.7 }, { c: 'Wix', p: 6.1 },
        { c: 'Squarespace', p: 3.6 }, { c: 'Joomla', p: 1.7 }, { c: 'Webflow', p: 1.2 },
        { c: 'Tilda', p: 1.2 }, { c: 'Duda', p: 1.1 }, { c: 'Drupal', p: 1 }
      ],
      note: 'WordPress runs 40.7% of all websites and 58.9% of those using a CMS at all: the single ' +
            'most dominant position anywhere in consumer software. Read the attribution carefully, ' +
            'because it is the whole point. WordPress is open source; the trademark sits with the ' +
            'non-profit WordPress Foundation; the commercial steward Automattic is private and has never ' +
            'been listed. The row is booked to Automattic here because that is the only entity a buyer ' +
            'could theoretically transact with, and even that is unavailable. A market share this large ' +
            'with no way to own it is a genuinely unusual object, and the 2024 dispute between ' +
            'Automattic and WP Engine showed how much control the steward has regardless.',
      sources: ['W3Techs', 'BuiltWith'],
      deals: [
        { y: 2024, a: 'Permira', t: 'Squarespace', v: 'USD ~7.2bn', n: 'Take-private of the fourth-largest player. Sponsors have been consolidating the long tail of website software for a decade.' }
      ]
    },
    {
      id: 'commerce', name: 'Commerce platform', short: 'Commerce',
      shape: { x: 630, y: 270, w: 220, h: 146 },
      blurb: 'The catalogue, cart and checkout: where a marketing stack stops being a cost and starts being revenue.',
      bomPct: 3, layout: 'chain',
      market: { size: 'not stated as a single figure', year: 2026, basis: 'no publisher separates platform licence revenue from payment take rate' },
      asOf: '2026', confidence: 'low',
      note: 'Named, not measured, and the reason is structural rather than a research gap. The large ' +
            'commerce platforms do not principally sell software: Shopify earns substantially more from ' +
            'payments and merchant services than from subscriptions, so a “platform market share” ' +
            'compares a licence business against a payments business and means very little. WooCommerce ' +
            'confuses it further by being a free WordPress plugin with no revenue line at all. Named ' +
            'players by installed base: WooCommerce, Shopify, Wix Stores, Squarespace Commerce, ' +
            'PrestaShop and Magento, now Adobe Commerce.',
      sources: ['W3Techs', 'Company filings']
    },

    /* ==================== ROW 3 :: THE DATA ==================== */
    {
      id: 'analytics', name: 'Analytics and measurement', short: 'Analytics',
      shape: { x: 150, y: 458, w: 220, h: 146 },
      blurb: 'Who came, what they did, and whether the thing you shipped helped. Free, and therefore a monopoly.',
      bomPct: 3, layout: 'board',
      market: { size: 'USD ~16bn', year: 2026, basis: 'share of all websites on which each tool is detected: sites commonly run several, so this ranks presence and does not partition a market' },
      asOf: '2026', confidence: 'high', chokepoint: true,
      shares: [
        { c: 'Google', p: 47.6 }, { c: 'Meta', p: 8.7 }, { c: 'Microsoft', p: 4 },
        { c: 'Yandex', p: 3.5 }, { c: 'Automattic', p: 3.4 }, { c: 'Hotjar', p: 1.7 },
        { c: 'Cloudflare', p: 1.7 }, { c: 'Matomo', p: 1.4 }, { c: 'Snowplow', p: 1.3 }
      ],
      note: 'Stated as share of all websites, because that is what is actually measured. On the narrower ' +
            'basis of sites that run any analytics at all, Google Analytics holds 83.2%: the ' +
            'second-highest figure in this teardown. It reached that by being free, which is the point: ' +
            'the product is not the analytics. The product is the audience signal flowing back into the ' +
            'advertising business that is 55% of the budget four rows up. Most buyers do not experience ' +
            'that as vertical integration, but that is precisely what it is, and it is why the layer ' +
            'costs nothing.',
      sources: ['W3Techs', 'BuiltWith']
    },
    {
      id: 'cdp', name: 'Customer data platform', short: 'CDP',
      shape: { x: 390, y: 458, w: 220, h: 146 },
      blurb: 'The layer meant to stitch identity together across channels. Sold hard for a decade, still not consolidated.',
      bomPct: 2, layout: 'chain',
      market: { size: 'USD ~9.7bn', year: 2025, basis: 'customer data platform software revenue' },
      asOf: '2025', confidence: 'low',
      shares: [
        { c: 'Salesforce', p: 8 }, { c: 'Adobe', p: 7 }, { c: 'Oracle', p: 5 },
        { c: 'Treasure Data', p: 4 }, { c: 'Tealium', p: 3 }, { c: 'Twilio', p: 3 }
      ],
      note: 'The most fragmented layer in this teardown: the named leaders hold roughly a quarter to a ' +
            'third of it between them after ten years of consolidation attempts and one USD 3.2bn ' +
            'acquisition. It is also the layer most likely to stop existing as a category. Warehouses ' +
            'became good enough that a composable CDP querying Snowflake or Databricks directly does the ' +
            'same job without moving the data, which is a genuine existential question for every vendor ' +
            'in this row and is being answered against them. Read these figures as low confidence in ' +
            'both numerator and denominator, published CDP market sizes for the same year differ ' +
            'by more than a factor of two depending on what the publisher counts as a CDP.',
      sources: ['CDP Institute', 'Gartner'],
      deals: [
        { y: 2020, a: 'Twilio', t: 'Segment', v: 'USD 3.2bn', n: 'The high-water mark for standalone CDP valuation. Twilio has since written the data business down.' },
        { y: 2024, a: 'Rokt', t: 'mParticle', v: 'undisclosed', n: 'A venture-backed CDP folded into an adjacent commerce media platform rather than sold to a suite.' }
      ]
    },
    {
      id: 'warehouse', name: 'Data warehouse and lakehouse', short: 'Warehouse',
      shape: { x: 630, y: 458, w: 220, h: 146 },
      blurb: 'Where every layer above now agrees the data should live. The gravitational centre of the modern stack.',
      bomPct: 4, layout: 'chain',
      market: { size: 'USD ~52bn', year: 2026, basis: 'cloud analytical database and lakehouse revenue' },
      asOf: '2026', confidence: 'low',
      shares: [
        { c: 'Google', p: 20 }, { c: 'Snowflake', p: 18 }, { c: 'Databricks', p: 16 },
        { c: 'Amazon', p: 15 }, { c: 'Microsoft', p: 14 }, { c: 'Oracle', p: 5 }
      ],
      note: 'The only layer in this teardown where two independent companies genuinely hold their own ' +
            'against all three hyperscalers, and both are now buying upward into applications, ' +
            'which puts them in direct conflict with the CDP and analytics rows beside them. Graded low ' +
            'deliberately: published shares for this market disagree violently, with one source putting ' +
            'Snowflake at roughly a third of “the cloud data warehouse market” and others ' +
            'placing it well below the hyperscalers, because the hyperscalers do not report warehouse ' +
            'revenue separately from cloud revenue at all. The ranking is firmer than the numbers.',
      sources: ['Gartner', 'Company filings'],
      deals: [
        { y: 2023, a: 'Databricks', t: 'MosaicML', v: 'USD 1.3bn', n: 'Bought model training capability to make the lakehouse the place AI gets built rather than merely fed.' },
        { y: 2024, a: 'Databricks', t: 'Tabular', v: 'USD ~2bn', n: 'Acquired the Apache Iceberg founders: a table format acquisition, not a product one. See the table format layer below.' }
      ]
    },

    /* ================== ROW 4 :: THE SUBSTRATE ================== */
    {
      id: 'infra', name: 'Delivery, identity and payments', short: 'Infrastructure',
      shape: { x: 150, y: 646, w: 220, h: 146 },
      blurb: 'The plumbing everything above assumes. Invisible until it fails, at which point it is the only topic.',
      bomPct: 3, layout: 'board',
      market: { size: 'USD ~185bn', year: 2026, basis: 'combined CDN, identity, payments, DNS, certificate and observability spend: an aggregate of separate markets, not a market itself' },
      asOf: '2026', confidence: 'low',
      note: 'Not a market and not measured as one. Six separate oligopolies bundled into one row for ' +
            'layout, containing between them the three tightest layers in this teardown and the two that ' +
            'have no commercial owner at all. Open it: the interesting material on this page is ' +
            'underneath here rather than in the applications above.',
      sources: ['Company statements', 'W3Techs']
    },
    {
      id: 'unpriced-mt', name: 'Not separately budgeted', short: 'Unpriced',
      shape: { x: 390, y: 646, w: 220, h: 146 },
      blurb: 'Internal headcount, systems integration, training, and the software nobody remembers subscribing to.',
      bomPct: 1,
      market: { size: null, year: 2026, basis: 'residual share of marketing technology and media budget, not a market' },
      asOf: '2026', confidence: 'low',
      shares: [],
      note: 'Deliberately the smallest residual on this site, and that is itself the finding rather than ' +
            'a claim of unusual precision. Marketing software is bought on subscription with a named ' +
            'vendor and an invoice, so the budget is unusually well documented compared with a bill of ' +
            'materials for a physical device, where a third of the cost can be fasteners and freight ' +
            'nobody itemises. What this line does hide is real: unused seats. Independent surveys ' +
            'repeatedly find that a large minority of purchased martech capability is never deployed, ' +
            'and no vendor has any incentive to measure that properly.',
      sources: ['Gartner', 'Company statements']
    },

    /* ============================ META ============================ */
    {
      id: 'cloud-mt', name: 'The cloud underneath all of it', short: 'Cloud', kind: 'meta',
      blurb: 'Every vendor on this page is a tenant. Three landlords.',
      market: { size: 'USD ~129bn per quarter', year: 2026, basis: 'cloud infrastructure services spend, Q1 2026' },
      asOf: '2026', confidence: 'high', chokepoint: true,
      shares: [
        { c: 'Amazon', p: 28 }, { c: 'Microsoft', p: 21 }, { c: 'Google', p: 14 }
      ],
      note: 'Almost every vendor named anywhere in this teardown runs on one of three companies, two of ' +
            'which also appear in the advertising row as competitors to their own tenants. Snowflake is ' +
            'the cleanest illustration: roughly four fifths of its deployments sit on AWS, and Amazon ' +
            'sells a competing warehouse. The dependency runs the other way too, and that is what has ' +
            'kept it stable: these are among each other’s largest customers. Worth noting ' +
            'the direction of travel: the three grew at 19%, 40% and 63% respectively in the quarter ' +
            'measured, so this table is less settled than it looks.',
      sources: ['Synergy Research', 'Company filings']
    },
    {
      id: 'privacy-mt', name: 'Privacy regulation', short: 'Regulation', kind: 'meta',
      blurb: 'The law that decides what any of the layers above are permitted to remember.',
      market: { size: null, year: 2026, basis: 'regulatory regime, not a market' },
      asOf: '2026', confidence: 'medium', chokepoint: true,
      shares: [],
      note: 'Not a market, and the clearest case on this site of regulation designing a component. GDPR ' +
            'created the consent management layer from nothing in 2018. Apple’s App Tracking ' +
            'Transparency, a platform policy rather than a law, removed the mobile advertising ' +
            'identifier for most iOS users in 2021 and cost the platforms above tens of billions in ' +
            'measurable revenue: a single company’s product decision reaching further into ' +
            'this industry than any statute. The EU Digital Markets Act now constrains how the ' +
            'gatekeepers may combine data across their own services. The consent management category ' +
            'that grew out of all this is led by OneTrust, with TrustArc, Didomi, Cookiebot and ' +
            'Usercentrics behind it; published share figures for it come from press releases rather ' +
            'than trackers, and are not reproduced here.',
      sources: ['Company statements', 'Digiday']
    },
    {
      id: 'appstore-mt', name: 'Mobile app distribution', short: 'App stores', kind: 'meta',
      blurb: 'Two stores, a commission, and the rule that you may not mention a cheaper price elsewhere.',
      market: { size: 'USD ~166bn', year: 2025, basis: 'combined iOS App Store and Google Play consumer spend' },
      asOf: '2025', confidence: 'medium', chokepoint: true,
      shares: [
        { c: 'Apple', p: 70.5 }, { c: 'Google', p: 29.5 }
      ],
      note: 'A two-firm table by construction, because on most devices there is no third option. Apple ' +
            'took roughly USD 117bn of consumer spend to Google Play’s USD 49bn in 2025: the ' +
            'inverse of installed base, where Android holds around 70% of devices. The standard ' +
            'commission is 30%, reduced to 15% for small developers and for subscriptions after the ' +
            'first year. For a marketing organisation the commission is usually not the binding ' +
            'constraint; the anti-steering rules are, because they have historically restricted telling ' +
            'a customer inside the app that the same thing is cheaper on the web. Litigation and the ' +
            'Digital Markets Act have loosened this materially and unevenly by jurisdiction, which is ' +
            'why this is graded medium.',
      sources: ['Company filings', 'Digiday']
    },
    {
      id: 'standards-mt', name: 'Web standards', short: 'Standards', kind: 'meta',
      blurb: 'Who decides what a browser is required to do. Largely the people who make the browsers.',
      market: { size: null, year: 2026, basis: 'standards process, not a market' },
      asOf: '2026', confidence: 'medium',
      shares: [],
      note: 'HTML and the DOM are maintained by the WHATWG, a body constituted from the browser ' +
            'engine vendors themselves (Apple, Google, Microsoft and Mozilla) with the W3C ' +
            'handling much of the rest. There is no independent standards authority for the web in the ' +
            'sense that there is for, say, mains voltage. Advertising-relevant proposals run through the ' +
            'same process: Google’s Privacy Sandbox was standards work by the company that sells ' +
            'the advertising, reviewed by a group in which the other large seller of advertising holds a ' +
            'veto. That is a structural conflict rather than an accusation, and everyone involved states ' +
            'it openly.',
      sources: ['Company statements', 'W3Techs']
    },

    /* ==================== ADS CHILDREN (tier 2) ==================== */
    {
      id: 'search-ads', parent: 'ads', name: 'Search', short: 'Search',
      shape: { x: 150, y: 120, w: 220, h: 180 },
      blurb: 'Intent-driven advertising, and the closest thing to a pure monopoly on this site.',
      market: { size: 'not sized separately here', year: 2026, basis: 'share of worldwide search engine queries, August 2026: query share, not revenue share' },
      asOf: '2026', confidence: 'high', chokepoint: true,
      shares: [
        { c: 'Google', p: 91.1 }, { c: 'Microsoft', p: 4.5 }, { c: 'Yahoo', p: 1.23 },
        { c: 'Yandex', p: 0.99 }, { c: 'DuckDuckGo', p: 0.7 }, { c: 'Baidu', p: 0.62 }
      ],
      note: 'Stated as queries rather than revenue, deliberately, because query share is openly measured ' +
            'and continuously published while search advertising revenue by engine is not. The two are ' +
            'not the same number and the difference matters: Baidu’s 0.62% of global queries ' +
            'understates a large domestic Chinese advertising business, and Microsoft monetises its ' +
            'queries at a different rate from Google. What the query figure does establish, and revenue ' +
            'would not establish more clearly, is that there is no second general search engine of ' +
            'consequence. A United States court found in 2024 that Google holds an unlawful monopoly in ' +
            'general search; the remedies decided in 2025 did not require divestiture of Chrome.',
      sources: ['StatCounter', 'Company statements']
    },
    {
      id: 'social-ads', parent: 'ads', name: 'Social and feed', short: 'Social',
      shape: { x: 390, y: 120, w: 220, h: 180 },
      blurb: 'Advertising sold against an algorithmic feed. The largest category, and the one with no agreed boundary.',
      market: { size: 'not separable', year: 2026, basis: 'no publisher defines the boundary of “social” advertising consistently' },
      asOf: '2026', confidence: 'medium',
      note: 'Named and not measured, and the reason is a definitional failure rather than a research gap ' +
            ', which makes it worth a row of its own. Is TikTok search advertising social? Is ' +
            'Amazon’s sponsored product feed? Is YouTube? Every publisher answers differently, and ' +
            'a “social ad market share” therefore measures the publisher’s taxonomy at ' +
            'least as much as the market. The companies do not help: Meta reports one advertising line ' +
            'covering four surfaces, and ByteDance is private and reports nothing. What can be said ' +
            'without picking a boundary is in the parent row above, where Meta and ByteDance hold 26.8% ' +
            'and 7.9% of all digital advertising respectively.',
      sources: ['eMarketer', 'MAGNA']
    },
    {
      id: 'retail-media', parent: 'ads', name: 'Retail media networks', short: 'Retail media',
      shape: { x: 630, y: 120, w: 220, h: 180 },
      blurb: 'Retailers selling advertising against their own purchase data. The fastest-growing category in advertising.',
      market: { size: 'USD ~197bn', year: 2026, basis: 'worldwide retail media advertising spend; the share split below is United States only' },
      asOf: '2026', confidence: 'low', chokepoint: true,
      shares: [
        { c: 'Amazon', p: 76 }, { c: 'Walmart', p: 12.2 }
      ],
      note: 'The published, citable figure is the combined one: Amazon and Walmart together are ' +
            'forecast to take 88.2% of United States retail media spend in 2026 and better than 89% of ' +
            'the incremental spend. The split between the two shown here is derived from reported ' +
            'revenue and is the weakest number in this row, treat the 88.2% as the finding and ' +
            'the two components as indicative. Amazon’s advertising business alone is now larger ' +
            'than the entire global newspaper industry. Every large retailer is building one, and the ' +
            'enabling vendors (Criteo, CitrusAd, Topsort) are an active acquisition target ' +
            'set for retailers and ad tech platforms alike.',
      sources: ['eMarketer', 'Company filings']
    },
    {
      id: 'dsp', parent: 'ads', name: 'Demand side platforms', short: 'DSP',
      shape: { x: 150, y: 330, w: 220, h: 180 },
      blurb: 'Buying advertising on the open internet: meaning everything that is not Google, Meta or Amazon.',
      layout: 'chain',
      market: { size: 'USD ~55bn', year: 2026, basis: 'programmatic spend transacted through demand side platforms, estimated' },
      asOf: '2026', confidence: 'low',
      shares: [
        { c: 'The Trade Desk', p: 38 }, { c: 'Amazon', p: 22 }, { c: 'Google', p: 14 },
        { c: 'Yahoo', p: 6 }, { c: 'Criteo', p: 5 }
      ],
      note: 'The Trade Desk built a large business on a single argument: that buyers want a platform ' +
            'that does not also own the media it is selling them. Amazon DSP now attacks that directly, ' +
            'with retail purchase data no independent can match, and it is the central competitive ' +
            'question in ad tech. Graded low because the denominator is estimated and the participants ' +
            'define “spend through the platform” inconsistently, some report gross ' +
            'billings, some net revenue, and the difference is roughly a factor of five.',
      sources: ['eMarketer', 'Company filings']
    },
    {
      id: 'ssp', parent: 'ads', name: 'Supply side platforms and exchanges', short: 'SSP',
      shape: { x: 390, y: 330, w: 220, h: 180 },
      blurb: 'The sell side of the auction. Where a publisher’s inventory is actually offered.',
      layout: 'chain',
      market: { size: 'USD ~21bn', year: 2026, basis: 'supply side platform revenue, estimated' },
      asOf: '2026', confidence: 'low',
      note: 'Named and not measured, and this one is a genuine finding about the market rather than ' +
            'about the sources. The sell side is deliberately opaque: the same impression is commonly ' +
            'offered through several exchanges at once, so counting it consistently is impossible even ' +
            'in principle, and the fee taken between what a buyer pays and what a publisher receives ' +
            'has been the subject of repeated industry studies that could not fully account for it. ' +
            'Named players: Google Ad Manager, which is the largest and was found by a United States ' +
            'court in 2025 to have unlawfully monopolised publisher ad server and exchange markets, ' +
            'plus Magnite, PubMatic, Index Exchange and Amazon Publisher Services. Some aggregators ' +
            'publish SSP “market share” tables built from technology-detection counts; those ' +
            'measure adoption, not money, and are not reproduced here.',
      sources: ['Digiday', 'Company statements']
    },
    {
      id: 'verification', parent: 'ads', name: 'Ad verification', short: 'Verification',
      shape: { x: 630, y: 330, w: 220, h: 180 },
      blurb: 'Independent measurement of whether the advertising was seen by a person, next to safe content.',
      market: { size: 'USD ~1.5bn', year: 2025, basis: 'independent ad verification revenue' },
      asOf: '2025', confidence: 'medium', chokepoint: true,
      shares: [
        { c: 'DoubleVerify', p: 45 }, { c: 'Integral Ad Science', p: 36 }
      ],
      note: 'A duopoly, and one that got tighter rather than looser: Oracle shut down its Moat ' +
            'verification business in 2024 and both survivors picked up the renewals. The barriers are ' +
            'real: accreditation from the Media Rating Council, direct integrations with every ' +
            'major platform, and a fraud dataset that only accumulates with scale. Worth sitting with ' +
            'the structural oddity: the platforms being audited also decide what measurement access the ' +
            'auditors are granted, and both verification vendors are materially smaller than the ' +
            'compliance departments of the companies they audit.',
      sources: ['Digiday', 'Company filings']
    },

    /* =============== ADS DESCENT (tiers 3 to 5) =============== */
    {
      id: 'identity-graph', parent: 'dsp', name: 'Identity resolution', short: 'Identity graph',
      shape: { x: 150, y: 120, w: 340, h: 200 },
      blurb: 'Deciding that the person on this phone and the person on that laptop are the same person.',
      layout: 'chain',
      market: { size: 'not sized', year: 2026, basis: 'no published market definition; the function is bundled into DSP, CDP and data broker pricing' },
      asOf: '2026', confidence: 'low', chokepoint: true,
      note: 'The load-bearing layer of the entire advertising half of this teardown, and nobody ' +
            'publishes a share for it, because it is not sold as a product. Identity resolution is ' +
            'bundled invisibly into the platforms above: The Trade Desk’s UID2, ' +
            'LiveRamp’s RampID, Google’s and Meta’s internal graphs, and the offline ' +
            'files sold by the data brokers. What can be stated plainly is the dependency: everything ' +
            'above this row: frequency capping, retargeting, attribution, audience buying, ' +
            'incrementality testing: requires it to work, and whether it works is decided one ' +
            'tier down, in the browser, by a company that sells advertising.',
      sources: ['Digiday', 'Company statements']
    },
    {
      id: 'bidstream', parent: 'ssp', name: 'Real-time bidding', short: 'RTB',
      shape: { x: 150, y: 120, w: 340, h: 200 },
      blurb: 'An auction held in about a tenth of a second, several hundred billion times a day.',
      market: { size: 'not sized as a market', year: 2026, basis: 'a protocol and an auction, not a product with vendors' },
      asOf: '2026', confidence: 'medium',
      note: 'Not a market at all: it is a protocol, OpenRTB, published by the IAB Tech Lab and ' +
            'implemented by everyone. It is included as a layer because of what it broadcasts. A bid ' +
            'request carries the page, the approximate location, the device and an identifier to every ' +
            'bidder invited to the auction, whether or not they bid, which means the data is ' +
            'distributed hundreds of billions of times a day to companies that never win anything. ' +
            'European regulators have found the resulting consent framework unlawful, and the technical ' +
            'design is the reason: there is no mechanism in the protocol to retrieve data once it has ' +
            'been broadcast.',
      sources: ['Digiday', 'Company statements']
    },
    {
      id: 'cookie', parent: 'identity-graph', name: 'Third-party identifiers', short: 'Cookies and IDs',
      shape: { x: 150, y: 120, w: 340, h: 200 },
      blurb: 'The cookie and the mobile advertising ID: the two things that made any of this measurable.',
      layout: 'chain',
      market: { size: null, year: 2026, basis: 'a platform capability granted or withdrawn by policy, not a market' },
      asOf: '2026', confidence: 'medium', chokepoint: true,
      note: 'Two identifiers carried the addressable internet for twenty years, and both are now ' +
            'granted at the discretion of a platform owner rather than being properties of the web. ' +
            'Apple’s App Tracking Transparency made the mobile advertising identifier opt-in in ' +
            '2021 and the overwhelming majority of users declined. Safari and Firefox block third-party ' +
            'cookies by default and have for years. Google announced the end of third-party cookies in ' +
            'Chrome, moved the date repeatedly across five years, and in 2025 abandoned the deprecation ' +
            'entirely in favour of a user choice prompt: a reversal that reset the plans of every ' +
            'vendor in the rows above. The lesson is the one this teardown keeps making: this is not a ' +
            'supply that can be contracted for. It is a setting in someone else’s product.',
      sources: ['Company statements', 'Digiday']
    },
    {
      id: 'browser', parent: 'identity-graph', name: 'The browser', short: 'Browser',
      shape: { x: 510, y: 120, w: 340, h: 200 },
      blurb: 'The program that decides whether any of the machinery above is permitted to function.',
      layout: 'chain',
      market: { size: 'not a market: no browser is sold', year: 2026, basis: 'share of worldwide browser sessions, August 2026' },
      asOf: '2026', confidence: 'high', chokepoint: true,
      shares: [
        { c: 'Google', p: 69.39 }, { c: 'Apple', p: 15.83 }, { c: 'Microsoft', p: 5.36 },
        { c: 'Mozilla', p: 2.98 }, { c: 'Samsung', p: 2.01 }, { c: 'Opera', p: 1.94 }
      ],
      note: 'Attributed to the owning company rather than the product name, because that is the fact ' +
            'that matters here: Chrome is Google’s, Safari is Apple’s, Edge is ' +
            'Microsoft’s. Nobody sells a browser. There is no revenue in this row and therefore no ' +
            'market to compete in: the browser is a distribution channel for search and an ' +
            'enforcement point for advertising policy, funded from elsewhere. That is why a 69% share ' +
            'here does not attract the scrutiny a 69% share of a paid market would, and why the ' +
            'settlement of the United States search case in 2025 left Chrome with Google.',
      sources: ['StatCounter', 'W3Techs']
    },
    {
      id: 'browser-engine', parent: 'browser', name: 'Rendering engines', short: 'Engines',
      shape: { x: 150, y: 120, w: 340, h: 200 },
      blurb: 'The bottom of this teardown. Three engines are left, and two belong to the largest sellers of advertising.',
      market: { size: null, year: 2026, basis: 'browser session share mapped to the underlying rendering engine' },
      asOf: '2026', confidence: 'medium', chokepoint: true,
      shares: [
        { c: 'Google', p: 78.7 }, { c: 'Apple', p: 15.8 }, { c: 'Mozilla', p: 3 }
      ],
      note: 'The terminus, and the most concentrated layer on this page. Blink is Google’s and ' +
            'renders Chrome, Edge, Opera, Samsung Internet, Brave, Arc and Vivaldi. WebKit is ' +
            'Apple’s. Gecko is Mozilla’s. That is the complete list, building a fourth ' +
            'is a decade of work that nobody has attempted seriously since Microsoft gave up in 2018 ' +
            'and adopted Blink. Two caveats on the numbers, both material. First, these are derived by ' +
            'mapping browser share onto engines, not measured directly. Second, they understate WebKit: ' +
            'until the Digital Markets Act forced a change in the EU, every browser on iOS was required ' +
            'to use WebKit, so a Chrome session on an iPhone counts as Chrome above and runs on ' +
            'Apple’s engine here. The direction of the error is known; its size is not, which is ' +
            'why this is graded medium rather than high.',
      sources: ['StatCounter', 'Company statements']
    },
    {
      id: 'engine-funding', parent: 'browser', name: 'Who pays for the third engine', short: 'Engine funding',
      shape: { x: 510, y: 120, w: 340, h: 200 },
      blurb: 'The only independent rendering engine is funded almost entirely by the company it competes with.',
      market: { size: 'USD ~495m in search royalties', year: 2023, basis: 'royalty revenue of Mozilla Corporation and subsidiaries, from audited consolidated statements: an organisation’s accounts, not a market' },
      asOf: '2023', confidence: 'high', chokepoint: true,
      note: 'The single most striking fact in this teardown, and it comes from audited accounts rather ' +
            'than an estimate. Mozilla’s consolidated financial statements for 2023 record about ' +
            'USD 495m of royalty revenue from search providers for the default search position in ' +
            'Firefox, amounting to roughly 76% of the group’s total revenue: a proportion ' +
            'that has been as high as 86% in 2020 and, earlier still, above 90%. The provider is ' +
            'overwhelmingly Google, as established in United States v. Google. So ' +
            'the only rendering engine not owned by an advertising platform is paid for by the largest ' +
            'advertising platform, and Mozilla filed publicly in 2025 arguing against remedies that ' +
            'would end those payments, on the grounds that they would threaten its existence. Every ' +
            'other terminus on this site is a mine, a factory, a queue or a monopolist. This one is a ' +
            'non-profit that cannot afford to win.',
      sources: ['Mozilla Foundation financial statements', 'Company statements']
    },

    /* ==================== AGENCY CHILDREN ==================== */
    {
      id: 'holdco', parent: 'agency', name: 'Holding companies', short: 'Holdcos',
      shape: { x: 150, y: 150, w: 340, h: 200 },
      blurb: 'Five groups own most of the named agencies, and have since the 1980s.',
      market: { size: 'USD ~72bn', year: 2024, basis: 'combined revenue of the five largest agency holding companies' },
      asOf: '2025', confidence: 'medium',
      note: 'Six became five in November 2025 when Omnicom closed on Interpublic. The structure is ' +
            'nearly forty years old and was built by roll-up: the recognisable agency names, ' +
            'BBDO, Ogilvy, Leo Burnett, Saatchi, are brands inside these groups rather than ' +
            'companies. What has changed is where the margin sits. Creative is a low-margin business ' +
            'competing with in-house teams and now with generative tools; media buying, where the group ' +
            'takes a position on inventory, is where the money is. That shift is the reason the ' +
            'principal-based buying row beside this one matters more than its complete absence from ' +
            'the published data suggests.',
      sources: ['Digiday', 'Company filings']
    },
    {
      id: 'principal-media', parent: 'agency', name: 'Principal-based buying', short: 'Principal media',
      shape: { x: 510, y: 150, w: 340, h: 200 },
      blurb: 'The agency buys inventory for its own account and resells it to the client at a price it sets.',
      market: { size: 'not disclosed by any participant', year: 2026, basis: 'no holding company reports principal media volume separately' },
      asOf: '2026', confidence: 'low', chokepoint: true,
      note: 'Named and not measured because no participant discloses it, which is the entire point of ' +
            'including it. In a principal transaction the agency is not an agent: it takes ownership of ' +
            'inventory at one price and sells it to the client at another, and the spread is its ' +
            'revenue rather than a disclosed commission. The practice is legal, disclosed in principle ' +
            'in the master services agreement, and has grown substantially as commission margin fell. ' +
            'The Association of National Advertisers has published repeated studies finding that ' +
            'advertisers frequently cannot determine what share of their own budget was transacted this ' +
            'way. This is the only layer in this teardown where the buyer cannot in practice audit ' +
            'what they paid: a different kind of chokepoint from the rest of the page.',
      sources: ['Digiday', 'Company statements']
    },

    /* ==================== CRM CHILDREN ==================== */
    {
      id: 'crm-integration', parent: 'crm', name: 'Integration and data management', short: 'Integration',
      shape: { x: 150, y: 150, w: 340, h: 200 },
      blurb: 'Getting the customer record to agree with the eleven other systems that also hold it.',
      market: { size: 'USD ~19bn', year: 2025, basis: 'data integration and integration platform revenue, contested definition' },
      asOf: '2025', confidence: 'low',
      note: 'Named and not measured: this category has been defined and redefined four times in a ' +
            'decade (ETL, then iPaaS, then reverse ETL, now “data fabric”) and ' +
            'the share tables move with the definition rather than with the market. What is firm is the ' +
            'deal record, which is unusually informative. Salesforce paid USD 6.5bn for MuleSoft in ' +
            '2018 and roughly USD 8bn for Informatica in 2025; IBM paid USD 6.4bn for HashiCorp in ' +
            '2025. Buyers keep paying application multiples for plumbing, which tells you the plumbing ' +
            'is where the switching cost lives.',
      sources: ['Gartner', 'Company filings'],
      deals: [
        { y: 2018, a: 'Salesforce', t: 'MuleSoft', v: 'USD 6.5bn', n: 'The first of the very large integration acquisitions, and the template for the rest.' },
        { y: 2025, a: 'IBM', t: 'HashiCorp', v: 'USD 6.4bn', n: 'Infrastructure automation folded into the Red Hat hybrid cloud portfolio.' }
      ]
    },
    {
      id: 'crm-ai', parent: 'crm', name: 'Agent and assistant layer', short: 'AI agents',
      shape: { x: 510, y: 150, w: 340, h: 200 },
      blurb: 'The layer every vendor in this teardown is currently betting the company on.',
      market: { size: 'not credibly sized', year: 2026, basis: 'no tracker separates agent revenue from the suite it is bundled into' },
      asOf: '2026', confidence: 'low',
      note: 'Named and not measured, and any figure claiming otherwise should be treated with ' +
            'suspicion. Every suite vendor on this page has launched an agent product: Salesforce ' +
            'Agentforce, Microsoft Copilot, Adobe and HubSpot equivalents, and none reports its ' +
            'revenue separately from the suite it is sold inside, because most of it is bundled to ' +
            'defend renewals rather than sold. The structurally interesting question is not who wins ' +
            'this row. It is whether the row dissolves the one above it: if the agent, not the human, ' +
            'operates the CRM, the interface stops being the moat and the data does, which is ' +
            'precisely why Salesforce paid USD 8bn for a data management company in the same year it ' +
            'launched the agents.',
      sources: ['Gartner', 'Company statements']
    },

    /* ==================== MESSAGING CHILDREN ==================== */
    {
      id: 'esp', parent: 'messaging', name: 'Sending infrastructure', short: 'ESP',
      shape: { x: 150, y: 120, w: 220, h: 200 },
      blurb: 'The servers and reputation that actually put a marketing email into the internet.',
      layout: 'chain',
      market: { size: 'USD ~4bn', year: 2026, basis: 'transactional and marketing email sending infrastructure revenue, estimated' },
      asOf: '2026', confidence: 'low',
      shares: [
        { c: 'Twilio', p: 21 }, { c: 'Salesforce', p: 12 }, { c: 'Amazon', p: 10 },
        { c: 'HubSpot', p: 6 }, { c: 'Klaviyo', p: 5 }
      ],
      note: 'Distinct from the marketing application above it: this is the sending layer, where ' +
            'SendGrid, Salesforce’s ExactTarget infrastructure, Amazon SES, Mailgun and Postmark ' +
            'operate. The asset is not software but IP reputation: a pool of sending addresses ' +
            'that the receiving inboxes have learned to trust, which takes years to build and can be ' +
            'destroyed in a week by one careless customer on a shared pool. That is the real product, ' +
            'it is unpatentable, and it is granted entirely at the discretion of the layer below.',
      sources: ['Gartner', 'Company filings']
    },
    {
      id: 'deliverability', parent: 'messaging', name: 'Inbox delivery', short: 'Deliverability',
      shape: { x: 390, y: 120, w: 220, h: 200 },
      blurb: 'Whether the message is seen at all. Decided by two companies who charge nothing and promise nothing.',
      layout: 'chain',
      market: { size: null, year: 2026, basis: 'share of tracked email opens by client, May 2026: opens, not accounts and not revenue' },
      asOf: '2026', confidence: 'medium', chokepoint: true,
      shares: [
        { c: 'Apple', p: 64.66 }, { c: 'Google', p: 24.11 }, { c: 'Microsoft', p: 5.67 }
      ],
      note: 'The sideways chokepoint of this teardown, and the closest software equivalent to the ' +
            'cable-ship constraint on the submarine cable page. Email is the cheapest owned reach a ' +
            'marketer has, and whether any of it arrives is decided by two companies with whom the ' +
            'sender has no contract, no price and no service level. Google and Yahoo tightened bulk ' +
            'sender requirements in 2024: mandatory authentication, one-click unsubscribe, and a ' +
            'hard spam-complaint threshold, and every marketing organisation on earth complied ' +
            'inside a quarter, because there was no alternative and no negotiation. One measurement ' +
            'caveat, and it is large: Apple Mail Privacy Protection pre-fetches images, registering ' +
            'opens no human performed, which inflates Apple against Gmail by an unmeasurable amount.',
      sources: ['Litmus', 'Company statements']
    },
    {
      id: 'sms', parent: 'messaging', name: 'SMS and push', short: 'SMS',
      shape: { x: 630, y: 120, w: 220, h: 200 },
      blurb: 'Application-to-person messaging, where the mobile carrier takes a fee on every message.',
      market: { size: 'USD ~29bn', year: 2026, basis: 'application-to-person SMS revenue including carrier termination fees' },
      asOf: '2026', confidence: 'low',
      note: 'Named and not measured. The aggregators: Twilio, Sinch, Infobip, Vonage, Bandwidth ' +
            ': do publish revenue, but most of it is not theirs: a large majority passes straight ' +
            'through to mobile carriers as termination fees, so revenue share and value capture are ' +
            'wildly different here and no source separates them consistently. This is also the one ' +
            'channel in the teardown where an intermediary can raise the price unilaterally. United ' +
            'States carriers introduced new registration fees and per-message surcharges through the ' +
            '10DLC regime, and every sender absorbed them.',
      sources: ['Company filings', 'Gartner']
    },

    /* ==================== WEB CHILDREN ==================== */
    {
      id: 'hosting', parent: 'web', name: 'Hosting', short: 'Hosting',
      shape: { x: 150, y: 150, w: 340, h: 200 },
      blurb: 'The machine the site is actually served from, and the sponsor-owned roll-ups behind most of them.',
      market: { size: 'USD ~110bn', year: 2026, basis: 'web hosting and managed site services revenue, broad definition' },
      asOf: '2026', confidence: 'low',
      note: 'Named and not measured, and the interesting thing about this layer is who owns it rather ' +
            'than how it splits. Shared web hosting has been consolidated almost entirely by private ' +
            'equity: Newfold Digital, which holds Bluehost, Network Solutions and Web.com among many ' +
            'others, is a Clearlake and Siris vehicle; GoDaddy is listed; Hostinger and Namecheap are ' +
            'private; and Automattic’s WordPress.com sits alongside the open source project it ' +
            'stewards. The pattern is the one this site keeps finding in unglamorous layers, low ' +
            'growth, high retention, therefore a sponsor roll-up rather than a public market.',
      sources: ['W3Techs', 'Company filings']
    },
    {
      id: 'plugins', parent: 'web', name: 'The plugin economy', short: 'Plugins',
      shape: { x: 510, y: 150, w: 340, h: 200 },
      blurb: 'Sixty thousand extensions, installed by the million, maintained by whoever feels like it.',
      market: { size: 'not sized', year: 2026, basis: 'no revenue series exists; most plugins are free' },
      asOf: '2026', confidence: 'low', chokepoint: true,
      upstream: ['oss-maintainers'],
      note: 'The layer where WordPress’s dominance turns into a supply chain problem rather than ' +
            'just a market share. A typical commercial WordPress site runs twenty to forty plugins; the ' +
            'directory holds around sixty thousand; and a single popular one can be installed on ' +
            'millions of sites while being maintained by one unpaid person. That is the same structure ' +
            'as the maintainer layer several rows below, with a sharper edge: plugins execute with full ' +
            'privileges on the site, so a compromised or abandoned one is a compromise of the ' +
            'commercial presence itself. This is the most common route by which a marketing site is ' +
            'actually breached, and it appears in no budget line anywhere in this teardown.',
      sources: ['W3Techs', 'Company statements']
    },

    /* ==================== COMMERCE CHILD ==================== */
    {
      id: 'checkout', parent: 'commerce', name: 'Checkout and orchestration', short: 'Checkout',
      shape: { x: 150, y: 150, w: 340, h: 200 },
      blurb: 'The last twenty seconds, where a measurable share of the revenue is lost for mechanical reasons.',
      market: { size: 'not sized separately', year: 2026, basis: 'bundled into platform and payment service provider pricing' },
      asOf: '2026', confidence: 'low',
      upstream: ['payments'],
      note: 'Named and not measured, because nobody sells it as a line item: it is bundled into ' +
            'the commerce platform above and the payment processor below. It earns a row anyway ' +
            'because of where the leverage sits: accelerated checkouts owned by other companies ' +
            '(Shop Pay, Apple Pay, Google Pay, PayPal) convert materially better than a form, so the ' +
            'merchant adopts them, and in doing so hands the customer relationship and much of the ' +
            'data to the same platforms that appear in the advertising rows at the top of this ' +
            'teardown. Orchestration vendors exist to route between processors and keep that ' +
            'negotiable; most merchants below enterprise scale do not use one.',
      sources: ['Company statements', 'Nilson Report']
    },

    /* ==================== ANALYTICS CHILDREN ==================== */
    {
      id: 'tag-mgmt', parent: 'analytics', name: 'Tag management', short: 'Tag manager',
      shape: { x: 150, y: 150, w: 340, h: 200 },
      blurb: 'The single most concentrated market anywhere on this site. One company holds 99.6% of it.',
      market: { size: 'not sized: the leading product is free', year: 2026, basis: 'share of the tag manager market by detected installation across the top 10 million sites' },
      asOf: '2026', confidence: 'high', chokepoint: true,
      shares: [
        { c: 'Google', p: 99.6 }
      ],
      note: 'One name, because there is effectively only one. The residual 0.4% is Adobe DTM at 0.5% ' +
            'of the market, Matomo and Tealium at 0.2% each and Yahoo below that, figures that ' +
            'round independently and are individually smaller than the rounding error on the leader. ' +
            'Google Tag Manager is on 45.5% of all websites and holds 99.6% of the sites that use a tag ' +
            'manager at all. Nothing else on this site, not EUV lithography, not the .com ' +
            'registry: measures higher, and unlike those two there is no technical barrier and no ' +
            'contract creating it. It is free, it is good, and it arrived attached to the analytics ' +
            'product that was already installed. What makes it consequential rather than merely ' +
            'impressive is what a tag manager is: a mechanism for injecting arbitrary JavaScript into a ' +
            'page after deployment, usually controlled by the marketing team rather than engineering. ' +
            'Effectively every commercial website has granted that capability to one company.',
      sources: ['W3Techs', 'BuiltWith']
    },
    {
      id: 'attribution', parent: 'analytics', name: 'Attribution and incrementality', short: 'Attribution',
      shape: { x: 510, y: 150, w: 340, h: 200 },
      blurb: 'Deciding which advertising caused the sale. Now largely done by the companies that sold the advertising.',
      market: { size: 'not sized', year: 2026, basis: 'no market series; the function has substantially returned inside the ad platforms' },
      asOf: '2026', confidence: 'medium',
      upstream: ['cookie'],
      note: 'Named and not measured, and the reason is a real structural reversal rather than missing ' +
            'data. Multi-touch attribution depended on observing a user across sites, and the ' +
            'identifier layer three tiers down withdrew that. What replaced it is telling: marketing ' +
            'mix modelling, a statistical technique from the 1960s that needs no user-level data at ' +
            'all, plus platform-side conversion measurement: Meta’s Conversions API, ' +
            'Google’s enhanced conversions, in which the advertiser sends their own ' +
            'conversion data to the platform, and the platform reports back how much of it the platform ' +
            'caused. The independent measurement layer did not consolidate. It was substantially ' +
            'reabsorbed by the sellers.',
      sources: ['Digiday', 'Company statements']
    },

    /* ==================== CDP CHILD ==================== */
    {
      id: 'reverse-etl', parent: 'cdp', name: 'Composable CDP and reverse ETL', short: 'Composable',
      shape: { x: 150, y: 150, w: 340, h: 200 },
      blurb: 'Doing the CDP’s job by querying the warehouse directly, and skipping the CDP.',
      market: { size: 'not sized separately', year: 2026, basis: 'reported inside the CDP and data tooling categories' },
      asOf: '2026', confidence: 'low',
      upstream: ['warehouse'],
      note: 'Named and not measured, and it is the layer dissolving its own parent. The argument is ' +
            'simple enough that it has largely won: if the customer data is already governed in the ' +
            'warehouse, copying it into a second proprietary store to do segmentation is duplicated ' +
            'cost and a second compliance surface. Hightouch and Census built businesses on that, and ' +
            'Gartner admitted the category into its 2026 CDP quadrant, which is the point at which an ' +
            'insurgency stops being one. The strategic reading matters for anyone looking at this ' +
            'stack: value is migrating downward into the warehouse row, and the application layer ' +
            'above is being hollowed out from underneath.',
      sources: ['Gartner', 'CDP Institute']
    },

    /* ==================== WAREHOUSE CHILDREN ==================== */
    {
      id: 'table-format', parent: 'warehouse', name: 'Open table formats', short: 'Table format',
      shape: { x: 150, y: 150, w: 340, h: 200 },
      blurb: 'How the rows are actually written to disk. A standards war fought with acquisitions.',
      market: { size: 'no revenue: both leading formats are free', year: 2026, basis: 'open source specifications, not products' },
      asOf: '2026', confidence: 'medium', chokepoint: true,
      note: 'Two formats, Apache Iceberg and Delta Lake, decide the layout of the files underneath ' +
            'every warehouse in the row above, and neither generates a dollar of revenue. The reason ' +
            'they matter is lock-in: whoever’s format the data sits in gets to define what reads ' +
            'it efficiently. Databricks paid roughly USD 2bn for Tabular in 2024: a company with ' +
            'negligible revenue: specifically to acquire the founders of Iceberg, the format its ' +
            'main competitor had adopted. That is a clean, expensive demonstration that in software ' +
            'the file format can be the chokepoint, and it is the closest analogue on this site to a ' +
            'materials specification gating a physical supply chain.',
      sources: ['Company statements', 'Gartner']
    },
    {
      id: 'query-engine', parent: 'warehouse', name: 'Query and compute engines', short: 'Query engine',
      shape: { x: 510, y: 150, w: 340, h: 200 },
      blurb: 'What actually executes the query, increasingly separated from where the data is stored.',
      market: { size: 'not sized separately', year: 2026, basis: 'bundled into warehouse consumption pricing' },
      asOf: '2026', confidence: 'low',
      note: 'Named and not measured because it is sold by the second, not by the seat: warehouse ' +
            'pricing is consumption-based, so the compute layer has no separate revenue line to divide ' +
            'up. It is included because separating storage from compute is what made the format war ' +
            'above winnable at all, with an open format and detached compute, a buyer can in ' +
            'principle change engine without moving a byte, which is the first genuine reduction in ' +
            'switching cost anywhere in this teardown. Named engines: Spark, Trino, DuckDB, ClickHouse, ' +
            'Snowflake’s and BigQuery’s proprietary engines, and Photon.',
      sources: ['Company statements', 'Gartner']
    },

    /* ==================== INFRA CHILDREN (tier 2) ==================== */
    {
      id: 'cdn', parent: 'infra', name: 'CDN and edge', short: 'CDN',
      shape: { x: 110, y: 120, w: 190, h: 180 },
      blurb: 'Caching, routing and denial-of-service protection sitting in front of the origin server.',
      market: { size: 'USD ~26bn', year: 2026, basis: 'share of the reverse proxy market by detected use across the top 10 million sites: sites, not revenue' },
      asOf: '2026', confidence: 'high', chokepoint: true,
      shares: [
        { c: 'Cloudflare', p: 84.6 }, { c: 'Amazon', p: 5.7 }, { c: 'Fastly', p: 3.1 },
        { c: 'Akamai', p: 2.2 }, { c: 'Imperva', p: 0.3 }
      ],
      note: 'Read the basis before the number, because the gap between the two readings is the whole ' +
            'strategy. By share of sites using a reverse proxy, Cloudflare holds 84.6% and sits in ' +
            'front of a quarter of the entire web. By revenue it is a fraction of that, because the ' +
            'free tier is genuinely free and Akamai monetises far more per customer. The freemium ' +
            'position is not a marketing tactic here; it is the product, and it buys the largest ' +
            'traffic-observation surface on the internet. It also concentrates operational risk to a ' +
            'degree nothing else in this teardown matches: Cloudflare configuration incidents in 2019, ' +
            '2022 and 2025 each took a visible fraction of the web offline simultaneously, and no ' +
            'customer of any layer above had a second route.',
      sources: ['W3Techs', 'BuiltWith']
    },
    {
      id: 'identity', parent: 'infra', name: 'Identity and access', short: 'Identity',
      shape: { x: 320, y: 120, w: 190, h: 180 },
      blurb: 'Single sign-on, customer identity, and the directory that decides who is allowed in.',
      market: { size: 'USD ~24bn', year: 2026, basis: 'identity and access management software revenue' },
      asOf: '2026', confidence: 'medium',
      shares: [
        { c: 'Microsoft', p: 41 }, { c: 'Okta', p: 12 }, { c: 'Ping Identity', p: 6 },
        { c: 'IBM', p: 5 }, { c: 'Amazon', p: 5 }
      ],
      note: 'Microsoft leads because Entra arrives inside an agreement the customer has already ' +
            'signed, not because it wins evaluations. This is the bundling problem every best-of-breed ' +
            'security vendor now faces, and it is why Thoma Bravo took Ping and ForgeRock private and ' +
            'merged them rather than continue fighting it in public markets. For a marketing ' +
            'organisation the row matters mainly on the customer-identity side, where the ' +
            'authentication choice quietly determines what is known about a logged-in user, and ' +
            'therefore what the analytics and CDP rows above have to work with.',
      sources: ['Gartner', 'Company filings'],
      deals: [
        { y: 2023, a: 'Thoma Bravo', t: 'ForgeRock into Ping Identity', v: 'USD 2.3bn', n: 'Sponsor merger of two identity vendors to build scale against a bundled incumbent.' }
      ]
    },
    {
      id: 'payments', parent: 'infra', name: 'Payments', short: 'Payments',
      shape: { x: 530, y: 120, w: 190, h: 180 },
      blurb: 'Card acceptance and orchestration. Fragmented here, and a duopoly one layer further down.',
      layout: 'chain',
      market: { size: 'USD ~130bn', year: 2026, basis: 'merchant acquiring and payment processing net revenue' },
      asOf: '2026', confidence: 'low',
      shares: [
        { c: 'Stripe', p: 12 }, { c: 'PayPal', p: 11 }, { c: 'Fiserv', p: 9 },
        { c: 'Adyen', p: 7 }, { c: 'Global Payments', p: 6 }, { c: 'Block', p: 5 }
      ],
      note: 'The best demonstration on this site that you must specify which layer you mean before a ' +
            'market share number carries any information at all. Acquiring is genuinely competitive ' +
            ': six firms, none above 12%, real price pressure. One layer down, where the card ' +
            'networks sit, it is a duopoly with pricing power neither acquirer nor merchant can ' +
            'escape. Same transaction, same dollar, two completely different market structures ' +
            'depending on where you cut.',
      sources: ['Nilson Report', 'Company filings'],
      deals: [
        { y: 2025, a: 'Global Payments', t: 'Worldpay', v: 'USD 24.25bn', n: 'Bought from GTCR and FIS while divesting its own issuer business to FIS. Scale consolidation in acquiring.' }
      ]
    },
    {
      id: 'dns', parent: 'infra', name: 'DNS and naming', short: 'DNS',
      shape: { x: 740, y: 120, w: 190, h: 180 },
      blurb: 'Turning a name into an address. The first thing that happens, and the first thing that fails.',
      layout: 'chain',
      market: { size: 'USD ~3bn', year: 2026, basis: 'share of all websites by authoritative DNS provider: sites, not revenue' },
      asOf: '2026', confidence: 'high',
      shares: [
        { c: 'Cloudflare', p: 18.1 }, { c: 'GoDaddy', p: 9.9 }, { c: 'Hostinger', p: 4.5 },
        { c: 'United Internet', p: 3.8 }, { c: 'Wix', p: 3.7 }, { c: 'Newfold Digital', p: 3.6 },
        { c: 'Amazon', p: 3.4 }, { c: 'Google', p: 2.6 }, { c: 'Namecheap', p: 1.9 }
      ],
      note: 'Cloudflare again, and this is the second row in this teardown where it holds the largest ' +
            'position, which is the actual concentration story, since DNS and the reverse proxy ' +
            'are the two layers that must both work before anything else does. The coverage here looks ' +
            'thin at roughly half of all sites, and that is genuine rather than a data gap: DNS is the ' +
            'least consolidated infrastructure layer on this page, with a long tail of hosting ' +
            'companies serving their own. What is not fragmented at all sits directly underneath it.',
      sources: ['W3Techs', 'BuiltWith']
    },
    {
      id: 'tls', parent: 'infra', name: 'TLS certificates', short: 'Certificates',
      shape: { x: 215, y: 330, w: 190, h: 180 },
      blurb: 'The padlock. Two thirds of it is issued free by a non-profit.',
      layout: 'chain',
      market: { size: 'USD ~1.5bn', year: 2026, basis: 'share of the certificate authority market by issuing authority detected across the top 10 million sites: certificates, not revenue' },
      asOf: '2026', confidence: 'high', chokepoint: true,
      shares: [
        { c: 'Let\'s Encrypt', p: 67.7 }, { c: 'GlobalSign', p: 21.4 }, { c: 'Sectigo', p: 5 },
        { c: 'GoDaddy', p: 3.7 }, { c: 'DigiCert', p: 1.7 }
      ],
      note: 'One of the strangest structures on this site. Encrypting the web was a paid business until ' +
            '2015; Let\'s Encrypt, operated by the non-profit Internet Security Research Group and ' +
            'funded by donations and corporate sponsorship, now issues certificates for roughly two ' +
            'thirds of it at no charge, having automated the process that the paid authorities used to ' +
            'charge for. The commercial certificate industry did not consolidate in response so much ' +
            'as retreat upmarket into identity assurance. What is left is a genuine single point of ' +
            'failure with no commercial owner: a large fraction of the encrypted web depends on an ' +
            'organisation with a small operating budget, no customers in the ordinary sense, and no ' +
            'obligation to anyone.',
      sources: ['W3Techs', 'BuiltWith']
    },
    {
      id: 'observability', parent: 'infra', name: 'Observability', short: 'Observability',
      shape: { x: 425, y: 330, w: 190, h: 180 },
      blurb: 'Logs, metrics and traces. How anyone finds out why the stack above just stopped.',
      market: { size: 'USD ~36bn', year: 2026, basis: 'observability and IT operations analytics revenue' },
      asOf: '2026', confidence: 'medium',
      shares: [
        { c: 'Cisco', p: 17 }, { c: 'Datadog', p: 14 }, { c: 'Dynatrace', p: 7 },
        { c: 'Microsoft', p: 7 }, { c: 'Elastic', p: 5 }, { c: 'New Relic', p: 4 }
      ],
      note: 'Cisco appears at the top only because it paid USD 28bn for Splunk, its largest acquisition ' +
            'ever. That deal repriced the whole category and triggered the take-private of New Relic ' +
            'inside the same window. Worth knowing for anyone underwriting this row: observability is ' +
            'consumption-priced and is reliably among the first line items cut when budgets tighten, ' +
            'which cuts both ways, it grows faster than seat-based software in expansion and ' +
            'contracts faster in a downturn.',
      sources: ['IDC', 'Gartner', 'Company filings'],
      deals: [
        { y: 2024, a: 'Cisco', t: 'Splunk', v: 'USD 28bn', n: 'Cisco’s largest acquisition ever, aimed at security and observability data.' },
        { y: 2023, a: 'Francisco Partners and TPG', t: 'New Relic', v: 'USD 6.5bn', n: 'Take-private of a listed observability vendor at a premium, weeks after the Splunk deal.' }
      ]
    },
    {
      id: 'oss-deps', parent: 'infra', name: 'Open source dependencies', short: 'Dependencies',
      shape: { x: 635, y: 330, w: 190, h: 180 },
      blurb: 'The several thousand packages every application on this page installs without reading.',
      layout: 'chain',
      market: { size: 'no market: the packages are free', year: 2026, basis: 'public package registries; no transaction and therefore no share' },
      asOf: '2026', confidence: 'medium', chokepoint: true,
      note: 'A layer with no vendors, no invoices and no market share, which is exactly why it is worth ' +
            'a row. A typical commercial JavaScript application installs several hundred to a few ' +
            'thousand transitive packages from npm; the equivalent holds for PyPI and Maven Central. ' +
            'None of it is procured, almost none is reviewed, and the registries are themselves ' +
            'single points of failure operated by a small number of organisations. The consequences ' +
            'are on the public record: left-pad in 2016, event-stream in 2018, Log4Shell in 2021, the ' +
            'xz-utils backdoor in 2024, and repeated large-scale npm maintainer account compromises in ' +
            '2025. Every one of those reached production through a dependency nobody chose ' +
            'deliberately.',
      sources: ['Tidelift', 'Company statements']
    },

    /* ================ INFRA DESCENT (tier 3) ================ */
    {
      id: 'registry-com', parent: 'dns', name: 'The .com registry', short: '.com registry',
      shape: { x: 150, y: 150, w: 340, h: 200 },
      blurb: 'One company, one government contract, and a price the United States sets.',
      market: { size: 'USD ~1.6bn', year: 2025, basis: 'one contracted registry operator for the .com top-level domain: a contract, not a market' },
      asOf: '2026', confidence: 'high', chokepoint: true,
      shares: [
        { c: 'Verisign', p: 100 }
      ],
      note: 'A hundred per cent, and unlike every other concentrated layer on this site it is not the ' +
            'result of competition. It is a contract. Verisign operates .com under a registry ' +
            'agreement with ICANN, running alongside a Cooperative Agreement with the United States ' +
            'Department of Commerce that constrains its conduct, including a bar on Verisign ' +
            'also acting as a registrar for .com, a restriction imposed on no other registry. The ' +
            'wholesale price is capped by the agreement rather than by any competitor: it stood at ' +
            'USD 10.26 through 2025 and 2026, with increases of up to 7% permitted in four of the ' +
            'following six years. This is the only layer in the entire catalogue where the ' +
            'concentration is a hundred per cent, the pricing power is real, and a government reviews ' +
            'the price. Compare it with EUV lithography on the laptop teardown, which is also a market ' +
            'of one and answers to nobody.',
      sources: ['ICANN registry agreements', 'NTIA']
    },
    {
      id: 'ca-root', parent: 'tls', name: 'Root trust programmes', short: 'Root stores',
      shape: { x: 150, y: 150, w: 340, h: 200 },
      blurb: 'Four companies decide which certificate authorities the world is willing to believe.',
      market: { size: null, year: 2026, basis: 'trust decisions taken by browser and operating system vendors, not a market' },
      asOf: '2026', confidence: 'medium', chokepoint: true,
      upstream: ['browser-engine'],
      note: 'Underneath the certificate authorities sits the question of who trusts them, and the ' +
            'answer is not a standards body. It is four root programmes: Mozilla’s, Apple’s, ' +
            'Microsoft’s and Google’s Chrome Root Program. A certificate authority ejected ' +
            'from those stores ceases to function within weeks regardless of its contracts, and this ' +
            'has happened repeatedly: DigiNotar in 2011 after a compromise, Symantec’s ' +
            'authority distrusted by Google and Mozilla from 2017 after misissuance, Entrust ' +
            'distrusted by Chrome in 2024. Mozilla’s store is the de facto reference for most ' +
            'Linux distributions, which means the non-profit two rows above is also, quietly, the ' +
            'trust authority for a large share of the world’s servers.',
      sources: ['Company statements', 'W3Techs']
    },
    {
      id: 'card-network', parent: 'payments', name: 'Card networks', short: 'Networks',
      shape: { x: 150, y: 150, w: 340, h: 200 },
      blurb: 'Two companies underneath the six competing acquirers, taking a fee neither party can avoid.',
      market: { size: 'USD ~9.99tn', year: 2025, basis: 'United States purchase volume across the two networks reported jointly by Nilson' },
      asOf: '2025', confidence: 'high', chokepoint: true,
      shares: [
        { c: 'Visa', p: 70.4 }, { c: 'Mastercard', p: 29.6 }
      ],
      note: 'The layer that makes the payments row above it look competitive. United States card ' +
            'purchase volume across the two networks was USD 9.986tn in 2025, and Visa took just over ' +
            'seventy per cent of it. Stated as a two-firm split deliberately, because that is how the ' +
            'volume is reported and because for a merchant in that market there is effectively no ' +
            'third option: American Express and Discover are materially smaller and not accepted ' +
            'everywhere. Globally the picture differs: UnionPay is larger than either on transaction ' +
            'count. Interchange, which is what a merchant actually pays, is set by these two and has ' +
            'been the subject of litigation and legislation on three continents for twenty years ' +
            'without materially changing.',
      sources: ['Nilson Report', 'Company filings']
    },
    {
      id: 'oss-maintainers', parent: 'oss-deps', name: 'The maintainer layer', short: 'Maintainers',
      shape: { x: 150, y: 150, w: 340, h: 200 },
      blurb: 'The bottom of the software stack is a few thousand people, and most of them are not paid.',
      market: { size: 'no market', year: 2026, basis: 'survey of open source maintainers; there is no transaction to measure' },
      asOf: '2026', confidence: 'medium', chokepoint: true,
      note: 'The most unusual terminus in this catalogue, because there is no company here at all. ' +
            'Tidelift’s recurring maintainer survey finds around 60% of maintainers are unpaid ' +
            'for the work, that unpaid maintainers are substantially less likely to implement security ' +
            'and maintenance practices than paid ones, and that a majority have quit or considered ' +
            'quitting, citing burnout. That is the labour force underneath every application in this ' +
            'teardown. The xz-utils backdoor in 2024 is the case study: an attacker spent two years ' +
            'building social trust with a single exhausted volunteer maintainer, took over the ' +
            'project, and inserted a backdoor that reached the release candidates of major Linux ' +
            'distributions before a Microsoft engineer noticed a half-second timing anomaly. Read ' +
            'against the rest of this site, this layer is the software equivalent of the wiring ' +
            'harness labour on the car teardown or the cable ships on the submarine cable: a ' +
            'binding constraint sitting sideways to the industry, with no market price and no ' +
            'procurement route.',
      sources: ['Tidelift', 'Company statements']
    }
  ]
});
