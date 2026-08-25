"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAppStore } from "@/lib/store";
import {
  Wrench,
  FileText,
  Calendar,
  Radio,
  Globe,
  Users,
  PhoneCall,
  Table,
  Layers,
  Database,
  ExternalLink,
  Plus,
  CheckCircle2,
  Copy,
  Check,
  X,
  Code2,
  ArrowRight,
  Sparkles,
  Search,
} from "lucide-react";

interface ToolItem {
  id: string;
  name: string;
  description: string;
  category: "lead_gen" | "telephony" | "integrations" | "automations";
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  status: string;
  statusType: "connected" | "disconnected" | "ready";
  href?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function ToolsPage() {
  const { addToast } = useAppStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [googleSheetsConnected, setGoogleSheetsConnected] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [activeModal, setActiveModal] = useState<"widget" | "webhook" | "form" | null>(null);

  // Webhook modal state
  const [webhookUrl, setWebhookUrl] = useState("https://api.yourdomain.com/v1/voice/events");
  const [selectedEvents, setSelectedEvents] = useState<string[]>([
    "call.completed",
    "lead.qualified",
    "appointment.booked",
  ]);

  // Form modal state
  const [formName, setFormName] = useState("");
  const [formsList, setFormsList] = useState([
    { id: "f-1", name: "Inbound Lead Intake Form", submissions: 342, status: "Active" },
    { id: "f-2", name: "Solar Consultation Questionnaire", submissions: 189, status: "Active" },
    { id: "f-3", name: "Enterprise Callback Request", submissions: 94, status: "Active" },
  ]);

  const handleCopySnippet = () => {
    navigator.clipboard.writeText(
      `<script src="https://cdn.apexvoice.ai/widget.js" data-agent-id="agent-solar-1" async></script>`
    );
    setIsCopied(true);
    addToast({
      title: "Snippet Copied",
      description: "Widget script copied to clipboard.",
      type: "success",
    });
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handleSaveWebhook = () => {
    setActiveModal(null);
    addToast({
      title: "Webhook Configured",
      description: `Webhook listening on ${selectedEvents.length} events.`,
      type: "success",
    });
  };

  const handleCreateForm = () => {
    if (!formName.trim()) return;
    setFormsList((prev) => [
      { id: `f-${Date.now()}`, name: formName.trim(), submissions: 0, status: "Active" },
      ...prev,
    ]);
    setFormName("");
    setActiveModal(null);
    addToast({
      title: "Form Created",
      description: "New lead collection form is now live.",
      type: "success",
    });
  };

  const toolsList: ToolItem[] = [
    {
      id: "forms",
      name: "Forms",
      description: "Create and manage forms to collect data from your contacts and leads.",
      category: "lead_gen",
      icon: FileText,
      iconBg: "bg-[#EEF2FD]",
      iconColor: "text-[#3157D5]",
      status: `${formsList.length} Live Forms`,
      statusType: "connected",
      actionLabel: "Manage Forms",
      onAction: () => setActiveModal("form"),
    },
    {
      id: "appointments",
      name: "Appointments",
      description: "Manage appointment bookings from your voice agents and forms.",
      category: "telephony",
      icon: Calendar,
      iconBg: "bg-[#EEF2FD]",
      iconColor: "text-[#3157D5]",
      status: "Calendar Connected",
      statusType: "connected",
      href: "/appointments",
      actionLabel: "Open Calendar",
    },
    {
      id: "webhooks",
      name: "Webhooks",
      description: "Configure webhook endpoints to receive real-time event notifications.",
      category: "integrations",
      icon: Radio,
      iconBg: "bg-[#EEF2FD]",
      iconColor: "text-[#3157D5]",
      status: "2 Endpoints Active",
      statusType: "connected",
      actionLabel: "Configure Webhooks",
      onAction: () => setActiveModal("webhook"),
    },
    {
      id: "website_widget",
      name: "Website Widget",
      description: "Embed an interactive voice/chat widget on your website for visitor engagement.",
      category: "lead_gen",
      icon: Globe,
      iconBg: "bg-[#EEF2FD]",
      iconColor: "text-[#3157D5]",
      status: "Embed Script Ready",
      statusType: "ready",
      actionLabel: "Get Snippet",
      onAction: () => setActiveModal("widget"),
    },
    {
      id: "quick_crm",
      name: "Quick CRM",
      description: "Organize and manage your leads with a kanban board and contact filters.",
      category: "lead_gen",
      icon: Users,
      iconBg: "bg-[#EEF2FD]",
      iconColor: "text-[#3157D5]",
      status: "1,284 Leads Synced",
      statusType: "connected",
      href: "/contacts",
      actionLabel: "Open CRM",
    },
    {
      id: "incoming_connections",
      name: "Incoming Connections",
      description: "Manage incoming call routing and connect callers to your automated agents.",
      category: "telephony",
      icon: PhoneCall,
      iconBg: "bg-[#EEF2FD]",
      iconColor: "text-[#3157D5]",
      status: "4 SIP Trunks Connected",
      statusType: "connected",
      href: "/incoming-connections",
      actionLabel: "Manage Routing",
    },
    {
      id: "google_sheets",
      name: "Google Sheets",
      description: "Push appointment and form data to Google Sheets in real time.",
      category: "integrations",
      icon: Table,
      iconBg: "bg-[#EEF2FD]",
      iconColor: "text-[#3157D5]",
      status: googleSheetsConnected ? "Connected • Sheet Synced" : "Not connected",
      statusType: googleSheetsConnected ? "connected" : "disconnected",
      actionLabel: googleSheetsConnected ? "Disconnect" : "Connect",
      onAction: () => {
        setGoogleSheetsConnected((prev) => !prev);
        addToast({
          title: googleSheetsConnected ? "Google Sheets Disconnected" : "Google Sheets Connected",
          description: googleSheetsConnected
            ? "Sync paused."
            : "Target sheet: 'Apex Live Leads 2026' synced.",
          type: "success",
        });
      },
    },
    {
      id: "zapier_make",
      name: "Zapier & Make.com",
      description: "Trigger thousands of external apps and workflows on call turn completions.",
      category: "automations",
      icon: Layers,
      iconBg: "bg-[#EEF2FD]",
      iconColor: "text-[#3157D5]",
      status: "API Keys Configured",
      statusType: "connected",
      href: "/settings",
      actionLabel: "View API Keys",
    },
    {
      id: "crm_sync",
      name: "HubSpot & Salesforce Sync",
      description: "Bi-directional sync for call recordings, transcripts, and custom qualification fields.",
      category: "integrations",
      icon: Database,
      iconBg: "bg-[#EEF2FD]",
      iconColor: "text-[#3157D5]",
      status: "OAuth Active",
      statusType: "connected",
      href: "/settings",
      actionLabel: "Configure Sync",
    },
  ];

  const filteredTools = toolsList.filter((tool) => {
    const matchesSearch =
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      activeCategory === "all" || tool.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* 1. Page Header (Exact Match to Reference Style) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white rounded-3xl border border-[#E2E8F0] shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#3157D5] text-white flex items-center justify-center shadow-lg shadow-[#3157D5]/30 shrink-0">
            <Wrench className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-[#0F172A] tracking-tight">Tools</h1>
            <p className="text-xs text-[#64748B] mt-0.5">
              Access and configure your platform tools and integrations.
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search tools & integrations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-[#E2E8F0] rounded-xl text-xs text-[#0F172A] placeholder-[#94A3B8] outline-none focus:border-[#3157D5]"
          />
        </div>
      </div>

      {/* 2. Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: "all", label: "All Tools" },
          { id: "lead_gen", label: "Lead Capture & Forms" },
          { id: "telephony", label: "Telephony & Calls" },
          { id: "integrations", label: "Integrations & Sheets" },
          { id: "automations", label: "Automations" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveCategory(tab.id)}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
              activeCategory === tab.id
                ? "bg-[#3157D5] text-white shadow-md shadow-[#3157D5]/20"
                : "bg-white text-[#64748B] hover:text-[#0F172A] hover:bg-[#EEF2FD] border border-[#E2E8F0]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 3. Tools Responsive 3-Column Grid (Exact Match to Reference Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTools.map((tool) => {
          const Icon = tool.icon;
          return (
            <div
              key={tool.id}
              className="p-5 bg-white rounded-3xl border border-[#E2E8F0] hover:border-[#3157D5]/40 transition-all card-shadow flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${tool.iconBg} ${tool.iconColor} group-hover:scale-105 transition-transform`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#0F172A]">{tool.name}</h3>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mt-0.5 ${
                        tool.statusType === "connected"
                          ? "bg-[#EEF2FD] text-[#3157D5]"
                          : tool.statusType === "ready"
                          ? "bg-[#F1F5F9] text-[#0F172A]"
                          : "bg-[#F1F5F9] text-[#64748B]"
                      }`}>
                        {tool.status}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-[#64748B] leading-relaxed">
                  {tool.description}
                </p>
              </div>

              <div className="pt-3 border-t border-[#EDF2F7] flex items-center justify-between">
                {tool.href ? (
                  <Link
                    href={tool.href}
                    className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 bg-white hover:bg-[#3157D5] text-[#0F172A] hover:text-white border border-[#E2E8F0] hover:border-[#3157D5] rounded-xl text-xs font-bold transition-all shadow-2xs"
                  >
                    <span>{tool.actionLabel || "Open Tool"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                ) : (
                  <button
                    onClick={tool.onAction}
                    className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 bg-white hover:bg-[#3157D5] text-[#0F172A] hover:text-white border border-[#E2E8F0] hover:border-[#3157D5] rounded-xl text-xs font-bold transition-all shadow-2xs"
                  >
                    <span>{tool.actionLabel || "Configure"}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. Interactive Widget Snippet Modal */}
      {activeModal === "widget" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-2xl max-w-lg w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#EEF2FD] text-[#3157D5] flex items-center justify-center">
                  <Globe className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-[#0F172A]">Website Embed Widget</h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1.5 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#64748B]">
              Copy and paste this snippet right before the closing <code>&lt;/body&gt;</code> tag on your website or landing page:
            </p>

            <div className="p-4 bg-[#0F172A] text-white rounded-2xl font-mono text-xs overflow-x-auto relative">
              <pre className="text-[#93C5FD]">
                {`<script src="https://cdn.apexvoice.ai/widget.js"\n  data-agent-id="agent-solar-1"\n  data-color="#3157D5"\n  async>\n</script>`}
              </pre>
              <button
                onClick={handleCopySnippet}
                className="absolute top-3 right-3 px-3 py-1.5 bg-[#3157D5] hover:bg-[#2646B8] text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-xs"
              >
                {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{isCopied ? "Copied" : "Copy"}</span>
              </button>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setActiveModal(null)}
                className="px-5 py-2.5 bg-[#0F172A] text-white rounded-xl text-xs font-bold hover:bg-black transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Interactive Webhook Configuration Modal */}
      {activeModal === "webhook" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-2xl max-w-lg w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#EEF2FD] text-[#3157D5] flex items-center justify-center">
                  <Radio className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-[#0F172A]">Configure Webhook Endpoint</h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1.5 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-[#0F172A] block mb-1">Payload URL</label>
                <input
                  type="url"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#E2E8F0] rounded-xl outline-none focus:border-[#3157D5] font-mono text-xs text-[#0F172A]"
                />
              </div>

              <div>
                <label className="font-bold text-[#0F172A] block mb-1.5">Event Subscriptions</label>
                <div className="space-y-1.5">
                  {["call.completed", "lead.qualified", "appointment.booked", "tone.detected", "recording.ready"].map((ev) => (
                    <label key={ev} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedEvents.includes(ev)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedEvents([...selectedEvents, ev]);
                          } else {
                            setSelectedEvents(selectedEvents.filter((item) => item !== ev));
                          }
                        }}
                        className="rounded text-[#3157D5] focus:ring-[#3157D5]"
                      />
                      <span className="font-mono text-xs text-[#0F172A]">{ev}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E2E8F0]">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 text-xs font-bold text-[#64748B] hover:text-[#0F172A]"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveWebhook}
                className="px-5 py-2 bg-[#3157D5] hover:bg-[#2646B8] text-white rounded-xl text-xs font-bold transition-colors"
              >
                Save Endpoint
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. Interactive Lead Forms Modal */}
      {activeModal === "form" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-2xl max-w-lg w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#EEF2FD] text-[#3157D5] flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-[#0F172A]">Lead Collection Forms</h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1.5 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Create New Form Input */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="New form title (e.g. Roof Inspection Form)..."
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreateForm()}
                className="flex-1 px-3.5 py-2.5 bg-white border border-[#E2E8F0] rounded-xl text-xs text-[#0F172A] outline-none focus:border-[#3157D5]"
              />
              <button
                onClick={handleCreateForm}
                className="px-4 py-2.5 bg-[#3157D5] hover:bg-[#2646B8] text-white text-xs font-bold rounded-xl flex items-center gap-1 shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create</span>
              </button>
            </div>

            {/* Existing Forms List */}
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {formsList.map((f) => (
                <div
                  key={f.id}
                  className="flex items-center justify-between p-3 bg-white rounded-2xl border border-[#E2E8F0] hover:border-[#3157D5]/30 text-xs"
                >
                  <div>
                    <p className="font-bold text-[#0F172A]">{f.name}</p>
                    <p className="text-[10px] text-[#64748B] mt-0.5">{f.submissions} submissions collected</p>
                  </div>
                  <span className="text-[10px] font-bold bg-[#EEF2FD] text-[#3157D5] px-2 py-0.5 rounded-full">
                    {f.status}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2 border-t border-[#E2E8F0]">
              <button
                onClick={() => setActiveModal(null)}
                className="px-5 py-2.5 bg-[#0F172A] text-white rounded-xl text-xs font-bold hover:bg-black transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
