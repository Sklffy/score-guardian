import { useScoreData } from "@/hooks/useScoreData";
import { Navigation } from "@/components/Navigation";
import { ScoreboardHeader } from "@/components/ScoreboardHeader";
import { AtlantisTeamList } from "@/components/AtlantisTeamList";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

const Index = () => {
  const { scoreData, isLoading, error, lastUpdate, refetch } = useScoreData(60000);

  return (
    <div className="min-h-screen bg-gradient-bg">
      <Navigation />
      <ScoreboardHeader 
        scoreData={scoreData}
        isLoading={isLoading}
        lastUpdate={lastUpdate}
      />
      
      <main className="max-w-7xl mx-auto px-6 pb-12">
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
          <AtlantisTeamList teams={scoreData.teams} />
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
          <div className="max-w-2xl mx-auto space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-atlantis-card border border-atlantis-border rounded-lg p-4 h-20">
                  <div className="h-4 bg-muted rounded mb-2"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      
      {/* Footer */}
      <footer className="border-t border-atlantis-border py-6">
        <div className="max-w-7xl mx-auto px-6 text-center text-muted-foreground">
          <p className="text-sm">© 2025 ATLANTIS Cyber Defense Platform. All rights reserved.</p>
          <p className="text-xs mt-1">
            Updates every minute • Place scores.json in public folder for live data
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
