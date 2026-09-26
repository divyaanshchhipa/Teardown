/* Teardown :: interactive 3D renderer (three.js)
 *
 * Reads the exact same data/models/*.js box schema iso.js uses, nothing
 * about that format changes. iso.js stays the permanent fallback for
 * devices without WebGL; this is the primary renderer for devices with one,
 * offering free orbit, zoom, pan, preset views, isolate and X-ray, none of
 * which iso.js's axonometric/SVG design can do cleanly.
 *
 * Coordinate mapping. Model space is x=right, y=back, z=up (see iso.js).
 * three.js is right-handed with Y up. Mapping (three.x, three.y, three.z) =
 * (x, z, -y) preserves handedness (x_hat × z_hat = -y_hat, matching the
 * source system's x × y = z once the sign flip on y is carried through),
 * verified by hand rather than assumed, since nothing here can be checked
 * visually in this environment. The hinge rotation below is derived from
 * iso.js's toWorld() formula under this same mapping: rotating the hinge
 * group by the *same* lidAngle value, with no sign flip, reproduces it
 * exactly (also hand-verified against iso.js's y/z rotation formula).
 */
(function (TD) {
  'use strict';

  var reduceMotion = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  TD.canUse3D = function () {
    if (TD._webglOK !== undefined) return TD._webglOK;
    try {
      if (!window.THREE || !window.THREE.OrbitControls) { TD._webglOK = false; return false; }
      var c = document.createElement('canvas');
      TD._webglOK = !!(c.getContext('webgl2') || c.getContext('webgl') || c.getContext('experimental-webgl'));
    } catch (e) { TD._webglOK = false; }
    return TD._webglOK;
  };

  function toThree(x, y, z) { return new THREE.Vector3(x, z, -y); }

  /* ---------- theme ----------
   * Part colours in data/models/*.js are physical descriptions and never
   * change. What changes is everything that has to *separate* a part from
   * the ground behind it, and since the canvas is deliberately alpha
   * transparent, that ground is a CSS gradient, not a scene background.
   *
   * On light, a pale part is held by a dark crease line and a contact
   * shadow. Neither of those works on dark: an ink hairline vanishes and a
   * black shadow is nothing. So on dark the creases invert to a pale line
   * and the rim light does the separating instead.
   */
  var THEME = {
    light: {
      edge: 0x0d1b2a, edgeOpacity: 1,
      select: 0x002060, selectOpacity: 0.95,
      shadowScale: 1, exposureScale: 1,
      ambient: 0xffffff, ambientI: 0.30,
      key: 0xfffaf2, keyI: 2.05,
      fill: 0xdce6f2, fillI: 0.55,
      rim: 0xc8d6e8, rimI: 0.85,
      hemiSky: 0xffffff, hemiGround: 0xa8b4c4, hemiI: 0.45
    },
    dark: {
      /* Edges carry far more weight here than on light. A laptop screen is
         declared near-black because a laptop screen *is* near-black, and on
         a dark ground its fill alone measured 1.12:1, effectively invisible.
         What makes a dark object legible against a dark ground is its
         silhouette, so the crease line is drawn much closer to full strength
         and in a pale colour. This is the mechanism technical illustration
         has always used; it is not a workaround. */
      edge: 0xe4edf7, edgeOpacity: 1.9,
      select: 0x6ea8ff, selectOpacity: 1,
      shadowScale: 1.6,
      /* Exposure, not part colour, is the honest lever for "the blacks have
         nowhere to go". Opening the camera up lifts a near-black screen off
         a near-black ground while keeping every part's relationship to every
         other intact, and ACES rolls the highlights off rather than clipping
         the pale parts that were already fine. */
      exposureScale: 1.45,
      ambient: 0xdfe8f5, ambientI: 0.30,
      key: 0xfff6e8, keyI: 1.80,
      fill: 0x5f708f, fillI: 0.50,
      /* the rim is what puts a bright lip on a black bezel */
      rim: 0xa8ccf8, rimI: 1.75,
      hemiSky: 0xc8d8ee, hemiGround: 0x2a3340, hemiI: 0.42
    }
  };

  function themeOf() {
    return (TD.theme && TD.theme() === 'dark') ? THEME.dark : THEME.light;
  }

  var PRESETS = {
    iso:    [0.62, 0.72, 0.62],
    front:  [0, 0.12, 1],
    back:   [0, 0.12, -1],
    left:   [-1, 0.12, 0],
    right:  [1, 0.12, 0],
    top:    [0.0005, 1, 0.0005],
    bottom: [0.0005, -1, 0.0005]
  };

  /* ---------- presentation config ----------
   * Every key is optional and every default reproduces the behaviour the
   * renderer had before this block existed, so a model that declares no
   * `view` at all is unaffected.
   */
  var VIEW_DEFAULTS = {
    camera: PRESETS.iso,   // direction from target to camera, three-space
    target: null,          // model-space [x,y,z]; null = geometric centre
    distance: 1,           // margin on the computed fit; 1 = bounding sphere exactly fills
    background: 'studio',  // studio | sky | plain: a CSS class on the host
    ground: 'shadow',      // shadow | none
    shadow: 0.15,          // contact-shadow opacity
    exposure: 1,           // tone-mapping exposure
    light: 1,              // multiplier over the whole lighting rig
    edges: 0.5,            // outline opacity, 0 disables
    contrast: 1,           // material roughness/metalness trim per model
    presets: null          // extra named camera directions
  };

  function viewOf(model) {
    var v = {}, src = (model && model.view) || {};
    for (var k in VIEW_DEFAULTS) {
      v[k] = Object.prototype.hasOwnProperty.call(src, k) ? src[k] : VIEW_DEFAULTS[k];
    }
    return v;
  }

  /* ---------- declarative geometry ----------
   * Every primitive keeps its axis-aligned bounding box (x/y/z) as its
   * primary description. That is deliberate: iso.js, the no-WebGL fallback,
   * reads only those three extents and draws a box, so adding primitives
   * here can never break it: a cylinder simply degrades to the box it fits
   * inside. Anything a primitive adds beyond the AABB is an enrichment of a
   * shape iso.js already knows how to draw.
   *
   * Model axes are x = right, y = back, z = up; three-space is (x, z, -y).
   */
  var AXIS_TO_THREE = { x: 'x', y: 'z', z: 'y' };

  /* corners in, non-indexed triangles out. Winding is fixed per quad by
     testing each face normal against the direction it is supposed to face,
     rather than trusting a hand-written vertex table: a wedge's tapered
     faces don't keep the winding an axis-aligned table would assume. */
  function hexahedron(c) {
    var pos = [];
    function quad(a, b, d, e, outward) {
      var n = new THREE.Vector3().subVectors(b, a).cross(new THREE.Vector3().subVectors(d, a));
      if (n.dot(outward) < 0) { var t = b; b = e; e = t; }
      [a, b, d, a, d, e].forEach(function (p) { pos.push(p.x, p.y, p.z); });
    }
    /* c is indexed by model-axis bits (1 = x, 2 = y, 4 = z) while the points
       themselves are already in three-space, so each face's outward hint is
       its model axis mapped through (x, y, z) -> (x, z, -y). */
    var mx = new THREE.Vector3(1, 0, 0);    // model +x
    var my = new THREE.Vector3(0, 0, -1);   // model +y
    var mz = new THREE.Vector3(0, 1, 0);    // model +z
    quad(c[1], c[3], c[7], c[5], mx);
    quad(c[0], c[2], c[6], c[4], mx.clone().negate());
    quad(c[2], c[3], c[7], c[6], my);
    quad(c[0], c[1], c[5], c[4], my.clone().negate());
    quad(c[4], c[5], c[7], c[6], mz);
    quad(c[0], c[1], c[3], c[2], mz.clone().negate());

    var g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.computeVertexNormals();   // non-indexed, so this gives flat per-face normals
    return g;
  }

  /* rounded rectangle extruded along model z: the shape a laptop chassis,
     a lid or a battery block actually has, and the one thing a plain box
     cannot fake at this scale */
  function roundedGeom(size, r, bevel) {
    var w = size.x, d = size.z, h = size.y;
    r = Math.min(r, w / 2 - 0.01, d / 2 - 0.01);
    bevel = Math.min(bevel == null ? Math.min(h / 4, r / 2) : bevel, h / 2 - 0.01);
    var s = new THREE.Shape();
    var hw = w / 2 - r, hd = d / 2 - r;
    s.absarc(hw, hd, r, 0, Math.PI / 2, false);
    s.absarc(-hw, hd, r, Math.PI / 2, Math.PI, false);
    s.absarc(-hw, -hd, r, Math.PI, Math.PI * 1.5, false);
    s.absarc(hw, -hd, r, Math.PI * 1.5, Math.PI * 2, false);
    var useBevel = bevel > 0.02;
    var g = new THREE.ExtrudeGeometry(s, {
      depth: Math.max(h - (useBevel ? bevel * 2 : 0), 0.01),
      bevelEnabled: useBevel, bevelSize: bevel, bevelThickness: bevel,
      bevelSegments: 2, curveSegments: 6, steps: 1
    });
    g.rotateX(-Math.PI / 2);          // shape plane (x, y) -> model (x, y), extrude -> up
    g.center();
    return g;
  }

  /* a box whose far face along `axis` is scaled by taper and shifted by
     sweep: enough for a swept, tapered wing or a tail cone. `center` is the
     three-space centre of the box's AABB, which the returned points are
     relative to, since the mesh itself carries that offset. */
  function wedgeGeom(b, center) {
    var a = b.axis || 'y';
    var t = b.taper || [1, 1];
    var tp = (typeof t === 'number') ? [t, t] : t;
    var sweep = b.sweep || [0, 0];
    var sw = (typeof sweep === 'number') ? [sweep, 0] : sweep;
    var mLo = new THREE.Vector3(b.x[0], b.y[0], b.z[0]);
    var mHi = new THREE.Vector3(b.x[1], b.y[1], b.z[1]);
    var order = ['x', 'y', 'z'];
    var ai = order.indexOf(a);
    var cross = order.filter(function (k) { return k !== a; });
    var mc = new THREE.Vector3().addVectors(mLo, mHi).multiplyScalar(0.5);

    /* `at` names which end of the axis narrows: 'max' (the default) for a
       tail cone or a starboard wing, 'min' for a nose cone or a port wing.
       Without it every mirrored pair has to be written with its extents
       reversed, which is both unreadable and easy to get backwards, as
       the first pass at this aircraft demonstrated. */
    var far = (b.at === 'min') ? 0 : 1;

    var pts = [];
    for (var i = 0; i < 8; i++) {
      var bits = [i & 1 ? 1 : 0, i & 2 ? 1 : 0, i & 4 ? 1 : 0];
      var p = { x: bits[0] ? mHi.x : mLo.x, y: bits[1] ? mHi.y : mLo.y, z: bits[2] ? mHi.z : mLo.z };
      if (bits[ai] === far) {
        cross.forEach(function (k, j) {
          p[k] = mc[k] + (p[k] - mc[k]) * tp[j] + sw[j];
        });
      }
      pts.push(toThree(p.x, p.y, p.z).sub(center));
    }
    return hexahedron(pts);
  }

  /* Returns { geo, scale } in three-space for one primitive. `scale` is
     applied on the mesh rather than baked in, so a shared unit geometry
     stays cheap and EdgesGeometry still reads the right silhouette. */
  function primitive(b) {
    var lo = toThree(b.x[0], b.y[0], b.z[0]);
    var hi = toThree(b.x[1], b.y[1], b.z[1]);
    var min = new THREE.Vector3(Math.min(lo.x, hi.x), Math.min(lo.y, hi.y), Math.min(lo.z, hi.z));
    var max = new THREE.Vector3(Math.max(lo.x, hi.x), Math.max(lo.y, hi.y), Math.max(lo.z, hi.z));
    var size = max.clone().sub(min);
    var center = min.clone().add(max).multiplyScalar(0.5);
    size.set(Math.max(size.x, 0.01), Math.max(size.y, 0.01), Math.max(size.z, 0.01));

    var shape = b.shape || 'box';
    var geo, scale = new THREE.Vector3(1, 1, 1);

    if (shape === 'cyl') {
      var ax = AXIS_TO_THREE[b.axis || 'z'];
      var r2 = b.r2 == null ? 1 : b.r2;
      /* r2 is the radius factor at the narrow end, and `at` says which end
         that is: same convention as the wedge, so a mirrored pair reads
         the same way whichever primitive it is built from */
      geo = (b.at === 'min')
        ? new THREE.CylinderGeometry(1, r2, 1, b.seg || 24, 1, !!b.open)
        : new THREE.CylinderGeometry(r2, 1, 1, b.seg || 24, 1, !!b.open);
      /* built along +Y; rotate so that "top" lands on the *max* end of the
         requested model axis */
      if (b.axis === 'x') geo.rotateZ(-Math.PI / 2);
      else if (b.axis === 'y') geo.rotateX(-Math.PI / 2);
      scale.set(ax === 'x' ? size.x : size.x / 2,
                ax === 'y' ? size.y : size.y / 2,
                ax === 'z' ? size.z : size.z / 2);

    } else if (shape === 'wedge') {
      geo = wedgeGeom(b, center);

    } else if (shape === 'round') {
      geo = roundedGeom(size, b.r == null ? Math.min(size.x, size.z) * 0.12 : b.r, b.bevel);

    } else {
      geo = new THREE.BoxGeometry(size.x, size.y, size.z);
    }

    return { geo: geo, scale: scale, center: center };
  }

  /* ---------- build ---------- */

  function buildScene(host, key) {
    var model = TD.models[key];
    var view = viewOf(model);
    var W = host.clientWidth || 600, H = host.clientHeight || Math.round(W * 0.62);

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(36, W / H, 1, 100000);
    /* preserveDrawingBuffer, because this scene renders on demand rather than
       in a continuous loop. Without it the browser may discard the buffer
       after presenting a frame, and any later recomposite that isn't preceded
       by a fresh draw shows an empty canvas, which is what left the laptop
       blank at the viewport widths where no resize happened to land late.
       The cost is negligible for a static scene that draws a few times a
       second at most. */
    var renderer = new THREE.WebGLRenderer({
      antialias: true, alpha: true, preserveDrawingBuffer: true
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    /* updateStyle = false: three.js otherwise writes an explicit px width and
       height onto the canvas element. The board sizes itself from an
       aspect-ratio and a max-height, so that write feeds straight back into
       the element the ResizeObserver is watching: the observer loops, the
       browser drops the undelivered notification, and the canvas is left
       cleared with no render behind it. Letting CSS size the canvas breaks
       the cycle. */
    renderer.setSize(W, H, false);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    /* Colour management. Without these two lines r147 renders in legacy mode:
       hex colours are pushed straight down the pipe as if they were already
       linear, which is why every model read flat and chalky regardless of
       how the lights were tuned. Both are feature-detected because they are
       the parts of the three.js API most likely to move under a version
       bump, and a missing one should cost colour accuracy, not the view. */
    if (THREE.ColorManagement && 'legacyMode' in THREE.ColorManagement) {
      THREE.ColorManagement.legacyMode = false;
    }
    if ('outputEncoding' in renderer && THREE.sRGBEncoding !== undefined) {
      renderer.outputEncoding = THREE.sRGBEncoding;
    }
    if (THREE.ACESFilmicToneMapping !== undefined) {
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = view.exposure * themeOf().exposureScale;
    }
    renderer.domElement.style.display = 'block';
    renderer.domElement.setAttribute('tabindex', '0');
    renderer.domElement.setAttribute('role', 'application');
    renderer.domElement.setAttribute('aria-label', 'Interactive 3D model. Drag to orbit, scroll to zoom.');
    host.innerHTML = '';
    host.appendChild(renderer.domElement);

    var readout = document.createElement('div');
    readout.className = 'td-readout';
    readout.hidden = true;
    host.appendChild(readout);

    /* Three-point rig. Key reads the form, fill stops shadow-side faces
       going dead, and the rim is what separates a pale model (an airframe,
       a white appliance) from a pale background: the single biggest reason
       the aircraft used to disappear into the page. */
    var L = view.light;
    var directionals = [];
    /* the aim is kept on the light and the position derived from it once the
       model's extent is known, below: a direction is meaningful before the
       bounds exist, a position is not */
    function directional(color, intensity, x, y, z) {
      var light = new THREE.DirectionalLight(color, intensity * L);
      light.userData.aim = toThree(x, y, z).normalize();
      scene.add(light);
      directionals.push(light);
      return light;
    }

    var TH = themeOf();
    var ambient = new THREE.AmbientLight(TH.ambient, TH.ambientI * L);
    scene.add(ambient);
    /* the key sits high rather than off to one side: a low sun threw a hard
       shadow half the width of the frame that read as a second object */
    var dir = directional(TH.key, TH.keyI, -0.34, -0.42, 1.10);
    dir.castShadow = true;
    dir.shadow.mapSize.set(2048, 2048);
    dir.shadow.bias = -0.0012;
    dir.shadow.normalBias = 0.6;
    dir.shadow.radius = 3;

    var fillLight = directional(TH.fill, TH.fillI, 0.62, 0.34, -0.28);
    /* On dark the rim does most of the work: it is what puts a bright edge
       on a near-black console so it does not merge into a near-black page. */
    var rimLight = directional(TH.rim, TH.rimI, 0.15, 0.95, -0.35);

    var hemi = new THREE.HemisphereLight(TH.hemiSky, TH.hemiGround, TH.hemiI * L);
    scene.add(hemi);

    var controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !reduceMotion;
    controls.dampingFactor = 0.12;
    controls.minDistance = 1;
    controls.maxDistance = 100000;
    controls.minPolarAngle = 0.001;
    controls.maxPolarAngle = Math.PI - 0.001;
    controls.zoomSpeed = 0.9;
    controls.keys = { LEFT: 'ArrowLeft', UP: 'ArrowUp', RIGHT: 'ArrowRight', BOTTOM: 'ArrowDown' };
    controls.listenToKeyEvents(renderer.domElement);

    var state = {
      host: host, key: key, model: model, view: view,
      scene: scene, camera: camera, renderer: renderer, controls: controls,
      raycaster: new THREE.Raycaster(), mouse: new THREE.Vector2(), readout: readout,
      parts: {}, pickables: [], materials: [], geometries: [],
      lights: { ambient: ambient, key: dir, fill: fillLight, rim: rimLight, hemi: hemi },
      outlineMat: new THREE.MeshBasicMaterial({ color: TH.select, side: THREE.BackSide, depthWrite: true }),
      edgeMat: new THREE.LineBasicMaterial({ color: TH.edge, transparent: true,
                                             opacity: view.edges * TH.edgeOpacity }),
      /* the selected part's own edges, drawn with the depth test off so the
         silhouette reads through whatever is in front of it. Fading the
         shell alone was not enough: an opaque part sitting under two
         translucent layers still washes out, and you could not tell where
         the battery you just clicked actually was. */
      edgeSelMat: new THREE.LineBasicMaterial({ color: TH.select, depthTest: false,
                                                transparent: true, opacity: TH.selectOpacity }),
      outlines: {},
      center: new THREE.Vector3(), radius: 1,
      opts: {}, hoverId: null, resizeObserver: null,
      lastClick: { id: null, t: 0 }, down: null
    };

    buildParts(state);

    /* background treatment is a CSS class rather than a scene.background, so
       the canvas stays alpha-transparent and the page's own light identity
       shows through instead of a WebGL-painted rectangle that would ignore
       the site's palette */
    host.classList.remove('bg-studio', 'bg-sky', 'bg-plain');
    host.classList.add('bg-' + view.background);

    /* a DirectionalLight aims at world origin unless .target is placed and
       added to the scene: several models here (the AI server rack, for
       one) aren't centred anywhere near the origin, so without this both
       the shading direction and the shadow frustum below would be aimed at
       empty space instead of the actual model */
    directionals.forEach(function (light) {
      light.position.copy(state.center).addScaledVector(light.userData.aim, state.radius * 6);
      light.target.position.copy(state.center);
      scene.add(light.target);
    });

    var sc = dir.shadow.camera;
    sc.left = -state.radius * 1.35; sc.right = state.radius * 1.35;
    sc.top = state.radius * 1.35; sc.bottom = -state.radius * 1.35;
    sc.near = state.radius * 0.1; sc.far = state.radius * 8;
    sc.updateProjectionMatrix();

    /* ShadowMaterial renders nothing but the shadow it receives, an
       invisible floor rather than a visible grey slab, so the model reads
       as grounded without adding geometry that competes with the parts */
    if (view.ground !== 'none') {
      var groundSize = state.radius * 8;
      var ground = new THREE.Mesh(
        new THREE.PlaneGeometry(groundSize, groundSize),
        /* a contact shadow is much weaker against a dark ground than a light
           one, so the same opacity reads as nothing: the theme scales it */
        new THREE.ShadowMaterial({ opacity: view.shadow * TH.shadowScale })
      );
      ground.rotation.x = -Math.PI / 2;
      /* a hair below the model's true base avoids z-fighting between the
         floor and whatever box happens to sit exactly on it */
      ground.position.set(state.center.x, state.floorY - state.radius * 0.01, state.center.z);
      ground.receiveShadow = true;
      scene.add(ground);
      state.ground = ground;
    }

    controls.target.copy(state.target);
    setView(state, 'default');
    settle(state);

    controls.addEventListener('change', function () { renderFrame(state); });
    /* until the viewer has actually moved the camera, a resize should
       re-frame rather than keep a fit computed against a stale aspect,
       the host is often measured at zero width on first paint */
    controls.addEventListener('start', function () { state.userMoved = true; });

    wireInteraction(state);

    if (window.ResizeObserver) {
      state.resizeObserver = new ResizeObserver(function () { resize(state); });
      state.resizeObserver.observe(host);
    }

    host.__td3 = state;
    return state;
  }

  /* Two passes, matching iso.js's prepare(): the explode direction for a
     part with no explicit `dir` is radial from the *model's* centre, biased
     upward, so pass 1 has to know that centre: computed in data space,
     as a per-box average over every box in every part, before pass 2 can
     compute any part's direction. */
  /* Framing has to know where a hinged part can travel, not just where it
     starts. The bounds were previously taken from unrotated geometry, so an
     open laptop lid, which is how the model is first presented, swung
     straight out of the top of the frame and the whole device rendered
     cropped. Sampling the lid across its full travel gives one stable
     framing that holds at any hinge angle, the same trade iso.js already
     makes when it samples yaw. */
  var LID_SAMPLES = [0, -0.6, -1.2, -1.83, -2.01];
  /* the angle a lid is actually presented at, matching the app's initial
     state: used to aim the camera, while LID_SAMPLES sizes the framing */
  var LID_DEFAULT = -1.83;

  function expandBounds(bounds, b, part, model, angles) {
    var hinged = !!(part.hinged && model.lid);
    angles = hinged ? angles : [0];
    for (var a = 0; a < angles.length; a++) {
      var ca = Math.cos(angles[a]), sa = Math.sin(angles[a]);
      for (var i = 0; i < 8; i++) {
        var x = (i & 1) ? b.x[1] : b.x[0];
        var y = (i & 2) ? b.y[1] : b.y[0];
        var z = (i & 4) ? b.z[1] : b.z[0];
        if (hinged) {
          var dy = y - model.lid.axisY, dz = z - model.lid.axisZ;
          var ry = model.lid.axisY + dy * ca - dz * sa;
          var rz = model.lid.axisZ + dy * sa + dz * ca;
          y = ry; z = rz;
        }
        bounds.expandByPoint(toThree(x, y, z));
      }
    }
  }

  function buildParts(state) {
    var model = state.model;
    /* Two boxes, because framing and aiming want different answers. `bounds`
       spans the lid's whole travel so the framing is stable at any hinge
       angle; `poseBounds` is the device as first presented. Aiming at the
       swept union put the camera's centre well above an open laptop, which
       is why the model sat low in the frame with dead space over it. */
    var bounds = new THREE.Box3();
    var poseBounds = new THREE.Box3();

    var cx = 0, cy = 0, cz = 0, n = 0;
    model.parts.forEach(function (part) {
      part.boxes.forEach(function (b) {
        cx += (b.x[0] + b.x[1]) / 2; cy += (b.y[0] + b.y[1]) / 2; cz += (b.z[0] + b.z[1]) / 2;
        n++;
      });
    });
    cx /= n; cy /= n; cz /= n;

    var contrast = state.view.contrast;
    model.parts.forEach(function (part) {
      var mat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(part.color || '#8593a4'),
        roughness: Math.max(0.08, Math.min(1, (part.rough == null ? 0.55 : part.rough) / contrast)),
        metalness: Math.min(1, (part.metal == null ? 0.08 : part.metal) * contrast)
      });
      state.materials.push(mat);

      var pivot;
      if (part.hinged && model.lid) {
        pivot = toThree(0, model.lid.axisY, model.lid.axisZ);
      } else {
        pivot = new THREE.Vector3(0, 0, 0);
      }

      var group = new THREE.Group();
      group.userData.node = part.node;
      group.position.copy(pivot);

      var pcx = 0, pcy = 0, pcz = 0;
      var meshList = [], edgeList = [];
      part.boxes.forEach(function (b) {
        var prim = primitive(b);
        var geo = prim.geo, center = prim.center;
        state.geometries.push(geo);

        var mesh = new THREE.Mesh(geo, mat);
        mesh.position.copy(center.clone().sub(pivot));
        mesh.scale.copy(prim.scale);
        mesh.userData.node = part.node;
        mesh.userData.baseColor = mat.color.clone();
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        group.add(mesh);
        state.pickables.push(mesh);
        meshList.push(mesh);

        /* Edge outlines. On a model made of flat-shaded solids under soft
           light, two adjacent faces at a shallow angle read as one surface,
           this is what made the laptop deck and the fuselage look like
           featureless slabs. A hairline on genuine creases only (30°+)
           restores the silhouette without drawing a wireframe. */
        if (state.view.edges > 0) {
          var eg = new THREE.EdgesGeometry(geo, 30);
          state.geometries.push(eg);
          var line = new THREE.LineSegments(eg, state.edgeMat);
          line.position.copy(mesh.position);
          line.scale.copy(prim.scale);
          group.add(line);
          edgeList.push(line);
        }

        /* selection outline: a slightly larger, back-face-only copy of the
           same geometry in one fixed colour. Never touches the part's own
           material, so the highlight looks identical regardless of what
           colour the part itself is: the alternative (tinting the part's
           own colour) is what produced the "weird colours on click" bug */
        var outline = new THREE.Mesh(geo, state.outlineMat);
        outline.position.copy(mesh.position);
        outline.scale.copy(prim.scale).multiplyScalar(1.035);
        outline.visible = false;
        group.add(outline);
        (state.outlines[part.node] || (state.outlines[part.node] = [])).push(outline);

        expandBounds(bounds, b, part, model, LID_SAMPLES);
        expandBounds(poseBounds, b, part, model, [LID_DEFAULT]);

        pcx += (b.x[0] + b.x[1]) / 2; pcy += (b.y[0] + b.y[1]) / 2; pcz += (b.z[0] + b.z[1]) / 2;
      });
      pcx /= part.boxes.length; pcy /= part.boxes.length; pcz /= part.boxes.length;

      var dirVec;
      if (part.dir) {
        dirVec = toThree(part.dir[0], part.dir[1], part.dir[2]).normalize();
      } else {
        /* still in data space here: x/y damped, z (up) boosted and biased
           upward, exactly mirroring iso.js's prepare(), then converted */
        var rx = pcx - cx, ry = pcy - cy, rz = pcz - cz;
        dirVec = toThree(rx * 0.45, ry * 0.45, rz * 1.6 + 12).normalize();
      }

      state.parts[part.node] = {
        group: group, meshes: meshList, edges: edgeList, basePos: pivot.clone(),
        dir: dirVec, spread: (part.spread || 1) * (model.spread || 46),
        hinged: !!(part.hinged && model.lid), shell: !!part.shell
      };
      state.scene.add(group);
    });

    bounds.getCenter(state.center);
    state.radius = Math.max(bounds.getSize(new THREE.Vector3()).length() / 2, 10);
    state.floorY = bounds.min.y;
    state.poseCenter = poseBounds.isEmpty() ? state.center.clone()
                                            : poseBounds.getCenter(new THREE.Vector3());

    /* an explicit target lets a model point the camera at the part that
       matters (an aircraft reads better aimed at the wing root than at the
       centroid of a 70 m tube); default is the geometric centre */
    var t = state.view.target;
    state.target = (t && t.length === 3) ? toThree(t[0], t[1], t[2]) : state.poseCenter.clone();
  }

  /* ---------- per-frame state: explode, hinge, selection, isolate, X-ray ---------- */

  function frame(state) {
    var o = state.opts;
    var explode = o.explode || 0;
    var lid = o.lidAngle || 0;

    Object.keys(state.parts).forEach(function (id) {
      var p = state.parts[id];
      p.group.position.copy(p.basePos).addScaledVector(p.dir, explode * p.spread);
      if (p.hinged) p.group.rotation.x = lid;
    });

    applyVisualState(state);
    syncReadout(state);
    renderFrame(state);
  }

  function applyVisualState(state) {
    var sel = state.opts.selectedId;
    var isolate = !!(state.opts.isolate && sel);
    var xray = !!state.opts.xray;
    Object.keys(state.parts).forEach(function (id) {
      var p = state.parts[id];
      var isSel = id === sel;
      var isHov = id === state.hoverId;
      var visible = !isolate || isSel;

      /* X-ray fades the shell(s), parts explicitly marked `shell:true` in
         the model, and leaves everything else at full opacity, so it
         actually reveals internals rather than uniformly washing out the
         whole model (which reads as "nothing happened" since there's no
         longer any contrast between what's hidden and what isn't). Devices
         with no shell-marked part simply have nothing for X-ray to peel
         back: an honest structural fact, not a bug. */
      /* Selecting a part used to fade everything else uniformly to 0.4,
         which turned the whole model to fog and still left an internal part
         buried behind a translucent shell. Fading the shell hard and the
         internals only slightly peels the case off the selected part
         instead, so picking the battery actually shows you the battery. */
      var op = 1;
      if (xray && p.shell && !isSel) op = 0.10;
      else if (sel && !isSel && !isolate) op = p.shell ? 0.10 : 0.45;

      p.meshes.forEach(function (m) {
        m.visible = visible;
        var mat = m.material;
        mat.opacity = op;
        mat.transparent = op < 1;
        /* a transparent mesh that still writes depth blocks the depth test
           for anything behind it, so it never draws at all: the classic
           three.js "why can't I see through it" trap. Depth writing is
           only safe to leave on for fully opaque meshes. */
        mat.depthWrite = op >= 1;
        mat.color.copy(m.userData.baseColor);
        /* selection no longer tints the part's own material at all; see
           the outline mesh below, hover keeps a small neutral (colourless)
           brightness lift, which can't clash with any base colour */
        if (isHov && !isSel) { mat.emissive.setRGB(0.09, 0.09, 0.09); mat.emissiveIntensity = 0.35; }
        else { mat.emissiveIntensity = 0; }
      });

      /* edges follow their part's visibility and fade with it, or a
         dimmed part's outline stays at full strength and reads as the
         *most* prominent thing on screen. The selected part is the
         exception: its edges go to the always-on-top material. */
      (p.edges || []).forEach(function (e) {
        e.visible = isSel || (visible && op > 0.25);
        e.material = isSel ? state.edgeSelMat : state.edgeMat;
        e.renderOrder = isSel ? 5 : 0;
      });

      (state.outlines[id] || []).forEach(function (o) { o.visible = isSel; });
    });
  }

  /* Renders are coalesced onto an animation frame rather than run inline.
     This scene only draws on demand, and a draw issued outside the frame
     lifecycle can have its buffer discarded before the compositor ever
     presents it, which is exactly what left the laptop's canvas blank at
     viewport widths where a resize landed after the last inline render.
     Doing it here also collapses the burst of renders an orbit drag fires
     into one per frame. */
  function renderFrame(state) {
    if (state.disposed || state.rafId) return;
    state.rafId = requestAnimationFrame(function () {
      state.rafId = 0;
      if (state.disposed) return;
      state.renderer.render(state.scene, state.camera);
      if (performance.now() < state.settleUntil) renderFrame(state);
    });
  }

  /* Keep redrawing for a bounded window after the scene is built or resized.
     This scene draws on demand, and one inline draw at build time is not
     always the frame that ends up on screen: the laptop at a 980px viewport
     reproducibly finished with a correct scene, a correct camera and an
     empty canvas, which any single later render fixed. The precise trigger
     was not pinned down: the model's own build cost (it is the only one
     using extruded rounded solids) shifts when its last frame lands relative
     to layout. Redrawing across the settling window covers every case
     measured (9 models x 3 viewport widths) and is bounded, so a static
     scene never turns into a render loop. */
  function settle(state) {
    state.settleUntil = performance.now() + 1500;
    renderFrame(state);
  }

  /* ---------- camera presets ---------- */

  /* 'default' is whatever the model's own view config asks for, falling
     back to the isometric preset. Named presets stay available and a model
     may add its own through view.presets. */
  /* Distance is solved from the bounding sphere and the *narrower* of the
     two field-of-view angles, not from a fixed multiple of the radius. The
     stage is a wide, short box, so a vertical fov alone framed the laptop
     off the bottom of the canvas at every desktop size, which is what was
     actually cropping the model, not the camera angle. */
  function fitDistance(state) {
    var cam = state.camera;
    var fovV = cam.fov * Math.PI / 180;
    var fovH = 2 * Math.atan(Math.tan(fovV / 2) * cam.aspect);
    var half = Math.min(fovV, fovH) / 2;
    return state.radius / Math.max(Math.sin(half), 0.05) * (state.view.distance || 1);
  }

  function setView(state, key) {
    var v = state.view;
    var d = (key === 'default') ? v.camera
          : (v.presets && v.presets[key]) || PRESETS[key] || v.camera;
    var dist = fitDistance(state);
    var dir = new THREE.Vector3(d[0], d[1], d[2]).normalize();
    state.camera.position.copy(state.target).addScaledVector(dir, dist);
    state.controls.target.copy(state.target);
    state.camera.near = Math.max(dist / 200, 0.1);
    state.camera.far = dist * 50;
    state.camera.updateProjectionMatrix();
    state.controls.update();
    renderFrame(state);
  }
  TD.threeSetView = function (host, key) { if (host.__td3) setView(host.__td3, key); };
  TD.threeResetView = function (host) { if (host.__td3) setView(host.__td3, 'default'); };

  /* Re-themes a live scene in place. Rebuilding it would be simpler but
     would throw away the camera, the explode state and the selection, so
     this mutates only what the theme actually decides: the lights, the
     crease and selection colours, and the contact shadow. Part colours are
     never touched, because they describe the object, not the page. */
  TD.threeSetTheme = function (host, theme) {
    var state = host && host.__td3;
    if (!state) return;
    var TH = (theme === 'dark') ? THEME.dark : THEME.light;
    var L = state.view.light;
    var li = state.lights;

    li.ambient.color.set(TH.ambient); li.ambient.intensity = TH.ambientI * L;
    li.key.color.set(TH.key);         li.key.intensity = TH.keyI * L;
    li.fill.color.set(TH.fill);       li.fill.intensity = TH.fillI * L;
    li.rim.color.set(TH.rim);         li.rim.intensity = TH.rimI * L;
    li.hemi.color.set(TH.hemiSky);    li.hemi.groundColor.set(TH.hemiGround);
    li.hemi.intensity = TH.hemiI * L;

    state.edgeMat.color.set(TH.edge);
    state.edgeMat.opacity = state.view.edges * TH.edgeOpacity;
    state.outlineMat.color.set(TH.select);
    state.edgeSelMat.color.set(TH.select);
    state.edgeSelMat.opacity = TH.selectOpacity;
    if (state.ground) state.ground.material.opacity = state.view.shadow * TH.shadowScale;
    if (THREE.ACESFilmicToneMapping !== undefined) {
      state.renderer.toneMappingExposure = state.view.exposure * TH.exposureScale;
    }

    settle(state);
  };

  /* Drives the hover state from outside the canvas, so the part index list
     beside the model can light up the solid it names. Same code path as a
     real pointer hover, so the two can never disagree. */
  TD.threeHighlight = function (host, id) {
    var state = host && host.__td3;
    if (!state || state.hoverId === id) return;
    state.hoverId = (id && state.parts[id]) ? id : null;
    applyVisualState(state);
    syncReadout(state);
    renderFrame(state);
  };

  /* ---------- readout ----------
   * A part you can see but cannot name is not really visible. Hover only
   * changed the cursor before, which left every faded X-ray shell and every
   * small internal solid unidentifiable. This names whatever is under the
   * pointer, and falls back to naming the selection when the pointer is
   * away, so the canvas always says what you are looking at.
   */
  function syncReadout(state) {
    var el = state.readout;
    if (!el) return;
    var id = state.hoverId || state.opts.selectedId;
    if (!id) { el.hidden = true; el.textContent = ''; return; }
    var node = state.opts.nodeOf ? state.opts.nodeOf(id) : null;
    el.hidden = false;
    el.textContent = node ? (node.name || id) : id;
    el.classList.toggle('is-sel', !state.hoverId);
  }

  /* ---------- interaction ---------- */

  function pick(state, clientX, clientY) {
    var rect = state.renderer.domElement.getBoundingClientRect();
    state.mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    state.mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;
    state.raycaster.setFromCamera(state.mouse, state.camera);
    var visible = state.pickables.filter(function (m) { return m.visible; });
    var hits = state.raycaster.intersectObjects(visible, false);
    return hits.length ? hits[0].object.userData.node : null;
  }

  function wireInteraction(state) {
    var el = state.renderer.domElement;

    el.addEventListener('pointerdown', function (e) {
      state.down = { x: e.clientX, y: e.clientY, t: Date.now() };
    });
    el.addEventListener('pointerup', function (e) {
      var d = state.down; state.down = null;
      if (!d) return;
      var moved = Math.hypot(e.clientX - d.x, e.clientY - d.y) > 5;
      if (moved || Date.now() - d.t > 600 || e.button !== 0) return;
      var id = pick(state, e.clientX, e.clientY);
      if (!id) return;
      var now = Date.now();
      if (state.lastClick.id === id && now - state.lastClick.t < 350) {
        state.lastClick.id = null;
        if (state.opts.onOpen) state.opts.onOpen(id);
      } else {
        state.lastClick = { id: id, t: now };
        if (state.opts.onSelect) state.opts.onSelect(id);
      }
    });

    var hoverPending = false;
    el.addEventListener('pointermove', function (e) {
      if (hoverPending) return;
      hoverPending = true;
      requestAnimationFrame(function () {
        hoverPending = false;
        var id = pick(state, e.clientX, e.clientY);
        if (id !== state.hoverId) {
          state.hoverId = id;
          applyVisualState(state);
          renderFrame(state);
          el.style.cursor = id ? 'pointer' : '';
          syncReadout(state);
        }
      });
    });
    el.addEventListener('pointerleave', function () {
      if (state.hoverId) {
        state.hoverId = null; applyVisualState(state); renderFrame(state); syncReadout(state);
      }
    });
  }

  function resize(state) {
    var w = state.host.clientWidth, h = state.host.clientHeight || Math.round(w * 0.62);
    if (w <= 0 || h <= 0) return;
    state.camera.aspect = w / h;
    state.camera.updateProjectionMatrix();
    state.renderer.setSize(w, h, false);
    if (!state.userMoved) setView(state, 'default');
    settle(state);
  }

  /* ---------- public entry point (mirrors TD.renderIso's calling convention) ---------- */

  /**
   * TD.renderThree(host, modelKey, opts)
   * opts: { explode, lidAngle, selectedId, isolate, xray, nodeOf, onSelect, onOpen }
   */
  TD.renderThree = function (host, key, o) {
    var state = host.__td3;
    if (state && state.key !== key) { TD.disposeThree(host); state = null; }
    if (!state) state = buildScene(host, key);
    state.opts = o;
    frame(state);
  };

  TD.disposeThree = function (host) {
    var state = host.__td3;
    if (!state) return;
    /* a render scheduled but not yet run would fire against a disposed
       renderer, so the flag is set before anything is torn down */
    state.disposed = true;
    if (state.rafId) { cancelAnimationFrame(state.rafId); state.rafId = 0; }
    if (state.resizeObserver) state.resizeObserver.disconnect();
    state.controls.dispose();
    /* geometries are tracked on the state rather than walked off the
       pickables, because outlines and edge lines share or derive from the
       same buffers and would otherwise be disposed twice or not at all */
    state.geometries.forEach(function (g) { g.dispose(); });
    state.materials.forEach(function (m) { m.dispose(); });
    state.outlineMat.dispose();
    state.edgeMat.dispose();
    state.edgeSelMat.dispose();
    if (state.ground) { state.ground.geometry.dispose(); state.ground.material.dispose(); }
    /* renderer.dispose() releases three.js's own caches but NOT the WebGL
       context itself, so every device visited leaked one until the browser
       hit its context cap and started force-losing the oldest, which then
       threw "object does not belong to this context" on the next teardown.
       forceContextLoss is the documented way to actually hand it back. */
    state.renderer.dispose();
    if (state.renderer.forceContextLoss) {
      try { state.renderer.forceContextLoss(); } catch (e) { /* already lost */ }
    }
    if (state.renderer.domElement.parentNode) state.renderer.domElement.parentNode.removeChild(state.renderer.domElement);
    host.__td3 = null;
  };

})(window.TD);
