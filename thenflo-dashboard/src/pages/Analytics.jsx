import React, { useCallback } from "react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { Mic, CheckCircle2, TrendingUp, Clock, MessageSquare, Zap, Bot, Volume2, MousePointerClick, Database } from "lucide-react";
import Card, { SectionHeading } from "../components/ui/Card.jsx";
import StatCard from "../components/ui/StatCard.jsx";
import AsyncView from "../components/ui/AsyncView.jsx";
import { useAsync } from "../hooks/useAsync.js";
import { useTheme } from "../hooks/useTheme.jsx";
import { analyticsApi } from "../services/api/analyticsApi.js";
import { formatDuration } from "../utils/format.js";

const CHART_COLORS = { signal: "#2FE0C9", pulse: "#8B7CF6" };
const PERF_ICONS = { "Total response time": Bot, "Speech-to-text": Mic, "Knowledge retrieval": Database, "Language model": Zap, "Text-to-speech": Volume2, "Automation execution": MousePointerClick };

export default function Analytics() {
  const { theme } = useTheme();
  const axisColor = theme === "dark" ? "#5D6B78" : "#8A939C";
  const gridColor = theme === "dark" ? "#212B36" : "#E3E7EB";
  const tooltipStyle = { background: theme === "dark" ? "#151D26" : "#fff", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 };

  const summaryState = useAsync(useCallback(() => analyticsApi.getSummary(), []), []);
  const seriesState = useAsync(useCallback(() => analyticsApi.getTimeSeries(), []), []);
  const flowUsageState = useAsync(useCallback(() => analyticsApi.getFlowUsage(), []), []);
  const questionsState = useAsync(useCallback(() => analyticsApi.getTopQuestions(), []), []);
  const perfState = useAsync(useCallback(() => analyticsApi.getAiPerformance(), []), []);

  return (
    <div className="fade-in flex flex-col gap-5">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(170px,1fr))] gap-3.5">
        <AsyncView state={summaryState}>
          {(s) => (
            <>
              <StatCard label="Total sessions" value={s.totalSessions.toLocaleString()} icon={Mic} />
              <StatCard label="Completed sessions" value={s.completedSessions.toLocaleString()} icon={CheckCircle2} />
              <StatCard label="Conversion rate" value={`${s.conversionRate}%`} delta="+2.4 pts" icon={TrendingUp} />
              <StatCard label="Avg. session duration" value={formatDuration(s.avgDuration)} icon={Clock} />
              <StatCard label="Avg. interactions" value={s.avgInteractions} icon={MessageSquare} />
              <StatCard label="Automation success" value={`${s.automationSuccessRate}%`} icon={Zap} />
            </>
          )}
        </AsyncView>
      </div>

      <div className="grid grid-cols-[1.4fr_1fr] gap-4 max-md:grid-cols-1">
        <Card>
          <SectionHeading title="Demo sessions over time" subtitle="Last 14 days" />
          <AsyncView state={seriesState}>
            {(series) => (
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={series}>
                  <defs>
                    <linearGradient id="sigGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={CHART_COLORS.signal} stopOpacity={0.35} />
                      <stop offset="100%" stopColor={CHART_COLORS.signal} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: axisColor }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: axisColor }} axisLine={false} tickLine={false} width={32} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Area type="monotone" dataKey="sessions" stroke={CHART_COLORS.signal} strokeWidth={2} fill="url(#sigGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </AsyncView>
        </Card>
        <Card>
          <SectionHeading title="Successful vs total" subtitle="Last 14 days" />
          <AsyncView state={seriesState}>
            {(series) => (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={series}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: axisColor }} axisLine={false} tickLine={false} interval={2} />
                  <YAxis tick={{ fontSize: 11, fill: axisColor }} axisLine={false} tickLine={false} width={32} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="successful" fill={CHART_COLORS.signal} radius={[3, 3, 0, 0]} />
                  <Bar dataKey="sessions" fill={CHART_COLORS.pulse} radius={[3, 3, 0, 0]} opacity={0.5} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </AsyncView>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
        <Card>
          <SectionHeading title="Most-used demo flows" />
          <AsyncView state={flowUsageState}>
            {(flows) => {
              const max = Math.max(...flows.map((f) => f.sessions));
              return (
                <div className="mt-1 flex flex-col gap-3">
                  {flows.map((f) => (
                    <div key={f.name}>
                      <div className="mb-1.5 flex justify-between text-[12.5px]">
                        <span className="font-medium text-ink">{f.name}</span>
                        <span className="font-data text-ink2">{f.sessions}</span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-surface2">
                        <div className="h-full rounded-full bg-signal" style={{ width: `${(f.sessions / max) * 100}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              );
            }}
          </AsyncView>
        </Card>
        <Card>
          <SectionHeading title="Most common visitor questions" />
          <AsyncView state={questionsState}>
            {(questions) => (
              <div className="mt-1 flex flex-col gap-2.5">
                {questions.map((q, i) => (
                  <div key={i} className={`flex items-center justify-between py-2 ${i > 0 ? "border-t border-line" : ""}`}>
                    <div className="flex items-center gap-2 text-[13px] text-ink">
                      <MessageSquare size={13} className="text-ink3" />
                      {q.q}
                    </div>
                    <span className="font-data text-[12px] text-ink2">{q.count}</span>
                  </div>
                ))}
              </div>
            )}
          </AsyncView>
        </Card>
      </div>

      <Card>
        <SectionHeading title="AI performance" subtitle="Average processing time per stage, in milliseconds" />
        <AsyncView state={perfState}>
          {(perf) => (
            <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-3.5">
              {perf.map((p) => {
                const Icon = PERF_ICONS[p.label] || Zap;
                return (
                  <div key={p.label} className="rounded-lg bg-surface2 p-3.5">
                    <Icon size={15} className="text-ink2" />
                    <div className="font-data mt-2.5 text-[20px] font-semibold text-ink">{p.ms}ms</div>
                    <div className="mt-0.5 text-[12px] text-ink2">{p.label}</div>
                  </div>
                );
              })}
            </div>
          )}
        </AsyncView>
      </Card>
    </div>
  );
}
