"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useSuperAdminStore } from "@/lib/super-admin-store";
import { useAppStore } from "@/lib/store";
import {
  Building2,
  Plus,
  Search,
  ExternalLink,
  Coins,
  PhoneCall,
  Activity,
  MoreVertical,
  KeyRound,
  ShieldAlert,
  Cpu,
  CheckCircle2,
  XCircle,
  X,
  CreditCard,
  Edit,
  Sliders,
  LogOut,
  Zap,
  Power,
} from "lucide-react";

function SuperAdminTenantsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedParam = searchParams.get("selected");
  const queryParam = searchParams.get("q") || "";

  const {
    tenants,
    plans,
    sipCarriers,
    gateways,
    addTenant,
    updateTenantPlan,
    adjustTenantCredits,
    updateTenantStatus,
    updateTenantQuotas,
    addToast: addSuperToast,
  } = useSuperAdminStore();

  const { setActiveWorkspace, addToast: addAdminToast } = useAppStore();

  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [creditModalTenant, setCreditModalTenant] = useState<string | null>(null);
  const [creditAmount, setCreditAmount] = useState(500);
  const [creditReason, setCreditReason] = useState("Promotional platform grant");

  const [quotaModalTenant, setQuotaModalTenant] = useState<string | null>(null);
  const [editConcurrency, setEditConcurrency] = useState(100);
  const [editCarrier, setEditCarrier] = useState("Telnyx Elastic Tier-1");
  const [editRate, setEditRate] = useState(0.08);

  // Create Form State
  const [orgName, setOrgName] = useState("");
  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [selectedPlanId, setSelectedPlanId] = useState("plan-growth");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "6_months" | "yearly" | "pay_as_you_go">("monthly");
  const [initialCredits, setInitialCredits] = useState(250);
  const [maxConcurrency, setMaxConcurrency] = useState(40);
  const [assignedCarrier, setAssignedCarrier] = useState("Telnyx Elastic Tier-1");

  const handleCreateTenant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgName.trim() || !adminEmail.trim()) return;

    const planObj = plans.find((p) => p.id === selectedPlanId) || plans[0];

    addTenant({
      orgName: orgName.trim(),
      primaryAdminName: adminName.trim() || "Lead Admin",
      primaryAdminEmail: adminEmail.trim(),
      planId: planObj.id,
      planName: planObj.name,
      billingCycle,
      creditsBalance: initialCredits,
      creditRatePerMinute: planObj.payAsYouGoRatePerMinute,
      maxConcurrency,
      assignedSipCarrier: assignedCarrier,
      assignedEmailGateway: "Amazon SES Primary",
      assignedSmsGateway: "Twilio 10DLC Pool",
      allowedLLMs: ["gpt-4o", "claude-3-5-sonnet", "deepseek-v3"],
      allowedTTS: ["elevenlabs-turbo-v2", "cartesia-sonic"],
      allowedSTT: ["deepgram-nova-3"],
      status: "active",
    });

    setOrgName("");
    setAdminName("");
    setAdminEmail("");
    setCreateModalOpen(false);
  };

  const handleImpersonateTenant = (tenant: any) => {
    setActiveWorkspace({
      id: tenant.id,
      name: tenant.orgName,
      plan: tenant.planName.includes("Enterprise") ? "Enterprise" : tenant.planName.includes("Scale") ? "Scale" : "Growth",
      credits: tenant.creditsBalance,
      activeCalls: tenant.activeCallsNow || 0,
    });

    addAdminToast({
      title: "Super Admin Impersonation Active",
      description: `Viewing workspace as '${tenant.orgName}'.`,
      type: "info",
    });

    router.push("/dashboard");
  };

  const handleApplyCredits = () => {
    if (!creditModalTenant) return;
    adjustTenantCredits(creditModalTenant, creditAmount, creditReason);
    setCreditModalTenant(null);
  };

  const handleSaveQuotas = () => {
    if (!quotaModalTenant) return;
    updateTenantQuotas(quotaModalTenant, editConcurrency, editCarrier, editRate);
    setQuotaModalTenant(null);
  };

  const filteredTenants = tenants.filter((t) => {
    const matchesSearch =
      t.orgName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.primaryAdminEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.planName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white rounded-3xl border border-[#E2E8F0] shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#3157D5] text-white flex items-center justify-center shadow-lg shadow-[#3157D5]/30 shrink-0">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-[#0F172A] tracking-tight">Tenant Organizations & Admins</h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EEF2FD] text-[#3157D5]">
                {tenants.length} Tenant Orgs
              </span>
            </div>
            <p className="text-xs text-[#64748B] mt-0.5">
              Provision client admin organizations, assign SIP carrier networks, manage credit balances, and simulate 1-click tenant access.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative w-48 sm:w-60">
            <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search tenant orgs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white border border-[#E2E8F0] rounded-xl text-xs text-[#0F172A] outline-none focus:border-[#3157D5]"
            />
          </div>

          <button
            onClick={() => setCreateModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#3157D5] hover:bg-[#2646B8] text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-[#3157D5]/20 shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Provision Tenant</span>
          </button>
        </div>
      </div>

      {/* 2. Filter Pills */}
      <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-[#E2E8F0] shadow-xs w-fit">
        {["all", "active", "trial", "suspended"].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors capitalize ${
              statusFilter === st
                ? "bg-[#3157D5] text-white shadow-2xs"
                : "text-[#64748B] hover:text-[#0F172A]"
            }`}
          >
            {st} ({st === "all" ? tenants.length : tenants.filter((t) => t.status === st).length})
          </button>
        ))}
      </div>

      {/* 3. Tenant Organizations Cards / Table */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTenants.map((tenant) => {
          const isHighlighted = selectedParam === tenant.id;

          return (
            <div
              key={tenant.id}
              className={`p-6 bg-white rounded-3xl border transition-all shadow-xs flex flex-col justify-between space-y-4 ${
                isHighlighted ? "border-[#3157D5] ring-2 ring-[#3157D5]/30 shadow-md" : "border-[#E2E8F0] hover:border-[#3157D5]/40"
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#0F172A] text-white flex items-center justify-center font-black text-sm shadow-xs">
                      {tenant.orgName.substring(0, 1)}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-[#0F172A] leading-tight">{tenant.orgName}</h3>
                      <p className="text-[11px] text-[#64748B]">{tenant.primaryAdminEmail}</p>
                    </div>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    tenant.status === "active" ? "bg-[#EEF2FD] text-[#3157D5]" : "bg-rose-50 text-rose-600 border border-rose-200"
                  }`}>
                    {tenant.status}
                  </span>
                </div>

                {/* Metrics Breakdown */}
                <div className="p-3.5 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[#64748B]">Assigned Plan:</span>
                    <span className="font-bold text-[#3157D5]">{tenant.planName} ({tenant.billingCycle})</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#64748B]">Credits Balance:</span>
                    <span className="font-bold text-[#0F172A] font-mono">${tenant.creditsBalance.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#64748B]">Rate / Minute:</span>
                    <span className="font-mono text-[#0F172A]">${tenant.creditRatePerMinute.toFixed(2)} / min</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#64748B]">Max Concurrency:</span>
                    <span className="font-bold text-[#0F172A]">{tenant.maxConcurrency} SIP channels</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#64748B]">Carrier Backbone:</span>
                    <span className="text-[11px] font-semibold text-[#0F172A] truncate max-w-[140px]">{tenant.assignedSipCarrier}</span>
                  </div>
                </div>

                {/* Model Engine Entitlements */}
                <div className="space-y-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#64748B]">
                    Allowed AI Models ({tenant.allowedLLMs.length + tenant.allowedTTS.length}):
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {tenant.allowedLLMs.slice(0, 3).map((m) => (
                      <span key={m} className="text-[9px] font-mono px-2 py-0.5 bg-[#EEF2FD] text-[#3157D5] rounded-md">
                        {m}
                      </span>
                    ))}
                    {tenant.allowedLLMs.length > 3 && (
                      <span className="text-[9px] font-mono px-1.5 py-0.5 bg-[#F1F5F9] text-[#64748B] rounded-md">
                        +{tenant.allowedLLMs.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-[#EDF2F7] space-y-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setCreditModalTenant(tenant.id);
                      setCreditAmount(500);
                    }}
                    className="flex-1 py-2 bg-white hover:bg-[#EEF2FD] border border-[#E2E8F0] hover:border-[#3157D5] text-[#0F172A] hover:text-[#3157D5] rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 shadow-2xs"
                  >
                    <Coins className="w-3.5 h-3.5" />
                    <span>Adjust Credits</span>
                  </button>

                  <button
                    onClick={() => {
                      setQuotaModalTenant(tenant.id);
                      setEditConcurrency(tenant.maxConcurrency);
                      setEditCarrier(tenant.assignedSipCarrier);
                      setEditRate(tenant.creditRatePerMinute);
                    }}
                    className="p-2 bg-white hover:bg-[#F1F5F9] border border-[#E2E8F0] rounded-xl text-[#64748B] hover:text-[#0F172A] transition-colors"
                    title="Edit Resource Quotas"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => updateTenantStatus(tenant.id, tenant.status === "active" ? "suspended" : "active")}
                    className={`px-3 py-2 border rounded-xl text-xs font-bold transition-all flex items-center gap-1 shrink-0 ${
                      tenant.status === "active"
                        ? "bg-rose-50 hover:bg-rose-100 border-rose-200 text-rose-600"
                        : "bg-emerald-50 hover:bg-emerald-100 border-emerald-200 text-emerald-700"
                    }`}
                    title={tenant.status === "active" ? "Deactivate / Suspend Tenant Access" : "Activate Tenant Access"}
                  >
                    <Power className="w-3.5 h-3.5" />
                    <span>{tenant.status === "active" ? "Deactivate" : "Activate"}</span>
                  </button>
                </div>

                <button
                  onClick={() => handleImpersonateTenant(tenant)}
                  className="w-full py-2 bg-[#3157D5] hover:bg-[#2646B8] text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-md shadow-[#3157D5]/20"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Log in as Tenant (1-Click Preview)</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. Provision New Tenant Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-2xl max-w-lg w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#EEF2FD] text-[#3157D5] flex items-center justify-center">
                  <Building2 className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-[#0F172A]">Provision New Tenant Organization</h3>
              </div>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="p-1.5 text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTenant} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-[#0F172A] block mb-1">Organization Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Zenith Capital Group"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#E2E8F0] rounded-xl outline-none focus:border-[#3157D5] text-[#0F172A]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#0F172A] block mb-1">Primary Admin Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Rachel Miller"
                    value={adminName}
                    onChange={(e) => setAdminName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#E2E8F0] rounded-xl outline-none focus:border-[#3157D5] text-[#0F172A]"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#0F172A] block mb-1">Primary Admin Email</label>
                  <input
                    type="email"
                    required
                    placeholder="admin@zenith.com"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#E2E8F0] rounded-xl outline-none focus:border-[#3157D5] text-[#0F172A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#0F172A] block mb-1">Subscription Plan</label>
                  <select
                    value={selectedPlanId}
                    onChange={(e) => setSelectedPlanId(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#E2E8F0] rounded-xl outline-none focus:border-[#3157D5] text-[#0F172A]"
                  >
                    {plans.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} (${p.monthlyPrice}/mo)
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-[#0F172A] block mb-1">Billing Interval</label>
                  <select
                    value={billingCycle}
                    onChange={(e: any) => setBillingCycle(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#E2E8F0] rounded-xl outline-none focus:border-[#3157D5] text-[#0F172A]"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="6_months">6 Months (15% off)</option>
                    <option value="yearly">Yearly (25% off)</option>
                    <option value="pay_as_you_go">Pay-As-You-Go</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#0F172A] block mb-1">Initial Voice Credits ($)</label>
                  <input
                    type="number"
                    value={initialCredits}
                    onChange={(e) => setInitialCredits(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#E2E8F0] rounded-xl outline-none focus:border-[#3157D5] text-[#0F172A] font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#0F172A] block mb-1">Max Concurrent SIP Lines</label>
                  <input
                    type="number"
                    value={maxConcurrency}
                    onChange={(e) => setMaxConcurrency(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#E2E8F0] rounded-xl outline-none focus:border-[#3157D5] text-[#0F172A] font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-[#0F172A] block mb-1">Assigned SIP Carrier Trunk</label>
                <select
                  value={assignedCarrier}
                  onChange={(e) => setAssignedCarrier(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#E2E8F0] rounded-xl outline-none focus:border-[#3157D5] text-[#0F172A]"
                >
                  {sipCarriers.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name} ({c.transport})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E2E8F0]">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-[#64748B] hover:text-[#0F172A]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#3157D5] hover:bg-[#2646B8] text-white rounded-xl text-xs font-bold shadow-md shadow-[#3157D5]/20 transition-colors"
                >
                  Provision & Grant Access
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Adjust Credits Modal */}
      {creditModalTenant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-2xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#EEF2FD] text-[#3157D5] flex items-center justify-center">
                  <Coins className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-[#0F172A]">Adjust Tenant Credits</h3>
              </div>
              <button onClick={() => setCreditModalTenant(null)} className="p-1 text-[#64748B] hover:text-[#0F172A]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-[#0F172A] block mb-1">Credit Adjustment ($)</label>
                <input
                  type="number"
                  value={creditAmount}
                  onChange={(e) => setCreditAmount(Number(e.target.value))}
                  placeholder="e.g. 500 or -100"
                  className="w-full px-3.5 py-2.5 bg-white border border-[#E2E8F0] rounded-xl outline-none focus:border-[#3157D5] text-[#0F172A] font-mono text-sm"
                />
              </div>

              <div>
                <label className="font-bold text-[#0F172A] block mb-1">Adjustment Reason</label>
                <input
                  type="text"
                  value={creditReason}
                  onChange={(e) => setCreditReason(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#E2E8F0] rounded-xl outline-none focus:border-[#3157D5] text-[#0F172A]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#E2E8F0]">
              <button
                onClick={() => setCreditModalTenant(null)}
                className="px-4 py-2 text-xs font-bold text-[#64748B] hover:text-[#0F172A]"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyCredits}
                className="px-5 py-2 bg-[#3157D5] hover:bg-[#2646B8] text-white rounded-xl text-xs font-bold transition-colors"
              >
                Apply Credits
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. Edit Quotas Modal */}
      {quotaModalTenant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-2xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#EEF2FD] text-[#3157D5] flex items-center justify-center">
                  <Sliders className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-[#0F172A]">Edit Resource Quotas</h3>
              </div>
              <button onClick={() => setQuotaModalTenant(null)} className="p-1 text-[#64748B] hover:text-[#0F172A]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-[#0F172A] block mb-1">Max Concurrent SIP Lines</label>
                <input
                  type="number"
                  value={editConcurrency}
                  onChange={(e) => setEditConcurrency(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#E2E8F0] rounded-xl outline-none focus:border-[#3157D5] text-[#0F172A] font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-[#0F172A] block mb-1">Assigned Carrier Network</label>
                <select
                  value={editCarrier}
                  onChange={(e) => setEditCarrier(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#E2E8F0] rounded-xl outline-none focus:border-[#3157D5] text-[#0F172A]"
                >
                  {sipCarriers.map((c) => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-[#0F172A] block mb-1">Minute Rate ($/min)</label>
                <input
                  type="number"
                  step="0.01"
                  value={editRate}
                  onChange={(e) => setEditRate(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#E2E8F0] rounded-xl outline-none focus:border-[#3157D5] text-[#0F172A] font-mono"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#E2E8F0]">
              <button
                onClick={() => setQuotaModalTenant(null)}
                className="px-4 py-2 text-xs font-bold text-[#64748B] hover:text-[#0F172A]"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveQuotas}
                className="px-5 py-2 bg-[#3157D5] hover:bg-[#2646B8] text-white rounded-xl text-xs font-bold transition-colors"
              >
                Save Quotas
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SuperAdminTenantsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-[#64748B]">Loading Tenant Directory...</div>}>
      <SuperAdminTenantsContent />
    </Suspense>
  );
}
