"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import {
  SuperAdminUser,
  TenantAdminOrg,
  PlatformPlan,
  GatewayConfig,
  SipCarrierNetwork,
  VoiceAiEngine,
  GlobalCallSession,
  SystemAnnouncement,
  AuditLogEntry,
  initialSuperAdmins,
  initialTenantOrgs,
  initialPlatformPlans,
  initialGateways,
  initialSipCarriers,
  initialVoiceEngines,
  initialGlobalCalls,
  initialAnnouncements,
  initialAuditLogs,
} from "./mock-data/super-admin";

export interface SuperAdminToast {
  id: string;
  title: string;
  description?: string;
  type?: "info" | "success" | "warning" | "danger";
}

interface SuperAdminContextType {
  superAdminTheme: "light" | "dark";
  toggleSuperAdminTheme: () => void;

  superAdminNotifications: { id: string; title: string; message: string; timestamp: string; read: boolean; type: string; link?: string }[];
  unreadNotificationCount: number;
  markAllNotificationsAsRead: () => void;

  currentSuperAdmin: SuperAdminUser;
  setCurrentSuperAdmin: (admin: SuperAdminUser) => void;

  superAdminSidebarCollapsed: boolean;
  setSuperAdminSidebarCollapsed: (collapsed: boolean | ((prev: boolean) => boolean)) => void;
  toggleSuperAdminSidebar: () => void;

  superAdmins: SuperAdminUser[];
  addSuperAdmin: (admin: Omit<SuperAdminUser, "id" | "lastActive" | "avatar">) => void;
  updateSuperAdminStatus: (id: string, status: "active" | "suspended") => void;
  deleteSuperAdmin: (id: string) => void;

  tenants: TenantAdminOrg[];
  addTenant: (tenant: Omit<TenantAdminOrg, "id" | "joinedDate" | "monthlySpend" | "activeCallsNow" | "totalMinutesUsedThisMonth">) => void;
  updateTenantPlan: (tenantId: string, planId: string, planName: string, cycle: "monthly" | "6_months" | "yearly" | "pay_as_you_go") => void;
  adjustTenantCredits: (tenantId: string, deltaAmount: number, reason: string) => void;
  updateTenantStatus: (tenantId: string, status: "active" | "trial" | "suspended") => void;
  updateTenantQuotas: (tenantId: string, maxConcurrency: number, carrier: string, rate: number) => void;
  updateTenantAccount: (tenantId: string, updates: { orgName?: string; primaryAdminName?: string; primaryAdminEmail?: string; passwordReset?: string }) => void;
  toggleTenantEngine: (tenantId: string, engineType: "llm" | "tts" | "stt", engineId: string) => void;

  plans: PlatformPlan[];
  addPlan: (plan: Omit<PlatformPlan, "id">) => void;
  updatePlan: (id: string, updates: Partial<PlatformPlan>) => void;

  gateways: GatewayConfig[];
  addGateway: (gw: Omit<GatewayConfig, "id" | "monthlySentCount" | "deliverySuccessRate" | "latencyMs">) => void;
  updateGatewayStatus: (id: string, status: "active" | "standby" | "disabled") => void;
  setDefaultGateway: (id: string, type: "email" | "sms") => void;

  sipCarriers: SipCarrierNetwork[];
  addSipCarrier: (carrier: Omit<SipCarrierNetwork, "id" | "allocatedChannels">) => void;
  updateSipCarrierStatus: (id: string, status: "online" | "degraded" | "offline") => void;
  setDefaultCarrier: (id: string) => void;

  engines: VoiceAiEngine[];
  addCustomEngine: (engine: Omit<VoiceAiEngine, "id">) => void;
  toggleEngineStatus: (id: string) => void;
  deleteEngine: (id: string) => void;
  updateEngineTierRequirement: (id: string, tier: "all" | "growth_plus" | "enterprise_only") => void;

  globalCalls: GlobalCallSession[];
  forceTerminateCall: (callId: string) => void;

  announcements: SystemAnnouncement[];
  addAnnouncement: (announcement: Omit<SystemAnnouncement, "id" | "publishedAt" | "active">) => void;
  toggleAnnouncement: (id: string) => void;

  auditLogs: AuditLogEntry[];
  addAuditLog: (action: string, target: string, severity?: "info" | "warning" | "critical") => void;

  toasts: SuperAdminToast[];
  addToast: (toast: Omit<SuperAdminToast, "id">) => void;
  removeToast: (id: string) => void;
}

const SuperAdminContext = createContext<SuperAdminContextType | null>(null);

export function SuperAdminProvider({ children }: { children: ReactNode }) {
  // Super Admin Theme
  const [superAdminTheme, setSuperAdminTheme] = useState<"light" | "dark">("light");

  const toggleSuperAdminTheme = useCallback(() => {
    setSuperAdminTheme((prev) => {
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

  // Super Admin Notifications
  const [superAdminNotifications, setSuperAdminNotifications] = useState([
    { id: "sa-notif-1", title: "New Tenant Provisioned", message: "Zenith Capital Group provisioned on Enterprise Tier.", timestamp: "5m ago", read: false, type: "tenant", link: "/super-admin/admins" },
    { id: "sa-notif-2", title: "Primary SIP Route Alert", message: "Telnyx US-East POP latency normal (5.2ms).", timestamp: "18m ago", read: false, type: "telephony", link: "/super-admin/telephony" },
    { id: "sa-notif-3", title: "Custom Model Registered", message: "Kokoro-82M TTS and Parakeet STT added to global matrix.", timestamp: "1h ago", read: true, type: "engine", link: "/super-admin/engines" },
  ]);

  const unreadNotificationCount = superAdminNotifications.filter((n) => !n.read).length;

  const markAllNotificationsAsRead = useCallback(() => {
    setSuperAdminNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const [currentSuperAdmin, setCurrentSuperAdmin] = useState<SuperAdminUser>(initialSuperAdmins[0]);
  const [superAdminSidebarCollapsed, setSuperAdminSidebarCollapsed] = useState(false);
  const [superAdmins, setSuperAdmins] = useState<SuperAdminUser[]>(initialSuperAdmins);
  const [tenants, setTenants] = useState<TenantAdminOrg[]>([]);
  const [plans, setPlans] = useState<PlatformPlan[]>([]);
  const [gateways, setGateways] = useState<GatewayConfig[]>([]);
  const [sipCarriers, setSipCarriers] = useState<SipCarrierNetwork[]>([]);
  const [engines, setEngines] = useState<VoiceAiEngine[]>([]);
  const [globalCalls, setGlobalCalls] = useState<GlobalCallSession[]>([]);
  const [announcements, setAnnouncements] = useState<SystemAnnouncement[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [toasts, setToasts] = useState<SuperAdminToast[]>([]);

  // Live Database API fetch on mount
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    async function loadData() {
      try {
        const apiUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1') + '/analytics/daily';
        const res = await fetch(apiUrl);
        if (res.ok) {
          const data = await res.json();
          if (data && data.lead_analytics && data.lead_analytics.length > 0) {
            console.log("Database Analytics Loaded:", data);
          }
        }
      } catch (err) {
        console.warn("Database API standby:", err);
      }
    }
    loadData();
  }, []);

  const toggleSuperAdminSidebar = useCallback(() => {
    setSuperAdminSidebarCollapsed((prev) => !prev);
  }, []);

  const addToast = useCallback((toast: Omit<SuperAdminToast, "id">) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addAuditLog = useCallback((action: string, target: string, severity: "info" | "warning" | "critical" = "info") => {
    const clientIp = typeof window !== "undefined" ? (window.location.hostname === "localhost" ? "127.0.0.1" : window.location.hostname) : "127.0.0.1";
    const newLog: AuditLogEntry = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
      actorName: currentSuperAdmin.name,
      actorRole: currentSuperAdmin.role,
      action,
      target,
      ipAddress: clientIp,
      severity,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  }, [currentSuperAdmin]);

  const addSuperAdmin = useCallback((adminData: Omit<SuperAdminUser, "id" | "lastActive" | "avatar">) => {
    const initials = adminData.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2) || "SA";
    const newAdmin: SuperAdminUser = {
      ...adminData,
      id: `sa-${Date.now()}`,
      lastActive: "Just now",
      avatar: initials,
    };
    setSuperAdmins((prev) => [newAdmin, ...prev]);
    addAuditLog(`Created Super Admin user '${adminData.name}' with role '${adminData.role}'`, `SuperAdmin (${newAdmin.id})`, "info");
    addToast({ title: "Super Admin Created", description: `${adminData.name} granted ${adminData.role} access.`, type: "success" });
  }, [addAuditLog, addToast]);

  const updateSuperAdminStatus = useCallback((id: string, status: "active" | "suspended") => {
    setSuperAdmins((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
    addAuditLog(`Updated Super Admin status to '${status}'`, `SuperAdmin (${id})`, status === "suspended" ? "warning" : "info");
    addToast({ title: "Admin Status Updated", description: `Account is now ${status}.`, type: "info" });
  }, [addAuditLog, addToast]);

  const deleteSuperAdmin = useCallback((id: string) => {
    setSuperAdmins((prev) => prev.filter((a) => a.id !== id));
    addAuditLog(`Revoked Super Admin credentials`, `SuperAdmin (${id})`, "warning");
    addToast({ title: "Super Admin Revoked", description: "Account removed from platform.", type: "warning" });
  }, [addAuditLog, addToast]);

  const addTenant = useCallback((tenantData: Omit<TenantAdminOrg, "id" | "joinedDate" | "monthlySpend" | "activeCallsNow" | "totalMinutesUsedThisMonth">) => {
    const newTenant: TenantAdminOrg = {
      ...tenantData,
      id: `tenant-${Date.now()}`,
      joinedDate: "Today",
      monthlySpend: 0,
      activeCallsNow: 0,
      totalMinutesUsedThisMonth: 0,
    };
    setTenants((prev) => [newTenant, ...prev]);
    addAuditLog(`Provisioned new Admin organization '${tenantData.orgName}'`, `Tenant (${newTenant.id})`, "info");
    addToast({ title: "Tenant Provisioned", description: `Organization '${tenantData.orgName}' is ready.`, type: "success" });
  }, [addAuditLog, addToast]);

  const updateTenantPlan = useCallback((tenantId: string, planId: string, planName: string, billingCycle: "monthly" | "6_months" | "yearly" | "pay_as_you_go") => {
    setTenants((prev) => prev.map((t) => t.id === tenantId ? { ...t, planId, planName, billingCycle } : t));
    addAuditLog(`Changed plan to '${planName}' (${billingCycle}) for tenant`, `Tenant (${tenantId})`, "info");
    addToast({ title: "Plan Reassigned", description: `Assigned ${planName} (${billingCycle}).`, type: "success" });
  }, [addAuditLog, addToast]);

  const adjustTenantCredits = useCallback((tenantId: string, deltaAmount: number, reason: string) => {
    setTenants((prev) =>
      prev.map((t) =>
        t.id === tenantId
          ? { ...t, creditsBalance: Math.max(0, Number((t.creditsBalance + deltaAmount).toFixed(2))) }
          : t
      )
    );
    const sign = deltaAmount >= 0 ? "+" : "";
    addAuditLog(`Adjusted credits by ${sign}$${deltaAmount} (Reason: ${reason})`, `Tenant (${tenantId})`, "info");
    addToast({ title: "Credits Updated", description: `${sign}$${deltaAmount.toFixed(2)} applied.`, type: "success" });
  }, [addAuditLog, addToast]);

  const updateTenantStatus = useCallback((tenantId: string, status: "active" | "trial" | "suspended") => {
    setTenants((prev) => prev.map((t) => (t.id === tenantId ? { ...t, status } : t)));
    addAuditLog(`Changed organization status to '${status}'`, `Tenant (${tenantId})`, status === "suspended" ? "warning" : "info");
    addToast({ title: "Tenant Status Updated", description: `Organization is now ${status}.`, type: "info" });
  }, [addAuditLog, addToast]);

  const updateTenantQuotas = useCallback((tenantId: string, maxConcurrency: number, assignedSipCarrier: string, creditRatePerMinute: number) => {
    setTenants((prev) =>
      prev.map((t) =>
        t.id === tenantId
          ? { ...t, maxConcurrency, assignedSipCarrier, creditRatePerMinute }
          : t
      )
    );
    addAuditLog(`Updated quotas: ${maxConcurrency} lines, ${assignedSipCarrier}, $${creditRatePerMinute}/min`, `Tenant (${tenantId})`, "info");
    addToast({ title: "Quotas Updated", description: "Resource limits saved.", type: "success" });
  }, [addAuditLog, addToast]);

  const updateTenantAccount = useCallback((tenantId: string, updates: { orgName?: string; primaryAdminName?: string; primaryAdminEmail?: string; passwordReset?: string }) => {
    setTenants((prev) =>
      prev.map((t) => {
        if (t.id !== tenantId) return t;
        return {
          ...t,
          ...(updates.orgName ? { orgName: updates.orgName } : {}),
          ...(updates.primaryAdminName ? { primaryAdminName: updates.primaryAdminName } : {}),
          ...(updates.primaryAdminEmail ? { primaryAdminEmail: updates.primaryAdminEmail } : {}),
        };
      })
    );
    const passMsg = updates.passwordReset ? " & password reset" : "";
    addAuditLog(`Updated tenant profile details${passMsg} for '${tenantId}'`, `Tenant (${tenantId})`, "info");
    addToast({ title: "Tenant Account Customized", description: `Updated admin profile & security credentials.${passMsg}`, type: "success" });
  }, [addAuditLog, addToast]);

  const toggleTenantEngine = useCallback((tenantId: string, engineType: "llm" | "tts" | "stt", engineId: string) => {
    setTenants((prev) =>
      prev.map((t) => {
        if (t.id !== tenantId) return t;
        if (engineType === "llm") {
          const exists = t.allowedLLMs.includes(engineId);
          return {
            ...t,
            allowedLLMs: exists ? t.allowedLLMs.filter((id) => id !== engineId) : [...t.allowedLLMs, engineId],
          };
        } else if (engineType === "tts") {
          const exists = t.allowedTTS.includes(engineId);
          return {
            ...t,
            allowedTTS: exists ? t.allowedTTS.filter((id) => id !== engineId) : [...t.allowedTTS, engineId],
          };
        } else {
          const exists = t.allowedSTT.includes(engineId);
          return {
            ...t,
            allowedSTT: exists ? t.allowedSTT.filter((id) => id !== engineId) : [...t.allowedSTT, engineId],
          };
        }
      })
    );
    addToast({ title: "Model Entitlement Updated", description: "Engine permissions synchronized.", type: "info" });
  }, [addToast]);

  const addPlan = useCallback((planData: Omit<PlatformPlan, "id">) => {
    const newPlan: PlatformPlan = { ...planData, id: `plan-${Date.now()}` };
    setPlans((prev) => [...prev, newPlan]);
    addAuditLog(`Created new platform plan '${planData.name}'`, `Plan (${newPlan.id})`, "info");
    addToast({ title: "Plan Created", description: `${planData.name} is now available.`, type: "success" });
  }, [addAuditLog, addToast]);

  const updatePlan = useCallback((id: string, updates: Partial<PlatformPlan>) => {
    setPlans((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
    addAuditLog(`Updated plan '${id}' pricing & feature terms`, `Plan (${id})`, "info");
    addToast({ title: "Plan Updated", description: "Changes saved.", type: "success" });
  }, [addAuditLog, addToast]);

  const addGateway = useCallback((gwData: Omit<GatewayConfig, "id" | "monthlySentCount" | "deliverySuccessRate" | "latencyMs">) => {
    const newGw: GatewayConfig = {
      ...gwData,
      id: `gw-${Date.now()}`,
      monthlySentCount: 0,
      deliverySuccessRate: 100,
      latencyMs: 120,
    };
    setGateways((prev) => [...prev, newGw]);
    addAuditLog(`Added ${gwData.type.toUpperCase()} Gateway '${gwData.name}' (${gwData.provider})`, `Gateway (${newGw.id})`, "info");
    addToast({ title: "Gateway Added", description: `${gwData.name} registered.`, type: "success" });
  }, [addAuditLog, addToast]);

  const updateGatewayStatus = useCallback((id: string, status: "active" | "standby" | "disabled") => {
    setGateways((prev) => prev.map((g) => (g.id === id ? { ...g, status } : g)));
    addAuditLog(`Changed gateway '${id}' status to '${status}'`, `Gateway (${id})`, "info");
    addToast({ title: "Gateway Status Changed", description: `Set to ${status}.`, type: "info" });
  }, [addAuditLog, addToast]);

  const setDefaultGateway = useCallback((id: string, type: "email" | "sms") => {
    setGateways((prev) =>
      prev.map((g) => {
        if (g.type !== type) return g;
        return { ...g, isDefault: g.id === id };
      })
    );
    addAuditLog(`Set default ${type.toUpperCase()} gateway to '${id}'`, `Gateway (${id})`, "info");
    addToast({ title: "Default Gateway Updated", description: "Primary routing rule set.", type: "success" });
  }, [addAuditLog, addToast]);

  const addSipCarrier = useCallback((carrierData: Omit<SipCarrierNetwork, "id" | "allocatedChannels">) => {
    const newCarrier: SipCarrierNetwork = {
      ...carrierData,
      id: `sip-${Date.now()}`,
      allocatedChannels: 0,
    };
    setSipCarriers((prev) => [...prev, newCarrier]);
    addAuditLog(`Connected SIP Carrier Network '${carrierData.name}' (${carrierData.carrier})`, `SipCarrier (${newCarrier.id})`, "info");
    addToast({ title: "Carrier Connected", description: `${carrierData.name} added to trunk pool.`, type: "success" });
  }, [addAuditLog, addToast]);

  const updateSipCarrierStatus = useCallback((id: string, status: "online" | "degraded" | "offline") => {
    setSipCarriers((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));
    addAuditLog(`Changed carrier '${id}' status to '${status}'`, `SipCarrier (${id})`, status === "offline" ? "critical" : "warning");
    addToast({ title: "Carrier Status Updated", description: `Trunk is now ${status}.`, type: "info" });
  }, [addAuditLog, addToast]);

  const setDefaultCarrier = useCallback((id: string) => {
    setSipCarriers((prev) => prev.map((c) => ({ ...c, isDefaultCarrier: c.id === id })));
    addAuditLog(`Set primary carrier to '${id}'`, `SipCarrier (${id})`, "info");
    addToast({ title: "Primary Carrier Set", description: "Default carrier routing updated.", type: "success" });
  }, [addAuditLog, addToast]);

  const addCustomEngine = useCallback((engineData: Omit<VoiceAiEngine, "id">) => {
    const newEng: VoiceAiEngine = {
      ...engineData,
      id: `eng-${engineData.category}-${Date.now()}`,
      isCustom: true,
    };
    setEngines((prev) => [...prev, newEng]);
    addAuditLog(`Registered custom ${engineData.category.toUpperCase()} model '${engineData.name}' (${engineData.provider})`, `VoiceEngine (${newEng.id})`, "info");
    addToast({ title: "Custom Model Registered", description: `${engineData.name} is ready across all tenants.`, type: "success" });
  }, [addAuditLog, addToast]);

  const toggleEngineStatus = useCallback((id: string) => {
    setEngines((prev) =>
      prev.map((e) =>
        e.id === id ? { ...e, status: e.status === "active" ? "deprecated" : "active" } : e
      )
    );
    addAuditLog(`Toggled engine status for '${id}'`, `Engine (${id})`, "info");
    addToast({ title: "Engine Status Updated", description: "Global engine availability adjusted.", type: "info" });
  }, [addAuditLog, addToast]);

  const deleteEngine = useCallback((id: string) => {
    setEngines((prev) => prev.filter((e) => e.id !== id));
    addAuditLog(`Deleted model engine '${id}'`, `Engine (${id})`, "warning");
    addToast({ title: "Engine Removed", description: "Model removed from platform matrix.", type: "warning" });
  }, [addAuditLog, addToast]);

  const updateEngineTierRequirement = useCallback((id: string, tierRequirement: "all" | "growth_plus" | "enterprise_only") => {
    setEngines((prev) => prev.map((e) => (e.id === id ? { ...e, tierRequirement } : e)));
    addAuditLog(`Set tier requirement for engine '${id}' to '${tierRequirement}'`, `Engine (${id})`, "info");
    addToast({ title: "Tier Requirement Updated", description: `Restricted to ${tierRequirement}.`, type: "info" });
  }, [addAuditLog, addToast]);

  const forceTerminateCall = useCallback((callId: string) => {
    setGlobalCalls((prev) =>
      prev.map((c) => (c.id === callId ? { ...c, status: "terminated" } : c))
    );
    addAuditLog(`Super Admin force-terminated live SIP call session '${callId}'`, `GlobalCall (${callId})`, "warning");
    addToast({ title: "Call Force Terminated", description: "SIP channel packet stream closed.", type: "warning" });
  }, [addAuditLog, addToast]);

  const addAnnouncement = useCallback((announcementData: Omit<SystemAnnouncement, "id" | "publishedAt" | "active">) => {
    const newAnc: SystemAnnouncement = {
      ...announcementData,
      id: `anc-${Date.now()}`,
      publishedAt: new Date().toISOString().replace("T", " ").substring(0, 16),
      active: true,
    };
    setAnnouncements((prev) => [newAnc, ...prev]);
    addAuditLog(`Broadcasted system announcement '${announcementData.title}'`, `Announcement (${newAnc.id})`, "info");
    addToast({ title: "Announcement Broadcasted", description: "Sent to all tenant dashboards.", type: "success" });
  }, [addAuditLog, addToast]);

  const toggleAnnouncement = useCallback((id: string) => {
    setAnnouncements((prev) =>
      prev.map((a) => (a.id === id ? { ...a, active: !a.active } : a))
    );
    addToast({ title: "Announcement Status Toggled", description: "Updated tenant banner status.", type: "info" });
  }, [addToast]);

  return (
    <SuperAdminContext.Provider
      value={{
        superAdminTheme,
        toggleSuperAdminTheme,
        superAdminNotifications,
        unreadNotificationCount,
        markAllNotificationsAsRead,
        currentSuperAdmin,
        setCurrentSuperAdmin,
        superAdminSidebarCollapsed,
        setSuperAdminSidebarCollapsed,
        toggleSuperAdminSidebar,
        superAdmins,
        addSuperAdmin,
        updateSuperAdminStatus,
        deleteSuperAdmin,
        tenants,
        addTenant,
        updateTenantPlan,
        adjustTenantCredits,
        updateTenantStatus,
        updateTenantQuotas,
        updateTenantAccount,
        toggleTenantEngine,
        plans,
        addPlan,
        updatePlan,
        gateways,
        addGateway,
        updateGatewayStatus,
        setDefaultGateway,
        sipCarriers,
        addSipCarrier,
        updateSipCarrierStatus,
        setDefaultCarrier,
        engines,
        addCustomEngine,
        toggleEngineStatus,
        deleteEngine,
        updateEngineTierRequirement,
        globalCalls,
        forceTerminateCall,
        announcements,
        addAnnouncement,
        toggleAnnouncement,
        auditLogs,
        addAuditLog,
        toasts,
        addToast,
        removeToast,
      }}
    >
      {children}
    </SuperAdminContext.Provider>
  );
}

const fallbackSuperAdminState: SuperAdminContextType = {
  superAdminTheme: "light",
  toggleSuperAdminTheme: () => {},
  superAdminNotifications: [],
  unreadNotificationCount: 0,
  markAllNotificationsAsRead: () => {},
  currentSuperAdmin: initialSuperAdmins[0],
  setCurrentSuperAdmin: () => {},
  superAdminSidebarCollapsed: false,
  setSuperAdminSidebarCollapsed: () => {},
  toggleSuperAdminSidebar: () => {},
  superAdmins: initialSuperAdmins,
  addSuperAdmin: () => {},
  updateSuperAdminStatus: () => {},
  deleteSuperAdmin: () => {},
  tenants: initialTenantOrgs,
  addTenant: () => {},
  updateTenantPlan: () => {},
  adjustTenantCredits: () => {},
  updateTenantStatus: () => {},
  updateTenantQuotas: () => {},
  updateTenantAccount: () => {},
  toggleTenantEngine: () => {},
  plans: initialPlatformPlans,
  addPlan: () => {},
  updatePlan: () => {},
  gateways: initialGateways,
  addGateway: () => {},
  updateGatewayStatus: () => {},
  setDefaultGateway: () => {},
  sipCarriers: initialSipCarriers,
  addSipCarrier: () => {},
  updateSipCarrierStatus: () => {},
  setDefaultCarrier: () => {},
  engines: initialVoiceEngines,
  addCustomEngine: () => {},
  toggleEngineStatus: () => {},
  deleteEngine: () => {},
  updateEngineTierRequirement: () => {},
  globalCalls: initialGlobalCalls,
  forceTerminateCall: () => {},
  announcements: initialAnnouncements,
  addAnnouncement: () => {},
  toggleAnnouncement: () => {},
  auditLogs: initialAuditLogs,
  addAuditLog: () => {},
  toasts: [],
  addToast: () => {},
  removeToast: () => {},
};

export function useSuperAdminStore() {
  const context = useContext(SuperAdminContext);
  return context || fallbackSuperAdminState;
}
