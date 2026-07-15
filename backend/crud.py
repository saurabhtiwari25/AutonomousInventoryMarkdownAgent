from sqlalchemy.orm import Session
from models import domain, schemas
from sqlalchemy import func

def get_products(db: Session):
    return db.query(domain.Product).all()

def create_product_full(db: Session, item: schemas.InventoryUploadRow):
    # Check if exists
    db_product = db.query(domain.Product).filter(domain.Product.product_id == item.product_id).first()
    if db_product:
        return db_product # Or update

    db_product = domain.Product(
        product_id=item.product_id,
        name=item.product_name,
        category=item.category
    )
    db.add(db_product)
    db.commit()
    db.refresh(db_product)

    db_inventory = domain.Inventory(
        product_id_fk=db_product.id,
        stock_quantity=item.stock_quantity
    )
    db.add(db_inventory)

    margin = 0
    if item.current_price > 0:
        margin = ((item.current_price - item.unit_cost) / item.current_price) * 100

    db_profit = domain.Profitability(
        product_id_fk=db_product.id,
        unit_cost=item.unit_cost,
        current_price=item.current_price,
        margin_percentage=margin
    )
    db.add(db_profit)
    
    db.commit()
    db.refresh(db_product)
    return db_product

def update_product_full(db: Session, product_id: str, item: schemas.InventoryUploadRow):
    db_product = db.query(domain.Product).filter(domain.Product.product_id == product_id).first()
    if not db_product:
        return None
    
    db_product.name = item.product_name
    db_product.category = item.category

    if db_product.inventory:
        db_product.inventory.stock_quantity = item.stock_quantity
    
    if db_product.profitability:
        db_product.profitability.unit_cost = item.unit_cost
        db_product.profitability.current_price = item.current_price
        margin = 0
        if item.current_price > 0:
            margin = ((item.current_price - item.unit_cost) / item.current_price) * 100
        db_product.profitability.margin_percentage = margin

    db.commit()
    db.refresh(db_product)
    return db_product

def delete_product(db: Session, product_id: str):
    db_product = db.query(domain.Product).filter(domain.Product.product_id == product_id).first()
    if db_product:
        # Cascade deletes should ideally be handled by relationships, but we can delete manually if not configured
        if db_product.inventory:
            db.delete(db_product.inventory)
        if db_product.profitability:
            db.delete(db_product.profitability)
        for sale in db_product.sales:
            db.delete(sale)
        for ph in db_product.pricing_history:
            db.delete(ph)
        db.delete(db_product)
        db.commit()
        return True
    return False

def delete_all_products(db: Session):
    db.query(domain.Inventory).delete()
    db.query(domain.Profitability).delete()
    db.query(domain.Sale).delete()
    db.query(domain.PricingHistory).delete()
    db.query(domain.Product).delete()
    db.commit()
    return True


def get_dashboard_stats(db: Session, active_agents: int, total_reports: int):
    total_items = db.query(domain.Product).count()
    out_of_stock = db.query(domain.Inventory).filter(domain.Inventory.stock_quantity <= 0).count()
    return {
        "total_items": total_items,
        "out_of_stock": out_of_stock,
        "active_agents": active_agents,
        "total_reports": total_reports
    }
