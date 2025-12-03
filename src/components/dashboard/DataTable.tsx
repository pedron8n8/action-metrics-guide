import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { KPIData } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";

interface DataTableProps {
  data: KPIData[];
}

export function DataTable({ data }: DataTableProps) {
  const getPerformanceBadge = (rate: number) => {
    if (rate >= 50) return <Badge className="bg-success/20 text-success border-0">Excelente</Badge>;
    if (rate >= 25) return <Badge className="bg-warning/20 text-warning border-0">Bom</Badge>;
    return <Badge className="bg-destructive/20 text-destructive border-0">A Melhorar</Badge>;
  };

  return (
    <div className="glass rounded-xl p-6 animate-slide-up overflow-hidden" style={{ animationDelay: '500ms' }}>
      <h3 className="text-lg font-semibold mb-6">Detalhamento por Membro</h3>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-border/50 hover:bg-transparent">
              <TableHead className="text-muted-foreground">Nome</TableHead>
              <TableHead className="text-muted-foreground">Data</TableHead>
              <TableHead className="text-muted-foreground text-right">SMS Enviados</TableHead>
              <TableHead className="text-muted-foreground text-right">Cold Calls</TableHead>
              <TableHead className="text-muted-foreground text-right">Total Leads</TableHead>
              <TableHead className="text-muted-foreground text-right">Hot Leads</TableHead>
              <TableHead className="text-muted-foreground text-right">Ofertas</TableHead>
              <TableHead className="text-muted-foreground text-right">Contratos</TableHead>
              <TableHead className="text-muted-foreground">Performance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row) => (
              <TableRow key={`${row.id}-${row.date}`} className="border-border/30 hover:bg-accent/30">
                <TableCell className="font-medium">{row.name}</TableCell>
                <TableCell className="text-muted-foreground">{new Date(row.date).toLocaleDateString('pt-BR')}</TableCell>
                <TableCell className="text-right">{row.smsSend}</TableCell>
                <TableCell className="text-right">{row.coldCallsMade}</TableCell>
                <TableCell className="text-right font-semibold text-primary">{row.totalInboundLeads}</TableCell>
                <TableCell className="text-right">{row.hotLeads}</TableCell>
                <TableCell className="text-right">{row.offersSent}</TableCell>
                <TableCell className="text-right font-semibold text-success">{row.signedContracts}</TableCell>
                <TableCell>{getPerformanceBadge(row.closeRate)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
