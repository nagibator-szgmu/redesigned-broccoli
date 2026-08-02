#!/usr/bin/env node
/**
 * Splits cases.js into department-based files.
 * Creates emergency/{cardiac,neuro,respiratory,infectious,endocrine,toxicology,abdominal}.js
 * Creates outpatient.js and stationary.js
 * Creates index.js barrel export
 */
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const CASES_PATH = join(ROOT, 'src', 'data', 'cases.js');
const OUT_DIR = join(ROOT, 'src', 'data', 'cases');
const EMERG_DIR = join(OUT_DIR, 'emergency');

mkdirSync(EMERG_DIR, { recursive: true });

// ── Parse original cases ──
const raw = readFileSync(CASES_PATH, 'utf8');
const exportMatch = raw.match(/export const CASES = \[([\s\S]*?)\];/);
if (!exportMatch) { console.error('Cannot parse CASES array'); process.exit(1); }

// Evaluate the array safely
const casesStr = `[${exportMatch[1]}]`;
const CASES = eval(casesStr);

console.log(`Parsed ${CASES.length} cases from cases.js`);

// ── Category → file mapping ──
const CATEGORY_MAP = {
  cardiac:     { file: 'cardiac.js',     exportName: 'CARDIAC_CASES' },
  neuro:       { file: 'neuro.js',       exportName: 'NEURO_CASES' },
  respiratory: { file: 'respiratory.js', exportName: 'RESPIRATORY_CASES' },
  infectious:  { file: 'infectious.js',  exportName: 'INFECTIOUS_CASES' },
  endocrine:   { file: 'endocrine.js',   exportName: 'ENDOCRINE_CASES' },
  toxicology:  { file: 'toxicology.js',  exportName: 'TOXICOLOGY_CASES' },
  abdominal:   { file: 'abdominal.js',   exportName: 'ABDOMINAL_CASES' },
};

// ── Diagnosis variants per case (Russian, matching case language) ──
const DIAGNOSIS_VARIANTS = {
  1:  ["Острый инфаркт миокарда передней стенки", "Нестабильная стенокардия", "Расслоение аорты"],
  2:  ["Острая декомпенсация ХСН", "Отёк лёгких", "Бронхиальная астма"],
  3:  ["NSTEMI", "Нестабильная стенокардия", "Стенокардия Принцметала"],
  4:  ["Тампонада сердца", "Экссудативный перикардит", "ТЭЛА"],
  5:  ["Полная АВ-блокада", "Синдром слабости синусового узла", "Брадикардия при гипотиреозе"],
  6:  ["Эпилептический статус", "Тонико-клонические судороги", "Судороги при менингите"],
  7:  ["Геморрагический инсульт", "Ишемический инсульт", "Субарахноидальное кровоизлияние"],
  8:  ["Бактериальный менингит", "Вирусный менингит", "Менингоэнцефалит"],
  9:  ["Ишемический инсульт", "Транзиторная ишемическая атака", "Геморрагический инсульт"],
  10: ["ВПГ-энцефалит", "Бактериальный менингоэнцефалит", "Аутоиммунный энцефалит"],
  11: ["Тяжёлая внебольничная пневмония", "Сепсис", "ТЭЛА"],
  12: ["Тяжёлое обострение ХОБЛ", "Бронхиальная астма", "Пневмония"],
  13: ["Напряжённый пневмоторакс", "Открытый пневмоторакс", "Гемоторакс"],
  14: ["ОРДС", "Двусторонняя пневмония", "Кардиогенный отёк лёгких"],
  15: ["Массивная ТЭЛА", "Инфаркт миокарда", "Расслоение аорты"],
  16: ["Уросепсис", "Острый пиелонефрит", "Почечная колика"],
  17: ["Инфекционный эндокардит", "Септический шок", "Саркоидоз"],
  18: ["Тяжёлый грипп A(H1N1)", "Бактериальная пневмония", "ОРДС"],
  19: ["Некротизирующий фасциит", "Целлюлит", "Газовая гангрена"],
  20: ["ПЦП (Pneumocystis)", "Туберкулёз лёгких", "Саркоидоз"],
  21: ["Диабетический кетоацидоз", "Гиперосмолярное состояние", "Лактат-ацидоз"],
  22: ["Тиреотоксический криз", "Сепсис", "Адренергический криз"],
  23: ["Аддисонический криз", "Септический шок", "Дегидратация"],
  24: ["Гипогликемическая кома", "Инсульт", "Эпилептический статус"],
  25: ["Гипогликемическая кома", "Инсульт", "Энцефалопатия"],
  26: ["ФОС-отравление", "ТЦА-отравление", "Миастенический криз"],
  27: ["ТЦА-отравление", "ФОС-отравление", "Антихолинергическое отравление"],
  28: ["Алкогольная кома", "Опиоидная интоксикация", "Инсульт"],
  29: ["Кокаиновая интоксикация", "Инфаркт миокарда", "Гипертонический криз"],
  30: ["CO-отравление", "Инсульт", "Метгемоглобинемия"],
  31: ["Острый аппендицит", "Почечная колика", "Болезнь Крона"],
  32: ["ОЖК кровотечение", "Варикозное кровотечение", "Синдром Мэллори-Вейса"],
  33: ["Острый холангит", "Острый холецистит", "Панкреатит"],
  34: ["Расслоение аорты", "Инфаркт миокарда", "ТЭЛА"],
  35: ["Острая мезентериальная ишемия", "Перфоративная язва", "Острый панкреатит"],
};

// ── Checklist items per case (English) ──
const CHECKLIST_ITEMS = {
  1:  ["Obtain 12-lead ECG within 10 minutes", "Check troponin levels", "Administer aspirin 300mg", "Start IV heparin", "Activate PCI team"],
  2:  ["Assess respiratory distress severity", "Obtain chest X-ray and BNP", "Start IV furosemide", "Administer nitrates if SBP>90", "Avoid beta-blockers"],
  3:  ["Obtain serial ECGs and troponin", "Score TIMI risk", "Start dual antiplatelet therapy", "Initiate heparin infusion", "Plan early invasive strategy"],
  4:  ["Identify Beck's triad", "Obtain echocardiography", "Prepare for pericardiocentesis", "Avoid diuretics", "Maintain IV fluids"],
  5:  ["Identify complete heart block on ECG", "Administer IV atropine", "Prepare transcutaneous pacing", "Avoid beta-blockers and amiodarone", "Consult cardiology for permanent pacemaker"],
  6:  ["Check blood glucose", "Administer IV benzodiazepine", "Protect airway", "Monitor for respiratory depression", "Prepare for intubation if needed"],
  7:  ["Obtain urgent CT head", "Check coagulation studies", "Avoid thrombolytics", "Start mannitol for elevated ICP", "Consult neurosurgery"],
  8:  ["Administer empiric antibiotics within 1 hour", "Perform lumbar puncture if safe", "Start dexamethasone before antibiotics", "Monitor neurological status", "Avoid acyclovir for bacterial meningitis"],
  9:  ["Obtain CT head (rule out hemorrhage)", "Check coagulation and glucose", "Administer IV thrombolysis if within 4.5h", "Avoid aspirin in first 24h post-thrombolysis", "Monitor for neurological deterioration"],
  10: ["Start IV acyclovir immediately", "Obtain lumbar puncture for PCR", "Obtain MRI if available", "Monitor for seizures", "Avoid empiric antibiotics without indication"],
  11: ["Obtain chest X-ray and blood cultures", "Start broad-spectrum antibiotics within 1 hour", "Provide supplemental oxygen", "Start IV fluid resuscitation", "Assess CURB-65 score"],
  12: ["Obtain arterial blood gas", "Start controlled oxygen therapy", "Administer nebulized bronchodilators", "Start systemic steroids", "Consider non-invasive ventilation"],
  13: ["Perform immediate needle decompression", "Obtain chest X-ray", "Prepare chest tube insertion", "Avoid IV fluid overload", "Monitor for tension pneumothorax recurrence"],
  14: ["Obtain chest X-ray and ABG", "Initiate lung-protective ventilation (6 mL/kg)", "Monitor PaO2/FiO2 ratio", "Treat underlying infection", "Avoid liberal fluid strategy"],
  15: ["Obtain CT pulmonary angiography", "Start IV heparin immediately", "Administer systemic thrombolysis if unstable", "Provide supplemental oxygen", "Monitor for hemodynamic deterioration"],
  16: ["Obtain blood and urine cultures", "Start broad-spectrum antibiotics within 1 hour", "Administer IV fluid resuscitation", "Initiate vasopressors if MAP<65", "Monitor lactate clearance"],
  17: ["Obtain blood cultures x3", "Start empiric IV antibiotics", "Obtain echocardiography", "Avoid thrombolytics", "Consult cardiac surgery"],
  18: ["Obtain nasopharyngeal swab for PCR", "Provide supplemental oxygen", "Start oseltamivir if influenza confirmed", "Monitor for respiratory failure", "Avoid morphine in respiratory distress"],
  19: ["Obtain urgent surgical consultation", "Start broad-spectrum antibiotics", "Perform surgical debridement", "Monitor for sepsis progression", "Avoid delayed surgical intervention"],
  20: ["Obtain chest X-ray and ABG", "Start TMP-SMX empirically", "Add corticosteroids if PaO2<70", "Check CD4 count and HIV status", "Monitor oxygen saturation"],
  21: ["Check blood glucose and ketones", "Start aggressive IV saline resuscitation", "Initiate insulin infusion after K>3.5", "Monitor electrolytes hourly", "Avoid steroids and furosemide"],
  22: ["Check thyroid function tests", "Start beta-blocker for tachycardia", "Administer propylthiouracil or methimazole", "Avoid amiodarone (iodine content)", "Start IV hydrocortisone"],
  23: ["Check serum cortisol level", "Administer IV hydrocortisone 100mg immediately", "Start aggressive IV fluid resuscitation", "Correct hypoglycemia with dextrose", "Monitor sodium and potassium closely"],
  24: ["Check blood glucose immediately", "Administer IV dextrose 40%", "Monitor neurological recovery", "Avoid insulin administration", "Identify and treat underlying cause"],
  25: ["Check blood glucose immediately", "Administer IV dextrose 40%", "Monitor for seizure activity", "Avoid insulin at all costs", "Investigate cause of insulin overdose"],
  26: ["Assess for SLUD syndrome", "Administer IV atropine", "Prepare for intubation if respiratory failure", "Monitor pseudocholinesterase levels", "Avoid beta-blockers"],
  27: ["Obtain 12-lead ECG (check QRS width)", "Prepare sodium bicarbonate", "Secure airway and assist ventilation", "Avoid amiodarone", "Monitor for ventricular arrhythmias"],
  28: ["Check blood glucose", "Provide 100% oxygen via non-rebreather", "Protect airway from aspiration", "Administer IV dextrose if hypoglycemic", "Avoid benzodiazepines and opioids"],
  29: ["Obtain 12-lead ECG", "Administer benzodiazepine for agitation", "Give nitroglycerin for chest pain", "Avoid beta-blockers absolutely", "Monitor for arrhythmias"],
  30: ["Administer 100% oxygen immediately", "Obtain carboxyhemoglobin level", "Prepare for intubation if GCS low", "Monitor for cardiac arrhythmias", "Avoid pulse oximetry for monitoring"],
  31: ["Obtain CBC, CRP, and ultrasound", "Start IV antibiotics", "Consult surgery for appendectomy", "Monitor for peritoneal signs", "Avoid morphine (masks symptoms)"],
  32: ["Establish large-bore IV access", "Start aggressive fluid resuscitation", "Obtain emergency endoscopy", "Transfuse packed red blood cells", "Avoid anticoagulants"],
  33: ["Obtain blood cultures and liver function tests", "Start IV antibiotics", "Perform urgent biliary decompression", "Monitor for septic shock", "Avoid morphine (sphincter spasm)"],
  34: ["Obtain CT angiography of aorta", "Start IV beta-blocker to reduce dP/dt", "Consult vascular surgery", "Avoid thrombolytics and anticoagulants", "Monitor blood pressure in both arms"],
  35: ["Obtain lactate level", "Start IV heparin", "Consult surgery for embolectomy", "Monitor for peritoneal signs", "Avoid morphine and furosemide"],
};

// ── Enrich each case with new fields ──
function enrichCase(c) {
  return {
    ...c,
    department: 'emergency',
    sourceReference: { name: 'Clinical guidelines', year: 2024 },
    diagnosisVariants: DIAGNOSIS_VARIANTS[c.id] || [c.diagnosis, 'Alternative 1', 'Alternative 2'],
    checklistItems: CHECKLIST_ITEMS[c.id] || ['Assess patient', 'Order diagnostics', 'Initiate treatment', 'Monitor response'],
  };
}

// ── Write emergency files ──
const grouped = {};
for (const c of CASES) {
  const cat = c.category || 'emergency';
  if (!grouped[cat]) grouped[cat] = [];
  grouped[cat].push(enrichCase(c));
}

const imports = `import { DIAGNOSTICS } from '../diagnostics.js';\nimport { TREATMENTS } from '../treatments.js';\n`;

for (const [cat, info] of Object.entries(CATEGORY_MAP)) {
  const cases = grouped[cat];
  if (!cases) {
    console.error(`WARNING: No cases for category "${cat}"`);
    continue;
  }
  const content = `${imports}\nexport const ${info.exportName} = ${JSON.stringify(cases, null, 2)};\n`;
  writeFileSync(join(EMERG_DIR, info.file), content, 'utf8');
  console.log(`  ${info.file}: ${cases.length} cases`);
}

// ── Outpatient cases ──
const OUTPATIENT_CASES = [
  {
    id: 'outp_1', name: 'Петрова Мария Ивановна', age: 45, gender: 'Ж',
    complaint: 'Повышение артериального давления до 180/110 мм рт.ст., головная боль, мелькание «мушек» перед глазами',
    vitals: { bp: '180/110', hr: 92, rr: 18, temp: 36.6, spo2: 97 },
    initialGCS: 15, initialPain: 4,
    deterioration: { hr: 0.5, sbp: 1, dbp: 0.5, rr: 0, spo2: 0, temp: 0, gcs: 0, pain: 0 },
    deathThresholds: { sbp: 200, gcs: 4 },
    anamnesis: 'Гипертоническая болезнь 10 лет, нерегулярно принимает эналаприл. Сегодня забыла принять препарат. Головная боль с утра, визуальные нарушения.',
    exam: 'Сознание ясное. АД 180/110 на обеих руках. Тоны сердца ясные, ритм правильный. Отёков нет. Пульс на периферических артериях симметричный.',
    severity: 'moderate', category: 'cardiac',
    diagnosis: 'Гипертонический криз II степени. АГ 3 ст.',
    department: 'outpatient',
    testResults: {
      ecg: 'Синусовый ритм 92. Гипертрофия левого желудочка. Изменения ST-T.',
      cbc: 'Лейк 8.4. Hb 138. Норма.',
      bmp: 'Креатинин 98 мкмоль/л. Мочевина 7.2. Электролиты норма.',
      glucose: 'Глюкоза 6.2 ммоль/л (умеренно повышена).',
      urine: 'ОАМ: белок 0.066 г/л (микроальбуминурия). Лейкоциты, эритроциты — норма.',
    },
    needDiag: ['ecg', 'cbc', 'bmp', 'glucose', 'urine'],
    needTreat: ['metoprolol', 'iv_fluids'],
    wrongTreat: ['thrombolysis', 'morphine'],
    timeLimit: 15,
    tip: 'При гипертоническом кризе II степени: медленное снижение АД (не более 25% за первые часы). Резкое снижение опасно ишемией мозга и почек.',
    debrief: { explain: 'Гипертонический криз II степени — АД >180/110 с признаками поражения органов-мишеней. Медленное снижение (20-25% за 1-2 часа) предотвращает церебральную и почечную ишемию. β-блокаторы снижают ЧСС и сердечный выброс, контролируя АД.' },
    sourceReference: { name: 'Clinical guidelines', year: 2024 },
    diagnosisVariants: ['Гипертонический криз', 'Вторичная артериальная гипертензия', 'Феохромоцитома'],
    checklistItems: ['Measure blood pressure in both arms', 'Obtain 12-lead ECG', 'Check renal function and electrolytics', 'Initiate gradual BP reduction', 'Monitor for end-organ damage'],
  },
  {
    id: 'outp_2', name: 'Сидоров Алексей Николаевич', age: 55, gender: 'М',
    complaint: 'Боль в правом подреберье после жирной пищи, тошнота, горечь во рту',
    vitals: { bp: '130/80', hr: 78, rr: 16, temp: 36.8, spo2: 98 },
    initialGCS: 15, initialPain: 6,
    deterioration: { hr: 0.3, sbp: 0, dbp: 0, rr: 0, spo2: 0, temp: 0, gcs: 0, pain: 0.2 },
    deathThresholds: { gcs: 4 },
    anamnesis: 'Боль в правом подреберье повторяется 2 года после жирной пищи. УЗИ 1 год назад — конкременты желчного пузыря 8 и 12 мм. Холецистит не оперирован.',
    exam: 'Живот мягкий, болезненный в правом подреберье. Симптом Мерфи положительный. Печень не увеличена. Склеры чистые.',
    severity: 'moderate', category: 'abdominal',
    diagnosis: 'Желчнокаменная болезнь. Хронический калькулёзный холецистит.',
    department: 'outpatient',
    testResults: {
      usg_abdo: 'УЗИ: конкременты желчного пузыря 8, 12, 15 мм. Стенка утолщена до 5 мм. Перивезикальная жидкость не определяется.',
      cbc: 'Лейк 9.2. Hb 148. Норма.',
      bmp: 'Билирубин общий 18 мкмоль/л (норма). АЛТ 42 Ед/л (upper normal). ЩФ 180 Ед/л (умеренно повышена).',
      crp: 'СРБ 8 мг/л (умеренно повышена — хроническое воспаление).',
    },
    needDiag: ['usg_abdo', 'cbc', 'bmp', 'crp'],
    needTreat: ['antibiotics_broad', 'iv_fluids'],
    wrongTreat: ['morphine', 'thrombolysis'],
    timeLimit: 15,
    tip: 'При хроническом калькулёзном холецистите: плановая холецистэктомия. Морфин вызывает спазм сфинктера Одди и усиливает желчную колику.',
    debrief: { explain: 'Желчнокаменная болезнь: насыщение желчи холестерином → образование конкрементов → хроническое воспаление. Морфин увеличивает тонус сфинктера Одди, что усугубляет желчную гипертензию и боль. Плановая холецистэктомия — стандарт лечения при симптоматических камнях.' },
    sourceReference: { name: 'Clinical guidelines', year: 2024 },
    diagnosisVariants: ['Желчнокаменная болезнь', 'Хронический холецистит', 'Дуоденит'],
    checklistItems: ['Obtain abdominal ultrasound', 'Check liver function tests', 'Assess for acute cholecystitis signs', 'Plan elective cholecystectomy', 'Advise dietary modifications'],
  },
  {
    id: 'outp_3', name: 'Козлова Елена Дмитриевна', age: 38, gender: 'Ж',
    complaint: 'Слабость, утомляемость, выпадение волос, зябкость, запоры, сухость кожи',
    vitals: { bp: '110/70', hr: 58, rr: 14, temp: 35.8, spo2: 98 },
    initialGCS: 15, initialPain: 0,
    deterioration: { hr: -0.2, sbp: 0, dbp: 0, rr: 0, spo2: 0, temp: -0.02, gcs: 0, pain: 0 },
    deathThresholds: { gcs: 4 },
    anamnesis: 'Симптомы нарастают 6 месяцев. Прибавка веса 8 кг за 3 месяца. Сухость кожи, ломкость ногтей, выпадение волос. Запоры, менструации скудные.',
    exam: 'Кожа сухая, бледная, с желтоватым оттенком. Отёки лица и голеней. Волосы тусклые, ломкие. Щитовидная железа не увеличена. Брадикардия 58. Рефлексы замедлены.',
    severity: 'moderate', category: 'endocrine',
    diagnosis: 'Гипотиреоз. Субкомпенсированный.',
    department: 'outpatient',
    testResults: {
      thyroid: 'ТТГ 18.4 мМЕ/л ↑↑ (норма 0.4-4.0). Т4 свободный 4.2 пмоль/л ↓ (норма 12-22). Классический первичный гипотиреоз.',
      cbc: 'Hb 98 г/л ↓ (анемия — характерна для гипотиреоза). Лейк 5.2. Макроцитоз (B12 дефицит?).',
      bmp: 'Холестерин 8.4 ммоль/л ↑↑ (дислипидемия при гипотиреозе). Креатинин 112 ↑. Натрий 132 ↓.',
      glucose: 'Глюкоза 4.8 ммоль/л — норма.',
    },
    needDiag: ['thyroid', 'cbc', 'bmp', 'glucose'],
    needTreat: ['iv_fluids'],
    wrongTreat: ['metoprolol', 'furosemide'],
    timeLimit: 15,
    tip: 'Гипотиреоз: заместительная терапия левотироксином. β-блокаторы при брадикардии противопоказаны — замедляют и без того сниженный метаболизм.',
    debrief: { explain: 'Первичный гипотиреоз: деструкция щитовидной железы (аутоиммунный тиреоидит) → снижение Т3/Т4 → компенсаторный рост ТТГ. Клиника: гипотермия, брадикардия, дислипидемия, анемия, миxedema. Левотироксин — пожизненная заместительная терапия.' },
    sourceReference: { name: 'Clinical guidelines', year: 2024 },
    diagnosisVariants: ['Гипотиреоз', 'Анемия', 'Депрессия'],
    checklistItems: ['Check TSH and free T4', 'Obtain CBC for anemia', 'Check lipid profile', 'Start levothyroxine replacement', 'Monitor TSH in 6-8 weeks'],
  },
  {
    id: 'outp_4', name: 'Морозов Дмитрий Сергеевич', age: 62, gender: 'М',
    complaint: 'Нарастающая одышка при физической нагрузке, отёки голеней, утомляемость',
    vitals: { bp: '135/85', hr: 88, rr: 20, temp: 36.6, spo2: 94 },
    initialGCS: 15, initialPain: 2,
    deterioration: { hr: 0.5, sbp: -0.5, dbp: 0, rr: 0.5, spo2: -0.3, temp: 0, gcs: 0, pain: 0 },
    deathThresholds: { spo2: 85, gcs: 4 },
    anamnesis: 'ИБС, перенёс ОИМ 5 лет назад. Сахарный диабет 2 типа. Одышка при подъёме на 3 этаж нарастает 3 месяца. Отёки голеней к вечеру.',
    exam: 'Умеренная одышка в покое. Отёки голеней симметричные++. Влажные хрипы в нижних отделах лёгких. Печень увеличена на 2 см. АД 135/85, ЧСС 88, ритм правильный с редкими экстрасистолами.',
    severity: 'moderate', category: 'cardiac',
    diagnosis: 'ХСН II ФК по NYHA. Ишемическая кардиомиопатия. ФВ 35%.',
    department: 'outpatient',
    testResults: {
      echo: 'ЭхоКГ: ФВ ЛЖ 35%. Дилатация ЛЖ (КДР 62 мм). Гипокинез передней стенки и верхушки. Митральная регургитация II ст.',
      ecg: 'Синусовый ритм 88. Патологические Q в V1-V4 (постинфарктный кардиосклероз). Одиночные ЖЭС.',
      bnp: 'NT-proBNP 2800 пг/мл ↑ (норма <900). Подтверждает ХСН.',
      cbc: 'Hb 128 г/л. Лейк 7.8. Норма.',
      bmp: 'Креатинин 118 ↑. Натрий 134 ↓. Калий 4.8.',
      xray: 'Рентген: кардиомегалия. Усиление лёгочного рисунка. Умеренный отёк.',
    },
    needDiag: ['echo', 'ecg', 'bnp', 'cbc', 'bmp', 'xray'],
    needTreat: ['furosemide', 'metoprolol', 'iv_fluids'],
    wrongTreat: ['morphine', 'thrombolysis'],
    timeLimit: 15,
    tip: 'ХСН: комбинация диуретиков + β-блокаторов + иАПФ/АРНИ. β-блокаторы снижают ремоделирование и летальность. Морфин — только для острой декомпенсации.',
    debrief: { explain: 'ХСН после ОИМ: гибель миокарда → дилатация ЛЖ → снижение ФВ → застой в малом круге. Доказательная терапия: β-блокаторы + иАПФ/АРНИ + МКС + диуретики. β-блокаторы снижают ремоделирование и внезапную смерть на 30-40%.' },
    sourceReference: { name: 'ESC Heart Failure Guidelines', year: 2024 },
    diagnosisVariants: ['ХСН', 'ХОБЛ', 'Хроническая болезнь почек'],
    checklistItems: ['Obtain echocardiography', 'Check BNP/NT-proBNP', 'Assess volume status', 'Start guideline-directed medical therapy', 'Monitor weight daily'],
  },
  {
    id: 'outp_5', name: 'Волкова Анна Петровна', age: 28, gender: 'Ж',
    complaint: 'Приступы учащённого сердцебиения, потливость, тремор рук, потеря веса',
    vitals: { bp: '140/60', hr: 112, rr: 18, temp: 37.2, spo2: 98 },
    initialGCS: 15, initialPain: 1,
    deterioration: { hr: 1, sbp: 0.5, dbp: -0.5, rr: 0.3, spo2: 0, temp: 0.03, gcs: 0, pain: 0 },
    deathThresholds: { hr: 180, gcs: 4 },
    anamnesis: 'Потеряла 10 кг за 2 месяца без изменения диеты. Постоянно горячая, потливость. Приступы сердцебиения до 140/мин. Раздражительность, тремор рук.',
    exam: 'Худощавое телосложение. Щитовидная железа диффузно увеличена в 3 раза. Экзофтальм. Влажная тёплая кожа. Тремор пальцев. Тахикардия 112, ритм правильный.',
    severity: 'moderate', category: 'endocrine',
    diagnosis: 'Болезнь Грейвса. Диффузный токсический зоб. Тиреотоксикоз.',
    department: 'outpatient',
    testResults: {
      thyroid: 'ТТГ <0.01 мМЕ/л ↓↓ (подавлен). Т4 св. 52 пмоль/л ↑↑. АТ-рТТГ 12 МЕ/л ↑.',
      ecg: 'Синусовая тахикардия 112. QT укорочён. Фибрилляции предсердий нет.',
      cbc: 'Лейк 6.8. Лимфопения. Норма.',
      bmp: 'Кальций 2.78 ↑. АЛТ 48 ↑ (умеренно). Глюкоза 5.8.',
    },
    needDiag: ['thyroid', 'ecg', 'cbc', 'bmp'],
    needTreat: ['metoprolol', 'iv_fluids'],
    wrongTreat: ['amiodarone', 'iodine'],
    timeLimit: 15,
    tip: 'Болезнь Грейвса: β-блокаторы для контроля симптомов + антитиреоидные средства (тиамазол). Амиодарон содержит йод — усугубляет тиреотоксикоз.',
    debrief: { explain: 'Болезнь Грейвса: аутоантитела к рецептору ТТГ → стимуляция синтеза Т3/Т4 → тиреотоксикоз. Клиника: тахикардия, потеря веса, тремор, экзофтальм. Тиамазол блокирует синтез тиреоидных гормонов; β-блокаторы купируют симптомы.' },
    sourceReference: { name: 'ATA Hyperthyroidism Guidelines', year: 2024 },
    diagnosisVariants: ['Болезнь Грейвса', 'Токсическая аденома', 'Подострый тиреоидит'],
    checklistItems: ['Check TSH and free T4', 'Obtain thyroid antibodies', 'Start beta-blocker for symptom control', 'Initiate antithyroid medication', 'Plan radioiodine uptake scan'],
  },
  {
    id: 'outp_6', name: 'Новиков Игорь Владимирович', age: 50, gender: 'М',
    complaint: 'Боль в пояснице при мочеиспускании, частое мочеиспускание, примесь крови в моче',
    vitals: { bp: '130/80', hr: 76, rr: 16, temp: 37.0, spo2: 98 },
    initialGCS: 15, initialPain: 5,
    deterioration: { hr: 0.3, sbp: 0, dbp: 0, rr: 0, spo2: 0, temp: 0.02, gcs: 0, pain: 0.3 },
    deathThresholds: { gcs: 4 },
    anamnesis: 'Дизурия 5 дней. Боль в пояснице справа. Гематурия. Температура 37.0°C. Не лечился.',
    exam: 'Сознание ясное. Живот мягкий, безболезненный. Болезненность при пальпации в правой области почки. Симптом Пастернацкого положительный справа.',
    severity: 'moderate', category: 'infectious',
    diagnosis: 'Острый пиелонефрит справа. Нижняя мочевая инфекция.',
    department: 'outpatient',
    testResults: {
      urine: 'ОАМ: лейкоциты >100/п.з., бактериурия +++, нитриты (+). Эритроциты 15-20/п.з. Белок 0.15 г/л.',
      cbc: 'Лейк 12.4 ↑, нейтрофилёз 78%. Сдвиг влево.',
      bmp: 'Креатинин 88 мкмоль/л — норма. Мочевина 6.8.',
      crp: 'СРБ 45 мг/л ↑ (умеренно повышена).',
      culture: 'Посев мочи: E.coli >10⁵ КОЕ/мл. Чувствительность: ципрофлоксацин — чувствителен.',
    },
    needDiag: ['urine', 'cbc', 'bmp', 'crp', 'culture'],
    needTreat: ['antibiotics_broad', 'iv_fluids'],
    wrongTreat: ['morphine', 'thrombolysis'],
    timeLimit: 15,
    tip: 'Пиелонефрит: антибиотикотерапия 10-14 дней. Антибиотик подбирается по чувствительности. НПВС можно для боли, но следить за функцией почек.',
    debrief: { explain: 'Восходящая мочевая инфекция: E.coli из уретры → мочевой пузырь → мочеточники → почечная лоханка. Лейкоцитурия + бактериурия + нитриты = пиелонефрит. Антибиотикотерапия 10-14 дней; контроль посева мочи через 7-10 дней.' },
    sourceReference: { name: 'IDSA UTI Guidelines', year: 2024 },
    diagnosisVariants: ['Острый пиелонефрит', 'Мочекаменная болезнь', 'Цистит'],
    checklistItems: ['Obtain urinalysis and culture', 'Start empiric antibiotics', 'Check renal function', 'Increase fluid intake', 'Follow up urine culture in 7-10 days'],
  },
];

// ── Stationary cases ──
const STATIONARY_CASES = [
  {
    id: 'stat_1', name: 'Громова Ирина Александровна', age: 70, gender: 'Ж',
    complaint: 'Пневмония, 3-е сутки в стационаре, нарастающая одышка, лихорадка сохраняется',
    vitals: { bp: '100/60', hr: 108, rr: 28, temp: 38.8, spo2: 88 },
    initialGCS: 14, initialPain: 3,
    deterioration: { hr: 1, sbp: -1, dbp: -0.5, rr: 1, spo2: -1, temp: 0.05, gcs: -0.1, pain: 0 },
    deathThresholds: { spo2: 85, sbp: 80 },
    anamnesis: 'Поступила 3 дня назад с тяжёлой внебольничной пневмонией. Получает цефтриаксон + азитромицин. На 3-е сутки — сохранение температуры 38.8°C, нарастание одышки.',
    exam: 'Тахипноэ 28/мин. Цианоз. Влажные хрипы в нижних отделах обоих лёгких. АД 100/60, ЧСС 108. Сознание ясное.',
    severity: 'moderate', category: 'respiratory',
    diagnosis: 'Внебольничная пневмония. Недостаточный ответ на терапию. Возможна резистентная флора.',
    department: 'stationary',
    testResults: {
      xray: 'Рентген: инфильтрация нижней доли правого лёгкого — динамика не значительно лучше.',
      cbc: 'Лейк 16.8 ↑ (сохраняется лейкоцитоз). CRP 180 мг/л ↑.',
      abg: 'pH 7.42, PaO2 62 ↓, PaCO2 38. Гипоксемия.',
      bmp: 'Креатинин 108 ↑. Натрий 132 ↓.',
      culture: 'Посев крови: нет роста. Мокрота: Streptococcus pneumoniae.',
    },
    needDiag: ['xray', 'cbc', 'abg', 'bmp', 'culture'],
    needTreat: ['antibiotics_broad', 'oxygen', 'iv_fluids'],
    wrongTreat: ['morphine', 'furosemide'],
    timeLimit: 15,
    tip: 'Пневмония без ответа на терапию: расширение антибиотикотерапии (пневмококк может быть резистентен). Исключить осложнения (эмпиема, абсцесс).',
    debrief: { explain: 'Недостаточный ответ на АБТ при пневмонии: резистентная флора, осложнения (эмпиема, абсцесс), или альтернативный диагноз. Расширение спектра + визуализация для исключения осложнений.' },
    sourceReference: { name: 'ATS/IDSA CAP Guidelines', year: 2024 },
    diagnosisVariants: ['Внебольничная пневмония', 'Эмпиема', 'Абсцесс лёгкого'],
    checklistItems: ['Review current antibiotic regimen', 'Obtain repeat chest X-ray', 'Check inflammatory markers', 'Consider broadening antibiotics', 'Evaluate for complications'],
  },
  {
    id: 'stat_2', name: 'Лебедев Виктор Михайлович', age: 58, gender: 'М',
    complaint: 'Послеоперационный период, ДВС-синдром, нарастающая кровоточивость',
    vitals: { bp: '90/55', hr: 118, rr: 22, temp: 38.4, spo2: 94 },
    initialGCS: 14, initialPain: 4,
    deterioration: { hr: 1.5, sbp: -1.5, dbp: -1, rr: 0.5, spo2: -0.3, temp: 0.05, gcs: -0.2, pain: 0 },
    deathThresholds: { sbp: 70, gcs: 4 },
    anamnesis: 'Оперирован по поводу перфоративной язвы 2 суток назад. Сепсис. Нарастающая кровоточивость из дренажей, пункций, десен.',
    exam: 'Бледность, холодный пот. Петехии и экхимозы на коже. Кровотечение из послеоперационной раны. АД 90/55, ЧСС 118. Дренажи: геморрагическое отделяемое.',
    severity: 'critical', category: 'infectious',
    diagnosis: 'ДВС-синдром на фоне сепсиса. Коагулопатия потребления.',
    department: 'stationary',
    testResults: {
      coag: 'МНО 3.2 ↑↑↑, АПТВ 78 ↑↑↑. Фибриноген 0.8 г/л ↓↓. Тромбоциты 42×10⁹/л ↓↓.',
      cbc: 'Hb 72 г/л ↓↓ (кровопотеря). Тромбоциты 42 ↓↓. Лейк 24.8.',
      bmp: 'Лактат 5.8 ↑↑. Креатинин 222 ↑↑. Билирубин 48 ↑.',
      crp: 'СРБ 380 мг/л ↑↑. Прокальцитонин 52 нг/мл ↑↑↑.',
      urine: 'ОАМ: эритроциты++. Белок++.',
    },
    needDiag: ['coag', 'cbc', 'bmp', 'crp', 'urine'],
    needTreat: ['antibiotics_broad', 'iv_fluids', 'blood_transfusion'],
    wrongTreat: ['heparin', 'aspirin'],
    timeLimit: 12,
    tip: 'ДВС-синдром при сепсисе: лечение основного заболевания + заместительная терапия (свежезамороженная плазма, тромбоциты, криопреципитат). Гепарин противопоказан при активном кровотечении.',
    debrief: { explain: 'ДВС-синдром: массивная активация коагуляции → потребление факторов свертывания и тромбоцитов → парадоксальное кровотечение. Лечение: антибиотики + ИВЛ + инфузия компонентов крови. Гепарин — только при преобладании тромбоза над кровотечением.' },
    sourceReference: { name: 'ISTH DIC Guidelines', year: 2024 },
    diagnosisVariants: ['ДВС-синдром', 'Тромбоцитопения', 'Коагулопатия'],
    checklistItems: ['Check coagulation panel', 'Monitor platelet count', 'Transfuse FFP and platelets', 'Treat underlying sepsis', 'Avoid anticoagulants during active bleeding'],
  },
  {
    id: 'stat_3', name: 'Федотова Ольга Николаевна', age: 45, gender: 'Ж',
    complaint: 'Астматический статус, не купируется обычными дозами бронхолитиков',
    vitals: { bp: '130/80', hr: 120, rr: 32, temp: 36.8, spo2: 86 },
    initialGCS: 14, initialPain: 3,
    deterioration: { hr: 1, sbp: -0.5, dbp: 0, rr: 1.5, spo2: -1.2, temp: 0, gcs: -0.15, pain: 0 },
    deathThresholds: { spo2: 85, gcs: 4 },
    anamnesis: 'Бронхиальная астма 15 лет. Поступила 2 дня назад с обострением. Получает сальбутамол + ипратропий через небулайзер. На фоне терапии — ухудшение. Пикфлоуметрия 150 л/мин (ожидаемое >350).',
    exam: 'Вынужденное положение — ортопноэ. Экспираторные хрипы во всех отделах. Использование вспомогательных мышц. Речь затруднена (фразовая одышка). АД 130/80, ЧСС 120.',
    severity: 'critical', category: 'respiratory',
    diagnosis: 'Астматический статус. Тяжёлое обострение бронхиальной астмы.',
    department: 'stationary',
    testResults: {
      abg: 'pH 7.38, PaO2 58 ↓↓, PaCO2 42 (нормализация PaCO2 при астме = признак утомления дыхательных мышц!).',
      spo2: 'SpO2 86% на воздухе — тяжёлая гипоксемия.',
      cbc: 'Лейк 12.4 (эозинофилия 8% — атопический компонент).',
      xray: 'Рентген: гиперинфляция, исходная структура лёгких.',
      bmp: 'Калий 3.2 ↓ (после сальбутамола). Лактат 2.8 ↑.',
    },
    needDiag: ['abg', 'spo2', 'cbc', 'xray', 'bmp'],
    needTreat: ['oxygen', 'steroids', 'intubation'],
    wrongTreat: ['metoprolol', 'morphine'],
    timeLimit: 12,
    tip: 'Астматический статус: PaCO2 нормализуется при тяжёлой астме = дыхательная мышца устала → готовность к ИВЛ. β-блокаторы противопоказаны. Системные стероиды снижают воспаление.',
    debrief: { explain: 'Астматический статус: тяжёлая бронхообструкция → гиперинфляция → утомление дыхательных мышц. Нормализация PaCO2 — критический признак: при лёгкой/средней астме PaCO2 снижен (гипервентиляция), нормализация = надвигающаяся дыхательная недостаточность. ИВЛ показана при утомлении.' },
    sourceReference: { name: 'GINA Asthma Guidelines', year: 2024 },
    diagnosisVariants: ['Астматический статус', 'Обострение бронхиальной астмы', 'Сердечная астма'],
    checklistItems: ['Measure peak expiratory flow', 'Obtain arterial blood gas', 'Administer systemic corticosteroids', 'Prepare for intubation if deteriorating', 'Monitor potassium levels'],
  },
  {
    id: 'stat_4', name: 'Кузнецов Александр Петрович', age: 65, gender: 'М',
    complaint: 'Инсульт, 5-е сутки в неврологическом отделении, нарастание неврологического дефицита',
    vitals: { bp: '165/95', hr: 88, rr: 18, temp: 37.4, spo2: 95 },
    initialGCS: 12, initialPain: 2,
    deterioration: { hr: 0.5, sbp: 1, dbp: 0.5, rr: 0.2, spo2: -0.2, temp: 0.02, gcs: -0.3, pain: 0 },
    deathThresholds: { gcs: 4, sbp: 200 },
    anamnesis: 'Ишемический инсульт в бассейне средней мозговой артерии слева. Поступил 5 дней назад. Получает стандартную терапию. Сегодня — нарастание правосторонней гемиплегии, ухудшение речи.',
    exam: 'Сопор, GCS 12. Правосторонняя гемиплегия. Моторная афазия. Нистагм. АД 165/95. ЧСС 88.',
    severity: 'critical', category: 'neuro',
    diagnosis: 'Ишемический инсульт. Геморрагическая трансформация или прогрессирование.',
    department: 'stationary',
    testResults: {
      ct_head: 'КТ: гиподенсный очаг в левой средней мозговой артерии. Возможная геморрагическая трансформация по периферии.',
      cbc: 'Тромбоциты 180. Hb 138. Норма.',
      coag: 'МНО 1.1. АПТВ 28. Норма.',
      bmp: 'Глюкоза 7.2. Креатинин 98. Натрий 136.',
      ecg: 'Фибрилляция предсердий. ЧСС 88.',
    },
    needDiag: ['ct_head', 'cbc', 'coag', 'bmp', 'ecg'],
    needTreat: ['oxygen', 'iv_fluids'],
    wrongTreat: ['thrombolysis', 'aspirin', 'heparin'],
    timeLimit: 15,
    tip: 'Прогрессирование инсульта: исключить геморрагическую трансформацию. Тромболизис после 24 часов противопоказан. Контроль АД без резких перепадов.',
    debrief: { explain: 'Прогрессирование неврологического дефицита после ишемического инсульта: геморрагическая трансформация (15-30% случаев), отёк мозга, или окклюзия коллатералей. Контрольная КТ для исключения кровоизлияния. Антикоагуляция в первые 24ч после тромболизиса противопоказана.' },
    sourceReference: { name: 'AHA/ASA Stroke Guidelines', year: 2024 },
    diagnosisVariants: ['Ишемический инсульт', 'Геморрагическая трансформация', 'Отёк мозга'],
    checklistItems: ['Obtain repeat CT head', 'Monitor neurological status', 'Control blood pressure', 'Check coagulation studies', 'Avoid anticoagulants early post-stroke'],
  },
  {
    id: 'stat_5', name: 'Павлова Татьяна Сергеевна', age: 52, gender: 'Ж',
    complaint: 'Септический шок, рефрактерный к инфузии,requires vasopressors',
    vitals: { bp: '75/45', hr: 128, rr: 28, temp: 39.2, spo2: 90 },
    initialGCS: 11, initialPain: 2,
    deterioration: { hr: 2, sbp: -2, dbp: -1, rr: 1, spo2: -0.8, temp: 0.1, gcs: -0.3, pain: 0 },
    deathThresholds: { sbp: 60, gcs: 4 },
    anamnesis: 'Поступила 4 дня назад с перитонитом. Оперирована (перфоративный аппендицит). 2-е сутки ИВЛ. Несмотря на антибиотики и хирургию — сохраняется септический шок.',
    exam: 'Сопор, GCS 11. ИВЛ. АД 75/45 на норадреналине 0.3 мкг/кг/мин. Тахикардия 128. Лихорадка 39.2°C. Живот вздут, дренажи: гнойное отделяемое.',
    severity: 'critical', category: 'infectious',
    diagnosis: 'Септический шок. Рефрактерный к инфузии. Полимикробная инфекция.',
    department: 'stationary',
    testResults: {
      cbc: 'Тромбоциты 62 ↓↓ (ДВС). Лейк 28.4 ↑↑. Hb 88 ↓.',
      crp: 'СРБ 420 мг/л ↑↑. Прокальцитонин 68 нг/мл ↑↑↑.',
      bmp: 'Лактат 7.2 ↑↑↑ (метаболический ацидоз). Креатинин 288 ↑↑↑. Натрий 128 ↓.',
      coag: 'МНО 2.8 ↑↑, АПТВ 68 ↑↑ — ДВС-синдром.',
      culture: 'Посев крови: E.coli + Bacteroides (полимикробная флора). Чувствительность: меропенем — чувствителен.',
      abg: 'pH 7.18 ↓↓, лактат 7.2 ↑↑. Тяжёлый метаболический ацидоз.',
    },
    needDiag: ['cbc', 'crp', 'bmp', 'coag', 'culture', 'abg'],
    needTreat: ['antibiotics_broad', 'norepinephrine', 'iv_fluids', 'oxygen'],
    wrongTreat: ['furosemide', 'metoprolol'],
    timeLimit: 12,
    tip: 'Септический шок рефрактерный: увеличение дозы вазопрессоров + расширение антибиотиков + повторная хирургическая санация. Лактат >6 — маркер тяжёлой тканевой гипоксии.',
    debrief: { explain: 'Рефрактерный септический шок: полимикробная инфекция (аэробная + анаэробная флора) → массивная вазодилатация + дисфункция миокарда → лактат 7.2. Меропенем — препарат выбора при полимикробной инфекции. Повторная хирургическая санация — необходима при персистирующем источнике.' },
    sourceReference: { name: 'Surviving Sepsis Campaign', year: 2024 },
    diagnosisVariants: ['Септический шок', 'Полимикробная инфекция', 'ДВС-синдром'],
    checklistItems: ['Increase vasopressor dose', 'Broaden antibiotic coverage', 'Obtain repeat blood cultures', 'Consider surgical re-exploration', 'Monitor lactate clearance'],
  },
];

// ── Write outpatient.js ──
const opImport = `import { DIAGNOSTICS } from './diagnostics.js';\nimport { TREATMENTS } from './treatments.js';\n`;
writeFileSync(join(OUT_DIR, 'outpatient.js'), `${opImport}\nexport const OUTPATIENT_CASES = ${JSON.stringify(OUTPATIENT_CASES, null, 2)};\n`, 'utf8');
console.log(`  outpatient.js: ${OUTPATIENT_CASES.length} cases`);

// ── Write stationary.js ──
writeFileSync(join(OUT_DIR, 'stationary.js'), `${opImport}\nexport const STATIONARY_CASES = ${JSON.stringify(STATIONARY_CASES, null, 2)};\n`, 'utf8');
console.log(`  stationary.js: ${STATIONARY_CASES.length} cases`);

// ── Write index.js barrel ──
const barrel = `/**
 * Barrel export for all cases by department.
 * Emergency cases are split by specialty.
 * Outpatient and stationary cases are separate modules.
 */
import { CARDIAC_CASES } from './emergency/cardiac.js';
import { NEURO_CASES } from './emergency/neuro.js';
import { RESPIRATORY_CASES } from './emergency/respiratory.js';
import { INFECTIOUS_CASES } from './emergency/infectious.js';
import { ENDOCRINE_CASES } from './emergency/endocrine.js';
import { TOXICOLOGY_CASES } from './emergency/toxicology.js';
import { ABDOMINAL_CASES } from './emergency/abdominal.js';
import { OUTPATIENT_CASES } from './outpatient.js';
import { STATIONARY_CASES } from './stationary.js';

/** All emergency cases combined */
export const EMERGENCY_CASES = [
  ...CARDIAC_CASES,
  ...NEURO_CASES,
  ...RESPIRATORY_CASES,
  ...INFECTIOUS_CASES,
  ...ENDOCRINE_CASES,
  ...TOXICOLOGY_CASES,
  ...ABDOMINAL_CASES,
];

/** All cases across all departments */
export const CASES = [
  ...EMERGENCY_CASES,
  ...OUTPATIENT_CASES,
  ...STATIONARY_CASES,
];

/** Cases grouped by department */
export const CASES_BY_DEPARTMENT = {
  emergency: EMERGENCY_CASES,
  outpatient: OUTPATIENT_CASES,
  stationary: STATIONARY_CASES,
};

/** Cases grouped by specialty within emergency */
export const CASES_BY_SPECIALTY = {
  cardiac: CARDIAC_CASES,
  neuro: NEURO_CASES,
  respiratory: RESPIRATORY_CASES,
  infectious: INFECTIOUS_CASES,
  endocrine: ENDOCRINE_CASES,
  toxicology: TOXICOLOGY_CASES,
  abdominal: ABDOMINAL_CASES,
};

export default CASES;
`;
writeFileSync(join(OUT_DIR, 'index.js'), barrel, 'utf8');
console.log(`  index.js: barrel export created`);

console.log(`\nDone! Total cases: ${CASES.length} (${EMERGENCY_CASES.length} emergency + ${OUTPATIENT_CASES.length} outpatient + ${STATIONARY_CASES.length} stationary)`);
