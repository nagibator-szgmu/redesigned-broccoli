import { useState, useEffect, useRef, useCallback } from "react";
import { useTheme } from "../../ui/ThemeContext";
import {
  VITAL_TIPS,
  TIPS,
  MENU_TOUR_STEPS,
  useElementRect,
  MenuTourModal,
  VitalSeqModal,
  GameTipModal,
} from "./tutorial";

export default function TutorialGuide({ phase, seenTips, onSkip, showTourMenu, onTourComplete }) {
  const C = useTheme();
  const [tipQueue, setTipQueue] = useState([]);
  const [currentTipIdx, setCurrentTipIdx] = useState(0);
  const [inVitalSub, setInVitalSub] = useState(0);
  const [inMenuTour, setInMenuTour] = useState(0);
  const tickRef = useRef(0);

  const isDead = phase === "dead";

  const currentMenuStep = inMenuTour > 0 ? MENU_TOUR_STEPS[inMenuTour - 1] : null;
  const menuSelector = currentMenuStep ? `#tutorial-${currentMenuStep.anchor}` : null;
  const menuRect = useElementRect(menuSelector, inMenuTour > 0);

  const tip = tipQueue[currentTipIdx];
  const gameTipSelector = tip && !tip.isVitalSeq && !isDead ? `[data-tutorial="${tip.key}"]` : null;
  const gameTipRect = useElementRect(gameTipSelector, !!gameTipSelector);

  const vitalSub = tip && tip.isVitalSeq ? VITAL_TIPS[inVitalSub] : null;
  const vitalSelector = vitalSub ? `[data-tutorial="${vitalSub.key}"]` : null;
  const vitalRect = useElementRect(vitalSelector, !!vitalSelector);

  const queueMainTip = useCallback((tipItem) => {
    setTipQueue([tipItem]);
    setCurrentTipIdx(0);
    setInVitalSub(0);
    setInMenuTour(0);
  }, []);

  useEffect(() => {
    if (showTourMenu) {
      queueMainTip(null);
      setInMenuTour(1);
      return;
    }
    if (isDead) return;
    const seq = TIPS.filter((t) => !t.isTourMenu);
    const idx = tickRef.current;
    if (idx < seq.length) {
      const currentTip = seq[idx];
      if (!currentTip.phase || currentTip.phase === phase) {
        if (currentTip.isVitalSeq) {
          if (!seenTips.has(currentTip.key)) {
            queueMainTip(currentTip);
          } else {
            tickRef.current += 1;
          }
        } else if (!seenTips.has(currentTip.key)) {
          queueMainTip(currentTip);
        } else {
          tickRef.current += 1;
        }
      }
    }
  }, [phase, seenTips, showTourMenu, isDead, queueMainTip]);

  const handleNextVital = () => {
    if (inVitalSub < VITAL_TIPS.length - 1) {
      setInVitalSub((v) => v + 1);
    } else {
      onSkip("vitals_seq");
      setTipQueue([]);
      setCurrentTipIdx(0);
      setInVitalSub(0);
      tickRef.current += 1;
    }
  };

  const handleDismiss = () => {
    const activeTip = tipQueue[currentTipIdx];
    if (!activeTip) return;
    if (activeTip.isVitalSeq) {
      handleNextVital();
      return;
    }
    onSkip(activeTip.key);
    setTipQueue([]);
    setCurrentTipIdx(0);
    tickRef.current += 1;
  };

  const handleMenuTourNext = () => {
    if (inMenuTour < MENU_TOUR_STEPS.length) {
      setInMenuTour((v) => v + 1);
    } else {
      setInMenuTour(0);
      onTourComplete && onTourComplete();
    }
  };

  if (inMenuTour > 0 && currentMenuStep) {
    return (
      <MenuTourModal
        step={currentMenuStep}
        inMenuTour={inMenuTour}
        menuRect={menuRect}
        onNext={handleMenuTourNext}
        onSkip={() => {
          setInMenuTour(0);
          onTourComplete && onTourComplete();
        }}
        C={C}
      />
    );
  }

  if (!tip || isDead) return null;

  if (tip.isVitalSeq && vitalSub) {
    return (
      <VitalSeqModal
        sub={vitalSub}
        inVitalSub={inVitalSub}
        vitalRect={vitalRect}
        onDismiss={handleDismiss}
        onNext={handleNextVital}
        C={C}
      />
    );
  }

  return (
    <GameTipModal
      tip={tip}
      gameTipRect={gameTipRect}
      onDismiss={handleDismiss}
      C={C}
    />
  );
}

