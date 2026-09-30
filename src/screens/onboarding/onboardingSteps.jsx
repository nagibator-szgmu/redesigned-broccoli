import React from "react";
import {
  IconHospital,
  IconActivity,
  IconBed,
  IconPill,
  IconBook,
  IconTrophy,
  IconTrendingDown,
  IconClock,
} from "../../ui/icons";

export const STEPS = [
  {
    icon: <IconHospital size={36} color="#2563EB" />,
    titleKey: "onboarding.step1Title",
    titleDefault: "Добро пожаловать в МедСим",
    descKey: "onboarding.step1Desc",
    descDefault: "Клинический симулятор для тренировки принятия решений. 67 реальных случаев по 7 специальностям: кардиология, неврология, пульмонология, инфекции, эндокринология, токсикология, хирургия.",
  },
  {
    icon: <IconActivity size={36} color="#EF4444" />,
    titleKey: "onboarding.step2Title",
    titleDefault: "Как проходить случаи",
    descKey: "onboarding.step2Desc",
    descDefault: "1) Назначьте исследования → 2) Получите результаты → 3) Поставьте диагноз → 4) Назначьте лечение. В ОРИТ и Приёмном отделении время ограничено — пациент ухудшается с каждой секундой. В Поликлинике таймера нет.",
  },
  {
    icon: <IconBed size={36} color="#3B82F6" />,
    titleKey: "onboarding.step3Title",
    titleDefault: "Четыре отделения",
    descKey: "onboarding.step3Desc",
    descDefault: "В игре 4 отделения. ОРИТ — критический пациент, нужны немедленные решения. Приёмное — ваша цель не вылечить, а решить, куда направить (в стационар/домой/на операцию). Поликлиника — без таймера, приём в спокойном темпе, структурированный диагноз. Стационар — время идёт сутками, вы ведёте пациента день за днём.",
  },
  {
    icon: <IconPill size={36} color="#8B5CF6" />,
    titleKey: "onboarding.step4Title",
    titleDefault: "Лечение и диагностика",
    descKey: "onboarding.step4Desc",
    descDefault: "Назначайте только нужные препараты. Некоторые лекарства опасны при данной патологии — они нанесут вред пациенту и снизят ваш балл. Всегда проверяйте противопоказания.",
  },
  {
    icon: <IconBook size={36} color="#F59E0B" />,
    titleKey: "onboarding.step5Title",
    titleDefault: "Теория и обучение",
    descKey: "onboarding.step5Desc",
    descDefault: "Изучайте конспекты по 35 темам, проходите тесты и закрепляйте знания. Режим «Курс» помогает систематически освоить материал — темы разблокируются по порядку.",
  },
  {
    icon: <IconTrophy size={36} color="#F59E0B" />,
    titleKey: "onboarding.step6Title",
    titleDefault: "Оценка и прогресс",
    descKey: "onboarding.step6Desc",
    descDefault: "Балл зависит от диагноза, назначенных исследований, лечения и исхода пациента. Следите за статистикой в разделе «Достижения».",
  },
  {
    icon: <IconTrendingDown size={36} color="#EF4444" />,
    titleKey: "onboarding.step7Title",
    titleDefault: "Детериорация пациента",
    descKey: "onboarding.step7Desc",
    descDefault: "Каждые 30 секунд в ОРИТ и Приёмном отделении состояние пациента может ухудшаться: давление падает, пульс растёт, сатурация снижается. Если виталы упадут слишком низко — пациент погибнет. Действуйте быстро!",
  },
  {
    icon: <IconClock size={36} color="#10B981" />,
    titleKey: "onboarding.step8Title",
    titleDefault: "Задержка и непрерывное лечение",
    descKey: "onboarding.step8Desc",
    descDefault: "Препараты действуют не мгновенно — у каждого есть задержка (от 5 секунд до 5 минут). Кислород и интубация работают непрерывно, поддерживая пациента всё время. Назначайте лечение заранее!",
  },
];
