import { FONT } from "../../ui/theme";
import { useTheme } from "../../ui/ThemeContext";
import { useTranslate } from "../../locale/useTranslate";
import { STitle } from "../../ui/components";
import {
  IconBook,
  IconCardiac,
  IconNeuro,
  IconRespiratory,
  IconInfectious,
  IconEndocrine,
  IconToxicology,
  IconAlertTriangle,
  IconGastro,
} from "../../ui/icons";
import { THEORY } from "../../data/theory";

const CATEGORY_ICONS = {
  cardiology: IconCardiac,
  neurology: IconNeuro,
  pulmonology: IconRespiratory,
  infectious: IconInfectious,
  endocrine: IconEndocrine,
  toxicology: IconToxicology,
  trauma: IconAlertTriangle,
  gastroenterology: IconGastro,
};

export default function RelatedTheory({ topics, setPhase, isMobile }) {
  const C = useTheme();
  const { t } = useTranslate();

  if (!topics.length) return null;

  return (
    <div style={{ background: C.panel, border: `1px solid ${C.accentDim}`, borderRadius: isMobile ? 12 : 14, padding: isMobile ? 14 : 16, marginBottom: 10 }}>
      <STitle icon={<IconBook size={15} color={C.accent} />} label={t("result.relatedTheory")} color={C.accent} />
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2,1fr)", gap: isMobile ? 6 : 8 }}>
        {topics.map(topic => {
          const hasTheory = !!THEORY[topic.id];
          const CatIcon = CATEGORY_ICONS[topic.categoryId] || IconBook;
          return (
            <div
              key={topic.id}
              onClick={() => hasTheory && setPhase("theory")}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: isMobile ? "8px 10px" : "10px 12px",
                borderRadius: isMobile ? 8 : 10,
                cursor: hasTheory ? "pointer" : "default",
                background: hasTheory ? `${C.accent}06` : "transparent",
                border: `1px solid ${hasTheory ? `${C.accent}12` : isMobile ? "transparent" : C.border}`,
              }}
            >
              <span style={{ display: "inline-flex", color: C.accent, flexShrink: 0 }}>
                <CatIcon size={isMobile ? 15 : 18} />
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: isMobile ? 12 : 13, color: hasTheory ? C.accent : C.textDim, fontWeight: hasTheory ? 600 : 400, fontFamily: FONT }}>{topic.name}</div>
                <div style={{ fontSize: 10, color: C.textDim, fontFamily: FONT }}>{topic.categoryName}</div>
              </div>
              {hasTheory ? (
                <span style={{ fontSize: isMobile ? 10 : 11, color: C.accent, padding: isMobile ? "2px 8px" : "3px 10px", borderRadius: isMobile ? 5 : 6, background: `${C.accent}10`, fontFamily: FONT }}>→</span>
              ) : (
                <span style={{ fontSize: 9, color: C.textDim, padding: "2px 6px", borderRadius: 4, background: C.btnBg, fontFamily: FONT }}>soon</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
