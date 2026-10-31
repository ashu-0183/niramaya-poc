import io
import json
import logging
import uuid
from datetime import datetime, timezone

import requests
from fastapi import APIRouter, Depends, File, HTTPException, Response, UploadFile
from fastapi.concurrency import run_in_threadpool
from PIL import Image, ImageOps

from database import db
from models import ContentIn, FileRecord, SiteContent, User
from security import get_current_admin, verify_origin
from storage import APP_PREFIX, get_object, put_object

router = APIRouter()
logger = logging.getLogger(__name__)
ALLOWED_TYPES = {"image/jpeg": "jpg", "image/png": "png", "image/webp": "webp"}
PIL_FORMATS = {"jpg": "JPEG", "png": "PNG", "webp": "WEBP"}
MAX_UPLOAD = 8 * 1024 * 1024


def _shrink(data: bytes, ext: str) -> bytes:
    try:
        with Image.open(io.BytesIO(data)) as img:
            img = ImageOps.exif_transpose(img)
            img.thumbnail((2000, 2000))
            if ext == "jpg" and img.mode not in ("RGB", "L"):
                img = img.convert("RGB")
            out = io.BytesIO()
            img.save(out, PIL_FORMATS[ext], quality=85, optimize=True)
            return out.getvalue()
    except Exception:
        raise HTTPException(status_code=400, detail="This file could not be read as an image")


@router.get("/content")
async def get_content():
    doc = SiteContent.from_mongo(await db.site_content.find_one({"key": "main"}))
    return doc.model_dump(exclude={"id"}) if doc else {}


@router.put("/content", dependencies=[Depends(verify_origin)])
async def save_content(body: ContentIn, admin: User = Depends(get_current_admin)):
    if len(json.dumps(body.text, ensure_ascii=False)) > 400_000:
        raise HTTPException(status_code=413, detail="Content is too large")
    content = SiteContent(**body.model_dump(), key="main",
                          updated_at=datetime.now(timezone.utc).isoformat(), updated_by=admin.email)
    await db.site_content.replace_one({"key": "main"}, content.to_mongo(), upsert=True)
    return content.model_dump(exclude={"id"})


@router.post("/uploads", dependencies=[Depends(verify_origin)])
async def upload_image(file: UploadFile = File(...), admin: User = Depends(get_current_admin)):
    ext = ALLOWED_TYPES.get(file.content_type or "")
    if not ext:
        raise HTTPException(status_code=400, detail="Please upload a JPG, PNG or WebP image")
    data = await file.read()
    if len(data) > MAX_UPLOAD:
        raise HTTPException(status_code=413, detail="Image must be under 8 MB")
    data = await run_in_threadpool(_shrink, data, ext)
    path = f"{APP_PREFIX}/uploads/{uuid.uuid4().hex}.{ext}"
    try:
        result = await run_in_threadpool(put_object, path, data, file.content_type)
    except requests.RequestException as e:
        logger.error(f"Upload to storage failed: {e}")
        raise HTTPException(status_code=502, detail="Photo storage is busy. Please try the upload again.")
    record = FileRecord(storage_path=result["path"], original_filename=file.filename or "",
                        content_type=file.content_type, size=result.get("size", len(data)),
                        uploaded_by=admin.email, created_at=datetime.now(timezone.utc).isoformat())
    await db.files.insert_one(record.to_mongo())
    return {"url": f"/api/files/{result['path']}", "size": record.size}


@router.get("/files/{path:path}")
async def serve_file(path: str):
    record = FileRecord.from_mongo(await db.files.find_one({"storage_path": path, "is_deleted": False}))
    if not record:
        raise HTTPException(status_code=404, detail="File not found")
    try:
        data, content_type = await run_in_threadpool(get_object, path)
    except requests.RequestException as e:
        logger.error(f"Storage read failed: {e}")
        raise HTTPException(status_code=502, detail="Image temporarily unavailable")
    return Response(content=data, media_type=record.content_type or content_type,
                    headers={"Cache-Control": "public, max-age=31536000, immutable"})
