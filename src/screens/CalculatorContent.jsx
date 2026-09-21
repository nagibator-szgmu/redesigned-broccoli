import GCSCalculator from "./calculators/GCSCalculator";
import SOFACalculator from "./calculators/SOFACalculator";
import LRINECCalculator from "./calculators/LRINECCalculator";

export default function CalculatorContent({ calcId, C }) {
  if (calcId === "gcs") {
    return <GCSCalculator C={C} />;
  }
  if (calcId === "sofa") {
    return <SOFACalculator C={C} />;
  }
  if (calcId === "lrinec") {
    return <LRINECCalculator C={C} />;
  }
  return null;
}
