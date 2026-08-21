"use client";

import React, { useState } from "react";
import { useSuperAdminStore } from "@/lib/super-admin-store";
import {
  Users,
  UserPlus,
  ShieldCheck,
  ShieldAlert,
  KeyRound,
  CheckCircle2,
  XCircle,
  MoreVertical,
  Lock,
  Mail,
  X,
  Plus,
  Search,
} from "lucide-react";

export default function SuperAdminTeamPage() {
  const {
    superAdmins,
    addSuperAdmin,
    updateSuperAdminStatus,
    deleteSuperAdmin,
    currentSuperAdmin,
    addToast,
  } = useSuperAdminStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  // Form state for creating new Super Admin
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"Master Super Admin" | "Billing Admin" | "Infrastructure Lead" | "Support Engineer">("Billing Admin");
  const [twoFactorRequired, setTwoFactorRequired] = useState(true);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([
    "billing_override",
    "plan_management",
    "credit_allocation",
  ]);

  const allAvailablePermissions = [
    { id: "all_access", label: "Full Master Access", desc: "Unrestricted control over all platform modules" },
    { id: "billing_override", label: "Billing & Plans", desc: "Manage subscription plans, discounts & credit rates" },
    { id: "infrastructure_control", label: "Telephony & Carriers", desc: "Configure SIP trunks, SBC routing & codecs" },
    { id: "model_engines", label: "Voice AI Models", desc: "Enable/disable LLMs, TTS voices & STT engines" },
    { id: "tenant_impersonation", label: "Tenant Preview & Log in", desc: "Simulate tenant workspace access" },
    { id: "audit_logs", label: "Audit & Security Logs", desc: "View immutable platform security ledger" },
  ];

  const handleCreateSuperAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    addSuperAdmin({
      name: name.trim(),
      email: email.trim(),
      role,
      permissions: role === "Master Super Admin" ? ["all_access"] : selectedPermissions,
      twoFactorEnabled: twoFactorRequired,
      status: "active",
    });

    setName("");
    setEmail("");
    setModalOpen(false);
  };

  const filteredAdmins = superAdmins.filter(
    (a) =>
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white rounded-3xl border border-[#E2E8F0] shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#3157D5] text-white flex items-center justify-center shadow-lg shadow-[#3157D5]/30 shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-[#0F172A] tracking-tight">Super Admin Team</h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EEF2FD] text-[#3157D5]">
                {superAdmins.length} Master Accounts
              </span>
            </div>
            <p className="text-xs text-[#64748B] mt-0.5">
              Manage platform operators, role-based security entitlements, 2FA enforcement, and audit privileges.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative w-48 sm:w-60">
            <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search super admins..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white border border-[#E2E8F0] rounded-xl text-xs text-[#0F172A] outline-none focus:border-[#3157D5]"
            />
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#3157D5] hover:bg-[#2646B8] text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-[#3157D5]/20 shrink-0"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Add Super Admin</span>
          </button>
        </div>
      </div>

      {/* 2. Super Admin Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredAdmins.map((admin) => {
          const isCurrentUser = admin.id === currentSuperAdmin.id;

          return (
            <div
              key={admin.id}
              className="p-5 bg-white rounded-3xl border border-[#E2E8F0] hover:border-[#3157D5]/40 transition-all shadow-xs flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-[#0F172A] text-white flex items-center justify-center font-black text-sm shadow-xs">
                    {admin.avatar}
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      admin.status === "active" ? "bg-[#EEF2FD] text-[#3157D5]" : "bg-rose-50 text-rose-600 border border-rose-200"
                    }`}>
                      {admin.status}
                    </span>
                    {isCurrentUser && (
                      <span className="text-[9px] font-bold text-[#3157D5] bg-[#EEF2FD] px-1.5 py-0.2 rounded">
                        You
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-bold text-[#0F172A]">{admin.name}</h3>
                  <p className="text-xs font-semibold text-[#3157D5]">{admin.role}</p>
                  <p className="text-[11px] text-[#64748B] truncate mt-0.5">{admin.email}</p>
                </div>

                <div className="pt-2 border-t border-[#EDF2F7] space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-[#64748B]">2FA Status:</span>
                    <span className={`font-bold flex items-center gap-1 ${admin.twoFactorEnabled ? "text-emerald-600" : "text-amber-600"}`}>
                      {admin.twoFactorEnabled ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      {admin.twoFactorEnabled ? "Enforced" : "Disabled"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-[#64748B]">Last Active:</span>
                    <span className="font-mono text-[#0F172A]">{admin.lastActive}</span>
                  </div>
                </div>

                {/* Permissions Chips */}
                <div className="pt-1 flex flex-wrap gap-1">
                  {admin.permissions.map((perm) => (
                    <span
                      key={perm}
                      className="text-[9px] font-mono px-2 py-0.5 bg-[#F1F5F9] text-[#0F172A] rounded-md"
                    >
                      {perm}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-[#EDF2F7] flex items-center justify-between gap-2">
                {!isCurrentUser ? (
                  <>
                    <button
                      onClick={() =>
                        updateSuperAdminStatus(
                          admin.id,
                          admin.status === "active" ? "suspended" : "active"
                        )
                      }
                      className="flex-1 py-1.5 bg-white hover:bg-[#F1F5F9] border border-[#E2E8F0] rounded-xl text-xs font-bold text-[#0F172A] transition-colors"
                    >
                      {admin.status === "active" ? "Suspend" : "Activate"}
                    </button>
                    <button
                      onClick={() => deleteSuperAdmin(admin.id)}
                      className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
                      title="Revoke Credentials"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <span className="text-[11px] text-[#64748B] italic w-full text-center">Active Master Session</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Create Super Admin Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-2xl max-w-lg w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#EEF2FD] text-[#3157D5] flex items-center justify-center">
                  <UserPlus className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-[#0F172A]">Add Super Admin User</h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSuperAdmin} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-[#0F172A] block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jordan Hayes"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#E2E8F0] rounded-xl outline-none focus:border-[#3157D5] text-[#0F172A]"
                />
              </div>

              <div>
                <label className="font-bold text-[#0F172A] block mb-1">Operator Email</label>
                <input
                  type="email"
                  required
                  placeholder="jordan@apexsuperadmin.io"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#E2E8F0] rounded-xl outline-none focus:border-[#3157D5] text-[#0F172A]"
                />
              </div>

              <div>
                <label className="font-bold text-[#0F172A] block mb-1">Platform Role</label>
                <select
                  value={role}
                  onChange={(e: any) => setRole(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#E2E8F0] rounded-xl outline-none focus:border-[#3157D5] text-[#0F172A]"
                >
                  <option value="Master Super Admin">Master Super Admin (Unrestricted)</option>
                  <option value="Billing Admin">Billing Admin (Plans, Credits & Invoicing)</option>
                  <option value="Infrastructure Lead">Infrastructure Lead (SIP, Gateways & AI Models)</option>
                  <option value="Support Engineer">Support Engineer (Read-Only & Diagnostics)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-[#0F172A] block mb-1.5">Assigned Entitlements</label>
                <div className="space-y-2">
                  {allAvailablePermissions.map((perm) => (
                    <label key={perm.id} className="flex items-start gap-2.5 p-2 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={role === "Master Super Admin" || selectedPermissions.includes(perm.id)}
                        disabled={role === "Master Super Admin"}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedPermissions([...selectedPermissions, perm.id]);
                          } else {
                            setSelectedPermissions(selectedPermissions.filter((id) => id !== perm.id));
                          }
                        }}
                        className="mt-0.5 rounded text-[#3157D5] focus:ring-[#3157D5]"
                      />
                      <div>
                        <p className="font-bold text-[#0F172A]">{perm.label}</p>
                        <p className="text-[10px] text-[#64748B]">{perm.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between py-2 border-t border-[#E2E8F0]">
                <div>
                  <p className="font-bold text-[#0F172A]">Hardware 2FA Enforcement</p>
                  <p className="text-[10px] text-[#64748B]">Require TOTP code upon every session login</p>
                </div>
                <input
                  type="checkbox"
                  checked={twoFactorRequired}
                  onChange={(e) => setTwoFactorRequired(e.target.checked)}
                  className="w-4 h-4 rounded text-[#3157D5] focus:ring-[#3157D5]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-[#64748B] hover:text-[#0F172A]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#3157D5] hover:bg-[#2646B8] text-white rounded-xl text-xs font-bold shadow-md shadow-[#3157D5]/20 transition-colors"
                >
                  Create Super Admin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
