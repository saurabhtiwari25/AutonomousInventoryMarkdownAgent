from .state import AgentState

def sales_agent_node(state: AgentState) -> AgentState:
    """Analyze sales velocity."""
    monthly_sales = state.get("monthly_sales", 0)
    stock = state.get("stock_quantity", 1)
    
    velocity = monthly_sales / (stock if stock > 0 else 1)
    
    return {"sales_velocity": velocity}
