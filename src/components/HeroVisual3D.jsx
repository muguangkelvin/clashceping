import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function HeroVisual3D() {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Canvas & Scene setup
    const container = containerRef.current;
    const width = container.clientWidth || 400;
    const height = container.clientHeight || 320;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Glowing Sphere (representing Proxy Node Hub)
    const geometry = new THREE.IcosahedronGeometry(1.6, 2);
    const material = new THREE.MeshBasicMaterial({
      color: 0x0c8ee9,
      wireframe: true,
      transparent: true,
      opacity: 0.75,
    });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    // Inner Core
    const coreGeo = new THREE.IcosahedronGeometry(0.9, 1);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0xf97316,
      wireframe: true,
      transparent: true,
      opacity: 0.9,
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    scene.add(core);

    // Orbital Rings
    const ringGeo = new THREE.RingGeometry(2.2, 2.25, 64);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, side: THREE.DoubleSide, transparent: true, opacity: 0.4 });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 3;
    scene.add(ring);

    // Animation Loop
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      sphere.rotation.x += 0.003;
      sphere.rotation.y += 0.005;
      core.rotation.x -= 0.004;
      core.rotation.y -= 0.006;
      ring.rotation.z += 0.002;
      renderer.render(scene, camera);
    };
    animate();

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      coreGeo.dispose();
      coreMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-[320px] md:h-[400px] flex items-center justify-center">
      <div ref={containerRef} className="w-full h-full" />
      <div className="absolute bottom-2 text-center pointer-events-none">
        <span className="text-xs px-3 py-1 rounded-full bg-slate-800/80 text-brand-400 border border-brand-500/30">
          3D IEPL 节点链路拓扑监测中
        </span>
      </div>
    </div>
  );
}
