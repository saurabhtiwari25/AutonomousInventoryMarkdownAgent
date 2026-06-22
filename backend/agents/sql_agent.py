from .state import AgentState

def sql_agent_node(state: AgentState) -> AgentState:
    """Mock SQL Agent that would normally use the MCP SQL Server."""
    return {"sql_insights": f"Found historical pricing data for {state.get('product_id')}"}
