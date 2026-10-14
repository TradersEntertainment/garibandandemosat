import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { useEffect, useState } from 'react';
import type { Product } from '../types';
import { buildModel, contactShadow, viewAngleOf } from './models';

/** Flat tile colour baked into stills so cards need no transparency (small JPEGs). */
export const TILE_BG = '#ece6d6';

/* ------------------------------------------------------------------ */
/*  Shared studio                                                      */
/* ------------------------------------------------------------------ */

let sharedRenderer: THREE.WebGLRenderer | null = null;
// A PMREM texture belongs to one WebGL context, so keep one per renderer.
const envCache = new WeakMap<THREE.WebGLRenderer, THREE.Texture>();

function ensureEnv(renderer: THREE.WebGLRenderer) {
  let tex = envCache.get(renderer);
  if (!tex) {
    const pmrem = new THREE.PMREMGenerator(renderer);
    const room = new RoomEnvironment();
    tex = pmrem.fromScene(room, 0.04).texture;
    room.dispose();
    pmrem.dispose();
    envCache.set(renderer, tex);
  }
  return tex;
}

export function disposeEnv(renderer: THREE.WebGLRenderer) {
  envCache.get(renderer)?.dispose();
  envCache.delete(renderer);
}

function configure(r: THREE.WebGLRenderer) {
  r.outputColorSpace = THREE.SRGBColorSpace;
  r.toneMapping = THREE.ACESFilmicToneMapping;
  r.toneMappingExposure = 1.05;
}

export function createStudio(renderer: THREE.WebGLRenderer, product: Product) {
  const scene = new THREE.Scene();
  scene.environment = ensureEnv(renderer);
  scene.environmentIntensity = 0.95;

  const key = new THREE.DirectionalLight(0xfff4e2, 1.6);
  key.position.set(-4, 6, 5);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xdfeaff, 0.8);
  rim.position.set(5, 2, -4);
  scene.add(rim);

  const built = buildModel(product);
  const pivot = new THREE.Group();
  pivot.add(built.group);
  scene.add(pivot);

  const shadow = contactShadow(built.radius);
  shadow.position.y = built.floorY - 0.02;
  scene.add(shadow);

  const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 100);
  camera.position.set(0, 0.9, 11);
  camera.lookAt(0, -0.05, 0);

  return { scene, camera, pivot, shadow, built };
}

export function disposeStudio(scene: THREE.Scene) {
  scene.traverse((o) => {
    const mesh = o as THREE.Mesh;
    if (mesh.geometry) mesh.geometry.dispose();
    const mat = mesh.material as THREE.Material | THREE.Material[] | undefined;
    if (!mat) return;
    (Array.isArray(mat) ? mat : [mat]).forEach((m) => {
      const map = (m as THREE.MeshStandardMaterial).map;
      // the contact-shadow texture is shared & cached; every other map is per-product
      if (map && !m.transparent) map.dispose();
      m.dispose();
    });
  });
}

function getRenderer() {
  if (!sharedRenderer) {
    const canvas = document.createElement('canvas');
    sharedRenderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, preserveDrawingBuffer: false });
    sharedRenderer.setPixelRatio(1);
    configure(sharedRenderer);
  }
  return sharedRenderer;
}

/* ------------------------------------------------------------------ */
/*  Serial job queue (yields to the main thread between renders)       */
/* ------------------------------------------------------------------ */

let chain: Promise<unknown> = Promise.resolve();
const enqueue = <T,>(job: () => T): Promise<T> => {
  const p = chain.then(() => new Promise<T>((res) => setTimeout(() => res(job()), 0)));
  chain = p.catch(() => undefined);
  return p;
};

function renderAngles(product: Product, size: number, angles: number[], quality: number): string[] {
  const r = getRenderer();
  r.setSize(size, size, false);
  r.setClearColor(new THREE.Color(TILE_BG), 1);
  const { scene, camera, pivot } = createStudio(r, product);
  const out: string[] = [];
  for (const a of angles) {
    pivot.rotation.set(0.08, a, 0);
    r.render(scene, camera);
    out.push(r.domElement.toDataURL('image/jpeg', quality));
  }
  disposeStudio(scene);
  return out;
}

/* ------------------------------------------------------------------ */
/*  Public API                                                         */
/* ------------------------------------------------------------------ */

const stills = new Map<string, Promise<string>>();
const frames = new Map<string, Promise<string[]>>();


export function getStill(product: Product): Promise<string> {
  let p = stills.get(product.id);
  if (!p) {
    p = enqueue(() => renderAngles(product, 520, [viewAngleOf(product)], 0.9)[0]);
    stills.set(product.id, p);
  }
  return p;
}

export function getFrames(product: Product, count = 24): Promise<string[]> {
  let p = frames.get(product.id);
  if (!p) {
    const angles = Array.from({ length: count }, (_, i) => viewAngleOf(product) + (i / count) * Math.PI * 2);
    p = enqueue(() => renderAngles(product, 380, angles, 0.82));
    frames.set(product.id, p);
  }
  return p;
}

export function useStill(product: Product, enabled = true) {
  const [src, setSrc] = useState<string | null>(null);
  useEffect(() => {
    if (!enabled) return;
    let live = true;
    getStill(product).then((s) => live && setSrc(s));
    return () => {
      live = false;
    };
  }, [product, enabled]);
  return src;
}



