import { Team } from "@/types/scoring";
import { cn } from "@/lib/utils";

interface AtlantisTeamListProps {
  teams: Team[];
}

export const AtlantisTeamList = ({ teams }: AtlantisTeamListProps) => {
  const getTeamStatus = (team: Team) => {
    const upServices = team.services.filter(s => s.status === 'up').length;
    const totalServices = team.services.length;
    return `${upServices}/${totalServices} UP`;
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {teams.map((team) => (
        <div
          key={team.id}
          className={cn(
            "bg-atlantis-card border border-atlantis-border rounded-lg p-4",
            "transition-all duration-300 hover:border-atlantis-cyan/50",
            "hover:shadow-glow-cyan animate-fade-in"
          )}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-foreground">{team.name}</h3>
              <p className="text-sm text-muted-foreground font-mono">{team.ip}</p>
            </div>
            <div className="text-right">
              <div className="text-atlantis-cyan font-bold">#{team.rank}</div>
              <div className="text-xs text-muted-foreground">
                Status: <span className="text-atlantis-cyan">{getTeamStatus(team)}</span>
              </div>
            </div>
          </div>
          
          {/* Score bar */}
          <div className="mt-3">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Score</span>
              <span className="text-atlantis-cyan font-mono">{team.totalScore.toLocaleString()}</span>
            </div>
            <div className="w-full bg-muted rounded-full h-1">
              <div 
                className="h-1 rounded-full bg-gradient-to-r from-atlantis-cyan to-atlantis-teal transition-all duration-1000"
                style={{ 
                  width: `${Math.min((team.totalScore / (teams[0]?.totalScore || 1)) * 100, 100)}%` 
                }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};