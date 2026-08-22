import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import Card from "./Card.jsx";

export default function StatCard({ label, value, delta, deltaTone = "success", icon: Icon }) {
  return (
    <Card>
      <div className="flex items-start justify-between">
        <div className="text-[12.5px] font-medium text-ink2">{label}</div>
        {Icon && (
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-signalDim">
            <Icon size={14} className="text-signalText" />
          </div>
        )}
      </div>
      <div className="font-data mt-2.5 text-[26px] font-semibold text-ink">{value}</div>
      {delta && (
        <div className={`mt-2 flex items-center gap-1 text-[12.5px] font-semibold ${deltaTone === "success" ? "text-success" : "text-danger"}`}>
          {deltaTone === "success" ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
          {delta}
        </div>
      )}
    </Card>
  );
}
