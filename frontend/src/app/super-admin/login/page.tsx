"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSuperAdminStore } from "@/lib/super-admin-store";
import {
  ShieldAlert,
  Lock,
  Mail,
  ArrowRight,
  KeyRound,
  ShieldCheck,
  Building2,
  CheckCircle2,
} from "lucide-react";

export default function SuperAdminLoginPage() {
  const router = useRouter();
  const { superAdmins, setCurrentSuperAdmin, addToast } = useSuperAdminStore();

  const [email, setEmail] = useState("alexander@apexsuperadmin.io");
  const [password, setPassword] = useState("••••••••••••");
  const [otpCode, setOtpCode] = useState("892401");
  const [isLoading, setIsLoading] = useState(false);

  const handleSuperAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      const match = superAdmins.find((a) => a.email.toLowerCase() === email.toLowerCase()) || superAdmins[0];
      setCurrentSuperAdmin(match);
      addToast({
        title: "Super Admin Authenticated",
        description: `Welcome Master Console, ${match.name}. Full platform authorization active.`,
        type: "success",
      });
      router.push("/super-admin");
    }, 800);
  };

  const fillTestCredentials = (adminEmail: string) => {
    setEmail(adminEmail);
    setPassword("MasterSuperAdminKey2026!");
    setOtpCode(Math.floor(100000 + Math.random() * 900000).toString());
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] flex flex-col justify-between p-4 md:p-8">
      {/* Top Header */}
      <div className="flex items-center justify-between max-w-6xl w-full mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#3157D5] flex items-center justify-center text-white shadow-md shadow-[#3157D5]/30">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold text-base tracking-tight text-[#0F172A]">APEX</span>
            <span className="text-[10px] font-black ml-1.5 px-1.5 py-0.5 bg-[#0F172A] text-white rounded-md tracking-wider">
              SUPER ADMIN
            </span>
          </div>
        </div>

        <Link
          href="/login"
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#EEF2FD] hover:bg-[#3157D5] text-[#3157D5] hover:text-white rounded-xl text-xs font-bold transition-all border border-[#3157D5]/20"
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Switch to Tenant Admin Login</span>
        </Link>
      </div>

      {/* Login Card Container */}
      <div className="max-w-md w-full mx-auto my-8 space-y-6">
        <div className="p-8 bg-white rounded-3xl border border-[#E2E8F0] shadow-xl space-y-6">
          <div className="space-y-1.5 text-center">
            <div className="w-12 h-12 rounded-2xl bg-[#EEF2FD] text-[#3157D5] flex items-center justify-center mx-auto mb-3">
              <KeyRound className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-black text-[#0F172A] tracking-tight">Super Admin Portal</h1>
            <p className="text-xs text-[#64748B]">
              Restricted platform authorization for master operators, billing leads & telephony engineers.
            </p>
          </div>

          <form onSubmit={handleSuperAdminLogin} className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-[#0F172A] block mb-1.5">Master Operator Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@apexsuperadmin.io"
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E2E8F0] rounded-xl text-xs text-[#0F172A] outline-none focus:border-[#3157D5]"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-[#0F172A] block mb-1.5">Security Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E2E8F0] rounded-xl text-xs text-[#0F172A] outline-none focus:border-[#3157D5]"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-bold text-[#0F172A]">2FA Authenticator Code</label>
                <span className="text-[10px] text-[#3157D5] font-bold">Hardware 2FA Active</span>
              </div>
              <div className="relative">
                <ShieldCheck className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="6-digit TOTP"
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E2E8F0] rounded-xl font-mono text-xs text-[#0F172A] outline-none focus:border-[#3157D5]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-[#3157D5] hover:bg-[#2646B8] text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-[#3157D5]/30 transition-all cursor-pointer"
            >
              <span>{isLoading ? "Authenticating Master Key..." : "Authorize Super Admin Console"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Credentials Switcher */}
          <div className="pt-4 border-t border-[#EDF2F7] space-y-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#64748B] block text-center">
              Quick Test Roles:
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {superAdmins.slice(0, 4).map((admin) => (
                <button
                  key={admin.id}
                  type="button"
                  onClick={() => fillTestCredentials(admin.email)}
                  className="p-2 bg-white hover:bg-[#EEF2FD] border border-[#E2E8F0] hover:border-[#3157D5]/40 rounded-xl text-left transition-colors"
                >
                  <p className="text-[11px] font-bold text-[#0F172A] truncate">{admin.name}</p>
                  <p className="text-[9px] text-[#3157D5] font-semibold">{admin.role}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="text-center text-xs text-[#64748B] max-w-md mx-auto">
        <span>Protected by Hardware FIDO2 / TOTP • Apex Voice Telecommunications Architecture</span>
      </div>
    </div>
  );
}
