/* Teardown :: source registry
 *
 * Provenance lives here, once per publisher, rather than being repeated on
 * every node that cites it. A device file still writes a short string,
 * `sources: ['TrendForce']`, and TD.sourceMeta() resolves it against this table at
 * render time, so adding a citation anywhere on the site inherits a URL, a
 * document type and a plain statement of what is actually being cited.
 *
 * What each field means:
 *   url    a page that genuinely exists and is genuinely the publisher of this
 *          class of figure. It is the publisher's own landing page for that
 *          research, NOT a deep link to the specific table, those sit behind
 *          subscriptions, and pretending otherwise would be worse than saying
 *          so. `note` says which it is.
 *   type   'primary'     the company or a regulator speaking directly
 *          'third-party' a tracker, analyst house or trade body compiling it
 *          'derived'     no one published this share; it is reconciled from
 *                        disclosures that were never meant to add up to a
 *                        market. The weakest grade, and the honest one for
 *                        anything previously filed under "Company filings".
 *   note   what the reader is actually getting, including its limits.
 *
 * The point of the 'derived' grade: a company's filing tells you its own
 * revenue. It does not tell you the denominator. Turning a set of filings
 * into a market share is an analyst's act of judgement, and labelling that
 * "Primary", as this site did until it was audited, overstates it.
 */
(function (TD) {
  'use strict';

  TD.sourceRegistry({

    /* ---------- trackers and analyst houses ---------- */

    'TrendForce': {
      url: 'https://www.trendforce.com/',
      type: 'third-party',
      note: 'Taiwanese market intelligence house. Publishes quarterly supplier ' +
            'rankings across memory, panels, foundry, batteries and notebook ODMs. ' +
            'Headline rankings are released publicly; the underlying tables are ' +
            'subscription research.'
    },
    'Omdia': {
      url: 'https://omdia.tech.informa.com/',
      type: 'third-party',
      note: 'Informa\'s technology research arm, and the standard reference for ' +
            'display panel shipments. Subscription research; press releases carry ' +
            'the headline shares.'
    },
    'Omdia panel shipment tracker': {
      url: 'https://omdia.tech.informa.com/',
      type: 'third-party',
      note: 'Omdia\'s quarterly notebook panel shipment tracker, by panel maker. ' +
            'Subscription research.'
    },
    'IDC': {
      url: 'https://www.idc.com/',
      type: 'third-party',
      note: 'Quarterly device shipment trackers by vendor. Preliminary quarterly ' +
            'results are published openly; the full tracker is subscription research.'
    },
    'IDC Quarterly Personal Computing Device Tracker': {
      url: 'https://www.idc.com/',
      type: 'third-party',
      note: 'IDC\'s quarterly PC shipment tracker, the usual public source for ' +
            'notebook brand share. Preliminary top-five tables are published each ' +
            'quarter; the full dataset is subscription research.'
    },
    'Canalys': {
      url: 'https://www.canalys.com/',
      type: 'third-party',
      note: 'Quarterly PC shipment estimates, now part of Omdia. Used here as the ' +
            'second independent read on brand share, because it and IDC do not ' +
            'always agree.'
    },
    'Counterpoint': {
      url: 'https://www.counterpointresearch.com/',
      type: 'third-party',
      note: 'Semiconductor and memory market trackers. Used as a cross-check ' +
            'against TrendForce on memory and foundry share.'
    },
    'Yole Group': {
      url: 'https://www.yolegroup.com/',
      type: 'third-party',
      note: 'French research house covering imaging, sensing and advanced ' +
            'packaging. Subscription reports; summary figures appear in its ' +
            'published press material.'
    },
    'TechInsights': {
      url: 'https://www.techinsights.com/',
      type: 'third-party',
      note: 'Teardown and bill-of-materials analysis. The only source class here ' +
            'that physically opens the device and costs each part.'
    },
    'Mercury Research': {
      url: 'https://www.mercuryresearch.com/',
      type: 'third-party',
      note: 'The reference series for quarterly x86 processor unit share. ' +
            'Subscription research; headline splits are widely reported each quarter.'
    },
    'Jon Peddie Research': {
      url: 'https://www.jonpeddie.com/',
      type: 'third-party',
      note: 'Quarterly GPU shipment share, the standard public reference for ' +
            'discrete graphics. Subscription research with published summaries.'
    },
    'Forward Insights': {
      url: 'https://www.forward-insights.com/',
      type: 'third-party',
      note: 'Specialist NAND and SSD supplier research. Subscription reports.'
    },
    'Prismark': {
      url: 'https://www.prismark.com/',
      type: 'third-party',
      note: 'Electronics industry consultancy, established 1994, and the usual ' +
            'reference for printed circuit board and substrate industry data. ' +
            'Subscription research.'
    },
    'Digitimes Research': {
      url: 'https://www.digitimes.com/',
      type: 'third-party',
      note: 'Taipei-based supply chain reporting. Closest to the ODMs of any ' +
            'source here, and correspondingly the one most often single-sourced.'
    },
    'IPnest': {
      url: 'https://www.ipnest.eu/',
      type: 'third-party',
      note: 'Specialist tracker of semiconductor design IP revenue by vendor. ' +
            'A small house; effectively the only public series for this layer.'
    },
    'Benchmark Mineral Intelligence': {
      url: 'https://www.benchmarkminerals.com/',
      type: 'third-party',
      note: 'Price assessment and supply chain data for battery raw materials ' +
            'and cell components.'
    },

    /* ---------- trade bodies, regulators, governments ---------- */

    'SEMI': {
      url: 'https://www.semi.org/',
      type: 'third-party',
      note: 'The semiconductor equipment and materials industry association. ' +
            'Publishes billings and materials statistics collected from its own ' +
            'members: an industry body reporting on itself, which is more ' +
            'reliable for totals than for any individual company\'s share.'
    },
    'ESD Alliance': {
      url: 'https://www.semi.org/en/communities/esda',
      type: 'third-party',
      note: 'The SEMI community that publishes the Electronic Design Market Data ' +
            'report, the industry-collected series for EDA revenue by company.'
    },
    'IEA': {
      url: 'https://www.iea.org/',
      type: 'third-party',
      note: 'Intergovernmental agency. Its battery and critical minerals reports ' +
            'are published free and in full, which makes them the most genuinely ' +
            'retrievable source cited on this page.'
    },
    'METI disclosures': {
      url: 'https://www.meti.go.jp/english/statistics/',
      type: 'primary',
      note: 'Japanese Ministry of Economy, Trade and Industry production and ' +
            'export statistics. Government data, published openly, but reported ' +
            'by product category rather than by company.'
    },
    'StatCounter': {
      url: 'https://gs.statcounter.com/',
      type: 'third-party',
      note: 'Operating system usage share measured from web analytics tags. ' +
            'Published openly and in full. Measures usage, not shipments: a ' +
            'different question from every other share on this page.'
    },

    /* ---------- company disclosure ---------- */

    'Company filings': {
      url: null,
      type: 'derived',
      note: 'No published tracker covers this layer. The shares are reconciled ' +
            'from segment revenue and unit disclosures in the suppliers\' own ' +
            'annual and quarterly reports. Each input is a real filed document, ' +
            'but no single document states this table and none of these companies ' +
            'reports a market share. Treat the ranking as firmer than the numbers.'
    },
    'Taiwan listed company filings': {
      url: 'https://mops.twse.com.tw/mops/web/index',
      type: 'derived',
      note: 'Monthly and annual revenue disclosures filed to the Taiwan Stock ' +
            'Exchange Market Observation Post System, which are public and ' +
            'retrievable. The mechanical layers of a notebook are dominated by ' +
            'listed Taiwanese suppliers, so their filings are the best available ' +
            'basis, but the share is derived from them, not reported in them.'
    },
    'Company statements': {
      url: null,
      type: 'primary',
      note: 'Positions stated publicly by the companies themselves, outside a ' +
            'filing: product documentation, briefings and press material. ' +
            'Uncontested, but unaudited.'
    },
    'ASML disclosures': {
      url: 'https://www.asml.com/en/investors',
      type: 'primary',
      note: 'ASML\'s own investor material. It is the only supplier of EUV ' +
            'lithography, so its disclosures describe a market of one and there ' +
            'is no independent tracker to check them against.'
    },
    'ASML and Zeiss disclosures': {
      url: 'https://www.asml.com/en/investors',
      type: 'primary',
      note: 'ASML investor material together with Carl Zeiss SMT company ' +
            'statements. Zeiss SMT is unlisted and files no segment accounts, so ' +
            'this layer rests on what the two firms choose to say about their own ' +
            'exclusive relationship.'
    },
    'Security research disclosures': {
      url: null,
      type: 'third-party',
      note: 'Published vulnerability research and firmware analysis from security ' +
            'vendors and independent researchers. It surveys what is found in ' +
            'shipped machines, which is the only visibility this layer has, ' +
            'nobody publishes firmware market share.'
    },

    /* ---------- display chain ----------
       The smartphone teardown descends further into the display than the
       notebook does, and that chain has its own specialist press. These are
       small publications, but they are the only ones that cover OLED
       equipment and mask supply at all, and they report it in far more
       detail than the general trackers. */

    'DSCC': {
      url: 'https://www.dscc.co/',
      type: 'third-party',
      note: 'Display Supply Chain Consultants. Quarterly OLED shipment, capacity ' +
            'and equipment spending trackers. Headline findings are published ' +
            'openly; the tables are subscription research.'
    },
    'UBI Research': {
      url: 'https://ubiresearch.com/',
      type: 'third-party',
      note: 'Korean OLED specialist. Publishes smartphone OLED panel shipment ' +
            'counts split by producer and by country of manufacture, which is the ' +
            'basis for the Korea-versus-China reading on this teardown. ' +
            'Subscription research, headline numbers reported openly.'
    },
    'OLED-Info': {
      url: 'https://www.oled-info.com/',
      type: 'third-party',
      note: 'Long-running OLED industry news site. It aggregates and reports the ' +
            'analyst-house and supplier announcements behind this chain rather ' +
            'than generating its own shares, cited here as the retrievable ' +
            'public record of figures that otherwise sit behind subscriptions.'
    },
    'The Elec': {
      url: 'https://www.thelec.net/',
      type: 'third-party',
      note: 'Korean electronics and display supply-chain trade press. The primary ' +
            'open source on OLED deposition equipment orders and panel-maker ' +
            'capital plans. Reports named orders and supplier decisions; it does ' +
            'not publish market share tables, so shares citing it are derived.'
    },

    /* ---------- agriculture and off-highway ----------
       Agricultural equipment is covered by trade publications and specialist
       consultancies rather than the electronics trackers, and several of the
       useful ones are small. They are the only sources that exist for these
       layers, which is itself part of why the machine's mechanical half is
       graded low across the board. */

    'Power Systems Research': {
      url: 'https://www.powersys.com/',
      type: 'third-party',
      note: 'US consultancy tracking engine production and installation by ' +
            'builder, application and horsepower band. The standard reference ' +
            'for off-highway engine share. Subscription research.'
    },
    'Off-Highway Research': {
      url: 'https://www.offhighwayresearch.com/',
      type: 'third-party',
      note: 'UK specialist in construction and agricultural equipment markets, ' +
            'now part of Ritchie Bros. Publishes machine population and ' +
            'component demand studies. Subscription research.'
    },
    'Verdant Partners': {
      url: 'https://verdantpartners.com/',
      type: 'third-party',
      note: 'Agricultural technology M&A advisory. Publishes transaction ' +
            'records and sector commentary for precision agriculture. An ' +
            'adviser rather than a tracker: strong on deals, and market shares ' +
            'cited from it are inferred rather than measured.'
    },
    'AgFunder': {
      url: 'https://agfunder.com/research/',
      type: 'third-party',
      note: 'Agrifoodtech investment reports, published openly. Covers funding ' +
            'and deal flow rather than product market share, so shares resting ' +
            'on it are derived from company and investor disclosure.'
    },
    'Tire Business': {
      url: 'https://www.tirebusiness.com/',
      type: 'third-party',
      note: 'Crain trade publication for the tyre industry, including annual ' +
            'manufacturer rankings by segment revenue. Published openly.'
    },
    'Farm Equipment': {
      url: 'https://www.farm-equipment.com/',
      type: 'third-party',
      note: 'Lessiter Media trade publication covering agricultural equipment ' +
            'manufacturing and the dealer channel. Reports company disclosure ' +
            'and industry survey data rather than producing its own tracker.'
    },
    'Farm Equipment Dealer rankings': {
      url: 'https://www.farm-equipment.com/topic/2686-dealership-rankings',
      type: 'third-party',
      note: 'Annual ranking of North American equipment dealer groups by store ' +
            'count and estimated revenue. Published openly. Store counts are ' +
            'firm; the revenue estimates behind any share are not.'
    },
    'USGS Mineral Commodity Summaries': {
      url: 'https://www.usgs.gov/centers/national-minerals-information-center/mineral-commodity-summaries',
      type: 'primary',
      note: 'United States Geological Survey annual estimates of world mine ' +
            'production and reserves by commodity and country. Published openly ' +
            'and in full, and the standard reference for where a metal comes ' +
            'out of the ground. Reports countries, not companies.'
    },
    'Johnson Matthey PGM Market Report': {
      url: 'https://matthey.com/products-and-markets/pgms-and-circularity/pgm-management/market-research',
      type: 'primary',
      note: 'Johnson Matthey\'s twice-yearly platinum group metals supply and ' +
            'demand report, published openly. JM is itself the largest ' +
            'autocatalyst maker, so it is a participant reporting on its own ' +
            'market: authoritative on the numbers, not disinterested.'
    },
    'ANRPC': {
      url: 'https://www.anrpc.org/',
      type: 'third-party',
      note: 'Association of Natural Rubber Producing Countries. Monthly and ' +
            'annual production, consumption and stock statistics by member ' +
            'country. A producer trade body whose members report their own ' +
            'output, which is the only global count that exists.'
    },
    'GPS World': {
      url: 'https://www.gpsworld.com/',
      type: 'third-party',
      note: 'Trade publication covering GNSS receivers, chipsets and correction ' +
            'services. Reports vendor announcements and summarises the paid ' +
            'receiver-market studies; it does not produce its own share tables, ' +
            'so shares citing it are derived.'
    },
    'EUSPA GNSS Market Report': {
      url: 'https://www.euspa.europa.eu/',
      type: 'primary',
      note: 'European Union Agency for the Space Programme\'s market report on ' +
            'GNSS applications, including agriculture. Published openly. The EU ' +
            'operates Galileo, so it is a constellation operator reporting on ' +
            'the market its own infrastructure serves.'
    },
    'Constellation operator disclosures': {
      url: 'https://www.gps.gov/',
      type: 'primary',
      note: 'Operational satellite counts and service commitments published by ' +
            'the constellation operators themselves: the US Space Force for ' +
            'GPS, EUSPA for Galileo, and the equivalent Chinese and Russian ' +
            'programme offices. There is no market and no price here: the ' +
            'signal is free to use and nobody invoices for it, so "share" can ' +
            'only mean satellites in service.'
    },
    'Tractor and Mechanization Association': {
      url: 'https://www.tmaindia.in/',
      type: 'third-party',
      note: 'Indian industry body publishing domestic tractor production and ' +
            'sales by manufacturer. India is roughly a third of world unit ' +
            'volume, so this is load-bearing for any global unit-share table. ' +
            'Trade association data: members report their own numbers.'
    },

    /* ---------- electric vehicles and battery materials ----------
       Better sourced than most of this site: the IEA publishes openly and is
       not a market participant, and the battery materials chain has two
       specialist agencies that actually separate mining from refining, which
       is the distinction the whole EV supply story turns on. */

    'IEA Global EV Outlook': {
      url: 'https://www.iea.org/reports/global-ev-outlook-2026',
      type: 'primary',
      note: 'The International Energy Agency\'s annual electric vehicle ' +
            'report: sales, fleet, battery demand and critical mineral ' +
            'requirements. Published openly and in full, by an ' +
            'intergovernmental body with no position in the market: the most ' +
            'disinterested source on this teardown.'
    },
    'SNE Research': {
      url: 'https://www.sneresearch.com/',
      type: 'third-party',
      note: 'Korean battery market research house and the standard reference ' +
            'for EV battery installations by producer, measured in GWh ' +
            'deployed rather than cells shipped. Monthly headline rankings ' +
            'published openly; detail is subscription.'
    },
    'Benchmark Mineral Intelligence': {
      url: 'https://www.benchmarkminerals.com/',
      type: 'third-party',
      note: 'Price reporting and supply chain research for lithium, cobalt, ' +
            'graphite and cathode. The useful thing about it is that it ' +
            'separates mine supply from refining capacity, which most sources ' +
            'conflate and which is where the actual concentration sits.'
    },
    'Cobalt Institute': {
      url: 'https://www.cobaltinstitute.org/',
      type: 'third-party',
      note: 'Industry association publishing an annual cobalt market report ' +
            'covering mine supply, refining and artisanal production. A ' +
            'producer trade body reporting on its own industry, and the only ' +
            'body that publishes artisanal-share estimates at all.'
    },
    'Adamas Intelligence': {
      url: 'https://www.adamasintel.com/',
      type: 'third-party',
      note: 'Research house tracking rare earth magnet and EV motor supply ' +
            'chains by volume and by country of production. Subscription ' +
            'research; headline findings reported through trade press.'
    },
    'IDTechEx': {
      url: 'https://www.idtechex.com/',
      type: 'third-party',
      note: 'Technology market research covering EV powertrain, motors and ' +
            'power electronics. Report summaries published openly; the ' +
            'underlying forecasts are subscription.'
    },
    'BloombergNEF': {
      url: 'https://about.bnef.com/',
      type: 'third-party',
      note: 'Energy transition research, including battery pack prices, EV ' +
            'adoption and charging infrastructure. Its annual battery price ' +
            'survey is the most widely cited series in the industry and is ' +
            'published openly at the headline level.'
    },
    'Rho Motion': {
      url: 'https://rhomotion.com/',
      type: 'third-party',
      note: 'EV and battery market data, reporting monthly global plug-in ' +
            'sales by region and group. Headline monthly totals published ' +
            'openly; the databases behind them are subscription.'
    },
    'World Steel Association': {
      url: 'https://worldsteel.org/',
      type: 'third-party',
      note: 'Global steel production statistics by producer and country, ' +
            'published openly. Reports crude and finished steel volumes; it ' +
            'does not break out electrical steel grades, so shares for that ' +
            'layer are derived.'
    },
    'TSR': {
      url: 'https://www.t-s-r.co.jp/e/',
      type: 'third-party',
      note: 'Techno Systems Research, a Japanese market research house ' +
            'covering imaging and camera modules including automotive. ' +
            'Subscription research reported through trade press.'
    },

    /* ---------- data centre and AI infrastructure ----------
       Well covered by specialist trackers, and the numbers move faster than
       anywhere else on this site: several of these layers changed materially
       between 2025 and 2026, so `asOf` matters more here than usual. */

    'Dell\'Oro Group': {
      url: 'https://www.delloro.com/',
      type: 'third-party',
      note: 'The standard tracker for data centre capital expenditure, ' +
            'networking, physical infrastructure and power. Headline findings ' +
            'and growth rates published openly in press releases; the ' +
            'underlying quarterly databases are subscription research.'
    },
    '650 Group': {
      url: 'https://650group.com/',
      type: 'third-party',
      note: 'Networking and data centre component market research, ' +
            'particularly switch silicon and Ethernet port shipments. ' +
            'Subscription research; headline shares reported through trade ' +
            'press.'
    },
    'LightCounting': {
      url: 'https://www.lightcounting.com/',
      type: 'third-party',
      note: 'Optical communications market research and the reference source ' +
            'for transceiver shipments and vendor rankings. Subscription ' +
            'research with headline findings published openly.'
    },
    'Synergy Research': {
      url: 'https://www.srgresearch.com/',
      type: 'third-party',
      note: 'Cloud infrastructure services market share, published quarterly ' +
            'and openly at the headline level. Measures spend on cloud ' +
            'services, which is a different question from who owns the ' +
            'hardware underneath it.'
    },
    'IEA Energy and AI': {
      url: 'https://www.iea.org/reports/energy-and-ai',
      type: 'primary',
      note: 'International Energy Agency analysis of data centre electricity ' +
            'demand and the grid constraints on it. Published openly and in ' +
            'full. An intergovernmental body, not a market participant, which ' +
            'makes it the most disinterested source in this teardown.'
    },
    'S&P Global Market Intelligence': {
      url: 'https://www.spglobal.com/market-intelligence/',
      type: 'third-party',
      note: 'Data centre capacity, power demand and grid constraint research, ' +
            'plus AI infrastructure investment forecasts. Headline findings ' +
            'published openly; detail is subscription.'
    },
    'Wood Mackenzie': {
      url: 'https://www.woodmac.com/',
      type: 'third-party',
      note: 'Energy supply chain research, including gas turbine order books ' +
            'and generation build constraints. Headline analysis published ' +
            'openly through its Energy Pulse commentary.'
    },

    /* ---------- minerals and trade press ---------- */

    'Fastmarkets': {
      url: 'https://www.fastmarkets.com/',
      type: 'third-party',
      note: 'Price reporting agency for metals and minerals, including tungsten ' +
            'concentrate and APT. Assessed prices and market commentary are ' +
            'published openly in summary; the full price series is subscription.'
    },
    'ITIA': {
      url: 'https://www.itia.info/',
      type: 'third-party',
      note: 'International Tungsten Industry Association. Publishes supply, ' +
            'recycling and end-use breakdowns for tungsten. A producer trade ' +
            'body: authoritative on flows, and reporting on its own industry.'
    },
    'Appliance trade press': {
      url: null,
      type: 'third-party',
      note: 'Consumer appliance market estimates compiled from trade coverage ' +
            'and retailer teardowns. This is the weakest source class on the ' +
            'site and is used only where nothing better exists: published ' +
            'market sizes for microwave ovens differ by roughly a quarter ' +
            'between publishers for the same year, and unit-share figures are ' +
            'rarely reconciled against manufacturing share at all. Every layer ' +
            'resting on it is graded low.'
    },

    /* ---------- automotive ----------
       The most studied supply chain in the world, and it shows: automotive is
       the only industry on this site with a formal, publicly ranked supplier
       hierarchy. That makes the tier structure unusually well evidenced and
       the deep material layers no better covered than anywhere else. */

    'Automotive News Top Suppliers': {
      url: 'https://www.autonews.com/manufacturing/suppliers/ranking/',
      type: 'third-party',
      note: 'The definitive annual ranking of global automotive suppliers by ' +
            'original-equipment parts revenue, published openly. Ranks ' +
            'companies, not product categories, so component-level shares ' +
            'derived from it are inferences, and the ranking itself is not.'
    },
    'S&P Global Mobility': {
      url: 'https://www.spglobal.com/mobility/en/',
      type: 'third-party',
      note: 'Light vehicle production and sales forecasts by region and ' +
            'manufacturer group, and the standard reference for vehicle ' +
            'volumes. Headline forecasts published openly; the detailed ' +
            'production database is subscription research.'
    },
    'European Aluminium': {
      url: 'https://european-aluminium.eu/',
      type: 'third-party',
      note: 'European aluminium industry association. Its 2021 position paper ' +
            'on the magnesium shortage is the clearest public statement of how ' +
            'dependent the aluminium value chain is on a single supplying ' +
            'country. A trade body arguing its members\' case, and accurate ' +
            'about the dependency it was arguing about.'
    },

    /* ---------- subsea cable ----------
       Unusually good for an infrastructure market: the submarine cable
       industry has one dominant open reference (TeleGeography) and a
       technical trade body (the ICPC) that publishes fault and repair
       statistics nobody else has. Several layers of this teardown are
       therefore better sourced than the equivalent layers of a phone. */

    'TeleGeography': {
      url: 'https://www2.telegeography.com/submarine-cable-faqs-frequently-asked-questions',
      type: 'third-party',
      note: 'The standard reference for submarine cable systems, routes, ' +
            'ownership and capacity. Maintains the public Submarine Cable Map ' +
            'and publishes system counts, capacity shares and cost economics ' +
            'openly; the underlying Global Bandwidth research is subscription.'
    },
    'ICPC': {
      url: 'https://www.iscpc.org/',
      type: 'third-party',
      note: 'International Cable Protection Committee. The industry body for ' +
            'cable owners and operators; publishes fault-cause and repair ' +
            'statistics, the cableship register, and position papers on anchor ' +
            'damage. Members self-report, and the ICPC is explicit that it ' +
            'holds no data on deliberate state action.'
    },
    'SubmarineNetworks.com': {
      url: 'https://www.submarinenetworks.com/',
      type: 'third-party',
      note: 'Trade publication tracking every announced cable system, supplier ' +
            'award, landing and fault. The best open record of who was awarded ' +
            'which contract; it reports announcements rather than producing ' +
            'market share tables, so shares citing it are derived.'
    },
    'Capacity Media': {
      url: 'https://www.capacitymedia.com/',
      type: 'third-party',
      note: 'Wholesale telecoms trade press, including sustained coverage of ' +
            'the cable ship fleet and cable security. Reports industry and ' +
            'operator statements rather than generating its own datasets.'
    },
    'Lightwave': {
      url: 'https://www.lightwaveonline.com/',
      type: 'third-party',
      note: 'Optical communications trade publication covering fibre, ' +
            'transport equipment and component supply. Reports vendor and ' +
            'analyst findings; not a primary source of market share.'
    },

    /* ---------- company disclosure, smartphone chain ---------- */

    'Arm disclosures': {
      url: 'https://investors.arm.com/',
      type: 'primary',
      note: 'Arm Holdings investor material, including royalty unit counts and ' +
            'stated penetration of the smartphone application processor market. ' +
            'Arm is describing its own licensing base, which no third party ' +
            'independently measures.'
    },
    'Skyworks and Qorvo merger disclosures': {
      url: 'https://investors.skyworksinc.com/news-releases/news-release-details/skyworks-and-qorvo-combine-create-22-billion-us-based-leader',
      type: 'primary',
      note: 'The merger announcement and associated filings from both parties. ' +
            'Deal terms, consideration and expected close are stated directly by ' +
            'the companies; the transaction remains subject to regulatory and ' +
            'shareholder approval and had not closed when this was written.'
    },
    'Corning disclosures': {
      url: 'https://www.corning.com/worldwide/en/investor-relations.html',
      type: 'primary',
      note: 'Corning investor material and product documentation covering its ' +
            'mobile consumer electronics segment. Corning reports segment revenue ' +
            'and design wins, not category share, so the share here is derived ' +
            'from those disclosures against third-party market sizing.'
    },
    'Sony disclosures': {
      url: 'https://www.sony.com/en/SonyInfo/IR/',
      type: 'primary',
      note: 'Sony Group investor material for the Imaging & Sensing Solutions ' +
            'segment, which states segment revenue and Sony\'s own share ambition ' +
            'for image sensors. The segment mixes mobile with automotive and ' +
            'industrial, so smartphone-only share is derived, not disclosed.'
    },

    /* ---------- the measured web ----------
       The martech teardown is the best-sourced device on this site, and the
       reason is unusual: several of its layers are measured by *crawling the
       web itself* rather than by surveying vendors. W3Techs publishes a full
       census daily, openly, with its methodology stated. That is stronger
       evidence than any subscription tracker quoted anywhere else here, but
       it measures a different thing. A share of websites is not a share of
       revenue, and conflating the two is the single easiest way to be wrong
       about this industry. Every layer citing these says which it means. */

    'W3Techs': {
      url: 'https://w3techs.com/',
      type: 'third-party',
      note: 'Daily technology census of the top 10 million websites by traffic ' +
            'rank, published openly and in full with its methodology stated. ' +
            'The most genuinely retrievable source on this site. It measures ' +
            'share of *websites*, which is not share of revenue and not share ' +
            'of traffic: a free tier inflates a site count and says nothing ' +
            'about money. Read every W3Techs figure here as adoption.'
    },
    'BuiltWith': {
      url: 'https://builtwith.com/',
      type: 'third-party',
      note: 'Technology detection across a crawl of hundreds of millions of ' +
            'sites, used here as the second independent read on web ' +
            'infrastructure adoption. Like W3Techs it counts installations, ' +
            'not spend, and the two do not always agree, which is why layers ' +
            'resting on them alone are not graded high.'
    },
    'eMarketer': {
      url: 'https://www.emarketer.com/',
      type: 'third-party',
      note: 'Digital advertising and retail media spend forecasts by platform ' +
            'and region, and the most widely quoted series in the industry. ' +
            'Headline forecasts published openly; the underlying models are ' +
            'subscription. These are forecasts, not audited results: the ' +
            'figures are revised, sometimes materially, after the fact.'
    },
    'GroupM': {
      url: 'https://www.wppmedia.com/',
      type: 'third-party',
      note: 'The media investment arm of WPP, renamed WPP Media in 2025, and ' +
            'publisher of the twice-yearly This Year Next Year advertising ' +
            'forecast. An agency group forecasting the market it buys in, ' +
            'authoritative on totals, and a participant with a position.'
    },
    'MAGNA': {
      url: 'https://magnaglobal.com/',
      type: 'third-party',
      note: 'The intelligence unit of IPG Mediabrands, publishing global ' +
            'advertising revenue forecasts twice a year. Used here as the ' +
            'second read against GroupM, because the two are the only ' +
            'long-running public series and they disagree at the margin.'
    },
    'Gartner': {
      url: 'https://www.gartner.com/en/research/methodologies/magic-quadrants-research',
      type: 'third-party',
      note: 'Analyst house publishing vendor positioning (Magic Quadrant) and ' +
            'market sizing across enterprise software. Quadrant placements are ' +
            'published openly; the market share tables are subscription. A ' +
            'quadrant is a ranking of capability, not a measure of share, and ' +
            'is cited here only as the former.'
    },
    'IDC Worldwide Semiannual Software Tracker': {
      url: 'https://www.idc.com/',
      type: 'third-party',
      note: 'IDC\'s enterprise application revenue tracker, the standard ' +
            'public reference for CRM and marketing software share. Headline ' +
            'vendor rankings are released openly, generally through the ' +
            'winning vendor\'s own press office, which is worth knowing when ' +
            'reading them.'
    },
    'CDP Institute': {
      url: 'https://www.cdpinstitute.org/',
      type: 'third-party',
      note: 'Vendor-funded industry body publishing a twice-yearly census of ' +
            'customer data platform vendors, employment and funding. It counts ' +
            'firms rather than revenue, and its membership defines what counts ' +
            'as a CDP at all: a body reporting on a category it also defines.'
    },
    'Nilson Report': {
      url: 'https://nilsonreport.com/',
      type: 'third-party',
      note: 'The reference series for card network and merchant acquiring ' +
            'volumes, published twice monthly since 1970. Headline network ' +
            'purchase-volume tables are published openly; issuer and acquirer ' +
            'detail is subscription.'
    },
    'Litmus': {
      url: 'https://www.litmus.com/email-client-market-share',
      type: 'third-party',
      note: 'Email client share measured from opens across the campaigns its ' +
            'own customers send, published openly and updated monthly. The ' +
            'method has a known distortion: Apple Mail Privacy Protection ' +
            'pre-fetches images and so registers opens that no human ' +
            'performed, which inflates Apple against Gmail by an amount ' +
            'nobody can measure. Cited with that stated.'
    },
    'Tidelift': {
      url: 'https://tidelift.com/the-state-of-the-open-source-maintainer-report',
      type: 'third-party',
      note: 'Annual survey of open source maintainers covering payment, ' +
            'burnout and security practice, published openly. A self-selected ' +
            'sample of a few hundred maintainers, run by a company that sells ' +
            'maintainer funding: a participant surveying its own market, and ' +
            'the only recurring public measurement of this layer that exists.'
    },
    'ICANN registry agreements': {
      url: 'https://www.icann.org/en/registry-agreements/details/com',
      type: 'primary',
      note: 'The executed contract between ICANN and the operator of a ' +
            'top-level domain, published in full including the price schedule. ' +
            'There is no market share to estimate here: the agreement names ' +
            'one operator and states what it may charge.'
    },
    'NTIA': {
      url: 'https://www.ntia.gov/program/verisign-cooperative-agreement',
      type: 'primary',
      note: 'The United States National Telecommunications and Information ' +
            'Administration, counterparty to the Cooperative Agreement that ' +
            'constrains .com pricing and forbids the registry from also acting ' +
            'as a registrar. A government department publishing the terms of ' +
            'its own contract.'
    },
    'Mozilla Foundation financial statements': {
      url: 'https://stateof.mozilla.org/',
      type: 'primary',
      note: 'Audited consolidated financial statements of the Mozilla ' +
            'Foundation and subsidiaries, published openly. They state royalty ' +
            'revenue from search partners as a share of total revenue without ' +
            'naming the partner; that the partner is overwhelmingly Google is ' +
            'established elsewhere, including in United States v. Google.'
    },
    'Digiday': {
      url: 'https://digiday.com/',
      type: 'third-party',
      note: 'Trade publication covering media buying, ad tech and platform ' +
            'economics. Reports company disclosure, executive interviews and ' +
            'analyst findings rather than producing its own share tables, so ' +
            'shares citing it are derived.'
    },

    /* ---------- wind ----------
       Better sourced than the rest of the industrial catalogue, and for a
       specific reason: GWEC is a trade body that publishes unit-level supply
       side data openly, and NREL is a national laboratory that publishes cost
       models in full. The deep material layers below the turbine are covered
       no better than anywhere else on this site. */

    'GWEC': {
      url: 'https://www.gwec.net/',
      type: 'third-party',
      note: 'Global Wind Energy Council. Its annual Global Wind Report and ' +
            'Supply Side Data publish capacity installed by manufacturer, in ' +
            'gigawatts, openly and at unit level: the cleanest supplier ' +
            'ranking of any industrial market on this site. A trade body whose ' +
            'members report their own installations.'
    },
    'WindEurope': {
      url: 'https://windeurope.org/',
      type: 'third-party',
      note: 'European wind industry association, publishing installation ' +
            'statistics and the component cost breakdown of a turbine that is ' +
            'the standard public reference for where turbine capital cost ' +
            'sits. A trade body reporting on its own members\' machines.'
    },
    'NREL': {
      url: 'https://www.nrel.gov/wind/',
      type: 'primary',
      note: 'The United States National Renewable Energy Laboratory. Its ' +
            'annual Cost of Wind Energy Review models turbine capital cost by ' +
            'module (rotor, nacelle, tower) and is published free and in ' +
            'full with its assumptions stated. A government laboratory, not a ' +
            'market participant. It models a representative machine rather ' +
            'than surveying real invoices.'
    },
    'IRENA': {
      url: 'https://www.irena.org/Publications',
      type: 'third-party',
      note: 'International Renewable Energy Agency. Publishes installed cost ' +
            'per kilowatt and levelised cost series for wind, openly and in ' +
            'full, built from a project-level database. An intergovernmental ' +
            'body, so disinterested; it reports project costs, not supplier ' +
            'shares.'
    },
    'CompositesWorld': {
      url: 'https://www.compositesworld.com/',
      type: 'third-party',
      note: 'Trade publication covering composite materials, and effectively ' +
            'the only sustained open reporting on blade core materials, resin ' +
            'systems and fibre supply. Reports supplier announcements and ' +
            'plant capacity rather than publishing share tables, so shares ' +
            'citing it are derived.'
    },
    'Argus Media': {
      url: 'https://www.argusmedia.com/',
      type: 'third-party',
      note: 'Price reporting agency for commodities, including the Ecuadorian ' +
            'balsa trade. Publishes export volumes and price commentary; the ' +
            'assessed price series is subscription.'
    },
    'Environmental Investigation Agency': {
      url: 'https://eia.org/',
      type: 'third-party',
      note: 'Investigative NGO. Its field reporting on the Ecuadorian and ' +
            'Peruvian balsa boom traced illegally logged wood into named ' +
            'blade and turbine supply chains: the only investigation of that ' +
            'layer that exists. An advocacy organisation, and the primary ' +
            'record of what it found.'
    },
    'CSIS': {
      url: 'https://www.csis.org/',
      type: 'third-party',
      note: 'Center for Strategic and International Studies. Its critical ' +
            'minerals analysis tracks Chinese rare earth and magnet export ' +
            'control measures against the licensing text itself. A ' +
            'Washington policy institute: strong on the regulatory record, ' +
            'and writing from a stated national-security standpoint.'
    }

  });

})(window.TD);
