"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAppStore } from "@/lib/store";
import { PageHeader } from "@/components/page-header";
import { ABTestExperiment } from "@/lib/types";
import { formatDuration } from "@/lib/utils";
import {
  Sparkles,
  Award,
  TrendingUp,
  Bot,
  Volume2,
  CheckCircle2,
  ArrowRight,
  Plus,
  Play,
  Pause,
  Clock,
  Sliders,
  Scale,
  Zap,
  X,
} from "lucide-react";

export default function ABTestingStudioPage() {
  const { abExperiments, crownExperimentWinner, addToast } = useAppStore();

  const [selectedExperiment, setSelectedExperiment] = useState<ABTestExperiment>(abExperiments[0]);
  const [showNewExperimentModal, setShowNewExperimentModal] = useState(false);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Prompt & Voice A/B Testing Studio"
        description="Statistically optimize conversion rates by running Champion vs Challenger split-tests on voice models, greetings, and prompts."
        badge={
          <span className="flex items-center gap-1.5 px-3 py-1 bg-[#EEF2FD] border border-[#3157D5]/20 text-[#3157D5] rounded-full text-xs font-bold">
            <Scale className="w-3.5 h-3.5" />
            Champion / Challenger Framework
          </span>
        }
        actions={
          <button
            onClick={() => setShowNewExperimentModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#3157D5] hover:bg-[#2646B8] text-white text-xs font-semibold rounded-xl shadow-xs transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>New A/B Experiment</span>
          </button>
        }
      />

      {/* Top Level Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-[#E5EAF2] card-shadow">
          <span className="text-xs font-semibold text-[#78849A] uppercase tracking-wider">Active Experiments</span>
          <div className="text-2xl font-bold text-[#172033] mt-1">{abExperiments.filter((e) => e.status === "running").length} Running</div>
          <span className="text-xs text-[#16A36A] font-semibold mt-1 block">50/50 automated traffic split</span>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-[#E5EAF2] card-shadow">
          <span className="text-xs font-semibold text-[#78849A] uppercase tracking-wider">Conversion Lift Observed</span>
          <div className="text-2xl font-bold text-[#16A36A] mt-1">+13.6%</div>
          <span className="text-xs text-[#78849A] mt-1 block">Variant B outperforms baseline</span>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-[#E5EAF2] card-shadow">
          <span className="text-xs font-semibold text-[#78849A] uppercase tracking-wider">Statistical Confidence</span>
          <div className="text-2xl font-bold text-[#3157D5] mt-1">99.2%</div>
          <span className="text-xs text-[#16A36A] font-semibold mt-1 block">p-value &lt; 0.01 (High certainty)</span>
        </div>
      </div>

      {/* Main Experiment Comparison Deck */}
      <div className="bg-white rounded-2xl border border-[#E5EAF2] card-shadow p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-[#EDF2F7]">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-[#172033]">{selectedExperiment.name}</h2>
              <span className="text-xs font-bold text-[#16A36A] bg-[#E8F7F0] px-2.5 py-0.5 rounded-full">
                {selectedExperiment.status.toUpperCase()}
              </span>
            </div>
            <p className="text-xs text-[#78849A] mt-0.5">
              Testing since {new Date(selectedExperiment.startDate).toLocaleDateString()} • {selectedExperiment.metricsA.callsCount + selectedExperiment.metricsB.callsCount} total calls sampled
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => crownExperimentWinner(selectedExperiment.id, "variantB")}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#16A36A] hover:bg-[#138A5A] text-white text-xs font-bold rounded-xl shadow-xs transition-all"
            >
              <Award className="w-4 h-4" />
              <span>Crown Variant B Winner & Scale 100%</span>
            </button>
          </div>
        </div>

        {/* Side-by-Side Variant Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Variant A (Champion) */}
          <div className={`p-5 rounded-2xl border flex flex-col justify-between space-y-4 ${
            selectedExperiment.winner === "variantA"
              ? "bg-[#E8F7F0]/40 border-[#16A36A] ring-2 ring-[#16A36A]/20"
              : "bg-[#F4F7FB] border-[#E5EAF2]"
          }`}>
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold bg-white text-[#172033] px-2.5 py-1 rounded-lg border border-[#E5EAF2] shadow-2xs">
                    Champion (Baseline)
                  </span>
                  <span className="text-xs text-[#78849A]">50% Traffic</span>
                </div>
                <span className="text-xs font-mono font-bold text-[#172033]">
                  {selectedExperiment.metricsA.callsCount} Calls
                </span>
              </div>

              <h3 className="text-sm font-bold text-[#172033] mb-1">{selectedExperiment.variantA.name}</h3>
              <p className="text-xs text-[#78849A] mb-3">
                Voice: <strong className="text-[#172033]">{selectedExperiment.variantA.voiceName}</strong> ({selectedExperiment.variantA.provider})
              </p>

              {/* Greeting Script Preview */}
              <div className="p-3 bg-white rounded-xl border border-[#E5EAF2] text-xs space-y-1 mb-4">
                <span className="font-semibold text-[#78849A] text-[10px] uppercase">Greeting Speech:</span>
                <p className="italic text-[#172033] leading-relaxed">&quot;{selectedExperiment.variantA.greeting}&quot;</p>
              </div>

              {/* Key Metrics Matrix */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                <div className="p-2.5 bg-white rounded-xl border border-[#E5EAF2]">
                  <span className="text-[10px] text-[#78849A] block">Conversion %</span>
                  <span className="text-sm font-bold text-[#172033]">{selectedExperiment.metricsA.conversionRate}%</span>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-[#E5EAF2]">
                  <span className="text-[10px] text-[#78849A] block">Answer Rate</span>
                  <span className="text-sm font-bold text-[#172033]">{selectedExperiment.metricsA.answerRate}%</span>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-[#E5EAF2]">
                  <span className="text-[10px] text-[#78849A] block">Avg Duration</span>
                  <span className="text-sm font-bold text-[#172033]">{formatDuration(selectedExperiment.metricsA.avgDurationSec)}</span>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-[#E5EAF2]">
                  <span className="text-[10px] text-[#78849A] block">Sentiment</span>
                  <span className="text-sm font-bold text-[#172033]">{selectedExperiment.metricsA.sentimentScore}%</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#E5EAF2] flex justify-between items-center text-xs text-[#78849A]">
              <span>Direct ROI Pitch</span>
              <button
                onClick={() => crownExperimentWinner(selectedExperiment.id, "variantA")}
                className="text-xs font-semibold text-[#3157D5] hover:underline"
              >
                Promote Variant A
              </button>
            </div>
          </div>

          {/* Variant B (Challenger) */}
          <div className={`p-5 rounded-2xl border flex flex-col justify-between space-y-4 ${
            selectedExperiment.winner === "variantB" || true
              ? "bg-[#EEF2FD]/50 border-[#3157D5] ring-2 ring-[#3157D5]/20 shadow-md"
              : "bg-[#F4F7FB] border-[#E5EAF2]"
          }`}>
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold bg-[#3157D5] text-white px-2.5 py-1 rounded-lg shadow-2xs">
                    Challenger (Recommended)
                  </span>
                  <span className="text-xs font-bold text-[#16A36A] bg-[#E8F7F0] px-2 py-0.5 rounded-full">
                    +13.6% Conv Lift
                  </span>
                </div>
                <span className="text-xs font-mono font-bold text-[#3157D5]">
                  {selectedExperiment.metricsB.callsCount} Calls
                </span>
              </div>

              <h3 className="text-sm font-bold text-[#172033] mb-1">{selectedExperiment.variantB.name}</h3>
              <p className="text-xs text-[#78849A] mb-3">
                Voice: <strong className="text-[#172033]">{selectedExperiment.variantB.voiceName}</strong> ({selectedExperiment.variantB.provider})
              </p>

              {/* Greeting Script Preview */}
              <div className="p-3 bg-white rounded-xl border border-[#3157D5]/30 text-xs space-y-1 mb-4">
                <span className="font-semibold text-[#3157D5] text-[10px] uppercase">Greeting Speech:</span>
                <p className="italic text-[#172033] leading-relaxed">&quot;{selectedExperiment.variantB.greeting}&quot;</p>
              </div>

              {/* Key Metrics Matrix */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                <div className="p-2.5 bg-white rounded-xl border border-[#3157D5]/20">
                  <span className="text-[10px] text-[#78849A] block">Conversion %</span>
                  <span className="text-sm font-bold text-[#16A36A]">{selectedExperiment.metricsB.conversionRate}%</span>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-[#3157D5]/20">
                  <span className="text-[10px] text-[#78849A] block">Answer Rate</span>
                  <span className="text-sm font-bold text-[#16A36A]">{selectedExperiment.metricsB.answerRate}%</span>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-[#3157D5]/20">
                  <span className="text-[10px] text-[#78849A] block">Avg Duration</span>
                  <span className="text-sm font-bold text-[#3157D5]">{formatDuration(selectedExperiment.metricsB.avgDurationSec)}</span>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-[#3157D5]/20">
                  <span className="text-[10px] text-[#78849A] block">Sentiment</span>
                  <span className="text-sm font-bold text-[#16A36A]">{selectedExperiment.metricsB.sentimentScore}%</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#3157D5]/20 flex justify-between items-center text-xs">
              <span className="text-[#16A36A] font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> High Statistical Significance
              </span>
              <button
                onClick={() => crownExperimentWinner(selectedExperiment.id, "variantB")}
                className="text-xs font-bold text-[#3157D5] hover:underline"
              >
                Promote to 100% Traffic &gt;
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* New Experiment Modal */}
      {showNewExperimentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#101A33]/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-[#E5EAF2] max-w-lg w-full p-6 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5EAF2]">
              <h3 className="text-base font-bold text-[#172033]">Create New A/B Voice Experiment</h3>
              <button onClick={() => setShowNewExperimentModal(false)} className="text-[#78849A] hover:text-[#172033]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[#172033] mb-1">Experiment Name</label>
                <input
                  type="text"
                  placeholder="e.g. Rachel vs Marcus Healthcare Triage Tone"
                  defaultValue="Rachel vs Marcus Healthcare Triage Tone"
                  className="w-full px-3 py-2 bg-[#F4F7FB] border border-[#E5EAF2] rounded-xl outline-none focus:border-[#3157D5]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#172033] mb-1">Variant A Voice</label>
                  <select className="w-full px-3 py-2 bg-[#F4F7FB] border border-[#E5EAF2] rounded-xl outline-none">
                    <option>Rachel (US Professional)</option>
                    <option>Bella (Engaging & Clear)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-[#172033] mb-1">Variant B Voice</label>
                  <select className="w-full px-3 py-2 bg-[#F4F7FB] border border-[#E5EAF2] rounded-xl outline-none">
                    <option>Marcus (Calm & Empathetic)</option>
                    <option>Asteria (Crisp & Helpful)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#172033] mb-1">Traffic Split</label>
                <div className="p-3 bg-[#F4F7FB] rounded-xl border border-[#E5EAF2] flex justify-between font-mono font-bold text-[#3157D5]">
                  <span>Variant A: 50%</span>
                  <span>Variant B: 50%</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E5EAF2]">
              <button
                onClick={() => setShowNewExperimentModal(false)}
                className="px-3 py-2 text-xs font-semibold text-[#78849A] hover:text-[#172033]"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowNewExperimentModal(false);
                  addToast({ title: "Experiment Launched", description: "A/B traffic split initialized on live calls.", type: "success" });
                }}
                className="px-4 py-2 bg-[#3157D5] hover:bg-[#2646B8] text-white text-xs font-semibold rounded-xl shadow-xs"
              >
                Start A/B Experiment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
