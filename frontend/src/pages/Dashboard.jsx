import { Package, TrendingDown, TrendingUp, AlertTriangle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getDashboardStats, getReports } from '../api';

export default function Dashboard() {
  const [stats, setStats] = useState({ total_items: 0, out_of_stock: 0, active_agents: 0, total_reports: 0 });
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const statsData = await getDashboardStats();
        setStats(statsData);
        
        const reportsData = await getReports();
        setReports(reportsData.slice(-5).reverse());
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
    
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h1>Operations Dashboard</h1>
      
      <div className="grid-cards">
        <div className="card kpi-card">
          <div className="kpi-label">Total Products</div>
          <div className="kpi-value">{loading ? '...' : stats.total_items}</div>
        </div>
        <div className="card kpi-card">
          <div className="kpi-label">Out of Stock</div>
          <div className="kpi-value" style={{ color: 'var(--warning)' }}>{loading ? '...' : stats.out_of_stock}</div>
        </div>
        <div className="card kpi-card">
          <div className="kpi-label">Active Agents</div>
          <div className="kpi-value" style={{ color: 'var(--accent-primary)' }}>{loading ? '...' : stats.active_agents}</div>
        </div>
        <div className="card kpi-card">
          <div className="kpi-label">Total Reports</div>
          <div className="kpi-value" style={{ color: 'var(--success)' }}>{loading ? '...' : stats.total_reports}</div>
        </div>
      </div>
      
      <div className="grid-2">
        <div className="card">
          <h2>Recent Analyses</h2>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Product ID</th>
                  <th>Product Name</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {reports.length === 0 ? (
                  <tr>
                    <td colSpan="3" style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>No recent analyses.</td>
                  </tr>
                ) : (
                  reports.map((report, idx) => (
                    <tr key={idx}>
                      <td>{report.product_id}</td>
                      <td>{report.product_name}</td>
                      <td>
                        <span className={`badge ${report.status === 'Approved' ? 'badge-success' : 'badge-warning'}`}>
                          {report.status || 'Completed'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="card">
          <h2>Agent Activity Stream</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
             {reports.length === 0 ? (
                <div style={{ color: 'var(--text-secondary)' }}>No recent activity.</div>
             ) : (
               reports.slice(0, 3).map((report, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <div style={{ padding: '0.5rem', background: 'var(--bg-tertiary)', borderRadius: '50%' }}>
                    {report.risk_level === 'HIGH' ? (
                      <AlertTriangle size={16} color="var(--danger)" />
                    ) : report.markdown_percentage > 0 ? (
                      <TrendingDown size={16} color="var(--accent-primary)" />
                    ) : (
                      <Package size={16} color="var(--success)" />
                    )}
                  </div>
                  <div>
                    <div style={{ fontWeight: 500 }}>
                      {report.risk_level === 'HIGH' ? 'Risk Agent generated high risk warning' : `Pricing Agent recommended ${report.markdown_percentage}% markdown`}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Product {report.product_id}</div>
                  </div>
                </div>
               ))
             )}
          </div>
        </div>
      </div>
    </div>
  );
}
