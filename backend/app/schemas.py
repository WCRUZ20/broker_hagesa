from pydantic import BaseModel
from typing import Optional
from datetime import date

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
    user_position: Optional[str] = None
    user_status: str

class UserCreate(UserBase):
    user_password: str
    user_photo: Optional[str] = None
    user_position: Optional[str] = None

class UserUpdate(UserBase):
    user_name: Optional[str] = None
    last_name: Optional[str] = None
    user_role: Optional[str] = None
    user_cod: Optional[str] = None
    user_email: Optional[str] = None
    user_password: Optional[str] = None
    user_photo: Optional[str] = None
    user_position: Optional[str] = None
    user_status: Optional[str] = None

class UserOut(UserBase):
    id: int
    user_photo: Optional[str] = None
    user_position: Optional[str] = None
    user_status: Optional[str] = "Habilitado"
    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str


class ClientBase(BaseModel):
    nombre: str
    identificacion: str
    telefono: str
    email: str
    direccion: str

class ClientCreate(ClientBase):
    pass

class ClientOut(ClientBase):
    id: int

    class Config:
        orm_mode = True

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
        orm_mode = True
        
class CompanyBase(BaseModel):
    IdCompany: str
    CompanyName: str
    CompanyLogo: Optional[str] = None


class CompanyOut(CompanyBase):
    class Config:
        orm_mode = True

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
        orm_mode = True