"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAppStore } from "@/lib/store";
import { PageHeader } from "@/components/page-header";
import { StatusPill } from "@/components/status-pill";
import {
  Megaphone,
  Plus,
  Search,
  Play,
  Pause,
  Users,
  PhoneCall,
  Clock,
  ArrowRight,
  TrendingUp,
  Sliders,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

export default function CampaignsPage() {
  const { campaigns, toggleCampaignStatus, addToast } = useAppStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredCampaigns = campaigns.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.agentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phoneNumber.includes(searchQuery);

    const matchesStatus =
      statusFilter === "all" ? true : c.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalLeads = campaigns.reduce((acc, c) => acc + c.totalLeads, 0);
  const totalCalled = campaigns.reduce((acc, c) => acc + c.calledLeads, 0);
  const avgConversion = campaigns.length > 0
    ? (campaigns.reduce((acc, c) => acc + c.conversionRate, 0) / campaigns.length).toFixed(1)
    : "0.0";

  return (
    <div className="space-y-6">
      <PageHeader
        title="Voice Campaigns & Outreach"
        description="Launch and scale high-concurrency automated inbound funnels and outbound calling cadences."
        actions={
          <Link
            href="/campaigns/new"
            className="flex items-center gap-1.5 px-4 py-2 bg-[#3157D5] hover:bg-[#2646B8] text-white text-xs font-semibold rounded-xl shadow-xs transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create Campaign</span>
          </Link>
        }
      />

      {/* Summary Matrix Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-[#E5EAF2] card-shadow">
          <span className="text-xs font-semibold text-[#78849A] uppercase tracking-wider">Total Campaigns</span>
          <div className="text-2xl font-bold text-[#172033] mt-1">{campaigns.length}</div>
          <span className="text-xs text-[#16A36A] font-semibold mt-1 block">
            {campaigns.filter((c) => c.status === "active").length} actively calling
          </span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-[#E5EAF2] card-shadow">
          <span className="text-xs font-semibold text-[#78849A] uppercase tracking-wider">Total Target Leads</span>
          <div className="text-2xl font-bold text-[#172033] mt-1">{totalLeads.toLocaleString()}</div>
          <span className="text-xs text-[#3157D5] font-semibold mt-1 block">
            {totalCalled.toLocaleString()} attempted ({Math.round((totalCalled / (totalLeads || 1)) * 100)}%)
          </span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-[#E5EAF2] card-shadow">
          <span className="text-xs font-semibold text-[#78849A] uppercase tracking-wider">Avg Conversion Rate</span>
          <div className="text-2xl font-bold text-[#16A36A] mt-1">{avgConversion}%</div>
          <span className="text-xs text-[#78849A] mt-1 block">Score &gt; 75 qualified</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-[#E5EAF2] card-shadow">
          <span className="text-xs font-semibold text-[#78849A] uppercase tracking-wider">Allocated Concurrency</span>
          <div className="text-2xl font-bold text-[#172033] mt-1">{campaigns.length > 0 ? "110 Ports" : "0 Ports"}</div>
          <span className="text-xs text-[#16A36A] font-semibold mt-1 block">
            {campaigns.length > 0 ? "Auto-scaling SIP trunks" : "No active SIP trunks"}
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-white rounded-2xl border border-[#E5EAF2] card-shadow flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#78849A] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search campaigns by name, agent, phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 bg-[#F4F7FB] border border-[#E5EAF2] rounded-xl text-xs text-[#172033] placeholder-[#78849A] outline-none focus:border-[#3157D5]"
          />
        </div>

        <div className="flex items-center gap-1 bg-[#F4F7FB] p-1 rounded-xl border border-[#E5EAF2]">
          {["all", "active", "paused", "draft", "completed"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors capitalize ${
                statusFilter === st
                  ? "bg-white text-[#3157D5] shadow-2xs"
                  : "text-[#78849A] hover:text-[#172033]"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Campaigns Table */}
      <div className="bg-white rounded-2xl border border-[#E5EAF2] card-shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F4F7FB] text-[#78849A] uppercase tracking-wider font-semibold border-b border-[#E5EAF2]">
              <tr>
                <th className="p-4">Campaign Name</th>
                <th className="p-4">Assigned Agent</th>
                <th className="p-4">Caller ID</th>
                <th className="p-4">Status</th>
                <th className="p-4">Progress / Leads</th>
                <th className="p-4">Conversion Rate</th>
                <th className="p-4">Schedule</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5EAF2]">
              {filteredCampaigns.length > 0 ? (
                filteredCampaigns.map((camp) => (
                  <tr key={camp.id} className="hover:bg-[#F4F7FB]/60 transition-colors">
                    <td className="p-4 font-bold text-[#172033]">
                      <Link href={`/campaigns/${camp.id}`} className="hover:text-[#3157D5] transition-colors">
                        {camp.name}
                      </Link>
                      <p className="text-[10px] text-[#78849A] font-normal capitalize">
                        {camp.type.replace("_", " ")}
                      </p>
                    </td>
                    <td className="p-4 font-medium text-[#172033]">{camp.agentName}</td>
                    <td className="p-4 font-mono text-[#78849A]">{camp.phoneNumber}</td>
                    <td className="p-4">
                      <StatusPill status={camp.status} size="sm" />
                    </td>
                    <td className="p-4 min-w-[140px]">
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="font-semibold text-[#172033]">{camp.calledLeads} / {camp.totalLeads}</span>
                        <span className="text-[#78849A]">
                          {Math.round((camp.calledLeads / (camp.totalLeads || 1)) * 100)}%
                        </span>
                      </div>
                      <div className="w-full bg-[#E5EAF2] h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-[#3157D5] h-full rounded-full"
                          style={{ width: `${(camp.calledLeads / (camp.totalLeads || 1)) * 100}%` }}
                        />
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="font-bold text-[#16A36A]">{camp.conversionRate}%</span>
                      <p className="text-[10px] text-[#78849A]">{camp.qualifiedLeads} qualified</p>
                    </td>
                    <td className="p-4 text-[11px] text-[#78849A]">
                      {camp.schedule.days.slice(0, 3).join(", ")} • {camp.schedule.startTime}-{camp.schedule.endTime}
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => toggleCampaignStatus(camp.id)}
                        title={camp.status === "active" ? "Pause campaign" : "Start campaign"}
                        className="p-1.5 rounded-lg border border-[#E5EAF2] hover:bg-[#F4F7FB] text-[#78849A] hover:text-[#172033] transition-colors inline-flex items-center"
                      >
                        {camp.status === "active" ? <Pause className="w-3.5 h-3.5 text-[#16A36A]" /> : <Play className="w-3.5 h-3.5" />}
                      </button>
                      <Link
                        href={`/campaigns/${camp.id}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#EEF2FD] text-[#3157D5] font-semibold rounded-lg hover:bg-[#E0E7FB]"
                      >
                        Monitor
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-[#64748B] text-xs">
                    No voice campaigns or outreach cadences recorded in database yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
