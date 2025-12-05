import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts';
import { KPIData } from '@/data/mockData';

interface PerformanceChartProps {
  data: KPIData[];
}

export function PerformanceChart({ data }: PerformanceChartProps) {
  // Group data by member and calculate average rates
  const memberStats = data.reduce((acc, item) => {
    const existing = acc.find(x => x.name === item.name);
    if (existing) {
      existing.entries += 1;
      existing.totalSmsRate += item.smsLeadRate;
      existing.totalColdCallRate += item.coldCallRate;
      existing.totalCloseRate += item.closeRate;
    } else {
      acc.push({
        name: item.name,
        entries: 1,
        totalSmsRate: item.smsLeadRate,
        totalColdCallRate: item.coldCallRate,
        totalCloseRate: item.closeRate,
      });
    }
    return acc;
  }, [] as { name: string; entries: number; totalSmsRate: number; totalColdCallRate: number; totalCloseRate: number }[]);

  const chartData = memberStats.map(item => ({
    name: item.name.split(' ')[0],
    'SMS Rate': Math.round(item.totalSmsRate / item.entries),
    'Cold Call Rate': Math.round(item.totalColdCallRate / item.entries),
    'Close Rate': Math.round(item.totalCloseRate / item.entries),
  }));

  return (
    <div className="glass rounded-xl p-6 animate-slide-up" style={{ animationDelay: '400ms' }}>
      <h3 className="text-lg font-semibold mb-6">Conversion Rates by Member (%)</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(217 33% 17%)" />
            <XAxis dataKey="name" stroke="hsl(215 20% 55%)" fontSize={12} />
            <YAxis stroke="hsl(215 20% 55%)" fontSize={12} domain={[0, 100]} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(222 47% 10%)', 
                border: '1px solid hsl(217 33% 17%)',
                borderRadius: '8px',
                color: 'hsl(210 40% 98%)'
              }}
              formatter={(value: number) => [`${value}%`, '']}
            />
            <Legend />
            <Bar dataKey="SMS Rate" fill="hsl(217 91% 60%)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Cold Call Rate" fill="hsl(142 76% 45%)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Close Rate" fill="hsl(280 65% 60%)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
