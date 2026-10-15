import React from "react";
import { useTheme } from "../../../ui/ThemeContext";
import { FONT, CODE } from "../../../ui/theme";
import { parseLabTest, getLabTestMeta, extractLabConclusion } from "../../../engine/labAnalysisEngine";

/**
 * Аутентичный лабораторный медицинский бланк без игровых кнопок оценки.
 * Отображает все параметры, измеренные значения, единицы измерения и референсные диапазоны.
 */
export default function LabReportCard({
  testId,
  testName = "Лабораторное исследование",
  rawResult = "",
  selectedParamIds = null,
  fullCaseTestResults = null,
  testImage = null,
  isNew = false,
}) {
  const C = useTheme();

  const meta = getLabTestMeta(testId, testName);
  const parsedParams = parseLabTest(testId, rawResult, selectedParamIds, fullCaseTestResults);
  const conclusion = extractLabConclusion(rawResult);

  return (
    <div
      style={{
        background: C.panel,
        border: `1px solid ${C.border}`,
        borderRadius: 8,
        padding: "12px 14px",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        marginBottom: 8,
        animation: isNew ? "fadeIn 0.35s ease" : "none",
        boxShadow: "0 4px 16px -4px rgba(0,0,0,0.25)",
      }}
    >
      {/* Шапка лабораторного бланка */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", borderBottom: `1px solid ${C.border}`, paddingBottom: 6 }}>
        <div>
          <div style={{ fontFamily: FONT, fontSize: 13, fontWeight: 700, color: C.text }}>
            {meta.title}
          </div>
          <div style={{ fontFamily: CODE, fontSize: 11, color: C.subText, marginTop: 2 }}>
            Биоматериал: {meta.sample}
          </div>
        </div>
        <div style={{ fontFamily: CODE, fontSize: 11, color: C.accent, fontWeight: 600 }}>
          {parsedParams.length} {parsedParams.length === 1 ? "показатель" : (parsedParams.length >= 2 && parsedParams.length <= 4 ? "показателя" : "показателей")}
        </div>
      </div>

      {/* Таблица показателей бланка */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: 12, fontFamily: FONT }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${C.border}`, color: C.subText, fontSize: 11, textTransform: "uppercase" }}>
              <th style={{ padding: "4px 8px", fontWeight: 600 }}>Исследуемый показатель</th>
              <th style={{ padding: "4px 8px", fontWeight: 600, textAlign: "right" }}>Результат</th>
              <th style={{ padding: "4px 8px", fontWeight: 600 }}>Ед. изм.</th>
              <th style={{ padding: "4px 8px", fontWeight: 600 }}>Референсный интервал</th>
            </tr>
          </thead>
          <tbody>
            {parsedParams.map((param, idx) => (
              <tr
                key={param.id || idx}
                style={{
                  borderBottom: `1px solid ${C.border}30`,
                  background: idx % 2 === 1 ? (C.dimBg || "rgba(255,255,255,0.015)") : "transparent",
                }}
              >
                <td style={{ padding: "6px 8px", color: C.text, fontWeight: 500 }}>
                  {param.name}
                </td>
                <td
                  style={{
                    padding: "6px 8px",
                    textAlign: "right",
                    fontFamily: CODE,
                    fontWeight: 700,
                    color: param.isActuallyAbnormal ? (C.red || "#EF4444") : C.text,
                  }}
                >
                  {param.displayValue}
                </td>
                <td style={{ padding: "6px 8px", color: C.subText, fontFamily: CODE, fontSize: 11 }}>
                  {param.unit || "—"}
                </td>
                <td style={{ padding: "6px 8px", color: C.subText, fontFamily: CODE, fontSize: 11 }}>
                  {param.refRange || "В пределах нормы"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {testImage && (
        <div style={{ borderRadius: 8, overflow: "hidden", border: `1px solid ${C.border}` }}>
          <img src={testImage} alt={testId} style={{ width: "100%", maxHeight: 220, objectFit: "contain", display: "block" }} />
        </div>
      )}

      {conclusion && (
        <div style={{ padding: "7px 10px", background: `${C.panel2 || C.panel}80`, borderRadius: 6, border: `1px solid ${C.border}`, fontSize: 11.5, fontFamily: FONT, color: C.text }}>
          <span style={{ fontWeight: 600, color: C.subText }}>Заключение лаборатории: </span>
          {conclusion}
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: 2 }}>
        <span style={{ fontFamily: CODE, fontSize: 10, color: C.subText }}>
          Клиническая оценка проводится врачом на основании референсных интервалов
        </span>
      </div>
    </div>
  );
}
