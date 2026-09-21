import React from "react";
import { RADIUS } from "../../../ui/theme";
import { useTheme } from "../../../ui/ThemeContext";
import { useTranslate } from "../../../locale/useTranslate";
import { STitle } from "../../../ui/components";
import { DocLayer, ProtocolReferences, RelatedTheory } from "../index";

/**
 * ResultTheoryTab — Вкладка «Обоснование и теория».
 * 
 * Содержит патофизиологическое обоснование, ссылки на Клинические
 * рекомендации Минздрава РФ, протоколы оказания помощи и учебные темы.
 */
export default function ResultTheoryTab({
  cd,
  extraResult,
  vitalDeltas,
  selTreat,
  relatedProtocols,
  relatedTopics,
  setPhase,
  isMobile,
}) {
  const C = useTheme();
  const { t } = useTranslate();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {/* Патофизиология */}
      {cd?.debrief?.explain && (
        <div
          style={{
            background: C.panel,
            border: `1px solid ${C.accentDim}`,
            borderRadius: isMobile ? RADIUS.sm : RADIUS.md,
            padding: isMobile ? 12 : 16,
          }}
        >
          <STitle icon="🔬" label={t("result.pathophys")} color={C.accent} />
          <p style={{ color: C.text, fontSize: 13, lineHeight: 1.8, margin: "8px 0 0" }}>
            {cd.debrief.explain}
          </p>
        </div>
      )}

      {/* Клинический совет */}
      {cd?.tip && (
        <div
          style={{
            background: C.panel,
            border: `1px solid ${C.accentDim}`,
            borderRadius: isMobile ? RADIUS.sm : RADIUS.md,
            padding: isMobile ? 12 : 16,
          }}
        >
          <STitle icon="💡" label={t("result.debrief")} color={C.accent} />
          <p style={{ color: C.text, fontSize: 13, lineHeight: 1.8, margin: "8px 0 0" }}>
            {cd.tip}
          </p>
        </div>
      )}

      {/* Источник КР Минздрава РФ */}
      {cd?.sourceReference && (
        <div
          style={{
            background: C.panel,
            border: `1px solid ${C.accentDim}`,
            borderRadius: isMobile ? RADIUS.sm : RADIUS.md,
            padding: isMobile ? 12 : 16,
          }}
        >
          <STitle icon="📖" label={t("sourceRef.title")} color={C.accent} />
          <div style={{ fontSize: 12.5, color: C.text, marginTop: 6, lineHeight: 1.6 }}>
            {t("sourceRef.label")}: <span style={{ color: C.accent, fontWeight: 600 }}>{cd.sourceReference.name}</span>
            {cd.sourceReference.year ? <span style={{ color: C.textDim }}> ({cd.sourceReference.year})</span> : null}
          </div>
        </div>
      )}

      {/* Медицинская выписка / карта */}
      <DocLayer cd={cd} extraResult={extraResult} vitalDeltas={vitalDeltas} selTreat={selTreat} isMobile={isMobile} />

      {/* Протоколы и связанные темы */}
      <ProtocolReferences protocols={relatedProtocols} setPhase={setPhase} isMobile={isMobile} />
      <RelatedTheory topics={relatedTopics} setPhase={setPhase} isMobile={isMobile} />
    </div>
  );
}
