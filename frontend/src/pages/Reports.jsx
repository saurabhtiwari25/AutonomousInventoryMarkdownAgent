import { useEffect, useState } from 'react';
import { getReports, approveReport } from '../api';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Download } from 'lucide-react';

export default function Reports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const formatINR = (v) => `₹${Number(v ?? 0).toFixed(2)}`;

  const fetchReports = async () => {
    try { const d = await getReports(); setReports([...(Array.isArray(d) ? d : [])].reverse()); }
    catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchReports(); }, []);

  const handleApprove = async (id) => {
    try { await approveReport(id); fetchReports(); }
    catch (e) { console.error(e); alert("Failed to approve"); }
  };

  return (
    <div className="flex flex-col gap-6 flex-1">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Executive Reports</h1>
          <p className="text-sm text-muted-foreground mt-1">{reports.length} report{reports.length !== 1 ? 's' : ''} generated</p>
        </div>
        <Button variant="outline" size="sm" className="gap-2">
          <Download className="h-3.5 w-3.5" /> Export CSV
        </Button>
      </div>

      {loading ? (
        <div className="text-muted-foreground p-8 animate-pulse">Loading reports...</div>
      ) : reports.length === 0 ? (
        <Card className="text-center py-16 shadow-sm">
          <div className="text-muted-foreground text-sm">No reports yet. Run an analysis to generate one.</div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {reports.map((r) => (
            <Card key={r.task_id} className={`shadow-sm transition-all hover:shadow-md ${
              r.status === 'Approved' ? 'border-emerald-500/50 ring-1 ring-emerald-500/20' : ''
            }`}>
              <CardContent className="pt-5 flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-sm font-semibold">{r.product_name}</h3>
                    <span className="text-xs text-muted-foreground font-mono">{r.product_id}</span>
                  </div>
                  <Badge variant="secondary" className={`text-[10px] border ${
                    r.risk_level === 'High' ? 'bg-destructive/15 text-destructive border-destructive/20' :
                    r.risk_level === 'Medium' ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/20' :
                    'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                  }`}>
                    {r.risk_level} Risk
                  </Badge>
                </div>

                <div className="space-y-2 mb-4 flex-1">
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Current</span><span>{formatINR(r.current_price)}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Suggested</span><span className="text-primary font-semibold">{formatINR(r.suggested_price)}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Markdown</span><span>{r.markdown_percentage?.toFixed(1) ?? '0.0'}%</span></div>
                  {r.status && (
                    <div className="flex justify-between text-sm pt-2 mt-2 border-t border-border">
                      <span className="text-muted-foreground">Status</span>
                      <span className={`font-semibold flex items-center gap-1 ${r.status === 'Approved' ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                        {r.status === 'Approved' && <CheckCircle2 className="h-3 w-3" />} {r.status}
                      </span>
                    </div>
                  )}
                </div>

                {r.status !== 'Approved' && (
                  <div className="flex gap-2 mt-auto">
                    <Button size="sm" className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => handleApprove(r.task_id)}>Approve</Button>
                    <Button size="sm" variant="outline" className="flex-1">Reject</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}