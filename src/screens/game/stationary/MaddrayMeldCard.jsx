import React, { useState } from "react";
import { FONT, CODE } from "../../../ui/theme";
import { useTheme } from "../../../ui/ThemeContext";
import { IconChevronDown, IconChevronUp, IconBrain, IconAlertTriangle } from "../../../ui/icons";

/**
 * Compact Maddray DF & MELD-Na calculation block for 6th-year medical students.
 * Case stat_gastro_2: Liver cirrhosis decompensation & severe alcoholic hepatitis.
 */
export default function MaddrayMeldCard() {
  const C = useTheme();
  const [expanded, setExpanded] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  return (
    <div
      style={{
        marginTop: 8,
        borderRadius: 8,
        background: `${C.accent}0c`,
        border: `1px solid ${C.accent}33`,
        overflow: "hidden",
      }}
    >
      <div
        onClick={() => setExpanded((v) => !v)}
        style={{
          padding: "8px 12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
          userSelect: "none",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 700, color: C.accent, fontFamily: FONT }}>
          <IconBrain size={13} color={C.accent} />
          <span>Клинические шкалы (6 курс): Maddray DF и MELD-Na</span>
        </div>
        <div style={{ color: C.accent }}>
          {expanded ? <IconChevronUp size={14} color="currentColor" /> : <IconChevronDown size={14} color="currentColor" />}
        </div>
      </div>

      {expanded && (
        <div style={{ padding: "8px 12px 10px", borderTop: `1px solid ${C.accent}20`, display: "flex", flexDirection: "column", gap: 8, fontSize: 11, fontFamily: FONT, color: C.text, lineHeight: 1.45 }}>
          <div style={{ background: C.panelBg2 || C.panel, padding: "8px 10px", borderRadius: 6, border: `1px solid ${C.border}` }}>
            <div style={{ fontWeight: 700, color: C.white, marginBottom: 4, display: "flex", alignItems: "center", gap: 5 }}>
              <IconAlertTriangle size={12} color={C.yellow} />
              <span>Дискриминантная функция Мэддрея (Maddray DF):</span>
            </div>
            <div style={{ fontFamily: CODE, fontSize: 11, color: C.accent, marginBottom: 2 }}>
              DF = 4.6 × (ПВ_пац - ПВ_контр) + Билирубин(мг/дл)
            </div>
            <div style={{ fontFamily: CODE, fontSize: 11, color: C.yellow, marginBottom: 4 }}>
              DF = 4.6 × (28 - 13) + 5.0 = 69 + 5.0 = 74
            </div>
            <div style={{ fontSize: 10.5, color: C.textDim }}>
              DF = 74 &gt; 32 указывает на тяжелое течение алкогольного гепатита с высоким риском ранней госпитальной летальности.
            </div>
          </div>

          <div style={{ background: C.panelBg2 || C.panel, padding: "8px 10px", borderRadius: 6, border: `1px solid ${C.border}` }}>
            <div style={{ fontWeight: 700, color: C.white, marginBottom: 4 }}>
              Индекс MELD-Na (Model for End-Stage Liver Disease):
            </div>
            <div style={{ fontFamily: CODE, fontSize: 11, color: C.yellow, marginBottom: 4 }}>
              MELD-Na ≈ 24 балла
            </div>
            <div style={{ fontSize: 10.5, color: C.textDim }}>
              Расчет по показателям: Билирубин 86 мкмоль/л (5.0 мг/дл), МНО 2.1, Креатинин 118 мкмоль/л (1.33 мг/дл), Na 134 ммоль/л. Свидетельствует о выраженной декомпенсации печеночной функции.
            </div>
          </div>

          <div style={{ background: C.panelBg2 || C.panel, padding: "8px 10px", borderRadius: 6, border: `1px solid ${C.accent}40` }}>
            <div style={{ fontWeight: 700, color: C.accent, fontSize: 11, marginBottom: 4 }}>
              Вопрос для 6 курса: критерий тяжести и тактика при алкогольном гепатите
            </div>
            <div style={{ fontSize: 10.5, color: C.text, marginBottom: 6 }}>
              Какой порог функции Мэддрея определяет тяжелое течение и показания к системным ГКС?
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {[
                { id: "df32", label: "DF > 32 (тяжелое течение, риск летальности до 50%)", correct: true },
                { id: "df15", label: "DF > 15", correct: false },
                { id: "df50", label: "DF > 50", correct: false },
              ].map((opt) => {
                const isPicked = selectedAnswer === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setSelectedAnswer(opt.id)}
                    style={{
                      textAlign: "left", padding: "4px 8px", borderRadius: 5, fontSize: 10.5,
                      fontFamily: FONT, cursor: "pointer",
                      border: `1px solid ${isPicked ? (opt.correct ? C.green : C.red) : C.border}`,
                      background: isPicked ? (opt.correct ? `${C.green}18` : `${C.red}18`) : "transparent",
                      color: isPicked ? (opt.correct ? C.green : C.red) : C.text,
                    }}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
            {selectedAnswer === "df32" && (
              <div style={{ marginTop: 6, fontSize: 10, color: C.green, lineHeight: 1.35 }}>
                Верно! При DF &gt; 32 (у пациента 74) показана терапия преднизолоном 40 мг/сут при исключении инфекции и кровотечения.
              </div>
            )}
            {selectedAnswer && selectedAnswer !== "df32" && (
              <div style={{ marginTop: 6, fontSize: 10, color: C.red, lineHeight: 1.35 }}>
                Неверно. Пороговое значение дискриминантной функции Мэддрея — строго 32 балла (DF &gt; 32).
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
