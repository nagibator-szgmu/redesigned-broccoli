import { useState } from "react";
import { FONT } from "../ui/theme";
import { useTheme } from "../ui/ThemeContext";
import { useTranslate } from "../locale/useTranslate";
import useIsMobile from "../hooks/useIsMobile";
import { STEPS } from "./onboarding/onboardingSteps";

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
