export const RADIUS = { xs: 4, sm: 8, md: 12, lg: 16, full: 9999 };
export const SPACE = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 };

export const DARK = {
  bg:"#0E1015", panel:"#161920", panel2:"#1D212A",
  border:"rgba(255,255,255,0.08)", borderBright:"rgba(255,255,255,0.18)",
  accent:"#2563EB", accentDim:"rgba(37,99,235,0.14)",
  green:"#10B981", greenDim:"rgba(16,185,129,0.15)",
  red:"#F43F5E",   redDim:"rgba(244,63,94,0.15)",
  yellow:"#F59E0B", yellowDim:"rgba(245,158,11,0.15)",
  purple:"#8B5CF6", orange:"#F97316",
  text:"#E2E8F0", textDim:"#8A94A6", white:"#FFFFFF",
  // semantic backgrounds
  bgGrad:"linear-gradient(160deg,#0E1015 0%,#151820 50%,#0E1015 100%)",
  panelBg:"rgba(22,25,32,0.88)", panelBg2:"rgba(29,33,42,0.94)",
  headerBg:"rgba(14,16,21,0.94)", headerBg2:"rgba(14,16,21,0.80)",
  sidebarBg:"rgba(22,25,32,0.94)",
  overlayBg:"rgba(14,16,21,0.98)",
  inputBg:"rgba(22,25,32,0.85)",
  dimBg:"rgba(255,255,255,0.04)",
  btnBg:"rgba(255,255,255,0.05)", btnBorder:"rgba(255,255,255,0.10)",
  heroGrad:"linear-gradient(135deg,#121826 0%,#1E293B 55%,#0F172A 100%)",
  glowBg1:"radial-gradient(circle,rgba(37,99,235,0.08) 0%,transparent 65%)",
  glowBg2:"radial-gradient(circle,rgba(139,92,246,0.06) 0%,transparent 65%)",
  // hero content colors
  heroText:"rgba(240,246,255,0.92)",
  heroLabel:"#93C5FD",
  heroTitleGrad:"linear-gradient(135deg,#FFFFFF 0%,#BFDBFE 100%)",
  heroTagBg:"rgba(255,255,255,0.14)",
  heroTagBorder:"rgba(255,255,255,0.28)",
  heroTagText:"#E0ECFF",
};

export const LIGHT = {
  bg:"#F9F8F3", panel:"#ffffff", panel2:"#F4F2EA",
  border:"rgba(44,46,49,0.14)", borderBright:"rgba(44,46,49,0.25)",
  accent:"#0047AB", accentDim:"rgba(0,71,171,0.10)",
  green:"#007A55", greenDim:"rgba(0,122,85,0.12)",
  red:"#C71D3A",   redDim:"rgba(199,29,58,0.12)",
  yellow:"#875E00", yellowDim:"rgba(135,94,0,0.12)",
  purple:"#5830C2", orange:"#B44300",
  text:"#2C2E31", textDim:"#5A5D64", white:"#1E2023",
  // semantic backgrounds
  bgGrad:"linear-gradient(160deg,#F9F8F3 0%,#F2EFE8 50%,#F9F8F3 100%)",
  panelBg:"rgba(255,255,255,0.96)", panelBg2:"rgba(244,242,234,0.98)",
  headerBg:"rgba(249,248,243,0.95)", headerBg2:"rgba(249,248,243,0.85)",
  sidebarBg:"rgba(255,255,255,0.96)",
  overlayBg:"rgba(249,248,243,0.98)",
  inputBg:"rgba(255,255,255,0.96)",
  dimBg:"rgba(44,46,49,0.05)",
  btnBg:"rgba(0,71,171,0.05)", btnBorder:"rgba(44,46,49,0.16)",
  heroGrad:"linear-gradient(135deg,#002B66 0%,#0047AB 55%,#001F4D 100%)",
  glowBg1:"radial-gradient(circle,rgba(0,71,171,0.08) 0%,transparent 65%)",
  glowBg2:"radial-gradient(circle,rgba(44,46,49,0.06) 0%,transparent 65%)",
  heroText:"rgba(240,246,255,0.92)",
  heroLabel:"#8CB8FF",
  heroTitleGrad:"linear-gradient(135deg,#FFFFFF 0%,#B8D5FF 100%)",
  heroTagBg:"rgba(255,255,255,0.16)",
  heroTagBorder:"rgba(255,255,255,0.35)",
  heroTagText:"#E0ECFF",
};

export const FONT = "'IBM Plex Sans',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif";
export const FONT_BODY = FONT;
export const FONT_HEADING = "'IBM Plex Serif',Georgia,'Times New Roman',serif";
export const SER = "'IBM Plex Serif',Georgia,'Times New Roman',serif";
export const CODE = "'JetBrains Mono','SF Mono','Menlo','Monaco','Courier New',monospace";

/**
 * Resolves semantic theme color for diagnostic, drug, and specialty categories.
 * @param {string} cat - Category identifier
 * @param {object} C - Theme tokens object
 * @returns {string} Hex color token
 */
export function getCategoryColor(cat, C) {
  if (!cat || !C) return C?.accent || "#2563EB";
  switch (cat) {
    case "cardiac":
    case "antiplatelet":
    case "anticoagulant":
    case "intervention":
    case "vasopressor":
      return C.red;
    case "lab":
    case "diuretic":
    case "renal":
      return C.accent;
    case "respiratory":
    case "supportive":
    case "antibiotic":
    case "antidote":
    case "antiviral":
      return C.green;
    case "vital":
    case "steroid":
    case "endocrine":
      return C.yellow;
    case "neuro":
    case "analgesic":
    case "anticonvulsant":
      return C.orange;
    case "imaging":
    case "betablocker":
    case "antiarrhythmic":
      return C.purple;
    default:
      return C.accent;
  }
}
