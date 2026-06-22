from mcp.server.fastmcp import FastMCP

mcp = FastMCP("Pricing Server")

@mcp.tool()
def calculate_discount(current_price: float, target_price: float) -> str:
    """Calculate the discount percentage."""
    if current_price <= 0: return "0%"
    discount = ((current_price - target_price) / current_price) * 100
    return f"{discount:.2f}%"

@mcp.tool()
def calculate_margin(cost: float, price: float) -> str:
    """Calculate the profit margin percentage."""
    if price <= 0: return "0%"
    margin = ((price - cost) / price) * 100
    return f"{margin:.2f}%"

@mcp.tool()
def calculate_revenue_projection(price: float, expected_sales: int) -> str:
    """Calculate projected revenue."""
    revenue = price * expected_sales
    return f"${revenue:.2f}"

if __name__ == "__main__":
    mcp.run()
