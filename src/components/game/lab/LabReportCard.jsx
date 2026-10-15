import React from "react";
import { useTheme } from "../../../ui/ThemeContext";
import { FONT, CODE } from "../../../ui/theme";
import { parseLabTest } from "../../../engine/labAnalysisEngine";

/**
 * Аутентичный лабораторный медицинский бланк без игровых кнопок оценки.
 * Врач видит полученные значения, единицы измерения и референсные диапазоны.
 */
export default function LabReportCard({
  testId,
  testName = "Биохимия крови",
  rawResult = "",
  selectedParamIds = null,
  fullCaseTestResults = null,
}) {
  const C = useTheme();

  const isBmp = testId === "bmp";
  const isUrine = testId === "urine";
  const parsedParams = parseLabTest(testId, rawResult, selectedParamIds, fullCaseTestResults);

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
      }}
    >
      {/* Шапка бланка */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", borderBottom: `1px solid ${C.border}`, pb: 8, paddingBottom: 6 }}>
        <div>
          <div style={{ fontFamily: FONT, fontSize: 13, fontWeight: 700, color: C.text }}>
            {isBmp ? "Протокол биохимического исследования сыворотки крови" : isUrine ? "Протокол общего анализа мочи (клинический)" : testName}
          </div>
          <div style={{ fontFamily: CODE, fontSize: 11, color: C.subText, marginTop: 2 }}>
            Биоматериал: {isBmp ? "Венозная кровь (сыворотка)" : isUrine ? "Утренняя порция мочи" : "Клинический образец"}
          </div>
        </div>
        <div style={{ fontFamily: CODE, fontSize: 11, color: C.accent, fontWeight: 600 }}>
          {parsedParams.length} {isBmp ? "показателей исследовано" : "параметров"}
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
                <td style={{ padding: "6px 8px", textAlign: "right", fontFamily: CODE, fontWeight: 700, color: C.text }}>
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

      <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: 4 }}>
        <span style={{ fontFamily: CODE, fontSize: 10, color: C.subText }}>
          Клиническая оценка проводится врачом на основании референсных интервалов
        </span>
      </div>
    </div>
  );
}
