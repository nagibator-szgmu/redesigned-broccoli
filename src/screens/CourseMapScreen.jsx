import { useTranslate } from "../locale/useTranslate";
import { useTheme } from "../ui/ThemeContext";
import { FONT, CODE } from "../ui/theme";
import { TOPICS } from "../data/topics";
import {
  IconCardiac, IconNeuro, IconRespiratory, IconInfectious,
  IconEndocrine, IconToxicology, IconAbdominal, IconLock
} from "../ui/icons";

const CAT_ICONS = {
  cardiology: IconCardiac,
  neurology: IconNeuro,
  respiratory: IconRespiratory,
  infectious: IconInfectious,
  endocrine: IconEndocrine,
  toxicology: IconToxicology,
  abdominal: IconAbdominal,
};

export default function CourseMapScreen({ setPhase, progress, setActiveTab }) {
  const C = useTheme();
  const { t } = useTranslate();

  // Flatten all topics to a single linear sequence for the path
  const allSteps = [];
  TOPICS.forEach((cat) => {
    const IconComp = CAT_ICONS[cat.id] || IconCardiac;
    cat.children.forEach((topic) => {
      allSteps.push({
        id: topic.id,
        name: topic.name,
        icon: <IconComp size={18} color="currentColor" />,
        catName: cat.name,
        catColor: cat.id === "cardiology" ? C.red : cat.id === "neurology" ? C.purple : C.accent
      });
    });
  });

  return (
    <div style={{
      height: "100vh", display: "flex", flexDirection: "column",
      background: C.bgGrad, fontFamily: FONT, overflow: "hidden"
    }}>
      {/* Header */}
      <header style={{
        height: 54, background: C.headerBg, backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)", borderBottom: "1px solid rgba(0,230,200,0.06)",
        display: "flex", alignItems: "center", gap: 10, padding: "0 20px", flexShrink: 0
      }}>
        <div onClick={() => {
          if (setActiveTab) setActiveTab("cases");
          setPhase("menu");
        }} style={{ fontSize: 16, color: C.accent, cursor: "pointer" }}>←</div>
        <span style={{ fontSize: 15, fontWeight: 700, color: C.white }}>{t("nav.map")}</span>
      </header>

      {/* Main Path Area */}
      <div style={{ flex: 1, overflowY: "auto", padding: "40px 20px", position: "relative" }}>
        {/* Glow Effects */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0 }}>
          <div style={{ position: "absolute", left: "20%", top: "10%", width: 300, height: 300, background: C.glowBg1, borderRadius: "50%" }} />
          <div style={{ position: "absolute", right: "20%", bottom: "20%", width: 300, height: 300, background: C.glowBg2, borderRadius: "50%" }} />
        </div>

        <div style={{ maxWidth: 600, margin: "0 auto", position: "relative", zIndex: 1 }}>
          {/* Path SVG line */}
          <svg style={{
            position: "absolute", left: "50%", transform: "translateX(-50%)",
            width: 120, height: allSteps.length * 120, top: 40, zIndex: 0, pointerEvents: "none"
          }}>
            {allSteps.map((step, idx) => {
              if (idx === allSteps.length - 1) return null;
              const isPassed = progress ? progress.isTopicComplete(step.id) : false;
              // Alternating coordinates for snake-like path
              const startX = 60 + (idx % 2 === 0 ? -25 : 25);
              const endX = 60 + ((idx + 1) % 2 === 0 ? -25 : 25);
              const startY = idx * 120 + 30;
              const endY = (idx + 1) * 120 + 30;

              return (
                <line
                  key={step.id}
                  x1={startX} y1={startY}
                  x2={endX} y2={endY}
                  stroke={isPassed ? C.green : C.btnBorder}
                  strokeWidth="3.5"
                  strokeDasharray={isPassed ? "none" : "6,6"}
                  style={{ transition: "stroke 0.4s" }}
                />
              );
            })}
          </svg>

          {/* Node items */}
          <div style={{ display: "flex", flexDirection: "column", gap: 60, position: "relative", zIndex: 1 }}>
            {allSteps.map((step, idx) => {
              const isPassed = progress ? progress.isTopicComplete(step.id) : false;
              const isUnlocked = progress ? progress.isTopicUnlocked(step.id, "strict") : true;
              const isCurrent = isUnlocked && !isPassed;

              // Alternating alignment
              const alignLeft = idx % 2 === 0;

              return (
                <div key={step.id} style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                  height: 60
                }}>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    flexDirection: alignLeft ? "row-reverse" : "row",
                    width: "100%",
                    maxWidth: 420,
                    gap: 16
                  }}>
                    {/* Node bubble */}
                    <div
                      onClick={() => {
                        if (isUnlocked) {
                          setPhase("theory");
                        }
                      }}
                      className="icon-btn"
                      style={{
                        width: 58,
                        height: 58,
                        borderRadius: "50%",
                        background: isPassed ? `${C.green}14` : isCurrent ? `${C.accent}14` : C.btnBg,
                        border: `2px solid ${isPassed ? C.green : isCurrent ? C.accent : C.btnBorder}`,
                        boxShadow: isPassed ? `0 0 16px ${C.green}44` : isCurrent ? `0 0 16px ${C.accent}44` : "none",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 20,
                        cursor: isUnlocked ? "pointer" : "not-allowed",
                        flexShrink: 0,
                        transition: "all 0.25s ease",
                        position: "relative"
                      }}
                      title={isUnlocked ? step.name : "Заблокировано"}
                    >
                      {isUnlocked ? step.icon : <IconLock size={18} color={C.textDim} />}
                      {/* Sub-step indicator */}
                      <div style={{
                        position: "absolute", bottom: -2, right: -2, width: 20, height: 20,
                        borderRadius: "50%", background: C.panel, border: `1px solid ${isPassed ? C.green : C.border}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 9, fontWeight: 700, fontFamily: CODE, color: isPassed ? C.green : C.textDim
                      }}>
                        {idx + 1}
                      </div>
                    </div>

                    {/* Label */}
                    <div style={{
                      flex: 1,
                      textAlign: alignLeft ? "right" : "left",
                      opacity: isUnlocked ? 1 : 0.4
                    }}>
                      <div style={{ fontSize: 9.5, color: step.catColor, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 2 }}>{step.catName}</div>
                      <div style={{ fontSize: 13, color: isCurrent ? C.white : C.text, fontWeight: isCurrent ? 600 : 500 }}>{step.name}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
