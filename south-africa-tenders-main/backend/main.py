from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from typing import List, Optional
import uvicorn
from datetime import datetime, timedelta
import json
import uuid
from contextlib import asynccontextmanager
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import and_, or_, func

from database import get_db, create_tables
from models import User, Organization, Tender, TenderDocument, TenderAnalysis
from auth import authenticate_user, get_current_user, get_password_hash, create_access_token

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await create_tables()
    await seed_initial_data()
    yield
    # Shutdown
    pass

app = FastAPI(
    title="Tender Insight Hub API",
    description="AI-powered tender discovery and analysis platform",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080", "http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

security = HTTPBearer()

# Pydantic models
class UserResponse(BaseModel):
    id: str
    email: str
    firstName: str
    lastName: str
    role: str
    organizationId: str
    createdAt: str
    lastLogin: Optional[str] = None

class OrganizationResponse(BaseModel):
    id: str
    name: str
    plan: str
    maxUsers: int
    currentUsers: int
    createdAt: str
    subscription: Optional[dict] = None

class LoginRequest(BaseModel):
    email: str
    password: str

class RegisterRequest(BaseModel):
    email: str
    password: str
    firstName: str
    lastName: str
    organizationName: str
    plan: str

class TenderBudget(BaseModel):
    min: Optional[float] = None
    max: Optional[float] = None
    currency: str = "ZAR"

class TenderDocumentResponse(BaseModel):
    id: str
    name: str
    url: str
    type: str
    size: int

class TenderResponse(BaseModel):
    id: str
    title: str
    description: str
    buyer: str
    province: str
    budget: TenderBudget
    deadline: str
    publishedDate: str
    status: str
    categories: List[str]
    documents: Optional[List[TenderDocumentResponse]] = []
    source: str
    ocdsId: Optional[str] = None

class SearchFilters(BaseModel):
    keywords: Optional[str] = None
    provinces: Optional[List[str]] = None
    categories: Optional[List[str]] = None
    budgetMin: Optional[float] = None
    budgetMax: Optional[float] = None
    deadlineFrom: Optional[str] = None
    deadlineTo: Optional[str] = None



async def seed_initial_data():
    async for db in get_db():
        # Check if data already exists
        result = await db.execute(select(Tender))
        existing_tenders = result.scalars().all()
        if existing_tenders:
            break

        # Create sample tenders
        sample_tenders = [
            Tender(
                id="tender-1",
                title="Road Maintenance Services - Gauteng Province",
                description="Supply and delivery of road maintenance services including pothole repairs, line marking, and general road upkeep for provincial roads.",
                buyer="Gauteng Department of Infrastructure Development",
                province="Gauteng",
                budget_min=5000000,
                budget_max=15000000,
                currency="ZAR",
                deadline=datetime(2024, 10, 15, 17, 0, 0),
                published_date=datetime(2024, 8, 15, 10, 0, 0),
                status="open",
                categories=["Construction", "Infrastructure", "Maintenance"],
                source="ocds",
                ocds_id="ZA-GP-001-2024",
                organization_id="sample-org"
            ),
            Tender(
                id="tender-2",
                title="Security Services for Government Buildings",
                description="Provision of comprehensive security services for government buildings in Western Cape, including access control, monitoring, and emergency response.",
                buyer="Western Cape Department of Public Works",
                province="Western Cape",
                budget_min=8000000,
                budget_max=12000000,
                currency="ZAR",
                deadline=datetime(2024, 9, 30, 17, 0, 0),
                published_date=datetime(2024, 8, 10, 9, 0, 0),
                status="open",
                categories=["Security", "Services"],
                source="ocds",
                ocds_id="ZA-WC-002-2024",
                organization_id="sample-org"
            ),
            Tender(
                id="tender-3",
                title="ICT Equipment Supply and Installation",
                description="Supply, installation and configuration of ICT equipment including computers, servers, networking equipment for municipal offices.",
                buyer="eThekwini Municipality",
                province="KwaZulu-Natal",
                budget_min=3000000,
                budget_max=7000000,
                currency="ZAR",
                deadline=datetime(2024, 11, 20, 17, 0, 0),
                published_date=datetime(2024, 8, 20, 11, 0, 0),
                status="open",
                categories=["ICT", "Equipment", "Installation"],
                source="ocds",
                ocds_id="ZA-KZN-003-2024",
                organization_id="sample-org"
            )
        ]

        # Create sample organization
        sample_org = Organization(
            id="sample-org",
            name="Sample Organization",
            plan="free",
            max_users=10,
            current_users=1
        )

        db.add(sample_org)
        for tender in sample_tenders:
            db.add(tender)

        await db.commit()
        break

# Authentication endpoints
@app.post("/api/auth/login")
async def login(request: LoginRequest, db: AsyncSession = Depends(get_db)):
    user = await authenticate_user(db, request.email, request.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Update last login
    user.last_login = datetime.utcnow()
    await db.commit()

    # Get organization
    result = await db.execute(select(Organization).where(Organization.id == user.organization_id))
    organization = result.scalars().first()

    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=timedelta(minutes=30)
    )

    return {
        "user": {
            "id": user.id,
            "email": user.email,
            "firstName": user.first_name,
            "lastName": user.last_name,
            "role": user.role,
            "organizationId": user.organization_id,
            "createdAt": user.created_at.isoformat(),
            "lastLogin": user.last_login.isoformat() if user.last_login else None
        },
        "organization": {
            "id": organization.id,
            "name": organization.name,
            "plan": organization.plan,
            "maxUsers": organization.max_users,
            "currentUsers": organization.current_users,
            "createdAt": organization.created_at.isoformat(),
            "subscription": organization.subscription
        },
        "token": access_token
    }

@app.post("/api/auth/register")
async def register(request: RegisterRequest, db: AsyncSession = Depends(get_db)):
    # Check if user already exists
    result = await db.execute(select(User).where(User.email == request.email))
    existing_user = result.scalars().first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Create organization
    org_id = str(uuid.uuid4())
    max_users = 1 if request.plan == "free" else 3 if request.plan == "basic" else 999

    organization = Organization(
        id=org_id,
        name=request.organizationName,
        plan=request.plan,
        max_users=max_users,
        current_users=1,
        subscription={
            "status": "active" if request.plan == "free" else "trial",
            "expiresAt": (datetime.utcnow() + timedelta(days=30)).isoformat()
        }
    )

    # Create user
    user_id = str(uuid.uuid4())
    hashed_password = get_password_hash(request.password)

    user = User(
        id=user_id,
        email=request.email,
        first_name=request.firstName,
        last_name=request.lastName,
        hashed_password=hashed_password,
        role="admin",
        organization_id=org_id
    )

    db.add(organization)
    db.add(user)
    await db.commit()

    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=timedelta(minutes=30)
    )

    return {
        "user": {
            "id": user.id,
            "email": user.email,
            "firstName": user.first_name,
            "lastName": user.last_name,
            "role": user.role,
            "organizationId": user.organization_id,
            "createdAt": user.created_at.isoformat(),
            "lastLogin": user.last_login.isoformat() if user.last_login else None
        },
        "organization": {
            "id": organization.id,
            "name": organization.name,
            "plan": organization.plan,
            "maxUsers": organization.max_users,
            "currentUsers": organization.current_users,
            "createdAt": organization.created_at.isoformat(),
            "subscription": organization.subscription
        },
        "token": access_token
    }

# Tender endpoints
@app.get("/api/tenders", response_model=List[TenderResponse])
async def get_tenders(
    keywords: Optional[str] = None,
    provinces: Optional[str] = None,
    categories: Optional[str] = None,
    budget_min: Optional[float] = None,
    budget_max: Optional[float] = None,
    deadline_from: Optional[str] = None,
    deadline_to: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    """Get filtered list of tenders"""
    query = select(Tender)

    # Apply filters
    if keywords:
        keywords_lower = f"%{keywords.lower()}%"
        query = query.where(
            or_(
                func.lower(Tender.title).like(keywords_lower),
                func.lower(Tender.description).like(keywords_lower),
                # Note: For categories array, we'd need more complex filtering
            )
        )

    if provinces:
        province_list = provinces.split(",")
        query = query.where(Tender.province.in_(province_list))

    if budget_min:
        query = query.where(Tender.budget_max >= budget_min)

    if budget_max:
        query = query.where(Tender.budget_min <= budget_max)

    if deadline_from:
        query = query.where(Tender.deadline >= datetime.fromisoformat(deadline_from.replace('Z', '+00:00')))

    if deadline_to:
        query = query.where(Tender.deadline <= datetime.fromisoformat(deadline_to.replace('Z', '+00:00')))

    result = await db.execute(query)
    tenders = result.scalars().all()

    # Convert to response format
    response_tenders = []
    for tender in tenders:
        # Get documents
        doc_result = await db.execute(select(TenderDocument).where(TenderDocument.tender_id == tender.id))
        documents = doc_result.scalars().all()

        response_tenders.append({
            "id": tender.id,
            "title": tender.title,
            "description": tender.description,
            "buyer": tender.buyer,
            "province": tender.province,
            "budget": {
                "min": tender.budget_min,
                "max": tender.budget_max,
                "currency": tender.currency
            },
            "deadline": tender.deadline.isoformat() + "Z",
            "publishedDate": tender.published_date.isoformat() + "Z",
            "status": tender.status,
            "categories": tender.categories,
            "documents": [
                {
                    "id": doc.id,
                    "name": doc.name,
                    "url": doc.url,
                    "type": doc.type,
                    "size": doc.size
                } for doc in documents
            ],
            "source": tender.source,
            "ocdsId": tender.ocds_id
        })

    return response_tenders

@app.get("/api/tenders/{tender_id}", response_model=TenderResponse)
async def get_tender(tender_id: str, db: AsyncSession = Depends(get_db)):
    """Get specific tender by ID"""
    result = await db.execute(select(Tender).where(Tender.id == tender_id))
    tender = result.scalars().first()

    if not tender:
        raise HTTPException(status_code=404, detail="Tender not found")

    # Get documents
    doc_result = await db.execute(select(TenderDocument).where(TenderDocument.tender_id == tender.id))
    documents = doc_result.scalars().all()

    return {
        "id": tender.id,
        "title": tender.title,
        "description": tender.description,
        "buyer": tender.buyer,
        "province": tender.province,
        "budget": {
            "min": tender.budget_min,
            "max": tender.budget_max,
            "currency": tender.currency
        },
        "deadline": tender.deadline.isoformat() + "Z",
        "publishedDate": tender.published_date.isoformat() + "Z",
        "status": tender.status,
        "categories": tender.categories,
        "documents": [
            {
                "id": doc.id,
                "name": doc.name,
                "url": doc.url,
                "type": doc.type,
                "size": doc.size
            } for doc in documents
        ],
        "source": tender.source,
        "ocdsId": tender.ocds_id
    }

@app.post("/api/tenders/{tender_id}/analyze")
async def analyze_tender(tender_id: str, db: AsyncSession = Depends(get_db)):
    """Generate AI analysis for a tender"""
    result = await db.execute(select(Tender).where(Tender.id == tender_id))
    tender = result.scalars().first()

    if not tender:
        raise HTTPException(status_code=404, detail="Tender not found")

    # Mock AI analysis (in a real app, this would call an AI service)
    analysis = {
        "id": f"ai-{tender_id}",
        "tenderId": tender_id,
        "organizationId": tender.organization_id,
        "summary": {
            "objective": f"To procure {tender.title.lower()}",
            "scope": tender.description[:200] + "..." if len(tender.description) > 200 else tender.description,
            "deadline": tender.deadline.isoformat() + "Z",
            "eligibilityCriteria": [
                "Valid business registration",
                "Relevant industry experience",
                "Financial capacity requirements",
                "BEE compliance"
            ],
            "keyRequirements": [
                "Technical specifications compliance",
                "Quality assurance program",
                "Project management capability",
                "Local content requirements"
            ],
            "estimatedValue": f"R{tender.budget_min:,} - R{tender.budget_max:,}"
        },
        "readinessScore": {
            "score": 78,
            "breakdown": [
                {
                    "criteria": "Industry Experience",
                    "matched": True,
                    "importance": "high",
                    "details": "Company has relevant experience in this sector"
                },
                {
                    "criteria": "Geographic Coverage",
                    "matched": True,
                    "importance": "medium",
                    "details": f"Currently operating in {tender.province}"
                },
                {
                    "criteria": "Financial Capacity",
                    "matched": False,
                    "importance": "high",
                    "details": "May need additional financial backing"
                }
            ],
            "recommendation": "Suitable with some improvements needed",
            "confidence": 0.85
        },
        "processedAt": datetime.utcnow().isoformat() + "Z",
        "processingTimeMs": 2500
    }

    # Save analysis to database
    analysis_record = TenderAnalysis(
        id=analysis["id"],
        tender_id=tender_id,
        organization_id=tender.organization_id,
        summary=analysis["summary"],
        readiness_score=analysis["readinessScore"],
        processing_time_ms=analysis["processingTimeMs"]
    )

    db.add(analysis_record)
    await db.commit()

    return analysis

@app.get("/api/dashboard/stats")
async def get_dashboard_stats(db: AsyncSession = Depends(get_db)):
    """Get dashboard statistics"""
    # Get total tenders count
    total_result = await db.execute(select(func.count(Tender.id)))
    total_tenders = total_result.scalar()

    # Get total value
    value_result = await db.execute(select(func.sum(Tender.budget_max)))
    total_value = value_result.scalar() or 0

    # Get recent tenders
    recent_result = await db.execute(
        select(Tender).order_by(Tender.published_date.desc()).limit(3)
    )
    recent_tenders = recent_result.scalars().all()

    # Get urgent deadlines (within 30 days)
    urgent_result = await db.execute(
        select(Tender).where(Tender.deadline <= datetime.utcnow() + timedelta(days=30))
    )
    urgent_tenders = urgent_result.scalars().all()

    # Convert recent tenders to response format
    recent_tenders_response = []
    for tender in recent_tenders:
        recent_tenders_response.append({
            "id": tender.id,
            "title": tender.title,
            "description": tender.description,
            "buyer": tender.buyer,
            "province": tender.province,
            "budget": {
                "min": tender.budget_min,
                "max": tender.budget_max,
                "currency": tender.currency
            },
            "deadline": tender.deadline.isoformat() + "Z",
            "publishedDate": tender.published_date.isoformat() + "Z",
            "status": tender.status,
            "categories": tender.categories,
            "source": tender.source,
            "ocdsId": tender.ocds_id
        })

    # Convert urgent tenders to response format
    urgent_tenders_response = []
    for tender in urgent_tenders:
        urgent_tenders_response.append({
            "id": tender.id,
            "title": tender.title,
            "description": tender.description,
            "buyer": tender.buyer,
            "province": tender.province,
            "budget": {
                "min": tender.budget_min,
                "max": tender.budget_max,
                "currency": tender.currency
            },
            "deadline": tender.deadline.isoformat() + "Z",
            "publishedDate": tender.published_date.isoformat() + "Z",
            "status": tender.status,
            "categories": tender.categories,
            "source": tender.source,
            "ocdsId": tender.ocds_id
        })

    return {
        "totalTenders": total_tenders,
        "savedTenders": 2,  # This would be calculated from user preferences in a real app
        "interestedTenders": 1,  # This would be calculated from user interactions in a real app
        "totalValue": total_value,
        "recentTenders": recent_tenders_response,
        "urgentDeadlines": urgent_tenders_response
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)