import * as THREE from "three";

export function buildRibbonGeometry() {
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
    { start: 0, count: 0, materialIndex: 2 },
  ];

  let vertexOffset = 0;

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

      const N_rot = new THREE.Vector3()
        .copy(N_vec)
        .multiplyScalar(cosT)
        .addScaledVector(B_vec, sinT);
      const B_rot = new THREE.Vector3()
        .copy(N_vec)
        .multiplyScalar(-sinT)
        .addScaledVector(B_vec, cosT);

      const pA = new THREE.Vector3()
        .copy(P)
        .addScaledVector(N_rot, rCross * Math.cos(a1))
        .addScaledVector(B_rot, rCross * Math.sin(a1));

      const pB = new THREE.Vector3()
        .copy(P)
        .addScaledVector(N_rot, rCross * Math.cos(a2))
        .addScaledVector(B_rot, rCross * Math.sin(a2));

      const midAngle = (a1 + a2) / 2;
      const faceNorm = new THREE.Vector3()
        .copy(N_rot)
        .multiplyScalar(Math.cos(midAngle))
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

  const geom = new THREE.BufferGeometry();
  geom.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geom.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
  geom.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geom.setIndex(indices);
  groups.forEach((g) => geom.addGroup(g.start, g.count, g.materialIndex));

  return geom;
}
