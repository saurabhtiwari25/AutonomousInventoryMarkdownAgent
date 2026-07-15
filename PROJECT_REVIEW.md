# Autonomous Inventory & Markdown Agent - Project Review

## What is this project?
In simple terms, this project is a **smart, automated assistant for retail and e-commerce businesses**. 

When a store has too much of a certain product sitting in a warehouse (called "dead stock"), it costs them money. Usually, a human manager has to look at spreadsheets, check how fast the item is selling, look at the profit margins, and guess how much of a discount to offer to get rid of the extra stock without losing money.

This project completely automates that job using Artificial Intelligence. You upload your inventory data, select a product, and a team of AI "agents" work together behind the scenes to calculate the perfect discount strategy.

---

## How does it work? (The Multi-Agent Workflow)
Instead of relying on one massive AI to guess the answer, this project uses a **LangGraph Multi-Agent Pipeline**. This means there are 6 specialized "mini AIs" (powered by the incredibly fast Llama 3.3 model via Groq) that pass information to each other like an assembly line:

1. 📦 **Inventory Agent**: Looks at how many items you have left and flags if the product is "Overstocked" or "Healthy".
2. 📈 **Sales Analysis Agent**: Looks at how many items are selling per month (Sales Velocity) to see if the product is moving fast or collecting dust.
3. 🗄️ **SQL Agent**: Acts as the researcher. It connects directly to your PostgreSQL database (using an MCP Tool) to pull historical data, like whether the price was changed recently.
4. 💰 **Pricing Agent**: The mathematician. Based on the stock levels and sales speed, it uses a formula to calculate the exact discount (e.g., 15% or 30%) you should offer to clear the stock while making the most revenue.
5. ⚠️ **Risk Analysis Agent**: The safety net. It checks the Pricing Agent's math. If the suggested discount pushes the price lower than what it cost to manufacture the product, it flags it as a "High Risk" and pauses it for human approval.
6. 📋 **Report Agent**: The executive assistant. It takes all the findings from the previous 5 agents and bundles them into a clean, easy-to-read final report with a "Confidence Score" so the business owner can just click "Approve."

---

## The Tech Stack (What powers it)
- **The Brain (AI)**: It uses `llama-3.3-70b-versatile` hosted on **Groq**, making the AI agents think and respond at lightning speed.
- **The Backend (Engine)**: Built with **Python** and **FastAPI**. It handles the database connections and runs the LangGraph AI workflow.
- **The Frontend (Face)**: Built with **React** and **Tailwind CSS**. It provides a sleek, modern, dark-mode SaaS dashboard where users can upload CSV files, view their dashboard stats, and watch the AI "Live Stream" its thoughts as it analyzes a product.
- **The Database (Memory)**: Uses **PostgreSQL** to store the inventory data securely.
- **The Infrastructure (House)**: Everything is wrapped up neatly in **Docker** containers. This means anyone can download the project and run it with a single command (`docker-compose up`) without having to manually install databases or servers on their laptop.

## Summary
You built a highly advanced, production-ready AI tool. It takes a tedious, hours-long mathematical business process (clearing out dead inventory) and turns it into a 5-second automated workflow that streams its thought process live to the user.
