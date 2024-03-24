from pydantic import BaseModel
from datetime import datetime
from typing import List

class CleanGdpr(BaseModel):
    etid: str
	country: str
	date_of_decision: datetime.date
	fine: float
	controller_or_processor: str
	quoted_art: str
	fine_type: str

    class Config:
        from_attributes = True


class CreateCleanGdpr(BaseModel):
    etid: str
	country: str
	date_of_decision: datetime.date
	fine: float
	controller_or_processor: str
	quoted_art: str
	fine_type: str