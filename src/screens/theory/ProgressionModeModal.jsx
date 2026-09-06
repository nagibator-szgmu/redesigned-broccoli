import { FONT } from "../../ui/theme";
import { useTranslate } from "../../locale/useTranslate";

export default function ProgressionModeModal({ onChoose, C }) {
  const { t } = useTranslate();
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:9999}}>
      <div style={{background:C.panel,border:`1px solid ${C.border}`,borderRadius:18,padding:32,maxWidth:440,width:"90%",textAlign:"center"}}>
        <div style={{fontSize:40,marginBottom:16}}>📚</div>
        <div style={{fontSize:20,fontWeight:700,color:C.white,fontFamily:FONT,marginBottom:8}}>
          {t("theory.selectMode")}
        </div>
        <div style={{fontSize:13,color:C.textDim,fontFamily:FONT,marginBottom:24,lineHeight:1.6}}>
          {t("theory.selectModeDesc")}
        </div>
        <div style={{display:"flex",gap:10}}>
          <button onClick={() => onChoose("strict")}
            style={{flex:1,padding:"14px 12px",borderRadius:12,border:`1px solid ${C.accent}40`,background:`${C.accent}12`,color:C.accent,fontSize:14,fontWeight:600,fontFamily:FONT,cursor:"pointer",transition:"all 0.15s",display:"flex",flexDirection:"column",alignItems:"center",gap:6}}>
            <span style={{fontSize:22}}>🔒</span>
            <span>{t("theory.strictLabel")}</span>
            <span style={{fontSize:10,color:C.textDim,fontWeight:400}}>{t("theory.strictDesc")}</span>
          </button>
          <button onClick={() => onChoose("free")}
            style={{flex:1,padding:"14px 12px",borderRadius:12,border:`1px solid ${C.yellow}40`,background:`${C.yellow}12`,color:C.yellow,fontSize:14,fontWeight:600,fontFamily:FONT,cursor:"pointer",transition:"all 0.15s",display:"flex",flexDirection:"column",alignItems:"center",gap:6}}>
            <span style={{fontSize:22}}>📖</span>
            <span>{t("theory.freeLabel")}</span>
            <span style={{fontSize:10,color:C.textDim,fontWeight:400}}>{t("theory.freeDesc")}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
