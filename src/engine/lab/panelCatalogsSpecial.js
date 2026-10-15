/**
 * Справочник параметров специализированных панелей анализов:
 * THYROID, LUMBAR, PARACENTESIS, TOX_SCREEN, TYPE_CROSS, PH_IMPEDANCE, PCR_STOOL, CULTURE.
 */

export const THYROID_PARAMETERS = [
  { id: "thy_tsh", name: "Тиреотропный гормон (ТТГ / TSH)", unit: "мкМЕ/мл", refRange: "0.4–4.0", refMin: 0.4, refMax: 4.0, defaultVal: "1.85 мкМЕ/мл", keys: ["ттг", "tsh"] },
  { id: "thy_ft4", name: "Свободный тироксин (Т4 свободный)", unit: "пмоль/л", refRange: "9.0–19.0", refMin: 9.0, refMax: 19.0, defaultVal: "14.2 пмоль/л", keys: ["т4", "ft4", "тироксин"] },
  { id: "thy_ft3", name: "Свободный трийодтиронин (Т3 свободный)", unit: "пмоль/л", refRange: "3.1–6.8", refMin: 3.1, refMax: 6.8, defaultVal: "4.6 пмоль/л", keys: ["т3", "ft3", "трийодтиронин"] },
  { id: "thy_anti_tshr", name: "Антитела к рецепторам ТТГ (АТ-рТТГ)", unit: "МЕ/л", refRange: "< 1.5", refMax: 1.5, defaultVal: "< 0.8 МЕ/л (отр)", keys: ["ат к рецепторам", "ат-рттг", "рттг"] },
];

export const LUMBAR_PARAMETERS = [
  { id: "csf_pressure", name: "Давление ликвора", unit: "мм вод.ст.", refRange: "100–180", refMin: 100, refMax: 180, defaultVal: "135 мм вод.ст.", keys: ["давление", "мм вод.ст"] },
  { id: "csf_appearance", name: "Цвет и прозрачность ликвора", unit: "", refRange: "Бесцветный, прозрачный", defaultVal: "Бесцветный, прозрачный", keys: ["прозрачн", "мутный", "ксантохром", "бесцветн", "опалесцир", "внешний вид", "цвет"] },
  { id: "csf_cytosis", name: "Цитоз (число клеток)", unit: "кл/мкл", refRange: "0–5", refMax: 5, defaultVal: "2 кл/мкл", keys: ["цитоз", "лейкоцит", "нейтрофил", "лимфоцит"] },
  { id: "csf_protein", name: "Белок ликвора", unit: "г/л", refRange: "0.15–0.45", refMin: 0.15, refMax: 0.45, defaultVal: "0.28 г/л", keys: ["белок", "protein"] },
  { id: "csf_glucose", name: "Глюкоза ликвора", unit: "ммоль/л", refRange: "2.2–3.9", refMin: 2.2, refMax: 3.9, defaultVal: "3.1 ммоль/л", keys: ["глюкоз"] },
  { id: "csf_pcr", name: "Микроскопия / ПЦР ликвора", unit: "", refRange: "Отрицательно (микрофлора не обнаружена)", defaultVal: "Отрицательно", keys: ["пцр", "впг", "gram", "диплококк", "стрептококк", "менингококк", "пневмококк", "anti-nmda"] },
];

export const PARACENTESIS_PARAMETERS = [
  { id: "asc_appearance", name: "Внешний вид и цвет", unit: "", refRange: "Прозрачная, соломенно-желтая", defaultVal: "Прозрачная, соломенно-желтая", keys: ["внешний вид", "цвет", "прозрачн"] },
  { id: "asc_neutro", name: "Абсолютное число нейтрофилов (АЧН)", unit: "кл/мкл", refRange: "< 250 (отсутствие СБП)", refMax: 250, defaultVal: "45 кл/мкл", keys: ["нейтрофил", "ачн"] },
  { id: "asc_protein", name: "Общий белок асцита", unit: "г/л", refRange: "< 25.0 (транссудат)", refMax: 25.0, defaultVal: "16.4 г/л", keys: ["белок"] },
  { id: "asc_wbc", name: "Цитоз (лейкоциты)", unit: "кл/мкл", refRange: "< 500", refMax: 500, defaultVal: "120 кл/мкл", keys: ["лейкоцит", "цитоз"] },
  { id: "asc_saag", name: "СААГ (градиент альбумина)", unit: "г/л", refRange: "≥ 11.0 (портальная гипертензия)", defaultVal: "14.2 г/л", keys: ["сааг", "градиент"] },
];

export const TOX_PARAMETERS = [
  { id: "tox_opi", name: "Опиаты (морфин, героин)", unit: "", refRange: "Отрицательно", defaultVal: "Отрицательно", keys: ["опиат", "морфин", "героин"] },
  { id: "tox_bzd", name: "Бензодиазепины", unit: "", refRange: "Отрицательно", defaultVal: "Отрицательно", keys: ["бензодиазепин"] },
  { id: "tox_barb", name: "Барбитураты", unit: "", refRange: "Отрицательно", defaultVal: "Отрицательно", keys: ["барбитурат"] },
  { id: "tox_amp", name: "Амфетамины / метамфетамин", unit: "", refRange: "Отрицательно", defaultVal: "Отрицательно", keys: ["амфетамин", "метамфетамин"] },
  { id: "tox_thc", name: "Каннабиноиды (ТГК)", unit: "", refRange: "Отрицательно", defaultVal: "Отрицательно", keys: ["каннабиноид", "тгк"] },
  { id: "tox_ethanol", name: "Этанол (алкоголь)", unit: "г/л (‰)", refRange: "0.0 (не обнаружен)", refMax: 0.1, defaultVal: "0.0 г/л (отр)", keys: ["этанол", "алкоголь"] },
  { id: "tox_volatile", name: "Летучие токсиканты (метанол, ФОС)", unit: "", refRange: "Отрицательно", defaultVal: "Отрицательно", keys: ["метанол", "фос", "органофосфат", "этиленгликоль"] },
];

export const TYPE_CROSS_PARAMETERS = [
  { id: "type_abo", name: "Группа крови по AB0", unit: "", refRange: "I (0) / II (A) / III (B) / IV (AB)", defaultVal: "II (A)", keys: ["группа", "a(ii)", "b(iii)", "ab(iv)", "o(i)", "0(i)"] },
  { id: "type_rh", name: "Резус-фактор (RhD)", unit: "", refRange: "Rh(+) положит. / Rh(-) отриц.", defaultVal: "Rh(+) положительный", keys: ["rh", "резус"] },
  { id: "type_ab", name: "Антиэритроцитарные антитела", unit: "", refRange: "Не обнаружены (отр)", defaultVal: "Не обнаружены", keys: ["антител", "кумбс"] },
  { id: "type_cross", name: "Проба на индивидуальную совместимость", unit: "", refRange: "Совместима", defaultVal: "Совместима", keys: ["совместим", "перекрёстная", "перекрест"] },
];

export const PH_IMPEDANCE_PARAMETERS = [
  { id: "phi_reflux", name: "Число рефлюксов за 24 ч", unit: "рефл/сут", refRange: "< 40", refMax: 40, defaultVal: "22 рефл/сут", keys: ["число рефлюксов", "рефлюкс"] },
  { id: "phi_aet", name: "Процент времени с pH < 4.0 (AET)", unit: "%", refRange: "< 4.0", refMax: 4.0, defaultVal: "1.6%", keys: ["время закисления", "aet", "ph < 4"] },
  { id: "phi_demeester", name: "Индекс ДеМеестера (DeMeester score)", unit: "баллов", refRange: "< 14.72", refMax: 14.72, defaultVal: "7.8 баллов", keys: ["demeester", "демеестер", "индекс"] },
  { id: "phi_acid", name: "Кислые рефлюксы", unit: "рефл/сут", refRange: "< 30", refMax: 30, defaultVal: "12 рефл/сут", keys: ["кислых"] },
];

export const PCR_STOOL_PARAMETERS = [
  { id: "pcr_cdiff", name: "Токсины A/B C. difficile", unit: "", refRange: "Не обнаружены (отр)", defaultVal: "Не обнаружены", keys: ["c. diff", "difficile", "токсин"] },
  { id: "pcr_bact", name: "ДНК Salmonella / Shigella / Campylobacter", unit: "", refRange: "Не обнаружена (отр)", defaultVal: "Не обнаружена", keys: ["salmonella", "shigella", "сальмонелл", "шигелл", "оки"] },
  { id: "pcr_viral", name: "РНК кишечных вирусов", unit: "", refRange: "Не обнаружена (отр)", defaultVal: "Не обнаружена", keys: ["ротавирус", "норовирус", "вирус"] },
];

export const CULTURE_PARAMETERS = [
  { id: "cult_growth", name: "Рост микрофлоры (аэробный / анаэробный)", unit: "", refRange: "Роста нет (стерильно)", defaultVal: "Роста нет (стерильно)", keys: ["посев", "рост", "культура"] },
  { id: "cult_id", name: "Идентификация микроорганизма", unit: "", refRange: "Патогены не выявлены", defaultVal: "Не выявлено", keys: ["streptococcus", "staphylococcus", "e.coli", "klebsiella", "neisseria", "bacteroides", "стафилококк", "палочки"] },
  { id: "cult_ab", name: "Чувствительность к антибиотикам", unit: "", refRange: "Не требуется при отсутствии роста", defaultVal: "Не требуется (культура стерильна)", keys: ["чувствительн", "устойчив", "ванкомицин", "меропенем", "ципрофлоксацин"] },
];
