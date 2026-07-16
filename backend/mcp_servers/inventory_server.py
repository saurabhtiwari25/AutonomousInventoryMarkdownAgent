from mcp.server.fastmcp import FastMCP

mcp = FastMCP("Inventory Server")

@mcp.tool()
def analyze_stock_levels(stock_quantity: int, monthly_sales: int) -> str:
    """Analyze inventory stock levels and calculate months-of-supply metric.
    Use this to assess whether a product is overstocked, healthy, or low on stock."""
    months_of_supply = stock_quantity / max(monthly_sales, 1)
    if months_of_supply > 6:
        status = "OVERSTOCKED — excessive inventory relative to demand"
    elif months_of_supply < 1:
        status = "LOW STOCK — risk of stockout within 30 days"
    else:
        status = "HEALTHY — inventory aligned with demand"
    return (
        f"Stock Quantity: {stock_quantity} units\n"
        f"Monthly Sales Rate: {monthly_sales} units/month\n"
        f"Months of Supply: {months_of_supply:.1f}\n"
        f"Assessment: {status}"
    )

@mcp.tool()
def get_reorder_recommendation(stock_quantity: int, monthly_sales: int, lead_time_days: int = 30) -> str:
    """Calculate reorder point and safety stock recommendation for a product."""
    daily_sales = monthly_sales / 30
    safety_stock = daily_sales * 14
    reorder_point = (daily_sales * lead_time_days) + safety_stock
    needs_reorder = stock_quantity <= reorder_point
    return (
        f"Daily Sales Rate: {daily_sales:.1f} units/day\n"
        f"Safety Stock: {safety_stock:.0f} units\n"
        f"Reorder Point: {reorder_point:.0f} units\n"
        f"Current Stock: {stock_quantity} units\n"
        f"Needs Reorder: {'YES' if needs_reorder else 'NO'}"
    )

if __name__ == "__main__":
    mcp.run()
