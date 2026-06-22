from .state import AgentState

def pricing_agent_node(state: AgentState) -> AgentState:
    """Recommend markdown percentage."""
    health = state.get("inventory_health", "Healthy")
    velocity = state.get("sales_velocity", 1.0)
    current_price = state.get("current_price", 0.0)
    
    discount = 0.0
    if health == "Overstocked":
        if velocity < 0.2:
            discount = 0.30 
        else:
            discount = 0.15 
            
    expected_rev = current_price * (1 - discount) * (state.get("monthly_sales", 0) * 1.5)
    
    return {
        "recommended_discount": discount,
        "expected_revenue": expected_rev
    }
