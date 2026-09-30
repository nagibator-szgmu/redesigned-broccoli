import React from "react";
import TreatPanel from "../TreatPanel";

/** Treatments selection tab container component */
export default function TreatTab({
  cd,
  selTreat = [],
  toggleTreatment,
  appliedFx,
  pendingFx,
  treatCat,
  setTreatCat,
  isMobile = false,
}) {
  return (
    <div
      style={{
        flex: 1,
        minHeight: 0,
        height: "100%",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
      }}
    >
      <TreatPanel
        cd={cd}
        selTreat={selTreat}
        toggleTreatment={toggleTreatment}
        appliedFx={appliedFx}
        pendingFx={pendingFx}
        treatCat={treatCat}
        setTreatCat={setTreatCat}
        isMobile={isMobile}
      />
    </div>
  );
}
