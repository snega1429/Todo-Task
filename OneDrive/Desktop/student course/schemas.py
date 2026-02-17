from pydantic import BaseModel, Field, field_validator
import re


class StudentCreate(BaseModel):
    name: str = Field(..., min_length=3, max_length=50)
    age: int = Field(..., ge=1, le=120)

    @field_validator("name")
    @classmethod
    def validate_name(cls, v):
        if not re.match("^[A-Za-z ]+$", v):
            raise ValueError("Name must contain only letters")
        return v.strip()


class StudentResponse(BaseModel):
    id: int
    name: str
    age: int

    class Config:
        from_attributes = True


class CourseCreate(BaseModel):
    course_name: str = Field(..., min_length=3, max_length=100)
    duration: int = Field(..., gt=0)

    @field_validator("course_name")
    @classmethod
    def validate_course(cls, v):
        return v.strip()


class CourseResponse(BaseModel):
    id: int
    course_name: str
    duration: int

    class Config:
        from_attributes = True
