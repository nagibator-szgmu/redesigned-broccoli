import { createPortal } from "react-dom";
import { FONT } from "../../ui/theme";

/**
 * MenuSettingsModal component for app settings and developer LLM configuration.
 */
export default function MenuSettingsModal({
  showSettings, setShowSettings, difficulty, setDifficulty, gameMode, setGameMode,
  learningMode, setLearningMode, assessmentMode, setAssessmentMode, audioEnabled, setAudioEnabled,
  hideWarnings, setHideWarnings, theme, setTheme, locale, setLocaleGlobal, LOCALES,
  llmProvider, setLlmProvider, llmKey, setLlmKey, showDevSettings, setShowDevSettings,
  isMobile, t, C,
}) {
  if (!showSettings) return null;

  const positionStyle = isMobile ? { top: 60, right: 12, left: 12 } : { top: 72, right: 8, width: 280 };

  return createPortal(
    <>
      <div style={{ position: "fixed", inset: 0, zIndex: 99998 }} onClick={() => setShowSettings(false)} />
      <div style={{ position: "fixed", ...positionStyle, zIndex: 99999, background: C.overlayBg, backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)", border: "1px solid rgba(0,230,200,0.2)", borderRadius: 16, padding: "16px", boxShadow: "0 16px 48px rgba(0,0,0,0.8),0 0 0 1px rgba(0,230,200,0.05)", fontFamily: FONT }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: C.white }}>{t("settings.title")}</span>
          <span onClick={() => setShowSettings(false)} style={{ fontSize: 12, color: C.textDim, cursor: "pointer", padding: "2px 8px", borderRadius: 6, background: C.dimBg }}>✕</span>
        </div>

        {/* Account Profile Card */}
        <div style={{ background: "rgba(0,230,200,0.06)", border: "1px solid rgba(0,230,200,0.15)", borderRadius: 12, padding: "10px 12px", marginBottom: 14, display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: `linear-gradient(135deg, ${C.accent}, ${C.green})`, display: "flex", alignItems: "center", justifyContent: "center", color: C.bg, fontWeight: 700, fontSize: 14 }}>
            С
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.white, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              Студент-Медик
            </div>
            <div style={{ fontSize: 10, color: C.accent, opacity: 0.8 }}>
              Пользовательский аккаунт
            </div>
          </div>
          <div style={{ fontSize: 10, background: `${C.accent}20`, border: `1px solid ${C.accent}40`, borderRadius: 6, padding: "2px 6px", color: C.accent, fontWeight: 600 }}>
            Студент
          </div>
        </div>

        {/* Difficulty */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11, color: C.textDim, marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>{t("settings.difficulty")}</div>
          <div style={{ display: "flex", gap: 6 }}>
            {[{ l: t("settings.easy"), v: "easy" }, { l: t("settings.normal"), v: "normal" }, { l: t("settings.hard"), v: "hard" }].map(({ l, v }) => (
              <button key={v} onClick={() => setDifficulty(v)} style={{ flex: 1, background: difficulty === v ? `${C.accent}18` : "transparent", border: `1px solid ${difficulty === v ? C.accent : "rgba(0,230,200,0.1)"}`, borderRadius: 8, padding: "7px 4px", fontSize: 11, color: difficulty === v ? C.accent : C.textDim, cursor: "pointer", fontFamily: FONT }}>{l}</button>
            ))}
          </div>
        </div>

        {/* Game Mode */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11, color: C.textDim, marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>{t("settings.gameMode")}</div>
          <div style={{ display: "flex", gap: 6 }}>
            {[{ l: t("settings.modeNormal"), v: "normal", d: t("settings.modeNormalDesc") }, { l: t("settings.modeRandom"), v: "random", d: t("settings.modeRandomDesc") }, { l: t("settings.modeStress"), v: "stress", d: t("settings.modeStressDesc") }].map(({ l, v, d }) => (
              <button key={v} onClick={() => setGameMode(v)} style={{ flex: 1, background: gameMode === v ? `${C.accent}18` : "transparent", border: `1px solid ${gameMode === v ? C.accent : "rgba(0,230,200,0.1)"}`, borderRadius: 8, padding: "7px 4px", textAlign: "center", cursor: "pointer", fontFamily: FONT }}>
                <div style={{ fontSize: 11, color: gameMode === v ? C.accent : C.textDim, marginBottom: 2 }}>{l}</div>
                <div style={{ fontSize: 9, color: C.textDim, opacity: 0.7 }}>{d}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Audio Toggle */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11, color: C.textDim, marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>{t("settings.audio")}</div>
          <div style={{ display: "flex", gap: 6 }}>
            {[{ l: t("settings.learningOn"), v: true }, { l: t("settings.learningOff"), v: false }].map(({ l, v }) => (
              <button key={String(v)} onClick={() => setAudioEnabled(v)} style={{ flex: 1, background: audioEnabled === v ? `${C.accent}18` : "transparent", border: `1px solid ${audioEnabled === v ? C.accent : "rgba(0,230,200,0.1)"}`, borderRadius: 8, padding: "7px 4px", fontSize: 11, color: audioEnabled === v ? C.accent : C.textDim, cursor: "pointer", fontFamily: FONT }}>{l}</button>
            ))}
          </div>
        </div>

        {/* Hide Warnings Toggle */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11, color: C.textDim, marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>{t("settings.hideWarnings") || "Подсказки по ЛС"}</div>
          <div style={{ display: "flex", gap: 6 }}>
            {[{ l: t("settings.warningsShow") || "Показывать", v: false }, { l: t("settings.warningsHide") || "Скрывать", v: true }].map(({ l, v }) => (
              <button key={String(v)} onClick={() => setHideWarnings(v)} style={{ flex: 1, background: hideWarnings === v ? `${C.accent}18` : "transparent", border: `1px solid ${hideWarnings === v ? C.accent : "rgba(0,230,200,0.1)"}`, borderRadius: 8, padding: "7px 4px", fontSize: 11, color: hideWarnings === v ? C.accent : C.textDim, cursor: "pointer", fontFamily: FONT }}>{l}</button>
            ))}
          </div>
        </div>

        {/* Theme */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11, color: C.textDim, marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>{t("settings.theme")}</div>
          <div style={{ display: "flex", gap: 6 }}>
            {[{ l: t("settings.dark"), v: "dark" }, { l: t("settings.light"), v: "light" }].map(({ l, v }) => (
              <button key={v} onClick={() => setTheme(v)} style={{ flex: 1, background: theme === v ? `${C.accent}18` : "transparent", border: `1px solid ${theme === v ? C.accent : "rgba(0,230,200,0.1)"}`, borderRadius: 8, padding: "7px 4px", fontSize: 11, color: theme === v ? C.accent : C.textDim, cursor: "pointer", fontFamily: FONT }}>{l}</button>
            ))}
          </div>
        </div>

        {/* Language */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11, color: C.textDim, marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>{t("settings.langLabel")}</div>
          <div style={{ display: "flex", gap: 6 }}>
            {Object.entries(LOCALES).map(([v, l]) => (
              <button key={v} onClick={() => setLocaleGlobal(v)} style={{ flex: 1, background: locale === v ? `${C.accent}18` : "transparent", border: `1px solid ${locale === v ? C.accent : "rgba(0,230,200,0.1)"}`, borderRadius: 8, padding: "7px 4px", fontSize: 11, color: locale === v ? C.accent : C.textDim, cursor: "pointer", fontFamily: FONT }}>{l}</button>
            ))}
          </div>
        </div>

        {/* Developer Key Accordion */}
        <div style={{ marginBottom: 14, paddingTop: 8, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div onClick={() => setShowDevSettings((prev) => !prev)} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", padding: "4px 0" }}>
            <div style={{ fontSize: 11, color: C.textDim, textTransform: "uppercase", letterSpacing: 1 }}>{t("settings.devSection")}</div>
            <span style={{ fontSize: 10, color: C.textDim }}>{showDevSettings ? "▲" : "▼"}</span>
          </div>
          {showDevSettings && (
            <div style={{ marginTop: 8 }}>
              <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
                {[{ l: "Gemini", v: "gemini" }, { l: "OpenAI", v: "openai" }, { l: "OpenRouter", v: "openrouter" }].map(({ l, v }) => (
                  <button key={v} onClick={() => { setLlmProvider(v); localStorage.setItem("ms_llm_provider", v); }} style={{ flex: 1, background: llmProvider === v ? `${C.accent}18` : "transparent", border: `1px solid ${llmProvider === v ? C.accent : "rgba(0,230,200,0.1)"}`, borderRadius: 8, padding: "7px 4px", fontSize: 11, color: llmProvider === v ? C.accent : C.textDim, cursor: "pointer", fontFamily: FONT }}>{l}</button>
                ))}
              </div>
              <div style={{ background: C.inputBg || "rgba(7,13,24,0.6)", border: "1px solid rgba(0,230,200,0.15)", borderRadius: 8, padding: "5px 10px", display: "flex", alignItems: "center", marginBottom: llmProvider === "openrouter" ? 6 : 0 }}>
                <input type="password" value={llmKey} onChange={(e) => { setLlmKey(e.target.value); localStorage.setItem("ms_llm_key", e.target.value); }} placeholder={t("settings.apiKeyPlaceholder")} style={{ background: "transparent", border: "none", outline: "none", color: C.white, fontSize: 11, fontFamily: FONT, flex: 1 }} />
                {llmKey && <span onClick={() => { setLlmKey(""); localStorage.setItem("ms_llm_key", ""); }} style={{ color: C.textDim, fontSize: 11, cursor: "pointer", marginLeft: 5 }}>✕</span>}
              </div>
              {llmProvider === "openrouter" && (
                <div style={{ fontSize: 9, color: C.textDim, lineHeight: 1.3, marginTop: 4 }}>{t("settings.openrouterGuide")}</div>
              )}
            </div>
          )}
        </div>

        {/* Learning Mode Toggle */}
        <div style={{ marginBottom: 14 }}>
          <div onClick={() => setLearningMode((v) => !v)} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 10px", background: learningMode ? `${C.yellow}12` : "transparent", border: `1px solid ${learningMode ? `${C.yellow}44` : "rgba(0,230,200,0.1)"}`, borderRadius: 8, cursor: "pointer" }}>
            <div>
              <div style={{ fontSize: 12, color: learningMode ? C.yellow : C.text, fontWeight: 600, fontFamily: FONT }}>📚 {t("settings.learningMode")}</div>
              <div style={{ fontSize: 10, color: C.textDim, fontFamily: FONT, marginTop: 2 }}>{t("settings.learningModeDesc")}</div>
            </div>
            <div style={{ width: 36, height: 20, borderRadius: 10, background: learningMode ? C.yellow : `${C.textDim}30`, position: "relative", transition: "background 0.2s", flexShrink: 0 }}>
              <div style={{ width: 16, height: 16, borderRadius: "50%", background: "#fff", position: "absolute", top: 2, left: learningMode ? 18 : 2, transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.3)" }} />
            </div>
          </div>
        </div>

        {/* Assessment Mode Toggle */}
        <div style={{ marginBottom: 14 }}>
          <div onClick={() => setAssessmentMode((v) => !v)} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 10px", background: assessmentMode ? `${C.green}12` : "transparent", border: `1px solid ${assessmentMode ? `${C.green}44` : "rgba(0,230,200,0.1)"}`, borderRadius: 8, cursor: "pointer" }}>
            <div>
              <div style={{ fontSize: 12, color: assessmentMode ? C.green : C.text, fontWeight: 600, fontFamily: FONT }}>✅ {t("settings.assessmentMode")}</div>
              <div style={{ fontSize: 10, color: C.textDim, fontFamily: FONT, marginTop: 2 }}>{t("settings.assessmentModeDesc")}</div>
            </div>
            <div style={{ width: 36, height: 20, borderRadius: 10, background: assessmentMode ? C.green : `${C.textDim}30`, position: "relative", transition: "background 0.2s", flexShrink: 0 }}>
              <div style={{ width: 16, height: 16, borderRadius: "50%", background: "#fff", position: "absolute", top: 2, left: assessmentMode ? 18 : 2, transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.3)" }} />
            </div>
          </div>
        </div>

        <div style={{ paddingTop: 12, borderTop: "1px solid rgba(0,230,200,0.06)", fontSize: 11, color: C.textDim, textAlign: "center", opacity: 0.7 }}>
          {t("settings.moreComing")}
        </div>
      </div>
    </>,
    document.body
  );
}
