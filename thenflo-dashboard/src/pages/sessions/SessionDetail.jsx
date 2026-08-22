import React, { useCallback, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, MousePointerClick, CheckCircle2, XCircle, FileText } from "lucide-react";
import Card from "../../components/ui/Card.jsx";
import Badge from "../../components/ui/Badge.jsx";
import Button from "../../components/ui/Button.jsx";
import Tabs from "../../components/ui/Tabs.jsx";
import AsyncView from "../../components/ui/AsyncView.jsx";
import { useAsync } from "../../hooks/useAsync.js";
import { conversationApi } from "../../services/api/conversationApi.js";
import { formatDuration } from "../../utils/format.js";

const TABS = [
  { key: "transcript", label: "Transcript" },
  { key: "automation", label: "Automation timeline" },
  { key: "knowledge", label: "Knowledge retrieved" },
  { key: "info", label: "Session info" },
];

export default function SessionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tab, setTab] = useState("transcript");

  const sessionState = useAsync(useCallback(() => conversationApi.getSession(id), [id]), [id]);
  const transcriptState = useAsync(useCallback(() => conversationApi.getTranscript(id), [id]), [id]);
  const automationState = useAsync(useCallback(() => conversationApi.getAutomationTimeline(id), [id]), [id]);
  const knowledgeState = useAsync(useCallback(() => conversationApi.getKnowledgeRetrieved(id), [id]), [id]);

  return (
    <div className="fade-in flex flex-col gap-4">
      <Button variant="ghost" size="sm" icon={ArrowLeft} onClick={() => navigate("/dashboard/sessions")}>
        Back to sessions
      </Button>

      <AsyncView state={sessionState}>
        {(session) => (
          <>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2.5">
                  <span className="font-data text-[18px] font-bold text-ink">{session.id}</span>
                  <Badge status={session.status} />
                </div>
                <div className="mt-1 text-[13px] text-ink2">
                  {session.visitor} &middot; {session.company} &middot; {session.flow}
                </div>
              </div>
              <div className="flex gap-5">
                <Metric label="Duration" value={formatDuration(session.duration)} />
                <Metric label="Interactions" value={session.interactions} />
                <Metric label="Started" value={session.date} />
              </div>
            </div>

            <Tabs tabs={TABS} active={tab} onChange={setTab} />

            {tab === "transcript" && (
              <Card>
                <AsyncView state={transcriptState}>
                  {(transcript) => (
                    <div className="flex flex-col gap-3.5">
                      {transcript.map((m, i) => (
                        <div key={i} className="flex gap-3">
                          <div className="font-data w-10 flex-shrink-0 pt-0.5 text-[11px] text-ink3">{m.time}</div>
                          {m.role === "action" ? (
                            <div className="flex items-center gap-1.5 text-[12.5px] font-medium text-pulseText">
                              <MousePointerClick size={13} /> {m.text}
                            </div>
                          ) : (
                            <div className="max-w-[560px]">
                              <div className={`mb-0.5 text-[11px] font-bold uppercase tracking-wide ${m.role === "ai" ? "text-signalText" : "text-ink2"}`}>
                                {m.role === "ai" ? "ThenFLo AI" : "Visitor"}
                              </div>
                              <div className="text-[13.5px] leading-relaxed text-ink">{m.text}</div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </AsyncView>
              </Card>
            )}

            {tab === "automation" && (
              <Card padded={false}>
                <div className="p-5">
                  <AsyncView state={automationState}>
                    {(steps) => (
                      <>
                        {steps.map((s, i) => (
                          <div key={i} className={`flex items-center gap-3.5 py-3 ${i > 0 ? "border-t border-line" : ""}`}>
                            <div className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full ${s.status === "Successful" ? "bg-successDim" : "bg-dangerDim"}`}>
                              {s.status === "Successful" ? <CheckCircle2 size={13} className="text-success" /> : <XCircle size={13} className="text-danger" />}
                            </div>
                            <div className="flex-1 text-[13.5px] font-medium text-ink">{s.step}</div>
                            <div className="font-data text-[12px] text-ink3">{s.time}</div>
                            <Badge status={s.status} />
                          </div>
                        ))}
                      </>
                    )}
                  </AsyncView>
                </div>
              </Card>
            )}

            {tab === "knowledge" && (
              <div className="flex flex-col gap-2.5">
                <AsyncView state={knowledgeState}>
                  {(chunks) =>
                    chunks.map((k, i) => (
                      <Card key={i}>
                        <div className="mb-2 flex justify-between gap-3">
                          <div className="flex items-center gap-1.5 text-[12.5px] text-ink2">
                            <FileText size={13} /> {k.doc}
                          </div>
                          <span className="font-data text-[12px] font-bold text-signalText">{(k.score * 100).toFixed(0)}% match</span>
                        </div>
                        <div className="text-[13.5px] leading-relaxed text-ink">{k.text}</div>
                      </Card>
                    ))
                  }
                </AsyncView>
              </div>
            )}

            {tab === "info" && (
              <Card>
                <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-5">
                  {[
                    ["Session ID", session.id],
                    ["Status", session.status],
                    ["Demo flow", session.flow],
                    ["Visitor", session.visitor],
                    ["Company", session.company],
                    ["Started", session.date],
                    ["Duration", formatDuration(session.duration)],
                    ["Interactions", session.interactions],
                    ["Errors", session.status === "Failed" ? "1" : "0"],
                  ].map(([k, v]) => (
                    <div key={k}>
                      <div className="mb-1 text-[11px] uppercase tracking-wide text-ink3">{k}</div>
                      <div className="text-[13.5px] font-semibold text-ink">{v}</div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </>
        )}
      </AsyncView>
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-wide text-ink3">{label}</div>
      <div className="font-data text-[15px] font-semibold text-ink">{value}</div>
    </div>
  );
}
