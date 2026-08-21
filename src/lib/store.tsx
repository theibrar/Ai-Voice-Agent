"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  Agent,
  Campaign,
  Call,
  Contact,
  Appointment,
  KnowledgeSource,
  PhoneNumber,
  IncomingConnection,
  Template,
  FlowNode,
  FlowEdge,
  TranscriptMessage,
  ABTestExperiment,
  ConversationFunnelStep,
} from "./types";
import { initialAgents } from "./mock-data/agents";
import { initialCampaigns } from "./mock-data/campaigns";
import { initialCalls } from "./mock-data/calls";
import { initialContacts } from "./mock-data/contacts";
import { initialAppointments } from "./mock-data/appointments";
import { initialKnowledgeSources } from "./mock-data/knowledge-base";
import { initialPhoneNumbers } from "./mock-data/phone-numbers";
import { initialIncomingConnections } from "./mock-data/incoming-connections";
import { initialTemplates } from "./mock-data/templates";
import { initialFlowNodes, initialFlowEdges } from "./mock-data/flow-nodes";
import { initialABExperiments } from "./mock-data/ab-tests";
import { initialFunnelSteps } from "./mock-data/funnel-analytics";

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type: "success" | "warning" | "error" | "info";
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: "call" | "appointment" | "credit" | "system";
  link?: string;
}

export interface Workspace {
  id: string;
  name: string;
  plan: "Enterprise" | "Scale" | "Growth";
  credits: number;
  activeCalls: number;
}

interface AppContextType {
  // Theme & Appearance
  theme: "light" | "dark";
  toggleTheme: () => void;

  // Notifications
  notifications: AppNotification[];
  unreadNotificationCount: number;
  markAllNotificationsAsRead: () => void;
  clearNotifications: () => void;

  // Workspaces
  workspaces: Workspace[];
  activeWorkspace: Workspace;
  setActiveWorkspace: (ws: Workspace) => void;

  // Sidebar & Layout
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean | ((prev: boolean) => boolean)) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;

  // Search Palette
  commandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;

  // Domain Entities
  agents: Agent[];
  setAgents: React.Dispatch<React.SetStateAction<Agent[]>>;
  updateAgent: (agent: Agent) => void;
  toggleAgentStatus: (agentId: string) => void;
  addAgent: (agent: Agent) => void;
  duplicateAgent: (agentId: string) => void;

  campaigns: Campaign[];
  setCampaigns: React.Dispatch<React.SetStateAction<Campaign[]>>;
  toggleCampaignStatus: (campaignId: string) => void;
  addCampaign: (campaign: Campaign) => void;

  calls: Call[];
  setCalls: React.Dispatch<React.SetStateAction<Call[]>>;
  activeCallCount: number;
  endCall: (callId: string) => void;
  holdCall: (callId: string) => void;
  transferCall: (callId: string, destination: string) => void;
  addLiveTranscriptMessage: (callId: string, message: Omit<TranscriptMessage, "id">) => void;
  injectSupervisorWhisper: (callId: string, whisperText: string) => void;
  takeoverCallBySupervisor: (callId: string) => void;

  contacts: Contact[];
  setContacts: React.Dispatch<React.SetStateAction<Contact[]>>;
  addContact: (contact: Contact) => void;
  updateContactNotes: (contactId: string, notes: string) => void;

  appointments: Appointment[];
  setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>;
  updateAppointmentStatus: (aptId: string, status: Appointment["status"]) => void;

  knowledgeSources: KnowledgeSource[];
  setKnowledgeSources: React.Dispatch<React.SetStateAction<KnowledgeSource[]>>;
  addKnowledgeSource: (source: KnowledgeSource) => void;

  phoneNumbers: PhoneNumber[];
  incomingConnections: IncomingConnection[];
  templates: Template[];

  flowNodes: FlowNode[];
  setFlowNodes: React.Dispatch<React.SetStateAction<FlowNode[]>>;
  flowEdges: FlowEdge[];
  setFlowEdges: React.Dispatch<React.SetStateAction<FlowEdge[]>>;
  selectedNodeId: string | null;
  setSelectedNodeId: (id: string | null) => void;

  abExperiments: ABTestExperiment[];
  setAbExperiments: React.Dispatch<React.SetStateAction<ABTestExperiment[]>>;
  crownExperimentWinner: (experimentId: string, variantId: string) => void;

  funnelSteps: ConversationFunnelStep[];

  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, "id">) => void;
  removeToast: (id: string) => void;
}

const initialWorkspaces: Workspace[] = [
  { id: "ws-1", name: "Apex Enterprise", plan: "Enterprise", credits: 1842.6, activeCalls: 4 },
  { id: "ws-2", name: "Solar Outbound Fleet", plan: "Scale", credits: 420.0, activeCalls: 1 },
  { id: "ws-3", name: "Support Inbound Pilot", plan: "Growth", credits: 150.0, activeCalls: 0 },
];

const initialNotificationsList: AppNotification[] = [
  {
    id: "notif-1",
    title: "New Appointment Booked",
    message: "Marcus (Solar Advisor) booked Jonathan Vance for Jun 18 at 2:00 PM PST.",
    timestamp: "3m ago",
    read: false,
    type: "appointment",
    link: "/appointments",
  },
  {
    id: "notif-2",
    title: "Google Sheets Auto-Sync Active",
    message: "5 call qualification transcripts pushed to Google Drive.",
    timestamp: "14m ago",
    read: false,
    type: "system",
    link: "/google-sheets",
  },
  {
    id: "notif-3",
    title: "Smart AMD 2.0 Tone Drop Delivered",
    message: "Carrier beep detected on +1 (617) 443-8829; personalized voicemail dropped.",
    timestamp: "1h ago",
    read: true,
    type: "call",
    link: "/smart-amd",
  },
  {
    id: "notif-4",
    title: "Voice Credits Refilled",
    message: "$500.00 auto-recharge successfully applied.",
    timestamp: "4h ago",
    read: true,
    type: "credit",
    link: "/credits",
  },
];

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  // Theme state
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === "light" ? "dark" : "light";
      if (typeof document !== "undefined") {
        if (next === "dark") {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      }
      return next;
    });
  }, []);

  // Notifications state
  const [notifications, setNotifications] = useState<AppNotification[]>(initialNotificationsList);

  const unreadNotificationCount = notifications.filter((n) => !n.read).length;

  const markAllNotificationsAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Workspaces
  const [workspaces, setWorkspaces] = useState<Workspace[]>(initialWorkspaces);
  const [activeWorkspace, setActiveWorkspace] = useState<Workspace>(initialWorkspaces[0]);

  // Layout
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Search
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  // Entities
  const [agents, setAgents] = useState<Agent[]>(initialAgents);
  const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns);
  const [calls, setCalls] = useState<Call[]>(initialCalls);
  const [contacts, setContacts] = useState<Contact[]>(initialContacts);
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [knowledgeSources, setKnowledgeSources] = useState<KnowledgeSource[]>(initialKnowledgeSources);
  const [phoneNumbers] = useState<PhoneNumber[]>(initialPhoneNumbers);
  const [incomingConnections] = useState<IncomingConnection[]>(initialIncomingConnections);
  const [templates] = useState<Template[]>(initialTemplates);

  const [flowNodes, setFlowNodes] = useState<FlowNode[]>(initialFlowNodes);
  const [flowEdges, setFlowEdges] = useState<FlowEdge[]>(initialFlowEdges);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>("n-1");

  const [abExperiments, setAbExperiments] = useState<ABTestExperiment[]>(initialABExperiments);
  const [funnelSteps] = useState<ConversationFunnelStep[]>(initialFunnelSteps);

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const activeCallCount = calls.filter((c) => c.status === "live").length;

  const addToast = useCallback((toast: Omit<ToastMessage, "id">) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const updateAgent = (updated: Agent) => {
    setAgents((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
    addToast({ title: "Agent Saved", description: `${updated.name} configuration updated.`, type: "success" });
  };

  const toggleAgentStatus = (agentId: string) => {
    setAgents((prev) =>
      prev.map((a) => {
        if (a.id === agentId) {
          const next = a.status === "active" ? "draft" : "active";
          addToast({
            title: `Agent ${next === "active" ? "Activated" : "Paused"}`,
            description: `${a.name} is now ${next}.`,
            type: next === "active" ? "success" : "info",
          });
          return { ...a, status: next };
        }
        return a;
      })
    );
  };

  const addAgent = (newAgent: Agent) => {
    setAgents((prev) => [newAgent, ...prev]);
    addToast({ title: "Agent Created", description: `${newAgent.name} is ready for deployment.`, type: "success" });
  };

  const duplicateAgent = (agentId: string) => {
    const original = agents.find((a) => a.id === agentId);
    if (!original) return;
    const dup: Agent = {
      ...original,
      id: `agent-${Date.now()}`,
      name: `${original.name} (Copy)`,
      metrics: {
        totalCalls: 0,
        avgDurationSeconds: 0,
        successRate: 100,
        sentimentScore: 100,
        connectedCalls: 0,
      },
      status: "draft",
    };
    setAgents((prev) => [dup, ...prev]);
    addToast({ title: "Agent Duplicated", description: `Created copy of ${original.name}.`, type: "info" });
  };

  const toggleCampaignStatus = (campaignId: string) => {
    setCampaigns((prev) =>
      prev.map((c) => {
        if (c.id === campaignId) {
          const nextStatus = c.status === "active" ? "paused" : "active";
          addToast({
            title: `Campaign ${nextStatus === "active" ? "Resumed" : "Paused"}`,
            description: `${c.name} is now ${nextStatus}.`,
            type: "info",
          });
          return { ...c, status: nextStatus };
        }
        return c;
      })
    );
  };

  const addCampaign = (campaign: Campaign) => {
    setCampaigns((prev) => [campaign, ...prev]);
    addToast({ title: "Campaign Launched", description: `${campaign.name} dispatch initialized.`, type: "success" });
  };

  const endCall = (callId: string) => {
    setCalls((prev) =>
      prev.map((c) => (c.id === callId ? { ...c, status: "completed", endedAt: new Date().toISOString() } : c))
    );
    addToast({ title: "Call Terminated", description: `Call #${callId} ended by operator.`, type: "info" });
  };

  const holdCall = (callId: string) => {
    setCalls((prev) =>
      prev.map((c) => (c.id === callId ? { ...c, status: c.status === "on_hold" ? "live" : "on_hold" } : c))
    );
    addToast({ title: "Hold State Toggled", description: `Call #${callId} updated.`, type: "info" });
  };

  const transferCall = (callId: string, destination: string) => {
    setCalls((prev) =>
      prev.map((c) => (c.id === callId ? { ...c, status: "transferred" } : c))
    );
    addToast({ title: "Call Transferred", description: `Redirected to ${destination}.`, type: "success" });
  };

  const addLiveTranscriptMessage = (callId: string, message: Omit<TranscriptMessage, "id">) => {
    const newMessage: TranscriptMessage = { ...message, id: `tr-${Date.now()}` };
    setCalls((prev) =>
      prev.map((c) => (c.id === callId ? { ...c, transcript: [...c.transcript, newMessage] } : c))
    );
  };

  const injectSupervisorWhisper = (callId: string, whisperText: string) => {
    addLiveTranscriptMessage(callId, {
      speaker: "supervisor",
      text: whisperText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
    });
    addToast({ title: "Whisper Injected", description: `Sent text whisper to agent on call #${callId}.`, type: "success" });
  };

  const takeoverCallBySupervisor = (callId: string) => {
    setCalls((prev) =>
      prev.map((c) => (c.id === callId ? { ...c, supervisorIntervened: true } : c))
    );
    addToast({ title: "Supervisor Takeover Active", description: "Audio channel routed to live operator headset.", type: "warning" });
  };

  const addContact = (contact: Contact) => {
    setContacts((prev) => [contact, ...prev]);
    addToast({ title: "Contact Added", description: `${contact.name} added to CRM lead pool.`, type: "success" });
  };

  const updateContactNotes = (contactId: string, notes: string) => {
    setContacts((prev) => prev.map((c) => (c.id === contactId ? { ...c, notes } : c)));
    addToast({ title: "Lead Notes Saved", description: "CRM record updated.", type: "success" });
  };

  const updateAppointmentStatus = (aptId: string, status: Appointment["status"]) => {
    setAppointments((prev) =>
      prev.map((a) => {
        if (a.id === aptId) {
          addToast({ title: "Appointment Updated", description: `Status changed to ${status}.`, type: "info" });
          return { ...a, status };
        }
        return a;
      })
    );
  };

  const addKnowledgeSource = (source: KnowledgeSource) => {
    setKnowledgeSources((prev) => [source, ...prev]);
    addToast({ title: "Knowledge Source Added", description: `${source.name} is indexing.`, type: "success" });
  };

  const crownExperimentWinner = (experimentId: string, variantId: string) => {
    setAbExperiments((prev) =>
      prev.map((exp) => {
        if (exp.id === experimentId) {
          addToast({ title: "A/B Winner Crowned", description: `Variant '${variantId}' promoted to 100% traffic allocation.`, type: "success" });
          return { ...exp, status: "completed", winnerVariantId: variantId };
        }
        return exp;
      })
    );
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        notifications,
        unreadNotificationCount,
        markAllNotificationsAsRead,
        clearNotifications,
        workspaces,
        activeWorkspace,
        setActiveWorkspace,
        sidebarCollapsed,
        setSidebarCollapsed,
        mobileMenuOpen,
        setMobileMenuOpen,
        commandPaletteOpen,
        setCommandPaletteOpen,
        agents,
        setAgents,
        updateAgent,
        toggleAgentStatus,
        addAgent,
        duplicateAgent,
        campaigns,
        setCampaigns,
        toggleCampaignStatus,
        addCampaign,
        calls,
        setCalls,
        activeCallCount,
        endCall,
        holdCall,
        transferCall,
        addLiveTranscriptMessage,
        injectSupervisorWhisper,
        takeoverCallBySupervisor,
        contacts,
        setContacts,
        addContact,
        updateContactNotes,
        appointments,
        setAppointments,
        updateAppointmentStatus,
        knowledgeSources,
        setKnowledgeSources,
        addKnowledgeSource,
        phoneNumbers,
        incomingConnections,
        templates,
        flowNodes,
        setFlowNodes,
        flowEdges,
        setFlowEdges,
        selectedNodeId,
        setSelectedNodeId,
        abExperiments,
        setAbExperiments,
        crownExperimentWinner,
        funnelSteps,
        toasts,
        addToast,
        removeToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppStore() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppStore must be used within an AppProvider");
  }
  return context;
}
