import { useMemo } from "react";
import { TREATMENTS } from "../../data/treatments";
import { DIAGNOSTICS } from "../../data/diagnostics";

export function usePaletteItems({
  phase,
  query,
  setPhase,
  onClose,
  onSelectABCDE,
  handleOrderTests,
  orderedDiag = [],
  toggleTreatment,
  selTreat = [],
}) {
  return useMemo(() => {
    const isSim = phase === "order_tests" || phase === "awaiting_results" || phase === "diagnose";
    const q = query.trim().toLowerCase();
    const result = [];

    // 1. Navigation items
    const navItems = [
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
    navItems.forEach((n) => {
      if (!q || n.title.toLowerCase().includes(q) || n.sub.toLowerCase().includes(q)) {
        result.push(n);
      }
    });

    // 2. ABCDE Assessment (in simulation)
    if (isSim && onSelectABCDE) {
      const abcde = [
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
      abcde.forEach((a) => {
        if (!q || a.title.toLowerCase().includes(q) || a.sub.toLowerCase().includes(q)) {
          result.push(a);
        }
      });
    }

    // 3. Diagnostics items (in simulation)
    if (isSim && handleOrderTests) {
      DIAGNOSTICS.forEach((d) => {
        const title = d.name;
        const sub = d.desc || d.category || "Диагностический тест";
        const isOrdered = orderedDiag.includes(d.id);
        if (!q || title.toLowerCase().includes(q) || sub.toLowerCase().includes(q)) {
          result.push({
            id: `diag_${d.id}`,
            cat: "Диагностические исследования",
            title: `${title}${isOrdered ? " (✓ Выполнен)" : ""}`,
            sub: `${d.category || "Тест"} · ${sub}`,
            action: () => {
              if (!isOrdered) handleOrderTests([d.id]);
              onClose();
            },
          });
        }
      });
    }

    // 4. Treatments items (in simulation)
    if (isSim && toggleTreatment) {
      TREATMENTS.forEach((t) => {
        const title = t.name;
        const sub = t.category || "Фармакотерапия";
        const isApplied = selTreat.includes(t.id);
        if (!q || title.toLowerCase().includes(q) || sub.toLowerCase().includes(q)) {
          result.push({
            id: `treat_${t.id}`,
            cat: "Фармакотерапия и вмешательства",
            title: `${title}${isApplied ? " (✓ Назначен)" : ""}`,
            sub: `${t.category || "Препарат"} · Дозировка по протоколу`,
            action: () => {
              toggleTreatment(t.id);
              onClose();
            },
          });
        }
      });
    }

    return result;
  }, [
    phase,
    query,
    setPhase,
    onClose,
    onSelectABCDE,
    handleOrderTests,
    orderedDiag,
    toggleTreatment,
    selTreat,
  ]);
}
