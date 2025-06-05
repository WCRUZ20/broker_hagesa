from pydantic import BaseModel
from typing import Optional

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
        