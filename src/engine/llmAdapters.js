/**
 * llmAdapters.js
 * API callers for OpenRouter, Gemini, and OpenAI.
 */

export async function callOpenRouter(apiKey, systemPrompt, formattedHistory, model) {
  const url = "https://openrouter.ai/api/v1/chat/completions";
  const messages = [
    { role: "system", content: systemPrompt },
    ...formattedHistory.map(msg => ({
      role: msg.role === "user" ? "user" : "assistant",
      content: msg.text
    }))
  ];

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
      "HTTP-Referer": "https://github.com/nagibator-szgmu/redesigned-broccoli",
      "X-Title": "MedSim"
    },
    body: JSON.stringify({
      model: model || "google/gemma-4-26b-a4b-it:free",
      messages,
      temperature: 0.6,
      max_tokens: 150
    })
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    const error = new Error(err.error?.message || `OpenRouter API status ${response.status}`);
    error.status = response.status;
    throw error;
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "";
}

export async function callGemini(apiKey, systemPrompt, formattedHistory) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
  const contents = formattedHistory.map(msg => ({
    role: msg.role === "user" ? "user" : "model",
    parts: [{ text: msg.text }]
  }));

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents,
      systemInstruction: { parts: [{ text: systemPrompt }] },
      generationConfig: { temperature: 0.6, maxOutputTokens: 150 }
    })
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    const error = new Error(err.error?.message || `Gemini API status ${response.status}`);
    error.status = response.status;
    throw error;
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
}

export async function callOpenAI(apiKey, systemPrompt, formattedHistory) {
  const url = "https://api.openai.com/v1/chat/completions";
  const messages = [
    { role: "system", content: systemPrompt },
    ...formattedHistory.map(msg => ({
      role: msg.role === "user" ? "user" : "assistant",
      content: msg.text
    }))
  ];

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages,
      temperature: 0.6,
      max_tokens: 150
    })
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    const error = new Error(err.error?.message || `OpenAI API status ${response.status}`);
    error.status = response.status;
    throw error;
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "";
}
