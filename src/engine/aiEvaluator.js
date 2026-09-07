/**
 * aiEvaluator.js
 * 
 * Модуль для асинхронной ИИ-оценки введенных студентом диагнозов
 * и формирования рекомендаций по лечению на основе клинреков.
 */

import { sendChatMessage } from "./llmService";

/**
 * Отправляет диагноз и действия студента на оценку ИИ.
 * 
 * @param {Object} cd - Данные клинического случая
 * @param {string} diagText - Диагноз, введенный студентом
 * @param {Array<string>} selDiag - Выбранные исследования
 * @param {Array<string>} selTreat - Выбранное лечение
 * @returns {Promise<Object>} Оценка и разбор от ИИ
 */
export async function evaluateDiagnosisWithAI(cd, diagText = "", selDiag = [], selTreat = []) {
  const cleanDiagText = (diagText || "").trim();
  
  const systemPrompt = `
Ты — независимый медицинский эксперт ОСКЭ в РФ. Оцени диагноз студента и качество ведения случая.

Клинический случай: "${cd.name || "Пациент"}", ${cd.age} л.
Эталонный правильный диагноз: "${cd.diagnosis}"
Диагноз студента: "${cleanDiagText || "(не введен)"}"

Действия студента:
- Назначенные исследования: [${selDiag.join(", ")}]
- Назначенные лекарства: [${selTreat.join(", ")}]

Клинические требования:
- Обязательные исследования: [${(cd.needDiag || []).join(", ")}]
- Обязательные лекарства: [${(cd.needTreat || []).join(", ")}]
- Противопоказанные/опасные лекарства: [${(cd.wrongTreat || []).join(", ")}]

Критерии начисления баллов за диагноз (максимум 35 баллов):
- Полное соответствие (совпадение ключевых нозологий, локализации, характера изменений): 30-35 баллов.
- Частичное соответствие (верно определена основная патология, но упущены важные детали): 15-29 баллов.
- Слабое соответствие (назван только симптом или неверный класс патологии): 5-14 баллов.
- Абсолютно неверно или пусто: 0 баллов.

Отвечай СТРОГО в формате JSON. Любые другие форматы, комментарии, вводный или пояснительный текст вокруг JSON категорически запрещены.
Формат ответа:
{
  "diagScore": 30, // целое число от 0 до 35
  "feedback": "...", // краткое пояснение на русском языке (1-2 предложения) о том, почему выставлен такой балл
  "errors": [] // массив строк (кратких замечаний) о замеченных неточностях или пропусках в действиях студента (если есть)
}
`.trim();

  try {
    const provider = localStorage.getItem("ms_llm_provider") || "openrouter";
    const apiKey = localStorage.getItem("ms_llm_key") || "";
    // Вызываем sendChatMessage с пустой историей чата
    const responseText = await sendChatMessage({
      provider,
      apiKey,
      systemPrompt,
      chatHistory: [],
      userMessage: "Оцени диагноз и действия студента.",
      model: provider === "openrouter" ? "google/gemma-4-26b-a4b-it:free" : undefined
    });

    // Находим JSON в ответе на случай, если модель добавила лишний текст
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("JSON not found in LLM response");
    }

    const data = JSON.parse(jsonMatch[0]);
    return {
      diagScore: typeof data.diagScore === "number" ? Math.max(0, Math.min(35, data.diagScore)) : 0,
      feedback: data.feedback || "ИИ проверил диагноз.",
      errors: Array.isArray(data.errors) ? data.errors : [],
      success: true
    };
  } catch (error) {
    console.warn("[AI Evaluator] Оценка ИИ недоступна (используется эвристическое правило):", error.message);
    return {
      diagScore: 0,
      feedback: "Не удалось получить оценку ИИ (таймаут или ошибка сети).",
      errors: [],
      success: false
    };
  }
}
