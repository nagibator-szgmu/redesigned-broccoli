import { useEffect } from "react";
import { IconX } from "./icons";

/**
 * ImageLightboxModal
 * Полноэкранный модальный просмотр клинических снимков высокого разрешения.
 * Соответствует строгому требованию: только увеличенное изображение без лишних текстовых оверлеев.
 */
export default function ImageLightboxModal({ imageUrl, onClose }) {
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!imageUrl) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(0, 0, 0, 0.92)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        cursor: "zoom-out",
        animation: "fadeIn 0.2s ease-out",
      }}
    >
      {/* Кнопка закрытия */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        aria-label="Закрыть"
        style={{
          position: "absolute",
          top: "16px",
          right: "16px",
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.15)",
          border: "1px solid rgba(255, 255, 255, 0.25)",
          color: "#ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          zIndex: 10000,
          transition: "background 0.15s, transform 0.15s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(255, 255, 255, 0.25)";
          e.currentTarget.style.transform = "scale(1.05)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(255, 255, 255, 0.15)";
          e.currentTarget.style.transform = "scale(1)";
        }}
      >
        <IconX size={22} color="#ffffff" />
      </button>

      {/* Увеличенное изображение */}
      <img
        src={imageUrl}
        alt="Клинический снимок"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: "94vw",
          maxHeight: "88vh",
          objectFit: "contain",
          borderRadius: "8px",
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.8)",
          cursor: "default",
          userSelect: "none",
        }}
      />
    </div>
  );
}
