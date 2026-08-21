"use client";

import React from "react";
import Link from "next/link";
import { useSuperAdminStore } from "@/lib/super-admin-store";
import {
  ShieldAlert,
  Building2,
  Users,
  CreditCard,
  PhoneCall,
  Activity,
  Cpu,
  Mail,
  ArrowRight,
  TrendingUp,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Zap,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

const platformRevenueTrend = [
  { month: "Jan", revenue: 98000, minutes: 1240000 },
  { month: "Feb", revenue: 112000, minutes: 1410000 },
  { month: "Mar", revenue: 124500, minutes: 1580000 },
  { month: "Apr", revenue: 136000, minutes: 1690000 },
  { month: "May", revenue: 142800, minutes: 1780000 },
  { month: "Jun", revenue: 148200, minutes: 1842900 },
];

export default function SuperAdminMissionControl() {
  const {
    tenants,
    superAdmins,
    plans,
    sipCarriers,
    gateways,
    engines,
    auditLogs,
    addToast,
  } = useSuperAdminStore();

  const totalMonthlySpend = tenants.reduce((acc, t) => acc + t.monthlySpend, 0);
  const totalActiveCalls = tenants.reduce((acc, t) => acc + t.activeCallsNow, 0);
  const totalMinutesThisMonth = tenants.reduce((acc, t) => acc + t.totalMinutesUsedThisMonth, 0);

  return (
    <div className="space-y-6">
      {/* 1. Master Super Admin Banner */}
      <div className="p-6 md:p-8 bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#3157D5] text-white rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-3 max-w-xl z-10">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 text-white px-2.5 py-0.5 rounded-full border border-white/30">
              MASTER MISSION CONTROL
            </span>
            <span className="text-xs font-semibold text-emerald-400">
              ● All Global POPs Operational
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Apex Voice Platform Fleet Overview
          </h1>
          <p className="text-xs md:text-sm text-white/80 leading-relaxed">
            Multi-tenant orchestration layer: {tenants.length} active tenant organizations, {sipCarriers.length} connected SIP carrier backbones, and {engines.length} unified AI models.
          </p>

          <div className="flex items-center gap-3 pt-2 flex-wrap">
            <Link
              href="/super-admin/admins"
              className="px-4 py-2 bg-white text-[#0F172A] hover:bg-white/95 rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
            >
              <Building2 className="w-3.5 h-3.5 text-[#3157D5]" />
              <span>Provision New Tenant</span>
            </Link>
            <Link
              href="/super-admin/plans"
              className="px-4 py-2 bg-[#3157D5] hover:bg-[#2646B8] text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Manage Pricing & Rates</span>
            </Link>
            <Link
              href="/super-admin/analytics"
              className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border border-white/30"
            >
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              <span>Platform Analytics Suite</span>
            </Link>
          </div>
        </div>

        <div className="hidden md:flex flex-col items-center justify-center w-32 h-32 rounded-2xl bg-white/10 border border-white/20 shrink-0 z-10">
          <ShieldAlert className="w-12 h-12 text-white mb-1" />
          <span className="text-[10px] font-bold tracking-wider text-white/90">SUPER ADMIN</span>
        </div>
      </div>

      {/* 2. Global Platform KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-3xl border border-[#E2E8F0] shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#64748B]">
              Platform Monthly Run-Rate
            </span>
            <div className="w-7 h-7 rounded-xl bg-[#EEF2FD] text-[#3157D5] flex items-center justify-center text-xs">
              <CreditCard className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#0F172A] tracking-tight">
            ${totalMonthlySpend.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <span className="text-xs text-[#3157D5] font-bold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            +14.8% vs last month
          </span>
        </div>

        <div className="p-5 bg-white rounded-3xl border border-[#E2E8F0] shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#64748B]">
              Tenant Organizations
            </span>
            <div className="w-7 h-7 rounded-xl bg-[#EEF2FD] text-[#3157D5] flex items-center justify-center text-xs">
              <Building2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#0F172A] tracking-tight">
            {tenants.length} Active Orgs
          </div>
          <span className="text-xs text-[#64748B] font-semibold">
            {tenants.filter((t) => t.status === "active").length} in Production • {tenants.filter((t) => t.status === "trial").length} in Trial
          </span>
        </div>

        <div className="p-5 bg-white rounded-3xl border border-[#E2E8F0] shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#64748B]">
              Live Concurrent SIP Channels
            </span>
            <div className="w-7 h-7 rounded-xl bg-[#EEF2FD] text-[#3157D5] flex items-center justify-center text-xs">
              <PhoneCall className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#0F172A] tracking-tight">
            {totalActiveCalls} / 1,000 Lines
          </div>
          <span className="text-xs text-[#3157D5] font-bold">
            Capacity: 34.2% Peak Load
          </span>
        </div>

        <div className="p-5 bg-white rounded-3xl border border-[#E2E8F0] shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#64748B]">
              Voice Minutes Billed
            </span>
            <div className="w-7 h-7 rounded-xl bg-[#EEF2FD] text-[#3157D5] flex items-center justify-center text-xs">
              <Activity className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#0F172A] tracking-tight">
            {totalMinutesThisMonth.toLocaleString()} Mins
          </div>
          <span className="text-xs text-[#3157D5] font-bold">
            Average: $0.086 / min billed
          </span>
        </div>
      </div>

      {/* 3. Charts Row: Revenue Velocity & Minutes Volume */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Velocity Area Chart (2 cols) */}
        <div className="lg:col-span-2 p-6 bg-white rounded-3xl border border-[#E2E8F0] shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#EDF2F7]">
            <div>
              <h2 className="text-base font-bold text-[#0F172A]">Platform Revenue Velocity (MRR)</h2>
              <p className="text-xs text-[#64748B]">Monthly aggregate billed across all subscription tiers and pay-as-you-go minutes</p>
            </div>
            <span className="text-xs font-mono font-bold text-[#3157D5] bg-[#EEF2FD] px-3 py-1 rounded-full">
              6-Month Trend
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={platformRevenueTrend} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="superRevenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3157D5" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3157D5" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EDF2F7" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748B" }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#64748B" }} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0F172A",
                    border: "none",
                    borderRadius: "12px",
                    color: "#FFFFFF",
                    fontSize: "12px",
                  }}
                  formatter={(val: any) => [`$${Number(val).toLocaleString()}`, "Platform Revenue"]}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3157D5"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#superRevenueGrad)"
                  name="Platform Revenue"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Global Carrier Backbone Distribution (1 col) */}
        <div className="p-6 bg-white rounded-3xl border border-[#E2E8F0] shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#EDF2F7]">
              <h2 className="text-base font-bold text-[#0F172A]">SIP Carrier Interconnects</h2>
              <Link href="/super-admin/telephony" className="text-xs font-bold text-[#3157D5] hover:underline">
                Manage &gt;
              </Link>
            </div>

            <div className="space-y-3 mt-3">
              {sipCarriers.map((carrier) => (
                <div
                  key={carrier.id}
                  className="p-3 bg-white hover:bg-[#EEF2FD] rounded-2xl border border-[#E2E8F0] transition-colors"
                >
                  <div className="flex items-center justify-between text-xs font-bold text-[#0F172A]">
                    <span>{carrier.name}</span>
                    <span className="font-mono text-[#3157D5]">{carrier.allocatedChannels} / {carrier.maxChannels} ch</span>
                  </div>
                  <div className="w-full bg-[#E2E8F0] h-1.5 rounded-full overflow-hidden mt-2">
                    <div
                      className="bg-[#3157D5] h-full rounded-full"
                      style={{ width: `${(carrier.allocatedChannels / carrier.maxChannels) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-[#64748B] mt-1.5">
                    <span>Rate: ${carrier.ratePerMinuteWholesale}/min wholesale</span>
                    <span className="font-semibold text-emerald-600">● {carrier.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-[#EDF2F7] flex items-center justify-between text-xs text-[#64748B]">
            <span>Global POPs Active</span>
            <span className="font-bold text-[#0F172A]">US-East, US-West, EU, AP</span>
          </div>
        </div>
      </div>

      {/* 4. Tenant Organizations Leaderboard & Live Audit Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tenant Orgs (2 cols) */}
        <div className="lg:col-span-2 p-6 bg-white rounded-3xl border border-[#E2E8F0] shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#EDF2F7]">
            <div>
              <h2 className="text-base font-bold text-[#0F172A]">Tenant Organizations Overview</h2>
              <p className="text-xs text-[#64748B]">Ranked by total monthly consumption, credits, and active SIP lines</p>
            </div>
            <Link
              href="/super-admin/admins"
              className="text-xs font-bold text-[#3157D5] hover:underline flex items-center gap-1"
            >
              <span>View All Tenants ({tenants.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8FAFC] text-[#64748B] uppercase tracking-wider font-semibold border-b border-[#E2E8F0]">
                <tr>
                  <th className="p-3">Organization</th>
                  <th className="p-3">Plan Tier</th>
                  <th className="p-3">Credits Balance</th>
                  <th className="p-3">Minutes (Mo)</th>
                  <th className="p-3">Monthly Spend</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {tenants.map((t) => (
                  <tr key={t.id} className="hover:bg-[#EEF2FD]/40 transition-colors">
                    <td className="p-3 font-bold text-[#0F172A]">
                      <div>
                        <p>{t.orgName}</p>
                        <p className="text-[10px] text-[#64748B] font-normal">{t.primaryAdminEmail}</p>
                      </div>
                    </td>
                    <td className="p-3 font-semibold text-[#3157D5]">{t.planName}</td>
                    <td className="p-3 font-mono font-bold text-[#0F172A]">${t.creditsBalance.toFixed(2)}</td>
                    <td className="p-3 font-mono text-[#64748B]">{t.totalMinutesUsedThisMonth.toLocaleString()}</td>
                    <td className="p-3 font-bold text-[#0F172A] font-mono">${t.monthlySpend.toFixed(2)}</td>
                    <td className="p-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        t.status === "active"
                          ? "bg-[#EEF2FD] text-[#3157D5]"
                          : "bg-[#F1F5F9] text-[#64748B]"
                      }`}>
                        {t.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Live Super Admin Activity Stream (1 col) */}
        <div className="p-6 bg-white rounded-3xl border border-[#E2E8F0] shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#EDF2F7]">
            <h2 className="text-base font-bold text-[#0F172A]">Super Admin Audit Log</h2>
            <Link href="/super-admin/audit-logs" className="text-xs font-bold text-[#3157D5] hover:underline">
              Full Logs &gt;
            </Link>
          </div>

          <div className="space-y-3">
            {auditLogs.slice(0, 5).map((log) => (
              <div key={log.id} className="p-3 bg-white rounded-2xl border border-[#E2E8F0] space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#0F172A]">{log.actorName}</span>
                  <span className="text-[10px] text-[#64748B] font-mono">{log.timestamp.substring(11, 16)}</span>
                </div>
                <p className="text-[11px] text-[#64748B] leading-snug">{log.action}</p>
                <span className="text-[10px] font-semibold text-[#3157D5]">{log.actorRole}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
