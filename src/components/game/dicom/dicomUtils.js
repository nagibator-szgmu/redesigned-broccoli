import { PATHOLOGY_TYPES } from "../../../engine/dicomRenderer";

export const MAX_SLICES = 30;
export const CANVAS_WIDTH = 256;
export const CANVAS_HEIGHT = 256;
export const PIXEL_SPACING = 0.5; // mm per pixel

export function detectPathology(cd) {
  if (!cd) return PATHOLOGY_TYPES.NONE;
  if (cd.imagingFindings?.pathology) {
    return cd.imagingFindings.pathology;
  }
  const diagLower = (cd.diagnosis || "").toLowerCase();
  const compLower = (cd.complaint || "").toLowerCase();
  if (
    diagLower.includes("гематом") ||
    diagLower.includes("кровоизлиян") ||
    compLower.includes("гематом")
  ) {
    return PATHOLOGY_TYPES.HEMATOMA;
  }
  if (
    diagLower.includes("инсульт") ||
    diagLower.includes("ишемическ") ||
    diagLower.includes("инфаркт мозга")
  ) {
    return PATHOLOGY_TYPES.STROKE;
  }
  return PATHOLOGY_TYPES.NONE;
}
