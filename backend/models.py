from enum import Enum
from bson import ObjectId
from pydantic import BaseModel, Field, EmailStr, validator
from email_validator import validate_email, EmailNotValidError
from typing import Type, List
from typing import Optional


class PyObjectId(ObjectId):
    @classmethod
    def __pydantic_post_root_validators__(
        cls: Type["PyObjectId"], model: "PyObjectId", values: dict
    ) -> dict:
        # Implementamos nuestra función de validación en el método __pydantic_post_root_validators__
        v = values.get("id")
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid objectid")
        return values

    @classmethod
    def __get_validators__(cls):
        # Podemos mantener esta función para seguir utilizando la validación de PyObjectId
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid objectid")
        return cls(v)


class MongoBaseModel(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")

    class Config:
        json_encoders = {ObjectId: str}


class Role(str, Enum):
    SALESPERSON = "SALESPERSON"
    ADMIN = "ADMIN"


class UserBase(MongoBaseModel):
    username: str = Field(..., min_length=3, max_length=15)
    email: str = Field(...)
    password: str = Field(...)
    role: Role

    @validator("email")
    def valid_email(cls, v):
        try:
            email = validate_email(v).email
            return email
        except EmailNotValidError as e:
            raise EmailNotValidError


class LoginBase(BaseModel):
    email: str = EmailStr(...)
    password: str = Field(...)


class CurrentUser(BaseModel):
    email: str = EmailStr(...)
    username: str = Field(...)
    role: str = Field(...)


class CarBase(MongoBaseModel):
    brand: str
    make: str
    year: int = Field(...)
    price: int = Field(...)
    km: int = Field(...)
    cm3: int = Field(...)
    picture: Optional[str] = None


class CarDB(CarBase):
    owner: Optional[str] = Field(None)


class CarUpdate(MongoBaseModel):
    price: Optional[int] = None
