import os
import json
import faiss
import torch
import numpy as np
import logging
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from pydantic import BaseModel, Field
from transformers import CLIPProcessor, CLIPModel
from dotenv import load_dotenv
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from sklearn.decomposition import PCA

load_dotenv()
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger(__name__)

assets = {}

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Initializing Search Engine...")
    device = "cuda" if torch.cuda.is_available() else "cpu"
    model_id = "openai/clip-vit-base-patch32"
    try:
        logger.info(f"Hardware detected: {device.upper()}")
        logger.info(f"Loading CLIP model: {model_id}...")
        assets["model"] = CLIPModel.from_pretrained(model_id).to(device)
        assets["processor"] = CLIPProcessor.from_pretrained(model_id)
        assets["device"] = device
        logger.info("Loading metadata and FAISS index...")
        with open("database_clean.json", "r", encoding="utf-8") as f:
            assets["metadata"] = json.load(f)
        assets["index"] = faiss.read_index("vibe_index.faiss")
        logger.info("Initialization complete. Server ready.")
    except FileNotFoundError as e:
        logger.error(f"CRITICAL: Missing database files. Run generate_embeddings.py first. Details: {e}")
    except Exception as e:
        logger.error(f"Initialization failed: {e}")
    yield
    assets.clear()

app = FastAPI(lifespan=lifespan)
limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("FRONTEND_URL", "http://localhost:5173")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ UPDATED — added top_k with default 3, max 10
class SearchQuery(BaseModel):
    query: str
    top_k: int = Field(default=3, ge=1, le=10)

@app.get("/health")
async def health():
    index_loaded = "index" in assets
    model_loaded = "model" in assets
    return {
        "status": "ok" if (index_loaded and model_loaded) else "degraded",
        "model_loaded": model_loaded,
        "index_loaded": index_loaded,
        "index_size": int(assets["index"].ntotal) if index_loaded else 0,
    }

@app.post("/search")
@limiter.limit("10/minute")
async def search(request: Request, payload: SearchQuery):
    if "index" not in assets or "model" not in assets:
        raise HTTPException(
            status_code=503,
            detail="Search engine not initialized. Ensure the vector index exists on the server."
        )
    try:
        inputs = assets["processor"](
            text=[payload.query],
            return_tensors="pt",
            padding=True
        ).to(assets["device"])

        with torch.no_grad():
            text_features = assets["model"].get_text_features(**inputs)
            text_features /= text_features.norm(p=2, dim=-1, keepdim=True)
            query_vector = text_features.cpu().numpy().astype("float32")

        # ✅ UPDATED — use top_k from payload instead of hardcoded 3
        scores, indices = assets["index"].search(query_vector, payload.top_k)

        results = []
        for i, idx in enumerate(indices[0]):
            if idx == -1 or idx >= len(assets["metadata"]):
                continue
            score = float(scores[0][i])
            # ✅ NEW — confidence threshold: skip weak matches below 0.20
            if score < 0.20:
                logger.info(f"Filtered low-confidence result: idx={idx}, score={score:.4f}")
                continue
            item = assets["metadata"][idx]
            results.append({
                "image_url": item["image_url"],
                "vibe_text": item.get("vibe_text", ""),
                "score": round(score, 4)
            })

        # ✅ NEW — explicit empty response when all results filtered out
        if not results:
            return {
                "query": payload.query,
                "results": [],
                "message": "No strong vibe match found. Try rephrasing your feeling."
            }

        return {"query": payload.query, "results": results}

    except Exception as e:
        logger.error(f"Search error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error during search.")

@app.get("/vectors")
async def get_vectors():
    if "index" not in assets or "metadata" not in assets:
        raise HTTPException(status_code=503, detail="Search engine not ready")

    metadata = assets["metadata"]
    index = assets["index"]
    sample_size = min(200, index.ntotal)

    raw_vectors = faiss.rev_swig_ptr(
        index.get_xb(), index.ntotal * index.d
    ).reshape(index.ntotal, index.d)[:sample_size]

    pca = PCA(n_components=2)
    coords_2d = pca.fit_transform(raw_vectors)

    points = []
    for i in range(sample_size):
        meta = metadata[i] if i < len(metadata) else {}
        vibe_text = meta.get("vibe_text", "")
        short_label = vibe_text.split(";")[0].replace("TEXT:", "").strip()[:60]
        points.append({
            "x": float(coords_2d[i][0]),
            "y": float(coords_2d[i][1]),
            "label": short_label,
            "image_url": meta.get("image_url", ""),
            "category": meta.get("category", ""),
        })

    return {"points": points, "total": index.ntotal}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)