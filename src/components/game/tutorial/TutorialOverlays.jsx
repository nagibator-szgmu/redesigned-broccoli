import React from "react";
import { FONT } from "../../../ui/theme";

export function SpotlightOverlay({ rect, accent }) {
  if (!rect) return null;
  return (
    <>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: rect.top,
          zIndex: 2147483646,
          background: "rgba(0,0,0,0.6)",
        }}
      />
      <div
        style={{
          position: "fixed",
          top: rect.bottom,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 2147483646,
          background: "rgba(0,0,0,0.6)",
        }}
      />
      <div
        style={{
          position: "fixed",
          top: rect.top,
          bottom: rect.bottom,
          left: 0,
          width: rect.left,
          zIndex: 2147483646,
          background: "rgba(0,0,0,0.6)",
        }}
      />
      <div
        style={{
          position: "fixed",
          top: rect.top,
          bottom: rect.bottom,
          left: rect.right,
          right: 0,
          zIndex: 2147483646,
          background: "rgba(0,0,0,0.6)",
        }}
      />
      <div
        style={{
          position: "fixed",
          top: rect.top - 2,
          left: rect.left - 2,
          width: rect.width + 4,
          height: rect.height + 4,
          zIndex: 2147483647,
          border: `2px solid ${accent}`,
          borderRadius: 4,
          boxShadow: `0 0 20px ${accent}66`,
          pointerEvents: "none",
        }}
      />
    </>
  );
}

export function TooltipCard({ children, accent }) {
  return (
    <div
      style={{
        position: "fixed",
        bottom: 60,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 2147483647,
        maxWidth: 400,
        width: "90%",
        background: "rgba(18,28,43,0.97)",
        border: `1px solid ${accent}44`,
        borderRadius: 12,
        padding: "16px 18px",
        boxShadow: `0 12px 40px rgba(0,0,0,0.6), 0 0 20px ${accent}22`,
        fontFamily: FONT,
      }}
    >
      {children}
    </div>
  );
}
