import React, { useCallback, useState } from "react";
import { UserPlus, Trash2 } from "lucide-react";
import Card from "../components/ui/Card.jsx";
import Badge from "../components/ui/Badge.jsx";
import Button from "../components/ui/Button.jsx";
import DataTable from "../components/ui/DataTable.jsx";
import AsyncView from "../components/ui/AsyncView.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import Modal from "../components/ui/Modal.jsx";
import FormField from "../components/ui/FormField.jsx";
import { Select } from "../components/ui/FilterBar.jsx";
import { useAsync } from "../hooks/useAsync.js";
import { userApi } from "../services/api/userApi.js";
import { useToast } from "../store/ToastContext.jsx";
import { TEAM_ROLES } from "../utils/constants.js";
import { initials } from "../utils/format.js";

export default function Team() {
  const { notify } = useToast();
  const [inviteOpen, setInviteOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Editor");

  const state = useAsync(useCallback(() => userApi.listTeam(), []), []);

  async function invite() {
    if (!email.trim() || !email.includes("@")) {
      notify("Enter a valid email address", "error");
      return;
    }
    await userApi.inviteMember({ email, role });
    setInviteOpen(false);
    setEmail("");
    notify("Invitation sent");
    state.reload();
  }

  async function changeRole(member, newRole) {
    await userApi.changeRole(member.id, newRole);
    state.reload();
  }

  async function remove(member) {
    await userApi.removeMember(member.id);
    notify("Member removed");
    state.reload();
  }

  const columns = [
    {
      key: "name",
      header: "Name",
      render: (m) => (
        <div className="flex items-center gap-2.5">
          <div className="flex h-[26px] w-[26px] items-center justify-center rounded-full bg-pulseDim text-[11px] font-bold text-pulseText">
            {initials(m.name)}
          </div>
          <span className="font-medium text-ink">{m.name}</span>
        </div>
      ),
    },
    { key: "email", header: "Email", render: (m) => <span className="text-ink2">{m.email}</span> },
    { key: "role", header: "Role", render: (m) => <Select value={m.role} onChange={(v) => changeRole(m, v)} options={TEAM_ROLES} /> },
    { key: "status", header: "Status", render: (m) => <Badge status={m.status} /> },
    { key: "lastActive", header: "Last active", render: (m) => <span className="font-data text-ink2">{m.lastActive}</span> },
    {
      key: "actions",
      header: "",
      className: "text-right",
      render: (m) => (
        <button onClick={() => remove(m)} className="text-ink3 hover:text-danger">
          <Trash2 size={15} />
        </button>
      ),
    },
  ];

  return (
    <div className="fade-in flex flex-col gap-4">
      <div className="flex justify-end">
        <Button variant="primary" icon={UserPlus} onClick={() => setInviteOpen(true)}>
          Invite member
        </Button>
      </div>

      <Card padded={false}>
        <AsyncView
          state={state}
          empty={<EmptyState icon={UserPlus} title="No team members yet" body="Invite your team to help manage this ThenFLo workspace." />}
        >
          {(data) => <DataTable columns={columns} rows={data.items} rowKey={(r) => r.id} />}
        </AsyncView>
      </Card>

      <Modal
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        title="Invite member"
        footer={
          <>
            <Button variant="primary" onClick={invite}>Send invite</Button>
            <Button variant="secondary" onClick={() => setInviteOpen(false)}>Cancel</Button>
          </>
        }
      >
        <div className="flex flex-col gap-3.5">
          <FormField label="Email address" value={email} onChange={setEmail} hint="name@company.com" />
          <FormField label="Role" value={role} onChange={setRole} options={["Admin", "Editor", "Viewer"]} />
        </div>
      </Modal>
    </div>
  );
}
