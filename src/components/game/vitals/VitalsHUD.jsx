import React from "react";
import { useTheme } from "../../../ui/ThemeContext";
import { FONT, CODE, RADIUS } from "../../../ui/theme";
import { useTranslate } from "../../../locale/useTranslate";
import { r1 } from "../../../engine/patient";
import EcgWaveform from "./EcgWaveform";
import VitalsMetricCard from "./VitalsMetricCard";
import PatientStatusBadge from "../PatientStatusBadge";
import {
  IconHeart, IconDroplet, IconRespiratory, IconWind,
  IconThermometer, IconBrain, IconFlame, IconVolume2,
  IconVolumeX, IconBook, IconPlay, IconPause
} from "../../../ui/icons";

/** Fixed/sticky clinical telemetry monitor header bar */
export default function VitalsHUD({
  ps, prevPs, cd, mode = "icu", setPhase, timeLeft, audioEnabled, setAudioEnabled,
  learningMode, paused, setPaused, showTheory, setShowTheory, relatedTopics = [], compact = false
}) {
  const C = useTheme();
  const { t } = useTranslate();

  if (!ps) return null;

  const trend = (key) => (!ps || !prevPs ? 0 : ps[key] > prevPs[key] ? 1 : ps[key] < prevPs[key] ? -1 : 0);
  const hasBp = ps?.sbp != null && ps.sbp > 0 && ps?.dbp != null && ps.dbp > 0;
  const map = hasBp ? Math.round((ps.sbp + 2 * ps.dbp) / 3) : null;
  const bpValue = hasBp ? `${Math.round(ps.sbp)}/${Math.round(ps.dbp)}` : (ps?.sbp > 0 ? `${Math.round(ps.sbp)}/—` : "---/---");
  const bpUnit = hasBp ? `(MAP ${map})` : "";
  const status = ps.status || (ps.sbp < 80 || ps.spo2 < 88 || ps.gcs < 8 ? "critical" : "normal");

  const vitalsConfig = [
    { key: "hr", label: t("vitals.hr"), value: ps.hr > 0 ? `${Math.round(ps.hr)}` : "0", unit: "bpm", icon: <IconHeart size={13} color={C.accent} />, warn: ps.hr > 100 || (ps.hr > 0 && ps.hr < 50), critical: ps.hr > 130 || ps.hr === 0 || ps.hr < 40 },
    { key: "bp", label: t("vitals.sbp"), value: bpValue, unit: bpUnit, icon: <IconDroplet size={13} color={C.red} />, warn: ps.sbp < 90 || ps.sbp > 160, critical: ps.sbp < 75 || ps.sbp > 180 || ps.sbp === 0 },
    { key: "spo2", label: "SpO₂", value: ps.spo2 > 0 ? `${r1(ps.spo2)}%` : "0%", icon: <IconRespiratory size={13} color={C.green} />, warn: ps.spo2 < 94, critical: ps.spo2 < 90 || ps.spo2 === 0 },
    { key: "rr", label: t("vitals.rr"), value: ps.rr > 0 ? `${Math.round(ps.rr)}` : "0", unit: "/min", icon: <IconWind size={13} color={C.accent} />, warn: ps.rr > 20 || (ps.rr > 0 && ps.rr < 10), critical: ps.rr > 28 || ps.rr === 0 || ps.rr < 8 },
    { key: "temp", label: "t°C", value: `${r1(ps.temp || 36.6)}`, unit: "°C", icon: <IconThermometer size={13} color={C.yellow} />, warn: ps.temp > 38 || ps.temp < 36, critical: ps.temp > 39.5 || ps.temp < 35 },
    { key: "gcs", label: t("vitals.gcs"), value: `${Math.round(ps.gcs || 15)}`, unit: "/15", icon: <IconBrain size={13} color={C.purple} />, warn: ps.gcs < 13, critical: ps.gcs < 9 },
    { key: "pain", label: t("vitals.pain"), value: `${r1(ps.pain || 0)}`, unit: "/10", icon: <IconFlame size={13} color={C.orange} />, warn: ps.pain > 4, critical: ps.pain > 7 }
  ];

  return (
    <div style={{
      position: "sticky", top: 0, zIndex: 100, background: C.headerBg2, backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)", borderBottom: `1px solid ${C.border}`, padding: compact ? "6px 10px" : "8px 14px",
      display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
      paddingTop: "max(6px, env(safe-area-inset-top, 6px))"
    }}>
      {/* Brand & Department Badge */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
        <button
          onClick={() => setPhase && setPhase("menu")}
          aria-label="В меню"
          style={{
            width: 32, height: 32, borderRadius: RADIUS.xs, background: "linear-gradient(135deg,rgba(0,230,200,0.2),rgba(0,150,200,0.1))",
            border: `1px solid ${C.accent}50`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", padding: 0
          }}
        >
          <span style={{ fontSize: 14, color: C.accent, fontWeight: 700 }}>М</span>
        </button>
        {!compact && (
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.white, fontFamily: FONT, lineHeight: 1.1, display: "flex", alignItems: "center", gap: 6 }}>
              <span>{cd?.name || "Patient Telemetry"}</span>
            </div>
            <div style={{ fontSize: 9, color: C.textDim, fontFamily: FONT, marginTop: 2, display: "flex", alignItems: "center", gap: 6 }}>
              <span>{mode.toUpperCase()} · {cd?.age ? `${cd.age}${t("cases.ageSuffix")}` : ""}</span>
              <PatientStatusBadge status={status} size="sm" showIcon={false} />
            </div>
          </div>
        )}
      </div>

      {/* Animated ECG Pulse Indicator */}
      <div style={{ flexShrink: 0, padding: "0 4px", borderLeft: `1px solid ${C.border}`, borderRight: `1px solid ${C.border}` }}>
        <EcgWaveform hr={ps.hr} status={status} width={compact ? 70 : 100} height={compact ? 26 : 30} />
      </div>

      {/* Telemetry Vitals Cards Container (Smooth touch scroll) */}
      <div className="no-scrollbar" style={{ flex: 1, display: "flex", alignItems: "center", gap: 6, overflowX: "auto", minWidth: 0, WebkitOverflowScrolling: "touch" }}>
        {vitalsConfig.map(v => (
          <VitalsMetricCard key={v.key} label={v.label} value={v.value} unit={compact ? "" : v.unit} trend={trend(v.key)} warn={v.warn} critical={v.critical} icon={v.icon} compact={compact} />
        ))}
      </div>

      {/* Controls (Audio, Timer, Pause, Theory) — Strictly Fixed */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
        {setAudioEnabled && (
          <button
            onClick={() => setAudioEnabled(v => !v)}
            aria-label={audioEnabled ? "Выключить звук" : "Включить звук"}
            style={{
              width: 32, height: 32, borderRadius: RADIUS.xs, background: !audioEnabled ? `${C.red}20` : C.btnBg,
              border: `1px solid ${!audioEnabled ? C.red : C.border}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", padding: 0
            }}
          >
            {audioEnabled ? <IconVolume2 size={14} color={C.accent} /> : <IconVolumeX size={14} color={C.red} />}
          </button>
        )}
        {relatedTopics.length > 0 && setShowTheory && (
          <button
            onClick={() => setShowTheory(v => !v)}
            aria-label="Справочник и теория"
            style={{
              width: 32, height: 32, borderRadius: RADIUS.xs, background: showTheory ? `${C.accent}25` : C.btnBg,
              border: `1px solid ${showTheory ? C.accent : C.border}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", padding: 0
            }}
          >
            <IconBook size={14} color={C.accent} />
          </button>
        )}
        {learningMode && setPaused && (
          <button
            onClick={() => setPaused(v => !v)}
            aria-label={paused ? "Продолжить" : "Пауза"}
            style={{
              width: 32, height: 32, borderRadius: RADIUS.xs, background: paused ? `${C.yellow}25` : C.btnBg,
              border: `1px solid ${paused ? C.yellow : C.border}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", padding: 0
            }}
          >
            {paused ? <IconPlay size={12} color={C.yellow} /> : <IconPause size={12} color={C.yellow} />}
          </button>
        )}
        {timeLeft !== undefined && (
          <div style={{ textAlign: "right", minWidth: 44 }}>
            <div className="tabular-nums" style={{ fontSize: 13, fontWeight: 700, fontFamily: CODE, lineHeight: 1, color: timeLeft < 60 ? C.red : timeLeft < 180 ? C.yellow : C.accent }}>
              {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
            </div>
            <div style={{ fontSize: 8, color: C.textDim, fontFamily: FONT }}>{t("game.timeRemaining")}</div>
          </div>
        )}
      </div>
    </div>
  );
}
