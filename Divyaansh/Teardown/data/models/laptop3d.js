/* Teardown :: 3D models
 *
 * Boxes in millimetres. x = right, y = back, z = up.
 * Every `node` must match a node id in the matching device file, which is how
 * clicking a solid in the 3D view selects the right component.
 *
 * A model keyed "laptop" is the top level view. A model keyed "laptop/xyz" is
 * used when you open that component. Anything without a model falls back to
 * the flat schematic renderer.
 */

/* ============================ LAPTOP ============================
 * 14 inch chassis, 320 x 220 x 17 closed.
 * Base internals sit between z 1 and 13, the deck is 13 to 17, and the lid
 * is modelled closed (z 17 to 24) then swung open about the hinge line.
 */
TD.model('laptop', {
  spread: 42,
  lid: { axisY: 105, axisZ: 20.5 },
  view: {
    camera: [0.52, 0.56, 0.80],   // three-quarter from the front, screen readable
    distance: 0.97,
    background: 'studio',
    shadow: 0.14,
    edges: 0.42,
    exposure: 1.02,
    presets: { hinge: [0.05, 0.32, -1], deck: [0.0005, 1, 0.28] }
  },
  parts: [
    /* The shell: bottom cover, the four side walls, and the deck frame that
       surrounds the keyboard and touchpad. Without the deck and walls you look
       straight into the internals and it does not read as a closed laptop.
       Cover and deck are rounded rather than square, at this size a hard
       90-degree extrusion is the single thing that most makes a notebook read
       as a cardboard box rather than a machined chassis. */
    { node: 'enclosure', color: '#8b939d', dir: [0, -0.3, -1], spread: 1.35, shell: true,
      rough: 0.42, metal: 0.55,
      boxes: [
        { shape: 'round', r: 9, bevel: 1.1, x: [-160, 160], y: [-110, 110], z: [-3, 1.4] }, // bottom cover
        { x: [-160, -156], y: [-108, 108], z: [1, 13] },      // left wall
        { x: [156, 160], y: [-108, 108], z: [1, 13] },        // right wall
        { x: [-152, 152], y: [-110, -106], z: [1, 12] },      // front wall
        { x: [-160, 160], y: [106, 110], z: [1, 13] },        // rear wall
        { x: [-160, 160], y: [80, 110], z: [13, 17] },        // deck, behind keyboard
        { shape: 'round', r: 7, bevel: 0.9, x: [-160, 160], y: [-111, -96], z: [13, 17] }, // front lip
        { x: [-160, -132], y: [-98, 80], z: [13, 17] },       // deck, left
        { x: [132, 160], y: [-98, 80], z: [13, 17] },         // deck, right
        { x: [-132, -50], y: [-98, -26], z: [13, 17] },       // left palm rest
        { x: [50, 132], y: [-98, -26], z: [13, 17] },         // right palm rest
        { x: [-50, 50], y: [-34, -26], z: [13, 17] }          // strip above touchpad
      ] },

    /* three prismatic cells, which is what a notebook pack actually is, and
       what makes it read as a battery rather than a solid block */
    { node: 'battery', color: '#2f6d59', rough: 0.5,
      boxes: [
        { shape: 'round', r: 3, bevel: 0.6, x: [-118, -41], y: [-98, 2], z: [1.4, 11.8] },
        { shape: 'round', r: 3, bevel: 0.6, x: [-38, 38], y: [-98, 2], z: [1.4, 11.8] },
        { shape: 'round', r: 3, bevel: 0.6, x: [41, 118], y: [-98, 2], z: [1.4, 11.8] }
      ] },

    /* the board with its major packages standing on it, so that opening the
       mainboard is a continuation of what you could already see, not a reveal */
    { node: 'motherboard', color: '#15613c', rough: 0.72,
      boxes: [
        { x: [-135, 135], y: [18, 86], z: [1.4, 3.2] },       // pcb
        { x: [-40, 4], y: [34, 74], z: [3.2, 6.4] },          // cpu package
        { x: [12, 52], y: [34, 74], z: [3.2, 6.2] },          // gpu package
        { x: [-104, -58], y: [40, 68], z: [3.2, 5.2] },       // dram
        { x: [62, 120], y: [40, 62], z: [3.2, 5.0] },         // ssd
        { x: [-128, -110], y: [26, 52], z: [3.2, 4.6] },      // pmic
        { x: [104, 128], y: [24, 40], z: [3.2, 4.4] }         // firmware / io
      ] },

    /* heat pipes are round tube, and reading as round is most of what tells
       you this is a cooling system and not another bracket */
    { node: 'thermal', color: '#b5763a', rough: 0.38, metal: 0.6,
      boxes: [
        { shape: 'cyl', axis: 'z', seg: 20, x: [-126, -74], y: [58, 100], z: [6.4, 12.4] }, // left fan
        { shape: 'cyl', axis: 'z', seg: 20, x: [74, 126], y: [58, 100], z: [6.4, 12.4] },   // right fan
        { shape: 'cyl', axis: 'x', seg: 14, x: [-96, 96], y: [68, 76], z: [6.6, 11.4] },    // heat pipe
        { shape: 'cyl', axis: 'x', seg: 14, x: [-70, 70], y: [80, 87], z: [6.6, 10.8] },    // second pipe
        { x: [-128, -104], y: [98, 106], z: [6, 12 ] },       // left exhaust fin stack
        { x: [104, 128], y: [98, 106], z: [6, 12] }           // right exhaust fin stack
      ] },

    { node: 'audio', color: '#5a6472', rough: 0.8,
      boxes: [
        { shape: 'cyl', axis: 'y', seg: 16, x: [-155, -134], y: [-84, 4], z: [2, 10] },
        { shape: 'cyl', axis: 'y', seg: 16, x: [134, 155], y: [-84, 4], z: [2, 10] }
      ] },

    /* a keycap field rather than one slab: five rows of caps sunk into a
       recessed well, which is what makes the deck read as a keyboard from
       any angle instead of only from directly above */
    { node: 'keyboard', color: '#2b3038', rough: 0.85,
      boxes: [
        { x: [-132, 132], y: [-26, 80], z: [12.6, 14.4] },    // well floor
        { shape: 'round', r: 1.4, bevel: 0.35, x: [-128, 128], y: [64, 78], z: [14.4, 17.2] },
        { shape: 'round', r: 1.4, bevel: 0.35, x: [-128, 128], y: [46, 61], z: [14.4, 17.3] },
        { shape: 'round', r: 1.4, bevel: 0.35, x: [-128, 128], y: [28, 43], z: [14.4, 17.4] },
        { shape: 'round', r: 1.4, bevel: 0.35, x: [-128, 128], y: [10, 25], z: [14.4, 17.4] },
        { shape: 'round', r: 1.4, bevel: 0.35, x: [-128, 128], y: [-8, 7], z: [14.4, 17.4] },
        { shape: 'round', r: 1.4, bevel: 0.35, x: [-92, 92], y: [-24, -11], z: [14.4, 17.3] }
      ] },

    /* sunk into the palm rest, not floating on top of it */
    { node: 'touchpad', color: '#b6bec7', rough: 0.22, metal: 0.15,
      boxes: [{ shape: 'round', r: 3.5, bevel: 0.5, x: [-50, 50], y: [-96, -34], z: [15.4, 17.1] }] },

    /* ports are cut into the side walls. Small, but they are the only part
       of the machine a buyer physically interacts with on the outside, and
       their absence is conspicuous once the walls read as walls. */
    { node: 'ports', color: '#3d454f', spread: 0.9, rough: 0.35, metal: 0.5,
      boxes: [
        { x: [-161, -155], y: [-40, -18], z: [4, 10] },
        { x: [-161, -155], y: [-8, 14], z: [4, 10] },
        { x: [-161, -155], y: [30, 44], z: [5, 9] },
        { x: [155, 161], y: [-30, -8], z: [4, 10] },
        { x: [155, 161], y: [16, 38], z: [4, 10] }
      ] },

    { node: 'hinge', color: '#98a1ab', spread: 0.5, rough: 0.3, metal: 0.75,
      boxes: [
        { shape: 'cyl', axis: 'x', seg: 18, x: [-118, -70], y: [93, 105], z: [3, 15] },
        { shape: 'cyl', axis: 'x', seg: 18, x: [70, 118], y: [93, 105], z: [3, 15] },
        { x: [-70, 70], y: [96, 104], z: [6, 12] }            // hinge rail between the barrels
      ] },

    /* everything below rides on the lid. Lid back is a rounded shell; the
       panel and bezel are separate so the screen has a visible border and
       does not read as a painted rectangle. */
    { node: 'display-assembly', color: '#1b2430', hinged: true, spread: 0.85, shell: true,
      rough: 0.45, metal: 0.35,
      boxes: [
        { shape: 'round', r: 8, bevel: 1.0, x: [-158, 158], y: [-108, 104], z: [20.6, 24.4] }, // lid back
        { x: [-158, -150], y: [-108, 104], z: [17.6, 20.6] }, // bezel, left
        { x: [150, 158], y: [-108, 104], z: [17.6, 20.6] },   // bezel, right
        { x: [-158, 158], y: [-108, -100], z: [17.6, 20.6] }, // bezel, top edge of screen
        { x: [-158, 158], y: [96, 104], z: [17.6, 20.6] }     // bezel, chin
      ] },

    /* the panel itself, the thing you actually look at */
    { node: 'panel', color: '#151d28', hinged: true, spread: 0.9, rough: 0.14, metal: 0.05,
      boxes: [{ x: [-150, 150], y: [-100, 96], z: [17.9, 20.4] }] },

    /* the far edge of the lid from the hinge becomes the top of the screen once
       it is open, so the camera lives at low y, not high y */
    { node: 'webcam', color: '#0e1218', hinged: true, spread: 1.5, rough: 0.2,
      boxes: [
        { shape: 'cyl', axis: 'z', seg: 16, x: [-6, 6], y: [-106, -101], z: [17.4, 20.5] },
        { x: [-26, 26], y: [-107, -100], z: [18.4, 20.4] }
      ] },

    { node: 'wireless', color: '#c2a15a', hinged: true, spread: 1.35, rough: 0.5,
      boxes: [
        { x: [-157, -151], y: [-98, 92], z: [20.8, 24.2] },
        { x: [151, 157], y: [-98, 92], z: [20.8, 24.2] }
      ] }
  ]
});

/* ===================== LAPTOP / MAINBOARD =====================
 * The board laid flat, chips standing on it.
 */
TD.model('laptop/motherboard', {
  spread: 16,
  parts: [
    { node: 'pcb', color: '#15613c', dir: [0, 0, -1], spread: 1.3,
      boxes: [{ x: [-135, 135], y: [-34, 34], z: [0, 2] }] },

    { node: 'cpu', color: '#39404a',
      boxes: [{ x: [-32, 18], y: [-2, 30], z: [2, 7.5] }] },

    { node: 'gpu', color: '#39404a',
      boxes: [{ x: [26, 76], y: [-2, 30], z: [2, 7.5] }] },

    { node: 'dram', color: '#4d5864',
      boxes: [
        { x: [-94, -48], y: [2, 26], z: [2, 5] },
        { x: [84, 128], y: [2, 26], z: [2, 5] }
      ] },

    { node: 'ssd', color: '#2f3a45',
      boxes: [{ x: [-62, 38], y: [-30, -10], z: [2, 5] }] },

    { node: 'wifi', color: '#59636e',
      boxes: [{ x: [52, 94], y: [-30, -12], z: [2, 4.5] }] },

    { node: 'pmic', color: '#6d5c40',
      boxes: [
        { x: [-122, -100], y: [-26, -4], z: [2, 4.2] },
        { x: [100, 126], y: [-26, -4], z: [2, 4.2] },
        { x: [-22, 2], y: [-30, -16], z: [2, 3.6] }
      ] },

    { node: 'firmware', color: '#8a6a2e',
      boxes: [{ x: [14, 36], y: [-30, -16], z: [2, 3.6] }] },

    { node: 'ports', color: '#aeb5bc',
      boxes: [
        { x: [-143, -131], y: [-22, 14], z: [0.5, 7] },
        { x: [131, 143], y: [-22, 14], z: [0.5, 7] }
      ] }
  ]
});

/* ================= LAPTOP / DISPLAY ASSEMBLY =================
 * The lid stack laid flat and separated into its layers.
 */
TD.model('laptop/display-assembly', {
  spread: 15,
  parts: [
    { node: 'backlight', color: '#d9c99a',
      boxes: [{ x: [-152, 152], y: [-100, 94], z: [2, 5] }] },

    { node: 'driver-ic', color: '#8a6a2e',
      boxes: [{ x: [-70, 70], y: [-104, -90], z: [5, 7.5] }] },

    { node: 'panel', color: '#232f3d',
      boxes: [{ x: [-150, 150], y: [-98, 92], z: [5, 8] }] },

    { node: 'cover-glass', color: '#7d95ac',
      boxes: [{ x: [-158, 158], y: [-104, 104], z: [8, 10.4] }] }
  ]
});

/* The smartphone model used to live here. It now has its own file,
   data/models/smartphone3d.js, alongside its sub-models. */
