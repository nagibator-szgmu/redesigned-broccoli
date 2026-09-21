import React from "react";

export default function EmblemFallback({ width, height, text = "45 am" }) {
  return (
    <div
      style={{
        width,
        height,
        borderRadius: 14,
        background:
          "linear-gradient(135deg, rgba(17,67,254,0.15) 0%, rgba(1,255,113,0.1) 100%)",
        border: "1px solid rgba(56,189,248,0.3)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#38bdf8",
        fontSize: 12,
        fontWeight: 700,
        textTransform: "uppercase",
      }}
    >
      {text}
    </div>
  );
}
