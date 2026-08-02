import { useState, useEffect, useCallback } from "react";
import { TOPICS } from "../data/topics";

const STORAGE_KEY = "ms_progress";
const CASES_PER_TOPIC = 3;

function loadProgress() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch { return {}; }
}

function saveProgress(data) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }
  catch { /* ignore */ }
}

/**
 * Check if topic is completed (all available cases + quiz passed).
 * FR-А.3: if a topic has < CASES_PER_TOPIC cases, completing all available
 * counts as complete — prevents permanent lockout on under-populated topics.
 * @param {Object} topicProgress - progress for this topic
 * @param {number} totalCasesInTopic - total cases available for this topic
 * @returns {boolean}
 */
function isTopicComplete(topicProgress, totalCasesInTopic) {
  if (!topicProgress) return false;
  const casesDone = (topicProgress.completedCases || []).length;
  const required = Math.min(CASES_PER_TOPIC, totalCasesInTopic);
  return casesDone >= required && topicProgress.quizPassed;
}

/**
 * Get flat list of all topics sorted by order
 * @returns {Array} all topics with category info
 */
function getAllTopicsFlat() {
  return TOPICS.flatMap(cat =>
    cat.children.map(t => ({ ...t, categoryId: cat.id, categoryName: cat.name, categoryIcon: cat.icon }))
  ).sort((a, b) => a.order - b.order);
}

/**
 * Check if a topic is unlocked based on progression mode
 * @param {string} topicId
 * @param {string} mode - 'strict' | 'free'
 * @param {Object} topicsProgress - all topics progress
 * @returns {boolean}
 */
function isTopicUnlocked(topicId, mode, topicsProgress) {
  if (mode === "free") return true;
  const allTopics = getAllTopicsFlat();
  const idx = allTopics.findIndex(t => t.id === topicId);
  if (idx <= 0) return true;
  const prevTopic = allTopics[idx - 1];
  return isTopicComplete(topicsProgress[prevTopic.id], prevTopic.cases.length);
}

export default function useProgress() {
  const [topicsProgress, setTopicsProgress] = useState(() => loadProgress().topics || {});
  const [curriculum, setCurriculum] = useState(() => loadProgress().curriculum || null);

  useEffect(() => { saveProgress({ topics: topicsProgress, curriculum }); }, [topicsProgress, curriculum]);

  /** Record a case completion for a topic */
  const completeCase = useCallback((topicId, caseId) => {
    setTopicsProgress(prev => {
      const tp = prev[topicId] || { completedCases: [], quizPassed: false, quizScore: null };
      if (tp.completedCases.includes(caseId)) return prev;
      return { ...prev, [topicId]: { ...tp, completedCases: [...tp.completedCases, caseId] } };
    });
  }, []);

  /** Record quiz result for a topic — clear curriculum if passed */
  const completeQuiz = useCallback((topicId, passed, score) => {
    setTopicsProgress(prev => ({
      ...prev,
      [topicId]: {
        ...(prev[topicId] || { completedCases: [], quizPassed: false, quizScore: null }),
        quizPassed: passed,
        quizScore: score,
      },
    }));
    if (passed) setCurriculum(null);
  }, []);

  /** Start curriculum for a topic — pick up to CASES_PER_TOPIC remaining cases. Returns first case ID to play. */
  const startCurriculum = useCallback((topicId) => {
    const topic = TOPICS.flatMap(c => c.children).find(t => t.id === topicId);
    if (!topic) return null;
    const progress = topicsProgress[topicId] || { completedCases: [] };
    const remaining = topic.cases.filter(id => !progress.completedCases.includes(id));
    const shuffled = [...remaining].sort(() => Math.random() - 0.5);
    const maxCases = Math.min(CASES_PER_TOPIC, shuffled.length);
    const queue = shuffled.slice(0, maxCases);
    if (queue.length === 0) {
      setCurriculum({ topicId, caseQueue: [], quizPending: true });
      return null;
    } else {
      setCurriculum({ topicId, caseQueue: queue.slice(1), quizPending: false });
      return queue[0];
    }
  }, [topicsProgress]);

  /** Advance curriculum — remove first case from queue */
  const advanceCurriculum = useCallback(() => {
    setCurriculum(prev => {
      if (!prev) return null;
      const [, ...rest] = prev.caseQueue;
      if (rest.length === 0) return { ...prev, caseQueue: [], quizPending: true };
      return { ...prev, caseQueue: rest, quizPending: false };
    });
  }, []);

  /** Get next case ID from curriculum queue, or null */
  const getNextCurriculumCase = useCallback(() => {
    if (!curriculum || curriculum.caseQueue.length === 0) return null;
    return curriculum.caseQueue[0];
  }, [curriculum]);

  /** Clear curriculum state */
  const clearCurriculum = useCallback(() => { setCurriculum(null); }, []);

  /** Get the next topic in the global order (or null if last). Skips already-complete topics. */
  const getNextCurriculumTopic = useCallback((topicId) => {
    const allTopics = getAllTopicsFlat();
    const idx = allTopics.findIndex(t => t.id === topicId);
    if (idx < 0 || idx >= allTopics.length - 1) return null;
    for (let i = idx + 1; i < allTopics.length; i++) {
      const next = allTopics[i];
      if (!isTopicComplete(topicsProgress[next.id], next.cases.length)) return next;
    }
    return null;
  }, [topicsProgress]);

  /** Get progress stats for a category */
  const getCategoryProgress = useCallback((categoryId) => {
    const cat = TOPICS.find(c => c.id === categoryId);
    if (!cat) return { total: 0, completed: 0 };
    const total = cat.children.length;
    const completed = cat.children.filter(t => isTopicComplete(topicsProgress[t.id], t.cases.length)).length;
    return { total, completed };
  }, [topicsProgress]);

  /** Get progress for a specific topic */
  const getTopicProgress = useCallback((topicId) => {
    return topicsProgress[topicId] || { completedCases: [], quizPassed: false, quizScore: null };
  }, [topicsProgress]);

  return {
    topicsProgress,
    curriculum,
    isTopicComplete: (topicId) => {
      const topic = TOPICS.flatMap(c => c.children).find(t => t.id === topicId);
      return isTopicComplete(topicsProgress[topicId], topic ? topic.cases.length : 3);
    },
    isTopicUnlocked: (topicId, mode) => isTopicUnlocked(topicId, mode, topicsProgress),
    getTopicProgress,
    getCategoryProgress,
    completeCase,
    completeQuiz,
    startCurriculum,
    advanceCurriculum,
    getNextCurriculumCase,
    getNextCurriculumTopic,
    clearCurriculum,
  };
}
