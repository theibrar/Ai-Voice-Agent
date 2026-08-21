"use client";

import React, { useState } from "react";
import { useAppStore } from "@/lib/store";
import { PageHeader } from "@/components/page-header";
import {
  Layers,
  Sparkles,
  TrendingDown,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Clock,
  Filter,
} from "lucide-react";

export default function ConversationFunnelsPage() {
  const { funnelSteps } = useAppStore();
  const [selectedStep, setSelectedStep] = useState(funnelSteps[2]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Conversation Funnels & Step Friction Analytics"
        description="Inspect exactly which questions and prompt turns cause prospects to disconnect, with automated AI Prescriptive Optimizations to boost retention."
        badge={
          <span className="flex items-center gap-1.5 px-3 py-1 bg-[#EEF2FD] text-[#3157D5] border border-[#3157D5]/20 rounded-full text-xs font-bold">
            <Layers className="w-3.5 h-3.5" />
            6-Step Conversation Funnel
          </span>
        }
      />

      {/* Top Level Funnel Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 bg-white rounded-3xl border border-[#E5EAF2] card-shadow">
          <span className="text-xs font-semibold text-[#78849A] uppercase tracking-wider">Top-of-Funnel Ingest</span>
          <div className="text-2xl font-bold text-[#172033] mt-1">10,000 Callers</div>
          <span className="text-xs text-[#16A36A] font-semibold mt-1 block">100% Dialog Initiated</span>
        </div>

        <div className="p-5 bg-white rounded-3xl border border-[#E5EAF2] card-shadow">
          <span className="text-xs font-semibold text-[#78849A] uppercase tracking-wider">End-to-End Retention</span>
          <div className="text-2xl font-bold text-[#16A36A] mt-1">58.4% Finalized</div>
          <span className="text-xs text-[#78849A] mt-1 block">5,840 booked meetings & confirmed SMS</span>
        </div>

        <div className="p-5 bg-white rounded-3xl border border-[#E5EAF2] card-shadow">
          <span className="text-xs font-semibold text-[#78849A] uppercase tracking-wider">Highest Friction Turn</span>
          <div className="text-2xl font-bold text-[#D95C68] mt-1">Step 3 (-12.9%)</div>
          <span className="text-xs text-[#D95C68] font-semibold mt-1 block">Qualification / Volume Hesitation</span>
        </div>
      </div>

      {/* Interactive 6-Step Visual Funnel Grid */}
      <div className="bg-white p-6 rounded-3xl border border-[#E5EAF2] card-shadow space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-[#EDF2F7]">
          <div>
            <h2 className="text-base font-bold text-[#172033]">Conversation Flow Drop-Off Progression</h2>
            <p className="text-xs text-[#78849A]">Click on any stage below to analyze caller hesitation and read AI prompt improvements.</p>
          </div>
          <span className="text-xs font-bold text-[#3157D5] bg-[#EEF2FD] px-3 py-1 rounded-full">
            Real-time LLM Telemetry
          </span>
        </div>

        {/* Steps Bar Grid */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
          {funnelSteps.map((step) => {
            const isSelected = selectedStep.id === step.id;
            const isHighDrop = step.dropOffRatePercent > 10;
            return (
              <div
                key={step.id}
                onClick={() => setSelectedStep(step)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between space-y-3 ${
                  isSelected
                    ? "bg-[#EEF2FD] border-[#3157D5] ring-4 ring-[#3157D5]/15 shadow-md"
                    : "bg-[#F4F7FB] border-[#E5EAF2] hover:bg-[#EDF2F7]"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] font-bold text-[#78849A] mb-1">
                    <span>STEP {step.stepNumber}</span>
                    <span className={`px-1.5 py-0.5 rounded font-mono ${
                      isHighDrop ? "bg-[#FDF2F3] text-[#D95C68] font-bold" : "bg-[#E8F7F0] text-[#16A36A]"
                    }`}>
                      -{step.dropOffRatePercent}%
                    </span>
                  </div>
                  <h3 className="text-xs font-bold text-[#172033] leading-snug line-clamp-2">{step.stepName}</h3>
                </div>

                <div>
                  <div className="w-full bg-[#E5EAF2] h-2 rounded-full overflow-hidden mb-1.5">
                    <div
                      className={`h-full rounded-full transition-all ${isHighDrop ? "bg-[#D95C68]" : "bg-[#3157D5]"}`}
                      style={{ width: `${(step.completedCount / 10000) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] font-mono text-[#78849A]">
                    <span>{step.completedCount.toLocaleString()} kept</span>
                    <span>{Math.round((step.completedCount / 10000) * 100)}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Step Friction Inspector & AI Prescription */}
        <div className="p-5 bg-gradient-to-r from-[#F4F7FB] via-white to-[#EEF2FD] rounded-2xl border-2 border-[#3157D5]/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="space-y-1.5 max-w-lg">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-[#172033] text-base">
                Step {selectedStep.stepNumber}: {selectedStep.stepName}
              </span>
              <span className="text-xs font-bold text-[#D95C68] bg-[#FDF2F3] px-2.5 py-0.5 rounded-full border border-[#D95C68]/20">
                Drop Reason: {selectedStep.dropOffReason}
              </span>
            </div>
            <p className="text-xs text-[#78849A] leading-relaxed">
              Total <strong>{selectedStep.visitorsCount - selectedStep.completedCount} prospects ({selectedStep.dropOffRatePercent}%)</strong> disconnected during this specific question turn.
            </p>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-[#3157D5]/30 shadow-xs max-w-md w-full space-y-1">
            <div className="flex items-center gap-1.5 text-[#3157D5] font-bold text-xs">
              <CheckCircle2 className="w-4 h-4" />
              <span>Recommended Script Optimization:</span>
            </div>
            <p className="text-xs text-[#172033] leading-relaxed">
              &quot;{selectedStep.aiOptimizationTip}&quot;
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
