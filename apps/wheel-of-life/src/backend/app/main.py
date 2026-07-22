"""Main entry for backend scaffold.

This file stays intentionally small.
Routing is delegated to api layer.
Business orchestration belongs to engines and services.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import router

app = FastAPI(title="Coaching Tools Foundation API", version="0.2.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)


@app.get("/health")
def health() -> dict:
    return {"status": "ok", "app": "coaching-tools-foundation", "version": "0.2.0"}
