"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { StatCard } from "@/components/stat-card";
import { StatusPill } from "@/components/status-pill";
import { initialKPIs, callVolumeByHour, initialTimelineEvents } from "@/lib/mock-data/analytics";
import { formatDuration } from "@/lib/utils";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import {
  Sparkles,
  Bot,
  Workflow,
  Megaphone,
  PhoneCall,
  ArrowRight,
  TrendingUp,
  Activity,
  CheckCircle2,
  Calendar as CalendarIcon,
  Users,
  BookOpen,
  Zap,
  Radio,
  Plus,
  Play,
  Pause,
  ExternalLink,
  ShieldCheck,
  Clock,
  Headphones,
  MessageSquarePlus,
  Mic,
  Award,
  Layers,
  Voicemail,
  Scale,
  Send,
  Share2,
  Copy,
  Maximize2,
  Sun,
  CheckSquare,
  Trash2,
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const {
    activeWorkspace,
    agents,
    campaigns,
    calls,
    contacts,
    appointments,
    toggleAgentStatus,
    toggleCampaignStatus,
    activeCallCount,
    addToast,
  } = useAppStore();

  const [activeSegment, setActiveSegment] = useState<"overview" | "supervisor" | "funnels" | "ab_lab" | "smart_amd">("overview");
  const [taskInput, setTaskInput] = useState("");
  const [tasks, setTasks] = useState([
    { id: "t-1", text: "Live Supervisor review: Jonathan Vance call", time: "9:30 AM", done: true },
    { id: "t-2", text: "Appointment with Anna (Healthcare Triage)", time: "11:00 AM", done: false },
    { id: "t-3", text: "Review A/B test confidence for Rachel vs Marcus", time: "2:00 PM", done: false },
    { id: "t-4", text: "Inspect AMD 2.0 1000Hz tone detection logs", time: "4:30 PM", done: false },
  ]);

  const liveCalls = calls.filter((c) => c.status === "live" || c.status === "ringing" || c.status === "on_hold");

  const quickAccessItems = [
    { label: "Live Calls", icon: PhoneCall, href: "/live-calls" },
    { label: "Supervisor", icon: Headphones, href: "/supervisor" },
    { label: "Voice Agents", icon: Bot, href: "/agents" },
    { label: "Flow Builder", icon: Workflow, href: "/flow-builder" },
    { label: "Campaigns", icon: Megaphone, href: "/campaigns" },
    { label: "Funnels", icon: Layers, href: "/funnels" },
    { label: "A/B Lab", icon: Scale, href: "/ab-testing" },
    { label: "Smart AMD", icon: Voicemail, href: "/smart-amd" },
  ];

  const daysOfWeek = [
    { day: "TUE", date: "16" },
    { day: "WED", date: "17", active: true },
    { day: "THU", date: "18" },
    { day: "FRI", date: "19" },
    { day: "SAT", date: "20" },
    { day: "SUN", date: "21" },
    { day: "MON", date: "22" },
  ];

  const handleAddTask = () => {
    if (!taskInput.trim()) return;
    setTasks((prev) => [
      ...prev,
      { id: `task-${Date.now()}`, text: taskInput.trim(), time: "Today", done: false },
    ]);
    setTaskInput("");
    addToast({ title: "Task Scheduled", description: "Added to today's operations schedule.", type: "success" });
  };

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  return (
    <div className="space-y-6">
      {/* 1. Page Header (Matches Reference: "My Dashboard - Welcome back Alex DeVries") */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-[#0F172A] tracking-tight">My Dashboard</h1>
          <p className="text-xs text-[#64748B] mt-0.5">Welcome back Alex DeVries • Enterprise Operations Active</p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#E2E8F0] rounded-xl text-xs font-mono font-semibold text-[#0F172A] shadow-2xs">
            <CalendarIcon className="w-3.5 h-3.5 text-[#3157D5]" />
            <span>06/17/2026 - 06/17/2026</span>
          </div>
          <button
            onClick={() => {
              addToast({ title: "Report Shared", description: "Copied dashboard link to clipboard.", type: "info" });
            }}
            className="p-2 bg-white border border-[#E2E8F0] hover:bg-[#F8FAFC] rounded-xl text-[#64748B] hover:text-[#0F172A] transition-colors"
            title="Share Dashboard"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              addToast({ title: "Refreshed Data", description: "Real-time metrics synced.", type: "success" });
            }}
            className="p-2 bg-white border border-[#E2E8F0] hover:bg-[#F8FAFC] rounded-xl text-[#64748B] hover:text-[#0F172A] transition-colors"
            title="Sync Metrics"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. Top Row: Left Hero Banner & Quick Access, Right "Today" Date & Schedule Tracker */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left 2 Cols: QUICK ACCESS Grid & Large Royal Blue Hero Banner */}
        <div className="lg:col-span-2 space-y-5">
          {/* Quick Access Clean Symmetrical Grid */}
          <div className="space-y-3.5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#64748B] bg-[#F1F5F9] border border-[#E2E8F0] px-2.5 py-1 rounded-md">
                QUICK ACCESS
              </span>
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-8 gap-2.5 pt-1">
              {quickAccessItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="flex flex-col items-center justify-center p-2.5 bg-white hover:bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#3157D5]/40 rounded-2xl h-20 text-center transition-all card-hover group shadow-2xs"
                  >
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center mb-1 text-[#3157D5] bg-[#EEF2FD] group-hover:scale-110 transition-transform">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] font-semibold text-[#0F172A] truncate w-full leading-tight">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Large Royal Electric Blue Hero Banner (Clean, Professional Enterprise Design) */}
          <div className="p-6 md:p-8 bg-gradient-to-r from-[#3157D5] via-[#3B66EE] to-[#4F46E5] text-white rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
            {/* Background subtle accent */}
            <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/5 rounded-full blur-2xl pointer-events-none" />

            <div className="space-y-3 max-w-lg z-10">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest bg-white/20 text-white px-2.5 py-0.5 rounded-full border border-white/30">
                  ENTERPRISE FLEET
                </span>
                <span className="text-xs font-semibold text-white/90">
                  ● {activeCallCount} Live Channels Active
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight leading-tight">
                Voice Communications Fleet Active
              </h2>
              <p className="text-xs md:text-sm text-white/90 leading-relaxed">
                500 concurrent SIP channels with 99.8% uptime. Real-time call supervision, routing, and automated tone detection active.
              </p>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <Link
                  href="/supervisor"
                  className="px-5 py-2.5 bg-white text-[#3157D5] hover:bg-white/95 rounded-xl text-xs font-bold shadow-md transition-all"
                >
                  Open Supervisor Deck
                </Link>
                <Link
                  href="/campaigns/new"
                  className="px-5 py-2.5 bg-[#000000] hover:bg-neutral-900 text-white rounded-xl text-xs font-bold transition-all"
                >
                  Launch Outbound
                </Link>
              </div>
            </div>

            {/* Clean Professional Badge */}
            <div className="hidden md:flex flex-col items-center justify-center w-28 h-28 rounded-2xl bg-white/10 border border-white/20 shrink-0 z-10">
              <Headphones className="w-10 h-10 text-white" />
              <span className="text-[10px] font-bold tracking-wider mt-2 text-white/90">OPERATIONS</span>
            </div>
          </div>
        </div>

        {/* Right 1 Col: "Today" Status & Operations Schedule (Exact match to reference style) */}
        <div className="bg-white p-5 rounded-3xl border border-[#E2E8F0] card-shadow space-y-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
              OPERATIONS SCHEDULE
            </span>
            <span className="text-xs font-bold text-[#3157D5] bg-[#EEF2FD] px-2 py-0.5 rounded-full">
              {tasks.length} Items
            </span>
          </div>

          {/* Today Weather & Date Header */}
          <div className="flex items-baseline justify-between pt-1">
            <div>
              <h3 className="text-2xl font-black text-[#0F172A]">Today</h3>
              <p className="text-xs text-[#64748B] mt-0.5">Wed Jun 17 2026 • San Francisco</p>
            </div>
            <div className="flex items-center gap-1.5 text-xl font-bold text-[#0F172A]">
              <Sun className="w-5 h-5 text-[#D99025]" />
              <span>31°C</span>
            </div>
          </div>

          {/* 7-Day Date Picker Strip */}
          <div className="flex items-center justify-between gap-1 py-2 border-y border-[#EDF2F7]">
            {daysOfWeek.map((d) => (
              <div
                key={d.day}
                className={`flex flex-col items-center justify-center w-8 h-12 rounded-xl text-center transition-all ${
                  d.active
                    ? "bg-[#3157D5] text-white font-bold shadow-md"
                    : "text-[#64748B] hover:bg-[#EEF2FD] bg-white border border-[#E2E8F0]"
                }`}
              >
                <span className="text-[9px] uppercase">{d.day}</span>
                <span className="text-xs font-bold mt-0.5">{d.date}</span>
              </div>
            ))}
          </div>

          {/* Quick Task / Appointment Input */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Add operations task..."
              value={taskInput}
              onChange={(e) => setTaskInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
              className="flex-1 text-xs px-3 py-2 bg-white border border-[#E2E8F0] rounded-xl outline-none focus:border-[#3157D5] text-[#0F172A]"
            />
            <button
              onClick={handleAddTask}
              className="px-3 py-2 bg-[#3157D5] hover:bg-[#2646B8] text-white text-xs font-bold rounded-xl shrink-0"
            >
              Add
            </button>
          </div>

          {/* Schedule Checklist */}
          <div className="space-y-2 max-h-52 overflow-y-auto pr-1 text-xs">
            {tasks.map((task) => (
              <div
                key={task.id}
                onClick={() => toggleTask(task.id)}
                className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-[#E2E8F0] hover:bg-[#EEF2FD] transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${
                      task.done ? "bg-[#3157D5] border-[#3157D5] text-white" : "border-[#CBD5E1] bg-white"
                    }`}
                  >
                    {task.done && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>
                  <span className={`truncate font-medium ${task.done ? "line-through text-[#94A3B8]" : "text-[#0F172A]"}`}>
                    {task.text}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-[#64748B] shrink-0 ml-2">{task.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Segmented Filter Pills (Exact Match to Reference: Analytics, Supervisor, Funnels, A/B Lab, Smart AMD) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: "overview", label: "Overview Metrics", href: "/dashboard" },
          { id: "supervisor", label: "Supervisor Cockpit", href: "/supervisor" },
          { id: "funnels", label: "Conversation Funnels", href: "/funnels" },
          { id: "ab_lab", label: "A/B Testing Lab", href: "/ab-testing" },
          { id: "smart_amd", label: "Smart AMD 2.0", href: "/smart-amd" },
          { id: "analytics", label: "Analytics Suite", href: "/analytics" },
        ].map((seg) => {
          const isSelected = activeSegment === seg.id;
          return (
            <Link
              key={seg.id}
              href={seg.href}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
                isSelected
                  ? "bg-[#3157D5] text-white shadow-md"
                  : "bg-white text-[#64748B] hover:text-[#0F172A] border border-[#E2E8F0]"
              }`}
            >
              {seg.label}
            </Link>
          );
        })}
      </div>

      {/* 4. Main 9 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {initialKPIs.map((kpi, idx) => (
          <StatCard
            key={idx}
            title={kpi.title}
            value={kpi.value}
            change={kpi.change}
            isPositive={kpi.isPositive}
            period={kpi.period}
            iconName={kpi.icon}
            sparkline={kpi.sparkline}
          />
        ))}
      </div>

      {/* 5. Call Volume Trends & Live Channels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Call Volume Area Chart (2 cols) */}
        <div className="lg:col-span-2 bg-white p-5 rounded-3xl border border-[#E2E8F0] card-shadow flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-[#EDF2F7] mb-3">
            <div>
              <h2 className="text-sm font-bold text-[#0F172A]">Call Traffic & Qualified Velocity</h2>
              <p className="text-xs text-[#64748B]">Inbound vs outbound volume across peak operational hours</p>
            </div>
            <Link href="/analytics" className="text-xs font-bold text-[#3157D5] hover:underline flex items-center gap-1">
              <span>Full Analytics</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={callVolumeByHour} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="inboundGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3157D5" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3157D5" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="outboundGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#5C82FF" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#5C82FF" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EDF2F7" />
                <XAxis dataKey="hour" tick={{ fontSize: 11, fill: "#64748B" }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#64748B" }} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#090D16",
                    border: "none",
                    borderRadius: "12px",
                    color: "#FFFFFF",
                    fontSize: "12px",
                  }}
                  itemStyle={{ color: "#FFFFFF" }}
                />
                <Area type="monotone" dataKey="inbound" stroke="#3157D5" strokeWidth={2.5} fillOpacity={1} fill="url(#inboundGrad)" name="Inbound" />
                <Area type="monotone" dataKey="outbound" stroke="#5C82FF" strokeWidth={2.5} fillOpacity={1} fill="url(#outboundGrad)" name="Outbound" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Active Live Channels (1 col) */}
        <div className="bg-white p-5 rounded-3xl border border-[#E2E8F0] card-shadow flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-[#EDF2F7]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#3157D5] animate-ping" />
              <h2 className="text-sm font-bold text-[#0F172A]">Live Active Channels</h2>
            </div>
            <span className="text-xs font-bold text-[#3157D5] bg-[#EEF2FD] px-2.5 py-0.5 rounded-full">
              {liveCalls.length} Live
            </span>
          </div>

          <div className="space-y-3 my-3">
            {liveCalls.map((call) => (
              <Link
                key={call.id}
                href={`/live-calls/${call.id}`}
                className="block p-3.5 bg-white hover:bg-[#EEF2FD] rounded-2xl border border-[#E2E8F0] hover:border-[#3157D5]/40 transition-all group shadow-2xs"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-[#0F172A] group-hover:text-[#3157D5]">{call.callerName}</span>
                  <span className="text-xs font-mono font-bold text-[#3157D5]">{formatDuration(call.durationSeconds)}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-[#64748B]">
                  <span>Agent: {call.agentName}</span>
                  <span className="font-semibold text-[#3157D5]">Score {call.qualificationScore}</span>
                </div>
              </Link>
            ))}
          </div>

          <div className="pt-3 border-t border-[#EDF2F7] flex items-center justify-between text-xs">
            <span className="text-[#64748B]">Sub-300ms SIP Bridge</span>
            <Link href="/supervisor" className="text-[#3157D5] font-bold hover:underline">
              Supervisor Cockpit &gt;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
