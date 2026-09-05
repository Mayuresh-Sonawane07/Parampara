from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas

router = APIRouter(prefix="/api/sources", tags=["Research Sources"])

@router.get("", response_model=List[schemas.SourceResponse])
def get_sources(db: Session = Depends(get_db)):
    return db.query(models.Source).order_by(models.Source.organization, models.Source.title).all()

@router.get("/{source_id}", response_model=schemas.SourceResponse)
def get_source(source_id: int, db: Session = Depends(get_db)):
    source = db.query(models.Source).filter(models.Source.id == source_id).first()
    if not source:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Source citation not found"
        )
    return source
