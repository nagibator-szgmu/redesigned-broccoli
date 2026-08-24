import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * FluidEmblem45AM
 * Standalone 3D Ribbon Emblem Component with crisp typography & custom preset controls.
 *
 * @param {Object} props
 * @param {string} [props.text="45 am"] - Text displayed along the 3D ribbon
 * @param {number} [props.speed=0.225] - Animation speed
 * @param {string|number} [props.width="100%"] - Component width
 * @param {string|number} [props.height="100%"] - Component height
 * @param {string} [props.backgroundColor="#ffffff"] - Container background color
 * @param {string[]} [props.colors] - Array of 4 side colors [Top, Right, Bottom, Left]
 */
export function FluidEmblem45AM({
  text = '45 am',
  speed = 0.225,
  width = '100%',
  height = '100%',
  backgroundColor = 'transparent',
  colors = ['#1143FE', '#FFFFFF', '#000000', '#01FF71']
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const params = {
      text,
      isPlaying: true,
      speed,
      twistTurns: 4.0,
      spiralTurns: 3.4,
      pathSegments: 360,
      radius: 2.0,
      height: 4.1,
      rectWidth: 0.62,
      rectHeight: 0.62,
      materialType: 'emissive',
      roughness: 0.35,
      metalness: 0.15,
      emissiveIntensity: 1.0,
      sideTopColor: colors[0] || '#1143FE',
      sideRightColor: colors[1] || '#FFFFFF',
      sideBottomColor: colors[2] || '#000000',
      sideLeftColor: colors[3] || '#01FF71',
    };

    const w = container.clientWidth || 176;
    const h = container.clientHeight || 110;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, w / h, 0.1, 100);
    camera.position.set(0, 0, 5.2);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.3);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
    dirLight.position.set(5, 12, 8);
    scene.add(dirLight);

    const fillLight = new THREE.DirectionalLight(0xb4c6ff, 0.6);
    fillLight.position.set(-6, -2, -6);
    scene.add(fillLight);

    // Crisp Canvas Textures
    const canvasTextures = [];

    function createSideTexture(bgColor, textColor) {
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 256;
      const ctx = canvas.getContext('2d');

      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.scale(-1, 1);

      ctx.fillStyle = textColor;
      ctx.font = '900 180px -apple-system, BlinkMacSystemFont, "Inter", "Fredoka", "Arial Black", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      ctx.fillText(params.text, 0, 5);
      ctx.restore();

      const texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;
      texture.repeat.set(24, 1);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
      texture.minFilter = THREE.LinearMipmapLinearFilter;
      texture.magFilter = THREE.LinearFilter;

      return texture;
    }

    const sides = [
      { bg: params.sideTopColor, text: '#000000' },
      { bg: params.sideRightColor, text: '#000000' },
      { bg: params.sideBottomColor, text: '#FFFFFF' },
      { bg: params.sideLeftColor, text: '#000000' }
    ];

    sides.forEach(s => canvasTextures.push(createSideTexture(s.bg, s.text)));

    // Materials
    const materials = canvasTextures.map((tex) => new THREE.MeshStandardMaterial({
      map: tex,
      roughness: params.roughness,
      metalness: params.metalness,
      emissiveMap: tex,
      emissive: new THREE.Color('#ffffff'),
      emissiveIntensity: params.emissiveIntensity,
      side: THREE.DoubleSide
    }));

    // Geometry
    const N = params.pathSegments;
    const points = [];
    for (let i = 0; i <= N; i++) {
      const t = i / N;
      const angle = t * params.spiralTurns * Math.PI * 2;
      const x = params.radius * Math.cos(angle);
      const y = (t - 0.5) * params.height;
      const z = params.radius * Math.sin(angle);
      points.push(new THREE.Vector3(x, y, z));
    }
    const curve = new THREE.CatmullRomCurve3(points);
    const curvePoints = curve.getPoints(N);
    const frames = curve.computeFrenetFrames(N, false);

    const hw = params.rectWidth / 2;
    const hh = params.rectHeight / 2;

    const positions = [];
    const normals = [];
    const uvs = [];
    const indices = [];
    const groups = [
      { start: 0, count: 0, materialIndex: 0 },
      { start: 0, count: 0, materialIndex: 1 },
      { start: 0, count: 0, materialIndex: 2 },
      { start: 0, count: 0, materialIndex: 3 },
    ];

    let vertexOffset = 0;
    for (let side = 0; side < 4; side++) {
      groups[side].start = indices.length;
      const sideStartVertex = vertexOffset;

      for (let i = 0; i <= N; i++) {
        const t = i / N;
        const P = curvePoints[i];
        const N_vec = frames.normals[i];
        const B_vec = frames.binormals[i];

        const twistAngle = t * params.twistTurns * Math.PI * 2;
        const cosT = Math.cos(twistAngle);
        const sinT = Math.sin(twistAngle);

        const N_rot = new THREE.Vector3().copy(N_vec).multiplyScalar(cosT).addScaledVector(B_vec, sinT);
        const B_rot = new THREE.Vector3().copy(N_vec).multiplyScalar(-sinT).addScaledVector(B_vec, cosT);

        const corners = [
          new THREE.Vector3().copy(P).addScaledVector(N_rot, hw).addScaledVector(B_rot, hh),
          new THREE.Vector3().copy(P).addScaledVector(N_rot, -hw).addScaledVector(B_rot, hh),
          new THREE.Vector3().copy(P).addScaledVector(N_rot, -hw).addScaledVector(B_rot, -hh),
          new THREE.Vector3().copy(P).addScaledVector(N_rot, hw).addScaledVector(B_rot, -hh),
        ];

        let vA, vB, sideNorm;
        if (side === 0) { vA = corners[1]; vB = corners[0]; sideNorm = B_rot.clone(); }
        else if (side === 1) { vA = corners[0]; vB = corners[3]; sideNorm = N_rot.clone(); }
        else if (side === 2) { vA = corners[3]; vB = corners[2]; sideNorm = B_rot.clone().negate(); }
        else { vA = corners[2]; vB = corners[1]; sideNorm = N_rot.clone().negate(); }

        positions.push(vA.x, vA.y, vA.z, vB.x, vB.y, vB.z);
        normals.push(sideNorm.x, sideNorm.y, sideNorm.z, sideNorm.x, sideNorm.y, sideNorm.z);
        uvs.push(t, 0, t, 1);
        vertexOffset += 2;
      }

      for (let i = 0; i < N; i++) {
        const idx = sideStartVertex + i * 2;
        indices.push(idx, idx + 1, idx + 2, idx + 2, idx + 1, idx + 3);
      }
      groups[side].count = indices.length - groups[side].start;
    }

    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geom.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
    geom.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geom.setIndex(indices);
    groups.forEach(g => geom.addGroup(g.start, g.count, g.materialIndex));

    const mesh = new THREE.Mesh(geom, materials);
    scene.add(mesh);

    // Animation Loop
    const clock = new THREE.Clock();
    let animId;

    function animate() {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      canvasTextures.forEach(t => t.offset.x -= params.speed * delta);
      mesh.rotation.y += params.speed * delta * 0.5;
      renderer.render(scene, camera);
    }
    animate();

    return () => {
      cancelAnimationFrame(animId);
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      geom.dispose();
      materials.forEach(m => m.dispose());
      canvasTextures.forEach(t => t.dispose());
      renderer.dispose();
    };
  }, [text, speed, colors]);

  return (
    <div
      ref={containerRef}
      style={{
        width,
        height,
        backgroundColor,
        borderRadius: 14,
        border: '1px solid rgba(56, 189, 248, 0.25)',
        background: 'radial-gradient(circle at center, rgba(15,23,42,0.8) 0%, rgba(2,6,23,0.95) 100%)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
        overflow: 'hidden',
        position: 'relative'
      }}
    />
  );
}

export default FluidEmblem45AM;
