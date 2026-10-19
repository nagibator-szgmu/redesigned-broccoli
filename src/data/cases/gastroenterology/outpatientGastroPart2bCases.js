import { CASE_FUNCTIONAL_DYSPEPSIA } from "./outpatientGastroDyspepsiaCase.js";
import { CASE_UC_MILD } from "./outpatientGastroUcCase.js";

/**
 * Вторая очередь амбулаторных сценариев гастроэнтерологии (Часть 2B):
 * 1. outp_gastro_functional_dyspepsia (Функциональная диспепсия, ППДС)
 * 2. outp_gastro_uc_mild (Язвенный колит, легкая степень)
 */
export const OUTPATIENT_GASTRO_PART2B_CASES = [
  CASE_FUNCTIONAL_DYSPEPSIA,
  CASE_UC_MILD,
];
