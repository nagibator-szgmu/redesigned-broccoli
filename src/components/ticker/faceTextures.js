import * as THREE from "three";

export const FACE_CONFIGS = [
  { bg: "#1143FE", text: "#FFFFFF" }, // Face 0: Cobalt Blue / White text
  { bg: "#FFFFFF", text: "#000000" }, // Face 1: Pure White / Black text
  { bg: "#01FF71", text: "#000000" }, // Face 2: Vibrant Green / Black text
];

export function createFaceTexture(bgColor, textColor, text, renderer) {
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
  ctx.font =
    '900 170px -apple-system, BlinkMacSystemFont, "Inter", "Fredoka", "Arial Black", sans-serif';
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  ctx.fillText(text, 0, 4);
  ctx.restore();

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  tex.repeat.set(20, 1);
  tex.colorSpace = THREE.SRGBColorSpace;
  if (renderer?.capabilities) {
    tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
  }
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.magFilter = THREE.LinearFilter;
  return tex;
}
