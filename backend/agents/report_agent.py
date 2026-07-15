from .state import AgentState
from core.llm import get_llm
import json


def report_agent_node(state: AgentState) -> AgentState:
    """Generate final executive report using LLM."""
    llm = get_llm()

    current_price = state.get("current_price", 0.0)
    discount = state.get("recommended_discount", 0.0)
    new_price = current_price * (1 - discount)
    cost = state.get("unit_cost", 0.0)

    margin_impact = new_price - cost

    prompt = f"""
You are an Executive Reporting Agent.

You are preparing a report for senior retail executives.

Product
- Product ID: {state.get("product_id")}
- Product Name: {state.get("product_name")}

Pricing
- Current Price: {current_price}
- Recommended Discount: {discount * 100:.1f}%
- Suggested Price: {new_price}

Business Metrics
- Inventory Health: {state.get("inventory_health")}
- Sales Velocity: {state.get("sales_velocity")}
- Risk Level: {state.get("risk_score")}
- Risk Reason: {state.get("risk_reason")}
- Expected Revenue: {state.get("expected_revenue")}
- Margin Impact: {margin_impact}

Pricing Agent Reasoning:
{state.get("markdown_reasoning", "No pricing rationale provided.")}

Generate an executive assessment suitable for senior management.

Return ONLY valid JSON in the following format:

{{
    "confidence_score": 0.95,
    "executive_summary": "...",
    "business_logic": "...",
    "risk_rationale": "...",
    "recommendation_summary": "..."
}}

Requirements:
- executive_summary:
  Write 2-3 sentences summarizing the recommendation.

- business_logic:
  Explain WHY the markdown makes commercial sense.

- risk_rationale:
  Explain the operational risks and how they are mitigated.

- recommendation_summary:
  Give a concise final recommendation in 1-2 sentences.

- confidence_score:
  Return a decimal between 0.50 and 0.99.

Do not use markdown.
Do not wrap the response inside ```json.
Do not output anything except the JSON object.
"""

    response = llm.invoke(prompt)

    confidence_score = 0.85
    executive_summary = ""
    business_logic = ""
    risk_rationale = ""
    recommendation_summary = ""

    try:
        cleaned = (
            response.content.strip()
            .replace("```json", "")
            .replace("```", "")
            .strip()
        )

        parsed = json.loads(cleaned)

        confidence_score = float(parsed.get("confidence_score", 0.85))
        executive_summary = parsed.get("executive_summary", "")
        business_logic = parsed.get("business_logic", "")
        risk_rationale = parsed.get("risk_rationale", "")
        recommendation_summary = parsed.get("recommendation_summary", "")

    except Exception:
        confidence_score = (
            0.95 if state.get("risk_score") == "Low" else 0.75
        )

        executive_summary = state.get(
            "markdown_reasoning",
            "Executive summary unavailable."
        )

        business_logic = state.get(
            "markdown_reasoning",
            "Pricing recommendation generated using fallback rules."
        )

        risk_rationale = state.get(
            "risk_reason",
            "No specific operational risks identified."
        )

        recommendation_summary = (
            "Proceed with the recommended markdown while monitoring sales performance."
        )

    final = {
        "product_id": state.get("product_id"),
        "product_name": state.get("product_name"),
        "current_price": current_price,
        "suggested_price": new_price,
        "markdown_percentage": discount * 100,

        "markdown_reasoning": state.get(
            "markdown_reasoning",
            "No pricing rationale available."
        ),

        "executive_summary": executive_summary,
        "business_logic": business_logic,
        "risk_rationale": risk_rationale,
        "recommendation_summary": recommendation_summary,

        "expected_revenue_impact": state.get("expected_revenue", 0.0),
        "expected_margin_impact": margin_impact,

        "confidence_score": confidence_score,

        "risk_level": state.get("risk_score"),
        "risk_reason": state.get("risk_reason"),
        "inventory_health": state.get("inventory_health"),
        "sales_velocity": state.get("sales_velocity"),
    }

    return {"final_report": final}