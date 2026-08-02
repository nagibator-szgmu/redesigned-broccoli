import { useTheme } from "../../../ui/ThemeContext";
import { FONT } from "../../../ui/theme";

/** Bottom Navigation Dock subcomponent for MobileWorkstation */
export default function MobileWorkstationDock({ activeTab, setActiveTab, navItems }) {
  const C = useTheme();

  return (
    <div style={{
      height: 52,
      flexShrink: 0,
      display: "flex",
      background: C.headerBg,
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      borderTop: `1px solid ${C.border}`
    }}>
      {navItems.map(item => {
        const isActive = activeTab === item.key;
        return (
          <button
            key={item.key}
            onClick={() => setActiveTab(item.key)}
            style={{
              flex: 1,
              border: "none",
              background: isActive ? `${C.accent}0f` : "transparent",
              borderTop: isActive ? `2px solid ${C.accent}` : "2px solid transparent",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
              position: "relative"
            }}
          >
            <span style={{ fontSize: 14 }}>{item.icon}</span>
            <span style={{ fontSize: 10, fontFamily: FONT, fontWeight: isActive ? 600 : 400, color: isActive ? C.accent : C.textDim }}>
              {item.label}
            </span>
            {item.badge > 0 && (
              <div style={{
                position: "absolute",
                top: 4,
                right: "calc(50% - 18px)",
                width: 15,
                height: 15,
                background: C.accent,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 9,
                color: "#000",
                fontWeight: 700
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
