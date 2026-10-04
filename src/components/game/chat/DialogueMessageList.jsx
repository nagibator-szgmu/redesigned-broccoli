import React, { useEffect, useRef } from "react";
import { FONT } from "../../../ui/theme";
import { useTheme } from "../../../ui/ThemeContext";

/** Список сообщений диалога врача и пациента */
export default function DialogueMessageList({ messages = [], loading = false }) {
  const C = useTheme();
  const listRef = useRef(null);

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;

    const scrollToBottom = () => {
      try {
        el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
      } catch {
        el.scrollTop = el.scrollHeight;
      }
    };

    scrollToBottom();
    const frameId = requestAnimationFrame(scrollToBottom);
    return () => cancelAnimationFrame(frameId);
  }, [messages, loading]);

  const patientBg = C.panel2 || "rgba(255,255,255,0.06)";

  return (
    <div
      ref={listRef}
      style={{
        flex: 1,
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        gap: 6,
        paddingRight: 4,
        marginBottom: 8,
        minHeight: 120,
        scrollBehavior: "smooth",
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
              background: isDoc ? `${C.accent}20` : patientBg,
              border: `1px solid ${isDoc ? C.accent : C.border}`,
              borderRadius: 8,
              padding: "6px 10px",
              fontSize: 12,
              color: C.text,
              lineHeight: 1.4,
            }}
          >
            <div>{m.text}</div>
            <div style={{ fontSize: 9, color: C.textDim, textAlign: "right", marginTop: 2, fontFamily: FONT }}>
              {m.timestamp}
            </div>
          </div>
        );
      })}
      {loading && (
        <div
          style={{
            alignSelf: "flex-start",
            padding: "4px 8px",
            fontSize: 11,
            color: C.textDim,
            fontStyle: "italic",
          }}
        >
          Пациент отвечает...
        </div>
      )}
    </div>
  );
}
