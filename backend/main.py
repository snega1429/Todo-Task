from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from sqlalchemy.orm import Session

from datetime import datetime, timedelta
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import hashlib
from jose import jwt 
from jose.exceptions import JWTError
from database import SessionLocal, engine
from models import Base, User, Todo
from schemas.UserSchema import UserCreate
from schemas.TodoSchema import TodoCreate, TodoOut
from fastapi.responses import JSONResponse
from schemas.UserSchema import UserCreate, ChangePassword
from schemas.UserSchema import UserCreate, UserProfileUpdate

app = FastAPI()

origins = [
    "http://localhost:5173",
    
    "https://ui-todoapp-fullstack.netlify.app"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


Base.metadata.create_all(bind=engine)
security = HTTPBearer()

SECRET_KEY = "mysecretkey"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# =========================
# PASSWORD HASH
# =========================

def hash_password(password: str):
    return hashlib.sha256(password.encode()).hexdigest()

def verify_password(password: str, hashed: str):
    return hash_password(password) == hashed

# =========================
# CREATE TOKEN
# =========================

def create_token(user_id: int):

    expire = datetime.utcnow() + timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )

    payload = {
        "user_id": user_id,
        "exp": expire
    }

    token = jwt.encode(
        payload,
        SECRET_KEY,
        algorithm=ALGORITHM
    )

    return token 
# =========================
# GET CURRENT USER (FIXED)
# =========================

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    token = credentials.credentials

    credentials_exception = HTTPException(
        status_code=401,
        detail="Invalid authentication"
    )

    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        user_id = payload.get("user_id")

        if user_id is None:
            raise credentials_exception

    except JWTError:
        raise credentials_exception

    user = db.query(User).filter(
        User.id == user_id
    ).first()

    if user is None:
        raise credentials_exception

    return user
# =========================
# HOME
# =========================

@app.get("/")
def home():
    return {"message": "API running"}

# =========================
# SIGNUP
# =========================

@app.post("/signup")
def signup(user: UserCreate, db: Session = Depends(get_db)):

    existing_user = db.query(User).filter(
        User.email == user.email
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    hashed = hash_password(user.password)

    new_user = User(
        email=user.email,
        password=hashed
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    token = create_token(new_user.id)
   

    return {
        "message": "Signup successful",
        "token": token
    }

# =========================
# LOGIN
# =========================

@app.post("/login")
def login(user: UserCreate, db: Session = Depends(get_db)):

    db_user = db.query(User).filter(
        User.email == user.email
    ).first()

    if not db_user:
        raise HTTPException(
            status_code=400,
            detail="User not found"
        )

    if not verify_password(
        user.password,
        db_user.password
    ):
        raise HTTPException(
            status_code=400,
            detail="Invalid password"
        )

    token = create_token(db_user.id)

    return {
        "message": "Login successful",
        "token": token
    }

# =========================
# CREATE TODO
# =========================

@app.post("/todos", response_model=TodoOut)
def create_todo(
    todo: TodoCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    new_todo = Todo(
        title=todo.title,
        category=todo.category,
        due_date=todo.due_date,
        owner_id=current_user.id,
        completed=False
    )

    db.add(new_todo)
    db.commit()
    db.refresh(new_todo)

    return new_todo

# =========================
# GET TODOS
# =========================

@app.get("/todos", response_model=List[TodoOut])
def get_todos(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    return db.query(Todo).filter(
        Todo.owner_id == current_user.id
    ).all()

# =========================
# DELETE TODO
# =========================

@app.delete("/todos/{todo_id}")
def delete_todo(
    todo_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    todo = db.query(Todo).filter(
        Todo.id == todo_id,
        Todo.owner_id == current_user.id
    ).first()

    if not todo:
        raise HTTPException(
            status_code=404,
            detail="Todo not found"
        )

    db.delete(todo)
    db.commit()

    return {"message": "Deleted"}

# =========================
# UPDATE TODO
# =========================

@app.put("/todos/{todo_id}", response_model=TodoOut)
def update_todo(
    todo_id: int,
    updated: TodoCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    todo = db.query(Todo).filter(
        Todo.id == todo_id,
        Todo.owner_id == current_user.id
    ).first()

    if not todo:
        raise HTTPException(
            status_code=404,
            detail="Todo not found"
        )

    todo.title = updated.title
    todo.category = updated.category
    todo.due_date = updated.due_date

    db.commit()
    db.refresh(todo)

    return todo

# =========================
# CHANGE PASSWORD
# =========================

@app.put("/change-password")
def change_password(
    data: ChangePassword,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    try:
        
        if not verify_password(
            data.old_password,
            current_user.password
        ):
            raise HTTPException(
                status_code=400,
                detail="Old password incorrect"
            )

        # New password hash
        new_hashed = hash_password(
            data.new_password
        )

        current_user.password = new_hashed

        db.commit()
        db.refresh(current_user)

        print("Password updated successfully")

        return {
            "message": "Password changed successfully"
        }

    except Exception as e:

        print("ERROR OCCURRED:", e)

        raise HTTPException(
            status_code=500,
            detail=str(e)   # IMPORTANT — real error show pannum
        )
        
@app.get("/profile")
def get_profile(current_user: User = Depends(get_current_user)):
    return {"email": current_user.email}
        
@app.put("/profile")
def update_profile(
    data: UserProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        # Check if email already used by another user
        existing_user = db.query(User).filter(
            User.email == data.email,
            User.id != current_user.id
        ).first()
        if existing_user:
            raise HTTPException(
                status_code=400,
                detail="Email already in use"
            )

        # Update current user's email
        current_user.email = data.email
        db.commit()
        db.refresh(current_user)

        return {"message": "Profile updated successfully"}

    except Exception as e:
        print("ERROR:", e)
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )
        

@app.get("/me")
def get_current_user_profile(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "email": current_user.email
    }