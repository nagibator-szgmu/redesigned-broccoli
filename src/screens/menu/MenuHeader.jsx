import { FONT } from "../../ui/theme";
import { Tooltip } from "../../ui/components";
import { IconBell, IconGear } from "../../ui/icons";

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
        height: 64,
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
      <Tooltip title="ПОИСК СЦЕНАРИЕВ" text="Поиск по названию болезни, синдрому или симптомам больного." position="top" style={{ flex: 1, maxWidth: 480 }}>
        <div
          style={{
            width: "100%",
            background: C.btnBg,
            border: `1px solid ${theorySearchFocused ? `${C.accent}55` : "rgba(0,230,200,0.1)"}`,
            boxShadow: theorySearchFocused ? `0 0 16px -2px ${C.accent}15, 0 4px 20px rgba(0,0,0,0.3)` : "none",
            borderRadius: 12,
            padding: "10px 16px",
            display: "flex",
            alignItems: "center",
            gap: 10,
            transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
            boxSizing: "border-box"
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
      </Tooltip>
      <div style={{ flex: 1 }} />
      <Tooltip title="УВЕДОМЛЕНИЯ И АКТИВНОСТЬ" refRange={`Новых: ${unreadCount}`} text="Центр системных сообщений, обновлений базы ЛС и достижений." position="top">
        <div
          onClick={openNotif}
          className="icon-btn ring-on-hover"
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
          <IconBell size={18} color={showNotif ? C.accent : C.textDim} />
          {unreadCount > 0 && (
            <div style={{ position: "absolute", top: 6, right: 6, width: 7, height: 7, background: C.red, borderRadius: "50%", border: "1px solid #070d18" }} />
          )}
        </div>
      </Tooltip>
      <Tooltip title="НАСТРОЙКИ СИМУЛЯЦИИ И ИИ" text="Управление звуками, уровнем сложности, языком и API-ключами LLM." position="top">
        <div
          onClick={() => {
            setShowSettings((v) => !v);
            setShowNotif(false);
          }}
          className="icon-btn spin-on-hover"
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
          <IconGear size={18} color={showSettings ? C.accent : C.textDim} />
        </div>
      </Tooltip>
    </header>
  );
}
