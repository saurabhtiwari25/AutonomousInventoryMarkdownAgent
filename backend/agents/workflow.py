from langgraph.graph import StateGraph, END
from .state import AgentState
from .inventory_agent import inventory_agent_node
from .sales_agent import sales_agent_node
from .sql_agent import sql_agent_node
from .pricing_agent import pricing_agent_node
from .risk_agent import risk_agent_node
from .report_agent import report_agent_node

def build_workflow():
    workflow = StateGraph(AgentState)
    
    workflow.add_node("Inventory_Agent", inventory_agent_node)
    workflow.add_node("Sales_Analysis_Agent", sales_agent_node)
    workflow.add_node("SQL_Agent", sql_agent_node)
    workflow.add_node("Pricing_Agent", pricing_agent_node)
    workflow.add_node("Risk_Analysis_Agent", risk_agent_node)
    workflow.add_node("Report_Agent", report_agent_node)
    
    workflow.set_entry_point("Inventory_Agent")
    
    workflow.add_edge("Inventory_Agent", "Sales_Analysis_Agent")
    workflow.add_edge("Sales_Analysis_Agent", "SQL_Agent")
    workflow.add_edge("SQL_Agent", "Pricing_Agent")
    workflow.add_edge("Pricing_Agent", "Risk_Analysis_Agent")
    workflow.add_edge("Risk_Analysis_Agent", "Report_Agent")
    workflow.add_edge("Report_Agent", END)
    
    return workflow.compile()

app_workflow = build_workflow()
