export const CHECKLIST_MAP = {
  ecg: "ecg", troponin: "troponin", тропонин: "troponin", aspirin: "aspirin",
  heparin: "heparin", oxygen: "oxygen", intubation: "intubation", mri: "mri",
  "x-ray": "xray", lumbar: "lumbar", echocardiograph: "echo", glucose: "glucose",
  culture: "culture", spo2: "spo2", bnp: "bnp", "d-dimer": "d_dimer",
  abg: "abg", urine: "urine", crp: "crp", insulin: "insulin",
  furosemide: "furosemide", metoprolol: "metoprolol", nitroglycerin: "nitroglycerin",
  morphine: "morphine", dextrose: "dextrose", naloxone: "naloxone",
  defibrillat: "defibrillation", catheter: "pci", surgery: "surgery_consult",
  steroid: "steroids", dopamine: "dopamine", amiodarone: "amiodarone",
  mannitol: "mannitol", acyclovir: "acyclovir", dialysis: "dialysis",
  "blood transfusion": "blood_transfusion", coagulation: "coag", lipid: "lipid",
  thyroid: "thyroid", eeg: "eeg", usg: "usg_abdo", cohb: "cohb",
  ketone: "ketones", lactate: "lactate", toxicol: "tox_screen", type: "type_cross",
};

export const DIAG_ALIASES = {
  ct: ["ct_head", "ct_chest"], blood: ["cbc", "bmp"], antibiotic: ["antibiotics_broad"],
  epinephrine: ["epinephrine", "epinephrine_im"], "iv fluid": ["iv_fluids"]
};

export function isChecklistDone(item, orderedDiag = [], selTreat = []) {
  const lc = (item || "").toLowerCase();
  for (const [keyword, id] of Object.entries(CHECKLIST_MAP)) {
    if (lc.includes(keyword) && ((orderedDiag || []).includes(id) || (selTreat || []).includes(id))) return true;
  }
  for (const [keyword, ids] of Object.entries(DIAG_ALIASES)) {
    if (lc.includes(keyword) && ids.some(id => (orderedDiag || []).includes(id) || (selTreat || []).includes(id))) return true;
  }
  return false;
}
