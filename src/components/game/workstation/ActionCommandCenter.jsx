import { useState } from "react";
import { useTheme } from "../../../ui/ThemeContext";
import { FONT } from "../../../ui/theme";
import { useTranslate } from "../../../locale/useTranslate";
import { IconMicroscope, IconPill, IconClipboard, IconLightbulb } from "../../../ui/icons";
import DiagTab from "./DiagTab";
import TreatTab from "./TreatTab";
import DiagnosisRoutingTab from "./DiagnosisRoutingTab";
import ConsultationTab from "./ConsultationTab";

/** Tabbed Action Command Center container component */
export default function ActionCommandCenter({
  phase,
  selDiag,
  setSelDiag,
  orderedDiag = [],
  diagCat,
  setDiagCat,
  handleOrderTests,
  processingTests,
  cd,
  selTreat = [],
  toggleTreatment,
  appliedFx,
  pendingFx,
  treatCat,
  setTreatCat,
  diagText,
  setDiagText,
  handleSubmit,
  selectedRoute,
  setSelectedRoute,
  setExtraResult,
  learningTip,
  relatedTopics = [],
  setShowTheory
}) {
  const C = useTheme();
  const { t } = useTranslate();

  const initialTab = phase === "diagnose" ? "diagnose" : "diag";
  const [tab, setTab] = useState(initialTab);

  const tabs = [
    { key: "diag", label: t("phases.order_tests"), icon: <IconMicroscope size={14} color="currentColor" />, badge: selDiag.length },
    { key: "treat", label: t("treatment.title") || "Экстренное лечение", icon: <IconPill size={14} color="currentColor" />, badge: selTreat.length },
    { key: "diagnose", label: t("phases.diagnose") || "Диагноз+Лечение", icon: <IconClipboard size={14} color="currentColor" />, badge: diagText ? 1 : 0 }
  ];

  return (
    <div style={{
      height: "100%",
      display: "flex",
      flexDirection: "column",
      background: C.panelBg,
      backdropFilter: "blur(16px)",
      WebkitBackdropFilter: "blur(16px)",
      border: `1px solid ${C.border}`,
      borderRadius: 14,
      overflow: "hidden"
    }}>
      {/* Header Tabs Navigation (Scrollable on narrow tablet) */}
      <div className="no-scrollbar" style={{
        flexShrink: 0,
        display: "flex",
        background: C.headerBg2,
        borderBottom: `1px solid ${C.border}`,
        padding: "4px 8px 0 8px",
        gap: 4,
        overflowX: "auto",
        WebkitOverflowScrolling: "touch"
      }}>
        {tabs.map(tItem => {
          const isActive = tab === tItem.key;
          return (
            <button
              key={tItem.key}
              onClick={() => setTab(tItem.key)}
              style={{
                flex: "1 0 auto",
                minWidth: 100,
                minHeight: 38,
                padding: "8px 14px",
                border: "none",
                background: isActive ? C.panelBg : "transparent",
                borderTopLeftRadius: 8,
                borderTopRightRadius: 8,
                borderBottom: isActive ? `2px solid ${C.accent}` : "2px solid transparent",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                color: isActive ? C.accent : C.textDim,
                fontSize: 12.5,
                fontFamily: FONT,
                fontWeight: isActive ? 700 : 500,
                transition: "all 0.15s"
              }}
            >
              <span>{tItem.icon}</span>
              <span style={{ whiteSpace: "nowrap" }}>{tItem.label}</span>
              {tItem.badge > 0 && (
                <span style={{
                  background: C.accent,
                  color: C.bg,
                  fontSize: 10,
                  fontWeight: 700,
                  borderRadius: 9999,
                  padding: "1px 6px"
                }}>
                  {tItem.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Action Content Panel */}
      <div style={{ flex: 1, overflow: "hidden", position: "relative" }}>
        {tab === "diag" && (
          <DiagTab
            selDiag={selDiag}
            setSelDiag={setSelDiag}
            orderedDiag={orderedDiag}
            diagCat={diagCat}
            setDiagCat={setDiagCat}
            handleOrderTests={handleOrderTests}
            processingTests={processingTests}
            t={t}
          />
        )}
        {tab === "treat" && (
          <TreatTab
            cd={cd}
            selTreat={selTreat}
            toggleTreatment={toggleTreatment}
            appliedFx={appliedFx}
            pendingFx={pendingFx}
            treatCat={treatCat}
            setTreatCat={setTreatCat}
          />
        )}
        {tab === "diagnose" && (
          <DiagnosisRoutingTab
            diagText={diagText}
            setDiagText={setDiagText}
            selTreat={selTreat}
            pendingFx={pendingFx}
            handleSubmit={handleSubmit}
            cd={cd}
            selectedRoute={selectedRoute}
            setSelectedRoute={setSelectedRoute}
            setExtraResult={setExtraResult}
            orderedDiag={orderedDiag}
            t={t}
          />
        )}
      </div>
    </div>
  );
}
