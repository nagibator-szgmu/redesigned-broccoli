import React, { useState } from "react";
import { FONT, RADIUS } from "../../../ui/theme";
import { useTheme } from "../../../ui/ThemeContext";
import { IconBot } from "../../../ui/icons";

/**
 * PatientDialogueWidget — Виджет опроса и общения с пациентом.
 * 
 * Создан в рамках Фазы 0 как точка расширения для Разработчика 2.
 * 
 * @param {Object} props
 * @param {Object} props.caseData - Данные текущего клинического кейса
 * @param {Object} props.patientState - Текущие витальные функции (hr, sbp, spo2, gcs, pain)
 * @param {'hybrid'|'standard'} [props.mode='hybrid'] - Режим (чипсы + LLM или только чипсы)
 * @param {Function} [props.onRevealAnamnesis] - Регистрация открытого факта для скоринга
 * @param {boolean} [props.isMobile=false] - Флаг мобильного отображения
 */
export default function PatientDialogueWidget({
  caseData,
  patientState,
  mode = "hybrid",
  onRevealAnamnesis,
  isMobile = false,
}) {
  const C = useTheme();
  const [messages, setMessages] = useState(() => [
    {
      sender: "patient",
      text: caseData?.complaint ? `«${caseData.complaint}»` : "Здравствуйте, доктор...",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [inputQuestion, setInputQuestion] = useState("");
  const [loading, setLoading] = useState(false);

  // Стандартные чипсы-вопросы
  const quickQuestions = [
    { label: "Где болит?", key: "complaint", answer: caseData?.complaint || "Болит здесь..." },
    { label: "Когда началось?", key: "historyOfIllness", answer: caseData?.anamnesis || "Несколько часов назад..." },
    { label: "Аллергии на лекарства?", key: "lifeHistory", answer: caseData?.lifeHistory || "Аллергий вроде нет..." },
    { label: "Хронические болезни?", key: "lifeHistory", answer: caseData?.exam || "Особо ничем не болел..." },
  ];

  const handleAskChip = (q) => {
    const userMsg = {
      sender: "doctor",
      text: q.label,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    const patientMsg = {
      sender: "patient",
      text: q.answer,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, userMsg, patientMsg]);
    if (onRevealAnamnesis) {
      onRevealAnamnesis(q.key);
    }
  };

  const handleSendFreeForm = async (e) => {
    e?.preventDefault();
    if (!inputQuestion.trim() || loading) return;

    const question = inputQuestion.trim();
    setInputQuestion("");
    setMessages((prev) => [
      ...prev,
      { sender: "doctor", text: question, timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) },
    ]);

    // Заглушка под подключение Разработчиком 2 реального llmService.sendChatMessage
    setLoading(true);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: "patient",
          text: `(Ответ пациента на «${question}» с учетом боли ${patientState?.pain || 5}/10)`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
      setLoading(false);
    }, 600);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        background: C.panel,
        border: `1px solid ${C.accentDim}`,
        borderRadius: isMobile ? RADIUS.sm : RADIUS.md,
        padding: isMobile ? 12 : 14,
        fontFamily: FONT,
        maxHeight: 360,
      }}
    >
      {/* Шапка виджета */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <IconBot size={16} color={C.accent} />
          <span style={{ fontSize: 12, fontWeight: 700, color: C.accent, textTransform: "uppercase", letterSpacing: 0.5 }}>
            Диалог с пациентом
          </span>
        </div>
        <span style={{ fontSize: 10, color: C.textDim, padding: "2px 6px", borderRadius: 4, background: C.dimBg }}>
          {mode === "hybrid" ? "⚡ Гибридный (LLM)" : "📋 Стандартный"}
        </span>
      </div>

      {/* Список сообщений диалога */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 6,
          paddingRight: 4,
          marginBottom: 8,
          minHeight: 120,
        }}
      >
        {messages.map((m, idx) => {
          const isDoc = m.sender === "doctor";
          return (
            <div
              key={idx}
              style={{
                alignSelf: isDoc ? "flex-end" : "flex-start",
                maxWidth: "85%",
                background: isDoc ? `${C.accent}20` : C.card,
                border: `1px solid ${isDoc ? C.accent : C.border}`,
                borderRadius: 8,
                padding: "6px 10px",
                fontSize: 12,
                color: C.text,
                lineHeight: 1.4,
              }}
            >
              <div>{m.text}</div>
              <div style={{ fontSize: 9, color: C.textDim, textAlign: "right", marginTop: 2 }}>{m.timestamp}</div>
            </div>
          );
        })}
        {loading && (
          <div style={{ alignSelf: "flex-start", fontSize: 11, color: C.textDim, fontStyle: "italic" }}>
            Пациент думает...
          </div>
        )}
      </div>

      {/* Быстрые чипсы-вопросы */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 8 }}>
        {quickQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleAskChip(q)}
            style={{
              background: C.dimBg,
              border: `1px solid ${C.border}`,
              borderRadius: 6,
              padding: "4px 8px",
              fontSize: 11,
              color: C.textDim,
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
          >
            {q.label}
          </button>
        ))}
      </div>

      {/* Поле ввода вопроса (в гибридном режиме) */}
      {mode === "hybrid" && (
        <form onSubmit={handleSendFreeForm} style={{ display: "flex", gap: 6 }}>
          <input
            type="text"
            value={inputQuestion}
            onChange={(e) => setInputQuestion(e.target.value)}
            placeholder="Задать свой вопрос пациенту..."
            style={{
              flex: 1,
              background: C.card,
              border: `1px solid ${C.border}`,
              borderRadius: RADIUS.xs,
              padding: "6px 10px",
              fontSize: 12,
              color: C.text,
              fontFamily: FONT,
              outline: "none",
            }}
          />
          <button
            type="submit"
            disabled={!inputQuestion.trim() || loading}
            style={{
              background: C.accent,
              color: "#070d18",
              border: "none",
              borderRadius: RADIUS.xs,
              padding: "0 12px",
              fontSize: 12,
              fontWeight: 700,
              cursor: inputQuestion.trim() && !loading ? "pointer" : "default",
              opacity: inputQuestion.trim() && !loading ? 1 : 0.5,
              fontFamily: FONT,
            }}
          >
            Спросить
          </button>
        </form>
      )}
    </div>
  );
}
