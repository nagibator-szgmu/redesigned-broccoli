import { useTheme } from "../../../ui/ThemeContext";
import TreatPanel from "../TreatPanel";

/** Treatments selection tab component */
export default function TreatTab({
  cd,
  selTreat = [],
  toggleTreatment,
  appliedFx,
  pendingFx,
  treatCat,
  setTreatCat,
  isMobile = false
}) {
  const C = useTheme();

  return (
    <div style={{ height: "100%", padding: "12px 14px", overflowY: "auto", boxSizing: "border-box" }}>
      <TreatPanel
        cd={cd}
        selTreat={selTreat}
        toggleTreatment={toggleTreatment}
        appliedFx={appliedFx}
        pendingFx={pendingFx}
        treatCat={treatCat}
        setTreatCat={setTreatCat}
        isMobile={isMobile}
        C={C}
      />
    </div>
  );
}
