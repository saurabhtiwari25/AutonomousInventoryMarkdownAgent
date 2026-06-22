import { useState, useEffect } from 'react';

export default function AgentMonitor() {
  const [stats, setStats] = useState({
    agents: {
      Inventory_Agent: { status: 'Idle', last_run: 'Never', duration: 0, message: 'Ready' },
      Pricing_Agent: { status: 'Idle', last_run: 'Never', duration: 0, message: 'Ready' },
      Risk_Analysis_Agent: { status: 'Idle', last_run: 'Never', duration: 0, message: 'Ready' },
    },
    mcp_calls: []
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('http://localhost:8000/monitor-stats');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Error fetching monitor stats:', error);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 2000);
    return () => clearInterval(interval);
  }, []);

  const getBadgeClass = (status) => {
    if (status === 'Completed' || status === 'Success') return 'badge-success';
    if (status === 'Running') return 'badge-warning';
    if (status === 'Failed') return 'badge-danger';
    return 'badge-info'; // default for Idle/Waiting
  };

  return (
    <div>
      <h1>Agent Monitor</h1>
      <p style={{ color: 'var(--text-secondary)' }}>Real-time monitoring panel for active agents.</p>
      
      <div className="grid-cards" style={{ marginTop: '2rem' }}>
        {['Inventory_Agent', 'Pricing_Agent', 'Risk_Analysis_Agent'].map(agentName => {
          const agent = stats.agents[agentName] || {};
          return (
            <div className="card" key={agentName}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <h3 style={{ margin: 0 }}>{agentName.replace(/_/g, ' ')}</h3>
                <span className={`badge ${getBadgeClass(agent.status)}`}>{agent.status || 'Idle'}</span>
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                Last Run: {agent.last_run || 'Never'} <br/>
                Duration: {agent.duration || 0}s <br/>
                <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>{agent.message || 'Ready'}</span>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="card" style={{ marginTop: '2rem' }}>
        <h2>MCP Tool Calls</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Tool Name</th>
                <th>Status</th>
                <th>Duration</th>
              </tr>
            </thead>
            <tbody>
              {stats.mcp_calls.map((call, idx) => (
                <tr key={idx}>
                  <td>{call.timestamp}</td>
                  <td>{call.tool_name}</td>
                  <td><span className={`badge ${getBadgeClass(call.status)}`}>{call.status}</span></td>
                  <td>{call.duration}</td>
                </tr>
              ))}
              {stats.mcp_calls.length === 0 && (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>No recent tool calls</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
