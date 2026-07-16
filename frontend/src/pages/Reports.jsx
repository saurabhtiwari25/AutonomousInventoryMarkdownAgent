import { useEffect, useState } from 'react';
import { getReports, approveReport, rejectReport, deleteApprovedReports } from '../api';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { CheckCircle2, Download, Sparkles, Trash2 } from 'lucide-react';

export default function Reports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reasoningModal, setReasoningModal] = useState({ open: false, product: '', reasoning: '' });
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

  const handleReject = async (id) => {
    try { await rejectReport(id); fetchReports(); }
    catch (e) { console.error(e); alert("Failed to reject"); }
  };

  const handleExportCSV = () => {
    if (reports.length === 0) return;
    const headers = ['Product ID', 'Product Name', 'Risk Level', 'Current Price', 'Suggested Price', 'Discount %', 'Status'];
    const rows = reports.map(r => [
      r.product_id || '',
      `"${(r.product_name || '').replace(/"/g, '""')}"`,
      r.risk_level || '',
      r.current_price || 0,
      r.suggested_price || 0,
      r.markdown_percentage?.toFixed(1) || '0.0',
      r.status || ''
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'executive_reports.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const openReasoning = (r) => {
    setReasoningModal({
      open: true,
      product: r.product_name || r.product_id || 'Product',
      reasoning: r.markdown_reasoning || 'No pricing rationale available.',
    });
  };

  const approvedCount = reports.filter(r => r.status === 'Approved').length;

  const handleRemoveApproved = async () => {
    if (approvedCount === 0) return;
    try {
      await deleteApprovedReports();
      fetchReports();
    } catch (e) {
      console.error(e);
      alert('Failed to remove approved reports');
    }
  };

  return (
    <div className="flex flex-col gap-6 flex-1">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Executive Reports</h1>
          <p className="text-sm text-muted-foreground mt-1">{reports.length} report{reports.length !== 1 ? 's' : ''} generated</p>
        </div>
        <div className="flex gap-2">
          {approvedCount > 0 && (
            <Button
              className="rounded-md !px-6 !py-3 !h-11 bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive/20 text-sm font-medium gap-2"
              onClick={handleRemoveApproved}
            >
              <Trash2 className="h-4 w-4" /> Remove Approved ({approvedCount})
            </Button>
          )}
          <Button
            className="rounded-md !px-8 !py-3 !h-11 bg-[#eaeaea] dark:bg-[#333] text-[#111] dark:text-[#fafafa] border-[#ccc] dark:border-[#555] hover:bg-[#ddd] dark:hover:bg-[#444] text-sm font-medium gap-2"
            onClick={handleExportCSV}
          >
            <Download className="h-4 w-4" /> Export CSV
          </Button>
        </div>
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
            <Card key={r.task_id} className={`shadow-sm transition-all hover:shadow-md ${r.status === 'Approved' ? 'border-emerald-500/50 ring-1 ring-emerald-500/20' : ''
              }`}>
              <CardContent className="!p-6 flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-sm font-semibold">{r.product_name}</h3>
                    <span className="text-xs text-muted-foreground font-mono">{r.product_id}</span>
                  </div>
                  <Badge variant="secondary" className={`text-[10px] border ${r.risk_level === 'High' ? 'bg-destructive/15 text-destructive border-destructive/20' :
                    r.risk_level === 'Medium' ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/20' :
                      'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                    }`}>
                    {r.risk_level} Risk
                  </Badge>
                </div>

                <div className="space-y-2 mb-4 flex-1">
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Current</span><span>{formatINR(r.current_price)}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Suggested</span><span className="text-primary font-semibold">{formatINR(r.suggested_price)}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Discount</span><span>{r.markdown_percentage?.toFixed(1) ?? '0.0'}%</span></div>
                  <div className="pt-2 mt-2 border-t border-border">
                    <button
                      onClick={() => openReasoning(r)}
                      className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 font-medium transition-colors cursor-pointer"
                    >

                      View AI Reasoning
                    </button>
                  </div>
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
                    <Button size="sm" className="flex-1" onClick={() => handleApprove(r.task_id)}>Approve</Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleReject(r.task_id)}
                    >
                      Reject
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={reasoningModal.open} onOpenChange={(open) => setReasoningModal(prev => ({ ...prev, open }))}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              AI Reasoning
            </DialogTitle>
            <DialogDescription>
              Pricing rationale for <span className="font-semibold text-foreground">{reasoningModal.product}</span>
            </DialogDescription>
          </DialogHeader>
          <div className="mt-2 rounded-md bg-muted/50 p-4 border border-border">
            <p className="text-sm leading-relaxed text-foreground whitespace-pre-wrap">
              {reasoningModal.reasoning}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
