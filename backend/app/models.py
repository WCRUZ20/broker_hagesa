from sqlalchemy import Column, Integer, String
from app.database import Base

class User(Base):
    __tablename__ = "USRS"

    id = Column(Integer, primary_key=True, index=True)
    user_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    user_role = Column(String, nullable=False)
    user_cod = Column(String, nullable=False)
    user_email = Column(String, nullable=False, unique=True, index=True)
    user_password = Column(String, nullable=False)

class Client(Base):
    __tablename__ = "CTMS"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String)
    identificacion = Column(String)
    telefono = Column(String)
    email = Column(String)
    direccion = Column(String)

class Seller(Base):
    __tablename__ = "SLRS"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String)
    identificacion = Column(String)
    telefono = Column(String)
    email = Column(String)
    direccion = Column(String)