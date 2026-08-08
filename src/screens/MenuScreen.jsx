import { useState, useRef, useEffect, useMemo } from "react";
import { FONT } from "../ui/theme";
import { useTheme } from "../ui/ThemeContext";
import { useLocale } from "../locale/LocaleContext";
import { useTranslate } from "../locale/useTranslate";
import { useAuth } from "../context/AuthContext";
import { CASES } from "../data/cases";
import { IS_DEV_MODE } from "../config";
import { getVisibleCases } from "../hooks/useReviewRegistry";
import useIsMobile from "../hooks/useIsMobile";
import { makeCatMeta, makeNavSpec, DEPT_FILTERS, buildNotifications } from "./menu/menuUtils";
import MenuHeader from "./menu/MenuHeader";
import CaseExplorerBar from "./menu/CaseExplorerBar";
import CaseGrid from "./menu/CaseGrid";
import MenuHero from "./menu/MenuHero";
import MenuSidebar from "./menu/MenuSidebar";
import MenuRightSidebar from "./menu/MenuRightSidebar";
import MenuNotificationsModal from "./menu/MenuNotificationsModal";
import MenuSettingsModal from "./menu/MenuSettingsModal";
import AccountModal from "./menu/AccountModal";
import MenuMobileView from "./menu/MenuMobileView";

/**
 * MenuScreen component — Main Navigation Hub orchestrator.
 */
export default function MenuScreen(props) {
  const {
    casesPlayed = 0, totalScore = 0, sessionHistory = [],
    searchQuery = "", department = "all", specFilter = null,
    setShowNotif, setShowSettings,
  } = props;

  const C = useTheme();
  const { locale, setLocale: setLocaleGlobal, LOCALES } = useLocale();
  const { t } = useTranslate();
  const { logout } = useAuth();
  const isMobile = useIsMobile(768);
  const isTablet = useIsMobile(1180);

  const [heroMouse, setHeroMouse] = useState({ x: 0, y: 0, over: false });
  const [searchFocused, setSearchFocused] = useState(false);
  const [theorySearchFocused, setTheorySearchFocused] = useState(false);
  const [showTutorialMenu, setShowTutorialMenu] = useState(false);
  const [showAccount, setShowAccount] = useState(false);
  const tutorialMenuRef = useRef(null);
  const [readNotifIds, setReadNotifIds] = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem("ms_readNotifs") || "[]")); } catch { return new Set(); }
  });
  const [llmProvider, setLlmProvider] = useState(() => localStorage.getItem("ms_llmProvider") || "openrouter");
  const [llmKey, setLlmKey] = useState(() => localStorage.getItem("ms_llmKey") || "");
  const [showDevSettings, setShowDevSettings] = useState(false);

  const catMeta = useMemo(() => makeCatMeta(t), [t]);
  const navSpec = useMemo(() => makeNavSpec(t), [t]);
  const deptFilters = useMemo(() => DEPT_FILTERS(t), [t]);

  useEffect(() => {
    if (!showTutorialMenu) return;
    const handler = (e) => {
      if (tutorialMenuRef.current && !tutorialMenuRef.current.contains(e.target)) setShowTutorialMenu(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showTutorialMenu]);

  const notifications = buildNotifications(sessionHistory, casesPlayed, totalScore, t, catMeta);
  const unreadCount = notifications.filter((n) => !readNotifIds.has(n.id)).length;

  const caseScores = {};
  sessionHistory.forEach((s) => {
    if (!caseScores[s.caseId] || s.score > caseScores[s.caseId]) caseScores[s.caseId] = s.score;
  });

  const openNotif = () => {
    if (setShowNotif) setShowNotif((v) => !v);
    if (setShowSettings) setShowSettings(false);
    setReadNotifIds((prev) => {
      const next = new Set([...prev, ...notifications.map((n) => n.id)]);
      localStorage.setItem("ms_readNotifs", JSON.stringify([...next]));
      return next;
    });
  };

  const onHeroMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    setHeroMouse({ x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height, over: true });
  };
  const onHeroLeave = () => setHeroMouse((m) => ({ ...m, over: false }));

  const q = searchQuery.toLowerCase();
  const baseCases = IS_DEV_MODE ? CASES : getVisibleCases(CASES);
  const visible = baseCases.filter((c) => {
    if (department !== "all" && c.department !== department) return false;
    if (specFilter && c.category !== specFilter) return false;
    if (!q) return true;
    return c.name.toLowerCase().includes(q) || c.complaint.toLowerCase().includes(q) || (catMeta[c.category]?.label || "").toLowerCase().includes(q);
  });

  const sharedProps = {
    ...props, C, logout, locale, setLocaleGlobal, LOCALES, t, catMeta, navSpec, deptFilters,
    readNotifIds, setReadNotifIds, llmProvider, setLlmProvider, llmKey, setLlmKey,
    showDevSettings, setShowDevSettings, heroMouse, setHeroMouse, searchFocused, setSearchFocused,
    theorySearchFocused, setTheorySearchFocused, showTutorialMenu, setShowTutorialMenu,
    showAccount, setShowAccount,
    tutorialMenuRef, notifications, unreadCount, caseScores, openNotif, onHeroMove, onHeroLeave,
  };

  if (isMobile) return (
    <>
      <MenuMobileView {...sharedProps} />
      <AccountModal showAccount={showAccount} setShowAccount={setShowAccount} C={C} isMobile={true} />
    </>
  );

  return (
    <div style={{ height: "100vh", background: C.bgGrad, display: "flex", fontFamily: FONT, overflow: "hidden", position: "relative" }}>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}} @keyframes glowPulse{0%,100%{opacity:0.5}50%{opacity:1}}`}</style>
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <div style={{ position: "absolute", left: "-10%", top: "-5%", width: 600, height: 600, background: `radial-gradient(circle, ${C.accent}10 0%, transparent 65%)`, borderRadius: "50%" }} />
        <div style={{ position: "absolute", right: "-5%", bottom: "-10%", width: 500, height: 500, background: `radial-gradient(circle, ${C.yellow}08 0%, transparent 65%)`, borderRadius: "50%" }} />
      </div>

      <MenuSidebar {...sharedProps} />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, zIndex: 1 }}>
        <MenuHeader {...sharedProps} />
        <MenuNotificationsModal {...sharedProps} isMobile={false} />
        <MenuSettingsModal {...sharedProps} isMobile={false} />
        <AccountModal showAccount={showAccount} setShowAccount={setShowAccount} C={C} isMobile={false} />

        <div
          style={{
            flex: 1,
            display: "flex",
            overflow: "hidden",
            transition: "background 0.5s ease-in-out",
            background: {
              all: `radial-gradient(circle at 30% 20%, ${C.accent}0c 0%, transparent 60%), radial-gradient(circle at 85% 60%, ${C.accent}08 0%, transparent 60%)`,
              icu: `radial-gradient(circle at 20% 30%, ${C.red}10 0%, transparent 55%), radial-gradient(circle at 80% 70%, ${C.accent}08 0%, transparent 65%)`,
              admission: `radial-gradient(circle at 30% 25%, ${C.purple}10 0%, transparent 60%), radial-gradient(circle at 75% 75%, ${C.accent}08 0%, transparent 60%)`,
              outpatient: `radial-gradient(circle at 25% 20%, ${C.accent}12 0%, transparent 60%), radial-gradient(circle at 80% 80%, ${C.accent}08 0%, transparent 60%)`,
              stationary: `radial-gradient(circle at 30% 20%, ${C.accent}10 0%, transparent 60%), radial-gradient(circle at 70% 70%, ${C.accent}08 0%, transparent 60%)`,
            }[department] || "transparent",
          }}
        >
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "26px 24px 40px",
              background: "transparent",
            }}
          >
            <CaseExplorerBar {...sharedProps} />
            <MenuHero {...sharedProps} />
            <CaseGrid {...sharedProps} cases={visible} />
          </div>
          {!isTablet && <MenuRightSidebar {...sharedProps} />}
        </div>
      </div>
    </div>
  );
}
