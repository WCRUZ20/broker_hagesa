from fastapi import FastAPI
from app.routers import users
from app.routers import clients
from fastapi.middleware.cors import CORSMiddleware
from app.routers import sellers

app = FastAPI(
    title="HAGESA API BACKEND REAL",
    version="2.0.0",
    description="🔥 Instancia limpia y real del backend para login y gestión de usuarios"
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

@app.get("/")
def read_root():
    return {"msg": "API real funcionando correctamente"}