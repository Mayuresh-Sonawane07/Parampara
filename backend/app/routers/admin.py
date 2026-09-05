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
    if status_filter:
        query = query.filter(models.Contribution.status == status_filter.upper())
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
