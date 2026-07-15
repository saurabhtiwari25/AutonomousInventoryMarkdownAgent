from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from core.database import engine
from models.domain import Base
from routers import inventory_router, agents_router, reports_router, dashboard_router

# Create missing tables safely
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Autonomous Inventory & Markdown Agent")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {"status": "ok"}

# Include routers
app.include_router(inventory_router)
app.include_router(agents_router)
app.include_router(reports_router)
app.include_router(dashboard_router)
