from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware

import crud, schemas, models
from database import sessionLocal1, engine

app=FastAPI()

models.Base.metadata.create_all(bind=engine)

origins = [
    "http://localhost:3000",
    "localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*']
)

def get_db():
    db = sessionLocal1()
    try:
        yield db
    finally:
        db.close()

# GDPR
@app.get('/fines/', tags=['gdpr fines'], response_model=list[schemas.CleanGdpr])
def get_sessions(skip: int = 0, limit: int = 5, db: Session = Depends(get_db)):
    return crud.get_all_fines(skip=skip, limit=limit, db=db)
