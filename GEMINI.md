# Project: Vibe-Based Semantic Search Engine (Codename: Event Horizon)

## 1. Project Objective
Build a multimodal semantic search engine. Users input a highly specific text "vibe" or scenario (e.g., "how bro felt when the code compiled"), and the system returns the most semantically relevant meme images from a local vector database. The UI heavily replicates the Awwwards-winning site "Event Horizon"—featuring a cinematic, deep-space WebGL background and aggressive scroll-triggered typography animations.

## 2. Tech Stack & Environment
* **OS:** Local Windows machine
* **Hardware Profile:** Optimized for local GPU acceleration (NVIDIA RTX 4060 / 8GB VRAM) for model inference.
* **Backend:** Python, FastAPI, Uvicorn.
* **AI/Data Processing:** * `transformers` (OpenAI CLIP: `openai/clip-vit-base-patch32`)
  * `torch` (CUDA 12.1 enabled)
  * `faiss-cpu` (Used over faiss-gpu for Windows compatibility)
  * `datasets` (Hugging Face)
* **Frontend:** React, Vite, Tailwind CSS, Framer Motion, React Three Fiber (@react-three/fiber, @react-three/drei), Lenis (Smooth Scrolling).
* **Dataset:** `bhavyagiri/semantic-memes`

## 3. Architecture Breakdown
The application uses a two-step architecture to ensure the FastAPI server remains lightweight and instantly responsive.

* **Step 1: Offline Data Pipeline (Completed)**
  * `backend/data_prep.py`: Downloads dataset, extracts valid image URLs using Regex, and outputs `database.json`.
  * `backend/generate_embeddings.py`: Downloads images, processes them through the CLIP model on the GPU, normalizes the vectors, and builds a FAISS Inner Product index. Outputs `database_clean.json` (working images only) and `vibe_index.faiss`.
* **Step 2: Online Search API (Pending)**
  * `backend/main.py`: A FastAPI server that loads the model, clean JSON, and FAISS index into memory on startup. It exposes a `POST /search` endpoint that embeds user queries and returns the top 3 closest image matches.
* **Step 3: Client Application (Pending)**
  * A React/Vite frontend using Three.js for a reactive particle field. Search transitions trigger a 3D Z-axis camera acceleration, revealing results via Lenis scroll and Framer Motion.

## 4. Coding Standards & Guidelines
* **Color Palette:** Deep cosmic space background (`#130805`) with warm, glowing gold accents (`#f8c869`).
* **Python:** Use `asynccontextmanager` for FastAPI lifespan events. Robust error handling for network requests and missing data.
* **React:** Split into modular components (`App.jsx`, `CanvasBackground.jsx`, `SearchInterface.jsx`, `ResultsParallax.jsx`). No placeholder data; everything must route to the local FastAPI backend.