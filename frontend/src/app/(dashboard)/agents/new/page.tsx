"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { Agent, VoiceConfig, AgentTool } from "@/lib/types";
import { PageHeader } from "@/components/page-header";
import { AudioWaveform } from "@/components/audio-waveform";
import {
  Bot,
  Sparkles,
  Volume2,
  Sliders,
  BookOpen,
  Wrench,
  PhoneCall,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Play,
  Pause,
  Plus,
  Trash2,
  ShieldCheck,
  Send,
  Zap,
} from "lucide-react";

export default function CreateAgentPage() {
  const router = useRouter();
  const { addAgent, knowledgeSources, addToast } = useAppStore();

  const [step, setStep] = useState<number>(1);
  const [isPlayingSample, setIsPlayingSample] = useState(false);

  // Form State
  const [name, setName] = useState("Apex Inbound Assistant");
  const [description, setDescription] = useState("Autonomous voice agent handling customer inquiries, lead qualification, and scheduling.");
  const [color, setColor] = useState("#3157D5");
  const [language, setLanguage] = useState("English (US)");

  // Voice State
  const [voiceProvider, setVoiceProvider] = useState<VoiceConfig["provider"]>("ElevenLabs");
  const [voiceName, setVoiceName] = useState("Rachel (US Professional)");
  const [voiceSpeed, setVoiceSpeed] = useState(1.0);
  const [voiceStability, setVoiceStability] = useState(0.8);
  const [voicePitch, setVoicePitch] = useState(0.0);

  // Instructions State
  const [greeting, setGreeting] = useState("Hi there! Thanks for calling. My name is Rachel, your voice assistant. How can I help you today?");
  const [systemPrompt, setSystemPrompt] = useState(`You are Rachel, a professional voice assistant.
Your goal is to answer questions, understand requirements, and help qualify the caller.
Always keep responses concise, conversational, and under 30 words per turn.
If the customer wants a meeting, use the book_appointment tool.`);
  const [responseStyle, setResponseStyle] = useState<Agent["responseStyle"]>("conversational");
  const [interruptionSensitivity, setInterruptionSensitivity] = useState(0.75);
  const [silenceTimeout, setSilenceTimeout] = useState(5);
  const [maxCallDuration, setMaxCallDuration] = useState(15);

  // Knowledge & Tools
  const [selectedKbIds, setSelectedKbIds] = useState<string[]>(["kb-1"]);
  const [tools, setTools] = useState<AgentTool[]>([
    { id: "t1", name: "book_appointment", description: "Schedules meetings on calendar", enabled: true, type: "calendar" },
    { id: "t2", name: "crm_lead_enrich", description: "Enriches caller company data", enabled: true, type: "crm" },
    { id: "t3", name: "transfer_to_sales_rep", description: "Transfers to human sales rep", enabled: true, type: "function" },
  ]);

  // Call Behavior
  const [transferNumber, setTransferNumber] = useState("+1 (800) 555-0199");
  const [transferTrigger, setTransferTrigger] = useState("human, representative, manager");
  const [goodbyePhrase, setGoodbyePhrase] = useState("Thank you for speaking with us. Have a wonderful day!");

  const steps = [
    { number: 1, title: "Identity", icon: Bot },
    { number: 2, title: "Voice & Audio", icon: Volume2 },
    { number: 3, title: "Instructions", icon: Sliders },
    { number: 4, title: "Knowledge Base", icon: BookOpen },
    { number: 5, title: "Tools & Actions", icon: Wrench },
    { number: 6, title: "Call Behavior", icon: PhoneCall },
    { number: 7, title: "Review & Deploy", icon: CheckCircle2 },
  ];

  const handleSave = (status: "active" | "draft" = "active") => {
    const newAgent: Agent = {
      id: `agent-${Date.now()}`,
      name,
      description,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      color,
      status,
      voice: {
        provider: voiceProvider,
        voiceId: "voice-custom-1",
        voiceName,
        gender: "female",
        accent: "American",
        speed: voiceSpeed,
        pitch: voicePitch,
        stability: voiceStability,
        similarity: 0.8,
      },
      language,
      greeting,
      systemPrompt,
      responseStyle,
      interruptionSensitivity,
      silenceTimeoutSeconds: silenceTimeout,
      maxCallDurationMinutes: maxCallDuration,
      knowledgeBaseIds: selectedKbIds,
      tools,
      transferRules: {
        enabled: true,
        destinationNumber: transferNumber,
        triggerPhrase: transferTrigger,
        department: "Sales & Support",
      },
      callEndingRules: {
        goodbyePhrase,
        hangupOnSilence: true,
        afterHoursBehavior: "voicemail",
      },
      metrics: {
        totalCalls: 0,
        avgDurationSeconds: 0,
        successRate: 100,
        sentimentScore: 90,
        connectedCalls: 0,
      },
      lastUpdated: new Date().toISOString(),
    };

    addAgent(newAgent);
    router.push(`/agents/${newAgent.id}/test`);
  };

  const toggleKb = (id: string) => {
    setSelectedKbIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleTool = (id: string) => {
    setTools((prev) =>
      prev.map((t) => (t.id === id ? { ...t, enabled: !t.enabled } : t))
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Agent Studio & Orchestrator"
        description="Configure personality, neural speech synthesis, API tools, and escalation logic in 7 guided steps."
      />

      {/* Step Indicator Bar */}
      <div className="p-4 bg-white rounded-2xl border border-[#E5EAF2] card-shadow overflow-x-auto">
        <div className="flex items-center justify-between min-w-[700px]">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            const isDone = step > s.number;
            const isCurrent = step === s.number;
            return (
              <React.Fragment key={s.number}>
                <button
                  onClick={() => setStep(s.number)}
                  className="flex items-center gap-2 text-left focus:outline-hidden group"
                >
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold transition-all ${
                      isDone
                        ? "bg-[#16A36A] text-white"
                        : isCurrent
                        ? "bg-[#3157D5] text-white shadow-md shadow-[#3157D5]/20 ring-4 ring-[#3157D5]/10"
                        : "bg-[#F4F7FB] text-[#78849A] group-hover:bg-[#E5EAF2]"
                    }`}
                  >
                    {isDone ? <CheckCircle2 className="w-4 h-4" /> : s.number}
                  </div>
                  <div>
                    <span className={`text-xs font-bold block ${isCurrent ? "text-[#3157D5]" : isDone ? "text-[#172033]" : "text-[#78849A]"}`}>
                      {s.title}
                    </span>
                    <span className="text-[10px] text-[#78849A]">Step {s.number} of 7</span>
                  </div>
                </button>
                {idx < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 rounded-full ${step > idx + 1 ? "bg-[#16A36A]" : "bg-[#E5EAF2]"}`} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Wizard Content Step Body */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Step Form (2 cols) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-[#E5EAF2] card-shadow space-y-6">
          {/* STEP 1: IDENTITY */}
          {step === 1 && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div>
                <h2 className="text-base font-bold text-[#172033]">1. Agent Identity & Archetype</h2>
                <p className="text-xs text-[#78849A]">Define the public name, role, and visual appearance of your voice assistant.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#172033] mb-1.5">Agent Display Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Apex Inbound Qualifier Pro"
                    className="w-full px-3.5 py-2.5 bg-[#F4F7FB] border border-[#E5EAF2] rounded-xl text-xs text-[#172033] outline-none focus:border-[#3157D5]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#172033] mb-1.5">Description & Role Purpose</label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe what this agent accomplishes during calls..."
                    className="w-full px-3.5 py-2.5 bg-[#F4F7FB] border border-[#E5EAF2] rounded-xl text-xs text-[#172033] outline-none focus:border-[#3157D5] leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#172033] mb-1.5">Primary Language</label>
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#F4F7FB] border border-[#E5EAF2] rounded-xl text-xs font-medium text-[#172033] outline-none focus:border-[#3157D5]"
                    >
                      <option value="English (US)">English (US)</option>
                      <option value="English (UK)">English (UK)</option>
                      <option value="Spanish (ES)">Spanish (ES)</option>
                      <option value="German (DE)">German (DE)</option>
                      <option value="French (FR)">French (FR)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#172033] mb-1.5">Brand Accent Color</label>
                    <div className="flex items-center gap-2">
                      {["#3157D5", "#16A36A", "#D99025", "#6366F1", "#0D9488", "#E11D48"].map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setColor(c)}
                          className={`w-7 h-7 rounded-xl transition-all ${
                            color === c ? "ring-2 ring-offset-2 ring-[#3157D5] scale-110" : "opacity-80 hover:opacity-100"
                          }`}
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: VOICE & AUDIO */}
          {step === 2 && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div>
                <h2 className="text-base font-bold text-[#172033]">2. Voice Engine & Neural Synthesis</h2>
                <p className="text-xs text-[#78849A]">Select from premier ultra-low latency voice providers and customize cadence.</p>
              </div>

              {/* Provider Selection */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {(["ElevenLabs", "Cartesia", "Deepgram", "OpenAI"] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setVoiceProvider(p)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      voiceProvider === p
                        ? "bg-[#EEF2FD] border-[#3157D5] ring-2 ring-[#3157D5]/10"
                        : "bg-[#F4F7FB] border-[#E5EAF2] hover:bg-[#EDF2F7]"
                    }`}
                  >
                    <span className="text-xs font-bold text-[#172033] block">{p}</span>
                    <span className="text-[10px] text-[#78849A]">
                      {p === "ElevenLabs" ? "~80ms TTS" : p === "Cartesia" ? "~50ms Sonic" : p === "Deepgram" ? "~70ms Aura" : "Realtime API"}
                    </span>
                  </button>
                ))}
              </div>

              {/* Voice Selector */}
              <div>
                <label className="block text-xs font-semibold text-[#172033] mb-1.5">Voice Model</label>
                <select
                  value={voiceName}
                  onChange={(e) => setVoiceName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#F4F7FB] border border-[#E5EAF2] rounded-xl text-xs font-medium text-[#172033] outline-none focus:border-[#3157D5]"
                >
                  <option value="Rachel (US Professional)">Rachel — Calm, articulate, executive</option>
                  <option value="Marcus (Calm & Empathetic)">Marcus — Warm, trustworthy, healthcare tone</option>
                  <option value="Bella (Engaging & Clear)">Bella — High energy, sales qualification</option>
                  <option value="Asteria (Crisp & Helpful)">Asteria — Direct, technical support</option>
                  <option value="Antoni (Polished & Refined)">Antoni — British luxury concierge</option>
                </select>
              </div>

              {/* Sliders for Speed & Stability */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-[#F4F7FB] rounded-xl border border-[#E5EAF2]">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-semibold text-[#172033]">Speaking Speed</span>
                    <span className="font-mono text-[#3157D5]">{voiceSpeed}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.8"
                    max="1.3"
                    step="0.05"
                    value={voiceSpeed}
                    onChange={(e) => setVoiceSpeed(parseFloat(e.target.value))}
                    className="w-full accent-[#3157D5]"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-semibold text-[#172033]">Voice Stability</span>
                    <span className="font-mono text-[#3157D5]">{voiceStability}</span>
                  </div>
                  <input
                    type="range"
                    min="0.3"
                    max="1.0"
                    step="0.05"
                    value={voiceStability}
                    onChange={(e) => setVoiceStability(parseFloat(e.target.value))}
                    className="w-full accent-[#3157D5]"
                  />
                </div>
              </div>

              {/* Sample audio player simulation */}
              <div className="p-4 bg-white rounded-xl border border-[#3157D5]/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsPlayingSample(!isPlayingSample);
                      addToast({
                        title: isPlayingSample ? "Audio Sample Stopped" : "Playing Voice Sample",
                        description: `Synthesizing sample for ${voiceName}`,
                        type: "info",
                      });
                    }}
                    className="w-9 h-9 rounded-xl bg-[#3157D5] text-white flex items-center justify-center hover:bg-[#2646B8] transition-colors shadow-xs"
                  >
                    {isPlayingSample ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                  </button>
                  <div>
                    <p className="text-xs font-bold text-[#172033]">{voiceName}</p>
                    <p className="text-[11px] text-[#78849A]">Simulated live speech sample preview</p>
                  </div>
                </div>

                {isPlayingSample && (
                  <div className="flex items-end gap-1 h-5 w-20">
                    {[30, 80, 50, 90, 40, 75, 60].map((h, i) => (
                      <div key={i} className="flex-1 bg-[#3157D5] rounded-full animate-wave-1" style={{ height: `${h}%` }} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 3: INSTRUCTIONS */}
          {step === 3 && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div>
                <h2 className="text-base font-bold text-[#172033]">3. Instructions & Conversation Rules</h2>
                <p className="text-xs text-[#78849A]">Set the initial greeting, system prompt, interruption tolerance, and response style.</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172033] mb-1.5">First Greeting Message</label>
                <textarea
                  rows={2}
                  value={greeting}
                  onChange={(e) => setGreeting(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#F4F7FB] border border-[#E5EAF2] rounded-xl text-xs text-[#172033] outline-none focus:border-[#3157D5] leading-relaxed"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-[#172033]">System Persona & Core Prompt</label>
                  <div className="flex items-center gap-1">
                    {["{{contact_name}}", "{{company}}", "{{current_time}}"].map((token) => (
                      <button
                        key={token}
                        type="button"
                        onClick={() => setSystemPrompt((prev) => `${prev} ${token}`)}
                        className="text-[10px] font-mono bg-[#EEF2FD] text-[#3157D5] px-1.5 py-0.5 rounded-md hover:bg-[#E0E7FB]"
                      >
                        +{token}
                      </button>
                    ))}
                  </div>
                </div>
                <textarea
                  rows={7}
                  value={systemPrompt}
                  onChange={(e) => setSystemPrompt(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#F4F7FB] border border-[#E5EAF2] rounded-xl text-xs font-mono text-[#172033] outline-none focus:border-[#3157D5] leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#172033] mb-1.5">Response Tone Style</label>
                  <select
                    value={responseStyle}
                    onChange={(e) => setResponseStyle(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-[#F4F7FB] border border-[#E5EAF2] rounded-xl text-xs font-medium text-[#172033] outline-none focus:border-[#3157D5]"
                  >
                    <option value="conversational">Conversational (Natural flow)</option>
                    <option value="concise">Concise (Direct, sub-20 words)</option>
                    <option value="empathetic">Empathetic (Warm, healthcare/support)</option>
                    <option value="professional">Professional (Executive B2B)</option>
                  </select>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-semibold text-[#172033]">Interruption Sensitivity</span>
                    <span className="font-mono text-[#3157D5]">{interruptionSensitivity}</span>
                  </div>
                  <input
                    type="range"
                    min="0.2"
                    max="1.0"
                    step="0.05"
                    value={interruptionSensitivity}
                    onChange={(e) => setInterruptionSensitivity(parseFloat(e.target.value))}
                    className="w-full accent-[#3157D5] mt-2"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: KNOWLEDGE BASE */}
          {step === 4 && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div>
                <h2 className="text-base font-bold text-[#172033]">4. Grounding & Knowledge Base</h2>
                <p className="text-xs text-[#78849A]">Attach enterprise documentation and FAQs for real-time vector retrieval during calls.</p>
              </div>

              <div className="space-y-3">
                {knowledgeSources.map((kb) => {
                  const isAssigned = selectedKbIds.includes(kb.id);
                  return (
                    <div
                      key={kb.id}
                      onClick={() => toggleKb(kb.id)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                        isAssigned
                          ? "bg-[#EEF2FD] border-[#3157D5] ring-2 ring-[#3157D5]/10"
                          : "bg-[#F4F7FB] border-[#E5EAF2] hover:bg-[#EDF2F7]"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            isAssigned ? "bg-[#3157D5] text-white" : "bg-white text-[#78849A]"
                          }`}
                        >
                          <BookOpen className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-[#172033]">{kb.name}</p>
                          <p className="text-[10px] text-[#78849A]">{kb.chunkCount} indexed vector chunks • {kb.type.toUpperCase()}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${isAssigned ? "bg-[#3157D5] text-white" : "bg-white text-[#78849A]"}`}>
                          {isAssigned ? "Attached" : "Attach"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 5: TOOLS */}
          {step === 5 && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div>
                <h2 className="text-base font-bold text-[#172033]">5. Tools & Autonomous Actions</h2>
                <p className="text-xs text-[#78849A]">Enable real-time function calling for live calendar booking, CRM queries, and SMS dispatch.</p>
              </div>

              <div className="space-y-3">
                {tools.map((tool) => (
                  <div
                    key={tool.id}
                    className="p-4 bg-[#F4F7FB] rounded-xl border border-[#E5EAF2] flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white border border-[#E5EAF2] text-[#3157D5] flex items-center justify-center">
                        <Wrench className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-[#172033] font-mono">{tool.name}()</h4>
                        <p className="text-[11px] text-[#78849A]">{tool.description}</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleTool(tool.id)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                        tool.enabled ? "bg-[#16A36A] text-white" : "bg-white border border-[#E5EAF2] text-[#78849A]"
                      }`}
                    >
                      {tool.enabled ? "Enabled" : "Disabled"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 6: CALL BEHAVIOR */}
          {step === 6 && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div>
                <h2 className="text-base font-bold text-[#172033]">6. Call Behaviors & Human Escalation</h2>
                <p className="text-xs text-[#78849A]">Define warm transfer destinations, goodbye statements, and timeout rules.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#172033] mb-1.5">Human Transfer Phone Number</label>
                  <input
                    type="text"
                    value={transferNumber}
                    onChange={(e) => setTransferNumber(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#F4F7FB] border border-[#E5EAF2] rounded-xl text-xs text-[#172033] outline-none focus:border-[#3157D5]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#172033] mb-1.5">Escalation Trigger Phrases (Comma separated)</label>
                  <input
                    type="text"
                    value={transferTrigger}
                    onChange={(e) => setTransferTrigger(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#F4F7FB] border border-[#E5EAF2] rounded-xl text-xs text-[#172033] outline-none focus:border-[#3157D5]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#172033] mb-1.5">Closing Goodbye Statement</label>
                  <input
                    type="text"
                    value={goodbyePhrase}
                    onChange={(e) => setGoodbyePhrase(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#F4F7FB] border border-[#E5EAF2] rounded-xl text-xs text-[#172033] outline-none focus:border-[#3157D5]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 7: REVIEW */}
          {step === 7 && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div>
                <h2 className="text-base font-bold text-[#172033]">7. Review & Deploy Voice Agent</h2>
                <p className="text-xs text-[#78849A]">Inspect complete configuration before activating live channels.</p>
              </div>

              <div className="p-4 bg-[#F4F7FB] rounded-2xl border border-[#E5EAF2] space-y-3 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-[#E5EAF2]">
                  <span className="font-bold text-sm text-[#172033]">{name}</span>
                  <span className="font-semibold text-[#3157D5] bg-[#EEF2FD] px-2.5 py-0.5 rounded-full">
                    {voiceProvider} • {voiceName}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div><span className="text-[#78849A]">Language:</span> <strong className="text-[#172033]">{language}</strong></div>
                  <div><span className="text-[#78849A]">Response Style:</span> <strong className="text-[#172033] capitalize">{responseStyle}</strong></div>
                  <div><span className="text-[#78849A]">Attached KB:</span> <strong className="text-[#172033]">{selectedKbIds.length} sources</strong></div>
                  <div><span className="text-[#78849A]">Active Tools:</span> <strong className="text-[#172033]">{tools.filter((t) => t.enabled).length} enabled</strong></div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="pt-4 border-t border-[#EDF2F7] flex items-center justify-between">
            <button
              type="button"
              disabled={step === 1}
              onClick={() => setStep((prev) => Math.max(1, prev - 1))}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-[#78849A] hover:text-[#172033] disabled:opacity-40 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous Step</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleSave("draft")}
                className="px-4 py-2 bg-white hover:bg-[#F4F7FB] border border-[#E5EAF2] text-[#172033] text-xs font-semibold rounded-xl transition-all"
              >
                Save Draft
              </button>

              {step < 7 ? (
                <button
                  type="button"
                  onClick={() => setStep((prev) => Math.min(7, prev + 1))}
                  className="flex items-center gap-1.5 px-4 py-2 bg-[#3157D5] hover:bg-[#2646B8] text-white text-xs font-semibold rounded-xl shadow-xs transition-all"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleSave("active")}
                  className="flex items-center gap-1.5 px-5 py-2 bg-[#16A36A] hover:bg-[#138A5A] text-white text-xs font-bold rounded-xl shadow-sm transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Deploy & Open Simulator</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Side Simulator Preview (1 col) */}
        <div className="space-y-4">
          <div className="p-5 bg-white rounded-2xl border border-[#E5EAF2] card-shadow space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-[#172033] uppercase tracking-wider">Live Agent Simulator</h3>
              <span className="text-[10px] font-bold text-[#16A36A] bg-[#E8F7F0] px-2 py-0.5 rounded-full">
                Ready
              </span>
            </div>

            {/* Simulated Voice Preview Card */}
            <div className="p-4 bg-[#F4F7FB] rounded-xl border border-[#E5EAF2] space-y-3">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-xs shadow-xs"
                  style={{ backgroundColor: color }}
                >
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#172033]">{name}</p>
                  <p className="text-[10px] text-[#78849A]">{voiceName}</p>
                </div>
              </div>

              <div className="p-3 bg-white rounded-xl border border-[#E5EAF2] text-xs text-[#172033] italic leading-relaxed">
                &quot;{greeting}&quot;
              </div>

              <AudioWaveform
                active={true}
                audioLevel={55}
                color={color}
                speaker="agent"
                label="Simulated Audio Stream"
              />
            </div>

            <div className="p-3 bg-[#EEF2FD] rounded-xl border border-[#3157D5]/20 text-[11px] text-[#3157D5] space-y-1">
              <p className="font-bold flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" /> Fast Test Simulator
              </p>
              <p className="text-[10px] text-[#78849A]">
                Once deployed, you can interact with full speech-to-speech simulation in the Playground.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
