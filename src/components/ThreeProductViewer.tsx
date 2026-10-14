import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RotateCw, Sparkles, Zap, ShieldCheck, ChevronRight, Eye } from 'lucide-react';

interface ThreeProductViewerProps {
  onSelectProductDetails?: (productId: string) => void;
}

export const ThreeProductViewer: React.FC<ThreeProductViewerProps> = ({ onSelectProductDetails }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeModel, setActiveModel] = useState<'iphone' | 'ps5' | 'airpods'>('iphone');
  const [isAutoSpin, setIsAutoSpin] = useState<boolean>(true);
  const [rotationSpeed, setRotationSpeed] = useState<number>(0.012);

  // References for Three.js objects
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const currentMeshGroupRef = useRef<THREE.Group | null>(null);
  const isDraggingRef = useRef<boolean>(false);
  const previousMousePositionRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Product metadata
  const modelsData = {
    iphone: {
      id: 'p-1',
      name: 'Apple iPhone 16 Pro 256GB',
      sub: 'Çöl Titanyum • A18 Pro',
      lowestPrice: 77499,
      marketPrice: 84999,
      cheapestStore: 'Amazon TR',
      arbitrage: 7500,
      specs: '6.3" Super Retina OLED • Titanyum Çerçeve • 48MP Fusion'
    },
    ps5: {
      id: 'p-3',
      name: 'Sony PlayStation 5 Slim 1TB',
      sub: 'Digital Edition • 4K 120Hz',
      lowestPrice: 18499,
      marketPrice: 23999,
      cheapestStore: 'N11',
      arbitrage: 5500,
      specs: '1TB Ultra Hızlı SSD • Ray Tracing • DualSense'
    },
    airpods: {
      id: 'p-7',
      name: 'Apple AirPods Pro 2. Nesil',
      sub: 'USB-C MagSafe • Aktif ANC',
      lowestPrice: 8499,
      marketPrice: 10499,
      cheapestStore: 'Amazon TR',
      arbitrage: 2000,
      specs: 'H2 Çip • 2 Kat Daha Güçlü ANC • 30 Saat Pil'
    }
  };

  const currentData = modelsData[activeModel];

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight || 420;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.5);

    // 3. Renderer with antialias and alpha
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 2.5);
    dirLight1.position.set(5, 8, 5);
    scene.add(dirLight1);

    const rimLightCyber = new THREE.DirectionalLight(0x0df5a2, 3.2);
    rimLightCyber.position.set(-6, -2, -4);
    scene.add(rimLightCyber);

    const accentLightIndigo = new THREE.PointLight(0x6366f1, 2.8, 15);
    accentLightIndigo.position.set(4, -3, 3);
    scene.add(accentLightIndigo);

    // 5. Studio Platform (Circular Neon Disc)
    const platformGroup = new THREE.Group();
    const discGeo = new THREE.CylinderGeometry(3.2, 3.2, 0.05, 64);
    const discMat = new THREE.MeshStandardMaterial({
      color: 0x080c14,
      metalness: 0.9,
      roughness: 0.2,
    });
    const disc = new THREE.Mesh(discGeo, discMat);
    disc.position.y = -2.3;
    platformGroup.add(disc);

    // Ring Outer Glow
    const ringGeo = new THREE.RingGeometry(3.15, 3.25, 64);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x0df5a2, side: THREE.DoubleSide });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = -2.27;
    platformGroup.add(ring);

    scene.add(platformGroup);

    // 6. Build 3D Models
    const modelGroup = new THREE.Group();
    scene.add(modelGroup);
    currentMeshGroupRef.current = modelGroup;

    const buildCurrentModel = () => {
      // Clear previous children
      while (modelGroup.children.length > 0) {
        modelGroup.remove(modelGroup.children[0]);
      }

      if (activeModel === 'iphone') {
        // iPhone 16 Pro Procedural 3D Mesh
        const phone = new THREE.Group();

        // Titanium Body Chassis (Box with chamfered look)
        const bodyGeo = new THREE.BoxGeometry(2.3, 4.6, 0.28);
        const titaniumMat = new THREE.MeshStandardMaterial({
          color: 0xc8b29e, // Desert Titanium warm bronze-gold
          metalness: 0.85,
          roughness: 0.25,
        });
        const body = new THREE.Mesh(bodyGeo, titaniumMat);
        phone.add(body);

        // Screen (Front)
        const screenGeo = new THREE.PlaneGeometry(2.18, 4.45);
        const screenMat = new THREE.MeshStandardMaterial({
          color: 0x070b14,
          roughness: 0.1,
          metalness: 0.9,
          emissive: 0x0df5a2,
          emissiveIntensity: 0.15,
        });
        const screen = new THREE.Mesh(screenGeo, screenMat);
        screen.position.z = 0.142;
        phone.add(screen);

        // Dynamic Island Pill
        const pillGeo = new THREE.CapsuleGeometry(0.08, 0.35, 10, 16);
        const pillMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
        const pill = new THREE.Mesh(pillGeo, pillMat);
        pill.rotation.z = Math.PI / 2;
        pill.position.set(0, 1.85, 0.145);
        phone.add(pill);

        // Camera Bump Plateau
        const bumpGeo = new THREE.BoxGeometry(1.1, 1.15, 0.16);
        const bumpMat = new THREE.MeshStandardMaterial({
          color: 0xb59f8a,
          metalness: 0.85,
          roughness: 0.3,
        });
        const bump = new THREE.Mesh(bumpGeo, bumpMat);
        bump.position.set(-0.45, 1.45, -0.2);
        phone.add(bump);

        // Triple Camera Lenses
        const lensPos = [
          [-0.65, 1.7, -0.3],
          [-0.65, 1.2, -0.3],
          [-0.25, 1.45, -0.3],
        ];
        lensPos.forEach((pos) => {
          const lensRingGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.12, 32);
          const lensRingMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, metalness: 0.9, roughness: 0.1 });
          const lensRing = new THREE.Mesh(lensRingGeo, lensRingMat);
          lensRing.rotation.x = Math.PI / 2;
          lensRing.position.set(pos[0], pos[1], pos[2]);

          const glassGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.13, 32);
          const glassMat = new THREE.MeshStandardMaterial({ color: 0x051a24, metalness: 1.0, roughness: 0.05 });
          const glass = new THREE.Mesh(glassGeo, glassMat);
          glass.rotation.x = Math.PI / 2;
          glass.position.set(pos[0], pos[1], pos[2] - 0.01);

          phone.add(lensRing);
          phone.add(glass);
        });

        phone.rotation.y = -Math.PI / 6;
        phone.rotation.x = 0.15;
        modelGroup.add(phone);
      } else if (activeModel === 'ps5') {
        // PlayStation 5 Slim 3D Sculpture
        const ps5 = new THREE.Group();

        // Dark Central Core Console
        const coreGeo = new THREE.BoxGeometry(0.7, 4.4, 2.2);
        const coreMat = new THREE.MeshStandardMaterial({
          color: 0x090a10,
          roughness: 0.3,
          metalness: 0.8,
        });
        const core = new THREE.Mesh(coreGeo, coreMat);
        ps5.add(core);

        // Futuristic Blue LED light stripe
        const ledGeo = new THREE.BoxGeometry(0.72, 4.3, 0.05);
        const ledMat = new THREE.MeshBasicMaterial({ color: 0x3b82f6 });
        const led = new THREE.Mesh(ledGeo, ledMat);
        led.position.set(0, 0, 1.08);
        ps5.add(led);

        // Outer Curved White Shell Wings (Left & Right)
        const wingMat = new THREE.MeshStandardMaterial({
          color: 0xf3f4f6,
          roughness: 0.2,
          metalness: 0.1,
        });

        const wingLeftGeo = new THREE.BoxGeometry(0.12, 4.8, 2.4);
        const wingLeft = new THREE.Mesh(wingLeftGeo, wingMat);
        wingLeft.position.set(0.44, 0, 0);
        wingLeft.rotation.z = -0.05;
        ps5.add(wingLeft);

        const wingRightGeo = new THREE.BoxGeometry(0.12, 4.8, 2.4);
        const wingRight = new THREE.Mesh(wingRightGeo, wingMat);
        wingRight.position.set(-0.44, 0, 0);
        wingRight.rotation.z = 0.05;
        ps5.add(wingRight);

        ps5.rotation.y = Math.PI / 4;
        modelGroup.add(ps5);
      } else {
        // AirPods Pro 2 3D Model
        const pods = new THREE.Group();

        // Earbud 1
        const createBud = (xOffset: number, rotZ: number) => {
          const bud = new THREE.Group();
          // Head
          const headGeo = new THREE.SphereGeometry(0.65, 32, 32);
          const whiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.15, metalness: 0.1 });
          const head = new THREE.Mesh(headGeo, whiteMat);
          bud.add(head);

          // Stem
          const stemGeo = new THREE.CylinderGeometry(0.18, 0.18, 1.4, 32);
          const stem = new THREE.Mesh(stemGeo, whiteMat);
          stem.position.set(0.15, -0.9, 0);
          stem.rotation.z = -0.25;
          bud.add(stem);

          // Chrome base tip
          const tipGeo = new THREE.CylinderGeometry(0.19, 0.19, 0.18, 32);
          const chromeMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.95, roughness: 0.1 });
          const tip = new THREE.Mesh(tipGeo, chromeMat);
          tip.position.set(0.32, -1.55, 0);
          tip.rotation.z = -0.25;
          bud.add(tip);

          bud.position.x = xOffset;
          bud.rotation.z = rotZ;
          return bud;
        };

        const budLeft = createBud(-0.9, 0.2);
        const budRight = createBud(0.9, -0.2);
        budRight.rotation.y = Math.PI;

        pods.add(budLeft);
        pods.add(budRight);
        pods.scale.set(1.4, 1.4, 1.4);
        modelGroup.add(pods);
      }
    };

    buildCurrentModel();

    // 7. Mouse Drag Interactions
    const onMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current || !modelGroup) return;
      const deltaX = e.clientX - previousMousePositionRef.current.x;
      const deltaY = e.clientY - previousMousePositionRef.current.y;

      modelGroup.rotation.y += deltaX * 0.01;
      modelGroup.rotation.x += deltaY * 0.005;

      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDraggingRef.current = false;
    };

    // Touch Support
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDraggingRef.current = true;
        previousMousePositionRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isDraggingRef.current || !modelGroup || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - previousMousePositionRef.current.x;
      const deltaY = e.touches[0].clientY - previousMousePositionRef.current.y;

      modelGroup.rotation.y += deltaX * 0.01;
      modelGroup.rotation.x += deltaY * 0.005;

      previousMousePositionRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const onTouchEnd = () => {
      isDraggingRef.current = false;
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    container.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);

    // 8. Animation Loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (modelGroup && isAutoSpin && !isDraggingRef.current) {
        modelGroup.rotation.y += rotationSpeed;
        // Subtle floating bob
        modelGroup.position.y = Math.sin(Date.now() * 0.002) * 0.12;
      }

      // Rotate disc platform slowly
      platformGroup.rotation.y -= 0.003;

      renderer.render(scene, camera);
    };

    animate();

    // 9. Resize Listener
    const handleResize = () => {
      if (!containerRef.current || !renderer || !camera) return;
      const newW = containerRef.current.clientWidth;
      const newH = containerRef.current.clientHeight || 420;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      container.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      renderer.dispose();
    };
  }, [activeModel, isAutoSpin, rotationSpeed]);

  return (
    <div className="relative w-full rounded-3xl bg-gradient-to-b from-obsidian-850 via-obsidian-900 to-obsidian-950 border border-white/10 p-5 sm:p-7 shadow-2xl overflow-hidden cyber-border-gradient">
      {/* Background Ambience */}
      <div className="absolute -top-24 -left-24 w-80 h-80 bg-cyber-emerald/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-cyber-indigo/20 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top Header & Telemetry */}
      <div className="flex flex-wrap items-center justify-between gap-4 z-10 relative">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyber-emerald/10 border border-cyber-emerald/40 text-cyber-emerald text-[11px] font-mono font-bold tracking-wider uppercase">
              <span className="w-2 h-2 rounded-full bg-cyber-emerald animate-ping"></span>
              3D Canlı Fiyat & Model Simülatörü
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              [WEBGL_ACCELERATED]
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2 font-display">
            <span>{currentData.name}</span>
          </h3>
          <p className="text-xs text-slate-400 font-mono">{currentData.sub} • {currentData.specs}</p>
        </div>

        {/* Model Selector Tabs */}
        <div className="flex items-center bg-obsidian-950 p-1 rounded-2xl border border-white/10 text-xs font-bold">
          <button
            onClick={() => setActiveModel('iphone')}
            className={`px-3.5 py-2 rounded-xl transition-all ${
              activeModel === 'iphone'
                ? 'bg-cyber-emerald text-obsidian-950 font-black shadow-lg shadow-cyber-emerald/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            iPhone 16 Pro
          </button>
          <button
            onClick={() => setActiveModel('ps5')}
            className={`px-3.5 py-2 rounded-xl transition-all ${
              activeModel === 'ps5'
                ? 'bg-cyber-emerald text-obsidian-950 font-black shadow-lg shadow-cyber-emerald/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            PS5 Slim
          </button>
          <button
            onClick={() => setActiveModel('airpods')}
            className={`px-3.5 py-2 rounded-xl transition-all ${
              activeModel === 'airpods'
                ? 'bg-cyber-emerald text-obsidian-950 font-black shadow-lg shadow-cyber-emerald/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            AirPods Pro 2
          </button>
        </div>
      </div>

      {/* 3D Canvas Container */}
      <div className="relative w-full h-80 sm:h-96 my-2 cursor-grab active:cursor-grabbing flex items-center justify-center">
        {/* Three.js DOM Element mounts here */}
        <div ref={containerRef} className="w-full h-full" />

        {/* Orbiting Live Store Badges (Simulating 3D Spatial Anchors) */}
        <div className="absolute top-6 left-2 sm:left-6 cyber-glass p-3 rounded-2xl border border-cyber-emerald/30 shadow-xl pointer-events-none transform hover:scale-105 transition-all">
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-cyber-emerald font-bold uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-cyber-emerald"></span>
            {currentData.cheapestStore} (En Dip)
          </div>
          <div className="text-lg font-black text-white font-mono">
            ₺{currentData.lowestPrice.toLocaleString('tr-TR')}
          </div>
          <div className="text-[10px] text-cyber-emerald font-semibold">
            ✓ Ücretsiz Kargo
          </div>
        </div>

        <div className="absolute bottom-10 right-2 sm:right-6 cyber-glass p-3 rounded-2xl border border-rose-500/30 shadow-xl pointer-events-none">
          <div className="text-[10px] font-mono text-slate-400 uppercase">
            Zincir Mağaza Ortalaması
          </div>
          <div className="text-sm font-black text-slate-300 line-through font-mono">
            ₺{currentData.marketPrice.toLocaleString('tr-TR')}
          </div>
          <div className="text-[11px] font-black text-cyber-emerald mt-0.5">
            +₺{currentData.arbitrage.toLocaleString('tr-TR')} Cepte Kalıyor!
          </div>
        </div>

        {/* Helper instruction */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-obsidian-950/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-[11px] font-mono text-slate-400 flex items-center gap-1.5 pointer-events-none">
          <Eye size={12} className="text-cyber-emerald" />
          <span>Fareyle tutup 360° çevirebilirsiniz</span>
        </div>
      </div>

      {/* Footer Controls & CTA */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/10 relative z-10">
        <div className="flex items-center gap-2">
          {/* Auto Spin Toggle */}
          <button
            onClick={() => setIsAutoSpin(!isAutoSpin)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all border ${
              isAutoSpin
                ? 'bg-cyber-emerald/15 border-cyber-emerald/50 text-cyber-emerald'
                : 'bg-obsidian-950 border-white/10 text-slate-400 hover:text-white'
            }`}
          >
            <RotateCw size={13} className={isAutoSpin ? 'animate-spin' : ''} />
            <span>{isAutoSpin ? 'Otomatik Dönüş: Açık' : 'Otomatik Dönüş: Durduruldu'}</span>
          </button>
        </div>

        {/* Action Button */}
        <button
          onClick={() => onSelectProductDetails && onSelectProductDetails(currentData.id)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyber-emerald hover:bg-cyber-mint text-obsidian-950 font-black text-xs uppercase tracking-wider transition-all transform active:scale-95 shadow-xl shadow-cyber-emerald/20"
        >
          <span>Bu Ürünün Tüm Mağaza Fiyatlarını Gör</span>
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
};
