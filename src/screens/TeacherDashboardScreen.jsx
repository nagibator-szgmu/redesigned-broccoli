import React, { useState, useMemo } from "react";
import { useTheme } from "../ui/ThemeContext";
import { FONT, CODE } from "../ui/theme";
import useIsMobile from "../hooks/useIsMobile";
import { generateMockStudentsData, formatRealSessionsToStudents } from "../engine/cognitiveAnalyzer";
import { getUserAvatar } from "./menu/AccountModal";
import StudentList from "../components/dashboard/StudentList";
import ErrorHeatmap from "../components/dashboard/ErrorHeatmap";
import AttemptDetails from "../components/dashboard/AttemptDetails";
import DashboardHeader from "../components/dashboard/DashboardHeader";

export default function TeacherDashboardScreen({ setPhase, sessionHistory = [] }) {
  const C = useTheme();
  const isMobile = useIsMobile(768);

  const realCount = sessionHistory.length;
  const [selectedGroup, setSelectedGroup] = useState(() => (realCount > 0 ? "real" : "real"));
  const [activeTab, setActiveTab] = useState("students");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedAttempt, setSelectedAttempt] = useState(null);
  const [toast, setToast] = useState(null);

  // Имя текущего профиля для привязки к реальной сессии
  const currentAvatar = useMemo(() => getUserAvatar(), []);
  const realUserName = `${currentAvatar.label} (${currentAvatar.role})`;

  // Подготавливаем реальные и демо-данные
  const realStudents = useMemo(() => {
    return formatRealSessionsToStudents(sessionHistory, realUserName);
  }, [sessionHistory, realUserName]);

  const mockStudents = useMemo(() => generateMockStudentsData(), []);

  // Активный список студентов в зависимости от выбранного источника
  const students = useMemo(() => {
    if (selectedGroup === "real") {
      return realStudents;
    }
    return mockStudents;
  }, [selectedGroup, realStudents, mockStudents]);

  // Суммарная статистика
  const stats = useMemo(() => {
    if (!students || students.length === 0) {
      return { totalPlayed: 0, avgScore: 0, totalCritErrors: 0 };
    }
    const totalPlayed = students.reduce((acc, s) => acc + s.casesPlayed, 0);
    const sumScore = students.reduce((acc, s) => acc + (s.avgScore * s.casesPlayed), 0);
    const avgScore = totalPlayed > 0 ? Math.round(sumScore / totalPlayed) : 0;
    
    let totalCritErrors = 0;
    students.forEach(s => {
      s.history.forEach(h => {
        if (h.criticalErrorsCount > 0) totalCritErrors += h.criticalErrorsCount;
      });
    });

    return { totalPlayed, avgScore, totalCritErrors };
  }, [students]);

  // Функция экспорта отчёта в CSV
  const handleExport = () => {
    if (students.length === 0) {
      setToast("Нет данных для экспорта отчёта");
      setTimeout(() => setToast(null), 3000);
      return;
    }

    const isReal = selectedGroup === "real";
    const headers = ["ФИО / Профиль", "Группа", "Кейсов решено", "Средний балл", "Точность %", "Тип данных"];
    const rows = students.map(s => [
      `"${s.name}"`,
      `"${isReal ? 'Реальные прохождения' : selectedGroup}"`,
      s.casesPlayed,
      s.avgScore,
      `"${s.accuracy || 90}%"`,
      `"${isReal ? 'Реальные сессии' : 'Демонстрационные'}"`
    ]);

    const csvContent = "\uFEFF" + [headers.join(";"), ...rows.map(r => r.join(";"))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `medsim_report_${isReal ? "real_sessions" : selectedGroup}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setToast(`Отчёт (${isReal ? "Реальные данные" : selectedGroup}) успешно сохранён в CSV!`);
    setTimeout(() => setToast(null), 3500);
  };

  return (
    <div style={{
      minHeight: "100dvh",
      background: C.bgGrad,
      color: C.white,
      fontFamily: FONT,
      padding: isMobile ? "16px 12px 60px" : "24px 32px",
      boxSizing: "border-box"
    }}>
      {/* Header and Summary Stats */}
      <DashboardHeader 
        selectedGroup={selectedGroup}
        setSelectedGroup={setSelectedGroup}
        stats={stats}
        realCount={realCount}
        onExport={handleExport}
        onBack={() => setPhase("menu")}
      />

      {/* Mode Indicator Banner */}
      <div style={{
        background: selectedGroup === "real" ? `${C.accent}12` : "rgba(255,255,255,0.02)",
        border: `1px solid ${selectedGroup === "real" ? `${C.accent}44` : C.border}`,
        borderRadius: 12,
        padding: "10px 16px",
        marginBottom: 20,
        display: "flex",
        alignItems: "center",
        justify: "space-between",
        gap: 12,
        flexWrap: "wrap"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
          <span style={{ fontSize: 16 }}>{selectedGroup === "real" ? "🟢" : "⚙️"}</span>
          <span style={{ color: C.white }}>
            Режим отчёта: <strong>{selectedGroup === "real" ? "Реальные прохождения симуляций" : `Демонстрационная группа ${selectedGroup}`}</strong>
          </span>
        </div>
        <div style={{ fontSize: 12, color: C.textDim, fontFamily: CODE }}>
          {selectedGroup === "real" ? `Найдено ${realCount} реальных прохождений` : "Сгенерированные тестовые данные"}
        </div>
      </div>

      {/* Tabs Menu */}
      <div style={{ display: "flex", borderBottom: `1px solid ${C.border}`, marginBottom: 20 }}>
        <button 
          onClick={() => { setActiveTab("students"); setSelectedStudent(null); setSelectedAttempt(null); }}
          style={{
            background: "none",
            border: "none",
            borderBottom: activeTab === "students" ? `3px solid ${C.accent}` : "3px solid transparent",
            color: activeTab === "students" ? C.white : C.textDim,
            padding: "10px 20px",
            fontSize: 14,
            fontWeight: 700,
            cursor: "pointer",
            fontFamily: FONT
          }}
        >
          {selectedGroup === "real" ? "Реальные результаты" : "Студенты группы"}
        </button>
        <button 
          onClick={() => { setActiveTab("heatmap"); setSelectedStudent(null); setSelectedAttempt(null); }}
          style={{
            background: "none",
            border: "none",
            borderBottom: activeTab === "heatmap" ? `3px solid ${C.accent}` : "3px solid transparent",
            color: activeTab === "heatmap" ? C.white : C.textDim,
            padding: "10px 20px",
            fontSize: 14,
            fontWeight: 700,
            cursor: "pointer",
            fontFamily: FONT
          }}
        >
          Анализ ошибок (Heatmap)
        </button>
      </div>

      {/* Empty State for Real Data if no sessions yet */}
      {selectedGroup === "real" && realCount === 0 && (
        <div style={{
          background: C.panelBg,
          border: `1px dashed ${C.accent}66`,
          borderRadius: 16,
          padding: "36px 24px",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
          marginBottom: 20
        }}>
          <div style={{ fontSize: 40 }}>🩺</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: C.white }}>Реальных прохождений пока нет</div>
          <div style={{ fontSize: 13, color: C.textDim, maxWidth: 500, lineHeight: 1.6 }}>
            Пройдите любой клинический случай в симуляторе, и вы увидите реальную оценку, время решения, чек-лист ОСКЭ и разбор когнитивных ошибок прямо здесь.
          </div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 8 }}>
            <button
              onClick={() => setPhase("menu")}
              style={{
                background: C.accent,
                border: "none",
                borderRadius: 10,
                padding: "10px 22px",
                color: C.bg,
                fontSize: 13,
                fontWeight: 800,
                cursor: "pointer",
                fontFamily: FONT
              }}
            >
              ▶ Пройти клинический случай
            </button>
            <button
              onClick={() => setSelectedGroup("302-Л")}
              style={{
                background: "rgba(255,255,255,0.05)",
                border: `1px solid ${C.border}`,
                borderRadius: 10,
                padding: "10px 20px",
                color: C.white,
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: FONT
              }}
            >
              Показать демо-группу 302-Л
            </button>
          </div>
        </div>
      )}

      {/* Tab Contents: Student / Session List */}
      {activeTab === "students" && !selectedStudent && students.length > 0 && (
        <div style={{ background: C.panelBg, border: `1px solid ${C.border}`, borderRadius: 14, padding: 20 }}>
          <StudentList students={students} onSelectStudent={setSelectedStudent} />
        </div>
      )}

      {/* Tab Contents: Error Heatmap */}
      {activeTab === "heatmap" && students.length > 0 && (
        <div style={{ background: C.panelBg, border: `1px solid ${C.border}`, borderRadius: 14, padding: 20 }}>
          <ErrorHeatmap students={students} />
        </div>
      )}

      {/* Detailed View for Selected Student or Real Profile */}
      {activeTab === "students" && selectedStudent && (
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "340px 1fr", gap: 16 }}>
          {/* Left panel: Attempt list */}
          <div style={{ background: C.panelBg, border: `1px solid ${C.border}`, borderRadius: 14, padding: 18, maxHeight: "70vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: C.white }}>{selectedStudent.name}</div>
                <div style={{ fontSize: 11, color: C.textDim, marginTop: 2 }}>{selectedStudent.casesPlayed} сессий пройдено</div>
              </div>
              <button 
                onClick={() => { setSelectedStudent(null); setSelectedAttempt(null); }}
                style={{ background: "none", border: "none", color: C.accent, cursor: "pointer", fontSize: 12, fontWeight: 600 }}
              >
                Все записи
              </button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {selectedStudent.history.map((h) => (
                <div 
                  key={h.id}
                  onClick={() => setSelectedAttempt(h)}
                  style={{
                    background: selectedAttempt?.id === h.id ? `${C.accent}15` : C.panel2,
                    border: `1px solid ${selectedAttempt?.id === h.id ? C.accent : C.border}`,
                    borderRadius: 10,
                    padding: 12,
                    cursor: "pointer",
                    transition: "all 0.2s"
                  }}
                >
                  <div style={{ fontSize: 12.5, fontWeight: 600, color: C.white }}>{h.caseTitle}</div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 11, color: C.textDim, flexWrap: "wrap", gap: 4 }}>
                    <span>{h.date}</span>
                    <span style={{ fontWeight: 700, color: h.score >= 75 ? C.green : C.yellow }}>{h.score} б.</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right panel: Attempt details */}
          <div style={{ background: C.panelBg, border: `1px solid ${C.border}`, borderRadius: 14, padding: 20 }}>
            <AttemptDetails attempt={selectedAttempt} />
          </div>
        </div>
      )}

      {toast && (
        <div style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          background: C.green,
          color: C.bg,
          padding: "12px 24px",
          borderRadius: 8,
          boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
          zIndex: 10000,
          fontFamily: FONT,
          fontSize: 13,
          fontWeight: 700,
          animation: "fadeIn 0.3s ease"
        }}>
          ✓ {toast}
        </div>
      )}
    </div>
  );
}
