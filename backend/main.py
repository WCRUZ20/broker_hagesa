from fastapi import FastAPI
from app.routers import users
from app.routers import clients
from fastapi.middleware.cors import CORSMiddleware
from app.routers import sellers
from app.routers import company

app = FastAPI(
    title="HAGESA API BACKEND",
    version="2.0.0",
    description="🔥 CONSUMO DE METODOS CREACION, EDICION, ELIMINAR (USUARIOS, VENDEDORES, CLIENTES)"
)

origins = [
    "http://localhost:5173",  # frontend dev
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,            # o ["*"] para todo
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router)
app.include_router(clients.router)
app.include_router(sellers.router)
app.include_router(company.router)

@app.get("/")
def read_root():
    return {"msg": "API real funcionando correctamente"}