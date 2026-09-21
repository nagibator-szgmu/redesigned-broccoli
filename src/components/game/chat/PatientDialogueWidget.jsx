import React, { useState } from "react";
import { FONT, RADIUS } from "../../../ui/theme";
import { useTheme } from "../../../ui/ThemeContext";
import { IconBot } from "../../../ui/icons";
import DialogueMessageList from "./DialogueMessageList";

/**
 * PatientDialogueWidget — Виджет опроса и общения с пациентом.
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
      <DialogueMessageList messages={messages} loading={loading} />

      {/* Быстрые чипсы-вопросы */}
      <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 8 }}>
        {quickQuestions.map((q) => (
          <button
            key={q.label}
            onClick={() => handleAskChip(q)}
            style={{
              background: C.card,
              border: `1px solid ${C.border}`,
              borderRadius: 6,
              padding: "4px 8px",
              fontSize: 11,
              color: C.accent,
              cursor: "pointer",
              fontFamily: FONT,
            }}
          >
            {q.label}
          </button>
        ))}
      </div>

      {/* Текстовый ввод для свободного вопроса в гибридном режиме */}
      {mode === "hybrid" && (
        <form onSubmit={handleSendFreeForm} style={{ display: "flex", gap: 6 }}>
          <input
            type="text"
            value={inputQuestion}
            onChange={(e) => setInputQuestion(e.target.value)}
            placeholder="Задать свой вопрос пациенту..."
            disabled={loading}
            style={{
              flex: 1,
              background: C.card,
              border: `1px solid ${C.border}`,
              borderRadius: 6,
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
              color: C.bg,
              border: "none",
              borderRadius: 6,
              padding: "6px 12px",
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: FONT,
              opacity: !inputQuestion.trim() || loading ? 0.5 : 1,
            }}
          >
            Спросить
          </button>
        </form>
      )}
    </div>
  );
}
