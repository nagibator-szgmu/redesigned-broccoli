import { RADIUS, FONT } from "../../../ui/theme";
import { CASES } from "../../../data/cases";
import MobileCaseCard from "./MobileCaseCard";

export default function MobileCaseList({
  displayCases,
  visible,
  specFilter,
  searchQuery,
  showAllCases,
  setShowAllCases,
  catMeta,
  caseScores,
  startGame,
  t,
  C,
}) {
  const listTitle = specFilter
    ? catMeta[specFilter]?.label
    : searchQuery
    ? t("cases.searchResults")
    : t("cases.title");

  return (
    <div
      style={{
        padding: "0 16px",
        paddingBottom: "calc(160px + env(safe-area-inset-bottom, 16px))",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        <div style={{ fontSize: 15, fontWeight: 700, color: C.white, fontFamily: FONT }}>
          {listTitle}
        </div>
        <button
          onClick={() => setShowAllCases((v) => !v)}
          style={{
            fontSize: 12,
            color: C.accent,
            fontFamily: FONT,
            cursor: "pointer",
            padding: "6px 12px",
            borderRadius: RADIUS.sm,
            border: `1px solid ${C.accent}40`,
            background: `${C.accent}12`,
          }}
        >
          {showAllCases ? t("cases.collapse") : t("cases.showAll", { n: CASES.length })}
        </button>
      </div>

      {visible.length === 0 ? (
        <div
          style={{
            color: C.textDim,
            fontSize: 14,
            fontFamily: FONT,
            padding: "20px 0",
            textAlign: "center",
          }}
        >
          {t("cases.empty")}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {displayCases.map((c) => (
            <MobileCaseCard
              key={c.id}
              c={c}
              catMeta={catMeta}
              caseScores={caseScores}
              startGame={startGame}
              t={t}
              C={C}
            />
          ))}
        </div>
      )}
    </div>
  );
}
