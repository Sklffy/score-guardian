import { Team } from "@/types/scoring";
import { cn } from "@/lib/utils";
import { Shield, ShieldAlert, ShieldCheck, TrendingUp, TrendingDown } from "lucide-react";

interface AtlantisTeamListProps {
  teams: Team[];
}

export const AtlantisTeamList = ({ teams }: AtlantisTeamListProps) => {
  const getTeamStats = (team: Team) => {
    const upServices = team.services.filter(s => s.status === 'up').length;
    const downServices = team.services.filter(s => s.status === 'down').length;
    const totalServices = team.services.length;
    const upPoints = team.services.filter(s => s.status === 'up').reduce((acc, s) => acc + s.points, 0);
    const lostPoints = team.services.filter(s => s.status === 'down').reduce((acc, s) => acc + s.points, 0);
    
    return { upServices, downServices, totalServices, upPoints, lostPoints };
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {teams.map((team, index) => {
        const stats = getTeamStats(team);
        const isLeading = index === 0;
        
        return (
          <div
            key={team.id}
            className={cn(
              "bg-atlantis-card border rounded-lg p-6 transition-all duration-300",
              isLeading ? "border-atlantis-cyan shadow-glow-cyan" : "border-atlantis-border hover:border-atlantis-cyan/50",
              "animate-fade-in"
            )}
          >
            {/* Team Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg",
                  isLeading ? "bg-atlantis-cyan text-atlantis-dark" : "bg-atlantis-border text-atlantis-cyan"
                )}>
                  #{team.rank}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">{team.name}</h3>
                  <p className="text-sm text-muted-foreground font-mono">{team.ip}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-atlantis-cyan">
                  {team.totalScore.toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground">Total Points</div>
              </div>
            </div>

            {/* Scoring Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {/* Services Up */}
              <div className="bg-status-up/10 border border-status-up/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <ShieldCheck className="w-5 h-5 text-status-up" />
                  <span className="font-semibold text-status-up">Services UP</span>
                </div>
                <div className="text-2xl font-bold text-status-up">{stats.upServices}</div>
                <div className="flex items-center gap-1 text-sm text-status-up/80">
                  <TrendingUp className="w-4 h-4" />
                  +{stats.upPoints.toLocaleString()} pts
                </div>
              </div>

              {/* Services Down */}
              <div className="bg-status-down/10 border border-status-down/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <ShieldAlert className="w-5 h-5 text-status-down" />
                  <span className="font-semibold text-status-down">Services DOWN</span>
                </div>
                <div className="text-2xl font-bold text-status-down">{stats.downServices}</div>
                <div className="flex items-center gap-1 text-sm text-status-down/80">
                  <TrendingDown className="w-4 h-4" />
                  -{stats.lostPoints.toLocaleString()} pts lost
                </div>
              </div>

              {/* Overall Status */}
              <div className="bg-atlantis-cyan/10 border border-atlantis-cyan/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-5 h-5 text-atlantis-cyan" />
                  <span className="font-semibold text-atlantis-cyan">Overall</span>
                </div>
                <div className="text-2xl font-bold text-atlantis-cyan">
                  {Math.round((stats.upServices / stats.totalServices) * 100)}%
                </div>
                <div className="text-sm text-atlantis-cyan/80">
                  {stats.upServices}/{stats.totalServices} operational
                </div>
              </div>
            </div>

            {/* Service Details */}
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-muted-foreground mb-3">Service Details</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
                {team.services.map((service) => (
                  <div
                    key={`${service.name}-${service.port}`}
                    className={cn(
                      "flex items-center justify-between p-2 rounded border text-xs",
                      service.status === 'up' && "bg-status-up/10 border-status-up/30 text-status-up",
                      service.status === 'down' && "bg-status-down/10 border-status-down/30 text-status-down",
                      service.status === 'unknown' && "bg-status-unknown/10 border-status-unknown/30 text-status-unknown"
                    )}
                  >
                    <span className="font-medium">{service.name}</span>
                    <span className="font-mono">
                      {service.status === 'up' ? '+' : service.status === 'down' ? '-' : '?'}{service.points}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};