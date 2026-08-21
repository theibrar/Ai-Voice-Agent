"use client";

import React, { useState } from "react";
import { useSuperAdminStore } from "@/lib/super-admin-store";
import {
  Cpu,
  Mic,
  Headphones,
  Plus,
  Sliders,
  CheckCircle2,
  Check,
  XCircle,
  Building2,
  Zap,
  Activity,
  Layers,
  X,
  Search,
  Sparkles,
  Server,
  Globe,
  Trash2,
} from "lucide-react";

export default function SuperAdminEnginesPage() {
  const {
    engines,
    tenants,
    addCustomEngine,
    toggleEngineStatus,
    deleteEngine,
    updateEngineTierRequirement,
    toggleTenantEngine,
    addToast,
  } = useSuperAdminStore();

  const [activeCategory, setActiveCategory] = useState<"all" | "llm" | "tts" | "stt">("all");
  const [tenantMatrixModalOpen, setTenantMatrixModalOpen] = useState(false);
  const [customModelModalOpen, setCustomModelModalOpen] = useState(false);
  const [selectedTenantId, setSelectedTenantId] = useState(tenants[0]?.id || "");

  // Custom Model Form State
  const [name, setName] = useState("");
  const [provider, setProvider] = useState("OpenAI-Compatible vLLM");
  const [category, setCategory] = useState<"llm" | "tts" | "stt">("llm");
  const [modelIdentifier, setModelIdentifier] = useState("mistralai/Mistral-Large-Instruct-2411");
  const [baseUrl, setBaseUrl] = useState("https://vllm.internal.apexvoice.ai/v1");
  const [apiKey, setApiKey] = useState("sk-custom-vllm-key-2026");
  const [latencyAvgMs, setLatencyAvgMs] = useState(110);
  const [costPerUnit, setCostPerUnit] = useState("$0.40 / 1M tokens");
  const [tierRequirement, setTierRequirement] = useState<"all" | "growth_plus" | "enterprise_only">("all");
  const [description, setDescription] = useState("Self-hosted private GPU cluster running vLLM OpenAI-compatible REST server.");

  const handleRegisterCustomModel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !modelIdentifier.trim()) return;

    addCustomEngine({
      name: name.trim(),
      provider: provider.trim(),
      category,
      modelIdentifier: modelIdentifier.trim(),
      latencyAvgMs,
      costPerUnit: costPerUnit.trim(),
      status: "active",
      isGlobalDefault: false,
      tierRequirement,
      supportedLanguagesCount: 30,
      description: description.trim(),
      isCustom: true,
      baseUrl: baseUrl.trim(),
      apiKey: apiKey.trim(),
    });

    setName("");
    setCustomModelModalOpen(false);
  };

  const activeTenant = tenants.find((t) => t.id === selectedTenantId) || tenants[0];

  const filteredEngines = engines.filter(
    (e) => activeCategory === "all" || e.category === activeCategory
  );

  return (
    <div className="space-y-6">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white rounded-3xl border border-[#E2E8F0] shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#3157D5] text-white flex items-center justify-center shadow-lg shadow-[#3157D5]/30 shrink-0">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-[#0F172A] tracking-tight">Voice AI Engines & Models</h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EEF2FD] text-[#3157D5]">
                {engines.length} Models Active
              </span>
            </div>
            <p className="text-xs text-[#64748B] mt-0.5">
              Manage multi-model LLMs (OpenAI, Claude, Gemini, DeepSeek, Groq, custom vLLM), ultra-low latency TTS, and STT per tenant.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setCustomModelModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#3157D5] hover:bg-[#2646B8] text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-[#3157D5]/20 shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Register Custom Model / LLM</span>
          </button>

          <button
            onClick={() => setTenantMatrixModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-[#EEF2FD] border border-[#E2E8F0] hover:border-[#3157D5] text-[#0F172A] hover:text-[#3157D5] rounded-xl text-xs font-bold transition-all shadow-2xs shrink-0"
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Manage Tenant Entitlements</span>
          </button>
        </div>
      </div>

      {/* 2. Category Filter Pills */}
      <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-[#E2E8F0] shadow-xs w-fit">
        {[
          { id: "all", label: "All Voice Engines" },
          { id: "llm", label: "LLM Reasoning (OpenAI, Claude, DeepSeek, Groq, Custom vLLM)" },
          { id: "tts", label: "TTS Voice Synthesis (ElevenLabs, Cartesia, PlayHT)" },
          { id: "stt", label: "STT Transcription (Deepgram Nova-3, Whisper)" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveCategory(tab.id as any)}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-colors ${
              activeCategory === tab.id
                ? "bg-[#3157D5] text-white shadow-2xs"
                : "text-[#64748B] hover:text-[#0F172A]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 3. Engine Cards Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredEngines.map((engine) => {
          const isLlm = engine.category === "llm";
          const isTts = engine.category === "tts";
          const isStt = engine.category === "stt";

          return (
            <div
              key={engine.id}
              className={`p-6 bg-white rounded-3xl border transition-all shadow-xs flex flex-col justify-between space-y-4 ${
                engine.isCustom
                  ? "border-amber-300 bg-gradient-to-b from-amber-50/20 to-white"
                  : engine.isGlobalDefault
                  ? "border-[#3157D5] ring-2 ring-[#3157D5]/30"
                  : "border-[#E2E8F0] hover:border-[#3157D5]/40"
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#0F172A] text-white flex items-center justify-center shadow-xs">
                      {isLlm ? <Cpu className="w-5 h-5 text-[#5C82FF]" /> : isTts ? <Headphones className="w-5 h-5 text-emerald-400" /> : <Mic className="w-5 h-5 text-amber-400" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-base font-bold text-[#0F172A] leading-tight">{engine.name}</h3>
                        {engine.isCustom && (
                          <span className="text-[8px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.2 rounded">
                            Custom
                          </span>
                        )}
                        {engine.isGlobalDefault && (
                          <span className="text-[8px] font-bold text-[#3157D5] bg-[#EEF2FD] px-1.5 py-0.2 rounded">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#64748B]">{engine.provider} • {engine.category.toUpperCase()}</p>
                    </div>
                  </div>

                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    engine.status === "active" ? "bg-[#EEF2FD] text-[#3157D5]" : "bg-[#F1F5F9] text-[#64748B]"
                  }`}>
                    {engine.status}
                  </span>
                </div>

                <p className="text-xs text-[#64748B] leading-relaxed">
                  {engine.description}
                </p>

                {engine.isCustom && engine.baseUrl && (
                  <div className="p-2 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] text-[10px] font-mono text-[#3157D5] truncate">
                    Endpoint: {engine.baseUrl}
                  </div>
                )}

                {/* Technical Specs */}
                <div className="p-3.5 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[#64748B]">Average Turn Latency:</span>
                    <span className="font-mono font-bold text-[#3157D5]">{engine.latencyAvgMs} ms</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#64748B]">Platform Cost / Unit:</span>
                    <span className="font-mono text-[#0F172A] font-semibold">{engine.costPerUnit}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#64748B]">Tier Restriction:</span>
                    <span className="font-bold text-[#0F172A] capitalize">{engine.tierRequirement.replace("_", "+ ")}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#64748B]">Identifier:</span>
                    <span className="font-mono text-[10px] text-[#0F172A] truncate max-w-[140px]">{engine.modelIdentifier}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-[#EDF2F7] flex items-center justify-between gap-2">
                <button
                  onClick={() => toggleEngineStatus(engine.id)}
                  className="flex-1 py-2 bg-white hover:bg-[#F1F5F9] border border-[#E2E8F0] rounded-xl text-xs font-bold text-[#0F172A] transition-colors"
                >
                  {engine.status === "active" ? "Deprecate" : "Re-activate"}
                </button>

                {engine.isCustom && (
                  <button
                    onClick={() => deleteEngine(engine.id)}
                    className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
                    title="Remove custom model"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}

                <select
                  value={engine.tierRequirement}
                  onChange={(e: any) => updateEngineTierRequirement(engine.id, e.target.value)}
                  className="py-1.5 px-2.5 bg-[#EEF2FD] text-[#3157D5] border border-[#3157D5]/20 rounded-xl text-xs font-bold outline-none"
                >
                  <option value="all">All Plans</option>
                  <option value="growth_plus">Growth+ Only</option>
                  <option value="enterprise_only">Enterprise Only</option>
                </select>
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. Register Custom Model Modal */}
      {customModelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-2xl max-w-lg w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#EEF2FD] text-[#3157D5] flex items-center justify-center">
                  <Plus className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-[#0F172A]">Register Custom Model / LLM Endpoint</h3>
              </div>
              <button
                onClick={() => setCustomModelModalOpen(false)}
                className="p-1.5 text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRegisterCustomModel} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#0F172A] block mb-1">Model Display Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ollama Llama 3.3 70B Local"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#E2E8F0] rounded-xl outline-none focus:border-[#3157D5] text-[#0F172A]"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#0F172A] block mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e: any) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#E2E8F0] rounded-xl outline-none focus:border-[#3157D5] text-[#0F172A]"
                  >
                    <option value="llm">LLM Reasoning Model</option>
                    <option value="tts">TTS Voice Synthesis</option>
                    <option value="stt">STT Speech-to-Text</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#0F172A] block mb-1">Provider Engine Type</label>
                  <select
                    value={provider}
                    onChange={(e) => setProvider(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#E2E8F0] rounded-xl outline-none focus:border-[#3157D5] text-[#0F172A]"
                  >
                    <option value="OpenAI-Compatible vLLM">vLLM Self-Hosted GPU Cluster</option>
                    <option value="Ollama Local Server">Ollama Local Instance</option>
                    <option value="Azure OpenAI">Azure OpenAI Service</option>
                    <option value="Together AI">Together AI API</option>
                    <option value="OpenRouter">OpenRouter Aggregator</option>
                    <option value="Custom REST/WebSocket">Custom REST / WebSocket</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-[#0F172A] block mb-1">Model Identifier String</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. llama-3.3-70b-instruct"
                    value={modelIdentifier}
                    onChange={(e) => setModelIdentifier(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#E2E8F0] rounded-xl outline-none focus:border-[#3157D5] text-[#0F172A] font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-[#0F172A] block mb-1">Base API URL Endpoint</label>
                <input
                  type="url"
                  required
                  placeholder="https://vllm.internal.apexvoice.ai/v1 or http://localhost:11434/v1"
                  value={baseUrl}
                  onChange={(e) => setBaseUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#E2E8F0] rounded-xl outline-none focus:border-[#3157D5] text-[#0F172A] font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-[#0F172A] block mb-1">API Key / Secret Token (Optional)</label>
                <input
                  type="password"
                  placeholder="sk-custom-vllm-key-..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#E2E8F0] rounded-xl outline-none focus:border-[#3157D5] text-[#0F172A] font-mono"
                />
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="font-bold text-[#0F172A] block mb-1">Latency (ms)</label>
                  <input
                    type="number"
                    value={latencyAvgMs}
                    onChange={(e) => setLatencyAvgMs(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white border border-[#E2E8F0] rounded-xl outline-none focus:border-[#3157D5] text-[#0F172A] font-mono"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#0F172A] block mb-1">Cost Rate</label>
                  <input
                    type="text"
                    value={costPerUnit}
                    onChange={(e) => setCostPerUnit(e.target.value)}
                    placeholder="$0.40 / 1M tokens"
                    className="w-full px-3 py-2 bg-white border border-[#E2E8F0] rounded-xl outline-none focus:border-[#3157D5] text-[#0F172A] font-mono"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#0F172A] block mb-1">Tier Access</label>
                  <select
                    value={tierRequirement}
                    onChange={(e: any) => setTierRequirement(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#E2E8F0] rounded-xl outline-none focus:border-[#3157D5] text-[#0F172A]"
                  >
                    <option value="all">All Plans</option>
                    <option value="growth_plus">Growth+ Only</option>
                    <option value="enterprise_only">Enterprise Only</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-[#0F172A] block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2 bg-white border border-[#E2E8F0] rounded-xl outline-none focus:border-[#3157D5] text-[#0F172A]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E2E8F0]">
                <button
                  type="button"
                  onClick={() => setCustomModelModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-[#64748B] hover:text-[#0F172A]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#3157D5] hover:bg-[#2646B8] text-white rounded-xl text-xs font-bold shadow-md shadow-[#3157D5]/20 transition-colors"
                >
                  Register Custom Model
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Tenant Entitlement Matrix Modal */}
      {tenantMatrixModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-2xl max-w-2xl w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#EEF2FD] text-[#3157D5] flex items-center justify-center">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#0F172A]">Tenant AI Model Entitlements</h3>
                    <p className="text-xs text-[#64748B]">Toggle available LLMs, TTS voices, and STT engines per organization</p>
                  </div>
                </div>
                <button
                  onClick={() => setTenantMatrixModalOpen(false)}
                  className="p-1.5 text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="py-3">
                <label className="font-bold text-[#0F172A] block mb-1 text-xs">Select Target Tenant</label>
                <select
                  value={selectedTenantId}
                  onChange={(e) => setSelectedTenantId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#E2E8F0] rounded-xl outline-none focus:border-[#3157D5] text-xs text-[#0F172A] font-bold"
                >
                  {tenants.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.orgName} ({t.planName})
                    </option>
                  ))}
                </select>
              </div>

              {/* Models Checkable List */}
              <div className="overflow-y-auto max-h-96 space-y-4 pr-1 text-xs">
                {/* LLMs */}
                <div className="space-y-2">
                  <span className="font-extrabold uppercase tracking-wider text-[#64748B] text-[10px] block">
                    LLM Models & Custom Endpoints
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {engines.filter((e) => e.category === "llm").map((model) => {
                      const isAllowed = activeTenant.allowedLLMs.includes(model.id) || activeTenant.allowedLLMs.some((m) => model.name.toLowerCase().includes(m));

                      return (
                        <div
                          key={model.id}
                          onClick={() => toggleTenantEngine(activeTenant.id, "llm", model.id)}
                          className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                            isAllowed ? "bg-[#EEF2FD] border-[#3157D5]/40 text-[#3157D5]" : "bg-white border-[#E2E8F0] text-[#64748B]"
                          }`}
                        >
                          <div>
                            <p className="font-bold text-[#0F172A]">{model.name}</p>
                            <p className="text-[10px] text-[#64748B]">{model.latencyAvgMs}ms • {model.costPerUnit}</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={isAllowed}
                            onChange={() => {}}
                            className="w-4 h-4 rounded text-[#3157D5] focus:ring-[#3157D5]"
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* TTS */}
                <div className="space-y-2">
                  <span className="font-extrabold uppercase tracking-wider text-[#64748B] text-[10px] block">
                    TTS Voice Synthesis (ElevenLabs, Cartesia, Kokoro 82M)
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {engines.filter((e) => e.category === "tts").map((model) => {
                      const isAllowed = activeTenant.allowedTTS.includes(model.id) || activeTenant.allowedTTS.some((m) => model.name.toLowerCase().includes(m));

                      return (
                        <div
                          key={model.id}
                          onClick={() => toggleTenantEngine(activeTenant.id, "tts", model.id)}
                          className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                            isAllowed ? "bg-[#EEF2FD] border-[#3157D5]/40 text-[#3157D5]" : "bg-white border-[#E2E8F0] text-[#64748B]"
                          }`}
                        >
                          <div>
                            <p className="font-bold text-[#0F172A]">{model.name}</p>
                            <p className="text-[10px] text-[#64748B]">{model.latencyAvgMs}ms • {model.costPerUnit}</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={isAllowed}
                            onChange={() => {}}
                            className="w-4 h-4 rounded text-[#3157D5] focus:ring-[#3157D5]"
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* STT */}
                <div className="space-y-2">
                  <span className="font-extrabold uppercase tracking-wider text-[#64748B] text-[10px] block">
                    STT Speech-to-Text (Deepgram Nova-3, Whisper, NVIDIA Parakeet)
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {engines.filter((e) => e.category === "stt").map((model) => {
                      const isAllowed = activeTenant.allowedSTT.includes(model.id) || activeTenant.allowedSTT.some((m) => model.name.toLowerCase().includes(m));

                      return (
                        <div
                          key={model.id}
                          onClick={() => toggleTenantEngine(activeTenant.id, "stt", model.id)}
                          className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                            isAllowed ? "bg-[#EEF2FD] border-[#3157D5]/40 text-[#3157D5]" : "bg-white border-[#E2E8F0] text-[#64748B]"
                          }`}
                        >
                          <div>
                            <p className="font-bold text-[#0F172A]">{model.name}</p>
                            <p className="text-[10px] text-[#64748B]">{model.latencyAvgMs}ms • {model.costPerUnit}</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={isAllowed}
                            onChange={() => {}}
                            className="w-4 h-4 rounded text-[#3157D5] focus:ring-[#3157D5]"
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-[#E2E8F0]">
              <button
                onClick={() => setTenantMatrixModalOpen(false)}
                className="px-5 py-2.5 bg-[#3157D5] hover:bg-[#2646B8] text-white rounded-xl text-xs font-bold transition-colors"
              >
                Save Entitlements
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
