import { Info, BookOpen, Layers, ShieldAlert, Package, TrendingDown } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const steps = [
  { icon: Package, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-500/10', title: '1. Upload Inventory',
    text: 'Navigate to Upload to submit CSV/JSON files. The system auto-parses and stores your product data.' },
  { icon: Layers, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-500/10', title: '2. View Inventory',
    text: 'Check the Inventory page to see all products, stock levels, and pricing before running analyses.' },
  { icon: TrendingDown, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-500/10', title: '3. Run Analysis',
    text: 'Trigger AI agents to evaluate stock, demand, and risk — producing markdown recommendations.' },
  { icon: ShieldAlert, color: 'text-destructive', bg: 'bg-destructive/10', title: '4. Monitor & Approve',
    text: 'Watch agents work in real-time via the Monitor, then review and approve reports.' },
];

export default function Help() {
  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Help & Documentation</h1>
        <p className="text-sm text-muted-foreground mt-1">Learn how to use the AIM platform</p>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center gap-3 pb-2">
          <div className="p-2 rounded-lg bg-blue-500/10">
            <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </div>
          <CardTitle className="text-base">About This Application</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The <strong className="text-foreground">Autonomous Inventory & Markdown Agent (AIM)</strong> uses LangGraph-powered multi-agent AI to analyze retail inventory, detect overstocking risks, and suggest optimized pricing markdowns — maximizing revenue while clearing stock intelligently.
          </p>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-lg font-semibold tracking-tight mb-3">How to Use</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {steps.map((s) => (
            <Card key={s.title} className="shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center gap-3 pb-2">
                <div className={`p-2 rounded-lg ${s.bg}`}>
                  <s.icon className={`h-4 w-4 ${s.color}`} />
                </div>
                <CardTitle className="text-sm">{s.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground leading-relaxed">{s.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center gap-3 pb-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <BookOpen className="h-4 w-4 text-primary" />
          </div>
          <CardTitle className="text-base">What to Expect</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="text-sm text-muted-foreground leading-relaxed list-disc ml-5 space-y-1.5">
            <li><strong className="text-foreground">Automated Insights:</strong> Smart pricing suggestions that adapt to inventory state.</li>
            <li><strong className="text-foreground">Real-time Tracking:</strong> Reports available in the Reports tab after analysis.</li>
            <li><strong className="text-foreground">Live Updates:</strong> Dashboard refreshes as agents complete background tasks.</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
