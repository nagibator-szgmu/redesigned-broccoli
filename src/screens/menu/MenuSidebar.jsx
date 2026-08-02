import { SER, FONT } from "../../ui/theme";
import ThreeDTicker from "../../components/ThreeDTicker";
import {
  IconGrid, IconTheory, IconTarget, IconMap, IconTrophy,
  IconGraduationCap, IconChartBar, IconBook, IconLogOut,
  IconRefresh, IconLightbulb, IconHospital, IconStethoscope, IconBed
} from "../../ui/icons";

/**
 * MenuSidebar component for desktop left navigation drawer.
 */
export default function MenuSidebar({
  setPhase, progressionMode, setProgressionMode,
  showTutorialMenu, setShowTutorialMenu, tutorialMenuRef,
  restartTutorial, showTutorialTips, forceShowDeptTutorial,
  department, setDepartment, checkDeptTutorial,
  specFilter, setSpecFilter, deptFilters, navSpec, logout, t, C,
}) {
  const mainNavs = [
    { label: t("nav.theory"), icon: <IconTheory size={16} color={C.accent} />, onClick: () => setPhase("theory") },
    { label: t("nav.course"), icon: <IconTarget size={16} color={C.accent} />, onClick: () => { setProgressionMode("strict"); setPhase("theory"); }, active: progressionMode === "strict", id: "tutorial-curriculum" },
    { label: t("nav.map"), icon: <IconMap size={16} color={C.accent} />, onClick: () => setPhase("map") },
    { label: t("nav.leaderboard"), icon: <IconTrophy size={16} color={C.accent} />, onClick: () => setPhase("leaderboard") },
    { label: t("nav.certificates"), icon: <IconGraduationCap size={16} color={C.accent} />, onClick: () => setPhase("certificates") },
    { label: t("nav.teacherDashboard"), icon: <IconChartBar size={16} color={C.accent} />, onClick: () => setPhase("teacher_dashboard") },
  ];

  return (
    <aside style={{ width: 220, flexShrink: 0, zIndex: 10, background: C.sidebarBg, backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)", borderRight: "1px solid rgba(0,230,200,0.08)", display: "flex", flexDirection: "column", padding: "22px 12px", overflowY: "auto" }}>
      {/* Brand logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 11, padding: "6px 10px", marginBottom: 30 }}>
        <div style={{ width: 38, height: 38, borderRadius: 11, flexShrink: 0, background: "linear-gradient(135deg,rgba(0,230,200,0.2),rgba(0,150,200,0.1))", border: "1px solid rgba(0,230,200,0.3)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 20px rgba(0,230,200,0.15)" }}>
          <span style={{ fontFamily: SER, fontSize: 19, color: C.accent, fontStyle: "italic", fontWeight: 700 }}>М</span>
        </div>
        <div>
          <div style={{ fontSize: 17, fontWeight: 700, color: C.white, fontFamily: FONT, letterSpacing: -0.3, lineHeight: 1 }}>{t("brand.name")}</div>
          <div style={{ fontSize: 10, color: C.accent, fontFamily: FONT, letterSpacing: 1, marginTop: 2, opacity: 0.7 }}>{t("brand.subtitle")}</div>
        </div>
      </div>

      {/* Main Nav Links */}
      <div style={{ fontSize: 10, color: C.textDim, letterSpacing: 1.5, padding: "0 10px", marginBottom: 6, fontFamily: FONT, fontWeight: 600 }}>{t("nav.menu")}</div>
      <div className="nav-item" style={{ display: "flex", alignItems: "center", gap: 11, padding: "10px 12px", borderRadius: 11, marginBottom: 2, cursor: "default", background: "rgba(0,230,200,0.12)", border: "1px solid rgba(0,230,200,0.2)" }}>
        <IconGrid size={16} color={C.accent} />
        <span style={{ fontSize: 13, color: C.accent, fontWeight: 600, fontFamily: FONT }}>{t("nav.mainMenu")}</span>
        <div style={{ marginLeft: "auto", width: 6, height: 6, borderRadius: "50%", background: C.accent, boxShadow: `0 0 8px ${C.accent}` }} />
      </div>
      {mainNavs.map(({ label, icon, onClick, active, id }) => (
        <div key={label} id={id} onClick={onClick} className="nav-item" style={{ display: "flex", alignItems: "center", gap: 11, padding: "10px 12px", borderRadius: 11, marginBottom: 2, cursor: "pointer", background: active ? `${C.accent}12` : C.btnBg, border: `1px solid ${active ? `${C.accent}30` : "transparent"}` }}>
          {icon}
          <span style={{ fontSize: 13, color: active ? C.accent : C.text, fontWeight: 500, fontFamily: FONT }}>{label}</span>
        </div>
      ))}

      {/* Interactive Tutorial Menu */}
      <div id="tutorial-training" onClick={() => setShowTutorialMenu((v) => !v)} style={{ position: "relative", display: "flex", alignItems: "center", gap: 11, padding: "10px 12px", borderRadius: 11, marginBottom: 12, cursor: "pointer", background: showTutorialMenu ? `${C.yellow}12` : C.btnBg, border: `1px solid ${showTutorialMenu ? `${C.yellow}30` : "transparent"}` }}>
        <IconBook size={16} color={showTutorialMenu ? C.yellow : C.textDim} />
        <span style={{ fontSize: 13, color: showTutorialMenu ? C.yellow : C.text, fontWeight: 500, fontFamily: FONT }}>{t("nav.tutorial")}</span>
        {showTutorialMenu && (
          <div ref={tutorialMenuRef} onClick={(e) => e.stopPropagation()} style={{ position: "absolute", left: "100%", top: 0, marginLeft: 4, zIndex: 99999, background: C.overlayBg, backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)", border: `1px solid ${C.border}`, borderRadius: 12, padding: "6px", boxShadow: "0 8px 32px rgba(0,0,0,0.6)", minWidth: 200 }}>
            <div style={{ fontSize: 10, color: C.textDim, letterSpacing: 1, padding: "6px 12px 4px", fontFamily: FONT, fontWeight: 600 }}>{t("tutorial.mainCourse")}</div>
            <div onClick={() => { setShowTutorialMenu(false); restartTutorial?.(); }} style={{ padding: "8px 14px", borderRadius: 8, cursor: "pointer", fontSize: 12, color: C.text, fontFamily: FONT, display: "flex", alignItems: "center", gap: 8 }}><IconRefresh size={14} color={C.accent} /> {t("tutorial.restart")}</div>
            <div onClick={() => { setShowTutorialMenu(false); showTutorialTips?.(); }} style={{ padding: "8px 14px", borderRadius: 8, cursor: "pointer", fontSize: 12, color: C.text, fontFamily: FONT, display: "flex", alignItems: "center", gap: 8 }}><IconLightbulb size={14} color={C.yellow} /> {t("tutorial.showTips")}</div>
            <div style={{ height: 1, background: C.border, margin: "6px 8px" }} />
            <div style={{ fontSize: 10, color: C.textDim, letterSpacing: 1, padding: "6px 12px 4px", fontFamily: FONT, fontWeight: 600 }}>{t("tutorial.miniTutorials")}</div>
            {[{ key: "outpatient", icon: <IconHospital size={14} color={C.accent} />, label: t("tutorial.outpatient") }, { key: "admission", icon: <IconStethoscope size={14} color={C.accent} />, label: t("tutorial.admission") }, { key: "stationary", icon: <IconBed size={14} color={C.accent} />, label: t("tutorial.stationary") }].map(({ key, icon, label }) => (
              <div key={key} onClick={() => { setShowTutorialMenu(false); forceShowDeptTutorial?.(key); }} style={{ padding: "8px 14px", borderRadius: 8, cursor: "pointer", fontSize: 12, color: C.text, fontFamily: FONT, display: "flex", alignItems: "center", gap: 8 }}>{icon} {label}</div>
            ))}
          </div>
        )}
      </div>

      {/* Department Section */}
      <div style={{ fontSize: 10, color: C.textDim, letterSpacing: 1.5, padding: "0 10px", margin: "18px 0 6px", fontFamily: FONT, fontWeight: 600 }}>{t("nav.departmentHeader")}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 4 }}>
        {deptFilters.map(({ key, label, icon }) => {
          const isActive = department === key;
          return (
            <div key={key} onClick={() => { setDepartment(key); if (key !== "all") checkDeptTutorial?.(key); }} className="nav-item" style={{ display: "flex", alignItems: "center", gap: 11, padding: "9px 12px 9px 18px", borderRadius: 10, cursor: "pointer", background: isActive ? "rgba(0,230,200,0.1)" : "transparent", border: `1px solid ${isActive ? "rgba(0,230,200,0.2)" : "transparent"}` }}>
              <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 18, opacity: isActive ? 1 : 0.6 }}>{icon}</span>
              <span style={{ fontSize: 12, fontFamily: FONT, color: isActive ? C.accent : C.text, fontWeight: isActive ? 600 : 400, opacity: isActive ? 1 : 0.7 }}>{label}</span>
              {isActive && <div style={{ marginLeft: "auto", width: 5, height: 5, borderRadius: "50%", background: C.accent, boxShadow: `0 0 6px ${C.accent}` }} />}
            </div>
          );
        })}
      </div>

      {/* Specialization Section */}
      <div style={{ fontSize: 10, color: C.textDim, letterSpacing: 1.5, padding: "0 10px", margin: "18px 0 6px", fontFamily: FONT, fontWeight: 600 }}>{t("nav.specializations")}</div>
      {specFilter && (
        <div onClick={() => setSpecFilter(null)} className="nav-item" style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 12px 7px 14px", borderRadius: 10, marginBottom: 4, cursor: "pointer", background: "rgba(0,230,200,0.06)", border: "1px solid rgba(0,230,200,0.12)" }}>
          <span style={{ fontSize: 11, color: C.accent, fontFamily: FONT }}>{t("nav.clearFilter")}</span>
        </div>
      )}
      {navSpec.map(({ icon, label, cat }) => {
        const isActive = specFilter === cat;
        return (
          <div key={cat} onClick={() => setSpecFilter(isActive ? null : cat)} className="nav-item" style={{ display: "flex", alignItems: "center", gap: 11, padding: "9px 12px 9px 18px", borderRadius: 10, marginBottom: 2, cursor: "pointer", background: isActive ? "rgba(0,230,200,0.1)" : "transparent", border: `1px solid ${isActive ? "rgba(0,230,200,0.2)" : "transparent"}` }}>
            <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 18, opacity: isActive ? 1 : 0.6 }}>{icon}</span>
            <span style={{ fontSize: 12, fontFamily: FONT, color: isActive ? C.accent : C.text, fontWeight: isActive ? 600 : 400, opacity: isActive ? 1 : 0.7 }}>{label}</span>
            {isActive && <div style={{ marginLeft: "auto", width: 5, height: 5, borderRadius: "50%", background: C.accent, boxShadow: `0 0 6px ${C.accent}` }} />}
          </div>
        );
      })}

      <div style={{ flex: 1 }} />
      <div onClick={logout} className="nav-item" style={{ display: "flex", alignItems: "center", gap: 11, padding: "10px 12px", borderRadius: 11, marginBottom: 2, cursor: "pointer", background: C.btnBg, border: "1px solid transparent" }}>
        <IconLogOut size={16} color={C.red} />
        <span style={{ fontSize: 12, color: C.red, fontWeight: 500, fontFamily: FONT, opacity: 0.8 }}>{t("nav.logout")}</span>
      </div>
      <div style={{ marginTop: 16, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, opacity: 0.95, padding: "12px 0 0", borderTop: `1px solid ${C.border}` }}>
        <span style={{ fontSize: 9, color: C.textDim, fontFamily: FONT, letterSpacing: 1.5, textTransform: "uppercase", fontWeight: 700 }}>designed by</span>
        <ThreeDTicker width={176} height={110} />
      </div>
    </aside>
  );
}
