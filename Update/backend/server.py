from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import re
import logging
from pathlib import Path
from pydantic import BaseModel, Field, BeforeValidator, ConfigDict
from typing import List, Optional, Annotated, Any
from bson import ObjectId
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI(title="Tanda API")
api_router = APIRouter(prefix="/api")

VALID_COLORS = {"red", "orange", "yellow", "green", "mint", "teal", "cyan",
                "blue", "indigo", "purple", "pink", "brown", "gray"}
ICON_RE = re.compile(r"^[a-z][a-z0-9-]{0,39}$")


class _IconSet:
    """Ikon divalidasi lewat pola; daftar resmi dikirim dari frontend."""

    def __contains__(self, icon):
        return bool(ICON_RE.match(icon or ""))


VALID_ICONS = _IconSet()
DATE_RE = re.compile(r"^\d{4}-\d{2}-\d{2}$")


def coerce_object_id(v: Any) -> str:
    return str(v)


PyObjectId = Annotated[str, BeforeValidator(coerce_object_id)]


class BaseDocument(BaseModel):
    model_config = ConfigDict(populate_by_name=True, extra="ignore")
    id: PyObjectId = Field(default_factory=lambda: str(ObjectId()), alias="_id")

    def to_mongo(self):
        d = self.model_dump(by_alias=True)
        if isinstance(d.get("_id"), str):
            d["_id"] = ObjectId(d["_id"])
        return d

    @classmethod
    def from_mongo(cls, doc):
        if doc and isinstance(doc.get("_id"), ObjectId):
            doc = {**doc, "_id": str(doc["_id"])}
        return cls(**doc)


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


class Marker(BaseDocument):
    date: str
    color: str
    label: str
    icon: str = "check-circle"
    created_at: str = Field(default_factory=now_iso)
    updated_at: str = Field(default_factory=now_iso)


class MarkerCreate(BaseModel):
    date: str
    color: str
    label: str
    icon: str = "check-circle"


class MarkerUpdate(BaseModel):
    date: Optional[str] = None
    color: Optional[str] = None
    label: Optional[str] = None
    icon: Optional[str] = None


def validate_marker_data(date: str, color: str, icon: str):
    if not DATE_RE.match(date or ""):
        raise HTTPException(status_code=400, detail="Format tanggal harus YYYY-MM-DD")
    if color not in VALID_COLORS:
        raise HTTPException(status_code=400, detail="Warna tidak valid")
    if icon not in VALID_ICONS:
        raise HTTPException(status_code=400, detail="Ikon tidak valid")


def validate_label(label: str) -> str:
    label = (label or "").strip()
    if not label:
        raise HTTPException(status_code=400, detail="Keterangan wajib diisi")
    if len(label) > 80:
        raise HTTPException(status_code=400, detail="Keterangan maksimal 80 karakter")
    return label


@api_router.get("/")
async def root():
    return {"message": "Tanda API berjalan"}


@api_router.get("/markers", response_model=List[Marker], response_model_by_alias=False)
async def get_markers():
    docs = await db.markers.find().to_list(10000)
    return [Marker.from_mongo(d) for d in docs]


@api_router.post("/markers", response_model=Marker, response_model_by_alias=False)
async def create_marker(input: MarkerCreate):
    label = validate_label(input.label)
    validate_marker_data(input.date, input.color, input.icon)
    marker = Marker(date=input.date, color=input.color, label=label, icon=input.icon)
    _ = await db.markers.insert_one(marker.to_mongo())
    return marker


@api_router.patch("/markers/{marker_id}", response_model=Marker, response_model_by_alias=False)
async def update_marker(marker_id: str, input: MarkerUpdate):
    try:
        oid = ObjectId(marker_id)
    except Exception:
        raise HTTPException(status_code=400, detail="ID tidak valid")
    existing = await db.markers.find_one({"_id": oid})
    if not existing:
        raise HTTPException(status_code=404, detail="Penanda tidak ditemukan")
    updates = input.model_dump(exclude_none=True)
    if not updates:
        raise HTTPException(status_code=400, detail="Tidak ada perubahan")
    if "date" in updates and not DATE_RE.match(updates["date"]):
        raise HTTPException(status_code=400, detail="Format tanggal harus YYYY-MM-DD")
    if "color" in updates and updates["color"] not in VALID_COLORS:
        raise HTTPException(status_code=400, detail="Warna tidak valid")
    if "icon" in updates and updates["icon"] not in VALID_ICONS:
        raise HTTPException(status_code=400, detail="Ikon tidak valid")
    if "label" in updates:
        updates["label"] = validate_label(updates["label"])
    updates["updated_at"] = now_iso()
    await db.markers.update_one({"_id": oid}, {"$set": updates})
    doc = await db.markers.find_one({"_id": oid})
    return Marker.from_mongo(doc)


@api_router.delete("/markers/{marker_id}")
async def delete_marker(marker_id: str):
    try:
        oid = ObjectId(marker_id)
    except Exception:
        raise HTTPException(status_code=400, detail="ID tidak valid")
    result = await db.markers.delete_one({"_id": oid})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Penanda tidak ditemukan")
    return {"success": True, "id": marker_id}


@api_router.get("/legend")
async def get_legend():
    pipeline = [
        {"$group": {"_id": {"label": "$label", "color": "$color", "icon": "$icon"},
                     "count": {"$sum": 1}, "dates": {"$push": "$date"}}},
        {"$sort": {"count": -1}},
    ]
    rows = await db.markers.aggregate(pipeline).to_list(200)
    return [{"label": r["_id"]["label"], "color": r["_id"]["color"],
             "icon": r["_id"]["icon"], "count": r["count"], "dates": sorted(r["dates"])}
            for r in rows]


SEED_MARKERS = [
    ("2026-09-20", "green", "Lunas", "check-circle"),
    ("2026-09-21", "green", "Lunas", "check-circle"),
    ("2026-09-22", "green", "Lunas", "check-circle"),
    ("2026-09-23", "yellow", "Token Listrik", "zap"),
    ("2026-09-24", "red", "Belum Lunas", "x-circle"),
    ("2026-09-25", "red", "Belum Lunas", "x-circle"),
    ("2026-09-26", "red", "Belum Lunas", "x-circle"),
    ("2026-09-27", "red", "Belum Lunas", "x-circle"),
]


@app.on_event("startup")
async def seed_db():
    try:
        if await db.markers.count_documents({}) == 0:
            ts = now_iso()
            docs = [Marker(date=d, color=c, label=l, icon=i,
                           created_at=ts, updated_at=ts).to_mongo()
                    for d, c, l, i in SEED_MARKERS]
            await db.markers.insert_many(docs)
            logger.info("Data contoh berhasil di-seed")
    except Exception as e:
        logger.error(f"Seed gagal: {e}")


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
