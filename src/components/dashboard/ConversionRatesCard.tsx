import { useMemo } from "react";
import { KPIData } from "@/data/mockData";
import { ArrowRight, TrendingUp, TrendingDown } from "lucide-react";
import { useDashboard } from "@/hooks/useDashboard";
import { InfoTooltip } from "@/components/ui/info-tooltip";

interface ConversionRatesCardProps {
  data: KPIData[];
}

interface ConversionStage {
  from: string;
  to: string;
  rate: number;
  isGood: boolean;
  description: string;
}

export function ConversionRatesCard({ data }: ConversionRatesCardProps) {
  const { benchmarks } = useDashboard();

  const conversionRates = useMemo((): ConversionStage[] => {
    const totals = data.reduce(
      (acc, item) => ({
        smsSent: acc.smsSent + item.smsSend,
        smsLeads: acc.smsLeads + item.smsLeads,
        coldCalls: acc.coldCalls + item.coldCallsMade,
        coldCallLeads: acc.coldCallLeads + item.coldCallLeads,
        totalLeads: acc.totalLeads + item.smsLeads + item.coldCallLeads + item.mailLeads + item.totalInboundLeads,
        hotLeads: acc.hotLeads + item.hotLeads,
        warmLeads: acc.warmLeads + item.warmLeads,
        offers: acc.offers + item.offersSent,
        contracts: acc.contracts + item.contractsSent,
        signed: acc.signed + item.signedContracts,
      }),
      {
        smsSent: 0,
        smsLeads: 0,
        coldCalls: 0,
        coldCallLeads: 0,
        totalLeads: 0,
        hotLeads: 0,
        warmLeads: 0,
        offers: 0,
        contracts: 0,
        signed: 0,
      }
    );

    const qualifiedLeads = totals.hotLeads + totals.warmLeads;

    return [
      {
        from: "SMS",
        to: "Leads",
        rate: totals.smsSent > 0 ? (totals.smsLeads / totals.smsSent) * 100 : 0,
        isGood: totals.smsSent > 0 ? (totals.smsLeads / totals.smsSent) * 100 >= benchmarks.smsResponseRate.min : false,
        description: "Percentage of SMS sent that resulted in a lead response.",
      },
      {
        from: "Cold Calls",
        to: "Leads",
        rate: totals.coldCalls > 0 ? (totals.coldCallLeads / totals.coldCalls) * 100 : 0,
        isGood: totals.coldCalls > 0 ? (totals.coldCallLeads / totals.coldCalls) * 100 >= benchmarks.coldCallResponseRate.min : false,
        description: "Percentage of cold calls that resulted in a lead.",
      },
      {
        from: "Leads",
        to: "Qualified",
        rate: totals.totalLeads > 0 ? (qualifiedLeads / totals.totalLeads) * 100 : 0,
        isGood: totals.totalLeads > 0 ? (qualifiedLeads / totals.totalLeads) * 100 >= benchmarks.leadToQualifiedRate.min : false,
        description: "Percentage of total leads that were qualified as Hot or Warm.",
      },
      {
        from: "Qualified",
        to: "Offers",
        rate: qualifiedLeads > 0 ? (totals.offers / qualifiedLeads) * 100 : 0,
        isGood: qualifiedLeads > 0 ? (totals.offers / qualifiedLeads) * 100 >= benchmarks.qualifiedToOfferRate.min : false,
        description: "Percentage of qualified leads that received an offer.",
      },
      {
        from: "Offers",
        to: "Contracts",
        rate: totals.offers > 0 ? (totals.contracts / totals.offers) * 100 : 0,
        isGood: totals.offers > 0 ? (totals.contracts / totals.offers) * 100 >= benchmarks.offerToContractRate.min : false,
        description: "Percentage of offers sent that proceeded to a contract.",
      },
      {
        from: "Contracts",
        to: "Signed",
        rate: totals.contracts > 0 ? (totals.signed / totals.contracts) * 100 : 0,
        isGood: totals.contracts > 0 ? (totals.signed / totals.contracts) * 100 >= benchmarks.contractSignRate.min : false,
        description: "Percentage of contracts sent that were signed.",
      },
    ];
  }, [data, benchmarks]);

  return (
    <div className="glass rounded-xl p-6 animate-slide-up" style={{ animationDelay: "300ms" }}>
      <div className="flex items-center gap-2 mb-6">
        <h3 className="text-lg font-semibold">Conversion Rates by Stage</h3>
        <InfoTooltip content="Detailed conversion percentages between each stage of the funnel. Green arrows indicate specific stage performance is meeting the 'Min' benchmark." />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {conversionRates.map((stage) => (
          <div
            key={`${stage.from}-${stage.to}`}
            className="bg-accent/30 rounded-lg p-4 border border-border/30 relative group"
          >
            <div className="absolute top-2 right-2 opacity-10 group-hover:opacity-100 transition-opacity">
                 <InfoTooltip content={stage.description} />
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
              <span>{stage.from}</span>
              <ArrowRight className="w-3 h-3" />
              <span>{stage.to}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">{stage.rate.toFixed(1)}%</span>
              {stage.isGood ? (
                <TrendingUp className="w-4 h-4 text-success" />
              ) : (
                <TrendingDown className="w-4 h-4 text-destructive" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
