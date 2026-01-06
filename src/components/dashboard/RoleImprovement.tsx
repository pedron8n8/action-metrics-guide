import { KPIData } from "@/data/mockData";
import { useDashboard } from "@/hooks/useDashboard";
import { AlertTriangle, CheckCircle, Smartphone, Phone, FileSignature, BarChart2 } from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { InfoTooltip } from "@/components/ui/info-tooltip";

interface ImprovementPlanProps {
  data: KPIData[];
}

interface PerformanceIssue {
  metric: string;
  current: number;
  target: number;
  message: string;
}

interface MemberPerformance {
  name: string;
  role: string;
  icon: any;
  issues: PerformanceIssue[];
  strengths: string[];
}

export function RoleImprovement({ data }: ImprovementPlanProps) {
  const { benchmarks, getRole } = useDashboard();

  // Logic runs on every render to ensure Settings changes apply immediately.
  const memberPerformance = (() => {
    // Aggregate data by member
    const memberStats = data.reduce((acc, item) => {
      // Normalize name to handle partial matches and aliases
      let name = item.name;
      const lowerName = item.name.toLowerCase();
      
      // Alias handling (Case Insensitive):
      // "Kyle and Alex are the same" -> Map Kyle to Alex
      if (lowerName.includes("kyle") || lowerName.includes("alex")) {
          name = "Alex";
      } else if (lowerName.includes("leah") || lowerName.includes("zia")) {
          // "Zia and Leah are the same" -> Map Leah to Zia
          name = "Zia";
      }

      if (!acc[name]) {
        acc[name] = {
          name,
          smsSent: 0,
          smsLeads: 0,
          coldCalls: 0,
          coldCallLeads: 0,
          inboundLeads: 0,
          offers: 0,
          signed: 0,
          compared: 0,
          rejected: 0,
          count: 0
        };
      }
      
      acc[name].smsSent += item.smsSend;
      acc[name].smsLeads += item.smsLeads;
      acc[name].coldCalls += item.coldCallsMade;
      acc[name].coldCallLeads += item.coldCallLeads;
      acc[name].inboundLeads += item.totalInboundLeads;
      acc[name].offers += item.offersSent;
      acc[name].signed += item.signedContracts;
      acc[name].compared += item.comparedProperties;
      acc[name].rejected += item.rejectedLeads;
      acc[name].count += 1;
      
      return acc;
    }, {} as Record<string, any>);

    const results: MemberPerformance[] = [];

    // Analyze each member based on their role
    Object.values(memberStats).forEach(stat => {
      const role = getRole(stat.name); // Using context now
      if (!role) {
          return; 
      }

      const issues: PerformanceIssue[] = [];
      const strengths: string[] = [];
      let icon = Smartphone;

      // --- LEAD GENERATORS (Cold Calls) ---
      if (role === "Lead Generator") {
        icon = Phone;
        const callRate = stat.coldCalls > 0 ? (stat.coldCallLeads / stat.coldCalls) * 100 : 0;
        
        if (callRate < benchmarks.coldCallResponseRate.min) {
          issues.push({
            metric: "Cold Call Response Rate",
            current: callRate,
            target: benchmarks.coldCallResponseRate.min,
            message: `Rate is ${callRate.toFixed(1)}%, target is >${benchmarks.coldCallResponseRate.min}%`
          });
        } else if (callRate > benchmarks.coldCallResponseRate.max) {
             strengths.push(`Excellent Cold Call Rate: ${callRate.toFixed(1)}% (Target >${benchmarks.coldCallResponseRate.max}%)`);
        } else {
          strengths.push(`Good Cold Call Rate: ${callRate.toFixed(1)}%`);
        }
      }

      // --- SMS/MARKETING ---
      if (role === "SMS/Marketing") {
        icon = Smartphone;
        const smsRate = stat.smsSent > 0 ? (stat.smsLeads / stat.smsSent) * 100 : 0;
        
        if (smsRate < benchmarks.smsResponseRate.min) {
          issues.push({
            metric: "SMS Response Rate",
            current: smsRate,
            target: benchmarks.smsResponseRate.min,
            message: `Response rate is ${smsRate.toFixed(1)}%, target is >${benchmarks.smsResponseRate.min}%`
          });
        } else if (smsRate > benchmarks.smsResponseRate.max) {
             strengths.push(`Excellent SMS Campaign: ${smsRate.toFixed(1)}% (Target >${benchmarks.smsResponseRate.max}%)`);
        } else {
             strengths.push(`Good SMS Campaign: ${smsRate.toFixed(1)}%`);
        }
      }

       // --- CLOSERS (Lana Brown) ---
       if (role === "Closer/Acquisitions") {
        icon = FileSignature;
         
        // Simple Volume/Closing Check as fallback
        if (stat.signed === 0 && stat.offers > 0) {
             issues.push({
                metric: "Closing",
                current: 0,
                target: 1,
                message: "Offers sent but no deals signed yet."
             });
        } else if (stat.offers === 0) {
            issues.push({
                metric: "Offers",
                current: 0,
                target: 1,
                message: "No offers sent in this period."
            });
        } else {
             strengths.push(`${stat.signed} deals signed from ${stat.offers} offers`);
        }
      }

      // --- ANALYSTS (Jescel) ---
      if (role === "Analyst") {
         // Focus: Comparing properties
         if (stat.compared === 0) {
            issues.push({
                metric: "Properties Compared",
                current: 0,
                target: 1,
                message: "No properties compared in this period"
            });
         } else {
            strengths.push(`Analyzed ${stat.compared} properties`);
         }
      }

      if (issues.length > 0 || strengths.length > 0) {
        results.push({
            name: stat.name,
            role: role,
            icon,
            issues,
            strengths
        });
      }
    });

    return results;
  })();

  return (
    <div className="glass rounded-xl p-6">
      <div className="flex items-center gap-2 mb-6">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <BarChart2 className="w-5 h-5" />
          Team Performance & Improvement Plan
        </h3>
        <InfoTooltip content="Actionable feedback for each team member based on their specific role benchmarks. Highlights areas performing well vs. needing improvement." />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {memberPerformance.map((member) => (
          <Card key={member.name} className="border-l-4 border-l-primary/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <member.icon className="w-4 h-4 text-muted-foreground" />
                  <span>{member.name}</span>
                </div>
                <span className="text-xs font-normal text-muted-foreground bg-secondary px-2 py-1 rounded">
                  {member.role}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Issues / Needs Improvement */}
              {member.issues.length > 0 && (
                <div className="space-y-2">
                    <p className="text-xs font-semibold text-destructive flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> Needs Improvement
                    </p>
                    <ul className="space-y-1">
                        {member.issues.map((issue, idx) => (
                            <li key={idx} className="text-sm bg-destructive/20 p-2 rounded text-destructive-foreground border border-destructive/30">
                                <span className="font-medium">{issue.metric}:</span> {issue.message}
                            </li>
                        ))}
                    </ul>
                </div>
              )}

              {/* Strengths */}
              {member.strengths.length > 0 && (
                <div className="space-y-2">
                    <p className="text-xs font-semibold text-success flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Performing Well
                    </p>
                    <ul className="space-y-1">
                        {member.strengths.map((str, idx) => (
                            <li key={idx} className="text-sm text-muted-foreground pl-4 border-l-2 border-success/30">
                                {str}
                            </li>
                        ))}
                    </ul>
                </div>
              )}
              
              {member.issues.length === 0 && member.strengths.length === 0 && (
                <p className="text-sm text-muted-foreground italic">No data available for this period.</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
