import { Team } from "@/types/scoring";
import { ServiceStatus } from "./ServiceStatus";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Users, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

interface TeamCardProps {
  team: Team;
}

export const TeamCard = ({ team }: TeamCardProps) => {
  const upServices = team.services.filter(s => s.status === 'up').length;
  const totalServices = team.services.length;
  const serviceUpRate = totalServices > 0 ? (upServices / totalServices) * 100 : 0;

  const getRankColor = () => {
    switch (team.rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-400 to-yellow-600 text-black";
      case 2:
        return "bg-gradient-to-r from-gray-300 to-gray-500 text-black";
      case 3:
        return "bg-gradient-to-r from-amber-600 to-amber-800 text-white";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  return (
    <Card className={cn(
      "relative overflow-hidden bg-card border-border transition-all duration-500 hover:shadow-2xl",
      "hover:border-cyber-blue/50 animate-slide-up",
      team.rank <= 3 && "ring-2 ring-cyber-blue/30"
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Users className="w-5 h-5 text-cyber-blue" />
            {team.name}
          </CardTitle>
          <Badge className={cn("font-bold", getRankColor())}>
            <Trophy className="w-3 h-3 mr-1" />
            #{team.rank}
          </Badge>
        </div>
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="font-mono">{team.ip}</span>
          <div className="flex items-center gap-1">
            <Activity className="w-4 h-4" />
            <span>{upServices}/{totalServices} services</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Score Display */}
        <div className="flex items-center justify-between p-4 bg-gradient-cyber rounded-lg text-black">
          <span className="font-semibold">Total Score</span>
          <span className="text-2xl font-bold">{team.totalScore.toLocaleString()}</span>
        </div>

        {/* Service Status Grid */}
        <div className="grid gap-2">
          {team.services.map((service, index) => (
            <ServiceStatus 
              key={`${service.name}-${service.port}`} 
              service={service}
            />
          ))}
        </div>

        {/* Service Health Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Service Health</span>
            <span>{serviceUpRate.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className={cn(
                "h-2 rounded-full transition-all duration-1000",
                serviceUpRate >= 80 ? "bg-status-up" : 
                serviceUpRate >= 50 ? "bg-status-unknown" : "bg-status-down"
              )}
              style={{ width: `${serviceUpRate}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};