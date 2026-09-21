import { useState } from "react";
import { FONT, CODE } from "../../ui/theme";
import { LRINEC_OPTIONS } from "./calculatorData";

const LAB_NAMES = {
  crp: "СРБ (C-реактивный белок)",
  wbc: "Лейкоциты крови",
  hb: "Гемоглобин",
  sodium: "Натрий сыворотки",
  creat: "Креатинин крови",
  glucose: "Глюкоза крови",
};

export default function LRINECCalculator({ C }) {
  const [lrinec, setLrinec] = useState({
    crp: 0,
    wbc: 0,
    hb: 0,
    sodium: 0,
    creat: 0,
    glucose: 0,
  });

  const totalLrinec = Object.values(lrinec).reduce((a, b) => a + b, 0);

  const getLrinecRisk = (score) => {
    if (score >= 8) return { status: "Высокий риск некротизирующего фасциита (≥ 75%)", color: C.red };
    if (score >= 6) return { status: "Средний риск некротизирующего фасциита (50–75%)", color: C.yellow };
    return { status: "Низкий риск некротизирующего фасциита (< 50%)", color: C.green };
  };

  const risk = getLrinecRisk(totalLrinec);

  return (
    <div style={{ fontFamily: FONT, color: C.text, padding: "10px 0" }}>
      <h2 style={{ fontSize: 18, color: C.white, margin: "0 0 16px" }}>Шкала LRINEC</h2>
      <p style={{ fontSize: 13, color: C.textDim, margin: "0 0 20px", lineHeight: 1.6 }}>
        Ранняя лабораторная диагностика некротизирующего фасциита (на основе биохимии и ОАК). Балл ≥ 6 — основание для подозрения.
      </p>

      {Object.entries(LRINEC_OPTIONS).map(([key, options]) => (
        <div key={key} style={{ marginBottom: 18 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.white, marginBottom: 8 }}>
            {LAB_NAMES[key]}
          </div>
          <select
            value={lrinec[key]}
            onChange={(e) => setLrinec((prev) => ({ ...prev, [key]: parseInt(e.target.value, 10) }))}
            style={{
              width: "100%",
              padding: "10px 14px",
              borderRadius: 10,
              background: C.inputBg,
              border: `1px solid ${C.border}`,
              color: C.white,
              fontFamily: FONT,
              fontSize: 13,
              outline: "none",
              cursor: "pointer",
            }}
          >
            {options.map((opt) => (
              <option key={opt.pts} value={opt.pts} style={{ background: C.panel }}>
                {opt.pts} б. — {opt.label}
              </option>
            ))}
          </select>
        </div>
      ))}

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
          marginTop: 24,
        }}
      >
        <div>
          <div style={{ fontSize: 12, color: C.textDim, marginBottom: 4 }}>СУММА БАЛЛОВ LRINEC</div>
          <div style={{ fontSize: 14, color: risk.color, fontWeight: 700 }}>
            {risk.status}
          </div>
        </div>
        <div
          style={{
            fontSize: 28,
            fontWeight: 800,
            color: risk.color,
            fontFamily: CODE,
            background: `${risk.color}15`,
            border: `1px solid ${risk.color}30`,
            width: 60,
            height: 60,
            borderRadius: 12,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {totalLrinec}
        </div>
      </div>
    </div>
  );
}
