from .state import AgentState
from core.llm import get_llm
import json

def report_agent_node(state: AgentState) -> AgentState:
    """Generate final executive report using LLM."""
    llm = get_llm()
    
    current_price = state.get("current_price", 0.0)
    discount = state.get("recommended_discount", 0.0)
    new_price = current_price * (1 - discount)
    cost = state.get("unit_cost", 0.0)
    
    margin_impact = new_price - cost
    
    prompt = f"""
    You are an Executive Report Agent. Generate a confidence score for the proposed markdown.
    Risk Level: {state.get("risk_score")}
    Inventory Health: {state.get("inventory_health")}
    Sales Velocity: {state.get("sales_velocity")}
    
    If Risk Level is "Low" and Inventory Health is "Overstocked", confidence should be high (0.90 to 0.99).
    If Risk Level is "High", confidence should be low (0.50 to 0.70).
    Respond with a JSON object exactly like this:
    {{"confidence_score": 0.95}}
    Do not wrap in markdown tags like ```json.
    """
    
    response = llm.invoke(prompt)
    
    confidence_score = 0.85
    try:
        cleaned = response.content.strip().replace('```json', '').replace('```', '')
        parsed = json.loads(cleaned)
        confidence_score = float(parsed.get("confidence_score", 0.85))
    except:
        confidence_score = 0.95 if state.get("risk_score") == "Low" else 0.75
        
    final = {
        "product_id": state.get("product_id"),
        "product_name": state.get("product_name"),
        "current_price": current_price,
        "suggested_price": new_price,
        "markdown_percentage": discount * 100,
        "expected_revenue_impact": state.get("expected_revenue", 0.0),
        "expected_margin_impact": margin_impact,
        "confidence_score": confidence_score,
        "risk_level": state.get("risk_score"),
        "risk_reason": state.get("risk_reason"),
        "inventory_health": state.get("inventory_health"),
        "sales_velocity": state.get("sales_velocity")
    }
    
    return {"final_report": final}
