import { useTheme } from "../../../ui/ThemeContext";
import { FONT, CODE } from "../../../ui/theme";
import { useTranslate } from "../../../locale/useTranslate";
import { r1 } from "../../../engine/patient";
import EcgWaveform from "./EcgWaveform";
import VitalsMetricCard from "./VitalsMetricCard";
import PatientStatusBadge from "../PatientStatusBadge";

/** Fixed/sticky clinical telemetry monitor header bar */
export default function VitalsHUD({
  ps, prevPs, cd, mode = "icu", phase, setPhase, timeLeft, audioEnabled, setAudioEnabled,
  learningMode, paused, setPaused, showTheory, setShowTheory, relatedTopics = [], compact = false
}) {
  const C = useTheme();
  const { t } = useTranslate();

  if (!ps) return null;

  const trend = (key) => (!ps || !prevPs ? 0 : ps[key] > prevPs[key] ? 1 : ps[key] < prevPs[key] ? -1 : 0);
  const map = Math.round(ps.dbp + (ps.sbp - ps.dbp) / 3);
  const status = ps.status || (ps.sbp < 80 || ps.spo2 < 88 || ps.gcs < 8 ? "critical" : "normal");

  const vitalsConfig = [
    { key: "hr", label: t("vitals.hr"), value: `${Math.round(ps.hr)}`, unit: "bpm", icon: "❤️", warn: ps.hr > 100 || ps.hr < 50, critical: ps.hr > 130 || ps.hr < 40 },
    { key: "bp", label: t("vitals.sbp"), value: `${Math.round(ps.sbp)}/${Math.round(ps.dbp)}`, unit: `(MAP ${map})`, icon: "🩸", warn: ps.sbp < 90 || ps.sbp > 160, critical: ps.sbp < 75 || ps.sbp > 180 },
    { key: "spo2", label: "SpO₂", value: `${r1(ps.spo2)}%`, icon: "🫁", warn: ps.spo2 < 94, critical: ps.spo2 < 90 },
    { key: "rr", label: t("vitals.rr"), value: `${Math.round(ps.rr)}`, unit: "/min", icon: "💨", warn: ps.rr > 20 || ps.rr < 10, critical: ps.rr > 28 || ps.rr < 8 },
    { key: "temp", label: "t°C", value: `${r1(ps.temp)}`, unit: "°C", icon: "🌡️", warn: ps.temp > 38 || ps.temp < 36, critical: ps.temp > 39.5 || ps.temp < 35 },
    { key: "gcs", label: t("vitals.gcs"), value: `${Math.round(ps.gcs)}`, unit: "/15", icon: "🧠", warn: ps.gcs < 13, critical: ps.gcs < 9 },
    { key: "pain", label: t("vitals.pain"), value: `${r1(ps.pain)}`, unit: "/10", icon: "⚡", warn: ps.pain > 4, critical: ps.pain > 7 }
  ];

  return (
    <div style={{
      position: "sticky", top: 0, zIndex: 100, background: C.headerBg2, backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)", borderBottom: `1px solid ${C.borderBright}`, padding: compact ? "6px 12px" : "8px 16px",
      display: "flex", alignItems: "center", gap: 12, boxShadow: "0 4px 20px rgba(0,0,0,0.3)"
    }}>
      {/* Brand & Department Badge */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
        <div onClick={() => setPhase && setPhase("menu")} style={{
          width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg,rgba(0,230,200,0.2),rgba(0,150,200,0.1))",
          border: "1px solid rgba(0,230,200,0.3)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer"
        }}>
          <span style={{ fontSize: 14, color: C.accent, fontWeight: 700 }}>М</span>
        </div>
        {!compact && (
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.white, fontFamily: FONT, lineHeight: 1.1, display: "flex", alignItems: "center", gap: 6 }}>
              {cd?.name || "Patient Telemetry"}
              {phase && (
                <span style={{ fontSize: 10, color: C.accent, fontWeight: 600 }}>
                  {phase === "order_tests" ? "🔬" : phase === "awaiting_results" ? "⏳" : "📋"}
                </span>
              )}
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
        <EcgWaveform hr={ps.hr} status={status} width={compact ? 80 : 110} height={compact ? 28 : 32} />
      </div>

      {/* Telemetry Vitals Cards Container */}
      <div className="no-scrollbar" style={{ flex: 1, display: "flex", alignItems: "center", gap: compact ? 6 : 8, overflowX: "auto", minWidth: 0 }}>
        {vitalsConfig.map(v => (
          <VitalsMetricCard key={v.key} label={v.label} value={v.value} unit={compact ? "" : v.unit} trend={trend(v.key)} warn={v.warn} critical={v.critical} icon={v.icon} compact={compact} />
        ))}
      </div>

      {/* Controls (Audio, Timer, Pause, Theory) */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
        {setAudioEnabled && (
          <div onClick={() => setAudioEnabled(v => !v)} style={{
            width: 30, height: 30, borderRadius: 8, background: !audioEnabled ? "rgba(255,61,90,0.15)" : "rgba(0,230,200,0.08)",
            border: `1px solid ${!audioEnabled ? "rgba(255,61,90,0.3)" : "rgba(0,230,200,0.2)"}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer"
          }} title={audioEnabled ? "Mute telemetry audio" : "Unmute telemetry audio"}>
            <span style={{ fontSize: 13 }}>{audioEnabled ? "🔊" : "🔇"}</span>
          </div>
        )}
        {relatedTopics.length > 0 && setShowTheory && (
          <div onClick={() => setShowTheory(v => !v)} style={{
            width: 30, height: 30, borderRadius: 8, background: showTheory ? "rgba(0,230,200,0.2)" : "rgba(0,230,200,0.08)",
            border: "1px solid rgba(0,230,200,0.2)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer"
          }}>
            <span style={{ fontSize: 13 }}>📚</span>
          </div>
        )}
        {learningMode && setPaused && (
          <div onClick={() => setPaused(v => !v)} style={{
            width: 30, height: 30, borderRadius: 8, background: paused ? "rgba(245,200,66,0.2)" : "transparent",
            border: "1px solid rgba(245,200,66,0.3)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer"
          }}>
            <span style={{ fontSize: 12, color: C.yellow }}>{paused ? "▶" : "⏸"}</span>
          </div>
        )}
        {timeLeft !== undefined && (
          <div style={{ textAlign: "right", minWidth: 45 }}>
            <div style={{ fontSize: 13, fontWeight: 700, fontFamily: CODE, lineHeight: 1, color: timeLeft < 60 ? C.red : timeLeft < 180 ? C.yellow : C.accent }}>
              {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
            </div>
            <div style={{ fontSize: 8, color: C.textDim, fontFamily: FONT }}>{t("game.timeRemaining")}</div>
          </div>
        )}
      </div>
    </div>
  );
}
