import { useState, useEffect, useRef, useCallback } from "react";
import { renderSlice, calculateHU, WINDOW_PRESETS } from "../../../engine/dicomRenderer";
import { CANVAS_WIDTH, CANVAS_HEIGHT, PIXEL_SPACING, MAX_SLICES } from "./dicomUtils";

export function useDicomCanvas(pathology) {
  const canvasRef = useRef(null);
  const overlayRef = useRef(null);
  const [sliceIndex, setSliceIndex] = useState(15);
  const [preset, setPreset] = useState(WINDOW_PRESETS.BRAIN);
  const [huValue, setHuValue] = useState(null);

  // Ruler Tool State
  const [rulerMode, setRulerMode] = useState(false);
  const [rulerStart, setRulerStart] = useState(null);
  const [rulerEnd, setRulerEnd] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // Render CT Image Slice
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const imageData = renderSlice(CANVAS_WIDTH, CANVAS_HEIGHT, sliceIndex, preset, pathology);
    ctx.putImageData(imageData, 0, 0);
  }, [sliceIndex, preset, pathology]);

  // Render Overlays (Ruler)
  useEffect(() => {
    const canvas = overlayRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    if (rulerStart && rulerEnd) {
      ctx.beginPath();
      ctx.moveTo(rulerStart.x, rulerStart.y);
      ctx.lineTo(rulerEnd.x, rulerEnd.y);
      ctx.strokeStyle = "#00ff00";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      const dx = rulerEnd.x - rulerStart.x;
      const dy = rulerEnd.y - rulerStart.y;
      const distPx = Math.sqrt(dx * dx + dy * dy);
      const distMm = (distPx * PIXEL_SPACING).toFixed(1);

      ctx.fillStyle = "#00ff00";
      ctx.font = "bold 9px 'Courier New', monospace";
      ctx.fillText(`${distMm} mm`, rulerEnd.x + 5, rulerEnd.y + 5);
    }
  }, [rulerStart, rulerEnd]);

  // Mouse Wheel for slice navigation
  const handleWheel = useCallback((e) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      setSliceIndex((prev) => Math.min(MAX_SLICES, prev + 1));
    } else {
      setSliceIndex((prev) => Math.max(1, prev - 1));
    }
  }, []);

  const getCanvasCoords = useCallback((e) => {
    if (!overlayRef.current) return { x: 0, y: 0 };
    const rect = overlayRef.current.getBoundingClientRect();
    const scaleX = CANVAS_WIDTH / rect.width;
    const scaleY = CANVAS_HEIGHT / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  }, []);

  const handleMouseMove = useCallback(
    (e) => {
      const { x, y } = getCanvasCoords(e);
      if (x >= 0 && x < CANVAS_WIDTH && y >= 0 && y < CANVAS_HEIGHT) {
        const hu = calculateHU(x, y, CANVAS_WIDTH, CANVAS_HEIGHT, sliceIndex, pathology);
        setHuValue(hu > -999 ? Math.floor(hu) : -1000);
      }
      if (rulerMode && isDrawing && rulerStart) {
        setRulerEnd({ x, y });
      }
    },
    [getCanvasCoords, sliceIndex, pathology, rulerMode, isDrawing, rulerStart]
  );

  const handleMouseDown = useCallback(
    (e) => {
      if (!rulerMode) return;
      const { x, y } = getCanvasCoords(e);
      setRulerStart({ x, y });
      setRulerEnd({ x, y });
      setIsDrawing(true);
    },
    [rulerMode, getCanvasCoords]
  );

  const handleMouseUp = useCallback(() => {
    if (rulerMode) {
      setIsDrawing(false);
    }
  }, [rulerMode]);

  const toggleRuler = useCallback(() => {
    setRulerMode((prev) => {
      if (prev) {
        setRulerStart(null);
        setRulerEnd(null);
      }
      return !prev;
    });
  }, []);

  return {
    canvasRef,
    overlayRef,
    sliceIndex,
    setSliceIndex,
    preset,
    setPreset,
    huValue,
    setHuValue,
    rulerMode,
    toggleRuler,
    handleWheel,
    handleMouseMove,
    handleMouseDown,
    handleMouseUp,
  };
}
