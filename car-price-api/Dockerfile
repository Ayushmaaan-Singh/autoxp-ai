FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Install Python dependencies (layer-cached before source copy)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application source (model included via COPY .)
COPY . .

# Run as non-root for security
RUN adduser --disabled-password --gecos "" appuser \
    && chown -R appuser:appuser /app
USER appuser

EXPOSE 8000

# No --reload in production.
# WEB_CONCURRENCY defaults to 1 to be safe on free-tier hosts.
CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port 8000 --workers ${WEB_CONCURRENCY:-1}"]
