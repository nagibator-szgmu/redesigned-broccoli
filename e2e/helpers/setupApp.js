/**
 * E2E Helper: Pre-configures localStorage and mocks before app loads
 */
export async function setupApp(page) {
  await page.addInitScript(() => {
    const user = {
      id: "u_e2e_tester",
      email: "doctor@medsim.ru",
      nickname: "Доктор Тест",
      avatar: null,
      createdAt: new Date().toISOString(),
    };
    const token = "tok_e2e_test_123";

    localStorage.setItem("medsim_token", token);
    localStorage.setItem("medsim_user", JSON.stringify(user));
    localStorage.setItem("medsim_current_user", JSON.stringify({ user, token }));
    localStorage.setItem("ms_onboardingDone", "true");
    localStorage.setItem("ms_onboarding_done", "true");
    localStorage.setItem("ms_tutorialDone", "true");
    localStorage.setItem("ms_audio_enabled", "false");
    localStorage.setItem(
      "medsim_profile",
      JSON.stringify({
        totalScore: 500,
        casesPlayed: 5,
        history: [],
        certificates: [],
      })
    );

    const style = document.createElement("style");
    style.id = "playwright-e2e-overrides";
    style.textContent = `
      [data-inspector-ui] { display: none !important; pointer-events: none !important; }
      *, *::before, *::after {
        animation-duration: 0.001s !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.001s !important;
      }
    `;
    const appendStyle = () => {
      if (document.head && !document.getElementById("playwright-e2e-overrides")) {
        document.head.appendChild(style);
      }
    };
    if (document.head) {
      appendStyle();
    } else {
      document.addEventListener("DOMContentLoaded", appendStyle);
    }
  });
}
