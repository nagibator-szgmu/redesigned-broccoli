import { useState } from "react";
import { FONT } from "./theme";
import { useTheme } from "./ThemeContext";
import ImageLightboxModal from "./ImageLightboxModal";

/**
 * ClinicalImagePreview
 * Мобильное превью диагностического снимка с плашкой увеличения и модальным просмотром.
 */
export default function ClinicalImagePreview({ imgData, testId }) {
  const C = useTheme();
  const [activeImage, setActiveImage] = useState(null);

  if (!imgData) return null;
  const url = typeof imgData === "object" ? imgData.url : imgData;
  const caption = typeof imgData === "object" ? imgData.caption : null;

  return (
    <div style={{ marginTop: 8 }}>
      <div
        onClick={() => setActiveImage(url)}
        style={{
          position: "relative",
          height: 170,
          borderRadius: 8,
          overflow: "hidden",
          border: `1px solid ${C.border}`,
          background: "#090d16",
          cursor: "pointer",
        }}
      >
        <img
          src={url}
          alt={testId}
          style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 8,
            right: 8,
            background: "rgba(0, 0, 0, 0.75)",
            backdropFilter: "blur(4px)",
            WebkitBackdropFilter: "blur(4px)",
            color: "#ffffff",
            borderRadius: 6,
            padding: "3px 8px",
            fontSize: 10.5,
            fontFamily: FONT,
            fontWeight: 600,
            letterSpacing: 0.2,
            border: "1px solid rgba(255, 255, 255, 0.2)",
          }}
        >
          Нажмите для увеличения
        </div>
      </div>
      {caption && (
        <div style={{ fontSize: 11, fontStyle: "italic", color: C.subText, marginTop: 4, textAlign: "center", fontFamily: FONT }}>
          {caption}
        </div>
      )}
      {activeImage && <ImageLightboxModal imageUrl={activeImage} onClose={() => setActiveImage(null)} />}
    </div>
  );
}
