import { FONT } from "../../ui/theme";

/**
 * MenuHeader component for desktop top navigation bar.
 * Contains search bar with focus glow, notification bell badge, settings launcher.
 *
 * @param {Object} props
 * @param {string} props.searchQuery
 * @param {Function} props.setSearchQuery
 * @param {boolean} props.theorySearchFocused
 * @param {Function} props.setTheorySearchFocused
 * @param {Function} props.openNotif
 * @param {boolean} props.showNotif
 * @param {boolean} props.showSettings
 * @param {Function} props.setShowSettings
 * @param {Function} props.setShowNotif
 * @param {number} props.unreadCount
 * @param {Function} props.t
 * @param {Object} props.C
 */
export default function MenuHeader({
  searchQuery,
  setSearchQuery,
  theorySearchFocused,
  setTheorySearchFocused,
  openNotif,
  showNotif,
  showSettings,
  setShowSettings,
  setShowNotif,
  unreadCount,
  t,
  C,
}) {
  return (
    <header
      style={{
        height: 66,
        flexShrink: 0,
        padding: "0 28px",
        display: "flex",
        alignItems: "center",
        gap: 16,
        background: C.headerBg2,
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(0,230,200,0.06)",
        position: "relative",
      }}
    >
      <span style={{ fontSize: 13, color: C.textDim, fontFamily: FONT }}>{t("nav.mainMenu")}</span>
      <div style={{ width: 1, height: 16, background: C.dimBg }} />
      <div
        style={{
          flex: 1,
          maxWidth: 480,
          background: C.btnBg,
          border: `1px solid ${theorySearchFocused ? `${C.accent}55` : "rgba(0,230,200,0.1)"}`,
          boxShadow: theorySearchFocused ? `0 0 16px -2px ${C.accent}15, 0 4px 20px rgba(0,0,0,0.3)` : "none",
          borderRadius: 12,
          padding: "10px 16px",
          display: "flex",
          alignItems: "center",
          gap: 10,
          transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <span style={{ color: C.textDim, fontSize: 14 }}>🔍</span>
        <input
          className="seamless-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setTheorySearchFocused(true)}
          onBlur={() => setTheorySearchFocused(false)}
          placeholder={t("search.placeholder")}
          style={{
            background: "transparent",
            border: "none",
            outline: "none",
            color: C.white,
            fontSize: 13,
            fontFamily: FONT,
            flex: 1,
            caretColor: C.accent,
          }}
        />
        {searchQuery && (
          <span onClick={() => setSearchQuery("")} style={{ color: C.textDim, fontSize: 13, cursor: "pointer" }}>
            ✕
          </span>
        )}
      </div>
      <div style={{ flex: 1 }} />
      <div
        onClick={openNotif}
        className="icon-btn"
        style={{
          position: "relative",
          width: 38,
          height: 38,
          background: showNotif ? `${C.accent}1a` : C.btnBg,
          border: `1px solid ${showNotif ? `${C.accent}55` : "rgba(0,230,200,0.08)"}`,
          borderRadius: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
        }}
      >
        <span style={{ fontSize: 16, display: "inline-flex", alignItems: "center", justifyContent: "center", width: 16, height: 16, lineHeight: 1 }}>
          🔔
        </span>
        {unreadCount > 0 && (
          <div style={{ position: "absolute", top: 6, right: 6, width: 7, height: 7, background: C.red, borderRadius: "50%", border: "1px solid #070d18" }} />
        )}
      </div>
      <div
        onClick={() => {
          setShowSettings((v) => !v);
          setShowNotif(false);
        }}
        className="icon-btn"
        style={{
          width: 38,
          height: 38,
          background: showSettings ? `${C.accent}1a` : C.btnBg,
          border: `1px solid ${showSettings ? `${C.accent}55` : "rgba(0,230,200,0.08)"}`,
          borderRadius: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
        }}
      >
        <span style={{ fontSize: 16, display: "inline-flex", alignItems: "center", justifyContent: "center", width: 16, height: 16, lineHeight: 1 }}>
          ⚙️
        </span>
      </div>
    </header>
  );
}
