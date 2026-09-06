import { FONT } from "../../ui/theme";
import { useTranslate } from "../../locale/useTranslate";
import { TOPICS } from "../../data/topics";
import { THEORY } from "../../data/theory";
import TheoryCurriculumBox from "./TheoryCurriculumBox";

const SECTIONS = ["definition", "etiology", "pathogenesis", "clinical", "diagnostics", "treatment", "prognosis"];

export default function TheoryContent({ data, C, topicId, onQuiz, progress, startGame, progressionMode }) {
  const { t } = useTranslate();
  if (!data) return null;

  return (
    <div style={{ maxWidth: 720 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, color: C.white, fontFamily: FONT, margin: "0 0 6px", lineHeight: 1.3 }}>
        {data.title}
      </h1>

      {progressionMode === "free" && (() => {
        const cat = TOPICS.find(c => c.children.some(t => t.id === topicId));
        if (!cat) return null;
        const sorted = [...cat.children].sort((a, b) => a.order - b.order);
        const idx = sorted.findIndex(t => t.id === topicId);
        if (idx <= 0) return null;
        const prevTopic = sorted[idx - 1];
        if (!prevTopic || !THEORY[prevTopic.id]) return null;
        return (
          <div style={{ marginBottom: 12, padding: "8px 12px", background: `${C.yellow}08`, border: `1px solid ${C.yellow}22`, borderRadius: 8, fontSize: 12, color: C.yellow, fontFamily: FONT }}>
            💡 {t("theory.recommend")} {prevTopic.name}
          </div>
        );
      })()}

      {SECTIONS.map((key) => {
        const text = data[key];
        if (!text) return null;
        return (
          <div key={key} style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 11, color: C.accent, letterSpacing: 1.2, fontWeight: 600, textTransform: "uppercase", marginBottom: 8 }}>
              {t(`theory.section.${key}`)}
            </div>
            <div style={{ fontSize: 14, color: C.text, lineHeight: 1.7, whiteSpace: "pre-wrap", fontFamily: FONT }}>
              {text}
            </div>
          </div>
        );
      })}

      {data.keyPoints?.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 11, color: C.yellow, letterSpacing: 1.2, fontWeight: 600, textTransform: "uppercase", marginBottom: 8 }}>
            {t("theory.keyPoints")}
          </div>
          {data.keyPoints.map((point, i) => (
            <div key={i} style={{ display: "flex", gap: 10, marginBottom: 6, padding: "8px 12px", borderRadius: 8, background: "rgba(245,200,66,0.06)", border: "1px solid rgba(245,200,66,0.12)" }}>
              <span style={{ color: C.yellow, fontSize: 12, flexShrink: 0 }}>•</span>
              <span style={{ fontSize: 13, color: C.text, fontFamily: FONT, lineHeight: 1.5 }}>{point}</span>
            </div>
          ))}
        </div>
      )}

      {data.differences && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 11, color: C.purple, letterSpacing: 1.2, fontWeight: 600, textTransform: "uppercase", marginBottom: 8 }}>
            {t("theory.differences")}
          </div>
          <div style={{ fontSize: 13, color: C.text, lineHeight: 1.7, fontFamily: FONT, padding: "10px 14px", borderRadius: 10, background: "rgba(157,111,245,0.06)", border: "1px solid rgba(157,111,245,0.12)" }}>
            {data.differences}
          </div>
        </div>
      )}

      {data.relatedTopics?.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 11, color: C.textDim, letterSpacing: 1.2, fontWeight: 600, textTransform: "uppercase", marginBottom: 8 }}>
            {t("theory.relatedTopics")}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {data.relatedTopics.map((relId) => {
              const topic = THEORY[relId];
              return topic ? (
                <span key={relId} style={{ fontSize: 11, padding: "4px 10px", borderRadius: 6, background: C.btnBg, border: `1px solid ${C.btnBorder}`, color: C.text, fontFamily: FONT }}>
                  {topic.title}
                </span>
              ) : null;
            })}
          </div>
        </div>
      )}

      {data.sources && (
        <div style={{ marginTop: 24, marginBottom: 24, padding: "10px 14px", borderRadius: 8, background: `${C.accent}08`, border: `1px solid ${C.accent}18` }}>
          <div style={{ fontSize: 10, color: C.accent, letterSpacing: 1, fontWeight: 600, textTransform: "uppercase", marginBottom: 4 }}>
            {t("theory.sources")}
          </div>
          <div style={{ fontSize: 11, color: C.textDim, fontFamily: FONT, lineHeight: 1.6 }}>
            {data.sources}
          </div>
        </div>
      )}

      <TheoryCurriculumBox topicId={topicId} onQuiz={onQuiz} progress={progress} startGame={startGame} C={C} />
    </div>
  );
}
