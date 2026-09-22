import { FONT } from "../../../ui/theme";

export function SettingsModeSwitches({
  learningMode,
  setLearningMode,
  assessmentMode,
  setAssessmentMode,
  patientDialogueMode,
  setPatientDialogueMode,
  C,
  t,
}) {
  return (
    <>
      <div style={{ marginBottom: 14 }}>
        <div
          onClick={() => setLearningMode((v) => !v)}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "8px 10px",
            background: learningMode ? `${C.yellow}12` : "transparent",
            border: `1px solid ${learningMode ? `${C.yellow}44` : C.border}`,
            borderRadius: 8,
            cursor: "pointer",
          }}
        >
          <div>
            <div style={{ fontSize: 12, color: learningMode ? C.yellow : C.text, fontWeight: 600, fontFamily: FONT }}>
              📚 {t("settings.learningMode")}
            </div>
            <div style={{ fontSize: 10, color: C.textDim, fontFamily: FONT, marginTop: 2 }}>
              {t("settings.learningModeDesc")}
            </div>
          </div>
          <div
            style={{
              width: 36,
              height: 20,
              borderRadius: 10,
              background: learningMode ? C.yellow : `${C.textDim}30`,
              position: "relative",
              transition: "background 0.2s",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: 16,
                height: 16,
                borderRadius: "50%",
                background: "#fff",
                position: "absolute",
                top: 2,
                left: learningMode ? 18 : 2,
                transition: "left 0.2s",
                boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
              }}
            />
          </div>
        </div>
      </div>

      <div style={{ marginBottom: 14 }}>
        <div
          onClick={() => setAssessmentMode((v) => !v)}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "8px 10px",
            background: assessmentMode ? `${C.green}12` : "transparent",
            border: `1px solid ${assessmentMode ? `${C.green}44` : C.border}`,
            borderRadius: 8,
            cursor: "pointer",
          }}
        >
          <div>
            <div style={{ fontSize: 12, color: assessmentMode ? C.green : C.text, fontWeight: 600, fontFamily: FONT }}>
              ✅ {t("settings.assessmentMode")}
            </div>
            <div style={{ fontSize: 10, color: C.textDim, fontFamily: FONT, marginTop: 2 }}>
              {t("settings.assessmentModeDesc")}
            </div>
          </div>
          <div
            style={{
              width: 36,
              height: 20,
              borderRadius: 10,
              background: assessmentMode ? C.green : `${C.textDim}30`,
              position: "relative",
              transition: "background 0.2s",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: 16,
                height: 16,
                borderRadius: "50%",
                background: "#fff",
                position: "absolute",
                top: 2,
                left: assessmentMode ? 18 : 2,
                transition: "left 0.2s",
                boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
              }}
            />
          </div>
        </div>
      </div>

      <div style={{ marginBottom: 14 }}>
        <div
          onClick={() => setPatientDialogueMode && setPatientDialogueMode((m) => (m === "hybrid" ? "standard" : "hybrid"))}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "8px 10px",
            background: patientDialogueMode === "hybrid" ? `${C.accent}12` : "transparent",
            border: `1px solid ${patientDialogueMode === "hybrid" ? `${C.accent}44` : C.border}`,
            borderRadius: 8,
            cursor: "pointer",
          }}
        >
          <div>
            <div style={{ fontSize: 12, color: patientDialogueMode === "hybrid" ? C.accent : C.text, fontWeight: 600, fontFamily: FONT }}>
              💬 {t("settings.patientDialogueMode")}
            </div>
            <div style={{ fontSize: 10, color: C.textDim, fontFamily: FONT, marginTop: 2 }}>
              {t("settings.patientDialogueModeDesc")} ({patientDialogueMode === "hybrid" ? "Гибрид (LLM)" : "Стандарт"})
            </div>
          </div>
          <div
            style={{
              width: 36,
              height: 20,
              borderRadius: 10,
              background: patientDialogueMode === "hybrid" ? C.accent : `${C.textDim}30`,
              position: "relative",
              transition: "background 0.2s",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: 16,
                height: 16,
                borderRadius: "50%",
                background: "#fff",
                position: "absolute",
                top: 2,
                left: patientDialogueMode === "hybrid" ? 18 : 2,
                transition: "left 0.2s",
                boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
