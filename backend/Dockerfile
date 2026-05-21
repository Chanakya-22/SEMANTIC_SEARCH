# ============================================================
# Event Horizon — Backend Dockerfile
# Python 3.11 slim, CPU-only torch
# ============================================================

FROM python:3.11-slim

# Prevents Python from buffering stdout/stderr — critical for
# seeing logs in Railway/Docker without delay
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1

WORKDIR /app

# Install system dependencies required by faiss-cpu and Pillow
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    g++ \
    libgomp1 \
    && rm -rf /var/lib/apt/lists/*

# Copy and install Python dependencies first (layer cache optimization)
COPY requirements.txt .

# Install torch CPU-only separately first to avoid index-url conflicts
RUN pip install --no-cache-dir \
    torch==2.3.1+cpu \
    --index-url https://download.pytorch.org/whl/cpu

# Install remaining dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application source
COPY . .

# Expose FastAPI port
EXPOSE 8000

# Health check — Railway uses this to verify the container is alive
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/health')"

# Start uvicorn — no --reload in production
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]