import React, { useState, useMemo } from "react";
import { useTheme } from "../ui/ThemeContext";
import { FONT } from "../ui/theme";
import { generateMockStudentsData } from "../engine/cognitiveAnalyzer";
import StudentList from "../components/dashboard/StudentList";
import ErrorHeatmap from "../components/dashboard/ErrorHeatmap";
import AttemptDetails from "../components/dashboard/AttemptDetails";
import DashboardHeader from "../components/dashboard/DashboardHeader";

export default function TeacherDashboardScreen({ setPhase }) {
  const C = useTheme();
  const [selectedGroup, setSelectedGroup] = useState("302-Л");
  const [activeTab, setActiveTab] = useState("students");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedAttempt, setSelectedAttempt] = useState(null);
  const [toast, setToast] = useState(null);

  // Генерируем мок-данные для группы 302-Л
  const students = useMemo(() => generateMockStudentsData(), []);

  // Суммарная статистика по группе
  const stats = useMemo(() => {
    const totalPlayed = students.reduce((acc, s) => acc + s.casesPlayed, 0);
    const sumScore = students.reduce((acc, s) => acc + s.avgScore, 0);
    const avgScore = Math.round(sumScore / students.length) || 0;
    
    let totalCritErrors = 0;
    students.forEach(s => {
      s.history.forEach(h => {
        if (h.criticalErrorsCount > 0) totalCritErrors++;
      });
    });

    return { totalPlayed, avgScore, totalCritErrors };
  }, [students]);

  // Функция для экспорта данных группы
  const handleExport = () => {
    setToast("Отчет группы " + selectedGroup + " успешно экспортирован!");
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: C.bgGrad,
      color: C.white,
      fontFamily: FONT,
      padding: "24px 40px",
      boxSizing: "border-box"
    }}>
      {/* Dashboard Header and Stats Widgets */}
      <DashboardHeader 
        selectedGroup={selectedGroup}
        setSelectedGroup={setSelectedGroup}
        stats={stats}
        onExport={handleExport}
        onBack={() => setPhase("menu")}
      />

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
          Студенты группы
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

      {/* Tab Contents */}
      {activeTab === "students" && !selectedStudent && (
        <div style={{ background: C.panelBg, border: `1px solid ${C.border}`, borderRadius: 14, padding: 20 }}>
          <StudentList students={students} onSelectStudent={setSelectedStudent} />
        </div>
      )}

      {activeTab === "heatmap" && (
        <div style={{ background: C.panelBg, border: `1px solid ${C.border}`, borderRadius: 14, padding: 20 }}>
          <ErrorHeatmap students={students} />
        </div>
      )}

      {/* Detailed Student View */}
      {activeTab === "students" && selectedStudent && (
        <div style={{ display: "grid", gridTemplateColumns: "350px 1fr", gap: 20 }}>
          {/* Left panel: Attempt list */}
          <div style={{ background: C.panelBg, border: `1px solid ${C.border}`, borderRadius: 14, padding: 18, maxHeight: "70vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.white }}>{selectedStudent.name}</div>
              <button 
                onClick={() => { setSelectedStudent(null); setSelectedAttempt(null); }}
                style={{ background: "none", border: "none", color: C.accent, cursor: "pointer", fontSize: 12, fontWeight: 600 }}
              >
                Все студенты
              </button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {selectedStudent.history.map((h) => (
                <div 
                  key={h.id}
                  onClick={() => setSelectedAttempt(h)}
                  style={{
                    background: selectedAttempt?.id === h.id ? `${C.accent}10` : C.panel2,
                    border: `1px solid ${selectedAttempt?.id === h.id ? C.accent : C.border}`,
                    borderRadius: 10,
                    padding: 12,
                    cursor: "pointer",
                    transition: "all 0.2s"
                  }}
                >
                  <div style={{ fontSize: 12.5, fontWeight: 600, color: C.white }}>{h.caseTitle}</div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 11, color: C.textDim }}>
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
