import { PROTOCOLS } from "../data/protocols";

/** Get protocols related to a case */
export function getRelatedProtocols(caseId) {
  return Object.values(PROTOCOLS).filter(p => p.relatedCases.includes(caseId));
}
