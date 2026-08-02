import { FONT, CODE } from "../ui/theme";
import { useTheme } from "../ui/ThemeContext";
import { useTranslate } from "../locale/useTranslate";
import { CASES } from "../data/cases";
import { TOPICS } from "../data/topics";
import useIsMobile from "../hooks/useIsMobile";
import { HeaderBackBtn } from "../ui/components";
import {
  IconCardiac, IconNeuro, IconRespiratory, IconInfectious,
  IconEndocrine, IconToxicology, IconAbdominal, IconTrophy,
  IconGraduationCap, IconStethoscope, IconTarget
} from "../ui/icons";

const CAT_META = {
  cardiac:{icon:<IconCardiac size={18} color="#ff3d5a" />,color:"#ff3d5a"},
  neuro:{icon:<IconNeuro size={18} color="#9d6ff5" />,color:"#9d6ff5"},
  respiratory:{icon:<IconRespiratory size={18} color="#00e5a0" />,color:"#00e5a0"},
  infectious:{icon:<IconInfectious size={18} color="#f57c42" />,color:"#f57c42"},
  endocrine:{icon:<IconEndocrine size={18} color="#f5c842" />,color:"#f5c842"},
  toxicology:{icon:<IconToxicology size={18} color="#f57c42" />,color:"#f57c42"},
  abdominal:{icon:<IconAbdominal size={18} color="#00e6c8" />,color:"#00e6c8"},
};

function aggregateStats(history) {
  const stats = {};
  for (const s of history) {
    if (!stats[s.category]) stats[s.category] = { played:0, totalScore:0, best:0, deaths:0 };
    const st = stats[s.category];
    st.played++;
    st.totalScore += s.score;
    st.best = Math.max(st.best, s.score);
    if (s.died) st.deaths++;
  }
  return stats;
}

function getGlobalRank(history) {
  if (history.length === 0) return null;
  const avg = history.reduce((a,s) => a + s.score, 0) / history.length;
  if (avg >= 90) return { title:"Элита",icon:<IconTrophy size={20} color="#f5c842" />,color:"#f5c842" };
  if (avg >= 75) return { title:"Опытный врач",icon:<IconStethoscope size={20} color="#00e6c8" />,color:"#00e6c8" };
  if (avg >= 60) return { title:"Ординатор",icon:<IconTarget size={20} color="#00e5a0" />,color:"#00e5a0" };
  if (avg >= 40) return { title:"Интерн",icon:<IconGraduationCap size={20} color="#f57c42" />,color:"#f57c42" };
  return { title:"Стажёр",icon:<IconGraduationCap size={20} color="#ff3d5a" />,color:"#ff3d5a" };
}

export default function LeaderboardScreen({ setPhase, sessionHistory }) {
  const C = useTheme();
  const isMobile = useIsMobile();
  const { t } = useTranslate();
  const rank = getGlobalRank(sessionHistory);
  const catStats = aggregateStats(sessionHistory);
  const totalCases = sessionHistory.length;
  const avgScore = totalCases ? Math.round(sessionHistory.reduce((a,s) => a + s.score, 0) / totalCases) : 0;
  const bestScore = totalCases ? Math.max(...sessionHistory.map(s => s.score)) : 0;
  const totalDeaths = sessionHistory.filter(s => s.died).length;
  const survivalRate = totalCases ? Math.round(((totalCases - totalDeaths) / totalCases) * 100) : 100;

  const topCases = [...sessionHistory].sort((a,b) => b.score - a.score).slice(0, 10);
  const uniqueCases = new Set(sessionHistory.map(s => s.caseId)).size;

  if (isMobile) return (
    <div style={{position:"fixed",inset:0,overflowY:"auto",background:C.bg,fontFamily:FONT}}>
      <div style={{background:C.panel,borderBottom:`1px solid ${C.border}`,padding:"10px 16px",display:"flex",alignItems:"center",gap:10,position:"sticky",top:0,zIndex:10}}>
        <div onClick={()=>setPhase("menu")} className="icon-btn" style={{width:26,height:26,background:`${C.accent}20`,border:`1px solid ${C.accent}44`,borderRadius:7,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>
          <span style={{fontFamily:"Georgia,serif",fontSize:13,color:C.accent,fontStyle:"italic",fontWeight:700}}>М</span>
        </div>
        <span style={{fontSize:14,fontWeight:700,color:C.white,fontFamily:FONT}}>🏆 Достижения</span>
        <div style={{flex:1}}/>
        <HeaderBackBtn onClick={() => setPhase("menu")} />
      </div>
      <div style={{padding:"14px 14px 80px"}}>
        {renderContent(C, rank, totalCases, avgScore, bestScore, survivalRate, catStats, topCases, uniqueCases, t, true, sessionHistory)}
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
        <span style={{fontSize:13,color:C.textDim,fontFamily:FONT}}>🏆 Достижения</span>
        <div style={{flex:1}}/>
        <HeaderBackBtn onClick={() => setPhase("menu")} />
      </div>
      <div style={{maxWidth:900,margin:"0 auto",padding:"24px 20px 80px"}}>
        {renderContent(C, rank, totalCases, avgScore, bestScore, survivalRate, catStats, topCases, uniqueCases, t, false, sessionHistory)}
      </div>
    </div>
  );
}

function getErrorAnalysis(history, t) {
  if (!history || history.length === 0) return null;
  const errors = [];
  const lowScoreSessions = history.filter(s => s.score < 70);

  // Find categories with low scores
  const catScores = {};
  history.forEach(s => {
    if (!catScores[s.category]) catScores[s.category] = { total: 0, count: 0 };
    catScores[s.category].total += s.score;
    catScores[s.category].count++;
  });

  const lowCats = [];
  Object.entries(catScores).forEach(([cat, data]) => {
    const avg = data.total / data.count;
    if (avg < 70) {
      lowCats.push({ cat, avg: Math.round(avg) });
    }
  });

  if (lowCats.length > 0) {
    const catLabels = lowCats.map(lc => t(`spec.${lc.cat}`)).join(", ");
    errors.push({
      type: "warning",
      title: "Слабые направления (балл < 70)",
      desc: `В категориях «${catLabels}» у вас низкая успеваемость. Повторите теоретический материал по этим разделам.`
    });
  }

  // Find specific failed cases and map to theory topics
  const failedCases = lowScoreSessions.slice(0, 3);
  failedCases.forEach(s => {
    const related = TOPICS.flatMap(cat =>
      cat.children.filter(t => t.cases.includes(s.caseId)).map(t => ({ name: t.name, id: t.id }))
    );
    if (related.length > 0) {
      errors.push({
        type: "info",
        title: `Рекомендация по случаю: ${s.caseName.split(" ").slice(0,2).join(" ")}`,
        desc: `Вы набрали ${s.score} б. Рекомендуется повторить главу теории «${related[0].name}».`
      });
    }
  });

  return errors;
}

function renderContent(C, rank, totalCases, avgScore, bestScore, survivalRate, catStats, topCases, uniqueCases, t, isMobile, sessionHistory) {
  const cardStyle = {background:C.panel,border:`1px solid ${C.border}`,borderRadius:isMobile?12:14,padding:isMobile?14:16,marginBottom:10};
  const sectionTitle = (icon,label,color=C.accent) => (
    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
      <span style={{fontSize:15}}>{icon}</span>
      <span style={{fontFamily:FONT,fontSize:11,letterSpacing:1,color,textTransform:"uppercase",fontWeight:600}}>{label}</span>
      <div style={{flex:1,height:1,background:`linear-gradient(90deg,${color}55,transparent)`}}/>
    </div>
  );

  const errors = getErrorAnalysis(sessionHistory, t);

  return (<>
    {/* Global rank */}
    {rank && (
      <div style={{...cardStyle,background:C.heroGrad,textAlign:"center",padding:isMobile?"20px 16px":"28px 24px",marginBottom:14}}>
        <div style={{fontSize:48,marginBottom:8}}>{rank.icon}</div>
        <div style={{fontSize:isMobile?20:24,fontWeight:700,color:rank.color,fontFamily:FONT,marginBottom:4}}>{rank.title}</div>
        <div style={{fontSize:12,color:C.heroText,fontFamily:FONT}}>Средний балл: {avgScore}/100</div>
      </div>
    )}

    {/* Stats grid */}
    <div style={{...cardStyle}}>
      {sectionTitle("📊","Общая статистика")}
      <div style={{display:"grid",gridTemplateColumns:isMobile?"repeat(2,1fr)":"repeat(4,1fr)",gap:isMobile?8:12}}>
        {[
          {v:totalCases,l:"Случаев",c:C.accent,icon:"🏥"},
          {v:`${avgScore}`,l:"Ср. балл",c:C.green,icon:"📈"},
          {v:`${bestScore}`,l:"Лучший",c:C.yellow,icon:"⭐"},
          {v:`${survivalRate}%`,l:"Выживаемость",c:survivalRate>80?C.green:survivalRate>50?C.yellow:C.red,icon:"💓"},
        ].map(({v,l,c,icon})=>(
          <div key={l} style={{background:C.btnBg,border:`1px solid ${C.btnBorder}`,borderRadius:isMobile?10:12,padding:isMobile?"10px 8px":"14px 10px",textAlign:"center"}}>
            <div style={{fontSize:isMobile?11:12,marginBottom:6}}>{icon}</div>
            <div style={{fontSize:isMobile?20:24,fontWeight:700,color:c,fontFamily:CODE,lineHeight:1}}>{v}</div>
            <div style={{fontSize:isMobile?9:10,color:C.textDim,fontFamily:FONT,marginTop:4,textTransform:"uppercase",letterSpacing:0.5}}>{l}</div>
          </div>
        ))}
      </div>
    </div>

    {/* Error Analysis */}
    {errors && errors.length > 0 && (
      <div style={{...cardStyle}}>
        {sectionTitle("🧠","Анализ ошибок и рекомендации", C.yellow)}
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {errors.map((err, idx) => (
            <div key={idx} style={{
              background: err.type === "warning" ? `${C.red}0d` : `${C.yellow}0d`,
              border: `1px solid ${err.type === "warning" ? `${C.red}3b` : `${C.yellow}2b`}`,
              borderRadius: 10,
              padding: "10px 14px",
              fontSize: 12.5,
              color: C.text,
              lineHeight: 1.6
            }}>
              <strong style={{color: err.type === "warning" ? C.red : C.yellow, display: "block", marginBottom: 3}}>{err.title}</strong>
              {err.desc}
            </div>
          ))}
        </div>
      </div>
    )}

    {/* Per-category progress */}
    <div style={{...cardStyle}}>
      {sectionTitle("🏥","Прогресс по специальностям")}
      {Object.entries(CAT_META).map(([cat,cm])=>{
        const st = catStats[cat];
        const catCases = CASES.filter(c => c.category === cat).length;
        const pct = catCases > 0 ? Math.round((st?.played||0)/catCases*100) : 0;
        const catAvg = st ? Math.round(st.totalScore / st.played) : 0;
        return (
          <div key={cat} style={{display:"flex",alignItems:"center",gap:isMobile?8:12,padding:isMobile?"7px 0":"9px 0",borderBottom:`1px solid ${C.border}22`}}>
            <span style={{fontSize:isMobile?16:18,width:28,textAlign:"center"}}>{cm.icon}</span>
            <div style={{flex:1,minWidth:0}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                <span style={{fontSize:isMobile?12:13,color:C.white,fontFamily:FONT,fontWeight:500}}>{t(`spec.${cat}`)}</span>
                <span style={{fontSize:isMobile?11:12,color:C.textDim,fontFamily:FONT}}>{st?.played||0}/{catCases}</span>
              </div>
              <div style={{height:5,background:`${C.border}`,borderRadius:3,overflow:"hidden"}}>
                <div style={{height:"100%",width:`${pct}%`,background:cm.color,borderRadius:3,transition:"width 0.5s ease"}}/>
              </div>
            </div>
            {st && <span style={{fontSize:isMobile?10:11,color:catAvg>=70?C.green:catAvg>=50?C.yellow:C.red,fontFamily:CODE,minWidth:32,textAlign:"right"}}>{catAvg}</span>}
          </div>
        );
      })}
    </div>

    {/* Top scores */}
    {topCases.length > 0 && (
      <div style={{...cardStyle}}>
        {sectionTitle("🥇","Лучшие результаты")}
        {topCases.map((s,i) => {
          const cm = CAT_META[s.category]||{icon:"🏥",color:C.accent};
          const medal = i===0?"🥇":i===1?"🥈":i===2?"🥉":`${i+1}`;
          return (
            <div key={s.id} style={{display:"flex",alignItems:"center",gap:isMobile?8:12,padding:isMobile?"7px 0":"8px 0",borderBottom:i<topCases.length-1?`1px solid ${C.border}22`:"none"}}>
              <span style={{fontSize:isMobile?14:16,width:28,textAlign:"center",fontFamily:CODE}}>{medal}</span>
              <span style={{fontSize:14}}>{cm.icon}</span>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:isMobile?12:13,color:C.white,fontFamily:FONT,fontWeight:500,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{s.caseName}</div>
                <div style={{fontSize:isMobile?10:11,color:C.textDim,fontFamily:FONT,marginTop:1}}>{new Date(s.date).toLocaleDateString("ru-RU",{day:"numeric",month:"short"})}</div>
              </div>
              <span style={{fontSize:isMobile?15:17,fontWeight:700,color:s.score>=85?C.green:s.score>=70?C.accent:s.score>=50?C.yellow:C.red,fontFamily:CODE}}>{s.score}</span>
            </div>
          );
        })}
      </div>
    )}

    {/* Unique cases explored */}
    <div style={{...cardStyle,textAlign:"center",padding:isMobile?"16px":"20px"}}>
      <div style={{fontSize:isMobile?13:14,color:C.textDim,fontFamily:FONT,marginBottom:6}}>Уникальных случаев пройдено</div>
      <div style={{fontSize:isMobile?28:32,fontWeight:700,color:C.accent,fontFamily:CODE}}>{uniqueCases}<span style={{fontSize:isMobile?14:16,color:C.textDim}}>/{CASES.length}</span></div>
    </div>
  </>);
}
