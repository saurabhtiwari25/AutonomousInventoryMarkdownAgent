from .state import AgentState
from core.llm import get_llm
from .tools import calculate_discount, calculate_margin, calculate_revenue_projection
import json

def pricing_agent_node(state: AgentState) -> AgentState:
    """Recommend markdown percentage using LLM and MCP Tools."""
    llm = get_llm().bind_tools([calculate_discount, calculate_margin, calculate_revenue_projection])
    
    prompt = f"""
    You are a Pricing Optimization Agent. Determine the optimal markdown discount (as a decimal, e.g., 0.15 for 15%) for product {state.get('product_id')}.
    Inventory Health: {state.get('inventory_health')}
    Sales Velocity: {state.get('sales_velocity')}
    Current Price: {state.get('current_price')}
    Unit Cost: {state.get('unit_cost')}
    
    Use the available tools if you need to calculate margins or projected revenue.
    Based on the data, if Overstocked and velocity is very low (< 0.2), suggest a 0.30 discount. If Overstocked but velocity > 0.2, suggest 0.15. Otherwise 0.0.
    
    Respond with a JSON object exactly like this:
    {{"discount": 0.15, "expected_revenue": 1000.50}}
    Do not wrap in markdown tags like ```json.
    """
    
    response = llm.invoke(prompt)
    
    discount = 0.0
    expected_rev = 0.0
    
    if response.tool_calls:
        # Simplistic approach: execute first tool call, then invoke again
        tool_call = response.tool_calls[0]
        tool_func = calculate_discount if tool_call["name"] == "calculate_discount" else (calculate_margin if tool_call["name"] == "calculate_margin" else calculate_revenue_projection)
        result = tool_func.invoke(tool_call["args"])
        
        follow_up = llm.invoke([
            {"role": "user", "content": prompt},
            {"role": "assistant", "content": "", "tool_calls": response.tool_calls},
            {"role": "tool", "name": tool_call["name"], "tool_call_id": tool_call["id"], "content": str(result)}
        ])
        content = follow_up.content
    else:
        content = response.content
        
    try:
        # Try to parse the JSON output
        cleaned = content.strip().replace('```json', '').replace('```', '')
        parsed = json.loads(cleaned)
        discount = float(parsed.get("discount", 0.0))
        expected_rev = float(parsed.get("expected_revenue", 0.0))
    except:
        # Fallback to programmatic calculation if LLM parsing fails
        health = state.get("inventory_health", "Healthy")
        velocity = state.get("sales_velocity", 1.0)
        current_price = state.get("current_price", 0.0)
        
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
