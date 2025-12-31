import { useMemo, useState } from "react";
import { KPIData } from "@/data/mockData";
import { useTheme } from "next-themes";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { format, parseISO, startOfWeek, endOfWeek, isWithinInterval } from "date-fns";

interface TrendsChartProps {
  data: KPIData[];
}

type ViewMode = "daily" | "weekly";

export function TrendsChart({ data }: TrendsChartProps) {
  const { theme } = useTheme();
  const [viewMode, setViewMode] = useState<ViewMode>("daily");

  const chartData = useMemo(() => {
    if (viewMode === "daily") {
      // Group by date
      const grouped = data.reduce((acc, item) => {
        const date = item.date;
        const existing = acc.get(date) || {
          date,
          leads: 0,
          offers: 0,
          signed: 0,
          outreach: 0,
        };
        
        existing.leads += item.smsLeads + item.coldCallLeads + item.mailLeads + item.totalInboundLeads;
        existing.offers += item.offersSent;
        existing.signed += item.signedContracts;
        existing.outreach += item.smsSend + item.coldCallsMade;
        
        acc.set(date, existing);
        return acc;
      }, new Map<string, any>());

      return Array.from(grouped.values())
        .sort((a, b) => a.date.localeCompare(b.date))
        .map(item => ({
          ...item,
          label: format(parseISO(item.date), "MMM dd"),
        }));
    } else {
      // Group by week
      const weeks = new Map<string, any>();
      
      data.forEach(item => {
        const itemDate = parseISO(item.date);
        const weekStart = startOfWeek(itemDate, { weekStartsOn: 1 });
        const weekKey = format(weekStart, "yyyy-MM-dd");
        
        const existing = weeks.get(weekKey) || {
          weekStart,
          label: `${format(weekStart, "MMM dd")} - ${format(endOfWeek(itemDate, { weekStartsOn: 1 }), "dd")}`,
          leads: 0,
          offers: 0,
          signed: 0,
          outreach: 0,
        };
        
        existing.leads += item.smsLeads + item.coldCallLeads + item.mailLeads + item.totalInboundLeads;
        existing.offers += item.offersSent;
        existing.signed += item.signedContracts;
        existing.outreach += item.smsSend + item.coldCallsMade;
        
        weeks.set(weekKey, existing);
      });

      return Array.from(weeks.values())
        .sort((a, b) => a.weekStart.getTime() - b.weekStart.getTime());
    }
  }, [data, viewMode]);

  const gridColor = theme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)";
  const textColor = theme === "dark" ? "#94a3b8" : "#64748b";

  return (
    <div className="glass rounded-xl p-6 animate-slide-up" style={{ animationDelay: "500ms" }}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Performance Trends</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode("daily")}
            className={`px-3 py-1 text-sm rounded-lg transition-colors ${
              viewMode === "daily"
                ? "bg-primary text-primary-foreground"
                : "bg-accent/50 text-muted-foreground hover:bg-accent"
            }`}
          >
            Daily
          </button>
          <button
            onClick={() => setViewMode("weekly")}
            className={`px-3 py-1 text-sm rounded-lg transition-colors ${
              viewMode === "weekly"
                ? "bg-primary text-primary-foreground"
                : "bg-accent/50 text-muted-foreground hover:bg-accent"
            }`}
          >
            Weekly
          </button>
        </div>
      </div>
      
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis 
              dataKey="label" 
              tick={{ fill: textColor, fontSize: 12 }}
              tickLine={{ stroke: gridColor }}
            />
            <YAxis 
              tick={{ fill: textColor, fontSize: 12 }}
              tickLine={{ stroke: gridColor }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: theme === "dark" ? "#1e293b" : "#ffffff",
                borderColor: theme === "dark" ? "#334155" : "#e2e8f0",
                borderRadius: "8px",
              }}
              labelStyle={{ color: textColor }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="leads"
              name="Leads"
              stroke="hsl(var(--chart-1))"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="offers"
              name="Offers"
              stroke="hsl(var(--chart-2))"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="signed"
              name="Signed"
              stroke="hsl(var(--success))"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {chartData.length === 0 && (
        <div className="flex items-center justify-center h-[300px] text-muted-foreground">
          No trend data available
        </div>
      )}
    </div>
  );
}
