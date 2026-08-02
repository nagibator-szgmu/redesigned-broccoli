import { FONT } from "../../ui/theme";

/**
 * CaseExplorerBar component for quick specialization filter chips.
 * Allows instant filtering of clinical cases by specialty category.
 *
 * @param {Object} props
 * @param {string|null} props.specFilter
 * @param {Function} props.setSpecFilter
 * @param {Array<{icon: string, label: string, cat: string}>} props.navSpec
 * @param {Function} props.t
 * @param {Object} props.C
 */
export default function CaseExplorerBar({ specFilter, setSpecFilter, navSpec, t, C }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
      <div
        onClick={() => setSpecFilter(null)}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "6px 14px",
          borderRadius: 20,
          fontSize: 12,
          lineHeight: 1,
          fontFamily: FONT,
          cursor: "pointer",
          transition: "all 0.15s",
          background: !specFilter ? `${C.accent}18` : C.btnBg,
          border: `1px solid ${!specFilter ? C.accent : "rgba(0,230,200,0.08)"}`,
          color: !specFilter ? C.accent : C.textDim,
        }}
      >
        {t("filter.all")}
      </div>
      {navSpec.map(({ icon, label, cat }) => {
        const isActive = specFilter === cat;
        return (
          <div
            key={cat}
            onClick={() => setSpecFilter(isActive ? null : cat)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              padding: "6px 14px",
              borderRadius: 20,
              fontSize: 12,
              lineHeight: 1,
              fontFamily: FONT,
              cursor: "pointer",
              transition: "all 0.15s",
              background: isActive ? `${C.accent}18` : C.btnBg,
              border: `1px solid ${isActive ? C.accent : "rgba(0,230,200,0.08)"}`,
              color: isActive ? C.accent : C.textDim,
            }}
          >
            {icon}
            <span>{label}</span>
          </div>
        );
      })}
    </div>
  );
}
