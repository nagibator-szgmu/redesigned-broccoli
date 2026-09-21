import React, { useRef, useState } from "react";
import { useThreeEmblem } from "./ticker/useThreeEmblem";
import EmblemFallback from "./ticker/EmblemFallback";

/**
 * 3-Sided (Трехгранная) 3D Ribbon Emblem with procedural "45 am" text.
 * Renders a 3-faceted twisted ribbon spiral rotating in 3D space.
 */
export function Emblem3D({ width = 176, height = 110, text = "45 am" }) {
  const mountRef = useRef(null);
  const [hasError, setHasError] = useState(false);

  useThreeEmblem(mountRef, { width, height, text, setHasError });

  if (hasError) {
    return <EmblemFallback width={width} height={height} text={text} />;
  }

  return (
    <div
      id="medsim-3d-emblem-container"
      ref={mountRef}
      style={{
        width,
        height,
        borderRadius: 14,
        border: "1px solid rgba(56,189,248,0.25)",
        background:
          "radial-gradient(circle at center, rgba(15,23,42,0.85) 0%, rgba(2,6,23,0.98) 100%)",
        overflow: "hidden",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    />
  );
}

export default Emblem3D;

