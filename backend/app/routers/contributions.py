from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas

router = APIRouter(prefix="/api/contributions", tags=["Community Contributions"])

@router.post("", response_model=schemas.ContributionResponse, status_code=status.HTTP_201_CREATED)
def submit_contribution(payload: schemas.ContributionCreate, db: Session = Depends(get_db)):
    if not payload.consent_given:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Explicit consent is required to submit cultural heritage knowledge."
        )

    # If tradition_id is provided, verify it exists
    if payload.tradition_id:
        tradition = db.query(models.Tradition).filter(models.Tradition.id == payload.tradition_id).first()
        if not tradition:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Tradition with ID {payload.tradition_id} does not exist."
            )

    contribution = models.Contribution(
        contributor_name=payload.contributor_name.strip(),
        email=payload.email.strip().lower(),
        tradition_id=payload.tradition_id,
        tradition_name=payload.tradition_name.strip(),
        region=payload.region.strip(),
        location=payload.location.strip(),
        description=payload.description.strip(),
        cultural_significance=payload.cultural_significance.strip() if payload.cultural_significance else None,
        media_url=payload.media_url.strip() if payload.media_url else None,
        source_reference=payload.source_reference.strip() if payload.source_reference else None,
        consent_given=payload.consent_given,
        status="PENDING",
        reviewer_notes=None
    )

    db.add(contribution)
    db.commit()
    db.refresh(contribution)
    return contribution

@router.get("/{contribution_id}", response_model=schemas.ContributionResponse)
def get_contribution(contribution_id: int, db: Session = Depends(get_db)):
    contribution = db.query(models.Contribution).filter(models.Contribution.id == contribution_id).first()
    if not contribution:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Contribution not found"
        )
    return contribution
