import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { KPIData } from '@/data/mockData';

interface LeadsChartProps {
  data: KPIData[];
}

export function LeadsChart({ data }: LeadsChartProps) {
  const chartData = data.map(item => ({
    name: item.name.split(' ')[0],
    'SMS Leads': item.smsLeads,
    'Cold Call Leads': item.coldCallLeads,
    'Mail Leads': item.mailLeads,
  }));

  return (
    <div className="glass rounded-xl p-6 animate-slide-up" style={{ animationDelay: '200ms' }}>
      <h3 className="text-lg font-semibold mb-6">Leads por Canal</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} barGap={4}>
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
            <Bar dataKey="SMS Leads" fill="hsl(217 91% 60%)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Cold Call Leads" fill="hsl(142 76% 45%)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Mail Leads" fill="hsl(38 92% 50%)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
