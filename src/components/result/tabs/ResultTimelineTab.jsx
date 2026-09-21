import React from "react";
import { EventLog } from "../index";

/**
 * ResultTimelineTab — Вкладка «Хронология действий».
 * 
 * Отображает пошаговый лог действий врача, времени назначений
 * и динамики изменения состояния пациента.
 */
export default function ResultTimelineTab({
  eventLog,
  isMobile,
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <EventLog eventLog={eventLog} isMobile={isMobile} />
    </div>
  );
}
