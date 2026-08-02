import { useState } from "react";
import { useTheme } from "../../../ui/ThemeContext";
import { FONT } from "../../../ui/theme";
import { useTranslate } from "../../../locale/useTranslate";
import { STitle, ResultCard } from "../../../ui/components";
import HistoryPanel from "../HistoryPanel";
import { IconUser } from "../../../ui/icons";

/** Left column: Patient demographics, history, test results & active interventions */
export default function PatientRecordColumn({
  cd,
  ps,
  orderedDiag = [],
  revealedResults = {},
  newResultIds = [],
  selTreat = [],
  showInfo,
  setShowInfo,
  onRevealAnamnesis
}) {
  const C = useTheme();
  const { t } = useTranslate();
  const [complaintExpanded, setComplaintExpanded] = useState(false);

  const sevColor = cd?.severity === "critical" ? C.red : cd?.severity === "moderate" ? C.yellow : C.green;

  return (
    <div style={{
      height: "100%",
      overflowY: "auto",
      padding: "12px 14px",
      display: "flex",
      flexDirection: "column",
      gap: 12,
      boxSizing: "border-box"
    }}>
      {/* Patient Demographics & Complaint Header */}
      <div style={{
        background: C.panelBg,
        border: `1px solid ${C.border}`,
        borderRadius: 14,
        padding: "12px 14px"
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: `${sevColor}15`,
              border: `1.5px solid ${sevColor}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <IconUser size={18} color={sevColor} />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.white, fontFamily: FONT, lineHeight: 1.2 }}>
                {cd?.name}
              </div>
              <div style={{ fontSize: 10, color: C.textDim, fontFamily: FONT }}>
                {cd?.gender === "М" ? "Мужчина" : "Женщина"}, {cd?.age} {t("cases.ageSuffix")}
              </div>
            </div>
          </div>
          <span style={{
            background: `${sevColor}20`,
            border: `1px solid ${sevColor}44`,
            borderRadius: 6,
            padding: "2px 8px",
            fontSize: 10,
            color: sevColor,
            fontWeight: 700,
            fontFamily: FONT
          }}>
            {cd?.severity ? t(`severity.${cd.severity}`) : ""}
          </span>
        </div>

        {/* Complaint */}
        <div
          onClick={() => setComplaintExpanded(v => !v)}
          style={{
            fontSize: 12,
            color: C.text,
            fontFamily: FONT,
            lineHeight: 1.5,
            background: `${C.accent}08`,
            border: `1px solid ${C.border}`,
            borderRadius: 8,
            padding: "8px 10px",
            cursor: "pointer",
            ...(complaintExpanded ? {} : { display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" })
          }}
        >
          {cd?.complaint}
        </div>
      </div>

      {/* History & Physical Exam Panel */}
      <HistoryPanel
        cd={cd}
        ps={ps}
        selTreat={selTreat}
        orderedDiag={orderedDiag}
        showInfo={showInfo}
        setShowInfo={setShowInfo}
        isMobile={false}
        onRevealAnamnesis={onRevealAnamnesis}
      />

      {/* Revealed Test Results Timeline */}
      {orderedDiag.length > 0 && (
        <div style={{ background: C.panelBg, border: `1px solid ${C.border}`, borderRadius: 14, padding: "12px 14px" }}>
          <STitle icon="📋" label={t("results.title", { n: orderedDiag.length })} color={C.accent} />
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
            {orderedDiag.map(id => {
              const text = revealedResults[id];
              return (
                <ResultCard
                  key={id}
                  id={id}
                  text={text || t("awaiting.pending") || "Выполняется..."}
                  isNew={newResultIds.includes(id)}
                  cd={cd}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
