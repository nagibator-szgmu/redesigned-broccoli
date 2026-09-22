import { useState, useMemo, useCallback } from "react";
import { buildNotifications } from "../screens/menu/menuUtils";

/**
 * Hook for managing menu notifications with pin, delete, and read state persistence.
 * @param {Array} sessionHistory
 * @param {number} casesPlayed
 * @param {number} totalScore
 * @param {Function} t
 * @param {Record<string, any>} catMeta
 */
export function useNotifications(sessionHistory, casesPlayed, totalScore, t, catMeta) {
  const [readNotifIds, setReadNotifIds] = useState(() => {
    try {
      return new Set(JSON.parse(localStorage.getItem("ms_readNotifs") || "[]"));
    } catch {
      return new Set();
    }
  });

  const [pinnedNotifIds, setPinnedNotifIds] = useState(() => {
    try {
      return new Set(JSON.parse(localStorage.getItem("ms_pinnedNotifs") || "[]"));
    } catch {
      return new Set();
    }
  });

  const [deletedNotifIds, setDeletedNotifIds] = useState(() => {
    try {
      return new Set(JSON.parse(localStorage.getItem("ms_deletedNotifs") || "[]"));
    } catch {
      return new Set();
    }
  });

  const togglePinNotif = useCallback((id) => {
    setPinnedNotifIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      localStorage.setItem("ms_pinnedNotifs", JSON.stringify([...next]));
      return next;
    });
  }, []);

  const deleteNotif = useCallback((id) => {
    setDeletedNotifIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      localStorage.setItem("ms_deletedNotifs", JSON.stringify([...next]));
      return next;
    });
  }, []);

  const allNotifications = useMemo(() => {
    return buildNotifications(sessionHistory, casesPlayed, totalScore, t, catMeta);
  }, [sessionHistory, casesPlayed, totalScore, t, catMeta]);

  const notifications = useMemo(() => {
    return allNotifications
      .filter((n) => !deletedNotifIds.has(n.id))
      .sort((a, b) => {
        const aPinned = pinnedNotifIds.has(a.id) ? 1 : 0;
        const bPinned = pinnedNotifIds.has(b.id) ? 1 : 0;
        return bPinned - aPinned;
      });
  }, [allNotifications, deletedNotifIds, pinnedNotifIds]);

  const unreadCount = useMemo(() => {
    return notifications.filter((n) => !readNotifIds.has(n.id)).length;
  }, [notifications, readNotifIds]);

  const markAllRead = useCallback(() => {
    setReadNotifIds((prev) => {
      const next = new Set([...prev, ...notifications.map((n) => n.id)]);
      localStorage.setItem("ms_readNotifs", JSON.stringify([...next]));
      return next;
    });
  }, [notifications]);

  return {
    notifications,
    unreadCount,
    readNotifIds,
    setReadNotifIds,
    pinnedNotifIds,
    togglePinNotif,
    deleteNotif,
    markAllRead,
  };
}
