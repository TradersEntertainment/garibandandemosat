import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Minus, Pause, Play, Plus } from 'lucide-react';
import type { Product } from '../types';
import { createStudio, disposeEnv, disposeStudio } from '../lib/renderer';
import { viewAngleOf } from '../lib/models';

interface Props {
  product: Product;
  className?: string;
  /** show zoom / play controls */
  controls?: boolean;
}

/** Live, draggable 3D view. Use sparingly — one WebGL context per instance. */
export function Viewer3D({ product, className = 'relative h-full w-full', controls = true }: Props) {
  const host = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(true);
  const api = useRef<{ controls?: OrbitControls; camera?: THREE.PerspectiveCamera }>({});
  const playingRef = useRef(true);
  playingRef.current = playing;

  useEffect(() => {
    const el = host.current;
    if (!el) return;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);
    renderer.domElement.style.cssText = 'width:100%;height:100%;display:block;touch-action:pan-y';

    const { scene, camera, pivot } = createStudio(renderer, product);
    pivot.rotation.set(0.08, viewAngleOf(product), 0);
    camera.position.setLength(12.6);

    const oc = new OrbitControls(camera, renderer.domElement);
    oc.target.set(0, -0.05, 0);
    oc.enablePan = false;
    oc.enableZoom = false;
    oc.enableDamping = true;
    oc.dampingFactor = 0.08;
    oc.autoRotate = true;
    oc.autoRotateSpeed = 2.2;
    oc.minPolarAngle = Math.PI * 0.28;
    oc.maxPolarAngle = Math.PI * 0.56;
    api.current = { controls: oc, camera };

    const resize = () => {
      const w = el.clientWidth || 1;
      const h = el.clientHeight || 1;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);

    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { threshold: 0.01 });
    io.observe(el);

    let raf = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      if (!visible || document.hidden) return;
      oc.autoRotate = playingRef.current;
      oc.update();
      renderer.render(scene, camera);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      oc.dispose();
      disposeStudio(scene);
      disposeEnv(renderer);
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    };
  }, [product]);

  const zoom = (dir: 1 | -1) => {
    const { camera, controls: c } = api.current;
    if (!camera || !c) return;
    const d = camera.position.distanceTo(c.target);
    const next = THREE.MathUtils.clamp(d - dir * 1.8, 6.5, 15);
    camera.position.sub(c.target).setLength(next).add(c.target);
  };

  return (
    <div className={className}>
      <div ref={host} className="absolute inset-0 cursor-grab active:cursor-grabbing" aria-label={`${product.title} 3D model`} />
      {controls && (
        <div className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full border border-line bg-card/90 p-1 shadow-card backdrop-blur">
          <button className="grid h-8 w-8 place-items-center rounded-full hover:bg-paper-2" onClick={() => setPlaying((p) => !p)} aria-label={playing ? 'Dönmeyi durdur' : 'Döndür'}>
            {playing ? <Pause size={15} /> : <Play size={15} />}
          </button>
          <button className="grid h-8 w-8 place-items-center rounded-full hover:bg-paper-2" onClick={() => zoom(1)} aria-label="Yakınlaştır">
            <Plus size={15} />
          </button>
          <button className="grid h-8 w-8 place-items-center rounded-full hover:bg-paper-2" onClick={() => zoom(-1)} aria-label="Uzaklaştır">
            <Minus size={15} />
          </button>
        </div>
      )}
    </div>
  );
}





