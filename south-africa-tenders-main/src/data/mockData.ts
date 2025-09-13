import { Tender, AIProcessingResult, WorkspaceItem, AnalyticsData } from '@/types';

export const mockTenders: Tender[] = [
  {
    id: 'tender-1',
    title: 'Road Maintenance Services - Gauteng Province',
    description: 'Supply and delivery of road maintenance services including pothole repairs, line marking, and general road upkeep for provincial roads.',
    buyer: 'Gauteng Department of Infrastructure Development',
    province: 'Gauteng',
    budget: {
      min: 5000000,
      max: 15000000,
      currency: 'ZAR'
    },
    deadline: '2024-10-15T17:00:00Z',
    publishedDate: '2024-08-15T10:00:00Z',
    status: 'open',
    categories: ['Construction', 'Infrastructure', 'Maintenance'],
    documents: [
      {
        id: 'doc-1',
        name: 'Tender Specification.pdf',
        url: '/mock/tender-spec-1.pdf',
        type: 'pdf',
        size: 2048576
      }
    ],
    source: 'ocds',
    ocdsId: 'ZA-GP-001-2024'
  },
  {
    id: 'tender-2',
    title: 'Security Services for Government Buildings',
    description: 'Provision of comprehensive security services for government buildings in Western Cape, including access control, monitoring, and emergency response.',
    buyer: 'Western Cape Department of Public Works',
    province: 'Western Cape',
    budget: {
      min: 8000000,
      max: 12000000,
      currency: 'ZAR'
    },
    deadline: '2024-09-30T17:00:00Z',
    publishedDate: '2024-08-10T09:00:00Z',
    status: 'open',
    categories: ['Security', 'Services'],
    documents: [
      {
        id: 'doc-2',
        name: 'Security Requirements.pdf',
        url: '/mock/security-spec.pdf',
        type: 'pdf',
        size: 1536789
      }
    ],
    source: 'ocds',
    ocdsId: 'ZA-WC-002-2024'
  },
  {
    id: 'tender-3',
    title: 'ICT Equipment Supply and Installation',
    description: 'Supply, installation and configuration of ICT equipment including computers, servers, networking equipment for municipal offices.',
    buyer: 'eThekwini Municipality',
    province: 'KwaZulu-Natal',
    budget: {
      min: 3000000,
      max: 7000000,
      currency: 'ZAR'
    },
    deadline: '2024-11-20T17:00:00Z',
    publishedDate: '2024-08-20T11:00:00Z',
    status: 'open',
    categories: ['ICT', 'Equipment', 'Installation'],
    source: 'ocds',
    ocdsId: 'ZA-KZN-003-2024'
  },
  {
    id: 'tender-4',
    title: 'Water Infrastructure Development',
    description: 'Construction of water treatment facilities and pipeline infrastructure to serve rural communities in Limpopo Province.',
    buyer: 'Limpopo Department of Water and Sanitation',
    province: 'Limpopo',
    budget: {
      min: 25000000,
      max: 50000000,
      currency: 'ZAR'
    },
    deadline: '2024-12-15T17:00:00Z',
    publishedDate: '2024-08-25T08:00:00Z',
    status: 'open',
    categories: ['Construction', 'Infrastructure', 'Water'],
    documents: [
      {
        id: 'doc-4',
        name: 'Technical Specifications.pdf',
        url: '/mock/water-spec.pdf',
        type: 'pdf',
        size: 4096123
      },
      {
        id: 'doc-5',
        name: 'Environmental Impact Assessment.pdf',
        url: '/mock/eia-report.pdf',
        type: 'pdf',
        size: 6789456
      }
    ],
    source: 'ocds',
    ocdsId: 'ZA-LP-004-2024'
  },
  {
    id: 'tender-5',
    title: 'Fleet Management Services',
    description: 'Comprehensive fleet management services including vehicle maintenance, fuel management, and tracking systems for government vehicles.',
    buyer: 'Northern Cape Provincial Treasury',
    province: 'Northern Cape',
    budget: {
      min: 2000000,
      max: 4000000,
      currency: 'ZAR'
    },
    deadline: '2024-10-31T17:00:00Z',
    publishedDate: '2024-08-18T14:00:00Z',
    status: 'open',
    categories: ['Fleet Management', 'Services', 'Automotive'],
    source: 'ocds',
    ocdsId: 'ZA-NC-005-2024'
  }
];

export const mockAIResults: AIProcessingResult[] = [
  {
    id: 'ai-1',
    tenderId: 'tender-1',
    organizationId: 'org-1',
    summary: {
      objective: 'To procure comprehensive road maintenance services for provincial roads in Gauteng',
      scope: 'Pothole repairs, line marking, road surface maintenance, and general upkeep services',
      deadline: 'October 15, 2024 at 5:00 PM',
      eligibilityCriteria: [
        'CIDB grading level 7 or higher',
        'Minimum 5 years experience in road maintenance',
        'Valid BEE certificate (Level 4 or better)',
        'Financial capacity of R10 million'
      ],
      keyRequirements: [
        '24/7 emergency response capability',
        'GPS tracking for all vehicles',
        'Quality assurance program',
        'Environmental compliance certification'
      ],
      estimatedValue: 'R5 - R15 million'
    },
    readinessScore: {
      score: 78,
      breakdown: [
        {
          criteria: 'CIDB Registration',
          matched: true,
          importance: 'high',
          details: 'Company has CIDB Level 8 registration'
        },
        {
          criteria: 'Experience Requirement',
          matched: true,
          importance: 'high',
          details: '8 years of experience in road maintenance'
        },
        {
          criteria: 'BEE Compliance',
          matched: false,
          importance: 'medium',
          details: 'Current BEE Level 6 - needs improvement to Level 4'
        },
        {
          criteria: 'Geographic Coverage',
          matched: true,
          importance: 'medium',
          details: 'Currently operating in Gauteng Province'
        }
      ],
      recommendation: 'Suitable - Consider improving BEE rating before submission',
      confidence: 0.85
    },
    processedAt: '2024-08-16T10:30:00Z',
    processingTimeMs: 3200
  }
];

export const mockWorkspaceItems: WorkspaceItem[] = [
  {
    id: 'workspace-1',
    tenderId: 'tender-1',
    organizationId: 'org-1',
    status: 'interested',
    notes: [
      {
        id: 'note-1',
        content: 'Need to update BEE certificate before submission deadline',
        author: 'John Doe',
        createdAt: '2024-08-16T11:00:00Z',
        isTask: true,
        taskCompleted: false,
        taskAssignedTo: 'Jane Smith'
      },
      {
        id: 'note-2',
        content: 'Great opportunity - aligns well with our current operations',
        author: 'Jane Smith',
        createdAt: '2024-08-16T12:00:00Z',
        isTask: false
      }
    ],
    tags: ['high-priority', 'gauteng', 'roads'],
    assignedTo: 'Jane Smith',
    priority: 'high',
    createdAt: '2024-08-16T10:45:00Z',
    updatedAt: '2024-08-16T12:00:00Z',
    updatedBy: 'Jane Smith'
  },
  {
    id: 'workspace-2',
    tenderId: 'tender-2',
    organizationId: 'org-1',
    status: 'not_eligible',
    notes: [
      {
        id: 'note-3',
        content: 'We do not have security services capability',
        author: 'John Doe',
        createdAt: '2024-08-16T13:00:00Z',
        isTask: false
      }
    ],
    tags: ['not-suitable'],
    priority: 'low',
    createdAt: '2024-08-16T13:00:00Z',
    updatedAt: '2024-08-16T13:00:00Z',
    updatedBy: 'John Doe'
  }
];

export const mockAnalytics: AnalyticsData = {
  spendByBuyer: [
    {
      buyer: 'Gauteng Department of Infrastructure Development',
      totalSpend: 45000000,
      tenderCount: 12,
      avgTenderValue: 3750000
    },
    {
      buyer: 'Western Cape Department of Public Works',
      totalSpend: 32000000,
      tenderCount: 8,
      avgTenderValue: 4000000
    },
    {
      buyer: 'eThekwini Municipality',
      totalSpend: 28000000,
      tenderCount: 15,
      avgTenderValue: 1866667
    }
  ],
  trendData: [
    { month: '2024-01', tenderCount: 45, totalValue: 125000000 },
    { month: '2024-02', tenderCount: 52, totalValue: 140000000 },
    { month: '2024-03', tenderCount: 48, totalValue: 135000000 },
    { month: '2024-04', tenderCount: 55, totalValue: 155000000 },
    { month: '2024-05', tenderCount: 58, totalValue: 168000000 },
    { month: '2024-06', tenderCount: 62, totalValue: 175000000 },
  ],
  topCategories: [
    { category: 'Construction', count: 156, percentage: 32 },
    { category: 'ICT', count: 98, percentage: 20 },
    { category: 'Services', count: 87, percentage: 18 },
    { category: 'Infrastructure', count: 76, percentage: 16 },
    { category: 'Security', count: 45, percentage: 9 },
    { category: 'Other', count: 25, percentage: 5 }
  ]
};