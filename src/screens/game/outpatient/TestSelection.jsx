import React, { useState, useMemo } from "react";
import { FONT, CODE, getCategoryColor } from "../../../ui/theme";
import { useTheme } from "../../../ui/ThemeContext";
import { useTranslate } from "../../../locale/useTranslate";
import { DIAGNOSTICS } from "../../../data/diagnostics";
import { IconMicroscope, IconCardiac, IconRespiratory, IconXRay, IconBrain } from "../../../ui/icons";
import DiagAccordionGroup from "../../../components/game/workstation/DiagAccordionGroup";
import OutpatientSearchBar from "./OutpatientSearchBar";
import { BIOCHEMICAL_TEST_IDS } from "../../../engine/labAnalysisEngine";
import InvasiveConfirmModal from "./InvasiveConfirmModal";

const INVASIVE_TESTS = ["colonoscopy", "egds", "paracentesis", "lumbar", "ct_abdo", "ct_chest", "ct_head", "xray_abdo", "mri"];

const DIAG_CATEGORIES = [
  { key: "lab", title: "Лабораторные исследования", Icon: IconMicroscope },
  { key: "cardiac", title: "Кардиология", Icon: IconCardiac },
  { key: "respiratory", title: "Дыхание и газы", Icon: IconRespiratory },
  { key: "imaging", title: "Лучевая диагностика и эндоскопия", Icon: IconXRay },
  { key: "neuro", title: "Неврология", Icon: IconBrain },
];

/** Test ordering panel with collapsible categories matching ICU workstation (FR-С.3) */
export function TestSelection({
  selDiag = [],
  setSelDiag,
  orderedDiag = [],
  handleOrderTests,
  processingTests = false,
  selectedLabParams = {},
  setSelectedLabParams,
}) {
  const C = useTheme();
  const { t } = useTranslate();
  const [search, setSearch] = useState("");
  const [openCats, setOpenCats] = useState(() => new Set());
  const [pendingTest, setPendingTest] = useState(null);

  const q = search.trim().toLowerCase();

  const groupedDiagnostics = useMemo(() => {
    const map = {};
    DIAG_CATEGORIES.forEach((cat) => {
      map[cat.key] = DIAGNOSTICS.filter((item) => {
        const matchesCat = item.cat === cat.key;
        const matchesQuery = !q || item.name.toLowerCase().includes(q) || item.id.toLowerCase().includes(q);
        const notBiochemSub = !BIOCHEMICAL_TEST_IDS.includes(item.id);
        return matchesCat && matchesQuery && notBiochemSub;
      });
    });
    return map;
  }, [q]);

  const toggleDiag = (id) => {
    if (!selDiag.includes(id) && INVASIVE_TESTS.includes(id)) {
      setPendingTest(id);
      return;
    }
    setSelDiag((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const toggleCat = (key) => {
    setOpenCats((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const handleSearchChange = (val) => {
    setSearch(val);
    if (val.trim()) {
      setOpenCats(new Set(DIAG_CATEGORIES.map((c) => c.key)));
    } else {
      setOpenCats(new Set());
    }
  };

  const isBtnDisabled = selDiag.length === 0 || processingTests;

  return (
    <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 14, padding: 14, marginBottom: 12 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: C.accent, fontFamily: FONT, display: "flex", alignItems: "center", gap: 6 }}>
          <IconMicroscope size={15} color={C.accent} />
          <span>{t("outpatient.orderTests") || "Назначение исследований"}</span>
        </div>
        <span style={{ fontSize: 11, fontFamily: CODE, color: selDiag.length > 0 ? C.accent : C.textDim, background: `${C.accent}14`, padding: "2px 8px", borderRadius: 6, fontVariantNumeric: "tabular-nums" }}>
          {t("orderTests.selected", { n: selDiag.length }) || `Выбрано: ${selDiag.length}`}
        </span>
      </div>

      {/* Search Bar matching ICU */}
      <OutpatientSearchBar
        value={search}
        onChange={handleSearchChange}
        placeholder={t("search.placeholderDiag") || "Поиск исследований..."}
        C={C}
      />

      {/* Accordion Categories List */}
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {DIAG_CATEGORIES.map((cat) => {
          const items = groupedDiagnostics[cat.key] || [];
          if (q && items.length === 0) return null;
          const catColor = getCategoryColor(cat.key, C);
          const IconComp = cat.Icon;
          return (
            <DiagAccordionGroup
              key={cat.key}
              title={cat.title}
              icon={<IconComp size={15} color={catColor} />}
              color={catColor}
              items={items}
              selDiag={selDiag}
              orderedDiag={orderedDiag}
              onToggle={toggleDiag}
              isOpen={openCats.has(cat.key) || !!q}
              onToggleOpen={() => toggleCat(cat.key)}
              disabled={processingTests}
              selectedLabParams={selectedLabParams}
              onParamsChange={(testId, ids) => {
                setSelectedLabParams && setSelectedLabParams((prev) => ({ ...prev, [testId]: ids }));
              }}
            />
          );
        })}
      </div>

      {/* Footer Actions */}
      <div style={{ marginTop: 12, paddingTop: 10, borderTop: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <span style={{ fontSize: 13, color: C.textDim, fontFamily: FONT, fontWeight: 500 }}>
          {t("orderTests.selected", { n: selDiag.length })}
        </span>
        <button
          type="button"
          onClick={handleOrderTests}
          disabled={isBtnDisabled}
          style={{
            minHeight: 40,
            padding: "9px 22px",
            fontSize: 13.5,
            fontWeight: 700,
            fontFamily: FONT,
            borderRadius: 10,
            border: "none",
            cursor: isBtnDisabled ? "not-allowed" : "pointer",
            color: isBtnDisabled ? C.textDim : C.bg,
            background: isBtnDisabled ? `${C.textDim}25` : `linear-gradient(135deg, ${C.accent}, ${C.green})`,
            boxShadow: !isBtnDisabled ? `0 4px 14px ${C.accent}30` : "none",
            transition: "all 0.15s ease",
          }}
        >
          {processingTests ? (t("outpatient.loading") || "Отправка...") : selDiag.length > 0 ? (t("outpatient.send", { n: selDiag.length }) || `Назначить (${selDiag.length})`) : (t("orderTests.send") || "В лабораторию")}
        </button>
      </div>

      {pendingTest && (
        <InvasiveConfirmModal
          isOpen={true}
          testName={DIAGNOSTICS.find((d) => d.id === pendingTest)?.name || pendingTest}
          onConfirm={() => {
            setSelDiag((prev) => (prev.includes(pendingTest) ? prev : [...prev, pendingTest]));
            setPendingTest(null);
          }}
          onCancel={() => setPendingTest(null)}
        />
      )}
    </div>
  );
}
