from sqlalchemy import Column, Float, Date, String
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from database import Base

class CleanGdpr(Base):
    __tablename__ = 'clean_gdpr'

    etid = Column(String, primary_key=True)
    country = Column(String)
    date_of_decision = Column(Date)
    fine = Column(Float)
    controller_or_processor = Column(String)
    quoted_art = Column(String)
    fine_type = Column(String)