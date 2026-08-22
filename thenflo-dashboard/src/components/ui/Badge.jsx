import React from "react";
import { CheckCircle2, Clock, RefreshCw, XCircle, AlertTriangle, CircleSlash, PauseCircle, Info } from "lucide-react";

const MAP = {
  Completed: ["success", CheckCircle2],
  Operational: ["success", CheckCircle2],
  Ready: ["success", CheckCircle2],
  Successful: ["success", CheckCircle2],
  Active: ["success", CheckCircle2],
  Paid: ["success", CheckCircle2],
  "In Progress": ["signal", Clock],
  Processing: ["signal", RefreshCw],
  Connected: ["signal", CheckCircle2],
  Invited: ["pulse", Clock],
  Failed: ["danger", XCircle],
  Degraded: ["warn", AlertTriangle],
  Abandoned: ["muted", CircleSlash],
  Suspended: ["danger", PauseCircle],
  Disabled: ["muted", CircleSlash],
};

const BG = {
  success: "bg-successDim",
  signal: "bg-signalDim",
  pulse: "bg-pulseDim",
  warn: "bg-warnDim",
  danger: "bg-dangerDim",
  muted: "bg-surface2 border border-line",
};

const TEXT = {
  success: "text-success",
  signal: "text-signalText",
  pulse: "text-pulseText",
  warn: "text-warn",
  danger: "text-danger",
  muted: "text-ink2",
};

export default function Badge({ status }) {
  const [tone, Icon] = MAP[status] || ["muted", Info];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${BG[tone]} ${TEXT[tone]}`}>
      <Icon size={11} strokeWidth={2.5} />
      {status}
    </span>
  );
}
