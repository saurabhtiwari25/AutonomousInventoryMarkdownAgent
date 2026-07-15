from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
import uuid
import time
import json
import asyncio
from datetime import datetime
from typing import Dict, Any

from core.database import get_db, SessionLocal
from models.domain import AgentTask, AgentReport, SystemState
from agents.workflow import app_workflow

router = APIRouter(tags=["agents"])

def get_default_monitor_state():
    return {
        "agents": {
            "Inventory_Agent": {"status": "Idle", "last_run": "Never", "duration": 0, "message": "Ready"},
            "Sales_Analysis_Agent": {"status": "Idle", "last_run": "Never", "duration": 0, "message": "Ready"},
            "SQL_Agent": {"status": "Idle", "last_run": "Never", "duration": 0, "message": "Ready"},
            "Pricing_Agent": {"status": "Idle", "last_run": "Never", "duration": 0, "message": "Ready"},
            "Risk_Analysis_Agent": {"status": "Idle", "last_run": "Never", "duration": 0, "message": "Ready"},
            "Report_Agent": {"status": "Idle", "last_run": "Never", "duration": 0, "message": "Ready"},
        },
        "mcp_calls": []
    }

@router.post("/analyze")
async def analyze_inventory(data: Dict[str, Any], db: Session = Depends(get_db)):
    task_id = str(uuid.uuid4())
    db_task = AgentTask(task_id=task_id, status="started", payload=data)
    db.add(db_task)
    db.commit()
    return {"task_id": task_id, "status": "started"}

async def run_workflow_generator(task_id: str, payload: dict):
    state = {
        "product_id": payload.get("product_id", "P001"),
        "product_name": payload.get("product_name", "Test Product"),
        "current_price": payload.get("current_price", 100.0),
        "unit_cost": payload.get("unit_cost", 50.0),
        "stock_quantity": payload.get("stock_quantity", 1000),
        "monthly_sales": payload.get("monthly_sales", 10)
    }
    
    try:
        start_time = time.time()
        for output in app_workflow.stream(state):
            for key, value in output.items():
                node_name = key
                
                with SessionLocal() as db:
                    monitor = db.query(SystemState).filter(SystemState.key == "global_monitor").first()
                    monitor_state = monitor.state_value.copy() if monitor else get_default_monitor_state()
                    
                    monitor_state["agents"][node_name] = {
                        "status": "Completed",
                        "last_run": datetime.utcnow().isoformat() + "Z",
                        "duration": round(time.time() - start_time, 2),
                        "message": "Processed successfully"
                    }
                    
                    mcp_calls = list(monitor_state.get("mcp_calls", []))
                    mcp_calls.insert(0, {
                        "timestamp": datetime.utcnow().isoformat() + "Z",
                        "tool_name": f"{node_name.lower()}_call",
                        "status": "Success",
                        "duration": f"{int((time.time() - start_time)*1000)}ms"
                    })
                    monitor_state["mcp_calls"] = mcp_calls[:10]
                    
                    if not monitor:
                        monitor = SystemState(key="global_monitor", state_value=monitor_state)
                        db.add(monitor)
                    else:
                        monitor.state_value = monitor_state
                        from sqlalchemy.orm.attributes import flag_modified
                        flag_modified(monitor, "state_value")
                    db.commit()
                
                start_time = time.time()
                event_timestamp = datetime.utcnow().isoformat() + "Z"
                yield f"data: {json.dumps({'node': key, 'status': 'completed', 'timestamp': event_timestamp, 'data': value})}\n\n"
                await asyncio.sleep(1)
            state.update(list(output.values())[0])
            
        final_report = state.get("final_report", {})
        final_report["status"] = "Pending"
        final_report["task_id"] = task_id
        
        with SessionLocal() as db:
            db_report = AgentReport(task_id=task_id, status="Pending", report_data=final_report)
            db.add(db_report)
            db_task = db.query(AgentTask).filter(AgentTask.task_id == task_id).first()
            if db_task:
                db_task.status = "completed"
            db.commit()
            
        yield f"data: {json.dumps({'node': 'END', 'status': 'completed', 'task_id': task_id})}\n\n"
    except Exception as e:
        with SessionLocal() as db:
            db_task = db.query(AgentTask).filter(AgentTask.task_id == task_id).first()
            if db_task:
                db_task.status = "failed"
            db.commit()
        yield f"data: {json.dumps({'node': 'ERROR', 'status': 'failed', 'error': str(e)})}\n\n"

@router.get("/agent-status/{task_id}")
async def stream_agent_status(task_id: str, db: Session = Depends(get_db)):
    db_task = db.query(AgentTask).filter(AgentTask.task_id == task_id).first()
    payload = db_task.payload if db_task else {}
    
    payload.setdefault("product_id", "P001")
    payload.setdefault("product_name", "Test Product")
    payload.setdefault("current_price", 100.0)
    payload.setdefault("unit_cost", 50.0)
    payload.setdefault("stock_quantity", 1000)
    payload.setdefault("monthly_sales", 10)
    
    return StreamingResponse(run_workflow_generator(task_id, payload), media_type="text/event-stream")

@router.get("/monitor-stats")
def get_monitor_stats(db: Session = Depends(get_db)):
    monitor = db.query(SystemState).filter(SystemState.key == "global_monitor").first()
    return monitor.state_value if monitor else get_default_monitor_state()
