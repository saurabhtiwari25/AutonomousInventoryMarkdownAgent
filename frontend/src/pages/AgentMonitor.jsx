import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Activity,
  Clock,
  AlertCircle,
  CheckCircle2,
  Box,
  DollarSign,
  ShieldCheck,
} from "lucide-react";

export default function AgentMonitor() {
  const [stats, setStats] = useState({
    agents: {
      Inventory_Agent: {
        status: "Idle",
        last_run: "Never",
        duration: 0,
        message: "Ready",
      },
      Pricing_Agent: {
        status: "Idle",
        last_run: "Never",
        duration: 0,
        message: "Ready",
      },
      Risk_Analysis_Agent: {
        status: "Idle",
        last_run: "Never",
        duration: 0,
        message: "Ready",
      },
    },
    mcp_calls: [],
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("https://autonomousinventorymarkdownagent.onrender.com/monitor-stats");

        if (!response.ok) return;

        const data = await response.json();
        setStats(data);
      } catch (err) {
        console.error("Failed to fetch monitor stats:", err);
      }
    };

    fetchStats();

    const interval = setInterval(fetchStats, 2000);

    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case "Running":
        return <Activity className="h-3 w-3 animate-spin" />;

      case "Failed":
        return <AlertCircle className="h-3 w-3" />;

      case "Completed":
      case "Success":
        return <CheckCircle2 className="h-3 w-3" />;

      default:
        return null;
    }
  };

  const statusStyle = (status) => {
    switch (status) {
      case "Completed":
      case "Success":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";

      case "Running":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";

      case "Failed":
        return "bg-red-500/10 text-red-400 border-red-500/20";

      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  const agentNames = [
    "Inventory_Agent",
    "Pricing_Agent",
    "Risk_Analysis_Agent",
  ];

  const getAgentIcon = (name) => {
    switch (name) {
      case "Inventory_Agent":
        return <Box className="h-5 w-5 text-blue-400" />;

      case "Pricing_Agent":
        return <DollarSign className="h-5 w-5 text-emerald-400" />;

      case "Risk_Analysis_Agent":
        return <ShieldCheck className="h-5 w-5 text-orange-400" />;

      default:
        return <Box className="h-5 w-5" />;
    }
  };

  return (
    <div className="flex flex-col flex-1 gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Agent Monitor
        </h1>

        <p className="mt-2 text-muted-foreground">
          Real-time agent and MCP tool call tracking
        </p>
      </div>

      {/* Agent Cards */}

      <div className="grid gap-6 md:grid-cols-3">
        {agentNames.map((name) => {
          const agent = stats.agents?.[name] ?? {};

          return (
            <Card
              key={name}
              className="overflow-hidden border-border/60 transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl"
            >
              <CardHeader className="pb-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {getAgentIcon(name)}

                    <CardTitle className="text-lg font-semibold">
                      {name.replace(/_/g, " ")}
                    </CardTitle>
                  </div>

                  <Badge
                    variant="secondary"
                    className={`flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide ${statusStyle(
                      agent.status
                    )}`}
                  >
                    {getStatusIcon(agent.status)}
                    {agent.status || "Idle"}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-5 pt-0">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                      Last Run
                    </p>

                    <p className="mt-2 text-base font-semibold">
                      {agent.last_run || "Never"}
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                      Duration
                    </p>

                    <p className="mt-2 text-base font-semibold">
                      {agent.duration ?? 0}s
                    </p>
                  </div>
                </div>

                <div className="rounded-lg border border-border/50 bg-muted/40 p-3">
                  <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                    Status
                  </p>

                  <p className="mt-2 text-sm">
                    {agent.message || "Ready and waiting for instructions."}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* MCP History */}

      <Card className="overflow-hidden border-border/60 shadow-sm">
        <CardHeader className="border-b bg-muted/20">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-muted-foreground" />

            <CardTitle className="text-lg">
              MCP Tool Call History
            </CardTitle>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="h-12 px-6">
                  Timestamp
                </TableHead>

                <TableHead>Tool</TableHead>

                <TableHead>Status</TableHead>

                <TableHead className="px-6 text-right">
                  Duration
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {stats.mcp_calls?.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="h-32 text-center text-muted-foreground"
                  >
                    No recent MCP tool calls.
                  </TableCell>
                </TableRow>
              ) : (
                stats.mcp_calls.map((call, index) => (
                  <TableRow
                    key={index}
                    className="transition-colors hover:bg-muted/30"
                  >
                    <TableCell className="px-6 font-mono text-xs text-muted-foreground">
                      {call.timestamp}
                    </TableCell>

                    <TableCell className="font-medium">
                      {call.tool_name}
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={`rounded-full border px-2 py-1 text-[11px] uppercase tracking-wide ${statusStyle(
                          call.status
                        )}`}
                      >
                        {call.status}
                      </Badge>
                    </TableCell>

                    <TableCell className="px-6 text-right font-mono text-xs text-muted-foreground">
                      {call.duration}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}