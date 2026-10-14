import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RotateCw, Eye, Sparkles, ZoomIn, ZoomOut } from 'lucide-react';
import { Product } from '../types';

interface Universal3DViewerProps {
  product: Product;
  height?: number;
  autoSpinDefault?: boolean;
}

export const Universal3DViewer: React.FC<Universal3DViewerProps> = ({
  product,
  height = 340,
  autoSpinDefault = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isAutoSpin, setIsAutoSpin] = useState<boolean>(autoSpinDefault);
  const [zoom, setZoom] = useState<number>(1);

  // References for animation and interaction
  const isDraggingRef = useRef<boolean>(false);
  const previousMousePositionRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const modelGroupRef = useRef<THREE.Group | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  // Determine 3D model archetype from product
  const getArchetype = (p: Product) => {
    const id = p.id;
    const cat = p.category;
    const title = p.title.toLowerCase();

    if (id === 'p-1' || title.includes('iphone') || title.includes('galaxy') || title.includes('xiaomi')) return 'phone';
    if (id === 'p-3' || title.includes('playstation') || title.includes('ps5')) return 'ps5';
    if (id === 'p-13' || title.includes('switch')) return 'switch';
    if (id === 'p-7' || title.includes('airpods')) return 'airpods';
    if (id === 'p-17' || title.includes('wh-1000xm5') || title.includes('kulaküstü')) return 'overear';
    if (id === 'p-4' || id === 'p-14' || cat === 'bilgisayar' || title.includes('macbook') || title.includes('laptop')) return 'laptop';
    if (id === 'p-20' || title.includes('mouse') || title.includes('superlight')) return 'mouse';
    if (id === 'p-12' || title.includes('roborock') || title.includes('robot')) return 'robot_vacuum';
    if (id === 'p-6' || title.includes('airfryer')) return 'airfryer';
    if (id === 'p-15' || title.includes('delonghi') || title.includes('kahve')) return 'coffee_machine';
    if (id === 'p-9' || title.includes('stanley') || title.includes('termos')) return 'tumbler';
    if (id === 'p-19' || title.includes('zeytinyağı')) return 'tin_canister';
    if (title.includes('nutella')) return 'jar';
    if (id === 'p-8' || id === 'p-16' || cat === 'moda' || title.includes('nike') || title.includes('samba')) return 'sneaker';
    if (id === 'p-2' || title.includes('dyson v15') || title.includes('süpürge')) return 'dyson_stick';
    return 'package_box';
  };

  const archetype = getArchetype(product);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth || 380;
    const h = height;

    // 1. Scene
    const scene = new THREE.Scene();

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / h, 0.1, 100);
    camera.position.set(0, 0.5, 7.5);
    cameraRef.current = camera;

    // 3. Renderer with antialias and alpha
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 2.8);
    dirLight1.position.set(6, 8, 6);
    scene.add(dirLight1);

    const rimLight = new THREE.DirectionalLight(0x0df5a2, 3.5);
    rimLight.position.set(-6, -2, -4);
    scene.add(rimLight);

    const fillIndigo = new THREE.PointLight(0x6366f1, 2.5, 12);
    fillIndigo.position.set(4, -3, 3);
    scene.add(fillIndigo);

    // 5. Studio Platform (Circular Disc with Neon Rim)
    const platform = new THREE.Group();
    const discGeo = new THREE.CylinderGeometry(3.0, 3.0, 0.05, 64);
    const discMat = new THREE.MeshStandardMaterial({
      color: 0x080c14,
      metalness: 0.85,
      roughness: 0.2,
    });
    const disc = new THREE.Mesh(discGeo, discMat);
    disc.position.y = -2.1;
    platform.add(disc);

    const ringGeo = new THREE.RingGeometry(2.95, 3.05, 64);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x0df5a2, side: THREE.DoubleSide });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = -2.07;
    platform.add(ring);
    scene.add(platform);

    // 6. Build Volumetric 3D Model Group
    const modelGroup = new THREE.Group();
    scene.add(modelGroup);
    modelGroupRef.current = modelGroup;

    // PROCEDURAL 3D MESH GENERATION PER ARCHETYPE
    switch (archetype) {
      case 'phone': {
        // Full 3D Smartphone
        const bodyGeo = new THREE.BoxGeometry(2.1, 4.3, 0.25);
        const titaniumMat = new THREE.MeshStandardMaterial({
          color: archetype === 'phone' && product.title.includes('Samsung') ? 0x94a3b8 : 0xc4b5a2,
          metalness: 0.9,
          roughness: 0.2,
        });
        const body = new THREE.Mesh(bodyGeo, titaniumMat);
        modelGroup.add(body);

        // Screen
        const screenGeo = new THREE.PlaneGeometry(1.98, 4.15);
        const screenMat = new THREE.MeshStandardMaterial({
          color: 0x050811,
          metalness: 0.95,
          roughness: 0.05,
          emissive: 0x0df5a2,
          emissiveIntensity: 0.2,
        });
        const screen = new THREE.Mesh(screenGeo, screenMat);
        screen.position.z = 0.128;
        modelGroup.add(screen);

        // Camera Bump
        const bumpGeo = new THREE.BoxGeometry(1.0, 1.1, 0.14);
        const bump = new THREE.Mesh(bumpGeo, titaniumMat);
        bump.position.set(-0.4, 1.35, -0.18);
        modelGroup.add(bump);

        // Triple Lenses
        const lensCoords = [[-0.6, 1.6, -0.26], [-0.6, 1.15, -0.26], [-0.2, 1.38, -0.26]];
        lensCoords.forEach((coord) => {
          const lensGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.08, 32);
          const lensMat = new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.9, roughness: 0.1 });
          const lens = new THREE.Mesh(lensGeo, lensMat);
          lens.rotation.x = Math.PI / 2;
          lens.position.set(coord[0], coord[1], coord[2]);
          modelGroup.add(lens);
        });
        break;
      }

      case 'ps5': {
        // PS5 Console Sculpture
        const coreGeo = new THREE.BoxGeometry(0.7, 4.2, 2.0);
        const coreMat = new THREE.MeshStandardMaterial({ color: 0x090a12, metalness: 0.8, roughness: 0.3 });
        const core = new THREE.Mesh(coreGeo, coreMat);
        modelGroup.add(core);

        const ledGeo = new THREE.BoxGeometry(0.72, 4.1, 0.05);
        const ledMat = new THREE.MeshBasicMaterial({ color: 0x3b82f6 });
        const led = new THREE.Mesh(ledGeo, ledMat);
        led.position.set(0, 0, 1.0);
        modelGroup.add(led);

        const wingMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, metalness: 0.1, roughness: 0.2 });
        const wingL = new THREE.Mesh(new THREE.BoxGeometry(0.1, 4.6, 2.2), wingMat);
        wingL.position.set(0.42, 0, 0);
        wingL.rotation.z = -0.06;
        modelGroup.add(wingL);

        const wingR = new THREE.Mesh(new THREE.BoxGeometry(0.1, 4.6, 2.2), wingMat);
        wingR.position.set(-0.42, 0, 0);
        wingR.rotation.z = 0.06;
        modelGroup.add(wingR);
        break;
      }

      case 'switch': {
        // Nintendo Switch with Joy-Cons
        const bodyGeo = new THREE.BoxGeometry(3.6, 2.1, 0.28);
        const bodyMat = new THREE.MeshStandardMaterial({ color: 0x18181b, metalness: 0.8, roughness: 0.3 });
        const body = new THREE.Mesh(bodyGeo, bodyMat);
        modelGroup.add(body);

        // OLED Screen
        const screenGeo = new THREE.PlaneGeometry(3.2, 1.9);
        const screenMat = new THREE.MeshStandardMaterial({ color: 0x09090b, emissive: 0x06b6d4, emissiveIntensity: 0.25 });
        const screen = new THREE.Mesh(screenGeo, screenMat);
        screen.position.z = 0.145;
        modelGroup.add(screen);

        // Left Joy-Con (Neon Blue)
        const leftJoyMat = new THREE.MeshStandardMaterial({ color: 0x0ea5e9, roughness: 0.4 });
        const leftJoy = new THREE.Mesh(new THREE.BoxGeometry(0.8, 2.1, 0.34), leftJoyMat);
        leftJoy.position.set(-2.2, 0, 0);
        modelGroup.add(leftJoy);

        // Right Joy-Con (Neon Red)
        const rightJoyMat = new THREE.MeshStandardMaterial({ color: 0xf43f5e, roughness: 0.4 });
        const rightJoy = new THREE.Mesh(new THREE.BoxGeometry(0.8, 2.1, 0.34), rightJoyMat);
        rightJoy.position.set(2.2, 0, 0);
        modelGroup.add(rightJoy);
        break;
      }

      case 'laptop': {
        // Open Laptop 3D Model
        const baseGeo = new THREE.BoxGeometry(3.8, 0.15, 2.6);
        const aluminumMat = new THREE.MeshStandardMaterial({ color: 0xd1d5db, metalness: 0.85, roughness: 0.25 });
        const base = new THREE.Mesh(baseGeo, aluminumMat);
        base.position.y = -0.5;
        modelGroup.add(base);

        // Keyboard area
        const kbGeo = new THREE.PlaneGeometry(3.2, 1.4);
        const kbMat = new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.8 });
        const kb = new THREE.Mesh(kbGeo, kbMat);
        kb.rotation.x = -Math.PI / 2;
        kb.position.set(0, -0.42, 0.2);
        modelGroup.add(kb);

        // Display Screen Lid (Tilted back)
        const lidGroup = new THREE.Group();
        const lidGeo = new THREE.BoxGeometry(3.8, 2.5, 0.1);
        const lid = new THREE.Mesh(lidGeo, aluminumMat);
        lid.position.set(0, 1.25, 0);
        lidGroup.add(lid);

        const screenGeo = new THREE.PlaneGeometry(3.5, 2.2);
        const screenMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, emissive: 0x0df5a2, emissiveIntensity: 0.3 });
        const screen = new THREE.Mesh(screenGeo, screenMat);
        screen.position.set(0, 1.25, 0.055);
        lidGroup.add(screen);

        lidGroup.position.set(0, -0.45, -1.25);
        lidGroup.rotation.x = 0.25;
        modelGroup.add(lidGroup);
        break;
      }

      case 'airpods': {
        // AirPods Pro Earbuds
        const createBud = (x: number, rotZ: number) => {
          const bud = new THREE.Group();
          const head = new THREE.Mesh(new THREE.SphereGeometry(0.65, 32, 32), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.15 }));
          bud.add(head);

          const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 1.3, 32), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.15 }));
          stem.position.set(0.15, -0.85, 0);
          stem.rotation.z = -0.25;
          bud.add(stem);

          const chrome = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.19, 0.18, 32), new THREE.MeshStandardMaterial({ color: 0xd4d4d8, metalness: 0.95 }));
          chrome.position.set(0.32, -1.5, 0);
          chrome.rotation.z = -0.25;
          bud.add(chrome);

          bud.position.x = x;
          bud.rotation.z = rotZ;
          return bud;
        };
        modelGroup.add(createBud(-0.9, 0.2));
        const budR = createBud(0.9, -0.2);
        budR.rotation.y = Math.PI;
        modelGroup.add(budR);
        modelGroup.scale.set(1.3, 1.3, 1.3);
        break;
      }

      case 'overear': {
        // Sony WH-1000XM5 Headphones
        const headphone = new THREE.Group();
        const blackMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.35, metalness: 0.2 });

        // Headband Arch
        const bandGeo = new THREE.TorusGeometry(1.8, 0.16, 16, 64, Math.PI);
        const band = new THREE.Mesh(bandGeo, blackMat);
        band.rotation.z = Math.PI;
        headphone.add(band);

        // Left & Right Earcups
        const cupGeo = new THREE.CylinderGeometry(0.85, 0.85, 0.65, 32);
        const cupL = new THREE.Mesh(cupGeo, blackMat);
        cupL.rotation.z = Math.PI / 2;
        cupL.position.set(-1.8, -0.4, 0);
        headphone.add(cupL);

        const cupR = new THREE.Mesh(cupGeo, blackMat);
        cupR.rotation.z = Math.PI / 2;
        cupR.position.set(1.8, -0.4, 0);
        headphone.add(cupR);

        modelGroup.add(headphone);
        break;
      }

      case 'robot_vacuum': {
        // Roborock Robotic Vacuum
        const bodyGeo = new THREE.CylinderGeometry(2.1, 2.1, 0.6, 64);
        const whiteMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.2, metalness: 0.3 });
        const body = new THREE.Mesh(bodyGeo, whiteMat);
        modelGroup.add(body);

        // LiDAR Turret
        const turretGeo = new THREE.CylinderGeometry(0.6, 0.6, 0.3, 32);
        const turretMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.3 });
        const turret = new THREE.Mesh(turretGeo, turretMat);
        turret.position.set(0, 0.42, 0.3);
        modelGroup.add(turret);

        // Laser Eye Ring
        const laserMat = new THREE.MeshBasicMaterial({ color: 0xf43f5e });
        const laserRing = new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.04, 16, 32), laserMat);
        laserRing.rotation.x = Math.PI / 2;
        laserRing.position.set(0, 0.45, 0.3);
        modelGroup.add(laserRing);

        modelGroup.rotation.x = 0.55;
        break;
      }

      case 'airfryer': {
        // Philips Airfryer XXL
        const fryerMat = new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.25, metalness: 0.7 });
        const mainBody = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.8, 3.2, 32), fryerMat);
        modelGroup.add(mainBody);

        // Handle
        const handleMat = new THREE.MeshStandardMaterial({ color: 0x27272a, metalness: 0.8 });
        const handle = new THREE.Mesh(new THREE.BoxGeometry(0.3, 1.6, 0.6), handleMat);
        handle.position.set(0, -0.4, 1.9);
        modelGroup.add(handle);

        // Digital LED Display
        const ledMat = new THREE.MeshBasicMaterial({ color: 0x0df5a2 });
        const led = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 0.5), ledMat);
        led.position.set(0, 0.8, 1.62);
        modelGroup.add(led);
        break;
      }

      case 'tumbler': {
        // Stanley Quencher Termos
        const tumblerMat = new THREE.MeshStandardMaterial({ color: 0xe0e7ff, metalness: 0.85, roughness: 0.15 });
        const cup = new THREE.Mesh(new THREE.CylinderGeometry(1.3, 0.9, 3.4, 32), tumblerMat);
        modelGroup.add(cup);

        // Lid
        const lidMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.4 });
        const lid = new THREE.Mesh(new THREE.CylinderGeometry(1.35, 1.35, 0.4, 32), lidMat);
        lid.position.y = 1.85;
        modelGroup.add(lid);

        // Straw
        const strawMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.1 });
        const straw = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 2.2, 16), strawMat);
        straw.position.set(0.4, 2.7, 0);
        straw.rotation.z = -0.15;
        modelGroup.add(straw);

        // Handle
        const handle = new THREE.Mesh(new THREE.BoxGeometry(0.25, 2.2, 0.8), lidMat);
        handle.position.set(1.45, 0.4, 0);
        modelGroup.add(handle);
        break;
      }

      case 'tin_canister': {
        // Yudum 5L Zeytinyağı Tenekesi
        const tinMat = new THREE.MeshStandardMaterial({ color: 0xca8a04, metalness: 0.9, roughness: 0.2 });
        const can = new THREE.Mesh(new THREE.BoxGeometry(1.8, 3.6, 1.8), tinMat);
        modelGroup.add(can);

        // Red Pour Cap
        const capMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
        const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.3, 16), capMat);
        cap.position.set(0.45, 1.9, 0.45);
        modelGroup.add(cap);

        // Wire handle
        const handleMat = new THREE.MeshStandardMaterial({ color: 0x52525b, metalness: 0.95 });
        const handle = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.06, 16, 32), handleMat);
        handle.rotation.x = Math.PI / 2;
        handle.position.set(0, 1.9, 0);
        modelGroup.add(handle);
        break;
      }

      case 'jar': {
        // Nutella Glass Jar with White Ribbed Lid
        const glassMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.15, metalness: 0.3 });
        const jar = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.25, 2.6, 32), glassMat);
        modelGroup.add(jar);

        const whiteLid = new THREE.Mesh(new THREE.CylinderGeometry(1.45, 1.45, 0.6, 32), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 }));
        whiteLid.position.y = 1.5;
        modelGroup.add(whiteLid);
        break;
      }

      case 'sneaker': {
        // 3D Sneaker Sculpture
        const shoe = new THREE.Group();
        const soleMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.6 });
        const upperMat = new THREE.MeshStandardMaterial({ color: product.title.includes('Samba') ? 0x27272a : 0xf1f5f9, roughness: 0.4 });

        // Sole
        const sole = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.5, 3.6), soleMat);
        sole.position.y = -0.6;
        shoe.add(sole);

        // Upper body
        const upper = new THREE.Mesh(new THREE.BoxGeometry(1.3, 1.2, 3.2), upperMat);
        upper.position.set(0, 0.2, -0.1);
        shoe.add(upper);

        // Toe box curve
        const toe = new THREE.Mesh(new THREE.SphereGeometry(0.65, 16, 16), upperMat);
        toe.scale.set(1, 0.8, 1.4);
        toe.position.set(0, 0, 1.4);
        shoe.add(toe);

        shoe.rotation.y = Math.PI / 4;
        shoe.rotation.x = 0.2;
        modelGroup.add(shoe);
        break;
      }

      default: {
        // Packaged Electronics / Supermarket Box
        const boxMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.6, roughness: 0.3 });
        const box = new THREE.Mesh(new THREE.BoxGeometry(2.4, 3.2, 1.4), boxMat);
        modelGroup.add(box);

        const badgeMat = new THREE.MeshBasicMaterial({ color: 0x0df5a2 });
        const badge = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 0.4), badgeMat);
        badge.position.set(0, 0.8, 0.71);
        modelGroup.add(badge);
        break;
      }
    }

    // Initial rotation angles
    modelGroup.rotation.y = -Math.PI / 6;
    modelGroup.rotation.x = 0.1;

    // 7. Mouse Drag Interactions
    const onMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current || !modelGroup) return;
      const deltaX = e.clientX - previousMousePositionRef.current.x;
      const deltaY = e.clientY - previousMousePositionRef.current.y;

      modelGroup.rotation.y += deltaX * 0.012;
      modelGroup.rotation.x += deltaY * 0.007;

      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDraggingRef.current = false;
    };

    // Touch support
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

      modelGroup.rotation.y += deltaX * 0.012;
      modelGroup.rotation.x += deltaY * 0.007;

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
        modelGroup.rotation.y += 0.014;
        modelGroup.position.y = Math.sin(Date.now() * 0.002) * 0.08;
      }

      platform.rotation.y -= 0.003;
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!containerRef.current || !renderer || !camera) return;
      const newW = containerRef.current.clientWidth;
      camera.aspect = newW / h;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, h);
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
  }, [archetype, isAutoSpin, height]);

  const handleZoomIn = () => {
    if (cameraRef.current) {
      cameraRef.current.position.z = Math.max(cameraRef.current.position.z - 0.8, 4.5);
    }
  };

  const handleZoomOut = () => {
    if (cameraRef.current) {
      cameraRef.current.position.z = Math.min(cameraRef.current.position.z + 0.8, 11);
    }
  };

  return (
    <div className="relative w-full rounded-3xl bg-gradient-to-b from-obsidian-950 via-obsidian-900 to-obsidian-950 border border-white/10 overflow-hidden cyber-border-gradient">
      {/* 3D Canvas Mount Point */}
      <div
        ref={containerRef}
        style={{ height: `${height}px` }}
        className="w-full cursor-grab active:cursor-grabbing flex items-center justify-center relative"
      />

      {/* Floating 3D Telemetry Overlay */}
      <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-obsidian-950/80 backdrop-blur-md px-2.5 py-1 rounded-xl border border-white/10 text-[10px] font-mono text-cyber-emerald pointer-events-none">
        <Sparkles size={11} className="animate-spin-slow" />
        <span>3D_CAD // {archetype.toUpperCase()}</span>
      </div>

      {/* 3D Controls Bar */}
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2 z-10">
        <button
          onClick={() => setIsAutoSpin(!isAutoSpin)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-mono font-bold transition-all border ${
            isAutoSpin
              ? 'bg-cyber-emerald/15 border-cyber-emerald/50 text-cyber-emerald'
              : 'bg-obsidian-950/90 border-white/10 text-slate-400 hover:text-white'
          }`}
        >
          <RotateCw size={11} className={isAutoSpin ? 'animate-spin' : ''} />
          <span>{isAutoSpin ? '3D Dönüş Açık' : 'Dönüşü Başlat'}</span>
        </button>

        <div className="flex items-center gap-1 bg-obsidian-950/90 border border-white/10 p-1 rounded-xl">
          <button
            onClick={handleZoomIn}
            className="p-1 hover:text-cyber-emerald text-slate-400 transition-colors"
            title="Yakınlaştır"
          >
            <ZoomIn size={13} />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-1 hover:text-cyber-emerald text-slate-400 transition-colors"
            title="Uzaklaştır"
          >
            <ZoomOut size={13} />
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-1 text-[10px] font-mono text-slate-400 bg-obsidian-950/80 px-2 py-1 rounded-lg border border-white/5 pointer-events-none">
          <Eye size={11} className="text-cyber-emerald" />
          <span>360° Çevir</span>
        </div>
      </div>
    </div>
  );
};
