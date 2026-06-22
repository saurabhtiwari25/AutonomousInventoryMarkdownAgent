# Autonomous Inventory & Markdown Agent

A production-grade, AI-powered multi-agent retail decision system. This platform autonomously analyzes inventory health, sales history, and profitability data to dynamically recommend optimal markdowns and pricing actions. It demonstrates a complete LangGraph workflow orchestrated alongside FastAPI, React 19, and the Model Context Protocol (MCP).

## Features

- **Multi-Agent Orchestration**: A custom LangGraph workflow connecting 6 distinct agents (Inventory, Sales, SQL, Pricing, Risk, and Report) to compute data-driven decisions.
- **Model Context Protocol (MCP)**: Implementation of dedicated MCP servers (SQL, Inventory, Pricing) that provide specialized tool access to the agents.
- **Real-Time Streaming**: Server-Sent Events (SSE) stream live agent execution statuses and workflow progressions directly to the frontend.
- **Retail Operations Dashboard**: A React 19 + Vite frontend providing KPI tracking, file uploads, live execution monitoring, and markdown action reports.
- **Algorithmic Pricing**: Autonomous discount calculation based on stock coverage, sales velocity, and unit costs.
- **Risk Assessment**: Intelligent profit-margin protection ensuring markdowns never violate predefined business rules.
- **Data Persistence**: Robust PostgreSQL integration utilizing SQLAlchemy 2.0 ORM and Alembic for automated schema migrations.
- **Containerized Infrastructure**: Fully containerized using Docker and Docker Compose for zero-config deployments.

## Technologies Used

**Backend:**
- Python 3.12+
- FastAPI (REST API & SSE streaming)
- LangGraph & LangChain (Agent orchestration)
- MCP Python SDK (Tool contextualization)
- SQLAlchemy 2.0 & Alembic (ORM & Migrations)
- PostgreSQL (Primary Data Store)
- Pydantic V2 (Data Validation)

**Frontend:**
- React 19 & Vite
- React Router DOM
- Vanilla CSS (Premium Dark Mode Dashboard)
- Axios (API Client)

**Infrastructure:**
- Docker & Docker Compose

## Steps to Run

1. **Clone the Repository**
   Navigate to your workspace and clone/extract the project files.

2. **Configure Environment Variables**
   Ensure the `.env` file exists in the root directory and populate your API keys:
   ```env
   POSTGRES_USER=admin
   POSTGRES_PASSWORD=admin
   POSTGRES_DB=inventory_db
   GEMINI_API_KEY=your_api_key_here
   ```

3. **Deploy using Docker Compose**
   Launch the entire stack (PostgreSQL, FastAPI Backend, React Frontend) via Docker Compose:
   ```bash
   docker-compose up --build
   ```

4. **Access the Application**
   - **Frontend UI:** Open `http://localhost:5173` in your browser.
   - **Backend API Docs:** Open `http://localhost:8000/docs` to view the auto-generated Swagger UI.

5. **Run Migrations (If running locally without Docker)**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # Or .\venv\Scripts\Activate.ps1 on Windows
   pip install -r requirements.txt
   alembic upgrade head
   ```

## Folder Structure

```text
/
├── docker-compose.yml       # Defines multi-container orchestration (DB, API, Web)
├── .env                     # Environment variables and API keys
│
├── frontend/                # React 19 UI Application
│   ├── index.html           # Main HTML entry
│   ├── vite.config.js       # Vite bundler configuration
│   └── src/
│       ├── main.jsx         # React application root
│       ├── App.jsx          # React Router setup and layout
│       ├── global.css       # Global design system and layout styling
│       ├── components/      # Reusable UI elements
│       │   └── Sidebar.jsx  # Primary navigation sidebar
│       └── pages/           # Application views
│           ├── Dashboard.jsx       # Overview KPIs and recent activity
│           ├── InventoryUpload.jsx # CSV drag-and-drop upload handler
│           ├── Analysis.jsx        # LangGraph workflow trigger and live stream
│           ├── AgentMonitor.jsx    # Real-time MCP tool call monitor
│           ├── Reports.jsx         # Executive markdown recommendations
│           └── Settings.jsx        # App configurations and risk thresholds
│
└── backend/                 # FastAPI + LangGraph Application
    ├── main.py              # FastAPI app instance, SSE endpoints, and routes
    ├── Dockerfile           # Backend container build instructions
    ├── requirements.txt     # Python dependencies
    ├── alembic.ini          # Alembic configuration
    │
    ├── alembic/             # Database migrations
    │   └── env.py           # Ties SQLAlchemy models to Alembic
    │
    ├── core/                # Core configurations
    │   ├── config.py        # Pydantic Settings management
    │   └── database.py      # SQLAlchemy Engine and Session maker
    │
    ├── models/              # Data models
    │   ├── domain.py        # SQLAlchemy schema definitions (Postgres)
    │   └── schemas.py       # Pydantic validation and serialization models
    │
    ├── mcp_servers/         # Model Context Protocol Servers
    │   ├── sql_server.py       # Exposes run_sql, describe_table tools
    │   ├── inventory_server.py # Exposes get_inventory tools
    │   └── pricing_server.py   # Exposes mathematical pricing tools
    │
    └── agents/              # LangGraph Implementation
        ├── workflow.py      # Connects nodes into a cohesive StateGraph
        ├── state.py         # Defines the typed graph state
        ├── inventory_agent.py # Analyzes stock coverage
        ├── sales_agent.py     # Calculates sales velocity
        ├── sql_agent.py       # Queries historical data
        ├── pricing_agent.py   # Computes markdown discounts
        ├── risk_agent.py      # Validates margin protections
        └── report_agent.py    # Formats final executive output
```