import React, { useCallback, useState } from "react";
import { Zap, Globe, Activity, Bot, Filter } from "lucide-react";
import Card, { SectionHeading } from "../components/ui/Card.jsx";
import StatCard from "../components/ui/StatCard.jsx";
import DataTable from "../components/ui/DataTable.jsx";
import Badge from "../components/ui/Badge.jsx";
import WaveBars from "../components/ui/WaveBars.jsx";
import AsyncView from "../components/ui/AsyncView.jsx";
import { Select } from "../components/ui/FilterBar.jsx";
import { useAsync } from "../hooks/useAsync.js";
import { automationApi } from "../services/api/automationApi.js";

export default function Automation() {
  const [status, setStatus] = useState("All");
  const statusState = useAsync(useCallback(() => automationApi.getEngineStatus(), []), []);
  const historyState = useAsync(useCallback(() => automationApi.listExecutionHistory({ status }), [status]), [status]);

  const columns = [
    { key: "session", header: "Session", render: (r) => <span className="font-data">{r.session}</span> },
    { key: "flow", header: "Flow", render: (r) => <span className="text-ink2">{r.flow}</span> },
    { key: "step", header: "Step" },
    { key: "action", header: "Action", render: (r) => <span className="text-ink2">{r.action}</span> },
    { key: "time", header: "Time", render: (r) => <span className="font-data">{r.time}</span> },
    { key: "status", header: "Status", render: (r) => <Badge status={r.status} /> },
  ];

  return (
    <div className="fade-in flex flex-col gap-5">
      <AsyncView state={statusState}>
        {(s) => (
          <>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(170px,1fr))] gap-3.5">
              <StatCard label="Engine status" value={s.status} icon={Zap} />
              <StatCard label="Browser status" value={s.browser} icon={Globe} />
              <StatCard label="Active sessions" value={s.activeSessions} icon={Activity} />
              <StatCard label="Browser instances" value={s.browserInstances} icon={Bot} />
            </div>

            <Card>
              <SectionHeading title="Current execution" subtitle="Live view of the automation engine" />
              <div className="flex items-center gap-4">
                <WaveBars active tone="pulse" size={22} />
                <div>
                  <div className="text-[13.5px] font-semibold text-ink">
                    {s.currentExecution.flow} {"\u2014"} step {s.currentExecution.stepIndex} of {s.currentExecution.stepCount}
                  </div>
                  <div className="mt-0.5 text-[12.5px] text-ink2">{s.currentExecution.step}</div>
                </div>
              </div>
            </Card>
          </>
        )}
      </AsyncView>

      <Card padded={false}>
        <div className="flex flex-wrap items-center justify-between gap-2.5 px-5 pb-1 pt-4">
          <SectionHeading title="Execution history" subtitle="Recent step-level automation runs" />
          <Select value={status} onChange={setStatus} options={["All", "Successful", "Failed"]} icon={Filter} />
        </div>
        <AsyncView state={historyState}>
          {(data) => <DataTable columns={columns} rows={data.items} rowKey={(r) => `${r.session}-${r.step}-${r.action}-${r.time}`} />}
        </AsyncView>
      </Card>
    </div>
  );
}
