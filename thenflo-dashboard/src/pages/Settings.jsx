import React, { useState } from "react";
import { Building2, Users, Bell, KeyRound, Puzzle, CreditCard, Trash2, Plus } from "lucide-react";
import Card, { SectionHeading } from "../components/ui/Card.jsx";
import FormField from "../components/ui/FormField.jsx";
import Button from "../components/ui/Button.jsx";
import Badge from "../components/ui/Badge.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import { VerticalTabs } from "../components/ui/Tabs.jsx";
import { useToast } from "../store/ToastContext.jsx";
import { useAuth } from "../hooks/useAuth.js";

const TABS = [
  { key: "workspace", label: "Workspace", icon: Building2 },
  { key: "profile", label: "Profile", icon: Users },
  { key: "notifications", label: "Notifications", icon: Bell },
  { key: "security", label: "Security", icon: KeyRound },
  { key: "api", label: "API keys", icon: Puzzle },
  { key: "integrations", label: "Integrations", icon: Puzzle },
  { key: "billing", label: "Billing preferences", icon: CreditCard },
];

const API_KEYS = [
  { name: "Production key", value: "sk_live_\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022a91f", created: "2026-03-11" },
  { name: "Staging key", value: "sk_test_\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022c204", created: "2026-05-02" },
];

const INTEGRATIONS = [
  { name: "Slack", status: "Connected" },
  { name: "Salesforce", status: "Disabled" },
  { name: "HubSpot", status: "Disabled" },
];

export default function Settings() {
  const { notify } = useToast();
  const { user } = useAuth();
  const [tab, setTab] = useState("workspace");

  return (
    <div className="fade-in flex gap-5 max-md:flex-col">
      <VerticalTabs tabs={TABS} active={tab} onChange={setTab} />
      <div className="min-w-0 flex-1">
        <Card>
          {tab === "workspace" && (
            <div className="flex flex-col gap-4">
              <SectionHeading title="Workspace" subtitle="Company information tied to this ThenFLo instance" />
              <FormField label="Company name" value={user?.company || "Northwind Retail"} onChange={() => {}} />
              <FormField label="Workspace URL" value="northwind.thenflo.io" onChange={() => {}} />
              <FormField label="Time zone" value="America/Chicago" onChange={() => {}} options={["America/Chicago", "America/New_York", "Europe/London", "Asia/Kolkata"]} />
              <div><Button variant="primary" onClick={() => notify("Workspace updated")}>Save changes</Button></div>
            </div>
          )}
          {tab === "profile" && (
            <div className="flex flex-col gap-4">
              <SectionHeading title="Profile" subtitle="Your personal account details" />
              <FormField label="Full name" value={user?.name || ""} onChange={() => {}} />
              <FormField label="Email" value={user?.email || ""} onChange={() => {}} />
              <FormField label="Role" value={user?.role || ""} onChange={() => {}} />
              <div><Button variant="primary" onClick={() => notify("Profile updated")}>Save changes</Button></div>
            </div>
          )}
          {tab === "notifications" && (
            <div className="flex flex-col">
              <SectionHeading title="Notifications" subtitle="Choose what you hear about" />
              {["Demo session completed", "Automation failure", "New document processed", "Weekly analytics summary"].map((n, i) => (
                <label key={n} className={`flex items-center justify-between py-3 text-[13.5px] text-ink ${i > 0 ? "border-t border-line" : ""}`}>
                  {n}
                  <input type="checkbox" defaultChecked={i < 3} className="h-4 w-4" />
                </label>
              ))}
            </div>
          )}
          {tab === "security" && (
            <div className="flex flex-col gap-4">
              <SectionHeading title="Security" subtitle="Protect access to your workspace" />
              <FormField label="Password" value="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" onChange={() => {}} type="password" />
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[13.5px] font-semibold text-ink">Two-factor authentication</div>
                  <div className="text-[12px] text-ink2">Adds an extra step when signing in.</div>
                </div>
                <Badge status="Active" />
              </div>
              <div><Button variant="secondary" onClick={() => notify("Password updated")}>Change password</Button></div>
            </div>
          )}
          {tab === "api" && (
            <div>
              <SectionHeading
                title="API keys"
                subtitle="Used to authenticate requests to the ThenFLo API"
                action={<Button variant="primary" size="sm" icon={Plus} onClick={() => notify("API key created")}>New key</Button>}
              />
              <div className="flex flex-col">
                {API_KEYS.map((k, i) => (
                  <div key={k.name} className={`flex items-center justify-between py-3 ${i > 0 ? "border-t border-line" : ""}`}>
                    <div>
                      <div className="text-[13.5px] font-semibold text-ink">{k.name}</div>
                      <div className="font-data mt-0.5 text-[12px] text-ink2">{k.value}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[12px] text-ink3">Created {k.created}</span>
                      <button onClick={() => notify("API key revoked")} className="text-ink3 hover:text-danger">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {tab === "integrations" && (
            <div>
              <SectionHeading title="Integrations" subtitle="Connect ThenFLo to the rest of your stack" />
              <div className="flex flex-col">
                {INTEGRATIONS.map((it, i) => (
                  <div key={it.name} className={`flex items-center justify-between py-3 ${i > 0 ? "border-t border-line" : ""}`}>
                    <div className="text-[13.5px] font-semibold text-ink">{it.name}</div>
                    <div className="flex items-center gap-3">
                      <Badge status={it.status} />
                      <Button variant="secondary" size="sm" onClick={() => notify(`${it.name} settings updated`)}>
                        {it.status === "Connected" ? "Manage" : "Connect"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {tab === "billing" && (
            <EmptyState
              icon={CreditCard}
              title="Billing isn't set up yet"
              body="Full plan management and payment methods live under Billing in the sidebar. This tab will hold billing-related notification preferences once available."
            />
          )}
        </Card>
      </div>
    </div>
  );
}
