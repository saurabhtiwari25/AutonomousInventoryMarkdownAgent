from mcp.server.fastmcp import FastMCP
from sqlalchemy import text
from ..core.database import engine

mcp = FastMCP("SQL Server")

@mcp.tool()
def run_sql(query: str) -> str:
    """Run a read-only SQL query against the Postgres database."""
    try:
        with engine.connect() as conn:
            result = conn.execute(text(query))
            rows = result.fetchall()
            return str([dict(row._mapping) for row in rows])
    except Exception as e:
        return f"Error executing query: {str(e)}"

@mcp.tool()
def list_tables() -> str:
    """List all tables in the Postgres database."""
    query = "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'"
    return run_sql(query)

@mcp.tool()
def describe_table(table_name: str) -> str:
    """Describe the schema of a specific table."""
    query = f"SELECT column_name, data_type FROM information_schema.columns WHERE table_name = '{table_name}'"
    return run_sql(query)

if __name__ == "__main__":
    mcp.run()
