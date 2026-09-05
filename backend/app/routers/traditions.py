from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas

router = APIRouter(prefix="/api", tags=["Traditions & Experiences"])

@router.get("/traditions", response_model=List[schemas.TraditionSummary])
def get_traditions(
    region: Optional[str] = Query(None, description="Filter by region: North, South, East, West"),
    category: Optional[str] = Query(None, description="Filter by category"),
    experience: Optional[str] = Query(None, description="Filter by experience: AR, Interactive, Story, Audio"),
    db: Session = Depends(get_db)
):
    query = db.query(models.Tradition).filter(models.Tradition.status == "PUBLISHED")
    if region and region.lower() != 'all':
        query = query.filter(models.Tradition.region.ilike(f"%{region}%"))
    if category and category.lower() != 'all':
        query = query.filter(models.Tradition.category.ilike(f"%{category}%"))
    if experience and experience.lower() != 'all':
        exp = experience.lower()
        if exp == 'ar':
            query = query.filter(models.Tradition.experience_type == 'AR_STORY')
        elif exp == 'story':
            query = query.filter(models.Tradition.experience_type.in_(['CRAFT_JOURNEY', 'AR_STORY']))
        elif exp == 'audio':
            query = query.filter(models.Tradition.experience_type.in_(['PERFORMANCE_EXPLORER', 'AR_STORY']))
        elif exp == 'interactive':
            query = query.filter(models.Tradition.experience_type.in_(['CRAFT_JOURNEY', 'MOTIF_EXPLORER', 'PERFORMANCE_EXPLORER']))
    return query.all()

@router.get("/traditions/{slug}", response_model=schemas.TraditionDetail)
def get_tradition_by_slug(slug: str, db: Session = Depends(get_db)):
    tradition = db.query(models.Tradition).filter(models.Tradition.slug == slug).first()
    if not tradition:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Tradition with slug '{slug}' not found")
    
    has_quiz = tradition.quiz is not None

    # Retrieve only APPROVED community contributions (never PENDING or REJECTED)
    approved_contribs = db.query(models.Contribution).filter(
        models.Contribution.status == "APPROVED",
        (models.Contribution.tradition_id == tradition.id) | 
        (models.Contribution.tradition_name.ilike(f"%{tradition.slug}%")) |
        (models.Contribution.tradition_name.ilike(f"%{tradition.name.split()[0]}%"))
    ).order_by(models.Contribution.created_at.desc()).all()
    
    return schemas.TraditionDetail(
        id=tradition.id,
        name=tradition.name,
        slug=tradition.slug,
        region=tradition.region,
        state=tradition.state,
        community=tradition.community,
        category=tradition.category,
        short_description=tradition.short_description,
        description=tradition.description,
        historical_context=tradition.historical_context,
        cultural_significance=tradition.cultural_significance,
        preservation_context=tradition.preservation_context,
        experience_type=tradition.experience_type,
        hero_image=tradition.hero_image,
        thumbnail=tradition.thumbnail,
        status=tradition.status,
        sources=[schemas.SourceResponse.model_validate(s) for s in tradition.sources],
        experiences=[schemas.ExperienceResponse.model_validate(e) for e in tradition.experiences],
        ar_experience=schemas.ARExperienceResponse.model_validate(tradition.ar_experience) if tradition.ar_experience else None,
        approved_contributions=[schemas.ContributionResponse.model_validate(c) for c in approved_contribs],
        has_quiz=has_quiz
    )

@router.get("/traditions/{slug}/experience", response_model=schemas.ExperienceResponse)
def get_tradition_experience(slug: str, db: Session = Depends(get_db)):
    tradition = db.query(models.Tradition).filter(models.Tradition.slug == slug).first()
    if not tradition:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tradition not found")
    
    experience = db.query(models.Experience).filter(models.Experience.tradition_id == tradition.id).first()
    if not experience:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Experience not configured for this tradition")
    
    return experience

@router.get("/traditions/{slug}/quiz", response_model=schemas.QuizResponse)
def get_tradition_quiz(slug: str, db: Session = Depends(get_db)):
    tradition = db.query(models.Tradition).filter(models.Tradition.slug == slug).first()
    if not tradition:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tradition not found")
    
    quiz = db.query(models.Quiz).filter(models.Quiz.tradition_id == tradition.id).first()
    if not quiz:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Quiz not found for this tradition")
    
    return quiz

@router.post("/quiz/{quiz_id}/submit", response_model=schemas.QuizSubmitResponse)
def submit_quiz(quiz_id: int, submission: schemas.QuizSubmitRequest, db: Session = Depends(get_db)):
    quiz = db.query(models.Quiz).filter(models.Quiz.id == quiz_id).first()
    if not quiz:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Quiz not found")
    
    user_answers_map = {ans.question_id: ans.option_id for ans in submission.answers}
    
    results = []
    correct_count = 0
    total_questions = len(quiz.questions)
    
    for question in quiz.questions:
        selected_option_id = user_answers_map.get(question.id)
        
        correct_option = next((opt for opt in question.options if opt.is_correct), None)
        correct_option_id = correct_option.id if correct_option else 0
        
        is_correct = (selected_option_id == correct_option_id) if selected_option_id else False
        if is_correct:
            correct_count += 1
            
        results.append(schemas.QuizQuestionResult(
            question_id=question.id,
            question_text=question.question_text,
            selected_option_id=selected_option_id,
            correct_option_id=correct_option_id,
            is_correct=is_correct,
            explanation=question.explanation,
            source=schemas.SourceResponse.model_validate(question.source) if question.source else None
        ))
        
    score_pct = round((correct_count / total_questions) * 100, 1) if total_questions > 0 else 0.0
    
    return schemas.QuizSubmitResponse(
        quiz_id=quiz.id,
        total_questions=total_questions,
        correct_answers=correct_count,
        score_percentage=score_pct,
        results=results
    )
