"use client";

import React, { useState } from "react";
import { useAppStore } from "@/lib/store";
import { PageHeader } from "@/components/page-header";
import { StatusPill } from "@/components/status-pill";
import { KnowledgeSource, KnowledgeSourceType } from "@/lib/types";
import {
  BookOpen,
  Plus,
  Search,
  UploadCloud,
  Globe,
  FileText,
  HelpCircle,
  Sparkles,
  CheckCircle2,
  Trash2,
  ExternalLink,
  Bot,
  RefreshCw,
  X,
  FileSpreadsheet,
} from "lucide-react";

export default function KnowledgeBasePage() {
  const { knowledgeSources, addKnowledgeSource, addToast } = useAppStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [testQuery, setTestQuery] = useState("What is your SLA and SOC2 compliance policy?");
  const [testResults, setTestResults] = useState<{ sourceName: string; text: string; score: number }[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);

  // Add source form state
  const [sourceName, setSourceName] = useState("");
  const [sourceType, setSourceType] = useState<KnowledgeSourceType>("document");
  const [rawText, setRawText] = useState("");
  const [urlInput, setUrlInput] = useState("");

  const filteredSources = knowledgeSources.filter((kb) =>
    kb.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    kb.contentPreview.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTestSearch = () => {
    if (!testQuery.trim()) return;

    // Simulate semantic vector lookup
    const results = [
      {
        sourceName: "Apex Enterprise Architecture & Security FAQ 2026.pdf",
        text: "SOC2 Type II compliance: Apex Voice Systems undergoes annual third-party audits. All audio frames are processed in-memory with zero persistent audio storage unless HIPAA encrypted recording is explicitly enabled.",
        score: 0.96,
      },
      {
        sourceName: "Apex Enterprise Architecture & Security FAQ 2026.pdf",
        text: "Latency benchmarks: Edge speech recognition (Deepgram Nova-2) + LLM streaming (Claude 3.5 / GPT-4o) + Voice synthesis achieves 280ms average global round-trip latency.",
        score: 0.91,
      },
      {
        sourceName: "Apex Pricing, Tier Matrix & Volume Discounts.xlsx",
        text: "Enterprise volume discount: Accounts processing above 50,000 minutes per month qualify for Tier 3 pricing at $0.08 per minute.",
        score: 0.85,
      },
    ];

    setTestResults(results);
    addToast({ title: "Semantic Query Complete", description: "Found 3 vector matches.", type: "success" });
  };

  const handleCreateSource = () => {
    if (!sourceName.trim()) return;

    const newSource: KnowledgeSource = {
      id: `kb-${Date.now()}`,
      name: sourceName.trim(),
      type: sourceType,
      status: "indexed",
      chunkCount: Math.floor(Math.random() * 80) + 20,
      sizeKb: Math.floor(Math.random() * 1200) + 150,
      lastIndexed: new Date().toISOString(),
      assignedAgentIds: ["agent-1"],
      url: sourceType === "url" ? urlInput : undefined,
      contentPreview: rawText || "Custom indexed enterprise document context for voice agents.",
      chunks: [
        {
          id: `chk-${Date.now()}`,
          text: rawText || "Synthesized vector embeddings for knowledge retrieval.",
          tokenCount: 45,
          similarityScore: 0.95,
        },
      ],
    };

    addKnowledgeSource(newSource);
    setShowAddModal(false);
    setSourceName("");
    setRawText("");
    setUrlInput("");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Knowledge Base & Grounding"
        description="Index documents, websites, and FAQs into vector embeddings for real-time AI voice grounding."
        actions={
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#3157D5] hover:bg-[#2646B8] text-white text-xs font-semibold rounded-xl shadow-xs transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Knowledge Source</span>
          </button>
        }
      />

      {/* Main Grid: Left Sources, Right Test Search Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Sources List & Upload Dropzone */}
        <div className="lg:col-span-2 space-y-4">
          {/* Search bar */}
          <div className="p-4 bg-white rounded-2xl border border-[#E5EAF2] card-shadow flex items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#78849A] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search indexed knowledge files, URLs, or FAQs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 bg-[#F4F7FB] border border-[#E5EAF2] rounded-xl text-xs text-[#172033] placeholder-[#78849A] outline-none focus:border-[#3157D5]"
              />
            </div>
            <span className="text-xs text-[#78849A] font-semibold">{filteredSources.length} Sources</span>
          </div>

          {/* Sources Cards */}
          <div className="space-y-3">
            {filteredSources.map((kb) => (
              <div
                key={kb.id}
                className="p-4 bg-white rounded-2xl border border-[#E5EAF2] card-shadow hover:border-[#3157D5]/30 transition-all flex flex-col justify-between"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#EEF2FD] text-[#3157D5] flex items-center justify-center shrink-0">
                      {kb.type === "document" && <FileSpreadsheet className="w-5 h-5" />}
                      {kb.type === "url" && <Globe className="w-5 h-5" />}
                      {kb.type === "text" && <FileText className="w-5 h-5" />}
                      {kb.type === "faq" && <HelpCircle className="w-5 h-5" />}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#172033] leading-snug">{kb.name}</h3>
                      <p className="text-[11px] text-[#78849A]">
                        {kb.chunkCount} vector chunks • {kb.sizeKb} KB • Last indexed {new Date(kb.lastIndexed).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <StatusPill status={kb.status} size="sm" />
                </div>

                <p className="text-xs text-[#78849A] bg-[#F4F7FB] p-3 rounded-xl border border-[#E5EAF2] leading-relaxed mb-3 line-clamp-2">
                  {kb.contentPreview}
                </p>

                <div className="flex items-center justify-between text-xs text-[#78849A] pt-2 border-t border-[#EDF2F7]">
                  <span className="flex items-center gap-1.5 text-[11px]">
                    <Bot className="w-3.5 h-3.5 text-[#3157D5]" />
                    Assigned to {kb.assignedAgentIds.length} Voice Agents
                  </span>

                  <button
                    onClick={() => {
                      addToast({
                        title: "Re-indexing Triggered",
                        description: `Refreshing vector chunks for ${kb.name}`,
                        type: "info",
                      });
                    }}
                    className="text-xs text-[#3157D5] font-semibold hover:underline flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Sync Chunks</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Test Semantic Search Simulator */}
        <div className="space-y-4">
          <div className="p-5 bg-white rounded-2xl border border-[#E5EAF2] card-shadow space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#3157D5]" />
                <h3 className="text-xs font-bold text-[#172033] uppercase tracking-wider">
                  Test Semantic Search
                </h3>
              </div>
              <span className="text-[10px] font-bold text-[#16A36A] bg-[#E8F7F0] px-2 py-0.5 rounded-full">
                Vector DB
              </span>
            </div>

            <p className="text-xs text-[#78849A] leading-relaxed">
              Test how your voice agent retrieves and cites context when callers ask spontaneous questions.
            </p>

            <div className="space-y-2">
              <input
                type="text"
                value={testQuery}
                onChange={(e) => setTestQuery(e.target.value)}
                placeholder="Ask any question about your documents..."
                className="w-full px-3 py-2 bg-[#F4F7FB] border border-[#E5EAF2] rounded-xl text-xs text-[#172033] outline-none focus:border-[#3157D5]"
              />

              <button
                onClick={handleTestSearch}
                className="w-full py-2 bg-[#3157D5] hover:bg-[#2646B8] text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 shadow-xs transition-colors"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Search Vector DB</span>
              </button>
            </div>

            {/* Test Results Display */}
            {testResults.length > 0 && (
              <div className="space-y-3 pt-2 border-t border-[#EDF2F7]">
                <span className="text-[11px] font-bold text-[#172033] block">Top Semantic Matches:</span>
                {testResults.map((res, i) => (
                  <div key={i} className="p-3 bg-[#F4F7FB] rounded-xl border border-[#E5EAF2] text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#172033] truncate max-w-[170px]">{res.sourceName}</span>
                      <span className="text-[10px] font-bold text-[#16A36A] bg-[#E8F7F0] px-1.5 py-0.2 rounded">
                        {Math.round(res.score * 100)}% Match
                      </span>
                    </div>
                    <p className="text-[11px] text-[#78849A] leading-relaxed italic">{res.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Knowledge Source Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#101A33]/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-[#E5EAF2] max-w-lg w-full p-6 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5EAF2]">
              <h3 className="text-base font-bold text-[#172033]">Add Knowledge Source</h3>
              <button onClick={() => setShowAddModal(false)} className="text-[#78849A] hover:text-[#172033]">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Type selector */}
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: "document", label: "Upload PDF", icon: UploadCloud },
                { id: "url", label: "Web URL", icon: Globe },
                { id: "text", label: "Raw Text", icon: FileText },
                { id: "faq", label: "FAQ Pairs", icon: HelpCircle },
              ].map((t) => {
                const Icon = t.icon;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setSourceType(t.id as KnowledgeSourceType)}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      sourceType === t.id
                        ? "bg-[#EEF2FD] border-[#3157D5] text-[#3157D5] font-bold"
                        : "bg-[#F4F7FB] border-[#E5EAF2] text-[#78849A]"
                    }`}
                  >
                    <Icon className="w-4 h-4 mx-auto mb-1" />
                    <span className="text-[11px] block">{t.label}</span>
                  </button>
                );
              })}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#172033] mb-1.5">Source Name / Title</label>
              <input
                type="text"
                placeholder="e.g. Apex Product Return Guidelines 2026.pdf"
                value={sourceName}
                onChange={(e) => setSourceName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#F4F7FB] border border-[#E5EAF2] rounded-xl text-xs text-[#172033] outline-none focus:border-[#3157D5]"
              />
            </div>

            {sourceType === "url" ? (
              <div>
                <label className="block text-xs font-semibold text-[#172033] mb-1.5">Target Webpage URL</label>
                <input
                  type="url"
                  placeholder="https://company.com/docs/api-reference"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#F4F7FB] border border-[#E5EAF2] rounded-xl text-xs text-[#172033] outline-none focus:border-[#3157D5]"
                />
              </div>
            ) : (
              <div>
                <label className="block text-xs font-semibold text-[#172033] mb-1.5">Content / Policy Text</label>
                <textarea
                  rows={4}
                  placeholder="Paste text contents or document summary..."
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#F4F7FB] border border-[#E5EAF2] rounded-xl text-xs text-[#172033] outline-none focus:border-[#3157D5]"
                />
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E5EAF2]">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-3 py-2 text-xs font-semibold text-[#78849A] hover:text-[#172033]"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateSource}
                className="px-4 py-2 bg-[#3157D5] hover:bg-[#2646B8] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
              >
                Index & Attach
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
