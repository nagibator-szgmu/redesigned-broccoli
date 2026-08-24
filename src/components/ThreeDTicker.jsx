import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

/**
 * 3-Sided (Трехгранная) 3D Ribbon Emblem with procedural "45 am" text.
 * Renders a 3-faceted twisted ribbon spiral rotating in 3D space.
 */
export function Emblem3D({ width = 176, height = 110, text = "45 am" }) {
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

      // Texture generator for 3 faces
      function createFaceTexture(bgColor, textColor) {
        const canvas = document.createElement("canvas");
        canvas.width = 1024;
        canvas.height = 256;
        const ctx = canvas.getContext("2d");

        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.scale(-1, 1);

        ctx.fillStyle = textColor;
        ctx.font = '900 170px -apple-system, BlinkMacSystemFont, "Inter", "Fredoka", "Arial Black", sans-serif';
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        ctx.fillText(text, 0, 4);
        ctx.restore();

        const tex = new THREE.CanvasTexture(canvas);
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.ClampToEdgeWrapping;
        tex.repeat.set(20, 1);
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
        tex.minFilter = THREE.LinearMipmapLinearFilter;
        tex.magFilter = THREE.LinearFilter;
        return tex;
      }

      // 3 Face Color Configs (Triangular prism)
      const faceConfigs = [
        { bg: "#1143FE", text: "#FFFFFF" }, // Face 0: Cobalt Blue / White text
        { bg: "#FFFFFF", text: "#000000" }, // Face 1: Pure White / Black text
        { bg: "#01FF71", text: "#000000" }  // Face 2: Vibrant Green / Black text
      ];

      faceConfigs.forEach(fc => {
        const tex = createFaceTexture(fc.bg, fc.text);
        textures.push(tex);
        materials.push(new THREE.MeshStandardMaterial({
          map: tex,
          roughness: 0.3,
          metalness: 0.2,
          emissiveMap: tex,
          emissive: new THREE.Color("#ffffff"),
          emissiveIntensity: 0.95,
          side: THREE.DoubleSide
        }));
      });

      // Curve path & 3-sided (triangular) cross-section ribbon geometry
      const N = 360;
      const spiralTurns = 3.2;
      const twistTurns = 3.6;
      const radius = 1.9;
      const heightVal = 4.0;
      const rCross = 0.42;

      const points = [];
      for (let i = 0; i <= N; i++) {
        const t = i / N;
        const angle = t * spiralTurns * Math.PI * 2;
        const x = radius * Math.cos(angle);
        const y = (t - 0.5) * heightVal;
        const z = radius * Math.sin(angle);
        points.push(new THREE.Vector3(x, y, z));
      }
      const curve = new THREE.CatmullRomCurve3(points);
      const curvePoints = curve.getPoints(N);
      const frames = curve.computeFrenetFrames(N, false);

      const positions = [];
      const normals = [];
      const uvs = [];
      const indices = [];
      const groups = [
        { start: 0, count: 0, materialIndex: 0 },
        { start: 0, count: 0, materialIndex: 1 },
        { start: 0, count: 0, materialIndex: 2 }
      ];

      let vertexOffset = 0;

      // 3 Face Strips
      for (let face = 0; face < 3; face++) {
        groups[face].start = indices.length;
        const faceStartVertex = vertexOffset;

        const a1 = (face * Math.PI * 2) / 3;
        const a2 = ((face + 1) * Math.PI * 2) / 3;

        for (let i = 0; i <= N; i++) {
          const t = i / N;
          const P = curvePoints[i];
          const N_vec = frames.normals[i];
          const B_vec = frames.binormals[i];

          const twistAngle = t * twistTurns * Math.PI * 2;
          const cosT = Math.cos(twistAngle);
          const sinT = Math.sin(twistAngle);

          const N_rot = new THREE.Vector3().copy(N_vec).multiplyScalar(cosT).addScaledVector(B_vec, sinT);
          const B_rot = new THREE.Vector3().copy(N_vec).multiplyScalar(-sinT).addScaledVector(B_vec, cosT);

          const pA = new THREE.Vector3().copy(P)
            .addScaledVector(N_rot, rCross * Math.cos(a1))
            .addScaledVector(B_rot, rCross * Math.sin(a1));

          const pB = new THREE.Vector3().copy(P)
            .addScaledVector(N_rot, rCross * Math.cos(a2))
            .addScaledVector(B_rot, rCross * Math.sin(a2));

          const midAngle = (a1 + a2) / 2;
          const faceNorm = new THREE.Vector3()
            .copy(N_rot).multiplyScalar(Math.cos(midAngle))
            .addScaledVector(B_rot, Math.sin(midAngle))
            .normalize();

          positions.push(pA.x, pA.y, pA.z, pB.x, pB.y, pB.z);
          normals.push(faceNorm.x, faceNorm.y, faceNorm.z, faceNorm.x, faceNorm.y, faceNorm.z);
          uvs.push(t, 0, t, 1);
          vertexOffset += 2;
        }

        for (let i = 0; i < N; i++) {
          const idx = faceStartVertex + i * 2;
          indices.push(idx, idx + 1, idx + 2, idx + 2, idx + 1, idx + 3);
        }
        groups[face].count = indices.length - groups[face].start;
      }

      geom = new THREE.BufferGeometry();
      geom.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
      geom.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
      geom.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
      geom.setIndex(indices);
      groups.forEach(g => geom.addGroup(g.start, g.count, g.materialIndex));

      mesh = new THREE.Mesh(geom, materials);
      scene.add(mesh);

      const clock = new THREE.Clock();
      const speed = 0.225;

      const animate = () => {
        animId = requestAnimationFrame(animate);
        const delta = clock.getDelta();
        textures.forEach(tex => {
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
      materials.forEach(m => m.dispose());
      textures.forEach(t => t.dispose());
      if (renderer) renderer.dispose();
    };
  }, [width, height, text]);

  if (hasError) {
    return (
      <div
        style={{
          width,
          height,
          borderRadius: 14,
          background: "linear-gradient(135deg, rgba(17,67,254,0.15) 0%, rgba(1,255,113,0.1) 100%)",
          border: "1px solid rgba(56,189,248,0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#38bdf8",
          fontSize: 12,
          fontWeight: 700,
        }}
      >
        45 AM
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
        background: "radial-gradient(circle at center, rgba(15,23,42,0.85) 0%, rgba(2,6,23,0.98) 100%)",
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
