import {
  TraditionSummary,
  TraditionDetail,
  Experience,
  Quiz,
  QuizSubmitResponse,
  Contribution,
  ContributionCreate,
  Source,
  AdminStats,
  AdminTradition,
  TraditionCreateInput,
  TraditionUpdateInput,
  SourceCreateInput,
  SourceUpdateInput,
  AdminAuditData
} from '../types';

const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '') + '/api';

export async function fetchTraditions(region?: string, category?: string): Promise<TraditionSummary[]> {
  const params = new URLSearchParams();
  if (region) params.append('region', region);
  if (category) params.append('category', category);
  const url = `${API_BASE}/traditions${params.toString() ? '?' + params.toString() : ''}`;
  
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch traditions: ${res.statusText}`);
  return res.json();
}

export async function fetchTradition(slug: string): Promise<TraditionDetail> {
  const res = await fetch(`${API_BASE}/traditions/${slug}`);
  if (!res.ok) throw new Error(`Tradition not found`);
  return res.json();
}

export async function fetchExperience(slug: string): Promise<Experience> {
  const res = await fetch(`${API_BASE}/traditions/${slug}/experience`);
  if (!res.ok) throw new Error(`Experience not found`);
  return res.json();
}

export async function fetchQuiz(slug: string): Promise<Quiz> {
  const res = await fetch(`${API_BASE}/traditions/${slug}/quiz`);
  if (!res.ok) throw new Error(`Quiz not found`);
  return res.json();
}

export async function submitQuiz(
  quizId: number,
  answers: { question_id: number; option_id: number }[]
): Promise<QuizSubmitResponse> {
  const res = await fetch(`${API_BASE}/quiz/${quizId}/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ answers }),
  });
  if (!res.ok) throw new Error(`Failed to submit quiz`);
  return res.json();
}

export async function submitContribution(data: ContributionCreate): Promise<Contribution> {
  const res = await fetch(`${API_BASE}/contributions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Failed to submit contribution' }));
    throw new Error(err.detail || 'Failed to submit contribution');
  }
  return res.json();
}

export async function fetchSources(): Promise<Source[]> {
  const res = await fetch(`${API_BASE}/sources`);
  if (!res.ok) throw new Error(`Failed to fetch sources`);
  return res.json();
}

export async function fetchSource(id: number): Promise<Source> {
  const res = await fetch(`${API_BASE}/sources/${id}`);
  if (!res.ok) throw new Error(`Source not found`);
  return res.json();
}

// Admin Auth & Review
export async function adminLogin(username: string, password: string): Promise<{ access_token: string }> {
  const res = await fetch(`${API_BASE}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Authentication failed' }));
    throw new Error(err.detail || 'Authentication failed');
  }
  return res.json();
}

export async function fetchAdminContributions(token: string, status?: string): Promise<Contribution[]> {
  const url = `${API_BASE}/admin/contributions${status ? '?status=' + status : ''}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Failed to fetch contributions: ${res.statusText}`);
  return res.json();
}

export async function reviewContribution(
  token: string,
  id: number,
  status: 'APPROVED' | 'REJECTED' | 'PENDING',
  reviewerNotes?: string
): Promise<Contribution> {
  const res = await fetch(`${API_BASE}/admin/contributions/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status, reviewer_notes: reviewerNotes }),
  });
  if (!res.ok) throw new Error(`Failed to update contribution status`);
  return res.json();
}

export async function fetchAdminStats(token: string): Promise<AdminStats> {
  const res = await fetch(`${API_BASE}/admin/stats`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Failed to fetch admin stats`);
  return res.json();
}

export async function deleteAdminContribution(token: string, id: number): Promise<{ message: string }> {
  const res = await fetch(`${API_BASE}/admin/contributions/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Failed to delete contribution`);
  return res.json();
}

export async function fetchAdminTraditions(token: string): Promise<AdminTradition[]> {
  const res = await fetch(`${API_BASE}/admin/traditions`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Failed to fetch admin traditions`);
  return res.json();
}

export async function createAdminTradition(token: string, data: TraditionCreateInput): Promise<AdminTradition> {
  const res = await fetch(`${API_BASE}/admin/traditions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Failed to create tradition' }));
    throw new Error(err.detail || 'Failed to create tradition');
  }
  return res.json();
}

export async function updateAdminTradition(
  token: string,
  id: number,
  data: TraditionUpdateInput
): Promise<AdminTradition> {
  const res = await fetch(`${API_BASE}/admin/traditions/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Failed to update tradition' }));
    throw new Error(err.detail || 'Failed to update tradition');
  }
  return res.json();
}

export async function deleteAdminTradition(token: string, id: number): Promise<{ message: string }> {
  const res = await fetch(`${API_BASE}/admin/traditions/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Failed to delete tradition`);
  return res.json();
}

export async function fetchAdminSources(token: string): Promise<Source[]> {
  const res = await fetch(`${API_BASE}/admin/sources`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Failed to fetch admin sources`);
  return res.json();
}

export async function createAdminSource(token: string, data: SourceCreateInput): Promise<Source> {
  const res = await fetch(`${API_BASE}/admin/sources`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Failed to add source' }));
    throw new Error(err.detail || 'Failed to add source');
  }
  return res.json();
}

export async function updateAdminSource(
  token: string,
  id: number,
  data: SourceUpdateInput
): Promise<Source> {
  const res = await fetch(`${API_BASE}/admin/sources/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Failed to update source' }));
    throw new Error(err.detail || 'Failed to update source');
  }
  return res.json();
}

export async function deleteAdminSource(token: string, id: number): Promise<{ message: string }> {
  const res = await fetch(`${API_BASE}/admin/sources/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Failed to delete source citation`);
  return res.json();
}

export async function fetchAdminAudit(token: string): Promise<AdminAuditData> {
  const res = await fetch(`${API_BASE}/admin/audit`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Failed to fetch system audit report`);
  return res.json();
}

