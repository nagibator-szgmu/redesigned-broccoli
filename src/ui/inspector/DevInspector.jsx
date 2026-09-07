import { useState, useEffect, useCallback, useRef } from "react";
import { extractComponentInfo, getDomMeta } from "./inspectorUtils";
import FeedbackModal from "./FeedbackModal";

export default function DevInspector() {
  const [inspecting, setInspecting] = useState(false);
  const [hoveredRect, setHoveredRect] = useState(null);
  const [hoveredLabel, setHoveredLabel] = useState("");
  const [selectedData, setSelectedData] = useState(null);
  const inspectingRef = useRef(inspecting);
  inspectingRef.current = inspecting;

  const handleInspectTarget = useCallback((target) => {
    if (!target || target.closest("[data-inspector-ui]")) return;
    const componentInfo = extractComponentInfo(target);
    const domMeta = getDomMeta(target);
    setSelectedData({ componentInfo, domMeta });
    setInspecting(false);
    setHoveredRect(null);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.altKey || e.metaKey) && e.key.toLowerCase() === "i") {
        e.preventDefault();
        setInspecting((prev) => !prev);
      }
      if (e.key === "Escape" && inspectingRef.current) {
        setInspecting(false);
        setHoveredRect(null);
      }
    };

    const handleGlobalClick = (e) => {
      if (e.altKey) {
        const target = e.target;
        if (!target.closest("[data-inspector-ui]")) {
          e.preventDefault();
          e.stopPropagation();
          handleInspectTarget(target);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("click", handleGlobalClick, true);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("click", handleGlobalClick, true);
    };
  }, [handleInspectTarget]);

  useEffect(() => {
    if (!inspecting) {
      setHoveredRect(null);
      return;
    }

    const handleMouseOver = (e) => {
      const target = e.target;
      if (!target || target.closest("[data-inspector-ui]")) {
        setHoveredRect(null);
        return;
      }
      const rect = target.getBoundingClientRect();
      const comp = extractComponentInfo(target);
      setHoveredRect(rect);
      setHoveredLabel(`<${comp.componentName}>`);
    };

    const handleClick = (e) => {
      const target = e.target;
      if (target.closest("[data-inspector-ui]")) return;
      e.preventDefault();
      e.stopPropagation();
      handleInspectTarget(target);
    };

    window.addEventListener("mouseover", handleMouseOver, true);
    window.addEventListener("click", handleClick, true);
    return () => {
      window.removeEventListener("mouseover", handleMouseOver, true);
      window.removeEventListener("click", handleClick, true);
    };
  }, [inspecting, handleInspectTarget]);

  return (
    <>
      {inspecting && hoveredRect && (
        <div
          data-inspector-ui
          style={{
            position: "fixed",
            left: hoveredRect.left,
            top: hoveredRect.top,
            width: hoveredRect.width,
            height: hoveredRect.height,
            border: "2px solid #00e6c8",
            background: "rgba(0, 230, 200, 0.08)",
            boxShadow: "0 0 10px rgba(0, 230, 200, 0.4)",
            pointerEvents: "none",
            zIndex: 999999,
            borderRadius: 4,
            transition: "all 0.05s ease-out",
          }}
        >
          <span
            style={{
              position: "absolute",
              top: hoveredRect.top < 24 ? 2 : -22,
              left: 0,
              background: "#0d1a2e",
              border: "1px solid #00e6c8",
              color: "#00e6c8",
              fontSize: 11,
              fontWeight: 700,
              padding: "1px 6px",
              borderRadius: 4,
              fontFamily: "'Inter', sans-serif",
              whiteSpace: "nowrap",
            }}
          >
            {hoveredLabel}
          </span>
        </div>
      )}

      <div
        data-inspector-ui
        style={{
          position: "fixed",
          bottom: 4,
          right: 8,
          zIndex: 999990,
          fontFamily: "'Inter', sans-serif",
        }}
      >
        <button
          onClick={() => setInspecting((p) => !p)}
          title="Инспектор UI: кликните по элементу или зажмите Alt+Клик"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            background: inspecting ? "#00e6c8" : "rgba(13, 26, 46, 0.9)",
            color: inspecting ? "#070d18" : "#e8f4ff",
            border: inspecting ? "1px solid #00e6c8" : "1px solid rgba(0, 230, 200, 0.3)",
            borderRadius: 14,
            padding: "4px 10px",
            fontSize: 11,
            fontWeight: 700,
            cursor: "pointer",
            boxShadow: inspecting
              ? "0 0 15px rgba(0, 230, 200, 0.5)"
              : "0 2px 8px rgba(0,0,0,0.4)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            transition: "all 0.2s ease",
          }}
        >
          <span style={{ fontSize: 11 }}>🎯</span>
          <span>{inspecting ? "Выбор (Esc)" : "Инспектор"}</span>
        </button>
      </div>

      {selectedData && (
        <FeedbackModal
          elementData={selectedData}
          onClose={() => setSelectedData(null)}
        />
      )}
    </>
  );
}
