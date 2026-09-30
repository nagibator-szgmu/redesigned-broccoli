import { FONT } from "../../ui/theme";
import { useTheme } from "../../ui/ThemeContext";
import { useTranslate } from "../../locale/useTranslate";
import { STitle } from "../../ui/components";
import { IconCheckCircle, IconCheck, IconX } from "../../ui/icons";

export default function ChecklistBlock({ assessmentMode, checklistItems, checklistDone, isChecklistDone, isMobile }) {
  const C = useTheme();
  const { t } = useTranslate();

  if (!assessmentMode || checklistItems.length === 0) return null;

  return (
    <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: isMobile ? 12 : 14, padding: isMobile ? 14 : 16, marginBottom: 10 }}>
      <STitle icon={<IconCheckCircle size={15} color={C.green} />} label={t("result.checklist")} color={C.green} />
      <div style={{ fontSize: 12, color: C.textDim, marginBottom: isMobile ? 8 : 10, fontFamily: FONT }}>
        {t("result.checklistScore", { done: checklistDone, total: checklistItems.length })}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? 6 : 8 }}>
        {checklistItems.map((item, i) => {
          const done = isChecklistDone(item);
          return (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, padding: isMobile ? "6px 8px" : "7px 10px", borderRadius: isMobile ? 6 : 7, background: done ? `${C.green}10` : `${C.red}10`, border: `1px solid ${done ? C.green : C.red}22` }}>
              <span style={{ display: "inline-flex", color: done ? C.green : C.red, flexShrink: 0, marginTop: 2 }}>
                {done ? <IconCheck size={14} color={C.green} /> : <IconX size={14} color={C.red} />}
              </span>
              <span style={{ fontSize: 12, color: done ? C.green : C.red, lineHeight: 1.5, fontFamily: FONT }}>{item}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
