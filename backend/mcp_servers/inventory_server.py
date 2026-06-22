from mcp.server.fastmcp import FastMCP

mcp = FastMCP("Inventory Server")

@mcp.tool()
def get_inventory(product_id: str) -> str:
    """Get inventory status for a specific product."""
    return f"Inventory for {product_id}: 100 units in stock"

@mcp.tool()
def get_product(product_id: str) -> str:
    """Get product details."""
    return f"Product details for {product_id}: Category Electronics"

@mcp.tool()
def get_stock_levels() -> str:
    """Get overall stock levels."""
    return "Total stock: 5000 units across 50 products."

if __name__ == "__main__":
    mcp.run()
