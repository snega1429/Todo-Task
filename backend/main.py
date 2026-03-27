from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from database import SessionLocal, engine
from models import Todo, User
from sqlalchemy.orm import Session
from jose import JWTError, jwt
from models import Base
from schemas.UserSchema import UserCreate
from schemas.TodoSchema import TodoCreate
import models
from fastapi import Request

app=FastAPI()

models.Base.metadata.create_all(bind=engine) 


origins = [
    "http://localhost:5175",
    "https://todo-task-fs.netlify.app"
    ]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        
class userCreate(BaseModel):
    email: str
    password: str

        

class TodoSchema(BaseModel):
    id: int
    title: str
    category: str
    due_date: str
    owner_id: int
    completed: bool
    
    class Config:
        from_attribute = True
    
SECRET_KEY = "a_super_secure_long_secret_key_1234567890"
        
@app.get("/")
def home():
    return {"message": "API running"}


        
@app.post("/signup")
def signup(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    new_user =User(email=user.email, password=user.password)
        
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    token = jwt.encode({"user_id": new_user.id}, SECRET_KEY, algorithm="HS256")
    return {"token": token}

    

@app.post("/login")
def login(user: UserCreate, db: Session = Depends(get_db)):
  

    db_user = db.query(User).filter(
        User.email == user.email
    ).filter(
        User.password == user.password
    ).first()

    if not db_user:
        raise HTTPException(status_code=400, detail="Invalid credentials")
    token = jwt.encode({"user_id": db_user.id}, SECRET_KEY, algorithm="HS256")
    return {"token": token}
    

@app.post("/todos")
def create_todo(todo: TodoSchema, db: Session = Depends(get_db)):

    new_todo = Todo(**todo.dict())
        
    db.add(new_todo)
    db.commit()
    db.refresh(new_todo)

    return new_todo

@app.get("/todos", response_model=List[TodoSchema])
def get_todos(db: Session = Depends(get_db)):
    todos = db.query(Todo).all()
    return todos

@app.delete("/todos/{todo_id}")
def delete_todo(todo_id: int, db: Session = Depends(get_db)):
    todo = db.query(Todo).get(todo_id)

    if not todo:
        raise HTTPException(status_code=404, detail="Todo not found")

    db.delete(todo)
    db.commit()

    return {"message": "Todo deleted successfully"}

@app.put("/todos/{todo_id}", response_model=TodoSchema)
def update_todo(todo_id: int, updated_todo: TodoSchema, db: Session = Depends(get_db)):
    todo = db.query(Todo).filter(Todo.id == todo_id).first()

    if not todo:
        raise HTTPException(status_code=404, detail="Todo not found")
    
    todo.title = updated_todo.title
    todo.category = updated_todo.category
    todo.due_date = update_todo.due_date
    todo.owner_id = updated_todo.owner_id
    todo.completed = updated_todo.completed
    
    db.commit()
    db.refresh(todo)

    return {"message": "Todo updated successfully", "todo": todo}

