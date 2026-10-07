import { OUTPATIENT_GASTRO_PART2A_CASES } from "./outpatientGastroPart2aCases.js";
import { OUTPATIENT_GASTRO_PART2B_CASES } from "./outpatientGastroPart2bCases.js";

/**
 * Вторая очередь амбулаторных сценариев гастроэнтерологии для MedSim:
 * 1. outp_gastro_nash (НАЖБП, стеатогепатит низкой активности)
 * 2. outp_gastro_chronic_pancreatitis (Хронический панкреатит в стадии ремиссии)
 * 3. outp_gastro_functional_dyspepsia (Функциональная диспепсия, ППДС)
 * 4. outp_gastro_uc_mild (Язвенный колит, лёгкая степень)
 */
export const OUTPATIENT_GASTRO_PART2_CASES = [
  ...OUTPATIENT_GASTRO_PART2A_CASES,
  ...OUTPATIENT_GASTRO_PART2B_CASES,
];
