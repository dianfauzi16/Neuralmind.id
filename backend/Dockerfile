FROM python:3.10-slim

# Set working directory
WORKDIR /app

# Set environment variables
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements file
COPY requirements.txt .

# Install Python dependencies
RUN pip install --upgrade pip && \
    pip install -r requirements.txt

# Copy application code
COPY . .

# Expose port (Render akan menggunakan $PORT secara dinamis)
EXPOSE 8000

# Start FastAPI app
# $PORT akan disediakan oleh Render, fallback ke 8000 untuk lokal
CMD sh -c "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"
