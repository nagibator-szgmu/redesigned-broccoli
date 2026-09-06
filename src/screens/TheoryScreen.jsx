import { useState, useEffect } from "react";
import { FONT } from "../ui/theme";
import { useTheme } from "../ui/ThemeContext";
import { useTranslate } from "../locale/useTranslate";
import useIsMobile from "../hooks/useIsMobile";
import { TOPICS } from "../data/topics";
import { THEORY } from "../data/theory";
import { DRUG_REFERENCE, DRUG_GROUPS } from "../data/drugReference";
import { PROTOCOLS } from "../data/protocols";
import QuizModal from "./QuizModal";
import CalculatorContent from "./CalculatorContent";
import { IconBrain, IconChartBar, IconMicroscope } from "../ui/icons";
import TheorySidebar from "./theory/TheorySidebar";
import TheoryContent from "./theory/TheoryContent";
import ProtocolContent from "./theory/ProtocolContent";
import DrugGroupView from "./theory/DrugGroupView";
import ProgressionModeModal from "./theory/ProgressionModeModal";

const CALCULATORS = [
  { id: "gcs", name: "Шкала Глазго (GCS)", icon: IconBrain },
  { id: "sofa", name: "Шкала SOFA", icon: IconChartBar },
  { id: "lrinec", name: "Шкала LRINEC (Некр. фасциит)", icon: IconMicroscope }
];

export default function TheoryScreen({
  setPhase, startGame, progress, progressionMode,
  setProgressionMode, progressionChosen, setProgressionChosen
}) {
  const C = useTheme();
  const isMobile = useIsMobile();
  const { t } = useTranslate();

  const [activeItem, setActiveItem] = useState({ type: null, id: null });
  const [showQuiz, setShowQuiz] = useState(false);
  const [expandedCats, setExpandedCats] = useState(() => new Set(TOPICS.map((c) => c.id)));

  useEffect(() => {
    if (progress?.curriculum?.quizPending && !activeItem.id) {
      setActiveItem({ type: "topic", id: progress.curriculum.topicId });
    }
  }, []);

  const toggleCat = (id) =>
    setExpandedCats((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const handleSelect = (type, id) => setActiveItem({ type, id });

  const renderContent = () => {
    const { type, id } = activeItem;
    if (type === "topic" && THEORY[id]) {
      return (
        <TheoryContent
          data={THEORY[id]} topicId={id} C={C} onQuiz={() => setShowQuiz(true)}
          progress={progress} startGame={startGame} progressionMode={progressionMode}
        />
      );
    }
    if (type === "drug") {
      const drugs = DRUG_REFERENCE.filter((d) => d.group === id);
      const groupName = DRUG_GROUPS.find((g) => g.id === id)?.name || t("theory.drugs");
      return <DrugGroupView drugs={drugs} groupName={groupName} C={C} />;
    }
    if (type === "protocol" && PROTOCOLS[id]) {
      return <ProtocolContent protocol={PROTOCOLS[id]} C={C} />;
    }
    if (type === "calc") {
      return <CalculatorContent calcId={id} C={C} />;
    }
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", opacity: 0.4 }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📚</div>
          <div style={{ fontSize: 14, color: C.textDim, fontFamily: FONT }}>{t("theory.selectTopic")}</div>
        </div>
      </div>
    );
  };

  const getActiveTitle = () => {
    const { type, id } = activeItem;
    if (type === "topic") return THEORY[id]?.title || t("theory.sectionTitle");
    if (type === "drug") return DRUG_GROUPS.find((g) => g.id === id)?.name || t("theory.drugs");
    if (type === "protocol") return PROTOCOLS[id]?.name || t("theory.protocols");
    if (type === "calc") return CALCULATORS.find((cl) => cl.id === id)?.name || "Калькулятор";
    return t("theory.sectionTitle");
  };

  const sidebarProps = {
    activeItem, onSelect: handleSelect, setPhase, progressionMode, setProgressionMode,
    progress, expandedCats, toggleCat, calculators: CALCULATORS, C
  };

  if (isMobile) {
    return (
      <div style={{ minHeight: "100vh", background: C.bgGrad, fontFamily: FONT, overflowY: "auto" }}>
        <div style={{
          position: "sticky", top: 0, zIndex: 100, height: 54, background: C.headerBg,
          backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", borderBottom: `1px solid ${C.border}`,
          display: "flex", alignItems: "center", gap: 10, padding: "0 16px"
        }}>
          <div onClick={() => activeItem.id ? setActiveItem({ type: null, id: null }) : setPhase("menu")}
            style={{ fontSize: 16, color: C.accent, cursor: "pointer" }}>←</div>
          <span style={{ fontSize: 15, fontWeight: 700, color: C.white, fontFamily: FONT }}>{getActiveTitle()}</span>
        </div>
        <div style={{ padding: 16 }}>{activeItem.id ? renderContent() : <TheorySidebar {...sidebarProps} />}</div>
        {!progressionChosen && <ProgressionModeModal C={C} onChoose={(m) => { setProgressionMode(m); setProgressionChosen(true); }} />}
        {showQuiz && activeItem.type === "topic" && (
          <QuizModal topicId={activeItem.id} onClose={() => setShowQuiz(false)}
            onResult={(passed, score) => { if (progress) progress.completeQuiz(activeItem.id, passed, score); }} />
        )}
      </div>
    );
  }

  return (
    <div style={{ display: "flex", height: "100vh", background: C.bgGrad, overflow: "hidden" }}>
      <div style={{ width: 270, borderRight: `1px solid ${C.border}`, display: "flex", flexDirection: "column", background: C.panelBg, flexShrink: 0 }}>
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 12px" }}>
          <TheorySidebar {...sidebarProps} />
        </div>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "32px 48px" }}>
        {renderContent()}
      </div>
      {!progressionChosen && <ProgressionModeModal C={C} onChoose={(m) => { setProgressionMode(m); setProgressionChosen(true); }} />}
      {showQuiz && activeItem.type === "topic" && (
        <QuizModal topicId={activeItem.id} onClose={() => setShowQuiz(false)}
          onResult={(passed, score) => { if (progress) progress.completeQuiz(activeItem.id, passed, score); }} />
      )}
    </div>
  );
}
