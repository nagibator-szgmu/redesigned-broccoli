import * as THREE from 'three';

/**
 * initSpiralEmblem
 * Full procedural 4-side twisted 3D ribbon engine from 'папка с эмблемкой'.
 * Reversed animation direction as requested by user.
 *
 * @param {HTMLElement} container - Target DOM element
 * @param {Object} customParams - Parameter overrides
 * @returns {Object} { destroy: () => void, params: Object }
 */
export function initSpiralEmblem(container, customParams = {}) {
  if (!container) return { destroy: () => {} };

  const defaultParams = {
    text: '45 am',
    isPlaying: true,
    speed: 0.225,
    twistTurns: 4.0,
    spiralTurns: 3.4,
    pathSegments: 360,
    radius: 2.0,
    height: 4.1,
    rectWidth: 0.62,
    rectHeight: 0.62,
    profileShape: 'square',
    pathShape: 'spiral',
    wireframe: false,
    materialType: 'emissive',
    roughness: 0.35,
    metalness: 0.15,
    emissiveIntensity: 1.0,
    sideTopColor: '#1143FE',   // Blue -> Black text
    sideRightColor: '#FFFFFF', // White -> Black text
    sideBottomColor: '#000000',// Black -> White text
    sideLeftColor: '#01FF71',  // Green -> Black text
  };

  const params = { ...defaultParams, ...customParams };

  const width = container.clientWidth || 176;
  const height = container.clientHeight || 110;

  // --- Scene & Camera Setup ---
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
  camera.position.set(0, 0, 5.2);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;

  container.innerHTML = '';
  container.appendChild(renderer.domElement);

  // --- Studio Lighting ---
  const ambientLight = new THREE.AmbientLight(0xffffff, 1.3);
  scene.add(ambientLight);

  const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
  dirLight.position.set(5, 12, 8);
  scene.add(dirLight);

  const fillLight = new THREE.DirectionalLight(0xb4c6ff, 0.6);
  fillLight.position.set(-6, -2, -6);
  scene.add(fillLight);

  // --- CRISP CANVAS TEXTURE GENERATOR ---
  const canvasTextures = [];

  function createCrispSideTexture(bgColor, textColor) {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    // Background Fill
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Rotate canvas 180 degrees so text is right-side up
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(Math.PI);

    // Big Bold Text
    ctx.fillStyle = textColor;
    ctx.font = '900 180px -apple-system, BlinkMacSystemFont, "Inter", "Fredoka", "Arial Black", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const textStr = params.text || '45 am';
    ctx.fillText(textStr, 0, 5);
    ctx.restore();

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.repeat.set(24, 1);
    texture.colorSpace = THREE.SRGBColorSpace;

    const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();
    texture.anisotropy = maxAnisotropy;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = true;

    return texture;
  }

  function updateAllTextures() {
    canvasTextures.forEach(t => t.dispose());
    canvasTextures.length = 0;

    const sides = [
      { bg: params.sideTopColor, text: '#000000' },    // Blue side -> Black text
      { bg: params.sideRightColor, text: '#000000' },  // White side -> Black text
      { bg: params.sideBottomColor, text: '#FFFFFF' }, // Black side -> White text
      { bg: params.sideLeftColor, text: '#000000' }    // Green side -> Black text
    ];

    sides.forEach((s) => {
      canvasTextures.push(createCrispSideTexture(s.bg, s.text));
    });
  }

  updateAllTextures();

  // --- Material Creation ---
  let materials = [];

  function buildMaterials() {
    materials.forEach(m => m.dispose());
    materials = canvasTextures.map((texture) => {
      const matProps = {
        map: texture,
        roughness: params.roughness,
        metalness: params.metalness,
        wireframe: params.wireframe,
        side: THREE.DoubleSide
      };

      if (params.materialType === 'emissive') {
        matProps.emissiveMap = texture;
        matProps.emissive = new THREE.Color('#ffffff');
        matProps.emissiveIntensity = params.emissiveIntensity;
      } else if (params.materialType === 'glossy') {
        matProps.roughness = 0.05;
        matProps.metalness = 0.85;
      }

      return new THREE.MeshStandardMaterial(matProps);
    });

    return materials;
  }

  buildMaterials();

  // --- Curve Generation ---
  function getPathCurve() {
    const N = params.pathSegments;
    const points = [];

    if (params.pathShape === 'spiral') {
      for (let i = 0; i <= N; i++) {
        const t = i / N;
        const angle = t * params.spiralTurns * Math.PI * 2;
        const x = params.radius * Math.cos(angle);
        const y = (t - 0.5) * params.height;
        const z = params.radius * Math.sin(angle);
        points.push(new THREE.Vector3(x, y, z));
      }
    } else {
      for (let i = 0; i <= N; i++) {
        const t = i / N;
        const angle = t * Math.PI * 2;
        const x = params.radius * Math.cos(angle);
        const y = Math.sin(angle * 2) * 0.8;
        const z = params.radius * Math.sin(angle);
        points.push(new THREE.Vector3(x, y, z));
      }
    }

    return new THREE.CatmullRomCurve3(points);
  }

  // --- Procedural 4-Side Ribbon Geometry Builder ---
  function buildRibbonGeometry() {
    const N = params.pathSegments;
    const curve = getPathCurve();
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

    let vertexIndexOffset = 0;

    for (let side = 0; side < 4; side++) {
      groups[side].start = indices.length;
      const sideStartVertex = vertexIndexOffset;

      for (let i = 0; i <= N; i++) {
        const t = i / N;
        const P = curvePoints[i];
        const N_vec = frames.normals[i];
        const B_vec = frames.binormals[i];

        const twistAngle = t * params.twistTurns * Math.PI * 2;

        const cosTwist = Math.cos(twistAngle);
        const sinTwist = Math.sin(twistAngle);

        const N_rot = new THREE.Vector3()
          .copy(N_vec).multiplyScalar(cosTwist)
          .addScaledVector(B_vec, sinTwist);

        const B_rot = new THREE.Vector3()
          .copy(N_vec).multiplyScalar(-sinTwist)
          .addScaledVector(B_vec, cosTwist);

        const corners = [
          new THREE.Vector3().copy(P).addScaledVector(N_rot, hw).addScaledVector(B_rot, hh),
          new THREE.Vector3().copy(P).addScaledVector(N_rot, -hw).addScaledVector(B_rot, hh),
          new THREE.Vector3().copy(P).addScaledVector(N_rot, -hw).addScaledVector(B_rot, -hh),
          new THREE.Vector3().copy(P).addScaledVector(N_rot, hw).addScaledVector(B_rot, -hh),
        ];

        let vA, vB, sideNormal;
        if (side === 0) {
          vA = corners[1]; vB = corners[0]; sideNormal = B_rot.clone();
        } else if (side === 1) {
          vA = corners[0]; vB = corners[3]; sideNormal = N_rot.clone();
        } else if (side === 2) {
          vA = corners[3]; vB = corners[2]; sideNormal = B_rot.clone().negate();
        } else {
          vA = corners[2]; vB = corners[1]; sideNormal = N_rot.clone().negate();
        }

        positions.push(vA.x, vA.y, vA.z);
        positions.push(vB.x, vB.y, vB.z);

        normals.push(sideNormal.x, sideNormal.y, sideNormal.z);
        normals.push(sideNormal.x, sideNormal.y, sideNormal.z);

        uvs.push(t, 0);
        uvs.push(t, 1);

        vertexIndexOffset += 2;
      }

      for (let i = 0; i < N; i++) {
        const idx = sideStartVertex + i * 2;
        indices.push(idx, idx + 1, idx + 2);
        indices.push(idx + 2, idx + 1, idx + 3);
      }

      groups[side].count = indices.length - groups[side].start;
    }

    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geom.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
    geom.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geom.setIndex(indices);

    groups.forEach(g => geom.addGroup(g.start, g.count, g.materialIndex));

    return geom;
  }

  const geometry = buildRibbonGeometry();
  const mesh = new THREE.Mesh(geometry, materials);
  scene.add(mesh);

  // --- Animation Loop ---
  const clock = new THREE.Clock();
  let animId;

  function animate() {
    animId = requestAnimationFrame(animate);

    const delta = clock.getDelta();

    if (params.isPlaying) {
      canvasTextures.forEach((t) => {
        t.offset.x -= params.speed * delta;
      });
      mesh.rotation.y += params.speed * delta * 0.5;
    }

    renderer.render(scene, camera);
  }

  animate();

  return {
    destroy: () => {
      cancelAnimationFrame(animId);
      if (renderer && renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      geometry.dispose();
      materials.forEach(m => m.dispose());
      canvasTextures.forEach(t => t.dispose());
      renderer.dispose();
    },
    params,
  };
}
