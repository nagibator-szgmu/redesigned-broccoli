import { CASE_NASH } from "./outpatientGastroNashCase.js";
import { CASE_CHRONIC_PANCREATITIS } from "./outpatientGastroPancreatitisCase.js";

/**
 * Вторая очередь амбулаторных сценариев гастроэнтерологии (Часть 2A):
 * 1. outp_gastro_nash (НАЖБП, стеатогепатит)
 * 2. outp_gastro_chronic_pancreatitis (Хронический панкреатит)
 */
export const OUTPATIENT_GASTRO_PART2A_CASES = [
  CASE_NASH,
  CASE_CHRONIC_PANCREATITIS,
];
