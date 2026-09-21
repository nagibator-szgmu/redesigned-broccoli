export function getNavPaletteItems(setPhase, onClose) {
  return [
    {
      id: "nav_menu",
      cat: "Навигация",
      title: "Главное меню",
      sub: "Перейти к выбору кейсов",
      action: () => {
        setPhase("menu");
        onClose();
      },
    },
    {
      id: "nav_theory",
      cat: "Навигация",
      title: "Клинические протоколы и теория",
      sub: "35 конспектов по КР Минздрава",
      action: () => {
        setPhase("theory");
        onClose();
      },
    },
    {
      id: "nav_leaderboard",
      cat: "Навигация",
      title: "Достижения и статистика",
      sub: "Портфолио и баллы",
      action: () => {
        setPhase("leaderboard");
        onClose();
      },
    },
    {
      id: "nav_map",
      cat: "Навигация",
      title: "Карта курса и специализаций",
      sub: "Дерево клинических тем",
      action: () => {
        setPhase("map");
        onClose();
      },
    },
  ];
}

export function getAbcdePaletteItems(onSelectABCDE, onClose) {
  return [
    {
      id: "abcde_a",
      cat: "Осмотр ABCDE",
      title: "A — Airway (Дыхательные пути)",
      sub: "Проходимость ВДП, стридор",
      action: () => {
        onSelectABCDE("A");
        onClose();
      },
    },
    {
      id: "abcde_b",
      cat: "Осмотр ABCDE",
      title: "B — Breathing (Дыхание)",
      sub: "Аускультация, ЧДД, SpO2",
      action: () => {
        onSelectABCDE("B");
        onClose();
      },
    },
    {
      id: "abcde_c",
      cat: "Осмотр ABCDE",
      title: "C — Circulation (Кровообращение)",
      sub: "Пульс, АД, капиллярный ответ",
      action: () => {
        onSelectABCDE("C");
        onClose();
      },
    },
    {
      id: "abcde_d",
      cat: "Осмотр ABCDE",
      title: "D — Disability (Неврология)",
      sub: "Шкала Глазго, зрачки, глюкоза",
      action: () => {
        onSelectABCDE("D");
        onClose();
      },
    },
    {
      id: "abcde_e",
      cat: "Осмотр ABCDE",
      title: "E — Exposure (Осмотр тела)",
      sub: "Температура, сыпь, живот, травмы",
      action: () => {
        onSelectABCDE("E");
        onClose();
      },
    },
  ];
}
