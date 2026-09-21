import { FONT, RADIUS } from "../../../ui/theme";
import {
  IconTheory,
  IconTarget,
  IconMap,
  IconTrophy,
  IconGraduationCap,
  IconChartBar,
  IconGear,
  IconLogOut,
  IconX,
} from "../../../ui/icons";

export default function MobileDrawer({
  drawerOpen,
  setDrawerOpen,
  setPhase,
  setProgressionMode,
  setShowSettings,
  logout,
  t,
  C,
}) {
  if (!drawerOpen) return null;

  const navigate = (phase, mode) => {
    if (mode) setProgressionMode(mode);
    setPhase(phase);
    setDrawerOpen(false);
  };

  const navItems = [
    { label: t("nav.theory"), icon: <IconTheory size={18} color={C.accent} />, action: () => navigate("theory") },
    { label: t("nav.curriculum"), icon: <IconTarget size={18} color={C.accent} />, action: () => navigate("theory", "strict") },
    { label: t("nav.courseMap"), icon: <IconMap size={18} color={C.accent} />, action: () => navigate("map") },
    { label: t("nav.leaderboard"), icon: <IconTrophy size={18} color={C.accent} />, action: () => navigate("leaderboard") },
    { label: t("nav.certificates"), icon: <IconGraduationCap size={18} color={C.accent} />, action: () => navigate("certificates") },
    { label: t("nav.teacherDashboard"), icon: <IconChartBar size={18} color={C.accent} />, action: () => navigate("teacher_dashboard") },
    { label: t("nav.settings"), icon: <IconGear size={18} color={C.accent} />, action: () => { setShowSettings(true); setDrawerOpen(false); } },
    { label: t("auth.logout"), icon: <IconLogOut size={18} color={C.red} />, action: () => { logout(); setDrawerOpen(false); }, danger: true },
  ];

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 120, display: "flex" }}>
      <div
        onClick={() => setDrawerOpen(false)}
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.6)",
          backdropFilter: "blur(4px)",
        }}
      />
      <div
        style={{
          position: "relative",
          marginLeft: "auto",
          width: "80%",
          maxWidth: 300,
          height: "100%",
          background: C.panel2,
          borderLeft: `1px solid ${C.border}`,
          display: "flex",
          flexDirection: "column",
          boxShadow: "-8px 0 32px rgba(0,0,0,0.5)",
          paddingTop: "env(safe-area-inset-top, 16px)",
          paddingBottom: "env(safe-area-inset-bottom, 16px)",
          zIndex: 121,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 20px",
            borderBottom: `1px solid ${C.border}`,
          }}
        >
          <span
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: C.white,
              textTransform: "uppercase",
              letterSpacing: 1,
            }}
          >
            {t("nav.menuTitle") || "Навигация"}
          </span>
          <button
            onClick={() => setDrawerOpen(false)}
            style={{
              width: 36,
              height: 36,
              background: "transparent",
              border: "none",
              color: C.textDim,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <IconX size={18} color={C.textDim} />
          </button>
        </div>

        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "12px 14px",
            display: "flex",
            flexDirection: "column",
            gap: 6,
          }}
        >
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={item.action}
              style={{
                minHeight: 46,
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "10px 14px",
                borderRadius: RADIUS.sm,
                background: "transparent",
                border: "none",
                cursor: "pointer",
                color: item.danger ? C.red : C.white,
                fontSize: 14,
                fontFamily: FONT,
                fontWeight: 500,
                textAlign: "left",
                width: "100%",
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = C.dimBg;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
              }}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
