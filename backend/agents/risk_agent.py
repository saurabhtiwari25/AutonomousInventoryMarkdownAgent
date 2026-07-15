from .state import AgentState
from core.llm import get_llm
import json

def risk_agent_node(state: AgentState) -> AgentState:
    """Analyze risk of markdown using LLM."""
    llm = get_llm()
    
    prompt = f"""
    You are a Risk Assessment Agent for a retail business. Assess the risk of the proposed markdown for product {state.get('product_id')}.
    Current Price: {state.get('current_price')}
    Unit Cost: {state.get('unit_cost')}
    Recommended Discount: {state.get('recommended_discount')}
    
    Calculate the new price (Current Price * (1 - Recommended Discount)).
    If new price < Unit Cost, risk is "High", status is "Requires Approval", reason is "Markdown price is below unit cost."
    If discount > 0.25, risk is "Medium", status is "Requires Approval", reason is "Discount exceeds 25% threshold."
    Otherwise, risk is "Low", status is "Approved", reason is "Discount within acceptable margins."
    
    Respond with a JSON object exactly like this:
    {{"risk_score": "High", "approval_status": "Requires Approval", "risk_reason": "Markdown price is below unit cost."}}
    Do not wrap in markdown tags like ```json.
    """
    
    response = llm.invoke(prompt)
    
    try:
        cleaned = response.content.strip().replace('```json', '').replace('```', '')
        parsed = json.loads(cleaned)
        risk = parsed.get("risk_score", "Low")
        status = parsed.get("approval_status", "Approved")
        reason = parsed.get("risk_reason", "")
    except:
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
