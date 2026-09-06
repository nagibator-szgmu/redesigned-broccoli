import { FONT } from "../../ui/theme";
import { useTranslate } from "../../locale/useTranslate";
import { TOPICS } from "../../data/topics";
import { THEORY } from "../../data/theory";
import { DRUG_GROUPS } from "../../data/drugReference";
import { PROTOCOLS } from "../../data/protocols";

export default function TheorySidebar({
  activeItem, onSelect, setPhase, progressionMode, setProgressionMode,
  progress, expandedCats, toggleCat, calculators, C
}) {
  const { t } = useTranslate();

  return (
    <>
      <div
        onClick={() => setPhase("menu")}
        className="nav-item"
        style={{
          display: "flex", alignItems: "center", gap: 10, padding: "10px 12px",
          borderRadius: 11, marginBottom: 18, cursor: "pointer", transition: "all 0.15s",
        }}
      >
        <span style={{ fontSize: 14, color: C.textDim }}>←</span>
        <span style={{ fontSize: 13, color: C.textDim, fontFamily: FONT }}>{t("theory.back")}</span>
      </div>

      {progress && (
        <div style={{ marginBottom: 14, padding: "8px 10px", background: progressionMode === "strict" ? `${C.accent}10` : `${C.yellow}10`, border: `1px solid ${progressionMode === "strict" ? `${C.accent}33` : `${C.yellow}33`}`, borderRadius: 8 }}>
          <div onClick={() => setProgressionMode(v => v === "strict" ? "free" : "strict")} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}>
            <span style={{ fontSize: 11, color: progressionMode === "strict" ? C.accent : C.yellow, fontWeight: 600, fontFamily: FONT }}>
              {progressionMode === "strict" ? t("theory.course") : t("theory.free")}
            </span>
            <div style={{ width: 32, height: 18, borderRadius: 9, background: progressionMode === "strict" ? C.accent : `${C.textDim}30`, position: "relative", transition: "background 0.2s" }}>
              <div style={{ width: 14, height: 14, borderRadius: "50%", background: "#fff", position: "absolute", top: 2, left: progressionMode === "strict" ? 16 : 2, transition: "left 0.2s" }} />
            </div>
          </div>
          <div style={{ fontSize: 9, color: C.textDim, fontFamily: FONT, marginTop: 4 }}>
            {progressionMode === "strict" ? t("theory.courseDesc") : t("theory.freeDescShort")}
          </div>
        </div>
      )}

      <div style={{ fontSize: 10, color: C.textDim, letterSpacing: 1.5, padding: "0 10px", marginBottom: 6, fontFamily: FONT, fontWeight: 600 }}>
        {t("theory.sectionTitle")}
      </div>
      {TOPICS.map((cat) => {
        const isExpanded = expandedCats.has(cat.id);
        const catProg = progress ? progress.getCategoryProgress(cat.id) : null;
        return (
          <div key={cat.id} style={{ marginBottom: 4 }}>
            <div onClick={() => toggleCat(cat.id)} className="nav-item" style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", borderRadius: 10, cursor: "pointer", transition: "all 0.15s" }}>
              <span style={{ fontSize: 10, color: C.textDim, transition: "transform 0.15s", transform: isExpanded ? "rotate(90deg)" : "rotate(0)" }}>▶</span>
              <span style={{ fontSize: 13 }}>{cat.icon}</span>
              <span style={{ fontSize: 12, fontFamily: FONT, color: C.text, fontWeight: 500, flex: 1 }}>{cat.name}</span>
            </div>
            {isExpanded && cat.children.map((topic) => {
              const hasContent = !!THEORY[topic.id];
              const isActive = activeItem.type === "topic" && activeItem.id === topic.id;
              const isLocked = progressionMode === "strict" && progress && !progress.isTopicUnlocked(topic.id, "strict");
              const isComplete = progress && progress.isTopicComplete(topic.id);
              const topicProg = progress ? progress.getTopicProgress(topic.id) : null;
              const casesDone = topicProg ? topicProg.completedCases.length : 0;
              return (
                <div key={topic.id} onClick={() => hasContent && !isLocked && onSelect("topic", topic.id)}
                  className="nav-item" style={{
                    display: "flex", alignItems: "center", gap: 8, padding: "7px 12px 7px 34px",
                    borderRadius: 8, cursor: hasContent && !isLocked ? "pointer" : "default",
                    background: isActive ? "rgba(0,230,200,0.1)" : "transparent",
                    border: `1px solid ${isActive ? "rgba(0,230,200,0.2)" : "transparent"}`,
                    opacity: isLocked ? 0.4 : hasContent ? 1 : 0.4,
                  }}>
                  {isLocked && <span style={{ fontSize: 10 }}>🔒</span>}
                  {isComplete && <span style={{ fontSize: 10, color: C.green }}>✓</span>}
                  <span style={{ fontSize: 11, fontFamily: FONT, color: isActive ? C.accent : isLocked ? C.textDim : C.text, fontWeight: isActive ? 600 : 400, flex: 1 }}>
                    {topic.name}
                  </span>
                  {hasContent && !isLocked && topicProg && (
                    <span style={{ fontSize: 8, color: casesDone >= topic.cases.length ? C.green : C.textDim, fontFamily: FONT }}>
                      {casesDone}/{topic.cases.length}
                    </span>
                  )}
                </div>
              );
            })}
            {catProg && catProg.total > 0 && (
              <div style={{ margin: "4px 10px 6px", padding: "4px 0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
                  <span style={{ fontSize: 8, color: C.textDim, fontFamily: FONT }}>{catProg.completed}/{catProg.total} {t("theory.themes")}</span>
                  <span style={{ fontSize: 8, color: catProg.completed === catProg.total ? C.green : C.textDim, fontFamily: FONT }}>{Math.round((catProg.completed / catProg.total) * 100)}%</span>
                </div>
                <div style={{ height: 3, background: `${C.textDim}20`, borderRadius: 2, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${(catProg.completed / catProg.total) * 100}%`, background: catProg.completed === catProg.total ? C.green : C.accent }} />
                </div>
              </div>
            )}
          </div>
        );
      })}

      <div style={{ fontSize: 10, color: C.textDim, letterSpacing: 1.5, padding: "0 10px", margin: "18px 0 6px", fontFamily: FONT, fontWeight: 600 }}>
        💊 {t("theory.drugs")}
      </div>
      {DRUG_GROUPS.map((group) => {
        const isActive = activeItem.type === "drug" && activeItem.id === group.id;
        return (
          <div key={group.id} onClick={() => onSelect("drug", group.id)} className="nav-item"
            style={{
              display: "flex", alignItems: "center", gap: 8, padding: "7px 12px 7px 18px", borderRadius: 10,
              marginBottom: 2, cursor: "pointer", background: isActive ? "rgba(0,230,200,0.1)" : "transparent",
              border: `1px solid ${isActive ? "rgba(0,230,200,0.2)" : "transparent"}`,
            }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: group.color, flexShrink: 0 }} />
            <span style={{ fontSize: 12, fontFamily: FONT, color: isActive ? C.accent : C.text, fontWeight: isActive ? 600 : 400 }}>
              {group.name}
            </span>
          </div>
        );
      })}

      <div style={{ fontSize: 10, color: C.textDim, letterSpacing: 1.5, padding: "0 10px", margin: "18px 0 6px", fontFamily: FONT, fontWeight: 600 }}>
        📋 {t("theory.protocols")}
      </div>
      {Object.values(PROTOCOLS).map((proto) => {
        const isActive = activeItem.type === "protocol" && activeItem.id === proto.id;
        return (
          <div key={proto.id} onClick={() => onSelect("protocol", proto.id)} className="nav-item"
            style={{
              display: "flex", alignItems: "center", gap: 8, padding: "7px 12px 7px 18px", borderRadius: 10,
              marginBottom: 2, cursor: "pointer", background: isActive ? "rgba(0,230,200,0.1)" : "transparent",
              border: `1px solid ${isActive ? "rgba(0,230,200,0.2)" : "transparent"}`,
            }}>
            <span style={{ fontSize: 13 }}>{proto.icon}</span>
            <span style={{ fontSize: 12, fontFamily: FONT, color: isActive ? C.accent : C.text, fontWeight: isActive ? 600 : 400 }}>
              {proto.name.split("—")[0].trim()}
            </span>
          </div>
        );
      })}

      <div style={{ fontSize: 10, color: C.textDim, letterSpacing: 1.5, padding: "0 10px", margin: "18px 0 6px", fontFamily: FONT, fontWeight: 600 }}>
        🧮 {t("theory.calculators") || "Калькуляторы"}
      </div>
      {calculators.map((calc) => {
        const isActive = activeItem.type === "calc" && activeItem.id === calc.id;
        const IconComp = calc.icon;
        return (
          <div key={calc.id} onClick={() => onSelect("calc", calc.id)} className="nav-item"
            style={{
              display: "flex", alignItems: "center", gap: 8, padding: "7px 12px 7px 18px", borderRadius: 10,
              marginBottom: 2, cursor: "pointer", background: isActive ? "rgba(0,230,200,0.1)" : "transparent",
              border: `1px solid ${isActive ? "rgba(0,230,200,0.2)" : "transparent"}`,
            }}>
            <span style={{ color: isActive ? C.accent : C.textDim }}><IconComp size={14} /></span>
            <span style={{ fontSize: 12, fontFamily: FONT, color: isActive ? C.accent : C.text, fontWeight: isActive ? 600 : 400 }}>
              {calc.name}
            </span>
          </div>
        );
      })}
    </>
  );
}
