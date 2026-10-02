from fastapi import APIRouter, Depends, Request, status



router = APIRouter()


@router.post("/add-properties",  status_code=status.HTTP_200_OK)
async def propertyAddition(data, db: DBSession = Depends(get_db)):
    return AuthService.check_availability(db=db, data=data)
    