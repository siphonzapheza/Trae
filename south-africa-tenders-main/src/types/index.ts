// Core types for Tender Insight Hub

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'member' | 'viewer';
  organizationId: string;
  createdAt: string;
  lastLogin?: string;
}

export interface Organization {
  id: string;
  name: string;
  plan: 'free' | 'basic' | 'pro';
  maxUsers: number;
  currentUsers: number;
  createdAt: string;
  subscription?: {
    status: 'active' | 'inactive' | 'trial';
    expiresAt: string;
  };
}

export interface CompanyProfile {
  id: string;
  organizationId: string;
  industrySector: string[];
  servicesProvided: string[];
  certifications: {
    cidb?: string;
    bbbee?: string;
    other?: string[];
  };
  geographicCoverage: string[];
  yearsOfExperience: number;
  contactInfo: {
    phone: string;
    address: string;
    website?: string;
  };
  updatedAt: string;
}

export interface Tender {
  id: string;
  title: string;
  description: string;
  buyer: string;
  province: string;
  budget: {
    min?: number;
    max?: number;
    currency: string;
  };
  deadline: string;
  publishedDate: string;
  status: 'open' | 'closed' | 'awarded';
  categories: string[];
  documents?: TenderDocument[];
  source: 'ocds' | 'manual';
  ocdsId?: string;
}

export interface TenderDocument {
  id: string;
  name: string;
  url: string;
  type: 'pdf' | 'docx' | 'zip';
  size: number;
}

export interface AIProcessingResult {
  id: string;
  tenderId: string;
  organizationId: string;
  summary: {
    objective: string;
    scope: string;
    deadline: string;
    eligibilityCriteria: string[];
    keyRequirements: string[];
    estimatedValue?: string;
  };
  readinessScore?: ReadinessScore;
  processedAt: string;
  processingTimeMs: number;
}

export interface ReadinessScore {
  score: number; // 0-100
  breakdown: {
    criteria: string;
    matched: boolean;
    importance: 'high' | 'medium' | 'low';
    details: string;
  }[];
  recommendation: string;
  confidence: number; // 0-1
}

export interface WorkspaceItem {
  id: string;
  tenderId: string;
  organizationId: string;
  status: 'pending' | 'interested' | 'not_eligible' | 'submitted' | 'awarded' | 'rejected';
  notes: WorkspaceNote[];
  tags: string[];
  assignedTo?: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
  updatedBy: string;
}

export interface WorkspaceNote {
  id: string;
  content: string;
  author: string;
  createdAt: string;
  isTask: boolean;
  taskCompleted?: boolean;
  taskAssignedTo?: string;
}

export interface SearchFilters {
  keywords?: string;
  provinces?: string[];
  deadlineFrom?: string;
  deadlineTo?: string;
  buyers?: string[];
  budgetMin?: number;
  budgetMax?: number;
  categories?: string[];
}

export interface SearchResult {
  tenders: Tender[];
  total: number;
  page: number;
  limit: number;
  filters: SearchFilters;
}

export interface AnalyticsData {
  spendByBuyer: {
    buyer: string;
    totalSpend: number;
    tenderCount: number;
    avgTenderValue: number;
  }[];
  trendData: {
    month: string;
    tenderCount: number;
    totalValue: number;
  }[];
  topCategories: {
    category: string;
    count: number;
    percentage: number;
  }[];
}

export type SaasFeature = 
  | 'search_unlimited'
  | 'ai_summary'
  | 'readiness_check'
  | 'workspace_export'
  | 'team_collaboration'
  | 'api_access'
  | 'analytics_dashboard';

export interface PlanLimits {
  maxUsers: number;
  maxSearchesPerWeek: number;
  features: SaasFeature[];
}