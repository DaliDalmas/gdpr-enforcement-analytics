from sqlalchemy.orm import Session
from fastapi import HTTPException

import models, schemas

def get_all_fines(db: Session, skip: int = 0, limit: int = 5):
    return db.query(models.CleanGdpr).offset(skip).limit(limit).all()

def get_one_fine(db: Session, etid: str):
    return db.query(models.CleanGdpr).filter(models.CleanGdpr.etid==etid).first()

# def add_a_fine(db:Session, clean_gdpr: schemas.CreateCleanGdpr):
#     db_session = models.CleanGdpr(
#         started_at = session.started_at
#     )
#     db.add(db_session)
#     db.commit()
#     db.refresh(db_session)
#     return db_session

# def update_a_fine(db:Session, session_id: int, session: schemas.CreatePlaySession):
#     db_session = db.query(models.CleanGdpr).filter(models.CleanGdpr.id==session_id).first()

#     if db_session is None:
#         return HTTPException(status_code=404, detail=f"session_id={session_id} does not exist")
    
#     session_data = session.model_dump(exclude_unset=True)

#     for key, val in session_data.items():
#         setattr(db_session, key, val)
    
#     db.add(db_session)
#     db.commit()
#     db.refresh(db_session)
#     return db_session

def delete_a_fine(db:Session, etid:str):
    db_session = db.query(models.CleanGdpr).filter(models.CleanGdpr.etid==etid).first()

    if db_session is None:
        return HTTPException(status_code=404, detail=f"session_id={session_id} does not exist. Nothing to delete")
    
    db.delete(db_session)
    db.commit()
    return {"ok": True}