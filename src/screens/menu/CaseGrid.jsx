import { FONT } from "../../ui/theme";
import { CASES } from "../../data/cases";
import CaseCard from "./CaseCard";

/**
 * CaseGrid component for rendering section header, controls, and 2-column grid of cases.
 * Handles empty state when no cases match search or filter query.
 *
 * @param {Object} props
 * @param {Array} props.cases - Filtered visible cases
 * @param {string|null} props.specFilter
 * @param {string} props.department
 * @param {string} props.searchQuery
 * @param {boolean} props.showAllCases
 * @param {Function} props.setShowAllCases
 * @param {Function} props.setSpecFilter
 * @param {boolean} props.isDevMode
 * @param {Record<string, any>} props.catMeta
 * @param {Record<string, number>} props.caseScores
 * @param {Function} props.startGame
 * @param {Function} props.t
 * @param {Object} props.C
 */
export default function CaseGrid({
  cases,
  specFilter,
  department,
  searchQuery,
  showAllCases,
  setShowAllCases,
  setSpecFilter,
  isDevMode,
  catMeta,
  caseScores,
  startGame,
  t,
  C,
}) {
  const displayCases = specFilter || department !== "all" || searchQuery || showAllCases || isDevMode ? cases : cases.slice(0, 4);

  return (
    <div>
      {/* Cases header */}
      <div id="tutorial-cases" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div style={{ fontSize: 17, fontWeight: 700, color: C.white, fontFamily: FONT, letterSpacing: -0.3 }}>
          {specFilter ? `${catMeta[specFilter]?.label || specFilter}` : searchQuery ? t("cases.searchResults") : t("cases.title")}
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {specFilter && (
            <div
              onClick={() => setSpecFilter(null)}
              style={{
                fontSize: 12,
                color: C.accent,
                fontFamily: FONT,
                cursor: "pointer",
                padding: "5px 13px",
                borderRadius: 8,
                border: "1px solid rgba(0,230,200,0.25)",
                background: "rgba(0,230,200,0.1)",
              }}
            >
              {t("cases.clear")}
            </div>
          )}
          <div
            onClick={() => setShowAllCases((v) => !v)}
            style={{
              fontSize: 12,
              color: showAllCases ? C.white : C.accent,
              fontFamily: FONT,
              cursor: "pointer",
              padding: "5px 13px",
              borderRadius: 8,
              border: `1px solid ${showAllCases ? "rgba(0,230,200,0.35)" : "rgba(0,230,200,0.2)"}`,
              background: showAllCases ? "rgba(0,230,200,0.15)" : "rgba(0,230,200,0.06)",
              fontWeight: showAllCases ? 600 : 400,
            }}
          >
            {showAllCases ? t("cases.collapse") : t("cases.showAll", { n: CASES.length })}
          </div>
        </div>
      </div>

      {/* Cases grid or empty state */}
      {cases.length === 0 ? (
        <div style={{ color: C.textDim, fontSize: 14, fontFamily: FONT, padding: "20px 0" }}>
          {t("cases.empty")}
          {searchQuery ? t("cases.emptySearch") : t("cases.emptyFilter")}
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 340px), 1fr))", gap: 14 }}>
          {displayCases.map((c, i) => (
            <CaseCard key={c.id} caseData={c} index={i} catMeta={catMeta} caseScores={caseScores} startGame={startGame} t={t} C={C} />
          ))}
        </div>
      )}
    </div>
  );
}
