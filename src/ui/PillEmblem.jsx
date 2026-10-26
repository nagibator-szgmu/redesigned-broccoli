import { useState } from "react";
import PropTypes from "prop-types";
import pillEmblem512 from "../assets/pill-emblem.png";
import pillEmblem128 from "../assets/pill-emblem-128.png";

/**
 * PillEmblem - Реалистичная статичная эмблема-таблетка с синим медицинским крестом.
 * Чистый брендовый символ без подсветки и анимаций при наведении.
 * Содержит векторный SVG-фоллбэк на случай сбоев загрузки ассетов.
 */
export default function PillEmblem({ size = 40, className = "", style = {} }) {
  const [hasError, setHasError] = useState(false);

  return (
    <div
      className={`pill-emblem-wrapper ${className}`}
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        flexShrink: 0,
        ...style,
      }}
    >
      {!hasError ? (
        <img
          src={pillEmblem128}
          srcSet={`${pillEmblem128} 128w, ${pillEmblem512} 512w`}
          sizes={`${size}px`}
          alt=""
          onError={() => setHasError(true)}
          draggable={false}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            borderRadius: "50%",
            display: "block",
            filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.35))",
            userSelect: "none",
            pointerEvents: "none",
          }}
        />
      ) : (
        <svg
          width={size}
          height={size}
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.25))" }}
        >
          <circle cx="20" cy="20" r="18" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="1.5" />
          <circle cx="20" cy="20" r="15.5" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="1" />
          <rect x="18" y="7" width="4" height="26" rx="2" fill="#2563EB" />
          <rect x="7" y="18" width="26" height="4" rx="2" fill="#2563EB" />
        </svg>
      )}
    </div>
  );
}

PillEmblem.propTypes = {
  size: PropTypes.number,
  className: PropTypes.string,
  style: PropTypes.object,
};
