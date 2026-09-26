/* Teardown : 3D models, agricultural tractor
 *
 * Boxes in millimetres. x = right, y = back, z = up.
 * Every `node` must match a node id in data/devices/tractor.js.
 *
 * ---- why this model looks different from the others ----
 *
 * Every model on the site so far has been a layer stack: a laptop, a phone, a
 * tablet, flat things that come apart along one axis. A tractor is the first
 * device here that is a *vehicle*, and modelling it as boxes produced
 * something that read as a filing cabinet on blocks. Two primitives that
 * js/three-view.js has always supported but no model had used are what make it
 * read as a machine:
 *
 *   shape: 'cyl', axis: 'x': a real wheel, not a cube pretending to be one.
 *                               Four of them carry the whole silhouette.
 *   shape: 'wedge', axis:'y': the hood, tapering toward the grille. A
 *                               straight box hood is the single thing that
 *                               most made this look like a toy.
 *
 * js/iso.js (the SVG fallback) only draws axis-aligned boxes, so both degrade
 * to their bounding box there. That is intended and looks fine: a wheel's
 * bounding box is a square block in roughly the right place.
 *
 * ---- proportion notes ----
 *
 * A row-crop tractor of about 200hp: 5.3 m long, 2.4 m wide, 3.2 m to the top
 * of the cab. The rear wheels are 1.8 m in diameter, taller than the person
 * driving, and getting that ratio right matters more to the read than any
 * amount of surface detail. The front wheels are two thirds that.
 *
 * The hood is modelled as bodywork on `chassis-t`, not on `engine`. That is
 * deliberate: pulling the chassis apart lifts the hood away and exposes the
 * engine underneath, which is the one thing a person actually wants to see
 * happen when they take a tractor apart.
 */

TD.model('tractor', {
  /* The machine is 5.3 m end to end, so separation is in hundreds of
     millimetres, not tens. Tuned so the hood clears the engine and the
     implement clearly leaves the machine rather than hovering on it. */
  spread: 1150,
  view: {
    /* three-space direction, and model space maps (x, y, z) -> (x, z, -y).
       This is a front-three-quarter from slightly above: the angle every
       tractor has ever been photographed from, because it is the one that
       shows the wheel size difference and the hood line at the same time. */
    camera: [0.60, 0.44, 0.66],
    distance: 1.03,
    background: 'studio',
    shadow: 0.17,
    edges: 0.38,
    exposure: 1.02
  },
  parts: [

    /* ---------- ground contact ----------
       Four cylinders and four rim discs. The discs sit slightly proud of the
       tyre's outer face so there is a visible wheel centre from the side,
       which is what stops a black cylinder reading as a drum. */
    { node: 'tyres-t', color: '#23272b', dir: [0, 0, -1], spread: 1.05,
      rough: 0.82, metal: 0.0,
      boxes: [
        // rear pair, 1.8 m diameter
        { shape: 'cyl', axis: 'x', seg: 36, x: [-1180, -600], y: [200, 2000], z: [0, 1800] },
        { shape: 'cyl', axis: 'x', seg: 36, x: [600, 1180], y: [200, 2000], z: [0, 1800] },
        // front pair, 1.2 m diameter
        { shape: 'cyl', axis: 'x', seg: 32, x: [-1080, -700], y: [-2320, -1120], z: [0, 1200] },
        { shape: 'cyl', axis: 'x', seg: 32, x: [700, 1080], y: [-2320, -1120], z: [0, 1200] },
        // rim centres, proud of the tyre face
        { shape: 'cyl', axis: 'x', seg: 28, x: [-1230, -1150], y: [560, 1640], z: [360, 1440] },
        { shape: 'cyl', axis: 'x', seg: 28, x: [1150, 1230], y: [560, 1640], z: [360, 1440] },
        { shape: 'cyl', axis: 'x', seg: 24, x: [-1125, -1060], y: [-2140, -1300], z: [180, 1020] },
        { shape: 'cyl', axis: 'x', seg: 24, x: [1060, 1125], y: [-2140, -1300], z: [180, 1020] }
      ] },

    /* ---------- structure and bodywork ----------
       Frame spine, axle beam, fenders, hood, grille, front weights and the
       three-point linkage at the back. This is the part that comes off to
       reveal everything else. */
    { node: 'chassis-t', color: '#2f6b41', dir: [0, -0.22, 1], spread: 1.3,
      rough: 0.45, metal: 0.25, shell: true,
      boxes: [
        { x: [-420, 420], y: [-2250, 1500], z: [720, 1160] },            // main spine
        { x: [-800, 800], y: [-1800, -1640], z: [520, 680] },            // front axle beam
        { x: [-620, 620], y: [980, 1220], z: [780, 1020] },              // rear axle housing
        /* Hood, tapering hard toward the grille. The taper is the single
           highest-value shape on the machine: a straight box here is what
           made the first pass look like a toy. */
        { shape: 'wedge', axis: 'y', at: 'min', taper: [0.62, 0.72],
          x: [-620, 620], y: [-2450, -450], z: [1880, 2420] },
        { x: [-500, 500], y: [-2560, -2450], z: [1500, 2350] },          // grille
        { shape: 'round', r: 60, bevel: 20,
          x: [-560, 560], y: [-2760, -2560], z: [1450, 1900] },          // front weights
        /* Fenders clear the 1.8 m tyre rather than intersecting it, at this
           scale a 30 mm overlap is a visible seam through the rubber. */
        { shape: 'round', r: 80, bevel: 18, x: [-1240, -560], y: [230, 1970], z: [1820, 1950] },
        { shape: 'round', r: 80, bevel: 18, x: [560, 1240], y: [230, 1970], z: [1820, 1950] },
        // three-point linkage and drawbar
        { x: [-730, -560], y: [1500, 2350], z: [420, 560] },
        { x: [560, 730], y: [1500, 2350], z: [420, 560] },
        { x: [-70, 70], y: [1450, 2050], z: [900, 1010] },               // top link
        { x: [-90, 90], y: [1500, 2450], z: [380, 470] },                // drawbar
        { x: [-990, -800], y: [-220, 320], z: [480, 1200] }              // cab steps
      ] },

    /* ---------- engine ----------
       Sits under the hood at the front, ahead of the axle. The stack is the
       tallest thing on the machine after the cab and reads as a tractor from
       any angle, so it earns its place even though it is a detail. */
    { node: 'engine', color: '#3a4048', dir: [0, -0.95, 0.25], spread: 1.35,
      rough: 0.55, metal: 0.35,
      boxes: [
        { x: [-430, 430], y: [-2150, -700], z: [1050, 1900] },           // block
        { shape: 'cyl', axis: 'y', seg: 20, x: [-570, -390], y: [-1520, -800], z: [1560, 1780] }, // aftertreatment
        { x: [420, 570], y: [-1700, -1250], z: [1500, 1760] },           // turbo and manifold
        { shape: 'cyl', axis: 'z', seg: 20, x: [330, 450], y: [-630, -510], z: [1900, 3020] }     // exhaust stack
      ] },

    /* ---------- driveline ----------
       Housing behind the engine plus the shaft that drives the front axle,
       which is the piece that makes it obvious the front wheels are powered. */
    { node: 'transmission', color: '#4b525b', dir: [0, 0.35, 0.6], spread: 1.1,
      rough: 0.5, metal: 0.4,
      boxes: [
        { x: [-390, 390], y: [180, 1150], z: [780, 1400] },
        { shape: 'cyl', axis: 'y', seg: 16, x: [-95, 95], y: [-1700, 200], z: [820, 1010] }
      ] },

    /* ---------- hydraulics ----------
       Pump and valve block, the lift cylinders either side, and the rear
       remote couplers every implement plugs into. */
    { node: 'hydraulics', color: '#a8823c', dir: [0, 0.9, 0.4], spread: 1.3,
      rough: 0.4, metal: 0.55,
      boxes: [
        { x: [-420, 420], y: [1150, 1560], z: [900, 1450] },             // pump and valves
        { x: [-640, -520], y: [1280, 1660], z: [900, 1520] },            // lift cylinder, left
        { x: [520, 640], y: [1280, 1660], z: [900, 1520] },              // lift cylinder, right
        { x: [-300, 300], y: [1560, 1670], z: [1150, 1400] }             // rear remotes
      ] },

    /* ---------- cab ----------
       Glass box, roof, seat and the armrest console. The console is where the
       guidance display lives, which is the whole argument of this teardown:
       the most valuable thing in the cab is a screen. */
    { node: 'cab', color: '#5b6c7d', dir: [0, 0, 1], spread: 1.7,
      rough: 0.15, metal: 0.1,
      boxes: [
        /* Tapered toward the roof rather than a plain box. Every real cab
           narrows as it rises, the glass is raked on all four sides, and
           without it the machine reads as a shed on wheels. */
        { shape: 'wedge', axis: 'z', at: 'max', taper: [0.86, 0.90],
          x: [-780, 780], y: [-350, 1300], z: [1500, 2880] },
        { shape: 'round', r: 110, bevel: 30, x: [-790, 790], y: [-380, 1330], z: [2880, 3000] },
        { x: [-260, 260], y: [300, 760], z: [1740, 2260] },              // seat
        { x: [280, 530], y: [240, 700], z: [1790, 1980] },               // armrest console
        { x: [300, 510], y: [170, 260], z: [1980, 2290] }                // display
      ] },

    /* ---------- precision guidance ----------
       The dome on the roof. Physically trivial, about a tenth of the machine's
       cost, and the reason a farmer cannot easily change brand. */
    { node: 'precision', color: '#d8b02e', dir: [0, -0.2, 1], spread: 1.7,
      rough: 0.3, metal: 0.2,
      boxes: [
        { shape: 'cyl', axis: 'z', seg: 28, r2: 0.55, x: [-195, 195], y: [345, 735], z: [3000, 3210] },
        { x: [-265, 265], y: [800, 1160], z: [3000, 3115] }              // receiver
      ] },

    /* ---------- electrical and electronic ----------
       The controller stack behind the cab, the battery box on the step side,
       and the harness run along the frame rail. Modelled because it is a
       named 7% layer now rather than part of the unpriced residual, and
       because the harness is the one thing on a tractor that physically
       touches every other system. */
    { node: 'electrical-t', color: '#8d6a9c', dir: [-0.7, 0.5, 0.6], spread: 1.5,
      rough: 0.5, metal: 0.2,
      boxes: [
        { x: [-330, 330], y: [1180, 1420], z: [1430, 1660] },            // controller stack
        { x: [-880, -640], y: [180, 520], z: [1080, 1400] },             // battery box
        { x: [-440, -400], y: [-1900, 1350], z: [1140, 1200] },          // harness run, left rail
        { x: [400, 440], y: [-1900, 1350], z: [1140, 1200] }             // harness run, right rail
      ] },

    /* ---------- telematics ----------
       The modem and the whip antenna: two percent of the bill of materials,
       and the layer that turns a machine into a subscription. */
    { node: 'telematics', color: '#7d8794', dir: [-0.55, -0.35, 1], spread: 1.8,
      rough: 0.45,
      boxes: [
        { x: [-430, -190], y: [-110, 210], z: [3000, 3130] },
        { shape: 'cyl', axis: 'z', seg: 12, x: [-330, -290], y: [15, 55], z: [3130, 3580] }
      ] },

    /* ---------- implements ----------
       Modelled, but deliberately as a separate object in a different colour,
       and thrown clear of the machine on the explode axis. An implement is not
       part of the tractor: it is a second machine, bought separately and often
       from another brand, which is exactly why it carries no bomPct. Showing
       it hitched and then watching it leave says that better than a footnote. */
    { node: 'implements', color: '#8c4a35', dir: [0, 1, 0.12], spread: 2.1,
      rough: 0.62, metal: 0.2,
      boxes: [
        { x: [-1500, 1500], y: [2420, 2620], z: [520, 800] },            // toolbar
        { x: [-1280, -1120], y: [2450, 2580], z: [150, 540] },           // tines
        { x: [-700, -540], y: [2450, 2580], z: [150, 540] },
        { x: [-80, 80], y: [2450, 2580], z: [150, 540] },
        { x: [540, 700], y: [2450, 2580], z: [150, 540] },
        { x: [1120, 1280], y: [2450, 2580], z: [150, 540] }
      ] }
  ]
});

/* ================= TRACTOR / PRECISION GUIDANCE =================
 * The guidance stack on its own, scaled up so the two layers separate.
 * Only two children today (GNSS and vision), which is thin for a sub-model,
 * it exists because this is the layer the whole teardown argues is the most
 * valuable part of the machine, and dropping to a flat two-rectangle
 * schematic when you open it undercut that. It also gives the node somewhere
 * to grow: correction services and the display stack both belong here.
 */
TD.model('tractor/precision', {
  spread: 90,
  view: {
    camera: [0.48, 0.50, 0.72],
    distance: 1.05,
    background: 'studio',
    shadow: 0.14,
    edges: 0.40
  },
  parts: [
    /* Roof-mounted receiver: the dome, its ground plane, and the board inside.
       Domes are white because they are radomes, not styling. */
    { node: 'gnss', color: '#e2e5e8', dir: [0, 0, 1], spread: 1.2, rough: 0.35,
      boxes: [
        { shape: 'cyl', axis: 'z', seg: 32, r2: 0.5, x: [-150, 150], y: [-150, 150], z: [60, 210] },
        { shape: 'cyl', axis: 'z', seg: 32, x: [-165, 165], y: [-165, 165], z: [20, 60] },
        { x: [-110, 110], y: [-110, 110], z: [0, 20] }                   // receiver board
      ] },

    /* Camera bar for spot spraying: housing plus four lens barrels. Four,
       because the point of the system is that it looks at each row
       separately rather than at the field. */
    { node: 'ag-vision', color: '#2c333c', dir: [0, -0.3, -1], spread: 1.35, rough: 0.28,
      boxes: [
        { shape: 'round', r: 14, bevel: 5, x: [-330, 330], y: [-70, 70], z: [-150, -60] },
        { shape: 'cyl', axis: 'y', seg: 20, x: [-270, -190], y: [-110, -70], z: [-140, -60] },
        { shape: 'cyl', axis: 'y', seg: 20, x: [-90, -10], y: [-110, -70], z: [-140, -60] },
        { shape: 'cyl', axis: 'y', seg: 20, x: [10, 90], y: [-110, -70], z: [-140, -60] },
        { shape: 'cyl', axis: 'y', seg: 20, x: [190, 270], y: [-110, -70], z: [-140, -60] }
      ] }
  ]
});
