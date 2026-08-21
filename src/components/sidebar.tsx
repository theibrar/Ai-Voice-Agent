"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  PhoneCall,
  Bot,
  Workflow,
  Megaphone,
  BookOpen,
  Users,
  Calendar,
  Phone,
  Radio,
  History,
  TrendingUp,
  FileText,
  Coins,
  Settings,
  ChevronLeft,
  ChevronRight,
  Headphones,
  Zap,
  LogOut,
  X,
  Scale,
  Layers,
  Voicemail,
  Wrench,
  FileSpreadsheet,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: string | number;
  badgeVariant?: "live" | "info" | "neutral";
}

interface NavSection {
  title?: string;
  items: NavItem[];
}

export function Sidebar() {
  const pathname = usePathname();
  const {
    sidebarCollapsed,
    setSidebarCollapsed,
    mobileMenuOpen,
    setMobileMenuOpen,
    activeCallCount,
    activeWorkspace,
  } = useAppStore();

  const navSections: NavSection[] = [
    {
      items: [
        { label: "Overview", href: "/dashboard", icon: BarChart3 },
      ],
    },
    {
      title: "Voice Operations",
      items: [
        {
          label: "Live Calls",
          href: "/live-calls",
          icon: PhoneCall,
          badge: activeCallCount > 0 ? `${activeCallCount} Live` : undefined,
          badgeVariant: "live",
        },
        {
          label: "Live Supervisor",
          href: "/supervisor",
          icon: Headphones,
          badge: "Cockpit",
          badgeVariant: "info",
        },
        { label: "Voice Agents", href: "/agents", icon: Bot },
        { label: "Flow Builder", href: "/flow-builder", icon: Workflow },
        { label: "Campaigns", href: "/campaigns", icon: Megaphone },
      ],
    },
    {
      title: "Data & Context",
      items: [
        { label: "Knowledge Base", href: "/knowledge-base", icon: BookOpen },
        { label: "Contacts & Leads", href: "/contacts", icon: Users },
        { label: "Calendar & Bookings", href: "/appointments", icon: Calendar, badge: "Sync" },
      ],
    },
    {
      title: "Tools & Integrations",
      items: [
        { label: "Tools", href: "/tools", icon: Wrench, badge: "7 Tools" },
        { label: "Google Sheets", href: "/google-sheets", icon: FileSpreadsheet, badge: "Live" },
        { label: "Phone Numbers", href: "/phone-numbers", icon: Phone },
        { label: "SIP Connections", href: "/incoming-connections", icon: Radio },
        { label: "Smart AMD 2.0", href: "/smart-amd", icon: Voicemail, badge: "Tone Drop" },
      ],
    },
    {
      title: "Intelligence & Logs",
      items: [
        { label: "Conversation Funnels", href: "/funnels", icon: Layers, badge: "Funnels" },
        { label: "A/B Testing Lab", href: "/ab-testing", icon: Scale, badge: "A/B" },
        { label: "Call History", href: "/call-history", icon: History },
        { label: "Analytics Suite", href: "/analytics", icon: TrendingUp },
      ],
    },
    {
      title: "Workspace",
      items: [
        { label: "Templates", href: "/templates", icon: FileText },
        { label: "Credits & Billing", href: "/credits", icon: Coins, badge: `$${Math.round(activeWorkspace.credits)}` },
        { label: "Settings", href: "/settings", icon: Settings },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Container (Pure White #FFFFFF with Crisp Dark Text & Royal Blue Active/Hover) */}
      <aside
        className={cn(
          "fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-white text-[#0F172A] border-r border-[#E2E8F0] shadow-xs transition-all duration-300 ease-in-out select-none",
          sidebarCollapsed ? "w-20" : "w-64",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        {/* Brand Logo Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-[#E2E8F0] shrink-0 bg-white">
          <Link href="/dashboard" className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-2xl bg-[#3157D5] flex items-center justify-center text-white shrink-0 shadow-md shadow-[#3157D5]/30 font-extrabold text-lg">
              Q
            </div>
            {!sidebarCollapsed && (
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-base tracking-tight text-[#0F172A]">APEX</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 bg-[#3157D5] text-white rounded-md tracking-wider">VOICE</span>
                </div>
                <span className="text-[10px] text-[#64748B] font-semibold tracking-wide">ENTERPRISE PLATFORM</span>
              </div>
            )}
          </Link>

          {/* Desktop Collapse Button */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="hidden md:flex items-center justify-center w-7 h-7 rounded-xl text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-colors"
            title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>

          {/* Mobile Close Button */}
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="md:hidden flex items-center justify-center w-8 h-8 rounded-xl text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav Items List (Pure White Background, Full Black Text, Royal Blue Active & Hover) */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 bg-white">
          {navSections.map((section, idx) => (
            <div key={idx} className="space-y-1">
              {section.title && !sidebarCollapsed && (
                <div className="px-3 text-[10px] font-extrabold uppercase tracking-widest text-[#64748B]">
                  {section.title}
                </div>
              )}
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all group relative",
                      isActive
                        ? "bg-[#3157D5] text-white shadow-md shadow-[#3157D5]/30 font-extrabold"
                        : "text-[#0F172A] hover:bg-[#3157D5] hover:text-white hover:shadow-md hover:shadow-[#3157D5]/20"
                    )}
                    title={sidebarCollapsed ? item.label : undefined}
                  >
                    <Icon
                      className={cn(
                        "w-4 h-4 shrink-0 transition-colors",
                        isActive ? "text-white" : "text-[#64748B] group-hover:text-white"
                      )}
                    />

                    {!sidebarCollapsed && (
                      <span className="flex-1 truncate group-hover:text-white">{item.label}</span>
                    )}

                    {!sidebarCollapsed && item.badge && (
                      <span
                        className={cn(
                          "px-2 py-0.5 text-[10px] font-bold rounded-full transition-colors",
                          isActive
                            ? "bg-white/20 text-white"
                            : item.badgeVariant === "live"
                            ? "bg-[#EEF2FD] text-[#3157D5] group-hover:bg-white/20 group-hover:text-white border border-[#3157D5]/30 group-hover:border-white/30"
                            : "bg-[#F1F5F9] text-[#64748B] group-hover:bg-white/20 group-hover:text-white"
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer Credits & User Profile (Pure White Background) */}
        <div className="p-3 border-t border-[#E2E8F0] space-y-3 shrink-0 bg-white">
          {!sidebarCollapsed ? (
            <>
              {/* Credit Balance Meter */}
              <div className="p-3 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#64748B] flex items-center gap-1 font-semibold">
                    <Zap className="w-3.5 h-3.5 text-[#3157D5]" />
                    Voice Credits
                  </span>
                  <span className="font-extrabold text-[#0F172A] font-mono">${activeWorkspace.credits.toFixed(2)}</span>
                </div>
                <div className="w-full bg-[#E2E8F0] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#3157D5] h-full rounded-full" style={{ width: "74%" }} />
                </div>
                <div className="flex justify-between text-[10px] text-[#64748B]">
                  <span>~{Math.round(activeWorkspace.credits / 0.08).toLocaleString()} mins left</span>
                  <Link href="/credits" className="text-[#3157D5] hover:underline font-bold">
                    Add Funds
                  </Link>
                </div>
              </div>

              {/* User Profile */}
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#3157D5] flex items-center justify-center font-bold text-xs text-white shadow-xs">
                    AD
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-[#0F172A] leading-tight">Alex DeVries</span>
                    <span className="text-[10px] text-[#64748B]">Admin • Enterprise</span>
                  </div>
                </div>
                <Link href="/login" className="text-[#64748B] hover:text-[#0F172A] p-1 rounded-lg hover:bg-[#F1F5F9]" title="Sign out">
                  <LogOut className="w-4 h-4" />
                </Link>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-3 py-1">
              <Link
                href="/credits"
                className="w-10 h-10 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center text-[#3157D5] hover:bg-[#3157D5] hover:text-white transition-colors"
                title={`$${activeWorkspace.credits.toFixed(2)} Credits`}
              >
                <Zap className="w-4 h-4" />
              </Link>
              <div className="w-8 h-8 rounded-xl bg-[#3157D5] flex items-center justify-center font-bold text-xs text-white">
                AD
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
