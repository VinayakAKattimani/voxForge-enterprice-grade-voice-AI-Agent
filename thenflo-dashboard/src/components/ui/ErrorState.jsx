import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import Button from "./Button.jsx";

export default function ErrorState({ message = "Something went wrong.", onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-14 text-center">
      <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-dangerDim">
        <AlertTriangle size={20} className="text-danger" />
      </div>
      <div className="text-sm font-semibold text-ink">Unable to load this data</div>
      <div className="max-w-[340px] text-[13px] text-ink2">{message}</div>
      {onRetry && (
        <Button variant="secondary" size="sm" icon={RefreshCw} onClick={onRetry}>
          Retry
        </Button>
      )}
    </div>
  );
}
