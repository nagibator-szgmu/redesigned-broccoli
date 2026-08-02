import { createPortal } from "react-dom";
import { FONT } from "../../ui/theme";
import { useTheme } from "../../ui/ThemeContext";
import { THEORY } from "../../data/theory";

const SECTION_KEYS = ["definition", "etiology", "pathogenesis", "clinical", "diagnostics", "treatment", "prognosis"];
const SECTION_LABELS = { definition: "Определение", etiology: "Этиология", pathogenesis: "Патогенез", clinical: "Клиника", diagnostics: "Диагностика", treatment: "Лечение", prognosis: "Прогноз" };

function TheoryContent({ topicId, C }) {
  const topic = THEORY[topicId];
  if (!topic) return null;
  return (
    <div style={{ maxWidth: 640 }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: C.white, margin: "0 0 6px", lineHeight: 1.3 }}>{topic.title}</h2>
      {topic.sources && (
        <div style={{marginBottom:20,padding:"8px 12px",borderRadius:6,background:`${C.accent}08`,border:`1px solid ${C.accent}15`}}>
          <div style={{fontSize:9,color:C.accent,letterSpacing:1,fontWeight:600,textTransform:"uppercase",marginBottom:4}}>Источники</div>
          <div style={{fontSize:11,color:C.textDim,lineHeight:1.6}}>{topic.sources}</div>
        </div>
      )}
      {SECTION_KEYS.map(key => {
        const text = topic[key];
        if (!text) return null;
        return (
          <div key={key} style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 10, color: C.accent, letterSpacing: 1.2, fontWeight: 600, textTransform: "uppercase", marginBottom: 6 }}>{SECTION_LABELS[key]}</div>
            <div style={{ fontSize: 13, color: C.text, lineHeight: 1.75, whiteSpace: "pre-wrap" }}>{text}</div>
          </div>
        );
      })}
      {topic.keyPoints?.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 10, color: C.yellow, letterSpacing: 1.2, fontWeight: 600, textTransform: "uppercase", marginBottom: 6 }}>Ключевые тезисы</div>
          {topic.keyPoints.map((p, i) => (
            <div key={i} style={{ display: "flex", gap: 8, marginBottom: 4, padding: "6px 10px", borderRadius: 6, background: "rgba(245,200,66,0.06)", border: "1px solid rgba(245,200,66,0.12)" }}>
              <span style={{ color: C.yellow, fontSize: 11 }}>•</span>
              <span style={{ fontSize: 12, color: C.text, lineHeight: 1.5 }}>{p}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function TheoryModal({ relatedTopics, showTheory, setShowTheory, activeTheoryTopic, setActiveTheoryTopic, isMobile }) {
  const C = useTheme();

  if (!showTheory) return null;

  const close = () => { setShowTheory(false); setActiveTheoryTopic(null); };

  if (isMobile) {
    return createPortal(<>
      <div style={{ position: "fixed", inset: 0, zIndex: 99998, background: "rgba(0,0,0,0.6)" }} onClick={close} />
      <div style={{ position: "fixed", top: 60, right: 12, left: 12, bottom: 60, zIndex: 99999, background: C.overlayBg, backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)", border: "1px solid rgba(0,230,200,0.2)", borderRadius: 16, boxShadow: "0 16px 48px rgba(0,0,0,0.8)", fontFamily: FONT, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderBottom: "1px solid rgba(0,230,200,0.08)", flexShrink: 0 }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: C.white }}>📚 Теория</span>
          <span onClick={close} style={{ fontSize: 12, color: C.textDim, cursor: "pointer", padding: "4px 10px", borderRadius: 6, background: C.dimBg }}>✕</span>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: 16 }}>
          {!activeTheoryTopic && relatedTopics.map(topic => {
            const hasTheory = !!THEORY[topic.id];
            return (
              <div key={topic.id} onClick={() => hasTheory && setActiveTheoryTopic(topic.id)} style={{
                display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", marginBottom: 6,
                borderRadius: 10, cursor: hasTheory ? "pointer" : "default",
                background: hasTheory ? "rgba(0,230,200,0.06)" : "transparent",
                border: `1px solid ${hasTheory ? "rgba(0,230,200,0.12)" : C.border}`,
              }}>
                <span style={{ fontSize: 14 }}>{topic.categoryIcon}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, color: hasTheory ? C.accent : C.textDim, fontWeight: hasTheory ? 600 : 400 }}>{topic.name}</div>
                  <div style={{ fontSize: 10, color: C.textDim }}>{topic.categoryName}</div>
                </div>
                {hasTheory && <span style={{ fontSize: 11, color: C.accent }}>→</span>}
              </div>
            );
          })}
          {activeTheoryTopic && (
            <>
              <div onClick={() => setActiveTheoryTopic(null)} style={{ fontSize: 12, color: C.accent, marginBottom: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>← Назад к списку</div>
              <TheoryContent topicId={activeTheoryTopic} C={C} />
            </>
          )}
        </div>
      </div>
    </>, document.body);
  }

  return createPortal(<>
    <div style={{ position: "fixed", inset: 0, zIndex: 99998, background: "rgba(0,0,0,0.5)" }} onClick={close} />
    <div style={{ position: "fixed", top: "10%", left: "15%", right: "15%", bottom: "10%", zIndex: 99999, background: C.overlayBg, backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)", border: "1px solid rgba(0,230,200,0.2)", borderRadius: 18, boxShadow: "0 20px 60px rgba(0,0,0,0.8)", fontFamily: FONT, display: "flex", overflow: "hidden" }}>
      <div style={{ width: 260, flexShrink: 0, borderRight: "1px solid rgba(0,230,200,0.08)", overflowY: "auto", padding: "16px 12px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: C.white }}>📚 Теория</span>
          <span onClick={close} style={{ fontSize: 12, color: C.textDim, cursor: "pointer", padding: "3px 8px", borderRadius: 6, background: C.dimBg }}>✕</span>
        </div>
        {relatedTopics.map(topic => {
          const hasTheory = !!THEORY[topic.id];
          const isActive = activeTheoryTopic === topic.id;
          return (
            <div key={topic.id} onClick={() => hasTheory && setActiveTheoryTopic(topic.id)} style={{
              display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", marginBottom: 3,
              borderRadius: 8, cursor: hasTheory ? "pointer" : "default",
              background: isActive ? "rgba(0,230,200,0.1)" : "transparent",
              border: `1px solid ${isActive ? "rgba(0,230,200,0.2)" : "transparent"}`,
            }}>
              <span style={{ fontSize: 12 }}>{topic.categoryIcon}</span>
              <span style={{ fontSize: 12, color: isActive ? C.accent : C.text, fontWeight: isActive ? 600 : 400, flex: 1 }}>{topic.name}</span>
              {hasTheory ? <span style={{ fontSize: 10, color: C.accent }}>→</span> : <span style={{ fontSize: 9, color: C.textDim }}>soon</span>}
            </div>
          );
        })}
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 28px" }}>
        {!activeTheoryTopic && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", opacity: 0.4 }}>
            <div style={{ textAlign: "center" }}><div style={{ fontSize: 40, marginBottom: 10 }}>📚</div><div style={{ fontSize: 13, color: C.textDim }}>Выберите тему</div></div>
          </div>
        )}
        {activeTheoryTopic && <TheoryContent topicId={activeTheoryTopic} C={C} />}
      </div>
    </div>
  </>, document.body);
}
