from .inventory import router as inventory_router
from .agents import router as agents_router
from .reports import router as reports_router
from .dashboard import router as dashboard_router

__all__ = [
    "inventory_router",
    "agents_router",
    "reports_router",
    "dashboard_router"
]
