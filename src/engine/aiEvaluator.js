/**
 * aiEvaluator.js
 * Гибридный модуль оценки клинического мышления:
 * запрос к LLM при наличии ключа или мгновенный экспертный анализ локальным движком.
 */

import { sendChatMessage } from "./llmService.js";
import { generateLocalClinicalFeedback } from "./debrief/localClinicalFeedback.js";

function buildEvaluatorPrompt(cd, diagText, selDiag, selTreat) {
  return `
Ты — независимый медицинский эксперт ОСКЭ в РФ. Оцени диагноз студента и качество ведения случая.

Клинический случай: "${cd.name || "Пациент"}", ${cd.age} л.
Эталонный правильный диагноз: "${cd.diagnosis}"
Диагноз студента: "${(diagText || "").trim() || "(не введен)"}"

Действия студента:
- Назначенные исследования: [${selDiag.join(", ")}]
- Назначенные лекарства: [${selTreat.join(", ")}]

Клинические требования:
- Обязательные исследования: [${(cd.needDiag || []).join(", ")}]
- Обязательные лекарства: [${(cd.needTreat || []).join(", ")}]
- Противопоказанные/опасные лекарства: [${(cd.wrongTreat || []).join(", ")}]

Критерии начисления баллов за диагноз (максимум 35 баллов):
- Полное соответствие: 30-35 баллов.
- Частичное соответствие: 15-29 баллов.
- Слабое соответствие: 5-14 баллов.
- Абсолютно неверно или пусто: 0 баллов.

Отвечай СТРОГО в формате JSON:
{
  "diagScore": 30,
  "feedback": "краткое экспертное пояснение на русском языке (1-2 предложения)",
  "errors": ["замечание 1", "замечание 2"]
}
`.trim();
}

/**
 * Оценивает диагноз и действия студента с помощью LLM или локального клинического эксперта.
 * @param {Object} cd - Клинический кейс
 * @param {string} diagText - Введенный студентом диагноз
 * @param {Array<string>} selDiag - Назначенные исследования
 * @param {Array<string>} selTreat - Назначенное лечение
 * @param {Object} [safety] - Данные evaluateClinicalSafety
 * @returns {Promise<Object>} Оценка и разбор от ИИ или локального эксперта
 */
export async function evaluateDiagnosisWithAI(cd = {}, diagText = "", selDiag = [], selTreat = [], safety = {}) {
  const localRes = generateLocalClinicalFeedback(cd, diagText, selDiag, selTreat, safety);

  const provider = typeof window !== "undefined"
    ? localStorage.getItem("ms_llmProvider") || localStorage.getItem("ms_llm_provider") || "openrouter"
    : "openrouter";
  const apiKey = typeof window !== "undefined"
    ? localStorage.getItem("ms_llmKey") || localStorage.getItem("ms_llm_key") || ""
    : "";

  // 1. Оффлайн-режим (нет ключа API) -> моментальный локальный экспертный разбор
  if (!apiKey || !apiKey.trim()) {
    return {
      ...localRes,
      success: true,
      source: "local",
    };
  }

  // 2. Онлайн-режим с обращением к LLM и таймаутом
  try {
    const systemPrompt = buildEvaluatorPrompt(cd, diagText, selDiag, selTreat);
    const llmPromise = sendChatMessage({
      provider,
      apiKey,
      systemPrompt,
      chatHistory: [],
      userMessage: "Оцени диагноз и действия студента.",
      model: provider === "openrouter" ? "google/gemma-4-26b-a4b-it:free" : undefined,
    });

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("LLM_TIMEOUT")), 3500)
    );

    const responseText = await Promise.race([llmPromise, timeoutPromise]);
    const jsonMatch = String(responseText || "").match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("JSON not found in LLM response");

    const data = JSON.parse(jsonMatch[0]);
    return {
      diagScore: typeof data.diagScore === "number" ? Math.max(0, Math.min(35, data.diagScore)) : localRes.diagScore,
      feedback: data.feedback || localRes.feedback,
      errors: Array.isArray(data.errors) && data.errors.length > 0 ? data.errors : localRes.errors,
      success: true,
      source: "llm",
    };
  } catch {
    // 3. Бесшовный фоллбэк на локальный экспертный анализ при ошибке сети/таймауте
    return {
      ...localRes,
      success: true,
      source: "local_fallback",
    };
  }
}
