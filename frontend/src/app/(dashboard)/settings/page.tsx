"use client";

import React, { useState } from "react";
import { useAppStore } from "@/lib/store";
import { PageHeader } from "@/components/page-header";
import {
  Settings,
  Key,
  Webhook,
  Sliders,
  Users,
  ShieldCheck,
  CheckCircle2,
  Eye,
  EyeOff,
  Save,
  Plus,
  Trash2,
} from "lucide-react";

export default function SettingsPage() {
  const { activeWorkspace, addToast } = useAppStore();

  const [activeTab, setActiveTab] = useState<"general" | "api_keys" | "webhooks" | "compliance" | "team">("general");

  // General state
  const [orgName, setOrgName] = useState(activeWorkspace.name);
  const [orgEmail, setOrgEmail] = useState("admin@apexvoice.ai");
  const [timezone, setTimezone] = useState("America/New_York");

  // API Keys state
  const [keys, setKeys] = useState({
    openai: "sk-proj-99482910481029481029",
    deepgram: "dg-live-8839201948102948",
    cartesia: "cart-prod-772910481029481",
    elevenlabs: "el-turbo-66291048102948",
    livekit: "lk-prod-key-552910481029",
  });
  const [showKey, setShowKey] = useState<Record<string, boolean>>({});

  // Webhooks
  const [webhooks, setWebhooks] = useState([
    { id: "wh-1", event: "call.completed", url: "https://api.scaleops.io/webhooks/voice/call-completed", status: "active" },
    { id: "wh-2", event: "appointment.booked", url: "https://api.scaleops.io/webhooks/voice/appointment-booked", status: "active" },
    { id: "wh-3", event: "lead.qualified", url: "https://api.scaleops.io/webhooks/voice/lead-qualified", status: "active" },
  ]);

  // Team
  const [teamMembers, setTeamMembers] = useState([
    { id: "u-1", name: "Alex DeVries", email: "alex@apexvoice.ai", role: "Owner / Admin", status: "active" },
    { id: "u-2", name: "Sarah Jenkins", email: "sarah@apexvoice.ai", role: "Voice Engineer", status: "active" },
    { id: "u-3", name: "Michael Chang", email: "m.chang@apexvoice.ai", role: "Telephony Specialist", status: "active" },
  ]);

  const toggleShowKey = (k: string) => {
    setShowKey((prev) => ({ ...prev, [k]: !prev[k] }));
  };

  const handleSaveSettings = () => {
    activeWorkspace.name = orgName;
    addToast({
      title: "Workspace Settings Saved",
      description: "Preferences and credentials updated across clusters.",
      type: "success",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-[#172033] tracking-tight">Workspace Settings</h1>
          <p className="text-xs text-[#78849A] mt-0.5">Manage organization profile, voice API keys, webhooks, and team access.</p>
        </div>

        <button
          onClick={handleSaveSettings}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#3157D5] hover:bg-[#2646B8] text-white text-xs font-semibold rounded-xl shadow-xs transition-all"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-[#E5EAF2] card-shadow overflow-x-auto">
        {[
          { id: "general", label: "Organization & Profile", icon: Settings },
          { id: "api_keys", label: "Voice Engine API Keys", icon: Key },
          { id: "webhooks", label: "Webhooks & Events", icon: Webhook },
          { id: "compliance", label: "Audio & DNC Compliance", icon: ShieldCheck },
          { id: "team", label: "Team & Permissions", icon: Users },
        ].map((tab) => {
          const Icon = tab.icon;
          const isCur = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                isCur ? "bg-[#3157D5] text-white shadow-2xs" : "text-[#78849A] hover:text-[#172033]"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="bg-white p-6 rounded-2xl border border-[#E5EAF2] card-shadow">
        {activeTab === "general" && (
          <div className="space-y-4 max-w-2xl text-xs">
            <div>
              <label className="block font-semibold text-[#172033] mb-1.5">Workspace / Company Name</label>
              <input
                type="text"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#F4F7FB] border border-[#E5EAF2] rounded-xl outline-none focus:border-[#3157D5]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#172033] mb-1.5">Primary Notification Email</label>
              <input
                type="email"
                value={orgEmail}
                onChange={(e) => setOrgEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#F4F7FB] border border-[#E5EAF2] rounded-xl outline-none focus:border-[#3157D5]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#172033] mb-1.5">Default Timezone</label>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#F4F7FB] border border-[#E5EAF2] rounded-xl font-medium outline-none focus:border-[#3157D5]"
              >
                <option value="America/New_York">Eastern Time (US & Canada)</option>
                <option value="America/Chicago">Central Time (US & Canada)</option>
                <option value="America/Los_Angeles">Pacific Time (US & Canada)</option>
                <option value="Europe/London">London (GMT)</option>
              </select>
            </div>
          </div>
        )}

        {activeTab === "api_keys" && (
          <div className="space-y-5 max-w-3xl text-xs">
            <div>
              <h3 className="text-sm font-bold text-[#172033]">Bring Your Own Voice API Credentials</h3>
              <p className="text-[#78849A] mt-0.5">Securely integrate your custom provider accounts for unlimited STT & TTS capacity.</p>
            </div>

            {Object.entries(keys).map(([provider, val]) => (
              <div key={provider} className="p-4 bg-[#F4F7FB] rounded-xl border border-[#E5EAF2] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#172033] uppercase">{provider} API Secret</span>
                  <span className="text-[10px] font-bold text-[#16A36A] bg-[#E8F7F0] px-2 py-0.5 rounded-full">
                    Connected
                  </span>
                </div>
                <div className="relative">
                  <input
                    type={showKey[provider] ? "text" : "password"}
                    defaultValue={val}
                    className="w-full px-3.5 py-2 bg-white border border-[#E5EAF2] rounded-xl font-mono text-xs outline-none focus:border-[#3157D5]"
                  />
                  <button
                    type="button"
                    onClick={() => toggleShowKey(provider)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#78849A] hover:text-[#172033]"
                  >
                    {showKey[provider] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "webhooks" && (
          <div className="space-y-4 max-w-3xl text-xs">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#172033]">Active Webhook Endpoints</h3>
                <p className="text-[#78849A]">Real-time JSON dispatch when voice events and qualification occur.</p>
              </div>
              <button
                onClick={() => {
                  addToast({ title: "Webhook Created", description: "Configured new endpoint listener.", type: "success" });
                }}
                className="px-3 py-1.5 bg-[#3157D5] text-white rounded-lg font-semibold"
              >
                + Add Endpoint
              </button>
            </div>

            <div className="space-y-3">
              {webhooks.map((wh) => (
                <div key={wh.id} className="p-3.5 bg-[#F4F7FB] rounded-xl border border-[#E5EAF2] flex items-center justify-between">
                  <div>
                    <span className="font-bold text-[#3157D5] font-mono text-[11px] block">{wh.event}</span>
                    <span className="font-mono text-[#172033] text-xs">{wh.url}</span>
                  </div>
                  <span className="text-[10px] font-bold text-[#16A36A] bg-[#E8F7F0] px-2 py-0.5 rounded-full">
                    {wh.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "compliance" && (
          <div className="space-y-5 max-w-2xl text-xs">
            <div>
              <h3 className="text-sm font-bold text-[#172033]">Compliance & Audio Encoding Preferences</h3>
              <p className="text-[#78849A]">Telephony parameters, voicemail detection, and national DNC registry filtering.</p>
            </div>

            <div className="space-y-3">
              <label className="flex items-start gap-3 p-3.5 bg-[#F4F7FB] rounded-xl border border-[#E5EAF2] cursor-pointer">
                <input type="checkbox" defaultChecked className="mt-0.5 text-[#3157D5] rounded" />
                <div>
                  <span className="font-bold text-[#172033] block">Automatic National DNC Scrubbing</span>
                  <p className="text-[11px] text-[#78849A]">Scrub phone numbers against Federal and state Do-Not-Call registries before dialing.</p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3.5 bg-[#F4F7FB] rounded-xl border border-[#E5EAF2] cursor-pointer">
                <input type="checkbox" defaultChecked className="mt-0.5 text-[#3157D5] rounded" />
                <div>
                  <span className="font-bold text-[#172033] block">Answering Machine & Voicemail Detection (AMD)</span>
                  <p className="text-[11px] text-[#78849A]">Automatically hang up or drop custom voicemail audio when an answering machine is detected.</p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3.5 bg-[#F4F7FB] rounded-xl border border-[#E5EAF2] cursor-pointer">
                <input type="checkbox" defaultChecked className="mt-0.5 text-[#3157D5] rounded" />
                <div>
                  <span className="font-bold text-[#172033] block">Call Recording Consent Disclosure</span>
                  <p className="text-[11px] text-[#78849A]">Automatically play &quot;This call is recorded for quality assurance&quot; in two-party consent jurisdictions.</p>
                </div>
              </label>
            </div>
          </div>
        )}

        {activeTab === "team" && (
          <div className="space-y-4 max-w-3xl text-xs">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#172033]">Organization Members</h3>
                <p className="text-[#78849A]">Manage user permissions and role assignments.</p>
              </div>
              <button
                onClick={() => {
                  addToast({ title: "Invite Dispatched", description: "Sent invitation email.", type: "success" });
                }}
                className="px-3 py-1.5 bg-[#3157D5] text-white rounded-lg font-semibold"
              >
                + Invite Member
              </button>
            </div>

            <div className="space-y-2">
              {teamMembers.map((m) => (
                <div key={m.id} className="p-3 bg-[#F4F7FB] rounded-xl border border-[#E5EAF2] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#3157D5] text-white flex items-center justify-center font-bold text-xs">
                      {m.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-[#172033]">{m.name}</p>
                      <p className="text-[11px] text-[#78849A]">{m.email}</p>
                    </div>
                  </div>
                  <span className="font-semibold text-[#3157D5] bg-[#EEF2FD] px-2.5 py-0.5 rounded-full text-[11px]">
                    {m.role}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
