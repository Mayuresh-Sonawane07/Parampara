from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, EmailStr, Field, ConfigDict

# ----------------- Source Schemas -----------------
class SourceBase(BaseModel):
    title: str
    organization: str
    author: Optional[str] = None
    source_type: str
    url: str
    description: Optional[str] = None
    verification_status: str = "VERIFIED"

class SourceResponse(SourceBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    accessed_at: datetime

# ----------------- Experience Schemas -----------------
class ExperienceItemResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    experience_id: int
    title: str
    order_index: int
    category_or_style: Optional[str] = None
    description: str
    cultural_context: Optional[str] = None
    regional_perspective: Optional[str] = None
    image_url: Optional[str] = None
    tool_or_material: Optional[str] = None
    source: Optional[SourceResponse] = None

class ExperienceResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    tradition_id: int
    type: str
    title: str
    description: Optional[str] = None
    items: List[ExperienceItemResponse] = []

# ----------------- AR Schemas -----------------
class ARHotspotResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    ar_experience_id: int
    name: str
    x: float
    y: float
    content: str
    cultural_context: Optional[str] = None
    regional_perspective: Optional[str] = None
    audio_url: Optional[str] = None
    animation_type: str = "pulse"
    source: Optional[SourceResponse] = None

class ARExperienceResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    tradition_id: int
    target_image: str
    target_descriptor: Optional[str] = None
    instructions: str
    status: str
    hotspots: List[ARHotspotResponse] = []

# ----------------- Quiz Schemas -----------------
class QuizOptionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    option_text: str
    order_index: int

class QuizQuestionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    question_text: str
    order_index: int
    options: List[QuizOptionResponse] = []

class QuizQuestionResult(BaseModel):
    question_id: int
    question_text: str
    selected_option_id: Optional[int] = None
    correct_option_id: int
    is_correct: bool
    explanation: str
    source: Optional[SourceResponse] = None

class QuizResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    tradition_id: int
    title: str
    description: Optional[str] = None
    questions: List[QuizQuestionResponse] = []

class QuizSubmitAnswer(BaseModel):
    question_id: int
    option_id: int

class QuizSubmitRequest(BaseModel):
    answers: List[QuizSubmitAnswer]

class QuizSubmitResponse(BaseModel):
    quiz_id: int
    total_questions: int
    correct_answers: int
    score_percentage: float
    results: List[QuizQuestionResult]

# ----------------- Contribution Schemas -----------------
class ContributionCreate(BaseModel):
    contributor_name: str = Field(..., min_length=2, max_length=255)
    email: EmailStr
    tradition_id: Optional[int] = None
    tradition_name: str = Field(..., min_length=2, max_length=255)
    region: str = Field(..., min_length=2, max_length=100)
    location: str = Field(..., min_length=2, max_length=255)
    description: str = Field(..., min_length=20)
    cultural_significance: Optional[str] = None
    media_url: Optional[str] = None
    source_reference: Optional[str] = None
    consent_given: bool = Field(..., description="Explicit consent is required")

class ContributionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    contributor_name: str
    email: str
    tradition_id: Optional[int] = None
    tradition_name: str
    region: str
    location: str
    description: str
    cultural_significance: Optional[str] = None
    media_url: Optional[str] = None
    source_reference: Optional[str] = None
    consent_given: bool
    status: str
    reviewer_notes: Optional[str] = None
    created_at: datetime

class ContributionUpdate(BaseModel):
    status: str = Field(..., pattern="^(APPROVED|REJECTED|PENDING)$")
    reviewer_notes: Optional[str] = None

# ----------------- Tradition Schemas -----------------
class TraditionSummary(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    name: str
    slug: str
    region: str
    state: str
    community: Optional[str] = None
    category: str
    short_description: str
    experience_type: str
    hero_image: str
    thumbnail: str
    status: str

class TraditionDetail(TraditionSummary):
    model_config = ConfigDict(from_attributes=True)
    description: str
    historical_context: Optional[str] = None
    cultural_significance: Optional[str] = None
    preservation_context: Optional[str] = None
    sources: List[SourceResponse] = []
    experiences: List[ExperienceResponse] = []
    ar_experience: Optional[ARExperienceResponse] = None
    approved_contributions: List[ContributionResponse] = []
    has_quiz: bool = False

# ----------------- Admin & Auth Schemas -----------------
class AdminLoginRequest(BaseModel):
    username: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    username: str
    is_admin: bool

class AdminStatsResponse(BaseModel):
    total_traditions: int
    pending_contributions: int
    approved_contributions: int
    rejected_contributions: int
    total_sources: int

class SourceCreate(BaseModel):
    title: str
    organization: str
    author: Optional[str] = None
    source_type: str = "UNESCO"
    url: str
    description: Optional[str] = None
    verification_status: str = "VERIFIED"

class SourceUpdate(BaseModel):
    title: Optional[str] = None
    organization: Optional[str] = None
    author: Optional[str] = None
    source_type: Optional[str] = None
    url: Optional[str] = None
    description: Optional[str] = None
    verification_status: Optional[str] = None

class TraditionCreate(BaseModel):
    name: str
    slug: str
    region: str
    state: str
    community: Optional[str] = None
    category: str
    short_description: str
    description: str
    historical_context: Optional[str] = None
    cultural_significance: Optional[str] = None
    preservation_context: Optional[str] = None
    experience_type: str = "CRAFT_JOURNEY"
    hero_image: str = "/heritage-images/thathera.jpg"
    thumbnail: str = "/heritage-images/thathera.jpg"
    status: str = "PUBLISHED"

class TraditionUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    region: Optional[str] = None
    state: Optional[str] = None
    community: Optional[str] = None
    category: Optional[str] = None
    short_description: Optional[str] = None
    description: Optional[str] = None
    historical_context: Optional[str] = None
    cultural_significance: Optional[str] = None
    preservation_context: Optional[str] = None
    experience_type: Optional[str] = None
    hero_image: Optional[str] = None
    thumbnail: Optional[str] = None
    status: Optional[str] = None

class AdminTraditionItem(TraditionSummary):
    model_config = ConfigDict(from_attributes=True)
    hotspots_count: int = 0
    quiz_count: int = 0
    contributions_count: int = 0
    sources_count: int = 0

class AdminAuditReport(BaseModel):
    database_status: str
    server_timestamp: datetime
    metrics: dict
    narration_voice_engines: dict
    heritage_assets_verified: List[str]
