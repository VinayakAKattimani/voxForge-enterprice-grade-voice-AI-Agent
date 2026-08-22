import React, { useCallback } from "react";
import { Download, FileText } from "lucide-react";
import Card, { SectionHeading } from "../../components/ui/Card.jsx";
import Badge from "../../components/ui/Badge.jsx";
import Button from "../../components/ui/Button.jsx";
import UsageMeter from "../../components/ui/UsageMeter.jsx";
import PlanCard from "../../components/ui/PlanCard.jsx";
import DataTable from "../../components/ui/DataTable.jsx";
import AsyncView from "../../components/ui/AsyncView.jsx";
import { useAsync } from "../../hooks/useAsync.js";
import { billingApi } from "../../services/api/billingApi.js";
import { useToast } from "../../store/ToastContext.jsx";

export default function Billing() {
  const { notify } = useToast();
  const summaryState = useAsync(useCallback(() => billingApi.getSummary(), []), []);
  const plansState = useAsync(useCallback(() => billingApi.listPlans(), []), []);
  const invoicesState = useAsync(useCallback(() => billingApi.listInvoices(), []), []);

  async function handleSelectPlan(plan) {
    await billingApi.changePlan(plan.id);
    notify(`Plan change to ${plan.name} scheduled`);
  }

  const columns = [
    { key: "invoice", header: "Invoice", render: (r) => <span className="font-data">{r.invoice}</span> },
    { key: "date", header: "Date", render: (r) => <span className="font-data text-ink2">{r.date}</span> },
    { key: "amount", header: "Amount", render: (r) => <span className="font-data">{r.amount}</span> },
    { key: "status", header: "Status", render: (r) => <Badge status={r.status} /> },
    {
      key: "download",
      header: "",
      className: "text-right",
      render: () => (
        <button className="text-ink3 hover:text-ink">
          <Download size={15} />
        </button>
      ),
    },
  ];

  return (
    <div className="fade-in flex flex-col gap-5">
      <AsyncView state={summaryState}>
        {(summary) => (
          <Card>
            <div className="flex flex-wrap items-start justify-between gap-6">
              <div>
                <div className="text-[11px] uppercase tracking-wide text-ink3">Current plan</div>
                <div className="mt-1 text-[22px] font-bold text-ink">{summary.planName}</div>
                <div className="mt-1 text-[12.5px] text-ink2">Billing period {summary.billingPeriod}</div>
                <div className="mt-3 flex gap-6">
                  <div>
                    <div className="text-[11px] uppercase tracking-wide text-ink3">Next billing date</div>
                    <div className="font-data mt-0.5 text-[13.5px] font-semibold text-ink">{summary.nextBillingDate}</div>
                  </div>
                  <div>
                    <div className="text-[11px] uppercase tracking-wide text-ink3">Estimated current bill</div>
                    <div className="font-data mt-0.5 text-[13.5px] font-semibold text-ink">{summary.estimatedBill}</div>
                  </div>
                </div>
              </div>
              <Button variant="secondary" onClick={() => notify("Opening plan management\u2026")}>Manage plan</Button>
            </div>

            <div className="mt-6 grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-6 border-t border-line pt-5">
              <UsageMeter label="Demo sessions" used={summary.usage.sessions.used} limit={summary.usage.sessions.limit} />
              <UsageMeter label="AI minutes" used={summary.usage.minutes.used} limit={summary.usage.minutes.limit} />
              <UsageMeter label="Knowledge storage" used={summary.usage.storageGb.used} limit={summary.usage.storageGb.limit} unit=" GB" />
            </div>
          </Card>
        )}
      </AsyncView>

      <div>
        <SectionHeading title="Plans" subtitle="Compare workspace plans \u2014 no payment is collected here yet" />
        <AsyncView state={plansState}>
          {(plans) => (
            <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-3.5">
              {plans.map((p) => (
                <PlanCard key={p.id} plan={p} isCurrent={p.id === "growth"} onSelect={handleSelectPlan} />
              ))}
            </div>
          )}
        </AsyncView>
      </div>

      <Card padded={false}>
        <div className="px-5 pb-1 pt-4">
          <SectionHeading title="Billing history" subtitle="Past invoices for this workspace" />
        </div>
        <AsyncView
          state={invoicesState}
          empty={<div className="p-5"><FileText size={20} className="text-ink3" /></div>}
        >
          {(data) => <DataTable columns={columns} rows={data.items} rowKey={(r) => r.invoice} />}
        </AsyncView>
      </Card>
    </div>
  );
}
