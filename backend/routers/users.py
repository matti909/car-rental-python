from fastapi import APIRouter, Request, Body, status, HTTPException, Depends
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse

from app.models import UserBase, LoginBase, CurrentUser

from app.authentication import AuthHandler
from app.database import mongodb
import re

router = APIRouter()

# instantiate the Auth Handler
auth_handler = AuthHandler()

# register user
# validate the data and create a user if the username and the email are valid and available


@router.post("/register", response_description="Register user")
async def register(newUser: UserBase = Body(...)) -> UserBase:
    # Verifica que el correo electrónico tenga un formato válido
    if not re.match(r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$", newUser.email):
        raise HTTPException(status_code=400, detail="Invalid email address")

    # Verifica que la contraseña cumpla con los requisitos
    if not (6 <= len(newUser.password) <= 16) or not re.match(
        "^[a-zA-Z0-9]+$", newUser.password
    ):
        raise HTTPException(
            status_code=400,
            detail=f"Password must be alphanumeric and between 6 and 16 characters",
        )
    # hash the password before inserting it into MongoDB
    newUser.password = auth_handler.get_password_hash(newUser.password)

    newUser = jsonable_encoder(newUser)

    # check existing user or email 409 Conflict:
    if (
        existing_email := await mongodb.db["users"].find_one(
            {"email": newUser["email"]}
        )
        is not None
    ):
        raise HTTPException(
            status_code=409, detail=f"User with email {newUser['email']} already exists"
        )

    user = await mongodb.db["users"].insert_one(newUser)
    created_user = await mongodb.db["users"].find_one({"_id": user.inserted_id})

    return created_user


# post user
@router.post("/login", response_description="Login user")
async def login(request: Request, loginUser: LoginBase = Body(...)) -> JSONResponse:
    user = await request.app.mongodb["users"].find_one({"email": loginUser.email})

    if (user is None) or (
        not auth_handler.verify_password(loginUser.password, user["password"])
    ):
        raise HTTPException(status_code=401, detail="Invalid email and/or password")

    token = auth_handler.encode_token(user["_id"])
    response = JSONResponse(
        content={"token": token, "user": CurrentUser(**user).dict()}
    )

    return response


# me route
@router.get("/me", response_description="Logged in user data")
async def me(userId=Depends(auth_handler.auth_wrapper)):
    currentUser = await mongodb.db["users"].find_one({"_id": userId})
    result = CurrentUser(**currentUser).dict()
    result["id"] = userId

    return JSONResponse(status_code=status.HTTP_200_OK, content=result)
