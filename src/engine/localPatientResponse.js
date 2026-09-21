export function getLocalPatientResponse(q, cd, ps) {
  const query = q.toLowerCase();
  const currentPain = ps?.pain ?? 5;
  const currentSpo2 = ps?.spo2 ?? 98;

  if (/(боль|болит|жжет|давит|режет|pain|hurt)/.test(query)) {
    if (currentPain <= 3) {
      return "Мне гораздо лучше, доктор. Боль почти прошла, спасибо!";
    }
  }

  if (/(дышать|одышк|воздух|задых|breathe)/.test(query)) {
    if (currentSpo2 >= 95 && cd.complaint.toLowerCase().includes("одыш")) {
      return "Дышать стало намного легче, доктор. Спасибо, воздух проходит хорошо.";
    }
  }
  
  if (/(болит|боль|беспокоит|жалоб|плохо|тошнит|рвот|слабость|кружится|дышать|задыхаюсь|сердце|груди|живот|голова|нога|рука|спина|complaint|dizzy|nausea)/.test(query)) {
    return cd.complaint;
  }
  if (/(когда|началось|давно|как долго|время|часов|минут|вчера|сегодня|дней|начало|when|start|since|ago|yesterday|time)/.test(query)) {
    return cd.shortHistory || cd.anamnesis;
  }
  if (/(хроническ|болезн|лекарств|таблет|принимаете|аллерг|операци|давление|раньше|родители|наследствен|препарат|chronic|allergy|medication|drug|illness|history)/.test(query)) {
    return cd.anamnesis;
  }
  if (/(зрач|глаза|кож|цвет|живот|пальпац|пульс|послушать|легкие|дыхание|осмотр|look|eyes|skin|color|pulse|listen|exam)/.test(query)) {
    return cd.exam;
  }

  return `Доктор, мне тяжело говорить, мысли путаются. Главное, что меня беспокоит: ${cd.complaint.split(".")[0]}.`;
}
