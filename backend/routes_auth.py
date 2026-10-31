import os
from datetime import datetime, timedelta, timezone
from typing import List

from fastapi import APIRouter, Depends, HTTPException, Request, Response

from database import db
from models import AdminCreateIn, ChangePasswordIn, LoginIn, User, UserOut
from security import (clear_auth_cookies, decode_token, find_user, get_current_admin,
                      hash_password, set_access_cookie, set_auth_cookies, verify_origin,
                      verify_password)

router = APIRouter()
MAX_ATTEMPTS = 5
LOCK_MINUTES = 15


def _client_ip(request: Request) -> str:
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host if request.client else "unknown"


async def seed_admin():
    email = os.environ["ADMIN_EMAIL"].strip().lower()
    if await db.users.find_one({"email": email}) is None:
        user = User(email=email, password_hash=hash_password(os.environ["ADMIN_PASSWORD"]),
                    name="Admin", role="admin", created_at=datetime.now(timezone.utc).isoformat())
        await db.users.insert_one(user.to_mongo())


@router.post("/auth/login", response_model=UserOut, dependencies=[Depends(verify_origin)])
async def login(body: LoginIn, request: Request, response: Response):
    email = body.email.strip().lower()
    identifier = f"{_client_ip(request)}:{email}"
    now = datetime.now(timezone.utc)
    attempt = await db.login_attempts.find_one({"identifier": identifier}) or {}
    locked_until = attempt.get("locked_until")
    if locked_until and datetime.fromisoformat(locked_until) > now:
        raise HTTPException(status_code=429, detail="Too many failed attempts. Please try again in 15 minutes.")

    user = User.from_mongo(await db.users.find_one({"email": email}))
    if not user or not verify_password(body.password, user.password_hash):
        count = attempt.get("count", 0) + 1
        update = {"count": count, "updated_at": now.isoformat(), "locked_until": None}
        if count >= MAX_ATTEMPTS:
            update.update(count=0, locked_until=(now + timedelta(minutes=LOCK_MINUTES)).isoformat())
        await db.login_attempts.update_one({"identifier": identifier}, {"$set": update}, upsert=True)
        raise HTTPException(status_code=401, detail="Invalid email or password")

    await db.login_attempts.delete_many({"identifier": identifier})
    set_auth_cookies(response, user.id, user.email)
    return UserOut.from_user(user)


@router.post("/auth/logout")
async def logout(response: Response):
    clear_auth_cookies(response)
    return {"ok": True}


@router.get("/auth/me", response_model=UserOut)
async def me(admin: User = Depends(get_current_admin)):
    return UserOut.from_user(admin)


@router.post("/auth/refresh", response_model=UserOut)
async def refresh(request: Request, response: Response):
    token = request.cookies.get("refresh_token")
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    payload = decode_token(token, "refresh")
    user = await find_user(payload.get("sub"))
    if not user or user.role != "admin":
        raise HTTPException(status_code=401, detail="User not found")
    set_access_cookie(response, user.id, user.email)
    return UserOut.from_user(user)


@router.post("/auth/change-password", dependencies=[Depends(verify_origin)])
async def change_password(body: ChangePasswordIn, admin: User = Depends(get_current_admin)):
    if not verify_password(body.current_password, admin.password_hash):
        raise HTTPException(status_code=400, detail="Current password is incorrect")
    await db.users.update_one({"email": admin.email},
                              {"$set": {"password_hash": hash_password(body.new_password)}})
    return {"ok": True}


@router.get("/admins", response_model=List[UserOut])
async def list_admins(_: User = Depends(get_current_admin)):
    docs = await db.users.find({"role": "admin"}).sort("created_at", 1).to_list(100)
    return [UserOut.from_user(User.from_mongo(d)) for d in docs]


@router.post("/admins", response_model=UserOut, dependencies=[Depends(verify_origin)])
async def create_admin(body: AdminCreateIn, _: User = Depends(get_current_admin)):
    email = body.email.strip().lower()
    if await db.users.find_one({"email": email}):
        raise HTTPException(status_code=400, detail="An admin with this email already exists")
    user = User(email=email, password_hash=hash_password(body.password), name=body.name.strip(),
                role="admin", created_at=datetime.now(timezone.utc).isoformat())
    result = await db.users.insert_one(user.to_mongo())
    user.id = str(result.inserted_id)
    return UserOut.from_user(user)


@router.delete("/admins/{user_id}", dependencies=[Depends(verify_origin)])
async def delete_admin(user_id: str, admin: User = Depends(get_current_admin)):
    if user_id == admin.id:
        raise HTTPException(status_code=400, detail="You cannot remove your own account")
    target = await find_user(user_id)
    if not target:
        raise HTTPException(status_code=404, detail="Admin not found")
    await db.users.delete_one({"email": target.email})
    return {"ok": True}
