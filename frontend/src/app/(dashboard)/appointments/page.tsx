"use client";

import React, { useState } from "react";
import { useAppStore } from "@/lib/store";
import { PageHeader } from "@/components/page-header";
import {
  Calendar as CalendarIcon,
  Clock,
  Video,
  Phone,
  Bot,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Plus,
  Filter,
  ChevronLeft,
  ChevronRight,
  User,
  Check,
  X,
  CalendarDays,
  List,
} from "lucide-react";

export default function AppointmentsPage() {
  const { appointments, updateAppointmentStatus, addToast } = useAppStore();

  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"list" | "calendar">("calendar");
  const [activeDate, setActiveDate] = useState<number>(17); // Jun 17
  const [modalOpen, setModalOpen] = useState(false);

  // New appointment form state
  const [leadName, setLeadName] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [selectedAgent, setSelectedAgent] = useState("Marcus (Solar Advisor)");
  const [bookingTime, setBookingTime] = useState("2:00 PM PST");

  const filteredAppointments = appointments.filter((apt) =>
    statusFilter === "all" ? true : apt.status === statusFilter
  );

  const handleCreateBooking = () => {
    if (!leadName.trim()) return;
    setModalOpen(false);
    addToast({
      title: "Appointment Booked",
      description: `Confirmed for ${leadName} on Wed Jun 17 at ${bookingTime}. Google Calendar invite sent.`,
      type: "success",
    });
    setLeadName("");
    setLeadPhone("");
  };

  // Calendar Day cell helper
  const calendarDays = [
    { day: 1, label: "Mon", date: "Jun 1", events: [] },
    { day: 2, label: "Tue", date: "Jun 2", events: [] },
    { day: 3, label: "Wed", date: "Jun 3", events: [] },
    { day: 4, label: "Thu", date: "Jun 4", events: [] },
    { day: 5, label: "Fri", date: "Jun 5", events: [] },
    { day: 6, label: "Sat", date: "Jun 6", events: [] },
    { day: 7, label: "Sun", date: "Jun 7", events: [] },
    { day: 8, label: "Mon", date: "Jun 8", events: [] },
    { day: 9, label: "Tue", date: "Jun 9", events: [] },
    { day: 10, label: "Wed", date: "Jun 10", events: [] },
    { day: 11, label: "Thu", date: "Jun 11", events: [] },
    { day: 12, label: "Fri", date: "Jun 12", events: [] },
    { day: 13, label: "Sat", date: "Jun 13", events: [] },
    { day: 14, label: "Sun", date: "Jun 14", events: [] },
    { day: 15, label: "Mon", date: "Jun 15", events: appointments.length > 0 ? ["David Miller (1:00 PM)"] : [] },
    { day: 16, label: "Tue", date: "Jun 16", events: appointments.length > 0 ? ["Elena Rostova (11:00 AM)"] : [] },
    { day: 17, label: "Wed", date: "Jun 17", isToday: true, events: appointments.length > 0 ? ["Jonathan Vance (2:00 PM)", "Sarah Jenkins (10:30 AM)"] : [] },
    { day: 18, label: "Thu", date: "Jun 18", events: appointments.length > 0 ? ["Michael Chang (4:30 PM)"] : [] },
    { day: 19, label: "Fri", date: "Jun 19", events: appointments.length > 0 ? ["Anna Wright (11:00 AM)"] : [] },
    { day: 20, label: "Sat", date: "Jun 20", events: [] },
    { day: 21, label: "Sun", date: "Jun 21", events: [] },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white rounded-3xl border border-[#E2E8F0] shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#3157D5] text-white flex items-center justify-center shadow-lg shadow-[#3157D5]/30 shrink-0">
            <CalendarDays className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-[#0F172A] tracking-tight">Calendar & Appointments</h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EEF2FD] text-[#3157D5]">
                ● Google Calendar Synced
              </span>
            </div>
            <p className="text-xs text-[#64748B] mt-0.5">
              Automated calendar booking and video conference dispatch across Google Calendar, Outlook 365, and Calendly.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-[#F1F5F9] p-1 rounded-xl border border-[#E2E8F0]">
            <button
              onClick={() => setViewMode("calendar")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === "calendar" ? "bg-[#3157D5] text-white shadow-xs" : "text-[#64748B] hover:text-[#0F172A]"
              }`}
            >
              <CalendarDays className="w-3.5 h-3.5" />
              <span>Calendar</span>
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === "list" ? "bg-[#3157D5] text-white shadow-xs" : "text-[#64748B] hover:text-[#0F172A]"
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>List</span>
            </button>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#3157D5] hover:bg-[#2646B8] text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-[#3157D5]/20"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Book Slot</span>
          </button>
        </div>
      </div>

      {/* 2. Summary KPI row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 bg-white rounded-3xl border border-[#E2E8F0] shadow-xs">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#64748B]">Confirmed Bookings</span>
          <div className="text-2xl font-black text-[#0F172A] mt-1">
            {appointments.filter((a) => a.status === "confirmed").length}
          </div>
          <span className="text-xs text-[#3157D5] font-bold mt-1 block">100% Calendar Synced</span>
        </div>

        <div className="p-5 bg-white rounded-3xl border border-[#E2E8F0] shadow-xs">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#64748B]">Pending Confirmation</span>
          <div className="text-2xl font-black text-[#0F172A] mt-1">
            {appointments.filter((a) => a.status === "pending").length}
          </div>
          <span className="text-xs text-[#64748B] mt-1 block">Awaiting lead SMS verification</span>
        </div>

        <div className="p-5 bg-white rounded-3xl border border-[#E2E8F0] shadow-xs">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#64748B]">Avg Slot Duration</span>
          <div className="text-2xl font-black text-[#3157D5] mt-1">
            {appointments.length > 0 ? "30 Mins" : "0 Mins"}
          </div>
          <span className="text-xs text-[#64748B] mt-1 block">
            {appointments.length > 0 ? "Auto Google Meet link generated" : "No active bookings"}
          </span>
        </div>
      </div>

      {/* 3. Calendar View Mode */}
      {viewMode === "calendar" ? (
        <div className="p-6 bg-white rounded-3xl border border-[#E2E8F0] shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#EDF2F7]">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-[#0F172A]">June 2026</h2>
              <span className="text-xs font-bold text-[#3157D5] bg-[#EEF2FD] px-2 py-0.5 rounded-full">
                Week 25
              </span>
            </div>

            <div className="flex items-center gap-1 text-xs text-[#64748B]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#3157D5] inline-block" />
              <span>Voice Confirmed</span>
            </div>
          </div>

          {/* 7-Col Day Grid */}
          <div className="grid grid-cols-7 gap-3">
            {calendarDays.slice(14, 21).map((d) => (
              <div
                key={d.day}
                onClick={() => setActiveDate(d.day)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer min-h-[140px] flex flex-col justify-between ${
                  activeDate === d.day
                    ? "border-[#3157D5] bg-[#EEF2FD]/30 ring-2 ring-[#3157D5]/20"
                    : "border-[#E2E8F0] bg-white hover:border-[#3157D5]/40"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-[#64748B] uppercase">{d.label}</span>
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
                      d.isToday ? "bg-[#3157D5] text-white" : "text-[#0F172A]"
                    }`}>
                      {d.day}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    {d.events.map((ev, i) => (
                      <div
                        key={i}
                        className="p-1.5 bg-[#3157D5] text-white rounded-lg text-[10px] font-bold truncate shadow-2xs"
                      >
                        {ev}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="text-[10px] text-[#94A3B8] text-right font-mono">
                  {d.events.length > 0 ? `${d.events.length} booked` : "Available"}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* 4. List View Mode */
        <div className="space-y-4">
          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-[#E2E8F0] shadow-xs w-fit">
            {["all", "confirmed", "pending", "rescheduled", "cancelled"].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors capitalize ${
                  statusFilter === st
                    ? "bg-[#3157D5] text-white shadow-2xs"
                    : "text-[#64748B] hover:text-[#0F172A]"
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredAppointments.map((apt) => (
              <div
                key={apt.id}
                className="p-5 bg-white rounded-3xl border border-[#E2E8F0] hover:border-[#3157D5]/40 transition-all shadow-xs flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-base font-bold text-[#0F172A]">{apt.contactName}</h3>
                      <p className="text-xs text-[#64748B]">{apt.contactPhone} • {apt.contactEmail}</p>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#EEF2FD] text-[#3157D5]">
                      {apt.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs pt-2">
                    <div className="flex items-center gap-1.5 text-[#0F172A]">
                      <CalendarIcon className="w-3.5 h-3.5 text-[#3157D5]" />
                      <span>{apt.scheduledTime.split(" ")[0] || "Jun 17"}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[#0F172A]">
                      <Clock className="w-3.5 h-3.5 text-[#3157D5]" />
                      <span>{apt.scheduledTime} ({apt.durationMinutes}m)</span>
                    </div>
                  </div>

                  <p className="text-xs text-[#64748B] bg-[#F8FAFC] p-2.5 rounded-xl border border-[#E2E8F0]">
                    {apt.notes}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#EDF2F7]">
                  <span className="text-[11px] text-[#64748B]">Agent: {apt.agentName}</span>
                  <button
                    onClick={() => {
                      updateAppointmentStatus(apt.id, "confirmed");
                      addToast({ title: "Calendar Confirmed", description: "Google Meet link dispatched.", type: "success" });
                    }}
                    className="px-3.5 py-1.5 bg-[#3157D5] hover:bg-[#2646B8] text-white rounded-lg text-xs font-bold transition-colors"
                  >
                    Confirm & Sync
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Booking Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-2xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#EEF2FD] text-[#3157D5] flex items-center justify-center">
                  <CalendarIcon className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-[#0F172A]">Book Operations Appointment</h3>
              </div>
              <button onClick={() => setModalOpen(false)} className="p-1 text-[#64748B] hover:text-[#0F172A]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-[#0F172A] block mb-1">Lead / Contact Name</label>
                <input
                  type="text"
                  placeholder="e.g. Jonathan Vance"
                  value={leadName}
                  onChange={(e) => setLeadName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#E2E8F0] rounded-xl outline-none focus:border-[#3157D5] text-[#0F172A]"
                />
              </div>

              <div>
                <label className="font-bold text-[#0F172A] block mb-1">Phone Number</label>
                <input
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={leadPhone}
                  onChange={(e) => setLeadPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#E2E8F0] rounded-xl outline-none focus:border-[#3157D5] text-[#0F172A]"
                />
              </div>

              <div>
                <label className="font-bold text-[#0F172A] block mb-1">Time Slot</label>
                <select
                  value={bookingTime}
                  onChange={(e) => setBookingTime(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#E2E8F0] rounded-xl outline-none focus:border-[#3157D5] text-[#0F172A]"
                >
                  <option value="10:00 AM PST">10:00 AM PST (Google Meet)</option>
                  <option value="11:30 AM PST">11:30 AM PST (Google Meet)</option>
                  <option value="2:00 PM PST">2:00 PM PST (Google Meet)</option>
                  <option value="4:30 PM PST">4:30 PM PST (Google Meet)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#E2E8F0]">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 text-xs font-bold text-[#64748B] hover:text-[#0F172A]"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateBooking}
                className="px-5 py-2 bg-[#3157D5] hover:bg-[#2646B8] text-white rounded-xl text-xs font-bold transition-colors"
              >
                Confirm & Sync
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
