import { FONT, CODE } from "../../ui/theme";
import { useTheme } from "../../ui/ThemeContext";
import { useTranslate } from "../../locale/useTranslate";
import { STitle } from "../../ui/components";

export default function EventLog({ eventLog, isMobile }) {
  const C = useTheme();
  const { t } = useTranslate();

  if (!eventLog || eventLog.length <= 1) return null;

  // Analyze events for smart review
  const analyzedEvents = [];
  let firstActionTime = null;

  eventLog.forEach((e, idx) => {
    // Parse time MM:SS
    const parts = e.elapsed.split(":");
    const seconds = parts.length === 2 ? parseInt(parts[0]) * 60 + parseInt(parts[1]) : 0;

    // Check for first action (tests ordered or treatment applied)
    if (idx > 0 && !firstActionTime && (e.text.includes("Назначен") || e.text.includes("применено") || e.text.includes("исследований"))) {
      firstActionTime = e.elapsed;
      if (seconds > 60) {
        analyzedEvents.push({
          id: `anal_delay`,
          elapsed: e.elapsed,
          type: "analysis_warning",
          text: `⚠️ Анализ: Первое действие совершено спустя ${e.elapsed}. Задержка начала помощи ухудшает прогноз пациента.`
        });
      }
    }

    analyzedEvents.push(e);

    // Highlight critical deterioration
    if (e.type === "critical") {
      analyzedEvents.push({
        id: `anal_crit_${idx}`,
        elapsed: e.elapsed,
        type: "analysis_info",
        text: `💡 Совет: Состояние пациента критическое. Своевременная интубация или подача кислорода помогают выиграть время.`
      });
    }
  });

  return (
    <div style={{
      background: `linear-gradient(135deg, ${C.panel}b3, ${C.panel}66)`,
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
      border: `1px solid ${C.border}`,
      borderRadius: isMobile ? 12 : 14,
      padding: isMobile ? 14 : 16,
      marginBottom: isMobile ? 16 : 18,
      boxShadow: "0 8px 32px 0 rgba(0,0,0,0.3)"
    }}>
      <STitle icon="📋" label={t("result.timeline")} color={C.textDim} />
      <div style={{ maxHeight: isMobile ? 160 : 200, overflowY: "auto", display: "flex", flexDirection: "column", gap: 6 }}>
        {analyzedEvents.map((e) => {
          let col = C.textDim;
          let bg = "transparent";
          let border = "none";
          let padding = "0";
          let radius = "0";

          if (e.type === "critical") {
            col = C.red;
            bg = `${C.red}0d`;
            border = `1px solid ${C.red}25`;
            padding = "4px 8px";
            radius = "6px";
          } else if (e.type === "warning" || e.type === "adverse") {
            col = C.yellow;
            bg = `${C.yellow}0d`;
            border = `1px solid ${C.yellow}25`;
            padding = "4px 8px";
            radius = "6px";
          } else if (e.type === "treatment") {
            col = C.green;
          } else if (e.type === "result") {
            col = C.accent;
          } else if (e.type === "analysis_warning") {
            col = C.yellow;
            bg = `${C.yellow}12`;
            border = `1px solid ${C.yellow}3b`;
            padding = "6px 10px";
            radius = "8px";
          } else if (e.type === "analysis_info") {
            col = C.accent;
            bg = `${C.accent}12`;
            border = `1px solid ${C.accent}3b`;
            padding = "6px 10px";
            radius = "8px";
          }

          return (
            <div key={e.id} style={{
              display: "flex",
              gap: isMobile ? 8 : 10,
              background: bg,
              border: border,
              padding: padding,
              borderRadius: radius,
              alignItems: "flex-start",
              transition: "all 0.2s"
            }}>
              <span style={{
                fontSize: isMobile ? 11 : 12,
                color: C.textDim,
                fontFamily: CODE,
                flexShrink: 0,
                minWidth: isMobile ? 32 : 36,
                marginTop: 2
              }}>{e.elapsed}</span>
              <span style={{
                fontSize: isMobile ? 11.5 : 12.5,
                color: col,
                fontFamily: FONT,
                lineHeight: 1.4
              }}>{e.text}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
