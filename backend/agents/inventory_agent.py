from .state import AgentState
from core.llm import get_llm
from .tools import analyze_stock_levels

def inventory_agent_node(state: AgentState) -> AgentState:
    """Analyze inventory levels using LLM."""
    llm = get_llm().bind_tools([analyze_stock_levels])
    
    prompt = f"""
    You are an Inventory Analysis Agent. Analyze the inventory for product {state.get('product_id')} ({state.get('product_name')}).
    Stock Quantity: {state.get('stock_quantity', 0)}
    Monthly Sales: {state.get('monthly_sales', 1)}
    
    Call the analyze_stock_levels tool to get the assessment. Based on the result, determine if the inventory health is 'Overstocked', 'Low Stock', or 'Healthy'.
    Return ONLY the exact status string: Overstocked, Low Stock, or Healthy.
    """
    
    response = llm.invoke(prompt)
    
    content = response.content.upper() if response.content else ""
    if "OVERSTOCKED" in content:
        health = "Overstocked"
    elif "LOW STOCK" in content:
        health = "Low Stock"
    elif not content and response.tool_calls:
        tool_call = response.tool_calls[0]
        if tool_call["name"] == "analyze_stock_levels":
            result = analyze_stock_levels.invoke(tool_call["args"])
            if "OVERSTOCKED" in result:
                health = "Overstocked"
            elif "LOW STOCK" in result:
                health = "Low Stock"
            else:
                health = "Healthy"
        else:
            health = "Healthy"
    else:
        health = "Healthy"
        
    return {"inventory_health": health}
