from sqlalchemy.orm import Session
from fastapi import HTTPException

import models, schemas

def get_all_fines(db: Session, skip: int = 0, limit: int = 5):
    return db.query(models.CleanGdpr).offset(skip).limit(limit).all()

def get_one_fine(db: Session, etid: str):
    return db.query(models.CleanGdpr).filter(models.CleanGdpr.etid==etid).first()
