"""
LangChain tool wrappers for MCP Server functions.

These tools bridge the MCP servers (inventory, pricing, sql) into the LangChain
tool-calling ecosystem, allowing Gemini-powered agents to invoke them via
structured tool calls.
"""
from langchain_core.tools import tool

from mcp_servers.inventory_server import (
    analyze_stock_levels as _analyze_stock_levels,
    get_reorder_recommendation as _get_reorder_recommendation
)
from mcp_servers.pricing_server import (
    calculate_discount as _calculate_discount,
    calculate_margin as _calculate_margin,
    calculate_revenue_projection as _calculate_revenue_projection
)
from mcp_servers.sql_server import (
    query_product_data as _query_product_data,
    query_sales_history as _query_sales_history,
    query_pricing_history as _query_pricing_history
)

@tool
def analyze_stock_levels(stock_quantity: int, monthly_sales: int) -> str:
    """Analyze inventory stock levels and calculate months-of-supply metric."""
    return _analyze_stock_levels(stock_quantity, monthly_sales)

@tool
def get_reorder_recommendation(stock_quantity: int, monthly_sales: int, lead_time_days: int = 30) -> str:
    """Calculate reorder point and safety stock recommendation for a product."""
    return _get_reorder_recommendation(stock_quantity, monthly_sales, lead_time_days)

@tool
def calculate_discount(current_price: float, target_price: float) -> str:
    """Calculate the discount percentage between a current price and a target price."""
    return _calculate_discount(current_price, target_price)

@tool
def calculate_margin(cost: float, price: float) -> str:
    """Calculate the profit margin percentage given unit cost and selling price."""
    return _calculate_margin(cost, price)

@tool
def calculate_revenue_projection(price: float, expected_monthly_sales: int) -> str:
    """Project revenue over a given number of months at a specified price and sales volume."""
    return _calculate_revenue_projection(price, expected_monthly_sales)

@tool
def query_product_data(product_id: str) -> str:
    """Query comprehensive product data from the database including inventory and profitability."""
    return _query_product_data(product_id)

@tool
def query_sales_history(product_id: str) -> str:
    """Query recent sales history for a product from the database."""
    return _query_sales_history(product_id)

@tool
def query_pricing_history(product_id: str) -> str:
    """Query historical pricing changes for a product."""
    return _query_pricing_history(product_id)

INVENTORY_TOOLS = [analyze_stock_levels, get_reorder_recommendation]
PRICING_TOOLS = [calculate_discount, calculate_margin, calculate_revenue_projection]
SQL_TOOLS = [query_product_data, query_sales_history, query_pricing_history]
ALL_TOOLS = INVENTORY_TOOLS + PRICING_TOOLS + SQL_TOOLS
