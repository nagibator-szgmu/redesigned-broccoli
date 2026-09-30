import React from "react";
import { useTheme } from "../../../ui/ThemeContext";
import { FONT } from "../../../ui/theme";
import {
  IconDroplet,
  IconHeart,
  IconRespiratory,
  IconWind,
  IconThermometer,
  IconBrain,
  IconCheck,
} from "../../../ui/icons";

/**
 * Компактная синдромальная строка под телеметрическим монитором (Status Strip).
 * Мгновенно отражает ведущие гемодинамические и дыхательные нарушения, не раскрывая диагноз.
 */
export default function VitalsStatusStrip({ ps }) {
  const C = useTheme();

  if (!ps) return null;

  const flags = [];

  // 1. Гемодинамика (АД)
  if (ps.sbp != null && ps.sbp > 0) {
    if (ps.sbp < 75) {
      flags.push({ id: "sbp-crit", text: `Гипотензия крит. (${Math.round(ps.sbp)} мм)`, color: C.red, Icon: IconDroplet });
    } else if (ps.sbp < 90) {
      flags.push({ id: "sbp-warn", text: `Гипотензия (${Math.round(ps.sbp)} мм)`, color: C.yellow, Icon: IconDroplet });
    } else if (ps.sbp > 175) {
      flags.push({ id: "sbp-high", text: `Гипертонический криз (${Math.round(ps.sbp)} мм)`, color: C.red, Icon: IconDroplet });
    } else if (ps.sbp > 155) {
      flags.push({ id: "sbp-elev", text: `Артериальная гипертензия`, color: C.yellow, Icon: IconDroplet });
    }
  }

  // 2. Ритм (ЧСС)
  if (ps.hr != null) {
    if (ps.hr > 130) {
      flags.push({ id: "hr-crit", text: `Выраженная тахикардия (${Math.round(ps.hr)})`, color: C.red, Icon: IconHeart });
    } else if (ps.hr > 100) {
      flags.push({ id: "hr-warn", text: `Тахикардия (${Math.round(ps.hr)})`, color: C.yellow, Icon: IconHeart });
    } else if (ps.hr > 0 && ps.hr < 45) {
      flags.push({ id: "hr-brady-crit", text: `Критическая брадикардия (${Math.round(ps.hr)})`, color: C.red, Icon: IconHeart });
    } else if (ps.hr > 0 && ps.hr < 55) {
      flags.push({ id: "hr-brady", text: `Брадикардия (${Math.round(ps.hr)})`, color: C.yellow, Icon: IconHeart });
    }
  }

  // 3. Оксигенация (SpO2)
  if (ps.spo2 != null && ps.spo2 > 0) {
    if (ps.spo2 < 88) {
      flags.push({ id: "spo2-crit", text: `Острая гипоксемия (${Math.round(ps.spo2)}%)`, color: C.red, Icon: IconRespiratory });
    } else if (ps.spo2 < 94) {
      flags.push({ id: "spo2-warn", text: `Десатурация (${Math.round(ps.spo2)}%)`, color: C.yellow, Icon: IconRespiratory });
    }
  }

  // 4. Дыхание (ЧДД)
  if (ps.rr != null && ps.rr > 0) {
    if (ps.rr > 26) {
      flags.push({ id: "rr-crit", text: `Тахипноэ (${Math.round(ps.rr)}/мин)`, color: C.red, Icon: IconWind });
    } else if (ps.rr > 20) {
      flags.push({ id: "rr-warn", text: `Учащенное дыхание (${Math.round(ps.rr)}/мин)`, color: C.yellow, Icon: IconWind });
    } else if (ps.rr < 9) {
      flags.push({ id: "rr-bradypnea", text: `Брадипноэ (${Math.round(ps.rr)}/мин)`, color: C.red, Icon: IconWind });
    }
  }

  // 5. Температура тела
  if (ps.temp != null) {
    if (ps.temp > 38.5) {
      flags.push({ id: "temp-fever", text: `Гипертермия (${Number(ps.temp).toFixed(1)}°C)`, color: C.yellow, Icon: IconThermometer });
    } else if (ps.temp < 35.5) {
      flags.push({ id: "temp-hypo", text: `Гипотермия (${Number(ps.temp).toFixed(1)}°C)`, color: C.yellow, Icon: IconThermometer });
    }
  }

  // 6. Сознание (ШКГ)
  if (ps.gcs != null && ps.gcs < 15) {
    if (ps.gcs < 9) {
      flags.push({ id: "gcs-coma", text: `Кома (ШКГ ${Math.round(ps.gcs)})`, color: C.red, Icon: IconBrain });
    } else if (ps.gcs < 13) {
      flags.push({ id: "gcs-dep", text: `Угнетение сознания (ШКГ ${Math.round(ps.gcs)})`, color: C.yellow, Icon: IconBrain });
    }
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        padding: "3px 12px",
        background: `${C.panelBg2}`,
        borderBottom: `1px solid ${C.border}`,
        overflowX: "auto",
        whiteSpace: "nowrap",
        fontSize: 10.5,
        fontFamily: FONT,
        flexShrink: 0,
      }}
      className="no-scrollbar"
    >
      <span style={{ fontSize: 11, fontWeight: 600, color: C.textDim, fontFamily: FONT, marginRight: 4 }}>
        Статусы:
      </span>
      {flags.length === 0 ? (
        <span style={{ color: C.green, display: "inline-flex", alignItems: "center", gap: 4, fontWeight: 500, fontSize: 11.5 }}>
          <IconCheck size={12} color={C.green} />
          Витальные показатели в целевом диапазоне
        </span>
      ) : (
        flags.map(({ id, text, color, Icon }, idx) => (
          <React.Fragment key={id}>
            {idx > 0 && <span style={{ color: C.borderBright, fontSize: 11, margin: "0 2px" }}>·</span>}
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                padding: "2px 7px",
                borderRadius: 4,
                background: `${color}14`,
                border: `1px solid ${color}35`,
                color,
                fontSize: 11,
                fontWeight: 600,
              }}
            >
              <Icon size={11} color={color} />
              {text}
            </span>
          </React.Fragment>
        ))
      )}
    </div>
  );
}
