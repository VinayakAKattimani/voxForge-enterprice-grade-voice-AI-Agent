import { apiClient, USE_MOCK } from "./client.js";
import { delay } from "../mock/mockDb.js";
import { genTimeSeries, FLOW_USAGE, TOP_QUESTIONS, AI_PERFORMANCE } from "../mock/mockData.js";

/**
 * Aggregate metrics and chart-ready series for the Analytics page.
 */
export const analyticsApi = {
  async getSummary() {
    if (USE_MOCK) {
      return delay({
        totalSessions: 4812,
        completedSessions: 4096,
        failedSessions: 312,
        conversionRate: 85.1,
        avgDuration: 292,
        avgInteractions: 7.4,
        automationSuccessRate: 93.1,
      });
    }
    return apiClient.get("/analytics/summary");
  },

  async getTimeSeries() {
    if (USE_MOCK) return delay(genTimeSeries());
    return apiClient.get("/analytics/time-series");
  },

  async getFlowUsage() {
    if (USE_MOCK) return delay(FLOW_USAGE);
    return apiClient.get("/analytics/flow-usage");
  },

  async getTopQuestions() {
    if (USE_MOCK) return delay(TOP_QUESTIONS);
    return apiClient.get("/analytics/top-questions");
  },

  async getAiPerformance() {
    if (USE_MOCK) return delay(AI_PERFORMANCE);
    return apiClient.get("/analytics/ai-performance");
  },
};
