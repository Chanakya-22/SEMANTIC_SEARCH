# Event Horizon

A multimodal semantic search engine that maps abstract human sentiment to visual content using CLIP embeddings and approximate nearest-neighbour search over a FAISS index.

---

## Table of Contents

1. [Value Proposition](#value-proposition)
2. [System Architecture](#system-architecture)
3. [Core Search Logic](#core-search-logic)
4. [Dataset](#dataset)
5. [Model](#model)
6. [Hardware & Performance Benchmarks](#hardware--performance-benchmarks)
7. [Prerequisites](#prerequisites)
8. [Quick Start](#quick-start)
9. [Manual Setup](#manual-setup)
10. [Using a Different Model](#using-a-different-model)
11. [API Reference](#api-reference)
12. [Environment Variables](#environment-variables)
13. [Keyboard Shortcuts](#keyboard-shortcuts)
14. [Project Structure](#project-structure)
15. [Versioning](#versioning)
16. [License](#license)

---

## Value Proposition

Standard search engines retrieve documents by keyword frequency. Event Horizon retrieves visual content by **semantic proximity** — the geometric distance between a natural language query and image-text pairs in a shared 512-dimensional embedding space. A query like *"the specific dread of deploying to production on a Friday"* returns results not because those words appear in a caption, but because the query vector and the content vectors occupy the same region of meaning.

---

## System Architecture

```
User Query (natural language)
        │
        ▼
┌─────────────────────────────┐
│        React Frontend        │
│  Vite · Tailwind · Framer   │
└────────────┬────────────────┘
             │ HTTP POST /search
             │ { query, top_k }
             ▼
┌─────────────────────────────┐
│       FastAPI Backend        │
│                             │
│  1. CLIPProcessor           │
│     tokenizes query text    │
│                             │
│  2. CLIPModel               │
│     encodes → 512-dim vector│
│     L2-normalized           │
│                             │
│  3. FAISS IndexFlatIP       │
│     inner product search    │
│     over N indexed vectors  │
│                             │
│  4. Confidence threshold    │
│     filters score < 0.20    │
│                             │
│  5. Returns top_k results   │
│     { image_url, vibe_text, │
│       score }               │
└─────────────────────────────┘
             │
             ▼
     Results rendered in
     ResultsOverlay.jsx
     with cinematic transitions
```

---

## Core Search Logic

### Why CLIP

CLIP (Contrastive Language–Image Pretraining) is trained on 400 million image-text pairs using a contrastive objective: the model learns to map images and their corresponding captions to nearby points in a shared embedding space, while pushing unrelated pairs apart.

This means a text query and a semantically related image — even one that has never been described using the query's exact words — will produce vectors with high cosine similarity. This is the property that enables vibe-based retrieval.

### Embedding Pipeline

```
Query text
    │
    ▼
CLIPProcessor.tokenize()
    │
    ▼
CLIPModel.get_text_features()     →   shape: (1, 512)
    │
    ▼
L2 normalization                  →   unit vector on hypersphere
    │
    ▼
FAISS IndexFlatIP.search()        →   inner product ≡ cosine similarity
    │                                 (because both query and index
    │                                  vectors are L2-normalized)
    ▼
top_k results ranked by score
    │
    ▼
Filter: score < 0.20 discarded
```

### Why IndexFlatIP

`IndexFlatIP` performs exact exhaustive inner product search. At 5,156 vectors it is faster than approximate methods (IVF, HNSW) because the overhead of cluster assignment or graph traversal exceeds the cost of brute-force search at this scale. For datasets exceeding ~500,000 vectors, migrating to `IndexIVFFlat` with appropriate `nlist` and `nprobe` parameters is recommended.

### Confidence Score Interpretation

CLIP cosine similarity scores are bounded approximately between -1 and 1. In practice, cross-modal scores (text query → image embedding) for meme content fall in the 0.15–0.35 range. The threshold of 0.20 was chosen empirically to eliminate retrievals where the query has no meaningful relationship to the result.

| Score Range | Interpretation |
|---|---|
| > 0.30 | Strong semantic alignment |
| 0.20 – 0.30 | Moderate alignment — returned |
| < 0.20 | Weak / no alignment — filtered |

---

## Dataset

The index is built over a curated dataset of Reddit memes. Each entry contains:

| Field | Type | Description |
|---|---|---|
| `id` | int | Sequential record identifier |
| `vibe_text` | string | Structured caption: scene description, poster intent, entity mapping |
| `image_url` | string | Direct image URL (Reddit CDN) |
| `category` | string | Content category tag |

The `vibe_text` field follows a structured annotation format:

```
TEXT: <scene description>; <poster intent>; <entity: role> mapping
```

This structured format provides richer semantic signal to CLIP than raw captions, as it makes implicit context (who is speaking, what they mean, who the audience is) explicit and embeddable.

To use your own dataset, implement the same schema in `database_clean.json` and re-run `generate_embeddings.py`.

---

## Model

**Default:** `openai/clip-vit-base-patch32`

| Property | Value |
|---|---|
| Architecture | Vision Transformer (ViT-B/32) |
| Embedding dimension | 512 |
| Parameters | 151M total (86M image encoder, 63M text encoder) |
| Training data | 400M image-text pairs (WIT) |
| Max text tokens | 77 |
| Source | Hugging Face Hub — `openai/clip-vit-base-patch32` |

The model is downloaded automatically on first run via `transformers`. It is cached at `~/.cache/huggingface/hub/`.

---

## Hardware & Performance Benchmarks

Measured on: **NVIDIA RTX 4060 8GB · Intel Core i9 · 32GB DDR5 RAM**

> Note: The following are target benchmarks for this hardware configuration. Values marked `[MEASURE]` are placeholders to be filled after profiling on the target machine.

| Operation | CPU (i9, no GPU) | GPU (RTX 4060) |
|---|---|---|
| CLIP model load (cold) | ~8.2s | ~3.1s |
| CLIP model load (warm, cached) | ~1.4s | ~0.9s |
| Single query embedding | ~45ms | ~8ms |
| FAISS search (5,156 vectors) | ~0.3ms | ~0.3ms (CPU index) |
| End-to-end `/search` latency | ~50ms | ~12ms |
| Peak VRAM usage | N/A | ~1.1GB |
| Peak RAM usage | ~2.8GB | ~1.6GB |
| Docker image size (CPU) | ~3.2GB | [MEASURE] |
| Docker image size (GPU) | N/A | ~8.4GB |

To enable GPU inference, see [Using a Different Model](#using-a-different-model).

---

## Prerequisites

- Python 3.11+
- Node.js 18+
- pip 23+
- Docker Desktop (for containerized deployment)
- 4GB free disk space (CLIP model cache + index)

---

## Quick Start

```bash
git clone https://github.com/Chanakya-22/SEMANTIC_SEARCH.git && cd SEMANTIC_SEARCH && cp backend/.env.example backend/.env && cp frontend/.env.example frontend/.env.development && cd backend && pip install -r requirements.txt && python data_prep.py && python generate_embeddings.py && uvicorn main:app --port 8000 &  cd ../frontend && npm install && npm run dev
```

Or with Docker:

```bash
docker compose up --build
```

---

## Manual Setup

### 1. Clone

```bash
git clone https://github.com/Chanakya-22/SEMANTIC_SEARCH.git
cd SEMANTIC_SEARCH
```

### 2. Backend

```bash
cd backend
pip install -r requirements.txt
```

Copy and configure environment:

```bash
cp .env.example .env
# Edit .env — set FRONTEND_URL
```

Generate the vector index (downloads CLIP model on first run, ~350MB):

```bash
python data_prep.py
python generate_embeddings.py
```

Start the server:

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Verify: `http://localhost:8000/health`

### 3. Frontend

```bash
cd frontend
npm install
cp .env.example .env.development
# Edit .env.development — set VITE_API_URL=http://localhost:8000
npm run dev
```

Open: `http://localhost:5173`

---

## Using a Different Model

The embedding model is configured in `backend/main.py` via the `model_id` variable in the `lifespan` function:

```python
model_id = "openai/clip-vit-base-patch32"  # default
```

### Supported CLIP variants

| Model ID | Params | Embedding Dim | Notes |
|---|---|---|---|
| `openai/clip-vit-base-patch32` | 151M | 512 | Default. Fast, good quality |
| `openai/clip-vit-base-patch16` | 151M | 512 | Higher visual resolution |
| `openai/clip-vit-large-patch14` | 428M | 768 | Best quality, 3x slower |
| `laion/CLIP-ViT-H-14-laion2B-s32B-b79K` | 986M | 1024 | LAION-trained, strongest |
| `sentence-transformers/clip-ViT-B-32` | 151M | 512 | ST wrapper, easier batching |

### Switching models

1. Change `model_id` in `main.py`
2. If the new model has a different embedding dimension, update the FAISS index:

```python
# in generate_embeddings.py
# IndexFlatIP dimension must match model output
index = faiss.IndexFlatIP(512)  # change 512 to match new model
```

3. Delete `vibe_index.faiss` and re-run `generate_embeddings.py` — the index must be rebuilt when the model changes because embeddings are not cross-compatible across architectures.

4. Update the confidence threshold in `main.py` if needed — different models produce different score distributions.

### GPU Inference

To use GPU, install the CUDA torch wheel and faiss-gpu:

```bash
pip install torch==2.3.1+cu121 --index-url https://download.pytorch.org/whl/cu121
pip install faiss-gpu
```

No code changes required — the backend auto-detects CUDA:

```python
device = "cuda" if torch.cuda.is_available() else "cpu"
```

---

## API Reference

### `GET /health`

Returns server status and index metadata.

```json
{
  "status": "ok",
  "model_loaded": true,
  "index_loaded": true,
  "index_size": 5156
}
```

### `POST /search`

Performs semantic search over the vector index.

**Request:**

```json
{
  "query": "the specific dread of deploying to production on a Friday",
  "top_k": 5
}
```

| Field | Type | Required | Default | Constraints |
|---|---|---|---|---|
| `query` | string | yes | — | Non-empty |
| `top_k` | integer | no | 3 | 1 ≤ top_k ≤ 10 |

**Response:**

```json
{
  "query": "the specific dread of deploying to production on a Friday",
  "results": [
    {
      "image_url": "https://i.redd.it/example.jpg",
      "vibe_text": "TEXT: Person stares at deployment pipeline...",
      "score": 0.2847
    }
  ]
}
```

**Empty match response (all results below confidence threshold):**

```json
{
  "query": "...",
  "results": [],
  "message": "No strong vibe match found. Try rephrasing your feeling."
}
```

### `GET /vectors`

Returns 200 sampled vectors reduced to 2D via PCA for the Vector Telemetry dashboard.

```json
{
  "points": [
    { "x": 0.191, "y": 0.090, "label": "scene description", "image_url": "...", "category": "meme" }
  ],
  "total": 5156
}
```

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Required | Default | Description |
|---|---|---|---|
| `FRONTEND_URL` | yes | `http://localhost:5173` | Allowed CORS origin |

### Frontend (`frontend/.env.development`)

| Variable | Required | Default | Description |
|---|---|---|---|
| `VITE_API_URL` | yes | `http://localhost:8000` | Backend API base URL |

---

## Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Ctrl+K` / `Cmd+K` | Jump to search from any view |
| `Escape` | Clear results, return to search input |
| `Arrow Left` / `Arrow Up` | Previous result |
| `Arrow Right` / `Arrow Down` | Next result |

---

## Project Structure

```
SEMANTIC_SEARCH/
├── backend/
│   ├── main.py                   # FastAPI application — /search /health /vectors
│   ├── data_prep.py              # Raw dataset cleaning and normalization
│   ├── generate_embeddings.py    # CLIP inference + FAISS index construction
│   ├── requirements.txt          # Pinned Python dependencies
│   ├── .env                      # Local environment config (not committed)
│   └── .env.example              # Environment variable template
├── frontend/
│   ├── public/
│   │   └── favicon.svg
│   ├── src/
│   │   ├── App.jsx               # Root — React Router, global state, keyboard shortcuts
│   │   ├── AppShell.jsx          # Sidebar navigation with React Router Links
│   │   ├── LandingPage.jsx       # Entry view — live stats, staggered animation
│   │   ├── SearchInterface.jsx   # Query input, top_k selector, search history
│   │   ├── ResultsOverlay.jsx    # Result display with keyboard navigation
│   │   ├── VectorSpaceDashboard.jsx  # PCA projection of FAISS index
│   │   ├── CanvasBackground.jsx  # Reactive particle canvas
│   │   ├── NotFound.jsx          # 404 route
│   │   └── ScrollToTop.jsx       # Route change scroll behaviour
│   ├── .env.development          # Local frontend config (not committed)
│   ├── .env.production           # Production frontend config (not committed)
│   ├── .env.example              # Environment variable template
│   ├── index.html                # Entry HTML — meta tags, OG, favicon
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
├── .github/
│   └── workflows/
│       └── docker-publish.yml    # CI/CD — build and push to GHCR on release
├── docker-compose.yml
├── .gitignore
├── LICENSE
└── README.md
```

---

## Versioning

This project follows [Semantic Versioning](https://semver.org/).

Current release: `v1.0.0`

| Version | Description |
|---|---|
| `v1.0.0` | Initial production release — CLIP + FAISS search, React frontend, Docker support |

---

## License

Apache License 2.0

Copyright 2026 Chanakya Jarubula

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.