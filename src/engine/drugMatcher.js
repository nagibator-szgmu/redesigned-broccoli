/**
 * drugMatcher.js
 * Клиническое сопоставление выписанных амбулаторных препаратов с эталонами КР.
 */

const DRUG_ALIASES = {
  spasmolytics: ["mebeverine", "trimebutine", "drotaverine"],
  mebeverine: ["spasmolytics"],
  trimebutine: ["spasmolytics"],
  drotaverine: ["spasmolytics"],
  mesalazine: ["mesalazine_tab", "mesalazine_supp"],
  mesalazine_tab: ["mesalazine"],
  mesalazine_supp: ["mesalazine"],
  pancreatin_micro: ["pancreatin", "pancreatin_micro"],
  pancreatin: ["pancreatin_micro"],
  h_pylori_quadro: ["clarithromycin", "amoxicillin", "bismuth", "h_pylori_quadro"],
  ACE_inhibitor: ["perindopril", "enalapril"],
  metoprolol: ["metoprolol_succinate", "betaloc"],
  udca: ["ursodeoxycholic_acid", "ursosan"],
};

export function isMatchingDrug(rxId, targetId, options = []) {
  if (!rxId || !targetId) return false;
  if (rxId === targetId) return true;
  if (DRUG_ALIASES[rxId]?.includes(targetId)) return true;
  if (DRUG_ALIASES[targetId]?.includes(rxId)) return true;
  if (options.some((o) => o.id === rxId || DRUG_ALIASES[rxId]?.includes(o.id))) return true;
  return false;
}

export function findMatchingOption(rxId, rxPlan) {
  if (!rxId || !rxPlan?.options) return null;
  const direct = rxPlan.options.find((o) => o.id === rxId);
  if (direct) return direct;
  return rxPlan.options.find((o) => isMatchingDrug(rxId, o.id, rxPlan.options)) || null;
}
