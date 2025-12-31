import { useMemo } from "react";
import { KPIData } from "@/data/mockData";

interface FunnelChartProps {
  data: KPIData[];
}

export function FunnelChart({ data }: FunnelChartProps) {
  const funnelData = useMemo(() => {
    const totals = data.reduce(
      (acc, item) => ({
        smsSent: acc.smsSent + item.smsSend,
        coldCalls: acc.coldCalls + item.coldCallsMade,
        smsLeads: acc.smsLeads + item.smsLeads,
        coldCallLeads: acc.coldCallLeads + item.coldCallLeads,
        mailLeads: acc.mailLeads + item.mailLeads,
        totalInbound: acc.totalInbound + item.totalInboundLeads,
        hotLeads: acc.hotLeads + item.hotLeads,
        warmLeads: acc.warmLeads + item.warmLeads,
        comparedProperties: acc.comparedProperties + item.comparedProperties,
        offers: acc.offers + item.offersSent,
        contractsSent: acc.contractsSent + item.contractsSent,
        signed: acc.signed + item.signedContracts,
      }),
      {
        smsSent: 0,
        coldCalls: 0,
        smsLeads: 0,
        coldCallLeads: 0,
        mailLeads: 0,
        totalInbound: 0,
        hotLeads: 0,
        warmLeads: 0,
        comparedProperties: 0,
        offers: 0,
        contractsSent: 0,
        signed: 0,
      }
    );

    const totalOutreach = totals.smsSent + totals.coldCalls;
    const totalLeads = totals.smsLeads + totals.coldCallLeads + totals.mailLeads + totals.totalInbound;
    const qualifiedLeads = totals.hotLeads + totals.warmLeads;

    return [
      { stage: "Outreach", value: totalOutreach, color: "hsl(var(--primary))" },
      { stage: "Total Leads", value: totalLeads, color: "hsl(var(--chart-1))" },
      { stage: "Qualified Leads", value: qualifiedLeads, color: "hsl(var(--chart-2))" },
      { stage: "Compared", value: totals.comparedProperties, color: "hsl(var(--chart-3))" },
      { stage: "Offers Sent", value: totals.offers, color: "hsl(var(--chart-4))" },
      { stage: "Contracts", value: totals.contractsSent, color: "hsl(var(--chart-5))" },
      { stage: "Signed", value: totals.signed, color: "hsl(var(--success))" },
    ];
  }, [data]);

  const maxValue = Math.max(...funnelData.map((d) => d.value), 1);

  return (
    <div className="glass rounded-xl p-6 animate-slide-up" style={{ animationDelay: "200ms" }}>
      <h3 className="text-lg font-semibold mb-6">Sales Funnel</h3>
      <div className="space-y-3">
        {funnelData.map((item, index) => {
          const widthPercent = Math.max((item.value / maxValue) * 100, 8);
          const nextItem = funnelData[index + 1];
          const conversionRate = nextItem && item.value > 0 
            ? ((nextItem.value / item.value) * 100).toFixed(1) 
            : null;

          return (
            <div key={item.stage} className="relative">
              <div className="flex items-center gap-4">
                <div className="w-28 text-sm text-muted-foreground font-medium shrink-0">
                  {item.stage}
                </div>
                <div className="flex-1 relative">
                  <div
                    className="h-10 rounded-lg flex items-center justify-end px-3 transition-all duration-500"
                    style={{
                      width: `${widthPercent}%`,
                      backgroundColor: item.color,
                      minWidth: "60px",
                    }}
                  >
                    <span className="text-white font-bold text-sm">
                      {item.value.toLocaleString("en-US")}
                    </span>
                  </div>
                </div>
                {conversionRate && (
                  <div className="w-16 text-right">
                    <span className="text-xs text-muted-foreground">
                      → {conversionRate}%
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-4 pt-4 border-t border-border/50">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Overall Conversion</span>
          <span className="font-semibold text-success">
            {funnelData[0].value > 0
              ? ((funnelData[funnelData.length - 1].value / funnelData[0].value) * 100).toFixed(2)
              : 0}%
          </span>
        </div>
      </div>
    </div>
  );
}
