import { apiClient, USE_MOCK } from "./client.js";
import { delay } from "../mock/mockDb.js";
import {
  SESSIONS,
  TRANSCRIPTS_BY_SESSION,
  AUTOMATION_TIMELINE_BY_SESSION,
  KNOWLEDGE_CHUNKS_BY_SESSION,
} from "../mock/mockData.js";

/**
 * Demo session + conversation history. Backs the Overview recent-sessions
 * widget and the full Demo Sessions section (list + detail).
 */
export const conversationApi = {
  async listSessions({ search = "", status = "All", flow = "All", page = 1, pageSize = 20 } = {}) {
    if (USE_MOCK) {
      const filtered = SESSIONS.filter(
        (s) =>
          (status === "All" || s.status === status) &&
          (flow === "All" || s.flow === flow) &&
          (search === "" ||
            s.visitor.toLowerCase().includes(search.toLowerCase()) ||
            s.id.toLowerCase().includes(search.toLowerCase()))
      );
      return delay({ items: filtered, total: filtered.length });
    }
    return apiClient.get("/sessions", { search, status, flow, page, pageSize });
  },

  async getSession(id) {
    if (USE_MOCK) {
      const session = SESSIONS.find((s) => s.id === id);
      if (!session) return Promise.reject(Object.assign(new Error("Session not found"), { status: 404 }));
      return delay(session);
    }
    return apiClient.get(`/sessions/${id}`);
  },

  async getTranscript(id) {
    if (USE_MOCK) return delay(TRANSCRIPTS_BY_SESSION[id] || TRANSCRIPTS_BY_SESSION.default);
    return apiClient.get(`/sessions/${id}/transcript`);
  },

  async getAutomationTimeline(id) {
    if (USE_MOCK) return delay(AUTOMATION_TIMELINE_BY_SESSION[id] || AUTOMATION_TIMELINE_BY_SESSION.default);
    return apiClient.get(`/sessions/${id}/automation-timeline`);
  },

  async getKnowledgeRetrieved(id) {
    if (USE_MOCK) return delay(KNOWLEDGE_CHUNKS_BY_SESSION[id] || KNOWLEDGE_CHUNKS_BY_SESSION.default);
    return apiClient.get(`/sessions/${id}/knowledge`);
  },
};
