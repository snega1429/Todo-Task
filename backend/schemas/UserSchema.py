from pydantic import BaseModel, EmailStr, Field


class UserCreate(BaseModel):
    username: str = Field(..., min_length=3)
    email: EmailStr
    password: str = Field(..., min_length=6)

class ChangePassword(BaseModel):
    old_password: str
    new_password: str = Field(..., min_length=6)
    
class UserProfileUpdate(BaseModel):
    username: str = Field(..., min_length=3)
    email: EmailStr
    
class LoginRequest(BaseModel):
    email: EmailStr
    password: str

