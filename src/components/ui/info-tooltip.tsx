import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";

interface InfoTooltipProps {
  content: string;
}

export function InfoTooltip({ content }: InfoTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <button className="inline-flex items-center justify-center text-muted-foreground/70 hover:text-foreground transition-colors ml-2 cursor-help focus:outline-none">
            <HelpCircle className="h-3.5 w-3.5" />
            <span className="sr-only">More info</span>
          </button>
        </TooltipTrigger>
        <TooltipContent className="max-w-[250px] text-sm bg-popover text-popover-foreground border border-border p-3 shadow-md z-50">
          <p>{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
