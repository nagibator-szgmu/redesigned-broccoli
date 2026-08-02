export const WINDOW_PRESETS = {
  BRAIN: { windowWidth: 80, windowLevel: 40, name: 'Мозг' },
  BONE: { windowWidth: 2000, windowLevel: 400, name: 'Кости' },
  STROKE: { windowWidth: 40, windowLevel: 40, name: 'Инсульт' },
};

export const PATHOLOGY_TYPES = {
  NONE: 'Норма',
  HEMATOMA: 'Субдуральная гематома',
  STROKE: 'Ишемический инсульт'
};

// Calculate HU value for a given pixel coordinate
export const calculateHU = (x, y, width, height, sliceIndex, pathology) => {
  const cx = width / 2;
  const cy = height / 2;
  const dx = x - cx;
  const dy = y - cy;
  
  // Base shapes
  // 1. Skull (oval)
  const rx = width * 0.45;
  const ry = height * 0.48;
  const normalizedDistSq = (dx * dx) / (rx * rx) + (dy * dy) / (ry * ry);
  
  if (normalizedDistSq > 1.1) return -1000; // Air
  if (normalizedDistSq > 1.0) return 800 + Math.random() * 200; // Skull (700-1000 HU)
  
  // Inside skull - Brain matter base
  let hu = 30 + Math.random() * 10; // Gray matter (30-40 HU)
  
  // 2. Ventricles (darker, butterfly shape depending on slice)
  const ventricleProminence = Math.max(0, 1 - Math.abs(sliceIndex - 15) / 10);
  if (ventricleProminence > 0) {
    const vx = Math.abs(dx) / (width * 0.15 * ventricleProminence);
    const vy = Math.abs(dy) / (height * 0.25 * ventricleProminence);
    const vDist = vx * vx + vy * vy;
    const butterfly = (1 - Math.cos(vx * Math.PI)) * 0.5 + vy;
    
    if (vDist < 1.0 && butterfly < 1.2 && Math.abs(dx) > width * 0.02) {
      hu = 10 + Math.random() * 5; // CSF (0-15 HU)
    }
  }

  // 3. Pathology simulation based on case profile
  if (pathology === PATHOLOGY_TYPES.HEMATOMA) {
    // Hyperdense lens shape on the right side
    const hx = x - (cx + width * 0.22);
    const hy = y - cy;
    const hDist = (hx * hx) / (width * 0.1 * width * 0.1) + (hy * hy) / (height * 0.22 * height * 0.22);
    // Hematoma visible in slices 8 to 22
    if (hDist < 1 && sliceIndex >= 8 && sliceIndex <= 22) {
      hu = 70 + Math.random() * 12; // Hematoma (60-80 HU)
    }
  } else if (pathology === PATHOLOGY_TYPES.STROKE) {
    // Hypodense area on the left side
    const sx = x - (cx - width * 0.22);
    const sy = y - (cy - height * 0.1);
    const sDist = Math.sqrt(sx * sx + sy * sy);
    const noise = Math.sin(x * 0.1) * Math.cos(y * 0.1) * 10;
    // Stroke visible in slices 10 to 25
    if (sDist + noise < width * 0.16 && sliceIndex >= 10 && sliceIndex <= 25) {
      hu = 18 + Math.random() * 6; // Stroke (15-20 HU)
    }
  }

  return hu;
};

// Map HU to 0-255 grayscale based on W/L
export const applyWindowLevel = (hu, ww, wl) => {
  const minHU = wl - ww / 2;
  const maxHU = wl + ww / 2;
  
  if (hu <= minHU) return 0;
  if (hu >= maxHU) return 255;
  return Math.floor(((hu - minHU) / ww) * 255);
};

// Render slice to ImageData
export const renderSlice = (width, height, sliceIndex, preset, pathology) => {
  const imageData = new ImageData(width, height);
  const data = imageData.data;
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const hu = calculateHU(x, y, width, height, sliceIndex, pathology);
      const val = applyWindowLevel(hu, preset.windowWidth, preset.windowLevel);
      
      data[idx] = val;     // R
      data[idx + 1] = val; // G
      data[idx + 2] = val; // B
      data[idx + 3] = 255; // A
    }
  }
  return imageData;
};
