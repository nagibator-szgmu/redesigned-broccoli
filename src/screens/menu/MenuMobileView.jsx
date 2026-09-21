import React, { useState } from "react";
import { FONT } from "../../ui/theme";
import { CASES } from "../../data/cases";
import { IS_DEV_MODE } from "../../config";
import { getVisibleCases } from "../../hooks/useReviewRegistry";
import MenuNotificationsModal from "./MenuNotificationsModal";
import MenuSettingsModal from "./MenuSettingsModal";
import MobileHeader from "./mobile/MobileHeader";
import MobileDrawer from "./mobile/MobileDrawer";
import MobileSearchBar from "./mobile/MobileSearchBar";
import MobileFilterChips from "./mobile/MobileFilterChips";
import MobileHero from "./mobile/MobileHero";
import MobileCaseList from "./mobile/MobileCaseList";
import MobileBottomBar from "./mobile/MobileBottomBar";

export default function MenuMobileView(props) {
  const {
    startGame,
    setPhase,
    totalScore,
    casesPlayed,
    searchQuery,
    setSearchQuery,
    searchFocused,
    setSearchFocused,
    department,
    setDepartment,
    specFilter,
    setSpecFilter,
    showAllCases,
    setShowAllCases,
    showNotif,
    openNotif,
    setShowSettings,
    setProgressionMode,
    checkDeptTutorial,
    unreadCount,
    isDevMode,
    logout,
    catMeta,
    navSpec,
    deptFilters,
    caseScores,
    t,
    C,
  } = props;

  const [drawerOpen, setDrawerOpen] = useState(false);

  const q = searchQuery.toLowerCase();
  const baseCases = IS_DEV_MODE ? CASES : getVisibleCases(CASES);
  const visible = baseCases.filter((c) => {
    if (department !== "all" && c.department !== department) return false;
    if (specFilter && c.category !== specFilter) return false;
    if (!q) return true;
    return (
      c.name.toLowerCase().includes(q) ||
      c.complaint.toLowerCase().includes(q) ||
      (catMeta[c.category]?.label || "").toLowerCase().includes(q)
    );
  });
  const displayCases =
    specFilter || department !== "all" || searchQuery || showAllCases || isDevMode
      ? visible
      : visible.slice(0, 4);

  return (
    <div
      style={{
        height: "100%",
        maxHeight: "100dvh",
        background: C.bgGrad,
        fontFamily: FONT,
        overflowY: "auto",
        overscrollBehavior: "contain",
        position: "relative",
        WebkitTapHighlightColor: "transparent",
      }}
    >
      <MobileHeader
        t={t}
        C={C}
        showNotif={showNotif}
        openNotif={openNotif}
        unreadCount={unreadCount}
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
      />

      <MobileDrawer
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
        setPhase={setPhase}
        setProgressionMode={setProgressionMode}
        setShowSettings={setShowSettings}
        logout={logout}
        t={t}
        C={C}
      />

      <MenuNotificationsModal {...props} isMobile={true} />
      <MenuSettingsModal {...props} isMobile={true} />

      <MobileSearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        searchFocused={searchFocused}
        setSearchFocused={setSearchFocused}
        t={t}
        C={C}
      />

      <MobileFilterChips
        deptFilters={deptFilters}
        department={department}
        setDepartment={setDepartment}
        checkDeptTutorial={checkDeptTutorial}
        navSpec={navSpec}
        specFilter={specFilter}
        setSpecFilter={setSpecFilter}
        t={t}
        C={C}
      />

      <MobileHero startGame={startGame} t={t} C={C} />

      <MobileCaseList
        displayCases={displayCases}
        visible={visible}
        specFilter={specFilter}
        searchQuery={searchQuery}
        showAllCases={showAllCases}
        setShowAllCases={setShowAllCases}
        catMeta={catMeta}
        caseScores={caseScores}
        startGame={startGame}
        t={t}
        C={C}
      />

      <MobileBottomBar
        casesPlayed={casesPlayed}
        totalScore={totalScore}
        startGame={startGame}
        t={t}
        C={C}
      />
    </div>
  );
}
