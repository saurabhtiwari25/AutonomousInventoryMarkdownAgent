from pydantic import BaseModel
from typing import Optional, List
from datetime import date, datetime

class ProductBase(BaseModel):
    product_id: str
    name: str
    category: str

class ProductCreate(ProductBase):
    pass

class InventoryBase(BaseModel):
    stock_quantity: int
    reorder_level: Optional[int] = 0

class SaleBase(BaseModel):
    date: date
    quantity_sold: int
    revenue: float

class PricingHistoryBase(BaseModel):
    price: float
    reason: Optional[str] = None

class ProfitabilityBase(BaseModel):
    unit_cost: float
    current_price: float
    margin_percentage: float

class InventoryUploadRow(BaseModel):
    product_id: str
    product_name: str
    category: str
    stock_quantity: int
    unit_cost: float
    current_price: float
    monthly_sales: int

# Agent Output Models
class InventoryAgentOutput(BaseModel):
    product_id: str
    stock_level: int
    stock_health: str

class SalesAgentOutput(BaseModel):
    product_id: str
    sales_velocity: float
    trend: str
    category: str

class PricingAgentOutput(BaseModel):
    product_id: str
    recommended_discount: float
    expected_revenue: float

class RiskAgentOutput(BaseModel):
    product_id: str
    risk_score: str
    approval_status: str
    reason: str

class FinalRecommendation(BaseModel):
    product_id: str
    product_name: str
    current_price: float
    suggested_price: float
    markdown_percentage: float
    expected_revenue_impact: float
    expected_margin_impact: float
    confidence_score: float
    risk_level: str
    risk_reason: str
