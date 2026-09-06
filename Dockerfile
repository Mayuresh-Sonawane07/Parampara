# ==========================================
# Multi-Stage Dockerfile for PARAMPARA AR LITE
# Builds Frontend & Serves via FastAPI Monolith
# ==========================================

# Stage 1: Build the Vite React TypeScript Frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Python FastAPI Production Runner
FROM python:3.11-slim
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install python dependencies
COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source code & assets
COPY backend/ ./backend/
COPY heritage-images/ ./heritage-images/
COPY qr-assets/ ./qr-assets/
COPY ar-assets/ ./ar-assets/

# Copy built frontend from Stage 1
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Expose port (default 8000, or Render/Cloud $PORT)
ENV PORT=8000
ENV PYTHONPATH=/app/backend
EXPOSE 8000

# Launch FastAPI via Uvicorn
CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000} --app-dir /app/backend"]
