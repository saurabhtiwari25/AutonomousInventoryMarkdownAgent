from .state import AgentState
from core.llm import get_llm
from .tools import (
    calculate_discount,
    calculate_margin,
    calculate_revenue_projection,
)
import json


def pricing_agent_node(state: AgentState) -> AgentState:
    """Recommend markdown percentage using LLM and MCP Tools."""

    llm = get_llm().bind_tools([
        calculate_discount,
        calculate_margin,
        calculate_revenue_projection,
    ])

    prompt = f"""
You are a Pricing Optimization Agent.

Determine the optimal markdown discount (as a decimal, e.g. 0.15 for 15%) for product:

Product ID: {state.get("product_id")}
Inventory Health: {state.get("inventory_health")}
Sales Velocity: {state.get("sales_velocity")}
Monthly Sales: {state.get("monthly_sales")}
Current Price: {state.get("current_price")}
Unit Cost: {state.get("unit_cost")}

Use the available tools if calculations are required.

Business Rules:
- If Inventory Health is "Overstocked" and Sales Velocity < 0.2, recommend a 30% discount (0.30).
- If Inventory Health is "Overstocked" and Sales Velocity >= 0.2, recommend a 15% discount (0.15).
- Otherwise recommend 0.00.

Return ONLY valid JSON exactly like:

{{
    "discount": 0.15,
    "expected_revenue": 1000.50,
    "reasoning": "<generate a short reason based on actual inventory health, monthly sales, and velocity>"
}}

Do not wrap the response in markdown.
Do not output XML, function tags, or explanations outside the JSON.
"""

    response = llm.invoke(prompt)

    discount = 0.0
    expected_rev = 0.0
    reasoning = (
        "Markdown recommended based on inventory health and sales velocity."
    )

    if response.tool_calls:
        tool_call = response.tool_calls[0]

        if tool_call["name"] == "calculate_discount":
            tool_func = calculate_discount
        elif tool_call["name"] == "calculate_margin":
            tool_func = calculate_margin
        else:
            tool_func = calculate_revenue_projection

        result = tool_func.invoke(tool_call["args"])

        follow_up = llm.invoke([
            {
                "role": "user",
                "content": prompt,
            },
            {
                "role": "assistant",
                "content": "",
                "tool_calls": response.tool_calls,
            },
            {
                "role": "tool",
                "name": tool_call["name"],
                "tool_call_id": tool_call["id"],
                "content": str(result),
            },
        ])

        content = follow_up.content

    else:
        content = response.content

    try:
        cleaned = (
            content.strip()
            .replace("```json", "")
            .replace("```", "")
            .strip()
        )

        parsed = json.loads(cleaned)

        discount = float(parsed.get("discount", 0.0))
        expected_rev = float(parsed.get("expected_revenue", 0.0))
        reasoning = parsed.get(
            "reasoning",
            "Markdown recommended based on inventory health and sales velocity."
        )

    except (json.JSONDecodeError, ValueError, TypeError):

        health = state.get("inventory_health", "Healthy")
        velocity = state.get("sales_velocity", 1.0)
        current_price = state.get("current_price", 0.0)
        monthly_sales = state.get("monthly_sales", 0)

        if health == "Overstocked":
            if velocity < 0.2:
                discount = 0.30
            else:
                discount = 0.15
        else:
            discount = 0.0

        expected_rev = (
            current_price
            * (1 - discount)
            * (monthly_sales * 1.5)
        )

        reasoning = (
            f"Programmatic fallback applied. "
            f"Inventory Health: {health}. "
            f"Sales Velocity: {velocity}. "
            f"Recommended discount: {discount * 100:.0f}%."
        )

    if not reasoning:
        reasoning = (
            "Markdown recommended based on inventory health and sales velocity."
        )

    return {
        "recommended_discount": discount,
        "expected_revenue": expected_rev,
        "markdown_reasoning": reasoning,
    }
