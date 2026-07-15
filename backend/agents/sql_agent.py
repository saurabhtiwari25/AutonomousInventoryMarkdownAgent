from .state import AgentState
from core.llm import get_llm
from .tools import query_product_data, query_pricing_history

def sql_agent_node(state: AgentState) -> AgentState:
    """SQL Agent using LLM and Database Tools."""
    llm = get_llm().bind_tools([query_product_data, query_pricing_history])
    
    prompt = f"""
    You are an SQL Agent. Your job is to fetch historical pricing data and product details from the database for product {state.get('product_id')}.
    Use the tools query_product_data and query_pricing_history.
    Then, provide a brief 1-2 sentence summary of any historical pricing trends or interesting facts you found.
    """
    
    response = llm.invoke(prompt)
    
    insights = ""
    if response.tool_calls:
        # Simplistic approach: execute first tool call, get insights
        tool_call = response.tool_calls[0]
        tool_func = query_product_data if tool_call["name"] == "query_product_data" else query_pricing_history
        result = tool_func.invoke(tool_call["args"])
        
        follow_up = llm.invoke([
            {"role": "user", "content": prompt},
            {"role": "assistant", "content": "", "tool_calls": response.tool_calls},
            {"role": "tool", "name": tool_call["name"], "tool_call_id": tool_call["id"], "content": str(result)}
        ])
        insights = follow_up.content
    else:
        insights = response.content
        
    if not insights:
        insights = f"Historical data retrieved for {state.get('product_id')}."
        
    return {"sql_insights": insights}
