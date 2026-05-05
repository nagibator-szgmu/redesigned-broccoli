import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

const C = {
  bg:"#070d18",panel:"#0d1a2e",panel2:"#0f2040",
  border:"#1a3050",borderBright:"#1e4060",
  accent:"#00e6c8",accentDim:"#003d38",
  green:"#00e5a0",greenDim:"#003d28",
  red:"#ff3d5a",redDim:"#4d0018",
  yellow:"#f5c842",yellowDim:"#3d3000",
  purple:"#9d6ff5",orange:"#f57c42",
  text:"#a8c8e0",textDim:"#3a5a7a",white:"#e8f4ff",
};
const FONT="'Inter','-apple-system','BlinkMacSystemFont','SF Pro Text','Helvetica Neue',Arial,sans-serif";
const CODE="'SF Mono','Menlo','Monaco','Courier New',monospace";
const MONO=FONT;
const SER="Georgia,serif";
const clamp=(v,lo,hi)=>Math.max(lo,Math.min(hi,v));
const r1=v=>Math.round(v*10)/10;

function initPS(cd){
  const[sbp,dbp]=cd.vitals.bp.split("/").map(Number);
  return{hr:cd.vitals.hr,sbp,dbp,rr:cd.vitals.rr,spo2:cd.vitals.spo2,
    temp:cd.vitals.temp,gcs:cd.initialGCS??15,pain:cd.initialPain??6,status:"deteriorating"};
}

// ─── TREATMENT EFFECTS ───────────────────────────────────────────────
const TREAT_FX={
  oxygen:       {eff:{spo2:8,rr:-2},        delay:15,  desc:"SpO₂↑, ЧД↓"},
  aspirin:      {eff:{pain:-1},             delay:120, desc:"Антиагрегант"},
  heparin:      {eff:{},                    delay:60,  desc:"Антикоагуляция"},
  thrombolysis: {eff:{sbp:22,spo2:7,hr:-10},delay:120, desc:"Реперфузия↑"},
  nitroglycerin:{eff:{sbp:-15,pain:-4},     delay:60,  desc:"АД↓, боль↓"},
  morphine:     {eff:{pain:-6,hr:-6},       delay:60,  desc:"Анальгезия, ЧСС↓"},
  metoprolol:   {eff:{hr:-22,sbp:-12},      delay:90,  desc:"ЧСС↓, АД↓"},
  furosemide:   {eff:{spo2:8,rr:-4},        delay:90,  desc:"SpO₂↑, ЧД↓"},
  antibiotics_broad:{eff:{temp:-0.4,hr:-5}, delay:180, desc:"Т°↓, ЧСС↓"},
  steroids:     {eff:{spo2:5,hr:-5},        delay:90,  desc:"SpO₂↑"},
  insulin:      {eff:{},                    delay:60,  desc:"Гликемия↓"},
  dextrose:     {eff:{gcs:2},               delay:30,  desc:"ГКС↑"},
  naloxone:     {eff:{gcs:8,rr:8,spo2:18}, delay:30,  desc:"ГКС↑↑, ЧД↑↑, SpO₂↑↑"},
  epinephrine:  {eff:{hr:15,sbp:25},        delay:30,  desc:"ЧСС↑, АД↑"},
  norepinephrine:{eff:{sbp:30},             delay:60,  desc:"АД↑"},
  diazepam:     {eff:{hr:-5,pain:-2},       delay:60,  desc:"Седация"},
  atropine:     {eff:{hr:20},               delay:30,  desc:"ЧСС↑"},
  amiodarone:   {eff:{hr:-18},              delay:90,  desc:"ЧСС↓"},
  defibrillation:{eff:{hr:-35},             delay:5,   desc:"Ритм↓"},
  intubation:   {eff:{spo2:20,rr:-10},      delay:60,  desc:"SpO₂↑↑, ЧД↓"},
  pci:          {eff:{sbp:25,hr:-12,spo2:5},delay:180, desc:"АД↑, ЧСС↓"},
  surgery_consult:{eff:{},                  delay:300, desc:"Консультация"},
  mannitol:     {eff:{gcs:3,sbp:5},         delay:90,  desc:"ГКС↑"},
  acyclovir:    {eff:{},                    delay:180, desc:"Противовирусное"},
  dialysis:     {eff:{},                    delay:300, desc:"Диализ"},
};

// Adverse effects when treatment is wrong for this patient
const ADVERSE_FX={
  metoprolol:    {sbp:-22,hr:-8,spo2:-6},
  nitroglycerin: {sbp:-28},
  thrombolysis:  {gcs:-6,sbp:-12},
  aspirin:       {gcs:-2},
  heparin:       {gcs:-2},
  morphine:      {spo2:-10,rr:-3},
  diazepam:      {spo2:-9,gcs:-4,rr:-2},
  amiodarone:    {hr:-25,temp:0.5},
  furosemide:    {sbp:-12},
  steroids:      {gcs:-1},
  acyclovir:     {},
  mannitol:      {sbp:-6},
};

const CLAMP_RANGES={hr:[15,230],sbp:[30,280],dbp:[15,170],rr:[2,60],spo2:[40,100],temp:[32,43],gcs:[3,15],pain:[0,10]};

// ─── CASES ───────────────────────────────────────────────────────────
const CASES=[
  {
    id:1,name:"Карпов Дмитрий Алексеевич",age:58,gender:"М",
    complaint:"Острая давящая боль за грудиной с иррадиацией в левую руку, выраженная слабость, холодный пот",
    vitals:{bp:"90/60",hr:105,rr:22,temp:36.4,spo2:94},
    initialGCS:13,initialPain:9,
    deterioration:{hr:2,sbp:-4,dbp:-2,rr:1,spo2:-1.5,temp:0,gcs:-0.4,pain:0},
    deathThresholds:{sbp:48,spo2:62},
    anamnesis:"Боль в покое 40 минут назад, давящая, интенсивная. Тошнота, однократная рвота. АГ 3 ст. 10 лет, курит 30 лет пачку/день, ИМТ 31. Сердечно-сосудистых катастроф в анамнезе не было.",
    exam:"Кожа бледная, влажная. Тоны приглушены, ритм правильный. ЧСС 105, АД 90/60. Лёгкие — хрипов нет. Живот мягкий.",
    severity:"critical",category:"cardiac",
    diagnosis:"Острый инфаркт миокарда с подъёмом ST нижней стенки. Кардиогенный шок.",
    testResults:{
      ecg:"⚡ Подъём ST 4 мм в II, III, aVF. Реципрокная депрессия ST в I, aVL. Ритм синусовый, ЧСС 105.",
      troponin:"🔴 Тропонин I = 8.4 нг/мл (норма <0.04). КРИТИЧЕСКИ ПОВЫШЕН.",
      cbc:"Лейк 12.1×10⁹/л, Hb 138 г/л, Тр 210×10⁹/л.",
      bmp:"K 3.8, Na 138, Cr 98, Гл 8.2 ммоль/л. АЛТ/АСТ норма.",
      coag:"МНО 1.0, АПТВ 28 сек. Норма.",
      echo:"ЭхоКГ: акинезия нижней стенки ЛЖ, ФВ 35% (снижена). Регургитация МК 1 ст.",
      xray:"Рентген: кардиомегалия. Лёгочный рисунок не усилен.",
      bnp:"NT-proBNP = 3200 пг/мл (норма <125). Повышен, признаки СН.",
      glucose:"Глюкоза 8.2 ммоль/л — умеренная гипергликемия стресса.",
      spo2:"SpO₂ 94% — умеренная гипоксемия.",
    },
    needDiag:["ecg","troponin","cbc","bmp","coag","echo"],
    needTreat:["aspirin","heparin","oxygen","morphine","pci"],
    wrongTreat:["metoprolol","nitroglycerin"],
    timeLimit:12,
    tip:"При ОИМ нижней стенки с шоком нитраты и β-блокаторы противопоказаны — усугубляют гипотонию. ЧКВ в течение 90 минут — стандарт лечения.",
  },
  {
    id:2,name:"Соколова Анна Викторовна",age:34,gender:"Ж",
    complaint:"Внезапная сильная головная боль «как удар молотом», рвота, светобоязнь, нарастающая сонливость",
    vitals:{bp:"170/100",hr:88,rr:16,temp:37.8,spo2:98},
    initialGCS:12,initialPain:10,
    deterioration:{hr:1,sbp:3,dbp:2,rr:0.5,spo2:-0.3,temp:0.1,gcs:-1,pain:0},
    deathThresholds:{gcs:5},
    anamnesis:"Боль 2 часа назад при физической нагрузке. «Самая сильная боль в жизни». Однократная рвота. Нарастающая сонливость. Хронических заболеваний нет.",
    exam:"Сопор, GCS 12. Ригидность затылочных мышц 3 пальца. Кернига (+). Зрачки D=S, фотореакция сохранена. Очаговой неврологии нет.",
    severity:"critical",category:"neuro",
    diagnosis:"Субарахноидальное кровоизлияние (разрыв церебральной аневризмы).",
    testResults:{
      ct_head:"🔴 КТ: гиперденсный сигнал в базальных цистернах и сильвиевых бороздах с обеих сторон. Картина субарахноидального кровоизлияния, Hunt-Hess III.",
      lumbar:"ЦСЖ: давление 280 мм вод.ст. (↑), ксантохромия +++, эритроциты 180 000/мкл — геморрагический ликвор.",
      cbc:"Лейк 13.4×10⁹/л (реактивный лейкоцитоз), Hb 132, Тр 290.",
      coag:"МНО 1.0, АПТВ 26. Норма.",
      bmp:"Электролиты, функция почек — норма. Na 136.",
      mri:"МРТ: подтверждает САК, аневризма передней соединительной артерии d=7 мм.",
    },
    needDiag:["ct_head","lumbar","cbc","coag","bmp"],
    needTreat:["oxygen","mannitol","surgery_consult"],
    wrongTreat:["thrombolysis","aspirin","heparin"],
    timeLimit:12,
    tip:"При громоподобной боли + менингизм — срочно КТ головы без контраста. Тромболизис и антикоагулянты при геморрагическом инсульте абсолютно противопоказаны.",
  },
  {
    id:3,name:"Петрова Елена Сергеевна",age:72,gender:"Ж",
    complaint:"Нарастающая одышка 3 дня, ортопноэ, отёки ног",
    vitals:{bp:"155/95",hr:112,rr:28,temp:36.9,spo2:86},
    initialGCS:15,initialPain:5,
    deterioration:{hr:2,sbp:1,dbp:0,rr:2,spo2:-2,temp:0,gcs:-0.2,pain:0},
    deathThresholds:{spo2:68},
    anamnesis:"ХСН 3 ФК, ИБС, ФП. Принимает варфарин. Самостоятельно отменила диуретики 2 дня назад. Пароксизмальная ночная одышка.",
    exam:"Акроцианоз. Ортопноэ. Влажные хрипы с обеих сторон до лопаток. ЧСС 112, аритмия. АД 155/95. Отёки голеней +++.",
    severity:"critical",category:"cardiac",
    diagnosis:"Острая декомпенсация ХСН. Отёк лёгких.",
    testResults:{
      xray:"🔴 Рентген: двусторонние инфильтраты по типу «крыльев бабочки». Кардиомегалия. Усиленный лёгочный рисунок. Картина отёка лёгких.",
      bnp:"🔴 NT-proBNP = 12 400 пг/мл (норма <900 для возраста). Критически повышен.",
      echo:"ЭхоКГ: ФВ ЛЖ 28%, дилатация всех камер. Митральная регургитация 3 ст.",
      ecg:"ФП, ЧСС 112. Гипертрофия ЛЖ. ST-изменений нет.",
      cbc:"Hb 108 г/л (анемия лёгкой степени). Лейк норма.",
      bmp:"Na 138, K 3.2 (↓ — гипокалиемия!), Cr 130 мкмоль/л (↑ умеренно).",
    },
    needDiag:["xray","bnp","echo","ecg","cbc","bmp"],
    needTreat:["oxygen","furosemide","nitroglycerin"],
    wrongTreat:["metoprolol","heparin"],
    timeLimit:10,
    tip:"При ОДХСН с отёком лёгких: диуретики в/в + нитраты при АД >90. β-блокаторы при декомпенсации ХСН отменяют.",
  },
  {
    id:4,name:"Назаров Тимур Русланович",age:26,gender:"М",
    complaint:"Лихорадка 39.8°C, нарушение сознания, судороги, петехиальная сыпь",
    vitals:{bp:"100/65",hr:128,rr:24,temp:39.8,spo2:95},
    initialGCS:10,initialPain:9,
    deterioration:{hr:3,sbp:-2.5,dbp:-1,rr:1,spo2:-0.8,temp:0.2,gcs:-0.5,pain:0},
    deathThresholds:{sbp:52,gcs:4},
    anamnesis:"Студент. Заболел остро 12 ч назад. Контакт с больным менингитом 5 дней назад. Судороги 2 раза по 2 мин. Нарастающая сонливость.",
    exam:"Заторможен, GCS 10. Ригидность затылка 5 пальцев. Петехиальная сыпь на туловище и бёдрах. Кернига(+), Брудзинского(+).",
    severity:"critical",category:"infectious",
    diagnosis:"Менингококковый менингоэнцефалит. Менингококкемия. Септический шок.",
    testResults:{
      cbc:"🔴 Лейк 24.8×10⁹/л, палочкоядерных 38% (резкий сдвиг влево). Тр 88×10⁹/л (↓). ДВС-синдром?",
      crp:"🔴 СРБ 320 мг/л. Прокальцитонин 42 нг/мл. Критические маркеры сепсиса.",
      ct_head:"КТ: признаков объёмного образования нет. Люмбальная пункция безопасна.",
      lumbar:"🔴 ЦСЖ: давление 340 мм вод.ст. Нейтрофилы 9800/мкл. Белок 4.2 г/л. Глюкоза 1.2 ммоль/л. Грам-диплококки — Neisseria meningitidis!",
      culture:"Посев крови: Neisseria meningitidis серогруппа B.",
      bmp:"Лактат 4.8 ммоль/л ↑↑. Na 128 (гипонатриемия). Cr 142 (↑).",
      coag:"МНО 1.9 ↑, АПТВ 48 сек ↑ — начальный ДВС-синдром.",
    },
    needDiag:["cbc","crp","ct_head","lumbar","culture","bmp","coag"],
    needTreat:["antibiotics_broad","steroids","oxygen","diazepam"],
    wrongTreat:["acyclovir"],
    timeLimit:12,
    tip:"Антибиотики при менингококковом менингите — НЕМЕДЛЕННО. Дексаметазон за 15 мин до антибиотика снижает летальность.",
  },
  {
    id:5,name:"Смирнова Ольга Николаевна",age:22,gender:"Ж",
    complaint:"Нарастающая одышка, свистящее дыхание, не может говорить фразами",
    vitals:{bp:"130/85",hr:130,rr:34,temp:37.1,spo2:88},
    initialGCS:14,initialPain:6,
    deterioration:{hr:2,sbp:0,dbp:0,rr:3,spo2:-2,temp:0,gcs:-0.3,pain:0},
    deathThresholds:{spo2:65,rr:50},
    anamnesis:"Бронхиальная астма с 8 лет. Приступ 2 часа назад после контакта с кошкой. Сальбутамол — 8 ингаляций без эффекта.",
    exam:"Вынужденная поза с упором на руки. Вспомогательные мышцы. Диффузные свистящие хрипы. Удлинённый выдох. Цианоз губ.",
    severity:"critical",category:"respiratory",
    diagnosis:"Тяжёлый приступ бронхиальной астмы. Астматический статус.",
    testResults:{
      spo2:"🔴 SpO₂ 88% — тяжёлая гипоксемия.",
      abg:"🔴 pH 7.31, PaCO₂ 52 мм рт.ст. ↑↑, PaO₂ 54 мм рт.ст. ↓↓. Дыхательный ацидоз.",
      xray:"Рентген: лёгкие гиперраздуты, уплощение диафрагмы. Пневмоторакса нет.",
      cbc:"Лейк 14.2 (стрессовый лейкоцитоз). Эозинофилия 8%.",
    },
    needDiag:["spo2","abg","xray","cbc"],
    needTreat:["oxygen","steroids","intubation"],
    wrongTreat:["metoprolol","morphine"],
    timeLimit:10,
    tip:"β-блокаторы при астме абсолютно противопоказаны. При астматическом статусе — системные кортикостероиды в/в. Нарастание PaCO₂ — признак угрозы остановки дыхания.",
  },
  {
    id:6,name:"Волков Сергей Иванович",age:55,gender:"М",
    complaint:"Найден без сознания, следы инъекций на руках",
    vitals:{bp:"85/50",hr:52,rr:6,temp:35.2,spo2:78},
    initialGCS:5,initialPain:0,
    deterioration:{hr:-1.5,sbp:-2,dbp:-1,rr:-0.6,spo2:-3,temp:-0.1,gcs:-0.8,pain:0},
    deathThresholds:{spo2:60,rr:2,sbp:48},
    anamnesis:"Найден соседями. Следы свежих инъекций на руке. Пустой шприц рядом. Употребляет героин.",
    exam:"GCS 5. Зрачки точечные 1 мм. Дыхание поверхностное 6/мин. Кожа бледная, влажная. t° 35.2°C.",
    severity:"critical",category:"metabolic",
    diagnosis:"Острое отравление опиоидами (передозировка героина). Кома. Угнетение дыхания.",
    testResults:{
      glucose:"Глюкоза 3.1 ммоль/л — на нижней границе нормы.",
      abg:"🔴 pH 7.18 ↓↓, PaCO₂ 78 ↑↑, PaO₂ 42 ↓↓. Тяжёлый дыхательный ацидоз.",
      cbc:"Hb 145, лейк норма. Признаков инфекции нет.",
      bmp:"Лактат 5.2 ммоль/л ↑ (тканевая гипоксия).",
    },
    needDiag:["glucose","abg","cbc","bmp"],
    needTreat:["naloxone","oxygen","intubation"],
    wrongTreat:["diazepam","morphine","metoprolol"],
    timeLimit:8,
    tip:"Триада опиоидного отравления: кома + миоз + угнетение дыхания. Налоксон в/в немедленно. Диазепам усугубит угнетение ЦНС.",
  },
  {
    id:7,name:"Новиков Павел Дмитриевич",age:48,gender:"М",
    complaint:"Нарастающая одышка, боль в правой половине грудной клетки, кровохарканье",
    vitals:{bp:"110/75",hr:118,rr:26,temp:37.4,spo2:91},
    initialGCS:14,initialPain:7,
    deterioration:{hr:3,sbp:-2.5,dbp:-1,rr:1.5,spo2:-2,temp:0,gcs:-0.3,pain:0},
    deathThresholds:{spo2:68,sbp:55},
    anamnesis:"3 недели назад операция на бедре, иммобилизация 2 нед. Одышка 2 дня, сегодня боль при дыхании и кровохарканье.",
    exam:"Умеренный цианоз. Тахипноэ. Дыхание справа ослаблено снизу. ЧСС 118. Гиперемия и отёк левой голени.",
    severity:"critical",category:"respiratory",
    diagnosis:"Тромбоэмболия лёгочной артерии. ТГВ левой голени.",
    testResults:{
      d_dimer:"🔴 D-димер 8400 нг/мл (норма <500). Критически повышен.",
      ct_chest:"🔴 КТ-ангиография: дефекты наполнения в правой главной лёгочной артерии. Массивная ТЭЛА.",
      ecg:"ЭКГ: синусовая тахикардия 118. Паттерн S1Q3T3. Блокада правой ножки.",
      echo:"ЭхоКГ: дилатация ПЖ. «D-sign». Давление в ЛА 52 мм рт.ст. ↑↑",
      abg:"pH 7.44, PaCO₂ 30, PaO₂ 62 ↓. Гипоксемия.",
      coag:"МНО 1.1, АПТВ 29 сек. Норма.",
      cbc:"Лейк 12.0. Hb 142.",
    },
    needDiag:["d_dimer","ct_chest","ecg","echo","abg","coag","cbc"],
    needTreat:["oxygen","heparin","thrombolysis"],
    wrongTreat:["aspirin","furosemide"],
    timeLimit:12,
    tip:"При гемодинамически нестабильной ТЭЛА — системный тромболизис. Аспирин при ТЭЛА неэффективен.",
  },
  {
    id:8,name:"Козлова Мария Александровна",age:19,gender:"Ж",
    complaint:"Тахикардия, потливость, тремор рук, похудание 8 кг за 2 месяца, пучеглазие",
    vitals:{bp:"145/60",hr:148,rr:18,temp:37.6,spo2:98},
    initialGCS:15,initialPain:3,
    deterioration:{hr:4,sbp:1,dbp:0,rr:0.5,spo2:0,temp:0.1,gcs:0,pain:0},
    deathThresholds:{hr:210},
    anamnesis:"Жалобы 2 месяца. Раздражительность, непереносимость жары, потеря веса при повышенном аппетите.",
    exam:"ЩЖ диффузно увеличена 2 ст. Двусторонний экзофтальм. Тремор пальцев. ЧСС 148.",
    severity:"moderate",category:"metabolic",
    diagnosis:"Диффузный токсический зоб (болезнь Грейвса). Тиреотоксический криз.",
    testResults:{
      thyroid:"🔴 ТТГ < 0.01 мМЕ/л (подавлен). Т4 своб. = 68 пмоль/л (↑↑). АТ к рецепторам ТТГ = 28 МЕ/л (↑↑).",
      ecg:"Синусовая тахикардия 148. QT укорочен.",
      cbc:"Лейк 12.0, лимфоцитоз 42%. Hb 118 г/л.",
      bmp:"Гипергликемия 9.8 ммоль/л. АЛТ 78 Ед/л ↑. Ca 2.9 ммоль/л ↑.",
      glucose:"Глюкоза 9.8 ммоль/л.",
    },
    needDiag:["thyroid","ecg","cbc","bmp","glucose"],
    needTreat:["metoprolol","steroids"],
    wrongTreat:["amiodarone","atropine"],
    timeLimit:12,
    tip:"Амиодарон содержит огромное количество йода и катастрофически усугубит тиреотоксикоз. β-блокаторы — контроль ЧСС.",
  },
  {
    id:9,name:"Морозов Андрей Геннадьевич",age:63,gender:"М",
    complaint:"Внезапная слабость правой руки и ноги, нарушение речи, асимметрия лица",
    vitals:{bp:"185/105",hr:82,rr:16,temp:36.7,spo2:97},
    initialGCS:10,initialPain:5,
    deterioration:{hr:1,sbp:2.5,dbp:1,rr:0.5,spo2:-0.3,temp:0,gcs:-0.6,pain:0},
    deathThresholds:{gcs:4,sbp:240},
    anamnesis:"Симптомы 1.5 часа назад. Мерцательная аритмия, варфарин нерегулярно. АГ 2 ст.",
    exam:"Афазия смешанная. Центральный парез лицевого нерва справа. Правосторонняя гемиплегия. NIHSS = 14.",
    severity:"critical",category:"neuro",
    diagnosis:"Ишемический инсульт в бассейне левой СМА (кардиоэмболический подтип).",
    testResults:{
      ct_head:"КТ: очаговых ишемических изменений нет (норма в первые 6 ч). Геморрагии нет. Тромболизис возможен.",
      cbc:"Лейк 9.8. Hb 136. Тр 210. Норма.",
      coag:"МНО 1.1. АПТВ 30 сек. Тромболизис НЕ ПРОТИВОПОКАЗАН.",
      bmp:"Глюкоза 7.2 ммоль/л. Cr 88.",
      ecg:"ФП, ЧСС 82. ST-изменений нет.",
      glucose:"Глюкоза 7.2 ммоль/л.",
    },
    needDiag:["ct_head","cbc","coag","bmp","ecg","glucose"],
    needTreat:["oxygen","thrombolysis"],
    wrongTreat:["aspirin","heparin","mannitol"],
    timeLimit:10,
    tip:"Окно тромболизиса при ишемическом инсульте — 4.5 часа. Аспирин и гепарин в первые 24 ч после тромболизиса противопоказаны.",
  },
  {
    id:10,name:"Кузнецова Ирина Петровна",age:45,gender:"Ж",
    complaint:"Острая боль в животе, рвота желчью, напряжение мышц живота",
    vitals:{bp:"105/70",hr:118,rr:20,temp:38.4,spo2:97},
    initialGCS:14,initialPain:9,
    deterioration:{hr:2,sbp:-2.5,dbp:-1,rr:0.5,spo2:-0.3,temp:0.15,gcs:-0.3,pain:0},
    deathThresholds:{sbp:55,gcs:5},
    anamnesis:"Боль 6 ч назад: сначала эпигастрий → правая подвздошная область. Рвота 3 раза. Желчнокаменная болезнь.",
    exam:"Живот напряжён. Щёткина-Блюмберга (+) в правой подвздошной. Перистальтика ослаблена.",
    severity:"critical",category:"abdominal",
    diagnosis:"Острый панкреатит тяжёлой степени. Начинающийся перитонит.",
    testResults:{
      cbc:"🔴 Лейк 18.4×10⁹/л, сдвиг влево 28%. Hb 122.",
      bmp:"🔴 Амилаза 1240 Ед/л. Липаза 890 Ед/л. Глюкоза 11.2 ммоль/л. АЛТ 210 Ед/л.",
      crp:"🔴 СРБ 280 мг/л. Прокальцитонин 8.4 нг/мл.",
      usg_abdo:"УЗИ: поджелудочная железа увеличена. Конкременты в желчном пузыре 8-12 мм.",
      ct_chest:"КТ: некроз головки и тела поджелудочной железы >40%. Рансон >5.",
      coag:"МНО 1.4 ↑, АПТВ 38 сек ↑.",
      urine:"ОАМ: амилаза мочи 2800 Ед/л ↑↑.",
    },
    needDiag:["cbc","bmp","crp","usg_abdo","ct_chest","coag","urine"],
    needTreat:["oxygen","antibiotics_broad","surgery_consult"],
    wrongTreat:["morphine","steroids"],
    timeLimit:12,
    tip:"Морфин вызывает спазм сфинктера Одди и усугубляет панкреатит. При некротическом панкреатите — антибиотики и хирургическая консультация обязательна.",
  },
];

const DIAGNOSTICS=[
  {id:"ecg",name:"ЭКГ",cat:"cardiac"},{id:"echo",name:"ЭхоКГ",cat:"cardiac"},
  {id:"bp_monitor",name:"Суточное мониторирование АД",cat:"cardiac"},
  {id:"troponin",name:"Тропонин I",cat:"lab"},{id:"bnp",name:"BNP / NT-proBNP",cat:"lab"},
  {id:"cbc",name:"ОАК",cat:"lab"},{id:"bmp",name:"Биохимия крови",cat:"lab"},
  {id:"crp",name:"СРБ / Прокальцитонин",cat:"lab"},{id:"d_dimer",name:"D-димер",cat:"lab"},
  {id:"coag",name:"Коагулограмма",cat:"lab"},{id:"glucose",name:"Глюкоза крови",cat:"lab"},
  {id:"lipid",name:"Липидный профиль",cat:"lab"},{id:"thyroid",name:"ТТГ / Т4 своб.",cat:"lab"},
  {id:"culture",name:"Посев крови / мочи",cat:"lab"},{id:"urine",name:"ОАМ",cat:"lab"},
  {id:"abg",name:"Газы артериальной крови",cat:"respiratory"},{id:"spo2",name:"Пульсоксиметрия",cat:"respiratory"},
  {id:"xray",name:"Рентген грудной клетки",cat:"imaging"},{id:"ct_chest",name:"КТ грудной клетки",cat:"imaging"},
  {id:"ct_head",name:"КТ головного мозга",cat:"imaging"},{id:"mri",name:"МРТ головного мозга",cat:"imaging"},
  {id:"usg_abdo",name:"УЗИ брюшной полости",cat:"imaging"},
  {id:"eeg",name:"ЭЭГ",cat:"neuro"},{id:"lumbar",name:"Люмбальная пункция",cat:"neuro"},
];

const TREATMENTS=[
  {id:"aspirin",name:"Аспирин 325 мг",cat:"antiplatelet"},
  {id:"heparin",name:"Гепарин в/в",cat:"anticoagulant"},
  {id:"thrombolysis",name:"Тромболизис (rtPA)",cat:"intervention"},
  {id:"oxygen",name:"Оксигенотерапия",cat:"supportive"},
  {id:"nitroglycerin",name:"Нитроглицерин сублингвально",cat:"cardiac"},
  {id:"morphine",name:"Морфин в/в",cat:"analgesic"},
  {id:"metoprolol",name:"Метопролол в/в",cat:"betablocker"},
  {id:"furosemide",name:"Фуросемид в/в",cat:"diuretic"},
  {id:"antibiotics_broad",name:"Антибиотики широкого спектра в/в",cat:"antibiotic"},
  {id:"steroids",name:"Кортикостероиды в/в",cat:"steroid"},
  {id:"insulin",name:"Инсулин (инфузия)",cat:"endocrine"},
  {id:"dextrose",name:"Декстроза 40% в/в",cat:"supportive"},
  {id:"naloxone",name:"Налоксон в/в",cat:"antidote"},
  {id:"epinephrine",name:"Адреналин в/в",cat:"vasopressor"},
  {id:"norepinephrine",name:"Норадреналин (инфузия)",cat:"vasopressor"},
  {id:"diazepam",name:"Диазепам в/в",cat:"anticonvulsant"},
  {id:"atropine",name:"Атропин в/в",cat:"cardiac"},
  {id:"amiodarone",name:"Амиодарон в/в",cat:"antiarrhythmic"},
  {id:"defibrillation",name:"Дефибрилляция",cat:"intervention"},
  {id:"intubation",name:"Интубация + ИВЛ",cat:"intervention"},
  {id:"pci",name:"Экстренное ЧКВ",cat:"intervention"},
  {id:"surgery_consult",name:"Экстренная хирургия",cat:"intervention"},
  {id:"mannitol",name:"Маннитол в/в",cat:"neuro"},
  {id:"acyclovir",name:"Ацикловир в/в",cat:"antiviral"},
  {id:"dialysis",name:"Экстренный диализ",cat:"renal"},
];

const CAT_COLOR={
  cardiac:C.red,lab:C.accent,imaging:C.purple,respiratory:C.green,vital:C.yellow,neuro:C.orange,
  antiplatelet:C.red,anticoagulant:C.red,intervention:C.red,supportive:C.green,analgesic:C.orange,
  betablocker:C.purple,diuretic:C.accent,antibiotic:C.green,steroid:C.yellow,endocrine:C.yellow,
  antidote:C.green,vasopressor:C.red,anticonvulsant:C.orange,antiarrhythmic:C.purple,
  antiviral:C.green,renal:C.accent
};

// ── CLINICAL REASONING FOR WRONG TREATMENTS ─────────────────────────
const ADVERSE_REASONS={
  metoprolol:"β-блокаторы при кардиогенном шоке или астме снижают сердечный выброс и вызывают бронхоспазм — усугубляют критическое состояние.",
  nitroglycerin:"Нитраты снижают преднагрузку и АД. При АД <90 мм рт.ст. противопоказаны — усугубляют шок и коллапс.",
  thrombolysis:"При геморрагическом инсульте/САК тромболизис вызывает нарастание внутричерепного кровотечения и летальный исход.",
  aspirin:"При внутричерепном кровоизлиянии антиагреганты усиливают кровотечение — абсолютно противопоказаны.",
  heparin:"При геморрагическом инсульте антикоагулянты нарастают кровоизлияние — абсолютно противопоказаны.",
  morphine:"Морфин при астме вызывает гистаминолиберацию и бронхоспазм. При опиоидном отравлении — усугубляет депрессию ЦНС.",
  diazepam:"Бензодиазепины при отравлении опиоидами синергично угнетают дыхательный центр — смертельно опасно.",
  amiodarone:"Амиодарон содержит ~37% йода по массе. При тиреотоксикозе вызывает лавинообразное ухудшение и тиреоидный шторм.",
  atropine:"Атропин при тахикардии >140 уд/мин дополнительно увеличивает ЧСС — риск фибрилляции желудочков.",
  furosemide:"Форсированный диурез при гиповолемии/панкреатите усугубляет шок и почечную дисфункцию.",
  steroids:"Кортикостероиды при остром панкреатите усиливают аутолиз поджелудочной железы.",
  morphine_pancreatitis:"Морфин вызывает спазм сфинктера Одди, повышает давление в желчевыводящих путях и усугубляет панкреатит.",
  acyclovir:"Ацикловир не действует на бактерии. Назначение при менингококковом менингите вместо антибиотиков = летально.",
  mannitol:"Маннитол при ишемическом инсульте без признаков вклинения не показан и ухудшает прогноз.",
};

// Explanations for missed critical tests
const MISSED_TEST_REASONS={
  ecg:"ЭКГ — первый обязательный тест при боли в груди. Позволяет диагностировать ОКС за минуты.",
  troponin:"Тропонин — маркер некроза миокарда. Необходим для подтверждения ОИМ.",
  ct_head:"КТ головы — обязательна при неврологической симптоматике. Исключает геморрагию до тромболизиса.",
  d_dimer:"D-димер — скрининговый тест на ТЭЛА. Нормальный результат исключает ТЭЛА.",
  ct_chest:"КТ-ангиография — золотой стандарт диагностики ТЭЛА и оценки лёгочных патологий.",
  lumbar:"Люмбальная пункция подтверждает САК и менингит, когда КТ недостаточно.",
  abg:"Газы артериальной крови оценивают тяжесть дыхательной недостаточности и ацидоза.",
  bnp:"BNP/NT-proBNP — биомаркер сердечной недостаточности. Высокий уровень подтверждает ОДХСН.",
  thyroid:"ТТГ/Т4 — единственный способ подтвердить тиреотоксикоз лабораторно.",
  echo:"ЭхоКГ оценивает функцию сердца, зоны гипокинеза и выпот — критично при кардиальной патологии.",
  coag:"Коагулограмма обязательна перед тромболизисом и при подозрении на ДВС-синдром.",
  crp:"СРБ и прокальцитонин — маркеры системного воспаления, подтверждают сепсис.",
  culture:"Посев крови до начала антибиотиков — позволяет идентифицировать возбудитель и подобрать терапию.",
};

function computeOutcome(ps){
  if(!ps)return"unknown";
  if(ps.status==="dead"||ps.sbp<50||ps.spo2<60||ps.gcs<=3)return"dead";
  if(ps.sbp<80||ps.spo2<78||ps.gcs<7)return"critical";
  if(ps.sbp<100||ps.spo2<88||ps.gcs<12)return"unstable";
  return"stable";
}

function computeScore(cd,selDiag,selTreat,diagText,finalPS){
  let score=0;const dangerous=[];
  if(diagText){
    const words=cd.diagnosis.toLowerCase().split(/[\s,.()/\-]+/).filter(w=>w.length>4);
    const hits=words.filter(w=>diagText.toLowerCase().includes(w)).length;
    const r=hits/Math.max(words.length,1);
    if(r>=0.6)score+=35;else if(r>=0.3)score+=20;else if(r>0)score+=10;
  }
  const dh=cd.needDiag.filter(id=>selDiag.includes(id)).length;
  score+=Math.round((dh/Math.max(cd.needDiag.length,1))*20);
  const th=cd.needTreat.filter(id=>selTreat.includes(id)).length;
  score+=Math.round((th/Math.max(cd.needTreat.length,1))*25);
  cd.wrongTreat.forEach(id=>{
    if(selTreat.includes(id)){score=Math.max(0,score-15);dangerous.push(TREATMENTS.find(t=>t.id===id)?.name||id);}
  });
  // Patient outcome
  const outcome=computeOutcome(finalPS);
  if(outcome==="stable")score+=20;
  else if(outcome==="unstable")score+=10;
  else if(outcome==="critical")score+=3;
  else if(outcome==="dead")score=Math.max(0,score-20);
  score=Math.min(100,Math.max(0,score));
  const grade=score>=85?"Отлично":score>=70?"Хорошо":score>=50?"Удовлетворительно":"Неудовлетворительно";
  const words2=cd.diagnosis.toLowerCase().split(/[\s,.()/\-]+/).filter(w=>w.length>4);
  const r2=diagText?words2.filter(w=>diagText.toLowerCase().includes(w)).length/Math.max(words2.length,1):0;
  return{score,grade,dangerous,diagCorrect:r2>=0.6,diagPartial:r2>=0.3,outcome};
}

// ── Components ───────────────────────────────────────────────────────

const Vital=({label,value,warn,trend})=>{
  const tArrow=trend>0?"▲":trend<0?"▼":"";
  const tColor=warn?C.red:trend!==0?C.yellow:C.textDim;
  return(
    <div style={{background:warn?`${C.redDim}88`:`${C.accent}0c`,border:`1px solid ${warn?C.red+"66":C.borderBright}`,
      borderRadius:12,padding:"7px 13px",textAlign:"center",minWidth:78}}>
      <div style={{fontSize:10,color:C.textDim,fontFamily:FONT,textTransform:"uppercase",letterSpacing:0.8,marginBottom:3,fontWeight:600}}>{label}</div>
      <div style={{display:"flex",alignItems:"baseline",justifyContent:"center",gap:3}}>
        <div style={{fontSize:17,fontWeight:700,color:warn?C.red:C.accent,fontFamily:CODE,letterSpacing:-0.5}}>{value}</div>
        {tArrow&&<span style={{fontSize:11,color:tColor,fontFamily:CODE}}>{tArrow}</span>}
      </div>
    </div>
  );
};

const GCSBadge=({gcs})=>{
  const color=gcs>=13?C.green:gcs>=9?C.yellow:C.red;
  const label=gcs>=13?"Ясное":gcs>=9?"Оглушение":gcs>=6?"Сопор":"Кома";
  return(
    <div style={{background:`${color}0c`,border:`1px solid ${color}44`,borderRadius:12,padding:"7px 13px",textAlign:"center",minWidth:96}}>
      <div style={{fontSize:10,color:C.textDim,fontFamily:FONT,textTransform:"uppercase",letterSpacing:0.8,marginBottom:3,fontWeight:600}}>ГКС / Сознание</div>
      <div style={{display:"flex",alignItems:"baseline",justifyContent:"center",gap:5}}>
        <span style={{fontSize:17,fontWeight:700,color,fontFamily:CODE}}>{Math.round(gcs)}</span>
        <span style={{fontSize:12,color,fontFamily:FONT,fontWeight:500}}>{label}</span>
      </div>
    </div>
  );
};

const PainBadge=({pain})=>{
  const color=pain>=8?C.red:pain>=5?C.yellow:C.green;
  return(
    <div style={{background:`${color}0c`,border:`1px solid ${color}44`,borderRadius:12,padding:"7px 13px",textAlign:"center",minWidth:78}}>
      <div style={{fontSize:10,color:C.textDim,fontFamily:FONT,textTransform:"uppercase",letterSpacing:0.8,marginBottom:3,fontWeight:600}}>Боль</div>
      <div style={{fontSize:17,fontWeight:700,color,fontFamily:CODE}}>{r1(pain)}<span style={{fontSize:12}}>/10</span></div>
    </div>
  );
};

const StatusBanner=({status})=>{
  if(!status||status==="deteriorating")return null;
  const map={
    critical:{color:C.red,text:"⚠ КРИТИЧЕСКОЕ СОСТОЯНИЕ — СРОЧНО ДЕЙСТВУЙТЕ"},
    dead:{color:C.red,text:"💀 ПАЦИЕНТ ПОГИБ"},
    stable:{color:C.green,text:"✓ СОСТОЯНИЕ СТАБИЛИЗИРУЕТСЯ"},
  };
  const m=map[status];
  if(!m)return null;
  return(
    <div style={{background:`${m.color}22`,border:`2px solid ${m.color}`,borderRadius:10,
      padding:"10px 16px",marginBottom:10,textAlign:"center",fontFamily:FONT,fontWeight:700,
      fontSize:14,color:m.color,animation:"pulse 1s ease-in-out infinite"}}>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.7}}`}</style>
      {m.text}
    </div>
  );
};

const EventLog=({events})=>(
  <div style={{background:C.panel2,border:`1px solid ${C.border}`,borderRadius:8,padding:"8px 10px",maxHeight:110,overflowY:"auto"}}>
    <div style={{fontSize:11,color:C.textDim,textTransform:"uppercase",letterSpacing:1,marginBottom:4,fontFamily:FONT}}>Журнал событий</div>
    {events.length===0&&<div style={{fontSize:12,color:C.textDim,fontFamily:FONT}}>Нет событий...</div>}
    {events.map(e=>{
      const col=e.type==="critical"?C.red:e.type==="warning"?C.yellow:e.type==="treatment"?C.green:e.type==="result"?C.accent:C.text;
      return(
        <div key={e.id} style={{display:"flex",gap:8,marginBottom:2}}>
          <span style={{fontSize:11,color:C.textDim,fontFamily:CODE,flexShrink:0}}>{e.elapsed}</span>
          <span style={{fontSize:12,color:col,fontFamily:FONT,lineHeight:1.4}}>{e.text}</span>
        </div>
      );
    })}
  </div>
);

const STitle=({icon,label,color=C.accent})=>(
  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
    <span style={{fontSize:15}}>{icon}</span>
    <span style={{fontFamily:FONT,fontSize:11,letterSpacing:1,color,textTransform:"uppercase",fontWeight:600}}>{label}</span>
    <div style={{flex:1,height:1,background:`linear-gradient(90deg,${color}55,transparent)`}}/>
  </div>
);

const Btn=({onClick,disabled,color=C.accent,children,style={}})=>(
  <button onClick={onClick} disabled={disabled} style={{
    background:`${color}18`,border:`1.5px solid ${color}55`,borderRadius:10,
    padding:"11px 22px",fontFamily:FONT,fontSize:14,fontWeight:600,color,
    cursor:disabled?"not-allowed":"pointer",letterSpacing:0.3,opacity:disabled?0.4:1,
    transition:"all 0.2s",...style,
  }}>{children}</button>
);

const CheckRow=({item,selected,onToggle,color,danger,disabled})=>(
  <div onClick={()=>!disabled&&onToggle(item.id)} style={{
    display:"flex",alignItems:"center",gap:10,
    background:selected?`${color}18`:danger?`${C.red}0a`:"transparent",
    border:`1px solid ${selected?color+"88":danger?`${C.red}44`:C.border}`,
    borderRadius:10,padding:"9px 13px",cursor:disabled?"default":"pointer",marginBottom:5,
    opacity:disabled?0.5:1,transition:"border-color 0.15s,background 0.15s",
  }}>
    <div style={{width:17,height:17,borderRadius:5,border:`2px solid ${selected?color:C.textDim}`,
      background:selected?color:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
      {selected&&<span style={{fontSize:11,color:"#061412",fontWeight:900}}>✓</span>}
    </div>
    <span style={{color:selected?C.white:danger?C.red:C.text,fontSize:13,fontFamily:FONT,flex:1,fontWeight:selected?500:400}}>{item.name}</span>
    {danger&&<span style={{fontSize:11,color:C.red,fontFamily:FONT}}>⚠ опасно</span>}
  </div>
);

const TimerCircle=({left,total})=>{
  const pct=left/total,color=pct>0.5?C.green:pct>0.2?C.yellow:C.red;
  const r=24,circ=2*Math.PI*r,mm=Math.floor(left/60),ss=left%60;
  return(
    <div style={{position:"relative",width:60,height:60}}>
      <svg width="60" height="60" style={{transform:"rotate(-90deg)",position:"absolute"}}>
        <circle cx="30" cy="30" r={r} fill="none" stroke={C.border} strokeWidth="4"/>
        <circle cx="30" cy="30" r={r} fill="none" stroke={color} strokeWidth="4"
          strokeDasharray={circ} strokeDashoffset={circ*(1-pct)}
          style={{transition:"stroke-dashoffset 1s linear,stroke 0.4s"}}/>
      </svg>
      <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",
        fontFamily:CODE,fontSize:13,color,fontWeight:700}}>
        {mm}:{ss.toString().padStart(2,"0")}
      </div>
    </div>
  );
};

const ResultCard=({id,text,isNew})=>{
  const diag=DIAGNOSTICS.find(d=>d.id===id);
  const color=CAT_COLOR[diag?.cat]||C.accent;
  const isCritical=text.startsWith("🔴");
  return(
    <div style={{background:isCritical?`${C.redDim}44`:C.panel2,
      border:`1px solid ${isCritical?C.red+"55":color+"33"}`,
      borderRadius:12,padding:"13px 15px",marginBottom:8,animation:isNew?"fadeIn 0.4s ease":"none"}}>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:7}}>
        <div style={{width:7,height:7,borderRadius:"50%",background:isCritical?C.red:color,flexShrink:0}}/>
        <span style={{fontSize:12,color,fontFamily:FONT,fontWeight:700,textTransform:"uppercase",letterSpacing:0.8}}>{diag?.name||id}</span>
        {isCritical&&<span style={{fontSize:10,color:C.red,background:`${C.redDim}88`,border:`1px solid ${C.red}44`,borderRadius:5,padding:"1px 7px",fontFamily:FONT,fontWeight:700}}>КРИТИЧНО</span>}
        {isNew&&<span style={{fontSize:11,color:C.green,marginLeft:"auto",fontFamily:FONT}}>● новый</span>}
      </div>
      <div style={{fontSize:13,color:C.text,lineHeight:1.7,fontFamily:FONT}}>{text.replace("🔴 ","")}</div>
    </div>
  );
};

// ── MAIN ─────────────────────────────────────────────────────────────
export default function App(){
  const[phase,setPhase]=useState("menu");
  const[cd,setCd]=useState(null);
  const[usedIds,setUsedIds]=useState([]);

  // Dynamic patient state
  const[ps,setPs]=useState(null);
  const[prevPs,setPrevPs]=useState(null);
  const[eventLog,setEventLog]=useState([]);
  const[gameOver,setGameOver]=useState(false);

  // Treatment effects tracking
  const[appliedFx,setAppliedFx]=useState(new Set()); // ids with effects already applied
  const[pendingFx,setPendingFx]=useState(new Set()); // ids with effect in progress (delay)

  // Game flow state
  const[selDiag,setSelDiag]=useState([]);
  const[orderedDiag,setOrderedDiag]=useState([]);
  const[revealedResults,setRevealedResults]=useState({});
  const[newResultIds,setNewResultIds]=useState([]);
  const[selTreat,setSelTreat]=useState([]);
  const[diagText,setDiagText]=useState("");
  const[diagCat,setDiagCat]=useState("all");
  const[treatCat,setTreatCat]=useState("all");
  const[timeLeft,setTimeLeft]=useState(0);
  const[totalTime,setTotalTime]=useState(0);
  const[processingTests,setProcessingTests]=useState(false);
  const[result,setResult]=useState(null);
  const[totalScore,setTotalScore]=useState(0);
  const[casesPlayed,setCasesPlayed]=useState(0);
  const[searchQuery,setSearchQuery]=useState("");
  const[specFilter,setSpecFilter]=useState(null);
  const[showNotif,setShowNotif]=useState(false);
  const[showSettings,setShowSettings]=useState(false);
  const[showAllCases,setShowAllCases]=useState(false);

  const timerRef=useRef(null);
  const detRef=useRef(null);
  const fxTimersRef=useRef([]);
  // Refs to avoid stale closures in intervals/timeouts
  const timeLeftRef=useRef(0);
  const totalTimeRef=useRef(0);
  const psRef=useRef(null);
  const cdRef=useRef(null);
  const selTreatRef=useRef([]);
  const orderedDiagRef=useRef([]);
  const diagTextRef=useRef("");
  const appliedFxRef=useRef(new Set());
  const submitRef=useRef(null); // forward-ref to handleSubmit

  // Keep refs in sync with state
  useEffect(()=>{timeLeftRef.current=timeLeft;},[timeLeft]);
  useEffect(()=>{totalTimeRef.current=totalTime;},[totalTime]);
  useEffect(()=>{psRef.current=ps;},[ps]);
  useEffect(()=>{cdRef.current=cd;},[cd]);
  useEffect(()=>{selTreatRef.current=selTreat;},[selTreat]);
  useEffect(()=>{orderedDiagRef.current=orderedDiag;},[orderedDiag]);
  useEffect(()=>{diagTextRef.current=diagText;},[diagText]);
  useEffect(()=>{appliedFxRef.current=appliedFx;},[appliedFx]);

  const addEvent=(text,type="info")=>{
    const elapsed=totalTimeRef.current-timeLeftRef.current;
    const mm=Math.floor(elapsed/60),ss=elapsed%60;
    const timeStr=`${mm}:${String(ss).padStart(2,"0")}`;
    setEventLog(prev=>[{id:Date.now()+Math.random(),text,type,elapsed:timeStr},...prev.slice(0,29)]);
  };

  const startGame=(caseId)=>{
    clearInterval(timerRef.current);
    clearInterval(detRef.current);
    fxTimersRef.current.forEach(t=>clearTimeout(t));
    fxTimersRef.current=[];
    const pool=usedIds.length>=CASES.length?CASES:CASES.filter(c=>!usedIds.includes(c.id));
    const chosen=caseId?CASES.find(c=>c.id===caseId)||pool[Math.floor(Math.random()*pool.length)]:pool[Math.floor(Math.random()*pool.length)];
    setCd(chosen);
    setUsedIds(prev=>usedIds.length>=CASES.length?[chosen.id]:[...prev,chosen.id]);
    const initialPS=initPS(chosen);
    setPs(initialPS);
    setPrevPs(initialPS);
    setGameOver(false);
    setAppliedFx(new Set());
    setPendingFx(new Set());
    setEventLog([{id:1,text:"Пациент поступил в приёмное отделение",type:"info",elapsed:"0:00"}]);
    setSelDiag([]);setOrderedDiag([]);setRevealedResults({});setNewResultIds([]);
    setSelTreat([]);setDiagText("");setDiagCat("all");setTreatCat("all");setResult(null);
    const t=chosen.timeLimit*60;
    setTotalTime(t);setTimeLeft(t);
    totalTimeRef.current=t;timeLeftRef.current=t;
    setPhase("order_tests");
  };

  // Main timer — uses submitRef to avoid stale closure
  useEffect(()=>{
    if(phase==="order_tests"||phase==="awaiting_results"||phase==="diagnose"){
      clearInterval(timerRef.current);
      timerRef.current=setInterval(()=>{
        setTimeLeft(t=>{
          if(t<=1){clearInterval(timerRef.current);submitRef.current?.(true);return 0;}
          return t-1;
        });
      },1000);
    }
    return()=>clearInterval(timerRef.current);
  },[phase]);

  // Deterioration loop — every 30 seconds
  useEffect(()=>{
    if(!cd||phase==="menu"||phase==="result"||gameOver)return;
    clearInterval(detRef.current);
    detRef.current=setInterval(()=>{
      setPs(prev=>{
        if(!prev||prev.status==="dead")return prev;
        const det=cdRef.current?.deterioration||{};
        setPrevPs({...prev});
        const next={
          ...prev,
          hr:   clamp(r1(prev.hr   +(det.hr   ??0)),CLAMP_RANGES.hr[0],   CLAMP_RANGES.hr[1]),
          sbp:  clamp(r1(prev.sbp  +(det.sbp  ??0)),CLAMP_RANGES.sbp[0],  CLAMP_RANGES.sbp[1]),
          dbp:  clamp(r1(prev.dbp  +(det.dbp  ??0)),CLAMP_RANGES.dbp[0],  CLAMP_RANGES.dbp[1]),
          rr:   clamp(r1(prev.rr   +(det.rr   ??0)),CLAMP_RANGES.rr[0],   CLAMP_RANGES.rr[1]),
          spo2: clamp(r1(prev.spo2 +(det.spo2 ??0)),CLAMP_RANGES.spo2[0], CLAMP_RANGES.spo2[1]),
          temp: clamp(r1(prev.temp +(det.temp ??0)),CLAMP_RANGES.temp[0], CLAMP_RANGES.temp[1]),
          gcs:  clamp(r1(prev.gcs  +(det.gcs  ??0)),CLAMP_RANGES.gcs[0],  CLAMP_RANGES.gcs[1]),
          pain: clamp(r1(prev.pain +(det.pain ??0)),CLAMP_RANGES.pain[0], CLAMP_RANGES.pain[1]),
        };
        const dt=cdRef.current?.deathThresholds||{};
        const dead=(dt.sbp&&next.sbp<=dt.sbp)||(dt.spo2&&next.spo2<=dt.spo2)||
                   (dt.gcs&&next.gcs<=dt.gcs)||(dt.hr&&next.hr>=dt.hr)||(dt.rr&&next.rr<=dt.rr);
        next.status=dead?"dead":(next.sbp<80||next.spo2<80||next.gcs<8)?"critical":"deteriorating";
        return next;
      });
    },30000);
    return()=>clearInterval(detRef.current);
  },[cd,phase,gameOver]);

  // Watch for death
  useEffect(()=>{
    if(!ps||ps.status!=="dead"||gameOver)return;
    setGameOver(true);
    clearInterval(timerRef.current);
    clearInterval(detRef.current);
    fxTimersRef.current.forEach(t=>clearTimeout(t));
    addEvent("💀 ПАЦИЕНТ ПОГИБ — лечение не было начато вовремя","critical");
    setTimeout(()=>submitRef.current?.(false,true),2000);
  },[ps?.status]);

  // Warn when critical (only once per status change)
  useEffect(()=>{
    if(!ps||ps.status!=="critical")return;
    addEvent("⚠ Состояние критическое! Требуются немедленные действия","warning");
  },[ps?.status]);

  // ── Block 2: Apply treatment effects with compressed delays ──────────
  const applyTreatEffect=(treatId)=>{
    const cCase=cdRef.current;
    if(!cCase)return;
    const fx=TREAT_FX[treatId];
    const tName=TREATMENTS.find(t=>t.id===treatId)?.name||treatId;
    const isWrong=cCase.wrongTreat.includes(treatId);
    const effects=isWrong?(ADVERSE_FX[treatId]||{}):(fx?.eff||{});
    const hasEffect=Object.keys(effects).some(k=>effects[k]!==0);

    if(!hasEffect){
      setAppliedFx(prev=>new Set([...prev,treatId]));
      setPendingFx(prev=>{const n=new Set(prev);n.delete(treatId);return n;});
      return;
    }

    setPs(prev=>{
      if(!prev||prev.status==="dead")return prev;
      const next={...prev};
      Object.entries(effects).forEach(([k,v])=>{
        if(k in next&&CLAMP_RANGES[k])next[k]=clamp(r1(next[k]+v),CLAMP_RANGES[k][0],CLAMP_RANGES[k][1]);
      });
      // re-evaluate status
      const dt=cCase.deathThresholds||{};
      const dead=(dt.sbp&&next.sbp<=dt.sbp)||(dt.spo2&&next.spo2<=dt.spo2)||
                 (dt.gcs&&next.gcs<=dt.gcs)||(dt.hr&&next.hr>=dt.hr)||(dt.rr&&next.rr<=dt.rr);
      next.status=dead?"dead":(next.sbp<80||next.spo2<80||next.gcs<8)?"critical":
                  (next.sbp>100&&next.spo2>90&&next.gcs>=12)?"stable":"deteriorating";
      return next;
    });

    if(isWrong){
      addEvent(`🚨 ${tName}: ОПАСНЫЙ ЭФФЕКТ — состояние ухудшилось`,"critical");
    } else {
      addEvent(`✓ ${tName}: ${fx?.desc||"эффект применён"}`,"result");
    }
    setAppliedFx(prev=>new Set([...prev,treatId]));
    setPendingFx(prev=>{const n=new Set(prev);n.delete(treatId);return n;});
  };

  const toggleTreatment=(treatId)=>{
    setSelTreat(prev=>{
      const removing=prev.includes(treatId);
      if(removing){
        // Can't un-administer: if already applied, keep in selTreat
        if(appliedFxRef.current.has(treatId))return prev;
        // If still pending, cancel the timer (treat as not given)
        // We don't have individual timer refs per treatment, so just remove from pending
        setPendingFx(p=>{const n=new Set(p);n.delete(treatId);return n;});
        return prev.filter(x=>x!==treatId);
      }
      // Adding
      const tName=TREATMENTS.find(t=>t.id===treatId)?.name||treatId;
      addEvent(`💊 Назначен: ${tName}`,"treatment");
      const fx=TREAT_FX[treatId];
      const delayMs=Math.round(((fx?.delay||60)/6)*1000); // compressed 6x for playability
      setPendingFx(p=>new Set([...p,treatId]));
      const timer=setTimeout(()=>applyTreatEffect(treatId),delayMs);
      fxTimersRef.current.push(timer);
      return [...prev,treatId];
    });
  };

  const handleOrderTests=async()=>{
    if(selDiag.length===0)return;
    setProcessingTests(true);
    setOrderedDiag(selDiag);
    setPhase("awaiting_results");
    addEvent(`Назначено ${selDiag.length} исследований`,"info");
    const ids=[...selDiag];
    for(let i=0;i<ids.length;i++){
      await new Promise(r=>setTimeout(r,600+Math.random()*400));
      const id=ids[i];
      const text=cd.testResults[id]||`${DIAGNOSTICS.find(d=>d.id===id)?.name||id}: в пределах нормы.`;
      setRevealedResults(prev=>({...prev,[id]:text}));
      setNewResultIds(prev=>[...prev,id]);
      const isCrit=text.startsWith("🔴");
      addEvent(`Результат: ${DIAGNOSTICS.find(d=>d.id===id)?.name||id}${isCrit?" — КРИТИЧНО":""}`,isCrit?"critical":"result");
      setTimeout(()=>setNewResultIds(prev=>prev.filter(x=>x!==id)),2000);
    }
    setProcessingTests(false);
  };

  const handleSubmit=(timeout=false,died=false)=>{
    clearInterval(timerRef.current);
    clearInterval(detRef.current);
    fxTimersRef.current.forEach(t=>clearTimeout(t));
    // Use refs so this is always fresh even when called from stale closures
    const cCase=cdRef.current||cd;
    const cPs=psRef.current||ps;
    const cSelTreat=selTreatRef.current;
    const cOrderedDiag=orderedDiagRef.current;
    const cDiagText=diagTextRef.current;
    const cAppliedFx=appliedFxRef.current;
    if(!cCase)return;

    // Apply effects only for treatments NOT yet applied (real-time effects in Block 2)
    let finalPS={...(cPs||initPS(cCase))};
    cSelTreat.forEach(treatId=>{
      if(cAppliedFx.has(treatId))return; // already applied in real-time
      const fx=TREAT_FX[treatId];
      if(!fx)return;
      const isWrong=cCase.wrongTreat.includes(treatId);
      const effects=isWrong?(ADVERSE_FX[treatId]||{}):fx.eff;
      Object.entries(effects).forEach(([key,val])=>{
        if(key in finalPS&&CLAMP_RANGES[key]){
          finalPS[key]=clamp(r1(finalPS[key]+val),CLAMP_RANGES[key][0],CLAMP_RANGES[key][1]);
        }
      });
    });

    const outcome=computeOutcome(finalPS);
    finalPS.status=outcome==="dead"?"dead":outcome==="stable"?"stable":finalPS.status;

    const res=computeScore(cCase,cOrderedDiag,cSelTreat,cDiagText,finalPS);
    setResult({...res,timeout,died});
    setPs(finalPS);
    setTotalScore(s=>s+res.score);
    setCasesPlayed(c=>c+1);
    setPhase("result");
  };
  // Keep submit ref always current
  submitRef.current=handleSubmit;

  const toggle=(setter,id)=>setter(p=>p.includes(id)?p.filter(x=>x!==id):[...p,id]);
  const diagCats=["all",...new Set(DIAGNOSTICS.map(d=>d.cat))];
  const treatCats=["all",...new Set(TREATMENTS.map(t=>t.cat))];
  const filtDiag=diagCat==="all"?DIAGNOSTICS:DIAGNOSTICS.filter(d=>d.cat===diagCat);
  const filtTreat=treatCat==="all"?TREATMENTS:TREATMENTS.filter(t=>t.cat===treatCat);
  const allResultsReady=orderedDiag.length>0&&orderedDiag.every(id=>revealedResults[id]);

  const steps=[
    {key:"order_tests",label:"Исследования",icon:"🔬"},
    {key:"awaiting_results",label:"Ожидание",icon:"⏳"},
    {key:"diagnose",label:"Диагноз+Лечение",icon:"📝"},
  ];
  const activeStep=steps.findIndex(s=>s.key===phase);

  const trend=(key)=>{
    if(!ps||!prevPs)return 0;
    return ps[key]>prevPs[key]?1:ps[key]<prevPs[key]?-1:0;
  };

  // ── MENU ──
  if(phase==="menu"){
    const catMeta={
      cardiac:{icon:"❤️",label:"Кардиология",color:C.red},
      neuro:{icon:"🧠",label:"Неврология",color:C.purple},
      respiratory:{icon:"🫁",label:"Пульмонология",color:C.green},
      infectious:{icon:"🦠",label:"Инфекции",color:C.orange},
      metabolic:{icon:"⚗️",label:"Метаболизм",color:C.yellow},
      abdominal:{icon:"🔬",label:"Хирургия",color:C.accent},
    };
    const navSpec=[
      {icon:"❤️",label:"Кардиология",cat:"cardiac"},
      {icon:"🧠",label:"Неврология",cat:"neuro"},
      {icon:"🫁",label:"Пульмонология",cat:"respiratory"},
      {icon:"🦠",label:"Инфекции",cat:"infectious"},
      {icon:"⚗️",label:"Метаболизм",cat:"metabolic"},
      {icon:"🔬",label:"Хирургия",cat:"abdominal"},
    ];
    return(
      <div style={{
        height:"100vh",
        background:`linear-gradient(160deg,#070d18 0%,#0a1628 50%,#070f1a 100%)`,
        display:"flex",fontFamily:FONT,overflow:"hidden",position:"relative"
      }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
          @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
          @keyframes glowPulse{0%,100%{opacity:0.5}50%{opacity:1}}
          .nav-item:hover{background:rgba(0,230,200,0.06)!important;color:#00e6c8!important;transition:all 0.2s cubic-bezier(0.16,1,0.3,1)!important}
          .nav-item:hover span{color:#00e6c8!important}
          .case-card{transition:all 0.3s cubic-bezier(0.16,1,0.3,1)!important;will-change:transform,box-shadow}
          .case-card:hover{border-color:rgba(0,230,200,0.3)!important;transform:translateY(-4px) scale(1.01);box-shadow:0 16px 48px rgba(0,0,0,0.55)!important}
          .start-btn{transition:all 0.25s cubic-bezier(0.16,1,0.3,1)!important}
          .start-btn:hover{background:#00c8b4!important;box-shadow:0 6px 24px rgba(0,230,200,0.45)!important;transform:translateY(-1px)}
          .session-row{transition:background 0.2s ease!important}
          .session-row:hover{background:rgba(0,230,200,0.05)!important}
          ::-webkit-scrollbar{width:4px}
          ::-webkit-scrollbar-track{background:transparent}
          ::-webkit-scrollbar-thumb{background:rgba(0,230,200,0.15);border-radius:2px}
        `}</style>

        {/* ── AMBIENT GLOW BACKGROUND ── */}
        <div style={{position:"absolute",inset:0,pointerEvents:"none",zIndex:0}}>
          <div style={{position:"absolute",left:"-10%",top:"-5%",width:600,height:600,
            background:"radial-gradient(circle,rgba(0,230,200,0.07) 0%,transparent 65%)",borderRadius:"50%"}}/>
          <div style={{position:"absolute",right:"-5%",bottom:"-10%",width:500,height:500,
            background:"radial-gradient(circle,rgba(0,100,200,0.08) 0%,transparent 65%)",borderRadius:"50%"}}/>
        </div>

        {/* ── LEFT SIDEBAR ── */}
        <aside style={{
          width:220,flexShrink:0,zIndex:10,
          background:"rgba(10,18,36,0.85)",
          backdropFilter:"blur(24px)",WebkitBackdropFilter:"blur(24px)",
          borderRight:"1px solid rgba(0,230,200,0.08)",
          display:"flex",flexDirection:"column",padding:"22px 12px"
        }}>
          {/* Logo */}
          <div style={{display:"flex",alignItems:"center",gap:11,padding:"6px 10px",marginBottom:30}}>
            <div style={{
              width:38,height:38,borderRadius:11,flexShrink:0,
              background:"linear-gradient(135deg,rgba(0,230,200,0.2),rgba(0,150,200,0.1))",
              border:"1px solid rgba(0,230,200,0.3)",
              display:"flex",alignItems:"center",justifyContent:"center",
              boxShadow:"0 0 20px rgba(0,230,200,0.15)"
            }}>
              <span style={{fontFamily:SER,fontSize:19,color:C.accent,fontStyle:"italic",fontWeight:700}}>М</span>
            </div>
            <div>
              <div style={{fontSize:17,fontWeight:700,color:C.white,fontFamily:FONT,letterSpacing:-0.3,lineHeight:1}}>МедСим</div>
              <div style={{fontSize:10,color:C.accent,fontFamily:FONT,letterSpacing:1,marginTop:2,opacity:0.7}}>СИМУЛЯТОР</div>
            </div>
          </div>

          {/* Main nav — single item */}
          <div style={{fontSize:10,color:C.textDim,letterSpacing:1.5,padding:"0 10px",marginBottom:6,fontFamily:FONT,fontWeight:600}}>МЕНЮ</div>
          <div className="nav-item" style={{
            display:"flex",alignItems:"center",gap:11,padding:"10px 12px",
            borderRadius:11,marginBottom:2,cursor:"default",
            background:"rgba(0,230,200,0.12)",
            border:"1px solid rgba(0,230,200,0.2)",transition:"all 0.15s"
          }}>
            <span style={{fontSize:15,width:20,textAlign:"center"}}>▦</span>
            <span style={{fontSize:13,color:C.accent,fontWeight:600,fontFamily:FONT}}>Главное меню</span>
            <div style={{marginLeft:"auto",width:6,height:6,borderRadius:"50%",background:C.accent,
              boxShadow:`0 0 8px ${C.accent}`}}/>
          </div>

          {/* Specialty nav */}
          <div style={{fontSize:10,color:C.textDim,letterSpacing:1.5,padding:"0 10px",margin:"18px 0 6px",fontFamily:FONT,fontWeight:600}}>СПЕЦИАЛИЗАЦИИ</div>
          {specFilter&&(
            <div onClick={()=>setSpecFilter(null)} className="nav-item" style={{
              display:"flex",alignItems:"center",gap:8,padding:"7px 12px 7px 14px",
              borderRadius:10,marginBottom:4,cursor:"pointer",transition:"all 0.15s",
              background:"rgba(0,230,200,0.06)",border:"1px solid rgba(0,230,200,0.12)"
            }}>
              <span style={{fontSize:11,color:C.accent,fontFamily:FONT}}>✕ Сбросить фильтр</span>
            </div>
          )}
          {navSpec.map(({icon,label,cat})=>{
            const isActive=specFilter===cat;
            return(
              <div key={cat} onClick={()=>setSpecFilter(isActive?null:cat)} className="nav-item" style={{
                display:"flex",alignItems:"center",gap:11,padding:"9px 12px 9px 18px",
                borderRadius:10,marginBottom:2,cursor:"pointer",transition:"all 0.15s",
                background:isActive?"rgba(0,230,200,0.1)":"transparent",
                border:`1px solid ${isActive?"rgba(0,230,200,0.2)":"transparent"}`
              }}>
                <span style={{fontSize:14,width:18,textAlign:"center",opacity:isActive?1:0.5}}>{icon}</span>
                <span style={{fontSize:12,fontFamily:FONT,
                  color:isActive?C.accent:C.text,
                  fontWeight:isActive?600:400,
                  opacity:isActive?1:0.7}}>{label}</span>
                {isActive&&<div style={{marginLeft:"auto",width:5,height:5,borderRadius:"50%",
                  background:C.accent,boxShadow:`0 0 6px ${C.accent}`}}/>}
              </div>
            );
          })}

          <div style={{flex:1}}/>
        </aside>

        {/* ── MAIN AREA ── */}
        <div style={{flex:1,display:"flex",flexDirection:"column",minWidth:0,zIndex:1}}>

          {/* TOP BAR */}
          <header style={{
            height:66,flexShrink:0,padding:"0 28px",
            display:"flex",alignItems:"center",gap:16,
            background:"rgba(7,13,24,0.7)",
            backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)",
            borderBottom:"1px solid rgba(0,230,200,0.06)",
            position:"relative"
          }}>
            <span style={{fontSize:13,color:C.textDim,fontFamily:FONT}}>Главное меню</span>
            <div style={{width:1,height:16,background:"rgba(255,255,255,0.06)"}}/>

            {/* Search */}
            <div style={{flex:1,maxWidth:480,
              background:"rgba(255,255,255,0.04)",
              border:"1px solid rgba(0,230,200,0.1)",
              borderRadius:12,padding:"10px 16px",
              display:"flex",alignItems:"center",gap:10}}>
              <span style={{color:C.textDim,fontSize:14}}>🔍</span>
              <input value={searchQuery} onChange={e=>setSearchQuery(e.target.value)}
                placeholder="Поиск симуляций, кейсов, специальностей..."
                style={{background:"transparent",border:"none",outline:"none",
                  color:C.white,fontSize:13,fontFamily:FONT,flex:1,
                  caretColor:C.accent}}/>
              {searchQuery&&<span onClick={()=>setSearchQuery("")}
                style={{color:C.textDim,fontSize:13,cursor:"pointer"}}>✕</span>}
            </div>

            <div style={{flex:1}}/>

            {/* Notifications */}
            <div onClick={()=>{setShowNotif(v=>!v);setShowSettings(false);}}
              style={{position:"relative",width:38,height:38,
                background:showNotif?"rgba(0,230,200,0.1)":"rgba(255,255,255,0.04)",
                border:`1px solid ${showNotif?"rgba(0,230,200,0.3)":"rgba(0,230,200,0.08)"}`,
                borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",
                cursor:"pointer",transition:"all 0.15s"}}>
              <span style={{fontSize:16}}>🔔</span>
              <div style={{position:"absolute",top:6,right:6,width:7,height:7,
                background:C.red,borderRadius:"50%",border:"1px solid #070d18"}}/>
            </div>

            {/* Settings */}
            <div onClick={()=>{setShowSettings(v=>!v);setShowNotif(false);}}
              style={{width:38,height:38,
                background:showSettings?"rgba(0,230,200,0.1)":"rgba(255,255,255,0.04)",
                border:`1px solid ${showSettings?"rgba(0,230,200,0.3)":"rgba(0,230,200,0.08)"}`,
                borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",
                cursor:"pointer",transition:"all 0.15s"}}>
              <span style={{fontSize:16}}>⚙️</span>
            </div>

          </header>

          {/* Notifications portal — renders directly in document.body to escape backdrop-filter stacking */}
          {showNotif&&createPortal(
            <>
              <div style={{position:"fixed",inset:0,zIndex:99998}} onClick={()=>setShowNotif(false)}/>
              <div style={{position:"fixed",top:72,right:54,width:300,zIndex:99999,
              background:"rgba(10,18,36,0.98)",backdropFilter:"blur(24px)",WebkitBackdropFilter:"blur(24px)",
              border:"1px solid rgba(0,230,200,0.2)",borderRadius:16,padding:"16px",
              boxShadow:"0 16px 48px rgba(0,0,0,0.8),0 0 0 1px rgba(0,230,200,0.05)",fontFamily:FONT}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
                <span style={{fontSize:13,fontWeight:700,color:C.white}}>Уведомления</span>
                <span onClick={()=>setShowNotif(false)}
                  style={{fontSize:12,color:C.textDim,cursor:"pointer",padding:"2px 8px",
                    borderRadius:6,background:"rgba(255,255,255,0.06)"}}>✕</span>
              </div>
              {[
                {icon:"👋",text:"Добро пожаловать в МедСим!",sub:"Начните первую симуляцию"},
                {icon:"🏥",text:"Доступно "+CASES.length+" клинических кейсов",sub:"Кардиология, неврология и другие"},
                {icon:"🏆",text:"Ваш текущий счёт: "+totalScore+" очков",sub:casesPlayed+" кейсов пройдено"},
              ].map((n,i)=>(
                <div key={i} style={{display:"flex",gap:10,padding:"10px",borderRadius:10,
                  background:"rgba(255,255,255,0.03)",border:"1px solid rgba(0,230,200,0.08)",
                  marginBottom:i<2?6:0}}>
                  <span style={{fontSize:18,flexShrink:0}}>{n.icon}</span>
                  <div>
                    <div style={{fontSize:12,color:C.white,fontWeight:500}}>{n.text}</div>
                    <div style={{fontSize:11,color:C.textDim,marginTop:2}}>{n.sub}</div>
                  </div>
                </div>
              ))}
            </div>
            </>,
            document.body
          )}

          {/* Settings portal */}
          {showSettings&&createPortal(
            <>
              <div style={{position:"fixed",inset:0,zIndex:99998}} onClick={()=>setShowSettings(false)}/>
              <div style={{position:"fixed",top:72,right:8,width:280,zIndex:99999,
              background:"rgba(10,18,36,0.98)",backdropFilter:"blur(24px)",WebkitBackdropFilter:"blur(24px)",
              border:"1px solid rgba(0,230,200,0.2)",borderRadius:16,padding:"16px",
              boxShadow:"0 16px 48px rgba(0,0,0,0.8),0 0 0 1px rgba(0,230,200,0.05)",fontFamily:FONT}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
                <span style={{fontSize:13,fontWeight:700,color:C.white}}>Настройки</span>
                <span onClick={()=>setShowSettings(false)}
                  style={{fontSize:12,color:C.textDim,cursor:"pointer",padding:"2px 8px",
                    borderRadius:6,background:"rgba(255,255,255,0.06)"}}>✕</span>
              </div>
              <div style={{marginBottom:14}}>
                <div style={{fontSize:11,color:C.textDim,marginBottom:8,
                  textTransform:"uppercase",letterSpacing:1}}>Сложность</div>
                <div style={{display:"flex",gap:6}}>
                  {["Лёгкая","Средняя","Сложная"].map((d,i)=>(
                    <button key={d} style={{flex:1,
                      background:i===1?`${C.accent}18`:"transparent",
                      border:`1px solid ${i===1?C.accent:"rgba(0,230,200,0.1)"}`,
                      borderRadius:8,padding:"7px 4px",fontSize:11,
                      color:i===1?C.accent:C.textDim,cursor:"pointer",fontFamily:FONT}}>
                      {d}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{marginBottom:14}}>
                <div style={{fontSize:11,color:C.textDim,marginBottom:8,
                  textTransform:"uppercase",letterSpacing:1}}>Тема</div>
                <div style={{display:"flex",gap:6}}>
                  {["Тёмная","Синяя"].map((t,i)=>(
                    <button key={t} style={{flex:1,
                      background:i===0?`${C.accent}18`:"transparent",
                      border:`1px solid ${i===0?C.accent:"rgba(0,230,200,0.1)"}`,
                      borderRadius:8,padding:"7px 4px",fontSize:11,
                      color:i===0?C.accent:C.textDim,cursor:"pointer",fontFamily:FONT}}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{paddingTop:12,borderTop:"1px solid rgba(0,230,200,0.06)",
                fontSize:11,color:C.textDim,textAlign:"center",opacity:0.7}}>
                Дополнительные настройки в разработке
              </div>
            </div>
            </>,
            document.body
          )}

          {/* CONTENT */}
          <div style={{flex:1,display:"flex",overflow:"hidden"}}>

            {/* CENTER */}
            <div style={{flex:1,overflowY:"auto",padding:"26px 24px 40px"}}>

              {/* HERO */}
              <div style={{
                position:"relative",height:220,borderRadius:22,overflow:"hidden",marginBottom:28,
                background:"linear-gradient(135deg,#082840 0%,#0a3d2e 55%,#071828 100%)",
                border:"1px solid rgba(0,230,200,0.14)",
                boxShadow:"0 8px 48px rgba(0,0,0,0.6),inset 0 1px 0 rgba(0,230,200,0.1)",
                animation:"fadeUp 0.5s ease"
              }}>
                {/* Grid */}
                <div style={{position:"absolute",inset:0,
                  backgroundImage:"linear-gradient(rgba(0,230,200,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(0,230,200,0.04) 1px,transparent 1px)",
                  backgroundSize:"28px 28px"}}/>
                {/* Glow */}
                <div style={{position:"absolute",left:"-5%",top:"-20%",width:320,height:320,
                  background:`radial-gradient(circle,${C.accent}12 0%,transparent 65%)`,borderRadius:"50%"}}/>
                <div style={{position:"absolute",right:"-5%",top:"-10%",width:400,height:400,
                  background:"radial-gradient(circle,rgba(0,100,200,0.1) 0%,transparent 65%)",borderRadius:"50%"}}/>
                {/* Medical scanner graphic */}
                <div style={{position:"absolute",right:36,top:"50%",transform:"translateY(-50%)",opacity:0.7}}>
                  <svg width="170" height="170" viewBox="0 0 170 170">
                    <circle cx="85" cy="85" r="75" fill="none" stroke="rgba(0,230,200,0.07)" strokeWidth="1"/>
                    <circle cx="85" cy="85" r="60" fill="none" stroke="rgba(0,230,200,0.1)" strokeWidth="1"/>
                    <circle cx="85" cy="85" r="45" fill="none" stroke="rgba(0,230,200,0.14)" strokeWidth="1"/>
                    <circle cx="85" cy="85" r="30" fill="none" stroke="rgba(0,230,200,0.18)" strokeWidth="1"/>
                    <line x1="85" y1="10" x2="85" y2="160" stroke="rgba(0,230,200,0.05)" strokeWidth="1"/>
                    <line x1="10" y1="85" x2="160" y2="85" stroke="rgba(0,230,200,0.05)" strokeWidth="1"/>
                    <path d="M 85 10 A 75 75 0 0 1 152 52" stroke={C.accent} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
                    <path d="M 85 160 A 75 75 0 0 1 18 118" stroke={C.accent} strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.4"/>
                    <circle cx="85" cy="85" r="5" fill={C.accent} opacity="0.8"/>
                    <circle cx="85" cy="10" r="2.5" fill={C.accent}/>
                    <circle cx="160" cy="85" r="2.5" fill={C.accent} opacity="0.6"/>
                    <circle cx="152" cy="52" r="3" fill={C.green}/>
                  </svg>
                </div>
                {/* Text */}
                <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",
                  justifyContent:"center",padding:"0 38px",maxWidth:"62%"}}>
                  <div style={{fontSize:10,color:C.accent,letterSpacing:5,textTransform:"uppercase",
                    marginBottom:10,fontFamily:FONT,fontWeight:600}}>КЛИНИЧЕСКИЙ СИМУЛЯТОР</div>
                  <div style={{fontSize:42,fontWeight:700,fontFamily:SER,fontStyle:"italic",lineHeight:1.1,
                    background:`linear-gradient(135deg,${C.accent} 0%,${C.green} 100%)`,
                    WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",marginBottom:12}}>МедСим</div>
                  <div style={{fontSize:13,color:"rgba(168,200,224,0.75)",fontFamily:FONT,
                    marginBottom:20,lineHeight:1.6}}>
                    Клинические симуляции нового поколения.<br/>
                    Учитесь принимать решения в критических ситуациях.
                  </div>
                  <div style={{display:"flex",gap:10,alignItems:"center"}}>
                    <button className="start-btn" onClick={startGame} style={{
                      background:C.accent,border:"none",borderRadius:10,
                      padding:"11px 26px",fontSize:14,fontWeight:700,
                      color:C.bg,cursor:"pointer",fontFamily:FONT,
                      letterSpacing:0.3,transition:"all 0.2s",
                      boxShadow:`0 4px 16px rgba(0,230,200,0.3)`
                    }}>▶ Начать</button>
                    <div style={{display:"flex",gap:8}}>
                      {["Анализы","Диагноз","Лечение"].map((t,i)=>(
                        <span key={t} style={{background:"rgba(0,230,200,0.1)",
                          border:"1px solid rgba(0,230,200,0.2)",
                          borderRadius:20,padding:"4px 11px",fontSize:11,color:C.accent,fontFamily:FONT}}>
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Cases header */}
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
                <div style={{fontSize:17,fontWeight:700,color:C.white,fontFamily:FONT,letterSpacing:-0.3}}>
                  {specFilter?`${catMeta[specFilter]?.label||specFilter}`:
                   searchQuery?"Результаты поиска":"Клинические кейсы"}
                </div>
                <div style={{display:"flex",gap:6}}>
                  {specFilter&&(
                    <div onClick={()=>setSpecFilter(null)} style={{fontSize:12,color:C.accent,fontFamily:FONT,cursor:"pointer",
                      padding:"5px 13px",borderRadius:8,
                      border:"1px solid rgba(0,230,200,0.25)",
                      background:"rgba(0,230,200,0.1)"}}>
                      ✕ Сбросить
                    </div>
                  )}
                  <div onClick={()=>setShowAllCases(v=>!v)}
                    style={{fontSize:12,color:showAllCases?C.white:C.accent,fontFamily:FONT,cursor:"pointer",
                      padding:"5px 13px",borderRadius:8,
                      border:`1px solid ${showAllCases?"rgba(0,230,200,0.35)":"rgba(0,230,200,0.2)"}`,
                      background:showAllCases?"rgba(0,230,200,0.15)":"rgba(0,230,200,0.06)",
                      fontWeight:showAllCases?600:400}}>
                    {showAllCases?"↑ Свернуть":`Все (${CASES.length})`}
                  </div>
                </div>
              </div>

              {/* Cases grid 2×2 */}
              {(()=>{
                const q=searchQuery.toLowerCase();
                const visible=CASES.filter(c=>{
                  if(specFilter&&c.category!==specFilter)return false;
                  if(!q)return true;
                  return c.name.toLowerCase().includes(q)||
                    c.complaint.toLowerCase().includes(q)||
                    (catMeta[c.category]?.label||"").toLowerCase().includes(q);
                });
                if(visible.length===0)return(
                  <div style={{color:C.textDim,fontSize:14,fontFamily:FONT,padding:"20px 0"}}>
                    Ничего не найдено{searchQuery?` по запросу «${searchQuery}»`:` по выбранной специализации`}
                  </div>
                );
                return(
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
                    {(specFilter||searchQuery||showAllCases?visible:visible.slice(0,4)).map((c,i)=>{
                      const cm=catMeta[c.category]||{icon:"🏥",label:c.category,color:C.accent};
                      const sc={critical:C.red,moderate:C.yellow,mild:C.green}[c.severity]||C.yellow;
                      const dots={critical:3,moderate:2,mild:1}[c.severity]||2;
                      return(
                        <div key={c.id} className="case-card" onClick={()=>startGame(c.id)} style={{
                          background:"rgba(13,26,46,0.7)",
                          backdropFilter:"blur(16px)",WebkitBackdropFilter:"blur(16px)",
                          border:"1px solid rgba(0,230,200,0.08)",
                          borderRadius:18,padding:"18px 20px",
                          display:"flex",flexDirection:"column",gap:14,
                          transition:"all 0.25s",cursor:"pointer",
                          boxShadow:"0 4px 24px rgba(0,0,0,0.35)",
                          animation:`fadeUp ${0.35+i*0.08}s ease`
                        }}>
                          <div style={{display:"flex",alignItems:"flex-start",gap:12}}>
                            <div style={{
                              width:42,height:42,borderRadius:13,flexShrink:0,
                              background:`${cm.color}18`,border:`1px solid ${cm.color}30`,
                              display:"flex",alignItems:"center",justifyContent:"center",fontSize:20
                            }}>{cm.icon}</div>
                            <div style={{flex:1,minWidth:0}}>
                              <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:5,flexWrap:"wrap"}}>
                                <span style={{fontSize:11,color:cm.color,fontFamily:FONT,fontWeight:600,
                                  textTransform:"uppercase",letterSpacing:0.6}}>{cm.label}</span>
                                <div style={{display:"flex",gap:3}}>
                                  {[1,2,3].map(d=>(
                                    <div key={d} style={{width:6,height:6,borderRadius:"50%",
                                      background:d<=dots?sc:`${sc}30`,transition:"background 0.2s"}}/>
                                  ))}
                                </div>
                              </div>
                              <div style={{fontSize:14,fontWeight:600,color:C.white,fontFamily:FONT,
                                marginBottom:5,lineHeight:1.3}}>{c.name}, {c.age} л</div>
                              <div style={{fontSize:12,color:C.textDim,fontFamily:FONT,lineHeight:1.55,
                                overflow:"hidden",textOverflow:"ellipsis",display:"-webkit-box",
                                WebkitLineClamp:2,WebkitBoxOrient:"vertical"}}>{c.complaint}</div>
                            </div>
                          </div>
                          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",
                            paddingTop:12,borderTop:"1px solid rgba(0,230,200,0.06)"}}>
                            <div style={{display:"flex",alignItems:"center",gap:10}}>
                              <span style={{fontSize:11,color:C.textDim,fontFamily:FONT}}>⏱ {c.timeLimit} мин</span>
                              <span style={{fontSize:11,color:sc,fontFamily:FONT,
                                background:`${sc}15`,borderRadius:5,padding:"2px 7px"}}>
                                {{critical:"Критический",moderate:"Средний",mild:"Лёгкий"}[c.severity]}
                              </span>
                            </div>
                            <button className="start-btn" onClick={e=>{e.stopPropagation();startGame(c.id);}} style={{
                              background:C.accent,border:"none",borderRadius:9,
                              padding:"8px 20px",fontSize:13,fontWeight:700,
                              color:C.bg,cursor:"pointer",fontFamily:FONT,
                              transition:"all 0.2s",boxShadow:`0 3px 12px rgba(0,230,200,0.25)`
                            }}>Старт</button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>

            {/* ── RIGHT COLUMN ── */}
            <div style={{
              width:280,flexShrink:0,overflowY:"auto",
              padding:"26px 20px 40px 4px",
              display:"flex",flexDirection:"column",gap:14
            }}>

              {/* Progress rings */}
              <div style={{
                background:"rgba(13,26,46,0.7)",backdropFilter:"blur(16px)",
                border:"1px solid rgba(0,230,200,0.08)",borderRadius:18,
                padding:"18px 14px",boxShadow:"0 4px 24px rgba(0,0,0,0.3)"
              }}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
                  <span style={{fontSize:11,color:C.textDim,textTransform:"uppercase",
                    letterSpacing:1.2,fontFamily:FONT,fontWeight:600}}>Прогресс</span>
                  <span style={{fontSize:11,color:C.accent,fontFamily:FONT,
                    background:"rgba(0,230,200,0.1)",borderRadius:5,padding:"2px 8px"}}>Серия</span>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14}}>
                  {[
                    {value:casesPlayed,max:CASES.length,label:"Кейсов",color:C.accent},
                    {value:casesPlayed?Math.round(totalScore/casesPlayed):0,max:100,label:"Ср. балл",color:C.green},
                  ].map(({value,max,label,color})=>{
                    const pct=max>0?Math.min(value/max,1):0;
                    const r=30,circ=2*Math.PI*r;
                    return(
                      <div key={label} style={{textAlign:"center",
                        background:"rgba(255,255,255,0.02)",
                        border:"1px solid rgba(255,255,255,0.04)",borderRadius:14,padding:"14px 8px"}}>
                        <div style={{position:"relative",width:72,height:72,margin:"0 auto 10px"}}>
                          <svg width="72" height="72" style={{transform:"rotate(-90deg)",display:"block"}}>
                            <circle cx="36" cy="36" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4.5"/>
                            <circle cx="36" cy="36" r={r} fill="none" stroke={color} strokeWidth="4.5"
                              strokeDasharray={circ} strokeDashoffset={circ*(1-pct)}
                              strokeLinecap="round"
                              style={{filter:`drop-shadow(0 0 6px ${color}88)`,transition:"stroke-dashoffset 0.8s ease"}}/>
                          </svg>
                          <div style={{position:"absolute",inset:0,display:"flex",
                            flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
                            <div style={{fontSize:20,fontWeight:700,color,fontFamily:CODE,lineHeight:1}}>{value}</div>
                          </div>
                        </div>
                        <div style={{fontSize:11,color:C.textDim,fontFamily:FONT,
                          textTransform:"uppercase",letterSpacing:0.8}}>{label}</div>
                      </div>
                    );
                  })}
                </div>
                {/* Total score */}
                <div style={{
                  display:"flex",alignItems:"center",gap:14,
                  background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.04)",
                  borderRadius:13,padding:"12px 16px"
                }}>
                  <div style={{width:46,height:46,borderRadius:12,flexShrink:0,
                    background:`linear-gradient(135deg,${C.yellow}25,${C.orange}15)`,
                    border:`1px solid ${C.yellow}30`,
                    display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>🏆</div>
                  <div>
                    <div style={{fontSize:26,fontWeight:700,color:C.yellow,fontFamily:CODE,lineHeight:1}}>{totalScore}</div>
                    <div style={{fontSize:11,color:C.textDim,fontFamily:FONT,marginTop:3}}>очков всего</div>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <button className="start-btn" onClick={startGame} style={{
                background:`linear-gradient(135deg,${C.accent},${C.green})`,
                border:"none",borderRadius:14,padding:"16px",
                fontSize:15,fontWeight:700,color:C.bg,cursor:"pointer",
                fontFamily:FONT,letterSpacing:0.5,width:"100%",
                boxShadow:`0 6px 24px rgba(0,230,200,0.3)`,
                transition:"all 0.2s"
              }}>▶ НОВЫЙ ПАЦИЕНТ</button>

              {/* Recent sessions */}
              <div style={{
                background:"rgba(13,26,46,0.7)",backdropFilter:"blur(16px)",
                border:"1px solid rgba(0,230,200,0.08)",borderRadius:18,
                padding:"18px 16px",boxShadow:"0 4px 24px rgba(0,0,0,0.3)"
              }}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                  <span style={{fontSize:13,fontWeight:600,color:C.white,fontFamily:FONT}}>Недавние сессии</span>
                  <span style={{fontSize:11,color:C.accent,fontFamily:FONT,
                    background:"rgba(0,230,200,0.08)",borderRadius:5,padding:"2px 8px",cursor:"pointer"}}>Ещё</span>
                </div>
                {CASES.slice(0,5).map(c=>{
                  const cm=catMeta[c.category]||{icon:"🏥",label:c.category,color:C.accent};
                  return(
                    <div key={c.id} className="session-row" style={{
                      display:"flex",alignItems:"center",gap:11,padding:"9px 10px",
                      borderRadius:12,marginBottom:4,transition:"background 0.15s",cursor:"pointer"
                    }}>
                      <div style={{
                        width:36,height:36,borderRadius:10,flexShrink:0,
                        background:`${cm.color}15`,border:`1px solid ${cm.color}25`,
                        display:"flex",alignItems:"center",justifyContent:"center",fontSize:16
                      }}>{cm.icon}</div>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontSize:13,color:C.white,fontFamily:FONT,fontWeight:500,
                          overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",lineHeight:1.3}}>
                          {c.name.split(" ").slice(0,2).join(" ")}
                        </div>
                        <div style={{fontSize:11,color:C.textDim,fontFamily:FONT,marginTop:2}}>{cm.label}</div>
                      </div>
                      <button onClick={startGame} style={{
                        background:"transparent",
                        border:"1px solid rgba(0,230,200,0.25)",
                        borderRadius:8,padding:"4px 12px",
                        fontSize:12,color:C.accent,cursor:"pointer",fontFamily:FONT,
                        flexShrink:0,transition:"all 0.15s"
                      }}>Старт</button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── RESULT SCREEN ──
  if(phase==="result"&&result&&cd){
    const outcomeMap={
      stable:{color:C.green,label:"Стабилизирован",icon:"✓"},
      unstable:{color:C.yellow,label:"Нестабилен",icon:"⚠"},
      critical:{color:C.red,label:"Критическое состояние",icon:"🚨"},
      dead:{color:C.red,label:"Летальный исход",icon:"💀"},
      unknown:{color:C.textDim,label:"Неизвестно",icon:"?"},
    };
    const oc=outcomeMap[result.outcome]||outcomeMap.unknown;
    const gCol={Отлично:C.green,Хорошо:C.accent,Удовлетворительно:C.yellow,Неудовлетворительно:C.red}[result.grade];

    // Compute deltas for vital dynamics
    const initSbp=parseInt(cd.vitals.bp);
    const initDbp=parseInt(cd.vitals.bp.split("/")[1]);
    const vitalDeltas=ps?[
      {label:"АД",init:cd.vitals.bp,final:`${Math.round(ps.sbp)}/${Math.round(ps.dbp)}`,
        delta:Math.round(ps.sbp)-initSbp,warn:ps.sbp<90||ps.sbp>160},
      {label:"ЧСС",init:cd.vitals.hr,final:Math.round(ps.hr),
        delta:Math.round(ps.hr)-cd.vitals.hr,warn:ps.hr>100||ps.hr<50},
      {label:"SpO₂",init:`${cd.vitals.spo2}%`,final:`${r1(ps.spo2)}%`,
        delta:r1(ps.spo2-cd.vitals.spo2),warn:ps.spo2<94},
      {label:"ЧД",init:cd.vitals.rr,final:Math.round(ps.rr),
        delta:Math.round(ps.rr)-cd.vitals.rr,warn:ps.rr>20},
      {label:"ГКС",init:cd.initialGCS??15,final:Math.round(ps.gcs),
        delta:r1(ps.gcs-(cd.initialGCS??15)),warn:ps.gcs<10},
      {label:"Боль",init:cd.initialPain??6,final:r1(ps.pain),
        delta:r1(ps.pain-(cd.initialPain??6)),warn:ps.pain>7},
    ]:[];

    // Missed critical tests
    const missedCritical=cd.needDiag.filter(id=>!orderedDiag.includes(id));
    // Wrong tests (ordered but not needed — not penalised, just informational)
    const extraTests=orderedDiag.filter(id=>!cd.needDiag.includes(id));
    // Missed treatments
    const missedTreat=cd.needTreat.filter(id=>!selTreat.includes(id));
    // Wrong treatments given
    const wrongGiven=cd.wrongTreat.filter(id=>selTreat.includes(id));

    return(
      <div style={{minHeight:"100vh",background:C.bg,fontFamily:FONT}}>
        <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}`}</style>
        {/* Result header bar */}
        <div style={{background:C.panel,borderBottom:`1px solid ${C.border}`,padding:"12px 28px",
          display:"flex",alignItems:"center",gap:12}}>
          <div onClick={()=>setPhase("menu")} style={{width:28,height:28,background:`${C.accent}20`,border:`1px solid ${C.accent}44`,
            borderRadius:7,display:"flex",alignItems:"center",justifyContent:"center",
            cursor:"pointer",transition:"all 0.2s cubic-bezier(0.16,1,0.3,1)"}}>
            <span style={{fontFamily:SER,fontSize:14,color:C.accent,fontStyle:"italic",fontWeight:700}}>М</span>
          </div>
          <span style={{fontFamily:SER,fontSize:16,color:C.accent,fontStyle:"italic",letterSpacing:1}}>МедСим</span>
          <div style={{width:1,height:18,background:C.border}}/>
          <span style={{fontSize:13,color:C.textDim,fontFamily:FONT}}>Разбор случая</span>
          <div style={{flex:1}}/>
          <Btn onClick={()=>setPhase("menu")} color={C.textDim} style={{padding:"7px 16px",fontSize:12}}>🏠 Меню</Btn>
        </div>
        <div style={{maxWidth:900,margin:"0 auto",padding:"24px 20px 80px"}}>

          {/* Score header */}
          <div style={{background:C.panel,border:`1px solid ${C.border}`,borderRadius:18,
            padding:"28px 32px",marginBottom:14,animation:"fadeIn 0.5s ease",
            display:"flex",alignItems:"center",gap:32}}>
            <div style={{textAlign:"center",flexShrink:0}}>
              <div style={{fontSize:72,fontWeight:700,color:gCol,fontFamily:CODE,lineHeight:1,
                textShadow:`0 0 40px ${gCol}44`}}>{result.score}</div>
              <div style={{fontSize:12,color:C.textDim,fontFamily:FONT,marginTop:4}}>из 100 баллов</div>
            </div>
            <div style={{flex:1}}>
              <div style={{fontSize:12,letterSpacing:3,color:C.textDim,marginBottom:8,
                textTransform:"uppercase",fontFamily:FONT}}>
                {cd.name} · {cd.age} л · {cd.gender}
              </div>
              <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:8}}>
                <span style={{background:`${gCol}20`,border:`1px solid ${gCol}55`,borderRadius:20,
                  padding:"5px 18px",fontSize:14,color:gCol,fontWeight:700,fontFamily:FONT}}>{result.grade}</span>
                <span style={{background:`${oc.color}20`,border:`1px solid ${oc.color}55`,borderRadius:20,
                  padding:"5px 18px",fontSize:14,color:oc.color,fontWeight:700,fontFamily:FONT}}>{oc.icon} {oc.label}</span>
              </div>
              {result.timeout&&<div style={{color:C.red,fontSize:12,fontFamily:FONT}}>⏱ Время истекло</div>}
              {result.died&&<div style={{color:C.red,fontSize:12,fontFamily:FONT}}>💀 Пациент погиб в ходе ведения</div>}
            </div>
          </div>

          {/* Vital dynamics */}
          {vitalDeltas.length>0&&(
            <div style={{background:C.panel,border:`1px solid ${C.border}`,borderRadius:14,padding:16,marginBottom:10}}>
              <STitle icon="📈" label="Динамика показателей" color={C.yellow}/>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
                {vitalDeltas.map(({label,init,final,delta,warn})=>{
                  const improved=delta<0&&["SpO₂","ЧД","ГКС","Боль"].includes(label)?false:
                    (label==="АД"||label==="ЧСС")?delta>0?false:true:
                    (label==="SpO₂"||label==="ГКС")?delta>0:delta<0;
                  // SpO2 & GCS: higher is better; BP,HR,RR,Pain: depends on case
                  const isGood=label==="SpO₂"||label==="ГКС"?delta>=0:
                               label==="Боль"?delta<=0:!warn;
                  const dColor=isGood?C.green:(warn?C.red:C.yellow);
                  return(
                    <div key={label} style={{background:C.panel2,border:`1px solid ${warn?C.red+"44":C.border}`,
                      borderRadius:8,padding:"8px 10px",textAlign:"center"}}>
                      <div style={{fontSize:11,color:C.textDim,textTransform:"uppercase",marginBottom:4,fontFamily:FONT}}>{label}</div>
                      <div style={{display:"flex",justifyContent:"center",alignItems:"center",gap:6}}>
                        <span style={{fontSize:13,color:C.textDim,fontFamily:CODE}}>{init}</span>
                        <span style={{fontSize:11,color:C.textDim,fontFamily:FONT}}>→</span>
                        <span style={{fontSize:15,fontWeight:700,color:warn?C.red:C.accent,fontFamily:CODE}}>{final}</span>
                      </div>
                      {delta!==0&&<div style={{fontSize:11,color:dColor,marginTop:2,fontFamily:CODE}}>
                        {delta>0?"+":""}{delta}
                      </div>}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Diagnosis */}
          <div style={{background:C.panel,border:`1px solid ${C.border}`,borderRadius:14,padding:16,marginBottom:10}}>
            <STitle icon="🎯" label="Диагноз" color={result.diagCorrect?C.green:result.diagPartial?C.yellow:C.red}/>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
              <div>
                <div style={{fontSize:12,color:C.textDim,marginBottom:5,textTransform:"uppercase",fontFamily:FONT}}>Ваш ответ</div>
                <div style={{color:result.diagCorrect?C.green:result.diagPartial?C.yellow:C.red,fontSize:13,lineHeight:1.6,fontFamily:FONT}}>
                  {diagText||<span style={{color:C.textDim,fontStyle:"italic"}}>не указан</span>}
                </div>
              </div>
              <div>
                <div style={{fontSize:12,color:C.textDim,marginBottom:5,textTransform:"uppercase",fontFamily:FONT}}>Правильный диагноз</div>
                <div style={{color:C.green,fontSize:13,lineHeight:1.6,fontFamily:FONT}}>{cd.diagnosis}</div>
              </div>
            </div>
          </div>

          {/* Tests analysis */}
          <div style={{background:C.panel,border:`1px solid ${C.border}`,borderRadius:14,padding:16,marginBottom:10}}>
            <STitle icon="🔬" label="Анализ исследований" color={C.accent}/>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              <div>
                <div style={{fontSize:12,color:C.textDim,marginBottom:6,textTransform:"uppercase",fontFamily:FONT}}>Назначены</div>
                {cd.needDiag.map(id=>{
                  const done=orderedDiag.includes(id);
                  const name=DIAGNOSTICS.find(d=>d.id===id)?.name||id;
                  return(
                    <div key={id} style={{fontSize:13,color:done?C.green:C.red,marginBottom:3,fontFamily:FONT}}>
                      {done?"✓":"✗"} {name}
                    </div>
                  );
                })}
                {extraTests.length>0&&(
                  <div style={{marginTop:8}}>
                    <div style={{fontSize:12,color:C.textDim,marginBottom:4,fontFamily:FONT}}>Лишние (не критично):</div>
                    {extraTests.map(id=>(
                      <div key={id} style={{fontSize:12,color:C.textDim,marginBottom:2,fontFamily:FONT}}>
                        · {DIAGNOSTICS.find(d=>d.id===id)?.name||id}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div>
                {missedCritical.length>0&&(
                  <>
                    <div style={{fontSize:12,color:C.red,marginBottom:6,textTransform:"uppercase",fontFamily:FONT}}>Пропущены критические:</div>
                    {missedCritical.map(id=>{
                      const name=DIAGNOSTICS.find(d=>d.id===id)?.name||id;
                      const reason=MISSED_TEST_REASONS[id];
                      return(
                        <div key={id} style={{background:`${C.redDim}55`,border:`1px solid ${C.red}33`,
                          borderRadius:6,padding:"6px 10px",marginBottom:6}}>
                          <div style={{fontSize:13,color:C.red,marginBottom:reason?3:0,fontFamily:FONT}}>✗ {name}</div>
                          {reason&&<div style={{fontSize:12,color:C.text,lineHeight:1.5,fontFamily:FONT}}>{reason}</div>}
                        </div>
                      );
                    })}
                  </>
                )}
                {missedCritical.length===0&&(
                  <div style={{color:C.green,fontSize:13,fontFamily:FONT}}>✓ Все ключевые исследования назначены</div>
                )}
              </div>
            </div>
          </div>

          {/* Treatment analysis */}
          <div style={{background:C.panel,border:`1px solid ${C.border}`,borderRadius:14,padding:16,marginBottom:10}}>
            <STitle icon="💊" label="Анализ лечения" color={C.green}/>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              <div>
                <div style={{fontSize:12,color:C.textDim,marginBottom:6,textTransform:"uppercase",fontFamily:FONT}}>Обязательные препараты</div>
                {cd.needTreat.map(id=>{
                  const given=selTreat.includes(id);
                  const name=TREATMENTS.find(t=>t.id===id)?.name||id;
                  const fx=TREAT_FX[id];
                  return(
                    <div key={id} style={{fontSize:13,color:given?C.green:C.red,marginBottom:4,lineHeight:1.4,fontFamily:FONT}}>
                      {given?"✓":"✗"} {name}
                      {given&&fx&&<span style={{fontSize:11,color:C.green,marginLeft:4,fontFamily:FONT}}>→ {fx.desc}</span>}
                    </div>
                  );
                })}
                {missedTreat.length===0&&(
                  <div style={{color:C.green,fontSize:12,marginTop:4,fontFamily:FONT}}>✓ Все необходимые препараты назначены</div>
                )}
              </div>
              <div>
                {wrongGiven.length>0&&(
                  <>
                    <div style={{fontSize:12,color:C.red,marginBottom:6,textTransform:"uppercase",fontFamily:FONT}}>
                      🚨 Опасные назначения (−15 каждый)
                    </div>
                    {wrongGiven.map(id=>{
                      const name=TREATMENTS.find(t=>t.id===id)?.name||id;
                      const reason=ADVERSE_REASONS[id];
                      return(
                        <div key={id} style={{background:`${C.redDim}77`,border:`1px solid ${C.red}55`,
                          borderRadius:6,padding:"8px 10px",marginBottom:8}}>
                          <div style={{fontSize:13,color:C.red,fontWeight:700,marginBottom:4,fontFamily:FONT}}>🚨 {name}</div>
                          {reason&&<div style={{fontSize:12,color:C.text,lineHeight:1.6,fontFamily:FONT}}>{reason}</div>}
                          {!reason&&<div style={{fontSize:12,color:C.text,fontFamily:FONT}}>Противопоказан при данной патологии</div>}
                        </div>
                      );
                    })}
                  </>
                )}
                {wrongGiven.length===0&&(
                  <div style={{color:C.green,fontSize:13,fontFamily:FONT}}>✓ Опасных назначений нет</div>
                )}
              </div>
            </div>
          </div>

          {/* Clinical tip */}
          <div style={{background:C.panel,border:`1px solid ${C.accentDim}`,borderRadius:14,padding:18,marginBottom:10}}>
            <STitle icon="💡" label="Клинический разбор" color={C.accent}/>
            <p style={{color:C.text,fontSize:13,lineHeight:1.9,margin:0}}>{cd.tip}</p>
          </div>

          {/* Event log */}
          {eventLog.length>1&&(
            <div style={{background:C.panel,border:`1px solid ${C.border}`,borderRadius:14,padding:14,marginBottom:18}}>
              <STitle icon="📋" label="Хронология событий" color={C.textDim}/>
              <div style={{maxHeight:160,overflowY:"auto"}}>
                {[...eventLog].reverse().map(e=>{
                  const col=e.type==="critical"?C.red:e.type==="warning"?C.yellow:
                    e.type==="treatment"?C.green:e.type==="result"?C.accent:C.textDim;
                  return(
                    <div key={e.id} style={{display:"flex",gap:10,marginBottom:3}}>
                      <span style={{fontSize:12,color:C.textDim,fontFamily:CODE,flexShrink:0,minWidth:36}}>{e.elapsed}</span>
                      <span style={{fontSize:12,color:col,fontFamily:FONT,lineHeight:1.4}}>{e.text}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div style={{display:"flex",gap:10}}>
            <button onClick={startGame} style={{flex:1,background:`linear-gradient(135deg,${C.accent},${C.green})`,
              border:"none",borderRadius:12,padding:"14px",fontSize:15,fontWeight:700,
              color:C.bg,cursor:"pointer",fontFamily:FONT,letterSpacing:0.5}}>
              ▶ СЛЕДУЮЩИЙ КЕЙС
            </button>
            <Btn onClick={()=>setPhase("menu")} color={C.textDim} style={{padding:"11px 20px",fontSize:13}}>🏠 Меню</Btn>
          </div>
        </div>
      </div>
    );
  }

  if(!cd||!ps)return null;
  const sev=cd.severity;
  const sevColor={critical:C.red,moderate:C.yellow,mild:C.green}[sev]||C.yellow;
  const sevLabel={critical:"🚨 КРИТИЧЕСКИЙ",moderate:"⚠ СРЕДНИЙ",mild:"✅ ЛЁГКИЙ"}[sev];

  // Reusable treatment list (rendered inline per phase)
  const renderTreatList=()=>filtTreat.map(item=>{
    const selected=selTreat.includes(item.id);
    const isPending=pendingFx.has(item.id);
    const isApplied=appliedFx.has(item.id);
    const isDanger=cd.wrongTreat.includes(item.id);
    const color=isDanger&&selected?C.red:(CAT_COLOR[item.cat]||C.green);
    return(
      <div key={item.id} onClick={()=>toggleTreatment(item.id)} style={{
        display:"flex",alignItems:"center",gap:8,
        background:selected?(isDanger?`${C.red}18`:`${color}18`):"transparent",
        border:`1px solid ${selected?color:C.border}`,
        borderRadius:8,padding:"9px 12px",cursor:"pointer",marginBottom:4,
      }}>
        <div style={{width:16,height:16,borderRadius:4,border:`2px solid ${selected?color:C.textDim}`,
          background:selected?color:"transparent",display:"flex",alignItems:"center",
          justifyContent:"center",flexShrink:0}}>
          {selected&&<span style={{fontSize:10,color:"#000",fontWeight:900}}>✓</span>}
        </div>
        <span style={{color:selected?C.white:isDanger?`${C.red}cc`:C.text,fontSize:13,fontFamily:FONT,flex:1,lineHeight:1.4}}>
          {item.name}
        </span>
        {isPending&&<div style={{width:8,height:8,border:`2px solid ${C.yellow}`,borderTopColor:"transparent",
          borderRadius:"50%",animation:"spin 0.8s linear infinite",flexShrink:0}}/>}
        {isApplied&&!isDanger&&<span style={{fontSize:12,color:C.green,flexShrink:0}}>✓</span>}
        {isApplied&&isDanger&&<span style={{fontSize:12,color:C.red,flexShrink:0}}>🚨</span>}
        {!selected&&isDanger&&<span style={{fontSize:12,color:`${C.red}88`,flexShrink:0}}>⚠</span>}
      </div>
    );
  });

  const renderTreatCatFilter=()=>(
    <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:10}}>
      {treatCats.map(cat=>(
        <button key={cat} onClick={()=>setTreatCat(cat)} style={{
          background:treatCat===cat?`${C.green}1a`:"transparent",
          border:`1px solid ${treatCat===cat?C.green:C.border}`,
          borderRadius:10,padding:"3px 10px",cursor:"pointer",fontFamily:FONT,
          fontSize:12,color:treatCat===cat?C.green:C.textDim}}>
          {cat==="all"?"Все":cat}
        </button>
      ))}
    </div>
  );

  // ── GAME LAYOUT ────────────────────────────────────────────────────
  return(
    <div style={{height:"100vh",
      background:`linear-gradient(160deg,#070d18 0%,#0a1628 50%,#070f1a 100%)`,
      fontFamily:FONT,display:"flex",overflow:"hidden",position:"relative"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes fadeIn{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.6}}
        ::-webkit-scrollbar{width:4px;height:4px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:rgba(0,230,200,0.15);border-radius:2px}
      `}</style>

      {/* Ambient glow */}
      <div style={{position:"absolute",inset:0,pointerEvents:"none",zIndex:0}}>
        <div style={{position:"absolute",left:"-5%",top:"-10%",width:500,height:500,
          background:"radial-gradient(circle,rgba(0,230,200,0.05) 0%,transparent 65%)",borderRadius:"50%"}}/>
        <div style={{position:"absolute",right:"-5%",bottom:"-10%",width:400,height:400,
          background:"radial-gradient(circle,rgba(0,100,200,0.06) 0%,transparent 65%)",borderRadius:"50%"}}/>
      </div>

      {/* ── LEFT SIDEBAR ── */}
      <aside style={{
        width:224,flexShrink:0,zIndex:10,
        background:"rgba(10,18,36,0.88)",
        backdropFilter:"blur(24px)",WebkitBackdropFilter:"blur(24px)",
        borderRight:"1px solid rgba(0,230,200,0.08)",
        display:"flex",flexDirection:"column",padding:"16px 12px",
        overflowY:"auto",overflowX:"hidden"
      }}>
        {/* Logo + back */}
        <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:18}}>
          <div onClick={()=>setPhase("menu")} style={{width:34,height:34,borderRadius:10,flexShrink:0,
            background:"linear-gradient(135deg,rgba(0,230,200,0.2),rgba(0,150,200,0.1))",
            border:"1px solid rgba(0,230,200,0.3)",
            display:"flex",alignItems:"center",justifyContent:"center",
            cursor:"pointer",transition:"all 0.2s cubic-bezier(0.16,1,0.3,1)"}}>
            <span style={{fontFamily:SER,fontSize:17,color:C.accent,fontStyle:"italic",fontWeight:700}}>М</span>
          </div>
          <span style={{fontSize:15,fontWeight:700,color:C.white,fontFamily:FONT,letterSpacing:-0.3,flex:1,lineHeight:1}}>МедСим</span>
          <button onClick={()=>setPhase("menu")} style={{
            background:"rgba(255,255,255,0.04)",border:"1px solid rgba(0,230,200,0.15)",
            borderRadius:7,padding:"5px 10px",cursor:"pointer",color:C.textDim,
            fontSize:11,fontFamily:FONT,flexShrink:0,transition:"all 0.15s"
          }}>← Меню</button>
        </div>

        {/* Patient card */}
        <div style={{background:"rgba(255,255,255,0.03)",border:`1px solid ${sevColor}25`,
          borderRadius:13,padding:"11px 12px",marginBottom:11}}>
          <div style={{fontSize:9,color:C.textDim,letterSpacing:1.5,marginBottom:6,
            fontFamily:FONT,fontWeight:600,textTransform:"uppercase"}}>Пациент</div>
          <div style={{fontSize:14,fontWeight:700,color:C.white,fontFamily:FONT,lineHeight:1.2,marginBottom:3}}>{cd.name}</div>
          <div style={{fontSize:11,color:C.textDim,fontFamily:FONT,marginBottom:7}}>{cd.age} л · {cd.gender}</div>
          <span style={{background:`${sevColor}20`,border:`1px solid ${sevColor}44`,borderRadius:6,
            padding:"2px 9px",fontSize:10,color:sevColor,fontWeight:700,fontFamily:FONT}}>{sevLabel}</span>
          <div style={{fontSize:12,color:C.text,fontFamily:FONT,marginTop:8,lineHeight:1.5,opacity:0.85,
            display:"-webkit-box",WebkitLineClamp:3,WebkitBoxOrient:"vertical",overflow:"hidden"}}>
            {cd.complaint}
          </div>
        </div>

        {/* Vitals grid */}
        <div style={{marginBottom:11}}>
          <div style={{fontSize:9,color:C.textDim,letterSpacing:1.5,marginBottom:6,
            fontFamily:FONT,fontWeight:600,textTransform:"uppercase"}}>Показатели</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:5}}>
            {[
              {label:"АД",value:`${Math.round(ps.sbp)}/${Math.round(ps.dbp)}`,warn:ps.sbp<90||ps.sbp>160,tr:trend("sbp")},
              {label:"ЧСС",value:`${Math.round(ps.hr)}`,warn:ps.hr>100||ps.hr<50,tr:trend("hr")},
              {label:"SpO₂",value:`${r1(ps.spo2)}%`,warn:ps.spo2<94,tr:trend("spo2")},
              {label:"ЧД",value:`${Math.round(ps.rr)}`,warn:ps.rr>20||ps.rr<10,tr:trend("rr")},
              {label:"t°C",value:`${r1(ps.temp)}`,warn:ps.temp>38||ps.temp<36,tr:trend("temp")},
              {label:"ГКС",value:`${Math.round(ps.gcs)}`,warn:ps.gcs<10,tr:trend("gcs")},
            ].map(({label,value,warn,tr})=>(
              <div key={label} style={{
                background:warn?`${C.red}12`:`${C.accent}0a`,
                border:`1px solid ${warn?C.red+"44":C.borderBright}`,
                borderRadius:8,padding:"5px 8px"
              }}>
                <div style={{fontSize:9,color:C.textDim,fontFamily:FONT,marginBottom:1}}>{label}</div>
                <div style={{display:"flex",alignItems:"center",gap:3}}>
                  <span style={{fontSize:13,fontWeight:700,color:warn?C.red:C.accent,fontFamily:CODE,lineHeight:1}}>{value}</span>
                  {tr!==0&&<span style={{fontSize:8,color:warn?C.red:C.yellow}}>{tr>0?"▲":"▼"}</span>}
                </div>
              </div>
            ))}
          </div>
          {/* Pain bar */}
          <div style={{marginTop:5,background:`${C.accent}0a`,border:`1px solid ${C.borderBright}`,
            borderRadius:8,padding:"5px 9px"}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:3}}>
              <span style={{fontSize:9,color:C.textDim,fontFamily:FONT,textTransform:"uppercase",letterSpacing:0.8}}>Боль</span>
              <span style={{fontSize:11,fontWeight:700,fontFamily:CODE,
                color:ps.pain>7?C.red:ps.pain>4?C.yellow:C.green}}>{r1(ps.pain)}/10</span>
            </div>
            <div style={{display:"flex",gap:2}}>
              {[1,2,3,4,5,6,7,8,9,10].map(n=>(
                <div key={n} style={{flex:1,height:3,borderRadius:2,
                  background:n<=ps.pain?(ps.pain>7?C.red:ps.pain>4?C.yellow:C.green):"rgba(255,255,255,0.07)"}}/>
              ))}
            </div>
          </div>
          {ps.status==="critical"&&(
            <div style={{marginTop:5,background:`${C.red}18`,border:`1px solid ${C.red}55`,borderRadius:8,
              padding:"5px 10px",fontSize:11,color:C.red,fontWeight:700,
              animation:"pulse 1s infinite",fontFamily:FONT,textAlign:"center"}}>⚠ КРИТИЧНО</div>
          )}
          {ps.status==="dead"&&(
            <div style={{marginTop:5,background:`${C.red}18`,border:`1px solid ${C.red}55`,borderRadius:8,
              padding:"5px 10px",fontSize:11,color:C.red,fontWeight:700,fontFamily:FONT,textAlign:"center"}}>
              💀 ЛЕТАЛЬНЫЙ ИСХОД</div>
          )}
          {ps.status==="stable"&&(
            <div style={{marginTop:5,background:`${C.green}18`,border:`1px solid ${C.green}55`,borderRadius:8,
              padding:"5px 10px",fontSize:11,color:C.green,fontWeight:700,fontFamily:FONT,textAlign:"center"}}>
              ✓ СТАБИЛИЗИРОВАН</div>
          )}
        </div>

        {/* Timer */}
        <div style={{display:"flex",justifyContent:"center",marginBottom:11}}>
          <TimerCircle left={timeLeft} total={totalTime}/>
        </div>

        {/* Steps */}
        <div style={{display:"flex",flexDirection:"column",gap:4,marginBottom:11}}>
          {steps.map((s,i)=>{
            const isActive=s.key===phase;
            const isDone=i<activeStep;
            return(
              <div key={s.key} style={{display:"flex",alignItems:"center",gap:8,padding:"7px 10px",
                borderRadius:9,
                background:isActive?"rgba(0,230,200,0.1)":isDone?"rgba(0,229,160,0.06)":"rgba(255,255,255,0.02)",
                border:`1px solid ${isActive?"rgba(0,230,200,0.22)":isDone?"rgba(0,229,160,0.18)":"rgba(255,255,255,0.04)"}`
              }}>
                <span style={{fontSize:12}}>{s.icon}</span>
                <span style={{fontSize:11,fontFamily:FONT,flex:1,
                  color:isActive?C.accent:isDone?C.green:C.textDim,fontWeight:isActive?700:400}}>{s.label}</span>
                {isDone&&<span style={{fontSize:10,color:C.green}}>✓</span>}
                {isActive&&<div style={{width:5,height:5,borderRadius:"50%",background:C.accent,
                  boxShadow:`0 0 6px ${C.accent}`}}/>}
              </div>
            );
          })}
        </div>

        <div style={{flex:1}}/>
        <div style={{height:1,background:"rgba(0,230,200,0.06)",margin:"6px 0"}}/>

        {/* Mini event log */}
        <div>
          <div style={{fontSize:9,color:C.textDim,letterSpacing:1.5,marginBottom:5,
            fontFamily:FONT,fontWeight:600,textTransform:"uppercase"}}>События</div>
          {eventLog.length===0&&<div style={{fontSize:10,color:C.textDim,fontFamily:FONT}}>Нет событий...</div>}
          {eventLog.slice(0,6).map(e=>{
            const col=e.type==="critical"?C.red:e.type==="warning"?C.yellow:
              e.type==="treatment"?C.green:e.type==="result"?C.accent:C.textDim;
            return(
              <div key={e.id} style={{display:"flex",gap:6,marginBottom:3}}>
                <span style={{fontSize:9,color:C.textDim,fontFamily:CODE,flexShrink:0,minWidth:28}}>{e.elapsed}</span>
                <span style={{fontSize:10,color:col,fontFamily:FONT,lineHeight:1.4,
                  overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{e.text}</span>
              </div>
            );
          })}
        </div>
      </aside>

      {/* ── MAIN AREA ── */}
      <div style={{flex:1,display:"flex",flexDirection:"column",minWidth:0,zIndex:1}}>

        {/* Phase top bar */}
        <header style={{
          height:46,flexShrink:0,padding:"0 20px",
          display:"flex",alignItems:"center",gap:10,
          background:"rgba(7,13,24,0.65)",
          backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)",
          borderBottom:"1px solid rgba(0,230,200,0.06)"
        }}>
          <span style={{fontSize:11,color:C.textDim,fontFamily:FONT}}>МедСим</span>
          <span style={{color:"rgba(255,255,255,0.2)",fontSize:11}}>›</span>
          <span style={{fontSize:12,color:C.accent,fontFamily:FONT,fontWeight:600}}>
            {steps.find(s=>s.key===phase)?.icon} {steps.find(s=>s.key===phase)?.label}
          </span>
          <div style={{flex:1}}/>
          {phase==="awaiting_results"&&allResultsReady&&(
            <Btn onClick={()=>setPhase("diagnose")} color={C.green} style={{padding:"6px 16px",fontSize:12}}>
              📝 К диагнозу →
            </Btn>
          )}
        </header>

        {/* Phase content */}
        <div style={{flex:1,display:"flex",overflow:"hidden",minHeight:0}}>

          {/* ━━━ PHASE: order_tests ━━━ */}
          {phase==="order_tests"&&(
            <>
              {/* CENTER — anamnesis/exam + tests */}
              <div style={{flex:1,overflowY:"auto",padding:"14px 16px",minWidth:0}}>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
                  {[
                    {icon:"📋",label:"Анамнез",text:cd.anamnesis},
                    {icon:"🔍",label:"Осмотр",text:cd.exam},
                  ].map(({icon,label,text})=>(
                    <div key={label} style={{background:"rgba(13,26,46,0.7)",
                      backdropFilter:"blur(14px)",WebkitBackdropFilter:"blur(14px)",
                      border:"1px solid rgba(0,230,200,0.08)",borderRadius:14,padding:"12px 14px"}}>
                      <div style={{fontSize:10,color:C.textDim,textTransform:"uppercase",letterSpacing:1.2,
                        marginBottom:7,fontFamily:FONT,fontWeight:600}}>{icon} {label}</div>
                      <p style={{color:C.text,fontSize:12,lineHeight:1.7,margin:0,fontFamily:FONT}}>{text}</p>
                    </div>
                  ))}
                </div>
                <div style={{background:"rgba(0,58,56,0.45)",border:"1px solid rgba(0,230,200,0.18)",
                  borderRadius:10,padding:"9px 14px",marginBottom:14,fontSize:12,
                  color:C.accent,lineHeight:1.6,fontFamily:FONT}}>
                  ⚡ Выберите необходимые исследования и отправьте в лабораторию. Экстренное лечение — справа.
                </div>
                <STitle icon="🔬" label="Исследования" color={C.accent}/>
                <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:10}}>
                  {diagCats.map(cat=>(
                    <button key={cat} onClick={()=>setDiagCat(cat)} style={{
                      background:diagCat===cat?`${C.accent}1a`:"rgba(255,255,255,0.03)",
                      border:`1px solid ${diagCat===cat?C.accent:"rgba(0,230,200,0.1)"}`,
                      borderRadius:12,padding:"3px 11px",cursor:"pointer",fontFamily:FONT,
                      fontSize:12,color:diagCat===cat?C.accent:C.textDim}}>
                      {cat==="all"?"Все":cat}
                    </button>
                  ))}
                </div>
                <div>
                  {filtDiag.map(item=>(
                    <CheckRow key={item.id} item={item} selected={selDiag.includes(item.id)}
                      onToggle={id=>toggle(setSelDiag,id)} color={CAT_COLOR[item.cat]||C.accent}/>
                  ))}
                </div>
                <div style={{marginTop:14,paddingTop:12,borderTop:"1px solid rgba(0,230,200,0.06)",
                  display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                  <span style={{fontSize:13,color:C.textDim,fontFamily:FONT}}>
                    Выбрано: <span style={{color:C.accent,fontWeight:700}}>{selDiag.length}</span> исследований
                  </span>
                  <Btn onClick={handleOrderTests} disabled={selDiag.length===0||processingTests} color={C.accent}>
                    📤 В ЛАБОРАТОРИЮ
                  </Btn>
                </div>
              </div>

              {/* RIGHT — emergency treatment */}
              <div style={{width:260,flexShrink:0,borderLeft:"1px solid rgba(0,230,200,0.06)",
                overflowY:"auto",padding:"14px 12px",background:"rgba(7,13,24,0.35)"}}>
                <STitle icon="💊" label="Экстренное лечение" color={C.green}/>
                <div style={{background:"rgba(0,58,56,0.35)",border:"1px solid rgba(0,230,200,0.12)",
                  borderRadius:8,padding:"8px 10px",marginBottom:10,fontSize:12,
                  color:C.accent,lineHeight:1.6,fontFamily:FONT}}>
                  Можно начать немедленно
                </div>
                <div style={{background:"rgba(77,0,24,0.3)",border:"1px solid rgba(255,61,90,0.12)",
                  borderRadius:8,padding:"7px 10px",marginBottom:10,fontSize:12,color:C.red,fontFamily:FONT}}>
                  ⚠ Некоторые препараты опасны при данной патологии
                </div>
                {renderTreatCatFilter()}
                {renderTreatList()}
                {selTreat.length>0&&(
                  <div style={{marginTop:10,paddingTop:10,borderTop:"1px solid rgba(0,230,200,0.06)",
                    fontSize:12,color:C.textDim,fontFamily:FONT}}>
                    {appliedFx.size>0&&<div style={{color:C.green,marginBottom:2}}>✓ Применено: {appliedFx.size}</div>}
                    {pendingFx.size>0&&<div style={{color:C.yellow}}>⏳ В действии: {pendingFx.size}</div>}
                  </div>
                )}
              </div>
            </>
          )}

          {/* ━━━ PHASE: awaiting_results ━━━ */}
          {phase==="awaiting_results"&&(
            <>
              <div style={{flex:1,overflowY:"auto",padding:"14px 16px",minWidth:0}}>
                {!allResultsReady&&(
                  <div style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",
                    background:"rgba(61,48,0,0.4)",border:"1px solid rgba(245,200,66,0.22)",
                    borderRadius:10,marginBottom:14,fontSize:13,color:C.yellow,fontFamily:FONT}}>
                    <div style={{width:12,height:12,border:`2px solid ${C.yellow}`,borderTopColor:"transparent",
                      borderRadius:"50%",animation:"spin 0.8s linear infinite",flexShrink:0}}/>
                    Ожидание результатов... {Object.keys(revealedResults).length} из {orderedDiag.length}
                  </div>
                )}
                {allResultsReady&&(
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",
                    padding:"10px 14px",background:"rgba(0,61,40,0.4)",border:"1px solid rgba(0,229,160,0.22)",
                    borderRadius:10,marginBottom:14,fontSize:13,color:C.green,fontFamily:FONT}}>
                    <span>✓ Все результаты получены</span>
                    <Btn onClick={()=>setPhase("diagnose")} color={C.green} style={{padding:"7px 16px",fontSize:13}}>
                      📝 ПОСТАВИТЬ ДИАГНОЗ →
                    </Btn>
                  </div>
                )}
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,alignItems:"start"}}>
                  {orderedDiag.map(id=>{
                    const text=revealedResults[id];
                    if(!text)return(
                      <div key={id} style={{display:"flex",alignItems:"center",gap:10,padding:"12px 14px",
                        background:"rgba(13,26,46,0.6)",border:"1px solid rgba(0,230,200,0.06)",
                        borderRadius:12,opacity:0.6}}>
                        <div style={{width:9,height:9,border:`2px solid ${C.textDim}`,borderTopColor:"transparent",
                          borderRadius:"50%",animation:"spin 0.8s linear infinite",flexShrink:0}}/>
                        <span style={{fontSize:13,color:C.textDim,fontFamily:FONT}}>{DIAGNOSTICS.find(d=>d.id===id)?.name||id}...</span>
                      </div>
                    );
                    return <ResultCard key={id} id={id} text={text} isNew={newResultIds.includes(id)}/>;
                  })}
                </div>
              </div>

              <div style={{width:260,flexShrink:0,borderLeft:"1px solid rgba(0,230,200,0.06)",
                overflowY:"auto",padding:"14px 12px",background:"rgba(7,13,24,0.35)"}}>
                <STitle icon="💊" label="Лечение" color={C.green}/>
                <div style={{background:"rgba(77,0,24,0.3)",border:"1px solid rgba(255,61,90,0.12)",
                  borderRadius:8,padding:"7px 10px",marginBottom:10,fontSize:12,color:C.red,fontFamily:FONT}}>
                  ⚠ Некоторые препараты опасны при данной патологии
                </div>
                {renderTreatCatFilter()}
                {renderTreatList()}
                {selTreat.length>0&&(
                  <div style={{marginTop:10,paddingTop:10,borderTop:"1px solid rgba(0,230,200,0.06)",
                    fontSize:12,color:C.textDim,fontFamily:FONT}}>
                    {appliedFx.size>0&&<div style={{color:C.green,marginBottom:2}}>✓ Применено: {appliedFx.size}</div>}
                    {pendingFx.size>0&&<div style={{color:C.yellow}}>⏳ В действии: {pendingFx.size}</div>}
                  </div>
                )}
              </div>
            </>
          )}

          {/* ━━━ PHASE: diagnose ━━━ */}
          {phase==="diagnose"&&(
            <>
              <div style={{flex:"0 0 50%",overflowY:"auto",padding:"14px 16px",
                borderRight:"1px solid rgba(0,230,200,0.06)"}}>
                <STitle icon="📋" label="Результаты исследований" color={C.accent}/>
                {orderedDiag.map(id=>(
                  <ResultCard key={id} id={id} text={revealedResults[id]||""}/>
                ))}
              </div>

              <div style={{flex:1,overflowY:"auto",padding:"14px 16px",minWidth:0}}>
                <div style={{background:"rgba(13,26,46,0.7)",
                  backdropFilter:"blur(14px)",WebkitBackdropFilter:"blur(14px)",
                  border:"1px solid rgba(157,111,245,0.2)",
                  borderRadius:14,padding:"14px 16px",marginBottom:12}}>
                  <STitle icon="🎯" label="Клинический диагноз" color={C.purple}/>
                  <textarea value={diagText} onChange={e=>setDiagText(e.target.value)}
                    placeholder="Сформулируйте диагноз. Напр.: Острый инфаркт миокарда с подъёмом ST нижней стенки. Кардиогенный шок."
                    style={{width:"100%",minHeight:100,
                      background:"rgba(7,13,24,0.6)",
                      border:`1px solid ${diagText?"rgba(157,111,245,0.4)":"rgba(0,230,200,0.1)"}`,
                      borderRadius:10,padding:"12px 14px",color:C.white,fontSize:13,fontFamily:FONT,
                      resize:"vertical",outline:"none",boxSizing:"border-box",lineHeight:1.8}}/>
                </div>

                <div style={{background:"rgba(13,26,46,0.7)",
                  backdropFilter:"blur(14px)",WebkitBackdropFilter:"blur(14px)",
                  border:"1px solid rgba(0,230,200,0.08)",
                  borderRadius:14,padding:"14px 16px",marginBottom:12}}>
                  <STitle icon="💊" label="Назначения" color={C.green}/>
                  <div style={{background:"rgba(77,0,24,0.3)",border:"1px solid rgba(255,61,90,0.12)",
                    borderRadius:8,padding:"7px 10px",marginBottom:10,fontSize:12,color:C.red,fontFamily:FONT}}>
                    ⚠ Некоторые препараты противопоказаны при данной патологии
                  </div>
                  {renderTreatCatFilter()}
                  {renderTreatList()}
                  {selTreat.length>0&&(
                    <div style={{marginTop:10,paddingTop:10,borderTop:"1px solid rgba(0,230,200,0.06)",
                      fontSize:12,color:C.textDim,fontFamily:FONT}}>
                      {appliedFx.size>0&&<div style={{color:C.green,marginBottom:2}}>✓ Применено: {appliedFx.size}</div>}
                      {pendingFx.size>0&&<div style={{color:C.yellow}}>⏳ В действии: {pendingFx.size}</div>}
                    </div>
                  )}
                </div>

                <div style={{background:"rgba(13,26,46,0.7)",
                  backdropFilter:"blur(14px)",WebkitBackdropFilter:"blur(14px)",
                  border:"1px solid rgba(0,230,200,0.08)",
                  borderRadius:14,padding:"12px 16px",
                  display:"flex",alignItems:"center",justifyContent:"space-between",gap:12}}>
                  <span style={{fontSize:13,color:C.textDim,fontFamily:FONT}}>
                    {selTreat.length>0
                      ?<span style={{color:C.green}}>💊 Назначено: {selTreat.length} препаратов</span>
                      :<span style={{color:C.yellow}}>⬆ Выберите лечение выше</span>}
                    {pendingFx.size>0&&<span style={{color:C.yellow,marginLeft:8}}>⏳ {pendingFx.size} в действии</span>}
                  </span>
                  <Btn onClick={()=>handleSubmit(false)} disabled={selTreat.length===0} color={C.green}
                    style={{padding:"11px 28px",fontSize:14,flexShrink:0}}>
                    ✓ ЗАВЕРШИТЬ СЛУЧАЙ
                  </Btn>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
