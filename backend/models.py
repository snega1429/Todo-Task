from sqlalchemy import Column, Integer, String, Date, ForeignKey
from sqlalchemy.orm import relationship
from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)

    todos = relationship("Todo", back_populates="owner")


class Todo(Base):
    __tablename__ = "todos"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    title = Column(String)
    category = Column(String)
    due_date = Column(Date)
    owner_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("User", back_populates="todos")