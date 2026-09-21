import { useState } from "react";
import { FONT, CODE } from "../../ui/theme";
import { GCS_OPTIONS } from "./calculatorData";

export default function GCSCalculator({ C }) {
  const [gcsEyes, setGcsEyes] = useState(4);
  const [gcsVerbal, setGcsVerbal] = useState(5);
  const [gcsMotor, setGcsMotor] = useState(6);

  const totalGcs = gcsEyes + gcsVerbal + gcsMotor;

  const getGcsInterpretation = (score) => {
    if (score === 15) return { status: "Ясное сознание", color: C.green };
    if (score >= 13) return { status: "Умеренное оглушение", color: C.green };
    if (score >= 11) return { status: "Глубокое оглушение", color: C.yellow };
    if (score >= 9) return { status: "Сопор (выраженное угнетение)", color: C.yellow };
    if (score >= 4) return { status: "Кома (тяжелая ЧМТ/энцефалопатия)", color: C.red };
    return { status: "Смерть мозга", color: C.red };
  };

  const interp = getGcsInterpretation(totalGcs);

  const renderSection = (title, color, options, value, setValue) => (
    <div style={{ marginBottom: 18 }}>
      <div style={{ fontSize: 12, fontWeight: 700, color, marginBottom: 8, textTransform: "uppercase" }}>
        {title}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {options.map((opt) => (
          <button
            key={opt.pts}
            onClick={() => setValue(opt.pts)}
            style={{
              textAlign: "left",
              padding: "10px 14px",
              borderRadius: 10,
              cursor: "pointer",
              background: value === opt.pts ? `${color}14` : "transparent",
              border: `1px solid ${value === opt.pts ? color : C.border}`,
              color: value === opt.pts ? C.white : C.text,
              fontFamily: FONT,
              fontSize: 13,
              transition: "all 0.15s",
            }}
          >
            <span style={{ fontWeight: 700, marginRight: 8, color }}>{opt.pts} б.</span> {opt.text}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div style={{ fontFamily: FONT, color: C.text, padding: "10px 0" }}>
      <h2 style={{ fontSize: 18, color: C.white, margin: "0 0 16px" }}>Шкала ком Глазго (GCS)</h2>
      <p style={{ fontSize: 13, color: C.textDim, margin: "0 0 20px", lineHeight: 1.6 }}>
        Объективная оценка глубины нарушения сознания и комы. Используется в экстренной медицине и нейротравматологии.
      </p>

      {renderSection("Открывание глаз (E)", C.accent, GCS_OPTIONS.eyes, gcsEyes, setGcsEyes)}
      {renderSection("Речевой ответ (V)", C.purple, GCS_OPTIONS.verbal, gcsVerbal, setGcsVerbal)}
      {renderSection("Двигательный ответ (M)", C.yellow, GCS_OPTIONS.motor, gcsMotor, setGcsMotor)}

      {/* Total Result */}
      <div
        style={{
          background: "rgba(255,255,255,0.02)",
          border: `1px solid ${C.border}`,
          borderRadius: 16,
          padding: 16,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 14,
        }}
      >
        <div>
          <div style={{ fontSize: 12, color: C.textDim, marginBottom: 4 }}>ИТОГОВЫЙ БАЛЛ</div>
          <div style={{ fontSize: 14, color: interp.color, fontWeight: 700 }}>{interp.status}</div>
        </div>
        <div
          style={{
            fontSize: 28,
            fontWeight: 800,
            color: interp.color,
            fontFamily: CODE,
            background: `${interp.color}15`,
            border: `1px solid ${interp.color}30`,
            width: 60,
            height: 60,
            borderRadius: 12,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {totalGcs}
        </div>
      </div>
    </div>
  );
}
