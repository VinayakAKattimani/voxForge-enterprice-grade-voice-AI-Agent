import React, { useCallback, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Copy, PauseCircle, Play, Trash2, ArrowUp, ArrowDown, Plus } from "lucide-react";
import Card from "../../components/ui/Card.jsx";
import Button from "../../components/ui/Button.jsx";
import AsyncView from "../../components/ui/AsyncView.jsx";
import { useAsync } from "../../hooks/useAsync.js";
import { demoApi } from "../../services/api/demoApi.js";
import { useToast } from "../../store/ToastContext.jsx";

export default function DemoFlowDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { notify } = useToast();
  const state = useAsync(useCallback(() => demoApi.getFlow(id), [id]), [id]);

  async function toggleEnabled(flow) {
    await demoApi.updateFlow(flow.id, { enabled: !flow.enabled });
    state.reload();
  }
  async function duplicate(flow) {
    await demoApi.duplicateFlow(flow.id);
    notify("Flow duplicated");
    navigate("/dashboard/demo-flows");
  }
  async function moveStep(flow, idx, dir) {
    const steps = [...flow.steps];
    const target = idx + dir;
    if (target < 0 || target >= steps.length) return;
    [steps[idx], steps[target]] = [steps[target], steps[idx]];
    await demoApi.updateFlow(flow.id, { steps });
    state.reload();
  }
  async function removeStep(flow, idx) {
    const steps = flow.steps.filter((_, i) => i !== idx);
    await demoApi.updateFlow(flow.id, { steps });
    state.reload();
  }
  async function addStep(flow) {
    const steps = [...flow.steps, { action: "Click", target: "New target", description: "Describe this step", expected: "Expected result", timeout: 8, fallback: "None" }];
    await demoApi.updateFlow(flow.id, { steps });
    state.reload();
  }

  return (
    <div className="fade-in flex flex-col gap-4">
      <Button variant="ghost" size="sm" icon={ArrowLeft} onClick={() => navigate("/dashboard/demo-flows")}>
        Back to demo flows
      </Button>

      <AsyncView state={state}>
        {(flow) => (
          <>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="text-[18px] font-bold text-ink">{flow.name}</div>
                <div className="mt-1 max-w-[460px] text-[13px] text-ink2">{flow.description}</div>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" icon={Copy} onClick={() => duplicate(flow)}>Duplicate</Button>
                <Button variant="secondary" size="sm" icon={flow.enabled ? PauseCircle : Play} onClick={() => toggleEnabled(flow)}>
                  {flow.enabled ? "Disable" : "Enable"}
                </Button>
              </div>
            </div>

            <Card padded={false}>
              {flow.steps.map((s, i) => (
                <div key={i} className={`flex gap-3.5 p-4 ${i > 0 ? "border-t border-line" : ""}`}>
                  <div className="flex flex-col items-center gap-1 pt-0.5">
                    <div className="font-data flex h-7 w-7 items-center justify-center rounded-full bg-signalDim text-[12px] font-bold text-signalText">
                      {i + 1}
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <button onClick={() => moveStep(flow, i, -1)} className="text-ink3 hover:text-ink"><ArrowUp size={13} /></button>
                      <button onClick={() => moveStep(flow, i, 1)} className="text-ink3 hover:text-ink"><ArrowDown size={13} /></button>
                    </div>
                  </div>
                  <div className="grid flex-1 grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-3">
                    <Field label="Action type" value={s.action} />
                    <Field label="Target element" value={s.target} />
                    <Field label="Description" value={s.description} span={2} />
                    <Field label="Expected result" value={s.expected} span={2} />
                    <Field label="Timeout" value={`${s.timeout}s`} />
                    <Field label="Fallback" value={s.fallback} />
                  </div>
                  <button onClick={() => removeStep(flow, i)} className="h-6 text-ink3 hover:text-danger">
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
              <div className="p-4">
                <Button variant="secondary" size="sm" icon={Plus} onClick={() => addStep(flow)}>Add step</Button>
              </div>
            </Card>
          </>
        )}
      </AsyncView>
    </div>
  );
}

function Field({ label, value, span }) {
  return (
    <div style={{ gridColumn: span ? `span ${span}` : undefined }}>
      <div className="mb-1 text-[10.5px] uppercase tracking-wide text-ink3">{label}</div>
      <div className="text-[13px] font-medium text-ink">{value}</div>
    </div>
  );
}
