import { apiClient, USE_MOCK } from "./client.js";
import { delay } from "../mock/mockDb.js";
import { AUTOMATION_HISTORY } from "../mock/mockData.js";

/**
 * Automation engine status + step-level execution history. Written so a
 * future Playwright/Selenium/Appium backend can stream real execution
 * events into the same shape without any UI changes.
 */
export const automationApi = {
  async getEngineStatus() {
    if (USE_MOCK) {
      return delay({
        status: "Connected",
        browser: "Chromium 128",
        activeSessions: 3,
        browserInstances: 3,
        currentExecution: { flow: "Run Payroll", step: "Confirming payroll run for session SES-10480", stepIndex: 3, stepCount: 4 },
      });
    }
    return apiClient.get("/automation/status");
  },

  async listExecutionHistory({ status = "All" } = {}) {
    if (USE_MOCK) {
      const filtered = AUTOMATION_HISTORY.filter((r) => status === "All" || r.status === status);
      return delay({ items: filtered, total: filtered.length });
    }
    return apiClient.get("/automation/history", { status });
  },
};
