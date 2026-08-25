"use client";

import React, { useState } from "react";
import { useAppStore } from "@/lib/store";
import { PageHeader } from "@/components/page-header";
import { FlowNode, FlowNodeType } from "@/lib/types";
import {
  Workflow,
  Plus,
  Play,
  Save,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Bot,
  HelpCircle,
  FileText,
  BookOpen,
  GitBranch,
  Calendar,
  PhoneForwarded,
  MessageSquare,
  Webhook,
  PhoneOff,
  Sliders,
  Trash2,
  Sparkles,
  CheckCircle2,
  X,
  Volume2,
} from "lucide-react";

export default function FlowBuilderPage() {
  const {
    flowNodes,
    setFlowNodes,
    flowEdges,
    selectedNodeId,
    setSelectedNodeId,
    addToast,
  } = useAppStore();

  const [zoomLevel, setZoomLevel] = useState(1);
  const [showTestFlowDrawer, setShowTestFlowDrawer] = useState(false);
  const [testStepIndex, setTestStepIndex] = useState(0);

  const selectedNode = flowNodes.find((n) => n.id === selectedNodeId) || flowNodes[0];

  const nodeLibrary: { type: FlowNodeType; label: string; icon: React.ElementType; color: string; desc: string }[] = [
    { type: "greeting", label: "Greeting", icon: Bot, color: "#3157D5", desc: "Plays initial greeting & brand intro" },
    { type: "question", label: "Ask Question", icon: HelpCircle, color: "#6366F1", desc: "Listens for user intent & response" },
    { type: "collect_info", label: "Collect Info", icon: FileText, color: "#0D9488", desc: "Extracts email, phone, or parameters" },
    { type: "knowledge_lookup", label: "KB Lookup", icon: BookOpen, color: "#8B5CF6", desc: "Queries vector document database" },
    { type: "condition", label: "Condition / Branch", icon: GitBranch, color: "#D99025", desc: "Evaluates variables and branches" },
    { type: "appointment", label: "Book Appointment", icon: Calendar, color: "#16A36A", desc: "Integrates with Google/Outlook calendar" },
    { type: "transfer", label: "Transfer Call", icon: PhoneForwarded, color: "#EC4899", desc: "Warm transfers to live representative" },
    { type: "send_sms", label: "Send SMS", icon: MessageSquare, color: "#14B8A6", desc: "Dispatches SMS follow-up message" },
    { type: "webhook", label: "Webhook / API", icon: Webhook, color: "#F59E0B", desc: "Invokes custom backend endpoint" },
    { type: "end_call", label: "End Call", icon: PhoneOff, color: "#D95C68", desc: "Plays goodbye & hangs up gracefully" },
  ];

  const handleAddNode = (type: FlowNodeType) => {
    const libItem = nodeLibrary.find((l) => l.type === type);
    const newNode: FlowNode = {
      id: `node-${Date.now()}`,
      type,
      title: `${flowNodes.length + 1}. ${libItem?.label || "Step"}`,
      description: libItem?.desc || "Custom flow node",
      position: { x: (flowNodes.length % 4) * 320 + 80, y: Math.floor(flowNodes.length / 4) * 220 + 100 },
      data: {
        prompt: `Sample instructions for ${libItem?.label}...`,
      },
    };
    setFlowNodes((prev) => [...prev, newNode]);
    setSelectedNodeId(newNode.id);
    addToast({ title: "Node Added", description: `Added ${newNode.title} to canvas.`, type: "success" });
  };

  const handleUpdateSelectedPrompt = (prompt: string) => {
    if (!selectedNode) return;
    setFlowNodes((prev) =>
      prev.map((n) => (n.id === selectedNode.id ? { ...n, data: { ...n.data, prompt } } : n))
    );
  };

  const handleUpdateSelectedTitle = (title: string) => {
    if (!selectedNode) return;
    setFlowNodes((prev) =>
      prev.map((n) => (n.id === selectedNode.id ? { ...n, title } : n))
    );
  };

  const handleDeleteNode = (id: string) => {
    setFlowNodes((prev) => prev.filter((n) => n.id !== id));
    if (selectedNodeId === id) setSelectedNodeId(null);
    addToast({ title: "Node Removed", description: "Node deleted from conversation tree.", type: "info" });
  };

  const handleSaveFlow = () => {
    addToast({
      title: "Flow Published",
      description: "Conversation tree compiled and synced with active agent runtime.",
      type: "success",
    });
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-[#172033] tracking-tight">
            Visual Conversation Flow Builder
          </h1>
          <p className="text-xs text-[#78849A] mt-0.5">
            Design branching voice dialogues, automated appointments, function triggers, and fallback policies.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setTestStepIndex(0);
              setShowTestFlowDrawer(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#EEF2FD] text-[#3157D5] hover:bg-[#E0E7FB] text-xs font-semibold rounded-xl transition-all"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Test Flow Simulator</span>
          </button>
          <button
            onClick={handleSaveFlow}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#3157D5] hover:bg-[#2646B8] text-white text-xs font-semibold rounded-xl shadow-xs transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save & Deploy Flow</span>
          </button>
        </div>
      </div>

      {/* Main Canvas Workspace Container */}
      <div className="relative h-[680px] bg-[#F4F7FB] rounded-2xl border border-[#E5EAF2] card-shadow overflow-hidden flex">
        {/* Left Node Library Palette */}
        <div className="w-64 bg-white border-r border-[#E5EAF2] flex flex-col z-10 shrink-0">
          <div className="p-3.5 border-b border-[#E5EAF2] bg-[#F4F7FB]/50">
            <h3 className="text-xs font-bold text-[#172033] uppercase tracking-wider">Node Palette</h3>
            <p className="text-[10px] text-[#78849A]">Click to add step to canvas</p>
          </div>

          <div className="p-3 overflow-y-auto space-y-2 flex-1 scrollbar-thin">
            {nodeLibrary.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.type}
                  onClick={() => handleAddNode(item.type)}
                  className="w-full p-2.5 bg-[#F4F7FB] hover:bg-[#EEF2FD] border border-[#E5EAF2] hover:border-[#3157D5]/30 rounded-xl text-left transition-all flex items-start gap-2.5 group"
                >
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-white shrink-0 mt-0.5"
                    style={{ backgroundColor: item.color }}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-[#172033] group-hover:text-[#3157D5] transition-colors">{item.label}</p>
                    <p className="text-[10px] text-[#78849A] leading-tight line-clamp-1">{item.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Center Interactive Graph Canvas */}
        <div className="flex-1 relative overflow-hidden bg-[radial-gradient(#E5EAF2_1px,transparent_1px)] [background-size:16px_16px]">
          {/* Zoom Controls */}
          <div className="absolute top-4 right-4 z-20 flex items-center gap-1 bg-white p-1 rounded-xl border border-[#E5EAF2] shadow-sm">
            <button
              onClick={() => setZoomLevel((prev) => Math.min(1.5, prev + 0.1))}
              className="p-1.5 text-[#78849A] hover:text-[#172033] rounded-lg hover:bg-[#F4F7FB]"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <span className="text-[11px] font-mono font-semibold text-[#172033] px-1.5">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={() => setZoomLevel((prev) => Math.max(0.6, prev - 0.1))}
              className="p-1.5 text-[#78849A] hover:text-[#172033] rounded-lg hover:bg-[#F4F7FB]"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoomLevel(1)}
              className="p-1.5 text-[#78849A] hover:text-[#172033] rounded-lg hover:bg-[#F4F7FB]"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>

          {/* Canvas Nodes Viewport */}
          <div
            className="w-full h-full p-8 relative overflow-auto cursor-grab active:cursor-grabbing"
            style={{ transform: `scale(${zoomLevel})`, transformOrigin: "top left" }}
          >
            {/* SVG Connecting Edges */}
            <svg className="absolute inset-0 w-[2400px] h-[1800px] pointer-events-none z-0">
              {flowEdges.map((edge) => {
                const srcNode = flowNodes.find((n) => n.id === edge.source);
                const tgtNode = flowNodes.find((n) => n.id === edge.target);
                if (!srcNode || !tgtNode) return null;

                const startX = srcNode.position.x + 240;
                const startY = srcNode.position.y + 60;
                const endX = tgtNode.position.x;
                const endY = tgtNode.position.y + 60;

                const dx = (endX - startX) / 2;

                return (
                  <g key={edge.id}>
                    <path
                      d={`M ${startX} ${startY} C ${startX + dx} ${startY}, ${endX - dx} ${endY}, ${endX} ${endY}`}
                      fill="none"
                      stroke="#3157D5"
                      strokeWidth="2"
                      strokeDasharray="4 2"
                      className="opacity-70"
                    />
                    <circle cx={endX} cy={endY} r="4" fill="#3157D5" />
                  </g>
                );
              })}
            </svg>

            {/* Render Nodes */}
            <div className="relative z-10 w-[2400px] h-[1800px]">
              {flowNodes.map((node) => {
                const isSelected = selectedNodeId === node.id;
                const libInfo = nodeLibrary.find((l) => l.type === node.type);
                const Icon = libInfo?.icon || Bot;

                return (
                  <div
                    key={node.id}
                    onClick={() => setSelectedNodeId(node.id)}
                    style={{ left: `${node.position.x}px`, top: `${node.position.y}px` }}
                    className={`absolute w-64 bg-white rounded-2xl border p-4 shadow-md transition-all cursor-pointer ${
                      isSelected
                        ? "border-[#3157D5] ring-4 ring-[#3157D5]/15 shadow-xl"
                        : "border-[#E5EAF2] hover:border-[#3157D5]/40"
                    }`}
                  >
                    {/* Node Header */}
                    <div className="flex items-center justify-between mb-2 pb-2 border-b border-[#EDF2F7]">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-6 h-6 rounded-lg flex items-center justify-center text-white text-xs"
                          style={{ backgroundColor: libInfo?.color || "#3157D5" }}
                        >
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-xs font-bold text-[#172033] truncate max-w-[130px]">
                          {node.title}
                        </span>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteNode(node.id);
                        }}
                        className="text-[#78849A] hover:text-[#D95C68] p-1 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Node Body */}
                    <p className="text-[11px] text-[#78849A] line-clamp-2 leading-relaxed bg-[#F4F7FB] p-2 rounded-lg border border-[#E5EAF2]/60">
                      {node.data?.prompt || node.description}
                    </p>

                    {/* Node Handles */}
                    <div className="flex justify-between items-center mt-2.5 pt-1.5 text-[9px] font-bold text-[#78849A] uppercase tracking-wider">
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-[#16A36A]" /> In
                      </span>
                      <span className="flex items-center gap-1">
                        Out <span className="w-2 h-2 rounded-full bg-[#3157D5]" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Node Inspector Drawer */}
        {selectedNode && (
          <div className="w-80 bg-white border-l border-[#E5EAF2] flex flex-col z-10 shrink-0">
            <div className="p-4 border-b border-[#E5EAF2] bg-[#F4F7FB]/50 flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-[#172033] uppercase tracking-wider">Node Inspector</h3>
                <p className="text-[10px] text-[#78849A]">Configure selected dialog step</p>
              </div>
              <button onClick={() => setSelectedNodeId(null)} className="text-[#78849A] hover:text-[#172033]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-4 flex-1 scrollbar-thin text-xs">
              <div>
                <label className="block font-semibold text-[#172033] mb-1">Step Title</label>
                <input
                  type="text"
                  value={selectedNode.title}
                  onChange={(e) => handleUpdateSelectedTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F4F7FB] border border-[#E5EAF2] rounded-xl outline-none focus:border-[#3157D5]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#172033] mb-1">Prompt / Speech Script</label>
                <textarea
                  rows={4}
                  value={selectedNode.data?.prompt || ""}
                  onChange={(e) => handleUpdateSelectedPrompt(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F4F7FB] border border-[#E5EAF2] rounded-xl outline-none focus:border-[#3157D5] leading-relaxed"
                />
              </div>

              {selectedNode.type === "condition" && (
                <div className="p-3 bg-[#F4F7FB] rounded-xl border border-[#E5EAF2] space-y-2">
                  <span className="font-bold text-[#172033] block">Branching Rules:</span>
                  <div className="space-y-1 text-[11px]">
                    <div className="p-2 bg-white rounded-lg border border-[#E5EAF2]">
                      <span className="font-semibold text-[#3157D5]">Branch A:</span> volume &gt;= 20,000 mins
                    </div>
                    <div className="p-2 bg-white rounded-lg border border-[#E5EAF2]">
                      <span className="font-semibold text-[#3157D5]">Branch B:</span> volume &lt; 20,000 mins
                    </div>
                  </div>
                </div>
              )}

              {selectedNode.type === "appointment" && (
                <div className="p-3 bg-[#EEF2FD] rounded-xl border border-[#3157D5]/20 text-[11px] text-[#3157D5]">
                  <p className="font-bold">Google & Outlook Calendar API</p>
                  <p className="text-[10px] text-[#78849A]">Syncs availability dynamically during call.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Test Flow Modal / Drawer */}
      {showTestFlowDrawer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#101A33]/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-[#E5EAF2] max-w-lg w-full p-6 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5EAF2]">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#3157D5]" />
                <h3 className="text-base font-bold text-[#172033]">Flow Execution Simulator</h3>
              </div>
              <button onClick={() => setShowTestFlowDrawer(false)} className="text-[#78849A] hover:text-[#172033]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 bg-[#F4F7FB] rounded-xl border border-[#E5EAF2] space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#3157D5]">
                  Step {testStepIndex + 1} of {flowNodes.length}: {flowNodes[testStepIndex]?.title}
                </span>
                <span className="text-[10px] font-bold text-[#16A36A] bg-[#E8F7F0] px-2 py-0.5 rounded-full">
                  Synthesizing
                </span>
              </div>
              <p className="text-xs text-[#172033] italic leading-relaxed bg-white p-3 rounded-lg border border-[#E5EAF2]">
                &quot;{flowNodes[testStepIndex]?.data?.prompt || flowNodes[testStepIndex]?.description}&quot;
              </p>
              <div className="flex items-center gap-2 text-[11px] text-[#78849A]">
                <Volume2 className="w-3.5 h-3.5 text-[#3157D5]" />
                <span>Simulated audio waveform rendering</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                disabled={testStepIndex === 0}
                onClick={() => setTestStepIndex((prev) => Math.max(0, prev - 1))}
                className="px-3 py-1.5 text-xs font-semibold text-[#78849A] hover:text-[#172033] disabled:opacity-40"
              >
                Previous Step
              </button>

              <button
                type="button"
                onClick={() => {
                  if (testStepIndex < flowNodes.length - 1) {
                    setTestStepIndex((prev) => prev + 1);
                  } else {
                    addToast({ title: "Flow Test Complete", description: "All conversational steps succeeded.", type: "success" });
                    setShowTestFlowDrawer(false);
                  }
                }}
                className="px-4 py-2 bg-[#3157D5] hover:bg-[#2646B8] text-white text-xs font-semibold rounded-xl shadow-xs"
              >
                {testStepIndex < flowNodes.length - 1 ? "Next Speech Turn &gt;" : "Finish Test"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
