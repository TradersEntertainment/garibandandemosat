import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import type { Product } from '../types';

/* ------------------------------------------------------------------ */
/*  Archetype detection                                                */
/* ------------------------------------------------------------------ */

export type Archetype =
  | 'iphone' | 'galaxy' | 'xiaomi' | 'ps5' | 'switch' | 'macbook' | 'rog' | 'airpods' | 'headphones' | 'mouse'
  | 'robot' | 'airfryer' | 'coffee' | 'tumbler' | 'oil' | 'detergent' | 'af1' | 'samba' | 'stick' | 'airwrap' | 'box';

export function archetypeOf(p: Product): Archetype {
  const t = p.title.toLowerCase();
  if (t.includes('iphone')) return 'iphone';
  if (t.includes('galaxy')) return 'galaxy';
  if (t.includes('xiaomi')) return 'xiaomi';
  if (t.includes('playstation')) return 'ps5';
  if (t.includes('switch')) return 'switch';
  if (t.includes('macbook')) return 'macbook';
  if (t.includes('rog') || t.includes('zephyrus')) return 'rog';
  if (t.includes('airpods')) return 'airpods';
  if (t.includes('wh-1000')) return 'headphones';
  if (t.includes('mouse')) return 'mouse';
  if (t.includes('roborock')) return 'robot';
  if (t.includes('airfryer')) return 'airfryer';
  if (t.includes('magnifica') || t.includes('kahve')) return 'coffee';
  if (t.includes('stanley')) return 'tumbler';
  if (t.includes('zeytinyağı')) return 'oil';
  if (t.includes('fairy')) return 'detergent';
  if (t.includes('air force')) return 'af1';
  if (t.includes('samba')) return 'samba';
  if (t.includes('airwrap')) return 'airwrap';
  if (t.includes('dyson')) return 'stick';
  return 'box';
}

/* ------------------------------------------------------------------ */
/*  Materials & helpers                                                */
/* ------------------------------------------------------------------ */

const metal = (color: number, rough = 0.3) =>
  new THREE.MeshPhysicalMaterial({ color, metalness: 1, roughness: rough });

const plastic = (color: number, rough = 0.42) =>
  new THREE.MeshPhysicalMaterial({ color, roughness: rough, metalness: 0, clearcoat: 0.35, clearcoatRoughness: 0.4 });

const matte = (color: number, rough = 0.85) =>
  new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: 0 });

const glassDark = (color = 0x07090d) =>
  new THREE.MeshPhysicalMaterial({ color, roughness: 0.06, metalness: 0.3, clearcoat: 1, clearcoatRoughness: 0.05 });

const clearPlastic = (color = 0xdfe8ee, opacity = 0.32) =>
  new THREE.MeshPhysicalMaterial({
    color, roughness: 0.08, metalness: 0, transparent: true, opacity, clearcoat: 1, side: THREE.DoubleSide,
  });

const emissive = (color: number) => new THREE.MeshBasicMaterial({ color, toneMapped: false });

function canvasTex(w: number, h: number, draw: (c: CanvasRenderingContext2D) => void) {
  const cv = document.createElement('canvas');
  cv.width = w;
  cv.height = h;
  draw(cv.getContext('2d')!);
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

const gradTex = (stops: string[], w = 256, h = 512, diagonal = true) =>
  canvasTex(w, h, (c) => {
    const g = diagonal ? c.createLinearGradient(0, 0, w, h) : c.createLinearGradient(0, 0, 0, h);
    stops.forEach((s, i) => g.addColorStop(i / (stops.length - 1), s));
    c.fillStyle = g;
    c.fillRect(0, 0, w, h);
  });

const screenMat = (stops: string[], w = 256, h = 512) =>
  new THREE.MeshBasicMaterial({ map: gradTex(stops, w, h), toneMapped: false });

function labelTex(w: number, h: number, bg: string[], lines: { t: string; size: number; color: string; y: number; weight?: number }[]) {
  return canvasTex(w, h, (c) => {
    const g = c.createLinearGradient(0, 0, w, h);
    bg.forEach((s, i) => g.addColorStop(i / Math.max(1, bg.length - 1), s));
    c.fillStyle = g;
    c.fillRect(0, 0, w, h);
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    lines.forEach((l) => {
      c.fillStyle = l.color;
      c.font = `${l.weight ?? 800} ${l.size}px Fraunces, Georgia, serif`;
      c.fillText(l.t, w / 2, l.y);
    });
  });
}

function rbox(w: number, h: number, d: number, r: number, mat: THREE.Material) {
  const rad = Math.min(r, w / 2 - 0.001, h / 2 - 0.001, d / 2 - 0.001);
  return new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 5, rad), mat);
}

function cyl(rt: number, rb: number, h: number, mat: THREE.Material, seg = 48) {
  return new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), mat);
}

function lathe(profile: [number, number][], mat: THREE.Material, seg = 64) {
  return new THREE.Mesh(new THREE.LatheGeometry(profile.map(([x, y]) => new THREE.Vector2(x, y)), seg), mat);
}

function at<T extends THREE.Object3D>(o: T, x = 0, y = 0, z = 0) {
  o.position.set(x, y, z);
  return o;
}

function lens(r: number) {
  const g = new THREE.Group();
  const ring = at(cyl(r, r, 0.05, metal(0xcfcfd4, 0.2)), 0, 0, 0);
  ring.rotation.x = Math.PI / 2;
  const glass = at(cyl(r * 0.8, r * 0.8, 0.07, glassDark(0x05080c)), 0, 0, 0.005);
  glass.rotation.x = Math.PI / 2;
  const core = at(cyl(r * 0.42, r * 0.42, 0.08, new THREE.MeshPhysicalMaterial({ color: 0x1d2a44, roughness: 0.1, metalness: 0.6 })), 0, 0, 0.01);
  core.rotation.x = Math.PI / 2;
  g.add(ring, glass, core);
  return g;
}

/* ------------------------------------------------------------------ */
/*  Builders                                                           */
/* ------------------------------------------------------------------ */

function phone(kind: 'iphone' | 'galaxy' | 'xiaomi') {
  const g = new THREE.Group();
  const w = 1.5, h = 3.1, d = 0.17;
  const frameCol = kind === 'iphone' ? 0xb7a38b : kind === 'galaxy' ? 0x8b9099 : 0x2a2d33;
  const backCol = kind === 'iphone' ? 0xc4b098 : kind === 'galaxy' ? 0x7a808a : 0x101216;
  const frame = rbox(w, h, d, 0.22, metal(frameCol, 0.32));
  g.add(frame);

  const back = at(rbox(w - 0.05, h - 0.05, 0.03, 0.2, plastic(backCol, 0.55)), 0, 0, -d / 2 + 0.002);
  g.add(back);

  const bezel = at(rbox(w - 0.06, h - 0.06, 0.04, 0.2, glassDark(0x020305)), 0, 0, d / 2 - 0.012);
  g.add(bezel);
  const wallpaper =
    kind === 'iphone'
      ? ['#ffb36b', '#e8588a', '#3a2a8f']
      : kind === 'galaxy'
        ? ['#1fd1c4', '#2563eb', '#0b1030']
        : ['#ff7a45', '#d6336c', '#2b1055'];
  const display = at(new THREE.Mesh(new THREE.PlaneGeometry(w - 0.17, h - 0.17), screenMat(wallpaper)), 0, 0, d / 2 + 0.01);
  g.add(display);

  if (kind === 'iphone') {
    const pill = at(new THREE.Mesh(new THREE.CapsuleGeometry(0.05, 0.3, 6, 16), new THREE.MeshBasicMaterial({ color: 0x000000 })), 0, h / 2 - 0.22, d / 2 + 0.013);
    pill.rotation.z = Math.PI / 2;
    g.add(pill);
  } else {
    g.add(at(new THREE.Mesh(new THREE.CircleGeometry(0.045, 24), new THREE.MeshBasicMaterial({ color: 0x000000 })), 0, h / 2 - 0.2, d / 2 + 0.013));
  }

  const z = -d / 2 - 0.045;
  if (kind === 'iphone') {
    const plate = at(rbox(0.85, 0.85, 0.07, 0.2, plastic(0xe0d2bf, 0.3)), 0.3, h / 2 - 0.6, z + 0.02);
    g.add(plate);
    [[0.5, h / 2 - 0.4], [0.5, h / 2 - 0.8], [0.1, h / 2 - 0.6]].forEach(([x, y]) => {
      const l = lens(0.17);
      l.position.set(x, y, z - 0.035);
      g.add(l);
    });
    g.add(at(new THREE.Mesh(new THREE.CircleGeometry(0.05, 20), emissive(0xfff3c4)), -0.05, h / 2 - 0.35, z - 0.07));
  } else if (kind === 'galaxy') {
    [h / 2 - 0.45, h / 2 - 0.88, h / 2 - 1.31].forEach((y) => {
      const l = lens(0.15);
      l.position.set(0.4, y, z - 0.01);
      g.add(l);
    });
  } else {
    const ring = at(cyl(0.62, 0.62, 0.07, metal(0x44474f, 0.25)), 0, h / 2 - 0.85, z + 0.01);
    ring.rotation.x = Math.PI / 2;
    const cam = at(cyl(0.55, 0.55, 0.09, glassDark(0x050609)), 0, h / 2 - 0.85, z - 0.005);
    cam.rotation.x = Math.PI / 2;
    g.add(ring, cam);
    [[-0.2, 0.18], [0.2, 0.18], [0, -0.22]].forEach(([x, y]) => {
      const l = lens(0.15);
      l.position.set(x, h / 2 - 0.85 + y, z - 0.06);
      g.add(l);
    });
  }

  const btn = metal(frameCol, 0.4);
  g.add(at(rbox(0.04, 0.5, 0.06, 0.02, btn), w / 2 + 0.005, 0.6, 0));
  g.add(at(rbox(0.04, 0.3, 0.06, 0.02, btn), -w / 2 - 0.005, 0.8, 0));
  g.add(at(rbox(0.04, 0.3, 0.06, 0.02, btn), -w / 2 - 0.005, 0.4, 0));
  return g;
}

function ps5() {
  const g = new THREE.Group();
  const white = plastic(0xf4f4f2, 0.28);
  const black = plastic(0x0b0c10, 0.4);

  const profile = new THREE.Shape();
  profile.moveTo(-1.0, -1.7);
  profile.lineTo(0.95, -1.7);
  profile.quadraticCurveTo(1.25, -1.7, 1.2, -1.3);
  profile.quadraticCurveTo(0.95, 0.0, 1.05, 1.5);
  profile.quadraticCurveTo(1.1, 1.78, 0.8, 1.78);
  profile.lineTo(-0.85, 1.78);
  profile.quadraticCurveTo(-1.1, 1.78, -1.05, 1.4);
  profile.quadraticCurveTo(-0.9, 0.1, -1.2, -1.3);
  profile.quadraticCurveTo(-1.25, -1.7, -1.0, -1.7);

  const panelGeo = new THREE.ExtrudeGeometry(profile, {
    depth: 0.12, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.05, bevelSegments: 4, curveSegments: 28,
  });
  panelGeo.translate(0, 0, -0.06);
  const left = new THREE.Mesh(panelGeo, white);
  left.rotation.y = Math.PI / 2;
  left.position.x = -0.42;
  const right = new THREE.Mesh(panelGeo, white);
  right.rotation.y = Math.PI / 2;
  right.position.x = 0.42;
  g.add(left, right);

  g.add(at(rbox(0.7, 3.3, 1.9, 0.08, black), 0, 0, 0));
  const strip = at(new THREE.Mesh(new THREE.PlaneGeometry(0.03, 3.1), emissive(0x4aa3ff)), 0, 0, 0.96);
  g.add(strip);
  g.add(at(rbox(0.5, 0.06, 1.4, 0.03, plastic(0x1a1c22)), 0, 1.0, 0.1));
  const base = at(rbox(1.5, 0.12, 2.0, 0.05, white), 0, -1.78, 0);
  g.add(base);
  return g;
}

function nswitch() {
  const g = new THREE.Group();
  const body = rbox(3.1, 1.85, 0.2, 0.12, plastic(0x15161a, 0.45));
  g.add(body);
  const bezel = at(rbox(3.05, 1.8, 0.04, 0.1, glassDark(0x020203)), 0, 0, 0.09);
  g.add(bezel);
  const scr = at(new THREE.Mesh(new THREE.PlaneGeometry(2.8, 1.58), screenMat(['#ff4d5e', '#7a3cff', '#18c2ff'], 512, 288)), 0, 0, 0.116);
  g.add(scr);

  const joy = (x: number, color: number, left: boolean) => {
    const j = new THREE.Group();
    j.add(rbox(0.62, 1.95, 0.24, 0.16, plastic(color, 0.38)));
    const stick = at(cyl(0.11, 0.12, 0.08, plastic(0x1a1a1d), 24), 0, left ? 0.45 : -0.2, 0.16);
    stick.rotation.x = Math.PI / 2;
    j.add(stick);
    const bx = left ? 0 : 0;
    const ys = left ? -0.45 : 0.45;
    [[-0.14, 0], [0.14, 0], [0, 0.14], [0, -0.14]].forEach(([dx, dy]) => {
      const b = at(cyl(0.055, 0.055, 0.04, plastic(0x1a1a1d), 20), bx + dx, ys + dy, 0.13);
      b.rotation.x = Math.PI / 2;
      j.add(b);
    });
    j.position.x = x;
    return j;
  };
  g.add(joy(-1.86, 0x19b4e8, true));
  g.add(joy(1.86, 0xf2465c, false));
  return g;
}

function laptop(kind: 'macbook' | 'rog') {
  const g = new THREE.Group();
  const alu = kind === 'macbook' ? metal(0x8d9097, 0.32) : metal(0x23252b, 0.4);
  const base = at(rbox(3.2, 0.1, 2.2, 0.05, alu), 0, 0, 0);
  g.add(base);
  const deck = at(new THREE.Mesh(new THREE.PlaneGeometry(2.9, 0.92), matte(0x0d0e11, 0.9)), 0, 0.052, -0.28);
  deck.rotation.x = -Math.PI / 2;
  g.add(deck);

  // keycaps (instanced)
  const rows = 5, cols = 14;
  const keyGeo = new RoundedBoxGeometry(0.17, 0.035, 0.15, 2, 0.02);
  const keys = new THREE.InstancedMesh(keyGeo, matte(kind === 'macbook' ? 0x15161a : 0x0a0a0c, 0.6), rows * cols);
  const m = new THREE.Matrix4();
  let i = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      m.setPosition(-1.33 + c * 0.205, 0.075, -0.62 + r * 0.185);
      keys.setMatrixAt(i++, m);
    }
  }
  g.add(keys);
  g.add(at(rbox(0.95, 0.012, 0.6, 0.03, metal(kind === 'macbook' ? 0x9a9da4 : 0x34363d, 0.3)), 0, 0.058, 0.62));

  const lid = new THREE.Group();
  lid.add(at(rbox(3.2, 2.1, 0.07, 0.07, alu), 0, 1.05, 0));
  lid.add(at(rbox(3.12, 2.02, 0.03, 0.05, glassDark(0x020304)), 0, 1.05, 0.03));
  const wp = kind === 'macbook' ? ['#ffd1a3', '#f46b8f', '#5b3fd1'] : ['#ff2e4d', '#8a1bff', '#050515'];
  lid.add(at(new THREE.Mesh(new THREE.PlaneGeometry(2.96, 1.86), screenMat(wp, 512, 320)), 0, 1.05, 0.05));
  if (kind === 'rog') lid.add(at(new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.04), emissive(0xff2e4d)), 0, 0.09, 0.052));
  lid.position.set(0, 0.04, -1.08);
  lid.rotation.x = -0.28;
  g.add(lid);
  return g;
}

function airpods() {
  const g = new THREE.Group();
  const white = plastic(0xf6f6f4, 0.25);
  const caseBody = at(rbox(1.7, 0.95, 0.75, 0.3, white), 0, -0.35, 0);
  g.add(caseBody);
  const hinge = at(new THREE.Mesh(new THREE.PlaneGeometry(1.7, 0.012), matte(0xcfcfcc)), 0, 0.1, 0.38);
  g.add(hinge);
  const lid = new THREE.Group();
  lid.add(at(rbox(1.7, 0.5, 0.75, 0.28, white), 0, 0.25, 0));
  lid.position.set(0, 0.12, -0.3);
  lid.rotation.x = -1.1;
  g.add(lid);
  g.add(at(new THREE.Mesh(new THREE.CircleGeometry(0.035, 16), emissive(0x46e08a)), 0, -0.55, 0.385));
  const bud = (x: number) => {
    const b = new THREE.Group();
    b.add(at(new THREE.Mesh(new THREE.SphereGeometry(0.26, 40, 40), white), 0, 0.55, 0));
    const tip = at(new THREE.Mesh(new THREE.SphereGeometry(0.13, 24, 24), plastic(0x2a2a2d, 0.5)), 0, 0.46, 0.2);
    b.add(tip);
    const stem = at(new THREE.Mesh(new THREE.CapsuleGeometry(0.07, 0.62, 8, 24), white), 0.0, 0.0, 0);
    b.add(stem);
    b.position.set(x, 0.38, 0);
    return b;
  };
  g.add(bud(-0.38), bud(0.38));
  return g;
}

function headphones() {
  const g = new THREE.Group();
  const body = plastic(0xd8d6d0, 0.38);
  const dark = plastic(0x1c1d21, 0.55);
  const band = new THREE.Mesh(new THREE.TorusGeometry(1.45, 0.075, 18, 90, Math.PI), body);
  g.add(at(band, 0, -0.1, 0));
  const slider = (s: number) => {
    const sl = at(rbox(0.1, 0.55, 0.14, 0.04, metal(0xb0b0b6, 0.3)), s * 1.45, -0.25, 0);
    return sl;
  };
  g.add(slider(-1), slider(1));
  const cup = (s: number) => {
    const c = new THREE.Group();
    const shell = lathe([[0, 0], [0.62, 0], [0.82, 0.08], [0.88, 0.25], [0.8, 0.42], [0.6, 0.5], [0, 0.52]], body);
    shell.rotation.z = Math.PI / 2 * -s;
    c.add(shell);
    const cushion = new THREE.Mesh(new THREE.TorusGeometry(0.62, 0.17, 20, 48), dark);
    cushion.rotation.y = Math.PI / 2;
    cushion.position.x = -s * -0.0;
    cushion.position.x = s * -0.05;
    c.add(cushion);
    c.position.set(s * 1.52, -0.82, 0);
    c.rotation.y = 0;
    return c;
  };
  const l = cup(-1);
  l.children[1].position.x = 0.22;
  const r = cup(1);
  r.children[1].position.x = -0.22;
  g.add(l, r);
  return g;
}

function mouse() {
  const g = new THREE.Group();
  const white = plastic(0xf4f4f1, 0.38);
  const dark = plastic(0x1a1b1f, 0.5);
  // hemisphere shell: x width, y height, z length (front = +z)
  const W = 0.78, H = 0.5, L = 1.25;
  const shell = new THREE.Mesh(new THREE.SphereGeometry(1, 64, 40, 0, Math.PI * 2, 0, Math.PI / 2), white);
  shell.scale.set(W, H, L);
  g.add(shell);
  const base = at(cyl(1, 1, 0.04, dark, 64), 0, -0.02, 0);
  base.scale.set(W * 0.99, 1, L * 0.99);
  g.add(base);
  // button split + wheel, following the shell surface
  const topY = (z: number) => H * Math.sqrt(Math.max(0, 1 - (z / L) ** 2)) + 0.004;
  const line = (x0: number, x1: number) => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= 14; i++) {
      const z = 0.1 + (i / 14) * 1.0;
      const t = i / 14;
      const x = x0 + (x1 - x0) * t;
      const y = H * Math.sqrt(Math.max(0, 1 - (z / L) ** 2 - (x / W) ** 2)) + 0.004;
      pts.push(new THREE.Vector3(x, y, z));
    }
    return new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 40, 0.012, 6), dark);
  };
  g.add(line(0, 0));
  const sideCurve: THREE.Vector3[] = [];
  for (let i = 0; i <= 16; i++) {
    const x = -0.52 + (i / 16) * 1.04;
    const z = 0.1;
    const y = H * Math.sqrt(Math.max(0, 1 - (z / L) ** 2 - (x / W) ** 2)) + 0.004;
    sideCurve.push(new THREE.Vector3(x, y, z));
  }
  g.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(sideCurve), 40, 0.012, 6), dark));
  const wheel = at(cyl(0.085, 0.085, 0.16, dark, 24), 0, topY(0.38) + 0.02, 0.38);
  wheel.rotation.z = Math.PI / 2;
  g.add(wheel);
  g.add(at(new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.02), emissive(0x2fe0a0)), 0, 0.012, 1.18));
  return g;
}

function robot() {
  const g = new THREE.Group();
  const white = plastic(0xf2f2f0, 0.3);
  g.add(at(cyl(1.5, 1.5, 0.52, white, 96), 0, 0, 0));
  const top = at(cyl(1.42, 1.42, 0.02, glassDark(0x0a0c10), 96), 0, 0.27, 0);
  g.add(top);
  const turret = at(cyl(0.38, 0.4, 0.2, plastic(0x24262b, 0.3)), 0.2, 0.38, -0.1);
  g.add(turret);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.31, 0.025, 12, 48), emissive(0xff5a3c));
  ring.rotation.x = Math.PI / 2;
  g.add(at(ring, 0.2, 0.49, -0.1));
  const bump = new THREE.Mesh(new THREE.TorusGeometry(1.5, 0.12, 14, 64, Math.PI * 0.8), plastic(0x1d1f24, 0.5));
  bump.rotation.x = Math.PI / 2;
  bump.rotation.z = Math.PI * 0.1;
  g.add(at(bump, 0, -0.02, 0));
  [-0.4, 0, 0.4].forEach((x, i) => {
    const b = at(cyl(0.08, 0.08, 0.025, plastic(i === 1 ? 0x3a7bff : 0xc9c9c7, 0.3), 24), x - 0.2, 0.28, 0.75);
    g.add(b);
  });
  return g;
}

function airfryer() {
  const g = new THREE.Group();
  const black = plastic(0x15161a, 0.32);
  g.add(rbox(2.4, 2.4, 2.5, 0.38, black));
  g.add(at(rbox(2.0, 1.15, 0.08, 0.1, plastic(0x0b0c0f, 0.25)), 0, -0.25, 1.26));
  g.add(at(rbox(1.7, 0.1, 0.22, 0.05, metal(0x6b6e75, 0.3)), 0, 0.42, 1.35));
  const panel = at(new THREE.Mesh(new THREE.PlaneGeometry(1.5, 0.42), screenMat(['#0a1a14', '#0d2a1f'], 256, 64)), 0, 0.98, 1.26);
  panel.rotation.x = -0.25;
  g.add(panel);
  [-0.45, 0, 0.45].forEach((x) => {
    const dot = at(new THREE.Mesh(new THREE.CircleGeometry(0.06, 16), emissive(0x44ff9a)), x, 0.99, 1.275);
    dot.rotation.x = -0.25;
    g.add(dot);
  });
  const dial = at(cyl(0.2, 0.2, 0.1, metal(0x9ea1a8, 0.25), 32), 0.9, 0.98, 1.28);
  dial.rotation.x = Math.PI / 2 - 0.25;
  g.add(dial);
  g.add(at(rbox(1.9, 0.05, 1.5, 0.02, matte(0x1c1d21)), 0, 1.2, -0.3));
  return g;
}

function coffee() {
  const g = new THREE.Group();
  const body = metal(0xb9bcc2, 0.28);
  const dark = plastic(0x15161a, 0.35);
  g.add(at(rbox(2.0, 3.0, 2.3, 0.18, dark), 0, 0, 0));
  g.add(at(rbox(2.04, 0.9, 2.34, 0.14, body), 0, 1.0, 0));
  const hopper = at(cyl(0.7, 0.8, 0.9, clearPlastic(0x7a4a2b, 0.7), 48), 0, 2.0, -0.2);
  g.add(hopper);
  g.add(at(cyl(0.72, 0.72, 0.1, plastic(0x2a2c31), 48), 0, 2.5, -0.2));
  g.add(at(rbox(1.5, 0.55, 0.12, 0.06, glassDark(0x0a0c10)), 0, 0.15, 1.17));
  g.add(at(new THREE.Mesh(new THREE.CircleGeometry(0.07, 16), emissive(0xffb02e)), -0.5, 0.15, 1.235));
  g.add(at(new THREE.Mesh(new THREE.CircleGeometry(0.07, 16), emissive(0x44ff9a)), 0.5, 0.15, 1.235));
  g.add(at(rbox(0.5, 0.3, 0.5, 0.06, metal(0x888b92, 0.3)), 0, -0.4, 1.0));
  g.add(at(rbox(1.7, 0.12, 1.2, 0.04, body), 0, -1.1, 1.05));
  g.add(at(rbox(1.7, 0.16, 0.14, 0.04, metal(0x22242a, 0.4)), 0, -1.32, 1.58));
  const cup = at(lathe([[0, 0], [0.34, 0], [0.4, 0.5], [0.36, 0.5], [0.3, 0.04]], plastic(0xf6f6f4, 0.3)), 0, -1.05, 1.05);
  g.add(cup);
  return g;
}

function tumbler() {
  const g = new THREE.Group();
  const col = metal(0xa6c4b0, 0.4);
  const body = lathe([[0, -1.55], [0.62, -1.55], [0.7, -1.5], [0.98, 1.2], [0.98, 1.3], [0.92, 1.3], [0, 1.3]], col);
  g.add(body);
  const lid = lathe([[0, 1.3], [1.0, 1.3], [1.02, 1.4], [0.98, 1.5], [0.5, 1.56], [0, 1.56]], plastic(0xf1efe9, 0.45));
  g.add(lid);
  const strawHole = at(cyl(0.18, 0.18, 0.04, plastic(0x2a2a2d, 0.5), 24), 0.35, 1.57, 0);
  g.add(strawHole);
  const straw = at(cyl(0.065, 0.065, 1.4, plastic(0xf1efe9, 0.3), 16), 0.35, 2.15, 0);
  straw.rotation.z = -0.08;
  g.add(straw);
  const h = new THREE.Mesh(new THREE.TorusGeometry(0.62, 0.075, 14, 36, Math.PI), col);
  h.rotation.z = -Math.PI / 2;
  h.position.set(1.0, 0.0, 0);
  h.scale.set(1, 1.4, 1);
  g.add(h);
  return g;
}

function oil() {
  const g = new THREE.Group();
  const label = labelTex(512, 768, ['#f6e9b8', '#e7c75a', '#c99b2a'], [
    { t: 'Yudum', size: 96, color: '#8b1a12', y: 160 },
    { t: 'Egemden', size: 44, color: '#3b2a0a', y: 260, weight: 600 },
    { t: 'SIZMA', size: 78, color: '#14110f', y: 390 },
    { t: 'ZEYTİNYAĞI', size: 62, color: '#14110f', y: 470 },
    { t: '5 LİTRE', size: 54, color: '#8b1a12', y: 620 },
  ]);
  const tin = new THREE.MeshPhysicalMaterial({ map: label, metalness: 0.55, roughness: 0.35 });
  const edge = metal(0xc9a43a, 0.35);
  const mats = [edge, edge, edge, edge, tin, tin];
  const box = new THREE.Mesh(new RoundedBoxGeometry(1.7, 2.6, 1.15, 4, 0.08), mats);
  g.add(box);
  g.add(at(cyl(0.2, 0.22, 0.28, plastic(0xc4301c, 0.4), 28), 0.5, 1.44, 0.2));
  const handle = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.045, 12, 32, Math.PI), metal(0x777a80, 0.3));
  handle.position.set(-0.2, 1.3, 0);
  g.add(handle);
  return g;
}

function detergent() {
  const g = new THREE.Group();
  const front = labelTex(512, 640, ['#0a8f6a', '#35c2a3'], [
    { t: 'Fairy', size: 120, color: '#ffffff', y: 150 },
    { t: 'PLATINUM PLUS', size: 46, color: '#fff7c2', y: 250 },
    { t: 'Hepsi Bir Arada', size: 40, color: '#e8fff6', y: 320, weight: 600 },
    { t: '115', size: 150, color: '#ffd84d', y: 450 },
    { t: 'YIKAMA', size: 50, color: '#ffffff', y: 560 },
  ]);
  const m = new THREE.MeshPhysicalMaterial({ map: front, roughness: 0.45, clearcoat: 0.5 });
  const side = plastic(0x0a8f6a, 0.5);
  g.add(new THREE.Mesh(new RoundedBoxGeometry(2.0, 2.5, 1.0, 4, 0.1), [side, side, side, side, m, m]));
  return g;
}

function sneaker(kind: 'af1' | 'samba') {
  const g = new THREE.Group();
  const af = kind === 'af1';
  const upperMat = plastic(af ? 0xf6f4ee : 0x1b1b1d, 0.62);
  const soleMat = plastic(af ? 0xf1efe8 : 0xcfa86e, 0.8);
  const trimMat = plastic(af ? 0xf6f4ee : 0xf4f4f1, 0.6);

  // ---- sole: foot outline in XZ, extruded up
  const s = new THREE.Shape();
  s.moveTo(-2.05, 0);
  s.bezierCurveTo(-2.05, 0.5, -1.6, 0.58, -0.8, 0.56);
  s.bezierCurveTo(-0.1, 0.55, 0.3, 0.78, 1.1, 0.78);
  s.bezierCurveTo(1.9, 0.78, 2.3, 0.4, 2.3, 0);
  s.bezierCurveTo(2.3, -0.4, 1.9, -0.78, 1.1, -0.78);
  s.bezierCurveTo(0.3, -0.78, -0.1, -0.55, -0.8, -0.56);
  s.bezierCurveTo(-1.6, -0.58, -2.05, -0.5, -2.05, 0);
  const soleGeo = new THREE.ExtrudeGeometry(s, {
    depth: af ? 0.3 : 0.2, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.05, bevelSegments: 4, curveSegments: 48,
  });
  const sole = new THREE.Mesh(soleGeo, soleMat);
  sole.rotation.x = -Math.PI / 2;
  sole.position.y = 0.0;
  g.add(sole);
  const soleTop = (af ? 0.3 : 0.2) + 0.05;

  // ---- upper: deformed hemisphere
  const prof = (pts: number[][], x: number) => {
    if (x <= pts[0][0]) return pts[0][1];
    for (let i = 1; i < pts.length; i++) {
      if (x <= pts[i][0]) {
        const t = (x - pts[i - 1][0]) / (pts[i][0] - pts[i - 1][0]);
        const e = t * t * (3 - 2 * t);
        return pts[i - 1][1] * (1 - e) + pts[i][1] * e;
      }
    }
    return pts[pts.length - 1][1];
  };
  const H = [[-2.0, 0.95], [-1.4, 1.45], [-0.6, 1.5], [0.3, 1.0], [1.2, 0.62], [2.15, 0.3]];
  const Wd = [[-2.0, 0.46], [-0.8, 0.56], [1.1, 0.76], [2.15, 0.36]];
  const X0 = 0.05, XR = 2.1;
  const geo = new THREE.SphereGeometry(1, 72, 48, 0, Math.PI * 2, 0, Math.PI / 2);
  const p = geo.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const vx = p.getX(i), vy = p.getY(i), vz = p.getZ(i);
    const x = vx * XR + X0;
    p.setXYZ(i, x, vy * prof(H, x), vz * prof(Wd, x) * 0.98);
  }
  geo.computeVertexNormals();
  const upper = new THREE.Mesh(geo, upperMat);
  upper.position.y = soleTop - 0.04;
  g.add(upper);
  const topY = (x: number) => {
    const vx = (x - X0) / XR;
    return prof(H, x) * Math.sqrt(Math.max(0, 1 - vx * vx)) + soleTop - 0.04;
  };

  // ---- collar opening
  const cx = -1.2;
  const collar = new THREE.Mesh(new THREE.TorusGeometry(0.4, 0.1, 18, 48), upperMat);
  collar.rotation.x = Math.PI / 2;
  collar.rotation.y = 0.0;
  collar.scale.set(1.15, 0.82, 1);
  collar.position.set(cx, topY(cx) - 0.04, 0);
  g.add(collar);
  const hole = new THREE.Mesh(new THREE.CircleGeometry(0.42, 32), new THREE.MeshBasicMaterial({ color: 0x0b0b0c }));
  hole.rotation.x = -Math.PI / 2;
  hole.scale.set(1.15, 0.8, 1);
  hole.position.set(cx, topY(cx) - 0.08, 0);
  g.add(hole);

  // ---- tongue + laces along the ridge
  const tongue = rbox(0.42, 0.14, 0.5, 0.06, af ? plastic(0xefede6, 0.6) : plastic(0x2a2a2d, 0.6));
  tongue.position.set(-0.78, topY(-0.78) + 0.1, 0);
  tongue.rotation.z = 0.55;
  g.add(tongue);
  for (let i = 0; i < 5; i++) {
    const x = -0.45 + i * 0.28;
    const lace = rbox(0.06, 0.06, 0.58, 0.025, plastic(0xffffff, 0.6));
    lace.position.set(x, topY(x) + 0.03, 0);
    lace.rotation.z = Math.atan2(topY(x + 0.1) - topY(x - 0.1), 0.2);
    g.add(lace);
  }

  // ---- toe cap + heel tab
  const toe = new THREE.Mesh(new THREE.SphereGeometry(1, 40, 28, 0, Math.PI * 2, 0, Math.PI / 2), af ? upperMat : plastic(0x8a8d93, 0.9));
  toe.scale.set(0.82, 0.38, 0.62);
  toe.position.set(1.72, soleTop - 0.04, 0);
  g.add(toe);
  const heel = rbox(0.1, 0.5, 0.42, 0.04, af ? upperMat : plastic(0x8a8d93, 0.9));
  heel.position.set(-2.0, soleTop + 0.55, 0);
  g.add(heel);

  // ---- side branding
  if (af) {
    [-1, 1].forEach((side) => {
      const sw = new THREE.Shape();
      sw.moveTo(0, 0);
      sw.bezierCurveTo(0.45, -0.24, 1.1, 0.0, 1.45, 0.48);
      sw.bezierCurveTo(0.95, 0.12, 0.4, 0.02, 0, 0.14);
      const sg = new THREE.Mesh(new THREE.ExtrudeGeometry(sw, { depth: 0.06, bevelEnabled: false }), plastic(0xb9bdc4, 0.4));
      sg.position.set(-0.55, soleTop + 0.35, side * 0.5);
      if (side < 0) sg.rotation.y = Math.PI;
      sg.position.z = side * 0.52;
      g.add(sg);
    });
  } else {
    [-1, 1].forEach((side) => {
      for (let k = 0; k < 3; k++) {
        const st = new THREE.Mesh(new THREE.PlaneGeometry(0.075, 0.95), trimMat);
        st.position.set(-0.15 + k * 0.17, soleTop + 0.62, side * 0.47);
        st.rotation.z = 0.62;
        if (side < 0) st.rotation.y = Math.PI;
        g.add(st);
      }
    });
  }
  g.rotation.y = 0;
  return g;
}

function stick() {
  const g = new THREE.Group();
  const nickel = metal(0xbdb8b0, 0.26);
  const fuchsia = plastic(0xc8236f, 0.35);
  const iron = metal(0x4a4a50, 0.34);
  const body = new THREE.Group();
  // wand
  body.add(at(cyl(0.1, 0.1, 2.4, nickel, 28), 0, -0.1, 0));
  body.add(at(cyl(0.115, 0.115, 0.22, fuchsia, 28), 0, 0.95, 0));
  // motor housing
  body.add(at(lathe([[0, 0], [0.5, 0], [0.58, 0.18], [0.58, 0.85], [0.46, 1.0], [0, 1.0]], iron), 0, 1.06, 0));
  body.add(at(cyl(0.59, 0.59, 0.12, fuchsia, 40), 0, 1.12, 0));
  // dust bin (clear) with visible cyclone
  body.add(at(cyl(0.44, 0.44, 1.0, clearPlastic(0xdff1f7, 0.3), 40), 0, 2.55, 0));
  body.add(at(cyl(0.22, 0.28, 0.9, metal(0x9a9aa2, 0.4), 28), 0, 2.55, 0));
  body.add(at(cyl(0.46, 0.46, 0.1, iron, 40), 0, 3.1, 0));
  // pistol grip
  const grip = new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.12, 16, 40, Math.PI * 1.05), iron);
  grip.rotation.set(0, Math.PI / 2, -Math.PI * 0.55);
  grip.position.set(0, 2.5, -0.1);
  body.add(grip);
  body.add(at(rbox(0.14, 0.4, 0.14, 0.05, fuchsia), 0, 2.58, 0.42));
  body.add(at(rbox(0.5, 0.18, 0.36, 0.06, fuchsia), 0, 1.95, 0.5));
  body.rotation.z = -0.12;
  g.add(body);
  // cleaner head
  g.add(at(rbox(0.3, 0.22, 0.3, 0.07, iron), 0.15, -1.38, 0));
  g.add(at(rbox(1.55, 0.22, 0.6, 0.1, iron), 0.2, -1.6, 0.1));
  g.add(at(rbox(1.5, 0.07, 0.22, 0.03, fuchsia), 0.2, -1.64, 0.34));
  return g;
}

function airwrap() {
  const g = new THREE.Group();
  const nickel = metal(0xcfc9c1, 0.28);
  const copper = metal(0xb87050, 0.3);
  const fuchsia = plastic(0xc8236f, 0.35);
  g.add(at(lathe([[0, 0], [0.24, 0], [0.26, 0.1], [0.24, 1.9], [0.2, 2.0], [0, 2.0]], fuchsia), 0, -1.4, 0));
  g.add(at(cyl(0.4, 0.4, 0.08, nickel, 40), 0, 0.64, 0));
  g.add(at(lathe([[0, 0], [0.45, 0], [0.5, 0.1], [0.5, 0.55], [0.4, 0.65], [0, 0.65]], nickel), 0, 0.68, 0));
  g.add(at(cyl(0.505, 0.505, 0.1, copper, 40), 0, 1.0, 0));
  [-0.17, 0.17].forEach((x) => {
    g.add(at(cyl(0.15, 0.19, 1.35, copper, 28), x * 1.3, 1.95, 0));
    g.add(at(cyl(0.13, 0.15, 0.08, fuchsia, 28), x * 1.3, 2.65, 0));
  });
  g.add(at(rbox(0.1, 0.4, 0.1, 0.04, nickel), 0, -0.2, 0.26));
  return g;
}

function box(p: Product) {
  const g = new THREE.Group();
  const lbl = labelTex(512, 640, ['#14110f', '#3d3833'], [
    { t: p.brand, size: 90, color: '#ffd84d', y: 300 },
  ]);
  const m = new THREE.MeshPhysicalMaterial({ map: lbl, roughness: 0.5, clearcoat: 0.4 });
  const side = plastic(0x14110f, 0.5);
  g.add(new THREE.Mesh(new RoundedBoxGeometry(2.2, 2.6, 1.2, 4, 0.08), [side, side, side, side, m, m]));
  return g;
}

/* ------------------------------------------------------------------ */
/*  Public: build, normalise, shadow                                   */
/* ------------------------------------------------------------------ */

export interface BuiltModel {
  group: THREE.Group;
  /** y of the lowest point, after normalisation */
  floorY: number;
  /** footprint radius */
  radius: number;
}

export function buildModel(p: Product): BuiltModel {
  const a = archetypeOf(p);
  let obj: THREE.Group;
  switch (a) {
    case 'iphone': case 'galaxy': case 'xiaomi': obj = phone(a); break;
    case 'ps5': obj = ps5(); break;
    case 'switch': obj = nswitch(); break;
    case 'macbook': case 'rog': obj = laptop(a); break;
    case 'airpods': obj = airpods(); break;
    case 'headphones': obj = headphones(); break;
    case 'mouse': obj = mouse(); break;
    case 'robot': obj = robot(); break;
    case 'airfryer': obj = airfryer(); break;
    case 'coffee': obj = coffee(); break;
    case 'tumbler': obj = tumbler(); break;
    case 'oil': obj = oil(); break;
    case 'detergent': obj = detergent(); break;
    case 'af1': case 'samba': obj = sneaker(a); break;
    case 'stick': obj = stick(); break;
    case 'airwrap': obj = airwrap(); break;
    default: obj = box(p);
  }

  const wrapper = new THREE.Group();
  wrapper.add(obj);
  const bb = new THREE.Box3().setFromObject(obj);
  const size = bb.getSize(new THREE.Vector3());
  const center = bb.getCenter(new THREE.Vector3());
  const wide = ['macbook', 'rog', 'switch', 'mouse', 'robot', 'af1', 'samba', 'ps5', 'airfryer'].includes(a);
  const tall = ['stick', 'airwrap', 'iphone', 'galaxy', 'xiaomi'].includes(a);
  const target = tall ? 3.95 : wide ? 4.05 : 3.7;
  const s = target / Math.max(size.x, size.y, size.z * 1.0);
  obj.position.sub(center);
  wrapper.scale.setScalar(s);
  return { group: wrapper, floorY: -(size.y * s) / 2, radius: Math.max(size.x, size.z) * s * 0.5 };
}

let shadowTex: THREE.Texture | null = null;
export function contactShadow(radius: number) {
  if (!shadowTex) {
    shadowTex = canvasTex(128, 128, (c) => {
      const g = c.createRadialGradient(64, 64, 4, 64, 64, 64);
      g.addColorStop(0, 'rgba(20,17,15,0.55)');
      g.addColorStop(0.55, 'rgba(20,17,15,0.18)');
      g.addColorStop(1, 'rgba(20,17,15,0)');
      c.fillStyle = g;
      c.fillRect(0, 0, 128, 128);
    });
  }
  const m = new THREE.Mesh(
    new THREE.PlaneGeometry(radius * 2.8, radius * 2.8),
    new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false }),
  );
  m.rotation.x = -Math.PI / 2;
  return m;
}

/** Initial turntable angle so each product reads best in its still. */
export function viewAngleOf(p: Product) {
  const a = archetypeOf(p);
  return a === 'iphone' || a === 'galaxy' || a === 'xiaomi' ? Math.PI - 0.62 : -0.62;
}
