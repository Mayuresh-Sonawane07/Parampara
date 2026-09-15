from datetime import datetime, timezone
from sqlalchemy import (
    Column, Integer, String, Text, Boolean, DateTime, ForeignKey, Table, Float
)
from sqlalchemy.orm import relationship
from app.database import Base

def utc_now():
    return datetime.now(timezone.utc)

# Association table between Traditions and Sources
tradition_sources = Table(
    'tradition_sources',
    Base.metadata,
    Column('tradition_id', Integer, ForeignKey('traditions.id', ondelete='CASCADE'), primary_key=True),
    Column('source_id', Integer, ForeignKey('sources.id', ondelete='CASCADE'), primary_key=True)
)

class Source(Base):
    __tablename__ = 'sources'

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    organization = Column(String(255), nullable=False)
    author = Column(String(255), nullable=True)
    source_type = Column(String(50), nullable=False)  # UNESCO, GOVERNMENT, INTACH, MUSEUM, ACADEMIC, CULTURAL_INSTITUTION, OTHER
    url = Column(Text, nullable=False)
    description = Column(Text, nullable=True)
    verification_status = Column(String(50), default='VERIFIED')
    accessed_at = Column(DateTime, default=utc_now)

    # Relationships
    traditions = relationship('Tradition', secondary=tradition_sources, back_populates='sources')
    experience_items = relationship('ExperienceItem', back_populates='source')
    ar_hotspots = relationship('ARHotspot', back_populates='source')
    quiz_questions = relationship('QuizQuestion', back_populates='source')


class Tradition(Base):
    __tablename__ = 'traditions'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    slug = Column(String(100), unique=True, index=True, nullable=False)
    region = Column(String(50), nullable=False)  # North, South, East, West
    state = Column(String(100), nullable=False)
    community = Column(String(255), nullable=True)
    category = Column(String(100), nullable=False)  # Craft, Textile/Embroidery, Dance, Visual Art
    short_description = Column(Text, nullable=False)
    description = Column(Text, nullable=False)
    historical_context = Column(Text, nullable=True)
    cultural_significance = Column(Text, nullable=True)
    preservation_context = Column(Text, nullable=True)
    experience_type = Column(String(50), nullable=False)  # CRAFT_JOURNEY, MOTIF_EXPLORER, PERFORMANCE_EXPLORER, AR_STORY
    hero_image = Column(Text, nullable=False)
    thumbnail = Column(Text, nullable=False)
    status = Column(String(50), default='PUBLISHED')
    created_at = Column(DateTime, default=utc_now)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now)

    # Relationships
    sources = relationship('Source', secondary=tradition_sources, back_populates='traditions')
    experiences = relationship('Experience', back_populates='tradition', cascade='all, delete-orphan')
    ar_experience = relationship('ARExperience', back_populates='tradition', uselist=False, cascade='all, delete-orphan')
    quiz = relationship('Quiz', back_populates='tradition', uselist=False, cascade='all, delete-orphan')
    contributions = relationship('Contribution', back_populates='tradition')


class Experience(Base):
    __tablename__ = 'experiences'

    id = Column(Integer, primary_key=True, index=True)
    tradition_id = Column(Integer, ForeignKey('traditions.id', ondelete='CASCADE'), nullable=False)
    type = Column(String(50), nullable=False)  # CRAFT_JOURNEY, MOTIF_EXPLORER, PERFORMANCE_EXPLORER, AR_STORY
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)

    tradition = relationship('Tradition', back_populates='experiences')
    items = relationship('ExperienceItem', back_populates='experience', cascade='all, delete-orphan', order_by='ExperienceItem.order_index')


class ExperienceItem(Base):
    __tablename__ = 'experience_items'

    id = Column(Integer, primary_key=True, index=True)
    experience_id = Column(Integer, ForeignKey('experiences.id', ondelete='CASCADE'), nullable=False)
    title = Column(String(255), nullable=False)
    order_index = Column(Integer, default=0)
    category_or_style = Column(String(100), nullable=True)  # E.g. Seraikella, Purulia, Mayurbhanj for Chhau; Step 1..8 for Thathera; Motif name for Toda
    description = Column(Text, nullable=False)
    cultural_context = Column(Text, nullable=True)
    regional_perspective = Column(Text, nullable=True)
    image_url = Column(Text, nullable=True)
    tool_or_material = Column(String(255), nullable=True)
    source_id = Column(Integer, ForeignKey('sources.id', ondelete='SET NULL'), nullable=True)

    experience = relationship('Experience', back_populates='items')
    source = relationship('Source', back_populates='experience_items')


class ARExperience(Base):
    __tablename__ = 'ar_experiences'

    id = Column(Integer, primary_key=True, index=True)
    tradition_id = Column(Integer, ForeignKey('traditions.id', ondelete='CASCADE'), nullable=False, unique=True)
    target_image = Column(Text, nullable=False)
    target_descriptor = Column(Text, nullable=True)
    instructions = Column(Text, nullable=False)
    status = Column(String(50), default='ACTIVE')

    tradition = relationship('Tradition', back_populates='ar_experience')
    hotspots = relationship('ARHotspot', back_populates='ar_experience', cascade='all, delete-orphan')


class ARHotspot(Base):
    __tablename__ = 'ar_hotspots'

    id = Column(Integer, primary_key=True, index=True)
    ar_experience_id = Column(Integer, ForeignKey('ar_experiences.id', ondelete='CASCADE'), nullable=False)
    name = Column(String(255), nullable=False)
    x = Column(Float, nullable=False)  # Normalized coordinate (0 to 100 or -1 to 1)
    y = Column(Float, nullable=False)
    content = Column(Text, nullable=False)
    cultural_context = Column(Text, nullable=True)
    regional_perspective = Column(Text, nullable=True)
    audio_url = Column(Text, nullable=True)
    animation_type = Column(String(50), default='pulse')
    source_id = Column(Integer, ForeignKey('sources.id', ondelete='SET NULL'), nullable=True)

    ar_experience = relationship('ARExperience', back_populates='hotspots')
    source = relationship('Source', back_populates='ar_hotspots')


class Quiz(Base):
    __tablename__ = 'quizzes'

    id = Column(Integer, primary_key=True, index=True)
    tradition_id = Column(Integer, ForeignKey('traditions.id', ondelete='CASCADE'), nullable=False, unique=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)

    tradition = relationship('Tradition', back_populates='quiz')
    questions = relationship('QuizQuestion', back_populates='quiz', cascade='all, delete-orphan', order_by='QuizQuestion.order_index')


class QuizQuestion(Base):
    __tablename__ = 'quiz_questions'

    id = Column(Integer, primary_key=True, index=True)
    quiz_id = Column(Integer, ForeignKey('quizzes.id', ondelete='CASCADE'), nullable=False)
    question_text = Column(Text, nullable=False)
    order_index = Column(Integer, default=0)
    explanation = Column(Text, nullable=False)
    source_id = Column(Integer, ForeignKey('sources.id', ondelete='SET NULL'), nullable=True)

    quiz = relationship('Quiz', back_populates='questions')
    options = relationship('QuizOption', back_populates='question', cascade='all, delete-orphan', order_by='QuizOption.order_index')
    source = relationship('Source', back_populates='quiz_questions')


class QuizOption(Base):
    __tablename__ = 'quiz_options'

    id = Column(Integer, primary_key=True, index=True)
    question_id = Column(Integer, ForeignKey('quiz_questions.id', ondelete='CASCADE'), nullable=False)
    option_text = Column(Text, nullable=False)
    is_correct = Column(Boolean, default=False, nullable=False)
    order_index = Column(Integer, default=0)

    question = relationship('QuizQuestion', back_populates='options')


class Contribution(Base):
    __tablename__ = 'contributions'

    id = Column(Integer, primary_key=True, index=True)
    contributor_name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False)
    tradition_id = Column(Integer, ForeignKey('traditions.id', ondelete='SET NULL'), nullable=True)
    tradition_name = Column(String(255), nullable=False)
    region = Column(String(100), nullable=False)
    location = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    cultural_significance = Column(Text, nullable=True)
    media_url = Column(Text, nullable=True)
    source_reference = Column(Text, nullable=True)
    consent_given = Column(Boolean, default=False, nullable=False)
    status = Column(String(50), default='PENDING')  # PENDING, APPROVED, REJECTED
    reviewer_notes = Column(Text, nullable=True)
    user_id = Column(Integer, ForeignKey('users.id', ondelete='SET NULL'), nullable=True)
    created_at = Column(DateTime, default=utc_now)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now)

    tradition = relationship('Tradition', back_populates='contributions')
    user = relationship('User', backref='contributions')


class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), unique=True, index=True, nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    is_admin = Column(Boolean, default=False)
    created_at = Column(DateTime, default=utc_now)
