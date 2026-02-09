from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta
from app.auth import get_password_hash, verify_password, create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES
from app.database import db
from app.models import StudentCreate, StudentModel, Token, StudentResponse

router = APIRouter()

@router.post("/register", response_model=StudentResponse)
async def register(student: StudentCreate):
    # Check if student already exists (reg_no or email)
    existing_student = await db.students.find_one({"$or": [{"reg_no": student.reg_no}, {"email": student.email}]})
    if existing_student:
        raise HTTPException(status_code=400, detail="Student with this Reg No or Email already exists")

    hashed_password = get_password_hash(student.password)
    student_dict = student.dict()
    student_dict.pop("password")
    student_dict["hashed_password"] = hashed_password
    
    new_student = await db.students.insert_one(student_dict)
    created_student = await db.students.find_one({"_id": new_student.inserted_id})
    return created_student

@router.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    # Try finding by reg_no
    user = await db.students.find_one({"reg_no": form_data.username})
    # If not found, try by email
    if not user:
         user = await db.students.find_one({"email": form_data.username})
         
    if not user or not verify_password(form_data.password, user['hashed_password']):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    # Use reg_no as the subject for the token
    access_token = create_access_token(
        data={"sub": user['reg_no']}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}
