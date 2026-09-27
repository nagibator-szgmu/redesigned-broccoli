/**
 * LLM Integration Service for MedSim with Fallback Key Pool
 */
import { callOpenRouter, callGemini, callOpenAI } from './llmAdapters.js';
import { generateSystemPrompt, generateActionReactionPrompt } from './llmPrompts.js';
import { getLocalPatientResponse } from './localPatientResponse.js';
import { resolveActiveKeys } from './llmKeys.js';

export { generateSystemPrompt, getLocalPatientResponse };

export async function sendChatMessage({ provider, apiKey, systemPrompt, chatHistory, userMessage, model }) {
  const formattedHistory = [...chatHistory, { role: "user", text: userMessage }];
  const { activeProvider, activeKeys } = resolveActiveKeys(provider, apiKey);

  if (activeKeys.length === 0) {
    throw new Error("No active API keys available in the pool");
  }

  let lastError = null;

  for (let i = 0; i < activeKeys.length; i++) {
    const currentKey = activeKeys[i];
    try {
      if (activeProvider === "gemini") {
        return await callGemini(currentKey, systemPrompt, formattedHistory);
      } else if (activeProvider === "openai") {
        return await callOpenAI(currentKey, systemPrompt, formattedHistory);
      } else if (activeProvider === "openrouter") {
        return await callOpenRouter(currentKey, systemPrompt, formattedHistory, model);
      }
    } catch (error) {
      console.warn(`[LLM Service] Запрос с ключом #${i + 1} (${activeProvider}) завершился ошибкой:`, error);
      lastError = error;

      const isRetryable =
        error.status === 401 ||
        error.status === 429 ||
        error.message?.includes("401") ||
        error.message?.includes("429") ||
        error.message?.includes("Unauthorized") ||
        error.message?.includes("Rate Limit");

      if (isRetryable && i < activeKeys.length - 1) {
        console.log(`[LLM Service] Ошибка ${error.status || "401/429"}. Переключаемся на следующий ключ...`);
        continue;
      }

      throw error;
    }
  }

  throw lastError || new Error("Все доступные ключи вернули ошибку.");
}

export async function generateActionReaction({ provider, apiKey, cd, ps, actionName }) {
  const systemPrompt = generateActionReactionPrompt(cd, ps, actionName);
  const { activeProvider, activeKeys } = resolveActiveKeys(provider, apiKey);

  if (activeKeys.length === 0) {
    throw new Error("No active API keys");
  }

  for (const currentKey of activeKeys) {
    try {
      if (activeProvider === "openrouter") {
        return await callOpenRouter(currentKey, systemPrompt, [], "google/gemma-4-26b-a4b-it:free");
      } else if (activeProvider === "gemini") {
        return await callGemini(currentKey, systemPrompt, []);
      } else if (activeProvider === "openai") {
        return await callOpenAI(currentKey, systemPrompt, []);
      }
    } catch (e) {
      console.warn("[LLM Action Reaction] Ошибка генерации реакции, пробуем следующий ключ:", e);
    }
  }

  throw new Error("Не удалось сгенерировать реакцию");
}
