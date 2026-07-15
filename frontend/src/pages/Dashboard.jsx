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
        console.error("Failed to load dashboard data", err);
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
      accent: "text-blue-500 dark:text-blue-400",
      iconBg: "bg-blue-500/10",
    },
    {
      label: "Out of Stock",
      value: stats.out_of_stock,
      icon: AlertTriangle,
      accent: "text-amber-500 dark:text-amber-400",
      iconBg: "bg-amber-500/10",
    },
    {
      label: "Active Agents",
      value: stats.active_agents,
      icon: Zap,
      accent: "text-violet-500 dark:text-violet-400",
      iconBg: "bg-violet-500/10",
    },
    {
      label: "Total Reports",
      value: stats.total_reports,
      icon: BarChart3,
      accent: "text-emerald-500 dark:text-emerald-400",
      iconBg: "bg-emerald-500/10",
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
            className="rounded-lg transition-all duration-200 hover:shadow-lg"
          >
            <CardContent className="p-8">
              <div className="flex items-start justify-between">
                <div className="space-y-4">
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    {kpi.label}
                  </p>

                  <div className="text-4xl font-bold leading-none">
                    {loading ? (
                      <span className="animate-pulse text-muted-foreground/40">
                        —
                      </span>
                    ) : (
                      kpi.value
                    )}
                  </div>
                </div>

                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-lg ${kpi.iconBg}`}
                >
                  <kpi.icon className={`h-6 w-6 ${kpi.accent}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Bottom Section */}
      <div className="grid flex-1 grid-cols-1 gap-5 lg:grid-cols-5">
        {/* Recent Analyses */}
        <Card className="rounded-lg lg:col-span-3">
          <CardHeader className="px-8 pt-8 pb-5">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">
                Recent Analyses
              </CardTitle>
              <Clock className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardHeader>

          <CardContent className="px-8 pb-8 pt-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product ID</TableHead>
                  <TableHead>Product Name</TableHead>
                  <TableHead>Status</TableHead>
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
                    <TableRow key={idx}>
                      <TableCell className="font-mono text-xs">
                        {report.product_id}
                      </TableCell>

                      <TableCell className="font-medium">
                        {report.product_name}
                      </TableCell>

                      <TableCell>
                        <Badge
                          variant={
                            report.status === "Approved"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {report.status || "Completed"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Agent Activity */}
        <Card className="rounded-lg lg:col-span-2">
          <CardHeader className="px-8 pt-8 pb-5">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">
                Agent Activity
              </CardTitle>
              <Zap className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardHeader>

          <CardContent className="px-8 pb-8 pt-0">
            <div className="space-y-3">
              {reports.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground">
                  No recent activity.
                </div>
              ) : (
                reports.slice(0, 4).map((report, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-4 rounded-lg border p-5 transition-colors hover:bg-muted/40"
                  >
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-lg ${report.risk_level === "HIGH"
                          ? "bg-destructive/10 text-destructive"
                          : report.markdown_percentage > 0
                            ? "bg-blue-500/10 text-blue-500"
                            : "bg-emerald-500/10 text-emerald-500"
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