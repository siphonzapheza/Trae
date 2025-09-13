import axios from 'axios';
import { Tender, User, Organization, SearchFilters } from '@/types';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('tender_hub_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface LoginResponse {
  user: User;
  organization: Organization;
  token: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  organizationName: string;
  plan: 'free' | 'basic' | 'pro';
}

export interface DashboardStats {
  totalTenders: number;
  savedTenders: number;
  interestedTenders: number;
  totalValue: number;
  recentTenders: Tender[];
  urgentDeadlines: Tender[];
}

export interface AIAnalysisResult {
  id: string;
  tenderId: string;
  organizationId: string;
  summary: {
    objective: string;
    scope: string;
    deadline: string;
    eligibilityCriteria: string[];
    keyRequirements: string[];
    estimatedValue: string;
  };
  readinessScore: {
    score: number;
    breakdown: {
      criteria: string;
      matched: boolean;
      importance: 'high' | 'medium' | 'low';
      details: string;
    }[];
    recommendation: string;
    confidence: number;
  };
  processedAt: string;
  processingTimeMs: number;
}

// Auth API
export const authAPI = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<LoginResponse> => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },
};

// Tenders API
export const tendersAPI = {
  getTenders: async (filters?: SearchFilters): Promise<Tender[]> => {
    const params = new URLSearchParams();
    
    if (filters?.keywords) params.append('keywords', filters.keywords);
    if (filters?.provinces?.length) params.append('provinces', filters.provinces.join(','));
    if (filters?.categories?.length) params.append('categories', filters.categories.join(','));
    if (filters?.budgetMin) params.append('budget_min', filters.budgetMin.toString());
    if (filters?.budgetMax) params.append('budget_max', filters.budgetMax.toString());
    if (filters?.deadlineFrom) params.append('deadline_from', filters.deadlineFrom);
    if (filters?.deadlineTo) params.append('deadline_to', filters.deadlineTo);

    const response = await api.get(`/tenders?${params.toString()}`);
    return response.data;
  },

  getTender: async (id: string): Promise<Tender> => {
    const response = await api.get(`/tenders/${id}`);
    return response.data;
  },

  analyzeTender: async (id: string): Promise<AIAnalysisResult> => {
    const response = await api.post(`/tenders/${id}/analyze`);
    return response.data;
  },
};

// Dashboard API
export const dashboardAPI = {
  getStats: async (): Promise<DashboardStats> => {
    const response = await api.get('/dashboard/stats');
    return response.data;
  },
};

export default api;