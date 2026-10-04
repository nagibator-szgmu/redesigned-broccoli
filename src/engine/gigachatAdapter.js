/**
 * gigachatAdapter.js
 * Adapter for Sber GigaChat API with OAuth token lifecycle management.
 */

let cachedToken = null;
let tokenExpiresAt = 0;
let cachedAuthKey = null;

function getRqUID() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function getEndpoints() {
  const isBrowser = typeof window !== "undefined" && typeof window.location !== "undefined";
  return {
    oauthUrl: isBrowser ? "/api/gigachat/oauth" : "https://ngw.devices.sberbank.ru:9443/api/v2/oauth",
    chatUrl: isBrowser ? "/api/gigachat/v1/chat/completions" : "https://gigachat.devices.sberbank.ru/api/v1/chat/completions"
  };
}

async function fetchWithRetry(url, options, maxRetries = 2) {
  let lastErr;
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fetch(url, options);
    } catch (err) {
      lastErr = err;
      if (attempt < maxRetries - 1) {
        await new Promise((r) => setTimeout(r, 350));
      }
    }
  }
  throw lastErr;
}

export async function getGigaChatToken(authKey) {
  const now = Date.now();
  if (cachedToken && cachedAuthKey === authKey && now < tokenExpiresAt - 60000) {
    return cachedToken;
  }

  const { oauthUrl } = getEndpoints();
  const response = await fetchWithRetry(oauthUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Accept": "application/json",
      "RqUID": getRqUID(),
      "Authorization": `Basic ${authKey}`
    },
    body: "scope=GIGACHAT_API_PERS"
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    const error = new Error(err.message || `GigaChat OAuth status ${response.status}`);
    error.status = response.status;
    throw error;
  }

  const data = await response.json();
  if (!data.access_token) {
    throw new Error("GigaChat OAuth did not return access_token");
  }

  cachedToken = data.access_token;
  cachedAuthKey = authKey;
  tokenExpiresAt = data.expires_at || (now + 25 * 60 * 1000);
  return cachedToken;
}

export async function callGigaChat(authKey, systemPrompt, formattedHistory, model = "GigaChat") {
  const { chatUrl } = getEndpoints();
  const messages = [
    { role: "system", content: systemPrompt },
    ...formattedHistory.map((msg) => ({
      role: msg.role === "user" ? "user" : "assistant",
      content: msg.text || ""
    }))
  ];

  let token = await getGigaChatToken(authKey);

  const payload = JSON.stringify({
    model: model || "GigaChat",
    messages,
    temperature: 0.6,
    max_tokens: 250
  });

  let response = await fetchWithRetry(chatUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: payload
  });

  if (response.status === 401) {
    cachedToken = null;
    token = await getGigaChatToken(authKey);
    response = await fetchWithRetry(chatUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: payload
    });
  }

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    const error = new Error(err.message || err.error?.message || `GigaChat API status ${response.status}`);
    error.status = response.status;
    throw error;
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "";
}
