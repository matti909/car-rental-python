from decouple import config
from fastapi import FastAPI
from starlette.middleware import Middleware
from starlette.middleware.cors import CORSMiddleware
from colorama import Fore

import uvicorn


middleware = [
    Middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
]

from motor.motor_asyncio import AsyncIOMotorClient

from routers.cars import router as cars_router
from routers.users import router as users_router


DB_URL = config("DB_URL", cast=str)
DB_NAME = config("DB_NAME", cast=str)

origins = [
    "*",
]

app = FastAPI(middleware=middleware)

app.include_router(cars_router, prefix="/cars", tags=["cars"])
app.include_router(users_router, prefix="/users", tags=["users"])


@app.on_event("startup")
async def startup_db_client():
    try:
        DB_URL = config("DB_URL", cast=str)
        DB_NAME = config("DB_NAME", cast=str)
        app.mongodb_client = AsyncIOMotorClient(DB_URL)
        app.mongodb = app.mongodb_client[DB_NAME]
        print(
            Fore.GREEN + "INFO" + Fore.RESET + ":     ***Conectado a MongoDB Atlas***"
        )
    except Exception as e:
        print("ERROR: Error al conectar a MongoDB Atlas:", str(e))


@app.on_event("shutdown")
async def shutdown_db_client():
    app.mongodb_client.close()


if __name__ == "__main__":
    uvicorn.run("main:app", reload=True)