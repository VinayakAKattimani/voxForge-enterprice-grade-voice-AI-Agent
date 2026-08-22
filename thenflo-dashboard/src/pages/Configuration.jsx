import React, { useState } from "react";
import { Building2, Bot, Workflow, Volume2, ShieldCheck } from "lucide-react";
import Card, { SectionHeading } from "../components/ui/Card.jsx";
import FormField from "../components/ui/FormField.jsx";
import Button from "../components/ui/Button.jsx";
import { VerticalTabs } from "../components/ui/Tabs.jsx";
import { FLOW_NAMES } from "../services/mock/mockData.js";
import { useToast } from "../store/ToastContext.jsx";

const TABS = [
  { key: "product", label: "Product", icon: Building2 },
  { key: "ai", label: "AI", icon: Bot },
  { key: "demo", label: "Demo", icon: Workflow },
  { key: "voice", label: "Voice", icon: Volume2 },
  { key: "security", label: "Security", icon: ShieldCheck },
];

export default function Configuration() {
  const { notify } = useToast();
  const [tab, setTab] = useState("product");
  const [form, setForm] = useState({
    productName: "Northwind Retail Platform",
    productUrl: "https://app.northwindretail.com",
    demoUrl: "https://demo.thenflo.ai/northwind",
    environment: "Production",
    personality: "Friendly and concise",
    responseStyle: "Conversational",
    language: "English (US)",
    voice: "Aria \u2014 Warm",
    verbosity: "Balanced",
    defaultFlow: "Create Employee",
    sessionTimeout: "10",
    maxDuration: "20",
    sttProvider: "Deepgram Nova-2",
    ttsProvider: "ElevenLabs Turbo",
    micSensitivity: "Medium",
    allowedDomains: "app.northwindretail.com, *.northwindretail.com",
    authMethod: "OAuth 2.0",
    apiEndpoint: "https://api.thenflo.ai/v1",
  });
  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));

  function save() {
    notify("Configuration saved");
  }

  return (
    <div className="fade-in flex gap-5 max-md:flex-col">
      <VerticalTabs tabs={TABS} active={tab} onChange={setTab} />

      <div className="min-w-0 flex-1">
        <Card>
          {tab === "product" && (
            <div className="flex flex-col gap-4">
              <SectionHeading title="Product" subtitle="Basic information about the connected product" />
              <FormField label="Product name" value={form.productName} onChange={set("productName")} />
              <FormField label="Product URL" value={form.productUrl} onChange={set("productUrl")} />
              <FormField label="Demo URL" value={form.demoUrl} onChange={set("demoUrl")} hint="The public link shared with your customers (/demo/:workspace)." />
              <FormField label="Environment" value={form.environment} onChange={set("environment")} options={["Production", "Staging", "Sandbox"]} />
            </div>
          )}
          {tab === "ai" && (
            <div className="flex flex-col gap-4">
              <SectionHeading title="AI" subtitle="How ThenFLo's AI communicates during a demo" />
              <FormField label="AI personality" value={form.personality} onChange={set("personality")} />
              <FormField label="Response style" value={form.responseStyle} onChange={set("responseStyle")} options={["Conversational", "Formal", "Direct"]} />
              <FormField label="Language" value={form.language} onChange={set("language")} options={["English (US)", "English (UK)", "Spanish", "French", "German"]} />
              <FormField label="Voice" value={form.voice} onChange={set("voice")} options={["Aria \u2014 Warm", "Kai \u2014 Neutral", "Nova \u2014 Energetic"]} />
              <FormField label="Response verbosity" value={form.verbosity} onChange={set("verbosity")} options={["Concise", "Balanced", "Detailed"]} />
            </div>
          )}
          {tab === "demo" && (
            <div className="flex flex-col gap-4">
              <SectionHeading title="Demo" subtitle="Default demo behavior and session limits" />
              <FormField label="Default demo flow" value={form.defaultFlow} onChange={set("defaultFlow")} options={FLOW_NAMES} />
              <FormField label="Session timeout (minutes)" value={form.sessionTimeout} onChange={set("sessionTimeout")} hint="Session ends automatically after this period of inactivity." />
              <FormField label="Maximum session duration (minutes)" value={form.maxDuration} onChange={set("maxDuration")} />
            </div>
          )}
          {tab === "voice" && (
            <div className="flex flex-col gap-4">
              <SectionHeading title="Voice" subtitle="Speech-to-text and text-to-speech configuration" />
              <FormField label="STT provider" value={form.sttProvider} onChange={set("sttProvider")} options={["Deepgram Nova-2", "Whisper Large-v3", "AssemblyAI"]} />
              <FormField label="TTS provider" value={form.ttsProvider} onChange={set("ttsProvider")} options={["ElevenLabs Turbo", "Amazon Polly", "PlayHT"]} />
              <FormField label="Microphone sensitivity" value={form.micSensitivity} onChange={set("micSensitivity")} options={["Low", "Medium", "High"]} />
            </div>
          )}
          {tab === "security" && (
            <div className="flex flex-col gap-4">
              <SectionHeading title="Security" subtitle="API access and authentication for this instance" />
              <FormField label="API endpoint" value={form.apiEndpoint} onChange={set("apiEndpoint")} hint="Routed through the ThenFLo API Gateway \u2014 never a direct backend service URL." />
              <FormField label="Allowed domains" value={form.allowedDomains} onChange={set("allowedDomains")} hint="Comma-separated list of domains the automation engine may operate on." />
              <FormField label="Authentication method" value={form.authMethod} onChange={set("authMethod")} options={["OAuth 2.0", "API key", "SAML SSO"]} />
            </div>
          )}
          <div className="mt-5 flex gap-2 border-t border-line pt-4">
            <Button variant="primary" onClick={save}>Save changes</Button>
            <Button variant="secondary" onClick={() => notify("Changes reset")}>Reset</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
