import React from "react";
import { Check } from "lucide-react";
import Button from "./Button.jsx";

export default function PlanCard({ plan, isCurrent, onSelect }) {
  return (
    <div
      className={`relative flex flex-col rounded border p-5 ${
        plan.popular ? "border-signal" : "border-line"
      } bg-surface`}
    >
      {plan.popular && (
        <span className="absolute -top-2.5 left-5 rounded-full bg-signal px-2.5 py-0.5 text-[10.5px] font-bold text-[#04211D]">
          MOST POPULAR
        </span>
      )}
      <div className="text-[13.5px] font-bold text-ink">{plan.name}</div>
      <div className="mt-2 flex items-baseline gap-1">
        <span className="font-data text-2xl font-bold text-ink">{plan.price}</span>
        <span className="text-[12.5px] text-ink3">{plan.period}</span>
      </div>
      <div className="mt-4 flex flex-col gap-2 text-[12.5px] text-ink2">
        <div className="flex items-center gap-2">
          <Check size={13} className="text-signal" /> {plan.sessions} demo sessions / mo
        </div>
        <div className="flex items-center gap-2">
          <Check size={13} className="text-signal" /> {plan.minutes} AI minutes / mo
        </div>
        <div className="flex items-center gap-2">
          <Check size={13} className="text-signal" /> {plan.storage} knowledge storage
        </div>
        <div className="flex items-center gap-2">
          <Check size={13} className="text-signal" /> {plan.seats} team seats
        </div>
      </div>
      <div className="mt-5">
        {isCurrent ? (
          <Button variant="secondary" className="w-full justify-center" disabled>
            Current plan
          </Button>
        ) : (
          <Button variant={plan.popular ? "primary" : "secondary"} className="w-full justify-center" onClick={() => onSelect(plan)}>
            {plan.id === "enterprise" ? "Contact sales" : "Manage plan"}
          </Button>
        )}
      </div>
    </div>
  );
}
