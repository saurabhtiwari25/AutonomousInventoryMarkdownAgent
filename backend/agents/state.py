from typing import TypedDict, Annotated, List, Dict, Any
from pydantic import BaseModel
import operator

class AgentState(TypedDict):
    product_id: str
    product_name: str
    current_price: float
    unit_cost: float
    stock_quantity: int
    monthly_sales: int
    
    inventory_health: str
    sales_velocity: float
    sql_insights: str
    recommended_discount: float
    expected_revenue: float
    risk_score: str
    approval_status: str
    risk_reason: str
    
    final_report: Dict[str, Any]
