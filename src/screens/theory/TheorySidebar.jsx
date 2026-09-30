import { FONT_HEADING, FONT_BODY } from "../../ui/theme";
import { useTranslate } from "../../locale/useTranslate";
import { HeaderBackBtn } from "../../ui/components";
import { TOPICS } from "../../data/topics";
import { DRUG_GROUPS } from "../../data/drugReference";
import { PROTOCOLS } from "../../data/protocols";
import {
  IconPill,
  IconClipboard,
  IconScale,
  IconCardiac,
  IconNeuro,
  IconRespiratory,
  IconInfectious,
  IconFileText,
} from "../../ui/icons";
import TheorySidebarTopics from "./TheorySidebarTopics";

const PROTOCOL_ICONS = {
  cardiac: IconCardiac,
  respiratory: IconRespiratory,
  infectious: IconInfectious,
  neuro: IconNeuro,
};

export default function TheorySidebar({
  activeItem, onSelect, setPhase, progressionMode, setProgressionMode,
  progress, expandedCats, toggleCat, calculators, C
}) {
  const { t } = useTranslate();

  return (
    <>
      <HeaderBackBtn
        onClick={() => setPhase("menu")}
        label={t("theory.back")}
        style={{ display: "flex", width: "100%", boxSizing: "border-box", padding: "10px 12px", marginBottom: 18 }}
      />

      {progress && (
        <div style={{ marginBottom: 14, padding: "8px 10px", background: progressionMode === "strict" ? `${C.accent}10` : `${C.yellow}10`, border: `1px solid ${progressionMode === "strict" ? `${C.accent}33` : `${C.yellow}33`}`, borderRadius: 8 }}>
          <div onClick={() => setProgressionMode(v => v === "strict" ? "free" : "strict")} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}>
            <span style={{ fontSize: 11, color: progressionMode === "strict" ? C.accent : C.yellow, fontWeight: 600, fontFamily: FONT_HEADING }}>
              {progressionMode === "strict" ? t("theory.course") : t("theory.free")}
            </span>
            <div style={{ width: 32, height: 18, borderRadius: 9, background: progressionMode === "strict" ? C.accent : `${C.textDim}30`, position: "relative", transition: "background 0.2s" }}>
              <div style={{ width: 14, height: 14, borderRadius: "50%", background: "#fff", position: "absolute", top: 2, left: progressionMode === "strict" ? 16 : 2, transition: "left 0.2s" }} />
            </div>
          </div>
          <div style={{ fontSize: 9, color: C.textDim, fontFamily: FONT_BODY, marginTop: 4 }}>
            {progressionMode === "strict" ? t("theory.courseDesc") : t("theory.freeDescShort")}
          </div>
        </div>
      )}

      <div style={{ fontSize: 10, color: C.textDim, letterSpacing: 1.5, padding: "0 10px", marginBottom: 6, fontFamily: FONT_HEADING, fontWeight: 600 }}>
        {t("theory.sectionTitle")}
      </div>
      <TheorySidebarTopics
        topics={TOPICS}
        expandedCats={expandedCats}
        toggleCat={toggleCat}
        progress={progress}
        progressionMode={progressionMode}
        activeItem={activeItem}
        onSelect={onSelect}
        C={C}
      />

      <div style={{ fontSize: 10, color: C.textDim, letterSpacing: 1.5, padding: "0 10px", margin: "18px 0 6px", fontFamily: FONT_HEADING, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
        <IconPill size={13} color={C.textDim} />
        <span>{t("theory.drugs")}</span>
      </div>
      {DRUG_GROUPS.map((group) => {
        const isActive = activeItem.type === "drug" && activeItem.id === group.id;
        return (
          <div key={group.id} onClick={() => onSelect("drug", group.id)} className="nav-item"
            style={{
              display: "flex", alignItems: "center", gap: 8, padding: "7px 12px 7px 18px", borderRadius: 10,
              marginBottom: 2, cursor: "pointer", background: isActive ? C.accentDim : "transparent",
              border: `1px solid ${isActive ? `${C.accent}33` : "transparent"}`,
            }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: group.color, flexShrink: 0 }} />
            <span style={{ fontSize: 12, fontFamily: FONT_BODY, color: isActive ? C.accent : C.text, fontWeight: isActive ? 600 : 400 }}>
              {group.name}
            </span>
          </div>
        );
      })}

      <div style={{ fontSize: 10, color: C.textDim, letterSpacing: 1.5, padding: "0 10px", margin: "18px 0 6px", fontFamily: FONT_HEADING, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
        <IconClipboard size={13} color={C.textDim} />
        <span>{t("theory.protocols")}</span>
      </div>
      {Object.values(PROTOCOLS).map((proto) => {
        const isActive = activeItem.type === "protocol" && activeItem.id === proto.id;
        const ProtoIcon = PROTOCOL_ICONS[proto.iconKey] || IconFileText;
        return (
          <div key={proto.id} onClick={() => onSelect("protocol", proto.id)} className="nav-item"
            style={{
              display: "flex", alignItems: "center", gap: 8, padding: "7px 12px 7px 18px", borderRadius: 10,
              marginBottom: 2, cursor: "pointer", background: isActive ? C.accentDim : "transparent",
              border: `1px solid ${isActive ? `${C.accent}33` : "transparent"}`,
            }}>
            <ProtoIcon size={14} color={isActive ? C.accent : (proto.color || C.textDim)} />
            <span style={{ fontSize: 12, fontFamily: FONT_BODY, color: isActive ? C.accent : C.text, fontWeight: isActive ? 600 : 400 }}>
              {proto.name.split("—")[0].trim()}
            </span>
          </div>
        );
      })}

      <div style={{ fontSize: 10, color: C.textDim, letterSpacing: 1.5, padding: "0 10px", margin: "18px 0 6px", fontFamily: FONT_HEADING, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
        <IconScale size={13} color={C.textDim} />
        <span>{t("theory.calculators") || "Калькуляторы"}</span>
      </div>
      {calculators.map((calc) => {
        const isActive = activeItem.type === "calc" && activeItem.id === calc.id;
        const IconComp = calc.icon;
        return (
          <div key={calc.id} onClick={() => onSelect("calc", calc.id)} className="nav-item"
            style={{
              display: "flex", alignItems: "center", gap: 8, padding: "7px 12px 7px 18px", borderRadius: 10,
              marginBottom: 2, cursor: "pointer", background: isActive ? C.accentDim : "transparent",
              border: `1px solid ${isActive ? `${C.accent}33` : "transparent"}`,
            }}>
            <span style={{ color: isActive ? C.accent : C.textDim }}><IconComp size={14} /></span>
            <span style={{ fontSize: 12, fontFamily: FONT_BODY, color: isActive ? C.accent : C.text, fontWeight: isActive ? 600 : 400 }}>
              {calc.name}
            </span>
          </div>
        );
      })}
    </>
  );
}
