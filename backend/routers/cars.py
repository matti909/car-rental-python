from typing import Tuple, List, Optional

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
)
import cloudinary
import cloudinary.uploader
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from authentication import AuthHandler
from models import CarBase, CarDB, CarUpdate
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
    request: Request,
    owner: Optional[str] = None,
    min_price: int = 0,
    max_price: int = 100000,
    brand: Optional[str] = None,
    page: int = 1,
) -> List[CarDB]:
    RESULTS_PER_PAGE = 25
    skip = (page - 1) * RESULTS_PER_PAGE

    full_query = (
        request.app.mongodb["cars"]
        .find()
        .sort("_id", -1)
        .skip(skip)
        .limit(RESULTS_PER_PAGE)
    )

    results = [CarDB(owner=owner, **raw_car) async for raw_car in full_query]

    return results


# create new car with FORM DATA
@router.post("/", response_description="Add new car with picture")
async def create_car_form(
    request: Request,
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

    new_car = await request.app.mongodb["cars"].insert_one(car)
    created_car = await request.app.mongodb["cars"].find_one(
        {"_id": new_car.inserted_id}
    )

    return JSONResponse(status_code=status.HTTP_201_CREATED, content=created_car)
