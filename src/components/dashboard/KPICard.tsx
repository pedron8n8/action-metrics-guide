import { cn } from "@/lib/utils";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: LucideIcon;
  variant?: "default" | "primary" | "success" | "warning";
  delay?: number;
}

export function KPICard({ title, value, change, icon: Icon, variant = "default", delay = 0 }: KPICardProps) {
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;

  return (
    <div 
      className={cn(
        "glass rounded-xl p-6 animate-slide-up transition-all duration-300 hover:scale-[1.02] hover:border-primary/30",
        variant === "primary" && "border-primary/20",
        variant === "success" && "border-success/20",
        variant === "warning" && "border-warning/20"
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground font-medium">{title}</p>
          <p className="text-3xl font-bold tracking-tight">{value}</p>
          {change !== undefined && (
            <div className={cn(
              "flex items-center gap-1 text-sm font-medium",
              isPositive && "text-success",
              isNegative && "text-destructive",
              !isPositive && !isNegative && "text-muted-foreground"
            )}>
              {isPositive ? <TrendingUp className="h-4 w-4" /> : isNegative ? <TrendingDown className="h-4 w-4" /> : null}
              <span>{isPositive ? "+" : ""}{change.toFixed(1)}%</span>
              <span className="text-muted-foreground ml-1">vs previous day</span>
            </div>
          )}
        </div>
        <div className={cn(
          "p-3 rounded-lg",
          variant === "default" && "bg-primary/10",
          variant === "primary" && "gradient-primary",
          variant === "success" && "gradient-success",
          variant === "warning" && "gradient-warning"
        )}>
          <Icon className={cn(
            "h-6 w-6",
            variant === "default" && "text-primary",
            variant !== "default" && "text-white"
          )} />
        </div>
      </div>
    </div>
  );
}
