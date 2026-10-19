import { THERAPEUTIC_NEW_CASES_PART_A } from "./therapeuticNewCasesPartA.js";
import { THERAPEUTIC_NEW_CASES_PART_B } from "./therapeuticNewCasesPartB.js";

/**
 * Новые терапевтические амбулаторные кейсы для 6 курса (терапия/гастроэнтерология)
 * Созданы по рекомендациям клин. фармакологов и кафедры терапии:
 * 1. outp_gastro_anemia (Атрофический гастрит + ЖДА)
 * 2. outp_gastro_celiac (Целиакия, Marsh 3b)
 * 3. outp_gastro_gerd (ГЭРБ, Los Angeles B + кашель)
 */
export const THERAPEUTIC_NEW_CASES = [
  ...THERAPEUTIC_NEW_CASES_PART_A,
  ...THERAPEUTIC_NEW_CASES_PART_B,
];
