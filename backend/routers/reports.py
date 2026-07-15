from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from core.database import get_db
from models.domain import AgentReport

router = APIRouter(prefix="/report", tags=["reports"])

@router.get("s")  # Maps to /reports
def get_all_reports(db: Session = Depends(get_db)):
    reports = db.query(AgentReport).all()
    return [r.report_data for r in reports]

@router.get("/{task_id}")
def get_report(task_id: str, db: Session = Depends(get_db)):
    report = db.query(AgentReport).filter(AgentReport.task_id == task_id).first()
    if report:
        return report.report_data
    return {"error": "Report not found"}

@router.post("/{task_id}/approve")
def approve_report(task_id: str, db: Session = Depends(get_db)):
    report = db.query(AgentReport).filter(AgentReport.task_id == task_id).first()
    if report:
        report.status = "Approved"
        report.report_data["status"] = "Approved"
        from sqlalchemy.orm.attributes import flag_modified
        flag_modified(report, "report_data")
        db.commit()
        return {"status": "success", "report": report.report_data}
    raise HTTPException(status_code=404, detail="Report not found")

@router.delete("/{task_id}")
def delete_report(task_id: str, db: Session = Depends(get_db)):
    report = db.query(AgentReport).filter(AgentReport.task_id == task_id).first()
    if report:
        db.delete(report)
        db.commit()
        return {"status": "success"}
    raise HTTPException(status_code=404, detail="Report not found")
