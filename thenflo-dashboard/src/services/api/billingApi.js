import { apiClient, USE_MOCK } from "./client.js";
import { delay } from "../mock/mockDb.js";
import { PLANS, BILLING_SUMMARY, BILLING_HISTORY } from "../mock/mockData.js";

/**
 * Billing/subscription data. Deliberately thin -- shaped so a real
 * provider (e.g. Stripe, via the API Gateway) can be dropped in without
 * redesigning the Billing page. No payment collection happens here.
 */
export const billingApi = {
  async getSummary() {
    if (USE_MOCK) return delay(BILLING_SUMMARY);
    return apiClient.get("/billing/summary");
  },

  async listPlans() {
    if (USE_MOCK) return delay(PLANS);
    return apiClient.get("/billing/plans");
  },

  async listInvoices() {
    if (USE_MOCK) return delay({ items: BILLING_HISTORY, total: BILLING_HISTORY.length });
    return apiClient.get("/billing/invoices");
  },

  async changePlan(planId) {
    if (USE_MOCK) return delay({ planId, status: "scheduled" }, 350);
    return apiClient.post("/billing/change-plan", { planId });
  },
};
