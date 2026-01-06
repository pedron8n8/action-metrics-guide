import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon, RefreshCw, Users, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { DateRange } from "react-day-picker";

interface FiltersProps {
  selectedMember: string;
  onMemberChange: (value: string) => void;
  selectedPeriod: string;
  onPeriodChange: (value: string) => void;
  members: string[];
  onRefresh: () => void;
  dateRange?: DateRange;
  onDateRangeChange: (range: DateRange | undefined) => void;
}

export function Filters({ 
  selectedMember, 
  onMemberChange, 
  selectedPeriod, 
  onPeriodChange, 
  members, 
  onRefresh,
  dateRange,
  onDateRangeChange
}: FiltersProps) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const handleDateSelect = (range: DateRange | undefined) => {
    onDateRangeChange(range);
    if (range?.from && range?.to) {
      onPeriodChange("custom");
    }
  };

  const clearDateRange = () => {
    onDateRangeChange(undefined);
    onPeriodChange("all");
  };

  return (
    <div className="flex flex-wrap gap-4 items-center">
      <div className="flex items-center gap-2">
        <Users className="h-4 w-4 text-muted-foreground" />
        <Select value={selectedMember} onValueChange={onMemberChange}>
          <SelectTrigger className="w-[180px] bg-card border-border">
            <SelectValue placeholder="All members" />
          </SelectTrigger>
          <SelectContent className="bg-popover border-border">
            <SelectItem value="all">All Members</SelectItem>
            {members.map(member => (
              <SelectItem key={member} value={member}>{member}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
        <Select value={selectedPeriod} onValueChange={(value) => {
          onPeriodChange(value);
          if (value !== "custom") {
            onDateRangeChange(undefined);
          }
        }}>
          <SelectTrigger className="w-[180px] bg-card border-border">
            <SelectValue placeholder="Period" />
          </SelectTrigger>
          <SelectContent className="bg-popover border-border">
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            {dateRange?.from && dateRange?.to && (
              <SelectItem value="custom">Custom Range</SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>

      <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-[280px] justify-start text-left font-normal border-border",
              !dateRange && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange?.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, "MMM dd, yyyy")} - {format(dateRange.to, "MMM dd, yyyy")}
                </>
              ) : (
                format(dateRange.from, "MMM dd, yyyy")
              )
            ) : (
              <span>Select date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 bg-popover border-border z-50" align="start" sideOffset={4}>
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={dateRange?.from}
            selected={dateRange}
            onSelect={handleDateSelect}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>

      {dateRange?.from && (
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={clearDateRange}
          className="h-9 w-9 text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </Button>
      )}

      <Button variant="outline" size="icon" onClick={onRefresh} className="border-border hover:bg-accent">
        <RefreshCw className="h-4 w-4" />
      </Button>
    </div>
  );
}
