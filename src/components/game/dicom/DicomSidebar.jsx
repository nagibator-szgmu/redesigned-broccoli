import { FONT } from "../../../ui/theme";
import { WINDOW_PRESETS } from "../../../engine/dicomRenderer";

export default function DicomSidebar({
  cd,
  onClose,
  isMobile,
  preset,
  setPreset,
  rulerMode,
  toggleRuler,
  C,
}) {
  return (
    <div
      style={{
        width: isMobile ? "100%" : 250,
        borderRight: isMobile ? "none" : "1px solid rgba(255,255,255,0.08)",
        borderBottom: isMobile ? "1px solid rgba(255,255,255,0.08)" : "none",
        padding: isMobile ? 12 : 18,
        display: "flex",
        flexDirection: "column",
        gap: isMobile ? 10 : 18,
        background: "#080f1b",
        boxSizing: "border-box",
        flexShrink: 0,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h2 style={{ fontSize: 15, fontWeight: 700, margin: 0, color: C.accent, letterSpacing: 0.8 }}>
          PACS VIEW
        </h2>
        <button
          onClick={onClose}
          style={{
            background: "rgba(255,61,90,0.15)",
            border: "1px solid rgba(255,61,90,0.3)",
            borderRadius: 8,
            padding: "5px 12px",
            color: C.red,
            fontSize: 11,
            cursor: "pointer",
            fontFamily: FONT,
            fontWeight: 600,
          }}
        >
          Закрыть
        </button>
      </div>

      <div>
        <div style={{ fontSize: 10, color: C.textDim, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8, fontWeight: 600 }}>
          Карта Пациента
        </div>
        <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: 12, border: "1px solid rgba(255,255,255,0.04)", fontSize: 12, lineHeight: 1.6 }}>
          <div><strong>ФИО:</strong> {cd?.name || "Иванов И.И."}</div>
          <div><strong>Возраст:</strong> {cd?.age || "60"} л.</div>
          <div><strong>Исследование:</strong> КТ головного мозга</div>
          <div><strong>Режим:</strong> Нативный (без к/у)</div>
        </div>
      </div>

      <div>
        <div style={{ fontSize: 10, color: C.textDim, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8, fontWeight: 600 }}>
          Оконные режимы (W/L)
        </div>
        <div style={{ display: "flex", flexDirection: isMobile ? "row" : "column", gap: 6, flexWrap: "wrap" }}>
          {Object.values(WINDOW_PRESETS).map((p) => {
            const isActive = preset.name === p.name;
            return (
              <button
                key={p.name}
                onClick={() => setPreset(p)}
                style={{
                  background: isActive ? `${C.accent}18` : "rgba(255,255,255,0.03)",
                  border: `1px solid ${isActive ? C.accent : "rgba(255,255,255,0.06)"}`,
                  borderRadius: 8,
                  padding: "8px 12px",
                  color: isActive ? C.accent : C.textDim,
                  fontSize: 11.5,
                  cursor: "pointer",
                  textAlign: "left",
                  fontFamily: FONT,
                  transition: "all 0.15s",
                  flex: isMobile ? "1 1 auto" : "none",
                }}
              >
                {p.name} (W:{p.windowWidth} L:{p.windowLevel})
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <div style={{ fontSize: 10, color: C.textDim, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8, fontWeight: 600 }}>
          Инструменты
        </div>
        <button
          onClick={toggleRuler}
          style={{
            width: "100%",
            background: rulerMode ? `${C.green}18` : "rgba(255,255,255,0.03)",
            border: `1px solid ${rulerMode ? C.green : "rgba(255,255,255,0.06)"}`,
            borderRadius: 8,
            padding: "9px 12px",
            color: rulerMode ? C.green : C.textDim,
            fontSize: 12,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontFamily: FONT,
            fontWeight: 600,
            transition: "all 0.15s",
          }}
        >
          <span>📏</span> Линейка (измерение в мм)
        </button>
      </div>

      {!isMobile && (
        <div style={{ marginTop: "auto", fontSize: 10, color: C.textDim, lineHeight: 1.5 }}>
          💡 Используйте колесо мыши для пролистывания срезов над снимком.
        </div>
      )}
    </div>
  );
}
