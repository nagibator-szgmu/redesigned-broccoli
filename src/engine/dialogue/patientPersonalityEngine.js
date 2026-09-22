/**
 * patientPersonalityEngine.js
 * Модификатор речи и манеры ответа пациента с учетом его текущих витальных функций:
 * уровня боли, сатурации/ЧДД и шкалы Глазго (ШКГ).
 */

/**
 * Проверяет, находится ли пациент в бессознательном состоянии (кома / сопор).
 * @param {Object} patientState - Текущее состояние витальных функций
 * @returns {boolean}
 */
export function isPatientUnconscious(patientState) {
  if (!patientState || typeof patientState.gcs !== "number") return false;
  return patientState.gcs <= 8;
}

/**
 * Преобразует базовый текст ответа в живую речь больного с учетом его тяжести.
 * @param {string} rawText - Базовый текст из карточки или LLM
 * @param {Object} patientState - Витальные показатели (gcs, pain, spo2, rr)
 * @returns {string} Модифицированный текст речи
 */
export function applyVitalsSpeechFilter(rawText = "", patientState = {}) {
  const gcs = Number.isFinite(patientState?.gcs) ? patientState.gcs : 15;
  const pain = Number.isFinite(patientState?.pain) ? patientState.pain : 5;
  const spo2 = Number.isFinite(patientState?.spo2) ? patientState.spo2 : 98;
  const rr = Number.isFinite(patientState?.rr) ? patientState.rr : 16;

  // 1. Кома (ШКГ <= 8) — речевой контакт невозможен
  if (gcs <= 8) {
    return "(Пациент без сознания, контакт невозможен. Слышно лишь тяжелое хриплое дыхание.)";
  }

  let text = String(rawText || "").trim();

  // 2. Спутанность сознания / оглушение (ШКГ 9–12)
  if (gcs <= 12) {
    text = `Э-э... доктор... где я?.. В глазах темно... ${text}`;
  }

  // 3. Выраженная дыхательная недостаточность (SpO2 < 90% или ЧДД >= 28)
  if (spo2 < 90 || rr >= 28) {
    const words = text.split(" ");
    if (words.length > 4) {
      // Разбиваем многоточиями, имитируя нехватку воздуха
      text = `...воздуха не хватает... ${words.slice(0, 4).join(" ")}... ${words.slice(4).join(" ")}`;
    } else {
      text = `...трудно... дышать... ${text}`;
    }
  }

  // 4. Сильный болевой синдром (Боль >= 7/10)
  if (pain >= 7 && !text.startsWith("Ох")) {
    const prefix = pain >= 9 ? "Ох-х-х, господи... как болит... " : "Ох... больно... ";
    text = `${prefix}${text}`;
  }

  // 5. Облегчение состояния (Боль <= 2 при высокой сатурации)
  if (pain <= 2 && spo2 >= 96 && !text.includes("легче")) {
    text = `${text} (Доктор, спасибо, боль сейчас почти отпустила...)`;
  }

  return text;
}
