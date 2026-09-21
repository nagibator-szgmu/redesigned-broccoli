import { formatTimeSCORM12, formatTimeSCORM2004 } from "./scormUtils";

export function writeScormScore(setFn, version, rawScore, maxScore = 100, minScore = 0) {
  setFn("cmi.core.score.raw", "cmi.score.raw", rawScore);
  setFn("cmi.core.score.max", "cmi.score.max", maxScore);
  setFn("cmi.core.score.min", "cmi.score.min", minScore);

  if (version === "2004") {
    const scaled = Math.max(0, Math.min(1, rawScore / (maxScore || 100)));
    setFn(null, "cmi.score.scaled", scaled.toFixed(2));
  }
}

export function writeScormStatus(setFn, version, status) {
  if (version === "2004") {
    if (status === "passed" || status === "failed") {
      setFn(null, "cmi.success_status", status);
      setFn(null, "cmi.completion_status", "completed");
    } else if (status === "completed") {
      setFn(null, "cmi.completion_status", "completed");
    } else {
      setFn(null, "cmi.completion_status", "incomplete");
    }
  } else {
    setFn("cmi.core.lesson_status", null, status);
  }
}

export function writeScormSessionTime(setFn, version, elapsedSeconds) {
  const formattedTime =
    version === "2004"
      ? formatTimeSCORM2004(elapsedSeconds)
      : formatTimeSCORM12(elapsedSeconds);
  setFn("cmi.core.session_time", "cmi.session_time", formattedTime);
}

export function writeScormSuspendData(setFn, version, data, logger) {
  try {
    const serialized = JSON.stringify(data);
    const limit = version === "2004" ? 64000 : 4096;
    if (serialized.length > limit) {
      logger?.error(`Превышен лимит suspend_data (${serialized.length} > ${limit} символов)`);
      return false;
    }
    return setFn("cmi.suspend_data", "cmi.suspend_data", serialized);
  } catch (e) {
    logger?.error("Ошибка при сохранении suspend_data:", e);
    return false;
  }
}

export function readScormSuspendData(getFn, logger) {
  const raw = getFn("cmi.suspend_data", "cmi.suspend_data");
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (e) {
    logger?.error("Ошибка парсинга suspend_data:", e);
    return null;
  }
}

export function readScormMasteryScore(getFn, version) {
  if (version === "2004") {
    const val = getFn(null, "cmi.scaled_passing_score");
    if (val) return parseFloat(val) * 100;
  } else {
    const val = getFn("cmi.student_data.mastery_score", null);
    if (val) return parseFloat(val);
  }
  return null;
}
