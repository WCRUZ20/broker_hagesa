from pydantic import BaseModel

class UserLogin(BaseModel):
    identifier: str
    password: str

class UserBase(BaseModel):
    user_name: str
    last_name: str
    user_role: str
    user_cod: str
    user_email: str

class UserCreate(UserBase):
    user_password: str

class UserOut(UserBase):
    id: int

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