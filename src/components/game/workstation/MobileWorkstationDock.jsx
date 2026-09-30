import { useTheme } from "../../../ui/ThemeContext";
import { FONT } from "../../../ui/theme";

/** Bottom Navigation Dock subcomponent for MobileWorkstation */
export default function MobileWorkstationDock({ activeTab, setActiveTab, navItems }) {
  const C = useTheme();

  return (
    <div style={{
      minHeight: 54,
      flexShrink: 0,
      display: "flex",
      background: C.headerBg,
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      borderTop: `1px solid ${C.border}`,
      paddingBottom: "max(6px, env(safe-area-inset-bottom, 6px))",
      boxSizing: "border-box",
    }}>
      {navItems.map(item => {
        const isActive = activeTab === item.key;
        const IconComp = item.icon;
        return (
          <button
            key={item.key}
            onClick={() => setActiveTab(item.key)}
            style={{
              flex: 1,
              minHeight: 48,
              border: "none",
              background: isActive ? `${C.accent}0f` : "transparent",
              borderTop: isActive ? `2px solid ${C.accent}` : "2px solid transparent",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 3,
              position: "relative",
              touchAction: "manipulation",
              padding: "6px 2px",
            }}
          >
            <span style={{ display: "inline-flex", color: isActive ? C.accent : C.textDim }}>
              {typeof IconComp === "function" ? <IconComp size={18} /> : IconComp}
            </span>
            <span style={{ fontSize: 11, fontFamily: FONT, fontWeight: isActive ? 600 : 500, color: isActive ? C.accent : C.textDim }}>
              {item.label}
            </span>
            {item.badge > 0 && (
              <div style={{
                position: "absolute",
                top: 4,
                right: "calc(50% - 20px)",
                minWidth: 16,
                height: 16,
                background: C.accent,
                borderRadius: 8,
                padding: "0 4px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 9.5,
                color: "#000",
                fontWeight: 700,
                fontVariantNumeric: "tabular-nums",
                boxSizing: "border-box",
              }}>
                {item.badge}
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
