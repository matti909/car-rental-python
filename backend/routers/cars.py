from typing import Tuple, List, Optional

from fastapi import APIRouter, Request, Body, status, HTTPException
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse


from models import CarBase, CarDB, CarUpdate


router = APIRouter()


@router.get("/", response_description="List all cars")
async def list_all_cars(
    request: Request,
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

    results = [CarDB(**raw_car) async for raw_car in full_query]

    # this is also possible
    # results = await full_query.to_list(1000)

    return results


@router.post("/", response_description="Add new car")
async def create_car(request: Request, car: CarBase = Body(...)):
    car = jsonable_encoder(car)

    new_car = await request.app.mongodb["cars1"].insert_one(car)
    created_car = await request.app.mongodb["cars1"].find_one(
        {"_id": new_car.inserted_id}
    )

    return JSONResponse(status_code=status.HTTP_201_CREATED, content=created_car)
