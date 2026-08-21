"use client";

import React, { useState } from "react";
import { useSuperAdminStore } from "@/lib/super-admin-store";
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
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const financialLedgerData = [
  { month: "Jan", revenue: 98000, carrierCost: 4120, llmCost: 6800, netProfit: 87080 },
  { month: "Feb", revenue: 112000, carrierCost: 4890, llmCost: 7900, netProfit: 99210 },
  { month: "Mar", revenue: 124500, carrierCost: 5210, llmCost: 8400, netProfit: 110890 },
  { month: "Apr", revenue: 136000, carrierCost: 5800, llmCost: 9100, netProfit: 121100 },
  { month: "May", revenue: 142800, carrierCost: 6100, llmCost: 9800, netProfit: 126900 },
  { month: "Jun", revenue: 148200, carrierCost: 6420, llmCost: 10200, netProfit: 131580 },
];

export default function SuperAdminAnalyticsPage() {
  const { tenants, plans, addToast } = useSuperAdminStore();

  const totalMRR = tenants.reduce((acc, t) => acc + t.monthlySpend, 0);
  const estCarrierCost = totalMRR * 0.043;
  const estLlmCost = totalMRR * 0.068;
  const estNetProfit = totalMRR - estCarrierCost - estLlmCost;
  const marginPercent = ((estNetProfit / totalMRR) * 100).toFixed(1);

  const handleExportFinancials = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Month,Gross Billed Revenue,Carrier SIP Wholesale Cost,LLM & TTS API Cost,Net Operating Profit,Margin %\n" +
      financialLedgerData
        .map(
          (d) =>
            `"${d.month}","$${d.revenue}","$${d.carrierCost}","$${d.llmCost}","$${d.netProfit}","${((d.netProfit / d.revenue) * 100).toFixed(1)}%"`
        )
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "apex_super_admin_financial_ledger.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast({
      title: "Ledger Exported",
      description: "Downloaded apex_super_admin_financial_ledger.csv",
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
              <h1 className="text-2xl font-black text-[#0F172A] tracking-tight">Financial Ledger & Revenue</h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EEF2FD] text-[#3157D5]">
                {marginPercent}% Net Margin
              </span>
            </div>
            <p className="text-xs text-[#64748B] mt-0.5">
              Master platform profit & loss ledger: Subscription MRR, carrier SIP wholesale margins, and model API cost efficiency.
            </p>
          </div>
        </div>

        <button
          onClick={handleExportFinancials}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#3157D5] hover:bg-[#2646B8] text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-[#3157D5]/20 shrink-0"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Financial Ledger</span>
        </button>
      </div>

      {/* 2. P&L Financial Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-3xl border border-[#E2E8F0] shadow-xs space-y-1">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#64748B]">Gross Billed Revenue</span>
          <div className="text-2xl font-black text-[#0F172A] font-mono">
            ${totalMRR.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <span className="text-xs text-[#3157D5] font-bold flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            +14.8% MoM Growth
          </span>
        </div>

        <div className="p-5 bg-white rounded-3xl border border-[#E2E8F0] shadow-xs space-y-1">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#64748B]">Carrier Wholesale Cost</span>
          <div className="text-2xl font-black text-rose-600 font-mono">
            ${estCarrierCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <span className="text-xs text-[#64748B]">4.3% of Gross Revenue</span>
        </div>

        <div className="p-5 bg-white rounded-3xl border border-[#E2E8F0] shadow-xs space-y-1">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#64748B]">Model & TTS API Cost</span>
          <div className="text-2xl font-black text-amber-600 font-mono">
            ${estLlmCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <span className="text-xs text-[#64748B]">6.8% of Gross Revenue</span>
        </div>

        <div className="p-5 bg-white rounded-3xl border border-[#E2E8F0] shadow-xs space-y-1">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#64748B]">Net Operating Profit</span>
          <div className="text-2xl font-black text-emerald-600 font-mono">
            ${estNetProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <span className="text-xs font-bold text-emerald-600">
            {marginPercent}% Platform Profit Margin
          </span>
        </div>
      </div>

      {/* 3. Bar Chart: Revenue vs Cost Breakdown */}
      <div className="p-6 bg-white rounded-3xl border border-[#E2E8F0] shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#EDF2F7]">
          <div>
            <h2 className="text-base font-bold text-[#0F172A]">Platform P&L Waterfall</h2>
            <p className="text-xs text-[#64748B]">Comparing Gross Billed Revenue vs Carrier Trunking Costs vs Net Profit</p>
          </div>
        </div>

        <div className="h-72 w-full">
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
              <Bar dataKey="netProfit" fill="#10B981" name="Net Operating Profit" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
