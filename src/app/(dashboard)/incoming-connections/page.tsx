"use client";

import React, { useState } from "react";
import { useAppStore } from "@/lib/store";
import { PageHeader } from "@/components/page-header";
import { StatusPill } from "@/components/status-pill";
import { IncomingConnection } from "@/lib/types";
import {
  Radio,
  Plus,
  Server,
  Activity,
  Bot,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  ShieldCheck,
  Zap,
  X,
} from "lucide-react";

export default function IncomingConnectionsPage() {
  const { incomingConnections, agents, addToast } = useAppStore();

  const [showAddModal, setShowAddModal] = useState(false);
  const [trunkName, setTrunkName] = useState("");
  const [provider, setProvider] = useState<IncomingConnection["provider"]>("Twilio BYOC");
  const [sipUri, setSipUri] = useState("");

  const handleAddConnection = () => {
    if (!trunkName.trim() || !sipUri.trim()) return;
    addToast({
      title: "SIP Endpoint Registered",
      description: `Connected ${trunkName} with 18ms ping latency.`,
      type: "success",
    });
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="SIP Trunks & Telephony Gateways"
        description="Bring Your Own Carrier (BYOC) SIP trunks, WebRTC voice gateways, and PBX telephony interconnects."
        actions={
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#3157D5] hover:bg-[#2646B8] text-white text-xs font-semibold rounded-xl shadow-xs transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Connect SIP Trunk</span>
          </button>
        }
      />

      {/* Grid of Connections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {incomingConnections.map((conn) => (
          <div
            key={conn.id}
            className="p-5 bg-white rounded-2xl border border-[#E5EAF2] card-shadow flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#EEF2FD] text-[#3157D5] flex items-center justify-center shrink-0">
                    <Server className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#172033]">{conn.name}</h3>
                    <span className="text-[10px] font-semibold text-[#3157D5] bg-[#EEF2FD] px-2 py-0.5 rounded-md">
                      {conn.provider}
                    </span>
                  </div>
                </div>

                <StatusPill status={conn.status as any} size="sm" />
              </div>

              {/* SIP URI */}
              <div className="p-3 bg-[#F4F7FB] rounded-xl border border-[#E5EAF2] space-y-2 text-xs">
                <div>
                  <span className="text-[#78849A] text-[10px] block uppercase font-semibold">SIP Gateway Endpoint:</span>
                  <span className="font-mono text-[#172033] font-bold text-xs">{conn.sipUri}</span>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-[#E5EAF2]">
                  <span className="text-[#78849A]">Routed Agent:</span>
                  <span className="font-semibold text-[#172033]">{conn.routedAgentName || "Dynamic Header Route"}</span>
                </div>
              </div>

              {/* Channels Meter */}
              <div className="space-y-1.5 mt-3">
                <div className="flex justify-between text-xs">
                  <span className="text-[#78849A]">Active Channels</span>
                  <span className="font-bold text-[#172033]">
                    {conn.activeChannels} / {conn.maxChannels} Ports
                  </span>
                </div>
                <div className="w-full bg-[#E5EAF2] h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#16A36A] h-full rounded-full"
                    style={{ width: `${(conn.activeChannels / (conn.maxChannels || 1)) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Footer Telemetry */}
            <div className="pt-3 border-t border-[#EDF2F7] flex items-center justify-between text-xs text-[#78849A]">
              <span className="flex items-center gap-1 text-[#16A36A] font-semibold font-mono">
                <Zap className="w-3.5 h-3.5" />
                {conn.latencyMs}ms Latency
              </span>
              <span>Checked {conn.lastPing}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Connection Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#101A33]/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-[#E5EAF2] max-w-md w-full p-6 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5EAF2]">
              <h3 className="text-base font-bold text-[#172033]">Connect BYOC SIP Gateway</h3>
              <button onClick={() => setShowAddModal(false)} className="text-[#78849A] hover:text-[#172033]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#172033] mb-1">Carrier / Provider</label>
                <select
                  value={provider}
                  onChange={(e) => setProvider(e.target.value as any)}
                  className="w-full px-3 py-2 bg-[#F4F7FB] border border-[#E5EAF2] rounded-xl text-xs outline-none focus:border-[#3157D5]"
                >
                  <option value="Twilio BYOC">Twilio BYOC</option>
                  <option value="Telnyx SIP">Telnyx SIP Elastic</option>
                  <option value="Vonage SIP">Vonage SIP Trunking</option>
                  <option value="WebRTC Endpoint">Custom WebRTC Ingest</option>
                  <option value="Asterisk PBX">Asterisk / FreePBX Server</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172033] mb-1">Connection Identifier Name</label>
                <input
                  type="text"
                  placeholder="e.g. EU-Central Telnyx Primary"
                  value={trunkName}
                  onChange={(e) => setTrunkName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F4F7FB] border border-[#E5EAF2] rounded-xl text-xs outline-none focus:border-[#3157D5]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172033] mb-1">SIP URI / Ingest Domain</label>
                <input
                  type="text"
                  placeholder="sip:gateway.carrier.com:5060"
                  value={sipUri}
                  onChange={(e) => setSipUri(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F4F7FB] border border-[#E5EAF2] rounded-xl text-xs font-mono outline-none focus:border-[#3157D5]"
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
                onClick={handleAddConnection}
                className="px-4 py-2 bg-[#3157D5] hover:bg-[#2646B8] text-white text-xs font-semibold rounded-xl shadow-xs"
              >
                Validate & Connect
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
