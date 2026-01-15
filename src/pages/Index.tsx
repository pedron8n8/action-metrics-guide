import { useState, useMemo, useCallback } from "react";
import { format } from "date-fns";
import { calculateTotals, KPIData } from "@/data/mockData";
import { useAirtableData } from "@/hooks/useAirtableData";
import { useDashboard } from "@/hooks/useDashboard";
import { Link } from "react-router-dom";
import { KPICard } from "@/components/dashboard/KPICard";
import { LeadsChart } from "@/components/dashboard/LeadsChart";
import { ConversionChart } from "@/components/dashboard/ConversionChart";
import { PerformanceChart } from "@/components/dashboard/PerformanceChart";
import { DataTable } from "@/components/dashboard/DataTable";
import { Filters } from "@/components/dashboard/Filters";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { FunnelChart } from "@/components/dashboard/FunnelChart";
import { ConversionRatesCard } from "@/components/dashboard/ConversionRatesCard";
import { RolePerformanceCards } from "@/components/dashboard/RolePerformanceCards";
import { RoleImprovement } from "@/components/dashboard/RoleImprovement";
import { DateRange } from "react-day-picker";
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

// Parse a date string to a Date object (handles YYYY-MM-DD and other formats)
const parseLocalDate = (dateStr: string): Date => {
  if (!dateStr) return new Date(0);
  
  // If it's already in YYYY-MM-DD format
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    const [year, month, day] = dateStr.split("-").map(Number);
    return new Date(year, month - 1, day);
  }
  
  // Try to parse ISO format or other formats
  const parsed = new Date(dateStr);
  if (!isNaN(parsed.getTime())) {
    return parsed;
  }
  
  return new Date(0);
};

// Format date as YYYY-MM-DD for comparison
const formatDateToCompare = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Get unique dates sorted descending
const getUniqueDates = (data: KPIData[]) => {
  return [...new Set(data.map(item => item.date))].sort((a, b) => b.localeCompare(a));
};

const Index = () => {
  const [selectedMember, setSelectedMember] = useState("all");
  const [selectedPeriod, setSelectedPeriod] = useState("all");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  
  const { benchmarks } = useDashboard();
  
  const filterParams = useMemo(() => {
    if (dateRange?.from && dateRange?.to) {
      return {
        fromDate: formatDateToCompare(dateRange.from),
        toDate: formatDateToCompare(dateRange.to)
      };
    } else if (selectedPeriod !== "all" && selectedPeriod !== "custom") {
      return { period: selectedPeriod };
    }
    return {};
  }, [dateRange, selectedPeriod]);

  const { data: kpiData, loading, refetch } = useAirtableData(filterParams);

  // Handle period change by clearing date range if a preset is selected
  const handlePeriodChange = (value: string) => {
    setSelectedPeriod(value);
    if (value !== "custom") {
      setDateRange(undefined);
    }
  };

  const handleDateRangeChange = useCallback((range: DateRange | undefined) => {
    setDateRange(range);
    if (range?.from && range?.to) {
      setSelectedPeriod("custom");
    }
  }, []);

  const members = useMemo(() => 
    [...new Set(kpiData.map(item => item.name))],
    [kpiData]
  );

  const filteredData = useMemo(() => {
    let data = kpiData;
    
    if (selectedMember !== "all") {
      data = data.filter(item => item.name === selectedMember);
    }
    
    return data;
  }, [kpiData, selectedMember]);

  // Calculate totals and day-over-day comparison
  const { totals, changes } = useMemo(() => {
    const currentTotals = calculateTotals(filteredData);
    
    // Get unique dates and find today and yesterday
    const dates = getUniqueDates(filteredData);
    const latestDate = dates[0];
    const previousDate = dates[1];
    
    let changes: Record<string, number | undefined> = {};
    
    if (latestDate && previousDate && (selectedPeriod === "all" || selectedPeriod === "custom")) {
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
  }, [filteredData, selectedPeriod]);

  const coldLeads = totals.totalInbound - totals.totalHotLeads - totals.totalWarmLeads;

  return (
    <div className="min-h-screen bg-background p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 animate-fade-in">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg gradient-primary">
                <BarChart3 className="h-6 w-6 text-primary-foreground" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight">KPI Dashboard</h1>
              {loading && <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />}
              <Link to="/settings" className="ml-auto lg:ml-4">
                 <Button variant="outline" size="sm">Settings</Button>
              </Link>
              <ThemeToggle />
            </div>
            <p className="text-muted-foreground">
              Team Performance Analysis • Real-time Airtable Data
            </p>
          </div>
          
          <Filters
            selectedMember={selectedMember}
            onMemberChange={setSelectedMember}
            selectedPeriod={selectedPeriod}
            onPeriodChange={handlePeriodChange}
            members={members}
            onRefresh={() => refetch()}
            dateRange={dateRange}
            onDateRangeChange={handleDateRangeChange}
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
            description="Total number of SMS messages sent in the selected period."
          />
          <KPICard
            title="Cold Calls Made"
            value={totals.totalColdCalls.toLocaleString('en-US')}
            change={changes.totalColdCalls}
            icon={Phone}
            delay={50}
            description="Total number of cold calls attempted in the selected period."
          />
          <KPICard
            title="Total Inbound Leads"
            value={totals.totalInbound.toLocaleString('en-US')}
            change={changes.totalInbound}
            icon={Users}
            variant="success"
            delay={100}
            description="Number of leads that came in through inbound channels."
          />
          <KPICard
            title="Hot Leads"
            value={totals.totalHotLeads}
            change={changes.totalHotLeads}
            icon={Target}
            variant="warning"
            delay={150}
            description="Leads categorized as 'Hot' who are ready to move forward."
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
            description="Total number of property offers sent to leads."
          />
          <KPICard
            title="Signed Contracts"
            value={totals.totalContracts}
            change={changes.totalContracts}
            icon={CheckCircle2}
            variant="success"
            delay={250}
            description="Number of contracts successfully signed."
          />
          <KPICard
            title="Avg SMS Rate"
            value={`${totals.avgSMSRate.toFixed(1)}%`}
            change={changes.avgSMSRate}
            icon={TrendingUp}
            variant={totals.avgSMSRate >= benchmarks.smsResponseRate.min ? "success" : "warning"}
            delay={300}
            description="Percentage of SMS campaigns that resulted in a lead."
          />
          <KPICard
            title="Avg Close Rate"
            value={`${totals.avgCloseRate.toFixed(1)}%`}
            change={changes.avgCloseRate}
            icon={Target}
            variant={totals.avgCloseRate >= benchmarks.contractSignRate.min ? "success" : "warning"}
            delay={350}
            description="Percentage of sent contracts that were successfully signed."
          />
        </section>

        {/* Funnel & Conversion Rates */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <FunnelChart data={filteredData} />
          <ConversionRatesCard data={filteredData} />
        </section>

        {/* Role-Based Performance */}
        <section>
          <RolePerformanceCards data={filteredData} />
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

        {/* Performance Trends */}
        <section>
          <RoleImprovement data={filteredData} />
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
