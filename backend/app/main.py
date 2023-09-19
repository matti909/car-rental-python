from fastapi import FastAPI
from starlette.middleware import Middleware
from starlette.middleware.cors import CORSMiddleware
from colorama import Fore
from app.database import mongodb
from routers.cars import router as cars_router
from routers.users import router as users_router

import uvicorn


origins = [
    "*",
]

middleware = [
    Middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
]


app = FastAPI(middleware=middleware)

app.include_router(cars_router, prefix="/cars", tags=["cars"])
app.include_router(users_router, prefix="/users", tags=["users"])


@app.on_event("startup")
async def startup_db_client():
    try:
        await mongodb.client.start_session()
        print(
            Fore.GREEN + "INFO" + Fore.RESET + ":     ***Conectado a MongoDB Atlas***"
        )
    except Exception as e:
        print("ERROR: Error al conectar a MongoDB Atlas:", str(e))


@app.on_event("shutdown")
async def shutdown_db_client():
    await mongodb.close_connection()


if __name__ == "__main__":
    uvicorn.run("main:app", reload=True)
