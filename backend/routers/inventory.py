from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.orm import Session
import pandas as pd
import io
import numpy as np

from core.database import get_db
import crud
from models import schemas

router = APIRouter(prefix="/inventory", tags=["inventory"])

@router.post("/upload")
async def upload_inventory(file: UploadFile = File(...), db: Session = Depends(get_db)):
    contents = await file.read()
    if file.filename.endswith('.csv'):
        df = pd.read_csv(io.BytesIO(contents))
    else:
        df = pd.read_json(io.BytesIO(contents))
    df.columns = df.columns.str.strip()

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

@router.get("")
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
            "monthly_sales": p.inventory.monthly_sales if p.inventory else 0
        })
    return result

@router.post("")
def create_inventory(item: schemas.InventoryUploadRow, db: Session = Depends(get_db)):
    product = crud.create_product_full(db, item)
    return {"status": "success", "product_id": product.product_id}

@router.put("/{product_id}")
def update_inventory(product_id: str, item: schemas.InventoryUploadRow, db: Session = Depends(get_db)):
    product = crud.update_product_full(db, product_id, item)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"status": "success"}

@router.delete("/{product_id}")
def delete_inventory(product_id: str, db: Session = Depends(get_db)):
    success = crud.delete_product(db, product_id)
    if not success:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"status": "success"}

@router.delete("")
def delete_all_inventory(db: Session = Depends(get_db)):
    crud.delete_all_products(db)
    return {"status": "success"}

