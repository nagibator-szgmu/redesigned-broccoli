export const FALLBACK_KEYS = [
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_OPENROUTER_API_KEY) || ""
].filter(Boolean);

export const GIGACHAT_DEFAULT_AUTH_KEY =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_GIGACHAT_AUTH_KEY) ||
  "MDFhMGYyZTQtYjMxNC03ZmJlLWExYTEtYjViMmVjMzM4ZjllOjQyMDA2OWY0LTE0YjAtNDk4ZS04MDIyLWUxNjMyOWRiMzY5Yg==";

export function resolveActiveKeys(provider, apiKey) {
  let activeProvider = provider || (GIGACHAT_DEFAULT_AUTH_KEY ? "gigachat" : "openrouter");
  if (!apiKey || !apiKey.trim()) {
    if (activeProvider !== "gigachat" && activeProvider !== "openrouter") {
      activeProvider = GIGACHAT_DEFAULT_AUTH_KEY ? "gigachat" : "openrouter";
    }
  }

  const keysToTry = [];
  if (activeProvider === "gigachat") {
    if (apiKey && apiKey.trim()) {
      keysToTry.push(apiKey);
    }
    if (GIGACHAT_DEFAULT_AUTH_KEY) {
      keysToTry.push(GIGACHAT_DEFAULT_AUTH_KEY);
    }
  } else if (activeProvider === "openrouter") {
    if (apiKey && apiKey.trim()) {
      keysToTry.push(apiKey);
    }
    keysToTry.push(...FALLBACK_KEYS);
  } else {
    if (apiKey && apiKey.trim()) {
      keysToTry.push(apiKey);
    }
  }

  const activeKeys = keysToTry.filter(
    (key) => key && key.trim() && !key.includes("placeholder")
  );

  return { activeProvider, activeKeys };
}
