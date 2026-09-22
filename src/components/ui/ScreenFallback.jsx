import { FONT } from "../../ui/theme";

export default function ScreenFallback() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "transparent",
        color: "#2563EB",
        fontFamily: FONT,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            border: "3px solid rgba(37,99,235,0.2)",
            borderTopColor: "#2563EB",
            animation: "spinGear 0.8s linear infinite",
          }}
        />
        <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: 0.5, opacity: 0.8 }}>
          Загрузка модуля...
        </span>
      </div>
    </div>
  );
}
