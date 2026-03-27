from pydantic import BaseModel
from datetime import date

class TodoCreate(BaseModel):
    id: int
    title: str
    category: str
    due_date: date
    owner_id: int
    completed: bool
    
    class config:
        orm_mode = True
    