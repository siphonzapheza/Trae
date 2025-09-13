from sqlalchemy import Column, Integer, String, DateTime, Text, Float, ForeignKey, Boolean, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    first_name = Column(String)
    last_name = Column(String)
    hashed_password = Column(String)
    role = Column(String, default="user")
    organization_id = Column(String, ForeignKey("organizations.id"))
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    last_login = Column(DateTime, nullable=True)

    organization = relationship("Organization", back_populates="users")

class Organization(Base):
    __tablename__ = "organizations"

    id = Column(String, primary_key=True, index=True)
    name = Column(String)
    plan = Column(String, default="free")
    max_users = Column(Integer, default=1)
    current_users = Column(Integer, default=1)
    created_at = Column(DateTime, default=datetime.utcnow)
    subscription = Column(JSON, nullable=True)

    users = relationship("User", back_populates="organization")
    tenders = relationship("Tender", back_populates="organization")

class Tender(Base):
    __tablename__ = "tenders"

    id = Column(String, primary_key=True, index=True)
    title = Column(String)
    description = Column(Text)
    buyer = Column(String)
    province = Column(String)
    budget_min = Column(Float, nullable=True)
    budget_max = Column(Float, nullable=True)
    currency = Column(String, default="ZAR")
    deadline = Column(DateTime)
    published_date = Column(DateTime, default=datetime.utcnow)
    status = Column(String, default="open")
    categories = Column(JSON)  # List of categories
    source = Column(String, default="ocds")
    ocds_id = Column(String, nullable=True)
    organization_id = Column(String, ForeignKey("organizations.id"))

    organization = relationship("Organization", back_populates="tenders")
    documents = relationship("TenderDocument", back_populates="tender")
    analyses = relationship("TenderAnalysis", back_populates="tender")

class TenderDocument(Base):
    __tablename__ = "tender_documents"

    id = Column(String, primary_key=True, index=True)
    tender_id = Column(String, ForeignKey("tenders.id"))
    name = Column(String)
    url = Column(String)
    type = Column(String)
    size = Column(Integer)

    tender = relationship("Tender", back_populates="documents")

class TenderAnalysis(Base):
    __tablename__ = "tender_analyses"

    id = Column(String, primary_key=True, index=True)
    tender_id = Column(String, ForeignKey("tenders.id"))
    organization_id = Column(String, ForeignKey("organizations.id"))
    summary = Column(JSON)
    readiness_score = Column(JSON)
    processed_at = Column(DateTime, default=datetime.utcnow)
    processing_time_ms = Column(Integer)

    tender = relationship("Tender", back_populates="analyses")
