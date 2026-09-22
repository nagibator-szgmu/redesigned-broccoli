import React, { useState, useEffect } from "react";
import { FONT, RADIUS } from "../../../ui/theme";
import { useTheme } from "../../../ui/ThemeContext";
import DialogueHeader from "./DialogueHeader";
import DialogueMessageList from "./DialogueMessageList";
import QuickInterviewChips from "./QuickInterviewChips";
import FreeformQuestionInput from "./FreeformQuestionInput";
import UnconsciousPatientBanner from "./UnconsciousPatientBanner";
import { applyVitalsSpeechFilter, isPatientUnconscious } from "../../../engine/dialogue/patientPersonalityEngine";
import { askPatientQuestion } from "../../../engine/dialogue/llmDialogueClient";

export default function PatientDialogueWidget({
  caseData,
  patientState,
  mode = "hybrid",
  onRevealAnamnesis,
  isMobile = false,
}) {
  const C = useTheme();
  const isUnconscious = isPatientUnconscious(patientState);

  const [messages, setMessages] = useState(() => [
    {
      sender: "patient",
      text: caseData?.complaint ? `«${caseData.complaint}»` : "Здравствуйте, доктор...",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [inputQuestion, setInputQuestion] = useState("");
  const [loading, setLoading] = useState(false);

  // Обновление приветственного статуса при изменении кейса
  useEffect(() => {
    if (!caseData) return;
    const initialText = isUnconscious
      ? "(Пациент без сознания, речевой контакт отсутствует...)"
      : caseData.complaint
      ? `«${caseData.complaint}»`
      : "Здравствуйте, доктор...";

    setMessages([
      {
        sender: "patient",
        text: initialText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  }, [caseData?.id, isUnconscious]);

  const handleAskChip = (q) => {
    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const doctorMsg = { sender: "doctor", text: q.label, timestamp: time };
    const patientText = applyVitalsSpeechFilter(q.answer, patientState);
    const patientMsg = { sender: "patient", text: patientText, timestamp: time };

    setMessages((prev) => [...prev, doctorMsg, patientMsg]);
    if (onRevealAnamnesis && !isUnconscious && q.key) {
      onRevealAnamnesis(q.key);
    }
  };

  const handleSendFreeForm = async (e) => {
    e?.preventDefault();
    if (!inputQuestion.trim() || loading || isUnconscious) return;

    const question = inputQuestion.trim();
    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setInputQuestion("");
    setMessages((prev) => [...prev, { sender: "doctor", text: question, timestamp: time }]);
    setLoading(true);

    const provider = typeof window !== "undefined" ? localStorage.getItem("ms_llmProvider") || "openrouter" : "openrouter";
    const apiKey = typeof window !== "undefined" ? localStorage.getItem("ms_llmKey") || "" : "";

    try {
      const res = await askPatientQuestion({
        question,
        caseData,
        patientState,
        chatHistory: messages,
        provider,
        apiKey,
      });

      setMessages((prev) => [
        ...prev,
        { sender: "patient", text: res.text, timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) },
      ]);

      if (onRevealAnamnesis && res.revealedKey) {
        onRevealAnamnesis(res.revealedKey);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      data-testid="patient-dialogue-widget"
      style={{
        display: "flex",
        flexDirection: "column",
        background: C.panel,
        border: `1px solid ${isUnconscious ? "rgba(255, 77, 79, 0.4)" : C.accentDim}`,
        borderRadius: isMobile ? RADIUS.sm : RADIUS.md,
        padding: isMobile ? 10 : 12,
        fontFamily: FONT,
        maxHeight: 390,
      }}
    >
      <DialogueHeader mode={mode} isUnconscious={isUnconscious} />
      {isUnconscious && <UnconsciousPatientBanner gcs={patientState?.gcs} />}
      <DialogueMessageList messages={messages} loading={loading} />
      <QuickInterviewChips
        caseData={caseData}
        onSelectQuestion={handleAskChip}
        disabled={isUnconscious || loading}
      />
      {mode === "hybrid" && (
        <FreeformQuestionInput
          inputQuestion={inputQuestion}
          setInputQuestion={setInputQuestion}
          onSubmit={handleSendFreeForm}
          loading={loading}
          disabled={isUnconscious}
        />
      )}
    </div>
  );
}
