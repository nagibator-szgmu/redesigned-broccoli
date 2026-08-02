import { useState } from "react";
import { FONT, CODE } from "../ui/theme";

const GCS_OPTIONS = {
  eyes: [
    { pts: 4, text: "Спонтанное" },
    { pts: 3, text: "На обращенную речь" },
    { pts: 2, text: "На болевой раздражитель" },
    { pts: 1, text: "Отсутствует" }
  ],
  verbal: [
    { pts: 5, text: "Ориентирован, быстрый ответ" },
    { pts: 4, text: "Спутанная речь" },
    { pts: 3, text: "Неподходящие слова (бессвязные)" },
    { pts: 2, text: "Нечленораздельные звуки (стоны)" },
    { pts: 1, text: "Отсутствует" }
  ],
  motor: [
    { pts: 6, text: "Выполняет команды" },
    { pts: 5, text: "Локализует боль" },
    { pts: 4, text: "Отдергивание конечности в ответ на боль" },
    { pts: 3, text: "Патологическое сгибание (декортикация)" },
    { pts: 2, text: "Патологическое разгибание (децеребрация)" },
    { pts: 1, text: "Отсутствует" }
  ]
};

const SOFA_OPTIONS = {
  resp: [
    { pts: 0, label: "PaO₂/FiO₂ > 400" },
    { pts: 1, label: "PaO₂/FiO₂ ≤ 400" },
    { pts: 2, label: "PaO₂/FiO₂ ≤ 300" },
    { pts: 3, label: "PaO₂/FiO₂ ≤ 200 (на ИВЛ)" },
    { pts: 4, label: "PaO₂/FiO₂ ≤ 100 (на ИВЛ)" }
  ],
  coag: [
    { pts: 0, label: "Тромбоциты > 150" },
    { pts: 1, label: "Тромбоциты ≤ 150" },
    { pts: 2, label: "Тромбоциты ≤ 100" },
    { pts: 3, label: "Тромбоциты ≤ 50" },
    { pts: 4, label: "Тромбоциты ≤ 20" }
  ],
  liver: [
    { pts: 0, label: "Билирубин < 20 мкмоль/л" },
    { pts: 1, label: "Билирубин 20–32 мкмоль/л" },
    { pts: 2, label: "Билирубин 33–101 мкмоль/л" },
    { pts: 3, label: "Билирубин 102–204 мкмоль/л" },
    { pts: 4, label: "Билирубин > 204 мкмоль/л" }
  ],
  cardio: [
    { pts: 0, label: "АДср ≥ 70 мм рт.ст." },
    { pts: 1, label: "АДср < 70 мм рт.ст." },
    { pts: 2, label: "Допамин ≤ 5 или Добутамин (любая доза)" },
    { pts: 3, label: "Допамин > 5 или Адреналин ≤ 0.1, или Норадреналин ≤ 0.1" },
    { pts: 4, label: "Допамин > 15 или Адреналин > 0.1, или Норадреналин > 0.1" }
  ],
  cns: [
    { pts: 0, label: "ГКС = 15" },
    { pts: 1, label: "ГКС = 13–14" },
    { pts: 2, label: "ГКС = 10–12" },
    { pts: 3, label: "ГКС = 6–9" },
    { pts: 4, label: "ГКС < 6" }
  ],
  renal: [
    { pts: 0, label: "Креатинин < 110 мкмоль/л" },
    { pts: 1, label: "Креатинин 110–170 мкмоль/л" },
    { pts: 2, label: "Креатинин 171–299 мкмоль/л" },
    { pts: 3, label: "Креатинин 300–440 мкмоль/л или олигурия" },
    { pts: 4, label: "Креатинин > 440 мкмоль/л или диурез < 200 мл/сут" }
  ]
};

const LRINEC_OPTIONS = {
  crp: [
    { pts: 0, label: "СРБ < 150 мг/л" },
    { pts: 4, label: "СРБ ≥ 150 мг/л" }
  ],
  wbc: [
    { pts: 0, label: "Лейкоциты < 15 ×10⁹/л" },
    { pts: 1, label: "Лейкоциты 15–25 ×10⁹/л" },
    { pts: 2, label: "Лейкоциты > 25 ×10⁹/л" }
  ],
  hb: [
    { pts: 0, label: "Гемоглобин > 135 г/л" },
    { pts: 1, label: "Гемоглобин 110–135 г/л" },
    { pts: 2, label: "Гемоглобин < 110 г/л" }
  ],
  sodium: [
    { pts: 0, label: "Натрий ≥ 135 ммоль/л" },
    { pts: 2, label: "Натрий < 135 ммоль/л" }
  ],
  creat: [
    { pts: 0, label: "Креатинин ≤ 141 мкмоль/л" },
    { pts: 2, label: "Креатинин > 141 мкмоль/л" }
  ],
  glucose: [
    { pts: 0, label: "Глюкоза ≤ 10 ммоль/л" },
    { pts: 1, label: "Глюкоза > 10 ммоль/л" }
  ]
};

export default function CalculatorContent({ calcId, C }) {
  // GCS state
  const [gcsEyes, setGcsEyes] = useState(4);
  const [gcsVerbal, setGcsVerbal] = useState(5);
  const [gcsMotor, setGcsMotor] = useState(6);

  // SOFA state
  const [sofa, setSofa] = useState({ resp: 0, coag: 0, liver: 0, cardio: 0, cns: 0, renal: 0 });

  // LRINEC state
  const [lrinec, setLrinec] = useState({ crp: 0, wbc: 0, hb: 0, sodium: 0, creat: 0, glucose: 0 });

  if (calcId === "gcs") {
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

    return (
      <div style={{ fontFamily: FONT, color: C.text, padding: "10px 0" }}>
        <h2 style={{ fontSize: 18, color: C.white, margin: "0 0 16px" }}>Шкала ком Глазго (GCS)</h2>
        <p style={{ fontSize: 13, color: C.textDim, margin: "0 0 20px", lineHeight: 1.6 }}>
          Объективная оценка глубины нарушения сознания и комы. Используется в экстренной медицине и нейротравматологии.
        </p>

        {/* Eyes */}
        <div style={{ marginBottom: 18 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: C.accent, marginBottom: 8, textTransform: "uppercase" }}>Открывание глаз (E)</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {GCS_OPTIONS.eyes.map((opt) => (
              <button key={opt.pts} onClick={() => setGcsEyes(opt.pts)} style={{
                textAlign: "left", padding: "10px 14px", borderRadius: 10, cursor: "pointer",
                background: gcsEyes === opt.pts ? `${C.accent}14` : "transparent",
                border: `1px solid ${gcsEyes === opt.pts ? C.accent : C.border}`,
                color: gcsEyes === opt.pts ? C.white : C.text, fontFamily: FONT, fontSize: 13,
                transition: "all 0.15s"
              }}>
                <span style={{ fontWeight: 700, marginRight: 8, color: C.accent }}>{opt.pts} б.</span> {opt.text}
              </button>
            ))}
          </div>
        </div>

        {/* Verbal */}
        <div style={{ marginBottom: 18 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: C.purple, marginBottom: 8, textTransform: "uppercase" }}>Речевой ответ (V)</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {GCS_OPTIONS.verbal.map((opt) => (
              <button key={opt.pts} onClick={() => setGcsVerbal(opt.pts)} style={{
                textAlign: "left", padding: "10px 14px", borderRadius: 10, cursor: "pointer",
                background: gcsVerbal === opt.pts ? `${C.purple}14` : "transparent",
                border: `1px solid ${gcsVerbal === opt.pts ? C.purple : C.border}`,
                color: gcsVerbal === opt.pts ? C.white : C.text, fontFamily: FONT, fontSize: 13,
                transition: "all 0.15s"
              }}>
                <span style={{ fontWeight: 700, marginRight: 8, color: C.purple }}>{opt.pts} б.</span> {opt.text}
              </button>
            ))}
          </div>
        </div>

        {/* Motor */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: C.yellow, marginBottom: 8, textTransform: "uppercase" }}>Двигательный ответ (M)</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {GCS_OPTIONS.motor.map((opt) => (
              <button key={opt.pts} onClick={() => setGcsMotor(opt.pts)} style={{
                textAlign: "left", padding: "10px 14px", borderRadius: 10, cursor: "pointer",
                background: gcsMotor === opt.pts ? `${C.yellow}14` : "transparent",
                border: `1px solid ${gcsMotor === opt.pts ? C.yellow : C.border}`,
                color: gcsMotor === opt.pts ? C.white : C.text, fontFamily: FONT, fontSize: 13,
                transition: "all 0.15s"
              }}>
                <span style={{ fontWeight: 700, marginRight: 8, color: C.yellow }}>{opt.pts} б.</span> {opt.text}
              </button>
            ))}
          </div>
        </div>

        {/* Total Result */}
        <div style={{
          background: "rgba(255,255,255,0.02)", border: `1px solid ${C.border}`, borderRadius: 16,
          padding: 16, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14
        }}>
          <div>
            <div style={{ fontSize: 12, color: C.textDim, marginBottom: 4 }}>ИТОГОВЫЙ БАЛЛ</div>
            <div style={{ fontSize: 14, color: interp.color, fontWeight: 700 }}>{interp.status}</div>
          </div>
          <div style={{
            fontSize: 28, fontWeight: 800, color: interp.color, fontFamily: CODE,
            background: `${interp.color}15`, border: `1px solid ${interp.color}30`,
            width: 60, height: 60, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center"
          }}>{totalGcs}</div>
        </div>
      </div>
    );
  }

  if (calcId === "sofa") {
    const totalSofa = Object.values(sofa).reduce((a, b) => a + b, 0);
    const getSofaMortality = (score) => {
      if (score <= 1) return "Летальность < 5%";
      if (score <= 4) return "Летальность ~ 10–15%";
      if (score <= 7) return "Летальность ~ 20–30%";
      if (score <= 11) return "Летальность ~ 40–50%";
      return "Летальность > 80% (высокий риск полиорганной недостаточности)";
    };
    const mortality = getSofaMortality(totalSofa);

    return (
      <div style={{ fontFamily: FONT, color: C.text, padding: "10px 0" }}>
        <h2 style={{ fontSize: 18, color: C.white, margin: "0 0 16px" }}>Шкала SOFA</h2>
        <p style={{ fontSize: 13, color: C.textDim, margin: "0 0 20px", lineHeight: 1.6 }}>
          Оценка степени полиорганной недостаточности у пациентов в критическом состоянии (сепсис, ОРИТ).
        </p>

        {Object.entries(SOFA_OPTIONS).map(([key, options]) => {
          const sysName = { resp: "🫁 Дыхание", coag: "🩸 Коагуляция", liver: "💊 Печень", cardio: "❤️ Кровообращение", cns: "🧠 ЦНС", renal: "🛏️ Почки" }[key];
          return (
            <div key={key} style={{ marginBottom: 18 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.white, marginBottom: 8 }}>{sysName}</div>
              <select
                value={sofa[key]}
                onChange={(e) => setSofa(prev => ({ ...prev, [key]: parseInt(e.target.value) }))}
                style={{
                  width: "100%", padding: "10px 14px", borderRadius: 10, background: C.inputBg,
                  border: `1px solid ${C.border}`, color: C.white, fontFamily: FONT, fontSize: 13,
                  outline: "none", cursor: "pointer"
                }}
              >
                {options.map((opt) => (
                  <option key={opt.pts} value={opt.pts} style={{ background: C.panel }}>
                    {opt.pts} б. — {opt.label}
                  </option>
                ))}
              </select>
            </div>
          );
        })}

        {/* Total Result */}
        <div style={{
          background: "rgba(255,255,255,0.02)", border: `1px solid ${C.border}`, borderRadius: 16,
          padding: 16, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14, marginTop: 24
        }}>
          <div>
            <div style={{ fontSize: 12, color: C.textDim, marginBottom: 4 }}>СУММА БАЛЛОВ SOFA</div>
            <div style={{ fontSize: 14, color: totalSofa >= 8 ? C.red : totalSofa >= 4 ? C.yellow : C.green, fontWeight: 700 }}>
              {mortality}
            </div>
          </div>
          <div style={{
            fontSize: 28, fontWeight: 800, color: totalSofa >= 8 ? C.red : totalSofa >= 4 ? C.yellow : C.green, fontFamily: CODE,
            background: totalSofa >= 8 ? `${C.red}15` : totalSofa >= 4 ? `${C.yellow}15` : `${C.green}15`,
            border: `1px solid ${totalSofa >= 8 ? C.red : totalSofa >= 4 ? C.yellow : C.green}30`,
            width: 60, height: 60, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center"
          }}>{totalSofa}</div>
        </div>
      </div>
    );
  }

  if (calcId === "lrinec") {
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

        {Object.entries(LRINEC_OPTIONS).map(([key, options]) => {
          const optName = { crp: "СРБ (C-реактивный белок)", wbc: "Лейкоциты крови", hb: "Гемоглобин", sodium: "Натрий сыворотки", creat: "Креатинин крови", glucose: "Глюкоза крови" }[key];
          return (
            <div key={key} style={{ marginBottom: 18 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.white, marginBottom: 8 }}>{optName}</div>
              <select
                value={lrinec[key]}
                onChange={(e) => setLrinec(prev => ({ ...prev, [key]: parseInt(e.target.value) }))}
                style={{
                  width: "100%", padding: "10px 14px", borderRadius: 10, background: C.inputBg,
                  border: `1px solid ${C.border}`, color: C.white, fontFamily: FONT, fontSize: 13,
                  outline: "none", cursor: "pointer"
                }}
              >
                {options.map((opt) => (
                  <option key={opt.pts} value={opt.pts} style={{ background: C.panel }}>
                    {opt.pts} б. — {opt.label}
                  </option>
                ))}
              </select>
            </div>
          );
        })}

        {/* Total Result */}
        <div style={{
          background: "rgba(255,255,255,0.02)", border: `1px solid ${C.border}`, borderRadius: 16,
          padding: 16, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14, marginTop: 24
        }}>
          <div>
            <div style={{ fontSize: 12, color: C.textDim, marginBottom: 4 }}>СУММА БАЛЛОВ LRINEC</div>
            <div style={{ fontSize: 14, color: risk.color, fontWeight: 700 }}>
              {risk.status}
            </div>
          </div>
          <div style={{
            fontSize: 28, fontWeight: 800, color: risk.color, fontFamily: CODE,
            background: `${risk.color}15`, border: `1px solid ${risk.color}30`,
            width: 60, height: 60, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center"
          }}>{totalLrinec}</div>
        </div>
      </div>
    );
  }

  return null;
}
