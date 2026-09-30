import React from "react";
import { FONT } from "../../../ui/theme";
import { IconHospital, IconBook, IconMap, IconTrophy, IconMenu } from "../../../ui/icons";

export default function MobileBottomBar({ setPhase, setDrawerOpen, t, C }) {
  const navItems = [
    {
      id: "cases",
      label: "Кейсы",
      Icon: IconHospital,
      action: () => window.scrollTo({ top: 0, behavior: "smooth" }),
      active: true,
    },
    {
      id: "theory",
      label: t("nav.theory") || "Теория",
      Icon: IconBook,
      action: () => setPhase("theory"),
    },
    {
      id: "course",
      label: t("nav.course") || "Курс",
      Icon: IconMap,
      action: () => setPhase("course"),
    },
    {
      id: "leaderboard",
      label: t("nav.leaderboard") || "Награды",
      Icon: IconTrophy,
      action: () => setPhase("leaderboard"),
    },
    {
      id: "menu",
      label: t("nav.menu") || "Меню",
      Icon: IconMenu,
      action: () => setDrawerOpen(true),
    },
  ];

  return (
    <nav
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 90,
        minHeight: 52,
        background: C.headerBg,
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderTop: `1px solid ${C.border}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
        paddingBottom: "max(6px, env(safe-area-inset-bottom, 6px))",
        boxSizing: "border-box",
      }}
    >
      {navItems.map(({ id, label, Icon, action, active }) => (
        <button
          key={id}
          onClick={action}
          style={{
            flex: 1,
            minHeight: 48,
            border: "none",
            background: "transparent",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
            touchAction: "manipulation",
            padding: "4px 2px",
          }}
        >
          <span style={{ color: active ? C.accent : C.textDim, display: "inline-flex" }}>
            <Icon size={18} color="currentColor" />
          </span>
          <span
            style={{
              fontSize: 10.5,
              fontFamily: FONT,
              fontWeight: active ? 600 : 500,
              color: active ? C.accent : C.textDim,
              lineHeight: 1.2,
            }}
          >
            {label}
          </span>
        </button>
      ))}
    </nav>
  );
}
