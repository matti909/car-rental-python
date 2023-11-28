from enum import Enum
from bson import ObjectId
from pydantic import BaseModel, Field, EmailStr, validator
from email_validator import validate_email, EmailNotValidError
from typing import Type, List
from typing import Optional


class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        # Creamos un generador que devuelve la función de validación
        yield cls.validate

    @classmethod
    def validate(cls, v):
        # Validamos que el valor 'v' sea un ObjectId válido
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid objectid")
        # Si es válido, devolvemos el ObjectId
        return ObjectId(v)

    @classmethod
    def __modify_schema__(cls, field_schema):
        field_schema.update(type="string")


class MongoBaseModel(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")

    class Config:
        orm_mode = True
        allow_population_by_field_name = True
        json_encoders = {ObjectId: str}


class Role(str, Enum):
    SALESPERSON = "SALESPERSON"
    ADMIN = "ADMIN"


class UserBase(MongoBaseModel):
    username: str = Field(..., min_length=3, max_length=15)
    email: EmailStr
    password: str = Field(...)
    role: Role

    @validator("email")
    def valid_email(cls, v):
        try:
            email = validate_email(v).email
            return email
        except EmailNotValidError as e:
            raise EmailNotValidError

    def __getitem__(self, key):
        return getattr(self, key)


class LoginBase(BaseModel):
    email: str = EmailStr(...)
    password: str = Field(...)


class CurrentUser(BaseModel):
    email: str = EmailStr(...)
    username: str = Field(...)
    role: str = Field(...)


class UserWithoutPassword(UserBase):
    class Config:
        exclude = ['password']


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
