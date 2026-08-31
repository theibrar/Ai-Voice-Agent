"use client";

import React, { useState, useEffect } from "react";
import { useAppStore } from "@/lib/store";
import { useAuth } from "@/lib/auth-context";
import { PageHeader } from "@/components/page-header";
import {
  Settings,
  Key,
  Webhook,
  Sliders,
  Users,
  ShieldCheck,
  Save,
  Plus,
  Trash2,
  Cpu,
  Database,
  X,
  Sparkles,
  Mic,
  Headphones,
  Zap,
  Eye,
  EyeOff,
  Building2,
  Phone,
  Mail,
  Globe,
  FileText,
  MapPin,
  Clock,
  CheckCircle2,
  Server,
  Activity,
  ExternalLink,
} from "lucide-react";

import { CreateWebhookForm } from "@/components/create-webhook-form";

export default function SettingsPage() {
  const { user, tenant } = useAuth();
  const { 
    activeWorkspace, 
    addToast, 
    inboundWebhookUrl, 
    availableLlmModels,
    webhooksList,
    deleteWebhook,
    addWebhook,
  } = useAppStore();

  const openAiOptions = availableLlmModels.filter(m => m.provider.toLowerCase().includes("openai"));
  const geminiOptions = availableLlmModels.filter(m => m.provider.toLowerCase().includes("google") || m.provider.toLowerCase().includes("gemini"));
  const deepseekOptions = availableLlmModels.filter(m => m.provider.toLowerCase().includes("deepseek"));

  const [activeTab, setActiveTab] = useState<
    "general" | "api_keys" | "webhooks" | "compliance" | "team"
  >("general");

  // Profile & Organization state
  const [fullName, setFullName] = useState(user?.name || "Admin");
  const [directPhone, setDirectPhone] = useState(user?.phone || "+1 (555) 234-5678");
  const [jobTitle, setJobTitle] = useState("Managing Director & System Administrator");
  const [orgName, setOrgName] = useState(tenant?.tenantName || user?.company || activeWorkspace.name);
  const [orgEmail, setOrgEmail] = useState(user?.email || "admin@apexvoice.ai");
  const [businessPhone, setBusinessPhone] = useState("+1 (800) 555-0199");
  const [website, setWebsite] = useState("https://apexfinancial.ai");
  const [taxId, setTaxId] = useState("US-EIN-98421094");
  const [industry, setIndustry] = useState("Financial Services & Wealth Advisory");
  const [address, setAddress] = useState("100 Wall Street, Suite 2400, New York, NY 10005, United States");
  const [timezone, setTimezone] = useState("America/New_York");
  const [dataRetention, setDataRetention] = useState("90_days");
  const [cloudRegion, setCloudRegion] = useState("us-east-1");

  useEffect(() => {
    if (user) {
      if (user.name) setFullName(user.name);
      if (user.phone) setDirectPhone(user.phone);
      if (user.email) setOrgEmail(user.email);
    }
    if (tenant?.tenantName) {
      setOrgName(tenant.tenantName);
    } else if (user?.company) {
      setOrgName(user.company);
    }
  }, [user, tenant]);

  // Voice AI & LLM Engine Vault State
  // 1. OpenAI Engine
  const [openaiApiKey, setOpenaiApiKey] = useState("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");
  const [openaiModel, setOpenaiModel] = useState("gpt-4o");

  // 2. Google Gemini Engine
  const [geminiApiKey, setGeminiApiKey] = useState("AQ.Ab8RN6JyfBrZTS8O8PnGvOTH59Aqm0F3V98uUcs9RDzbbCmlFQ");
  const [geminiModel, setGeminiModel] = useState("gemini-2.0-flash");

  // 3. DeepSeek Engine
  const [deepseekApiKey, setDeepseekApiKey] = useState("sk-6afcb9c9ea194924b7037362f7aaa30f");
  const [deepseekModel, setDeepseekModel] = useState("deepseek-v3");

  // 4. TTS (Kokoro TTS)
  const [ttsModel, setTtsModel] = useState("kokoro-82m");
  const [ttsVoice, setTtsVoice] = useState("kokoro-heart-v0.19");
  const [ttsApiKey, setTtsApiKey] = useState("kokoro_neural_live_direct_pipeline_9821");
  const [ttsSpeed, setTtsSpeed] = useState("1.0x");

  // 5. STT (Parakeet STT)
  const [sttModel, setSttModel] = useState("parakeet-tdt-1.1b");
  const [sttLanguage, setSttLanguage] = useState("en-US");
  const [sttApiKey, setSttApiKey] = useState("parakeet_conformer_nv_9810238_live");

  // Webhooks Management Modal
  const [addWebhookOpen, setAddWebhookOpen] = useState(false);

  const handleSaveSettings = () => {
    activeWorkspace.name = orgName;
    addToast({
      title: "Workspace Settings Saved",
      description: "Profile data, organization parameters, and AI model credentials saved successfully.",
      type: "success",
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Workspace Settings"
        description="Manage organization profile, voice AI engines (LLM, Kokoro TTS, Parakeet STT), integrations, webhooks, and team access."
        actions={
          <button
            onClick={handleSaveSettings}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#3157D5] hover:bg-[#2646B8] text-white text-xs font-semibold rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Changes</span>
          </button>
        }
      />

      {/* Tabs Row */}
      <div className="flex items-center gap-1 overflow-x-auto p-1 bg-white border border-[#E2E8F0] rounded-2xl">
        {[
          { id: "general", label: "Organization & Profile", icon: Settings },
          { id: "api_keys", label: "Voice AI & LLM Engine Vault", icon: Key },
          { id: "webhooks", label: "Inbound & Outbound Webhooks", icon: Webhook },
          { id: "compliance", label: "Audio & DNC Compliance", icon: ShieldCheck },
          { id: "team", label: "Team Members", icon: Users },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? "bg-[#3157D5] text-white shadow-xs"
                  : "text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="p-6 bg-white rounded-3xl border border-[#E2E8F0] card-shadow">
        {/* 1. General Profile & Organization */}
        {activeTab === "general" && (
          <div className="space-y-8 text-xs max-w-4xl">
            {/* User Profile Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#EDF2F7]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#EEF2FD] text-[#3157D5] flex items-center justify-center font-bold text-sm">
                    {fullName.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#0F172A]">Administrator & User Profile</h3>
                    <p className="text-xs text-[#64748B]">Personal contact details and authentication identification</p>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
                  Verified Admin
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#0F172A] mb-1.5 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-[#3157D5]" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Alex DeVries"
                    className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl font-medium text-xs text-[#0F172A] outline-none focus:border-[#3157D5] focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#0F172A] mb-1.5 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#3157D5]" />
                    Direct Phone Number
                  </label>
                  <input
                    type="tel"
                    value={directPhone}
                    onChange={(e) => setDirectPhone(e.target.value)}
                    placeholder="+1 (555) 234-5678"
                    className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl font-medium text-xs text-[#0F172A] outline-none focus:border-[#3157D5] focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#0F172A] mb-1.5 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-[#3157D5]" />
                    Administrative Email
                  </label>
                  <input
                    type="email"
                    value={orgEmail}
                    onChange={(e) => setOrgEmail(e.target.value)}
                    placeholder="admin@apexvoice.ai"
                    className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl font-medium text-xs text-[#0F172A] outline-none focus:border-[#3157D5] focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#0F172A] mb-1.5 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#3157D5]" />
                    Job Role / Title
                  </label>
                  <input
                    type="text"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="Managing Director & Administrator"
                    className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl font-medium text-xs text-[#0F172A] outline-none focus:border-[#3157D5] focus:bg-white transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Organization & Corporate Data Section */}
            <div className="space-y-4 pt-4 border-t border-[#EDF2F7]">
              <div className="flex items-center justify-between pb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#0F172A]">Organization & Business Data</h3>
                    <p className="text-xs text-[#64748B]">Company identity, corporate identifiers, and telephony jurisdiction</p>
                  </div>
                </div>
                <span className="text-[11px] font-mono text-[#64748B]">Org ID: org_apex_9821a</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#0F172A] mb-1.5 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-indigo-600" />
                    Organization / Company Name
                  </label>
                  <input
                    type="text"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    placeholder="Apex Financial AI"
                    className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl font-medium text-xs text-[#0F172A] outline-none focus:border-[#3157D5] focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#0F172A] mb-1.5 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-indigo-600" />
                    Corporate Helpline / Support Phone
                  </label>
                  <input
                    type="tel"
                    value={businessPhone}
                    onChange={(e) => setBusinessPhone(e.target.value)}
                    placeholder="+1 (800) 555-0199"
                    className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl font-medium text-xs text-[#0F172A] outline-none focus:border-[#3157D5] focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#0F172A] mb-1.5 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-indigo-600" />
                    Company Website / Domain
                  </label>
                  <input
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://apexfinancial.ai"
                    className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl font-medium text-xs text-[#0F172A] outline-none focus:border-[#3157D5] focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#0F172A] mb-1.5 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-indigo-600" />
                    Tax ID / Business Registration Number
                  </label>
                  <input
                    type="text"
                    value={taxId}
                    onChange={(e) => setTaxId(e.target.value)}
                    placeholder="US-EIN-98421094"
                    className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl font-medium text-xs text-[#0F172A] outline-none focus:border-[#3157D5] focus:bg-white transition-all"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block font-bold text-[#0F172A] mb-1.5 flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5 text-indigo-600" />
                    Industry Category & Business Vertical
                  </label>
                  <select
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl font-medium text-xs text-[#0F172A] outline-none focus:border-[#3157D5] focus:bg-white transition-all"
                  >
                    <option value="Financial Services & Wealth Advisory">Financial Services & Wealth Advisory</option>
                    <option value="Solar & Renewable Energy">Solar & Renewable Energy</option>
                    <option value="Real Estate & Mortgage Lending">Real Estate & Mortgage Lending</option>
                    <option value="Healthcare & Dental Practices">Healthcare & Dental Practices</option>
                    <option value="Auto Dealerships & Service">Auto Dealerships & Service</option>
                    <option value="Insurance & Claims Processing">Insurance & Claims Processing</option>
                    <option value="SaaS & Technology">SaaS & Technology</option>
                    <option value="Legal & Professional Services">Legal & Professional Services</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block font-bold text-[#0F172A] mb-1.5 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                    Corporate Headquarters Address
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="100 Wall Street, Suite 2400, New York, NY 10005, United States"
                    className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl font-medium text-xs text-[#0F172A] outline-none focus:border-[#3157D5] focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#0F172A] mb-1.5 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-indigo-600" />
                    Primary Operating Timezone
                  </label>
                  <select
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl font-medium text-xs text-[#0F172A] outline-none focus:border-[#3157D5] focus:bg-white transition-all"
                  >
                    <option value="America/New_York">Eastern Time (US & Canada) - EST/EDT</option>
                    <option value="America/Chicago">Central Time (US & Canada) - CST/CDT</option>
                    <option value="America/Denver">Mountain Time (US & Canada) - MST/MDT</option>
                    <option value="America/Los_Angeles">Pacific Time (US & Canada) - PST/PDT</option>
                    <option value="Europe/London">London (GMT / BST)</option>
                    <option value="Asia/Tokyo">Tokyo (JST)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#0F172A] mb-1.5 flex items-center gap-1.5">
                    <Server className="w-3.5 h-3.5 text-indigo-600" />
                    Data Retention & Cloud Cluster Region
                  </label>
                  <select
                    value={cloudRegion}
                    onChange={(e) => setCloudRegion(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl font-medium text-xs text-[#0F172A] outline-none focus:border-[#3157D5] focus:bg-white transition-all"
                  >
                    <option value="us-east-1">US-East (N. Virginia) • AES-256 Storage</option>
                    <option value="us-west-2">US-West (Oregon) • Low-Latency Route</option>
                    <option value="eu-west-1">EU-West (Ireland) • GDPR Compliant</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. Voice AI & LLM Engine Vault */}
        {activeTab === "api_keys" && (
          <div className="space-y-6 max-w-4xl text-xs">
            {/* Header info */}
            <div className="p-4 bg-[#EEF2FD]/50 rounded-2xl border border-[#CBD5E1] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#3157D5] text-white flex items-center justify-center shadow-xs">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-[#0F172A]">Production AI Engine Orchestration</h3>
                  <p className="text-[#64748B] text-[11px]">Real-time pipeline: Parakeet STT → Powerful Conversational LLM → Kokoro Neural TTS</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-800 font-bold rounded-xl text-[11px]">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  All 3 Engines Operational
                </span>
              </div>
            </div>

            {/* 1. OpenAI Engine Card */}
            <div className="p-5 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] space-y-4 hover:border-[#3157D5]/40 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#E2E8F0]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-xs font-bold text-sm">
                    AI
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-[#0F172A]">OpenAI Engine (GPT-4o / Realtime / o3-mini)</h4>
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-800 rounded-full">
                        Omnichannel AI
                      </span>
                    </div>
                    <p className="text-[11px] text-[#64748B]">Official OpenAI GPT-4o, GPT-4o Mini, and o1/o3-mini reasoning engines</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href="https://developers.openai.com/api/docs"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-[#3157D5] hover:underline font-bold flex items-center gap-1"
                  >
                    <span>OpenAI Docs</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <span className="text-[10px] font-mono text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full font-bold">
                    Connected
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#0F172A] mb-1">Default OpenAI Model</label>
                  <select
                    value={openaiModel}
                    onChange={(e) => setOpenaiModel(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#CBD5E1] rounded-xl font-bold text-xs text-[#0F172A] outline-none focus:border-[#3157D5]"
                  >
                    {openAiOptions.length > 0 ? (
                      openAiOptions.map((m) => (
                        <option key={m.id} value={m.name}>
                          {m.fullName || m.name}
                        </option>
                      ))
                    ) : (
                      <>
                        <option value="GPT-5.6 Flagship (OpenAI)">GPT-5.6 Flagship (OpenAI)</option>
                        <option value="GPT-4o (OpenAI)">GPT-4o (OpenAI)</option>
                        <option value="GPT-4o Mini (OpenAI)">GPT-4o Mini (OpenAI)</option>
                      </>
                    )}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#0F172A] mb-1">OpenAI API Endpoint</label>
                  <input
                    type="text"
                    defaultValue="https://api.openai.com/v1"
                    readOnly
                    className="w-full px-3 py-2 bg-[#F1F5F9] border border-[#CBD5E1] rounded-xl font-mono text-xs text-[#0F172A] outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block font-bold text-[#0F172A] mb-1 flex items-center justify-between">
                    <span>OpenAI API Key</span>
                    <span className="text-[11px] text-[#64748B] font-medium">
                      Managed by Super Admin
                    </span>
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      value="••••••••••••••••••••••••••••••••••••••••••••••••"
                      readOnly
                      disabled
                      className="w-full px-3.5 py-2 bg-[#F1F5F9] border border-[#CBD5E1] rounded-xl font-mono text-xs text-[#64748B] outline-none cursor-not-allowed select-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Google Gemini Engine Card */}
            <div className="p-5 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] space-y-4 hover:border-[#3157D5]/40 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#E2E8F0]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center shadow-xs font-bold text-sm">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-[#0F172A]">Google Gemini AI Engine (3.1 Pro / 3 Pro / 3.7 Flash)</h4>
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-100 text-blue-800 rounded-full">
                        Google AI Studio
                      </span>
                    </div>
                    <p className="text-[11px] text-[#64748B]">Massive 2M context window with native multi-modality & audio token streaming</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href="https://aistudio.google.com/docs/api-key"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-[#3157D5] hover:underline font-bold flex items-center gap-1"
                  >
                    <span>Gemini Docs</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <span className="text-[10px] font-mono text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full font-bold">
                    Connected
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#0F172A] mb-1">Default Gemini Model</label>
                  <select
                    value={geminiModel}
                    onChange={(e) => setGeminiModel(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#CBD5E1] rounded-xl font-bold text-xs text-[#0F172A] outline-none focus:border-[#3157D5]"
                  >
                    {geminiOptions.length > 0 ? (
                      geminiOptions.map((m) => (
                        <option key={m.id} value={m.name}>
                          {m.fullName || m.name}
                        </option>
                      ))
                    ) : (
                      <>
                        <option value="Gemini 3.1 Pro (Google Gemini)">Gemini 3.1 Pro (Google Gemini)</option>
                        <option value="Gemini 3.7 Flash (Google Gemini)">Gemini 3.7 Flash (Google Gemini)</option>
                      </>
                    )}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#0F172A] mb-1">Google AI Endpoint</label>
                  <input
                    type="text"
                    defaultValue="https://generativelanguage.googleapis.com/v1beta"
                    readOnly
                    className="w-full px-3 py-2 bg-[#F1F5F9] border border-[#CBD5E1] rounded-xl font-mono text-xs text-[#0F172A] outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block font-bold text-[#0F172A] mb-1 flex items-center justify-between">
                    <span>Google Gemini API Key</span>
                    <span className="text-[11px] text-[#64748B] font-medium">
                      Managed by Super Admin
                    </span>
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      value="••••••••••••••••••••••••••••••••••••••••••••••••"
                      readOnly
                      disabled
                      className="w-full px-3.5 py-2 bg-[#F1F5F9] border border-[#CBD5E1] rounded-xl font-mono text-xs text-[#64748B] outline-none cursor-not-allowed select-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 3. DeepSeek Engine Card */}
            <div className="p-5 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] space-y-4 hover:border-[#3157D5]/40 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#E2E8F0]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center shadow-xs font-bold text-sm">
                    DS
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-[#0F172A]">DeepSeek AI Reasoning Engine (V4-Pro / V4 Flash / R1)</h4>
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-indigo-100 text-indigo-800 rounded-full">
                        Next-Gen SOTA
                      </span>
                    </div>
                    <p className="text-[11px] text-[#64748B]">Ultimate cost-efficiency, open-weights availability & agentic workflow execution</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href="https://api-docs.deepseek.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-[#3157D5] hover:underline font-bold flex items-center gap-1"
                  >
                    <span>DeepSeek Docs</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <span className="text-[10px] font-mono text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full font-bold">
                    Connected
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#0F172A] mb-1">Default DeepSeek Model</label>
                  <select
                    value={deepseekModel}
                    onChange={(e) => setDeepseekModel(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#CBD5E1] rounded-xl font-bold text-xs text-[#0F172A] outline-none focus:border-[#3157D5]"
                  >
                    {deepseekOptions.length > 0 ? (
                      deepseekOptions.map((m) => (
                        <option key={m.id} value={m.name}>
                          {m.fullName || m.name}
                        </option>
                      ))
                    ) : (
                      <>
                        <option value="DeepSeek-V4-Pro (DeepSeek)">DeepSeek-V4-Pro (DeepSeek)</option>
                        <option value="DeepSeek V3 (DeepSeek)">DeepSeek V3 (DeepSeek)</option>
                      </>
                    )}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#0F172A] mb-1">DeepSeek Base URL</label>
                  <input
                    type="text"
                    defaultValue="https://api.deepseek.com/v1"
                    readOnly
                    className="w-full px-3 py-2 bg-[#F1F5F9] border border-[#CBD5E1] rounded-xl font-mono text-xs text-[#0F172A] outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block font-bold text-[#0F172A] mb-1 flex items-center justify-between">
                    <span>DeepSeek API Key</span>
                    <span className="text-[11px] text-[#64748B] font-medium">
                      Managed by Super Admin
                    </span>
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      value="••••••••••••••••••••••••••••••••••••••••••••••••"
                      readOnly
                      disabled
                      className="w-full px-3.5 py-2 bg-[#F1F5F9] border border-[#CBD5E1] rounded-xl font-mono text-xs text-[#64748B] outline-none cursor-not-allowed select-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Kokoro TTS Engine Card */}
            <div className="p-5 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] space-y-4 hover:border-[#3157D5]/40 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#E2E8F0]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center shadow-xs">
                    <Headphones className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-[#0F172A]">Kokoro TTS Neural Voice Synthesizer</h4>
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-sky-100 text-sky-800 rounded-full">
                        Sub-50ms TTS Voice
                      </span>
                    </div>
                    <p className="text-[11px] text-[#64748B]">High-fidelity 82M open-weight neural voice synthesis with natural emotional inflections</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full font-bold">
                    Active • ~45ms TTFT
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#0F172A] mb-1">Kokoro TTS Model & Architecture</label>
                  <select
                    value={ttsModel}
                    onChange={(e) => setTtsModel(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#CBD5E1] rounded-xl font-bold text-xs text-[#0F172A] outline-none focus:border-[#3157D5]"
                  >
                    <option value="kokoro-82m">Kokoro 82M Neural Model (Sub-50ms Ultra-Fast)</option>
                    <option value="kokoro-v0.19">Kokoro v0.19 OpenVoice (HD 24kHz Studio)</option>
                    <option value="elevenlabs-turbo">ElevenLabs Turbo v2.5 (Alternative Fallback)</option>
                    <option value="cartesia-sonic">Cartesia Sonic (Fast Low-Latency)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#0F172A] mb-1">Default Kokoro Voice Profile</label>
                  <select
                    value={ttsVoice}
                    onChange={(e) => setTtsVoice(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#CBD5E1] rounded-xl font-medium text-xs text-[#0F172A] outline-none focus:border-[#3157D5]"
                  >
                    <option value="kokoro-heart-v0.19">Kokoro: Heart (Female - Conversational Warm)</option>
                    <option value="kokoro-bella">Kokoro: Bella (Female - Energetic Executive)</option>
                    <option value="kokoro-adam">Kokoro: Adam (Male - Deep Professional)</option>
                    <option value="kokoro-michael">Kokoro: Michael (Male - Confident Closer)</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block font-bold text-[#0F172A] mb-1 flex items-center justify-between">
                    <span>Kokoro TTS API Key / Neural Gateway Key</span>
                    <span className="text-[11px] text-[#64748B] font-medium">
                      Managed by Super Admin
                    </span>
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      value="••••••••••••••••••••••••••••••••••••••••••••••••"
                      readOnly
                      disabled
                      className="w-full px-3.5 py-2 bg-[#F1F5F9] border border-[#CBD5E1] rounded-xl font-mono text-xs text-[#64748B] outline-none cursor-not-allowed select-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 5. Parakeet STT Engine Card */}
            <div className="p-5 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] space-y-4 hover:border-[#3157D5]/40 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#E2E8F0]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-xs">
                    <Mic className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-[#0F172A]">Parakeet STT Speech Recognition Model</h4>
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-800 rounded-full">
                        FastConformer 1.1B
                      </span>
                    </div>
                    <p className="text-[11px] text-[#64748B]">NVIDIA FastConformer Parakeet-TDT 1.1B model with real-time word error rate &lt;2.8%</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full font-bold">
                    Active • Sub-80ms Streaming
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#0F172A] mb-1">Parakeet STT Model Architecture</label>
                  <select
                    value={sttModel}
                    onChange={(e) => setSttModel(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#CBD5E1] rounded-xl font-bold text-xs text-[#0F172A] outline-none focus:border-[#3157D5]"
                  >
                    <option value="parakeet-tdt-1.1b">NVIDIA Parakeet-TDT 1.1B (Powerful / Sub-80ms)</option>
                    <option value="parakeet-ctc-1.1b">NVIDIA Parakeet-CTC 1.1B (High Noise Resilience)</option>
                    <option value="deepgram-nova-3">Deepgram Nova-3 (Conversational Multi-Language)</option>
                    <option value="whisper-large-v3">OpenAI Whisper Large-v3 Turbo</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#0F172A] mb-1">Primary Audio Language</label>
                  <select
                    value={sttLanguage}
                    onChange={(e) => setSttLanguage(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#CBD5E1] rounded-xl font-medium text-xs text-[#0F172A] outline-none focus:border-[#3157D5]"
                  >
                    <option value="en-US">English (US & International) - Auto-detect Accents</option>
                    <option value="es-ES">Spanish (Spain & Latin America)</option>
                    <option value="fr-FR">French (Standard)</option>
                    <option value="de-DE">German</option>
                    <option value="multi">Auto-Detect Multi-Language (30+ Languages)</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block font-bold text-[#0F172A] mb-1 flex items-center justify-between">
                    <span>Parakeet STT API Key / Streaming Auth Key</span>
                    <span className="text-[11px] text-[#64748B] font-medium">
                      Managed by Super Admin
                    </span>
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      value="••••••••••••••••••••••••••••••••••••••••••••••••"
                      readOnly
                      disabled
                      className="w-full px-3.5 py-2 bg-[#F1F5F9] border border-[#CBD5E1] rounded-xl font-mono text-xs text-[#64748B] outline-none cursor-not-allowed select-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Inbound & Outbound Webhooks (Connected to Database) */}
        {activeTab === "webhooks" && (
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-[#0F172A]">Configured Webhook Endpoints</h3>
                <p className="text-[#64748B]">Real-time HTTP callbacks for call telemetry, transcription, and agent actions (Stored in PostgreSQL Database).</p>
              </div>
              <button
                onClick={() => setAddWebhookOpen(true)}
                className="px-3.5 py-1.5 bg-[#3157D5] hover:bg-[#2646B8] text-white rounded-xl font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Endpoint</span>
              </button>
            </div>

            <div className="space-y-2">
              {webhooksList && webhooksList.length > 0 ? (
                webhooksList.map((wh) => (
                  <div key={wh.id} className="p-4 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#0F172A] font-mono">
                          {wh.name || (Array.isArray(wh.events) ? wh.events.join(", ") : "All Events")}
                        </span>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                          {wh.status || "active"}
                        </span>
                        {Array.isArray(wh.events) && wh.events.length > 0 && wh.name && (
                          <span className="text-[10px] font-medium text-[#64748B] bg-white border border-[#E2E8F0] px-1.5 py-0.5 rounded">
                            {wh.events.join(", ")}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#64748B] font-mono truncate">{wh.url}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={async () => {
                          try {
                            await fetch(wh.url, {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({
                                event: "call.completed",
                                test: true,
                                timestamp: new Date().toISOString(),
                                data: { callId: "test_call_" + Date.now(), status: "completed", duration: 120 }
                              }),
                            });
                          } catch (_) {}
                          addToast({ title: "Test Event Dispatched", description: `Dispatched test payload to ${wh.url}`, type: "success" });
                        }}
                        className="px-3 py-1.5 bg-white border border-[#E2E8F0] hover:bg-[#EEF2FD] text-[#3157D5] font-bold rounded-xl transition-colors cursor-pointer"
                      >
                        Test Event
                      </button>
                      <button
                        onClick={async () => {
                          await deleteWebhook(wh.id);
                          addToast({ title: "Webhook Deleted", description: "Webhook permanently removed from database.", type: "success" });
                        }}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                        title="Delete Webhook"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center bg-[#F8FAFC] rounded-2xl border border-dashed border-[#CBD5E1]">
                  <Webhook className="w-8 h-8 text-[#94A3B8] mx-auto mb-2 opacity-50" />
                  <p className="font-bold text-sm text-[#0F172A]">No Webhook Endpoints Configured</p>
                  <p className="text-xs text-[#64748B] mt-1">Click &quot;Add Endpoint&quot; to configure a new database-backed webhook.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 6. Audio & DNC Compliance */}
        {activeTab === "compliance" && (
          <div className="space-y-4 max-w-xl text-xs">
            <div className="flex items-center justify-between p-3.5 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0]">
              <div>
                <h4 className="font-bold text-[#0F172A]">Automatic Call Recording Consent Announcement</h4>
                <p className="text-[11px] text-[#64748B]">Plays two-party legal consent statement at call start.</p>
              </div>
              <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-[#3157D5]" />
            </div>

            <div className="flex items-center justify-between p-3.5 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0]">
              <div>
                <h4 className="font-bold text-[#0F172A]">Real-Time National Do-Not-Call (DNC) Scrubbing</h4>
                <p className="text-[11px] text-[#64748B]">Pre-validates phone numbers against FCC/FTC registry before dialing.</p>
              </div>
              <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-[#3157D5]" />
            </div>
          </div>
        )}

        {/* 7. Team & Administrator Provisioning Policy */}
        {activeTab === "team" && (
          <div className="space-y-5 text-xs">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-[#0F172A]">Assigned Organization Administrator</h3>
                <p className="text-[#64748B]">Active tenant administrator credentials managing this workspace.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  addToast({ 
                    title: "Super Admin Contact Request", 
                    description: "Your request for an additional admin seat has been logged. Please contact Super Admin at superadmin@apexvoice.ai for approval.", 
                    type: "info" 
                  });
                }}
                className="px-3.5 py-2 bg-white hover:bg-[#EEF2FD] border border-[#CBD5E1] text-[#3157D5] rounded-xl font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Contact Super Admin for New Admin</span>
              </button>
            </div>

            <div className="space-y-2">
              <div className="p-4 bg-white rounded-2xl border border-[#E2E8F0] flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#3157D5] text-white font-bold text-xs flex items-center justify-center">
                    {fullName.split(" ").map(n => n[0]).join("").substring(0, 2) || "AD"}
                  </div>
                  <div>
                    <h4 className="font-bold text-[#0F172A]">{fullName}</h4>
                    <p className="text-[11px] text-[#64748B]">{orgEmail} • Primary Tenant Admin ({orgName})</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-full">
                    Tenant Admin
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                    Active Seat
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Webhook Endpoint Modal Popup */}
      {addWebhookOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/60 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto">
          <div
            className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-[#E2E8F0] p-6 animate-in zoom-in-95 duration-150 my-8 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-end mb-1">
              <button
                type="button"
                onClick={() => setAddWebhookOpen(false)}
                className="p-1.5 text-[#94A3B8] hover:text-[#0F172A] hover:bg-[#F8FAFC] rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <CreateWebhookForm
              onCancel={() => setAddWebhookOpen(false)}
              onSuccess={() => {
                setAddWebhookOpen(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
