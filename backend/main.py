from fastapi import FastAPI
from app.routers import users
from app.routers import clients
from fastapi.middleware.cors import CORSMiddleware
from app.routers import sellers
from app.routers import company
from app.routers import countries
from app.routers import cargos
from app.routers import states
from app.routers import cities
from app.routers import parishes
from app.routers import brands
from app.routers import vehicle_types
from app.routers import vehicle_uses
from app.routers import vehicle_classifications
from app.routers import vehicles
from app.routers import identification_types
from app.routers import insurance_companies
from app.routers import policies




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
app.include_router(countries.router)
app.include_router(cargos.router)
app.include_router(identification_types.router)
app.include_router(states.router)
app.include_router(cities.router)
app.include_router(parishes.router)
app.include_router(brands.router)
app.include_router(vehicle_types.router)
app.include_router(vehicle_uses.router)
app.include_router(vehicle_classifications.router)
app.include_router(vehicles.router)
app.include_router(insurance_companies.router)
app.include_router(policies.router)



@app.get("/")
def read_root():
    return {"msg": "API real funcionando correctamente"}