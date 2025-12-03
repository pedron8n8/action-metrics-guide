import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { KPIData } from '@/data/mockData';

interface PerformanceChartProps {
  data: KPIData[];
}

export function PerformanceChart({ data }: PerformanceChartProps) {
  const chartData = data.map(item => ({
    name: item.name.split(' ')[0],
    'Taxa SMS': item.smsLeadRate,
    'Taxa Cold Call': item.coldCallRate,
    'Taxa Fechamento': item.closeRate,
  }));

  return (
    <div className="glass rounded-xl p-6 animate-slide-up" style={{ animationDelay: '400ms' }}>
      <h3 className="text-lg font-semibold mb-6">Taxas de Conversão (%)</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(217 33% 17%)" />
            <XAxis dataKey="name" stroke="hsl(215 20% 55%)" fontSize={12} />
            <YAxis stroke="hsl(215 20% 55%)" fontSize={12} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(222 47% 10%)', 
                border: '1px solid hsl(217 33% 17%)',
                borderRadius: '8px',
                color: 'hsl(210 40% 98%)'
              }}
            />
            <Legend />
            <Line type="monotone" dataKey="Taxa SMS" stroke="hsl(217 91% 60%)" strokeWidth={2} dot={{ fill: 'hsl(217 91% 60%)' }} />
            <Line type="monotone" dataKey="Taxa Cold Call" stroke="hsl(142 76% 45%)" strokeWidth={2} dot={{ fill: 'hsl(142 76% 45%)' }} />
            <Line type="monotone" dataKey="Taxa Fechamento" stroke="hsl(280 65% 60%)" strokeWidth={2} dot={{ fill: 'hsl(280 65% 60%)' }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
