from typing import List, Optional
from bson import ObjectId

from fastapi import (
    APIRouter,
    Request,
    Body,
    UploadFile,
    File,
    status,
    HTTPException,
    Depends,
    Form,
    Path,
)
import cloudinary
import cloudinary.uploader
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from app.authentication import AuthHandler
from app.database import mongodb
from app.models import CarBase, CarDB, CarUpdate
from decouple import config

from PIL import Image, ImageOps

from io import BytesIO


CLOUD_NAME = config("CLOUD_NAME", cast=str)
API_KEY = config("API_KEY", cast=str)
API_SECRET = config("API_SECRET", cast=str)
cloudinary.config(
    cloud_name=CLOUD_NAME,
    api_key=API_KEY,
    api_secret=API_SECRET,
)


router = APIRouter()
auth_handler = AuthHandler()


@router.get("/", response_description="List all cars")
async def list_all_cars(
    owner: Optional[str] = None,
    page: int = 1,
) -> List[CarDB]:
    RESULTS_PER_PAGE = 25
    skip = (page - 1) * RESULTS_PER_PAGE

    full_query = (
        mongodb.collection.find().sort("_id", -1).skip(skip).limit(RESULTS_PER_PAGE)
    )

    results = [CarDB(owner=owner, **raw_car) async for raw_car in full_query]

    return results


# get car by ID
@router.get(
    "/{id}", response_model=CarDB, response_description="Get a single car by ID"
)
async def show_car(id: str = Path(..., title="The ID of the car to get")):
    car = await mongodb.collection.find_one({"_id": ObjectId(id)})

    if car:
        return CarDB(**car)
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND, detail=f"Car with ID {id} not found"
    )


# create new car with FORM DATA
@router.post(
    "/", response_description="Add new car with picture", response_model=CarBase
)
async def create_car_form(
    brand: str = Form("brand"),
    make: str = Form("make"),
    year: int = Form("year"),
    cm3: int = Form("cm3"),
    price: int = Form("price"),
    km: int = Form("km"),
    picture: UploadFile = File(...),
    userId=Depends(auth_handler.auth_wrapper),
):
    # intercept with Pillow
    original_image = Image.open(picture.file)
    gray_image = ImageOps.posterize(original_image, 2)
    out_image = BytesIO()
    gray_image.save(out_image, "JPEG")
    out_image.seek(0)

    # upload to cloudinary
    result = cloudinary.uploader.upload(
        out_image,
        folder="FARM",
        crop="scale",
        width=800,
    )

    url = result.get("url")

    # go through Pydantic
    car = CarDB(
        brand=brand,
        price=price,
        cm3=cm3,
        km=km,
        make=make,
        year=year,
        picture=url,
        owner=userId,
    )

    car = jsonable_encoder(car)

    new_car = await mongodb.db["cars"].insert_one(car)
    created_car = await mongodb.db["cars"].find_one({"_id": new_car.inserted_id})

    return JSONResponse(status_code=status.HTTP_201_CREATED, content=created_car)


@router.patch("/{id}", response_description="Update car")
async def update_task(
    id: str,
    car: CarUpdate = Body(...),
    userId=Depends(auth_handler.auth_wrapper),
):
    # check if the user trying to modify is an admin:
    user = await mongodb.db["users"].find_one({"_id": ObjectId(id)})

    # check if the car is owned by the user trying to modify it
    findCar = await mongodb.db["cars"].find_one({"_id": ObjectId(id)})

    if (findCar["owner"] != userId) and user["role"] != "ADMIN":
        raise HTTPException(
            status_code=401, detail="Only the owner or an admin can update the car"
        )

    await mongodb.db["cars"].update_one(
        {"_id": id}, {"$set": car.dict(exclude_unset=True)}
    )

    if (car := await mongodb.db["cars"].find_one({"_id": id})) is not None:
        return CarDB(**car)  # type: ignore

    raise HTTPException(status_code=404, detail=f"Car with {id} not found")


@router.delete("/{id}", response_description="Delete car")
async def delete_task(id: str, userId=Depends(auth_handler.auth_wrapper)):
    # check if the car is owned by the user trying to delete it
    try:
        findCar = await mongodb.db["cars"].find_one({"_id": id})
        if findCar["owner"] != userId:
            raise HTTPException(
                status_code=401, detail="Only the owner can delete the car"
            )

        delete_result = await mongodb.db["cars"].delete_one({"_id": id})

        if delete_result.deleted_count == 1:
            return JSONResponse(status_code=status.HTTP_204_NO_CONTENT, content={})

    except TypeError:
        raise HTTPException(status_code=404, detail=f"Car with {id} not found")
