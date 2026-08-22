import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Mic, CheckCircle2, Clock, Zap, ArrowUpRight, ChevronRight, Database, Volume2, Bot } from "lucide-react";
import Card, { SectionHeading } from "../components/ui/Card.jsx";
import StatCard from "../components/ui/StatCard.jsx";
import Badge from "../components/ui/Badge.jsx";
import Button from "../components/ui/Button.jsx";
import AsyncView from "../components/ui/AsyncView.jsx";
import { useAsync } from "../hooks/useAsync.js";
import { conversationApi } from "../services/api/conversationApi.js";
import { analyticsApi } from "../services/api/analyticsApi.js";
import { ACTIVITY } from "../services/mock/mockData.js";
import { formatDuration } from "../utils/format.js";

const SYSTEMS = [
  { name: "AI Agent", status: "Operational", icon: Bot },
  { name: "Knowledge Base", status: "Operational", icon: Database },
  { name: "Voice \u2014 STT", status: "Operational", icon: Mic },
  { name: "Voice \u2014 TTS", status: "Degraded", icon: Volume2 },
  { name: "Automation Engine", status: "Operational", icon: Zap },
];

export default function Overview() {
  const navigate = useNavigate();
  const sessionsFetcher = useCallback(() => conversationApi.listSessions({ pageSize: 6 }), []);
  const summaryFetcher = useCallback(() => analyticsApi.getSummary(), []);
  const sessionsState = useAsync(sessionsFetcher, []);
  const summaryState = useAsync(summaryFetcher, []);

  return (
    <div className="fade-in flex flex-col gap-5">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(190px,1fr))] gap-3.5">
        <AsyncView state={summaryState}>
          {(s) => (
            <>
              <StatCard label="Total demo sessions" value={s.totalSessions.toLocaleString()} delta="+8.2% vs last week" icon={Mic} />
              <StatCard label="Successful demos" value={s.completedSessions.toLocaleString()} delta="+6.4% vs last week" icon={CheckCircle2} />
              <StatCard label="Avg. session duration" value={formatDuration(s.avgDuration)} delta="-0:18 vs last week" deltaTone="danger" icon={Clock} />
              <StatCard label="Automation success rate" value={`${s.automationSuccessRate}%`} delta="+1.1 pts vs last week" icon={Zap} />
            </>
          )}
        </AsyncView>
      </div>

      <div className="grid grid-cols-[2fr_1fr] gap-4 max-md:grid-cols-1">
        <Card padded={false}>
          <div className="px-5 pb-1 pt-4">
            <SectionHeading
              title="Recent demo sessions"
              subtitle="Latest activity across all demo flows"
              action={
                <Button variant="ghost" size="sm" icon={ArrowUpRight} onClick={() => navigate("/dashboard/sessions")}>
                  View all
                </Button>
              }
            />
          </div>
          <AsyncView state={sessionsState}>
            {(data) => (
              <div className="tf-scroll overflow-x-auto">
                <table className="w-full border-collapse text-[13px]">
                  <thead>
                    <tr className="border-t border-b border-line">
                      {["Session", "Visitor", "Demo flow", "Duration", "Status", ""].map((h) => (
                        <th key={h} className="px-5 py-2.5 text-left text-[11.5px] font-semibold uppercase tracking-wide text-ink3">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.items.map((s) => (
                      <tr
                        key={s.id}
                        onClick={() => navigate(`/dashboard/sessions/${s.id}`)}
                        className="cursor-pointer border-b border-line hover:bg-surfaceHover"
                      >
                        <td className="font-data px-5 py-3">{s.id}</td>
                        <td className="px-5 py-3">{s.visitor}</td>
                        <td className="px-5 py-3 text-ink2">{s.flow}</td>
                        <td className="font-data px-5 py-3">{formatDuration(s.duration)}</td>
                        <td className="px-5 py-3">
                          <Badge status={s.status} />
                        </td>
                        <td className="px-5 py-3 text-right">
                          <ChevronRight size={15} className="text-ink3" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </AsyncView>
        </Card>

        <Card>
          <SectionHeading title="System status" subtitle="Live infrastructure health" />
          <div className="flex flex-col gap-2.5">
            {SYSTEMS.map((s) => (
              <div key={s.name} className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2.5">
                  <s.icon size={15} className="text-ink2" />
                  <span className="text-[13px] font-medium text-ink">{s.name}</span>
                </div>
                <Badge status={s.status} />
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <SectionHeading title="Recent activity" subtitle="Changes and events across your workspace" />
        <div className="flex flex-col">
          {ACTIVITY.map((a, i) => (
            <div key={i} className={`flex items-center gap-3 py-2.5 ${i > 0 ? "border-t border-line" : ""}`}>
              <div className="text-[13px] text-ink flex-1">{a.text}</div>
              <div className="font-data text-[12px] text-ink3">{a.time}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
