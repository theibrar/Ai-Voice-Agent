"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSuperAdminStore } from "@/lib/super-admin-store";
import { TenantAdminOrg } from "@/lib/mock-data/super-admin";
import {
  TrendingUp,
  CreditCard,
  Coins,
  Download,
  DollarSign,
  BarChart3,
  PieChart,
  ArrowUpRight,
  ShieldCheck,
  Activity,
  Cpu,
  Radio,
  Building2,
  Calendar,
  Globe,
  Clock,
  Layers,
  Sparkles,
  CheckCircle2,
  PhoneCall,
  Server,
  Zap,
  Percent,
  ChevronRight,
  Sliders,
  Filter,
  Eye,
  Bot,
  Headphones,
  Mic,
  Voicemail,
  X,
  User,
  Mail,
  Shield,
  ArrowRight,
  Search,
  RotateCcw,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
} from "recharts";

// -------------------------------------------------------------
// Comprehensive Telemetry Datasets
// -------------------------------------------------------------

const financialLedgerData = [
  { month: "Jan", revenue: 98000, carrierCost: 4120, llmCost: 6800, netProfit: 87080, marginPct: 88.8 },
  { month: "Feb", revenue: 112000, carrierCost: 4890, llmCost: 7900, netProfit: 99210, marginPct: 88.5 },
  { month: "Mar", revenue: 124500, carrierCost: 5210, llmCost: 8400, netProfit: 110890, marginPct: 89.0 },
  { month: "Apr", revenue: 136000, carrierCost: 5800, llmCost: 9100, netProfit: 121100, marginPct: 89.0 },
  { month: "May", revenue: 142800, carrierCost: 6100, llmCost: 9800, netProfit: 126900, marginPct: 88.8 },
  { month: "Jun", revenue: 148200, carrierCost: 6420, llmCost: 10200, netProfit: 131580, marginPct: 88.7 },
];

const trafficHourlyData = [
  { hour: "00:00", activeCalls: 42, telnyx: 22, twilio: 12, bandwidth: 8, privateSbc: 0 },
  { hour: "02:00", activeCalls: 28, telnyx: 15, twilio: 8, bandwidth: 5, privateSbc: 0 },
  { hour: "04:00", activeCalls: 35, telnyx: 18, twilio: 10, bandwidth: 7, privateSbc: 0 },
  { hour: "06:00", activeCalls: 84, telnyx: 44, twilio: 24, bandwidth: 16, privateSbc: 0 },
  { hour: "08:00", activeCalls: 198, telnyx: 95, twilio: 58, bandwidth: 35, privateSbc: 10 },
  { hour: "10:00", activeCalls: 320, telnyx: 150, twilio: 92, bandwidth: 58, privateSbc: 20 },
  { hour: "12:00", activeCalls: 342, telnyx: 162, twilio: 98, bandwidth: 62, privateSbc: 20 },
  { hour: "14:00", activeCalls: 310, telnyx: 148, twilio: 90, bandwidth: 54, privateSbc: 18 },
  { hour: "16:00", activeCalls: 285, telnyx: 135, twilio: 82, bandwidth: 50, privateSbc: 18 },
  { hour: "18:00", activeCalls: 210, telnyx: 102, twilio: 64, bandwidth: 34, privateSbc: 10 },
  { hour: "20:00", activeCalls: 140, telnyx: 70, twilio: 42, bandwidth: 22, privateSbc: 6 },
  { hour: "22:00", activeCalls: 75, telnyx: 38, twilio: 22, bandwidth: 12, privateSbc: 3 },
];

const modelTokenData = [
  { model: "OpenAI GPT-4o", tokensM: 385.4, latencyMs: 240, costUSD: 963.5, callsCount: 421000, ttft: "180ms" },
  { model: "Claude 3.5 Sonnet", tokensM: 210.2, latencyMs: 270, costUSD: 630.6, callsCount: 214000, ttft: "210ms" },
  { model: "Google Gemini 1.5 Pro", tokensM: 142.8, latencyMs: 260, costUSD: 178.5, callsCount: 180000, ttft: "195ms" },
  { model: "DeepSeek V3", tokensM: 78.5, latencyMs: 190, costUSD: 21.2, callsCount: 95000, ttft: "140ms" },
  { model: "Groq Llama 3.3 70B", tokensM: 25.7, latencyMs: 95, costUSD: 15.1, callsCount: 38000, ttft: "75ms" },
];

const carrierSharePie = [
  { name: "Telnyx Elastic Tier-1", value: 48, color: "#3157D5" },
  { name: "Twilio Elastic SIP", value: 28, color: "#5C82FF" },
  { name: "Bandwidth.com Healthcare", value: 16, color: "#10B981" },
  { name: "Private Dedicated SBC", value: 8, color: "#F59E0B" },
];

const geographicRegionsData = [
  { region: "US-East (Ashburn / Virginia)", latency: "4.2 ms", packetLoss: "0.008%", channels: "162 / 400", status: "Optimal" },
  { region: "US-West (San Jose / Silicon Valley)", latency: "6.8 ms", packetLoss: "0.012%", channels: "98 / 300", status: "Optimal" },
  { region: "EU-Central (Frankfurt / Germany)", latency: "14.5 ms", packetLoss: "0.015%", channels: "54 / 200", status: "Optimal" },
  { region: "AP-East (Singapore / Asia Pacific)", latency: "22.1 ms", packetLoss: "0.024%", channels: "28 / 100", status: "Optimal" },
];

// Mock agent breakdown seed per tenant
const tenantAgentProfiles: Record<string, Array<{ name: string; type: string; llm: string; tts: string; stt: string; calls: number; avgDuration: string; sentiment: string; successRate: string }>> = {
  "org-1": [
    { name: "Marcus (Solar Sales)", type: "Outbound Lead Gen", llm: "OpenAI GPT-4o", tts: "ElevenLabs Turbo v2", stt: "Deepgram Nova-3", calls: 14200, avgDuration: "3m 45s", sentiment: "+0.86", successRate: "94.8%" },
    { name: "Sarah (Energy Advisor)", type: "Inbound Support", llm: "Claude 3.5 Sonnet", tts: "Cartesia Sonic", stt: "NVIDIA Parakeet TDT", calls: 8900, avgDuration: "4m 12s", sentiment: "+0.91", successRate: "97.2%" },
    { name: "QualBot 2.0", type: "Lead Qualifier", llm: "DeepSeek V3", tts: "Kokoro-82M", stt: "Deepgram Nova-3", calls: 24500, avgDuration: "1m 30s", sentiment: "+0.78", successRate: "91.5%" },
  ],
  "org-2": [
    { name: "Elena (Med Triage)", type: "Inbound Clinic", llm: "OpenAI GPT-4o", tts: "Cartesia Sonic", stt: "Deepgram Nova-3", calls: 19400, avgDuration: "5m 10s", sentiment: "+0.94", successRate: "98.5%" },
    { name: "Prescription Refill AI", type: "Automated IVR", llm: "Groq Llama 3.3", tts: "ElevenLabs Turbo v2", stt: "Deepgram Nova-3", calls: 31200, avgDuration: "1m 15s", sentiment: "+0.82", successRate: "99.1%" },
  ],
  "org-3": [
    { name: "Jordan (Mortgage Desk)", type: "Refinance Outbound", llm: "Claude 3.5 Sonnet", tts: "ElevenLabs Turbo v2", stt: "Deepgram Nova-3", calls: 11500, avgDuration: "4m 02s", sentiment: "+0.85", successRate: "93.4%" },
    { name: "Document Collection Bot", type: "SMS & Follow-up", llm: "Google Gemini 1.5", tts: "Cartesia Sonic", stt: "NVIDIA Parakeet TDT", calls: 6400, avgDuration: "2m 18s", sentiment: "+0.89", successRate: "96.0%" },
  ],
  "org-4": [
    { name: "ClaimStatus AI", type: "Auto Insurance", llm: "DeepSeek V3", tts: "Kokoro-82M", stt: "Deepgram Nova-3", calls: 18200, avgDuration: "3m 15s", sentiment: "+0.80", successRate: "95.2%" },
  ],
  "org-5": [
    { name: "SaaS SDR Outbound", type: "Cold Outreach", llm: "OpenAI GPT-4o", tts: "ElevenLabs Turbo v2", stt: "Deepgram Nova-3", calls: 9800, avgDuration: "2m 45s", sentiment: "+0.76", successRate: "89.0%" },
    { name: "Demo Scheduler AI", type: "Inbound Cal Sync", llm: "Claude 3.5 Sonnet", tts: "Cartesia Sonic", stt: "Deepgram Nova-3", calls: 4200, avgDuration: "2m 10s", sentiment: "+0.92", successRate: "97.5%" },
  ],
};

function SuperAdminAnalyticsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tabFromQuery = searchParams.get("tab") || "overview";

  const { tenants, plans, globalCalls, addToast } = useSuperAdminStore();

  const [activeViewTab, setActiveViewTab] = useState<string>(tabFromQuery);
  const [timeRange, setTimeRange] = useState<string>("30d");

  // Selected Tenant for 360° Deep-Dive Inspector
  const [inspectTenant, setInspectTenant] = useState<TenantAdminOrg | null>(null);

  // Manual Date Range & Filter State for Tenant Analytics
  const [startDate, setStartDate] = useState("2026-06-01");
  const [endDate, setEndDate] = useState("2026-06-30");
  const [appliedDateFilter, setAppliedDateFilter] = useState<{ start: string; end: string } | null>({ start: "2026-06-01", end: "2026-06-30" });
  const [tenantSearchQuery, setTenantSearchQuery] = useState("");
  const [tenantPlanFilter, setTenantPlanFilter] = useState("all");

  // Keep state synchronized with URL query params
  useEffect(() => {
    if (tabFromQuery) {
      setActiveViewTab(tabFromQuery);
    }
  }, [tabFromQuery]);

  const handleTabChange = (tabId: string) => {
    setActiveViewTab(tabId);
    if (tabId === "overview") {
      router.push("/super-admin/analytics");
    } else {
      router.push(`/super-admin/analytics?tab=${tabId}`);
    }
  };

  const handleApplyDateFilter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate) return;
    setAppliedDateFilter({ start: startDate, end: endDate });
    addToast({
      title: "Date Range Applied",
      description: `Filtered tenant analytics between ${startDate} and ${endDate}.`,
      type: "success",
    });
  };

  const handleResetDateFilter = () => {
    setStartDate("2026-06-01");
    setEndDate("2026-06-30");
    setAppliedDateFilter(null);
    setTenantSearchQuery("");
    setTenantPlanFilter("all");
    addToast({
      title: "Filters Cleared",
      description: "Showing all-time tenant telemetry.",
      type: "info",
    });
  };

  // Summary Metrics calculations
  const totalMRR = tenants.reduce((acc, t) => acc + t.monthlySpend, 0);
  const estCarrierCost = totalMRR * 0.043;
  const estLlmCost = totalMRR * 0.068;
  const estNetProfit = totalMRR - estCarrierCost - estLlmCost;
  const marginPercent = ((estNetProfit / totalMRR) * 100).toFixed(1);
  const totalBilledMinutes = tenants.reduce((acc, t) => acc + t.totalMinutesUsedThisMonth, 0);

  // Filter tenants by search query & plan
  const filteredTenants = tenants.filter((t) => {
    const matchSearch =
      t.orgName.toLowerCase().includes(tenantSearchQuery.toLowerCase()) ||
      t.primaryAdminEmail.toLowerCase().includes(tenantSearchQuery.toLowerCase()) ||
      t.primaryAdminName.toLowerCase().includes(tenantSearchQuery.toLowerCase());
    const matchPlan = tenantPlanFilter === "all" || t.planId === tenantPlanFilter;
    return matchSearch && matchPlan;
  });

  const handleExportFullReport = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Month,Gross Billed Revenue,Carrier Wholesale Cost,Model & TTS API Cost,Net Operating Profit,Margin %\n" +
      financialLedgerData
        .map(
          (d) =>
            `"${d.month}","$${d.revenue}","$${d.carrierCost}","$${d.llmCost}","$${d.netProfit}","${d.marginPct}%"`
        )
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `apex_platform_analytics_${timeRange}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast({
      title: "Detailed Report Exported",
      description: `Downloaded apex_platform_analytics_${timeRange}.csv`,
      type: "success",
    });
  };

  return (
    <div className="space-y-6">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white rounded-3xl border border-[#E2E8F0] shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#3157D5] text-white flex items-center justify-center shadow-lg shadow-[#3157D5]/30 shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-semibold text-[#0F172A] tracking-tight">Platform Analytics & Intelligence</h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EEF2FD] text-[#3157D5]">
                {marginPercent}% Net Margin
              </span>
            </div>
            <p className="text-xs text-[#64748B] mt-0.5">
              Multi-step platform intelligence: Real-time telemetry, custom date range filtering, P&L waterfall ledgers, concurrent SIP capacity, AI model token economics, and 360° tenant profile deep-dives.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Time Range Selector */}
          <div className="flex items-center bg-[#F8FAFC] p-1 rounded-xl border border-[#E2E8F0] text-xs font-semibold">
            {[
              { id: "24h", label: "24h" },
              { id: "7d", label: "7d" },
              { id: "30d", label: "30d" },
              { id: "q2", label: "Q2 2026" },
              { id: "ytd", label: "YTD" },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTimeRange(t.id)}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  timeRange === t.id ? "bg-[#3157D5] text-white shadow-2xs" : "text-[#64748B] hover:text-[#0F172A]"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <button
            onClick={handleExportFullReport}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#3157D5] hover:bg-[#2646B8] text-white rounded-xl text-xs font-semibold transition-all shadow-md shadow-[#3157D5]/20 shrink-0"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Analytics (.CSV)</span>
          </button>
        </div>
      </div>

      {/* 2. Top-Level Platform KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-3xl border border-[#E2E8F0] shadow-xs space-y-1.5">
          <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-wider text-[#64748B]">
            <span>Gross Monthly Revenue</span>
            <DollarSign className="w-4 h-4 text-[#3157D5]" />
          </div>
          <div className="text-2xl font-semibold text-[#0F172A] font-mono">
            ${totalMRR.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="flex items-center justify-between text-xs pt-1 border-t border-[#EDF2F7]">
            <span className="text-emerald-600 font-semibold flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" />
              +14.8% MoM
            </span>
            <span className="text-[#64748B] font-mono">$29,640 ARPU</span>
          </div>
        </div>

        <div className="p-5 bg-white rounded-3xl border border-[#E2E8F0] shadow-xs space-y-1.5">
          <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-wider text-[#64748B]">
            <span>Net Operating Margin</span>
            <Percent className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-semibold text-emerald-600 font-mono">
            {marginPercent}%
          </div>
          <div className="flex items-center justify-between text-xs pt-1 border-t border-[#EDF2F7]">
            <span className="text-[#0F172A] font-semibold font-mono">${estNetProfit.toLocaleString(undefined, { maximumFractionDigits: 0 })} Net Profit</span>
            <span className="text-xs text-[#64748B]">Wholesale Optimized</span>
          </div>
        </div>

        <div className="p-5 bg-white rounded-3xl border border-[#E2E8F0] shadow-xs space-y-1.5">
          <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-wider text-[#64748B]">
            <span>Billed Voice Minutes</span>
            <PhoneCall className="w-4 h-4 text-[#3157D5]" />
          </div>
          <div className="text-2xl font-semibold text-[#0F172A] font-mono">
            {totalBilledMinutes.toLocaleString()} min
          </div>
          <div className="flex items-center justify-between text-xs pt-1 border-t border-[#EDF2F7]">
            <span className="text-[#3157D5] font-semibold">342 Peak Channels</span>
            <span className="text-[#64748B]">$0.089 avg/min</span>
          </div>
        </div>

        <div className="p-5 bg-white rounded-3xl border border-[#E2E8F0] shadow-xs space-y-1.5">
          <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-wider text-[#64748B]">
            <span>Model Tokens & Speech</span>
            <Cpu className="w-4 h-4 text-[#3157D5]" />
          </div>
          <div className="text-2xl font-semibold text-[#3157D5] font-mono">
            842.6M Tokens
          </div>
          <div className="flex items-center justify-between text-xs pt-1 border-t border-[#EDF2F7]">
            <span className="text-blue-700 font-semibold">185ms avg latency</span>
            <span className="text-[#64748B]">5 Active LLMs</span>
          </div>
        </div>
      </div>

      {/* 3. Deep Analysis Navigation Tabs */}
      <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-[#E2E8F0] shadow-xs w-fit flex-wrap">
        {[
          { id: "overview", label: "Step-by-Step Overview", icon: BarChart3 },
          { id: "tenants", label: "Tenant 360° Deep-Dive", icon: Layers, badge: `${tenants.length} Orgs` },
          { id: "financial", label: "Financial & P&L Waterfall", icon: DollarSign },
          { id: "telephony", label: "Voice Traffic & SIP Capacity", icon: Activity },
          { id: "models", label: "AI Models & Token Economics", icon: Cpu },
          { id: "regions", label: "Geographic POP Health", icon: Globe },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeViewTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 text-xs rounded-lg transition-all ${
                isActive
                  ? "bg-[#3157D5] text-white shadow-md shadow-[#3157D5]/20 font-semibold"
                  : "text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {tab.badge && (
                <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                  isActive ? "bg-white/20 text-white" : "bg-[#EEF2FD] text-[#3157D5]"
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 4. TAB CONTENT: Tenant 360° Deep-Dive Inspector with Manual Date Filter */}
      {(activeViewTab === "overview" || activeViewTab === "tenants") && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 px-1">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#3157D5] text-white flex items-center justify-center text-xs font-semibold">
                1
              </span>
              <div>
                <h2 className="text-base font-semibold text-[#0F172A]">Tenant Admin 360° Consumption, Agents & SIP Telemetry</h2>
                <p className="text-xs text-[#64748B]">Manually filter by custom dates, inspect deployed AI agents, SIP channels, and click any row for full 360° dossier.</p>
              </div>
            </div>

            {appliedDateFilter && (
              <div className="flex items-center gap-1.5 px-3 py-1 bg-[#EEF2FD] text-[#3157D5] border border-[#3157D5]/30 rounded-xl text-xs font-semibold">
                <Calendar className="w-3.5 h-3.5" />
                <span>Date Filter: {appliedDateFilter.start} ➔ {appliedDateFilter.end}</span>
              </div>
            )}
          </div>

          {/* Manual Date Filter & Search Toolbar Card */}
          <div className="p-5 bg-white rounded-3xl border border-[#E2E8F0] shadow-xs space-y-4">
            <form onSubmit={handleApplyDateFilter} className="flex flex-col lg:flex-row items-stretch lg:items-end justify-between gap-4 text-xs">
              {/* Date Inputs */}
              <div className="flex flex-wrap items-center gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-[#0F172A] block mb-1">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="px-3 py-2 bg-white border border-[#E2E8F0] rounded-xl text-xs text-[#0F172A] outline-none focus:border-[#3157D5] font-mono"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-[#0F172A] block mb-1">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="px-3 py-2 bg-white border border-[#E2E8F0] rounded-xl text-xs text-[#0F172A] outline-none focus:border-[#3157D5] font-mono"
                  />
                </div>

                {/* Date Quick Presets */}
                <div className="flex items-center gap-1 pt-4 self-end">
                  {[
                    { label: "Today", start: "2026-06-17", end: "2026-06-17" },
                    { label: "Last 7d", start: "2026-06-10", end: "2026-06-17" },
                    { label: "Last 30d", start: "2026-05-18", end: "2026-06-17" },
                    { label: "This Month", start: "2026-06-01", end: "2026-06-30" },
                  ].map((p) => (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => {
                        setStartDate(p.start);
                        setEndDate(p.end);
                        setAppliedDateFilter({ start: p.start, end: p.end });
                      }}
                      className="px-2.5 py-1.5 bg-[#F8FAFC] hover:bg-[#EEF2FD] hover:text-[#3157D5] border border-[#E2E8F0] rounded-lg text-[11px] font-semibold text-[#64748B] transition-colors"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Search and Plan Filter */}
              <div className="flex flex-wrap items-center gap-2.5">
                <div className="relative w-48 sm:w-56">
                  <Search className="w-3.5 h-3.5 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search tenant org / admin..."
                    value={tenantSearchQuery}
                    onChange={(e) => setTenantSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 bg-white border border-[#E2E8F0] rounded-xl text-xs text-[#0F172A] outline-none focus:border-[#3157D5]"
                  />
                </div>

                <select
                  value={tenantPlanFilter}
                  onChange={(e) => setTenantPlanFilter(e.target.value)}
                  className="px-3 py-2 bg-white border border-[#E2E8F0] rounded-xl text-xs text-[#0F172A] outline-none focus:border-[#3157D5]"
                >
                  <option value="all">All Plan Tiers</option>
                  {plans.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>

                <button
                  type="submit"
                  className="px-4 py-2 bg-[#3157D5] hover:bg-[#2646B8] text-white rounded-xl text-xs font-semibold shadow-md shadow-[#3157D5]/20 transition-all flex items-center gap-1.5 shrink-0"
                >
                  <Filter className="w-3.5 h-3.5" />
                  <span>Apply Date Filter</span>
                </button>

                <button
                  type="button"
                  onClick={handleResetDateFilter}
                  className="p-2 bg-white hover:bg-[#F8FAFC] border border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A] rounded-xl transition-colors shrink-0"
                  title="Reset Date Filters"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>

          {/* Tenant 360° Table */}
          <div className="p-6 bg-white rounded-3xl border border-[#E2E8F0] shadow-xs space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F8FAFC] text-[#64748B] uppercase tracking-wider font-semibold border-b border-[#E2E8F0]">
                  <tr>
                    <th className="p-3">Tenant Organization</th>
                    <th className="p-3">Plan Tier</th>
                    <th className="p-3">Deployed Agents</th>
                    <th className="p-3">SIP Backbone & Load</th>
                    <th className="p-3">Billed Minutes</th>
                    <th className="p-3">Credits Balance</th>
                    <th className="p-3">Period Spend</th>
                    <th className="p-3 text-right">360° Deep-Dive</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0]">
                  {filteredTenants.map((t) => {
                    const agentsList = tenantAgentProfiles[t.id] || [
                      { name: "Default Sales Agent", type: "Outbound", llm: "GPT-4o", tts: "ElevenLabs", stt: "Deepgram", calls: 8200, avgDuration: "2m 50s", sentiment: "+0.85", successRate: "94%" },
                    ];

                    return (
                      <tr key={t.id} className="hover:bg-[#EEF2FD]/40 transition-colors">
                        <td className="p-3 font-semibold text-[#0F172A]">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-[#3157D5] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                              {t.orgName.substring(0, 1)}
                            </div>
                            <div>
                              <p className="font-bold text-[#0F172A]">{t.orgName}</p>
                              <p className="text-[10px] text-[#64748B] font-mono">{t.primaryAdminEmail}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#EEF2FD] text-[#3157D5]">
                            {t.planName}
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-1.5">
                            <Bot className="w-3.5 h-3.5 text-[#3157D5]" />
                            <span className="font-semibold text-[#0F172A]">{agentsList.length} AI Agents</span>
                          </div>
                          <span className="text-[10px] text-[#64748B] truncate max-w-[130px] block">
                            {agentsList.map((a) => a.name.split(" ")[0]).join(", ")}
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="font-mono text-[#0F172A] font-semibold">{t.activeCallsNow} / {t.maxConcurrency} lines</div>
                          <span className="text-[10px] text-[#64748B] truncate max-w-[140px] block">{t.assignedSipCarrier}</span>
                        </td>
                        <td className="p-3 font-mono font-semibold text-[#0F172A]">{t.totalMinutesUsedThisMonth.toLocaleString()} min</td>
                        <td className="p-3 font-mono font-semibold text-emerald-600">${t.creditsBalance.toFixed(2)}</td>
                        <td className="p-3 font-mono font-bold text-[#0F172A]">${t.monthlySpend.toFixed(2)}</td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => setInspectTenant(t)}
                            className="px-3 py-1.5 bg-[#EEF2FD] hover:bg-[#3157D5] text-[#3157D5] hover:text-white rounded-xl text-xs font-semibold transition-all border border-[#3157D5]/30 inline-flex items-center gap-1 shadow-2xs"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Inspect 360°</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 5. TAB CONTENT: Financial & P&L Waterfall */}
      {(activeViewTab === "overview" || activeViewTab === "financial") && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center gap-2 px-1">
            <span className="w-6 h-6 rounded-full bg-[#3157D5] text-white flex items-center justify-center text-xs font-semibold">
              2
            </span>
            <h2 className="text-base font-semibold text-[#0F172A]">Financial Unit Economics & Platform P&L Waterfall</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main P&L Chart */}
            <div className="lg:col-span-2 p-6 bg-white rounded-3xl border border-[#E2E8F0] shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#EDF2F7]">
                <div>
                  <h3 className="text-sm font-semibold text-[#0F172A]">Platform P&L Waterfall & Margin Evolution</h3>
                  <p className="text-xs text-[#64748B]">Billed Revenue vs Wholesale Carrier Cost vs Model API Costs vs Net Profit</p>
                </div>
                <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                  88.7% Current Margin
                </span>
              </div>

              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={financialLedgerData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EDF2F7" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748B" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "#64748B" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#0F172A", border: "none", borderRadius: "12px", color: "#FFF", fontSize: "12px" }}
                      formatter={(val: any) => [`$${Number(val).toLocaleString()}`, "Amount"]}
                    />
                    <Legend wrapperStyle={{ fontSize: "12px" }} />
                    <Bar dataKey="revenue" fill="#3157D5" name="Gross Billed Revenue" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="carrierCost" fill="#F43F5E" name="Carrier SIP Cost" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="llmCost" fill="#F59E0B" name="Model & TTS Cost" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="netProfit" fill="#10B981" name="Net Operating Profit" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Cost Breakdown Donut / Breakdown */}
            <div className="p-6 bg-white rounded-3xl border border-[#E2E8F0] shadow-xs space-y-4 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-semibold text-[#0F172A]">Operating Expense Distribution</h3>
                <p className="text-xs text-[#64748B]">Breakdown of COGS across carrier, LLM inference, and TTS speech</p>

                <div className="space-y-3 pt-4 text-xs">
                  <div className="p-3.5 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-[#0F172A]">Net Operating Profit</span>
                      <span className="font-mono font-semibold text-emerald-600">88.7% ($131,580)</span>
                    </div>
                    <div className="w-full bg-[#E2E8F0] h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full" style={{ width: "88.7%" }} />
                    </div>
                  </div>

                  <div className="p-3.5 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-[#0F172A]">LLM & TTS Inference</span>
                      <span className="font-mono font-semibold text-amber-600">6.9% ($10,200)</span>
                    </div>
                    <div className="w-full bg-[#E2E8F0] h-2 rounded-full overflow-hidden">
                      <div className="bg-amber-500 h-full rounded-full" style={{ width: "6.9%" }} />
                    </div>
                  </div>

                  <div className="p-3.5 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-[#0F172A]">Carrier SIP Trunking</span>
                      <span className="font-mono font-semibold text-rose-600">4.3% ($6,420)</span>
                    </div>
                    <div className="w-full bg-[#E2E8F0] h-2 rounded-full overflow-hidden">
                      <div className="bg-rose-500 h-full rounded-full" style={{ width: "4.3%" }} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-[#EEF2FD] rounded-2xl border border-[#3157D5]/20 text-xs text-[#3157D5]">
                <div className="flex items-center gap-1.5 font-semibold mb-1">
                  <Sparkles className="w-4 h-4" />
                  <span>Gross Margin Optimization</span>
                </div>
                <p className="text-[11px] text-[#64748B] leading-relaxed">
                  Routing high-volume outbound campaigns through private SBCs reduces wholesale carrier cost from $0.0035/min to $0.0018/min.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. TAB CONTENT: Voice Traffic & SIP Capacity */}
      {(activeViewTab === "overview" || activeViewTab === "telephony") && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center gap-2 px-1">
            <span className="w-6 h-6 rounded-full bg-[#3157D5] text-white flex items-center justify-center text-xs font-semibold">
              3
            </span>
            <h2 className="text-base font-semibold text-[#0F172A]">Voice Traffic & Concurrent SIP Trunking Density</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Hourly SIP Traffic Area Chart */}
            <div className="lg:col-span-2 p-6 bg-white rounded-3xl border border-[#E2E8F0] shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#EDF2F7]">
                <div>
                  <h3 className="text-sm font-semibold text-[#0F172A]">24-Hour Concurrent SIP Channels</h3>
                  <p className="text-xs text-[#64748B]">Real-time concurrent channel density across carrier backbones</p>
                </div>
                <span className="text-[10px] font-semibold text-[#3157D5] bg-[#EEF2FD] px-2.5 py-1 rounded-full">
                  Peak: 342 Channels (12:00 UTC)
                </span>
              </div>

              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trafficHourlyData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorCalls" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3157D5" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#3157D5" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EDF2F7" />
                    <XAxis dataKey="hour" tick={{ fontSize: 11, fill: "#64748B" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "#64748B" }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#0F172A", border: "none", borderRadius: "12px", color: "#FFF", fontSize: "12px" }}
                      formatter={(val: any) => [`${val} active channels`, "Load"]}
                    />
                    <Area type="monotone" dataKey="activeCalls" stroke="#3157D5" strokeWidth={2.5} fillOpacity={1} fill="url(#colorCalls)" name="Total Concurrent Channels" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Carrier Share Donut */}
            <div className="p-6 bg-white rounded-3xl border border-[#E2E8F0] shadow-xs space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-[#0F172A]">Carrier Backbone Distribution</h3>
                <p className="text-xs text-[#64748B]">Traffic routing percentage by carrier trunk</p>
              </div>

              <div className="h-48 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={carrierSharePie}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {carrierSharePie.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-2 text-xs">
                {carrierSharePie.map((c) => (
                  <div key={c.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-md shrink-0" style={{ backgroundColor: c.color }} />
                      <span className="text-[#0F172A] font-semibold">{c.name}</span>
                    </div>
                    <span className="font-mono font-semibold text-[#3157D5]">{c.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7. TAB CONTENT: AI Models & Token Economics */}
      {(activeViewTab === "overview" || activeViewTab === "models") && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center gap-2 px-1">
            <span className="w-6 h-6 rounded-full bg-[#3157D5] text-white flex items-center justify-center text-xs font-semibold">
              4
            </span>
            <h2 className="text-base font-semibold text-[#0F172A]">AI Models: Token Consumption, TTFT & Latency Matrix</h2>
          </div>

          <div className="p-6 bg-white rounded-3xl border border-[#E2E8F0] shadow-xs space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F8FAFC] text-[#64748B] uppercase tracking-wider font-semibold border-b border-[#E2E8F0]">
                  <tr>
                    <th className="p-3">Model Name</th>
                    <th className="p-3">Total Calls Executed</th>
                    <th className="p-3">Tokens Processed</th>
                    <th className="p-3">TTFT First-Token</th>
                    <th className="p-3">Turn Latency</th>
                    <th className="p-3">Monthly API Cost</th>
                    <th className="p-3">Efficiency Tier</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0]">
                  {modelTokenData.map((m) => (
                    <tr key={m.model} className="hover:bg-[#EEF2FD]/40 transition-colors">
                      <td className="p-3 font-semibold text-[#0F172A] flex items-center gap-2">
                        <Cpu className="w-4 h-4 text-[#3157D5]" />
                        <span>{m.model}</span>
                      </td>
                      <td className="p-3 font-mono font-semibold text-[#0F172A]">{m.callsCount.toLocaleString()}</td>
                      <td className="p-3 font-mono text-[#3157D5] font-semibold">{m.tokensM}M tokens</td>
                      <td className="p-3 font-mono text-[#0F172A] font-semibold">{m.ttft}</td>
                      <td className="p-3 font-mono text-[#0F172A] font-semibold">{m.latencyMs} ms</td>
                      <td className="p-3 font-mono font-semibold text-[#0F172A]">${m.costUSD.toFixed(2)}</td>
                      <td className="p-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                          m.latencyMs < 120 ? "bg-emerald-50 text-emerald-600 border border-emerald-200" : "bg-[#EEF2FD] text-[#3157D5]"
                        }`}>
                          {m.latencyMs < 120 ? "Ultra-Low Latency" : "High Quality"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 8. TAB CONTENT: Geographic POP Health */}
      {(activeViewTab === "overview" || activeViewTab === "regions") && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center gap-2 px-1">
            <span className="w-6 h-6 rounded-full bg-[#3157D5] text-white flex items-center justify-center text-xs font-semibold">
              5
            </span>
            <h2 className="text-base font-semibold text-[#0F172A]">Global Edge & SIP Point of Presence (POP) Health</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {geographicRegionsData.map((reg) => (
              <div key={reg.region} className="p-5 bg-white rounded-3xl border border-[#E2E8F0] shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Globe className="w-5 h-5 text-[#3157D5]" />
                    <h3 className="font-semibold text-[#0F172A] text-sm">{reg.region}</h3>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200">
                    ● {reg.status}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs pt-2 border-t border-[#EDF2F7]">
                  <div>
                    <span className="text-[#64748B] block text-[10px]">Edge Latency</span>
                    <span className="font-mono font-semibold text-[#3157D5]">{reg.latency}</span>
                  </div>
                  <div>
                    <span className="text-[#64748B] block text-[10px]">Packet Loss</span>
                    <span className="font-mono font-semibold text-emerald-600">{reg.packetLoss}</span>
                  </div>
                  <div>
                    <span className="text-[#64748B] block text-[10px]">SIP Channels</span>
                    <span className="font-mono font-semibold text-[#0F172A]">{reg.channels}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 9. MODAL: Tenant 360° Deep-Dive Inspector */}
      {inspectTenant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#3157D5] text-white flex items-center justify-center font-bold text-sm shadow-md shadow-[#3157D5]/30">
                  {inspectTenant.orgName.substring(0, 1)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-[#0F172A]">{inspectTenant.orgName}</h3>
                    <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-[#EEF2FD] text-[#3157D5]">
                      {inspectTenant.planName} ({inspectTenant.billingCycle})
                    </span>
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-50 text-emerald-600">
                      {inspectTenant.status}
                    </span>
                  </div>
                  <p className="text-xs text-[#64748B] mt-0.5">
                    Lead Admin: <span className="font-semibold text-[#0F172A]">{inspectTenant.primaryAdminName}</span> ({inspectTenant.primaryAdminEmail}) • Joined {inspectTenant.joinedDate}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setInspectTenant(null)}
                className="p-1.5 text-[#64748B] hover:text-[#0F172A] rounded-xl hover:bg-[#F1F5F9] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Metrics Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3.5 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] space-y-1">
                <span className="text-[#64748B] text-[10px] uppercase font-semibold">Credits Balance</span>
                <p className="font-mono text-base font-bold text-emerald-600">${inspectTenant.creditsBalance.toFixed(2)}</p>
                <span className="text-[10px] text-[#64748B]">Auto-Recharge Active</span>
              </div>

              <div className="p-3.5 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] space-y-1">
                <span className="text-[#64748B] text-[10px] uppercase font-semibold">Billed Voice Mins</span>
                <p className="font-mono text-base font-bold text-[#0F172A]">{inspectTenant.totalMinutesUsedThisMonth.toLocaleString()} min</p>
                <span className="text-[10px] text-[#64748B]">${inspectTenant.creditRatePerMinute.toFixed(2)} / minute rate</span>
              </div>

              <div className="p-3.5 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] space-y-1">
                <span className="text-[#64748B] text-[10px] uppercase font-semibold">Live Concurrent SIP</span>
                <p className="font-mono text-base font-bold text-[#3157D5]">{inspectTenant.activeCallsNow} / {inspectTenant.maxConcurrency} channels</p>
                <span className="text-[10px] text-[#64748B] truncate max-w-[130px] block">{inspectTenant.assignedSipCarrier}</span>
              </div>

              <div className="p-3.5 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] space-y-1">
                <span className="text-[#64748B] text-[10px] uppercase font-semibold">Monthly Spend</span>
                <p className="font-mono text-base font-bold text-[#0F172A]">${inspectTenant.monthlySpend.toFixed(2)}</p>
                <span className="text-[10px] text-emerald-600 font-semibold">91.2% Platform Margin</span>
              </div>
            </div>

            {/* Deployed AI Agents Detailed Matrix */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider flex items-center gap-1.5">
                  <Bot className="w-4 h-4 text-[#3157D5]" />
                  <span>Deployed Voice AI Agents & Model Orchestration ({(tenantAgentProfiles[inspectTenant.id] || []).length})</span>
                </h4>
              </div>

              <div className="space-y-2.5">
                {(tenantAgentProfiles[inspectTenant.id] || [
                  { name: "Default Sales Agent", type: "Outbound", llm: "GPT-4o", tts: "ElevenLabs", stt: "Deepgram", calls: 8200, avgDuration: "2m 50s", sentiment: "+0.85", successRate: "94%" },
                ]).map((agent, i) => (
                  <div key={i} className="p-4 bg-white rounded-2xl border border-[#E2E8F0] shadow-xs space-y-2 text-xs">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-[#0F172A] text-sm">{agent.name}</p>
                          <span className="px-2 py-0.2 rounded-full text-[10px] font-semibold bg-[#EEF2FD] text-[#3157D5]">
                            {agent.type}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#64748B] mt-0.5">
                          Total Executed Calls: <span className="font-mono font-semibold text-[#0F172A]">{agent.calls.toLocaleString()} calls</span> • Avg Duration: <span className="font-mono font-semibold text-[#0F172A]">{agent.avgDuration}</span>
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                          {agent.successRate} Success Rate
                        </span>
                        <p className="text-[10px] text-[#64748B] mt-0.5">Sentiment: <span className="font-semibold text-[#3157D5]">{agent.sentiment}</span></p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#EDF2F7] text-[11px]">
                      <div className="flex items-center gap-1.5 text-[#0F172A]">
                        <Cpu className="w-3.5 h-3.5 text-[#3157D5] shrink-0" />
                        <span className="truncate">LLM: <strong className="font-semibold">{agent.llm}</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[#0F172A]">
                        <Headphones className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="truncate">TTS: <strong className="font-semibold">{agent.tts}</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[#0F172A]">
                        <Mic className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span className="truncate">STT: <strong className="font-semibold">{agent.stt}</strong></span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SIP Infrastructure & Carrier Telemetry */}
            <div className="p-4 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] space-y-2 text-xs">
              <h4 className="font-bold text-[#0F172A] text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Radio className="w-4 h-4 text-[#3157D5]" />
                <span>SIP Trunking & Gateway Infrastructure</span>
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1 text-[11px]">
                <div>
                  <span className="text-[#64748B] block text-[10px]">Carrier Backbone</span>
                  <span className="font-semibold text-[#0F172A]">{inspectTenant.assignedSipCarrier}</span>
                </div>
                <div>
                  <span className="text-[#64748B] block text-[10px]">Email Dispatch Gateway</span>
                  <span className="font-semibold text-[#0F172A]">{inspectTenant.assignedEmailGateway}</span>
                </div>
                <div>
                  <span className="text-[#64748B] block text-[10px]">SMS 10DLC Pool</span>
                  <span className="font-semibold text-[#0F172A]">{inspectTenant.assignedSmsGateway}</span>
                </div>
                <div>
                  <span className="text-[#64748B] block text-[10px]">Allowed LLMs</span>
                  <span className="font-mono font-semibold text-[#3157D5]">{inspectTenant.allowedLLMs.length} models entitled</span>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-[#E2E8F0]">
              <span className="text-xs text-[#64748B]">Tenant ID: <code className="font-mono text-[#0F172A]">{inspectTenant.id}</code></span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setInspectTenant(null)}
                  className="px-4 py-2 text-xs font-semibold text-[#64748B] hover:text-[#0F172A]"
                >
                  Close Dossier
                </button>
                <button
                  onClick={() => {
                    const tid = inspectTenant.id;
                    setInspectTenant(null);
                    router.push(`/super-admin/admins?selected=${tid}`);
                  }}
                  className="px-5 py-2 bg-[#3157D5] hover:bg-[#2646B8] text-white rounded-xl text-xs font-semibold shadow-md shadow-[#3157D5]/20 transition-all flex items-center gap-1.5"
                >
                  <span>Manage in Tenant Org Console</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SuperAdminAnalyticsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-[#64748B]">Loading Platform Analytics...</div>}>
      <SuperAdminAnalyticsContent />
    </Suspense>
  );
}
