import { createPortal } from "react-dom";
import { FONT } from "../../ui/theme";

/**
 * MenuNotificationsModal component for displaying notification overlay.
 * Renders via React portal anchoring under top header.
 *
 * @param {Object} props
 * @param {boolean} props.showNotif
 * @param {Function} props.setShowNotif
 * @param {Array} props.notifications
 * @param {Set<string>} props.readNotifIds
 * @param {boolean} props.isMobile
 * @param {Function} props.t
 * @param {Object} props.C
 */
export default function MenuNotificationsModal({
  showNotif,
  setShowNotif,
  notifications,
  readNotifIds,
  isMobile,
  t,
  C,
}) {
  if (!showNotif) return null;

  const positionStyle = isMobile
    ? { top: 60, right: 12, left: 12 }
    : { top: 72, right: 54, width: 300 };

  return createPortal(
    <>
      <div style={{ position: "fixed", inset: 0, zIndex: 99998 }} onClick={() => setShowNotif(false)} />
      <div
        style={{
          position: "fixed",
          ...positionStyle,
          zIndex: 99999,
          background: C.overlayBg,
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: "1px solid rgba(0,230,200,0.2)",
          borderRadius: 16,
          padding: "16px",
          boxShadow: "0 16px 48px rgba(0,0,0,0.8),0 0 0 1px rgba(0,230,200,0.05)",
          fontFamily: FONT,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: C.white }}>{t("notifications.title")}</span>
          <span onClick={() => setShowNotif(false)} style={{ fontSize: 12, color: C.textDim, cursor: "pointer", padding: "2px 8px", borderRadius: 6, background: C.dimBg }}>
            ✕
          </span>
        </div>
        {notifications.map((n, i) => {
          const isNew = !readNotifIds.has(n.id);
          return (
            <div
              key={n.id}
              className="filter-pill"
              onClick={() => {
                setShowNotif(false);
                if (n.onSelect) n.onSelect();
              }}
              style={{
                display: "flex",
                gap: 10,
                padding: "10px 12px",
                borderRadius: 10,
                background: C.btnBg,
                border: `1px solid ${isNew ? "rgba(0,230,200,0.2)" : "rgba(0,230,200,0.08)"}`,
                marginBottom: i < notifications.length - 1 ? 6 : 0,
                position: "relative",
                cursor: "pointer",
                alignItems: "center",
              }}
            >
              {isNew && <div style={{ position: "absolute", top: 8, right: 8, width: 6, height: 6, borderRadius: "50%", background: C.accent }} />}
              <span style={{ fontSize: 18, flexShrink: 0, display: "inline-flex", alignItems: "center" }}>{n.icon}</span>
              <div>
                <div style={{ fontSize: 12, color: C.white, fontWeight: 500 }}>{n.text}</div>
                <div style={{ fontSize: 11, color: C.textDim, marginTop: 2 }}>{n.sub}</div>
              </div>
            </div>
          );
        })}
      </div>
    </>,
    document.body
  );
}
