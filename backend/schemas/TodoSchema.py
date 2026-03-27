from pydantic import BaseModel
from datetime import date

class TodoCreate(BaseModel):
    title: str
    category: str
    due_date: int
    owner_id: int
    completed: bool
    
    class config:
        from_attributes = True
    