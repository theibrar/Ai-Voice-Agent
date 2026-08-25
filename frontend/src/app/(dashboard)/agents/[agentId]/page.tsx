"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { PageHeader } from "@/components/page-header";
import { StatusPill } from "@/components/status-pill";
import { AudioWaveform } from "@/components/audio-waveform";
import {
  Bot,
  Volume2,
  Sliders,
  BookOpen,
  Wrench,
  PhoneCall,
  Sparkles,
  ArrowLeft,
  Save,
  Play,
  Pause,
  Copy,
  Trash2,
} from "lucide-react";

interface EditAgentPageProps {
  params: Promise<{ agentId: string }>;
}

export default function EditAgentPage({ params }: EditAgentPageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { agents, updateAgent, knowledgeSources, addToast } = useAppStore();

  const agent = agents.find((a) => a.id === resolvedParams.agentId) || agents[0];

  const [activeTab, setActiveTab] = useState<"general" | "voice" | "instructions" | "knowledge" | "tools" | "behavior">("general");

  // Local edit states initialized from agent
  const [name, setName] = useState(agent.name);
  const [description, setDescription] = useState(agent.description);
  const [greeting, setGreeting] = useState(agent.greeting);
  const [systemPrompt, setSystemPrompt] = useState(agent.systemPrompt);
  const [voiceName, setVoiceName] = useState(agent.voice.voiceName);
  const [voiceSpeed, setVoiceSpeed] = useState(agent.voice.speed);
  const [voiceStability, setVoiceStability] = useState(agent.voice.stability);
  const [selectedKbIds, setSelectedKbIds] = useState<string[]>(agent.knowledgeBaseIds);
  const [tools, setTools] = useState(agent.tools);

  const handleSave = () => {
    const updated = {
      ...agent,
      name,
      description,
      greeting,
      systemPrompt,
      voice: {
        ...agent.voice,
        voiceName,
        speed: voiceSpeed,
        stability: voiceStability,
      },
      knowledgeBaseIds: selectedKbIds,
      tools,
      lastUpdated: new Date().toISOString(),
    };
    updateAgent(updated);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/agents"
            className="p-2 bg-white border border-[#E5EAF2] rounded-xl text-[#78849A] hover:text-[#172033] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-bold text-[#172033]">{agent.name}</h1>
              <StatusPill status={agent.status} />
            </div>
            <p className="text-xs text-[#78849A] mt-0.5">
              {agent.voice.provider} • {agent.voice.voiceName} • {agent.language}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/agents/${agent.id}/test`}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#EEF2FD] text-[#3157D5] hover:bg-[#E0E7FB] text-xs font-semibold rounded-xl transition-all"
          >
            <Volume2 className="w-4 h-4" />
            <span>Open Test Playground</span>
          </Link>
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#3157D5] hover:bg-[#2646B8] text-white text-xs font-semibold rounded-xl shadow-xs transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save Changes</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-[#E5EAF2] card-shadow overflow-x-auto">
        {[
          { id: "general", label: "Identity & General", icon: Bot },
          { id: "voice", label: "Voice & Speech", icon: Volume2 },
          { id: "instructions", label: "Instructions & Prompts", icon: Sliders },
          { id: "knowledge", label: "Knowledge Grounding", icon: BookOpen },
          { id: "tools", label: "Function Calling Tools", icon: Wrench },
          { id: "behavior", label: "Call Escalation & Rules", icon: PhoneCall },
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
          <div className="space-y-4 max-w-2xl">
            <div>
              <label className="block text-xs font-semibold text-[#172033] mb-1.5">Agent Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#F4F7FB] border border-[#E5EAF2] rounded-xl text-xs text-[#172033] outline-none focus:border-[#3157D5]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#172033] mb-1.5">Description</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#F4F7FB] border border-[#E5EAF2] rounded-xl text-xs text-[#172033] outline-none focus:border-[#3157D5]"
              />
            </div>
          </div>
        )}

        {activeTab === "voice" && (
          <div className="space-y-4 max-w-2xl">
            <div>
              <label className="block text-xs font-semibold text-[#172033] mb-1.5">Voice Model</label>
              <select
                value={voiceName}
                onChange={(e) => setVoiceName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#F4F7FB] border border-[#E5EAF2] rounded-xl text-xs text-[#172033] outline-none focus:border-[#3157D5]"
              >
                <option value="Rachel (US Professional)">Rachel (US Professional)</option>
                <option value="Marcus (Calm & Empathetic)">Marcus (Calm & Empathetic)</option>
                <option value="Bella (Engaging & Clear)">Bella (Engaging & Clear)</option>
                <option value="Asteria (Crisp & Helpful)">Asteria (Crisp & Helpful)</option>
                <option value="Antoni (Polished & Refined)">Antoni (Polished & Refined)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4 p-4 bg-[#F4F7FB] rounded-xl border border-[#E5EAF2]">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-[#172033]">Speed</span>
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
                  <span className="font-semibold text-[#172033]">Stability</span>
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
          </div>
        )}

        {activeTab === "instructions" && (
          <div className="space-y-4 max-w-3xl">
            <div>
              <label className="block text-xs font-semibold text-[#172033] mb-1.5">First Greeting Message</label>
              <textarea
                rows={2}
                value={greeting}
                onChange={(e) => setGreeting(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#F4F7FB] border border-[#E5EAF2] rounded-xl text-xs text-[#172033] outline-none focus:border-[#3157D5]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#172033] mb-1.5">System Prompt</label>
              <textarea
                rows={8}
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#F4F7FB] border border-[#E5EAF2] rounded-xl text-xs font-mono text-[#172033] outline-none focus:border-[#3157D5]"
              />
            </div>
          </div>
        )}

        {activeTab === "knowledge" && (
          <div className="space-y-3 max-w-3xl">
            {knowledgeSources.map((kb) => {
              const isAttached = selectedKbIds.includes(kb.id);
              return (
                <div
                  key={kb.id}
                  onClick={() => {
                    setSelectedKbIds((prev) =>
                      prev.includes(kb.id) ? prev.filter((id) => id !== kb.id) : [...prev, kb.id]
                    );
                  }}
                  className={`p-3.5 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                    isAttached ? "bg-[#EEF2FD] border-[#3157D5]" : "bg-[#F4F7FB] border-[#E5EAF2]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <BookOpen className={`w-4 h-4 ${isAttached ? "text-[#3157D5]" : "text-[#78849A]"}`} />
                    <div>
                      <p className="text-xs font-bold text-[#172033]">{kb.name}</p>
                      <p className="text-[10px] text-[#78849A]">{kb.chunkCount} vector chunks</p>
                    </div>
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-md ${isAttached ? "bg-[#3157D5] text-white" : "bg-white text-[#78849A]"}`}>
                    {isAttached ? "Attached" : "Attach"}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === "tools" && (
          <div className="space-y-3 max-w-3xl">
            {tools.map((tool) => (
              <div key={tool.id} className="p-4 bg-[#F4F7FB] rounded-xl border border-[#E5EAF2] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Wrench className="w-4 h-4 text-[#3157D5]" />
                  <div>
                    <h4 className="text-xs font-bold text-[#172033] font-mono">{tool.name}()</h4>
                    <p className="text-[11px] text-[#78849A]">{tool.description}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setTools((prev) =>
                      prev.map((t) => (t.id === tool.id ? { ...t, enabled: !t.enabled } : t))
                    );
                  }}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                    tool.enabled ? "bg-[#16A36A] text-white" : "bg-white border border-[#E5EAF2] text-[#78849A]"
                  }`}
                >
                  {tool.enabled ? "Enabled" : "Disabled"}
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === "behavior" && (
          <div className="space-y-4 max-w-2xl">
            <div>
              <label className="block text-xs font-semibold text-[#172033] mb-1.5">Human Transfer Target Phone Number</label>
              <input
                type="text"
                defaultValue={agent.transferRules.destinationNumber}
                className="w-full px-3.5 py-2.5 bg-[#F4F7FB] border border-[#E5EAF2] rounded-xl text-xs text-[#172033] outline-none focus:border-[#3157D5]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#172033] mb-1.5">Closing Goodbye Statement</label>
              <input
                type="text"
                defaultValue={agent.callEndingRules.goodbyePhrase}
                className="w-full px-3.5 py-2.5 bg-[#F4F7FB] border border-[#E5EAF2] rounded-xl text-xs text-[#172033] outline-none focus:border-[#3157D5]"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
