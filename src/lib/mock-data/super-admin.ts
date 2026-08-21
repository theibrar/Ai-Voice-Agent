export interface SuperAdminUser {
  id: string;
  name: string;
  email: string;
  role: "Master Super Admin" | "Billing Admin" | "Infrastructure Lead" | "Support Engineer";
  permissions: string[];
  twoFactorEnabled: boolean;
  lastActive: string;
  avatar: string;
  status: "active" | "suspended";
}

export interface TenantAdminOrg {
  id: string;
  orgName: string;
  primaryAdminName: string;
  primaryAdminEmail: string;
  planId: string;
  planName: string;
  billingCycle: "monthly" | "6_months" | "yearly" | "pay_as_you_go";
  creditsBalance: number;
  creditRatePerMinute: number;
  maxConcurrency: number;
  activeCallsNow: number;
  totalMinutesUsedThisMonth: number;
  assignedSipCarrier: string;
  assignedEmailGateway: string;
  assignedSmsGateway: string;
  allowedLLMs: string[];
  allowedTTS: string[];
  allowedSTT: string[];
  status: "active" | "trial" | "suspended";
  joinedDate: string;
  monthlySpend: number;
}

export interface PlatformPlan {
  id: string;
  name: string;
  slug: string;
  description: string;
  monthlyPrice: number;
  sixMonthsPrice: number;
  yearlyPrice: number;
  payAsYouGoRatePerMinute: number;
  creditMultiplier: number;
  includedMinutes: number;
  maxConcurrency: number;
  features: string[];
  allowedEnginesCount: number;
  isPopular?: boolean;
  status: "active" | "archived";
}

export interface GatewayConfig {
  id: string;
  name: string;
  type: "email" | "sms";
  provider: "amazon_ses" | "sendgrid" | "postmark" | "smtp_custom" | "twilio" | "telnyx" | "sinch" | "plivo";
  status: "active" | "standby" | "disabled";
  isDefault: boolean;
  endpointOrHost: string;
  port?: number;
  authIdOrApiKey: string;
  fromEmailOrPhone: string;
  monthlySentCount: number;
  deliverySuccessRate: number;
  latencyMs: number;
}

export interface SipCarrierNetwork {
  id: string;
  name: string;
  carrier: "telnyx" | "twilio" | "bandwidth" | "thinq" | "custom_sbc";
  status: "online" | "degraded" | "offline";
  sipServer: string;
  port: number;
  transport: "UDP" | "TCP" | "TLS";
  codecPriority: string[];
  maxChannels: number;
  allocatedChannels: number;
  ratePerMinuteWholesale: number;
  popRegions: string[];
  isDefaultCarrier: boolean;
}

export interface VoiceAiEngine {
  id: string;
  name: string;
  provider: string;
  category: "llm" | "tts" | "stt";
  modelIdentifier: string;
  latencyAvgMs: number;
  costPerUnit: string;
  status: "active" | "beta" | "deprecated";
  isGlobalDefault: boolean;
  tierRequirement: "all" | "growth_plus" | "enterprise_only";
  supportedLanguagesCount: number;
  description: string;
  isCustom?: boolean;
  baseUrl?: string;
  apiKey?: string;
}

export interface GlobalCallSession {
  id: string;
  tenantId: string;
  tenantName: string;
  callerName: string;
  callerNumber: string;
  agentName: string;
  carrier: string;
  llmModel: string;
  ttsVoice: string;
  sttEngine: string;
  startedAt: string;
  durationSeconds: number;
  status: "in_progress" | "completed" | "failed" | "terminated";
  jitterMs: number;
  packetLossPercent: number;
  costEstimate: number;
}

export interface SystemAnnouncement {
  id: string;
  title: string;
  message: string;
  severity: "info" | "warning" | "critical";
  targetTenants: "all" | "enterprise_only" | "trial_only";
  publishedAt: string;
  active: boolean;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: string;
  action: string;
  target: string;
  ipAddress: string;
  severity: "info" | "warning" | "critical";
}

// -------------------------------------------------------------
// Mock Data Initial Seeds
// -------------------------------------------------------------

export const initialSuperAdmins: SuperAdminUser[] = [
  {
    id: "sa-1",
    name: "Alexander Mercer",
    email: "alexander@apexsuperadmin.io",
    role: "Master Super Admin",
    permissions: ["all_access", "billing_override", "infrastructure_control", "tenant_impersonation"],
    twoFactorEnabled: true,
    lastActive: "Just now",
    avatar: "AM",
    status: "active",
  },
  {
    id: "sa-2",
    name: "Dr. Evelyn Zhao",
    email: "evelyn.zhao@apexsuperadmin.io",
    role: "Infrastructure Lead",
    permissions: ["infrastructure_control", "sip_routing", "model_engines", "audit_logs"],
    twoFactorEnabled: true,
    lastActive: "14m ago",
    avatar: "EZ",
    status: "active",
  },
  {
    id: "sa-3",
    name: "Marcus Sterling",
    email: "marcus.s@apexsuperadmin.io",
    role: "Billing Admin",
    permissions: ["billing_override", "plan_management", "credit_allocation", "financial_reports"],
    twoFactorEnabled: true,
    lastActive: "1h ago",
    avatar: "MS",
    status: "active",
  },
  {
    id: "sa-4",
    name: "Sarah Lin",
    email: "sarah.lin@apexsuperadmin.io",
    role: "Support Engineer",
    permissions: ["tenant_view", "call_diagnostics", "audit_logs"],
    twoFactorEnabled: false,
    lastActive: "3h ago",
    avatar: "SL",
    status: "active",
  },
];

export const initialTenantOrgs: TenantAdminOrg[] = [
  {
    id: "tenant-1",
    orgName: "Apex Financial AI",
    primaryAdminName: "Alex DeVries",
    primaryAdminEmail: "alex@apexvoice.ai",
    planId: "plan-enterprise",
    planName: "Enterprise Tier",
    billingCycle: "yearly",
    creditsBalance: 1842.6,
    creditRatePerMinute: 0.08,
    maxConcurrency: 150,
    activeCallsNow: 4,
    totalMinutesUsedThisMonth: 84920,
    assignedSipCarrier: "Telnyx Elastic Tier-1",
    assignedEmailGateway: "Amazon SES Primary",
    assignedSmsGateway: "Twilio 10DLC Pool",
    allowedLLMs: ["gpt-4o", "claude-3-5-sonnet", "gemini-1-5-pro", "deepseek-v3", "custom-vllm-mistral"],
    allowedTTS: ["elevenlabs-turbo-v2", "cartesia-sonic", "playht-2", "kokoro-82m"],
    allowedSTT: ["deepgram-nova-3", "whisper-v3-turbo", "nvidia-parakeet"],
    status: "active",
    joinedDate: "Jan 12, 2026",
    monthlySpend: 6793.6,
  },
  {
    id: "tenant-2",
    orgName: "MedCare Health Network",
    primaryAdminName: "Dr. Rachel Thorne",
    primaryAdminEmail: "rachel@medcarehealth.org",
    planId: "plan-scale",
    planName: "Scale Tier",
    billingCycle: "6_months",
    creditsBalance: 890.0,
    creditRatePerMinute: 0.09,
    maxConcurrency: 80,
    activeCallsNow: 2,
    totalMinutesUsedThisMonth: 42100,
    assignedSipCarrier: "Bandwidth.com Healthcare Trunk",
    assignedEmailGateway: "SendGrid Dedicated",
    assignedSmsGateway: "Telnyx Healthcare SMS",
    allowedLLMs: ["gpt-4o", "claude-3-5-sonnet"],
    allowedTTS: ["elevenlabs-turbo-v2", "cartesia-sonic", "kokoro-82m"],
    allowedSTT: ["deepgram-nova-3", "nvidia-parakeet"],
    status: "active",
    joinedDate: "Feb 04, 2026",
    monthlySpend: 3789.0,
  },
  {
    id: "tenant-3",
    orgName: "SunPeak Growth Outbound",
    primaryAdminName: "Marcus Vance",
    primaryAdminEmail: "marcus@sunpeakgrowth.com",
    planId: "plan-growth",
    planName: "Growth Tier",
    billingCycle: "monthly",
    creditsBalance: 420.5,
    creditRatePerMinute: 0.1,
    maxConcurrency: 40,
    activeCallsNow: 1,
    totalMinutesUsedThisMonth: 18450,
    assignedSipCarrier: "Twilio Elastic SIP",
    assignedEmailGateway: "Amazon SES Primary",
    assignedSmsGateway: "Twilio 10DLC Pool",
    allowedLLMs: ["gpt-4o-mini", "claude-3-5-haiku", "deepseek-v3"],
    allowedTTS: ["cartesia-sonic", "deepgram-aura", "kokoro-82m"],
    allowedSTT: ["deepgram-nova-3", "nvidia-parakeet"],
    status: "active",
    joinedDate: "Mar 19, 2026",
    monthlySpend: 1845.0,
  },
  {
    id: "tenant-4",
    orgName: "Nova Telehealth Direct",
    primaryAdminName: "Chloe Davenport",
    primaryAdminEmail: "chloe@novadirect.co",
    planId: "plan-paygo",
    planName: "Pay-As-You-Go",
    billingCycle: "pay_as_you_go",
    creditsBalance: 124.0,
    creditRatePerMinute: 0.12,
    maxConcurrency: 20,
    activeCallsNow: 0,
    totalMinutesUsedThisMonth: 6120,
    assignedSipCarrier: "Telnyx Elastic Tier-1",
    assignedEmailGateway: "Postmark Transactional",
    assignedSmsGateway: "Telnyx Healthcare SMS",
    allowedLLMs: ["gpt-4o-mini", "gemini-1-5-flash"],
    allowedTTS: ["deepgram-aura", "cartesia-sonic"],
    allowedSTT: ["deepgram-nova-3"],
    status: "active",
    joinedDate: "Apr 22, 2026",
    monthlySpend: 734.4,
  },
  {
    id: "tenant-5",
    orgName: "Alpha Logistics & Freight",
    primaryAdminName: "Viktor Ramos",
    primaryAdminEmail: "viktor@alphacargo.net",
    planId: "plan-starter",
    planName: "Starter Tier",
    billingCycle: "monthly",
    creditsBalance: 0.0,
    creditRatePerMinute: 0.12,
    maxConcurrency: 10,
    activeCallsNow: 0,
    totalMinutesUsedThisMonth: 850,
    assignedSipCarrier: "Twilio Elastic SIP",
    assignedEmailGateway: "Amazon SES Primary",
    assignedSmsGateway: "Twilio 10DLC Pool",
    allowedLLMs: ["gpt-4o-mini"],
    allowedTTS: ["deepgram-aura"],
    allowedSTT: ["deepgram-nova-3"],
    status: "suspended",
    joinedDate: "May 01, 2026",
    monthlySpend: 102.0,
  },
];

export const initialPlatformPlans: PlatformPlan[] = [
  {
    id: "plan-starter",
    name: "Starter Voice",
    slug: "starter",
    description: "Designed for single automated workflows and small volume pilot programs.",
    monthlyPrice: 199,
    sixMonthsPrice: 169,
    yearlyPrice: 149,
    payAsYouGoRatePerMinute: 0.12,
    creditMultiplier: 1.0,
    includedMinutes: 1500,
    maxConcurrency: 10,
    features: ["10 Concurrent SIP Lines", "Deepgram Nova-3 STT", "Standard TTS Voices", "Email Support", "Community Webhooks"],
    allowedEnginesCount: 3,
    status: "active",
  },
  {
    id: "plan-growth",
    name: "Growth Fleet",
    slug: "growth",
    description: "Built for scaling outbound campaigns, dynamic funnels, and high-velocity qualifying.",
    monthlyPrice: 599,
    sixMonthsPrice: 499,
    yearlyPrice: 449,
    payAsYouGoRatePerMinute: 0.1,
    creditMultiplier: 1.15,
    includedMinutes: 6000,
    maxConcurrency: 40,
    features: ["40 Concurrent SIP Lines", "Cartesia Sonic (<100ms TTS)", "Kokoro 82M TTS", "Smart AMD 2.0 Tone Drop", "A/B Testing Lab"],
    allowedEnginesCount: 6,
    isPopular: true,
    status: "active",
  },
  {
    id: "plan-scale",
    name: "Scale Operator",
    slug: "scale",
    description: "Enterprise call centers requiring live supervisor intervention and custom CRM integrations.",
    monthlyPrice: 1299,
    sixMonthsPrice: 1099,
    yearlyPrice: 999,
    payAsYouGoRatePerMinute: 0.09,
    creditMultiplier: 1.3,
    includedMinutes: 16000,
    maxConcurrency: 80,
    features: ["80 Concurrent SIP Lines", "Live Supervisor Whisper & Barge-in", "NVIDIA Parakeet STT (75ms)", "Custom SIP Trunk Bring-Your-Own", "Dedicated SLA Support"],
    allowedEnginesCount: 10,
    status: "active",
  },
  {
    id: "plan-enterprise",
    name: "Enterprise Dedicated",
    slug: "enterprise",
    description: "Unlimited scale with dedicated carrier interconnects, custom LLM fine-tuning, and multi-tenant isolation.",
    monthlyPrice: 2999,
    sixMonthsPrice: 2499,
    yearlyPrice: 2199,
    payAsYouGoRatePerMinute: 0.08,
    creditMultiplier: 1.5,
    includedMinutes: 45000,
    maxConcurrency: 500,
    features: ["500+ Concurrent SIP Lines", "Zero-Latency Private SBC Routing", "All LLMs + Custom vLLM Endpoints", "Kokoro-82M & Parakeet TDT", "24/7 Phone Support & Dedicated Architect"],
    allowedEnginesCount: 20,
    status: "active",
  },
  {
    id: "plan-paygo",
    name: "Pay-As-You-Go Metered",
    slug: "pay_as_you_go",
    description: "Pure usage-based billing with no fixed monthly commitment. 1 Credit per minute billed.",
    monthlyPrice: 0,
    sixMonthsPrice: 0,
    yearlyPrice: 0,
    payAsYouGoRatePerMinute: 0.12,
    creditMultiplier: 1.0,
    includedMinutes: 0,
    maxConcurrency: 20,
    features: ["Pay per minute active", "Dynamic auto-recharge", "Standard Carrier Routes", "Webhooks & API Access"],
    allowedEnginesCount: 4,
    status: "active",
  },
];

export const initialGateways: GatewayConfig[] = [
  {
    id: "gw-1",
    name: "Amazon SES Primary",
    type: "email",
    provider: "amazon_ses",
    status: "active",
    isDefault: true,
    endpointOrHost: "email-smtp.us-east-1.amazonaws.com",
    port: 587,
    authIdOrApiKey: "AKIA*************SES",
    fromEmailOrPhone: "notifications@apexvoice.ai",
    monthlySentCount: 384200,
    deliverySuccessRate: 99.8,
    latencyMs: 142,
  },
  {
    id: "gw-2",
    name: "SendGrid Dedicated Relay",
    type: "email",
    provider: "sendgrid",
    status: "active",
    isDefault: false,
    endpointOrHost: "smtp.sendgrid.net",
    port: 587,
    authIdOrApiKey: "SG.********************",
    fromEmailOrPhone: "alerts@apexvoice.ai",
    monthlySentCount: 142000,
    deliverySuccessRate: 99.4,
    latencyMs: 165,
  },
  {
    id: "gw-3",
    name: "Postmark Transactional",
    type: "email",
    provider: "postmark",
    status: "standby",
    isDefault: false,
    endpointOrHost: "smtp.postmarkapp.com",
    port: 587,
    authIdOrApiKey: "pm-sec-****************",
    fromEmailOrPhone: "security@apexvoice.ai",
    monthlySentCount: 28400,
    deliverySuccessRate: 99.9,
    latencyMs: 110,
  },
  {
    id: "gw-4",
    name: "Twilio 10DLC Primary Pool",
    type: "sms",
    provider: "twilio",
    status: "active",
    isDefault: true,
    endpointOrHost: "https://api.twilio.com/2010-04-01",
    authIdOrApiKey: "AC****************************",
    fromEmailOrPhone: "+1 (800) 555-0199",
    monthlySentCount: 94200,
    deliverySuccessRate: 98.9,
    latencyMs: 85,
  },
  {
    id: "gw-5",
    name: "Telnyx SMS Low-Cost Route",
    type: "sms",
    provider: "telnyx",
    status: "active",
    isDefault: false,
    endpointOrHost: "https://api.telnyx.com/v2/messages",
    authIdOrApiKey: "KEY**************************",
    fromEmailOrPhone: "+1 (888) 440-2026",
    monthlySentCount: 65100,
    deliverySuccessRate: 99.2,
    latencyMs: 72,
  },
];

export const initialSipCarriers: SipCarrierNetwork[] = [
  {
    id: "sip-1",
    name: "Telnyx Elastic Tier-1",
    carrier: "telnyx",
    status: "online",
    sipServer: "sip.telnyx.com",
    port: 5060,
    transport: "TLS",
    codecPriority: ["Opus (48kHz)", "G.711u", "G.711a"],
    maxChannels: 1000,
    allocatedChannels: 340,
    ratePerMinuteWholesale: 0.0035,
    popRegions: ["US-East (Ashburn)", "US-West (San Jose)", "EU (Frankfurt)", "AP (Singapore)"],
    isDefaultCarrier: true,
  },
  {
    id: "sip-2",
    name: "Twilio Elastic SIP Trunking",
    carrier: "twilio",
    status: "online",
    sipServer: "apex-voice.pstn.twilio.com",
    port: 5060,
    transport: "UDP",
    codecPriority: ["G.711u", "G.711a"],
    maxChannels: 500,
    allocatedChannels: 180,
    ratePerMinuteWholesale: 0.0055,
    popRegions: ["US-East", "US-West", "EU-West"],
    isDefaultCarrier: false,
  },
  {
    id: "sip-3",
    name: "Bandwidth.com Healthcare Trunk",
    carrier: "bandwidth",
    status: "online",
    sipServer: "sip.bandwidth.com",
    port: 5061,
    transport: "TLS",
    codecPriority: ["Opus", "G.711u"],
    maxChannels: 300,
    allocatedChannels: 95,
    ratePerMinuteWholesale: 0.0042,
    popRegions: ["US-East (Atlanta)", "US-West (Denver)"],
    isDefaultCarrier: false,
  },
  {
    id: "sip-4",
    name: "Private Dedicated SBC (FreeSWITCH/Kamailio)",
    carrier: "custom_sbc",
    status: "online",
    sipServer: "sbc-direct.apexvoice.internal",
    port: 5060,
    transport: "TLS",
    codecPriority: ["Opus (48kHz)", "G.711u"],
    maxChannels: 2000,
    allocatedChannels: 450,
    ratePerMinuteWholesale: 0.0018,
    popRegions: ["Private VPC (AWS us-east-1)"],
    isDefaultCarrier: false,
  },
];

export const initialVoiceEngines: VoiceAiEngine[] = [
  // LLMs
  {
    id: "eng-llm-1",
    name: "OpenAI GPT-4o",
    provider: "OpenAI",
    category: "llm",
    modelIdentifier: "gpt-4o-2024-11-20",
    latencyAvgMs: 240,
    costPerUnit: "$2.50 / 1M tokens",
    status: "active",
    isGlobalDefault: true,
    tierRequirement: "all",
    supportedLanguagesCount: 50,
    description: "Flagship multi-turn conversational reasoning model with sub-300ms time-to-first-token.",
  },
  {
    id: "eng-llm-2",
    name: "Anthropic Claude 3.5 Sonnet",
    provider: "Anthropic",
    category: "llm",
    modelIdentifier: "claude-3-5-sonnet-20241022",
    latencyAvgMs: 270,
    costPerUnit: "$3.00 / 1M tokens",
    status: "active",
    isGlobalDefault: false,
    tierRequirement: "growth_plus",
    supportedLanguagesCount: 45,
    description: "Exceptional nuance for complex objection handling, financial compliance, and technical support.",
  },
  {
    id: "eng-llm-3",
    name: "Google Gemini 1.5 Pro",
    provider: "Google",
    category: "llm",
    modelIdentifier: "gemini-1.5-pro-002",
    latencyAvgMs: 260,
    costPerUnit: "$1.25 / 1M tokens",
    status: "active",
    isGlobalDefault: false,
    tierRequirement: "all",
    supportedLanguagesCount: 65,
    description: "2M context window powerhouse for massive document search and knowledge base retrieval.",
  },
  {
    id: "eng-llm-4",
    name: "DeepSeek V3",
    provider: "DeepSeek",
    category: "llm",
    modelIdentifier: "deepseek-ai/DeepSeek-V3",
    latencyAvgMs: 190,
    costPerUnit: "$0.27 / 1M tokens",
    status: "active",
    isGlobalDefault: false,
    tierRequirement: "all",
    supportedLanguagesCount: 30,
    description: "Ultra-low cost high speed MoE model with extraordinary benchmark efficiency.",
  },
  {
    id: "eng-llm-5",
    name: "Groq Llama 3.3 70B Versatile",
    provider: "Groq LPU",
    category: "llm",
    modelIdentifier: "llama-3.3-70b-versatile",
    latencyAvgMs: 95,
    costPerUnit: "$0.59 / 1M tokens",
    status: "active",
    isGlobalDefault: false,
    tierRequirement: "growth_plus",
    supportedLanguagesCount: 25,
    description: "Instant sub-100ms conversational turn latency powered by Groq LPU silicon.",
  },
  {
    id: "eng-llm-custom-1",
    name: "Custom vLLM Self-Hosted Mistral",
    provider: "vLLM Internal",
    category: "llm",
    modelIdentifier: "mistralai/Mistral-Large-Instruct-2411",
    latencyAvgMs: 115,
    costPerUnit: "$0.10 / 1M tokens",
    status: "active",
    isGlobalDefault: false,
    tierRequirement: "enterprise_only",
    supportedLanguagesCount: 20,
    description: "Self-hosted private GPU cluster running vLLM OpenAI-compatible REST server.",
    isCustom: true,
    baseUrl: "https://vllm.internal.apexvoice.ai/v1",
  },

  // TTS
  {
    id: "eng-tts-1",
    name: "ElevenLabs Turbo v2.5",
    provider: "ElevenLabs",
    category: "tts",
    modelIdentifier: "eleven_turbo_v2_5",
    latencyAvgMs: 210,
    costPerUnit: "$0.015 / 1K chars",
    status: "active",
    isGlobalDefault: true,
    tierRequirement: "all",
    supportedLanguagesCount: 32,
    description: "Industry standard emotional expressiveness, realistic breathing, and voice cloning.",
  },
  {
    id: "eng-tts-2",
    name: "Cartesia Sonic",
    provider: "Cartesia AI",
    category: "tts",
    modelIdentifier: "sonic-english",
    latencyAvgMs: 85,
    costPerUnit: "$0.012 / 1K chars",
    status: "active",
    isGlobalDefault: false,
    tierRequirement: "all",
    supportedLanguagesCount: 15,
    description: "Sub-90ms state-space voice model designed specifically for real-time duplex phone calls.",
  },
  {
    id: "eng-tts-3",
    name: "PlayHT 2.0 Realtime",
    provider: "Play.ht",
    category: "tts",
    modelIdentifier: "PlayHT2.0-turbo",
    latencyAvgMs: 180,
    costPerUnit: "$0.014 / 1K chars",
    status: "active",
    isGlobalDefault: false,
    tierRequirement: "growth_plus",
    supportedLanguagesCount: 20,
    description: "High-fidelity voice synthesis with realistic prosody and instant voice generation.",
  },
  {
    id: "eng-tts-4",
    name: "Kokoro 82M OpenVoice",
    provider: "Hexgrad / Kokoro",
    category: "tts",
    modelIdentifier: "kokoro-v0_19",
    latencyAvgMs: 45,
    costPerUnit: "$0.005 / 1K chars",
    status: "active",
    isGlobalDefault: false,
    tierRequirement: "all",
    supportedLanguagesCount: 12,
    description: "Sub-50ms ultra-lightweight open-weight TTS synthesis model with 82M parameters.",
  },

  // STT
  {
    id: "eng-stt-1",
    name: "Deepgram Nova-3",
    provider: "Deepgram",
    category: "stt",
    modelIdentifier: "nova-3",
    latencyAvgMs: 110,
    costPerUnit: "$0.0043 / min",
    status: "active",
    isGlobalDefault: true,
    tierRequirement: "all",
    supportedLanguagesCount: 36,
    description: "Leading real-time streaming speech-to-text with industry-low word error rate (WER).",
  },
  {
    id: "eng-stt-2",
    name: "OpenAI Whisper Large v3 Turbo",
    provider: "OpenAI",
    category: "stt",
    modelIdentifier: "whisper-large-v3-turbo",
    latencyAvgMs: 160,
    costPerUnit: "$0.006 / min",
    status: "active",
    isGlobalDefault: false,
    tierRequirement: "growth_plus",
    supportedLanguagesCount: 99,
    description: "Multilingual transcription with deep noise robustness and multi-accent comprehension.",
  },
  {
    id: "eng-stt-3",
    name: "NVIDIA Parakeet TDT",
    provider: "NVIDIA NeMo",
    category: "stt",
    modelIdentifier: "nvidia/parakeet-tdt-1.1b",
    latencyAvgMs: 75,
    costPerUnit: "$0.003 / min",
    status: "active",
    isGlobalDefault: false,
    tierRequirement: "all",
    supportedLanguagesCount: 20,
    description: "Sub-80ms TDT streaming speech recognition with 1.1B parameters for high-concurrency telephony.",
  },
];

export const initialGlobalCalls: GlobalCallSession[] = [
  {
    id: "call-glob-101",
    tenantId: "tenant-1",
    tenantName: "Apex Financial AI",
    callerName: "Jonathan Vance",
    callerNumber: "+1 (415) 890-2341",
    agentName: "Marcus (Solar Advisor)",
    carrier: "Telnyx Elastic Tier-1",
    llmModel: "OpenAI GPT-4o",
    ttsVoice: "Cartesia Sonic",
    sttEngine: "Deepgram Nova-3",
    startedAt: "14:22:10",
    durationSeconds: 142,
    status: "in_progress",
    jitterMs: 4,
    packetLossPercent: 0.01,
    costEstimate: 0.19,
  },
  {
    id: "call-glob-102",
    tenantId: "tenant-2",
    tenantName: "MedCare Health Network",
    callerName: "Sarah Jenkins",
    callerNumber: "+1 (512) 349-8821",
    agentName: "Rachel (Enterprise SDR)",
    carrier: "Bandwidth.com Healthcare",
    llmModel: "Claude 3.5 Sonnet",
    ttsVoice: "Kokoro 82M OpenVoice",
    sttEngine: "NVIDIA Parakeet TDT",
    startedAt: "14:20:05",
    durationSeconds: 265,
    status: "in_progress",
    jitterMs: 6,
    packetLossPercent: 0.02,
    costEstimate: 0.35,
  },
  {
    id: "call-glob-103",
    tenantId: "tenant-3",
    tenantName: "SunPeak Growth Outbound",
    callerName: "David Miller",
    callerNumber: "+1 (305) 772-9104",
    agentName: "Marcus (Solar Advisor)",
    carrier: "Twilio Elastic SIP",
    llmModel: "DeepSeek V3",
    ttsVoice: "Cartesia Sonic",
    sttEngine: "Deepgram Nova-3",
    startedAt: "14:18:40",
    durationSeconds: 340,
    status: "completed",
    jitterMs: 8,
    packetLossPercent: 0.04,
    costEstimate: 0.28,
  },
  {
    id: "call-glob-104",
    tenantId: "tenant-1",
    tenantName: "Apex Financial AI",
    callerName: "Elena Rostova",
    callerNumber: "+1 (206) 554-1980",
    agentName: "Marcus (Solar Advisor)",
    carrier: "Telnyx Elastic Tier-1",
    llmModel: "Custom vLLM Mistral",
    ttsVoice: "Kokoro 82M OpenVoice",
    sttEngine: "NVIDIA Parakeet TDT",
    startedAt: "14:15:12",
    durationSeconds: 520,
    status: "completed",
    jitterMs: 3,
    packetLossPercent: 0.0,
    costEstimate: 0.42,
  },
];

export const initialAnnouncements: SystemAnnouncement[] = [
  {
    id: "anc-1",
    title: "Scheduled Maintenance: Telnyx SIP Trunk Route Upgrade",
    message: "Primary Telnyx US-East POP will undergo zero-downtime maintenance on Jun 24 at 02:00 UTC. Secondary failovers active.",
    severity: "warning",
    targetTenants: "all",
    publishedAt: "2026-06-17 10:00",
    active: true,
  },
  {
    id: "anc-2",
    title: "New AI Engine: Kokoro 82M & NVIDIA Parakeet TDT Now Live",
    message: "Sub-50ms Kokoro TTS and NVIDIA Parakeet STT models are now enabled across all plans.",
    severity: "info",
    targetTenants: "all",
    publishedAt: "2026-06-16 14:30",
    active: true,
  },
];

export const initialAuditLogs: AuditLogEntry[] = [
  {
    id: "aud-1",
    timestamp: "2026-06-17 15:12:04",
    actorName: "Alexander Mercer",
    actorRole: "Master Super Admin",
    action: "Assigned Plan 'Enterprise Dedicated' to tenant 'Apex Financial AI'",
    target: "Apex Financial AI (tenant-1)",
    ipAddress: "192.88.99.12",
    severity: "info",
  },
  {
    id: "aud-2",
    timestamp: "2026-06-17 14:40:19",
    actorName: "Dr. Evelyn Zhao",
    actorRole: "Infrastructure Lead",
    action: "Configured Primary SIP Trunk 'Telnyx Elastic Tier-1' to TLS 5060",
    target: "SipCarrier (sip-1)",
    ipAddress: "192.88.99.45",
    severity: "warning",
  },
  {
    id: "aud-3",
    timestamp: "2026-06-17 13:05:52",
    actorName: "Marcus Sterling",
    actorRole: "Billing Admin",
    action: "Allocated 5,000 Promotional Credits ($400 value) to MedCare Health",
    target: "MedCare Health Network (tenant-2)",
    ipAddress: "192.88.99.88",
    severity: "info",
  },
  {
    id: "aud-4",
    timestamp: "2026-06-17 11:22:15",
    actorName: "Alexander Mercer",
    actorRole: "Master Super Admin",
    action: "Created New Super Admin User 'Sarah Lin' with role Support Engineer",
    target: "SuperAdminUser (sa-4)",
    ipAddress: "192.88.99.12",
    severity: "info",
  },
  {
    id: "aud-5",
    timestamp: "2026-06-17 09:14:30",
    actorName: "Dr. Evelyn Zhao",
    actorRole: "Infrastructure Lead",
    action: "Enabled Models 'Kokoro 82M' and 'NVIDIA Parakeet TDT' for Global Fleet",
    target: "VoiceAiEngine",
    ipAddress: "192.88.99.45",
    severity: "info",
  },
];
