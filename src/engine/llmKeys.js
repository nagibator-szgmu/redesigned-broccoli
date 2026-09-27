export const FALLBACK_KEYS = [
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_OPENROUTER_API_KEY) || ""
].filter(Boolean);

export function resolveActiveKeys(provider, apiKey) {
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

  return { activeProvider, activeKeys };
}
