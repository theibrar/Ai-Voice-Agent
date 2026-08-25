"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { PageHeader } from "@/components/page-header";
import { Template, Agent } from "@/lib/types";
import {
  Sparkles,
  Target,
  HeartPulse,
  Sun,
  PackageCheck,
  Building2,
  CreditCard,
  Volume2,
  Clock,
  Wrench,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

export default function TemplatesPage() {
  const router = useRouter();
  const { templates, addAgent, addToast } = useAppStore();

  const [categoryFilter, setCategoryFilter] = useState<string>("All");

  const categories = ["All", "Sales", "Healthcare", "Support", "Real Estate", "Finance"];

  const filteredTemplates = templates.filter((t) =>
    categoryFilter === "All" ? true : t.category === categoryFilter
  );

  const iconMap: Record<string, React.ElementType> = {
    Target,
    HeartPulse,
    Sun,
    PackageCheck,
    Building2,
    CreditCard,
  };

  const handleUseTemplate = (tpl: Template) => {
    const newAgent: Agent = {
      id: `agent-${Date.now()}`,
      name: tpl.title,
      description: tpl.description,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      color: tpl.color,
      status: "active",
      voice: {
        provider: "ElevenLabs",
        voiceId: "voice-tpl-1",
        voiceName: tpl.suggestedVoice,
        gender: "female",
        accent: "American",
        speed: 1.0,
        pitch: 0.0,
        stability: 0.8,
        similarity: 0.8,
      },
      language: "English (US)",
      greeting: tpl.defaultGreeting,
      systemPrompt: tpl.samplePrompt,
      responseStyle: "conversational",
      interruptionSensitivity: 0.75,
      silenceTimeoutSeconds: 5,
      maxCallDurationMinutes: 12,
      knowledgeBaseIds: ["kb-1"],
      tools: tpl.includedTools.map((toolName) => ({
        id: `tool-${Date.now()}-${toolName}`,
        name: toolName,
        description: `Autonomous function execution for ${toolName}`,
        enabled: true,
        type: "function",
      })),
      transferRules: {
        enabled: true,
        destinationNumber: "+1 (800) 555-0199",
        triggerPhrase: "transfer to representative, speak to human",
        department: tpl.category,
      },
      callEndingRules: {
        goodbyePhrase: "Thank you for speaking with us. Have a wonderful day!",
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

  return (
    <div className="space-y-6">
      <PageHeader
        title="Agent Template Library"
        description="Pre-configured voice agent archetypes engineered for conversion, patient scheduling, customer support, and sales."
      />

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all whitespace-nowrap ${
              categoryFilter === cat
                ? "bg-[#3157D5] text-white shadow-xs"
                : "bg-white text-[#78849A] hover:text-[#172033] border border-[#E5EAF2]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTemplates.map((tpl) => {
          const Icon = iconMap[tpl.icon] || Sparkles;
          return (
            <div
              key={tpl.id}
              className="p-5 bg-white rounded-2xl border border-[#E5EAF2] card-shadow card-hover flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div
                    className="w-11 h-11 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-sm"
                    style={{ backgroundColor: tpl.color }}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold text-[#3157D5] bg-[#EEF2FD] px-2.5 py-0.5 rounded-full">
                    {tpl.category}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-[#172033] leading-snug">{tpl.title}</h3>
                <p className="text-xs text-[#78849A] mt-1.5 leading-relaxed line-clamp-3">
                  {tpl.description}
                </p>

                {/* Meta details */}
                <div className="p-3 bg-[#F4F7FB] rounded-xl border border-[#E5EAF2] space-y-1.5 text-xs mt-4">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-[#78849A] flex items-center gap-1">
                      <Volume2 className="w-3 h-3 text-[#3157D5]" /> Recommended Voice:
                    </span>
                    <span className="font-semibold text-[#172033]">{tpl.suggestedVoice}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-[#78849A] flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#16A36A]" /> Setup Time:
                    </span>
                    <span className="font-semibold text-[#172033]">~{tpl.estimatedSetupMinutes} mins</span>
                  </div>
                </div>

                {/* Included Tools */}
                <div className="flex items-center gap-1.5 flex-wrap mt-3">
                  {tpl.includedTools.map((tool) => (
                    <span key={tool} className="text-[10px] font-mono bg-[#EEF2FD] text-[#3157D5] px-2 py-0.5 rounded-md font-semibold">
                      +{tool}()
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-[#EDF2F7]">
                <button
                  onClick={() => handleUseTemplate(tpl)}
                  className="w-full py-2.5 bg-[#3157D5] hover:bg-[#2646B8] text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                >
                  <span>Use This Template</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
