import { RADIUS, FONT } from "../../../ui/theme";

export default function MobileFilterChips({
  deptFilters,
  department,
  setDepartment,
  checkDeptTutorial,
  navSpec,
  specFilter,
  setSpecFilter,
  t,
  C,
}) {
  return (
    <>
      {/* Department filter chips */}
      <div
        id="tutorial-filters"
        className="no-scrollbar"
        style={{
          display: "flex",
          gap: 8,
          overflowX: "auto",
          padding: "8px 16px 4px",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {deptFilters.map(({ key, label }) => {
          const isA = department === key;
          return (
            <button
              key={key}
              onClick={() => {
                setDepartment(key);
                if (key !== "all") checkDeptTutorial?.(key);
              }}
              style={{
                flexShrink: 0,
                minHeight: 38,
                padding: "0 16px",
                borderRadius: RADIUS.full,
                fontSize: 13,
                fontFamily: FONT,
                fontWeight: 500,
                cursor: "pointer",
                background: isA ? `${C.accent}20` : C.btnBg,
                border: `1px solid ${isA ? C.accent : C.border}`,
                color: isA ? C.accent : C.textDim,
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <span>{label}</span>
            </button>
          );
        })}
      </div>

      {/* Spec chips */}
      <div
        className="no-scrollbar"
        style={{
          display: "flex",
          gap: 8,
          overflowX: "auto",
          padding: "6px 16px 12px",
          WebkitOverflowScrolling: "touch",
        }}
      >
        <button
          onClick={() => setSpecFilter(null)}
          style={{
            flexShrink: 0,
            minHeight: 34,
            padding: "0 14px",
            borderRadius: RADIUS.full,
            fontSize: 12,
            fontFamily: FONT,
            fontWeight: 500,
            cursor: "pointer",
            background: !specFilter ? `${C.accent}20` : C.btnBg,
            border: `1px solid ${!specFilter ? C.accent : C.border}`,
            color: !specFilter ? C.accent : C.textDim,
          }}
        >
          {t("filter.all")}
        </button>
        {navSpec.map(({ label, cat }) => {
          const isA = specFilter === cat;
          return (
            <button
              key={cat}
              onClick={() => setSpecFilter(isA ? null : cat)}
              style={{
                flexShrink: 0,
                minHeight: 34,
                padding: "0 14px",
                borderRadius: RADIUS.full,
                fontSize: 12,
                fontFamily: FONT,
                fontWeight: 500,
                cursor: "pointer",
                background: isA ? `${C.accent}20` : C.btnBg,
                border: `1px solid ${isA ? C.accent : C.border}`,
                color: isA ? C.accent : C.textDim,
              }}
            >
              {label}
            </button>
          );
        })}
      </div>
    </>
  );
}
