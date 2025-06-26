from pydantic import BaseModel
from typing import Optional
from datetime import date, time

class UserLogin(BaseModel):
    identifier: str
    password: str

class UserBase(BaseModel):
    user_name: str
    last_name: str
    user_role: str
    user_cod: str
    user_email: str
    user_photo: Optional[str] = None
    # user_position: Optional[str] = None
    user_position: Optional[int] = None
    user_status: str

class UserCreate(UserBase):
    user_password: str
    user_photo: Optional[str] = None
    # user_position: Optional[str] = None
    user_position: Optional[int] = None

class UserUpdate(UserBase):
    user_name: Optional[str] = None
    last_name: Optional[str] = None
    user_role: Optional[str] = None
    user_cod: Optional[str] = None
    user_email: Optional[str] = None
    user_password: Optional[str] = None
    user_photo: Optional[str] = None
    # user_position: Optional[str] = None
    user_position: Optional[int] = None
    user_status: Optional[str] = None

class UserOut(UserBase):
    id: int
    user_photo: Optional[str] = None
    # user_position: Optional[str] = None
    user_position: Optional[int] = None
    user_status: Optional[str] = "Habilitado"
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str


class ClientBase(BaseModel):
    nombre: str
    apellidos: str | None = None
    identificacion: str
    telefono: str
    email: str
    direccion: str
    id_pais: Optional[int] = None
    id_provincia: Optional[int] = None
    id_ciudad: Optional[int] = None
    id_parroquia: Optional[int] = None
    latitud: Optional[float] = None
    longitud: Optional[float] = None

class ClientCreate(ClientBase):
    pass

class ClientOut(ClientBase):
    id: int

    class Config:
        from_attributes = True

class SellerBase(BaseModel):
    nombre: str
    identificacion: str
    telefono: str
    email: str
    direccion: str

class SellerCreate(SellerBase):
    pass

class SellerOut(SellerBase):
    id: int

    class Config:
        from_attributes = True
        
class CompanyBase(BaseModel):
    IdCompany: str
    CompanyName: str
    CompanyLogo: Optional[str] = None


class CompanyOut(CompanyBase):
    class Config:
        from_attributes = True

class CountryBase(BaseModel):
    id: int
    Description: str


class CountryCreate(CountryBase):
    pass


class CountryOut(CountryBase):
    CreateDate: date
    LastDateMod: date
    id_usrs_create: int
    id_usrs_update: int

    class Config:
        from_attributes = True

class IdentificationTypeBase(BaseModel):
    id: str
    Description: str


class IdentificationTypeCreate(IdentificationTypeBase):
    pass


class IdentificationTypeOut(IdentificationTypeBase):
    CreateDate: date
    LastDateMod: date
    id_usrs_create: int
    id_usrs_update: int

    class Config:
        from_attributes = True

class CargoBase(BaseModel):
    Description: str


class CargoCreate(CargoBase):
    pass


class CargoOut(CargoBase):
    id: int
    CreateDate: date
    LastDateMod: date
    id_usrs_create: int
    id_usrs_update: int

    class Config:
        from_attributes = True

class StateBase(BaseModel):
    id: int | None = None
    id_pais: int
    Description: str


class StateCreate(StateBase):
    pass


class StateOut(StateBase):
    id: int
    CreateDate: date
    LastDateMod: date
    id_usrs_create: int
    id_usrs_update: int

    class Config:
        from_attributes = True


class CityBase(BaseModel):
    id: int | None = None
    id_provincia: int
    Description: str


class CityCreate(CityBase):
    pass


class CityOut(CityBase):
    id: int
    CreateDate: date
    LastDateMod: date
    id_usrs_create: int
    id_usrs_update: int

    class Config:
        from_attributes = True


class ParishBase(BaseModel):
    id: int | None = None
    id_ciudad: int
    Description: str


class ParishCreate(ParishBase):
    pass


class ParishOut(ParishBase):
    id: int
    CreateDate: date
    LastDateMod: date
    id_usrs_create: int
    id_usrs_update: int

    class Config:
        from_attributes = True

class BrandBase(BaseModel):
    Description: str

class BrandCreate(BrandBase):
    pass

class BrandOut(BrandBase):
    id: int
    CreateDate: date
    LastDateMod: date
    id_usrs_create: int
    id_usrs_update: int

    class Config:
        from_attributes = True

class VehicleTypeBase(BaseModel):
    Description: str

class VehicleTypeCreate(VehicleTypeBase):
    pass

class VehicleTypeOut(VehicleTypeBase):
    id: int
    CreateDate: date
    LastDateMod: date
    id_usrs_create: int
    id_usrs_update: int

    class Config:
        from_attributes = True

class VehicleUseBase(BaseModel):
    Description: str

class VehicleUseCreate(VehicleUseBase):
    pass

class VehicleUseOut(VehicleUseBase):
    id: int
    CreateDate: date
    LastDateMod: date
    id_usrs_create: int
    id_usrs_update: int

    class Config:
        from_attributes = True


class VehicleClassificationBase(BaseModel):
    Description: str


class VehicleClassificationCreate(VehicleClassificationBase):
    pass


class VehicleClassificationOut(VehicleClassificationBase):
    id: int
    CreateDate: date
    LastDateMod: date
    id_usrs_create: int
    id_usrs_update: int

    class Config:
        from_attributes = True

class VehicleBase(BaseModel):
    id_itm_type: int
    Brand: int
    Model: str
    YearItem: int
    Clasification: int
    Plate: str
    Motor: Optional[str] = None
    Chassis: Optional[str] = None
    Color: Optional[str] = None
    OriCountry: Optional[int] = None
    Propetary: Optional[int] = None
    id_use_item: int


class VehicleCreate(VehicleBase):
    pass


class VehicleOut(VehicleBase):
    id: int
    CreateDate: date
    LastDateMod: date
    id_usrs_create: int
    id_usrs_update: int

    class Config:
        from_attributes = True

class InsuranceCompanyBase(BaseModel):
    IdentType: str
    Identification: str
    CompanyName: str
    DirCompany: Optional[str] = None
    TelepCompany: Optional[str] = None
    ComiPrcnt: int


class InsuranceCompanyCreate(InsuranceCompanyBase):
    pass


class InsuranceCompanyOut(InsuranceCompanyBase):
    id: int
    CreateDate: date
    LastDateMod: date
    id_usrs_create: int
    id_usrs_update: int

    class Config:
        from_attributes = True

class PolicyLineBase(BaseModel):
    id_itm: int
    LineNum: int
    LineTotal: float


class PolicyLineCreate(PolicyLineBase):
    pass


class PolicyLineOut(PolicyLineBase):
    id_policy: int

    class Config:
        from_attributes = True


class PolicyBase(BaseModel):
    DocType: str
    PolicyNum: str
    InitDate: date
    DueDate: date
    AscValue: float
    id_slrs: int
    id_ctms: int
    id_insurance: int
    id_poliza_rel: Optional[int] = None
    comentario: Optional[str] = None
    activo: str = "Y"


class PolicyCreate(PolicyBase):
    lines: list[PolicyLineCreate]
    activo: str | None = None


class PolicyOut(PolicyBase):
    id: int
    CreateDate: date
    LastDateMod: date
    id_usrs_create: int
    id_usrs_update: int
    activo: str

    class Config:
        from_attributes = True

class PolicyDetailOut(PolicyOut):
    lines: list[PolicyLineOut]

    class Config:
        from_attributes = True

class PolicyListOut(PolicyOut):
    InsuranceName: Optional[str] = None
    ComiPrcnt: Optional[int] = None
    DaysOverdue: Optional[int] = None
    RelatedPolicyNum: Optional[str] = None

    class Config:
        from_attributes = True
    
class MailConfigBase(BaseModel):
    USER_SMTP: str
    PASS_SMTP: str
    HOST_SMTP: str
    PORT_SMTP: str
    Estado: str = "D"

class MailConfigCreate(MailConfigBase):
    Estado: str | None = None

class MailConfigTest(MailConfigBase):
    """Esquema para validar configuración SMTP con email de prueba"""
    test_email: str | None = None

class MailConfigOut(MailConfigBase):
    id: int
    CreateDate: date
    LastDateMod: date
    id_usrs_create: int
    id_usrs_update: int
    Estado: str

    class Config:
        from_attributes = True

class MailTemplateBase(BaseModel):
    Name: str
    Subject: str
    Body: str
    Destination: str = "C"
    Estado: str = "A"


class MailTemplateCreate(MailTemplateBase):
    Estado: str | None = None
    Destination: str | None = None


class MailTemplateOut(MailTemplateBase):
    id: int
    CreateDate: date
    LastDateMod: date
    id_usrs_create: int
    id_usrs_update: int
    Estado: str
    Destination: str

    class Config:
        from_attributes = True
    
class MailParamBase(BaseModel):
    manualsending: str
    daystodue: Optional[int] = None
    daystodueSeller: Optional[int] = None
    monday: str
    tuesday: str
    wednesday: str
    thursday: str
    friday: str
    saturday: str
    sunday: str
    hoursending: Optional[time] = None
    maxdaysallow: Optional[int] = None


class MailParamCreate(MailParamBase):
    pass


class MailParamOut(MailParamBase):
    id: int

    class Config:
        from_attributes = True
    
class MailHistoryBase(BaseModel):
    Name: str
    Subject: str
    Body: str
    id_formato_mail: int
    Destination: str
    id_seller: Optional[int] = None
    id_client: Optional[int] = None


class MailHistoryCreate(MailHistoryBase):
    pass


class MailHistoryOut(MailHistoryBase):
    id: int
    CreateDate: date
    LastDateMod: date
    id_usrs_create: int
    id_usrs_update: int

    class Config:
        from_attributes = True


class SendClientEmails(BaseModel):
    policy_ids: list[int]