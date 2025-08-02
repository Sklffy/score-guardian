import { useState, useEffect } from "react";
import { Team } from "@/types/scoring";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Minus, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AdminTeamManagementProps {
  teams: Team[];
  onTeamsUpdate: (teams: Team[]) => void;
}

export const AdminTeamManagement = ({ teams, onTeamsUpdate }: AdminTeamManagementProps) => {
  const [pointInputs, setPointInputs] = useState<{[key: string]: string}>({});
  const { toast } = useToast();

  useEffect(() => {
    // Initialize point inputs
    const inputs: {[key: string]: string} = {};
    teams.forEach(team => {
      inputs[team.id] = "";
    });
    setPointInputs(inputs);
  }, [teams]);

  const handlePointChange = (teamId: string, value: string) => {
    setPointInputs(prev => ({
      ...prev,
      [teamId]: value
    }));
  };

  const addPoints = (teamId: string) => {
    const points = parseInt(pointInputs[teamId]);
    if (isNaN(points) || points === 0) {
      toast({
        title: "Invalid Input",
        description: "Please enter a valid number of points",
        variant: "destructive",
      });
      return;
    }

    const updatedTeams = teams.map(team => {
      if (team.id === teamId) {
        const newScore = Math.max(0, team.totalScore + points);
        return { ...team, totalScore: newScore };
      }
      return team;
    });

    // Recalculate rankings
    updatedTeams.sort((a, b) => b.totalScore - a.totalScore);
    updatedTeams.forEach((team, index) => {
      team.rank = index + 1;
    });

    onTeamsUpdate(updatedTeams);
    
    const teamName = teams.find(t => t.id === teamId)?.name;
    toast({
      title: "Points Updated",
      description: `${points > 0 ? 'Added' : 'Removed'} ${Math.abs(points)} points ${points > 0 ? 'to' : 'from'} ${teamName}`,
    });

    // Clear input
    setPointInputs(prev => ({
      ...prev,
      [teamId]: ""
    }));
  };

  const subtractPoints = (teamId: string) => {
    const points = parseInt(pointInputs[teamId]);
    if (isNaN(points) || points === 0) {
      toast({
        title: "Invalid Input",
        description: "Please enter a valid number of points",
        variant: "destructive",
      });
      return;
    }

    const updatedTeams = teams.map(team => {
      if (team.id === teamId) {
        const newScore = Math.max(0, team.totalScore - points);
        return { ...team, totalScore: newScore };
      }
      return team;
    });

    // Recalculate rankings
    updatedTeams.sort((a, b) => b.totalScore - a.totalScore);
    updatedTeams.forEach((team, index) => {
      team.rank = index + 1;
    });

    onTeamsUpdate(updatedTeams);
    
    const teamName = teams.find(t => t.id === teamId)?.name;
    toast({
      title: "Points Updated",
      description: `Removed ${points} points from ${teamName}`,
    });

    // Clear input
    setPointInputs(prev => ({
      ...prev,
      [teamId]: ""
    }));
  };

  const resetTeamScore = (teamId: string) => {
    const updatedTeams = teams.map(team => {
      if (team.id === teamId) {
        return { ...team, totalScore: 0 };
      }
      return team;
    });

    // Recalculate rankings
    updatedTeams.sort((a, b) => b.totalScore - a.totalScore);
    updatedTeams.forEach((team, index) => {
      team.rank = index + 1;
    });

    onTeamsUpdate(updatedTeams);
    
    const teamName = teams.find(t => t.id === teamId)?.name;
    toast({
      title: "Score Reset",
      description: `${teamName} score reset to 0`,
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-atlantis-cyan">Team Score Management</h2>
      
      <div className="grid gap-4">
        {teams.map((team) => (
          <Card key={team.id} className="bg-atlantis-card border-atlantis-border">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-atlantis-cyan text-atlantis-dark flex items-center justify-center font-bold">
                    #{team.rank}
                  </div>
                  <span className="text-foreground">{team.name}</span>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-atlantis-cyan">
                    {team.totalScore.toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground">points</div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Input
                  type="number"
                  placeholder="Enter points"
                  value={pointInputs[team.id] || ""}
                  onChange={(e) => handlePointChange(team.id, e.target.value)}
                  className="bg-atlantis-dark border-atlantis-border text-foreground"
                />
                <Button
                  onClick={() => addPoints(team.id)}
                  className="bg-status-up text-white hover:bg-status-up/80"
                  size="sm"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add
                </Button>
                <Button
                  onClick={() => subtractPoints(team.id)}
                  className="bg-status-down text-white hover:bg-status-down/80"
                  size="sm"
                >
                  <Minus className="w-4 h-4 mr-1" />
                  Remove
                </Button>
                <Button
                  onClick={() => resetTeamScore(team.id)}
                  variant="outline"
                  size="sm"
                  className="border-atlantis-border text-muted-foreground hover:text-foreground"
                >
                  <RotateCcw className="w-4 h-4 mr-1" />
                  Reset
                </Button>
              </div>
              
              {/* Team Services Summary */}
              <div className="mt-4 pt-4 border-t border-atlantis-border">
                <div className="text-sm text-muted-foreground mb-2">Service Status:</div>
                <div className="flex gap-2 flex-wrap">
                  {team.services.map((service) => (
                    <div
                      key={`${service.name}-${service.port}`}
                      className={`px-2 py-1 rounded text-xs ${
                        service.status === 'up' ? 'bg-status-up/20 text-status-up' :
                        service.status === 'down' ? 'bg-status-down/20 text-status-down' :
                        'bg-status-unknown/20 text-status-unknown'
                      }`}
                    >
                      {service.name}: {service.status.toUpperCase()}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};