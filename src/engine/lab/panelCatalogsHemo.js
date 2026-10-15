/**
 * Справочник параметров гематологических панелей:
 * TEG (Тромбоэластограмма), CBC (ОАК), COAG (Коагулограмма), ABG (Газы артериальной крови / КЩС).
 */

export const TEG_PARAMETERS = [
  { id: "teg_r", name: "R-время (реакция образования сгустка)", unit: "мин", refRange: "5.0–10.0", refMin: 5.0, refMax: 10.0, defaultVal: "6.2 мин", keys: ["r-время", "r время", "r:", "r-time"] },
  { id: "teg_k", name: "K-время (кинетика сгустка)", unit: "мин", refRange: "1.0–3.0", refMin: 1.0, refMax: 3.0, defaultVal: "1.8 мин", keys: ["k-время", "k время", "k:", "k-time"] },
  { id: "teg_alpha", name: "Угол альфа (Angle α, скорость роста)", unit: "град (°)", refRange: "53–72", refMin: 53, refMax: 72, defaultVal: "64°", keys: ["угол", "angle", "альфа", "α"] },
  { id: "teg_ma", name: "Максимальная амплитуда (MA, прочность)", unit: "мм", refRange: "50–70", refMin: 50, refMax: 70, defaultVal: "58 мм", keys: ["ma", "максимальная амплитуда", "амплитуда"] },
  { id: "teg_ly30", name: "Лизис сгустка через 30 мин (LY30)", unit: "%", refRange: "0.0–3.0", refMax: 3.0, defaultVal: "1.2%", keys: ["ly30", "ly 30", "лизис"] },
];

export const CBC_PARAMETERS = [
  { id: "cbc_wbc", name: "Лейкоциты (WBC)", unit: "×10⁹/л", refRange: "4.0–9.0", refMin: 4.0, refMax: 9.0, defaultVal: "6.8 ×10⁹/л", keys: ["лейк", "wbc"] },
  { id: "cbc_rbc", name: "Эритроциты (RBC)", unit: "×10¹²/л", refRange: "4.0–5.2", refMin: 4.0, refMax: 5.2, defaultVal: "4.6 ×10¹²/л", keys: ["эритр", "rbc"] },
  { id: "cbc_hb", name: "Гемоглобин (Hb)", unit: "г/л", refRange: "130–160", refMin: 120, refMax: 165, defaultVal: "142 г/л", keys: ["hb", "гемоглобин"] },
  { id: "cbc_hct", name: "Гематокрит (Ht)", unit: "%", refRange: "38–48", refMin: 38, refMax: 48, defaultVal: "42%", keys: ["гематокрит", "ht", "hct"] },
  { id: "cbc_plt", name: "Тромбоциты (PLT)", unit: "×10⁹/л", refRange: "180–320", refMin: 180, refMax: 320, defaultVal: "235 ×10⁹/л", keys: ["тромб", "plt", " тр "] },
  { id: "cbc_esr", name: "СОЭ (скорость оседания эритроцитов)", unit: "мм/ч", refRange: "2–15", refMin: 2, refMax: 15, defaultVal: "8 мм/ч", keys: ["соэ", "esr"] },
  { id: "cbc_neutro", name: "Нейтрофилы сегментоядерные", unit: "%", refRange: "47–72", refMin: 47, refMax: 72, defaultVal: "58%", keys: ["нейтрофил", "нейтрофилёз", "сегмент"] },
  { id: "cbc_band", name: "Палочкоядерные нейтрофилы", unit: "%", refRange: "1–5", refMin: 1, refMax: 5, defaultVal: "2%", keys: ["палочк", "сдвиг влево"] },
  { id: "cbc_lymph", name: "Лимфоциты", unit: "%", refRange: "19–37", refMin: 19, refMax: 37, defaultVal: "28%", keys: ["лимфоцит", "лимфопен", "cd4"] },
];

export const COAG_PARAMETERS = [
  { id: "coag_inr", name: "МНО (INR)", unit: "у.е.", refRange: "0.85–1.15", refMin: 0.85, refMax: 1.15, defaultVal: "1.02", keys: ["мно", "inr"] },
  { id: "coag_aptt", name: "АЧТВ / АПТВ (APTT)", unit: "сек", refRange: "26–36", refMin: 26, refMax: 36, defaultVal: "29 сек", keys: ["ачтв", "аптв", "aptt"] },
  { id: "coag_fib", name: "Фибриноген плазмы", unit: "г/л", refRange: "2.0–4.0", refMin: 2.0, refMax: 4.0, defaultVal: "3.1 г/л", keys: ["фибриноген"] },
  { id: "coag_pti", name: "Протромбиновый индекс (ПТИ)", unit: "%", refRange: "80–105", refMin: 80, refMax: 105, defaultVal: "96%", keys: ["пти", "протромбин"] },
  { id: "coag_tt", name: "Тромбиновое время (ТВ)", unit: "сек", refRange: "14–18", refMin: 14, refMax: 18, defaultVal: "15.8 сек", keys: ["тромбиновое", " тв "] },
];

export const ABG_PARAMETERS = [
  { id: "abg_ph", name: "Водородный показатель (pH)", unit: "ед.", refRange: "7.35–7.45", refMin: 7.35, refMax: 7.45, defaultVal: "7.40", keys: ["ph", "рн"] },
  { id: "abg_pao2", name: "Парциальное давление O₂ (PaO₂)", unit: "мм рт.ст.", refRange: "80–100", refMin: 80, refMax: 105, defaultVal: "94 мм рт.ст.", keys: ["pao2", "pao₂", "рао2", "рао₂"] },
  { id: "abg_paco2", name: "Парциальное давление CO₂ (PaCO₂)", unit: "мм рт.ст.", refRange: "35–45", refMin: 35, refMax: 45, defaultVal: "39 мм рт.ст.", keys: ["paco2", "paco₂", "расо2", "расо₂"] },
  { id: "abg_hco3", name: "Бикарбонат сыворотки (HCO₃⁻)", unit: "ммоль/л", refRange: "22.0–26.0", refMin: 22.0, refMax: 26.0, defaultVal: "24.2 ммоль/л", keys: ["hco3", "hco₃", "бикарбонат"] },
  { id: "abg_be", name: "Избыток / дефицит оснований (BE)", unit: "ммоль/л", refRange: "-2.0...+2.0", refMin: -2.0, refMax: 2.0, defaultVal: "0.2 ммоль/л", keys: ["be", "вe", "избыток оснований"] },
  { id: "abg_sao2", name: "Сатурация гемоглобина (SaO₂)", unit: "%", refRange: "95–99", refMin: 95, refMax: 100, defaultVal: "98%", keys: ["sao2", "sao₂", "spo2", "spo₂", "сатурация"] },
  { id: "abg_lactate", name: "Лактат артериальной крови", unit: "ммоль/л", refRange: "0.5–2.0", refMin: 0.5, refMax: 2.0, defaultVal: "1.1 ммоль/л", keys: ["лактат", "lactate"] },
];
