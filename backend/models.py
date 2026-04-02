from sqlalchemy import Column, Integer, String, Date, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)

    todos = relationship("Todo", back_populates="owner",cascade="all,delete")


class Todo(Base):
    __tablename__ = "todos"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    title = Column(String)
    category = Column(String)
    due_date = Column(Date)
    owner_id = Column(Integer, ForeignKey("users.id"))
    completed = Column(Boolean, default=False)
    
    owner = relationship(
        "User",
        back_populates="todos"
    )