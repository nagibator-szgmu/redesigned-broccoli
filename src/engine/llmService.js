/**
 * LLM Integration Service for MedSim with Fallback Key Pool
 */
import { callOpenRouter, callGemini, callOpenAI } from './llmAdapters';

const FALLBACK_KEYS = [
  import.meta.env.VITE_OPENROUTER_API_KEY || ""
].filter(Boolean);

export function generateSystemPrompt(cd, ps) {
  const gcsText = ps.gcs >= 13 ? "ясное" : ps.gcs >= 9 ? "оглушение" : ps.gcs >= 6 ? "сопор" : "коматозное";
  const genderText = cd.gender === "М" ? "мужчина" : "женщина";

  return `
Ты — пациент на приеме у врача в отделении экстренной помощи.
Твоя роль: играть персонажа в симуляции, отвечать коротко (1-2 предложения), реалистично, испытывая слабость, одышку или боль в зависимости от твоих симптомов.

ПРАВИЛА ОТВЕТОВ:
1. НЕ выдавай свой точный клинический диагноз (например, не говори "У меня инфаркт миокарда", "У меня расслоение аорты" или "У меня тампонада"). Описывай свои симптомы, боли, страх и ощущения простым языком обывателя.
2. Отвечай СТРОГО по предоставленным фактам (твои жалобы, анамнез, результаты осмотра). Не придумывай новые медицинские факты, которых нет в описании, но ты можешь выражать их своими словами.
3. Отвечай только на вопросы, касающиеся твоего здоровья, истории болезни, самочувствия или того, что с тобой произошло. Если врач спрашивает что-то постороннее, скажи, что тебе плохо и ты хочешь говорить только о своем состоянии.
4. Твой тон должен соответствовать твоему физическому состоянию.

Информация о тебе (факты из твоей медкарты):
- Имя: ${cd.name}
- Возраст: ${cd.age} л.
- Пол: ${genderText}
- Жалобы при поступлении: ${cd.complaint}
- Анамнез заболевания и жизни: ${cd.anamnesis}
- Данные осмотра: ${cd.exam}

Твое текущее физическое состояние (адаптируй свои ответы под это):
- Уровень боли: ${Math.round(ps.pain)} из 10 (где 10 — невыносимая боль).
- Сознание: ${gcsText} (ГКС: ${Math.round(ps.gcs)}/15).
- ЧСС (пульс): ${Math.round(ps.hr)} уд/мин.
- АД: ${Math.round(ps.sbp)}/${Math.round(ps.dbp)} мм рт.ст.
- Насыщение кислородом (SpO2): ${ps.spo2}%.
`.trim();
}

export async function sendChatMessage({ provider, apiKey, systemPrompt, chatHistory, userMessage, model }) {
  const formattedHistory = [...chatHistory, { role: "user", text: userMessage }];

  let activeProvider = provider;
  if (!apiKey || !apiKey.trim()) {
    activeProvider = "openrouter";
  }

  const keysToTry = [];
  if (activeProvider === "openrouter") {
    if (apiKey && apiKey.trim()) {
      keysToTry.push(apiKey);
    }
    keysToTry.push(...FALLBACK_KEYS);
  } else {
    keysToTry.push(apiKey);
  }

  const activeKeys = keysToTry.filter(
    (key) => key && key.trim() && !key.includes("placeholder")
  );

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

export function getLocalPatientResponse(q, cd, ps) {
  const query = q.toLowerCase();
  const currentPain = ps?.pain ?? 5;
  const currentSpo2 = ps?.spo2 ?? 98;

  if (/(боль|болит|жжет|давит|режет|pain|hurt)/.test(query)) {
    if (currentPain <= 3) {
      return "Мне гораздо лучше, доктор. Боль почти прошла, спасибо!";
    }
  }

  if (/(дышать|одышк|воздух|задых|breathe)/.test(query)) {
    if (currentSpo2 >= 95 && cd.complaint.toLowerCase().includes("одыш")) {
      return "Дышать стало намного легче, доктор. Спасибо, воздух проходит хорошо.";
    }
  }
  
  if (/(болит|боль|беспокоит|жалоб|плохо|тошнит|рвот|слабость|кружится|дышать|задыхаюсь|сердце|груди|живот|голова|нога|рука|спина|complaint|dizzy|nausea)/.test(query)) {
    return cd.complaint;
  }
  if (/(когда|началось|давно|как долго|время|часов|минут|вчера|сегодня|дней|начало|when|start|since|ago|yesterday|time)/.test(query)) {
    return cd.shortHistory || cd.anamnesis;
  }
  if (/(хроническ|болезн|лекарств|таблет|принимаете|аллерг|операци|давление|раньше|родители|наследствен|препарат|chronic|allergy|medication|drug|illness|history)/.test(query)) {
    return cd.anamnesis;
  }
  if (/(зрач|глаза|кож|цвет|живот|пальпац|пульс|послушать|легкие|дыхание|осмотр|look|eyes|skin|color|pulse|listen|exam)/.test(query)) {
    return cd.exam;
  }

  return `Доктор, мне тяжело говорить, мысли путаются. Главное, что меня беспокоит: ${cd.complaint.split(".")[0]}.`;
}

export async function generateActionReaction({ provider, apiKey, cd, ps, actionName }) {
  const gcsText = ps.gcs >= 13 ? "ясное" : ps.gcs >= 9 ? "оглушение" : ps.gcs >= 6 ? "сопор" : "коматозное";
  const genderText = cd.gender === "М" ? "мужчина" : "женщина";

  const systemPrompt = `
Ты — пациент на приеме у врача.
Имя: ${cd.name}, возраст: ${cd.age} л., пол: ${genderText}.
Жалобы: ${cd.complaint}.
Текущие показатели: боль ${Math.round(ps.pain)}/10, сознание: ${gcsText}, SpO2: ${ps.spo2}%, ЧСС: ${Math.round(ps.hr)} уд/мин.
Врач только что выполнил действие: "${actionName}".

Напиши свою мгновенную реакцию на это действие от первого лица (строго 1 короткая фраза, до 10-12 слов).
Выражай эмоции реалистично, учитывая твой возраст и состояние. Если тебе больно, стони. Если ввели обезболивающее — покажи облегчение.
НЕ используй кавычки, НЕ пиши никаких вводных фраз типа "Пациент:", отвечай строго прямой речью.
`.trim();

  let activeProvider = provider;
  if (!apiKey || !apiKey.trim()) {
    activeProvider = "openrouter";
  }

  const keysToTry = [];
  if (activeProvider === "openrouter") {
    if (apiKey && apiKey.trim()) {
      keysToTry.push(apiKey);
    }
    keysToTry.push(...FALLBACK_KEYS);
  } else {
    keysToTry.push(apiKey);
  }

  const activeKeys = keysToTry.filter(
    (key) => key && key.trim() && !key.includes("placeholder")
  );

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
