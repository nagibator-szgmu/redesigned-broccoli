export default function TeacherMockControls({ C }) {
  return (
    <div
      data-testid="teacher-disabled-controls"
      style={{
        opacity: 0.5,
        pointerEvents: "none",
        userSelect: "none",
        cursor: "not-allowed",
        background: C.headerBg2,
        border: `1px solid ${C.border}`,
        borderRadius: 12,
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 8,
        }}
      >
        <div style={{ display: "flex", gap: 8 }}>
          <button
            tabIndex={-1}
            disabled
            style={{
              padding: "8px 14px",
              borderRadius: 8,
              background: C.panelBg,
              border: `1px solid ${C.border}`,
              color: C.textDim,
              fontSize: 12,
              fontWeight: 600,
              cursor: "not-allowed",
            }}
          >
            Студенты группы
          </button>
          <button
            tabIndex={-1}
            disabled
            style={{
              padding: "8px 14px",
              borderRadius: 8,
              background: C.panelBg,
              border: `1px solid ${C.border}`,
              color: C.textDim,
              fontSize: 12,
              fontWeight: 600,
              cursor: "not-allowed",
            }}
          >
            Тепловая карта ошибок
          </button>
        </div>

        <button
          tabIndex={-1}
          disabled
          style={{
            padding: "8px 16px",
            borderRadius: 8,
            background: `${C.accent}20`,
            border: `1px solid ${C.accent}40`,
            color: C.textDim,
            fontSize: 12,
            fontWeight: 700,
            cursor: "not-allowed",
          }}
        >
          📥 Экспорт отчёта CSV
        </button>
      </div>

      <div
        style={{
          height: 54,
          borderRadius: 8,
          background: `${C.dimBg}`,
          border: `1px dashed ${C.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 12,
          color: C.textDim,
        }}
      >
        Интерактивные функции временно отключены
      </div>
    </div>
  );
}
