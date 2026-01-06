import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { KPIData } from '@/data/mockData';
import { useTheme } from 'next-themes';
import { InfoTooltip } from '@/components/ui/info-tooltip';

interface LeadsChartProps {
  data: KPIData[];
}

export function LeadsChart({ data }: LeadsChartProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Group data by member name
  const groupedData = data.reduce((acc, item) => {
    const firstName = item.name.split(' ')[0];
    const existing = acc.find(x => x.name === firstName);
    if (existing) {
      existing.smsLeads += item.smsLeads;
      existing.coldCallLeads += item.coldCallLeads;
      existing.mailLeads += item.mailLeads;
    } else {
      acc.push({
        name: firstName,
        smsLeads: item.smsLeads,
        coldCallLeads: item.coldCallLeads,
        mailLeads: item.mailLeads,
      });
    }
    return acc;
  }, [] as { name: string; smsLeads: number; coldCallLeads: number; mailLeads: number }[]);

  const chartData = groupedData.map(item => ({
    name: item.name,
    'SMS Leads': item.smsLeads,
    'Cold Call Leads': item.coldCallLeads,
    'Mail Leads': item.mailLeads,
  }));

  const gridColor = isDark ? 'hsl(217 33% 17%)' : 'hsl(220 13% 91%)';
  const textColor = isDark ? 'hsl(215 20% 55%)' : 'hsl(220 9% 46%)';
  const tooltipBg = isDark ? 'hsl(222 47% 10%)' : 'hsl(0 0% 100%)';
  const tooltipBorder = isDark ? 'hsl(217 33% 17%)' : 'hsl(220 13% 91%)';
  const tooltipText = isDark ? 'hsl(210 40% 98%)' : 'hsl(222 47% 11%)';

  return (
    <div className="glass rounded-xl p-6 animate-slide-up" style={{ animationDelay: '200ms' }}>
      <div className="flex items-center gap-2 mb-6">
        <h3 className="text-lg font-semibold">Leads by Channel</h3>
        <InfoTooltip content="Distribution of generated leads across different marketing channels (SMS, Cold Call, Mail) for each team member." />
      </div>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey="name" stroke={textColor} fontSize={12} />
            <YAxis stroke={textColor} fontSize={12} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: tooltipBg, 
                border: `1px solid ${tooltipBorder}`,
                borderRadius: '8px',
                color: tooltipText
              }}
            />
            <Legend />
            <Bar dataKey="SMS Leads" fill="hsl(217 91% 50%)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Cold Call Leads" fill="hsl(142 76% 36%)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Mail Leads" fill="hsl(38 92% 50%)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
