import { FONT, CODE } from "../../../ui/theme";

export default function DebriefStageItem({ item, C }) {
  const isSuccess = item.krStatus === "success";
  const isCritDanger = item.krStatus === "critical_danger";
  const itemColor = isCritDanger ? C.red : isSuccess ? C.green : C.red;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 10,
        padding: "8px 12px",
        borderRadius: 8,
        background: isCritDanger ? `${C.red}18` : isSuccess ? `${C.green}0e` : `${C.red}0c`,
        border: `1px solid ${itemColor}33`,
      }}
    >
      <span style={{ fontSize: 14, marginTop: 1 }}>
        {isCritDanger ? "🚨" : isSuccess ? "🟢" : "🔴"}
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12.5, fontWeight: 600, color: C.white, fontFamily: FONT }}>
          {item.name}
        </div>
        {item.detail && (
          <div
            style={{
              fontSize: 11.5,
              color: C.textDim,
              marginTop: 2,
              fontFamily: FONT,
              lineHeight: 1.4,
            }}
          >
            {item.detail}
          </div>
        )}
        {item.rationale && (
          <div style={{ fontSize: 11, color: itemColor, marginTop: 2, fontFamily: FONT }}>
            {item.rationale}
          </div>
        )}
      </div>
      <span
        style={{
          fontSize: 10.5,
          fontWeight: 700,
          color: itemColor,
          textTransform: "uppercase",
          fontFamily: CODE,
        }}
      >
        {isCritDanger ? "ОШИБКА" : isSuccess ? "ВЫПОЛНЕНО" : "ПРОПУЩЕНО"}
      </span>
    </div>
  );
}
