from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas, auth

router = APIRouter(prefix="/api/admin", tags=["Admin Verification"])

@router.post("/login", response_model=schemas.TokenResponse)
def admin_login(creds: schemas.AdminLoginRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.username == creds.username).first()
    if not user or not auth.verify_password(creds.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"}
        )
    
    if not user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access denied"
        )

    access_token = auth.create_access_token(data={"sub": user.username})
    return schemas.TokenResponse(
        access_token=access_token,
        token_type="bearer",
        username=user.username,
        is_admin=user.is_admin
    )

@router.get("/contributions", response_model=List[schemas.ContributionResponse])
def list_contributions(
    status_filter: Optional[str] = Query(None, alias="status", description="PENDING, APPROVED, REJECTED"),
    skip: int = 0,
    limit: int = 100,
    current_admin: models.User = Depends(auth.get_current_admin),
    db: Session = Depends(get_db)
):
    query = db.query(models.Contribution)
    if status_filter and status_filter.strip().upper() != "ALL":
        query = query.filter(models.Contribution.status == status_filter.strip().upper())
    return query.order_by(models.Contribution.created_at.desc()).offset(skip).limit(limit).all()

@router.patch("/contributions/{contribution_id}", response_model=schemas.ContributionResponse)
def review_contribution(
    contribution_id: int,
    review_data: schemas.ContributionUpdate,
    current_admin: models.User = Depends(auth.get_current_admin),
    db: Session = Depends(get_db)
):
    contribution = db.query(models.Contribution).filter(models.Contribution.id == contribution_id).first()
    if not contribution:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Contribution not found"
        )
    
    contribution.status = review_data.status
    if review_data.reviewer_notes is not None:
        contribution.reviewer_notes = review_data.reviewer_notes
        
    db.commit()
    db.refresh(contribution)
    return contribution

@router.get("/stats", response_model=schemas.AdminStatsResponse)
def get_admin_stats(
    current_admin: models.User = Depends(auth.get_current_admin),
    db: Session = Depends(get_db)
):
    total_traditions = db.query(models.Tradition).count()
    pending_contribs = db.query(models.Contribution).filter(models.Contribution.status == "PENDING").count()
    approved_contribs = db.query(models.Contribution).filter(models.Contribution.status == "APPROVED").count()
    rejected_contribs = db.query(models.Contribution).filter(models.Contribution.status == "REJECTED").count()
    total_sources = db.query(models.Source).count()
    
    return schemas.AdminStatsResponse(
        total_traditions=total_traditions,
        pending_contributions=pending_contribs,
        approved_contributions=approved_contribs,
        rejected_contributions=rejected_contribs,
        total_sources=total_sources
    )

@router.delete("/contributions/{contribution_id}", status_code=status.HTTP_200_OK)
def delete_admin_contribution(
    contribution_id: int,
    current_admin: models.User = Depends(auth.get_current_admin),
    db: Session = Depends(get_db)
):
    contribution = db.query(models.Contribution).filter(models.Contribution.id == contribution_id).first()
    if not contribution:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Contribution not found")
    db.delete(contribution)
    db.commit()
    return {"message": f"Contribution #{contribution_id} deleted successfully"}

# ----------------- Traditions Management -----------------
@router.get("/traditions", response_model=List[schemas.AdminTraditionItem])
def list_admin_traditions(
    current_admin: models.User = Depends(auth.get_current_admin),
    db: Session = Depends(get_db)
):
    traditions = db.query(models.Tradition).order_by(models.Tradition.id.asc()).all()
    results = []
    for t in traditions:
        hotspots_count = len(t.ar_experience.hotspots) if t.ar_experience else 0
        quiz_count = len(t.quiz.questions) if t.quiz else 0
        contributions_count = db.query(models.Contribution).filter(models.Contribution.tradition_id == t.id).count()
        sources_count = len(t.sources)
        results.append(schemas.AdminTraditionItem(
            id=t.id,
            name=t.name,
            slug=t.slug,
            region=t.region,
            state=t.state,
            community=t.community,
            category=t.category,
            short_description=t.short_description,
            experience_type=t.experience_type,
            hero_image=t.hero_image,
            thumbnail=t.thumbnail,
            status=t.status,
            hotspots_count=hotspots_count,
            quiz_count=quiz_count,
            contributions_count=contributions_count,
            sources_count=sources_count
        ))
    return results

@router.post("/traditions", response_model=schemas.AdminTraditionItem, status_code=status.HTTP_201_CREATED)
def create_admin_tradition(
    tradition_in: schemas.TraditionCreate,
    current_admin: models.User = Depends(auth.get_current_admin),
    db: Session = Depends(get_db)
):
    existing = db.query(models.Tradition).filter(models.Tradition.slug == tradition_in.slug).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Tradition with slug '{tradition_in.slug}' already exists."
        )
    
    tradition = models.Tradition(
        name=tradition_in.name,
        slug=tradition_in.slug,
        region=tradition_in.region,
        state=tradition_in.state,
        community=tradition_in.community,
        category=tradition_in.category,
        short_description=tradition_in.short_description,
        description=tradition_in.description,
        historical_context=tradition_in.historical_context,
        cultural_significance=tradition_in.cultural_significance,
        preservation_context=tradition_in.preservation_context,
        experience_type=tradition_in.experience_type,
        hero_image=tradition_in.hero_image,
        thumbnail=tradition_in.thumbnail,
        status=tradition_in.status
    )
    db.add(tradition)
    db.commit()
    db.refresh(tradition)
    return schemas.AdminTraditionItem(
        id=tradition.id,
        name=tradition.name,
        slug=tradition.slug,
        region=tradition.region,
        state=tradition.state,
        community=tradition.community,
        category=tradition.category,
        short_description=tradition.short_description,
        experience_type=tradition.experience_type,
        hero_image=tradition.hero_image,
        thumbnail=tradition.thumbnail,
        status=tradition.status,
        hotspots_count=0,
        quiz_count=0,
        contributions_count=0,
        sources_count=0
    )

@router.patch("/traditions/{tradition_id}", response_model=schemas.AdminTraditionItem)
def update_admin_tradition(
    tradition_id: int,
    update_data: schemas.TraditionUpdate,
    current_admin: models.User = Depends(auth.get_current_admin),
    db: Session = Depends(get_db)
):
    tradition = db.query(models.Tradition).filter(models.Tradition.id == tradition_id).first()
    if not tradition:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tradition not found")
    
    update_dict = update_data.model_dump(exclude_unset=True)
    for key, value in update_dict.items():
        setattr(tradition, key, value)
    
    db.commit()
    db.refresh(tradition)
    
    hotspots_count = len(tradition.ar_experience.hotspots) if tradition.ar_experience else 0
    quiz_count = len(tradition.quiz.questions) if tradition.quiz else 0
    contributions_count = db.query(models.Contribution).filter(models.Contribution.tradition_id == tradition.id).count()
    sources_count = len(tradition.sources)

    return schemas.AdminTraditionItem(
        id=tradition.id,
        name=tradition.name,
        slug=tradition.slug,
        region=tradition.region,
        state=tradition.state,
        community=tradition.community,
        category=tradition.category,
        short_description=tradition.short_description,
        experience_type=tradition.experience_type,
        hero_image=tradition.hero_image,
        thumbnail=tradition.thumbnail,
        status=tradition.status,
        hotspots_count=hotspots_count,
        quiz_count=quiz_count,
        contributions_count=contributions_count,
        sources_count=sources_count
    )

@router.delete("/traditions/{tradition_id}", status_code=status.HTTP_200_OK)
def delete_admin_tradition(
    tradition_id: int,
    current_admin: models.User = Depends(auth.get_current_admin),
    db: Session = Depends(get_db)
):
    tradition = db.query(models.Tradition).filter(models.Tradition.id == tradition_id).first()
    if not tradition:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tradition not found")
    db.delete(tradition)
    db.commit()
    return {"message": f"Tradition #{tradition_id} successfully deleted"}

# ----------------- Sources Citations Management -----------------
@router.get("/sources", response_model=List[schemas.SourceResponse])
def list_admin_sources(
    current_admin: models.User = Depends(auth.get_current_admin),
    db: Session = Depends(get_db)
):
    return db.query(models.Source).order_by(models.Source.id.desc()).all()

@router.post("/sources", response_model=schemas.SourceResponse, status_code=status.HTTP_201_CREATED)
def create_admin_source(
    source_in: schemas.SourceCreate,
    current_admin: models.User = Depends(auth.get_current_admin),
    db: Session = Depends(get_db)
):
    source = models.Source(
        title=source_in.title,
        organization=source_in.organization,
        author=source_in.author,
        source_type=source_in.source_type,
        url=source_in.url,
        description=source_in.description,
        verification_status=source_in.verification_status
    )
    db.add(source)
    db.commit()
    db.refresh(source)
    return source

@router.patch("/sources/{source_id}", response_model=schemas.SourceResponse)
def update_admin_source(
    source_id: int,
    source_in: schemas.SourceUpdate,
    current_admin: models.User = Depends(auth.get_current_admin),
    db: Session = Depends(get_db)
):
    source = db.query(models.Source).filter(models.Source.id == source_id).first()
    if not source:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Source citation not found")
    update_dict = source_in.model_dump(exclude_unset=True)
    for key, value in update_dict.items():
        setattr(source, key, value)
    db.commit()
    db.refresh(source)
    return source

@router.delete("/sources/{source_id}", status_code=status.HTTP_200_OK)
def delete_admin_source(
    source_id: int,
    current_admin: models.User = Depends(auth.get_current_admin),
    db: Session = Depends(get_db)
):
    source = db.query(models.Source).filter(models.Source.id == source_id).first()
    if not source:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Source not found")
    db.delete(source)
    db.commit()
    return {"message": f"Source citation #{source_id} deleted successfully"}

# ----------------- Real-Time System Audit -----------------
@router.get("/audit", response_model=schemas.AdminAuditReport)
def get_admin_audit(
    current_admin: models.User = Depends(auth.get_current_admin),
    db: Session = Depends(get_db)
):
    from datetime import datetime, timezone
    import os

    backend_dir = os.getcwd()
    heritage_dir = os.path.join(backend_dir, "heritage-images")
    found_assets = []
    for f in ["thathera.jpg", "toda.jpg", "chhau.jpg", "warli.jpg"]:
        if os.path.exists(os.path.join(heritage_dir, f)):
            found_assets.append(f)

    counts = {
        "traditions": db.query(models.Tradition).count(),
        "published_traditions": db.query(models.Tradition).filter(models.Tradition.status == "PUBLISHED").count(),
        "sources": db.query(models.Source).count(),
        "verified_sources": db.query(models.Source).filter(models.Source.verification_status == "VERIFIED").count(),
        "contributions_total": db.query(models.Contribution).count(),
        "contributions_pending": db.query(models.Contribution).filter(models.Contribution.status == "PENDING").count(),
        "contributions_approved": db.query(models.Contribution).filter(models.Contribution.status == "APPROVED").count(),
        "users": db.query(models.User).count(),
        "ar_hotspots": db.query(models.ARHotspot).count(),
        "quiz_questions": db.query(models.QuizQuestion).count()
    }

    voice_engines = {
        "english": "gTTS en-IN (Online)",
        "hindi": "gTTS hi-IN (Online)",
        "marathi": "gTTS mr-IN (Online)",
        "cache_status": "Active (Local Fast Audio Buffer)"
    }

    return schemas.AdminAuditReport(
        database_status="Healthy (SQLite thread-safe connection)",
        server_timestamp=datetime.now(timezone.utc),
        metrics=counts,
        narration_voice_engines=voice_engines,
        heritage_assets_verified=found_assets
    )

