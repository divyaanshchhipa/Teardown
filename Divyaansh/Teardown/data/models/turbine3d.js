/* Teardown :: wind turbine, 3D models
 *
 * Three views: the whole machine, a section of blade, and the direct-drive
 * generator.
 *
 * Two things this schema cannot do, and how they are handled:
 *
 *  - A real rotor is three blades at 120°, and every box here is axis
 *    aligned. Rotating geometry is not expressible, so the rotor is drawn as
 *    one blade up and two out, which is close to how a parked rotor
 *    actually sits, and reads as a rotor rather than as a cross. Same
 *    "schematic, not CAD" convention as every other model in this directory.
 *  - An aerofoil is a curve. The blade section is drawn as a flat sandwich,
 *    which is wrong about the shape and right about the construction: two
 *    skins, a light core between them, spar caps carrying the bending load
 *    and shear webs holding the two halves apart. That construction is the
 *    entire point of the blade chapter, so it is what the model shows.
 *
 * Scale is roughly 1:180 of a 150-metre machine, in the millimetre space the
 * schema expects. The tower is deliberately the tallest thing here by a wide
 * margin, because on a real turbine it is, and it is also 26% of the
 * cost, which is the finding the top-level view should make obvious.
 */
TD.model('wind-turbine', {
  spread: 70,
  view: {
    camera: [0.46, 0.34, 0.82],
    distance: 1.06,
    background: 'studio',
    shadow: 0.14,
    edges: 0.40
  },
  parts: [
    /* Three tapered sections, bolted at flanges. The taper is real and
       structural: bending moment is highest at the base. */
    { node: 'tower', color: '#c9d2da', rough: 0.42, metal: 0.35,
      boxes: [
        { shape: 'cyl', axis: 'z', seg: 26, x: [-23, 23], y: [-23, 23], z: [0, 300] },
        { shape: 'cyl', axis: 'z', seg: 26, x: [-19, 19], y: [-19, 19], z: [300, 600] },
        { shape: 'cyl', axis: 'z', seg: 26, x: [-15, 15], y: [-15, 15], z: [600, 845] }
      ] },

    /* The housing, plus the yaw ring it turns on. Marked shell so the
       internals are visible when the view is opened up. */
    { node: 'yaw-nacelle', color: '#9aa3ad', dir: [0, 0.6, 1], spread: 1.35,
      shell: true, rough: 0.5,
      boxes: [
        { x: [-30, 30], y: [-68, 60], z: [844, 908] },
        { shape: 'cyl', axis: 'z', seg: 22, x: [-23, 23], y: [-23, 23], z: [832, 846] }
      ] },

    /* Hub casting and the pitch drives inside it. Fifteen to thirty tonnes
       of ductile iron: deliberately chunky, because on a real machine it
       is far bigger than photographs suggest. */
    { node: 'hub-pitch', color: '#b8b2a6', dir: [0, -1, 0], spread: 1.5,
      rough: 0.55,
      boxes: [
        { shape: 'cyl', axis: 'y', seg: 26, x: [-28, 28], z: [848, 904], y: [-102, -68] }
      ] },

    /* One up, two out; see the header note. Each blade is three boxes
       rather than one, because a blade tapers hard from root to tip and a
       constant-section bar reads as a girder instead of an aerofoil. The
       chord dimension is x on the vertical blade and z on the horizontal
       pair, which is why the numbers look asymmetric. */
    { node: 'blades', color: '#eef1f4', dir: [0, -1, 0.15], spread: 1.2,
      rough: 0.32,
      boxes: [
        { x: [-19, 19], y: [-94, -74], z: [896, 1075] },
        { x: [-13, 13], y: [-93, -75], z: [1075, 1265] },
        { x: [-6, 6], y: [-92, -76], z: [1265, 1432] },

        { x: [-200, -22], y: [-94, -74], z: [842, 882] },
        { x: [-390, -200], y: [-93, -75], z: [846, 878] },
        { x: [-552, -390], y: [-92, -76], z: [851, 873] },

        { x: [22, 200], y: [-94, -74], z: [842, 882] },
        { x: [200, 390], y: [-93, -75], z: [846, 878] },
        { x: [390, 552], y: [-92, -76], z: [851, 873] }
      ] },

    /* The shaft, and the bearing carrying the whole rotor on it. Separate
       parts because they are separate lines in the bill of materials and
       come from completely different supplier bases. */
    { node: 'main-shaft', color: '#6a6a74', dir: [0, -0.7, 0.5], spread: 1.2,
      rough: 0.32, metal: 0.78,
      boxes: [
        { shape: 'cyl', axis: 'y', seg: 20, x: [-10, 10], z: [866, 886], y: [-70, -22] }
      ] },
    { node: 'main-bearing', color: '#4a4a52', dir: [0, -0.9, 0.6], spread: 1.45,
      rough: 0.26, metal: 0.86,
      boxes: [
        { shape: 'cyl', axis: 'y', seg: 24, x: [-17, 17], z: [859, 893], y: [-68, -55] }
      ] },

    { node: 'gearbox', color: '#5b8a72', dir: [0, 0, 1], spread: 1.15,
      rough: 0.38, metal: 0.5,
      boxes: [
        { shape: 'cyl', axis: 'y', seg: 20, x: [-21, 21], z: [855, 897], y: [-22, 6] }
      ] },

    { node: 'generator', color: '#3a6ea8', dir: [0, 0.3, 1], spread: 1.3,
      rough: 0.34, metal: 0.6,
      boxes: [
        { shape: 'cyl', axis: 'y', seg: 22, x: [-19, 19], z: [857, 895], y: [8, 36] }
      ] },

    { node: 'converter', color: '#c9a227', dir: [0, 1, 0.3], spread: 1.4,
      rough: 0.45,
      boxes: [
        { x: [-24, -2], y: [38, 53], z: [853, 895] }
      ] },

    /* Drawn in the nacelle here. On many machines it sits at the tower base
       instead, which is a layout choice rather than a functional one. */
    { node: 'transformer-wt', color: '#a8763f', dir: [0, 1, -0.4], spread: 1.55,
      rough: 0.5, metal: 0.4,
      boxes: [
        { x: [2, 22], y: [38, 53], z: [853, 878] }
      ] },

    /* Sits above the transformer in the nacelle rear: two per cent of the
       cost and effectively all of the operating value. */
    { node: 'control', color: '#8c5bb0', dir: [1, 0.6, 0.5], spread: 1.7,
      rough: 0.4,
      boxes: [
        { x: [4, 22], y: [38, 53], z: [880, 896] }
      ] },

    /* Hangs freely down the tower and is allowed to twist as the nacelle
       yaws; see the cabling node. Only visible once exploded. */
    { node: 'cabling', color: '#b8722e', dir: [-1, 0, 0], spread: 1.8,
      rough: 0.6,
      boxes: [
        { shape: 'cyl', axis: 'z', seg: 12, x: [-6, 6], y: [-6, 6], z: [30, 845] }
      ] }
  ]
});

/* ---------------------------------------------------------------------
 * A section of blade, cut across the span.
 *
 * The construction, from the outside in: a protective strip on the leading
 * edge that rain erodes; two glass laminate skins; a light core filling the
 * space between them everywhere except the structural spine; spar caps top
 * and bottom carrying essentially all the bending load; two shear webs
 * holding the halves apart; and the adhesive bond line down the trailing
 * edge where the two moulded halves are glued together.
 *
 * Spanwise is x, chord is y (leading edge at -y), thickness is z.
 * ------------------------------------------------------------------- */
TD.model('wind-turbine/blades', {
  spread: 190,
  view: {
    camera: [0.58, 0.36, 0.73],
    distance: 1.0,
    background: 'studio',
    shadow: 0.16,
    edges: 0.46
  },
  parts: [
    /* Upper and lower skins. Roughly 70% glass by weight even on a blade
       with a carbon spar. */
    { node: 'blade-shell', color: '#e6e9ec', dir: [0, 0, 1], spread: 1.0,
      rough: 0.36,
      boxes: [
        { x: [-500, 500], y: [-290, 300], z: [44, 58] },
        { x: [-500, 500], y: [-290, 300], z: [-58, -44] }
      ] },

    /* The sandwich core: everywhere the spar is not. Balsa at the root,
       PET foam over most of the span: the substitution the story turns
       on happens inside this volume. */
    { node: 'blade-core', color: '#d8b271', dir: [0, 0, -1], spread: 1.5,
      rough: 0.78,
      boxes: [
        { x: [-500, 500], y: [-286, -124], z: [-44, 44] },
        { x: [-500, 500], y: [124, 296], z: [-44, 44] }
      ] },

    /* Spar caps and the two shear webs between them. Pultruded carbon
       planks on a modern long blade. */
    { node: 'blade-spar', color: '#3b3f45', dir: [0, 0, 1], spread: 1.9,
      rough: 0.3, metal: 0.15,
      boxes: [
        { x: [-500, 500], y: [-120, 120], z: [30, 44] },
        { x: [-500, 500], y: [-120, 120], z: [-44, -30] },
        { x: [-500, 500], y: [-120, -104], z: [-30, 30] },
        { x: [-500, 500], y: [104, 120], z: [-30, 30] }
      ] },

    /* Leading edge protection. A consumable strip defending the most
       expensive rotating component in the machine. */
    { node: 'blade-coating', color: '#2f6d59', dir: [0, -1, 0], spread: 1.7,
      rough: 0.55,
      boxes: [
        { x: [-500, 500], y: [-316, -288], z: [-44, 44] }
      ] },

    /* The adhesive bond joining the two moulded halves. A recurring
       structural failure point, and impossible to inspect once closed. */
    { node: 'blade-resin', color: '#c9a227', dir: [0, 1, 0], spread: 2.1,
      rough: 0.5,
      boxes: [
        { x: [-500, 500], y: [296, 320], z: [-18, 18] }
      ] }
  ]
});

/* ---------------------------------------------------------------------
 * The direct-drive generator: a ring of rare earth magnets on the rotor,
 * a wound stator around it, and no gearbox anywhere.
 *
 * Eight magnet blocks stand in for the several dozen a real machine
 * carries: the same simplification the microwave's anode vanes use.
 * The whole point of the view is the ratio: a large volume of copper and
 * laminated steel wrapped around a small volume of material that comes
 * from one country.
 * ------------------------------------------------------------------- */
TD.model('wind-turbine/generator', {
  spread: 200,
  view: {
    camera: [0.50, 0.42, 0.76],
    distance: 1.04,
    background: 'studio',
    shadow: 0.15,
    edges: 0.42
  },
  parts: [
    /* Stator: laminated electrical steel with the copper windings in it. */
    { node: 'gen-copper', color: '#b8722e', dir: [0, 0, 1], spread: 1.0,
      rough: 0.34, metal: 0.72,
      boxes: [
        { shape: 'cyl', axis: 'y', seg: 34, x: [-336, 336], z: [-336, 336], y: [-72, 72] },
        { x: [-40, 40], y: [-78, 78], z: [286, 340] },
        { x: [-40, 40], y: [-78, 78], z: [-340, -286] },
        { x: [286, 340], y: [-78, 78], z: [-40, 40] },
        { x: [-340, -286], y: [-78, 78], z: [-40, 40] }
      ] },

    /* Rotor magnets. Roughly 200kg of sintered NdFeB per megawatt, and
       there is no substitute at this power density. */
    { node: 'magnets', color: '#4a4a52', dir: [0, -1, 0], spread: 1.6,
      rough: 0.28, metal: 0.85,
      boxes: [
        { x: [-32, 32], y: [-56, 56], z: [198, 262] },
        { x: [-32, 32], y: [-56, 56], z: [-262, -198] },
        { x: [198, 262], y: [-56, 56], z: [-32, 32] },
        { x: [-262, -198], y: [-56, 56], z: [-32, 32] },
        { x: [128, 190], y: [-56, 56], z: [128, 190] },
        { x: [-190, -128], y: [-56, 56], z: [128, 190] },
        { x: [128, 190], y: [-56, 56], z: [-190, -128] },
        { x: [-190, -128], y: [-56, 56], z: [-190, -128] }
      ] }
  ]
});
