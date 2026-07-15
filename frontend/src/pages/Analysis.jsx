import { useState, useEffect } from 'react';
import axios from 'axios';
import { Play, Activity, CircleDot, CheckCircle2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Analysis() {
  const [running, setRunning] = useState(() => JSON.parse(sessionStorage.getItem('analysis_running') || 'false'));
  const [logs, setLogs] = useState(() => JSON.parse(sessionStorage.getItem('analysis_logs') || '[]'));
  const [taskId, setTaskId] = useState(() => sessionStorage.getItem('analysis_taskId') || null);

  useEffect(() => { sessionStorage.setItem('analysis_running', JSON.stringify(running)); }, [running]);
  useEffect(() => { sessionStorage.setItem('analysis_logs', JSON.stringify(logs)); }, [logs]);
  useEffect(() => { if (taskId) sessionStorage.setItem('analysis_taskId', taskId); }, [taskId]);

  const startAnalysis = async () => {
    try {
      setRunning(true);
      setLogs([{ time: new Date().toLocaleTimeString(), message: 'Initiating multi-agent workflow...' }]);
      const res = await axios.post('https://autonomousinventorymarkdownagent.onrender.com/analyze', {
        product_id: "P001", product_name: "Test Laptop", current_price: 1200.0,
        unit_cost: 800.0, stock_quantity: 500, monthly_sales: 10
      });
      setTaskId(res.data.task_id);
    } catch (e) { console.error(e); setRunning(false); }
  };

  useEffect(() => {
    if (!taskId || !running) return;
    const es = new EventSource(`https://autonomousinventorymarkdownagent.onrender.com/agent-status/${taskId}`);
    es.onmessage = (e) => {
      const data = JSON.parse(e.data);
      setLogs(prev => [...prev, { time: new Date().toLocaleTimeString(), message: `[${data.node}] ${data.status}` }]);
      if (data.node === 'END') { es.close(); setRunning(false); }
    };
    es.onerror = () => { es.close(); setRunning(false); };
    return () => es.close();
  }, [taskId, running]);

  const agents = [
    { name: 'Inventory Agent', desc: 'Stock level analysis' },
    { name: 'Sales Analysis Agent', desc: 'Demand forecasting' },
    { name: 'SQL Agent', desc: 'Database queries' },
    { name: 'Pricing Agent', desc: 'Markdown optimization' },
    { name: 'Risk Analysis Agent', desc: 'Risk assessment' },
    { name: 'Report Agent', desc: 'Report generation' },
  ];

  

  return (
    <div className="flex flex-col gap-8 flex-1">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold tracking-tight font-heading">AI Analysis Workflow</h1>
          <p className="text-sm text-muted-foreground mt-1">LangGraph multi-agent pipeline execution</p>
        </div>
        <Button
          onClick={startAnalysis}
          disabled={running}
          size="sm"
          className="min-w-[150px]"
        >
          {running ? (
            <>
              <Activity className="animate-spin" />
              Running...
            </>
          ) : (
            <>
              <Play />
              Run Analysis
            </>
          )}
        </Button>
      </div>

      
          

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 flex-1">
        {/* Agent Pipeline */}
        <Card className="lg:col-span-2 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Agent Pipeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              {agents.map((agent, i) => (
                <div key={i} className="p-3 border rounded-lg flex items-center gap-3 bg-muted/20 hover:bg-muted/40 transition-colors">
                  <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary shrink-0">
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-medium">{agent.name}</div>
                    <div className="text-[11px] text-muted-foreground">{agent.desc}</div>
                  </div>
                  <CircleDot className="h-3.5 w-3.5 text-muted-foreground/30 shrink-0" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Live Stream */}
        <Card className="lg:col-span-3 flex flex-col shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold">Live Stream</CardTitle>
              {running && <Badge variant="secondary" className="text-[10px] gap-1"><Activity className="h-3 w-3 animate-spin" /> Live</Badge>}
            </div>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            <div className="bg-zinc-950 rounded-lg p-4 font-mono text-xs text-emerald-400 flex-1 min-h-[320px] max-h-[500px] overflow-y-auto">
              {logs.length === 0 ? (
                <div className="text-zinc-500 text-center mt-32 font-sans text-sm">
                  Click <strong>'Run Analysis'</strong> to begin the pipeline.
                </div>
              ) : (
                logs.map((log, i) => (
                  <div key={i} className="mb-1.5 flex gap-2">
                    <span className="text-zinc-600 shrink-0">{log.time}</span>
                    <span className="text-zinc-500">│</span>
                    <span>{log.message}</span>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
