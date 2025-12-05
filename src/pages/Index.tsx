import { useState, useMemo } from "react";
import { calculateTotals, KPIData } from "@/data/mockData";
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

// Helper to calculate percentage change
const calcChange = (current: number, previous: number): number | undefined => {
  if (previous === 0) return current > 0 ? 100 : undefined;
  return ((current - previous) / previous) * 100;
};

// Get data grouped by date
const getDataByDate = (data: KPIData[], date: string) => {
  return data.filter(item => item.date === date);
};

// Get unique dates sorted descending
const getUniqueDates = (data: KPIData[]) => {
  return [...new Set(data.map(item => item.date))].sort((a, b) => b.localeCompare(a));
};

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

  // Calculate totals and day-over-day comparison
  const { totals, changes } = useMemo(() => {
    const currentTotals = calculateTotals(filteredData);
    
    // Get unique dates and find today and yesterday
    const dates = getUniqueDates(filteredData);
    const latestDate = dates[0];
    const previousDate = dates[1];
    
    let changes: Record<string, number | undefined> = {};
    
    if (latestDate && previousDate) {
      const todayData = getDataByDate(filteredData, latestDate);
      const yesterdayData = getDataByDate(filteredData, previousDate);
      
      const todayTotals = calculateTotals(todayData);
      const yesterdayTotals = calculateTotals(yesterdayData);
      
      changes = {
        totalSMS: calcChange(todayTotals.totalSMS, yesterdayTotals.totalSMS),
        totalColdCalls: calcChange(todayTotals.totalColdCalls, yesterdayTotals.totalColdCalls),
        totalInbound: calcChange(todayTotals.totalInbound, yesterdayTotals.totalInbound),
        totalHotLeads: calcChange(todayTotals.totalHotLeads, yesterdayTotals.totalHotLeads),
        totalOffers: calcChange(todayTotals.totalOffers, yesterdayTotals.totalOffers),
        totalContracts: calcChange(todayTotals.totalContracts, yesterdayTotals.totalContracts),
        avgSMSRate: calcChange(todayTotals.avgSMSRate, yesterdayTotals.avgSMSRate),
        avgCloseRate: calcChange(todayTotals.avgCloseRate, yesterdayTotals.avgCloseRate),
      };
    }
    
    return { totals: currentTotals, changes };
  }, [filteredData]);

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
              <h1 className="text-3xl font-bold tracking-tight">KPI Dashboard</h1>
              {loading && <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />}
            </div>
            <p className="text-muted-foreground">
              Team Performance Analysis • Real-time Airtable Data
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
            title="Total SMS Sent"
            value={totals.totalSMS.toLocaleString('en-US')}
            change={changes.totalSMS}
            icon={MessageSquare}
            variant="primary"
            delay={0}
          />
          <KPICard
            title="Cold Calls Made"
            value={totals.totalColdCalls.toLocaleString('en-US')}
            change={changes.totalColdCalls}
            icon={Phone}
            delay={50}
          />
          <KPICard
            title="Total Inbound Leads"
            value={totals.totalInbound.toLocaleString('en-US')}
            change={changes.totalInbound}
            icon={Users}
            variant="success"
            delay={100}
          />
          <KPICard
            title="Hot Leads"
            value={totals.totalHotLeads}
            change={changes.totalHotLeads}
            icon={Target}
            variant="warning"
            delay={150}
          />
        </section>

        {/* Secondary KPIs */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard
            title="Offers Sent"
            value={totals.totalOffers}
            change={changes.totalOffers}
            icon={FileText}
            delay={200}
          />
          <KPICard
            title="Signed Contracts"
            value={totals.totalContracts}
            change={changes.totalContracts}
            icon={CheckCircle2}
            variant="success"
            delay={250}
          />
          <KPICard
            title="Avg SMS Rate"
            value={`${totals.avgSMSRate.toFixed(1)}%`}
            change={changes.avgSMSRate}
            icon={TrendingUp}
            delay={300}
          />
          <KPICard
            title="Avg Close Rate"
            value={`${totals.avgCloseRate.toFixed(1)}%`}
            change={changes.avgCloseRate}
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
          <p>KPI Analysis Dashboard • Synced with Airtable</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
