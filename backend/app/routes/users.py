from fastapi import APIRouter, Depends
from app.auth import get_current_user
from app.models import StudentResponse

router = APIRouter()

@router.get("/users/me", response_model=StudentResponse)
async def read_users_me(current_user: dict = Depends(get_current_user)):
    return current_user
