import { FONT } from "../../../ui/theme";
import { Tooltip } from "../../../ui/components";
import { IconX } from "../../../ui/icons";

export function SettingsDevSection({
  showDevSettings,
  setShowDevSettings,
  llmProvider,
  setLlmProvider,
  llmKey,
  setLlmKey,
  C,
  t,
}) {
  const providerOptions = [
    {
      l: "GigaChat",
      v: "gigachat",
      title: "СБЕР GIGACHAT (РФ)",
      text: "Отечественная медицинская нейросеть Сбера без необходимости VPN.",
    },
    {
      l: "Gemini",
      v: "gemini",
      title: "GOOGLE GEMINI PRO / FLASH",
      text: "Высокоскоростная медицинская нейросеть Google для анализа тактики врачей.",
    },
    {
      l: "OpenAI",
      v: "openai",
      title: "OPENAI GPT-4O",
      text: "Анализ дебрифинга с помощью модели GPT-4o.",
    },
    {
      l: "OpenRouter",
      v: "openrouter",
      title: "OPENROUTER API HUB",
      text: "Шлюз доступа к любым нейросетям (DeepSeek R1, Llama 3, Claude 3.5).",
    },
  ];

  const handleProviderChange = (v) => {
    setLlmProvider(v);
    localStorage.setItem("ms_llmProvider", v);
    localStorage.setItem("ms_llm_provider", v);
  };

  const handleKeyChange = (val) => {
    setLlmKey(val);
    localStorage.setItem("ms_llmKey", val);
    localStorage.setItem("ms_llm_key", val);
  };

  return (
    <div style={{ marginBottom: 14, paddingTop: 8, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
      <div
        onClick={() => setShowDevSettings((prev) => !prev)}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
          padding: "4px 0",
        }}
      >
        <div style={{ fontSize: 11, color: C.textDim, textTransform: "uppercase", letterSpacing: 1 }}>
          {t("settings.devSection")}
        </div>
        <span style={{ fontSize: 10, color: C.textDim }}>{showDevSettings ? "▲" : "▼"}</span>
      </div>

      {showDevSettings && (
        <div style={{ marginTop: 8 }}>
          <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
            {providerOptions.map(({ l, v, title, text }) => (
              <Tooltip key={v} title={title} text={text} style={{ flex: 1 }}>
                <button
                  onClick={() => handleProviderChange(v)}
                  style={{
                    width: "100%",
                    background: llmProvider === v ? `${C.accent}18` : "transparent",
                    border: `1px solid ${llmProvider === v ? C.accent : C.border}`,
                    borderRadius: 8,
                    padding: "7px 4px",
                    fontSize: 11,
                    color: llmProvider === v ? C.accent : C.textDim,
                    cursor: "pointer",
                    fontFamily: FONT,
                  }}
                >
                  {l}
                </button>
              </Tooltip>
            ))}
          </div>

          <div
            style={{
              background: C.inputBg || "rgba(7,13,24,0.6)",
              border: `1px solid ${C.border}`,
              borderRadius: 8,
              padding: "5px 10px",
              display: "flex",
              alignItems: "center",
              marginBottom: 4,
            }}
          >
            <input
              type="password"
              value={llmKey}
              onChange={(e) => handleKeyChange(e.target.value)}
              placeholder={llmProvider === "gigachat" ? "Authorization Key (Base64)..." : t("settings.apiKeyPlaceholder")}
              style={{
                background: "transparent",
                border: "none",
                outline: "none",
                color: C.white,
                fontSize: 11,
                fontFamily: FONT,
                flex: 1,
              }}
            />
            {llmKey && (
              <span
                onClick={() => handleKeyChange("")}
                style={{ color: C.textDim, cursor: "pointer", marginLeft: 5, display: "flex", alignItems: "center" }}
              >
                <IconX size={11} color={C.textDim} />
              </span>
            )}
          </div>

          {llmProvider === "gigachat" && (
            <div style={{ fontSize: 9, color: C.textDim, lineHeight: 1.3, marginTop: 4 }}>
              Используется встроенный ключ доступа или введите свой Authorization Key (Base64) от Developers Sber.
            </div>
          )}

          {llmProvider === "openrouter" && (
            <div style={{ fontSize: 9, color: C.textDim, lineHeight: 1.3, marginTop: 4 }}>
              {t("settings.openrouterGuide")}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
