const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

export interface DailyCallMetric {
  date: string;
  total_calls: number;
  completed_calls: number;
  failed_calls: number;
  avg_duration_seconds: number;
}

export interface DailyLeadMetric {
  date: string;
  total_leads: number;
  interested_leads: number;
}

export interface AnalyticsResponse {
  call_analytics: DailyCallMetric[];
  lead_analytics: DailyLeadMetric[];
}

export interface RAGSearchResult {
  chunk_id: string;
  document_title: string;
  content: string;
  score: number;
}

// 1. Analytics & Fleet Overview
export async function fetchDailyAnalytics(campaignId: string = ''): Promise<AnalyticsResponse> {
  try {
    const url = campaignId ? `${API_BASE_URL}/analytics/daily?campaign_id=${campaignId}` : `${API_BASE_URL}/analytics/daily`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error('Failed to fetch analytics:', error);
    return { call_analytics: [], lead_analytics: [] };
  }
}

// 2. RAG Knowledge Base Retrieval API
export async function searchRAGKnowledgeBase(query: string, topK: number = 3): Promise<RAGSearchResult[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/rag/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, top_k: topK }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.chunks || [];
  } catch (error) {
    console.error('Failed to search RAG KB:', error);
    return [];
  }
}

// 3. Voice Agent Call Controllers
export async function startVoiceCall(callId: string, leadId: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/calls/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ call_id: callId, lead_id: leadId }),
    });
    return await res.json();
  } catch (error) {
    console.error('Start call error:', error);
    return null;
  }
}

export async function endVoiceCall(callId: string, duration: number, transcript: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/calls/end`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ call_id: callId, duration, transcript }),
    });
    return await res.json();
  } catch (error) {
    console.error('End call error:', error);
    return null;
  }
}

// 4. Lead Status Update
export async function updateLeadStatus(leadId: string, status: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/leads/update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lead_id: leadId, status }),
    });
    return await res.json();
  } catch (error) {
    console.error('Update lead error:', error);
    return null;
  }
}

// 5. Live WebSockets URL
export function getVoiceWebSocketURL(): string {
  const wsBase = API_BASE_URL.replace(/^http/, 'ws');
  return `${wsBase}/ws/calls`;
}
