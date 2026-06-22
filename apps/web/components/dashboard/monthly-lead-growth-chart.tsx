"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { HugeiconsIcon } from "@hugeicons/react";
import { ChartLineData01Icon, MoreHorizontalIcon } from "@hugeicons/core-free-icons";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
} from "recharts";
import { useTheme } from "next-themes";
import type { LeadsProps } from "@/lib/types";

type ChartType = "line" | "area" | "bar";
type Period = "3m" | "6m" | "12m";

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    payload: { month: string; leads: number };
  }>;
}

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    const item = payload[0];

    return (
      <div className="bg-card border rounded-md p-2">
        <p className="text-xs text-muted-foreground">{item.payload.month}, 2025</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="font-semibold text-sm">{item.value}</span>
          <span className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
            <HugeiconsIcon icon={ChartLineData01Icon} className="size-3" />
            {item.value} leads
          </span>
        </div>
      </div>
    );
  }
  return null;
}

export function MonthlyLeadGrowthChart({ leads }: LeadsProps) {
  const { theme } = useTheme();
  const [chartType, setChartType] = useState<ChartType>("area");
  const [period, setPeriod] = useState<Period>("12m");
  const [showGrid, setShowGrid] = useState(true);
  const [smoothCurve, setSmoothCurve] = useState(true);

  const axisColor = theme === "dark" ? "#525866" : "#868c98";
  const gridColor = theme === "dark" ? "#27272a" : "#e2e4e9";
  const lineColor = "#cc6600";

  // Build real chart data from leads grouped by month
  const chartData = useMemo(() => {
    const now = new Date();
    const months = [];

    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const count = leads.filter((lead) => {
        const created = new Date(lead.createdAt);
        return (
          created.getMonth() === d.getMonth() &&
          created.getFullYear() === d.getFullYear()
        );
      }).length;

      months.push({
        month: monthNames[d.getMonth()],
        leads: count,
      });
    }

    return months;
  }, [leads]);

  const getDataForPeriod = () => {
    switch (period) {
      case "3m":
        return chartData.slice(-3);
      case "6m":
        return chartData.slice(-6);
      case "12m":
      default:
        return chartData;
    }
  };

  const data = getDataForPeriod();

  // Dynamic Y-axis max based on data
  const maxLeads = Math.max(...data.map((d) => d.leads), 1);
  const yMax = Math.ceil(maxLeads / 100) * 100 + 100;

  const resetToDefault = () => {
    setChartType("area");
    setPeriod("12m");
    setShowGrid(true);
    setSmoothCurve(true);
  };

  return (
    <div className="border rounded-xl flex-1">
      <div className="flex flex-row items-center justify-between py-5 px-5">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="size-8">
            <HugeiconsIcon icon={ChartLineData01Icon} className="size-4 text-muted-foreground" />
          </Button>
          <h3 className="font-medium text-sm sm:text-base">Monthly Lead Growth</h3>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" size="icon" className="size-8">
                <HugeiconsIcon icon={MoreHorizontalIcon} className="size-4 text-muted-foreground" />
              </Button>
            }
          />
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Chart Type</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem onClick={() => setChartType("line")}>
                  Line Chart {chartType === "line" && "✓"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setChartType("area")}>
                  Area Chart {chartType === "area" && "✓"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setChartType("bar")}>
                  Bar Chart {chartType === "bar" && "✓"}
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Time Period</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem onClick={() => setPeriod("3m")}>
                  Last 3 Months {period === "3m" && "✓"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setPeriod("6m")}>
                  Last 6 Months {period === "6m" && "✓"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setPeriod("12m")}>
                  Last 12 Months {period === "12m" && "✓"}
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem
              checked={showGrid}
              onCheckedChange={setShowGrid}
            >
              Show Grid
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={smoothCurve}
              onCheckedChange={setSmoothCurve}
              disabled={chartType === "bar"}
            >
              Smooth Curve
            </DropdownMenuCheckboxItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={resetToDefault}>
              Reset to Default
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="px-5 pb-5">
        <div className="h-[200px] sm:h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === "bar" ? (
              <BarChart data={data} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                {showGrid && <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />}
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: axisColor }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: axisColor }}
                  domain={[0, yMax]}
                  allowDecimals={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <defs>
                  <linearGradient id="leadBarGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#cc6600" />
                    <stop offset="100%" stopColor="#ffaa55" />
                  </linearGradient>
                </defs>
                <Bar dataKey="leads" fill="url(#leadBarGradient)" radius={[4, 4, 0, 0]} />
              </BarChart>
            ) : chartType === "area" ? (
              <AreaChart data={data} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                {showGrid && <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />}
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: axisColor }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: axisColor }}
                  domain={[0, yMax]}
                  allowDecimals={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <defs>
                  <linearGradient id="leadAreaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#cc6600" stopOpacity={0.15} />
                    <stop offset="100%" stopColor="#cc6600" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area
                  type={smoothCurve ? "monotone" : "linear"}
                  dataKey="leads"
                  stroke={lineColor}
                  strokeWidth={2}
                  fill="url(#leadAreaGradient)"
                  dot={false}
                  activeDot={{ r: 6, fill: lineColor, stroke: "#fff", strokeWidth: 2 }}
                />
              </AreaChart>
            ) : (
              <LineChart data={data} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                {showGrid && <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />}
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: axisColor }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: axisColor }}
                  domain={[0, yMax]}
                  allowDecimals={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type={smoothCurve ? "monotone" : "linear"}
                  dataKey="leads"
                  stroke={lineColor}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 6, fill: lineColor, stroke: "#fff", strokeWidth: 2 }}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
