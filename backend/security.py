import os
from datetime import datetime, timedelta, timezone
from urllib.parse import urlparse

import bcrypt
import jwt
from bson import ObjectId
from bson.errors import InvalidId
from fastapi import HTTPException, Request, Response

from database import db
from models import User

JWT_ALGORITHM = "HS256"


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))


def _secret() -> str:
    return os.environ["JWT_SECRET"]


def create_access_token(user_id: str, email: str) -> str:
    payload = {"sub": user_id, "email": email, "type": "access",
               "exp": datetime.now(timezone.utc) + timedelta(minutes=15)}
    return jwt.encode(payload, _secret(), algorithm=JWT_ALGORITHM)


def create_refresh_token(user_id: str) -> str:
    payload = {"sub": user_id, "type": "refresh",
               "exp": datetime.now(timezone.utc) + timedelta(days=7)}
    return jwt.encode(payload, _secret(), algorithm=JWT_ALGORITHM)


def _cookie(response: Response, key: str, value: str, max_age: int):
    response.set_cookie(key=key, value=value, httponly=True, secure=True,
                        samesite="none", max_age=max_age, path="/")


def set_auth_cookies(response: Response, user_id: str, email: str):
    _cookie(response, "access_token", create_access_token(user_id, email), 900)
    _cookie(response, "refresh_token", create_refresh_token(user_id), 604800)


def set_access_cookie(response: Response, user_id: str, email: str):
    _cookie(response, "access_token", create_access_token(user_id, email), 900)


def clear_auth_cookies(response: Response):
    for key in ("access_token", "refresh_token"):
        response.delete_cookie(key, path="/", secure=True, httponly=True, samesite="none")


def decode_token(token: str, expected_type: str) -> dict:
    try:
        payload = jwt.decode(token, _secret(), algorithms=[JWT_ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Session expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
    if payload.get("type") != expected_type:
        raise HTTPException(status_code=401, detail="Invalid token type")
    return payload


async def find_user(user_id: str):
    try:
        oid = ObjectId(user_id)
    except (InvalidId, TypeError):
        return None
    return User.from_mongo(await db.users.find_one({"_id": oid}))


async def get_current_admin(request: Request) -> User:
    token = request.cookies.get("access_token")
    if not token:
        header = request.headers.get("Authorization", "")
        if header.startswith("Bearer "):
            token = header[7:]
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    payload = decode_token(token, "access")
    user = await find_user(payload.get("sub"))
    if not user or user.role != "admin":
        raise HTTPException(status_code=401, detail="User not found")
    return user


def verify_origin(request: Request):
    origin = request.headers.get("origin")
    if not origin:
        return
    host = (request.headers.get("x-forwarded-host") or request.headers.get("host", "")).split(",")[0].strip()
    allowed = {o.strip().rstrip("/") for o in os.environ.get("CORS_ORIGINS", "").split(",")
               if o.strip() not in ("", "*")}
    if urlparse(origin).netloc == host or origin.rstrip("/") in allowed:
        return
    raise HTTPException(status_code=403, detail="Origin not allowed")
