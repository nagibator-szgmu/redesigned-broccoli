import { createPortal } from "react-dom";
import { FONT } from "../../ui/theme";
import {
  SettingsSimulationSection,
  SettingsGeneralSection,
  SettingsDevSection,
  SettingsModeSwitches,
} from "./settings/index";

/**
 * MenuSettingsModal component for app settings and developer LLM configuration.
 */
export default function MenuSettingsModal({
  showSettings, setShowSettings, difficulty, setDifficulty, gameMode, setGameMode,
  learningMode, setLearningMode, assessmentMode, setAssessmentMode,
  patientDialogueMode = "hybrid", setPatientDialogueMode,
  audioEnabled, setAudioEnabled,
  hideWarnings, setHideWarnings, theme, setTheme, locale, setLocaleGlobal, LOCALES,
  llmProvider, setLlmProvider, llmKey, setLlmKey, showDevSettings, setShowDevSettings,
  resetProgress, isMobile, t, C,
}) {
  if (!showSettings) return null;

  const positionStyle = isMobile
    ? { top: 60, right: 12, left: 12, maxHeight: "82vh", overflowY: "auto" }
    : { top: 72, right: 16, width: 300, maxHeight: "82vh", overflowY: "auto" };

  return createPortal(
    <>
      <div style={{ position: "fixed", inset: 0, zIndex: 99998 }} onClick={() => setShowSettings(false)} />
      <div style={{ position: "fixed", ...positionStyle, zIndex: 99999, background: C.overlayBg, backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)", border: `1px solid ${C.borderBright}`, borderRadius: 16, padding: "16px", boxShadow: `0 16px 48px rgba(0,0,0,0.6), 0 0 16px ${C.accentDim}`, fontFamily: FONT }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: C.white }}>{t("settings.title")}</span>
          <span onClick={() => setShowSettings(false)} style={{ fontSize: 12, color: C.textDim, cursor: "pointer", padding: "2px 8px", borderRadius: 6, background: C.dimBg }}>✕</span>
        </div>

        <SettingsSimulationSection
          difficulty={difficulty}
          setDifficulty={setDifficulty}
          gameMode={gameMode}
          setGameMode={setGameMode}
          C={C}
          t={t}
        />

        <SettingsGeneralSection
          audioEnabled={audioEnabled}
          setAudioEnabled={setAudioEnabled}
          hideWarnings={hideWarnings}
          setHideWarnings={setHideWarnings}
          theme={theme}
          setTheme={setTheme}
          locale={locale}
          setLocaleGlobal={setLocaleGlobal}
          LOCALES={LOCALES}
          C={C}
          t={t}
        />

        <SettingsDevSection
          showDevSettings={showDevSettings}
          setShowDevSettings={setShowDevSettings}
          llmProvider={llmProvider}
          setLlmProvider={setLlmProvider}
          llmKey={llmKey}
          setLlmKey={setLlmKey}
          C={C}
          t={t}
        />

        <SettingsModeSwitches
          learningMode={learningMode}
          setLearningMode={setLearningMode}
          assessmentMode={assessmentMode}
          setAssessmentMode={setAssessmentMode}
          patientDialogueMode={patientDialogueMode}
          setPatientDialogueMode={setPatientDialogueMode}
          C={C}
          t={t}
        />

        {/* Reset Progress */}
        {resetProgress && (
          <div style={{ marginBottom: 14 }}>
            <button
              onClick={() => {
                resetProgress();
                setShowSettings(false);
              }}
              style={{
                width: "100%",
                background: "rgba(255, 61, 90, 0.08)",
                border: "1px solid rgba(255, 61, 90, 0.25)",
                borderRadius: 8,
                padding: "8px 10px",
                fontSize: 11,
                color: C.red,
                cursor: "pointer",
                fontFamily: FONT,
                fontWeight: 600,
                textAlign: "center",
              }}
            >
              🗑️ {t("progress.reset")} прогресс и статистику
            </button>
          </div>
        )}

        <div style={{ paddingTop: 12, borderTop: `1px solid ${C.border}`, fontSize: 11, color: C.textDim, textAlign: "center", opacity: 0.7 }}>
          {t("settings.moreComing")}
        </div>
      </div>
    </>,
    document.body
  );
}
