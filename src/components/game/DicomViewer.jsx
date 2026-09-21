import { useTheme } from "../../ui/ThemeContext";
import { FONT } from "../../ui/theme";
import useIsMobile from "../../hooks/useIsMobile";
import { detectPathology } from "./dicom/dicomUtils";
import { useDicomCanvas } from "./dicom/useDicomCanvas";
import DicomSidebar from "./dicom/DicomSidebar";
import DicomViewport from "./dicom/DicomViewport";

export default function DicomViewer({ cd, onClose }) {
  const C = useTheme();
  const isMobile = useIsMobile();
  const pathology = detectPathology(cd);
  const canvasState = useDicomCanvas(pathology);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "#050a12",
        color: "#e8f4ff",
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        fontFamily: FONT,
        overflowY: isMobile ? "auto" : "hidden",
      }}
    >
      <DicomSidebar
        cd={cd}
        onClose={onClose}
        isMobile={isMobile}
        preset={canvasState.preset}
        setPreset={canvasState.setPreset}
        rulerMode={canvasState.rulerMode}
        toggleRuler={canvasState.toggleRuler}
        C={C}
      />

      <DicomViewport
        canvasRef={canvasState.canvasRef}
        overlayRef={canvasState.overlayRef}
        sliceIndex={canvasState.sliceIndex}
        setSliceIndex={canvasState.setSliceIndex}
        preset={canvasState.preset}
        huValue={canvasState.huValue}
        setHuValue={canvasState.setHuValue}
        rulerMode={canvasState.rulerMode}
        handleWheel={canvasState.handleWheel}
        handleMouseMove={canvasState.handleMouseMove}
        handleMouseDown={canvasState.handleMouseDown}
        handleMouseUp={canvasState.handleMouseUp}
        isMobile={isMobile}
        C={C}
      />
    </div>
  );
}
