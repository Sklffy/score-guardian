import { useScoreData } from "@/hooks/useScoreData";
import { ScoreboardHeader } from "@/components/ScoreboardHeader";
import { TeamCard } from "@/components/TeamCard";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

const Index = () => {
  const { scoreData, isLoading, error, lastUpdate, refetch } = useScoreData(30000);

  return (
    <div className="min-h-screen bg-gradient-bg">
      <ScoreboardHeader 
        scoreData={scoreData}
        isLoading={isLoading}
        lastUpdate={lastUpdate}
      />
      
      <main className="max-w-7xl mx-auto p-6">
        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-center">
            <p className="text-destructive mb-2">{error}</p>
            <Button 
              onClick={refetch} 
              variant="outline" 
              size="sm"
              className="gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Retry
            </Button>
          </div>
        )}

        {scoreData?.teams && scoreData.teams.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {scoreData.teams.map((team, index) => (
              <div 
                key={team.id} 
                className="animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <TeamCard team={team} />
              </div>
            ))}
          </div>
        ) : !isLoading ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold mb-4">No Teams Found</h2>
            <p className="text-muted-foreground mb-6">
              Waiting for competition data...
            </p>
            <Button onClick={refetch} className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Refresh Data
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-card border border-border rounded-lg p-6 h-96">
                  <div className="h-6 bg-muted rounded mb-4"></div>
                  <div className="space-y-3">
                    {[1, 2, 3, 4].map((j) => (
                      <div key={j} className="h-16 bg-muted rounded"></div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      
      {/* Footer */}
      <footer className="border-t border-border mt-12 py-6">
        <div className="max-w-7xl mx-auto px-6 text-center text-muted-foreground">
          <p>Cyber Defense Competition Scoring Engine</p>
          <p className="text-sm mt-1">
            Updates every 30 seconds • Place scores.json in public folder for live data
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
