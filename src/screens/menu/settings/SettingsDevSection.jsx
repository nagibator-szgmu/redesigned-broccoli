import { FONT } from "../../../ui/theme";
import { Tooltip } from "../../../ui/components";

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
                  onClick={() => {
                    setLlmProvider(v);
                    localStorage.setItem("ms_llm_provider", v);
                  }}
                  style={{
                    width: "100%",
                    background: llmProvider === v ? `${C.accent}18` : "transparent",
                    border: `1px solid ${llmProvider === v ? C.accent : "rgba(0,230,200,0.1)"}`,
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
              border: "1px solid rgba(0,230,200,0.15)",
              borderRadius: 8,
              padding: "5px 10px",
              display: "flex",
              alignItems: "center",
              marginBottom: llmProvider === "openrouter" ? 6 : 0,
            }}
          >
            <input
              type="password"
              value={llmKey}
              onChange={(e) => {
                setLlmKey(e.target.value);
                localStorage.setItem("ms_llm_key", e.target.value);
              }}
              placeholder={t("settings.apiKeyPlaceholder")}
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
                onClick={() => {
                  setLlmKey("");
                  localStorage.setItem("ms_llm_key", "");
                }}
                style={{ color: C.textDim, fontSize: 11, cursor: "pointer", marginLeft: 5 }}
              >
                ✕
              </span>
            )}
          </div>

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
