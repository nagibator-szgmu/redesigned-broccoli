import { createPortal } from "react-dom";
import { FONT } from "../../ui/theme";

/** MenuNotificationsModal component for displaying notification overlay with pin and delete. */
export default function MenuNotificationsModal({
  showNotif, setShowNotif, notifications = [],
  readNotifIds, pinnedNotifIds, togglePinNotif, deleteNotif,
  isMobile, t, C,
}) {
  if (!showNotif) return null;

  const positionStyle = isMobile
    ? { top: 60, right: 12, left: 12, maxHeight: "80vh" }
    : { top: 72, right: 54, width: 330, maxHeight: 480 };

  const btnBaseStyle = {
    background: C.dimBg, border: "1px solid transparent", borderRadius: 6,
    padding: "4px 6px", cursor: "pointer", display: "inline-flex",
    alignItems: "center", justifyContent: "center", fontSize: 11,
    lineHeight: 1, color: C.textDim, transition: "all 0.15s ease",
  };

  return createPortal(
    <>
      <div style={{ position: "fixed", inset: 0, zIndex: 99998 }} onClick={() => setShowNotif(false)} />
      <div
        style={{
          position: "fixed", ...positionStyle, zIndex: 99999,
          background: C.overlayBg, backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
          border: `1px solid ${C.border}`, borderRadius: 16, padding: "16px",
          boxShadow: "0 16px 48px rgba(0,0,0,0.8),0 0 0 1px rgba(37,99,235,0.08)",
          fontFamily: FONT, display: "flex", flexDirection: "column",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: C.white }}>{t("notifications.title")}</span>
            {notifications.length > 0 && (
              <span style={{ fontSize: 11, color: C.textDim, background: C.dimBg, padding: "1px 6px", borderRadius: 8 }}>
                {notifications.length}
              </span>
            )}
          </div>
          <button
            type="button" onClick={() => setShowNotif(false)} aria-label="Закрыть"
            style={{ fontSize: 12, color: C.textDim, cursor: "pointer", padding: "2px 8px", borderRadius: 6, background: C.dimBg, border: "none" }}
          >
            ✕
          </button>
        </div>

        {notifications.length === 0 ? (
          <div style={{ textAlign: "center", padding: "28px 12px", color: C.textDim, fontSize: 13 }}>
            <div style={{ fontSize: 28, marginBottom: 8, opacity: 0.6 }}>🔕</div>
            <div>{t("notifications.empty")}</div>
          </div>
        ) : (
          <div style={{ overflowY: "auto", display: "flex", flexDirection: "column", gap: 6, margin: "0 -4px", padding: "0 4px" }}>
            {notifications.map((n) => {
              const isNew = !readNotifIds?.has(n.id);
              const isPinned = pinnedNotifIds?.has(n.id);
              return (
                <div
                  key={n.id} className="filter-pill"
                  onClick={() => { setShowNotif(false); if (n.onSelect) n.onSelect(); }}
                  style={{
                    display: "flex", gap: 10, padding: "9px 11px", borderRadius: 10,
                    background: isPinned ? `${C.yellow}0c` : C.btnBg,
                    border: `1px solid ${isPinned ? `${C.yellow}44` : isNew ? "rgba(37,99,235,0.25)" : C.btnBorder}`,
                    position: "relative", cursor: "pointer", alignItems: "center", transition: "all 0.15s ease",
                  }}
                >
                  <span style={{ fontSize: 18, flexShrink: 0, display: "inline-flex", alignItems: "center" }}>
                    {n.icon}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ fontSize: 12, color: C.white, fontWeight: isPinned ? 600 : 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {n.text}
                      </span>
                      {isNew && <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.accent, flexShrink: 0 }} />}
                    </div>
                    <div style={{ fontSize: 11, color: C.textDim, marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {n.sub}
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0, marginLeft: 4 }}>
                    <button
                      type="button" title={isPinned ? t("notifications.unpin") : t("notifications.pin")}
                      onClick={(e) => { e.stopPropagation(); if (togglePinNotif) togglePinNotif(n.id); }}
                      style={{
                        ...btnBaseStyle,
                        background: isPinned ? `${C.yellow}24` : C.dimBg,
                        border: `1px solid ${isPinned ? `${C.yellow}60` : "transparent"}`,
                        color: isPinned ? C.yellow : C.textDim,
                      }}
                    >
                      📌
                    </button>
                    <button
                      type="button" title={t("notifications.delete")}
                      onClick={(e) => { e.stopPropagation(); if (deleteNotif) deleteNotif(n.id); }}
                      style={btnBaseStyle}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>,
    document.body
  );
}
