# EVENT HORIZON // Vibe-Based Semantic Search

> An experimental, multimodal semantic search engine. Event Horizon bypasses traditional keyword matching, allowing users to query visual datasets using abstract human sentiments, scenarios, and "vibes."

---

## I. Architecture Overview

This project maps human sentiment directly to visual representations using a local, computationally optimized embedding pipeline. 

Abstract text scenarios are processed through OpenAI's Contrastive Language-Image Pretraining (CLIP) model, projecting the query into a 512-dimensional vector space. The system then executes an Inner Product search against a pre-computed FAISS vector database of images, returning the closest semantic visual matches in milliseconds.

**Core Technology Stack:**
* **Inference Engine:** PyTorch (Configured for local inference)
* **Embedding Model:** `openai/clip-vit-base-patch32`
* **Vector Database:** FAISS (Facebook AI Similarity Search)
* **Backend:** Python, FastAPI, Uvicorn
* **Frontend:** React, Vite, Tailwind CSS, Framer Motion
* **WebGL Environment:** React Three Fiber, Three.js
* **Scroll Dynamics:** Lenis

---

## II. System Pipeline

The application relies on a decoupled, two-phase architecture to maintain a lightweight, highly responsive API.

**Phase A: Offline Data Processing**
1. Raw datasets are fetched and sanitized via automated preparation scripts.
2. The pipeline downloads the target media, processes it through the CLIP vision model, normalizes the resulting tensors, and constructs the FAISS index.
3. Outputs are stored locally as `database_clean.json` and `vibe_index.faiss`.

**Phase B: Online Inference API**
1. On startup, the FastAPI server maps the FAISS index and the CLIP text-processor into system memory.
2. The `/search` endpoint intercepts client queries, embeds the text, calculates cosine similarity across the vector space, and returns the highest-scoring metadata to the client.

---

## III. Local Execution Guide

To run this application locally, initialize both the API and the Client on separate ports.

### Prerequisites
* Python 3.10+
* Node.js 18+

### Initialization Sequence

**1. Boot the Backend API**
Execute the following in a dedicated terminal instance to build the environment, generate the vector database, and start the server:
```bash
cd backend
pip install -r requirements.txt

# Generate the local vector database (Required on first run)
python data_prep.py
python generate_embeddings.py

# Initialize the FastAPI server
python main.py