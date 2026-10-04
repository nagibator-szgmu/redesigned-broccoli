import PillEmblem from "../../../ui/PillEmblem";
import { RADIUS, FONT } from "../../../ui/theme";
import { IconBell } from "../../../ui/icons";

export default function MobileHeader({
  t,
  C,
  showNotif,
  openNotif,
  unreadCount,
  casesPlayed = 0,
  totalScore = 0,
}) {
  const avgScore = casesPlayed ? Math.round(totalScore / casesPlayed) : 0;

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        height: 52,
        background: C.headerBg,
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: `1px solid ${C.border}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 14px",
        paddingTop: "env(safe-area-inset-top, 0px)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <PillEmblem size={30} />
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

      {/* Compact User Statistics */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 5,
          fontSize: 11,
          fontFamily: FONT,
          color: C.textDim,
          background: C.panelBg,
          padding: "3px 8px",
          borderRadius: RADIUS.full,
          border: `1px solid ${C.border}`,
        }}
      >
        <span>
          <strong style={{ color: C.accent, fontWeight: 700 }}>{casesPlayed}</strong> к.
        </span>
        <span style={{ color: C.borderBright }}>·</span>
        <span>
          <strong style={{ color: C.green, fontWeight: 700 }}>{avgScore}</strong> ср.
        </span>
        <span style={{ color: C.borderBright }}>·</span>
        <span>
          <strong style={{ color: C.yellow, fontWeight: 700 }}>{totalScore}</strong> оч.
        </span>
      </div>

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
    </header>
  );
}
