import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import ABCDEAssessmentPanel from "../src/components/game/ABCDEAssessmentPanel.jsx";
import DiagnosisRoutingTab from "../src/components/game/workstation/DiagnosisRoutingTab.jsx";
import TreatPanel from "../src/components/game/TreatPanel.jsx";
import { ResultCard } from "../src/ui/components.jsx";
import VitalsHUD from "../src/components/game/vitals/VitalsHUD.jsx";
import CommandPalette from "../src/components/CommandPalette.jsx";
import { CASES } from "../src/data/cases/index.js";
import { initPS } from "../src/engine/patient.js";
import { ThemeProvider } from "../src/ui/ThemeContext.jsx";
import { LocaleProvider } from "../src/locale/LocaleContext.jsx";

function renderWithProviders(ui) {
  return render(
    <ThemeProvider>
      <LocaleProvider>
        {ui}
      </LocaleProvider>
    </ThemeProvider>
  );
}

describe("MEDSIM V2.2.1 Full Clinical Workflow & Browser Runtime QA", () => {
  // TEST 1: ABCDE WORKFLOW & EDGE CASES (Cardiac arrest, missing DBP, normal, critical)
  test("ABCDE Workflow across normal, critical and cardiac arrest cases", () => {
    // 1.1 Normal Case
    const normalCase = CASES.find(c => c.category === "cardiac" && c.department === "icu") || CASES[0];
    const normalPS = initPS(normalCase);
    const events = [];
    const addEvent = (text, type) => events.push({ text, type });

    const { rerender } = renderWithProviders(
      <ABCDEAssessmentPanel cd={normalCase} ps={normalPS} addEvent={addEvent} />
    );

    // Click A: Airway
    const airwayBtn = screen.getByText(/Оценить ВДП/i);
    fireEvent.click(airwayBtn);
    expect(events.length).toBe(1);
    expect(events[0].text).toContain("[ABCDE A]");

    // Click B: Breathing
    const tabB = screen.getByText(/^B$/i);
    fireEvent.click(tabB);
    const auscultBtn = screen.getByText(/Аускультация легких/i);
    fireEvent.click(auscultBtn);
    expect(events.length).toBe(2);

    // Click C: Circulation
    const tabC = screen.getByText(/^C$/i);
    fireEvent.click(tabC);
    const pulseBtn = screen.getByText(/Периферический пульс/i);
    fireEvent.click(pulseBtn);
    expect(events.length).toBe(3);

    // Toggle Summary View
    const summaryBtn = screen.getByText(/Сводка ABCDE/i);
    fireEvent.click(summaryBtn);
    expect(screen.getByText(/Клинический протокол первичного осмотра/i)).toBeInTheDocument();

    // 1.2 Cardiac Arrest Case (HR=0, BP=---/---) — MAP MUST NOT BE FAKE 93 OR 120/80
    const arrestCase = CASES.find(c => c.vitals.bp === "---/---") || {
      id: "arrest_test",
      vitals: { bp: "---/---", hr: 0, rr: 0, spo2: 0, temp: 35 },
      exam: "Асистолия, сознание отсутствует",
    };
    const arrestPS = initPS(arrestCase);

    rerender(
      <ThemeProvider>
        <LocaleProvider>
          <ABCDEAssessmentPanel cd={arrestCase} ps={arrestPS} addEvent={addEvent} />
        </LocaleProvider>
      </ThemeProvider>
    );

    // Verify MAP does not calculate fake value
    const tabC2 = screen.getByText(/^C$/i);
    fireEvent.click(tabC2);
    expect(screen.getByText(/MAP:/i)).toBeInTheDocument();
    expect(screen.queryByText(/93 мм рт.ст./i)).not.toBeInTheDocument();
  });

  // TEST 2: RESULT CARD & CLINICAL METADATA (unit, refRange, sample, status)
  test("ResultCard renders reference ranges and authentic clinical metadata", () => {
    const sampleCase = CASES[0];
    const { rerender } = renderWithProviders(
      <ResultCard id="troponin" text="🔴 Тропонин I: 2.45 нг/мл (ОИМ)" isNew={true} cd={sampleCase} />
    );

    expect(screen.getByText(/Тропонин I/i)).toBeInTheDocument();
    expect(screen.getByText(/КРИТИЧНО/i)).toBeInTheDocument();
    expect(screen.getByText(/Референс:/i)).toBeInTheDocument();
    expect(screen.getByText(/hs-cTnI/i)).toBeInTheDocument();

    // Normal ECG result
    rerender(
      <ThemeProvider>
        <LocaleProvider>
          <ResultCard id="ecg" text="Синусовый ритм 75 уд/мин, без ишемических изменений." isNew={false} cd={sampleCase} />
        </LocaleProvider>
      </ThemeProvider>
    );
    expect(screen.getByText(/НОРМА/i)).toBeInTheDocument();
  });

  // TEST 3: DIFFERENTIAL REASONING WORKSPACE & CHIP CLICKING
  test("Differential Reasoning Workspace calculates hypotheses and pastes into diagText", () => {
    const cardiacCase = CASES.find(c => c.category === "cardiac" && c.needDiag.includes("ecg")) || CASES[0];
    let currentDiagText = "";
    const setDiagText = (val) => { currentDiagText = val; };

    renderWithProviders(
      <DiagnosisRoutingTab
        diagText={currentDiagText}
        setDiagText={setDiagText}
        orderedDiag={["ecg"]}
        cd={cardiacCase}
        t={(k) => k}
      />
    );

    expect(screen.getByText(/Дифференциальный ряд/i)).toBeInTheDocument();
    expect(screen.getByText(/ВЕДУЩИЙ/i)).toBeInTheDocument();

    // Click on leading hypothesis
    const leadChip = screen.getByText(new RegExp(cardiacCase.diagnosis, "i"));
    fireEvent.click(leadChip);
    expect(currentDiagText).toBe(cardiacCase.diagnosis);
  });

  // TEST 4: TREATMENT 7-CATEGORY WORKSPACE
  test("TreatPanel groups treatments into clinical categories", () => {
    const sampleCase = CASES[0];
    const selectedTreat = [];
    const toggleTreatment = (id) => selectedTreat.push(id);

    renderWithProviders(
      <TreatPanel
        cd={sampleCase}
        selTreat={selectedTreat}
        toggleTreatment={toggleTreatment}
        appliedFx={new Set()}
        pendingFx={new Set()}
        treatCat="all"
      />
    );

    expect(screen.getByText(/Экстренные/i)).toBeInTheDocument();
    expect(screen.getByText(/Кардио/i)).toBeInTheDocument();
    expect(screen.getByText(/Анальгезия/i)).toBeInTheDocument();
    expect(screen.getByText(/Дыхание/i)).toBeInTheDocument();
    expect(screen.getByText(/Антимикробные/i)).toBeInTheDocument();
    expect(screen.getByText(/Инфузии/i)).toBeInTheDocument();
  });

  // TEST 5: COMMAND PALETTE KEYBOARD NAVIGATION & ACTIONS
  test("CommandPalette keyboard triggers and action execution", () => {
    let toggledTreat = null;
    let orderedTests = null;

    renderWithProviders(
      <CommandPalette
        isOpen={true}
        onClose={() => {}}
        toggleTreatment={(id) => { toggledTreat = id; }}
        handleOrderTests={(arr) => { orderedTests = arr; }}
        setPhase={() => {}}
      />
    );

    const input = screen.getByPlaceholderText(/Быстрый поиск назначений/i);
    expect(input).toBeInTheDocument();

    // Search for Aspirin
    fireEvent.change(input, { target: { value: "Аспирин" } });
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });
    expect(toggledTreat).toBe("aspirin");
  });
});
