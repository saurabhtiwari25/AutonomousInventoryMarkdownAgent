from fastapi import FastAPI, UploadFile, File, BackgroundTasks, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from pydantic import BaseModel
import pandas as pd
import io
import json
import asyncio
import uuid
import time
from datetime import datetime
from typing import Dict, Any, List

from agents.workflow import app_workflow
from models import schemas
from core.database import get_db, engine, SessionLocal
import crud
from models.domain import Base, AgentTask, AgentReport, SystemState

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

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.post("/upload-inventory")
async def upload_inventory(file: UploadFile = File(...), db: Session = Depends(get_db)):
    contents = await file.read()
    if file.filename.endswith('.csv'):
        df = pd.read_csv(io.BytesIO(contents))
    else:
        df = pd.read_json(io.BytesIO(contents))
    df.columns = df.columns.str.strip()

    import numpy as np
    df = df.replace({np.nan: None})
        
    records = df.to_dict(orient="records")
    
    saved_count = 0
    errors = []
    for record in records:
        try:
            item = schemas.InventoryUploadRow(**record)
            crud.create_product_full(db, item)
            saved_count += 1
        except Exception as e:
            print(f"Error saving record {record}: {e}")
            errors.append(str(e))
            
    if saved_count == 0 and len(records) > 0:
        raise HTTPException(status_code=400, detail=f"Validation failed for all records. Check data format. First error: {errors[0]}")
            
    return {"status": "success", "products_count": len(records), "saved_count": saved_count}

@app.get("/dashboard-stats")
def get_stats(db: Session = Depends(get_db)):
    active_agents = db.query(AgentTask).filter(AgentTask.status == "started").count()
    total_reports = db.query(AgentReport).count()
    return crud.get_dashboard_stats(db, active_agents, total_reports)

@app.get("/inventory")
def get_inventory(db: Session = Depends(get_db)):
    products = crud.get_products(db)
    result = []
    for p in products:
        result.append({
            "product_id": p.product_id,
            "product_name": p.name,
            "category": p.category,
            "stock_quantity": p.inventory.stock_quantity if p.inventory else 0,
            "unit_cost": p.profitability.unit_cost if p.profitability else 0.0,
            "current_price": p.profitability.current_price if p.profitability else 0.0,
            "monthly_sales": 0  # Placeholder since we don't track monthly sales directly in Product yet
        })
    return result

@app.post("/inventory")
def create_inventory(item: schemas.InventoryUploadRow, db: Session = Depends(get_db)):
    product = crud.create_product_full(db, item)
    return {"status": "success", "product_id": product.product_id}

@app.put("/inventory/{product_id}")
def update_inventory(product_id: str, item: schemas.InventoryUploadRow, db: Session = Depends(get_db)):
    product = crud.update_product_full(db, product_id, item)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"status": "success"}

@app.delete("/inventory/{product_id}")
def delete_inventory(product_id: str, db: Session = Depends(get_db)):
    success = crud.delete_product(db, product_id)
    if not success:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"status": "success"}

@app.post("/analyze")
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
                    monitor_state = monitor.state_value if monitor else get_default_monitor_state()
                    
                    monitor_state["agents"][node_name] = {
                        "status": "Completed",
                        "last_run": datetime.utcnow().isoformat() + "Z",
                        "duration": round(time.time() - start_time, 2),
                        "message": "Processed successfully"
                    }
                    
                    monitor_state["mcp_calls"].insert(0, {
                        "timestamp": datetime.utcnow().isoformat() + "Z",
                        "tool_name": f"{node_name.lower()}_call",
                        "status": "Success",
                        "duration": f"{int((time.time() - start_time)*1000)}ms"
                    })
                    monitor_state["mcp_calls"] = monitor_state["mcp_calls"][:10]
                    
                    if not monitor:
                        monitor = SystemState(key="global_monitor", state_value=monitor_state)
                        db.add(monitor)
                    else:
                        monitor.state_value = monitor_state
                    db.commit()
                
                start_time = time.time()
                yield f"data: {json.dumps({'node': key, 'status': 'completed', 'data': value})}\n\n"
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

@app.get("/agent-status/{task_id}")
async def stream_agent_status(task_id: str, db: Session = Depends(get_db)):
    # Retrieve the product data from DB
    db_task = db.query(AgentTask).filter(AgentTask.task_id == task_id).first()
    payload = db_task.payload if db_task else {}
    
    # Fallback to defaults if something is missing
    payload.setdefault("product_id", "P001")
    payload.setdefault("product_name", "Test Product")
    payload.setdefault("current_price", 100.0)
    payload.setdefault("unit_cost", 50.0)
    payload.setdefault("stock_quantity", 1000)
    payload.setdefault("monthly_sales", 10)
    
    return StreamingResponse(run_workflow_generator(task_id, payload), media_type="text/event-stream")

@app.get("/report/{task_id}")
def get_report(task_id: str, db: Session = Depends(get_db)):
    report = db.query(AgentReport).filter(AgentReport.task_id == task_id).first()
    if report:
        return report.report_data
    return {"error": "Report not found"}

@app.get("/reports")
def get_all_reports(db: Session = Depends(get_db)):
    reports = db.query(AgentReport).all()
    return [r.report_data for r in reports]

@app.post("/report/{task_id}/approve")
def approve_report(task_id: str, db: Session = Depends(get_db)):
    report = db.query(AgentReport).filter(AgentReport.task_id == task_id).first()
    if report:
        report.status = "Approved"
        report.report_data["status"] = "Approved"
        # Manually signal SQLAlchemy that JSON is modified
        from sqlalchemy.orm.attributes import flag_modified
        flag_modified(report, "report_data")
        db.commit()
        return {"status": "success", "report": report.report_data}
    raise HTTPException(status_code=404, detail="Report not found")

@app.get("/monitor-stats")
def get_monitor_stats(db: Session = Depends(get_db)):
    monitor = db.query(SystemState).filter(SystemState.key == "global_monitor").first()
    return monitor.state_value if monitor else get_default_monitor_state()
