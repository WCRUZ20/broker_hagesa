from sqlalchemy import Column, Integer, String, Date, ForeignKey, Float, Time
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

class InsuranceCompany(Base):
    __tablename__ = "ASCR"

    id = Column(Integer, primary_key=True, index=True)
    IdentType = Column(String(2), ForeignKey("TIDN.id"))
    Identification = Column(String)
    CompanyName = Column(String, nullable=False)
    DirCompany = Column(String, nullable=True)
    TelepCompany = Column(String, nullable=True)
    ComiPrcnt = Column(Integer, nullable=False)
    CreateDate = Column(Date, nullable=False)
    LastDateMod = Column(Date, nullable=False)
    id_usrs_create = Column(Integer, ForeignKey("USRS.id"), nullable=False)
    id_usrs_update = Column(Integer, ForeignKey("USRS.id"), nullable=False)

class IdentificationType(Base):
    __tablename__ = "TIDN"

    id = Column(String(2), primary_key=True, index=True)
    Description = Column(String, nullable=True)
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

class Policy(Base):
    __tablename__ = "PLCY"

    id = Column(Integer, primary_key=True, index=True)
    DocType = Column(String(2), nullable=False)
    PolicyNum = Column(String, nullable=False)
    InitDate = Column(Date, nullable=False)
    DueDate = Column(Date, nullable=False)
    AscValue = Column(Float, nullable=False)
    CreateDate = Column(Date, nullable=False)
    LastDateMod = Column(Date, nullable=False)
    id_slrs = Column(Integer, ForeignKey("SLRS.id"), nullable=False)
    id_ctms = Column(Integer, ForeignKey("CTMS.id"), nullable=False)
    id_usrs_create = Column(Integer, ForeignKey("USRS.id"), nullable=False)
    id_usrs_update = Column(Integer, ForeignKey("USRS.id"), nullable=False)
    id_insurance = Column(Integer, ForeignKey("ASCR.id"), nullable=False)
    id_poliza_rel = Column(Integer, ForeignKey("PLCY.id"), nullable=True)
    comentario = Column(String, nullable=True)
    activo = Column(String(1), default="Y", nullable=True)


class PolicyLine(Base):
    __tablename__ = "LCY1"

    id_policy = Column(Integer, ForeignKey("PLCY.id"), primary_key=True)
    id_itm = Column(Integer, ForeignKey("ITMS.id"), primary_key=True)
    LineNum = Column(Integer, primary_key=True)
    LineTotal = Column(Float, nullable=False)

class MailConfig(Base):
    __tablename__ = "ENVC"

    id = Column(Integer, primary_key=True, index=True)
    USER_SMTP = Column(String)
    PASS_SMTP = Column(String)
    HOST_SMTP = Column(String)
    PORT_SMTP = Column(String)
    Estado = Column(String(1), default="D", nullable=False)
    CreateDate = Column(Date, nullable=False)
    LastDateMod = Column(Date, nullable=False)
    id_usrs_create = Column(Integer, ForeignKey("USRS.id"), nullable=False, autoincrement=False)
    id_usrs_update = Column(Integer, ForeignKey("USRS.id"), nullable=False, autoincrement=False)

class MailTemplate(Base):
    __tablename__ = "ENTM"

    id = Column(Integer, primary_key=True, index=True)
    Name = Column(String, nullable=False)
    Subject = Column(String, nullable=False)
    Body = Column(String, nullable=False)
    Destination = Column(String(1), nullable=False, default="C")
    Estado = Column(String(1), default="A", nullable=False)
    CreateDate = Column(Date, nullable=False)
    LastDateMod = Column(Date, nullable=False)
    id_usrs_create = Column(Integer, ForeignKey("USRS.id"), nullable=False, autoincrement=False)
    id_usrs_update = Column(Integer, ForeignKey("USRS.id"), nullable=False, autoincrement=False)

class MailSendingParam(Base):
    __tablename__ = "PENV"

    id = Column(Integer, primary_key=True, index=True)
    manualsending = Column(String(1))
    daystodue = Column(Integer, nullable=True)
    daystodueSeller = Column(Integer, nullable=True)
    monday = Column(String(1))
    tuesday = Column(String(1))
    wednesday = Column(String(1))
    thursday = Column(String(1))
    friday = Column(String(1))
    saturday = Column(String(1))
    sunday = Column(String(1))
    hoursending = Column(Time, nullable=True)
    maxdaysallow = Column(Integer, nullable=True)

class MailHistory(Base):
    __tablename__ = "HCOR"

    id = Column(Integer, primary_key=True, index=True)
    Name = Column(String, nullable=False)
    Subject = Column(String, nullable=False)
    Body = Column(String, nullable=False)
    id_formato_mail = Column(Integer, ForeignKey("ENTM.id"), nullable=False)
    CreateDate = Column(Date, nullable=False)
    LastDateMod = Column(Date, nullable=False)
    id_usrs_create = Column(Integer, ForeignKey("USRS.id"), nullable=False)
    id_usrs_update = Column(Integer, ForeignKey("USRS.id"), nullable=False)
    Destination = Column(String(1), nullable=False)
    id_seller = Column(Integer, ForeignKey("SLRS.id"), nullable=True)
    id_client = Column(Integer, ForeignKey("CTMS.id"), nullable=True)