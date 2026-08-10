import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

/**
 * 3D Interactive Medical Spiral / Helix Emblem.
 * Built with pure Three.js for seamless zero-dependency rendering.
 */
export function Emblem3D({ width = 176, height = 110 }) {
  const mountRef = useRef(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let animId = null;
    let renderer = null;
    let scene = null;
    let camera = null;
    let mesh = null;
    let ringMesh = null;

    try {
      const w = typeof width === "number" ? width : parseInt(width, 10) || 176;
      const h = typeof height === "number" ? height : parseInt(height, 10) || 110;

      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
      camera.position.z = 7;

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(w, h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      container.appendChild(renderer.domElement);

      const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
      scene.add(ambientLight);

      const dirLight = new THREE.DirectionalLight(0x38bdf8, 2.5);
      dirLight.position.set(5, 5, 5);
      scene.add(dirLight);

      const pointLight = new THREE.PointLight(0x10b981, 2, 10);
      pointLight.position.set(-4, -3, 3);
      scene.add(pointLight);

      const geometry = new THREE.TorusKnotGeometry(1.6, 0.42, 96, 16, 2, 3);
      const material = new THREE.MeshStandardMaterial({
        color: 0x0284c7,
        metalness: 0.85,
        roughness: 0.18,
        emissive: 0x0369a1,
        emissiveIntensity: 0.4,
      });
      mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      const ringGeo = new THREE.TorusGeometry(2.4, 0.05, 16, 64);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.35,
      });
      ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = Math.PI / 3;
      scene.add(ringMesh);

      const animate = () => {
        animId = requestAnimationFrame(animate);
        if (mesh) {
          mesh.rotation.x += 0.008;
          mesh.rotation.y += 0.012;
        }
        if (ringMesh) {
          ringMesh.rotation.z -= 0.006;
        }
        if (renderer && scene && camera) {
          renderer.render(scene, camera);
        }
      };
      animate();
    } catch (err) {
      console.warn("ThreeDTicker WebGL fallback:", err);
      setHasError(true);
    }

    return () => {
      if (animId) cancelAnimationFrame(animId);
      if (renderer) {
        if (container && renderer.domElement && container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
        renderer.dispose();
      }
      if (mesh) {
        mesh.geometry?.dispose();
        mesh.material?.dispose();
      }
      if (ringMesh) {
        ringMesh.geometry?.dispose();
        ringMesh.material?.dispose();
      }
    };
  }, [width, height]);

  if (hasError) {
    return (
      <div
        style={{
          width,
          height,
          borderRadius: 14,
          background: "linear-gradient(135deg, rgba(14,165,233,0.15) 0%, rgba(16,185,129,0.1) 100%)",
          border: "1px solid rgba(56,189,248,0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#38bdf8",
          fontSize: 12,
          fontWeight: 700,
        }}
      >
        MEDSIM 3D
      </div>
    );
  }

  return (
    <div
      id="medsim-3d-emblem-container"
      ref={mountRef}
      style={{
        width,
        height,
        borderRadius: 14,
        border: "1px solid rgba(56,189,248,0.25)",
        background: "radial-gradient(circle at center, rgba(15,23,42,0.8) 0%, rgba(2,6,23,0.95) 100%)",
        overflow: "hidden",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    />
  );
}

export default Emblem3D;
