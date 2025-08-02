import { ScoreData } from "@/types/scoring";
import { Badge } from "@/components/ui/badge";
import { Clock, RefreshCw, Shield, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ScoreboardHeaderProps {
  scoreData: ScoreData | null;
  isLoading: boolean;
  lastUpdate: Date | null;
}

export const ScoreboardHeader = ({ scoreData, isLoading, lastUpdate }: ScoreboardHeaderProps) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString();
  };

  const getTimeSinceUpdate = () => {
    if (!lastUpdate) return "Never";
    const seconds = Math.floor((Date.now() - lastUpdate.getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  const totalServices = scoreData?.teams.reduce((acc, team) => acc + team.services.length, 0) || 0;
  const upServices = scoreData?.teams.reduce((acc, team) => 
    acc + team.services.filter(s => s.status === 'up').length, 0
  ) || 0;

  return (
    <header className="bg-card border-b border-border p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Title Section */}
          <div>
            <h1 className="text-4xl font-bold bg-gradient-cyber bg-clip-text text-transparent">
              {scoreData?.competition.name || "Cyber Defense Scoreboard"}
            </h1>
            <p className="text-muted-foreground mt-1">
              Real-time competition monitoring system
            </p>
          </div>

          {/* Stats Section */}
          <div className="flex flex-wrap gap-4">
            <Badge variant="outline" className="flex items-center gap-2 px-3 py-2">
              <Clock className="w-4 h-4" />
              Round {scoreData?.round || 1}
            </Badge>
            
            <Badge 
              variant="outline" 
              className={cn(
                "flex items-center gap-2 px-3 py-2",
                isLoading && "animate-pulse"
              )}
            >
              <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />
              {isLoading ? "Updating..." : `Updated ${getTimeSinceUpdate()}`}
            </Badge>

            <Badge variant="outline" className="flex items-center gap-2 px-3 py-2">
              <Shield className="w-4 h-4 text-status-up" />
              {upServices}/{totalServices} Services Up
            </Badge>

            <Badge variant="outline" className="flex items-center gap-2 px-3 py-2">
              <AlertTriangle className="w-4 h-4 text-cyber-orange" />
              {scoreData?.teams.length || 0} Teams
            </Badge>
          </div>
        </div>

        {/* Competition Timer */}
        {scoreData?.competition.startTime && (
          <div className="mt-4 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-muted rounded-full text-sm">
              <Clock className="w-4 h-4" />
              Competition started: {new Date(scoreData.competition.startTime).toLocaleString()}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};