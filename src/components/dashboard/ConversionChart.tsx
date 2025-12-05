import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface ConversionChartProps {
  hotLeads: number;
  warmLeads: number;
  coldLeads: number;
}

export function ConversionChart({ hotLeads, warmLeads, coldLeads }: ConversionChartProps) {
  const data = [
    { name: 'Hot Leads', value: hotLeads, color: 'hsl(0 84% 60%)' },
    { name: 'Warm Leads', value: warmLeads, color: 'hsl(38 92% 50%)' },
    { name: 'Cold Leads', value: coldLeads, color: 'hsl(217 33% 40%)' },
  ];

  const total = hotLeads + warmLeads + coldLeads;

  return (
    <div className="glass rounded-xl p-6 animate-slide-up" style={{ animationDelay: '300ms' }}>
      <h3 className="text-lg font-semibold mb-6">Lead Qualification</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
              label={({ name, value }) => `${name}: ${total > 0 ? ((value / total) * 100).toFixed(0) : 0}%`}
              labelLine={false}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(222 47% 10%)', 
                border: '1px solid hsl(217 33% 17%)',
                borderRadius: '8px',
                color: 'hsl(210 40% 98%)'
              }}
              formatter={(value: number) => [`${value} (${total > 0 ? ((value / total) * 100).toFixed(1) : 0}%)`, '']}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
