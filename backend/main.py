import os
import json
import faiss
import torch
import numpy as np
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from pydantic import BaseModel
from transformers import CLIPProcessor, CLIPModel
from dotenv import load_dotenv

load_dotenv()

# Global variables to store loaded assets
assets = {}

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Load model and data on startup
    print("Initializing Search Engine...")
    
    device = "cuda" if torch.cuda.is_available() else "cpu"
    model_id = "openai/clip-vit-base-patch32"
    
    try:
        print(f"Hardware detected: {device.upper()}")
        print(f"Loading CLIP model: {model_id}...")
        assets["model"] = CLIPModel.from_pretrained(model_id).to(device)
        assets["processor"] = CLIPProcessor.from_pretrained(model_id)
        assets["device"] = device

        print("Loading metadata and FAISS index...")
        with open("database_clean.json", "r", encoding="utf-8") as f:
            assets["metadata"] = json.load(f)
        
        assets["index"] = faiss.read_index("vibe_index.faiss")
        print("Initialization complete. Server ready.")
    except FileNotFoundError as e:
        print(f"CRITICAL ERROR: Missing required database files. Ensure 'generate_embeddings.py' has been run. Details: {e}")
    except Exception as e:
        print(f"Initialization failed: {e}")
        
    yield
    # Cleanup on shutdown
    assets.clear()

app = FastAPI(lifespan=lifespan)

# Enable CORS to allow requests from the React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("FRONTEND_URL", "http://localhost:5173")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SearchQuery(BaseModel):
    query: str

@app.post("/search")
async def search(payload: SearchQuery):
    if "index" not in assets or "model" not in assets:
        raise HTTPException(
            status_code=503, 
            detail="Search engine not initialized. Please ensure the vector index exists on the server."
        )

    try:
        # 1. Embed the text query
        inputs = assets["processor"](
            text=[payload.query], 
            return_tensors="pt", 
            padding=True
        ).to(assets["device"])
        
        with torch.no_grad():
            text_features = assets["model"].get_text_features(**inputs)
            # Normalize vector for Cosine Similarity (matches IndexFlatIP)
            text_features /= text_features.norm(p=2, dim=-1, keepdim=True)
            query_vector = text_features.cpu().numpy().astype("float32")

        # 2. Search FAISS index for top 3 matches
        k = 3
        scores, indices = assets["index"].search(query_vector, k)

        # 3. Format results
        results = []
        for i, idx in enumerate(indices[0]):
            if idx != -1 and idx < len(assets["metadata"]):
                item = assets["metadata"][idx]
                results.append({
                    "image_url": item["image_url"],
                    "vibe_text": item.get("vibe_text", ""),
                    "score": float(scores[0][i])
                })

        return {"query": payload.query, "results": results}

    except Exception as e:
        print(f"Search error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error during search.")

if __name__ == "__main__":
    import uvicorn
    # Use standard uvicorn entry point
    uvicorn.run(app, host="0.0.0.0", port=8000)
