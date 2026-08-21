"use client";

import React from "react";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import { CommandPalette } from "./command-palette";
import { ToastContainer } from "./toast-provider";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const { sidebarCollapsed } = useAppStore();

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#0F172A] flex flex-col selection:bg-[#3157D5]/20 selection:text-[#0F172A]">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div
        className={cn(
          "flex-1 flex flex-col transition-all duration-300 ease-in-out min-w-0",
          sidebarCollapsed ? "md:pl-18" : "md:pl-64"
        )}
      >
        {/* Topbar */}
        <Topbar />

        {/* Dynamic Page Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Global Modals & Notifications */}
      <CommandPalette />
      <ToastContainer />
    </div>
  );
}
