from .state import AgentState
from core.llm import get_llm
from .tools import query_sales_history

def sales_agent_node(state: AgentState) -> AgentState:
    """Analyze sales velocity using LLM."""
    llm = get_llm().bind_tools([query_sales_history])
    
    prompt = f"""
    You are a Sales Analysis Agent. Analyze the sales velocity for product {state.get('product_id')}.
    Current Stock: {state.get('stock_quantity', 1)}
    Monthly Sales Rate: {state.get('monthly_sales', 0)}
    
    Call query_sales_history to fetch recent sales data if available.
    Then, calculate and return a single decimal number representing the sales velocity 
    (ratio of monthly_sales to current stock). Do not include any other text.
    CRITICAL INSTRUCTION: Do NOT attempt to call any tools other than query_sales_history. Do not invent tools.
    """
    
    response = llm.invoke(prompt)
    
    velocity = 0.0
    if response.tool_calls:
        # If it called the tool, we execute it and then query again
        tool_call = response.tool_calls[0]
        if tool_call["name"] == "query_sales_history":
            result = query_sales_history.invoke(tool_call["args"])
            follow_up = llm.invoke([
                {"role": "user", "content": prompt},
                {"role": "assistant", "content": "", "tool_calls": response.tool_calls},
                {"role": "tool", "name": "query_sales_history", "tool_call_id": tool_call["id"], "content": str(result)}
            ])
            try:
                velocity = float(follow_up.content.strip())
            except:
                velocity = state.get("monthly_sales", 0) / max(state.get("stock_quantity", 1), 1)
    else:
        try:
            velocity = float(response.content.strip())
        except:
            velocity = state.get("monthly_sales", 0) / max(state.get("stock_quantity", 1), 1)
            
    return {"sales_velocity": velocity}
