/* WebGL scenes, written directly against three.js (no React renderer, no model files:
   everything is built from primitives). Loaded on demand by Scene3D.jsx.
     "cluster" — glossy connectors that gather together and scatter from the pointer
     "laptop"  — a detailed floating laptop that opens and turns toward the pointer
     "hexes"   — six hexagonal tiles orbiting a core (Solutions)
     "windows" — layered interface windows that fan apart with the pointer (Work)
     "rings"   — a core with orbiting rings and satellites (Insights, Contact) */
import {
  ACESFilmicToneMapping,
  AmbientLight,
  BoxGeometry,
  CanvasTexture,
  CircleGeometry,
  CylinderGeometry,
  DirectionalLight,
  ExtrudeGeometry,
  Group,
  InstancedMesh,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  Object3D,
  PerspectiveCamera,
  Plane,
  PlaneGeometry,
  PMREMGenerator,
  Raycaster,
  Scene,
  Shape,
  ShapeGeometry,
  SphereGeometry,
  SRGBColorSpace,
  TorusGeometry,
  Vector2,
  Vector3,
  WebGLRenderer,
} from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

const WHITE = 0xf3f6fa;
const NAVY = 0x10243a;
const BLUE = 0x1677ff;
const CYAN = 0x00c8f0;
const VIOLET = 0x7c5cff;

const gloss = (color, extra) => new MeshPhysicalMaterial({ color, roughness: 0.22, metalness: 0.1, clearcoat: 1, clearcoatRoughness: 0.15, ...extra });
const rnd = (n) => (Math.random() - 0.5) * n;
/** Frame-rate independent easing factor. */
const ease = (dt, rest = 0.03) => 1 - Math.pow(rest, dt);

function roundedRect(w, h, r) {
  const x = -w / 2;
  const y = -h / 2;
  const s = new Shape();
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r);
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h);
  s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r);
  s.quadraticCurveTo(x, y, x + r, y);
  return s;
}

/** A plate with rounded corners and softly bevelled edges, centred on the origin (thickness along z). */
function slab(w, h, t, r) {
  const b = Math.min(0.03, t / 3);
  const geo = new ExtrudeGeometry(roundedRect(w - 2 * b, h - 2 * b, r), {
    depth: t - 2 * b,
    bevelEnabled: true,
    bevelThickness: b,
    bevelSize: b,
    bevelSegments: 3,
    curveSegments: 10,
  });
  return geo.center();
}

/* ---------- cluster ---------- */

function cluster(scene) {
  const mats = [gloss(WHITE), gloss(WHITE), gloss(NAVY, { metalness: 0.4 }), gloss(BLUE), gloss(CYAN), gloss(VIOLET)];
  const bar = new RoundedBoxGeometry(1.7, 0.5, 0.5, 4, 0.22);
  const ball = new SphereGeometry(0.42, 32, 16);

  const bodies = Array.from({ length: 13 }, (_, i) => {
    const group = new Group();
    if (i % 4 === 3) {
      group.add(new Mesh(ball, mats[3 + (i % 3)]));
    } else {
      // a "connector": three rounded bars crossing on the three axes
      const mat = mats[i % mats.length];
      const x = new Mesh(bar, mat);
      const y = new Mesh(bar, mat);
      const z = new Mesh(bar, mat);
      y.rotation.z = Math.PI / 2;
      z.rotation.y = Math.PI / 2;
      group.add(x, y, z);
    }
    const scale = i % 4 === 3 ? 1 : 0.62 + Math.random() * 0.4;
    group.scale.setScalar(scale);
    group.position.set(rnd(14), rnd(10), rnd(4));
    group.rotation.set(rnd(6), rnd(6), rnd(6));
    scene.add(group);
    return { group, vel: new Vector3(), spin: new Vector3(rnd(0.8), rnd(0.8), rnd(0.8)), r: (i % 4 === 3 ? 0.5 : 1.05) * scale };
  });

  const d = new Vector3();
  // ponytail: O(n²) pair repulsion over 13 bodies; swap in a physics engine if this ever needs real collisions
  return (dt, _t, pointer) => {
    for (const b of bodies) {
      const p = b.group.position;
      b.vel.addScaledVector(p, -2.2 * dt); // spring toward the centre
      d.copy(p).sub(pointer).setZ(0);
      const dist = d.length();
      if (dist < 3.2) b.vel.addScaledVector(d.normalize(), (3.2 - dist) * 26 * dt);
    }
    for (let i = 0; i < bodies.length; i++) {
      for (let j = i + 1; j < bodies.length; j++) {
        const a = bodies[i];
        const b = bodies[j];
        d.copy(a.group.position).sub(b.group.position);
        const overlap = a.r + b.r - d.length();
        if (overlap <= 0) continue;
        d.normalize().multiplyScalar(overlap * 22 * dt);
        a.vel.add(d);
        b.vel.sub(d);
      }
    }
    const damp = Math.pow(0.08, dt);
    for (const b of bodies) {
      b.vel.multiplyScalar(damp);
      b.group.position.addScaledVector(b.vel, dt);
      const speed = 0.25 + b.vel.length() * 0.35;
      b.group.rotation.x += b.spin.x * speed * dt;
      b.group.rotation.y += b.spin.y * speed * dt;
      b.group.rotation.z += b.spin.z * speed * dt;
    }
  };
}

/* ---------- canvas-drawn interface used on screens and windows ---------- */

function uiTexture(accent = "#00d4ff") {
  const c = document.createElement("canvas");
  c.width = 1024;
  c.height = 640;
  const g = c.getContext("2d");
  const box = (x, y, w, h, r, fill) => {
    g.fillStyle = fill;
    g.beginPath();
    g.roundRect(x, y, w, h, r);
    g.fill();
  };
  const bg = g.createLinearGradient(0, 0, 1024, 640);
  bg.addColorStop(0, "#0b1929");
  bg.addColorStop(1, "#1a3352");
  g.fillStyle = bg;
  g.fillRect(0, 0, 1024, 640);

  // title bar
  box(0, 0, 1024, 44, 0, "rgba(255,255,255,0.05)");
  ["#ff5f57", "#febc2e", "#28c840"].forEach((col, i) => {
    g.fillStyle = col;
    g.beginPath();
    g.arc(26 + i * 22, 22, 6.5, 0, Math.PI * 2);
    g.fill();
  });
  box(380, 12, 264, 20, 10, "rgba(255,255,255,0.1)");

  // sidebar
  box(20, 64, 190, 556, 16, "rgba(255,255,255,0.05)");
  g.fillStyle = accent;
  g.beginPath();
  g.arc(56, 104, 18, 0, Math.PI * 2);
  g.fill();
  box(86, 92, 96, 10, 5, "rgba(255,255,255,0.75)");
  box(86, 110, 62, 8, 4, "rgba(255,255,255,0.3)");
  box(36, 150, 158, 34, 10, "rgba(22,119,255,0.4)");
  [0, 1, 2, 3, 4].forEach((i) => {
    box(48, 162 + i * 46, 14, 10, 3, i === 0 ? "#fff" : "rgba(255,255,255,0.35)");
    box(72, 162 + i * 46, i % 2 ? 84 : 104, 10, 5, i === 0 ? "#fff" : "rgba(255,255,255,0.3)");
  });

  // stat cards
  [accent, "#1677ff", "#7c5cff"].forEach((col, i) => {
    const x = 230 + i * 262;
    box(x, 64, 246, 112, 16, "rgba(255,255,255,0.07)");
    box(x + 20, 84, 84, 9, 4.5, "rgba(255,255,255,0.4)");
    box(x + 20, 108, 120, 26, 8, "rgba(255,255,255,0.88)");
    box(x + 20, 148, 206, 6, 3, "rgba(255,255,255,0.12)");
    box(x + 20, 148, 90 + i * 40, 6, 3, col);
  });

  // line chart
  box(230, 196, 508, 424, 16, "rgba(255,255,255,0.06)");
  box(252, 218, 130, 10, 5, "rgba(255,255,255,0.6)");
  g.strokeStyle = "rgba(255,255,255,0.08)";
  g.lineWidth = 1;
  [300, 370, 440, 510, 580].forEach((y) => {
    g.beginPath();
    g.moveTo(252, y);
    g.lineTo(716, y);
    g.stroke();
  });
  const pts = [560, 520, 535, 470, 490, 410, 430, 350, 372, 300];
  const path = () => {
    g.beginPath();
    pts.forEach((y, i) => (i ? g.lineTo(252 + i * 51.5, y) : g.moveTo(252, y)));
  };
  path();
  g.lineTo(716, 590);
  g.lineTo(252, 590);
  const area = g.createLinearGradient(0, 300, 0, 590);
  area.addColorStop(0, "rgba(0,212,255,0.35)");
  area.addColorStop(1, "rgba(0,212,255,0)");
  g.fillStyle = area;
  g.fill();
  path();
  g.strokeStyle = accent;
  g.lineWidth = 4;
  g.lineJoin = "round";
  g.stroke();

  // bars + list
  box(754, 196, 250, 200, 16, "rgba(255,255,255,0.06)");
  [70, 120, 92, 150, 110].forEach((h, i) => {
    const grad = g.createLinearGradient(0, 376 - h, 0, 376);
    grad.addColorStop(0, i % 2 ? "#7c5cff" : accent);
    grad.addColorStop(1, "#1677ff");
    box(776 + i * 44, 376 - h, 28, h, 6, grad);
  });
  box(754, 412, 250, 208, 16, "rgba(255,255,255,0.06)");
  [0, 1, 2, 3].forEach((i) => {
    g.fillStyle = [accent, "#1677ff", "#7c5cff", "#28c840"][i];
    g.beginPath();
    g.arc(784, 446 + i * 44, 9, 0, Math.PI * 2);
    g.fill();
    box(806, 438 + i * 44, 110 + (i % 2) * 30, 9, 4.5, "rgba(255,255,255,0.6)");
    box(806, 453 + i * 44, 70, 6, 3, "rgba(255,255,255,0.22)");
  });

  const tex = new CanvasTexture(c);
  tex.colorSpace = SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

/** Soft round blob used as a fake contact shadow. */
function shadowTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const g = c.getContext("2d");
  const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grad.addColorStop(0, "rgba(16,36,58,0.42)");
  grad.addColorStop(1, "rgba(16,36,58,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, 128, 128);
  return new CanvasTexture(c);
}

/* ---------- laptop ---------- */

function laptop(scene) {
  const alu = new MeshPhysicalMaterial({ color: 0xcdd4dc, roughness: 0.36, metalness: 1, clearcoat: 0.25, clearcoatRoughness: 0.4 });
  const keyMat = new MeshPhysicalMaterial({ color: 0x17191d, roughness: 0.62, metalness: 0.1 });
  const wellMat = new MeshPhysicalMaterial({ color: 0x0b0c0f, roughness: 0.8 });
  const glassBlack = new MeshPhysicalMaterial({ color: 0x030405, roughness: 0.08, clearcoat: 1 });
  const flat = (geo) => geo.rotateX(-Math.PI / 2); // lay a z-facing shape down on the deck

  const body = new Group();
  const DECK = 0.066; // top surface of the base

  // unibody base, with a thumb scoop cut visually by a darker lip at the front edge
  body.add(new Mesh(flat(slab(4.3, 2.95, 0.13, 0.2)), alu));
  const lip = new Mesh(new BoxGeometry(0.72, 0.012, 0.05), wellMat);
  lip.position.set(0, DECK - 0.003, 1.44);
  body.add(lip);

  // keyboard: recessed well + individual keys
  const well = new Mesh(flat(new ShapeGeometry(roundedRect(3.86, 1.52, 0.07))), wellMat);
  well.position.set(0, DECK + 0.001, -0.5);
  body.add(well);

  const COLS = 14;
  const pitch = 3.72 / COLS;
  const keys = new InstancedMesh(new RoundedBoxGeometry(1, 1, 1, 2, 0.12), keyMat, 4 * COLS + 10);
  const dummy = new Object3D();
  let n = 0;
  const key = (col, row, span = 1) => {
    dummy.position.set((col + (span - 1) / 2 - (COLS - 1) / 2) * pitch, DECK + 0.012, -1.1 + row * 0.286);
    dummy.scale.set(pitch * span - 0.045, 0.03, 0.24);
    dummy.updateMatrix();
    keys.setMatrixAt(n++, dummy.matrix);
  };
  for (let row = 0; row < 4; row++) for (let col = 0; col < COLS; col++) key(col, row);
  for (let col = 0; col < 4; col++) key(col, 4);
  key(4, 4, 5); // space bar
  for (let col = 9; col < COLS; col++) key(col, 4);
  body.add(keys);

  const pad = new Mesh(flat(new ShapeGeometry(roundedRect(1.56, 0.92, 0.07))), new MeshPhysicalMaterial({ color: 0xbfc7d1, roughness: 0.18, metalness: 1, clearcoat: 0.6 }));
  pad.position.set(0, DECK + 0.001, 0.86);
  body.add(pad);

  // hinge barrel
  const barrel = new Mesh(new CylinderGeometry(0.062, 0.062, 3.3, 20), new MeshPhysicalMaterial({ color: 0x2a2e35, roughness: 0.4, metalness: 0.9 }));
  barrel.rotation.z = Math.PI / 2;
  barrel.position.set(0, DECK - 0.005, -1.45);
  body.add(barrel);

  // lid: aluminium shell, black glass bezel, lit display, faint glass reflection, camera
  const hinge = new Group();
  hinge.position.set(0, DECK, -1.45);
  const LID_H = 2.86;
  const lidY = LID_H / 2 + 0.03;
  const part = (geo, mat, z) => {
    const m = new Mesh(geo, mat);
    m.position.set(0, lidY, z);
    hinge.add(m);
    return m;
  };
  part(slab(4.3, LID_H, 0.07, 0.2), alu, 0);
  part(new ShapeGeometry(roundedRect(4.16, LID_H - 0.14, 0.15)), glassBlack, 0.0362);
  part(new PlaneGeometry(3.98, 2.5), new MeshBasicMaterial({ map: uiTexture(), toneMapped: false }), 0.0372).position.y = lidY - 0.03;
  part(new PlaneGeometry(3.98, 2.5), new MeshPhysicalMaterial({ color: 0xffffff, transparent: true, opacity: 0.07, roughness: 0, envMapIntensity: 2.5 }), 0.0382).position.y = lidY - 0.03;
  part(new CircleGeometry(0.022, 16), new MeshBasicMaterial({ color: 0x1b2633 }), 0.0372).position.y = lidY + 1.3;
  hinge.rotation.x = Math.PI / 2; // starts closed
  body.add(hinge);

  body.scale.setScalar(0.94);
  scene.add(body);

  const shadow = new Mesh(new PlaneGeometry(7.5, 5.5), new MeshBasicMaterial({ map: shadowTexture(), transparent: true, depthWrite: false }));
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = -2.15;
  scene.add(shadow);

  return (dt, t, _pointer, ndc) => {
    const k = ease(dt);
    hinge.rotation.x += (-0.34 - hinge.rotation.x) * ease(dt, 0.2); // opens after mounting
    const lift = Math.sin(t * 1.1) * 0.16;
    body.position.y = -0.85 + lift;
    body.rotation.y += (-0.55 + ndc.x * 0.45 - body.rotation.y) * k;
    body.rotation.x += (0.3 - ndc.y * 0.16 - body.rotation.x) * k;
    body.rotation.z = Math.sin(t * 0.7) * 0.025;
    shadow.material.opacity = 0.75 - lift * 1.4;
    shadow.scale.setScalar(1 + lift * 0.5);
  };
}

/* ---------- hexes ---------- */

function hexes(scene) {
  const rig = new Group();
  const tile = new CylinderGeometry(1, 1, 0.34, 6);
  const colors = [BLUE, CYAN, VIOLET, WHITE, NAVY, CYAN];
  const tiles = colors.map((color, i) => {
    const m = new Mesh(tile, gloss(color, color === NAVY ? { metalness: 0.4 } : undefined));
    m.rotation.x = Math.PI / 2; // face the camera
    rig.add(m);
    return { m, a: (i / colors.length) * Math.PI * 2 };
  });
  const core = new Mesh(new CylinderGeometry(1.45, 1.45, 0.5, 6), gloss(WHITE));
  core.rotation.x = Math.PI / 2;
  const badge = new Mesh(new CylinderGeometry(0.62, 0.62, 0.56, 6), gloss(BLUE));
  badge.rotation.x = Math.PI / 2;
  rig.add(core, badge);
  rig.rotation.set(-0.35, 0.3, 0);
  scene.add(rig);

  return (dt, t, _pointer, ndc) => {
    const k = ease(dt);
    rig.rotation.y += (0.3 + ndc.x * 0.5 - rig.rotation.y) * k;
    rig.rotation.x += (-0.35 - ndc.y * 0.3 - rig.rotation.x) * k;
    core.rotation.y = t * 0.25;
    badge.rotation.y = -t * 0.5;
    for (const { m, a } of tiles) {
      const angle = a + t * 0.22;
      m.position.set(Math.cos(angle) * 3.7, Math.sin(angle) * 3.7, Math.sin(t * 1.3 + a * 2) * 0.55);
      m.rotation.y = angle + t * 0.4;
    }
  };
}

/* ---------- windows ---------- */

function windows(scene) {
  const rig = new Group();
  const frame = slab(5.2, 3.3, 0.1, 0.22);
  const face = new ShapeGeometry(roundedRect(5.0, 3.1, 0.16));
  const panes = ["#00d4ff", "#7c5cff", "#1677ff"].map((accent, i) => {
    const pane = new Group();
    pane.add(new Mesh(frame, gloss(WHITE)));
    const screen = new Mesh(face, new MeshBasicMaterial({ map: uiTexture(accent), toneMapped: false }));
    // ShapeGeometry UVs are in shape units: remap them onto the full texture
    const uv = face.attributes.uv;
    if (i === 0) for (let j = 0; j < uv.count; j++) uv.setXY(j, uv.getX(j) / 5.0 + 0.5, uv.getY(j) / 3.1 + 0.5);
    screen.position.z = 0.052;
    pane.add(screen);
    rig.add(pane);
    return pane;
  });
  rig.rotation.set(0.12, -0.5, 0.03);
  scene.add(rig);

  let spread = 0.4;
  return (dt, t, _pointer, ndc) => {
    const k = ease(dt);
    rig.rotation.y += (-0.5 + ndc.x * 0.4 - rig.rotation.y) * k;
    rig.rotation.x += (0.12 - ndc.y * 0.2 - rig.rotation.x) * k;
    spread += (1 + Math.abs(ndc.x) * 0.5 - spread) * ease(dt, 0.25); // fan out on load, further with the pointer
    panes.forEach((pane, i) => {
      const o = i - 1;
      pane.position.set(o * 1.15 * spread, o * -0.75 * spread + Math.sin(t * 0.9 + i * 1.7) * 0.14, o * -1.7 * spread);
    });
  };
}

/* ---------- rings ---------- */

function rings(scene) {
  const rig = new Group();
  rig.add(new Mesh(new SphereGeometry(1.25, 48, 24), gloss(BLUE, { roughness: 0.12 })));
  const hoops = [
    [2.2, 0.07, CYAN, 0.9],
    [3.0, 0.06, WHITE, -0.6],
    [3.8, 0.05, VIOLET, 0.4],
  ].map(([radius, tube, color, speed], i) => {
    const pivot = new Group();
    pivot.rotation.set(1.1 + i * 0.5, i * 0.9, 0);
    const hoop = new Mesh(new TorusGeometry(radius, tube, 16, 96), gloss(color));
    const moon = new Mesh(new SphereGeometry(0.2 + i * 0.05, 24, 12), gloss(i === 1 ? NAVY : color));
    moon.position.x = radius;
    hoop.add(moon);
    pivot.add(hoop);
    rig.add(pivot);
    return { hoop, speed };
  });
  scene.add(rig);

  return (dt, t, _pointer, ndc) => {
    const k = ease(dt);
    rig.rotation.y += (ndc.x * 0.6 - rig.rotation.y) * k;
    rig.rotation.x += (-ndc.y * 0.4 - rig.rotation.x) * k;
    rig.position.y = Math.sin(t * 0.9) * 0.15;
    for (const { hoop, speed } of hoops) hoop.rotation.z = t * speed;
  };
}

const SCENES = { cluster, laptop, hexes, windows, rings };
const CAMERA_Z = { cluster: 17, laptop: 11, hexes: 19, windows: 15, rings: 22 };

/** Mounts a scene on the canvas. Returns { start, stop, dispose }, or null without WebGL. */
export function mount(canvas, kind) {
  let renderer;
  try {
    renderer = new WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "high-performance" });
  } catch {
    return null;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.debug.checkShaderErrors = false; // skips a compile-status round trip and the driver's precision chatter

  const scene = new Scene();
  const pmrem = new PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.55; // keep brand colours saturated instead of washed out
  const sun = new DirectionalLight(0xffffff, 2.2);
  sun.position.set(4, 7, 8);
  scene.add(sun, new AmbientLight(0xffffff, 0.5));

  const camera = new PerspectiveCamera(30, 1, 0.1, 100);
  camera.position.set(0, 0, CAMERA_Z[kind] ?? 17);
  const update = (SCENES[kind] ?? cluster)(scene);

  const size = () => {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  const observer = new ResizeObserver(size);
  observer.observe(canvas);
  size();

  // pointer in normalised device coords, and where it hits the z = 0 plane
  const ndc = new Vector2(0, 0); // centred until the pointer first moves
  const pointer = new Vector3(99, 99, 0);
  const ray = new Raycaster();
  const ground = new Plane(new Vector3(0, 0, 1), 0);
  const onMove = (e) => {
    const r = canvas.getBoundingClientRect();
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -(((e.clientY - r.top) / r.height) * 2 - 1));
    ray.setFromCamera(ndc, camera);
    ray.ray.intersectPlane(ground, pointer);
    ndc.clampScalar(-1.5, 1.5);
  };
  window.addEventListener("pointermove", onMove, { passive: true });

  let raf = 0;
  let last = 0;
  const frame = (now) => {
    const dt = Math.min(0.05, (now - last) / 1000 || 0.016);
    last = now;
    update(dt, now / 1000, pointer, ndc);
    renderer.render(scene, camera);
    raf = requestAnimationFrame(frame);
  };

  return {
    start() {
      cancelAnimationFrame(raf);
      last = performance.now();
      raf = requestAnimationFrame(frame);
    },
    stop: () => cancelAnimationFrame(raf),
    dispose() {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      observer.disconnect();
      scene.traverse((o) => {
        o.geometry?.dispose();
        o.material?.map?.dispose();
        o.material?.dispose();
      });
      scene.environment.dispose();
      pmrem.dispose();
      renderer.dispose();
    },
  };
}
