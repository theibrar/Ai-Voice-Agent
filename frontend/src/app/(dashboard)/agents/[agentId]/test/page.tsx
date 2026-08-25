"use client";

import React, { useState, use, useRef, useEffect } from "react";
import Link from "next/link";
import { useAppStore } from "@/lib/store";
import { PageHeader } from "@/components/page-header";
import { StatusPill } from "@/components/status-pill";
import { AudioWaveform } from "@/components/audio-waveform";
import { formatDuration } from "@/lib/utils";
import {
  Mic,
  MicOff,
  Volume2,
  Bot,
  User,
  Zap,
  Wrench,
  BookOpen,
  ArrowLeft,
  Sparkles,
  RefreshCw,
  Send,
  Sliders,
  CheckCircle2,
} from "lucide-react";

interface TestAgentPageProps {
  params: Promise<{ agentId: string }>;
}

interface SimulatorTurn {
  id: string;
  speaker: "agent" | "user";
  text: string;
  latencyMs?: number;
  toolCall?: { name: string; result: string };
  kbMatch?: { title: string; score: number };
}

export default function TestAgentPlayground({ params }: TestAgentPageProps) {
  const resolvedParams = use(params);
  const { agents, addToast } = useAppStore();

  const agent = agents.find((a) => a.id === resolvedParams.agentId) || agents[0];

  const [isMicActive, setIsMicActive] = useState(false);
  const [inputText, setInputText] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [latency, setLatency] = useState(274);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  const [turns, setTurns] = useState<SimulatorTurn[]>([
    {
      id: "t-0",
      speaker: "agent",
      text: agent.greeting,
      latencyMs: 180,
    },
  ]);

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [turns, isThinking]);

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const userTurn: SimulatorTurn = {
      id: `turn-${Date.now()}-user`,
      speaker: "user",
      text: text.trim(),
    };

    setTurns((prev) => [...prev, userTurn]);
    setInputText("");
    setIsThinking(true);

    const generatedLatency = Math.floor(Math.random() * 60) + 240;
    setLatency(generatedLatency);

    // Mock AI Response generator based on agent type
    setTimeout(() => {
      let replyText = `Thanks for asking about that! Our platform guarantees high availability with ${agent.voice.voiceName} speech synthesis.`;
      let toolCall: { name: string; result: string } | undefined = undefined;
      let kbMatch: { title: string; score: number } | undefined = undefined;

      const lower = text.toLowerCase();
      if (lower.includes("price") || lower.includes("cost") || lower.includes("tier")) {
        replyText = "Our Enterprise tier starts at $0.08 per minute with dedicated concurrency ports and volume discounts above 50k minutes.";
        kbMatch = { title: "Apex Pricing & Tier Matrix 2026", score: 0.94 };
      } else if (lower.includes("demo") || lower.includes("schedule") || lower.includes("meeting") || lower.includes("book")) {
        replyText = "I have checked our calendar and have tomorrow at 2:00 PM Pacific open. Would you like me to book that slot for you?";
        toolCall = { name: "check_calendar_availability", result: "Slot available: Tomorrow 2:00 PM PST" };
      } else if (lower.includes("soc2") || lower.includes("hipaa") || lower.includes("security")) {
        replyText = "We are fully SOC2 Type II and HIPAA compliant with signed BAAs and zero persistent audio data retention.";
        kbMatch = { title: "Apex Enterprise Architecture & Security FAQ", score: 0.98 };
      }

      const agentTurn: SimulatorTurn = {
        id: `turn-${Date.now()}-agent`,
        speaker: "agent",
        text: replyText,
        latencyMs: generatedLatency,
        toolCall,
        kbMatch,
      };

      setTurns((prev) => [...prev, agentTurn]);
      setIsThinking(false);
    }, 600);
  };

  const handleToggleMic = () => {
    if (!isMicActive) {
      setIsMicActive(true);
      addToast({
        title: "Microphone Active (Simulator)",
        description: "Listening for simulated speech turns...",
        type: "success",
      });
      setTimeout(() => {
        handleSendMessage("Hi Rachel, can you explain your pricing and schedule a quick demo?");
        setIsMicActive(false);
      }, 1500);
    } else {
      setIsMicActive(false);
    }
  };

  const resetPlayground = () => {
    setTurns([{ id: "t-0", speaker: "agent", text: agent.greeting, latencyMs: 180 }]);
    addToast({ title: "Playground Reset", description: "Cleared transcript logs.", type: "info" });
  };

  return (
    <div className="space-y-6">
      {/* Top bar */}
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
              <h1 className="text-xl font-bold text-[#172033]">Voice Simulator: {agent.name}</h1>
              <span className="text-xs font-bold text-[#16A36A] bg-[#E8F7F0] px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#16A36A] animate-pulse" />
                Live Playground
              </span>
            </div>
            <p className="text-xs text-[#78849A] mt-0.5">
              {agent.voice.provider} • {agent.voice.voiceName} • Roundtrip Latency: {latency}ms
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={resetPlayground}
            className="flex items-center gap-1.5 px-3 py-2 bg-white border border-[#E5EAF2] hover:bg-[#F4F7FB] text-[#78849A] hover:text-[#172033] text-xs font-semibold rounded-xl transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Test</span>
          </button>
          <Link
            href={`/agents/${agent.id}`}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#3157D5] hover:bg-[#2646B8] text-white text-xs font-semibold rounded-xl shadow-xs transition-all"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Edit Instructions</span>
          </Link>
        </div>
      </div>

      {/* Simulator Deck */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 cols: Audio Waveform & Speech Chat Exchange */}
        <div className="lg:col-span-2 space-y-4">
          {/* Real-time Waveform Deck */}
          <div className="p-5 bg-white rounded-2xl border border-[#E5EAF2] card-shadow space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-[#3157D5]" />
                <h3 className="text-xs font-bold text-[#172033] uppercase tracking-wider">
                  Neural Speech Audio Visualizer
                </h3>
              </div>
              <span className="text-xs font-mono font-bold text-[#3157D5] bg-[#EEF2FD] px-2.5 py-0.5 rounded-lg flex items-center gap-1">
                <Zap className="w-3 h-3" />
                {latency}ms STT+LLM+TTS
              </span>
            </div>

            <AudioWaveform
              active={true}
              audioLevel={isThinking ? 20 : 65}
              color={agent.color}
              speaker="agent"
              label={`${agent.voice.voiceName} (${agent.voice.provider})`}
            />

            {/* Quick suggested prompt chips */}
            <div className="flex items-center gap-1.5 flex-wrap pt-2">
              <span className="text-[11px] font-semibold text-[#78849A]">Test Scenarios:</span>
              {[
                "What is your pricing model?",
                "Can you schedule a live product demo?",
                "Are you SOC2 & HIPAA compliant?",
                "Can you transfer me to an account rep?",
              ].map((chip) => (
                <button
                  key={chip}
                  onClick={() => handleSendMessage(chip)}
                  className="text-xs bg-[#F4F7FB] hover:bg-[#EEF2FD] text-[#172033] hover:text-[#3157D5] px-2.5 py-1 rounded-lg border border-[#E5EAF2] transition-colors"
                >
                  &quot;{chip}&quot;
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Chat Stream */}
          <div className="p-5 bg-white rounded-2xl border border-[#E5EAF2] card-shadow flex flex-col justify-between min-h-[380px]">
            <div
              ref={chatScrollRef}
              className="space-y-4 max-h-80 overflow-y-auto pr-1 flex-1 mb-4 scrollbar-thin"
            >
              {turns.map((turn) => {
                const isAgent = turn.speaker === "agent";
                return (
                  <div
                    key={turn.id}
                    className={`flex gap-3 text-xs ${isAgent ? "items-start" : "items-start flex-row-reverse"}`}
                  >
                    <div
                      className={`w-7 h-7 rounded-xl flex items-center justify-center text-white font-bold text-xs shrink-0 mt-0.5 ${
                        isAgent ? "bg-[#3157D5]" : "bg-[#101A33]"
                      }`}
                    >
                      {isAgent ? <Bot className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                    </div>

                    <div className={`flex flex-col max-w-[80%] ${isAgent ? "items-start" : "items-end"}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-[11px] text-[#172033]">
                          {isAgent ? agent.name : "Tester"}
                        </span>
                        {turn.latencyMs && (
                          <span className="text-[10px] text-[#3157D5] bg-[#EEF2FD] px-1.5 py-0.2 rounded font-mono font-medium">
                            {turn.latencyMs}ms
                          </span>
                        )}
                      </div>

                      <div
                        className={`p-3 rounded-2xl leading-relaxed ${
                          isAgent
                            ? "bg-[#F4F7FB] text-[#172033] rounded-tl-xs border border-[#E5EAF2]"
                            : "bg-[#3157D5] text-white rounded-tr-xs shadow-xs"
                        }`}
                      >
                        {turn.text}
                      </div>

                      {/* Tool call telemetry pill */}
                      {turn.toolCall && (
                        <div className="mt-1.5 p-2 bg-[#EEF2FD] border border-[#3157D5]/20 rounded-xl text-[11px] text-[#101A33] flex items-center gap-2">
                          <Wrench className="w-3.5 h-3.5 text-[#3157D5]" />
                          <div>
                            <span className="font-semibold text-[#3157D5]">Tool: {turn.toolCall.name}()</span>
                            <p className="text-[10px] text-[#78849A]">{turn.toolCall.result}</p>
                          </div>
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#16A36A] ml-auto" />
                        </div>
                      )}

                      {/* KB match pill */}
                      {turn.kbMatch && (
                        <div className="mt-1.5 p-2 bg-[#E8F7F0] border border-[#16A36A]/20 rounded-xl text-[11px] text-[#172033] flex items-center gap-2">
                          <BookOpen className="w-3.5 h-3.5 text-[#16A36A]" />
                          <span>KB Matched: {turn.kbMatch.title} ({Math.round(turn.kbMatch.score * 100)}%)</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {isThinking && (
                <div className="flex items-center gap-2 text-xs text-[#78849A]">
                  <div className="w-6 h-6 rounded-lg bg-[#EEF2FD] flex items-center justify-center text-[#3157D5]">
                    <Bot className="w-3.5 h-3.5 animate-spin" />
                  </div>
                  <span className="italic">{agent.name} is speaking...</span>
                </div>
              )}
            </div>

            {/* Input Bar with Mic & Send */}
            <div className="pt-3 border-t border-[#EDF2F7] flex items-center gap-2">
              <button
                type="button"
                onClick={handleToggleMic}
                title={isMicActive ? "Stop voice input" : "Speak to agent"}
                className={`p-2.5 rounded-xl border transition-all ${
                  isMicActive
                    ? "bg-[#D95C68] text-white border-[#D95C68] animate-pulse"
                    : "bg-[#F4F7FB] text-[#78849A] hover:text-[#172033] border-[#E5EAF2]"
                }`}
              >
                {isMicActive ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              <input
                type="text"
                placeholder="Type your message to test voice agent response..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                className="flex-1 text-xs px-3.5 py-2.5 bg-[#F4F7FB] border border-[#E5EAF2] rounded-xl outline-none focus:border-[#3157D5]"
              />

              <button
                type="button"
                onClick={() => handleSendMessage()}
                className="px-4 py-2.5 bg-[#3157D5] hover:bg-[#2646B8] text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right 1 col: Live Telemetry & Inspector */}
        <div className="space-y-4">
          <div className="p-5 bg-white rounded-2xl border border-[#E5EAF2] card-shadow space-y-4">
            <h3 className="text-xs font-bold text-[#172033] uppercase tracking-wider">
              Speech Telemetry & Latency
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-2.5 bg-[#F4F7FB] rounded-xl">
                <span className="text-[#78849A]">STT Transcriber</span>
                <span className="font-bold text-[#172033]">Deepgram Nova-2 (95ms)</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-[#F4F7FB] rounded-xl">
                <span className="text-[#78849A]">LLM Engine</span>
                <span className="font-bold text-[#172033]">Claude 3.5 Sonnet (115ms)</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-[#F4F7FB] rounded-xl">
                <span className="text-[#78849A]">TTS Audio Stream</span>
                <span className="font-bold text-[#172033]">{agent.voice.provider} (64ms)</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-[#EEF2FD] rounded-xl border border-[#3157D5]/20">
                <span className="font-bold text-[#3157D5]">Roundtrip Latency</span>
                <span className="font-bold text-[#3157D5]">{latency}ms Total</span>
              </div>
            </div>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-[#E5EAF2] card-shadow space-y-3">
            <h3 className="text-xs font-bold text-[#172033] uppercase tracking-wider">
              Active Knowledge Grounding
            </h3>
            <p className="text-xs text-[#78849A] leading-relaxed">
              Grounding agent responses with <strong className="text-[#172033]">{agent.knowledgeBaseIds.length} attached collections</strong>.
            </p>
            <div className="p-3 bg-[#F4F7FB] rounded-xl border border-[#E5EAF2] text-[11px] text-[#78849A]">
              Vector Search Threshold: <strong className="text-[#172033]">0.85 Cosine</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
