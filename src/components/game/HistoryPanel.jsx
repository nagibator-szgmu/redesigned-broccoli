import { useState, useEffect, useRef } from "react";
import { FONT } from "../../ui/theme";
import { useTheme } from "../../ui/ThemeContext";
import { useTranslate } from "../../locale/useTranslate";
import { generateSystemPrompt, sendChatMessage, getLocalPatientResponse, generateActionReaction } from "../../engine/llmService";
import { TREATMENTS } from "../../data/treatments";
import { DIAGNOSTICS } from "../../data/diagnostics";

function getTreatmentReaction(id) {
  const rx = {
    morphine: "Кажется, боль уходит... Доктор, спасибо...",
    fentanyl: "Ох, отпустило немного... Спасибо...",
    oxygen_mask: "С этой маской дышать полегче, прохладный воздух идет.",
    nitroglycerin: "Ой, голова немного закружилась... Сердце вроде успокаивается.",
    defibrillation: "АЙ! Меня как будто током шарахнуло! Что это такое?!",
    fluids: "По руке прохлада пошла от капельницы...",
    norepinephrine: "Сердце так сильно заколотилось, будто выскочить хочет!",
    epinephrine: "Ух, мотор в груди застучал бешено!",
    intubation: "(Установлена интубационная трубка, пациент без сознания на ИВЛ)"
  };
  return rx[id] || null;
}

function getDiagReaction(id) {
  if (["cbc", "biochem", "coag", "troponin", "d_dimer", "blood_gas"].includes(id)) {
    return "Ой, иголочка... Забор крови? Колите, только аккуратно.";
  }
  const rx = {
    ecg: "Присоски на груди холодные... Мне лежать неподвижно?",
    ct_brain: "Это меня в ту трубу круглую положат?",
    ct_chest: "В этот томограф поедем? Надеюсь, это не больно.",
    chest_xray: "Снимок легких? Задерживать дыхание нужно?"
  };
  return rx[id] || null;
}

export default function HistoryPanel({ cd, ps, selTreat = [], orderedDiag = [], showInfo, setShowInfo, isMobile, onRevealAnamnesis }) {
  const C = useTheme();
  const { t } = useTranslate();
  
  const [mode, setMode] = useState("chat"); // Default to chat mode out-of-the-box
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const prevTreatRef = useRef(selTreat);
  const prevDiagRef = useRef(orderedDiag);

  const isAdmission = cd.department === "admission";
  const isIcu = cd.department === "icu";

  useEffect(() => {
    setMessages([
      { sender: "patient", text: `Здравствуйте, доктор... Мне очень плохо. ${cd.complaint.split(".")[0]}.` }
    ]);
  }, [cd.id]);

  useEffect(() => {
    if (mode === "chat") {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, mode]);

  const handleActionReaction = async (id, type) => {
    let actionName = id;
    if (type === "treatment") {
      const item = TREATMENTS.find(t => t.id === id);
      actionName = item ? item.name : id;
    } else if (type === "diag") {
      const item = DIAGNOSTICS.find(d => d.id === id);
      actionName = item ? item.name : id;
    }

    const apiKey = localStorage.getItem("ms_llm_key") || "";
    const provider = localStorage.getItem("ms_llm_provider") || "openrouter";

    try {
      const aiReaction = await generateActionReaction({
        provider,
        apiKey,
        cd,
        ps,
        actionName
      });
      if (aiReaction && aiReaction.trim()) {
        setMessages(prevMsgs => [...prevMsgs, { sender: "patient", text: aiReaction }]);
        return;
      }
    } catch (e) {
      console.warn("ИИ не смог сгенерировать реакцию, используем оффлайн-шаблон:", e);
    }

    const fallbackMsg = type === "treatment" ? getTreatmentReaction(id) : getDiagReaction(id);
    if (fallbackMsg) {
      setMessages(prevMsgs => [...prevMsgs, { sender: "patient", text: fallbackMsg }]);
    }
  };

  // Reactions to applied treatments
  useEffect(() => {
    const prev = prevTreatRef.current;
    const curr = selTreat || [];
    if (curr.length > prev.length) {
      const added = curr.filter(x => !prev.includes(x));
      added.forEach(id => {
        setTimeout(() => {
          handleActionReaction(id, "treatment");
        }, 1200);
      });
    }
    prevTreatRef.current = curr;
  }, [selTreat]);

  // Reactions to ordered diagnostics
  useEffect(() => {
    const prev = prevDiagRef.current;
    const curr = orderedDiag || [];
    if (curr.length > prev.length) {
      const added = curr.filter(x => !prev.includes(x));
      added.forEach(id => {
        setTimeout(() => {
          handleActionReaction(id, "diag");
        }, 1200);
      });
    }
    prevDiagRef.current = curr;
  }, [orderedDiag]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || loading) return;
    const userQ = inputValue.trim();
    
    // Track anamnesis reveal when user starts dialoguing
    onRevealAnamnesis && onRevealAnamnesis("shortHistory");

    setMessages(prev => [...prev, { sender: "doctor", text: userQ }]);
    setInputValue("");
    setLoading(true);

    const apiKey = localStorage.getItem("ms_llm_key") || "";
    const provider = localStorage.getItem("ms_llm_provider") || "openrouter";

    try {
      const systemPrompt = generateSystemPrompt(cd, ps || { pain: 5, gcs: 15, hr: 80, sbp: 120, dbp: 80, spo2: 98 });
      const chatHistory = messages.map(m => ({
        role: m.sender === "doctor" ? "user" : "assistant",
        text: m.text
      }));

      const reply = await sendChatMessage({
        provider,
        apiKey,
        systemPrompt,
        chatHistory,
        userMessage: userQ
      });

      setMessages(prev => [...prev, { sender: "patient", text: reply }]);
    } catch {
      // Fallback in case of net/api errors
      const reply = getLocalPatientResponse(userQ, cd, ps);
      setMessages(prev => [...prev, { sender: "patient", text: reply }]);
    } finally {
      setLoading(false);
    }
  };

  if (isIcu) return null;

  return (
    <div style={{ marginBottom: isMobile ? 12 : 14 }}>
      {/* Mode selectors */}
      <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
        <button onClick={() => setMode("classic")} style={{
          flex: 1, padding: "6px 10px", borderRadius: 8, cursor: "pointer", fontSize: 11, fontFamily: FONT, fontWeight: 600,
          background: mode === "classic" ? `${C.accent}14` : "transparent",
          border: `1px solid ${mode === "classic" ? C.accent : C.border}`,
          color: mode === "classic" ? C.accent : C.textDim, transition: "all 0.15s"
        }}>
          📝 {t("history.classic") || "Сбор данных"}
        </button>
        <button onClick={() => setMode("chat")} style={{
          flex: 1, padding: "6px 10px", borderRadius: 8, cursor: "pointer", fontSize: 11, fontFamily: FONT, fontWeight: 600,
          background: mode === "chat" ? `${C.accent}14` : "transparent",
          border: `1px solid ${mode === "chat" ? C.accent : C.border}`,
          color: mode === "chat" ? C.accent : C.textDim, transition: "all 0.15s"
        }}>
          💬 {t("history.chat") || "Опрос пациента"}
        </button>
      </div>

      {mode === "classic" ? (
        isAdmission ? (
          <div>
            <div style={{ border: `1px solid ${C.border}`, borderRadius: isMobile ? 12 : 14, overflow: "hidden", background: C.panelBg, padding: isMobile ? "10px 12px" : "12px 14px" }}>
              <div style={{ fontSize: 10, color: C.green, textTransform: "uppercase", letterSpacing: 1, marginBottom: 5, fontFamily: FONT, fontWeight: 600 }}>📋 {t("history.short")}</div>
              <p style={{ color: C.text, fontSize: 12, lineHeight: 1.7, margin: 0, fontFamily: FONT }}>{cd.shortHistory}</p>
            </div>
          </div>
        ) : (
          <div>
            <div onClick={() => setShowInfo(v => !v)} style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: isMobile ? "8px 12px" : "9px 14px",
              background: C.panelBg, backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)",
              border: `1px solid ${C.border}`,
              borderRadius: showInfo ? (isMobile ? "12px 12px 0 0" : "14px 14px 0 0") : (isMobile ? 12 : 14),
              cursor: "pointer",
            }}>
              <span style={{ fontSize: 11, color: C.textDim, fontFamily: FONT, fontWeight: 600, textTransform: "uppercase", letterSpacing: isMobile ? 0.8 : 1 }}>{t("history.title")}</span>
              <span style={{ color: C.textDim, fontSize: 11 }}>{showInfo ? "▲" : "▼"}</span>
            </div>
            {showInfo && (
              <div style={{
                display: isMobile ? "block" : "grid", gridTemplateColumns: isMobile ? undefined : "1fr 1fr",
                border: `1px solid ${C.border}`, borderTop: "none",
                borderRadius: isMobile ? "0 0 12px 12px" : "0 0 14px 14px", overflow: "hidden",
              }}>
                {[{ icon: "📋", label: t("history.short"), text: cd.anamnesis }, { icon: "🔍", label: t("history.exam"), text: cd.exam }].map(({ icon, label, text }, i) => (
                  <div key={label} style={{
                    background: C.panelBg, backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)",
                    padding: isMobile ? "10px 12px" : "12px 14px",
                    borderLeft: !isMobile && i > 0 ? `1px solid ${C.border}` : undefined,
                    borderTop: isMobile && i > 0 ? `1px solid ${C.border}` : undefined,
                  }}>
                    <div style={{ fontSize: 10, color: C.textDim, textTransform: "uppercase", letterSpacing: isMobile ? 1 : 1.2, marginBottom: isMobile ? 5 : 7, fontFamily: FONT, fontWeight: 600 }}>{icon} {label}</div>
                    <p style={{ color: C.text, fontSize: 12, lineHeight: 1.7, margin: 0, fontFamily: FONT }}>{text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      ) : (
        /* Dialogue mode */
        <div style={{
          background: C.panelBg, border: `1px solid ${C.border}`, borderRadius: 14,
          padding: 12, display: "flex", flexDirection: "column", height: 260
        }}>
          {/* Messages wrap */}
          <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 8, paddingRight: 4, marginBottom: 8 }}>
            {messages.map((m, idx) => {
              const isDoc = m.sender === "doctor";
              return (
                <div key={idx} style={{
                  alignSelf: isDoc ? "flex-end" : "flex-start",
                  maxWidth: "85%",
                  background: isDoc ? `${C.accent}14` : C.btnBg,
                  border: `1px solid ${isDoc ? C.accent : C.border}`,
                  borderRadius: isDoc ? "12px 12px 2px 12px" : "12px 12px 12px 2px",
                  padding: "8px 12px",
                  fontSize: 12,
                  color: isDoc ? C.white : C.text,
                  lineHeight: 1.5,
                  fontFamily: FONT
                }}>
                  {m.text}
                </div>
              );
            })}
            {loading && (
              <div style={{ alignSelf: "flex-start", opacity: 0.6, fontSize: 11, fontFamily: FONT, color: C.textDim, padding: "4px 8px" }}>
                ⏳ Пациент думает...
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Form input */}
          <div style={{ display: "flex", gap: 6 }}>
            <input
              type="text"
              placeholder={loading ? "Подождите ответа..." : "Спросите о симптомах, анамнезе..."}
              value={inputValue}
              disabled={loading}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              style={{
                flex: 1, background: C.inputBg, border: `1px solid ${C.border}`,
                borderRadius: 8, padding: "8px 12px", fontSize: 12, color: C.white,
                fontFamily: FONT, outline: "none"
              }}
            />
            <button onClick={handleSendMessage} disabled={loading} style={{
              background: loading ? C.btnBg : C.accent, border: "none", borderRadius: 8, width: 34, height: 34,
              cursor: loading ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center"
            }}>
              <span style={{ fontSize: 13, color: loading ? C.textDim : "#000" }}>✉️</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
