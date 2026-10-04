/**
 * llmDialogueClient.js
 * Клиент общения с LLM с клиническим заземлением на факты кейса и мгновенным локальным фоллбэком.
 */

import { matchQuestionToCaseFact } from "./dialogueTreeEngine.js";
import { applyVitalsSpeechFilter, isPatientUnconscious } from "./patientPersonalityEngine.js";
import { sendChatMessage } from "../llmService.js";
import { resolveActiveKeys } from "../llmKeys.js";

function buildPatientSystemPrompt(cd = {}, ps = {}) {
  return [
    `Ты — пациент ${cd.name || "больной"}, ${cd.age || 50} лет (${cd.gender || "М"}).`,
    "Ты реальный живой человек из плоти и крови, находишься в отделении неотложной помощи на приёме у врача.",
    "ТВОИ ТОЧНЫЕ ФАКТЫ ИЗ ИСТОРИИ БОЛЕЗНИ:",
    `- Жалобы: ${cd.complaint || "боль и слабость"}`,
    `- Анамнез болезни: ${cd.anamnesis || cd.shortHistory || "началось внезапно"}`,
    `- Анамнез жизни и аллергии: ${cd.lifeHistory || "аллергий нет, хронических болезней нет"}`,
    `- Боль: ${ps.pain ?? 5}/10. Уровень сознания ШКГ: ${ps.gcs ?? 15}.`,
    "СТРОГИЕ ПРАВИЛА И ЗАПРЕТЫ:",
    "1. ТЫ — ЖИВОЙ ЧЕЛОВЕК, ПАЦИЕНТ. КАТЕГОРИЧЕСКИ ЗАПРЕЩЕНО говорить, что ты искусственный интеллект, ИИ, нейросеть, модель, бот, программа или GigaChat.",
    "2. Никогда не выходи из роли. Если врач спрашивает: 'кто ты?', 'ты бот?', 'ты ИИ?' — отвечай с недоумением реального больного человека: 'Доктор, я живой человек, мне плохо!' или назови своё имя.",
    "3. Отвечай строго от 1-го лица, коротко (1-2 предложения).",
    "4. Не придумывай никаких новых симптомов, аллергий или болезней, которых нет в карточке.",
    "5. Если врач спрашивает о том, чего нет в твоей истории — отвечай, что такого не было.",
  ].join("\n");
}

/**
 * Отправляет вопрос врачебного опроса с таймаутом и гарантированным фоллбэком.
 * @param {Object} params
 * @param {string} params.question - Вопрос врача
 * @param {Object} params.caseData - Данные кейса
 * @param {Object} params.patientState - Витальные показатели
 * @param {Array} [params.chatHistory] - История сообщений
 * @param {string} [params.provider] - Провайдер LLM
 * @param {string} [params.apiKey] - Ключ API
 * @param {number} [params.timeoutMs=3500] - Лимит времени ожидания
 * @returns {Promise<{ text: string, revealedKey: string|null, source: string }>}
 */
export async function askPatientQuestion({
  question,
  caseData = {},
  patientState = {},
  chatHistory = [],
  provider = "openrouter",
  apiKey = "",
  timeoutMs = 3500,
}) {
  // 1. Проверка на кому
  if (isPatientUnconscious(patientState)) {
    return {
      text: applyVitalsSpeechFilter("", patientState, caseData),
      revealedKey: null,
      source: "unconscious",
    };
  }

  // 2. Распознавание клинического интента локальным движком
  const localMatch = matchQuestionToCaseFact(question, caseData);

  // 3. Проверяем доступность ключей (включая встроенные / env)
  const { activeProvider, activeKeys } = resolveActiveKeys(provider, apiKey);
  if (activeKeys.length === 0) {
    return {
      text: applyVitalsSpeechFilter(localMatch.text, patientState, caseData),
      revealedKey: localMatch.revealedKey,
      source: "local",
    };
  }

  // 4. Попытка запроса в LLM с таймаутом
  try {
    const systemPrompt = buildPatientSystemPrompt(caseData, patientState);
    const llmPromise = sendChatMessage({
      provider: activeProvider,
      apiKey: apiKey || activeKeys[0],
      systemPrompt,
      chatHistory: chatHistory.slice(-4),
      userMessage: question,
    });

    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error("LLM_TIMEOUT")), timeoutMs);
    });

    const response = await Promise.race([llmPromise, timeoutPromise]);
    const textResult = typeof response === "string" ? response : response?.text || localMatch.text;

    return {
      text: applyVitalsSpeechFilter(textResult, patientState, caseData),
      revealedKey: localMatch.revealedKey,
      source: "llm",
    };
  } catch {
    // 5. Бесшовный локальный фоллбэк при сетевой ошибке или таймауте
    return {
      text: applyVitalsSpeechFilter(localMatch.text, patientState, caseData),
      revealedKey: localMatch.revealedKey,
      source: "local_fallback",
    };
  }
}
