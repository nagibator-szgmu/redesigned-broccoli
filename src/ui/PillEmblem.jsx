import PropTypes from "prop-types";
import pillEmblem512 from "../assets/pill-emblem.png";
import pillEmblem128 from "../assets/pill-emblem-128.png";

/**
 * PillEmblem - Реалистичная статичная эмблема-таблетка с синим медицинским крестом.
 * Чистый брендовый символ без подсветки и анимаций при наведении.
 */
export default function PillEmblem({ size = 40, className = "", style = {} }) {
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
      <img
        src={pillEmblem512}
        srcSet={`${pillEmblem128} 128w, ${pillEmblem512} 512w`}
        sizes={`${size}px`}
        alt="MedSim Emblem"
        draggable={false}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          borderRadius: "50%",
          display: "block",
          filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.45))",
          userSelect: "none",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}

PillEmblem.propTypes = {
  size: PropTypes.number,
  className: PropTypes.string,
  style: PropTypes.object,
};
