import { useState } from "react";
import { FONT, CODE } from "../../ui/theme";
import { SOFA_OPTIONS } from "./calculatorData";

const SYSTEM_NAMES = {
  resp: "🫁 Дыхание",
  coag: "🩸 Коагуляция",
  liver: "💊 Печень",
  cardio: "❤️ Кровообращение",
  cns: "🧠 ЦНС",
  renal: "🛏️ Почки",
};

export default function SOFACalculator({ C }) {
  const [sofa, setSofa] = useState({
    resp: 0,
    coag: 0,
    liver: 0,
    cardio: 0,
    cns: 0,
    renal: 0,
  });

  const totalSofa = Object.values(sofa).reduce((a, b) => a + b, 0);

  const getSofaMortality = (score) => {
    if (score <= 1) return "Летальность < 5%";
    if (score <= 4) return "Летальность ~ 10–15%";
    if (score <= 7) return "Летальность ~ 20–30%";
    if (score <= 11) return "Летальность ~ 40–50%";
    return "Летальность > 80% (высокий риск полиорганной недостаточности)";
  };

  const mortality = getSofaMortality(totalSofa);
  const statusColor = totalSofa >= 8 ? C.red : totalSofa >= 4 ? C.yellow : C.green;

  return (
    <div style={{ fontFamily: FONT, color: C.text, padding: "10px 0" }}>
      <h2 style={{ fontSize: 18, color: C.white, margin: "0 0 16px" }}>Шкала SOFA</h2>
      <p style={{ fontSize: 13, color: C.textDim, margin: "0 0 20px", lineHeight: 1.6 }}>
        Оценка степени полиорганной недостаточности у пациентов в критическом состоянии (сепсис, ОРИТ).
      </p>

      {Object.entries(SOFA_OPTIONS).map(([key, options]) => (
        <div key={key} style={{ marginBottom: 18 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.white, marginBottom: 8 }}>
            {SYSTEM_NAMES[key]}
          </div>
          <select
            value={sofa[key]}
            onChange={(e) => setSofa((prev) => ({ ...prev, [key]: parseInt(e.target.value, 10) }))}
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
          <div style={{ fontSize: 12, color: C.textDim, marginBottom: 4 }}>СУММА БАЛЛОВ SOFA</div>
          <div style={{ fontSize: 14, color: statusColor, fontWeight: 700 }}>
            {mortality}
          </div>
        </div>
        <div
          style={{
            fontSize: 28,
            fontWeight: 800,
            color: statusColor,
            fontFamily: CODE,
            background: `${statusColor}15`,
            border: `1px solid ${statusColor}30`,
            width: 60,
            height: 60,
            borderRadius: 12,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {totalSofa}
        </div>
      </div>
    </div>
  );
}
