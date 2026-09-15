from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas, auth

router = APIRouter(prefix="/api/contributions", tags=["Community Contributions"])

# ----------------- Contributor Authentication -----------------
@router.post("/auth/register", response_model=schemas.TokenResponse, status_code=status.HTTP_201_CREATED)
def register_contributor(payload: schemas.ContributorRegisterRequest, db: Session = Depends(get_db)):
    clean_username = payload.username.strip()
    clean_email = payload.email.strip().lower()

    if db.query(models.User).filter(models.User.username == clean_username).first():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Username already registered")

    if db.query(models.User).filter(models.User.email == clean_email).first():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")

    user = models.User(
        username=clean_username,
        email=clean_email,
        hashed_password=auth.get_password_hash(payload.password),
        is_admin=False
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = auth.create_access_token(data={"sub": user.username})
    return schemas.TokenResponse(
        access_token=token,
        token_type="bearer",
        username=user.username,
        is_admin=user.is_admin
    )

@router.post("/auth/login", response_model=schemas.TokenResponse)
def login_contributor(payload: schemas.ContributorLoginRequest, db: Session = Depends(get_db)):
    identifier = payload.username_or_email.strip()
    user = db.query(models.User).filter(
        (models.User.username == identifier) | (models.User.email == identifier.lower())
    ).first()

    if not user or not auth.verify_password(payload.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials. Please check your username/email and password."
        )

    token = auth.create_access_token(data={"sub": user.username})
    return schemas.TokenResponse(
        access_token=token,
        token_type="bearer",
        username=user.username,
        is_admin=user.is_admin
    )

@router.get("/auth/me", response_model=schemas.ContributorProfileResponse)
def get_contributor_profile(
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    contrib_count = db.query(models.Contribution).filter(
        (models.Contribution.user_id == current_user.id) | (models.Contribution.email == current_user.email.lower())
    ).count()

    return schemas.ContributorProfileResponse(
        id=current_user.id,
        username=current_user.username,
        email=current_user.email,
        is_admin=current_user.is_admin,
        created_at=current_user.created_at,
        contributions_count=contrib_count
    )

@router.get("/my-submissions", response_model=List[schemas.ContributionResponse])
def get_my_submissions(
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    # Fetch contributions associated by user_id OR by contributor's registered email
    return db.query(models.Contribution).filter(
        (models.Contribution.user_id == current_user.id) | (models.Contribution.email == current_user.email.lower())
    ).order_by(models.Contribution.created_at.desc()).all()

# ----------------- Submission & Discovery -----------------
@router.post("", response_model=schemas.ContributionResponse, status_code=status.HTTP_201_CREATED)
def submit_contribution(
    payload: schemas.ContributionCreate,
    current_user: Optional[models.User] = Depends(auth.get_optional_current_user),
    db: Session = Depends(get_db)
):
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
        reviewer_notes=None,
        user_id=current_user.id if current_user else None
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

