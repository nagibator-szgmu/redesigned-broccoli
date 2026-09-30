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
  const isAll = department === "all" && !specFilter;

  return (
    <div
      id="tutorial-filters"
      className="no-scrollbar"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        overflowX: "auto",
        padding: "4px 14px 4px",
        WebkitOverflowScrolling: "touch",
      }}
    >
      {/* 1. All Button */}
      <button
        onClick={() => {
          setDepartment("all");
          setSpecFilter(null);
        }}
        style={{
          flexShrink: 0,
          minHeight: 34,
          padding: "0 14px",
          borderRadius: RADIUS.full,
          fontSize: 12.5,
          fontFamily: FONT,
          fontWeight: isAll ? 700 : 500,
          cursor: "pointer",
          background: isAll ? `${C.accent}22` : C.btnBg,
          border: `1px solid ${isAll ? C.accent : C.border}`,
          color: isAll ? C.accent : C.textDim,
          transition: "all 0.15s ease",
        }}
      >
        {t("filter.all")}
      </button>

      {/* 2. Departments */}
      {deptFilters.filter((d) => d.key !== "all").map(({ key, label }) => {
        const isA = department === key && !specFilter;
        return (
          <button
            key={key}
            onClick={() => {
              setDepartment(key);
              setSpecFilter(null);
              if (key !== "all") checkDeptTutorial?.(key);
            }}
            style={{
              flexShrink: 0,
              minHeight: 34,
              padding: "0 13px",
              borderRadius: RADIUS.full,
              fontSize: 12.5,
              fontFamily: FONT,
              fontWeight: isA ? 700 : 500,
              cursor: "pointer",
              background: isA ? `${C.accent}22` : C.btnBg,
              border: `1px solid ${isA ? C.accent : C.border}`,
              color: isA ? C.accent : C.textDim,
              transition: "all 0.15s ease",
            }}
          >
            {label}
          </button>
        );
      })}

      {/* Divider */}
      <div style={{ width: 1, height: 18, background: C.border, flexShrink: 0, margin: "0 2px" }} />

      {/* 3. Specialties */}
      {navSpec.map(({ label, cat }) => {
        const isA = specFilter === cat;
        return (
          <button
            key={cat}
            onClick={() => {
              setSpecFilter(isA ? null : cat);
            }}
            style={{
              flexShrink: 0,
              minHeight: 34,
              padding: "0 13px",
              borderRadius: RADIUS.full,
              fontSize: 12.5,
              fontFamily: FONT,
              fontWeight: isA ? 700 : 500,
              cursor: "pointer",
              background: isA ? `${C.accent}22` : C.btnBg,
              border: `1px solid ${isA ? C.accent : C.border}`,
              color: isA ? C.accent : C.textDim,
              transition: "all 0.15s ease",
            }}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
