import { BMP_PARAMETERS, URINE_PARAMETERS } from "./labCatalog.js";
import { TEG_PARAMETERS, CBC_PARAMETERS, COAG_PARAMETERS, ABG_PARAMETERS } from "./panelCatalogsHemo.js";
import {
  THYROID_PARAMETERS,
  LUMBAR_PARAMETERS,
  PARACENTESIS_PARAMETERS,
  TOX_PARAMETERS,
  TYPE_CROSS_PARAMETERS,
  PH_IMPEDANCE_PARAMETERS,
  PCR_STOOL_PARAMETERS,
  CULTURE_PARAMETERS,
} from "./panelCatalogsSpecial.js";
import {
  TROPONIN_PARAMETERS,
  BNP_PARAMETERS,
  CRP_PARAMETERS,
  PROCALCITONIN_PARAMETERS,
  D_DIMER_PARAMETERS,
  GLUCOSE_PARAMETERS,
  LACTATE_PARAMETERS,
  KETONES_PARAMETERS,
  COHB_PARAMETERS,
  FERRITIN_PARAMETERS,
  CELIAC_PARAMETERS,
  SPO2_PARAMETERS,
} from "./singleLabCatalogs.js";

const LAB_TEST_REGISTRY = {
  bmp: { title: "Протокол биохимического исследования сыворотки крови", sample: "Венозная кровь (сыворотка)", params: BMP_PARAMETERS },
  urine: { title: "Протокол общего анализа мочи (клинический)", sample: "Утренняя порция мочи", params: URINE_PARAMETERS },
  cbc: { title: "Протокол клинического анализа крови (ОАК)", sample: "ЭДТА цельная кровь", params: CBC_PARAMETERS },
  coag: { title: "Протокол исследования системы гемостаза (коагулограмма)", sample: "Цитратная плазма", params: COAG_PARAMETERS },
  coag_full: { title: "Протокол тромбоэластографии (TEG)", sample: "Цельная цитратная кровь", params: TEG_PARAMETERS },
  abg: { title: "Протокол исследования газов крови и КЩС", sample: "Гепаринизированная артериальная кровь", params: ABG_PARAMETERS },
  thyroid: { title: "Протокол исследования функции щитовидной железы", sample: "Сыворотка крови", params: THYROID_PARAMETERS },
  lumbar: { title: "Протокол цитологического и биохимического анализа ликвора", sample: "Спинномозговая жидкость (ликвор)", params: LUMBAR_PARAMETERS },
  paracentesis: { title: "Протокол лабораторного анализа асцитической жидкости", sample: "Асцитическая жидкость", params: PARACENTESIS_PARAMETERS },
  tox_screen: { title: "Протокол предварительного токсикологического скрининга", sample: "Моча / венозная кровь", params: TOX_PARAMETERS },
  type_cross: { title: "Протокол изосерологического типирования крови", sample: "Сыворотка + эритроциты", params: TYPE_CROSS_PARAMETERS },
  ph_impedance: { title: "Протокол суточной рН-импедансометрии пищевода", sample: "Пищеводный катетер (24 ч)", params: PH_IMPEDANCE_PARAMETERS },
  pcr_stool: { title: "Протокол молекулярно-генетического анализа кала (ПЦР)", sample: "Кал", params: PCR_STOOL_PARAMETERS },
  culture: { title: "Протокол бактериологического исследования (посев)", sample: "Гемокультура / Мокрота / Моча", params: CULTURE_PARAMETERS },
  troponin: { title: "Протокол исследования кардиоспецифических тропонинов", sample: "Венозная кровь", params: TROPONIN_PARAMETERS },
  bnp: { title: "Протокол определения уровня натрийуретических пептидов", sample: "Сыворотка крови", params: BNP_PARAMETERS },
  crp: { title: "Протокол определения C-реактивного белка (СРБ)", sample: "Сыворотка крови", params: CRP_PARAMETERS },
  procalcitonin: { title: "Протокол исследования уровня прокальцитонина (PCT)", sample: "Плазма крови", params: PROCALCITONIN_PARAMETERS },
  d_dimer: { title: "Протокол исследования уровня D-димера", sample: "Цитратная плазма", params: D_DIMER_PARAMETERS },
  glucose: { title: "Протокол определения концентрации глюкозы в крови", sample: "Капиллярная / венозная кровь", params: GLUCOSE_PARAMETERS },
  lactate: { title: "Протокол определения концентрации лактата в плазме", sample: "Плазма крови", params: LACTATE_PARAMETERS },
  ketones: { title: "Протокол исследования уровня кетоновых тел", sample: "Капиллярная кровь", params: KETONES_PARAMETERS },
  cohb: { title: "Протокол исследования фракций гемоглобина (COHb)", sample: "Гепаринизированная кровь", params: COHB_PARAMETERS },
  ferritin: { title: "Протокол исследования обмена железа и ферритина", sample: "Сыворотка крови", params: FERRITIN_PARAMETERS },
  serology_celiac: { title: "Протокол серологической диагностики целиакии", sample: "Сыворотка крови", params: CELIAC_PARAMETERS },
  spo2: { title: "Протокол пульсоксиметрии (SpO₂)", sample: "Неинвазивный оптический датчик", params: SPO2_PARAMETERS },
};

export function isLabReportSupported(testId) {
  return Boolean(LAB_TEST_REGISTRY[testId]);
}

export function getLabParametersForTest(testId) {
  return LAB_TEST_REGISTRY[testId]?.params || null;
}

export function getLabTestMeta(testId, fallbackTitle = "") {
  const reg = LAB_TEST_REGISTRY[testId];
  return {
    title: reg?.title || fallbackTitle || testId?.toUpperCase() || "Лабораторное исследование",
    sample: reg?.sample || "Клинический биоматериал",
  };
}

export function extractLabConclusion(rawText = "") {
  if (!rawText) return null;
  const cleaned = rawText.replace(/^🔴\s*/, "").replace(/^[\u{1F7E1}\u{26A0}]\s*/u, "").trim();
  const sentences = cleaned.split(/(?:\. |\n)+/).map(s => s.trim()).filter(Boolean);
  const narrative = sentences.find(s => {
    const l = s.toLowerCase();
    return (
      l.includes("синдром") || l.includes("коагуляц") || l.includes("ацидоз") ||
      l.includes("алкалоз") || l.includes("сдвиг") || l.includes("лейкоцитоз") ||
      l.includes("анеми") || l.includes("тиреотоксикоз") || l.includes("гипотиреоз") ||
      l.includes("диссоциац") || l.includes("перитонит") || l.includes("воспален") ||
      l.includes("шок") || l.includes("интоксикац") || l.includes("некроз") ||
      l.includes("инфаркт") || l.includes("ишеми") || l.includes("гипоксеми") ||
      l.includes("сепсис") || l.includes("недостаточност") || l.includes("отравлен") ||
      l.includes("патогномонич") || l.includes("декомпенсац") || l.includes("дефицит") ||
      l.includes("хсн") || l.includes("nstemi") || l.includes("stemi")
    );
  });
  if (!narrative) return null;
  return narrative.replace(/^—\s*/, "").replace(/[.]+$/, "").trim();
}
