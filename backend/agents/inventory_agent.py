from .state import AgentState

def inventory_agent_node(state: AgentState) -> AgentState:
    """Analyze inventory levels."""
    stock = state.get("stock_quantity", 0)
    monthly_sales = state.get("monthly_sales", 1)
    
    months_of_stock = stock / (monthly_sales if monthly_sales > 0 else 1)
    
    if months_of_stock > 6:
        health = "Overstocked"
    elif months_of_stock < 1:
        health = "Low Stock"
    else:
        health = "Healthy"
        
    return {"inventory_health": health}
