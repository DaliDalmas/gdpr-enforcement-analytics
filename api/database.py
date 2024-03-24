from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

SQLALCHEMY_DATABASE_URL = 'postgresql://gdpr:gdpr@localhost:5432/gdpr'

engine = create_engine(SQLALCHEMY_DATABASE_URL)

sessionLocal1 = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()