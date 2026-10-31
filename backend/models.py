from typing import Annotated, Any, Dict, List, Literal, Optional

from bson import ObjectId
from pydantic import BaseModel, BeforeValidator, ConfigDict, EmailStr, Field, field_validator

Lang = Literal["en", "hi", "mr"]


def _oid_to_str(value):
    return str(value) if isinstance(value, ObjectId) else value


PyObjectId = Annotated[str, BeforeValidator(_oid_to_str)]


class BaseDocument(BaseModel):
    model_config = ConfigDict(populate_by_name=True, extra="ignore")
    id: Optional[PyObjectId] = Field(default=None, alias="_id")

    @classmethod
    def from_mongo(cls, doc):
        return cls.model_validate(doc) if doc else None

    def to_mongo(self) -> dict:
        data = self.model_dump(by_alias=True, exclude={"id"})
        if self.id:
            data["_id"] = ObjectId(self.id)
        return data


class User(BaseDocument):
    email: str
    password_hash: str
    name: str = "Admin"
    role: str = "admin"
    created_at: str


class UserOut(BaseModel):
    id: str
    email: str
    name: str
    role: str

    @classmethod
    def from_user(cls, user: User) -> "UserOut":
        return cls(id=user.id, email=user.email, name=user.name, role=user.role)


class LoginIn(BaseModel):
    email: str = Field(min_length=3, max_length=254)
    password: str = Field(min_length=1, max_length=200)


class ChangePasswordIn(BaseModel):
    current_password: str = Field(min_length=1, max_length=200)
    new_password: str = Field(min_length=8, max_length=200)


class AdminCreateIn(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=200)
    name: str = Field(default="Admin", min_length=1, max_length=80)


class Review(BaseModel):
    id: str = Field(min_length=1, max_length=64)
    name: str = Field(default="", max_length=120)
    service: str = Field(default="", max_length=40)
    rating: int = Field(default=5, ge=1, le=5)
    sample: bool = False
    text: Dict[Lang, str] = Field(default_factory=dict)

    @field_validator("text")
    @classmethod
    def _text_len(cls, value):
        if any(len(v) > 1500 for v in value.values()):
            raise ValueError("Review text must be under 1500 characters")
        return value


class Video(BaseModel):
    id: str = Field(min_length=1, max_length=64)
    title: Dict[Lang, str] = Field(default_factory=dict)
    url: str = Field(default="", max_length=500)

    @field_validator("url")
    @classmethod
    def _url(cls, value):
        value = value.strip()
        if value and not value.startswith(("https://", "http://")):
            raise ValueError("Video link must start with https://")
        return value


class SiteSettings(BaseModel):
    phone: str = Field(default="", max_length=40)
    whatsapp: str = Field(default="", max_length=15, pattern=r"^\d*$")
    address: str = Field(default="", max_length=300)
    waMessage: str = Field(default="", max_length=300)


class ContentIn(BaseModel):
    text: Dict[Lang, Dict[str, Any]] = Field(default_factory=dict)
    settings: SiteSettings = Field(default_factory=SiteSettings)
    images: Dict[str, str] = Field(default_factory=dict)
    reviews: List[Review] = Field(default_factory=list, max_length=30)
    videos: List[Video] = Field(default_factory=list, max_length=12)

    @field_validator("images")
    @classmethod
    def _images(cls, value):
        if len(value) > 30:
            raise ValueError("Too many image slots")
        for v in value.values():
            if v and not v.startswith(("/api/files/", "/assets/")):
                raise ValueError("Invalid image reference")
        return value


class SiteContent(BaseDocument, ContentIn):
    key: str = "main"
    updated_at: Optional[str] = None
    updated_by: Optional[str] = None


class FileRecord(BaseDocument):
    storage_path: str
    original_filename: str
    content_type: str
    size: int
    is_deleted: bool = False
    uploaded_by: str
    created_at: str
