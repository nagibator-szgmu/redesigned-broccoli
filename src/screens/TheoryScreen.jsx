import { useState, useEffect } from "react";
import { FONT } from "../ui/theme";
import { useTheme } from "../ui/ThemeContext";
import { useTranslate } from "../locale/useTranslate";
import useIsMobile from "../hooks/useIsMobile";
import { TOPICS } from "../data/topics";
import { THEORY } from "../data/theory";
import { DRUG_REFERENCE, DRUG_GROUPS } from "../data/drugReference";
import { QUIZ_QUESTIONS } from "../data/quiz";
import { PROTOCOLS } from "../data/protocols";
import QuizModal from "./QuizModal";
import CalculatorContent from "./CalculatorContent";

const CALCULATORS = [
  { id: "gcs", name: "Шкала Глазго (GCS)", icon: "🧠" },
  { id: "sofa", name: "Шкала SOFA", icon: "📊" },
  { id: "lrinec", name: "Шкала LRINEC (Некр. фасциит)", icon: "🔬" }
];

export default function TheoryScreen({ setPhase, startGame, progress, progressionMode, setProgressionMode, progressionChosen, setProgressionChosen }) {
  const C = useTheme();
  const isMobile = useIsMobile();
  const { t } = useTranslate();

  const [activeTopic, setActiveTopic] = useState(null);
  const [activeDrugGroup, setActiveDrugGroup] = useState(null);
  const [activeProtocol, setActiveProtocol] = useState(null);
  const [activeCalculator, setActiveCalculator] = useState(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [expandedCats, setExpandedCats] = useState(() =>
    new Set(TOPICS.map((c) => c.id))
  );

  const theory = activeTopic ? THEORY[activeTopic] : null;

  useEffect(() => {
    if (progress?.curriculum?.quizPending && !activeTopic) {
      setActiveTopic(progress.curriculum.topicId);
    }
  }, []);

  const toggleCat = (id) =>
    setExpandedCats((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const selectTopic = (id) => {
    setActiveTopic(id);
    setActiveDrugGroup(null);
    setActiveProtocol(null);
    setActiveCalculator(null);
  };

  const selectDrugGroup = (id) => {
    setActiveDrugGroup(id);
    setActiveTopic(null);
    setActiveProtocol(null);
    setActiveCalculator(null);
  };

  const selectProtocol = (id) => {
    setActiveProtocol(id);
    setActiveTopic(null);
    setActiveDrugGroup(null);
    setActiveCalculator(null);
  };

  const selectCalculator = (id) => {
    setActiveCalculator(id);
    setActiveTopic(null);
    setActiveDrugGroup(null);
    setActiveProtocol(null);
  };

  const filteredDrugs = activeDrugGroup
    ? DRUG_REFERENCE.filter((d) => d.group === activeDrugGroup)
    : [];

  const sidebarContent = (
    <>
      {/* Back button */}
      <div
        onClick={() => setPhase("menu")}
        className="nav-item"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "10px 12px",
          borderRadius: 11,
          marginBottom: 18,
          cursor: "pointer",
          transition: "all 0.15s",
        }}
      >
        <span style={{ fontSize: 14, color: C.textDim }}>←</span>
        <span style={{ fontSize: 13, color: C.textDim, fontFamily: FONT }}>
          {t("theory.back")}
        </span>
      </div>

      {/* Progression mode toggle */}
      {progress && (
        <div style={{marginBottom:14,padding:"8px 10px",background:progressionMode==="strict"?`${C.accent}10`:`${C.yellow}10`,border:`1px solid ${progressionMode==="strict"?`${C.accent}33`:`${C.yellow}33`}`,borderRadius:8}}>
          <div onClick={()=>setProgressionMode(v=>v==="strict"?"free":"strict")} style={{display:"flex",alignItems:"center",justifyContent:"space-between",cursor:"pointer"}}>
            <span style={{fontSize:11,color:progressionMode==="strict"?C.accent:C.yellow,fontWeight:600,fontFamily:FONT}}>
              {progressionMode==="strict"?t("theory.course"):t("theory.free")}
            </span>
            <div style={{width:32,height:18,borderRadius:9,background:progressionMode==="strict"?C.accent:`${C.textDim}30`,position:"relative",transition:"background 0.2s"}}>
              <div style={{width:14,height:14,borderRadius:"50%",background:"#fff",position:"absolute",top:2,left:progressionMode==="strict"?16:2,transition:"left 0.2s",boxShadow:"0 1px 3px rgba(0,0,0,0.3)"}}/>
            </div>
          </div>
          <div style={{fontSize:9,color:C.textDim,fontFamily:FONT,marginTop:4}}>
            {progressionMode==="strict"?t("theory.courseDesc"):t("theory.freeDescShort")}
          </div>
        </div>
      )}

      {/* Topics */}
      <div
        style={{
          fontSize: 10,
          color: C.textDim,
          letterSpacing: 1.5,
          padding: "0 10px",
          marginBottom: 6,
          fontFamily: FONT,
          fontWeight: 600,
        }}
      >
        {t("theory.sectionTitle")}
      </div>
      {TOPICS.map((cat) => {
        const isExpanded = expandedCats.has(cat.id);
        const catProg = progress ? progress.getCategoryProgress(cat.id) : null;
        return (
          <div key={cat.id} style={{ marginBottom: 4 }}>
            <div
              onClick={() => toggleCat(cat.id)}
              className="nav-item"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 12px",
                borderRadius: 10,
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              <span
                style={{
                  fontSize: 10,
                  color: C.textDim,
                  transition: "transform 0.15s",
                  transform: isExpanded ? "rotate(90deg)" : "rotate(0)",
                }}
              >
                ▶
              </span>
              <span style={{ fontSize: 13 }}>{cat.icon}</span>
              <span
                style={{
                  fontSize: 12,
                  fontFamily: FONT,
                  color: C.text,
                  fontWeight: 500,
                  flex: 1,
                }}
              >
                {cat.name}
              </span>
            </div>
            {isExpanded &&
              cat.children.map((topic) => {
                const hasContent = !!THEORY[topic.id];
                const isActive = activeTopic === topic.id;
                const isLocked = progressionMode === "strict" && progress && !progress.isTopicUnlocked(topic.id, "strict");
                const isComplete = progress && progress.isTopicComplete(topic.id);
                const topicProg = progress ? progress.getTopicProgress(topic.id) : null;
                const casesDone = topicProg ? topicProg.completedCases.length : 0;
                const casesTotal = topic.cases.length;
                return (
                  <div
                    key={topic.id}
                    onClick={() => hasContent && !isLocked && selectTopic(topic.id)}
                    className="nav-item"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "7px 12px 7px 34px",
                      borderRadius: 8,
                      cursor: hasContent && !isLocked ? "pointer" : "default",
                      transition: "all 0.15s",
                      background: isActive
                        ? "rgba(0,230,200,0.1)"
                        : "transparent",
                      border: `1px solid ${
                        isActive ? "rgba(0,230,200,0.2)" : "transparent"
                      }`,
                      opacity: isLocked ? 0.4 : hasContent ? 1 : 0.4,
                    }}
                  >
                    {isLocked && <span style={{fontSize:10,flexShrink:0}}>🔒</span>}
                    {isComplete && <span style={{fontSize:10,flexShrink:0,color:C.green}}>✓</span>}
                    <span
                      style={{
                        fontSize: 11,
                        fontFamily: FONT,
                        color: isActive ? C.accent : isLocked ? C.textDim : C.text,
                        fontWeight: isActive ? 600 : 400,
                        flex: 1,
                      }}
                    >
                      {topic.name}
                    </span>
                    {topic.combined && (
                      <span
                        style={{
                          fontSize: 8,
                          padding: "1px 4px",
                          borderRadius: 4,
                          background: "rgba(245,200,66,0.15)",
                          color: C.yellow,
                          fontFamily: FONT,
                        }}
                      >
                        {t("theory.combined")}
                      </span>
                    )}
                    {!hasContent && !isLocked && (
                      <span
                        style={{
                          fontSize: 8,
                          padding: "1px 4px",
                          borderRadius: 4,
                          background: C.btnBg,
                          color: C.textDim,
                          fontFamily: FONT,
                        }}
                      >
                        soon
                      </span>
                    )}
                    {hasContent && !isLocked && topicProg && (
                      <span style={{fontSize:8,color:casesDone>=casesTotal?C.green:C.textDim,fontFamily:FONT}}>
                        {casesDone}/{casesTotal}
                      </span>
                    )}
                  </div>
                );
              })}
            {catProg && catProg.total > 0 && (() => {
              const pct = Math.round((catProg.completed / catProg.total) * 100);
              return (
                <div style={{margin:"4px 10px 6px",padding:"4px 0"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:2}}>
                    <span style={{fontSize:8,color:C.textDim,fontFamily:FONT}}>{catProg.completed}/{catProg.total} {t("theory.themes")}</span>
                    <span style={{fontSize:8,color:pct===100?C.green:C.textDim,fontFamily:FONT}}>{pct}%</span>
                  </div>
                  <div style={{height:3,background:`${C.textDim}20`,borderRadius:2,overflow:"hidden"}}>
                    <div style={{height:"100%",width:`${pct}%`,background:pct===100?C.green:C.accent,borderRadius:2,transition:"width 0.3s"}}/>
                  </div>
                </div>
              );
            })()}
          </div>
        );
      })}

      {/* Drug Reference */}
      <div
        style={{
          fontSize: 10,
          color: C.textDim,
          letterSpacing: 1.5,
          padding: "0 10px",
          margin: "18px 0 6px",
          fontFamily: FONT,
          fontWeight: 600,
        }}
      >
        💊 {t("theory.drugs")}
      </div>
      {DRUG_GROUPS.map((group) => (
        <div
          key={group.id}
          onClick={() => selectDrugGroup(group.id)}
          className="nav-item"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "7px 12px 7px 18px",
            borderRadius: 10,
            marginBottom: 2,
            cursor: "pointer",
            transition: "all 0.15s",
            background:
              activeDrugGroup === group.id
                ? "rgba(0,230,200,0.1)"
                : "transparent",
            border: `1px solid ${
              activeDrugGroup === group.id
                ? "rgba(0,230,200,0.2)"
                : "transparent"
            }`,
          }}
        >
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: group.color,
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontSize: 12,
              fontFamily: FONT,
              color:
                activeDrugGroup === group.id ? C.accent : C.text,
              fontWeight: activeDrugGroup === group.id ? 600 : 400,
              opacity: activeDrugGroup === group.id ? 1 : 0.7,
            }}
          >
            {group.name}
          </span>
        </div>
      ))}

      {/* Protocols */}
      <div
        style={{
          fontSize: 10,
          color: C.textDim,
          letterSpacing: 1.5,
          padding: "0 10px",
          margin: "18px 0 6px",
          fontFamily: FONT,
          fontWeight: 600,
        }}
      >
        📋 {t("theory.protocols")}
      </div>
      {Object.values(PROTOCOLS).map((proto) => (
        <div
          key={proto.id}
          onClick={() => selectProtocol(proto.id)}
          className="nav-item"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "7px 12px 7px 18px",
            borderRadius: 10,
            marginBottom: 2,
            cursor: "pointer",
            transition: "all 0.15s",
            background:
              activeProtocol === proto.id
                ? "rgba(0,230,200,0.1)"
                : "transparent",
            border: `1px solid ${
              activeProtocol === proto.id
                ? "rgba(0,230,200,0.2)"
                : "transparent"
            }`,
          }}
        >
          <span style={{ fontSize: 13 }}>{proto.icon}</span>
          <span
            style={{
              fontSize: 12,
              fontFamily: FONT,
              color:
                activeProtocol === proto.id ? C.accent : C.text,
              fontWeight: activeProtocol === proto.id ? 600 : 400,
              opacity: activeProtocol === proto.id ? 1 : 0.7,
            }}
          >
            {proto.name.split("—")[0].trim()}
          </span>
        </div>
      ))}

      {/* Calculators */}
      <div
        style={{
          fontSize: 10,
          color: C.textDim,
          letterSpacing: 1.5,
          padding: "0 10px",
          margin: "18px 0 6px",
          fontFamily: FONT,
          fontWeight: 600,
        }}
      >
        🧮 {t("theory.calculators") || "Калькуляторы"}
      </div>
      {CALCULATORS.map((calc) => (
        <div
          key={calc.id}
          onClick={() => selectCalculator(calc.id)}
          className="nav-item"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "7px 12px 7px 18px",
            borderRadius: 10,
            marginBottom: 2,
            cursor: "pointer",
            transition: "all 0.15s",
            background:
              activeCalculator === calc.id
                ? "rgba(0,230,200,0.1)"
                : "transparent",
            border: `1px solid ${
              activeCalculator === calc.id
                ? "rgba(0,230,200,0.2)"
                : "transparent"
            }`,
          }}
        >
          <span style={{ fontSize: 13 }}>{calc.icon}</span>
          <span
            style={{
              fontSize: 12,
              fontFamily: FONT,
              color:
                activeCalculator === calc.id ? C.accent : C.text,
              fontWeight: activeCalculator === calc.id ? 600 : 400,
              opacity: activeCalculator === calc.id ? 1 : 0.7,
            }}
          >
            {calc.name}
          </span>
        </div>
      ))}
    </>
  );

  const contentArea = (() => {
    if (theory) return <TheoryContent data={theory} C={C} topicId={activeTopic} onQuiz={()=>setShowQuiz(true)} progress={progress} startGame={startGame} progressionMode={progressionMode} />;
    if (activeDrugGroup)
      return <DrugList drugs={filteredDrugs} groupName={DRUG_GROUPS.find((g) => g.id === activeDrugGroup)?.name} C={C} />;
    if (activeProtocol)
      return <ProtocolContent protocol={PROTOCOLS[activeProtocol]} C={C} />;
    if (activeCalculator)
      return <CalculatorContent calcId={activeCalculator} C={C} />;
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          opacity: 0.4,
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📚</div>
          <div style={{ fontSize: 14, color: C.textDim, fontFamily: FONT }}>
            {t("theory.selectTopic")}
          </div>
        </div>
      </div>
    );
  })();

  if (isMobile)
    return (
      <div
        style={{
          minHeight: "100vh",
          background: C.bgGrad,
          fontFamily: FONT,
          overflowY: "auto",
        }}
      >
        <div
          style={{
            position: "sticky",
            top: 0,
            zIndex: 100,
            height: 54,
            background: C.headerBg,
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            borderBottom: "1px solid rgba(0,230,200,0.06)",
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "0 16px",
          }}
        >
          <div
            onClick={() => {
              if (activeTopic || activeDrugGroup || activeProtocol || activeCalculator) {
                setActiveTopic(null);
                setActiveDrugGroup(null);
                setActiveProtocol(null);
                setActiveCalculator(null);
              } else {
                setPhase("menu");
              }
            }}
            style={{ fontSize: 16, color: C.accent, cursor: "pointer" }}
          >
            ←
          </div>
          <span
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: C.white,
              fontFamily: FONT,
            }}
          >
            {activeTopic
              ? theory?.title || t("theory.sectionTitle")
              : activeDrugGroup
              ? DRUG_GROUPS.find((g) => g.id === activeDrugGroup)?.name || t("theory.drugs")
              : activeProtocol
              ? PROTOCOLS[activeProtocol]?.name || t("theory.protocols")
              : activeCalculator
              ? CALCULATORS.find(cl => cl.id === activeCalculator)?.name || "Калькулятор"
              : t("theory.sectionTitle")}
          </span>
        </div>

        {!theory && !activeDrugGroup && !activeProtocol && !activeCalculator && (
          <div style={{ padding: 16 }}>{sidebarContent}</div>
        )}
        {(theory || activeDrugGroup || activeProtocol || activeCalculator) && (
          <div style={{ padding: 16 }}>{contentArea}</div>
        )}

      {/* Progression mode selection (FR-3.2) */}
      {!progressionChosen && (
        <ProgressionModeModal C={C} onChoose={(mode) => { setProgressionMode(mode); setProgressionChosen(true); }} />
      )}

      {/* Quiz modal */}
        {showQuiz && activeTopic && (
          <QuizModal topicId={activeTopic} onClose={() => setShowQuiz(false)}
            onResult={(passed, score) => { if (progress) progress.completeQuiz(activeTopic, passed, score); }} />
        )}
      </div>
    );

  return (
    <div
      style={{
        height: "100vh",
        background: C.bgGrad,
        display: "flex",
        fontFamily: FONT,
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Sidebar */}
      <aside
        style={{
          width: 260,
          flexShrink: 0,
          zIndex: 10,
          background: C.sidebarBg,
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          borderRight: "1px solid rgba(0,230,200,0.08)",
          display: "flex",
          flexDirection: "column",
          padding: "22px 12px",
          overflowY: "auto",
        }}
      >
        {sidebarContent}
      </aside>

      {/* Main */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "28px 36px",
          minWidth: 0,
        }}
      >
        {contentArea}
      </div>

      {/* Quiz modal */}
      {showQuiz && activeTopic && (
        <QuizModal topicId={activeTopic} onClose={() => setShowQuiz(false)}
          onResult={(passed, score) => { if (progress) progress.completeQuiz(activeTopic, passed, score); }} />
      )}
    </div>
  );
}

/* ─── Progression Mode Modal (FR-3.2) ──────────────────────── */

function ProgressionModeModal({ onChoose, C }) {
  const { t } = useTranslate();
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:9999}}>
      <div style={{background:C.panel,border:`1px solid ${C.border}`,borderRadius:18,padding:32,maxWidth:440,width:"90%",textAlign:"center"}}>
        <div style={{fontSize:40,marginBottom:16}}>📚</div>
        <div style={{fontSize:20,fontWeight:700,color:C.white,fontFamily:FONT,marginBottom:8}}>
          {t("theory.selectMode")}
        </div>
        <div style={{fontSize:13,color:C.textDim,fontFamily:FONT,marginBottom:24,lineHeight:1.6}}>
          {t("theory.selectModeDesc")}
        </div>
        <div style={{display:"flex",gap:10}}>
          <button onClick={() => onChoose("strict")}
            style={{flex:1,padding:"14px 12px",borderRadius:12,border:`1px solid ${C.accent}40`,background:`${C.accent}12`,color:C.accent,fontSize:14,fontWeight:600,fontFamily:FONT,cursor:"pointer",transition:"all 0.15s",display:"flex",flexDirection:"column",alignItems:"center",gap:6}}>
            <span style={{fontSize:22}}>🔒</span>
            <span>{t("theory.strictLabel")}</span>
            <span style={{fontSize:10,color:C.textDim,fontWeight:400}}>{t("theory.strictDesc")}</span>
          </button>
          <button onClick={() => onChoose("free")}
            style={{flex:1,padding:"14px 12px",borderRadius:12,border:`1px solid ${C.yellow}40`,background:`${C.yellow}12`,color:C.yellow,fontSize:14,fontWeight:600,fontFamily:FONT,cursor:"pointer",transition:"all 0.15s",display:"flex",flexDirection:"column",alignItems:"center",gap:6}}>
            <span style={{fontSize:22}}>📖</span>
            <span>{t("theory.freeLabel")}</span>
            <span style={{fontSize:10,color:C.textDim,fontWeight:400}}>{t("theory.freeDesc")}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Theory Content ─────────────────────────────────────────── */

function TheoryContent({ data, C, topicId, onQuiz, progress, startGame, progressionMode }) {
  const { t } = useTranslate();
  const sections = [
    "definition",
    "etiology",
    "pathogenesis",
    "clinical",
    "diagnostics",
    "treatment",
    "prognosis",
  ];

  return (
    <div style={{ maxWidth: 720 }}>
      <h1
        style={{
          fontSize: 24,
          fontWeight: 700,
          color: C.white,
          fontFamily: FONT,
          margin: "0 0 6px",
          lineHeight: 1.3,
        }}
      >
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
          <div style={{marginBottom:12,padding:"8px 12px",background:`${C.yellow}08`,border:`1px solid ${C.yellow}22`,borderRadius:8,fontSize:12,color:C.yellow,fontFamily:FONT}}>
            💡 {t("theory.recommend")} {prevTopic.name}
          </div>
        );
      })()}
      {sections.map((key) => {
        const text = data[key];
        if (!text) return null;
        return (
          <div key={key} style={{ marginBottom: 24 }}>
            <div
              style={{
                fontSize: 11,
                color: C.accent,
                letterSpacing: 1.2,
                fontWeight: 600,
                textTransform: "uppercase",
                marginBottom: 8,
              }}
            >
              {t(`theory.section.${key}`)}
            </div>
            <div
              style={{
                fontSize: 14,
                color: C.text,
                lineHeight: 1.7,
                whiteSpace: "pre-wrap",
                fontFamily: FONT,
              }}
            >
              {text}
            </div>
          </div>
        );
      })}

      {/* Key Points */}
      {data.keyPoints && data.keyPoints.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div
            style={{
              fontSize: 11,
              color: C.yellow,
              letterSpacing: 1.2,
              fontWeight: 600,
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            {t("theory.keyPoints")}
          </div>
          {data.keyPoints.map((point, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: 10,
                marginBottom: 6,
                padding: "8px 12px",
                borderRadius: 8,
                background: "rgba(245,200,66,0.06)",
                border: "1px solid rgba(245,200,66,0.12)",
              }}
            >
              <span style={{ color: C.yellow, fontSize: 12, flexShrink: 0 }}>
                •
              </span>
              <span
                style={{
                  fontSize: 13,
                  color: C.text,
                  fontFamily: FONT,
                  lineHeight: 1.5,
                }}
              >
                {point}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Differences */}
      {data.differences && (
        <div style={{ marginBottom: 24 }}>
          <div
            style={{
              fontSize: 11,
              color: C.purple,
              letterSpacing: 1.2,
              fontWeight: 600,
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            {t("theory.differences")}
          </div>
          <div
            style={{
              fontSize: 13,
              color: C.text,
              lineHeight: 1.7,
              fontFamily: FONT,
              padding: "10px 14px",
              borderRadius: 10,
              background: "rgba(157,111,245,0.06)",
              border: "1px solid rgba(157,111,245,0.12)",
            }}
          >
            {data.differences}
          </div>
        </div>
      )}

      {/* Related Topics */}
      {data.relatedTopics && data.relatedTopics.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div
            style={{
              fontSize: 11,
              color: C.textDim,
              letterSpacing: 1.2,
              fontWeight: 600,
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            {t("theory.relatedTopics")}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {data.relatedTopics.map((topicId) => {
              const topic = THEORY[topicId];
              if (!topic) return null;
              return (
                <span
                  key={topicId}
                  style={{
                    fontSize: 11,
                    padding: "4px 10px",
                    borderRadius: 6,
                    background: C.btnBg,
                    border: `1px solid ${C.btnBorder}`,
                    color: C.text,
                    fontFamily: FONT,
                  }}
                >
                  {topic.title}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* Cases */}
      {startGame && (
        <div>
          <div
            style={{
              fontSize: 11,
              color: C.accent,
              letterSpacing: 1.2,
              fontWeight: 600,
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            {t("theory.casesByTopic")}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {data.relatedTopics?.map((topicId) => {
              const topic = TOPICS.flatMap((c) => c.children).find(
                (t) => t.id === topicId
              );
              if (!topic) return null;
              return topic.cases.map((caseId) => (
                <button
                  key={`${topicId}_${caseId}`}
                  onClick={() => startGame(caseId)}
                  className="nav-item"
                  style={{
                    fontSize: 11,
                    padding: "5px 10px",
                    borderRadius: 6,
                    background: "rgba(0,230,200,0.08)",
                    border: "1px solid rgba(0,230,200,0.15)",
                    color: C.accent,
                    fontFamily: FONT,
                    cursor: "pointer",
                  }}
                >
                  #{caseId}
                </button>
              ));
            })}
          </div>
        </div>
      )}

      {/* Sources */}
      {data.sources && (
        <div style={{marginTop:24,marginBottom:24,padding:"10px 14px",borderRadius:8,background:`${C.accent}08`,border:`1px solid ${C.accent}18`}}>
          <div style={{fontSize:10,color:C.accent,letterSpacing:1,fontWeight:600,textTransform:"uppercase",marginBottom:4}}>{t("theory.sources")}</div>
          <div style={{fontSize:11,color:C.textDim,fontFamily:FONT,lineHeight:1.6}}>{data.sources}</div>
        </div>
      )}

      {/* Curriculum practice section */}
      {progress && startGame && (() => {
        const topic = TOPICS.flatMap(c => c.children).find(t => t.id === topicId);
        if (!topic || topic.cases.length === 0) return null;
        const tp = progress.getTopicProgress(topicId);
        const casesDone = tp.completedCases.length;
        const isComplete = progress.isTopicComplete(topicId);
        const curriculum = progress.curriculum;
        const isCurActive = curriculum && curriculum.topicId === topicId;

        const handleStartPractice = () => {
          const firstCase = progress.startCurriculum(topicId);
          if (firstCase) startGame(firstCase);
        };

        return (
          <div style={{ marginTop: 20, paddingTop: 16, borderTop: `1px solid ${C.border}` }}>
            <div style={{fontSize:11,color:C.accent,letterSpacing:1.2,fontWeight:600,textTransform:"uppercase",marginBottom:8}}>
              {t("theory.practice")}
            </div>
            {isComplete ? (
              <div style={{padding:"10px 14px",background:`${C.green}10`,border:`1px solid ${C.green}33`,borderRadius:10,fontSize:12,color:C.green,fontFamily:FONT}}>
                ✓ {t("theory.topicComplete", {n: casesDone})}
              </div>
            ) : (
              <>
                <div style={{fontSize:11,color:C.textDim,fontFamily:FONT,marginBottom:8}}>
                  {t("theory.casesLabel")} {casesDone}/{topic.cases.length} · {tp.quizPassed ? t("theory.testPassed") : t("theory.testNotPassed")}
                </div>
                <div style={{display:"flex",gap:8}}>
                  <button onClick={handleStartPractice}
                    style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:8,padding:"10px 16px",borderRadius:10,
                      background:`linear-gradient(135deg,rgba(0,230,200,0.15),rgba(0,229,160,0.1))`,border:"1px solid rgba(0,230,200,0.25)",
                      color:C.accent,fontSize:13,fontWeight:600,fontFamily:FONT,cursor:"pointer",transition:"all 0.15s"}}>
                    <span style={{fontSize:16}}>▶</span>
                    {t("theory.startPractice")}
                  </button>
                  {tp.quizPassed === false && casesDone >= topic.cases.length && (
                    <button onClick={onQuiz}
                      style={{padding:"10px 16px",borderRadius:10,background:`${C.yellow}15`,border:`1px solid ${C.yellow}33`,
                        color:C.yellow,fontSize:13,fontWeight:600,fontFamily:FONT,cursor:"pointer",transition:"all 0.15s"}}>
                      📝 {t("quiz.quiz")}
                    </button>
                  )}
                </div>
                {isCurActive && curriculum.quizPending && (
                  <div style={{marginTop:8,padding:"8px 12px",background:`${C.yellow}10`,border:`1px solid ${C.yellow}33`,borderRadius:8,fontSize:11,color:C.yellow,fontFamily:FONT}}>
                    {t("theory.allCasesDone")}
                  </div>
                )}
              </>
            )}
          </div>
        );
      })()}

      {/* Quiz button */}
      {QUIZ_QUESTIONS[topicId] && (
        <div style={{ marginTop: 24, paddingTop: 16, borderTop: `1px solid ${C.border}` }}>
          <button
            onClick={onQuiz}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "12px 20px",
              borderRadius: 12,
              background: "linear-gradient(135deg, rgba(0,230,200,0.12), rgba(0,229,160,0.08))",
              border: "1px solid rgba(0,230,200,0.2)",
              color: C.accent,
              fontSize: 14,
              fontWeight: 600,
              fontFamily: FONT,
              cursor: "pointer",
              transition: "all 0.15s",
            }}
          >
            <span style={{ fontSize: 18 }}>📝</span>
            {t("theory.quizByTopic", {n: QUIZ_QUESTIONS[topicId].length})}
          </button>
          <div style={{ fontSize: 11, color: C.textDim, fontFamily: FONT, marginTop: 6 }}>
            {t("theory.quizThreshold")}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Protocol Content ──────────────────────────────────────── */

function ProtocolContent({ protocol, C }) {
  const { t } = useTranslate();
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

/* ─── Drug List ──────────────────────────────────────────────── */

function DrugList({ drugs, groupName, C }) {
  return (
    <div style={{ maxWidth: 720 }}>
      <h1
        style={{
          fontSize: 22,
          fontWeight: 700,
          color: C.white,
          fontFamily: FONT,
          margin: "0 0 20px",
        }}
      >
        {groupName}
      </h1>
      {drugs.map((drug) => (
        <DrugCard key={drug.id} drug={drug} C={C} />
      ))}
    </div>
  );
}

function DrugCard({ drug, C }) {
  const [expanded, setExpanded] = useState(false);
  const { t } = useTranslate();

  return (
    <div
      style={{
        marginBottom: 10,
        borderRadius: 12,
        background: C.panelBg,
        border: `1px solid ${expanded ? "rgba(0,230,200,0.2)" : C.btnBorder}`,
        overflow: "hidden",
        transition: "all 0.15s",
      }}
    >
      <div
        onClick={() => setExpanded((v) => !v)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "12px 16px",
          cursor: "pointer",
        }}
      >
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: C.accent,
            flexShrink: 0,
            opacity: expanded ? 1 : 0.5,
          }}
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: C.white,
              fontFamily: FONT,
            }}
          >
            {drug.name}
          </div>
          <div
            style={{
              fontSize: 11,
              color: C.textDim,
              fontFamily: FONT,
              marginTop: 2,
            }}
          >
            {drug.category}
          </div>
        </div>
        <span
          style={{
            fontSize: 10,
            color: C.textDim,
            transform: expanded ? "rotate(90deg)" : "rotate(0)",
            transition: "transform 0.15s",
          }}
        >
          ▶
        </span>
      </div>

      {expanded && (
        <div style={{ padding: "0 16px 14px" }}>
          <div
            style={{
              fontSize: 12,
              color: C.text,
              lineHeight: 1.6,
              fontFamily: FONT,
              marginBottom: 10,
            }}
          >
            <span style={{ color: C.accent, fontWeight: 600 }}>{t("theory.mechanism")}</span>
            {drug.mechanism}
          </div>

          <DrugSection label={t("theory.indications")} items={drug.indications} color={C.green} C={C} />
          <DrugSection label={t("theory.contraindications")} items={drug.contraindications} color={C.red} C={C} />

          {drug.dosage && (
            <div
              style={{
                fontSize: 12,
                color: C.text,
                lineHeight: 1.6,
                fontFamily: FONT,
                marginBottom: 8,
              }}
            >
              <span style={{ color: C.yellow, fontWeight: 600 }}>{t("theory.dosage")}</span>
              {drug.dosage}
            </div>
          )}

          {drug.sideEffects && drug.sideEffects.length > 0 && (
            <DrugSection
              label={t("theory.sideEffects")}
              items={drug.sideEffects}
              color={C.orange}
              C={C}
            />
          )}

          {drug.usedInCases && drug.usedInCases.length > 0 && (
            <div
              style={{
                fontSize: 11,
                color: C.textDim,
                fontFamily: FONT,
                marginTop: 8,
              }}
            >
              <span style={{ color: C.accent }}>{t("theory.usedInCases")}</span>
              {drug.usedInCases.map((id) => `#${id}`).join(", ")}
            </div>
          )}

          {drug.notes && (
            <div
              style={{
                fontSize: 11,
                color: C.textDim,
                fontFamily: FONT,
                marginTop: 8,
                padding: "6px 10px",
                borderRadius: 6,
                background: "rgba(0,230,200,0.04)",
                border: "1px solid rgba(0,230,200,0.08)",
              }}
            >
              {drug.notes}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function DrugSection({ label, items, color, C }) {
  if (!items || items.length === 0) return null;
  return (
    <div style={{ marginBottom: 8 }}>
      <div
        style={{
          fontSize: 11,
          fontWeight: 600,
          color,
          fontFamily: FONT,
          marginBottom: 4,
        }}
      >
        {label}:
      </div>
      {items.map((item, i) => (
        <div
          key={i}
          style={{
            fontSize: 12,
            color: C.text,
            fontFamily: FONT,
            lineHeight: 1.5,
            paddingLeft: 10,
            marginBottom: 2,
          }}
        >
          • {item}
        </div>
      ))}
    </div>
  );
}
