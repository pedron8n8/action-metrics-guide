import { useMemo } from "react";
import { KPIData } from "@/data/mockData";
import { Phone, MessageSquare, FileCheck, Search, Crown } from "lucide-react";
import { InfoTooltip } from "@/components/ui/info-tooltip";

interface RolePerformanceCardsProps {
  data: KPIData[];
}

interface RolePerformance {
  role: string;
  icon: React.ReactNode;
  color: string;
  members: { name: string; score: number; metric: string }[];
  topPerformer: string;
  avgMetric: number;
  metricLabel: string;
}

export function RolePerformanceCards({ data }: RolePerformanceCardsProps) {
  const rolePerformance = useMemo((): RolePerformance[] => {
    // Group data by member
    const memberStats = data.reduce((acc, item) => {
      // Alias handling for RolePerformanceCards too
      let name = item.name;
      if (name.includes("Leah")) name = "Zia";
      if (name.includes("Kyle")) name = "Alex";
      // Ensure specific team members are tracked correctly if names vary in data vs display

      const existing = acc.get(name) || {
        name: name,
        coldCalls: 0,
        coldCallLeads: 0,
        smsSent: 0,
        smsLeads: 0,
        offers: 0,
        contracts: 0,
        signed: 0,
        compared: 0,
        rejected: 0,
      };
      
      existing.coldCalls += item.coldCallsMade;
      existing.coldCallLeads += item.coldCallLeads;
      existing.smsSent += item.smsSend;
      existing.smsLeads += item.smsLeads;
      existing.offers += item.offersSent;
      existing.contracts += item.contractsSent;
      existing.signed += item.signedContracts;
      existing.compared += item.comparedProperties;
      existing.rejected += item.rejectedLeads;
      
      acc.set(item.name, existing);
      return acc;
    }, new Map<string, any>());

    const members = Array.from(memberStats.values());

    // Cold Callers - ranked by leads generated
    const coldCallers = members
      .filter(m => m.coldCallLeads > 0)
      .map(m => ({
        name: m.name,
        score: m.coldCallLeads,
        metric: `${m.coldCallLeads} leads from ${m.coldCalls} calls`,
        rate: m.coldCalls > 0 ? (m.coldCallLeads / m.coldCalls) * 100 : 0,
      }))
      .sort((a, b) => b.score - a.score);

    // SMS Team - ranked by leads generated
    const smsTeam = members
      .filter(m => m.smsSent > 0)
      .map(m => ({
        name: m.name,
        score: m.smsLeads,
        metric: `${m.smsLeads} leads from ${m.smsSent.toLocaleString()} SMS`,
        rate: m.smsSent > 0 ? (m.smsLeads / m.smsSent) * 100 : 0,
      }))
      .sort((a, b) => b.score - a.score);

    // Closers - ranked by signed contracts
    const closers = members
      .filter(m => m.offers > 0 || m.signed > 0)
      .map(m => ({
        name: m.name,
        score: m.signed,
        metric: `${m.signed} signed / ${m.offers} offers`,
        rate: m.offers > 0 ? (m.signed / m.offers) * 100 : 0,
      }))
      .sort((a, b) => b.score - a.score);

    // Analysts - ranked by properties compared
    const analysts = members
      .filter(m => m.compared > 0)
      .map(m => ({
        name: m.name,
        score: m.compared,
        metric: `${m.compared} compared, ${m.rejected} rejected`,
        rate: m.compared > 0 ? (m.rejected / m.compared) * 100 : 0,
      }))
      .sort((a, b) => b.score - a.score);

    return [
      {
        role: "Cold Callers",
        icon: <Phone className="w-5 h-5" />,
        color: "hsl(var(--chart-1))",
        members: coldCallers.slice(0, 3),
        topPerformer: coldCallers[0]?.name || "N/A",
        avgMetric: coldCallers.length > 0 
          ? coldCallers.reduce((sum, m) => sum + m.rate, 0) / coldCallers.length 
          : 0,
        metricLabel: "Avg Lead Rate",
      },
      {
        role: "SMS Team",
        icon: <MessageSquare className="w-5 h-5" />,
        color: "hsl(var(--chart-2))",
        members: smsTeam.slice(0, 3),
        topPerformer: smsTeam[0]?.name || "N/A",
        avgMetric: smsTeam.length > 0 
          ? smsTeam.reduce((sum, m) => sum + m.rate, 0) / smsTeam.length 
          : 0,
        metricLabel: "Avg Response Rate",
      },
      {
        role: "Acquisitions",
        icon: <FileCheck className="w-5 h-5" />,
        color: "hsl(var(--chart-3))",
        members: closers.slice(0, 3),
        topPerformer: closers[0]?.name || "N/A",
        avgMetric: closers.length > 0 
          ? closers.reduce((sum, m) => sum + m.rate, 0) / closers.length 
          : 0,
        metricLabel: "Avg Close Rate",
      },
      {
        role: "Property Analysts",
        icon: <Search className="w-5 h-5" />,
        color: "hsl(var(--chart-4))",
        members: analysts.slice(0, 3),
        topPerformer: analysts[0]?.name || "N/A",
        avgMetric: analysts.length > 0 
          ? analysts.reduce((sum, m) => sum + m.rate, 0) / analysts.length 
          : 0,
        metricLabel: "Avg Rejection Rate",
      },
    ];
  }, [data]);

  return (
    <div className="glass rounded-xl p-6 animate-slide-up" style={{ animationDelay: "400ms" }}>
      <div className="flex items-center gap-2 mb-6">
        <h3 className="text-lg font-semibold">Role-Based Performance</h3>
        <InfoTooltip content="Top performers and average metrics for each specific role (Cold Caller, SMS, Acquisitions, Analyst)." />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {rolePerformance.map((role) => (
          <div
            key={role.role}
            className="bg-accent/30 rounded-lg p-4 border border-border/30"
          >
            <div className="flex items-center gap-2 mb-4">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: role.color + "20", color: role.color }}
              >
                {role.icon}
              </div>
              <div>
                <h4 className="font-semibold text-sm">{role.role}</h4>
                <p className="text-xs text-muted-foreground">
                  {role.metricLabel}: {role.avgMetric.toFixed(1)}%
                </p>
              </div>
            </div>

            {role.members.length > 0 && (
              <div className="space-y-2">
                {role.members.map((member, idx) => (
                  <div
                    key={`${role.role}-${member.name}-${idx}`}
                    className="flex items-center justify-between text-sm"
                  >
                    <div className="flex items-center gap-2">
                      {idx === 0 && <Crown className="w-3 h-3 text-warning" />}
                      <span className={idx === 0 ? "font-medium" : "text-muted-foreground"}>
                        {member.name}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground truncate ml-2">
                      {member.score}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {role.members.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-2">
                No data available
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
