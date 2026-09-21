import { useEffect } from "react";
import * as THREE from "three";
import { FACE_CONFIGS, createFaceTexture } from "./faceTextures";
import { buildRibbonGeometry } from "./ribbonGeometry";

export function useThreeEmblem(mountRef, { width, height, text, setHasError }) {
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let animId = null;
    let renderer = null;
    let scene = null;
    let camera = null;
    let mesh = null;
    let geom = null;
    const textures = [];
    const materials = [];

    try {
      const w = typeof width === "number" ? width : parseInt(width, 10) || 176;
      const h = typeof height === "number" ? height : parseInt(height, 10) || 110;

      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(38, w / h, 0.1, 100);
      camera.position.set(0, 0, 5.2);
      camera.lookAt(0, 0, 0);

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(w, h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.1;

      container.innerHTML = "";
      container.appendChild(renderer.domElement);

      // Studio Lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
      scene.add(ambientLight);

      const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.6);
      dirLight1.position.set(5, 12, 8);
      scene.add(dirLight1);

      const dirLight2 = new THREE.DirectionalLight(0x38bdf8, 0.8);
      dirLight2.position.set(-6, -3, -6);
      scene.add(dirLight2);

      FACE_CONFIGS.forEach((fc) => {
        const tex = createFaceTexture(fc.bg, fc.text, text, renderer);
        textures.push(tex);
        materials.push(
          new THREE.MeshStandardMaterial({
            map: tex,
            roughness: 0.3,
            metalness: 0.2,
            emissiveMap: tex,
            emissive: new THREE.Color("#ffffff"),
            emissiveIntensity: 0.95,
            side: THREE.DoubleSide,
          })
        );
      });

      geom = buildRibbonGeometry();
      mesh = new THREE.Mesh(geom, materials);
      scene.add(mesh);

      const clock = new THREE.Clock();
      const speed = 0.225;

      const animate = () => {
        animId = requestAnimationFrame(animate);
        const delta = clock.getDelta();
        textures.forEach((tex) => {
          tex.offset.x -= speed * delta;
        });
        if (mesh) {
          mesh.rotation.y += speed * delta * 0.5;
        }
        renderer.render(scene, camera);
      };
      animate();
    } catch (err) {
      console.warn("3D Emblem WebGL fallback:", err);
      setHasError(true);
    }

    return () => {
      if (animId) cancelAnimationFrame(animId);
      if (renderer && renderer.domElement && container && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      if (geom) geom.dispose();
      materials.forEach((m) => m.dispose());
      textures.forEach((t) => t.dispose());
      if (renderer) renderer.dispose();
    };
  }, [mountRef, width, height, text, setHasError]);
}
