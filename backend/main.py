from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import users, clients, sellers, company, countries, cargos
from app.routers import states, cities, parishes, brands, vehicle_types
from app.routers import vehicle_uses, vehicle_classifications, vehicles
from app.routers import identification_types, insurance_companies, policies
from app.routers import mail_config, mail_templates, mail_params, mail_history
from app.tasks import start_scheduler, stop_scheduler





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
app.include_router(mail_config.router)
app.include_router(mail_templates.router)
app.include_router(mail_params.router)
app.include_router(mail_history.router)


@app.on_event("startup")
def _startup() -> None:
    start_scheduler()


@app.on_event("shutdown")
def _shutdown() -> None:
    stop_scheduler()

@app.get("/")
def read_root():
    return {"msg": "API real funcionando correctamente"}