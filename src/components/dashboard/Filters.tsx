import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar, RefreshCw, Users } from "lucide-react";

interface FiltersProps {
  selectedMember: string;
  onMemberChange: (value: string) => void;
  selectedPeriod: string;
  onPeriodChange: (value: string) => void;
  members: string[];
  onRefresh: () => void;
}

export function Filters({ selectedMember, onMemberChange, selectedPeriod, onPeriodChange, members, onRefresh }: FiltersProps) {
  return (
    <div className="flex flex-wrap gap-4 items-center">
      <div className="flex items-center gap-2">
        <Users className="h-4 w-4 text-muted-foreground" />
        <Select value={selectedMember} onValueChange={onMemberChange}>
          <SelectTrigger className="w-[180px] bg-card border-border">
            <SelectValue placeholder="Todos os membros" />
          </SelectTrigger>
          <SelectContent className="bg-popover border-border">
            <SelectItem value="all">Todos os membros</SelectItem>
            {members.map(member => (
              <SelectItem key={member} value={member}>{member}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <Calendar className="h-4 w-4 text-muted-foreground" />
        <Select value={selectedPeriod} onValueChange={onPeriodChange}>
          <SelectTrigger className="w-[180px] bg-card border-border">
            <SelectValue placeholder="Período" />
          </SelectTrigger>
          <SelectContent className="bg-popover border-border">
            <SelectItem value="all">Todo período</SelectItem>
            <SelectItem value="today">Hoje</SelectItem>
            <SelectItem value="week">Última semana</SelectItem>
            <SelectItem value="month">Último mês</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button variant="outline" size="icon" onClick={onRefresh} className="border-border hover:bg-accent">
        <RefreshCw className="h-4 w-4" />
      </Button>
    </div>
  );
}
