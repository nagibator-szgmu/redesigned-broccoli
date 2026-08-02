import { useState } from "react";
import { FONT } from "../ui/theme";
import { useTheme } from "../ui/ThemeContext";
import { useTranslate } from "../locale/useTranslate";
import useIsMobile from "../hooks/useIsMobile";

const STEPS = [
  {
    icon:"🏥",
    titleKey:"onboarding.step1Title",
    titleDefault:"Добро пожаловать в МедСим",
    descKey:"onboarding.step1Desc",
    descDefault:"Клинический симулятор для тренировки принятия решений. 67 реальных случаев по 7 специальностям: кардиология, неврология, пульмонология, инфекции, эндокринология, токсикология, хирургия.",
  },
  {
    icon:"⚡",
    titleKey:"onboarding.step2Title",
    titleDefault:"Как проходить случаи",
    descKey:"onboarding.step2Desc",
    descDefault:"1) Назначьте исследования → 2) Получите результаты → 3) Поставьте диагноз → 4) Назначьте лечение. В ОРИТ и Приёмном отделении время ограничено — пациент ухудшается с каждой секундой. В Поликлинике таймера нет.",
  },
  {
    icon:"🏛️",
    titleKey:"onboarding.step3Title",
    titleDefault:"Четыре отделения",
    descKey:"onboarding.step3Desc",
    descDefault:"В игре 4 отделения. ОРИТ — критический пациент, нужны немедленные решения. Приёмное — ваша цель не вылечить, а решить, куда направить (в стационар/домой/на операцию). Поликлиника — без таймера, приём в спокойном темпе, структурированный диагноз. Стационар — время идёт сутками, вы ведёте пациента день за днём.",
  },
  {
    icon:"💊",
    titleKey:"onboarding.step4Title",
    titleDefault:"Лечение и диагностика",
    descKey:"onboarding.step4Desc",
    descDefault:"Назначайте только нужные препараты. Некоторые лекарства опасны при данной патологии — они нанесут вред пациенту и снизят ваш балл. Всегда проверяйте противопоказания.",
  },
  {
    icon:"📚",
    titleKey:"onboarding.step5Title",
    titleDefault:"Теория и обучение",
    descKey:"onboarding.step5Desc",
    descDefault:"Изучайте конспекты по 35 темам, проходите тесты и закрепляйте знания. Режим «Курс» помогает систематически освоить материал — темы разблокируются по порядку.",
  },
  {
    icon:"🏆",
    titleKey:"onboarding.step6Title",
    titleDefault:"Оценка и прогресс",
    descKey:"onboarding.step6Desc",
    descDefault:"Балл зависит от диагноза, назначенных исследований, лечения и исхода пациента. Следите за статистикой в разделе «Достижения».",
  },
  {
    icon:"📉",
    titleKey:"onboarding.step7Title",
    titleDefault:"Детериорация пациента",
    descKey:"onboarding.step7Desc",
    descDefault:"Каждые 30 секунд в ОРИТ и Приёмном отделении состояние пациента может ухудшаться: давление падает, пульс растёт, сатурация снижается. Если виталы упадут слишком низко — пациент погибнет. Действуйте быстро!",
  },
  {
    icon:"⏱️",
    titleKey:"onboarding.step8Title",
    titleDefault:"Задержка и непрерывное лечение",
    descKey:"onboarding.step8Desc",
    descDefault:"Препараты действуют не мгновенно — у каждого есть задержка (от 5 секунд до 5 минут). Кислород и интубация работают непрерывно, поддерживая пациента всё время. Назначайте лечение заранее!",
  },
];

export default function OnboardingScreen({ onComplete }) {
  const C = useTheme();
  const isMobile = useIsMobile();
  const { t } = useTranslate();
  const [step, setStep] = useState(0);
  const s = STEPS[step];
  const progress = ((step + 1) / STEPS.length) * 100;

  const next = () => {
    if (step < STEPS.length - 1) setStep(step + 1);
    else onComplete("start");
  };

  const skip = () => onComplete("skip");

  if (isMobile) return (
    <div style={{position:"fixed",inset:0,background:C.bg,fontFamily:FONT,display:"flex",flexDirection:"column",zIndex:1000}}>
      {/* Progress bar */}
      <div style={{height:3,background:C.border}}>
        <div style={{height:"100%",width:`${progress}%`,background:`linear-gradient(90deg,${C.accent},${C.green})`,transition:"width 0.3s ease"}}/>
      </div>

      <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"24px 24px 0"}}>
        <div style={{fontSize:64,marginBottom:20,animation:"fadeIn 0.4s ease"}}>{s.icon}</div>
        <div style={{fontSize:22,fontWeight:700,color:C.white,fontFamily:FONT,textAlign:"center",marginBottom:12}}>
          {t(s.titleKey) || s.titleDefault}
        </div>
        <div style={{fontSize:14,color:C.text,fontFamily:FONT,textAlign:"center",lineHeight:1.7,maxWidth:360}}>
          {t(s.descKey) || s.descDefault}
        </div>
      </div>

      <div style={{padding:"16px 24px 32px"}}>
        {/* Step dots */}
        <div style={{display:"flex",justifyContent:"center",gap:8,marginBottom:20}}>
          {STEPS.map((_,i)=>(
            <div key={i} style={{width:i===step?20:7,height:7,borderRadius:4,background:i===step?C.accent:`${C.accent}30`,transition:"all 0.3s"}}/>
          ))}
        </div>
        {step < STEPS.length - 1 ? (
          <>
            <button onClick={next} style={{width:"100%",background:`linear-gradient(135deg,${C.accent},${C.green})`,border:"none",borderRadius:12,padding:"15px",fontSize:15,fontWeight:700,color:C.bg,cursor:"pointer",fontFamily:FONT,marginBottom:10}}>
              {t("onboarding.next")}
            </button>
            <div onClick={skip} style={{textAlign:"center",fontSize:13,color:C.textDim,cursor:"pointer",padding:"8px"}}>
              {t("onboarding.skip")}
            </div>
          </>
        ) : (
          <>
            <button onClick={next} style={{width:"100%",background:`linear-gradient(135deg,${C.accent},${C.green})`,border:"none",borderRadius:12,padding:"15px",fontSize:15,fontWeight:700,color:C.bg,cursor:"pointer",fontFamily:FONT,marginBottom:10}}>
              {t("onboarding.startLearning")}
            </button>
            <div onClick={skip} style={{textAlign:"center",fontSize:13,color:C.textDim,cursor:"pointer",padding:"8px"}}>
              {t("onboarding.skipIntro")}
            </div>
          </>
        )}
      </div>
    </div>
  );

  return (
    <div style={{position:"fixed",inset:0,background:C.bg,fontFamily:FONT,display:"flex",zIndex:1000}}>
      {/* Left panel — step info */}
      <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"40px"}}>
        <div style={{fontSize:80,marginBottom:24,animation:"fadeIn 0.4s ease"}}>{s.icon}</div>
        <div style={{fontSize:28,fontWeight:700,color:C.white,fontFamily:FONT,textAlign:"center",marginBottom:16}}>
          {t(s.titleKey) || s.titleDefault}
        </div>
        <div style={{fontSize:15,color:C.text,fontFamily:FONT,textAlign:"center",lineHeight:1.8,maxWidth:480}}>
          {t(s.descKey) || s.descDefault}
        </div>
      </div>

      {/* Right panel — controls */}
      <div style={{width:320,flexShrink:0,background:C.panelBg,backdropFilter:"blur(24px)",borderLeft:`1px solid ${C.border}`,display:"flex",flexDirection:"column",justifyContent:"center",padding:"40px 32px"}}>
        {/* Step dots */}
        <div style={{display:"flex",justifyContent:"center",gap:10,marginBottom:32}}>
          {STEPS.map((_,i)=>(
            <div key={i} style={{width:i===step?24:8,height:8,borderRadius:4,background:i===step?C.accent:`${C.accent}30`,transition:"all 0.3s"}}/>
          ))}
        </div>

        <div style={{fontSize:13,color:C.textDim,fontFamily:FONT,textAlign:"center",marginBottom:24}}>
          {t("onboarding.stepOf",{current:step+1,total:STEPS.length})}
        </div>

        {step < STEPS.length - 1 ? (
          <>
            <button onClick={next} style={{width:"100%",background:`linear-gradient(135deg,${C.accent},${C.green})`,border:"none",borderRadius:12,padding:"15px",fontSize:15,fontWeight:700,color:C.bg,cursor:"pointer",fontFamily:FONT,marginBottom:12,transition:"all 0.2s",boxShadow:`0 4px 16px rgba(0,230,200,0.3)`}}>
              {t("onboarding.next")} →
            </button>
            <div onClick={skip} style={{textAlign:"center",fontSize:13,color:C.textDim,cursor:"pointer",padding:"10px",borderRadius:8,transition:"background 0.15s"}}>
              {t("onboarding.skipIntro")}
            </div>
          </>
        ) : (
          <>
            <button onClick={next} style={{width:"100%",background:`linear-gradient(135deg,${C.accent},${C.green})`,border:"none",borderRadius:12,padding:"15px",fontSize:15,fontWeight:700,color:C.bg,cursor:"pointer",fontFamily:FONT,marginBottom:12,transition:"all 0.2s",boxShadow:`0 4px 16px rgba(0,230,200,0.3)`}}>
              {t("onboarding.startLearning")} →
            </button>
            <div onClick={skip} style={{textAlign:"center",fontSize:13,color:C.textDim,cursor:"pointer",padding:"10px",borderRadius:8,transition:"background 0.15s"}}>
              {t("onboarding.skipIntro")}
            </div>
          </>
        )}

        <div style={{marginTop:40,paddingTop:20,borderTop:`1px solid ${C.border}`,fontSize:11,color:C.textDim,textAlign:"center",lineHeight:1.6,fontFamily:FONT}}>
          {t("onboarding.disclaimer")}
        </div>
      </div>
    </div>
  );
}
