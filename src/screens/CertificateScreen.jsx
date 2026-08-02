import { FONT } from "../ui/theme";
import { useTheme } from "../ui/ThemeContext";
import { computeEarnedCertificates, CERTIFICATE_THRESHOLDS, SCORE_THRESHOLDS, MODE_CERTIFICATES, SPEC_CERTIFICATES } from "../data/certificates";
import useIsMobile from "../hooks/useIsMobile";
import { HeaderBackBtn } from "../ui/components";
import {
  IconCardiac, IconNeuro, IconRespiratory, IconInfectious,
  IconEndocrine, IconToxicology, IconAbdominal, IconTrophy,
  IconGraduationCap, IconTarget, IconCheck
} from "../ui/icons";

function renderCertIcon(cert, isEarned) {
  const color = isEarned ? cert.color : "#666";
  const size = 20;
  switch (cert.iconKey) {
    case "cardiac": return <IconCardiac size={size} color={color} />;
    case "neuro": return <IconNeuro size={size} color={color} />;
    case "respiratory": return <IconRespiratory size={size} color={color} />;
    case "infectious": return <IconInfectious size={size} color={color} />;
    case "endocrine": return <IconEndocrine size={size} color={color} />;
    case "toxicology": return <IconToxicology size={size} color={color} />;
    case "abdominal": return <IconAbdominal size={size} color={color} />;
    case "graduationCap": return <IconGraduationCap size={size} color={color} />;
    case "target": return <IconTarget size={size} color={color} />;
    default: return <IconTrophy size={size} color={color} />;
  }
}

export default function CertificateScreen({ setPhase, sessionHistory }) {
  const C = useTheme();
  const isMobile = useIsMobile();
  const earned = computeEarnedCertificates(sessionHistory);
  const total = CERTIFICATE_THRESHOLDS.length + SCORE_THRESHOLDS.length + MODE_CERTIFICATES.length + SPEC_CERTIFICATES.length;

  const sections = [
    {title:"Общие достижения",items:CERTIFICATE_THRESHOLDS},
    {title:"Серия и результаты",items:SCORE_THRESHOLDS},
    {title:"Режимы игры",items:MODE_CERTIFICATES},
    {title:"Специальности",items:SPEC_CERTIFICATES},
  ];

  const header = (
    <div style={{background:C.heroGrad,borderRadius:isMobile?14:18,padding:isMobile?"18px 16px":"24px 20px",marginBottom:14,textAlign:"center"}}>
      <div style={{display:"flex",justifyContent:"center",marginBottom:8}}>
        <IconGraduationCap size={44} color={C.accent} />
      </div>
      <div style={{fontSize:isMobile?18:22,fontWeight:700,color:C.white,fontFamily:FONT,marginBottom:6}}>Сертификаты и достижения</div>
      <div style={{fontSize:isMobile?13:14,color:C.heroText,fontFamily:FONT}}>
        Получено: <span style={{color:C.accent,fontWeight:700}}>{earned.size}</span> из {total}
      </div>
      <div style={{marginTop:10,height:6,background:`${C.border}`,borderRadius:3,overflow:"hidden",maxWidth:300,margin:"10px auto 0"}}>
        <div style={{height:"100%",width:`${(earned.size/total)*100}%`,background:`linear-gradient(90deg,${C.accent},${C.green})`,borderRadius:3,transition:"width 0.5s ease"}}/>
      </div>
    </div>
  );

  if (isMobile) return (
    <div style={{position:"fixed",inset:0,overflowY:"auto",background:C.bg,fontFamily:FONT}}>
      <div style={{background:C.panel,borderBottom:`1px solid ${C.border}`,padding:"10px 16px",display:"flex",alignItems:"center",gap:10,position:"sticky",top:0,zIndex:10}}>
        <div onClick={()=>setPhase("menu")} className="icon-btn" style={{width:26,height:26,background:`${C.accent}20`,border:`1px solid ${C.accent}44`,borderRadius:7,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>
          <span style={{fontFamily:"Georgia,serif",fontSize:13,color:C.accent,fontStyle:"italic",fontWeight:700}}>М</span>
        </div>
        <span style={{fontSize:14,fontWeight:700,color:C.white,fontFamily:FONT}}>🎓 Сертификаты</span>
        <div style={{flex:1}}/>
        <HeaderBackBtn onClick={() => setPhase("menu")} />
      </div>
      <div style={{padding:"14px 14px 80px"}}>
        {header}
        {sections.map(sec => (
          <div key={sec.title} style={{background:C.panel,border:`1px solid ${C.border}`,borderRadius:12,padding:14,marginBottom:10}}>
            <div style={{fontSize:11,color:C.textDim,textTransform:"uppercase",letterSpacing:1,fontWeight:600,marginBottom:10,fontFamily:FONT}}>{sec.title}</div>
            {sec.items.map(cert => {
              const isEarned = earned.has(cert.id);
              return (
                <div key={cert.id} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 10px",borderRadius:8,marginBottom:6,background:isEarned?`${cert.color}10`:"transparent",border:`1px solid ${isEarned?cert.color+"44":C.border}`,opacity:isEarned?1:0.45}}>
                  <div style={{display:"inline-flex",alignItems:"center",justifyContent:"center",width:24,height:24}}>
                    {renderCertIcon(cert, isEarned)}
                  </div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:isMobile?12:13,color:isEarned?cert.color:C.textDim,fontWeight:600,fontFamily:FONT}}>{cert.title}</div>
                    <div style={{fontSize:isMobile?10:11,color:C.textDim,fontFamily:FONT,marginTop:1}}>{cert.desc}</div>
                  </div>
                  {isEarned && <IconCheck size={14} color={C.green} />}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div style={{position:"fixed",inset:0,overflowY:"auto",background:C.bg,fontFamily:FONT}}>
      <div style={{background:C.panel,borderBottom:`1px solid ${C.border}`,padding:"12px 28px",display:"flex",alignItems:"center",gap:12}}>
        <div onClick={()=>setPhase("menu")} className="icon-btn" style={{width:28,height:28,background:`${C.accent}20`,border:`1px solid ${C.accent}44`,borderRadius:7,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>
          <span style={{fontFamily:"Georgia,serif",fontSize:14,color:C.accent,fontStyle:"italic",fontWeight:700}}>М</span>
        </div>
        <span style={{fontFamily:"Georgia,serif",fontSize:16,color:C.accent,fontStyle:"italic",letterSpacing:1}}>МедСим</span>
        <div style={{width:1,height:18,background:C.border}}/>
        <span style={{fontSize:13,color:C.textDim,fontFamily:FONT}}>Сертификаты</span>
        <div style={{flex:1}}/>
        <HeaderBackBtn onClick={() => setPhase("menu")} />
      </div>
      <div style={{maxWidth:900,margin:"0 auto",padding:"24px 20px 80px"}}>
        {header}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          {sections.map(sec => (
            <div key={sec.title} style={{background:C.panel,border:`1px solid ${C.border}`,borderRadius:14,padding:16}}>
              <div style={{fontSize:11,color:C.textDim,textTransform:"uppercase",letterSpacing:1,fontWeight:600,marginBottom:14,fontFamily:FONT}}>{sec.title}</div>
              {sec.items.map(cert => {
                const isEarned = earned.has(cert.id);
                return (
                  <div key={cert.id} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 12px",borderRadius:10,marginBottom:6,background:isEarned?`${cert.color}10`:"transparent",border:`1px solid ${isEarned?cert.color+"44":C.border}`,opacity:isEarned?1:0.45}}>
                    <div style={{display:"inline-flex",alignItems:"center",justifyContent:"center",width:26,height:26}}>
                      {renderCertIcon(cert, isEarned)}
                    </div>
                    <div style={{flex:1}}>
                      <div style={{fontSize:13,color:isEarned?cert.color:C.textDim,fontWeight:600,fontFamily:FONT}}>{cert.title}</div>
                      <div style={{fontSize:11,color:C.textDim,fontFamily:FONT,marginTop:2}}>{cert.desc}</div>
                    </div>
                    {isEarned && <IconCheck size={16} color={C.green} />}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
