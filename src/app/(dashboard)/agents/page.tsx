"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAppStore } from "@/lib/store";
import { PageHeader } from "@/components/page-header";
import { StatusPill } from "@/components/status-pill";
import { formatDuration, formatRelativeTime } from "@/lib/utils";
import {
  Bot,
  Plus,
  Search,
  LayoutGrid,
  Table as TableIcon,
  Play,
  Pause,
  Copy,
  Sparkles,
  PhoneCall,
  Volume2,
  Sliders,
  ArrowRight,
  MoreVertical,
  Wrench,
  BookOpen,
} from "lucide-react";

export default function AgentsPage() {
  const { agents, toggleAgentStatus, duplicateAgent, addToast } = useAppStore();

  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [providerFilter, setProviderFilter] = useState<string>("all");

  const filteredAgents = agents.filter((agent) => {
    const matchesSearch =
      agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.voice.voiceName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ? true : agent.status === statusFilter;

    const matchesProvider =
      providerFilter === "all" ? true : agent.voice.provider === providerFilter;

    return matchesSearch && matchesStatus && matchesProvider;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Voice Agents"
        description="Deploy and configure autonomous voice agents with ultra-low latency speech, custom tools, and knowledge grounding."
        actions={
          <div className="flex items-center gap-2">
            <Link
              href="/templates"
              className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-[#F4F7FB] border border-[#E5EAF2] text-[#172033] text-xs font-semibold rounded-xl transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#3157D5]" />
              <span>Browse Templates</span>
            </Link>
            <Link
              href="/agents/new"
              className="flex items-center gap-1.5 px-3.5 py-2 bg-[#3157D5] hover:bg-[#2646B8] text-white text-xs font-semibold rounded-xl shadow-xs transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Agent</span>
            </Link>
          </div>
        }
      />

      {/* Filter and View Bar */}
      <div className="p-4 bg-white rounded-2xl border border-[#E5EAF2] card-shadow flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#78849A] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search agents by name, voice, or prompt..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 bg-[#F4F7FB] border border-[#E5EAF2] rounded-xl text-xs text-[#172033] placeholder-[#78849A] outline-none focus:border-[#3157D5]"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap w-full md:w-auto">
          {/* Status Tabs */}
          <div className="flex items-center gap-1 bg-[#F4F7FB] p-1 rounded-xl border border-[#E5EAF2]">
            {["all", "active", "paused", "draft"].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors capitalize ${
                  statusFilter === st
                    ? "bg-white text-[#3157D5] shadow-2xs"
                    : "text-[#78849A] hover:text-[#172033]"
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Provider Filter */}
          <select
            value={providerFilter}
            onChange={(e) => setProviderFilter(e.target.value)}
            className="px-3 py-1.5 bg-[#F4F7FB] border border-[#E5EAF2] rounded-xl text-xs font-medium text-[#172033] outline-none focus:border-[#3157D5]"
          >
            <option value="all">All TTS Providers</option>
            <option value="ElevenLabs">ElevenLabs</option>
            <option value="Cartesia">Cartesia</option>
            <option value="Deepgram">Deepgram</option>
            <option value="OpenAI">OpenAI</option>
          </select>

          {/* Grid / Table Toggle */}
          <div className="flex items-center gap-1 bg-[#F4F7FB] p-1 rounded-xl border border-[#E5EAF2]">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                viewMode === "grid" ? "bg-white text-[#3157D5] shadow-2xs" : "text-[#78849A]"
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                viewMode === "table" ? "bg-white text-[#3157D5] shadow-2xs" : "text-[#78849A]"
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Agents View */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredAgents.map((agent) => (
            <div
              key={agent.id}
              className="p-5 bg-white rounded-2xl border border-[#E5EAF2] card-shadow card-hover flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-11 h-11 rounded-2xl flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-sm"
                      style={{ backgroundColor: agent.color }}
                    >
                      <Bot className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#172033] leading-snug">{agent.name}</h3>
                      <span className="inline-block text-[10px] font-semibold text-[#3157D5] bg-[#EEF2FD] px-2 py-0.2 rounded-md mt-0.5">
                        {agent.voice.provider} • {agent.voice.voiceName}
                      </span>
                    </div>
                  </div>

                  <StatusPill status={agent.status} size="sm" />
                </div>

                <p className="text-xs text-[#78849A] line-clamp-2 leading-relaxed mb-4">
                  {agent.description}
                </p>

                {/* Capabilities Badges */}
                <div className="flex items-center gap-2 mb-4 text-[11px] text-[#78849A] flex-wrap">
                  <span className="flex items-center gap-1 bg-[#F4F7FB] px-2 py-0.5 rounded-md border border-[#E5EAF2]">
                    <Wrench className="w-3 h-3 text-[#3157D5]" />
                    {agent.tools.length} Tools Active
                  </span>
                  <span className="flex items-center gap-1 bg-[#F4F7FB] px-2 py-0.5 rounded-md border border-[#E5EAF2]">
                    <BookOpen className="w-3 h-3 text-[#16A36A]" />
                    {agent.knowledgeBaseIds.length} KB Sources
                  </span>
                  <span className="bg-[#F4F7FB] px-2 py-0.5 rounded-md border border-[#E5EAF2]">
                    {agent.language}
                  </span>
                </div>

                {/* Metrics Matrix */}
                <div className="grid grid-cols-3 gap-2 py-2.5 px-3 bg-[#F4F7FB] rounded-xl border border-[#E5EAF2] text-center mb-4">
                  <div>
                    <span className="text-[10px] text-[#78849A] block">Handled Calls</span>
                    <span className="text-xs font-bold text-[#172033]">
                      {agent.metrics.totalCalls.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#78849A] block">Success %</span>
                    <span className="text-xs font-bold text-[#16A36A]">
                      {agent.metrics.successRate}%
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#78849A] block">Avg Duration</span>
                    <span className="text-xs font-bold text-[#172033]">
                      {formatDuration(agent.metrics.avgDurationSeconds)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="pt-3 border-t border-[#EDF2F7] flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => toggleAgentStatus(agent.id)}
                    title={agent.status === "active" ? "Pause Agent" : "Activate Agent"}
                    className="p-1.5 rounded-lg border border-[#E5EAF2] hover:bg-[#F4F7FB] text-[#78849A] hover:text-[#172033] transition-colors"
                  >
                    {agent.status === "active" ? <Pause className="w-3.5 h-3.5 text-[#16A36A]" /> : <Play className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    onClick={() => duplicateAgent(agent.id)}
                    title="Duplicate Agent"
                    className="p-1.5 rounded-lg border border-[#E5EAF2] hover:bg-[#F4F7FB] text-[#78849A] hover:text-[#172033] transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/agents/${agent.id}/test`}
                    className="px-2.5 py-1 text-xs font-semibold bg-[#EEF2FD] text-[#3157D5] hover:bg-[#E0E7FB] rounded-lg transition-colors flex items-center gap-1"
                  >
                    <Volume2 className="w-3 h-3" />
                    <span>Test Voice</span>
                  </Link>

                  <Link
                    href={`/agents/${agent.id}`}
                    className="px-2.5 py-1 text-xs font-semibold bg-[#3157D5] text-white hover:bg-[#2646B8] rounded-lg transition-colors"
                  >
                    Configure
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white rounded-2xl border border-[#E5EAF2] card-shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F4F7FB] text-[#78849A] uppercase tracking-wider font-semibold border-b border-[#E5EAF2]">
                <tr>
                  <th className="p-4">Agent Name</th>
                  <th className="p-4">Voice & Engine</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Calls Handled</th>
                  <th className="p-4">Success Rate</th>
                  <th className="p-4">Avg Duration</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5EAF2]">
                {filteredAgents.map((agent) => (
                  <tr key={agent.id} className="hover:bg-[#F4F7FB]/60 transition-colors">
                    <td className="p-4 font-bold text-[#172033] flex items-center gap-2.5">
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-bold text-xs"
                        style={{ backgroundColor: agent.color }}
                      >
                        <Bot className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <span>{agent.name}</span>
                        <p className="text-[10px] text-[#78849A] font-normal">{agent.language}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="font-semibold text-[#172033]">{agent.voice.voiceName}</span>
                      <p className="text-[10px] text-[#78849A]">{agent.voice.provider}</p>
                    </td>
                    <td className="p-4">
                      <StatusPill status={agent.status} size="sm" />
                    </td>
                    <td className="p-4 font-mono font-medium">{agent.metrics.totalCalls.toLocaleString()}</td>
                    <td className="p-4 font-semibold text-[#16A36A]">{agent.metrics.successRate}%</td>
                    <td className="p-4 font-mono">{formatDuration(agent.metrics.avgDurationSeconds)}</td>
                    <td className="p-4 text-right space-x-2">
                      <Link
                        href={`/agents/${agent.id}/test`}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#EEF2FD] text-[#3157D5] font-semibold rounded-lg hover:bg-[#E0E7FB]"
                      >
                        <Volume2 className="w-3 h-3" /> Test
                      </Link>
                      <Link
                        href={`/agents/${agent.id}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#3157D5] text-white font-semibold rounded-lg hover:bg-[#2646B8]"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
