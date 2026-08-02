import MobileWorkstation from "../../components/game/workstation/MobileWorkstation";

/** Mobile layout for EmergencyGameScreen delegating to MobileWorkstation ergonomics */
export default function MobileEmergencyLayout(props) {
  return <MobileWorkstation {...props} />;
}
