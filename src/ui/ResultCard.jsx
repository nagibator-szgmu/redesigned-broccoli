import { useState } from "react";
import { FONT, getCategoryColor } from "./theme";
import { useTheme } from "./ThemeContext";
import { DIAGNOSTICS, DIAGNOSTIC_REFS } from "../data/diagnostics";
import { IconXRay } from "./icons";
import DicomViewer from "../components/game/DicomViewer";
import Tooltip from "./Tooltip";
import { LabReportCard } from "../components/game/lab";

export default function ResultCard({ id, text = "", isNew, cd, selectedLabParams }) {
  const C = useTheme();
  const [showDicom, setShowDicom] = useState(false);

  const diag = DIAGNOSTICS.find((d) => d.id === id);
  const meta = DIAGNOSTIC_REFS?.[id] || {};
  const color = getCategoryColor(diag?.cat, C);

  // Для биохимии и мочи используем чистый медицинский лабораторный бланк
  if (["bmp", "urine"].includes(id)) {
    return (
      <LabReportCard
        testId={id}
        testName={diag?.name || id}
        rawResult={text}
        selectedParamIds={selectedLabParams?.[id]}
        fullCaseTestResults={cd?.testResults}
      />
    );
  }

  const isDicom = ["ct_head", "mri"].includes(id);
  const cleanText = text.replace(/^🔴\s*/, "");

  return (
    <Tooltip
      title={diag?.name || id}
      refRange={meta.refRange ? `Норма: ${meta.refRange}` : null}
      text={`Исследование категории: ${diag?.cat || "диагностика"}.`}
      details={meta}
      position="top"
      style={{ width: "100%", display: "block" }}
    >
      <div
        className="treat-row"
        style={{
          background: `linear-gradient(135deg, ${C.panel2}b3, ${C.panel2}66)`,
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          border: `1px solid ${color}25`,
          borderRadius: 10,
          padding: "10px 12px",
          marginBottom: 8,
          boxShadow: "0 4px 16px -4px rgba(0,0,0,0.25)",
          animation: isNew ? "fadeIn 0.35s ease" : "none",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, flexWrap: "wrap" }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: color, flexShrink: 0 }} />
          <span style={{ fontSize: 12, color, fontFamily: FONT, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.6 }}>
            {diag?.name || id}
          </span>
          {isNew && <span style={{ fontSize: 10, color: C.green, fontFamily: FONT, fontWeight: 600 }}>● новый</span>}
          {isDicom && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setShowDicom(true); }}
              style={{
                background: `${color}18`,
                border: `1px solid ${color}33`,
                borderRadius: 6,
                padding: "2px 7px",
                color,
                fontSize: 10,
                cursor: "pointer",
                fontFamily: FONT,
                fontWeight: 600,
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                marginLeft: "auto",
                transition: "all 0.15s",
              }}
            >
              <IconXRay size={12} color={color} />
              <span>PACS Снимки</span>
            </button>
          )}
        </div>

        <div style={{ fontSize: 12.5, color: C.text, lineHeight: 1.55, fontFamily: FONT, marginBottom: 6 }}>
          {cleanText}
        </div>

        {cd?.testImages?.[id] && (
          <div style={{ marginTop: 8, borderRadius: 8, overflow: "hidden", border: `1px solid ${C.border}` }}>
            <img src={cd.testImages[id]} alt={id} style={{ width: "100%", maxHeight: 220, objectFit: "contain", display: "block" }} />
          </div>
        )}

        {meta.refRange && (
          <div style={{ marginTop: 6, paddingTop: 6, borderTop: `1px solid ${C.border}`, display: "flex", flexWrap: "wrap", gap: 10, fontSize: 11, color: C.textDim, fontFamily: FONT }}>
            <span><strong style={{ color: C.subText }}>Референс:</strong> {meta.refRange}</span>
            {meta.unit && <span><strong style={{ color: C.subText }}>Ед. изм.:</strong> {meta.unit}</span>}
            {meta.sample && <span><strong style={{ color: C.subText }}>Метод:</strong> {meta.sample}</span>}
          </div>
        )}

        {showDicom && <DicomViewer cd={cd} onClose={() => setShowDicom(false)} />}
      </div>
    </Tooltip>
  );
}
