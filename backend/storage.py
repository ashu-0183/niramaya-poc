import os
import time

import requests

APP_PREFIX = "niramaya"
storage_key = None


def _storage_url() -> str:
    base = (os.environ.get("INTEGRATION_PROXY_URL") or "").strip() or "https://integrations.emergentagent.com"
    return base.rstrip("/") + "/objstore/api/v1/storage"


def init_storage(force: bool = False) -> str:
    global storage_key
    if storage_key and not force:
        return storage_key
    resp = requests.post(f"{_storage_url()}/init",
                         json={"emergent_key": os.environ.get("EMERGENT_LLM_KEY")}, timeout=30)
    resp.raise_for_status()
    storage_key = resp.json()["storage_key"]
    return storage_key


def _with_key_retry(call):
    resp = call(init_storage())
    if resp.status_code == 404 and "storage" in resp.text.lower() and "key" in resp.text.lower():
        resp = call(init_storage(force=True))
    if resp.status_code in (500, 502, 503, 504):
        time.sleep(0.8)
        resp = call(init_storage())
    resp.raise_for_status()
    return resp


def put_object(path: str, data: bytes, content_type: str) -> dict:
    resp = _with_key_retry(lambda key: requests.put(
        f"{_storage_url()}/objects/{path}",
        headers={"X-Storage-Key": key, "Content-Type": content_type},
        data=data, timeout=120))
    return resp.json()


def get_object(path: str):
    resp = _with_key_retry(lambda key: requests.get(
        f"{_storage_url()}/objects/{path}",
        headers={"X-Storage-Key": key}, timeout=60))
    return resp.content, resp.headers.get("Content-Type", "application/octet-stream")
