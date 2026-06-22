import { HelpCircle, Info, BookOpen, Layers, ShieldAlert, Package, TrendingDown } from 'lucide-react';

export default function Help() {
  return (
    <div>
      <h1>Help & Documentation</h1>
      
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <Info color="var(--accent-primary)" size={24} />
          <h2 style={{ margin: 0 }}>About This Application</h2>
        </div>
        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
          The <strong>Autonomous Inventory & Markdown Agent (AIM)</strong> is an intelligent system designed to automatically analyze your retail inventory, detect items that are overstocked or approaching expiration, and suggest optimized pricing markdowns to maximize revenue while clearing stock. It uses a LangGraph-powered multi-agent backend to provide smart decision-making capabilities.
        </p>
      </div>

      <h2>How to Use</h2>
      <div className="grid-2">
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <Package color="var(--success)" size={24} />
            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>1. Upload Inventory</h3>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.5' }}>
            Navigate to the <strong>Inventory Upload</strong> page to submit your current stock levels. You can upload CSV or JSON files. The system will automatically parse and store your product data, making it ready for analysis.
          </p>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <Layers color="var(--accent-primary)" size={24} />
            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>2. View Inventory</h3>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.5' }}>
            Check the <strong>Inventory List</strong> to see all tracked products, their current stock levels, and base pricing. This gives you a clear overview of your current retail footprint before running any intelligent analyses.
          </p>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <TrendingDown color="var(--warning)" size={24} />
            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>3. Run Analysis</h3>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.5' }}>
            Go to the <strong>Analysis</strong> section to trigger the AI agents. You can select specific items to analyze. The agents will evaluate current stock, demand, and risk factors to recommend appropriate markdown percentages.
          </p>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <ShieldAlert color="var(--danger)" size={24} />
            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>4. Monitor Agents</h3>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.5' }}>
            The <strong>Agent Monitor</strong> provides a live stream of backend AI operations. You can watch the Risk Agent and Pricing Agent communicate and make decisions in real-time, ensuring transparency in the AI's logic.
          </p>
        </div>
      </div>

      <div className="card" style={{ marginTop: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <BookOpen color="var(--accent-primary)" size={24} />
          <h2 style={{ margin: 0 }}>What to Expect</h2>
        </div>
        <ul style={{ color: 'var(--text-secondary)', lineHeight: '1.6', paddingLeft: '1.5rem', marginBottom: 0 }}>
          <li><strong>Automated Insights:</strong> Expect smart pricing suggestions that adapt to your inventory state instead of relying on manual rules.</li>
          <li><strong>Real-time Tracking:</strong> Once items are analyzed, the resulting reports are available in the <strong>Reports</strong> tab for approval.</li>
          <li><strong>Dynamic Interactivity:</strong> The dashboard will update live as agents complete their tasks in the background.</li>
        </ul>
      </div>
    </div>
  );
}
