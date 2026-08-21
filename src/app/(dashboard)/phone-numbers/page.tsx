"use client";

import React, { useState } from "react";
import { useAppStore } from "@/lib/store";
import { PageHeader } from "@/components/page-header";
import { StatusPill } from "@/components/status-pill";
import { PhoneNumber } from "@/lib/types";
import {
  Phone,
  Plus,
  Search,
  Bot,
  Megaphone,
  CheckCircle2,
  MessageSquare,
  Globe,
  Sliders,
  DollarSign,
  X,
} from "lucide-react";

export default function PhoneNumbersPage() {
  const { phoneNumbers, agents, campaigns, addToast } = useAppStore();

  const [showBuyModal, setShowBuyModal] = useState(false);
  const [selectedAreaCode, setSelectedAreaCode] = useState("415");
  const [selectedNumberType, setSelectedNumberType] = useState<"toll_free" | "local">("local");

  const handleBuyNumber = (num: string) => {
    setShowBuyModal(false);
    addToast({
      title: "Number Provisioned",
      description: `Allocated ${num} to workspace. Carrier configured.`,
      type: "success",
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Telephony & Phone Numbers"
        description="Provision local and toll-free numbers with carrier routing, SIP trunk bindings, and outbound caller ID registration."
        actions={
          <button
            onClick={() => setShowBuyModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#3157D5] hover:bg-[#2646B8] text-white text-xs font-semibold rounded-xl shadow-xs transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Provision New Number</span>
          </button>
        }
      />

      {/* Grid of Numbers */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {phoneNumbers.map((pn) => (
          <div
            key={pn.id}
            className="p-5 bg-white rounded-2xl border border-[#E5EAF2] card-shadow flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <h3 className="text-base font-bold font-mono text-[#172033]">{pn.formattedNumber}</h3>
                  <p className="text-xs text-[#78849A] mt-0.5">{pn.friendlyName}</p>
                </div>
                <StatusPill status={pn.status as any} size="sm" />
              </div>

              {/* Routing detail */}
              <div className="p-3 bg-[#F4F7FB] rounded-xl border border-[#E5EAF2] space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[#78849A] flex items-center gap-1.5">
                    <Bot className="w-3.5 h-3.5 text-[#3157D5]" /> Assigned Agent:
                  </span>
                  <span className="font-semibold text-[#172033] truncate max-w-[130px]">
                    {pn.assignedAgentName || "Unassigned"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[#78849A] flex items-center gap-1.5">
                    <Megaphone className="w-3.5 h-3.5 text-[#16A36A]" /> Campaign:
                  </span>
                  <span className="font-medium text-[#172033] truncate max-w-[130px]">
                    {pn.assignedCampaignName || "Direct Inbound"}
                  </span>
                </div>
              </div>

              {/* Capabilities */}
              <div className="flex items-center gap-2 mt-3 text-xs">
                <span className="flex items-center gap-1 px-2 py-0.5 bg-[#E8F7F0] text-[#16A36A] rounded-md font-medium text-[10px]">
                  <CheckCircle2 className="w-3 h-3" /> Voice In/Out
                </span>
                {pn.capabilities.sms && (
                  <span className="flex items-center gap-1 px-2 py-0.5 bg-[#EEF2FD] text-[#3157D5] rounded-md font-medium text-[10px]">
                    <MessageSquare className="w-3 h-3" /> SMS Enabled
                  </span>
                )}
              </div>
            </div>

            {/* Cost & Action Footer */}
            <div className="pt-3 border-t border-[#EDF2F7] flex items-center justify-between text-xs">
              <span className="text-[#78849A]">${pn.monthlyCost.toFixed(2)} / month</span>
              <button
                onClick={() => {
                  addToast({ title: "Routing Settings", description: "Opened inbound routing configuration.", type: "info" });
                }}
                className="text-xs font-semibold text-[#3157D5] hover:underline"
              >
                Configure Routing
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Buy Number Modal */}
      {showBuyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#101A33]/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-[#E5EAF2] max-w-md w-full p-6 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5EAF2]">
              <h3 className="text-base font-bold text-[#172033]">Provision Carrier Phone Number</h3>
              <button onClick={() => setShowBuyModal(false)} className="text-[#78849A] hover:text-[#172033]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedNumberType("local")}
                  className={`p-2.5 rounded-xl border text-xs font-semibold ${
                    selectedNumberType === "local" ? "bg-[#EEF2FD] border-[#3157D5] text-[#3157D5]" : "bg-[#F4F7FB] text-[#78849A]"
                  }`}
                >
                  Local Area Code
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedNumberType("toll_free")}
                  className={`p-2.5 rounded-xl border text-xs font-semibold ${
                    selectedNumberType === "toll_free" ? "bg-[#EEF2FD] border-[#3157D5] text-[#3157D5]" : "bg-[#F4F7FB] text-[#78849A]"
                  }`}
                >
                  Toll-Free (800 / 888)
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172033] mb-1">Target Area Code</label>
                <input
                  type="text"
                  value={selectedAreaCode}
                  onChange={(e) => setSelectedAreaCode(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F4F7FB] border border-[#E5EAF2] rounded-xl text-xs outline-none focus:border-[#3157D5]"
                />
              </div>

              {/* Available numbers */}
              <div className="space-y-2 pt-2">
                <label className="block text-xs font-semibold text-[#172033]">Available Instant Pool:</label>
                {[
                  "+1 (415) 890-4491 ($2.00/mo)",
                  "+1 (415) 672-1082 ($2.00/mo)",
                  "+1 (800) 412-9901 ($4.50/mo)",
                ].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => handleBuyNumber(num.split(" ")[0])}
                    className="w-full p-2.5 bg-[#F4F7FB] hover:bg-[#EEF2FD] border border-[#E5EAF2] hover:border-[#3157D5] rounded-xl text-xs font-mono font-bold text-[#172033] flex items-center justify-between transition-colors"
                  >
                    <span>{num}</span>
                    <span className="text-xs font-sans text-[#3157D5] font-semibold">Provision &gt;</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end pt-3 border-t border-[#E5EAF2]">
              <button
                onClick={() => setShowBuyModal(false)}
                className="px-3 py-2 text-xs font-semibold text-[#78849A] hover:text-[#172033]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
