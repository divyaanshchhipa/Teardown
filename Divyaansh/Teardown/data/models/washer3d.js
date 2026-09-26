/* Teardown :: washing machine, 3D model
 *
 * Box-only geometry, same convention as every other model here, so round
 * parts (door, drum, bearings) are simplified into rectangular slabs
 * rather than cylinders: schematic, not CAD, matching the About page's
 * own framing. Casing is the shell; everything else sits inside it.
 */
TD.model('washing-machine', {
  spread: 55,
  parts: [
    { node: 'casing', color: '#9aa3ad', dir: [0, 0.2, -0.3], spread: 1.3, shell: true,
      boxes: [
        { x: [-300, 300], y: [0, 600], z: [0, 15] },      // base
        { x: [-300, -285], y: [0, 600], z: [15, 850] },   // left wall
        { x: [285, 300], y: [0, 600], z: [15, 850] },     // right wall
        { x: [-300, 300], y: [585, 600], z: [15, 850] },  // back wall
        { x: [-300, 300], y: [0, 600], z: [835, 850] }    // top
      ] },
    { node: 'drum-tub', color: '#4a4a52',
      boxes: [ { x: [-220, 220], y: [80, 480], z: [150, 700] } ] },
    { node: 'door', color: '#7d95ac', dir: [0, -1, 0.1], spread: 1.4,
      boxes: [ { x: [-200, 200], y: [-15, 5], z: [180, 580] } ] },
    { node: 'motor', color: '#3a6ea8',
      boxes: [ { x: [-80, 80], y: [420, 560], z: [20, 120] } ] },
    { node: 'control-board', color: '#5b8a72',
      boxes: [ { x: [-250, 250], y: [-5, 30], z: [750, 830] } ] },
    { node: 'display-ui', color: '#232f3d', dir: [0, -0.6, 0.6], spread: 1.3,
      boxes: [ { x: [-200, 200], y: [-15, 5], z: [800, 832] } ] },
    { node: 'suspension', color: '#8593a4', spread: 1.2,
      boxes: [
        { x: [-262, -232], y: [100, 450], z: [700, 800] },
        { x: [232, 262], y: [100, 450], z: [700, 800] }
      ] },
    { node: 'water-valve-pump', color: '#4fa3c9',
      boxes: [ { x: [-280, -200], y: [500, 580], z: [20, 80] } ] },
    { node: 'dispenser', color: '#c9a227', dir: [0, -1, 0.2], spread: 1.3,
      boxes: [ { x: [-150, 150], y: [-15, 5], z: [600, 700] } ] },
    { node: 'bearings-seals', color: '#2f3a45',
      boxes: [ { x: [-40, 40], y: [468, 500], z: [380, 460] } ] },
    { node: 'heating-element', color: '#c97a3a',
      boxes: [ { x: [-150, 150], y: [150, 200], z: [160, 190] } ] }
  ]
});
