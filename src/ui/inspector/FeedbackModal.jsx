import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { buildMarkdownReport, copyTextToClipboard } from "./inspectorUtils";
import { ElementInfoCard } from "./ElementInfoCard";
import { FONT } from "../theme";

export default function FeedbackModal({ elementData, onClose }) {
  const [comment, setComment] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!elementData) return null;
  const { componentInfo, domMeta } = elementData;

  const handleCopy = async () => {
    const markdown = buildMarkdownReport({
      componentInfo,
      domMeta,
      userComment: comment,
    });
    await copyTextToClipboard(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000000,
        background: "rgba(7, 13, 24, 0.75)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        fontFamily: FONT,
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 480,
          background: "#161920",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          borderRadius: 14,
          padding: 20,
          boxShadow: "0 20px 50px rgba(0,0,0,0.6)",
          color: "#F1F5F9",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 18 }}>🎯</span>
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#38BDF8" }}>
              Инспектор элемента UI
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              color: "#94A3B8",
              fontSize: 18,
              cursor: "pointer",
              padding: "4px 8px",
            }}
          >
            ✕
          </button>
        </div>

        <ElementInfoCard componentInfo={componentInfo} domMeta={domMeta} />

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#94A3B8", marginBottom: 6 }}>
            Что не так или что изменить? (необязательно)
          </label>
          <textarea
            autoFocus
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Например: текст съехал вправо / кнопка не нажимается / уменьшить отступ..."
            style={{
              width: "100%",
              boxSizing: "border-box",
              background: "#0E1015",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              borderRadius: 8,
              padding: 10,
              fontSize: 13,
              color: "#F1F5F9",
              resize: "vertical",
              outline: "none",
              fontFamily: "inherit",
            }}
          />
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={handleCopy}
            style={{
              flex: 1,
              background: copied ? "#10B981" : "#2563EB",
              border: "none",
              borderRadius: 8,
              padding: "10px 16px",
              color: "#fff",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              transition: "background 0.2s",
            }}
          >
            {copied ? "✅ Скопировано в буфер! (Cmd+V в чат)" : "📋 Скопировать для Antigravity"}
          </button>
          <button
            onClick={onClose}
            style={{
              background: "#1D212A",
              border: "1px solid rgba(255, 255, 255, 0.10)",
              borderRadius: 8,
              padding: "10px 16px",
              color: "#94A3B8",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
}

FeedbackModal.propTypes = {
  elementData: PropTypes.shape({
    componentInfo: PropTypes.object.isRequired,
    domMeta: PropTypes.object.isRequired,
  }),
  onClose: PropTypes.func.isRequired,
};
