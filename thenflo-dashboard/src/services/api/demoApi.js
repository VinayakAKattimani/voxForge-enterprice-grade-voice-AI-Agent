import { apiClient, USE_MOCK } from "./client.js";
import { delay } from "../mock/mockDb.js";
import { genFlows } from "../mock/mockData.js";

let mockFlows = genFlows();

/**
 * Demo flow definitions -- the step-by-step scripts the automation engine
 * follows during a live demonstration.
 */
export const demoApi = {
  async listFlows() {
    if (USE_MOCK) return delay({ items: mockFlows, total: mockFlows.length });
    return apiClient.get("/demo-flows");
  },

  async getFlow(id) {
    if (USE_MOCK) {
      const flow = mockFlows.find((f) => f.id === id);
      if (!flow) return Promise.reject(Object.assign(new Error("Flow not found"), { status: 404 }));
      return delay(flow);
    }
    return apiClient.get(`/demo-flows/${id}`);
  },

  async createFlow(partial) {
    if (USE_MOCK) {
      const flow = {
        id: `FLOW-${Math.floor(Math.random() * 900 + 100)}`,
        name: partial?.name || "Untitled demo flow",
        description: partial?.description || "",
        enabled: true,
        sessions: 0,
        successRate: 0,
        steps: partial?.steps || [],
      };
      mockFlows = [...mockFlows, flow];
      return delay(flow, 350);
    }
    return apiClient.post("/demo-flows", partial);
  },

  async updateFlow(id, patch) {
    if (USE_MOCK) {
      mockFlows = mockFlows.map((f) => (f.id === id ? { ...f, ...patch } : f));
      return delay(mockFlows.find((f) => f.id === id), 250);
    }
    return apiClient.patch(`/demo-flows/${id}`, patch);
  },

  async duplicateFlow(id) {
    if (USE_MOCK) {
      const src = mockFlows.find((f) => f.id === id);
      const copy = { ...src, id: `FLOW-${Math.floor(Math.random() * 900 + 100)}`, name: `${src.name} (copy)`, sessions: 0 };
      mockFlows = [...mockFlows, copy];
      return delay(copy, 300);
    }
    return apiClient.post(`/demo-flows/${id}/duplicate`, {});
  },

  async deleteFlow(id) {
    if (USE_MOCK) {
      mockFlows = mockFlows.filter((f) => f.id !== id);
      return delay(null, 250);
    }
    return apiClient.delete(`/demo-flows/${id}`);
  },
};
