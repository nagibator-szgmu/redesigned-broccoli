import React, { useState, useMemo } from "react";
import { useTheme } from "../../ui/ThemeContext";
import { useTranslate } from "../../locale/useTranslate";
import { TREATMENTS } from "../../data/treatments";
import {
  IconActivity,
  IconCardiac,
  IconRespiratory,
  IconDroplet,
  IconInfectious,
  IconSyringe,
  IconPill,
} from "../../ui/icons";
import { matchTreatGroup, TreatSearchBar, TreatAccordionGroup } from "./treat";

const CLINICAL_GROUPS = [
  { id: "emergency", label: "Экстренные и реанимация", Icon: IconActivity, cat: "emergency" },
  { id: "cardiovascular", label: "Кардиоваскулярные", Icon: IconCardiac, cat: "cardiovascular" },
  { id: "respiratory", label: "Дыхание и оксигенация", Icon: IconRespiratory, cat: "respiratory" },
  { id: "fluid", label: "Инфузии и диуретики", Icon: IconDroplet, cat: "fluid" },
  { id: "antimicrobial", label: "Антимикробные", Icon: IconInfectious, cat: "antimicrobial" },
  { id: "analgesia", label: "Анальгезия и седация", Icon: IconSyringe, cat: "analgesia" },
  { id: "other", label: "Прочие препараты", Icon: IconPill, cat: "other" },
];

export default function TreatPanel({
  cd,
  selTreat = [],
  toggleTreatment,
  appliedFx,
  pendingFx,
  searchQuery: extQuery,
  setSearchQuery: extSetQuery,
  isMobile,
}) {
  const C = useTheme();
  const { t } = useTranslate();
  const [intQuery, setIntQuery] = useState("");
  const [openGroups, setOpenGroups] = useState(() => new Set());

  const searchQuery = extQuery !== undefined ? extQuery : intQuery;
  const setSearchQuery = extSetQuery || setIntQuery;
  const q = searchQuery.trim().toLowerCase();

  const groupColors = {
    emergency: C.red,
    cardiovascular: C.red,
    respiratory: C.green,
    fluid: C.accent,
    antimicrobial: C.yellow,
    analgesia: C.orange,
    other: C.purple,
  };

  const groupedTreatments = useMemo(() => {
    const map = {};
    CLINICAL_GROUPS.forEach((grp) => {
      map[grp.id] = TREATMENTS.filter((item) => {
        const matchesGrp = matchTreatGroup(item, grp.id);
        const matchesQuery =
          !q || item.name.toLowerCase().includes(q) || item.id.toLowerCase().includes(q);
        return matchesGrp && matchesQuery;
      });
    });
    return map;
  }, [q]);

  const toggleGroup = (id) => {
    setOpenGroups((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const hideWarnings = localStorage.getItem("ms_hideWarnings") === "true";

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", padding: "8px 12px", boxSizing: "border-box" }}>
      {/* Search Bar matching DiagTab full width */}
      <TreatSearchBar
        searchQuery={searchQuery}
        setSearchQuery={(val) => {
          setSearchQuery(val);
          if (val.trim()) {
            setOpenGroups(new Set(CLINICAL_GROUPS.map((g) => g.id)));
          } else {
            setOpenGroups(new Set());
          }
        }}
        placeholder={t("search.placeholderTreat") || "Поиск препаратов..."}
        C={C}
      />

      {/* Accordion Groups List */}
      <div className="no-scrollbar" style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", paddingRight: 2 }}>
        {CLINICAL_GROUPS.map((grp) => {
          const items = groupedTreatments[grp.id] || [];
          if (q && items.length === 0) return null;
          const grpColor = groupColors[grp.id] || C.accent;
          const IconComp = grp.Icon;
          return (
            <TreatAccordionGroup
              key={grp.id}
              title={grp.label}
              icon={<IconComp size={15} color={grpColor} />}
              color={grpColor}
              items={items}
              selTreat={selTreat}
              toggleTreatment={toggleTreatment}
              appliedFx={appliedFx}
              pendingFx={pendingFx}
              cd={cd}
              isOpen={openGroups.has(grp.id) || !!q}
              onToggleOpen={() => toggleGroup(grp.id)}
              hideWarnings={hideWarnings}
              isMobile={isMobile}
            />
          );
        })}
      </div>
    </div>
  );
}
