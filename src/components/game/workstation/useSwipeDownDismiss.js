import { useState, useRef } from "react";

/**
 * Хук жеста свайпа вниз для мобильных шторок (bottom sheets).
 * @param {Function} onDismiss - Коллбэк закрытия шторки
 * @param {number} threshold - Порог смещения в пикселях (по умолчанию 65)
 */
export function useSwipeDownDismiss(onDismiss, threshold = 65) {
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startYRef = useRef(0);
  const currentYRef = useRef(0);

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

  return {
    dragY,
    isDragging,
    gestureProps: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
      onTouchCancel: handleTouchEnd,
    },
  };
}
