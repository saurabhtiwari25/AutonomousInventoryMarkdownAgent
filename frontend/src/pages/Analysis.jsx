import { useState, useEffect } from 'react';
import axios from 'axios';
import { Play, Activity } from 'lucide-react';

export default function Analysis() {
  const [running, setRunning] = useState(() => {
    return JSON.parse(sessionStorage.getItem('analysis_running') || 'false');
  });
  const [logs, setLogs] = useState(() => {
    return JSON.parse(sessionStorage.getItem('analysis_logs') || '[]');
  });
  const [taskId, setTaskId] = useState(() => {
    return sessionStorage.getItem('analysis_taskId') || null;
  });

  useEffect(() => {
    sessionStorage.setItem('analysis_running', JSON.stringify(running));
  }, [running]);

  useEffect(() => {
    sessionStorage.setItem('analysis_logs', JSON.stringify(logs));
  }, [logs]);

  useEffect(() => {
    if (taskId) sessionStorage.setItem('analysis_taskId', taskId);
  }, [taskId]);

  const startAnalysis = async () => {
    try {
      setRunning(true);
      setLogs([{ time: new Date().toLocaleTimeString(), message: 'Initiating multi-agent workflow...' }]);
      
      const res = await axios.post('http://localhost:8000/analyze', {
        product_id: "P001",
        product_name: "Test Laptop",
        current_price: 1200.0,
        unit_cost: 800.0,
        stock_quantity: 500,
        monthly_sales: 10
      });
      
      setTaskId(res.data.task_id);
    } catch (e) {
      console.error(e);
      setRunning(false);
    }
  };

  useEffect(() => {
    if (!taskId || !running) return;
    
    const eventSource = new EventSource(`http://localhost:8000/agent-status/${taskId}`);
    
    eventSource.onmessage = (e) => {
      const data = JSON.parse(e.data);
      setLogs((prev) => [...prev, { time: new Date().toLocaleTimeString(), message: `[${data.node}] ${data.status}` }]);
      
      if (data.node === 'END') {
        eventSource.close();
        setRunning(false);
      }
    };
    
    eventSource.onerror = () => {
      eventSource.close();
      setRunning(false);
    };
    
    return () => eventSource.close();
  }, [taskId, running]);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1>AI Analysis Workflow</h1>
        <button className="btn btn-primary" onClick={startAnalysis} disabled={running}>
          {running ? <Activity className="animate-spin" /> : <Play size={18} />}
          {running ? 'Running Analysis...' : 'Run Analysis'}
        </button>
      </div>

      <div className="grid-2">
        <div className="card">
          <h2>LangGraph Workflow</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
            {['Inventory Agent', 'Sales Analysis Agent', 'SQL Agent', 'Pricing Agent', 'Risk Analysis Agent', 'Report Agent'].map((agent, i) => (
              <div key={i} style={{ padding: '1rem', border: '1px solid var(--border)', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem' }}>{i + 1}</div>
                <div style={{ fontWeight: 500 }}>{agent}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h2>Live Execution Stream</h2>
          <div className="stream-panel">
            {logs.length === 0 ? (
              <div style={{ color: 'var(--text-tertiary)', textAlign: 'center', marginTop: '50%' }}>
                Click 'Run Analysis' to start workflow.
              </div>
            ) : (
              logs.map((log, i) => (
                <div key={i} className="stream-line">
                  <span style={{ color: 'var(--text-secondary)', marginRight: '1rem' }}>[{log.time}]</span>
                  {log.message}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
