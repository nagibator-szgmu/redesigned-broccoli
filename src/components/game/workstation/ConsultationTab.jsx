import { useTheme } from "../../../ui/ThemeContext";
import { FONT } from "../../../ui/theme";
import { STitle, Btn } from "../../../ui/components";
import { IconLightbulb, IconTarget, IconBook, IconUser } from "../../../ui/icons";

/** Guidelines & AI consultation tab component */
export default function ConsultationTab({
  cd,
  learningTip,
  relatedTopics = [],
  setShowTheory,
  t
}) {
  const C = useTheme();

  return (
    <div style={{ height: "100%", padding: "12px 14px", overflowY: "auto", boxSizing: "border-box", display: "flex", flexDirection: "column", gap: 12 }}>
      <STitle icon={<IconLightbulb size={16} color={C.yellow} />} label={t("theory.consultation") || "Клинические рекомендации & Консультация"} color={C.yellow} />

      {/* Case Tip / Protocol Reference */}
      {cd?.tip && (
        <div style={{ background: `${C.yellow}12`, border: `1px solid ${C.yellow}33`, borderRadius: 12, padding: "12px 14px" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.yellow, fontFamily: FONT, marginBottom: 4, display: "flex", alignItems: "center", gap: 6 }}>
            <IconTarget size={14} color={C.yellow} /> {t("theory.clinicalGuideline") || "Клинический протокол"}
          </div>
          <div style={{ fontSize: 12, color: C.text, fontFamily: FONT, lineHeight: 1.6 }}>
            {cd.tip}
          </div>
        </div>
      )}

      {/* Source Clinical Recommendation */}
      {cd?.sourceReference && (
        <div style={{ background: `${C.accent}0a`, border: `1px solid ${C.border}`, borderRadius: 12, padding: "12px 14px" }}>
          <div style={{ fontSize: 10, color: C.textDim, textTransform: "uppercase", letterSpacing: 1, fontFamily: FONT, fontWeight: 600, marginBottom: 4, display: "flex", alignItems: "center", gap: 6 }}>
            <IconBook size={14} color={C.textDim} /> {t("theory.sourceRef") || "Источник (КР Минздрава РФ)"}
          </div>
          <div style={{ fontSize: 12, color: C.accent, fontFamily: FONT, fontWeight: 600 }}>
            {cd.sourceReference.name} ({cd.sourceReference.year})
          </div>
        </div>
      )}

      {/* Mentor Advice */}
      {learningTip && (
        <div style={{ background: `${C.purple}14`, border: `1px solid ${C.purple}44`, borderRadius: 12, padding: "12px 14px" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.purple, fontFamily: FONT, marginBottom: 4, display: "flex", alignItems: "center", gap: 6 }}>
            <IconUser size={14} color={C.purple} /> {t("theory.mentorAdvice") || "Совет наставника"}
          </div>
          <div style={{ fontSize: 12, color: C.text, fontFamily: FONT, lineHeight: 1.6 }}>
            {learningTip}
          </div>
        </div>
      )}

      {/* Related Theory Topics Button */}
      {relatedTopics.length > 0 && setShowTheory && (
        <div style={{ marginTop: "auto", paddingTop: 8 }}>
          <Btn
            onClick={() => setShowTheory(true)}
            color={C.accent}
            style={{ width: "100%", padding: "10px", fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
          >
            <IconBook size={16} color={C.bg} /> {t("theory.openTheory") || "Открыть материалы по теме"}
          </Btn>
        </div>
      )}
    </div>
  );
}
