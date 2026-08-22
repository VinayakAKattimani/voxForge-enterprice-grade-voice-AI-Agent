import { apiClient, USE_MOCK } from "./client.js";
import { delay } from "../mock/mockDb.js";
import { TEAM } from "../mock/mockData.js";

let mockTeam = TEAM;

/**
 * Team/user management -- invitations, role changes, removal. Also used
 * by Settings > Profile for the current user's own details.
 */
export const userApi = {
  async listTeam() {
    if (USE_MOCK) return delay({ items: mockTeam, total: mockTeam.length });
    return apiClient.get("/team/members");
  },

  async inviteMember({ email, role }) {
    if (USE_MOCK) {
      const member = { id: `usr_${mockTeam.length + 1}`, name: email.split("@")[0], email, role, status: "Invited", lastActive: "\u2014" };
      mockTeam = [...mockTeam, member];
      return delay(member, 350);
    }
    return apiClient.post("/team/invite", { email, role });
  },

  async changeRole(id, role) {
    if (USE_MOCK) {
      mockTeam = mockTeam.map((m) => (m.id === id ? { ...m, role } : m));
      return delay(mockTeam.find((m) => m.id === id), 200);
    }
    return apiClient.patch(`/team/members/${id}`, { role });
  },

  async removeMember(id) {
    if (USE_MOCK) {
      mockTeam = mockTeam.filter((m) => m.id !== id);
      return delay(null, 200);
    }
    return apiClient.delete(`/team/members/${id}`);
  },
};
