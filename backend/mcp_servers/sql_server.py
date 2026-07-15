from mcp.server.fastmcp import FastMCP
from sqlalchemy import text
from core.database import engine

mcp = FastMCP("SQL Server")

@mcp.tool()
def query_product_data(product_id: str) -> str:
    """Query comprehensive product data from the database including inventory and profitability.
    Use this when you need actual database records for a specific product."""
    try:
        with engine.connect() as conn:
            result = conn.execute(text(
                "SELECT p.product_id, p.name, p.category, "
                "i.stock_quantity, i.reorder_level, "
                "pr.unit_cost, pr.current_price, pr.margin_percentage "
                "FROM products p "
                "LEFT JOIN inventory i ON p.id = i.product_id_fk "
                "LEFT JOIN profitability pr ON p.id = pr.product_id_fk "
                "WHERE p.product_id = :pid"
            ), {"pid": product_id})
            rows = [dict(r._mapping) for r in result]
            return str(rows) if rows else f"No data found for product {product_id}"
    except Exception as e:
        return f"Database query error: {e}"

@mcp.tool()
def query_sales_history(product_id: str) -> str:
    """Query recent sales history for a product from the database.
    Returns the last 10 sales records including date, quantity sold, and revenue."""
    try:
        with engine.connect() as conn:
            result = conn.execute(text(
                "SELECT s.date, s.quantity_sold, s.revenue "
                "FROM sales s "
                "JOIN products p ON p.id = s.product_id_fk "
                "WHERE p.product_id = :pid "
                "ORDER BY s.date DESC LIMIT 10"
            ), {"pid": product_id})
            rows = [dict(r._mapping) for r in result]
            return str(rows) if rows else f"No sales history found for product {product_id}"
    except Exception as e:
        return f"Database query error: {e}"

@mcp.tool()
def query_pricing_history(product_id: str) -> str:
    """Query historical pricing changes for a product.
    Returns past price adjustments with dates and reasons."""
    try:
        with engine.connect() as conn:
            result = conn.execute(text(
                "SELECT ph.price, ph.effective_date, ph.reason "
                "FROM pricing_history ph "
                "JOIN products p ON p.id = ph.product_id_fk "
                "WHERE p.product_id = :pid "
                "ORDER BY ph.effective_date DESC LIMIT 10"
            ), {"pid": product_id})
            rows = [dict(r._mapping) for r in result]
            return str(rows) if rows else f"No pricing history found for product {product_id}"
    except Exception as e:
        return f"Database query error: {e}"

if __name__ == "__main__":
    mcp.run()
