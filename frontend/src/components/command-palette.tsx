"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import {
  Search,
  Bot,
  Megaphone,
  PhoneCall,
  Users,
  Calendar,
  BookOpen,
  History,
  BarChart3,
  Coins,
  Settings,
  Workflow,
  Sparkles,
  ArrowRight,
  Scale,
  Headphones,
  Voicemail,
  Layers,
  Wrench,
  FileSpreadsheet,
  ShieldCheck,
  X,
} from "lucide-react";

export function CommandPalette() {
  const router = useRouter();
  const { commandPaletteOpen, setCommandPaletteOpen, agents, campaigns, calls, contacts } = useAppStore();
  const [query, setQuery] = useState("");

  if (!commandPaletteOpen) return null;

  const quickLinks = [
    { label: "Overview Dashboard", href: "/dashboard", icon: BarChart3, category: "Navigation" },
    { label: "Live Calls Monitor", href: "/live-calls", icon: PhoneCall, category: "Navigation" },
    { label: "Live Supervisor Cockpit", href: "/supervisor", icon: Headphones, category: "Navigation" },
    { label: "Voice Agents", href: "/agents", icon: Bot, category: "Navigation" },
    { label: "Create New Agent", href: "/agents/new", icon: Sparkles, category: "Action" },
    { label: "Visual Flow Builder", href: "/flow-builder", icon: Workflow, category: "Navigation" },
    { label: "Campaigns & Outreach", href: "/campaigns", icon: Megaphone, category: "Navigation" },
    { label: "Knowledge Base", href: "/knowledge-base", icon: BookOpen, category: "Navigation" },
    { label: "Contacts & Leads", href: "/contacts", icon: Users, category: "Navigation" },
    { label: "Google Sheets Live Sync", href: "/google-sheets", icon: FileSpreadsheet, category: "Navigation" },
    { label: "Calendar & Bookings", href: "/appointments", icon: Calendar, category: "Navigation" },
    { label: "Tools & Integrations", href: "/tools", icon: Wrench, category: "Navigation" },
    { label: "Billing & Credits", href: "/credits", icon: Coins, category: "Navigation" },
    { label: "Settings & API Keys", href: "/settings", icon: Settings, category: "Navigation" },
    { label: "Super Admin Mission Control", href: "/super-admin", icon: ShieldCheck, category: "Super Admin" },
    { label: "Super Admin Tenant Orgs", href: "/super-admin/admins", icon: ShieldCheck, category: "Super Admin" },
    { label: "Super Admin Plans & Rates", href: "/super-admin/plans", icon: ShieldCheck, category: "Super Admin" },
    { label: "Super Admin Voice AI Models", href: "/super-admin/engines", icon: ShieldCheck, category: "Super Admin" },
  ];

  const filteredLinks = quickLinks.filter((l) => l.label.toLowerCase().includes(query.toLowerCase()));
  const filteredAgents = agents.filter(
    (a) => a.name.toLowerCase().includes(query.toLowerCase()) || a.description.toLowerCase().includes(query.toLowerCase())
  );
  const filteredCampaigns = campaigns.filter((c) => c.name.toLowerCase().includes(query.toLowerCase()));
  const filteredContacts = contacts.filter(
    (c) => c.name.toLowerCase().includes(query.toLowerCase()) || c.company.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (href: string) => {
    setCommandPaletteOpen(false);
    setQuery("");
    router.push(href);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-[#101A33]/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-[#E5EAF2] overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-[#E5EAF2]">
          <Search className="w-5 h-5 text-[#78849A] mr-3 shrink-0" />
          <input
            type="text"
            placeholder="Type a command, jump to page, search agents or leads..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full text-sm text-[#172033] placeholder-[#78849A] outline-none bg-transparent"
          />
          <button
            onClick={() => setCommandPaletteOpen(false)}
            className="text-xs bg-[#F4F7FB] text-[#78849A] px-2 py-1 rounded-md border border-[#E5EAF2] hover:text-[#172033]"
          >
            ESC
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-3">
          {/* Quick Nav */}
          {filteredLinks.length > 0 && (
            <div>
              <p className="text-[11px] font-semibold tracking-wider text-[#78849A] uppercase px-3 py-1.5">
                Quick Navigation
              </p>
              <div className="space-y-1">
                {filteredLinks.slice(0, 6).map((link) => {
                  const Icon = link.icon;
                  return (
                    <button
                      key={link.href}
                      onClick={() => handleSelect(link.href)}
                      className="w-full flex items-center justify-between px-3 py-2 text-xs rounded-xl hover:bg-[#EEF2FD] text-[#172033] transition-colors group text-left"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-[#F4F7FB] group-hover:bg-[#3157D5] group-hover:text-white flex items-center justify-center text-[#78849A] transition-colors">
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <span className="font-medium">{link.label}</span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-[#78849A] opacity-0 group-hover:opacity-100 group-hover:text-[#3157D5] transition-all" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Agents */}
          {filteredAgents.length > 0 && (
            <div>
              <p className="text-[11px] font-semibold tracking-wider text-[#78849A] uppercase px-3 py-1.5">
                AI Voice Agents ({filteredAgents.length})
              </p>
              <div className="space-y-1">
                {filteredAgents.slice(0, 3).map((agent) => (
                  <button
                    key={agent.id}
                    onClick={() => handleSelect(`/agents/${agent.id}`)}
                    className="w-full flex items-center justify-between px-3 py-2 text-xs rounded-xl hover:bg-[#EEF2FD] text-[#172033] transition-colors group text-left"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-[#3157D5]/10 text-[#3157D5] flex items-center justify-center font-bold text-[10px]">
                        {agent.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-[#172033]">{agent.name}</p>
                        <p className="text-[11px] text-[#78849A] truncate max-w-xs">{agent.voice.voiceName} • {agent.language}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#E8F7F0] text-[#16A36A] uppercase">
                      {agent.status}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Contacts */}
          {filteredContacts.length > 0 && (
            <div>
              <p className="text-[11px] font-semibold tracking-wider text-[#78849A] uppercase px-3 py-1.5">
                Contacts & Leads ({filteredContacts.length})
              </p>
              <div className="space-y-1">
                {filteredContacts.slice(0, 3).map((contact) => (
                  <button
                    key={contact.id}
                    onClick={() => handleSelect("/contacts")}
                    className="w-full flex items-center justify-between px-3 py-2 text-xs rounded-xl hover:bg-[#EEF2FD] text-[#172033] transition-colors group text-left"
                  >
                    <div className="flex items-center gap-2.5">
                      <Users className="w-4 h-4 text-[#78849A]" />
                      <div>
                        <p className="font-medium text-[#172033]">{contact.name}</p>
                        <p className="text-[11px] text-[#78849A]">{contact.company} • {contact.phone}</p>
                      </div>
                    </div>
                    <span className="text-[11px] font-semibold text-[#3157D5]">Score {contact.leadScore}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-[#F4F7FB] border-t border-[#E5EAF2] text-[11px] text-[#78849A]">
          <span>Tip: Press <kbd className="px-1.5 py-0.5 bg-white border border-[#E5EAF2] rounded text-[10px] font-mono">Cmd + K</kbd> anywhere</span>
          <span>Apex Voice Cloud v2.5</span>
        </div>
      </div>
    </div>
  );
}
