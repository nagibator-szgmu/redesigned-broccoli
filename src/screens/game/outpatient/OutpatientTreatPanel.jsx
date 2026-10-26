import React, { useState, useMemo } from "react";
import { FONT, CODE } from "../../../ui/theme";
import { useTheme } from "../../../ui/ThemeContext";
import { useTranslate } from "../../../locale/useTranslate";
import { OUTPATIENT_TREATMENTS } from "../../../data/outpatientTreatments";
import { IconPill, IconDroplet, IconCardiac, IconInfectious } from "../../../ui/icons";
import OutpatientTreatAccordionGroup from "./OutpatientTreatAccordionGroup";
import OutpatientSearchBar from "./OutpatientSearchBar";
import RxBuilderModal from "./RxBuilderModal";

const OUTPATIENT_GROUPS = [
  { id: "gastro", title: "Гастроэнтерология", Icon: IconDroplet, colorKey: "accent" },
  { id: "therapy", title: "Терапия и кардиология", Icon: IconCardiac, colorKey: "red" },
  { id: "antimicrobial", title: "Антимикробные препараты", Icon: IconInfectious, colorKey: "yellow" },
  { id: "diet", title: "Диетотерапия Минздрава РФ", Icon: IconPill, colorKey: "green" },
  { id: "other", title: "Прочие назначения", Icon: IconPill, colorKey: "purple" },
];

export default function OutpatientTreatPanel({
  cd, selTreat = [], setSelTreat, toggleTreatment,
  prescriptions = {}, setPrescriptions,
  rxBuilderData, setRxBuilderData, onSubmit, onBack,
}) {
  const C = useTheme();
  const { t } = useTranslate();
  const [search, setSearch] = useState("");
  const [openGroups, setOpenGroups] = useState(() => new Set());
  const [showRxModal, setShowRxModal] = useState(false);
  const [targetDrug, setTargetDrug] = useState(null);

  const handleToggle = (id) => {
    if (setSelTreat) {
      setSelTreat((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
    } else if (toggleTreatment) {
      toggleTreatment(id);
    }
  };

  const handleOpenRxBuilder = (item) => {
    setTargetDrug(item);
    setShowRxModal(true);
  };

  const handleSaveRx = (rxData) => {
    if (!rxData?.id) return;
    if (setSelTreat) {
      setSelTreat((prev) => (prev.includes(rxData.id) ? prev : [...prev, rxData.id]));
    }
    if (setPrescriptions) {
      setPrescriptions((prev) => ({ ...prev, [rxData.id]: rxData }));
    }
    if (setRxBuilderData) setRxBuilderData(rxData);
    setShowRxModal(false);
  };

  const handleRemoveRx = (drugId) => {
    if (setSelTreat) {
      setSelTreat((prev) => prev.filter((x) => x !== drugId));
    }
    if (setPrescriptions) {
      setPrescriptions((prev) => {
        const next = { ...prev };
        delete next[drugId];
        return next;
      });
    }
  };

  const q = search.trim().toLowerCase();
  const groupedTreatments = useMemo(() => {
    const map = {};
    OUTPATIENT_GROUPS.forEach((grp) => {
      map[grp.id] = OUTPATIENT_TREATMENTS.filter((item) => {
        const matchesGrp = item.cat === grp.id;
        const matchesQuery = !q || item.name.toLowerCase().includes(q) ||
          item.id.toLowerCase().includes(q) || (item.desc || "").toLowerCase().includes(q);
        return matchesGrp && matchesQuery;
      });
    });
    return map;
  }, [q]);

  const handleSearchChange = (val) => {
    setSearch(val);
    setOpenGroups(val.trim() ? new Set(OUTPATIENT_GROUPS.map((g) => g.id)) : new Set());
  };

  const toggleGroup = (id) => {
    setOpenGroups((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 14, padding: 14, marginBottom: 12 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: C.accent, fontFamily: FONT, display: "flex", alignItems: "center", gap: 6 }}>
          <IconPill size={15} color={C.accent} />
          <span>{t("outpatient.prescribeTitle") || "Амбулаторные назначения и рецептурный лист"}</span>
        </div>
        <span style={{ fontSize: 11, fontFamily: CODE, color: selTreat.length > 0 ? C.green : C.textDim, background: `${C.accent}14`, padding: "2px 8px", borderRadius: 6 }}>
          {selTreat.length > 0 ? `Выписано: ${selTreat.length}` : (t("outpatient.noMedsNeeded") || "Без медикаментов")}
        </span>
      </div>

      <OutpatientSearchBar value={search} onChange={handleSearchChange} placeholder={t("search.placeholderTreat") || "Поиск амбулаторных препаратов и диеты..."} C={C} />

      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {OUTPATIENT_GROUPS.map((grp) => {
          const items = groupedTreatments[grp.id] || [];
          if (q && items.length === 0) return null;
          const groupColor = C[grp.colorKey] || C.accent;
          const IconComp = grp.Icon;
          return (
            <OutpatientTreatAccordionGroup
              key={grp.id} title={grp.title} icon={<IconComp size={15} color={groupColor} />}
              color={groupColor} items={items} selTreat={selTreat} prescriptions={prescriptions}
              onToggle={handleToggle} onOpenRxBuilder={handleOpenRxBuilder} onRemoveRx={handleRemoveRx}
              isOpen={openGroups.has(grp.id) || !!q} onToggleOpen={() => toggleGroup(grp.id)}
            />
          );
        })}
      </div>

      <div style={{ display: "flex", gap: 8, marginTop: 14, paddingTop: 10, borderTop: `1px solid ${C.border}` }}>
        {onBack && (
          <button type="button" onClick={onBack} style={{ padding: "11px 16px", borderRadius: 10, background: "transparent", border: `1px solid ${C.border}`, fontSize: 13, fontWeight: 600, color: C.textDim, cursor: "pointer", fontFamily: FONT, whiteSpace: "nowrap" }}>
            ← {t("theory.back") || "Назад"}
          </button>
        )}
        <button type="button" onClick={onSubmit} style={{ flex: 1, padding: "11px 16px", borderRadius: 10, background: `linear-gradient(135deg, ${C.accent}, ${C.green})`, border: "none", fontSize: 13.5, fontWeight: 700, color: C.bg, cursor: "pointer", fontFamily: FONT, boxShadow: `0 4px 14px ${C.accent}30` }}>
          {t("outpatient.finishPrescribe") || "Завершить приём и выписать рецепт"}
        </button>
      </div>

      <RxBuilderModal
        isOpen={showRxModal}
        targetDrug={targetDrug}
        rxPlan={cd?.rxPlan}
        currentRx={targetDrug ? prescriptions[targetDrug.id] : rxBuilderData}
        onSave={handleSaveRx}
        onClose={() => { setShowRxModal(false); setTargetDrug(null); }}
      />
    </div>
  );
}
