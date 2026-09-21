import { FONT } from "../../../ui/theme";

export default function DebriefSummaryBanner({ doneStagesCount, roadmap, cd, C }) {
  return (
    <div
      style={{
        background: C.panel,
        border: `1px solid ${C.border}`,
        borderRadius: 14,
        padding: "14px 18px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 12,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background:
              doneStagesCount >= 5 ? `${C.green}18` : doneStagesCount >= 3 ? `${C.yellow}18` : `${C.red}18`,
            border: `1.5px solid ${
              doneStagesCount >= 5 ? C.green : doneStagesCount >= 3 ? C.yellow : C.red
            }`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 20,
          }}
        >
          {doneStagesCount >= 5 ? "🏆" : doneStagesCount >= 3 ? "⚡" : "⚠️"}
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.white, fontFamily: FONT }}>
            Соответствие дорожной карте КР: {doneStagesCount} из {roadmap.length} этапов
          </div>
          <div style={{ fontSize: 11, color: C.textDim, fontFamily: FONT, marginTop: 2 }}>
            {cd?.sourceReference
              ? `${cd.sourceReference.name} (${cd.sourceReference.year || "Стандарт"})`
              : "Клинические рекомендации Минздрава РФ"}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 6 }}>
        {roadmap.map((s) => {
          const color = s.statusColor === "green" ? C.green : s.statusColor === "yellow" ? C.yellow : C.red;
          return (
            <div
              key={s.id}
              title={`${s.title}: ${s.statusLabel}`}
              style={{
                width: 24,
                height: 24,
                borderRadius: 6,
                background: `${color}25`,
                border: `1px solid ${color}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
              }}
            >
              {s.status === "done" ? "✓" : s.status === "partial" ? "•" : "✕"}
            </div>
          );
        })}
      </div>
    </div>
  );
}
