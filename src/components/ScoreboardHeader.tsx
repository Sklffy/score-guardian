import { ScoreData } from "@/types/scoring";
import { Shield, Clock, Users, Activity } from "lucide-react";

interface ScoreboardHeaderProps {
  scoreData: ScoreData | null;
  isLoading: boolean;
  lastUpdate: Date | null;
}

export const ScoreboardHeader = ({ scoreData, isLoading, lastUpdate }: ScoreboardHeaderProps) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: true,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getEventRunningTime = () => {
    if (!scoreData?.competition.startTime) return "0:00:00";
    const start = new Date(scoreData.competition.startTime);
    const now = new Date();
    const diff = now.getTime() - start.getTime();
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="text-center py-12 relative">
      {/* Background particles effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-atlantis-cyan/20 rounded-full floating-animation"></div>
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-atlantis-cyan/30 rounded-full floating-animation" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-3/4 w-1.5 h-1.5 bg-atlantis-cyan/25 rounded-full floating-animation" style={{animationDelay: '2s'}}></div>
      </div>
      
      {/* Logo and Title */}
      <div className="flex flex-col items-center gap-4 mb-8 relative z-10">
        <div className="relative group">
          <Shield className="w-16 h-16 text-atlantis-cyan pulse-glow transition-all duration-500 group-hover:scale-110 cursor-pointer" />
          <div className="absolute inset-0 w-16 h-16 border-2 border-atlantis-cyan rounded-lg animate-pulse opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
        </div>
        <h1 className="text-4xl font-bold">
          <span className="text-atlantis-cyan">ATLANTIS</span>{" "}
          <span className="text-foreground">SCOREBOARD</span>
        </h1>
      </div>

      {/* Teams Section */}
      <div className="max-w-2xl mx-auto mb-8">
        <div className="flex items-center gap-2 mb-6 text-atlantis-cyan">
          <Users className="w-5 h-5" />
          <h2 className="text-xl font-semibold">Teams</h2>
        </div>
      </div>

      {/* Stats Panel */}
      <div className="max-w-md mx-auto bg-atlantis-card border border-atlantis-border rounded-lg p-6 shadow-glow-subtle">
        <div className="space-y-4 text-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-atlantis-cyan" />
              <span className="text-atlantis-cyan">Total Teams:</span>
            </div>
            <span className="text-foreground font-mono">{scoreData?.teams.length || 0}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-atlantis-cyan" />
              <span className="text-atlantis-cyan">Last Check:</span>
            </div>
            <span className="text-foreground font-mono">
              {lastUpdate ? formatTime(lastUpdate) : "Never"}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-atlantis-cyan" />
              <span className="text-atlantis-cyan">Event Running Time:</span>
            </div>
            <span className="text-foreground font-mono">{getEventRunningTime()}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-atlantis-cyan" />
              <span className="text-atlantis-cyan">Latest Inject:</span>
            </div>
            <span className="text-foreground font-mono text-xs">
              System Health Check
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};