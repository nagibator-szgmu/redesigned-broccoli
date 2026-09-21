import React from "react";
import { FONT } from "../../../ui/theme";
import { useTheme } from "../../../ui/ThemeContext";

/** Список сообщений диалога врача и пациента */
export default function DialogueMessageList({ messages = [], loading = false }) {
  const C = useTheme();

  return (
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
