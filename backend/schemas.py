from pydantic import BaseModel
from datetime import date

class UserCreate(BaseModel):
    email: str
    password: str


class TodoCreate(BaseModel):
    title: str
    category: str
    due_date: date
    owner_id: int