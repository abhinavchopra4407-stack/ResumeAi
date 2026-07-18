FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PORT=10000

WORKDIR /app

COPY . /app

RUN if [ -f /app/app/requirements.txt ]; then \
        pip install --upgrade pip && \
        pip install --no-cache-dir -r /app/app/requirements.txt; \
    else \
        pip install --upgrade pip && \
        pip install --no-cache-dir -r /app/backend/app/requirements.txt; \
    fi

EXPOSE 10000

CMD ["sh", "-c", "if [ -d /app/app ]; then python -m uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-10000}; else python -m uvicorn backend.app.main:app --host 0.0.0.0 --port ${PORT:-10000}; fi"]
