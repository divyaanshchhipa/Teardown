/* Teardown : 3D models, combustion car
 *
 * Boxes in millimetres. x = right, y = back, z = up.
 * Every `node` must match a node id in data/devices/car.js.
 *
 * A C-segment hatchback: 4,600 long, 1,820 wide, 1,450 tall, 2,700 wheelbase.
 * Unlike the subsea cable, which had to be a scene because its real
 * proportions are unmodellable: this one is close to true scale, which makes
 * it the most literal model on the site since the laptop.
 *
 * Two things worth knowing if you edit it:
 *
 * The body is `shell: true` and explodes upward, so pulling it apart lifts the
 * skin off and leaves the engine, driveline, exhaust and interior sitting on
 * the chassis, which is the view that makes a car legible. Same reasoning as
 * the tractor putting its hood on `chassis-t` rather than on `engine`.
 *
 * The exhaust runs the full length of the underside as a single thin cylinder
 * with the catalytic converter swelling in the middle of it. That is
 * deliberate: it is the one subsystem you can see end to end in a single
 * glance, and it is the branch that leaves this teardown for the tractor's.
 */

TD.model('car', {
  spread: 620,
  view: {
    /* front three-quarter from slightly above: the angle every car has been
       photographed from since 1930, because it shows length, width and the
       front graphic at once */
    /* Deliberately low. A high three-quarter flattens a car into its plan
       view and makes any body look like a slab; dropping the elevation is
       the single cheapest thing that improves how this model reads, and it
       is why cars have been photographed from knee height for a century. */
    camera: [0.66, 0.17, 0.73],
    distance: 0.94,
    background: 'studio',
    shadow: 0.20,
    edges: 0.30,
    exposure: 1.04
  },
  parts: [

    /* ---------- body ----------
       Rebuilt for stance. Three things made the first version read as a
       shoebox, and all three are geometry rather than detail:

       1. No wheel arches. The wheels poked out of a flat slab side, which no
          car has ever done. The haunches below are separate rounded masses
          standing proud of the body over each axle, so the wheels sit *in*
          something.
       2. A flat roofline. The cabin is now two pieces: a front box and a
          rear `wedge` that narrows in plan and drops in height toward the
          tail using `sweep`, which is what gives a fastback its line.
       3. Hard edges. Large `r` and `bevel` on the main masses, low `rough`
          and high `metal`, so it reads as painted sheet rather than card.

       It also sits lower on bigger wheels than the first pass. Ride height
       and wheel diameter are most of what separates a car silhouette from a
       van, and they cost nothing to get right. */
    { node: 'body-c', color: '#8f3540', dir: [0, -0.2, 1], spread: 1.35,
      rough: 0.16, metal: 0.5, shell: true,
      boxes: [
        // main lower mass: sills and doors, low and heavily rounded
        { shape: 'round', r: 110, bevel: 34, x: [-820, 820], y: [-1010, 1010], z: [250, 880] },
        // front clip, narrowing and dropping toward the nose
        { shape: 'wedge', axis: 'y', at: 'min', taper: [0.88, 0.80],
          x: [-812, 812], y: [-2280, -990], z: [250, 755] },
        // rear clip
        { shape: 'wedge', axis: 'y', at: 'max', taper: [0.90, 0.88],
          x: [-812, 812], y: [990, 2280], z: [250, 800] },
        // bonnet and boot panels
        { shape: 'wedge', axis: 'y', at: 'min', taper: [0.90, 0.90],
          x: [-790, 790], y: [-2255, -1000], z: [755, 800] },
        { x: [-790, 790], y: [1000, 2255], z: [800, 845] },

        // haunches over each wheel, proud of the body side
        { shape: 'round', r: 60, bevel: 20, x: [-938, -800], y: [-1880, -990], z: [690, 900] },
        { shape: 'round', r: 60, bevel: 20, x: [800, 938], y: [-1880, -990], z: [690, 900] },
        { shape: 'round', r: 60, bevel: 20, x: [-938, -800], y: [990, 1880], z: [690, 920] },
        { shape: 'round', r: 60, bevel: 20, x: [800, 938], y: [990, 1880], z: [690, 920] },

        // cabin: front box, then a fastback tail dropping toward the rear
        { shape: 'round', r: 90, bevel: 30, x: [-725, 725], y: [-950, 300], z: [860, 1340] },
        { shape: 'wedge', axis: 'y', at: 'max', taper: [0.76, 0.50], sweep: [0, -150],
          x: [-725, 725], y: [300, 1420], z: [860, 1340] },

        // bumpers, tucked under the clips
        { shape: 'round', r: 80, bevel: 24, x: [-800, 800], y: [-2340, -2210], z: [270, 660] },
        { shape: 'round', r: 80, bevel: 24, x: [-800, 800], y: [2210, 2340], z: [270, 700] }
      ] },

    /* ---------- wheels and chassis ----------
       Bigger wheels on a wider track than the first pass. Rim faces are inset
       behind the sidewall rather than proud of it, so the tyre reads as a
       tyre. */
    { node: 'chassis-c', color: '#1d2126', dir: [0, 0, -1], spread: 1.1,
      rough: 0.78,
      boxes: [
        { shape: 'cyl', axis: 'x', seg: 36, x: [-925, -680], y: [-1790, -1090], z: [0, 700] },
        { shape: 'cyl', axis: 'x', seg: 36, x: [680, 925], y: [-1790, -1090], z: [0, 700] },
        { shape: 'cyl', axis: 'x', seg: 36, x: [-925, -680], y: [1090, 1790], z: [0, 700] },
        { shape: 'cyl', axis: 'x', seg: 36, x: [680, 925], y: [1090, 1790], z: [0, 700] },
        // rim faces, inset behind the sidewall
        { shape: 'cyl', axis: 'x', seg: 28, x: [-918, -892], y: [-1700, -1180], z: [90, 610] },
        { shape: 'cyl', axis: 'x', seg: 28, x: [892, 918], y: [-1700, -1180], z: [90, 610] },
        { shape: 'cyl', axis: 'x', seg: 28, x: [-918, -892], y: [1180, 1700], z: [90, 610] },
        { shape: 'cyl', axis: 'x', seg: 28, x: [892, 918], y: [1180, 1700], z: [90, 610] },
        // subframes
        { x: [-690, 690], y: [-1840, -1360], z: [250, 400] },
        { x: [-690, 690], y: [1260, 1740], z: [250, 400] },
        // struts
        { shape: 'cyl', axis: 'z', seg: 14, x: [-690, -600], y: [-1480, -1390], z: [400, 830] },
        { shape: 'cyl', axis: 'z', seg: 14, x: [600, 690], y: [-1480, -1390], z: [400, 830] },
        { shape: 'cyl', axis: 'z', seg: 14, x: [-690, -600], y: [1390, 1480], z: [400, 820] },
        { shape: 'cyl', axis: 'z', seg: 14, x: [600, 690], y: [1390, 1480], z: [400, 820] }
      ] },

    /* ---------- engine ----------
       Transverse four, ahead of the front axle line, turbocharger on the
       exhaust side. Everything in the engine bay finishes below z 780 so that
       nothing shows through the bonnet panel above it: the clearance rule
       the notebook model documents, and the thing that caught this model out
       twice. */
    { node: 'engine-c', color: '#3d444d', dir: [0, -0.75, 0.65], spread: 1.4,
      rough: 0.5, metal: 0.4,
      boxes: [
        { shape: 'round', r: 30, bevel: 12, x: [-380, 380], y: [-1990, -1300], z: [430, 700] },
        { x: [-300, 300], y: [-1900, -1420], z: [700, 750] },
        { shape: 'cyl', axis: 'y', seg: 16, x: [-500, -350], y: [-1720, -1500], z: [480, 630] }
      ] },

    /* ---------- driveline ---------- */
    { node: 'driveline-c', color: '#565e68', dir: [0.85, 0, 0.4], spread: 1.5,
      rough: 0.45, metal: 0.5,
      boxes: [
        { shape: 'round', r: 26, bevel: 10, x: [380, 690], y: [-1900, -1320], z: [420, 720] },
        { shape: 'cyl', axis: 'y', seg: 14, x: [-70, 70], y: [-1320, 1180], z: [320, 450] },
        { shape: 'round', r: 20, bevel: 8, x: [-270, 270], y: [1180, 1450], z: [320, 600] }
      ] },

    /* ---------- exhaust ----------
       The one system visible end to end: manifold, catalyst, pipe, silencer. */
    { node: 'exhaust-c', color: '#8e959c', dir: [0, 0.3, -1], spread: 1.7,
      rough: 0.4, metal: 0.6,
      boxes: [
        { shape: 'cyl', axis: 'y', seg: 14, x: [-200, -80], y: [-1300, 2180], z: [215, 320] },
        { shape: 'cyl', axis: 'y', seg: 18, x: [-240, -40], y: [-1180, -820], z: [195, 350] },
        { shape: 'round', r: 24, bevel: 8, x: [-330, 120], y: [1720, 2170], z: [185, 370] }
      ] },

    /* ---------- interior ---------- */
    { node: 'interior-c', color: '#6a5f57', dir: [0, 0.15, 1], spread: 1.75,
      rough: 0.72,
      boxes: [
        { shape: 'round', r: 24, bevel: 10, x: [-600, -180], y: [-540, 180], z: [560, 1170] },
        { shape: 'round', r: 24, bevel: 10, x: [180, 600], y: [-540, 180], z: [560, 1170] },
        { shape: 'round', r: 24, bevel: 10, x: [-640, 640], y: [380, 830], z: [560, 1110] },
        { shape: 'round', r: 20, bevel: 8, x: [-720, 720], y: [-900, -640], z: [740, 1010] }
      ] },

    /* ---------- glazing and lighting ----------
       Glass sits just outside the cabin faces rather than forming them. The
       rear quarter glass carries the same taper and sweep as the fastback
       above it, so the two lines agree. */
    { node: 'exterior-c', color: '#2b3a4a', dir: [0, -0.15, 1], spread: 2.0,
      rough: 0.05, metal: 0.2,
      boxes: [
        { x: [-620, 620], y: [-970, -930], z: [880, 1315] },
        { x: [-744, -718], y: [-910, 290], z: [880, 1315] },
        { x: [718, 744], y: [-910, 290], z: [880, 1315] },
        { shape: 'wedge', axis: 'y', at: 'max', taper: [1.0, 0.50], sweep: [0, -150],
          x: [-744, -718], y: [290, 1380], z: [880, 1315] },
        { shape: 'wedge', axis: 'y', at: 'max', taper: [1.0, 0.50], sweep: [0, -150],
          x: [718, 744], y: [290, 1380], z: [880, 1315] },
        { x: [-540, 540], y: [1370, 1408], z: [880, 1090] },
        // lamps
        { shape: 'round', r: 26, bevel: 9, x: [-790, -410], y: [-2320, -2200], z: [500, 680] },
        { shape: 'round', r: 26, bevel: 9, x: [410, 790], y: [-2320, -2200], z: [500, 680] },
        { shape: 'round', r: 26, bevel: 9, x: [-795, -420], y: [2200, 2320], z: [530, 710] },
        { shape: 'round', r: 26, bevel: 9, x: [420, 795], y: [2200, 2320], z: [530, 710] }
      ] },

    /* ---------- electrical ----------
       Battery, controller box, and the harness snaking the length of the car.
       Drawn as one continuous run because that is the point of the node: it
       touches everything and cannot be substituted. */
    { node: 'electrical-c', color: '#b08a4a', dir: [-0.85, 0, 0.7], spread: 1.9,
      rough: 0.45,
      boxes: [
        { shape: 'round', r: 16, bevel: 6, x: [-640, -340], y: [-2060, -1760], z: [560, 730] },
        { x: [300, 610], y: [-1900, -1600], z: [570, 720] },
        { shape: 'cyl', axis: 'y', seg: 10, x: [-60, 60], y: [-2000, 2000], z: [590, 660] },
        { shape: 'cyl', axis: 'x', seg: 10, x: [-740, 740], y: [-760, -680], z: [600, 660] }
      ] },

    /* ---------- thermal ---------- */
    { node: 'thermal-c', color: '#2f6d59', dir: [0, -1, 0.4], spread: 2.1,
      rough: 0.5,
      boxes: [
        { x: [-570, 570], y: [-2170, -2070], z: [360, 730] },
        { shape: 'cyl', axis: 'y', seg: 14, x: [-160, 160], y: [-2070, -1990], z: [420, 660] }
      ] }
  ]
});

/* ========================= CAR / ENGINE =========================
 * A transverse four, exploded upward: block, pistons, injection rail and
 * turbocharger. Scaled up from the ~700 mm the real thing is.
 */
TD.model('car/engine-c', {
  spread: 240,
  view: {
    camera: [0.55, 0.42, 0.72],
    distance: 1.02,
    background: 'studio',
    shadow: 0.16,
    edges: 0.42
  },
  parts: [
    { node: 'engine-block', color: '#4a525c', dir: [0, 0, -1], spread: 1.2,
      rough: 0.55, metal: 0.35,
      boxes: [
        { shape: 'round', r: 40, bevel: 16, x: [-420, 420], y: [-300, 300], z: [-420, 180] },
        // four bores
        { shape: 'cyl', axis: 'z', seg: 22, x: [-330, -150], y: [-90, 90], z: [180, 260] },
        { shape: 'cyl', axis: 'z', seg: 22, x: [-110, 70], y: [-90, 90], z: [180, 260] },
        { shape: 'cyl', axis: 'z', seg: 22, x: [110, 290], y: [-90, 90], z: [180, 260] },
        { shape: 'cyl', axis: 'z', seg: 22, x: [330, 510], y: [-90, 90], z: [180, 260] }
      ] },

    { node: 'pistons-rings', color: '#a8afb7', dir: [0, 0, 1], spread: 1.45,
      rough: 0.3, metal: 0.6,
      boxes: [
        { shape: 'cyl', axis: 'z', seg: 20, x: [-320, -160], y: [-80, 80], z: [300, 460] },
        { shape: 'cyl', axis: 'z', seg: 20, x: [-100, 60], y: [-80, 80], z: [300, 460] },
        { shape: 'cyl', axis: 'z', seg: 20, x: [120, 280], y: [-80, 80], z: [300, 460] },
        { shape: 'cyl', axis: 'z', seg: 20, x: [340, 500], y: [-80, 80], z: [300, 460] }
      ] },

    /* the rail and four injectors: the most concentrated layer in the
       powertrain, and physically one of the smallest */
    { node: 'fuel-injection', color: '#c2a15a', dir: [0, -0.9, 0.6], spread: 1.75,
      rough: 0.3, metal: 0.55,
      boxes: [
        { shape: 'cyl', axis: 'x', seg: 14, x: [-380, 560], y: [-230, -150], z: [280, 360] },
        { shape: 'cyl', axis: 'z', seg: 12, x: [-280, -220], y: [-210, -150], z: [200, 300] },
        { shape: 'cyl', axis: 'z', seg: 12, x: [-60, 0], y: [-210, -150], z: [200, 300] },
        { shape: 'cyl', axis: 'z', seg: 12, x: [160, 220], y: [-210, -150], z: [200, 300] },
        { shape: 'cyl', axis: 'z', seg: 12, x: [380, 440], y: [-210, -150], z: [200, 300] }
      ] },

    { node: 'turbocharger', color: '#8e959c', dir: [0.9, 0.4, 0.35], spread: 1.9,
      rough: 0.35, metal: 0.7,
      boxes: [
        { shape: 'cyl', axis: 'x', seg: 24, x: [520, 700], y: [140, 420], z: [-160, 120] },
        { shape: 'cyl', axis: 'x', seg: 24, r2: 0.55, at: 'max',
          x: [700, 830], y: [180, 380], z: [-120, 80] }
      ] }
  ]
});

/* ======================= CAR / ELECTRICAL =======================
 * The harness laid out flat with the things it connects hanging off it.
 * Drawn this way on purpose: a harness is normally invisible, and seeing it
 * as one continuous branching object is the whole argument of the node.
 */
TD.model('car/electrical-c', {
  spread: 300,
  view: {
    camera: [0.40, 0.56, 0.72],
    distance: 1.0,
    background: 'studio',
    shadow: 0.14,
    edges: 0.40
  },
  parts: [
    { node: 'harness-c', color: '#b08a4a', dir: [0, 0, -1], spread: 1.15, rough: 0.55,
      boxes: [
        { shape: 'cyl', axis: 'y', seg: 12, x: [-55, 55], y: [-1300, 1300], z: [-55, 55] },
        { shape: 'cyl', axis: 'x', seg: 10, x: [-760, 760], y: [-720, -640], z: [-40, 40] },
        { shape: 'cyl', axis: 'x', seg: 10, x: [-620, 620], y: [180, 250], z: [-38, 38] },
        { shape: 'cyl', axis: 'x', seg: 10, x: [-540, 540], y: [880, 950], z: [-34, 34] },
        { shape: 'cyl', axis: 'y', seg: 8, x: [-700, -640], y: [-720, 900], z: [-30, 30] },
        { shape: 'cyl', axis: 'y', seg: 8, x: [640, 700], y: [-720, 900], z: [-30, 30] }
      ] },

    { node: 'ecu-c', color: '#3d444d', dir: [0, -0.3, 1], spread: 1.5, rough: 0.4,
      boxes: [
        { shape: 'round', r: 18, bevel: 7, x: [-420, -180], y: [-1120, -840], z: [70, 210] },
        { shape: 'round', r: 18, bevel: 7, x: [180, 420], y: [-1120, -840], z: [70, 210] },
        { shape: 'round', r: 14, bevel: 6, x: [-260, -60], y: [320, 520], z: [60, 170] },
        { shape: 'round', r: 14, bevel: 6, x: [80, 280], y: [960, 1160], z: [60, 170] }
      ] },

    { node: 'infotainment-c', color: '#232f3d', dir: [0, -0.9, 0.5], spread: 1.8, rough: 0.15,
      boxes: [
        { shape: 'round', r: 16, bevel: 6, x: [-360, 360], y: [-1420, -1180], z: [90, 320] }
      ] },

    { node: 'battery-12v', color: '#2f6d59', dir: [-0.9, -0.4, 0.5], spread: 1.9, rough: 0.6,
      boxes: [
        { shape: 'round', r: 14, bevel: 6, x: [-760, -440], y: [-1360, -1060], z: [60, 300] }
      ] }
  ]
});
