"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAppStore } from "@/lib/store";
import { PageHeader } from "@/components/page-header";
import {
  Table,
  ExternalLink,
  RefreshCw,
  CheckCircle2,
  Plus,
  ArrowRight,
  Download,
  Settings,
  Database,
  FileSpreadsheet,
  Check,
  Search,
} from "lucide-react";

export default function GoogleSheetsPage() {
  const { addToast, calls, appointments } = useAppStore();

  const [isConnected, setIsConnected] = useState(true);
  const [activeSheet, setActiveSheet] = useState("leads_2026");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSyncing, setIsSyncing] = useState(false);

  // Simulated live rows from calls and appointments
  const [rows, setRows] = useState([
    {
      id: "row-1",
      timestamp: "2026-06-17 14:22:10",
      callerName: "Jonathan Vance",
      phone: "+1 (415) 890-2341",
      agent: "Marcus (Solar Advisor)",
      status: "Qualified",
      score: 96,
      appointment: "Thu Jun 18, 2:00 PM PST",
      notes: "Commercial rooftop 45kW requirement. Wants prepayment 15% discount.",
    },
    {
      id: "row-2",
      timestamp: "2026-06-17 13:45:00",
      callerName: "Sarah Jenkins",
      phone: "+1 (512) 349-8821",
      agent: "Rachel (Enterprise SDR)",
      status: "Qualified",
      score: 88,
      appointment: "Fri Jun 19, 10:30 AM CST",
      notes: "Looking for 50-seat AI call center migration. High urgency.",
    },
    {
      id: "row-3",
      timestamp: "2026-06-17 12:10:35",
      callerName: "David Miller",
      phone: "+1 (305) 772-9104",
      agent: "Rachel (Enterprise SDR)",
      status: "Callback Scheduled",
      score: 74,
      appointment: "Mon Jun 22, 1:00 PM EST",
      notes: "Requested technical whitepaper on SOC2 compliance.",
    },
    {
      id: "row-4",
      timestamp: "2026-06-17 11:05:12",
      callerName: "Elena Rostova",
      phone: "+1 (206) 554-1980",
      agent: "Marcus (Solar Advisor)",
      status: "Qualified",
      score: 92,
      appointment: "Thu Jun 18, 11:00 AM PST",
      notes: "Residential battery storage add-on for existing solar array.",
    },
    {
      id: "row-5",
      timestamp: "2026-06-17 09:30:40",
      callerName: "Michael Chang",
      phone: "+1 (617) 443-8829",
      agent: "Marcus (Solar Advisor)",
      status: "Voicemail Left",
      score: 45,
      appointment: "N/A",
      notes: "AMD 2.0 detected carrier tone; delivered personalized drop.",
    },
  ]);

  const handleSyncNow = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      addToast({
        title: "Google Sheets Synced",
        description: "Successfully pushed 5 new call records and appointments to Google Drive.",
        type: "success",
      });
    }, 900);
  };

  const handleExportCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Timestamp,Caller Name,Phone,Agent,Status,Score,Appointment,Notes\n" +
      rows
        .map(
          (r) =>
            `"${r.timestamp}","${r.callerName}","${r.phone}","${r.agent}","${r.status}","${r.score}","${r.appointment}","${r.notes}"`
        )
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "apex_leads_google_sheet.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast({
      title: "CSV Exported",
      description: "Downloaded apex_leads_google_sheet.csv",
      type: "success",
    });
  };

  const filteredRows = rows.filter(
    (r) =>
      r.callerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.phone.includes(searchQuery) ||
      r.notes.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white rounded-3xl border border-[#E2E8F0] shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#3157D5] text-white flex items-center justify-center shadow-lg shadow-[#3157D5]/30 shrink-0">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-[#0F172A] tracking-tight">Google Sheets Integration</h1>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                isConnected ? "bg-[#EEF2FD] text-[#3157D5]" : "bg-[#F1F5F9] text-[#64748B]"
              }`}>
                {isConnected ? "● Live 2-Way Sync Active" : "Disconnected"}
              </span>
            </div>
            <p className="text-xs text-[#64748B] mt-0.5">
              Push call logs, appointment bookings, and lead qualification transcripts to Google Sheets in real-time.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSyncNow}
            disabled={isSyncing}
            className="flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-[#EEF2FD] border border-[#E2E8F0] hover:border-[#3157D5] text-[#0F172A] hover:text-[#3157D5] rounded-xl text-xs font-bold transition-all shadow-2xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin text-[#3157D5]" : ""}`} />
            <span>{isSyncing ? "Syncing..." : "Sync Now"}</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#3157D5] hover:bg-[#2646B8] text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-[#3157D5]/20"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* 2. Controls & Sheet Selector */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 bg-white rounded-3xl border border-[#E2E8F0] shadow-xs space-y-1">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#64748B]">
            Target Spreadsheet
          </span>
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-[#0F172A]">Apex Live Leads & Appointments 2026</span>
            <ExternalLink className="w-4 h-4 text-[#3157D5]" />
          </div>
          <p className="text-[11px] text-[#64748B]">Google Drive: /Apex Operations/Live Sync/Sheet-01</p>
        </div>

        <div className="p-5 bg-white rounded-3xl border border-[#E2E8F0] shadow-xs space-y-1">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#64748B]">
            Auto-Sync Trigger
          </span>
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-[#0F172A]">On Call Disconnect & Booking</span>
            <span className="text-xs font-bold text-[#3157D5] bg-[#EEF2FD] px-2 py-0.5 rounded-full">Active</span>
          </div>
          <p className="text-[11px] text-[#64748B]">Appends a new row within 400ms of call completion</p>
        </div>

        <div className="p-5 bg-white rounded-3xl border border-[#E2E8F0] shadow-xs space-y-1">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#64748B]">
            Synced Records
          </span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-black text-[#0F172A]">{rows.length.toLocaleString()}</span>
            <span className="text-xs font-bold text-[#3157D5]">100% Verified</span>
          </div>
          <p className="text-[11px] text-[#64748B]">Last sync executed 1 minute ago</p>
        </div>
      </div>

      {/* 3. Live Sheet Table Preview */}
      <div className="p-6 bg-white rounded-3xl border border-[#E2E8F0] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#EDF2F7]">
          <div>
            <h2 className="text-base font-bold text-[#0F172A]">Live Sheet Row Stream</h2>
            <p className="text-xs text-[#64748B]">Real-time preview of synced data columns in Google Sheets</p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search synced records..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-white border border-[#E2E8F0] rounded-xl text-xs text-[#0F172A] placeholder-[#94A3B8] outline-none focus:border-[#3157D5]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] text-[#64748B] uppercase tracking-wider font-semibold border-b border-[#E2E8F0]">
              <tr>
                <th className="p-3">Timestamp</th>
                <th className="p-3">Caller Name</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Assigned Agent</th>
                <th className="p-3">Outcome</th>
                <th className="p-3">Score</th>
                <th className="p-3">Booked Appointment</th>
                <th className="p-3">Qualification Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {filteredRows.map((row) => (
                <tr key={row.id} className="hover:bg-[#EEF2FD]/40 transition-colors">
                  <td className="p-3 font-mono text-[11px] text-[#64748B] whitespace-nowrap">{row.timestamp}</td>
                  <td className="p-3 font-bold text-[#0F172A] whitespace-nowrap">{row.callerName}</td>
                  <td className="p-3 font-mono text-[#64748B] whitespace-nowrap">{row.phone}</td>
                  <td className="p-3 text-[#0F172A] whitespace-nowrap">{row.agent}</td>
                  <td className="p-3 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EEF2FD] text-[#3157D5]">
                      {row.status}
                    </span>
                  </td>
                  <td className="p-3 font-bold text-[#3157D5] font-mono">{row.score}</td>
                  <td className="p-3 font-semibold text-[#0F172A] whitespace-nowrap">{row.appointment}</td>
                  <td className="p-3 text-[#64748B] max-w-xs truncate">{row.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
