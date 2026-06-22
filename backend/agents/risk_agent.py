from .state import AgentState

def risk_agent_node(state: AgentState) -> AgentState:
    """Analyze risk of markdown."""
    discount = state.get("recommended_discount", 0.0)
    cost = state.get("unit_cost", 0.0)
    price = state.get("current_price", 0.0)
    
    new_price = price * (1 - discount)
    
    if new_price < cost:
        risk = "High"
        status = "Requires Approval"
        reason = "Markdown price is below unit cost."
    elif discount > 0.25:
        risk = "Medium"
        status = "Requires Approval"
        reason = "Discount exceeds 25% threshold."
    else:
        risk = "Low"
        status = "Approved"
        reason = "Discount within acceptable margins."
        
    return {
        "risk_score": risk,
        "approval_status": status,
        "risk_reason": reason
    }
