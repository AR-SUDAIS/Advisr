from pydantic import BaseModel, EmailStr, Field, ConfigDict, BeforeValidator
from typing import Optional, List, Annotated
from bson import ObjectId

# Pydantic v2 compatible ObjectId
PyObjectId = Annotated[str, BeforeValidator(str)]

class StudentModel(BaseModel):
    id: Optional[PyObjectId] = Field(default=None, alias="_id")
    name: str = Field(...)
    reg_no: str = Field(...)
    email: EmailStr = Field(...)
    current_semester: int = Field(...)
    hashed_password: str = Field(...)

    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
        json_encoders={ObjectId: str},
        json_schema_extra={
            "example": {
                "name": "John Doe",
                "reg_no": "123456",
                "email": "jdoe@example.com",
                "current_semester": 5,
                "hashed_password": "hashed_secret"
            }
        }
    )

class StudentCreate(BaseModel):
    name: str
    reg_no: str
    email: EmailStr
    current_semester: int
    password: str

class StudentLogin(BaseModel):
    username: str 
    password: str

class StudentResponse(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    name: str
    reg_no: str
    email: EmailStr
    current_semester: int

    model_config = ConfigDict(
        populate_by_name=True,
        from_attributes=True,
        arbitrary_types_allowed=True
    )

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class ChatMessage(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str
