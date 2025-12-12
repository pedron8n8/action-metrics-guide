import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { KPIData } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { useMemo } from "react";

interface DataTableProps {
  data: KPIData[];
}

interface MemberSummary {
  name: string;
  totalSMS: number;
  totalColdCalls: number;
  totalLeads: number;
  hotLeads: number;
  offers: number;
  contracts: number;
  avgCloseRate: number;
}

export function DataTable({ data }: DataTableProps) {
  // Group and aggregate data by member
  const memberData = useMemo(() => {
    const grouped = data.reduce((acc, item) => {
      const existing = acc.get(item.name);
      if (existing) {
        existing.totalSMS += item.smsSend;
        existing.totalColdCalls += item.coldCallsMade;
        existing.totalLeads += item.totalInboundLeads;
        existing.hotLeads += item.hotLeads;
        existing.offers += item.offersSent;
        existing.contracts += item.signedContracts;
        existing.closeRates.push(item.closeRate);
      } else {
        acc.set(item.name, {
          name: item.name,
          totalSMS: item.smsSend,
          totalColdCalls: item.coldCallsMade,
          totalLeads: item.totalInboundLeads,
          hotLeads: item.hotLeads,
          offers: item.offersSent,
          contracts: item.signedContracts,
          avgCloseRate: 0,
          closeRates: [item.closeRate],
        });
      }
      return acc;
    }, new Map<string, MemberSummary & { closeRates: number[] }>());

    return Array.from(grouped.values()).map(member => ({
      name: member.name,
      totalSMS: member.totalSMS,
      totalColdCalls: member.totalColdCalls,
      totalLeads: member.totalLeads,
      hotLeads: member.hotLeads,
      offers: member.offers,
      contracts: member.contracts,
      avgCloseRate: member.closeRates.length > 0 
        ? member.closeRates.reduce((a, b) => a + b, 0) / member.closeRates.length 
        : 0,
    }));
  }, [data]);

  const getPerformanceBadge = (rate: number) => {
    if (rate >= 50) return <Badge className="bg-success/20 text-success border-0">Excellent</Badge>;
    if (rate >= 25) return <Badge className="bg-warning/20 text-warning border-0">Good</Badge>;
    return <Badge className="bg-destructive/20 text-destructive border-0">Needs Improvement</Badge>;
  };

  return (
    <div className="glass rounded-xl p-6 animate-slide-up overflow-hidden" style={{ animationDelay: '500ms' }}>
      <h3 className="text-lg font-semibold mb-6">Member Breakdown</h3>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-border/50 hover:bg-transparent">
              <TableHead className="text-muted-foreground">Name</TableHead>
              <TableHead className="text-muted-foreground text-right">SMS Sent</TableHead>
              <TableHead className="text-muted-foreground text-right">Cold Calls</TableHead>
              <TableHead className="text-muted-foreground text-right">Total Leads</TableHead>
              <TableHead className="text-muted-foreground text-right">Hot Leads</TableHead>
              <TableHead className="text-muted-foreground text-right">Offers</TableHead>
              <TableHead className="text-muted-foreground text-right">Contracts</TableHead>
              <TableHead className="text-muted-foreground text-right">Avg Close Rate</TableHead>
              <TableHead className="text-muted-foreground">Performance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {memberData.map((row) => (
              <TableRow key={row.name} className="border-border/30 hover:bg-accent/30">
                <TableCell className="font-medium">{row.name}</TableCell>
                <TableCell className="text-right">{row.totalSMS.toLocaleString('en-US')}</TableCell>
                <TableCell className="text-right">{row.totalColdCalls.toLocaleString('en-US')}</TableCell>
                <TableCell className="text-right font-semibold text-primary">{row.totalLeads.toLocaleString('en-US')}</TableCell>
                <TableCell className="text-right">{row.hotLeads.toLocaleString('en-US')}</TableCell>
                <TableCell className="text-right">{row.offers.toLocaleString('en-US')}</TableCell>
                <TableCell className="text-right font-semibold text-success">{row.contracts.toLocaleString('en-US')}</TableCell>
                <TableCell className="text-right">{row.avgCloseRate.toFixed(1)}%</TableCell>
                <TableCell>{getPerformanceBadge(row.avgCloseRate)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
