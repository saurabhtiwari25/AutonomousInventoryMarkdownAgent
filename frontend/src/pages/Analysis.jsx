import { useState, useEffect } from 'react';
import axios from 'axios';
import { Play, Activity, CircleDot, CheckCircle2, Square } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getInventory } from '../api';

export default function Analysis() {
  const [running, setRunning] = useState(() => JSON.parse(sessionStorage.getItem('analysis_running') || 'false'));
  const [logs, setLogs] = useState(() => JSON.parse(sessionStorage.getItem('analysis_logs') || '[]'));
  const [taskId, setTaskId] = useState(() => sessionStorage.getItem('analysis_taskId') || null);
  const [inventory, setInventory] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [analysisQueue, setAnalysisQueue] = useState(() => JSON.parse(sessionStorage.getItem('analysis_queue') || '[]'));

  useEffect(() => {
    async function fetchInventory() {
      try {
        const data = await getInventory();
        setInventory(data);
        if (data.length > 0) {
          setSelectedProduct(data[0].product_id);
        }
      } catch (err) {
        console.error("Failed to fetch inventory:", err);
      }
    }
    fetchInventory();
  }, []);

  useEffect(() => { sessionStorage.setItem('analysis_running', JSON.stringify(running)); }, [running]);
  useEffect(() => { sessionStorage.setItem('analysis_logs', JSON.stringify(logs)); }, [logs]);
  useEffect(() => { if (taskId) sessionStorage.setItem('analysis_taskId', taskId); }, [taskId]);
  useEffect(() => { sessionStorage.setItem('analysis_queue', JSON.stringify(analysisQueue)); }, [analysisQueue]);

  const startAnalysis = async (productIdOverride = null) => {
    const pId = productIdOverride || selectedProduct;
    if (!pId) return;
    const product = inventory.find(p => p.product_id === pId);
    if (!product) return;

    try {
      setRunning(true);
      setLogs(prev => [...prev, { time: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true }), message: `Initiating multi-agent workflow for ${product.product_name}...` }]);
      const res = await axios.post('http://localhost:8000/analyze', {
        product_id: product.product_id,
        product_name: product.product_name,
        current_price: product.current_price,
        unit_cost: product.unit_cost,
        stock_quantity: product.stock_quantity,
        monthly_sales: product.monthly_sales || 10
      });
      setTaskId(res.data.task_id);
    } catch (e) { console.error(e); setRunning(false); }
  };

  const startAnalyzeAll = () => {
    if (inventory.length === 0) return;
    setLogs([{ time: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true }), message: `Starting batch analysis for ${inventory.length} products...` }]);
    const queue = inventory.map(p => p.product_id);
    const first = queue[0];
    setAnalysisQueue(queue.slice(1));
    setSelectedProduct(first);
    startAnalysis(first);
  };

  useEffect(() => {
    if (!running && analysisQueue.length > 0) {
      const nextProductId = analysisQueue[0];
      setAnalysisQueue(prev => prev.slice(1));
      setSelectedProduct(nextProductId);
      startAnalysis(nextProductId);
    }
  }, [running]);

  const formatTimestamp = (isoString) => {
    if (!isoString) return new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true });
    const d = new Date(isoString);
    return isNaN(d.getTime())
      ? isoString
      : d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true });
  };

  useEffect(() => {
    if (!taskId || !running) return;
    const es = new EventSource(`http://localhost:8000/agent-status/${taskId}`);
    es.onmessage = (e) => {
      const data = JSON.parse(e.data);
      const time = formatTimestamp(data.timestamp);
      setLogs(prev => [...prev, { time, message: `[${data.node}] ${data.status}` }]);
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
        <div className="flex gap-4 items-center">
          <Select value={selectedProduct || ""} onValueChange={setSelectedProduct} disabled={running || inventory.length === 0}>
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder="Select a product to analyze" />
            </SelectTrigger>
            <SelectContent>
              {inventory.map((item) => (
                <SelectItem key={item.product_id} value={item.product_id}>
                  {item.product_name} ({item.product_id})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            onClick={() => startAnalysis()}
            disabled={running || !selectedProduct}
            className="rounded-md !px-6 !py-3 !h-11 bg-[#eaeaea] dark:bg-[#333] text-[#111] dark:text-[#fafafa] border-[#ccc] dark:border-[#555] hover:bg-[#ddd] dark:hover:bg-[#444] text-sm font-medium gap-2"
          >
            {running && analysisQueue.length === 0 ? (
              <>
                <Activity className="animate-spin" />
                Running...
              </>
            ) : (
              <>
                <Play />
                Run Single
              </>
            )}
          </Button>
          <Button
            onClick={startAnalyzeAll}
            disabled={running || inventory.length === 0}
            className="rounded-md !px-6 !py-3 !h-11 bg-[#eaeaea] dark:bg-[#333] text-[#111] dark:text-[#fafafa] border-[#ccc] dark:border-[#555] hover:bg-[#ddd] dark:hover:bg-[#444] text-sm font-medium gap-2"
          >
            {running && analysisQueue.length > 0 ? (
              <>
                <Activity className="animate-spin" />
                Processing Batch ({analysisQueue.length} left)
              </>
            ) : (
              <>
                <Play />
                Analyze All
              </>
            )}
          </Button>
          {running && analysisQueue.length > 0 && (
            <Button
              onClick={() => {
                setAnalysisQueue([]);
                setLogs(prev => [...prev, { time: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true }), message: "Batch analysis stopped by user. (Current item will finish)" }]);
              }}
              className="rounded-md !px-6 !py-3 !h-11 bg-destructive text-destructive-foreground hover:bg-destructive/90 text-sm font-medium gap-2"
            >
              <Square className="h-4 w-4 fill-current" />
              Stop Batch
            </Button>
          )}
        </div>
      </div>




      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 flex-1 items-start">
        {/* Agent Pipeline */}
        <Card className="lg:col-span-2 shadow-sm h-fit">
          <CardHeader className="!p-6 !pb-3">
            <CardTitle className="text-sm font-semibold">Agent Pipeline</CardTitle>
          </CardHeader>
          <CardContent className="!p-6 !pt-0">
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
        <Card className="lg:col-span-3 flex flex-col shadow-sm max-h-[600px]">
          <CardHeader className="!p-6 !pb-3 shrink-0">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold">Live Stream</CardTitle>
              {running && <Badge variant="secondary" className="text-[10px] gap-1"><Activity className="h-3 w-3 animate-spin" /> Live</Badge>}
            </div>
          </CardHeader>
          <CardContent className="!p-6 !pt-0 flex-1 overflow-hidden flex flex-col">
            <div className="bg-zinc-950 rounded-lg p-4 font-mono text-xs text-emerald-400 flex-1 overflow-y-auto">
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
