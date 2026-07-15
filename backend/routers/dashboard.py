from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from core.database import get_db
import crud
from models.domain import AgentTask, AgentReport

router = APIRouter(tags=["dashboard"])

@router.get("/dashboard-stats")
def get_stats(db: Session = Depends(get_db)):
    active_agents = db.query(AgentTask).filter(AgentTask.status == "started").count()
    total_reports = db.query(AgentReport).count()
    return crud.get_dashboard_stats(db, active_agents, total_reports)
