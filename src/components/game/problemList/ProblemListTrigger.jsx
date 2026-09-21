import React from "react";
import { FONT } from "../../../ui/theme";

export default function ProblemListTrigger({ onStart, C }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <button
        onClick={onStart}
        style={{
          width: "100%",
          padding: "10px 14px",
          background: `linear-gradient(135deg, ${C.panelBg} 0%, rgba(0, 230, 200, 0.08) 100%)`,
          border: `1px solid ${C.accent}44`,
          borderRadius: 12,
          color: C.white,
          fontFamily: FONT,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          boxShadow: "0 4px 14px rgba(0,0,0,0.25)",
          transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = C.accent;
          e.currentTarget.style.transform = "translateY(-1px)";
          e.currentTarget.style.boxShadow = "0 6px 18px rgba(0,230,200,0.2)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = `${C.accent}44`;
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 4px 14px rgba(0,0,0,0.25)";
        }}
      >
        <span style={{ fontSize: 18 }}>👨‍⚕️</span>
        <div style={{ textAlign: "left" }}>
          <div style={{ fontSize: 12.5, fontWeight: 700, color: C.accent, letterSpacing: 0.2 }}>
            Помощь наставника
          </div>
          <div style={{ fontSize: 10, color: C.textDim, marginTop: 1 }}>
            Анализ ведущих клинических синдромов (15 сек)
          </div>
        </div>
      </button>
    </div>
  );
}
