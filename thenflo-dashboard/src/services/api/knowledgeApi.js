import { apiClient, USE_MOCK } from "./client.js";
import { delay } from "../mock/mockDb.js";
import { genDocs, KNOWLEDGE_CHUNKS_BY_SESSION } from "../mock/mockData.js";

let mockDocs = genDocs();

/**
 * Knowledge base management -- document upload/listing/deletion, plus the
 * retrieval-testing endpoint admins use to sanity-check the RAG system.
 */
export const knowledgeApi = {
  async listDocuments({ search = "" } = {}) {
    if (USE_MOCK) {
      const filtered = mockDocs.filter((d) => d.filename.toLowerCase().includes(search.toLowerCase()));
      return delay({ items: filtered, total: filtered.length });
    }
    return apiClient.get("/knowledge/documents", { search });
  },

  async uploadDocument(file) {
    if (USE_MOCK) {
      const doc = {
        id: `DOC-${1000 + mockDocs.length}`,
        filename: file?.name || "New_Uploaded_Document.pdf",
        type: (file?.name?.split(".").pop() || "pdf").toUpperCase(),
        size: file?.size ? `${(file.size / 1024).toFixed(0)} KB` : "1.2 MB",
        uploaded: new Date().toISOString().slice(0, 10),
        chunks: 0,
        status: "Processing",
      };
      mockDocs = [doc, ...mockDocs];
      setTimeout(() => {
        mockDocs = mockDocs.map((d) => (d.id === doc.id ? { ...d, status: "Ready", chunks: 47 } : d));
      }, 2600);
      return delay(doc, 400);
    }
    const formData = new FormData();
    formData.append("file", file);
    return apiClient.post("/knowledge/documents", formData);
  },

  async deleteDocument(id) {
    if (USE_MOCK) {
      mockDocs = mockDocs.filter((d) => d.id !== id);
      return delay(null, 250);
    }
    return apiClient.delete(`/knowledge/documents/${id}`);
  },

  async testRetrieval(query) {
    if (USE_MOCK) return delay({ query, results: KNOWLEDGE_CHUNKS_BY_SESSION.default }, 500);
    return apiClient.post("/knowledge/test-retrieval", { query });
  },
};
