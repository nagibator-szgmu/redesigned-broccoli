/**
 * Справочник параметров монокомпонентных и узкофокусных лабораторных тестов.
 */

export const TROPONIN_PARAMETERS = [
  { id: "trop_i", name: "Высокочувствительный тропонин I (hs-cTnI)", unit: "нг/мл", refRange: "< 0.04", refMax: 0.04, defaultVal: "0.012 нг/мл", keys: ["тропонин", "hs-ctni", "ctni"] },
];

export const BNP_PARAMETERS = [
  { id: "bnp_val", name: "Натрийуретический пептид (NT-proBNP)", unit: "пг/мл", refRange: "< 125", refMax: 125, defaultVal: "48 пг/мл", keys: ["bnp", "nt-probnp", "пептид"] },
];

export const CRP_PARAMETERS = [
  { id: "crp_val", name: "С-реактивный белок (СРБ)", unit: "мг/л", refRange: "< 5.0", refMax: 5.0, defaultVal: "1.4 мг/л", keys: ["срб", "crp", "с-реактивн"] },
];

export const PROCALCITONIN_PARAMETERS = [
  { id: "pct_val", name: "Прокальцитонин (PCT)", unit: "нг/мл", refRange: "< 0.5", refMax: 0.5, defaultVal: "0.06 нг/мл", keys: ["прокальцитонин", "pct"] },
];

export const D_DIMER_PARAMETERS = [
  { id: "ddimer_val", name: "D-димер (D-dimer)", unit: "нг/мл FEU", refRange: "< 500", refMax: 500, defaultVal: "210 нг/мл FEU", keys: ["d-димер", "димер"] },
];

export const GLUCOSE_PARAMETERS = [
  { id: "gluc_val", name: "Глюкоза крови (гликемия)", unit: "ммоль/л", refRange: "3.9–6.1", refMin: 3.9, refMax: 6.1, defaultVal: "5.1 ммоль/л", keys: ["глюкоз", "сахар"] },
];

export const LACTATE_PARAMETERS = [
  { id: "lact_val", name: "Лактат плазмы крови (молочная кислота)", unit: "ммоль/л", refRange: "0.5–2.0", refMin: 0.5, refMax: 2.0, defaultVal: "1.2 ммоль/л", keys: ["лактат", "lactate"] },
];

export const KETONES_PARAMETERS = [
  { id: "keto_val", name: "Кетоны крови (бета-гидроксибутират)", unit: "ммоль/л", refRange: "< 0.6", refMax: 0.6, defaultVal: "0.18 ммоль/л", keys: ["кетон", "бета-оксибутират"] },
];

export const COHB_PARAMETERS = [
  { id: "cohb_val", name: "Карбоксигемоглобин (COHb)", unit: "%", refRange: "< 2.0 (некур.) / < 5.0 (кур.)", refMax: 2.0, defaultVal: "0.8%", keys: ["карбоксигемоглобин", "cohb"] },
];

export const FERRITIN_PARAMETERS = [
  { id: "ferr_val", name: "Ферритин сыворотки", unit: "мкг/л", refRange: "30–250", refMin: 30, refMax: 250, defaultVal: "115 мкг/л", keys: ["ферритин"] },
  { id: "ferr_fe", name: "Сывороточное железо", unit: "мкмоль/л", refRange: "9.0–30.0", refMin: 9.0, refMax: 30.0, defaultVal: "18.4 мкмоль/л", keys: ["железо", "fe"] },
];

export const CELIAC_PARAMETERS = [
  { id: "celiac_ttg", name: "АТ к тканевой трансглутаминазе IgA", unit: "Ед/мл", refRange: "< 10.0 (отр)", refMax: 10.0, defaultVal: "2.4 Ед/мл", keys: ["anti-ttg", "трансглутаминаз", "тканевой трансглутаминазе", "ttg"] },
  { id: "celiac_iga", name: "Общий сывороточный иммуноглобулин A", unit: "г/л", refRange: "0.7–4.0", refMin: 0.7, refMax: 4.0, defaultVal: "2.1 г/л", keys: ["общий iga", "сывороточный iga", "общий сывороточный", "общий иммуноглобулин"] },
];

export const SPO2_PARAMETERS = [
  { id: "spo2_val", name: "Сатурация гемоглобина кислородом (SpO₂)", unit: "%", refRange: "95–100", refMin: 95, refMax: 100, defaultVal: "98%", keys: ["spo2", "spo₂", "сатурация", "сатураци"] },
];
