/* Teardown :: games console, 3D model
 *
 * Now a properly closed shell with the internals placed inside it, so
 * X-ray has something to reveal: the first version had no enclosure at
 * all, which meant X-ray mode had nothing to fade on this device.
 */
TD.model('console', {
  spread: 55,
  parts: [
    { node: 'console-enclosure', color: '#767f8a', dir: [0, 0, -1], spread: 1.3, shell: true,
      boxes: [
        { x: [-190, 190], y: [-130, 130], z: [0, 8] },      // base
        { x: [-190, 190], y: [-130, 130], z: [92, 100] },   // top
        { x: [-190, -182], y: [-130, 130], z: [8, 92] },    // left wall
        { x: [182, 190], y: [-130, 130], z: [8, 92] },      // right wall
        { x: [-190, 190], y: [122, 130], z: [8, 92] },      // back wall
        { x: [-190, 190], y: [-130, -122], z: [8, 92] }     // front wall
      ] },
    { node: 'apu', color: '#3a6ea8',
      boxes: [ { x: [-40, 40], y: [-60, 20], z: [10, 35] } ] },
    { node: 'console-memory', color: '#5b8a72',
      boxes: [
        { x: [-170, -50], y: [-60, 20], z: [10, 30] },
        { x: [50, 170], y: [-60, 20], z: [10, 30] }
      ] },
    { node: 'console-storage', color: '#4a4a52',
      boxes: [ { x: [60, 150], y: [40, 100], z: [10, 25] } ] },
    { node: 'console-cooling', color: '#9aa3ad', spread: 1.15,
      boxes: [ { x: [-60, 60], y: [-70, 30], z: [35, 80] } ] },
    { node: 'console-psu', color: '#c9a227',
      boxes: [ { x: [-170, -60], y: [40, 110], z: [10, 40] } ] },
    { node: 'console-hdmi', color: '#8a6fae', spread: 1.2,
      boxes: [ { x: [-30, 30], y: [115, 125], z: [15, 30] } ] },
    { node: 'console-wifi', color: '#4fa3c9',
      boxes: [ { x: [100, 140], y: [100, 125], z: [10, 18] } ] },
    { node: 'console-optical', color: '#2f3a45', spread: 1.15,
      boxes: [ { x: [-150, -40], y: [-110, -30], z: [45, 85] } ] }
  ]
});
