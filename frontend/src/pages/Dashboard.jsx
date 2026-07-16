import {
  Package,
  AlertTriangle,
  BarChart3,
  Zap,
  Clock,
  TrendingDown,
} from "lucide-react";
import { useState, useEffect } from "react";
import { getDashboardStats, getReports } from "../api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function Dashboard() {
  const [stats, setStats] = useState({
    total_items: 0,
    out_of_stock: 0,
    active_agents: 0,
    total_reports: 0,
  });

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
        if (err.message !== "Failed to fetch") {
          console.error("Failed to load dashboard data", err);
        }
      } finally {
        setLoading(false);
      }
    }

    loadData();

    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  const kpiCards = [
    {
      label: "Total Products",
      value: stats.total_items,
      icon: Package,
      accent: "text-blue-600 dark:text-blue-400",
      iconBg: "bg-blue-100 dark:bg-blue-500/20",
      borderAccent: "border-l-blue-500",
    },
    {
      label: "Out of Stock",
      value: stats.out_of_stock,
      icon: AlertTriangle,
      accent: "text-amber-600 dark:text-amber-400",
      iconBg: "bg-amber-100 dark:bg-amber-500/20",
      borderAccent: "border-l-amber-500",
    },
    {
      label: "Active Agents",
      value: stats.active_agents,
      icon: Zap,
      accent: "text-violet-600 dark:text-violet-400",
      iconBg: "bg-violet-100 dark:bg-violet-500/20",
      borderAccent: "border-l-violet-500",
    },
    {
      label: "Total Reports",
      value: stats.total_reports,
      icon: BarChart3,
      accent: "text-emerald-600 dark:text-emerald-400",
      iconBg: "bg-emerald-100 dark:bg-emerald-500/20",
      borderAccent: "border-l-emerald-500",
    },
  ];

  return (
    <div className="flex flex-col flex-1 gap-8 p-1">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Operations Dashboard
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Real-time overview of inventory and agent operations
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {kpiCards.map((kpi) => (
          <Card
            key={kpi.label}
            className={`transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md border-l-4 ${kpi.borderAccent}`}
          >
            <CardContent className="!p-8">
              <div className="flex items-start justify-between">
                <div className="space-y-3">
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                    {kpi.label}
                  </p>

                  <div className="text-4xl font-bold leading-none tracking-tight">
                    {loading ? (
                      <span className="animate-pulse text-muted-foreground/40">
                        —
                      </span>
                    ) : (
                      kpi.value === 0 ? "-" : kpi.value
                    )}
                  </div>
                </div>

                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${kpi.iconBg}`}
                >
                  <kpi.icon className={`h-5 w-5 ${kpi.accent}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Bottom Section */}
      <div className="grid flex-1 grid-cols-1 gap-5 lg:grid-cols-5">
        {/* Recent Analyses */}
        <Card className="lg:col-span-3">
          <CardHeader className="!px-8 !pt-8 !pb-5">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">
                Recent Analyses
              </CardTitle>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                <Clock className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </CardHeader>

          <CardContent className="!px-8 !pb-8 !pt-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">Product ID</TableHead>
                  <TableHead className="text-xs">Product Name</TableHead>
                  <TableHead className="text-xs">Status</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {reports.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="py-12 text-center text-muted-foreground"
                    >
                      No recent analyses.
                    </TableCell>
                  </TableRow>
                ) : (
                  reports.map((report, idx) => (
                    <TableRow key={idx} className="hover:bg-muted/40">
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {report.product_id}
                      </TableCell>

                      <TableCell className="text-sm font-medium">
                        {report.product_name}
                      </TableCell>

                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${
                            report.status === "Approved"
                              ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 ring-emerald-600/20"
                              : "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 ring-amber-600/20"
                          }`}
                        >
                          {report.status || "Completed"}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Agent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader className="!px-8 !pt-8 !pb-5">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">
                Agent Activity
              </CardTitle>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                <Zap className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </CardHeader>

          <CardContent className="!px-8 !pb-8 !pt-0">
            <div className="space-y-3">
              {reports.length === 0 ? (
                <div className="py-12 text-center text-sm text-muted-foreground">
                  No recent activity.
                </div>
              ) : (
                reports.slice(0, 4).map((report, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-4 rounded-xl border border-[#e5e5e5] dark:border-[#2a2a2a] bg-[#fafafa] dark:bg-[#0a0a0a] p-4 transition-all hover:bg-[#f0f0f0] dark:hover:bg-[#151515]"
                  >
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${report.risk_level === "HIGH"
                          ? "bg-red-100 dark:bg-red-500/15 text-red-600 dark:text-red-400"
                          : report.markdown_percentage > 0
                            ? "bg-blue-100 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400"
                            : "bg-emerald-100 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                        }`}
                    >
                      {report.risk_level === "HIGH" ? (
                        <AlertTriangle className="h-5 w-5" />
                      ) : report.markdown_percentage > 0 ? (
                        <TrendingDown className="h-5 w-5" />
                      ) : (
                        <Package className="h-5 w-5" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">
                        {report.risk_level === "HIGH"
                          ? "High risk warning"
                          : `${report.markdown_percentage}% markdown`}
                      </p>

                      <p className="mt-1 text-xs text-muted-foreground">
                        Product {report.product_id}
                      </p>
                    </div>
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