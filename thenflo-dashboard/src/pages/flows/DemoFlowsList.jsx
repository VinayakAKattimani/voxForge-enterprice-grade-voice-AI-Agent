import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Workflow, Copy, PauseCircle, Play, Trash2 } from "lucide-react";
import Card from "../../components/ui/Card.jsx";
import Badge from "../../components/ui/Badge.jsx";
import Button from "../../components/ui/Button.jsx";
import AsyncView from "../../components/ui/AsyncView.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import ConfirmDialog from "../../components/ui/ConfirmDialog.jsx";
import { useAsync } from "../../hooks/useAsync.js";
import { demoApi } from "../../services/api/demoApi.js";
import { useToast } from "../../store/ToastContext.jsx";

export default function DemoFlowsList() {
  const navigate = useNavigate();
  const { notify } = useToast();
  const [pendingDelete, setPendingDelete] = useState(null);

  const fetcher = useCallback(() => demoApi.listFlows(), []);
  const state = useAsync(fetcher, []);

  async function createFlow() {
    const flow = await demoApi.createFlow({ name: "Untitled demo flow", description: "Describe what this flow demonstrates." });
    notify("Demo flow created");
    state.reload();
    navigate(`/dashboard/demo-flows/${flow.id}`);
  }

  async function toggleEnabled(f) {
    await demoApi.updateFlow(f.id, { enabled: !f.enabled });
    state.reload();
  }

  async function duplicate(f) {
    await demoApi.duplicateFlow(f.id);
    notify("Flow duplicated");
    state.reload();
  }

  async function confirmDelete() {
    await demoApi.deleteFlow(pendingDelete.id);
    notify("Flow deleted");
    setPendingDelete(null);
    state.reload();
  }

  return (
    <div className="fade-in flex flex-col gap-4">
      <div className="flex justify-end">
        <Button variant="primary" icon={Plus} onClick={createFlow}>
          Create demo flow
        </Button>
      </div>

      <AsyncView
        state={state}
        empty={<EmptyState icon={Workflow} title="No demo flows yet" body="Create your first demo flow to define how ThenFLo demonstrates a feature." action={<Button variant="primary" icon={Plus} onClick={createFlow}>Create demo flow</Button>} />}
      >
        {(data) => (
          <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-3.5">
            {data.items.map((f) => (
              <Card key={f.id}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-pulseDim">
                      <Workflow size={15} className="text-pulseText" />
                    </div>
                    <div className="text-[14.5px] font-semibold text-ink">{f.name}</div>
                  </div>
                  <Badge status={f.enabled ? "Active" : "Disabled"} />
                </div>
                <div className="my-3 min-h-[34px] text-[12.5px] leading-relaxed text-ink2">{f.description}</div>
                <div className="mb-3.5 flex gap-5">
                  <Stat label="Steps" value={f.steps.length} />
                  <Stat label="Sessions" value={f.sessions} />
                  <Stat label="Success" value={`${f.successRate}%`} />
                </div>
                <div className="flex gap-2">
                  <Button variant="secondary" size="sm" onClick={() => navigate(`/dashboard/demo-flows/${f.id}`)}>
                    Edit steps
                  </Button>
                  <Button variant="ghost" size="sm" icon={Copy} onClick={() => duplicate(f)} />
                  <Button variant="ghost" size="sm" icon={f.enabled ? PauseCircle : Play} onClick={() => toggleEnabled(f)} />
                  <Button variant="ghost" size="sm" icon={Trash2} onClick={() => setPendingDelete(f)} />
                </div>
              </Card>
            ))}
          </div>
        )}
      </AsyncView>

      <ConfirmDialog
        open={!!pendingDelete}
        title="Delete demo flow"
        body={`This will permanently remove "${pendingDelete?.name}" and its steps.`}
        confirmLabel="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div>
      <div className="text-[10.5px] uppercase tracking-wide text-ink3">{label}</div>
      <div className="font-data text-[15px] font-semibold text-ink">{value}</div>
    </div>
  );
}
