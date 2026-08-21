"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { Campaign, CampaignType } from "@/lib/types";
import { PageHeader } from "@/components/page-header";
import {
  Megaphone,
  Bot,
  Phone,
  Clock,
  Sliders,
  Users,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Zap,
  Voicemail,
  Radio,
  Play,
  Pause,
  Volume2,
} from "lucide-react";

export default function CreateCampaignPage() {
  const router = useRouter();
  const { agents, phoneNumbers, addCampaign, addToast } = useAppStore();

  const [step, setStep] = useState(1);

  // Form State
  const [name, setName] = useState("Q4 Enterprise Sales Surge");
  const [type, setType] = useState<CampaignType>("outbound_sales");
  const [agentId, setAgentId] = useState(agents[0]?.id || "agent-1");
  const [phoneNumber, setPhoneNumber] = useState(phoneNumbers[0]?.formattedNumber || "+1 (800) 459-0120");
  const [concurrency, setConcurrency] = useState(25);
  const [retryAttempts, setRetryAttempts] = useState(3);
  const [retryInterval, setRetryInterval] = useState(30);
  const [timezone, setTimezone] = useState("America/New_York");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("18:00");
  const [selectedDays, setSelectedDays] = useState(["Mon", "Tue", "Wed", "Thu", "Fri"]);
  const [totalLeads, setTotalLeads] = useState(2500);

  // Feature 6: Smart AMD 2.0 State
  const [amdEnabled, setAmdEnabled] = useState(true);
  const [beepHz, setBeepHz] = useState(1000);
  const [beepDelayMs, setBeepDelayMs] = useState(1200);
  const [voicemailScript, setVoicemailScript] = useState(
    "Hi {{contact_name}}, this is Rachel following up on {{company}}'s voice automation trial. I sent an invite for a brief overview—call us back at {{callback_number}} or reply to our email. Have a great day!"
  );
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false);

  const selectedAgent = agents.find((a) => a.id === agentId) || agents[0];

  const handleLaunch = () => {
    const newCamp: Campaign = {
      id: `camp-${Date.now()}`,
      name,
      type,
      status: "active",
      agentId,
      agentName: selectedAgent.name,
      phoneNumber,
      totalLeads,
      calledLeads: 0,
      connectedLeads: 0,
      qualifiedLeads: 0,
      conversionRate: 0,
      answerRate: 0,
      concurrencyLimit: concurrency,
      retryAttempts,
      retryIntervalMinutes: retryInterval,
      schedule: {
        timezone,
        days: selectedDays,
        startTime,
        endTime,
      },
      amdConfig: amdEnabled
        ? {
            enabled: true,
            beepDetectionHz: beepHz,
            detectionTimeoutMs: beepDelayMs,
            script: voicemailScript,
            postDropAction: "log_crm",
          }
        : undefined,
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString(),
    };

    addCampaign(newCamp);
    router.push(`/campaigns/${newCamp.id}`);
  };

  const steps = [
    { num: 1, title: "Identity & Type" },
    { num: 2, title: "Agent & Line" },
    { num: 3, title: "Smart AMD 2.0" },
    { num: 4, title: "Dialing Pace" },
    { num: 5, title: "Review & Launch" },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3">
        <Link
          href="/campaigns"
          className="p-2 bg-white border border-[#E5EAF2] rounded-xl text-[#78849A] hover:text-[#172033] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-[#172033]">Create Outbound Campaign</h1>
          <p className="text-xs text-[#78849A]">Configure autonomous outbound voice workflows with smart answering machine drop.</p>
        </div>
      </div>

      {/* Progress Stepper */}
      <div className="bg-white p-4 rounded-2xl border border-[#E5EAF2] card-shadow">
        <div className="flex items-center justify-between">
          {steps.map((s, idx) => (
            <div key={s.num} className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => s.num < step && setStep(s.num)}
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step === s.num
                    ? "bg-[#3157D5] text-white ring-4 ring-[#3157D5]/10"
                    : step > s.num
                    ? "bg-[#16A36A] text-white"
                    : "bg-[#F4F7FB] text-[#78849A]"
                }`}
              >
                {step > s.num ? <CheckCircle2 className="w-4 h-4" /> : s.num}
              </button>
              <span className={`text-xs font-semibold hidden md:inline ${step === s.num ? "text-[#172033]" : "text-[#78849A]"}`}>
                {s.title}
              </span>
              {idx < steps.length - 1 && <div className="w-6 md:w-12 h-0.5 bg-[#EDF2F7] mx-1" />}
            </div>
          ))}
        </div>
      </div>

      {/* Wizard Form Panels */}
      <div className="bg-white p-6 rounded-2xl border border-[#E5EAF2] card-shadow space-y-6">
        {/* Step 1: Campaign Identity */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-[#172033]">Campaign Details & Strategy</h2>

            <div>
              <label className="block text-xs font-semibold text-[#172033] mb-1.5">Campaign Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Q4 Inbound Follow-up"
                className="w-full px-3.5 py-2.5 bg-[#F4F7FB] border border-[#E5EAF2] rounded-xl text-xs text-[#172033] outline-none focus:border-[#3157D5]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#172033] mb-1.5">Campaign Type</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { id: "outbound_sales", title: "Outbound Sales & Lead Gen", desc: "Cold/Warm prospect outreach & qualification" },
                  { id: "lead_qualification", title: "Inbound Lead Follow-up", desc: "Call website leads within 60 seconds" },
                  { id: "appointment_reminder", title: "Appointment Reminders", desc: "Confirm scheduled meetings & reduce no-shows" },
                  { id: "survey", title: "Customer NPS & Feedback", desc: "Post-service satisfaction survey calls" },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setType(t.id as CampaignType)}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      type === t.id
                        ? "bg-[#EEF2FD] border-[#3157D5] ring-2 ring-[#3157D5]/10"
                        : "bg-[#F4F7FB] border-[#E5EAF2] hover:bg-[#EDF2F7]"
                    }`}
                  >
                    <span className="text-xs font-bold text-[#172033] block">{t.title}</span>
                    <span className="text-[11px] text-[#78849A] mt-0.5 block">{t.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#172033] mb-1.5">Target Lead List Size</label>
              <input
                type="number"
                value={totalLeads}
                onChange={(e) => setTotalLeads(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-[#F4F7FB] border border-[#E5EAF2] rounded-xl text-xs font-mono outline-none focus:border-[#3157D5]"
              />
            </div>
          </div>
        )}

        {/* Step 2: Agent & Phone Line */}
        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-[#172033]">Assigned Voice Agent & Caller ID</h2>

            <div>
              <label className="block text-xs font-semibold text-[#172033] mb-1.5">Select Voice Agent</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {agents.map((ag) => (
                  <button
                    key={ag.id}
                    type="button"
                    onClick={() => setAgentId(ag.id)}
                    className={`p-3 rounded-xl border flex items-center gap-3 transition-all ${
                      agentId === ag.id
                        ? "bg-[#EEF2FD] border-[#3157D5] ring-2 ring-[#3157D5]/10"
                        : "bg-[#F4F7FB] border-[#E5EAF2]"
                    }`}
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                      style={{ backgroundColor: ag.color }}
                    >
                      <Bot className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-bold text-[#172033]">{ag.name}</p>
                      <p className="text-[10px] text-[#78849A]">{ag.voice.voiceName} • {ag.language}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#172033] mb-1.5">Outbound Caller ID (Registered Trunk)</label>
              <select
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#F4F7FB] border border-[#E5EAF2] rounded-xl text-xs font-mono outline-none focus:border-[#3157D5]"
              >
                {phoneNumbers.map((pn) => (
                  <option key={pn.id} value={pn.formattedNumber}>
                    {pn.formattedNumber} — {pn.friendlyName}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Step 3: FEATURE 6: Smart AMD 2.0 & Voicemail Drop */}
        {step === 3 && (
          <div className="space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#EDF2F7]">
              <div>
                <div className="flex items-center gap-2">
                  <Voicemail className="w-5 h-5 text-[#3157D5]" />
                  <h2 className="text-base font-bold text-[#172033]">Smart AMD 2.0 & Beep Tone Voicemail Drop</h2>
                </div>
                <p className="text-xs text-[#78849A] mt-0.5">
                  Eliminate awkward dead air. Automatically detect carrier voicemail beep tones and drop a crisp, personalized message.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={amdEnabled}
                  onChange={(e) => setAmdEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-[#E5EAF2] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[#E5EAF2] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#3157D5]"></div>
              </label>
            </div>

            {amdEnabled && (
              <div className="space-y-4">
                {/* Audio Frequency Detection Visualizer */}
                <div className="p-4 bg-[#101A33] text-white rounded-2xl space-y-3 shadow-md">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider flex items-center gap-1.5">
                      <Radio className="w-4 h-4 text-[#16A36A] animate-pulse" /> Carrier Audio Frequency Analyzer (1000Hz Tone Lock)
                    </span>
                    <span className="text-xs font-mono font-bold text-[#16A36A] bg-[#16A36A]/20 px-2 py-0.5 rounded">
                      AMD 2.0 Engine: Ready
                    </span>
                  </div>

                  <div className="h-10 flex items-end gap-1 px-1">
                    {Array.from({ length: 30 }).map((_, idx) => (
                      <div
                        key={idx}
                        className="flex-1 bg-[#3157D5] rounded-full transition-all duration-200"
                        style={{ height: `${(Math.sin(idx * 0.4) + 1.2) * 35}%` }}
                      />
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-mono text-[#94A3B8] pt-1">
                    <span>Frequency: {beepHz} Hz</span>
                    <span>Post-Beep Audio Delay: {beepDelayMs}ms</span>
                  </div>
                </div>

                {/* Voicemail Script with Variable Chips */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-[#172033]">Personalized Voicemail Drop Script</label>
                    <div className="flex items-center gap-1">
                      {["{{contact_name}}", "{{company}}", "{{callback_number}}"].map((token) => (
                        <button
                          key={token}
                          type="button"
                          onClick={() => setVoicemailScript((prev) => `${prev} ${token}`)}
                          className="px-1.5 py-0.5 bg-[#EEF2FD] text-[#3157D5] font-mono font-bold text-[10px] rounded hover:bg-[#E0E7FB]"
                        >
                          +{token}
                        </button>
                      ))}
                    </div>
                  </div>
                  <textarea
                    rows={4}
                    value={voicemailScript}
                    onChange={(e) => setVoicemailScript(e.target.value)}
                    className="w-full p-3.5 bg-[#F4F7FB] border border-[#E5EAF2] rounded-xl text-xs text-[#172033] outline-none focus:border-[#3157D5] leading-relaxed"
                  />
                </div>

                {/* Voicemail Audio Preview Player */}
                <div className="p-3.5 bg-[#F4F7FB] rounded-xl border border-[#E5EAF2] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setIsPreviewPlaying(!isPreviewPlaying);
                        addToast({
                          title: isPreviewPlaying ? "Audio Paused" : "Playing Voicemail Audio",
                          description: "Synthesized using Rachel voice model.",
                          type: "info",
                        });
                      }}
                      className="w-8 h-8 rounded-full bg-[#3157D5] text-white flex items-center justify-center shadow-xs"
                    >
                      {isPreviewPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                    </button>
                    <div>
                      <span className="text-xs font-bold text-[#172033] block">Test Voicemail Synthesis</span>
                      <span className="text-[10px] text-[#78849A]">Duration: ~14.2 seconds • Natural pacing</span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#16A36A] bg-[#E8F7F0] px-2 py-0.5 rounded-md">
                    TTS Voice Synced
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 4: Dialing Schedule & Concurrency */}
        {step === 4 && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-[#172033]">Dialing Pace, Concurrency & Calling Hours</h2>

            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="font-semibold text-[#172033]">Concurrent Calling Ports</span>
                <span className="font-mono font-bold text-[#3157D5]">{concurrency} Lines</span>
              </div>
              <input
                type="range"
                min="1"
                max="100"
                value={concurrency}
                onChange={(e) => setConcurrency(Number(e.target.value))}
                className="w-full accent-[#3157D5]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#172033] mb-1">Max Retry Attempts</label>
                <select
                  value={retryAttempts}
                  onChange={(e) => setRetryAttempts(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-[#F4F7FB] border border-[#E5EAF2] rounded-xl text-xs outline-none focus:border-[#3157D5]"
                >
                  <option value={1}>1 Attempt</option>
                  <option value={2}>2 Attempts</option>
                  <option value={3}>3 Attempts (Recommended)</option>
                  <option value={5}>5 Attempts</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172033] mb-1">Retry Interval (Minutes)</label>
                <input
                  type="number"
                  value={retryInterval}
                  onChange={(e) => setRetryInterval(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-[#F4F7FB] border border-[#E5EAF2] rounded-xl text-xs font-mono outline-none focus:border-[#3157D5]"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Review & Launch */}
        {step === 5 && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-[#172033]">Review & Confirm Launch</h2>

            <div className="p-4 bg-[#F4F7FB] rounded-2xl border border-[#E5EAF2] space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-[#E5EAF2]">
                <span className="text-[#78849A]">Campaign Name:</span>
                <span className="font-bold text-[#172033]">{name}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#E5EAF2]">
                <span className="text-[#78849A]">Assigned Voice Agent:</span>
                <span className="font-semibold text-[#3157D5]">{selectedAgent.name}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#E5EAF2]">
                <span className="text-[#78849A]">Caller ID:</span>
                <span className="font-mono text-[#172033]">{phoneNumber}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#E5EAF2]">
                <span className="text-[#78849A]">Smart AMD 2.0:</span>
                <span className="font-bold text-[#16A36A]">{amdEnabled ? "Active (1000Hz Tone Beep Drop)" : "Disabled"}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[#78849A]">Target Leads:</span>
                <span className="font-mono font-bold text-[#172033]">{totalLeads.toLocaleString()} Prospects</span>
              </div>
            </div>
          </div>
        )}

        {/* Wizard Footer Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-[#EDF2F7]">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-[#F4F7FB] border border-[#E5EAF2] text-[#172033] text-xs font-semibold rounded-xl transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : <div />}

          {step < 5 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="flex items-center gap-1.5 px-5 py-2.5 bg-[#3157D5] hover:bg-[#2646B8] text-white text-xs font-semibold rounded-xl shadow-xs transition-all"
            >
              <span>Next Step</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleLaunch}
              className="flex items-center gap-1.5 px-6 py-2.5 bg-[#16A36A] hover:bg-[#138A5A] text-white text-xs font-bold rounded-xl shadow-md transition-all"
            >
              <Zap className="w-4 h-4" />
              <span>Launch Autonomous Campaign</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
