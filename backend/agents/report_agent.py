from .state import AgentState

def report_agent_node(state: AgentState) -> AgentState:
    """Generate final executive report."""
    
    current_price = state.get("current_price", 0.0)
    discount = state.get("recommended_discount", 0.0)
    new_price = current_price * (1 - discount)
    cost = state.get("unit_cost", 0.0)
    
    margin_impact = new_price - cost
    
    final = {
        "product_id": state.get("product_id"),
        "product_name": state.get("product_name"),
        "current_price": current_price,
        "suggested_price": new_price,
        "markdown_percentage": discount * 100,
        "expected_revenue_impact": state.get("expected_revenue", 0.0),
        "expected_margin_impact": margin_impact,
        "confidence_score": 0.95 if state.get("risk_score") == "Low" else 0.75,
        "risk_level": state.get("risk_score"),
        "risk_reason": state.get("risk_reason"),
        "inventory_health": state.get("inventory_health"),
        "sales_velocity": state.get("sales_velocity")
    }
    
    return {"final_report": final}
