import { useState, useRef, useEffect } from "react";

/**
 * Хук плавного входа/выхода и жеста свайпа вниз для мобильных шторок.
 * @param {boolean} isOpen - Состояние открытости шторки
 * @param {Function} onDismiss - Коллбэк закрытия шторки
 * @param {number} threshold - Порог смещения в пикселях для закрытия (по умолчанию 65)
 */
export function useSwipeDownDismiss(isOpen, onDismiss, threshold = 65) {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isClosing, setIsClosing] = useState(false);
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startYRef = useRef(0);
  const currentYRef = useRef(0);
  const exitTimerRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
      setIsClosing(false);
      setDragY(0);
      setShouldRender(true);
    } else if (shouldRender) {
      setIsClosing(true);
      setDragY(0);
      exitTimerRef.current = setTimeout(() => {
        setShouldRender(false);
        setIsClosing(false);
      }, 240);
      return () => {
        if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
      };
    }
  }, [isOpen, shouldRender]);

  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    startYRef.current = touch.clientY;
    currentYRef.current = touch.clientY;
    setIsDragging(true);
  };

  const handleTouchMove = (e) => {
    if (!startYRef.current) return;
    const touch = e.touches[0];
    const delta = touch.clientY - startYRef.current;
    if (delta > 0) {
      currentYRef.current = touch.clientY;
      setDragY(delta);
    }
  };

  const handleTouchEnd = () => {
    const delta = currentYRef.current - startYRef.current;
    if (delta > threshold) {
      onDismiss?.();
    }
    setDragY(0);
    setIsDragging(false);
    startYRef.current = 0;
    currentYRef.current = 0;
  };

  let sheetTransform = "translate3d(0, 0, 0)";
  let sheetTransition = "none";
  let sheetAnimation = "quickDrawerSlideIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards";

  if (isDragging) {
    sheetTransform = `translate3d(0, ${dragY}px, 0)`;
    sheetTransition = "none";
    sheetAnimation = "none";
  } else if (isClosing) {
    sheetTransform = "translate3d(0, 100%, 0)";
    sheetTransition = "transform 0.24s cubic-bezier(0.16, 1, 0.3, 1)";
    sheetAnimation = "none";
  }

  return {
    shouldRender,
    isClosing,
    sheetAnimationProps: {
      transform: sheetTransform,
      transition: sheetTransition,
      animation: sheetAnimation,
    },
    gestureProps: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
      onTouchCancel: handleTouchEnd,
    },
  };
}
