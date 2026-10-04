import { FONT_BODY } from "../../ui/theme";
import { useTranslate } from "../../locale/useTranslate";
import { THEORY } from "../../data/theory";
import {
  IconLock,
  IconCheck,
  IconChevronRight,
  IconCardiac,
  IconNeuro,
  IconRespiratory,
  IconInfectious,
  IconEndocrine,
  IconToxicology,
  IconGastro,
  IconFileText,
} from "../../ui/icons";

const CATEGORY_ICONS = {
  cardiology: IconCardiac,
  neurology: IconNeuro,
  pulmonology: IconRespiratory,
  infectious: IconInfectious,
  endocrine: IconEndocrine,
  toxicology: IconToxicology,
  gastroenterology: IconGastro,
};

export default function TheorySidebarTopics({
  topics, expandedCats, toggleCat, progress,
  progressionMode, activeItem, onSelect, C
}) {
  const { t } = useTranslate();

  return (
    <div>
      {topics.map((cat) => {
        const isExpanded = expandedCats.has(cat.id);
        const catProg = progress ? progress.getCategoryProgress(cat.id) : null;
        const CatIcon = CATEGORY_ICONS[cat.id] || IconFileText;
        return (
          <div key={cat.id} style={{ marginBottom: 4 }}>
            <div onClick={() => toggleCat(cat.id)} className="nav-item" style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", borderRadius: 10, cursor: "pointer", transition: "all 0.15s" }}>
              <span style={{ fontSize: 10, color: C.textDim, transition: "transform 0.15s", transform: isExpanded ? "rotate(90deg)" : "rotate(0)", display: "inline-flex" }}>
                <IconChevronRight size={12} />
              </span>
              <span style={{ display: "inline-flex", color: C.accent }}><CatIcon size={16} /></span>
              <span style={{ fontSize: 12, fontFamily: FONT_BODY, color: C.text, fontWeight: 500, flex: 1 }}>{cat.name}</span>
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
                    background: isActive ? C.accentDim : "transparent",
                    border: `1px solid ${isActive ? `${C.accent}33` : "transparent"}`,
                    opacity: isLocked ? 0.4 : hasContent ? 1 : 0.4,
                  }}>
                  {isLocked && <IconLock size={12} color={C.textDim} />}
                  {isComplete && <IconCheck size={12} color={C.green} />}
                  <span style={{ fontSize: 11, fontFamily: FONT_BODY, color: isActive ? C.accent : isLocked ? C.textDim : C.text, fontWeight: isActive ? 600 : 400, flex: 1 }}>
                    {topic.name}
                  </span>
                  {hasContent && !isLocked && topicProg && (
                    <span style={{ fontSize: 8, color: casesDone >= topic.cases.length ? C.green : C.textDim, fontFamily: FONT_BODY }}>
                      {casesDone}/{topic.cases.length}
                    </span>
                  )}
                </div>
              );
            })}
            {catProg && catProg.total > 0 && (
              <div style={{ margin: "4px 10px 6px", padding: "4px 0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
                  <span style={{ fontSize: 8, color: C.textDim, fontFamily: FONT_BODY }}>{catProg.completed}/{catProg.total} {t("theory.themes")}</span>
                  <span style={{ fontSize: 8, color: catProg.completed === catProg.total ? C.green : C.textDim, fontFamily: FONT_BODY }}>{Math.round((catProg.completed / catProg.total) * 100)}%</span>
                </div>
                <div style={{ height: 3, background: `${C.textDim}20`, borderRadius: 2, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${(catProg.completed / catProg.total) * 100}%`, background: catProg.completed === catProg.total ? C.green : C.accent }} />
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
