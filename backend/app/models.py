from sqlalchemy import Column, Integer, String, Date, ForeignKey, Float
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
    # user_position = Column(String, nullable=True)
    user_position = Column(Integer, ForeignKey("CRGO.id"), nullable=True)
    user_status = Column(String, default="Habilitado", nullable=False)
    

class Client(Base):
    __tablename__ = "CTMS"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String)
    apellidos = Column(String, nullable=True)
    identificacion = Column(String)
    telefono = Column(String)
    email = Column(String)
    direccion = Column(String)
    id_pais = Column(Integer, ForeignKey("CTRY.id"), nullable=True, autoincrement=False)
    id_provincia = Column(Integer, ForeignKey("STTE.id"), nullable=True, autoincrement=False)
    id_ciudad = Column(Integer, ForeignKey("CITY.id"), nullable=True, autoincrement=False)
    id_parroquia = Column(Integer, ForeignKey("PRSH.id"), nullable=True, autoincrement=False)
    latitud = Column(Float, nullable=True)
    longitud = Column(Float, nullable=True)

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

class State(Base):
    __tablename__ = "STTE"

    id = Column(Integer, primary_key=True, index=True)
    id_pais = Column(Integer, ForeignKey("CTRY.id"), nullable=False, autoincrement=False)
    Description = Column(String)
    CreateDate = Column(Date, nullable=False)
    LastDateMod = Column(Date, nullable=False)
    id_usrs_create = Column(Integer, nullable=False)
    id_usrs_update = Column(Integer, nullable=False)


class City(Base):
    __tablename__ = "CITY"

    id = Column(Integer, primary_key=True, index=True)
    id_provincia = Column(Integer, ForeignKey("STTE.id"), nullable=False, autoincrement=False)
    Description = Column(String)
    CreateDate = Column(Date, nullable=False)
    LastDateMod = Column(Date, nullable=False)
    id_usrs_create = Column(Integer, nullable=False)
    id_usrs_update = Column(Integer, nullable=False)


class Parish(Base):
    __tablename__ = "PRSH"

    id = Column(Integer, primary_key=True, index=True)
    id_ciudad = Column(Integer, ForeignKey("CITY.id"), nullable=False, autoincrement=False)
    Description = Column(String)
    CreateDate = Column(Date, nullable=False)
    LastDateMod = Column(Date, nullable=False)
    id_usrs_create = Column(Integer, nullable=False)
    id_usrs_update = Column(Integer, nullable=False)

class Brand(Base):
    __tablename__ = "BRND"

    id = Column(Integer, primary_key=True, index=True)
    Description = Column(String, nullable=False)
    CreateDate = Column(Date, nullable=False)
    LastDateMod = Column(Date, nullable=False)
    id_usrs_create = Column(Integer, nullable=False)
    id_usrs_update = Column(Integer, nullable=False)

class VehicleType(Base):
    __tablename__ = "TITM"

    id = Column(Integer, primary_key=True, index=True)
    Description = Column(String, nullable=False)
    CreateDate = Column(Date, nullable=False)
    LastDateMod = Column(Date, nullable=False)
    id_usrs_create = Column(Integer, nullable=False)
    id_usrs_update = Column(Integer, nullable=False)

class VehicleUse(Base):
    __tablename__ = "UITM"

    id = Column(Integer, primary_key=True, index=True)
    Description = Column(String, nullable=False)
    CreateDate = Column(Date, nullable=False)
    LastDateMod = Column(Date, nullable=False)
    id_usrs_create = Column(Integer, nullable=False)
    id_usrs_update = Column(Integer, nullable=False)

class VehicleClassification(Base):
    __tablename__ = "CLSF"

    id = Column(Integer, primary_key=True, index=True)
    Description = Column(String, nullable=False)
    CreateDate = Column(Date, nullable=False)
    LastDateMod = Column(Date, nullable=False)
    id_usrs_create = Column(Integer, nullable=False)
    id_usrs_update = Column(Integer, nullable=False)

class Vehicle(Base):
    __tablename__ = "ITMS"

    id = Column(Integer, primary_key=True, index=True)
    id_itm_type = Column(Integer, ForeignKey("TITM.id"), nullable=False)
    Brand = Column(Integer, ForeignKey("BRND.id"), nullable=False)
    Model = Column(String, nullable=False)
    YearItem = Column(Integer, nullable=False)
    Clasification = Column(Integer, ForeignKey("CLSF.id"), nullable=False)
    Plate = Column(String, nullable=False)
    Motor = Column(String, nullable=True)
    Chassis = Column(String, nullable=True)
    Color = Column(String, nullable=True)
    OriCountry = Column(Integer, ForeignKey("CTRY.id"), nullable=True)
    Propetary = Column(Integer, ForeignKey("CTMS.id"), nullable=True)
    id_use_item = Column(Integer, ForeignKey("UITM.id"), nullable=False)
    CreateDate = Column(Date, nullable=False)
    LastDateMod = Column(Date, nullable=False)
    id_usrs_create = Column(Integer, nullable=False)
    id_usrs_update = Column(Integer, nullable=False)