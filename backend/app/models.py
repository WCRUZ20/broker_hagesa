from sqlalchemy import Column, Integer, String, Date
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
    user_photo = Column(String, nullable=True)
    user_position = Column(String, nullable=True)
    user_status = Column(String, default="Habilitado", nullable=False)
    

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

class Company(Base):
    __tablename__ = "COMP"

    IdCompany = Column(String(20), primary_key=True, index=True)
    CompanyName = Column(String)
    CompanyLogo = Column(String)

class Country(Base):
    __tablename__ = "CTRY"

    id = Column(Integer, primary_key=True, index=True, autoincrement=False)
    Description = Column(String)
    CreateDate = Column(Date, nullable=False)
    LastDateMod = Column(Date, nullable=False)
    id_usrs_create = Column(Integer, nullable=False)
    id_usrs_update = Column(Integer, nullable=False)

class Cargo(Base):
    __tablename__ = "CRGO"

    id = Column(Integer, primary_key=True, index=True)
    Description = Column(String, nullable=False)
    CreateDate = Column(Date, nullable=False)
    LastDateMod = Column(Date, nullable=False)
    id_usrs_create = Column(Integer, nullable=False)
    id_usrs_update = Column(Integer, nullable=False)