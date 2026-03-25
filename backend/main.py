from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session 

from database import SessionLocal, engine
import models
import schemas

app = FastAPI()
models.Base.metadata.create_all(bind=engine)

origins = [
    "http://localhost:5175",
    "http://127.0.0.0.1:5173",
    "https://eloquent-sfogliatella-a17f10.netlify.app"
    ]


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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
        
@app.get("/")
def home():
    return {"message": "API running"}


        
@app.post("/signup")
def signup(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        return {"message": "User already exists"}
    new_user = models.User(
        email=user.email,
        password=user.password
    )    
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "Signup successful"}

@app.post("/login")
def login(user: schemas.UserCreate, db: Session = Depends(get_db)):
  

    db_user = db.query(models.User).filter(models.User.email == user.email).first()

    if not db_user:
        raise HTTPException(status_code=400, detail="User not found")

    if db_user.password != user.password:
        raise HTTPException(status_code=400, detail="Invalid password")

    return {
        "message": "Login successful"
    }

@app.post("/todos")
def create_todo(todo: schemas.TodoCreate, db: Session = Depends(get_db)):

    new_todo = models.Todo(
        title=todo.title,
        category=todo.category,
        due_date=todo.due_date,
        owner_id=todo.owner_id
    )

    db.add(new_todo)
    db.commit()
    db.refresh(new_todo)

    return {"message": "Todo created successfully"}

@app.get("/todos")
def get_todos(db: Session = Depends(get_db)):
    todos = db.query(models.Todo).all()
    return todos

@app.delete("/todos/{todo_id}")
def delete_todo(todo_id: int, db: Session = Depends(get_db)):
    todo = db.query(models.Todo).filter(models.Todo.id == todo_id).first()

    if not todo:
        raise HTTPException(status_code=404, detail="Todo not found")

    db.delete(todo)
    db.commit()

    return {"message": "Todo deleted successfully"}
@app.put("/todos/{todo_id}")
def update_todo(todo_id: int, updated_todo: schemas.TodoCreate, db: Session = Depends(get_db)):
    todo = db.query(models.Todo).filter(models.Todo.id == todo_id).first()

    if not todo:
        raise HTTPException(status_code=404, detail="Todo not found")

    todo.title = updated_todo.title
    todo.category = updated_todo.category
    todo.due_date = updated_todo.due_date

    db.commit()
    db.refresh(todo)

    return {"message": "Todo updated successfully"}