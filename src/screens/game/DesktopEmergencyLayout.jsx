import DesktopWorkstation from "../../components/game/workstation/DesktopWorkstation";

/** Desktop layout for EmergencyGameScreen delegating to DesktopWorkstation ergonomics */
export default function DesktopEmergencyLayout(props) {
  return <DesktopWorkstation {...props} />;
}
