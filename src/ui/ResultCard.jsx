import { useState } from "react";
import { FONT, getCategoryColor } from "./theme";
import { useTheme } from "./ThemeContext";
import { DIAGNOSTICS, DIAGNOSTIC_REFS } from "../data/diagnostics";
import { IconXRay, IconCheck, IconX } from "./icons";
import DicomViewer from "../components/game/DicomViewer";
import Tooltip from "./Tooltip";
import { LabInterpretationCard } from "../components/game/lab";

export default function ResultCard({ id, text = "", isNew, cd, selectedLabParams }) {
  const C = useTheme();
  const [showDicom, setShowDicom] = useState(false);
  const [userEval, setUserEval] = useState(null);

  const diag = DIAGNOSTICS.find((d) => d.id === id);
  const meta = DIAGNOSTIC_REFS?.[id] || {};
  const color = getCategoryColor(diag?.cat, C);

  // Для биохимии и мочи используем интерактивный развернутый бланк
  if (["bmp", "urine"].includes(id)) {
    return (
      <LabInterpretationCard
        testId={id}
        testName={diag?.name || id}
        text={text}
        userSelectedParamIds={selectedLabParams?.[id]}
        C={C}
      />
    );
  }

  const isCritical = text.startsWith("🔴") || text.toLowerCase().includes("критич") || text.toLowerCase().includes("патолог");
  const isAbnormal = isCritical || text.includes("↑") || text.includes("↓") || text.toLowerCase().includes("повыш") || text.toLowerCase().includes("сниж");
  const isDicom = ["ct_head", "mri"].includes(id);

  const isCorrect = userEval !== null && (userEval === "abnormal" ? isAbnormal : !isAbnormal);

  const statusBadge = userEval === null ? (
    <span style={{ fontSize: 9, color: C.accent, background: `${C.accent}14`, border: `1px solid ${C.accent}35`, borderRadius: 4, padding: "1px 6px", fontFamily: FONT, fontWeight: 700 }}>
      ТРЕБУЕТ ОЦЕНКИ
    </span>
  ) : isCorrect ? (
    <span style={{ fontSize: 9, color: C.green, background: `${C.green}18`, border: `1px solid ${C.green}40`, borderRadius: 4, padding: "1px 6px", fontFamily: FONT, fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 3 }}>
      <IconCheck size={10} color={C.green} /> ВЕРНО ({isAbnormal ? "ПАТОЛОГИЯ" : "НОРМА"})
    </span>
  ) : (
    <span style={{ fontSize: 9, color: C.red, background: `${C.red}18`, border: `1px solid ${C.red}40`, borderRadius: 4, padding: "1px 6px", fontFamily: FONT, fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 3 }}>
      <IconX size={10} color={C.red} /> ОШИБКА ({isAbnormal ? "ПАТОЛОГИЯ" : "НОРМА"})
    </span>
  );

  return (
    <Tooltip
      title={diag?.name || id}
      refRange={meta.refRange ? `Норма: ${meta.refRange}` : null}
      text={`Исследование категории: ${diag?.cat || "лаб"}.`}
      details={meta}
      position="top"
      style={{ width: "100%", display: "block" }}
    >
      <div className="treat-row" style={{
        background: userEval !== null && !isCorrect ? `${C.red}0a` : `linear-gradient(135deg, ${C.panel2}b3, ${C.panel2}66)`,
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        border: `1px solid ${userEval !== null ? (isCorrect ? `${C.green}50` : `${C.red}50`) : `${color}22`}`,
        borderRadius: 12,
        padding: "12px 14px",
        marginBottom: 8,
        boxShadow: "0 4px 20px -4px rgba(0,0,0,0.3)",
        animation: isNew ? "fadeIn 0.4s ease" : "none",
        width: "100%",
        boxSizing: "border-box"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, flexWrap: "wrap" }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: color, flexShrink: 0 }} />
          <span style={{ fontSize: 11.5, color, fontFamily: FONT, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8 }}>
            {diag?.name || id}
          </span>
          {statusBadge}
          {isNew && <span style={{ fontSize: 10, color: C.green, fontFamily: FONT, fontWeight: 600 }}>● новый</span>}
          {isDicom && (
            <button
              onClick={(e) => { e.stopPropagation(); setShowDicom(true); }}
              style={{
                background: `${color}18`, border: `1px solid ${color}33`,
                borderRadius: 8, padding: "2px 7px", color, fontSize: 10, cursor: "pointer",
                fontFamily: FONT, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 4,
                marginLeft: "auto", transition: "all 0.15s"
              }}
            >
              <IconXRay size={12} color={color} />
              <span>PACS Снимки</span>
            </button>
          )}
        </div>

        <div style={{ fontSize: 12.5, color: C.text, lineHeight: 1.6, fontFamily: FONT }}>
          {text.replace(/^🔴\s*/, "")}
        </div>

        {/* Интерактивные кнопки оценки для врача */}
        <div style={{ marginTop: 8, paddingTop: 6, borderTop: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 6 }}>
          <span style={{ fontSize: 10.5, color: C.textDim, fontFamily: FONT }}>
            Клиническая оценка врача:
          </span>
          <div style={{ display: "flex", gap: 5 }}>
            <button
              type="button"
              onClick={() => setUserEval("normal")}
              style={evalBtnStyle(userEval === "normal", C.green, C)}
            >
              В норме
            </button>
            <button
              type="button"
              onClick={() => setUserEval("abnormal")}
              style={evalBtnStyle(userEval === "abnormal", C.red, C)}
            >
              Патология
            </button>
          </div>
        </div>

        {cd?.testImages?.[id] && (
          <div style={{ marginTop: 8, borderRadius: 8, overflow: "hidden", border: `1px solid ${C.border}` }}>
            <img src={cd.testImages[id]} alt={id} style={{ width: "100%", maxHeight: 220, objectFit: "contain", display: "block" }} />
          </div>
        )}

        {meta.refRange && (
          <div style={{ marginTop: 6, paddingTop: 6, borderTop: `1px solid ${C.border}`, display: "flex", flexWrap: "wrap", gap: 10, fontSize: 10, color: C.textDim, fontFamily: FONT }}>
            <span><strong>Референс:</strong> {meta.refRange}</span>
            {meta.unit && <span><strong>Ед.:</strong> {meta.unit}</span>}
            {meta.sample && <span><strong>Материал:</strong> {meta.sample}</span>}
          </div>
        )}

        {showDicom && <DicomViewer cd={cd} onClose={() => setShowDicom(false)} />}
      </div>
    </Tooltip>
  );
}

function evalBtnStyle(active, color, C) {
  return {
    padding: "3px 8px",
    borderRadius: 6,
    border: `1px solid ${active ? color : C.border}`,
    background: active ? `${color}20` : "transparent",
    color: active ? color : C.textDim,
    fontSize: 10.5,
    fontFamily: FONT,
    fontWeight: active ? 700 : 500,
    cursor: "pointer",
    transition: "all 0.12s ease",
  };
}
