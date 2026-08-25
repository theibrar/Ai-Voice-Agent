"use client";

import React, { useState } from "react";
import { useAppStore } from "@/lib/store";
import { PageHeader } from "@/components/page-header";
import { StatusPill } from "@/components/status-pill";
import { Contact } from "@/lib/types";
import {
  Users,
  Plus,
  Search,
  Phone,
  Mail,
  Building2,
  Tag,
  Download,
  Calendar,
  Clock,
  ArrowRight,
  X,
  FileText,
  CheckCircle2,
} from "lucide-react";

export default function ContactsPage() {
  const { contacts, addContact, updateContactNotes, addToast } = useAppStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Add Contact Form State
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [notes, setNotes] = useState("");

  const filteredContacts = contacts.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery) ||
      c.company.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ? true : c.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleCreateContact = () => {
    if (!name.trim() || !phone.trim()) return;
    const newCont: Contact = {
      id: `cont-${Date.now()}`,
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim() || `${name.toLowerCase().replace(/\s+/g, ".")}@example.com`,
      company: company.trim() || "Independent",
      leadScore: 75,
      status: "new",
      tags: ["New Lead"],
      notes: notes.trim() || "Lead added manually via dashboard.",
      createdAt: new Date().toISOString(),
    };

    addContact(newCont);
    setShowAddModal(false);
    setName("");
    setPhone("");
    setEmail("");
    setCompany("");
    setNotes("");
  };

  const handleExportCSV = () => {
    addToast({
      title: "Export Generated",
      description: `Downloaded ${filteredContacts.length} leads as CSV.`,
      type: "success",
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Contacts & Lead Database"
        description="Unified ledger of inbound callers, outbound prospects, lead scores, and call histories."
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-[#F4F7FB] border border-[#E5EAF2] text-[#172033] text-xs font-semibold rounded-xl transition-all"
            >
              <Download className="w-3.5 h-3.5 text-[#78849A]" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#3157D5] hover:bg-[#2646B8] text-white text-xs font-semibold rounded-xl shadow-xs transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Lead</span>
            </button>
          </div>
        }
      />

      {/* Filter and Search Bar */}
      <div className="p-4 bg-white rounded-2xl border border-[#E5EAF2] card-shadow flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#78849A] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search leads by name, email, phone, company..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 bg-[#F4F7FB] border border-[#E5EAF2] rounded-xl text-xs text-[#172033] placeholder-[#78849A] outline-none focus:border-[#3157D5]"
          />
        </div>

        <div className="flex items-center gap-1 bg-[#F4F7FB] p-1 rounded-xl border border-[#E5EAF2] overflow-x-auto">
          {["all", "new", "qualified", "appointment_set", "contacted", "do_not_call"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap capitalize ${
                statusFilter === st
                  ? "bg-white text-[#3157D5] shadow-2xs"
                  : "text-[#78849A] hover:text-[#172033]"
              }`}
            >
              {st.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Contacts Table */}
      <div className="bg-white rounded-2xl border border-[#E5EAF2] card-shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F4F7FB] text-[#78849A] uppercase tracking-wider font-semibold border-b border-[#E5EAF2]">
              <tr>
                <th className="p-4">Contact</th>
                <th className="p-4">Phone & Email</th>
                <th className="p-4">Lead Score</th>
                <th className="p-4">Status</th>
                <th className="p-4">Campaign</th>
                <th className="p-4">Last Call Outcome</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5EAF2]">
              {filteredContacts.length > 0 ? (
                filteredContacts.map((contact) => (
                  <tr
                    key={contact.id}
                    onClick={() => setSelectedContact(contact)}
                    className="hover:bg-[#F4F7FB]/60 transition-colors cursor-pointer"
                  >
                    <td className="p-4 font-bold text-[#172033]">
                      <span>{contact.name}</span>
                      <p className="text-[10px] text-[#78849A] font-normal">{contact.company}</p>
                    </td>
                    <td className="p-4 font-mono text-[#172033]">
                      <div>{contact.phone}</div>
                      <p className="text-[10px] text-[#78849A] font-sans">{contact.email}</p>
                    </td>
                    <td className="p-4">
                      <span className="font-bold text-[#3157D5] bg-[#EEF2FD] px-2.5 py-0.5 rounded-full">
                        Score {contact.leadScore}
                      </span>
                    </td>
                    <td className="p-4">
                      <StatusPill status={contact.status as any} size="sm" />
                    </td>
                    <td className="p-4 text-[#78849A] truncate max-w-[140px]">
                      {contact.campaignName || "Inbound Direct"}
                    </td>
                    <td className="p-4 text-[#78849A]">
                      {contact.lastCallOutcome || "Not Called Yet"}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedContact(contact);
                        }}
                        className="px-2.5 py-1 text-xs font-semibold bg-[#EEF2FD] text-[#3157D5] rounded-lg hover:bg-[#E0E7FB]"
                      >
                        View Dossier
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-[#64748B] text-xs">
                    No contacts or leads recorded in database yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slide-over Drawer for Selected Contact Details */}
      {selectedContact && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            className="fixed inset-0 bg-[#101A33]/50 backdrop-blur-2xs"
            onClick={() => setSelectedContact(null)}
          />
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-white shadow-2xl border-l border-[#E5EAF2] flex flex-col animate-in slide-in-from-right duration-200">
              {/* Drawer Header */}
              <div className="p-6 border-b border-[#E5EAF2] bg-[#F4F7FB]/60 flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-[#172033]">{selectedContact.name}</h2>
                    <StatusPill status={selectedContact.status as any} size="sm" />
                  </div>
                  <p className="text-xs text-[#78849A] mt-0.5">{selectedContact.company}</p>
                </div>
                <button
                  onClick={() => setSelectedContact(null)}
                  className="p-1.5 text-[#78849A] hover:text-[#172033]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Drawer Body */}
              <div className="p-6 overflow-y-auto flex-1 space-y-5 text-xs">
                {/* Meta details */}
                <div className="space-y-2.5 p-4 bg-[#F4F7FB] rounded-xl border border-[#E5EAF2]">
                  <div className="flex justify-between">
                    <span className="text-[#78849A]">Phone</span>
                    <span className="font-mono font-semibold text-[#172033]">{selectedContact.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#78849A]">Email</span>
                    <span className="font-semibold text-[#172033]">{selectedContact.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#78849A]">Lead Score</span>
                    <span className="font-bold text-[#3157D5]">Score {selectedContact.leadScore} / 100</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#78849A]">Campaign</span>
                    <span className="font-medium text-[#172033]">{selectedContact.campaignName || "Direct"}</span>
                  </div>
                </div>

                {/* Notes Editor */}
                <div>
                  <label className="block font-semibold text-[#172033] mb-1.5">Agent & CRM Call Notes</label>
                  <textarea
                    rows={4}
                    defaultValue={selectedContact.notes}
                    onBlur={(e) => updateContactNotes(selectedContact.id, e.target.value)}
                    className="w-full p-3 bg-[#F4F7FB] border border-[#E5EAF2] rounded-xl text-xs text-[#172033] outline-none focus:border-[#3157D5] leading-relaxed"
                  />
                  <span className="text-[10px] text-[#78849A] mt-1 block">Changes auto-save when clicking outside.</span>
                </div>

                {/* Tags */}
                <div>
                  <label className="block font-semibold text-[#172033] mb-1.5">Lead Tags</label>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {selectedContact.tags.map((t) => (
                      <span key={t} className="px-2 py-0.5 bg-[#EEF2FD] text-[#3157D5] rounded-md font-semibold text-[10px]">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Lead Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#101A33]/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-[#E5EAF2] max-w-md w-full p-6 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5EAF2]">
              <h3 className="text-base font-bold text-[#172033]">Add Lead to Database</h3>
              <button onClick={() => setShowAddModal(false)} className="text-[#78849A] hover:text-[#172033]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#172033] mb-1">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Rachel Adams"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F4F7FB] border border-[#E5EAF2] rounded-xl text-xs outline-none focus:border-[#3157D5]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172033] mb-1">Phone Number</label>
                <input
                  type="text"
                  placeholder="+1 (555) 000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F4F7FB] border border-[#E5EAF2] rounded-xl text-xs outline-none focus:border-[#3157D5]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172033] mb-1">Company</label>
                <input
                  type="text"
                  placeholder="e.g. Apex Global"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F4F7FB] border border-[#E5EAF2] rounded-xl text-xs outline-none focus:border-[#3157D5]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E5EAF2]">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-3 py-2 text-xs font-semibold text-[#78849A] hover:text-[#172033]"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateContact}
                className="px-4 py-2 bg-[#3157D5] hover:bg-[#2646B8] text-white text-xs font-semibold rounded-xl shadow-xs"
              >
                Save Contact
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
