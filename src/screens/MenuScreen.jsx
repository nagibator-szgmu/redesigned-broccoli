import { useState, useRef, useEffect } from "react";
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
  const { logout } = useAuth();
  const { locale, setLocale: setLocaleGlobal, LOCALES } = useLocale();
  const { t } = useTranslate();
  const catMeta = makeCatMeta(t);
  const navSpec = makeNavSpec(t);
  const deptFilters = DEPT_FILTERS(t);

  const [readNotifIds, setReadNotifIds] = useState(() => new Set(JSON.parse(localStorage.getItem("ms_readNotifs") || "[]")));
  const [llmProvider, setLlmProvider] = useState(() => localStorage.getItem("ms_llm_provider") || "gemini");
  const [llmKey, setLlmKey] = useState(() => localStorage.getItem("ms_llm_key") || "");
  const [showDevSettings, setShowDevSettings] = useState(false);
  const [heroMouse, setHeroMouse] = useState({ x: 0.5, y: 0.5, over: false });
  const [searchFocused, setSearchFocused] = useState(false);
  const [theorySearchFocused, setTheorySearchFocused] = useState(false);
  const [showTutorialMenu, setShowTutorialMenu] = useState(false);
  const tutorialMenuRef = useRef(null);

  useEffect(() => {
    if (!showTutorialMenu) return;
    const handler = (e) => {
      if (tutorialMenuRef.current && !tutorialMenuRef.current.contains(e.target)) setShowTutorialMenu(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showTutorialMenu]);

  const isMobile = useIsMobile();
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
    tutorialMenuRef, notifications, unreadCount, caseScores, openNotif, onHeroMove, onHeroLeave,
  };

  if (isMobile) return <MenuMobileView {...sharedProps} />;

  return (
    <div style={{ height: "100vh", background: C.bgGrad, display: "flex", fontFamily: FONT, overflow: "hidden", position: "relative" }}>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}} @keyframes glowPulse{0%,100%{opacity:0.5}50%{opacity:1}}`}</style>
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <div style={{ position: "absolute", left: "-10%", top: "-5%", width: 600, height: 600, background: "radial-gradient(circle,rgba(0,230,200,0.07) 0%,transparent 65%)", borderRadius: "50%" }} />
        <div style={{ position: "absolute", right: "-5%", bottom: "-10%", width: 500, height: 500, background: "radial-gradient(circle,rgba(0,100,200,0.08) 0%,transparent 65%)", borderRadius: "50%" }} />
      </div>

      <MenuSidebar {...sharedProps} />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, zIndex: 1 }}>
        <MenuHeader {...sharedProps} />
        <MenuNotificationsModal {...sharedProps} isMobile={false} />
        <MenuSettingsModal {...sharedProps} isMobile={false} />

        <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
          <div style={{ flex: 1, overflowY: "auto", padding: "26px 24px 40px" }}>
            <CaseExplorerBar {...sharedProps} />
            <MenuHero {...sharedProps} />
            <CaseGrid {...sharedProps} cases={visible} />
          </div>
          <MenuRightSidebar {...sharedProps} />
        </div>
      </div>
    </div>
  );
}
