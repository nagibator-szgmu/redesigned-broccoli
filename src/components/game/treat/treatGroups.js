export const TREAT_GROUPS = [
  { id: "all", label: "Все" },
  { id: "emergency", label: "Экстренные" },
  { id: "cardiovascular", label: "Кардио" },
  { id: "analgesia", label: "Анальгезия" },
  { id: "respiratory", label: "Дыхание" },
  { id: "antimicrobial", label: "Антимикробные" },
  { id: "fluid", label: "Инфузии" },
  { id: "other", label: "Прочие" },
];

/** Helper to match treatments to clinical groups */
export function matchTreatGroup(item, cat) {
  if (!cat || cat === "all") return true;
  if (cat === "emergency") {
    return (
      [
        "intubation",
        "defibrillation",
        "chest_compressions",
        "pericardiocentesis",
        "epinephrine_im",
        "naloxone",
        "atropine",
        "activated_charcoal",
        "gastric_lavage",
        "succinylcholine",
      ].includes(item.id) || item.cat === "intervention"
    );
  }
  if (cat === "analgesia") {
    return (
      ["morphine", "ketamine", "diazepam", "levetiracetam"].includes(item.id) ||
      item.cat === "analgesic" ||
      item.cat === "anticonvulsant"
    );
  }
  if (cat === "cardiovascular") {
    return (
      [
        "aspirin",
        "heparin",
        "thrombolysis",
        "nitroglycerin",
        "metoprolol",
        "amiodarone",
        "pci",
        "ACE_inhibitor",
        "digoxin",
        "nimodipine",
        "magnesium",
        "dopamine",
        "vasopressin",
        "norepinephrine",
        "epinephrine",
      ].includes(item.id) ||
      [
        "cardiac",
        "antiplatelet",
        "anticoagulant",
        "betablocker",
        "antiarrhythmic",
        "vasopressor",
      ].includes(item.cat)
    );
  }
  if (cat === "respiratory") {
    return (
      ["oxygen", "steroids", "intubation"].includes(item.id) ||
      item.cat === "supportive" ||
      item.cat === "steroid"
    );
  }
  if (cat === "antimicrobial") {
    return (
      ["antibiotics_broad", "acyclovir"].includes(item.id) ||
      item.cat === "antibiotic" ||
      item.cat === "antiviral"
    );
  }
  if (cat === "fluid") {
    return (
      [
        "iv_fluids",
        "warm_iv",
        "blood_transfusion",
        "furosemide",
        "mannitol",
        "dialysis",
        "aminocaproic_acid",
      ].includes(item.id) ||
      item.cat === "diuretic" ||
      item.cat === "renal"
    );
  }
  if (cat === "other") {
    return (
      ["insulin", "dextrose", "thyroxine", "surgery_consult"].includes(item.id) ||
      item.cat === "endocrine"
    );
  }
  // Fallbacks for legacy category strings
  if (cat === "meds") return item.cat !== "intervention";
  if (cat === "invasive") return item.cat === "intervention";
  return item.cat === cat;
}
