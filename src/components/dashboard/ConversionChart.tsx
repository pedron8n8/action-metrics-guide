import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useTheme } from 'next-themes';
import { InfoTooltip } from '@/components/ui/info-tooltip';

interface ConversionChartProps {
  hotLeads: number;
  warmLeads: number;
  coldLeads: number;
}

export function ConversionChart({ hotLeads, warmLeads, coldLeads }: ConversionChartProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const data = [
    { name: 'Hot Leads', value: hotLeads, color: 'hsl(0 84% 60%)' },
    { name: 'Warm Leads', value: warmLeads, color: 'hsl(38 92% 50%)' },
    { name: 'Cold Leads', value: coldLeads, color: isDark ? 'hsl(217 33% 40%)' : 'hsl(220 13% 70%)' },
  ];

  const total = hotLeads + warmLeads + coldLeads;

  const tooltipBg = isDark ? 'hsl(222 47% 10%)' : 'hsl(0 0% 100%)';
  const tooltipBorder = isDark ? 'hsl(217 33% 17%)' : 'hsl(220 13% 91%)';
  const tooltipText = isDark ? 'hsl(210 40% 98%)' : 'hsl(222 47% 11%)';

  return (
    <div className="glass rounded-xl p-6 animate-slide-up" style={{ animationDelay: '300ms' }}>
      <div className="flex items-center gap-2 mb-6">
        <h3 className="text-lg font-semibold">Lead Qualification</h3>
        <InfoTooltip content="Breakdown of leads by their qualification status: Hot (Ready to engage), Warm (Interested), and Cold (Not interested or unresponsive)." />
      </div>
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
                backgroundColor: tooltipBg, 
                border: `1px solid ${tooltipBorder}`,
                borderRadius: '8px',
                color: tooltipText
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
