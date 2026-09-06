import { FONT } from "../../ui/theme";
import { useTranslate } from "../../locale/useTranslate";

export default function ProtocolContent({ protocol, C }) {
  const { t } = useTranslate();
  if (!protocol) return null;

  return (
    <div style={{ maxWidth: 720 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
        <span style={{ fontSize: 28 }}>{protocol.icon}</span>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: C.white, fontFamily: FONT, margin: 0 }}>
            {protocol.name}
          </h1>
          <div style={{ fontSize: 12, color: C.textDim, fontFamily: FONT, marginTop: 4 }}>
            {t("protocols.source")}: {protocol.source}
          </div>
        </div>
      </div>

      {protocol.sections.map((section, i) => (
        <div key={i} style={{ marginBottom: 24 }}>
          <div style={{
            fontSize: 11, color: protocol.color, letterSpacing: 1.2, fontWeight: 600,
            textTransform: "uppercase", marginBottom: 8,
          }}>
            {section.title}
          </div>
          <div style={{
            fontSize: 14, color: C.text, lineHeight: 1.8, whiteSpace: "pre-wrap", fontFamily: FONT,
          }}>
            {section.content}
          </div>
        </div>
      ))}

      {protocol.keyPoints.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div style={{
            fontSize: 11, color: C.yellow, letterSpacing: 1.2, fontWeight: 600,
            textTransform: "uppercase", marginBottom: 8,
          }}>
            {t("protocols.keyPoints")}
          </div>
          {protocol.keyPoints.map((point, i) => (
            <div key={i} style={{
              display: "flex", gap: 10, marginBottom: 6, padding: "8px 12px", borderRadius: 8,
              background: "rgba(245,200,66,0.06)", border: "1px solid rgba(245,200,66,0.12)",
            }}>
              <span style={{ color: C.yellow, fontSize: 12, flexShrink: 0 }}>•</span>
              <span style={{ fontSize: 13, color: C.text, fontFamily: FONT, lineHeight: 1.5 }}>{point}</span>
            </div>
          ))}
        </div>
      )}

      {protocol.relatedCases.length > 0 && (
        <div>
          <div style={{
            fontSize: 11, color: C.accent, letterSpacing: 1.2, fontWeight: 600,
            textTransform: "uppercase", marginBottom: 8,
          }}>
            {t("protocols.relatedCases")}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {protocol.relatedCases.map(caseId => (
              <span key={caseId} style={{
                fontSize: 12, padding: "5px 12px", borderRadius: 8,
                background: "rgba(0,230,200,0.08)", border: "1px solid rgba(0,230,200,0.15)",
                color: C.accent, fontFamily: FONT,
              }}>
                #{caseId}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
