import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { buildMarkdownReport } from "./inspectorUtils";

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
    try {
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      // Fallback
      const ta = document.createElement("textarea");
      ta.value = markdown;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
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
        fontFamily: "'Inter', sans-serif",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 480,
          background: "#0d1a2e",
          border: "1px solid #1a3a60",
          borderRadius: 14,
          padding: 20,
          boxShadow: "0 20px 50px rgba(0,0,0,0.6)",
          color: "#e8f4ff",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 18 }}>🎯</span>
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#00e6c8" }}>
              Инспектор элемента UI
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              color: "#8aa2be",
              fontSize: 18,
              cursor: "pointer",
              padding: "4px 8px",
            }}
          >
            ✕
          </button>
        </div>

        <div style={{ background: "#08111d", borderRadius: 8, padding: 12, marginBottom: 14, fontSize: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
            <span style={{ color: "#8aa2be" }}>Компонент:</span>
            <code style={{ background: "#132845", color: "#38bdf8", padding: "2px 6px", borderRadius: 4 }}>
              &lt;{componentInfo.componentName}&gt;
            </code>
          </div>
          {componentInfo.source && (
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
              <span style={{ color: "#8aa2be" }}>Файл:</span>
              <code style={{ background: "#132845", color: "#a5f3fc", padding: "2px 6px", borderRadius: 4 }}>
                {componentInfo.source}
              </code>
            </div>
          )}
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ color: "#8aa2be" }}>Элемент:</span>
            <span style={{ color: "#e2e8f0" }}>
              &lt;{domMeta.tagName}&gt; {domMeta.text ? `"${domMeta.text}"` : ""} ({domMeta.dimensions})
            </span>
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#8aa2be", marginBottom: 6 }}>
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
              background: "#08111d",
              border: "1px solid #1a3a60",
              borderRadius: 8,
              padding: 10,
              fontSize: 13,
              color: "#e8f4ff",
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
              background: copied ? "#10b981" : "#2563eb",
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
              background: "#16283f",
              border: "1px solid #233e60",
              borderRadius: 8,
              padding: "10px 16px",
              color: "#94a3b8",
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
