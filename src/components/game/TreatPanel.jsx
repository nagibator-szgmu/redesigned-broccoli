import React, { useState } from "react";
import { useTheme } from "../../ui/ThemeContext";
import { useTranslate } from "../../locale/useTranslate";
import { STitle } from "../../ui/components";
import { TREATMENTS } from "../../data/treatments";
import TooltipBtn from "./TooltipBtn";
import {
  matchTreatGroup,
  TreatSearchBar,
  TreatCategoryChips,
  TreatListItem,
} from "./treat";

export default function TreatPanel({
  cd,
  selTreat = [],
  toggleTreatment,
  appliedFx,
  pendingFx,
  treatCat = "all",
  setTreatCat,
  searchQuery: extQuery,
  setSearchQuery: extSetQuery,
  isMobile,
  showHeader = true,
}) {
  const C = useTheme();
  const { t } = useTranslate();
  const [intQuery, setIntQuery] = useState("");

  const searchQuery = extQuery !== undefined ? extQuery : intQuery;
  const setSearchQuery = extSetQuery || setIntQuery;

  const q = searchQuery.trim().toLowerCase();
  const filtTreat = TREATMENTS.filter((item) => {
    const groupMatch = matchTreatGroup(item, treatCat);
    const searchMatch =
      !q || item.name.toLowerCase().includes(q) || item.id.toLowerCase().includes(q);
    return groupMatch && searchMatch;
  });

  const hideWarnings = localStorage.getItem("ms_hideWarnings") === "true";

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {showHeader && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            ...(isMobile ? { marginBottom: 4 } : {}),
          }}
        >
          <STitle icon="💊" label={t("treatment.title") || "Назначения"} color={C.green} />
          {!isMobile && (
            <>
              <TooltipBtn
                text={t("onboarding.tooltipTreatDelay") || "Время до начала действия"}
                C={C}
              />
              <TooltipBtn
                text={t("onboarding.tooltipContinuous") || "Непрерывный эффект"}
                C={C}
              />
            </>
          )}
        </div>
      )}

      <TreatSearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        placeholder={t("search.placeholderTreat") || "Фильтр списка..."}
        C={C}
      />

      <TreatCategoryChips treatCat={treatCat} setTreatCat={setTreatCat} C={C} />

      {/* List of Treatments */}
      <div
        className="no-scrollbar"
        style={{
          flex: 1,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 5,
          paddingRight: 2,
        }}
      >
        {filtTreat.length === 0 ? (
          <div style={{ textAlign: "center", padding: "20px 0", color: C.textDim, fontSize: 12 }}>
            Ничего не найдено
          </div>
        ) : (
          filtTreat.map((item) => {
            const isSelected = selTreat.includes(item.id);
            const isPending = pendingFx?.has(item.id);
            const isApplied = appliedFx?.has(item.id);
            const isDangerous = cd?.wrongTreat?.includes(item.id);
            const isContraindicated = cd?.contraindicatedTreat?.includes(item.id);
            const isBad = isDangerous || isContraindicated;

            return (
              <TreatListItem
                key={item.id}
                item={item}
                isSelected={isSelected}
                isPending={isPending}
                isApplied={isApplied}
                isBad={isBad}
                hideWarnings={hideWarnings}
                onToggle={() => toggleTreatment(item.id)}
                isMobile={isMobile}
                C={C}
              />
            );
          })
        )}
      </div>
    </div>
  );
}

