/**
 * checklistUtils.js
 * Комплексная клиническая проверка выполнения пунктов чек-листа (Checklist Criteria)
 * Поддерживает русскоязычные и англоязычные термины, маршрутизацию и Rx Builder.
 */

export const CHECKLIST_MAP = {
  ecg: "ecg", экг: "ecg", troponin: "troponin", тропонин: "troponin",
  aspirin: "aspirin", аспирин: "aspirin", heparin: "heparin", гепарин: "heparin",
  oxygen: "oxygen", кислород: "oxygen", оксигено: "oxygen",
  intubation: "intubation", интубаци: "intubation", mri: "mri", мрт: "mri",
  "x-ray": "xray", рентген: "xray", lumbar: "lumbar", люмбальн: "lumbar",
  echocardiograph: "echo", эхокардио: "echo", "эхо-кг": "echo",
  glucose: "glucose", глюкоз: "glucose", culture: "culture", посев: "culture",
  spo2: "spo2", bnp: "bnp", натрийуретич: "bnp", "d-dimer": "d_dimer", димер: "d_dimer",
  abg: "abg", кщс: "abg", urine: "urine", мочи: "urine", оам: "urine",
  crp: "crp", срб: "crp", insulin: "insulin", инсулин: "insulin",
  furosemide: "furosemide", фуросемид: "furosemide", metoprolol: "metoprolol", метопролол: "metoprolol",
  nitroglycerin: "nitroglycerin", нитроглицерин: "nitroglycerin", morphine: "morphine", морфин: "morphine",
  dextrose: "dextrose", декстроз: "dextrose", naloxone: "naloxone", налоксон: "naloxone",
  defibrillat: "defibrillation", дефибрилл: "defibrillation", catheter: "pci", коронаро: "pci",
  surgery: "surgery_consult", хирург: "surgery_consult", холецистэктоми: "surgery_consult",
  steroid: "steroids", кортикостероид: "steroids", гормон: "steroids",
  dopamine: "dopamine", допамин: "dopamine", amiodarone: "amiodarone", амиодарон: "amiodarone",
  mannitol: "mannitol", маннитол: "mannitol", acyclovir: "acyclovir", ацикловир: "acyclovir",
  dialysis: "dialysis", диализ: "dialysis", "blood transfusion": "blood_transfusion", гемотрансфуз: "blood_transfusion",
  coagulation: "coag", коагулограмм: "coag", lipid: "lipid", липид: "lipid",
  thyroid: "thyroid", ттг: "thyroid", тиреоид: "thyroid", eeg: "eeg", ээг: "eeg",
  usg: "usg_abdo", узи: "usg_abdo", ультразвук: "usg_abdo", калькулез: "usg_abdo",
  cohb: "cohb", ketone: "ketones", кетон: "ketones", lactate: "lactate", лактат: "lactate",
  toxicol: "tox_screen", tox: "tox_screen", type: "type_cross",
  calprotectin: "calprotectin", кальпротектин: "calprotectin",
  эластаз: "fecal_elastase", ферритин: "ferritin",
  "анти-ttg": "anti_ttg", целиаки: "anti_ttg",
  импеданс: "ph_impedance", "ph-метр": "ph_impedance",
  уреазн: "hpylori", helicobacter: "hpylori", хеликобактер: "hpylori",
  эгдс: "egds", фгдс: "egds", гастроскоп: "egds", эзофагит: "egds",
  колоноскоп: "colonoscopy", лапароцентез: "paracentesis",
  спазмолитик: "mebeverine", миотропн: "mebeverine", мебеверин: "mebeverine", дротаверин: "drotaverine",
  удхк: "ursofalk", урсосан: "ursofalk", урсофальк: "ursofalk", урсодезоксихолев: "ursofalk",
  панкреатин: "pancreatin", креон: "pancreatin",
  прокинетик: "itopride", итоприд: "itopride", месалазин: "mesalazine",
  омепразол: "omeprazole", пантопразол: "pantoprazole", ипп: "omeprazole", антисекреторн: "omeprazole",
  лактулоз: "lactulose", рифаксимин: "rifaximin", альбумин: "albumin", спиронолактон: "spironolactone",
};

export const DIAG_ALIASES = {
  ct: ["ct_head", "ct_chest", "ct_abdo"],
  кт: ["ct_head", "ct_chest", "ct_abdo"],
  blood: ["cbc", "bmp"],
  кров: ["cbc", "bmp"],
  оак: ["cbc"],
  лабораторн: ["cbc", "bmp", "crp"],
  воспален: ["cbc", "crp", "bmp"],
  билиарн: ["bmp", "usg_abdo"],
  печеночн: ["bmp"],
  почек: ["bmp"],
  antibiotic: ["antibiotics_broad", "ceftriaxone", "clarithromycin", "amoxicillin"],
  антибиотик: ["antibiotics_broad", "ceftriaxone", "clarithromycin", "amoxicillin"],
  эрадикаци: ["clarithromycin", "amoxicillin", "omeprazole", "bismuth"],
  желез: ["ferritin", "iron_iv", "iron"],
  диет: ["diet", "diet_fodmap", "diet_gluten_free", "lifestyle"],
  fodmap: ["diet", "diet_fodmap"],
  аглютен: ["diet", "diet_gluten_free"],
  epinephrine: ["epinephrine", "epinephrine_im"],
  адреналин: ["epinephrine", "epinephrine_im"],
  "iv fluid": ["iv_fluids", "saline"],
  инфузи: ["iv_fluids", "saline"],
  кристаллоид: ["iv_fluids", "saline"],
};

export function isChecklistDone(item, orderedDiag = [], selTreat = [], extraResult = {}) {
  const lc = (item || "").toLowerCase();
  const dList = (orderedDiag || []).map((x) => String(x).toLowerCase());
  const tList = (selTreat || []).map((x) => String(x).toLowerCase());
  const ex = extraResult?.extraResult || extraResult || {};
  const route = ex.selectedRoute;
  const rx = ex.rxBuilder;

  // 1. Маршрутизация, хирургия и консультации
  if (lc.includes("хирург") || lc.includes("холецистэктоми") || lc.includes("лапаротом") || lc.includes("surgery")) {
    if (route === "refer_specialist" || route === "refer_hospitalization" || tList.includes("surgery_consult")) return true;
  }
  if (lc.includes("амбулаторн") || lc.includes("отказ от госпитализации") || lc.includes("наблюдение терапевт") || lc.includes("образа жизни") || lc.includes("массы тела")) {
    if (route === "treat_outpatient" || route === "refer_specialist" || tList.includes("lifestyle") || tList.includes("diet")) return true;
  }
  if (lc.includes("госпитализаци") || lc.includes("ориt") || lc.includes("стационар")) {
    if (route === "refer_hospitalization" || route === "call_ems") return true;
  }

  // 2. Rx Builder (рецептурный конструктор)
  if (rx && (rx.isCorrect || rx.mnn || rx.id)) {
    const rxId = String(rx.id || "").toLowerCase();
    const rxMnn = String(rx.mnn || "").toLowerCase();
    if ((lc.includes("спазмолитик") || lc.includes("миотропн")) && (rxId.includes("mebeverine") || rxMnn.includes("мебеверин") || rxId.includes("drotaverine") || rx.isCorrect)) return true;
    if ((lc.includes("удхк") || lc.includes("урсодезоксихолев")) && (rxId.includes("urso") || rxMnn.includes("урсо") || rx.isCorrect)) return true;
    if ((lc.includes("панкреатин") || lc.includes("фермент")) && (rxId.includes("pancreatin") || rxMnn.includes("панкреатин") || rx.isCorrect)) return true;
    if ((lc.includes("прокинетик") || lc.includes("итоприд")) && (rxId.includes("itopride") || rxMnn.includes("итоприд") || rx.isCorrect)) return true;
    if ((lc.includes("месалазин") || lc.includes("5-аск")) && (rxId.includes("mesalazine") || rxMnn.includes("месалазин") || rx.isCorrect)) return true;
    if ((lc.includes("ипп") || lc.includes("омепразол")) && (rxId.includes("omeprazole") || rxMnn.includes("омепразол") || rx.isCorrect)) return true;
    if (lc.includes("эрадикаци") && (rxId.includes("clarithromycin") || rx.isCorrect)) return true;
    if (lc.includes("желез") && (rxId.includes("iron") || rxMnn.includes("желез") || rx.isCorrect)) return true;
  }

  // 3. Прямой поиск по словарю ключевых слов
  for (const [keyword, id] of Object.entries(CHECKLIST_MAP)) {
    if (lc.includes(keyword) && (dList.includes(id) || tList.includes(id))) return true;
  }

  // 4. Поиск по алиасам групп
  for (const [keyword, ids] of Object.entries(DIAG_ALIASES)) {
    if (lc.includes(keyword) && ids.some((id) => dList.includes(id) || tList.includes(id))) return true;
  }

  return false;
}
