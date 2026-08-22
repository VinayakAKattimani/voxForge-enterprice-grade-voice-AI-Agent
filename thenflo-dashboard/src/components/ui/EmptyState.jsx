import React from "react";
import { Inbox } from "lucide-react";

export default function EmptyState({ icon: Icon = Inbox, title = "Nothing here yet", body, action }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
      <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-lg border border-line bg-surface2">
        <Icon size={20} className="text-ink3" />
      </div>
      <div className="text-sm font-semibold text-ink">{title}</div>
      {body && <div className="mt-1 max-w-[340px] text-[13px] text-ink2">{body}</div>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
