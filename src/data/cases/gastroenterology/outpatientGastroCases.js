import { CASE_CHOLELITHIASIS } from "./outpatientGastroPart1aCases.js";
import { CASE_IBS_DIARRHEA } from "./outpatientGastroPart1bCases.js";

/**
 * Первая очередь амбулаторных сценариев гастроэнтерологии:
 * 1. outp_gastro_cholelithiasis (ЖКБ, билиарная колика)
 * 2. outp_gastro_ibs_diarrhea (СРК с преобладанием диареи)
 */
export const OUTPATIENT_GASTRO_NEW_CASES = [
  CASE_CHOLELITHIASIS,
  CASE_IBS_DIARRHEA,
];
