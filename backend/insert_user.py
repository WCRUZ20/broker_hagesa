# insert_wcruz.py
from app.database import SessionLocal
from app.models import User
from app.auth import hash_password

db = SessionLocal()

# Usuario a insertar o actualizar
user_cod = "WCRUZ"
user_email = "cruzjimenezwilliam21@gmail.com"
password_clara = "clave1234"

# Verifica si ya existe
usuario = db.query(User).filter(User.user_cod == user_cod).first()

if usuario:
    print("Usuario ya existe. Actualizando contraseña...")
    usuario.user_password = hash_password(password_clara)
else:
    print("Usuario no existe. Insertando...")
    nuevo = User(
        user_name="William",
        last_name="Cruz",
        user_cod=user_cod,
        user_email=user_email,
        user_role="A",
        user_position="Administrador",
        user_status="Habilitado",
        user_password=hash_password(password_clara),
    )
    db.add(nuevo)

db.commit()
print("✅ Usuario insertado o actualizado correctamente.")
