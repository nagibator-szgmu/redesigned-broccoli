import PillEmblem from "../../../ui/PillEmblem";
import { RADIUS, FONT } from "../../../ui/theme";
import { IconBell, IconMenu, IconX } from "../../../ui/icons";

export default function MobileHeader({
  t,
  C,
  showNotif,
  openNotif,
  unreadCount,
  drawerOpen,
  setDrawerOpen,
}) {
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        height: 56,
        background: C.headerBg,
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: `1px solid ${C.border}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 16px",
        paddingTop: "env(safe-area-inset-top, 0px)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <PillEmblem size={34} />
        <span
          style={{
            fontSize: 16,
            fontWeight: 700,
            color: C.white,
            fontFamily: FONT,
            letterSpacing: -0.3,
          }}
        >
          {t("brand.name")}
        </span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <button
          onClick={openNotif}
          aria-label="Уведомления"
          className="icon-btn"
          style={{
            position: "relative",
            minWidth: 44,
            minHeight: 44,
            width: 44,
            height: 44,
            background: showNotif ? `${C.accent}1a` : C.btnBg,
            border: `1px solid ${showNotif ? `${C.accent}55` : C.border}`,
            borderRadius: RADIUS.sm,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            padding: 0,
          }}
        >
          <IconBell size={18} color={showNotif ? C.accent : C.textDim} />
          {unreadCount > 0 && (
            <div
              style={{
                position: "absolute",
                top: 10,
                right: 10,
                width: 7,
                height: 7,
                background: C.red,
                borderRadius: RADIUS.full,
                border: `1px solid ${C.bg}`,
              }}
            />
          )}
        </button>

        <button
          onClick={() => setDrawerOpen((v) => !v)}
          aria-label="Меню"
          className="icon-btn"
          style={{
            minWidth: 44,
            minHeight: 44,
            width: 44,
            height: 44,
            background: drawerOpen ? `${C.accent}1a` : C.btnBg,
            border: `1px solid ${drawerOpen ? `${C.accent}55` : C.border}`,
            borderRadius: RADIUS.sm,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            padding: 0,
          }}
        >
          {drawerOpen ? <IconX size={20} color={C.accent} /> : <IconMenu size={20} color={C.white} />}
        </button>
      </div>
    </header>
  );
}
