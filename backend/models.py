from bson import ObjectId
from pydantic import BaseModel, Field
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


class CarBase(MongoBaseModel):
    brand: str
    make: str
    year: int = Field(...)
    price: int = Field(...)
    km: int = Field(...)
    cm3: int = Field(...)


class CarUpdate(MongoBaseModel):
    price: Optional[int] = None


class CarDB(CarBase):
    pass
