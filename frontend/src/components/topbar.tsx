"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAppStore } from "@/lib/store";
import {
  Menu,
  Search,
  Bell,
  PhoneCall,
  CheckCircle2,
  Settings,
  LogOut,
  Sparkles,
  Sun,
  Moon,
  Check,
  Trash2,
  ExternalLink,
} from "lucide-react";

export function Topbar() {
  const {
    theme,
    toggleTheme,
    notifications,
    unreadNotificationCount,
    markAllNotificationsAsRead,
    clearNotifications,
    setMobileMenuOpen,
    setCommandPaletteOpen,
    activeCallCount,
    addToast,
  } = useAppStore();

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 md:px-6 bg-[#3157D5] text-white shadow-md">
      {/* Left side: Mobile Toggle & Global Search Pill */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl md:hidden transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Button */}
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="flex items-center gap-2.5 px-3.5 py-2 bg-white/15 hover:bg-white/25 border border-white/20 rounded-xl text-xs text-white transition-all group w-64 md:w-80 shadow-2xs"
        >
          <Search className="w-4 h-4 text-white/80 shrink-0 group-hover:text-white" />
          <span className="font-normal text-white/90 truncate">Search agents, calls, contacts...</span>
        </button>
      </div>

      {/* Right side: Theme Switcher, Notifications & Profile */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Live Call Quick Badge */}
        {activeCallCount > 0 && (
          <Link
            href="/live-calls"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-[#3157D5] rounded-xl text-xs font-bold shadow-xs hover:bg-white/90 transition-colors"
          >
            <span className="w-2 h-2 rounded-full bg-[#3157D5] animate-ping" />
            <PhoneCall className="w-3.5 h-3.5 text-[#3157D5]" />
            <span>{activeCallCount} Live</span>
          </Link>
        )}

        {/* Dark / Light Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="p-2 text-white/90 hover:text-white hover:bg-white/15 rounded-xl transition-colors"
          title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
        >
          {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
        </button>

        {/* Notifications Bell & Dropdown Drawer */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen((prev) => !prev)}
            className="relative p-2 text-white/90 hover:text-white hover:bg-white/15 rounded-xl transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-400 ring-2 ring-[#3157D5]" />
            )}
          </button>

          {notificationsOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setNotificationsOpen(false)} />
              <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white text-[#0F172A] rounded-3xl shadow-2xl border border-[#E2E8F0] p-4 z-50 animate-in fade-in zoom-in-95 duration-100 space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-extrabold text-[#0F172A]">Notifications</h3>
                    {unreadNotificationCount > 0 && (
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-[#EEF2FD] text-[#3157D5]">
                        {unreadNotificationCount} new
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    {unreadNotificationCount > 0 && (
                      <button
                        onClick={markAllNotificationsAsRead}
                        className="text-[11px] font-bold text-[#3157D5] hover:underline flex items-center gap-1"
                      >
                        <Check className="w-3 h-3" />
                        <span>Mark read</span>
                      </button>
                    )}
                    <button
                      onClick={clearNotifications}
                      className="text-[11px] font-bold text-[#64748B] hover:text-rose-600 flex items-center gap-1"
                      title="Clear all notifications"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <div className="max-h-72 overflow-y-auto space-y-2 pr-1 text-xs">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-[#64748B]">No new notifications</div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-3 rounded-2xl border transition-all ${
                          !n.read ? "bg-[#EEF2FD]/50 border-[#3157D5]/30 font-semibold" : "bg-white border-[#E2E8F0]"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-bold text-[#0F172A]">{n.title}</p>
                          <span className="text-[10px] text-[#64748B] font-mono shrink-0">{n.timestamp}</span>
                        </div>
                        <p className="text-[11px] text-[#64748B] mt-0.5 leading-snug">{n.message}</p>
                        {n.link && (
                          <Link
                            href={n.link}
                            onClick={() => setNotificationsOpen(false)}
                            className="inline-flex items-center gap-1 text-[10px] font-bold text-[#3157D5] hover:underline mt-1.5"
                          >
                            <span>Open Link</span>
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* User Profile Menu */}
        <div className="relative">
          <button
            onClick={() => setUserMenuOpen((prev) => !prev)}
            className="flex items-center gap-2 p-1 rounded-xl hover:bg-white/15 transition-colors focus:outline-hidden"
          >
            <div className="w-8 h-8 rounded-full bg-[#3157D5] text-white flex items-center justify-center font-bold text-xs shadow-xs border-2 border-white/30">
              AD
            </div>
          </button>

          {userMenuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
              <div className="absolute right-0 top-full mt-2 w-56 bg-white text-[#0F172A] rounded-2xl shadow-2xl border border-[#E2E8F0] py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-4 py-2 border-b border-[#E2E8F0]">
                  <p className="text-xs font-bold text-[#0F172A]">Alex DeVries</p>
                  <p className="text-[11px] text-[#64748B]">alex@apexvoice.ai</p>
                  <span className="inline-block mt-1 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider bg-[#EEF2FD] text-[#3157D5] rounded-md">
                    Enterprise Workspace
                  </span>
                </div>

                <div className="py-1 text-xs">
                  <Link
                    href="/settings"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-[#0F172A] hover:bg-[#EEF2FD]"
                  >
                    <Settings className="w-3.5 h-3.5 text-[#3157D5]" />
                    <span>Workspace Settings</span>
                  </Link>
                  <Link
                    href="/super-admin"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-[#0F172A] hover:bg-[#EEF2FD]"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#3157D5]" />
                    <span>Super Admin Console</span>
                  </Link>
                </div>

                <div className="border-t border-[#E2E8F0] pt-1">
                  <Link
                    href="/login"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs text-[#0F172A] hover:bg-[#EEF2FD] font-semibold"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
