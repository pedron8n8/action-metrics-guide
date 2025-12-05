import { useState, useMemo } from "react";
import { calculateTotals } from "@/data/mockData";
import { useAirtableData } from "@/hooks/useAirtableData";
import { KPICard } from "@/components/dashboard/KPICard";
import { LeadsChart } from "@/components/dashboard/LeadsChart";
import { ConversionChart } from "@/components/dashboard/ConversionChart";
import { PerformanceChart } from "@/components/dashboard/PerformanceChart";
import { DataTable } from "@/components/dashboard/DataTable";
import { Filters } from "@/components/dashboard/Filters";
import { 
  MessageSquare, 
  Phone, 
  Users, 
  Target, 
  FileText, 
  CheckCircle2,
  TrendingUp,
  BarChart3,
  Loader2
} from "lucide-react";

const Index = () => {
  const [selectedMember, setSelectedMember] = useState("all");
  const [selectedPeriod, setSelectedPeriod] = useState("all");
  
  const { data: kpiData, loading, refetch } = useAirtableData();

  const members = useMemo(() => 
    [...new Set(kpiData.map(item => item.name))],
    [kpiData]
  );

  const filteredData = useMemo(() => {
    let data = kpiData;
    
    if (selectedMember !== "all") {
      data = data.filter(item => item.name === selectedMember);
    }
    
    if (selectedPeriod !== "all") {
      const today = new Date();
      const filterDate = new Date();
      
      switch (selectedPeriod) {
        case "today":
          filterDate.setHours(0, 0, 0, 0);
          break;
        case "week":
          filterDate.setDate(today.getDate() - 7);
          break;
        case "month":
          filterDate.setMonth(today.getMonth() - 1);
          break;
      }
      
      data = data.filter(item => new Date(item.date) >= filterDate);
    }
    
    return data;
  }, [kpiData, selectedMember, selectedPeriod]);

  const totals = useMemo(() => calculateTotals(filteredData), [filteredData]);

  const coldLeads = totals.totalInbound - totals.totalHotLeads - totals.totalWarmLeads;

  return (
    <div className="min-h-screen bg-background p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 animate-fade-in">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg gradient-primary">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight">Dashboard de KPIs</h1>
              {loading && <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />}
            </div>
            <p className="text-muted-foreground">
              Análise de performance da equipe • Dados do Airtable
            </p>
          </div>
          
          <Filters
            selectedMember={selectedMember}
            onMemberChange={setSelectedMember}
            selectedPeriod={selectedPeriod}
            onPeriodChange={setSelectedPeriod}
            members={members}
            onRefresh={refetch}
          />
        </header>

        {/* KPI Cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard
            title="Total SMS Enviados"
            value={totals.totalSMS.toLocaleString('pt-BR')}
            change={12.5}
            icon={MessageSquare}
            variant="primary"
            delay={0}
          />
          <KPICard
            title="Cold Calls Realizadas"
            value={totals.totalColdCalls.toLocaleString('pt-BR')}
            change={8.3}
            icon={Phone}
            delay={50}
          />
          <KPICard
            title="Total Leads Inbound"
            value={totals.totalInbound.toLocaleString('pt-BR')}
            change={-2.1}
            icon={Users}
            variant="success"
            delay={100}
          />
          <KPICard
            title="Hot Leads"
            value={totals.totalHotLeads}
            change={15.7}
            icon={Target}
            variant="warning"
            delay={150}
          />
        </section>

        {/* Secondary KPIs */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard
            title="Ofertas Enviadas"
            value={totals.totalOffers}
            icon={FileText}
            delay={200}
          />
          <KPICard
            title="Contratos Assinados"
            value={totals.totalContracts}
            change={25}
            icon={CheckCircle2}
            variant="success"
            delay={250}
          />
          <KPICard
            title="Taxa Média SMS"
            value={`${totals.avgSMSRate.toFixed(1)}%`}
            icon={TrendingUp}
            delay={300}
          />
          <KPICard
            title="Taxa Média Fechamento"
            value={`${totals.avgCloseRate.toFixed(1)}%`}
            change={5.2}
            icon={Target}
            variant="primary"
            delay={350}
          />
        </section>

        {/* Charts Row */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <LeadsChart data={filteredData} />
          <ConversionChart 
            hotLeads={totals.totalHotLeads} 
            warmLeads={totals.totalWarmLeads}
            coldLeads={coldLeads > 0 ? coldLeads : 0}
          />
        </section>

        {/* Performance Chart */}
        <section>
          <PerformanceChart data={filteredData} />
        </section>

        {/* Data Table */}
        <section>
          <DataTable data={filteredData} />
        </section>

        {/* Footer */}
        <footer className="text-center text-sm text-muted-foreground py-4 border-t border-border">
          <p>Dashboard de Análise de KPIs • Dados sincronizados com Airtable</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
