import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useScoreData } from "@/hooks/useScoreData";
import { AdminTeamManagement } from "@/components/AdminTeamManagement";
import { Shield, Lock, User, Key, Settings, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Team } from "@/types/scoring";

const Admin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [adminTeams, setAdminTeams] = useState<Team[]>([]);
  const { isAdmin, login, logout } = useAuth();
  const { scoreData } = useScoreData(60000);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Update admin teams when score data changes
  useEffect(() => {
    if (scoreData?.teams) {
      setAdminTeams(scoreData.teams);
    }
  }, [scoreData]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const success = login(username, password);
    
    if (success) {
      toast({
        title: "Login Successful",
        description: "Welcome to the admin panel",
      });
    } else {
      toast({
        title: "Login Failed", 
        description: "Invalid username or password",
        variant: "destructive",
      });
    }
    
    setIsLoading(false);
  };

  const handleLogout = () => {
    logout();
    setUsername("");
    setPassword("");
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
    });
  };

  const handleTeamsUpdate = (updatedTeams: Team[]) => {
    setAdminTeams(updatedTeams);
    // In a real implementation, this would update the backend
    console.log("Teams updated:", updatedTeams);
  };

  if (isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-bg">
        <div className="max-w-7xl mx-auto p-6">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <img src="/lovable-uploads/a3135964-1858-405a-b4a7-d22f85a9ab28.png" alt="ATLANTIS Admin" className="w-16 h-16" />
            </div>
            <h1 className="text-4xl font-bold">
              <span className="text-atlantis-cyan">Admin</span>{" "}
              <span className="text-foreground">Panel</span>
            </h1>
            <p className="text-muted-foreground mt-2">Competition Management Dashboard</p>
          </div>

          {/* Admin Tabs */}
          <Tabs defaultValue="teams" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-atlantis-card border border-atlantis-border">
              <TabsTrigger value="teams" className="data-[state=active]:bg-atlantis-cyan data-[state=active]:text-atlantis-dark">
                <Trophy className="w-4 h-4 mr-2" />
                Team Management
              </TabsTrigger>
              <TabsTrigger value="competition" className="data-[state=active]:bg-atlantis-cyan data-[state=active]:text-atlantis-dark">
                <Settings className="w-4 h-4 mr-2" />
                Competition Settings
              </TabsTrigger>
              <TabsTrigger value="overview" className="data-[state=active]:bg-atlantis-cyan data-[state=active]:text-atlantis-dark">
                <img src="/lovable-uploads/a3135964-1858-405a-b4a7-d22f85a9ab28.png" alt="Overview" className="w-4 h-4 mr-2" />
                Overview
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="teams" className="mt-6">
              {adminTeams.length > 0 ? (
                <AdminTeamManagement 
                  teams={adminTeams} 
                  onTeamsUpdate={handleTeamsUpdate}
                />
              ) : (
                <Card className="bg-atlantis-card border-atlantis-border p-8 text-center">
                  <p className="text-muted-foreground">Loading team data...</p>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="competition" className="mt-6">
              <Card className="bg-atlantis-card border-atlantis-border">
                <CardHeader>
                  <CardTitle className="text-atlantis-cyan">Competition Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-muted-foreground">
                    <p>• Service check interval: 60 seconds</p>
                    <p>• Competition duration: 8 hours</p>
                    <p>• Auto-scoring: Enabled</p>
                    <p>• Real-time updates: Active</p>
                  </div>
                  <div className="pt-4">
                    <p className="text-sm text-muted-foreground">
                      Competition settings can be modified through the backend configuration.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="overview" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-atlantis-card border-atlantis-border">
                  <CardHeader>
                    <CardTitle className="text-atlantis-cyan">Teams</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-foreground">{adminTeams.length}</div>
                    <p className="text-muted-foreground">Active teams</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-atlantis-card border-atlantis-border">
                  <CardHeader>
                    <CardTitle className="text-atlantis-cyan">Services</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-foreground">
                      {adminTeams.reduce((acc, team) => acc + team.services.length, 0)}
                    </div>
                    <p className="text-muted-foreground">Total services monitored</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-atlantis-card border-atlantis-border">
                  <CardHeader>
                    <CardTitle className="text-atlantis-cyan">Uptime</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-foreground">
                      {adminTeams.length > 0 ? Math.round(
                        adminTeams.reduce((acc, team) => 
                          acc + team.services.filter(s => s.status === 'up').length, 0
                        ) / adminTeams.reduce((acc, team) => acc + team.services.length, 0) * 100
                      ) : 0}%
                    </div>
                    <p className="text-muted-foreground">Average uptime</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          {/* Footer Actions */}
          <div className="flex justify-center gap-4 mt-8">
            <Button 
              onClick={() => navigate("/")}
              className="bg-atlantis-cyan text-atlantis-dark hover:bg-atlantis-teal"
            >
              View Scoreboard
            </Button>
            <Button 
              onClick={() => navigate("/status")}
              variant="outline"
              className="border-atlantis-cyan text-atlantis-cyan hover:bg-atlantis-cyan hover:text-atlantis-dark"
            >
              View Status
            </Button>
            <Button 
              onClick={handleLogout}
              variant="outline"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-bg">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-4 border-b border-atlantis-border bg-atlantis-dark">
        <Button 
          onClick={() => navigate("/")}
          variant="ghost"
          className="flex items-center gap-2"
        >
          <img src="/lovable-uploads/a3135964-1858-405a-b4a7-d22f85a9ab28.png" alt="ATLANTIS Logo" className="w-6 h-6" />
          <span className="font-bold text-lg text-atlantis-cyan">ATLANTIS</span>
        </Button>
        
        <div className="flex items-center gap-6">
          <Button 
            onClick={() => navigate("/")}
            variant="ghost" 
            className="text-sm font-medium text-muted-foreground hover:text-atlantis-cyan"
          >
            Home
          </Button>
          <Button 
            onClick={() => navigate("/about")}
            variant="ghost" 
            className="text-sm font-medium text-muted-foreground hover:text-atlantis-cyan"
          >
            About
          </Button>
          <Button 
            onClick={() => navigate("/status")}
            variant="ghost" 
            className="text-sm font-medium text-muted-foreground hover:text-atlantis-cyan"
          >
            Status
          </Button>
          <Button 
            onClick={() => navigate("/injects")}
            variant="ghost" 
            className="text-sm font-medium text-muted-foreground hover:text-atlantis-cyan"
          >
            Injects
          </Button>
          <Button 
            variant="ghost" 
            className="text-sm font-medium text-atlantis-cyan border-b-2 border-atlantis-cyan rounded-none"
          >
            Admin
          </Button>
        </div>
      </nav>

      {/* Login Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
      <Card className="w-full max-w-md bg-atlantis-card border-atlantis-border">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Lock className="w-16 h-16 text-atlantis-cyan" />
          </div>
          <CardTitle className="text-2xl">
            <span className="text-atlantis-cyan">Admin</span>{" "}
            <span className="text-foreground">Login</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10 bg-atlantis-dark border-atlantis-border text-foreground placeholder:text-muted-foreground"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="relative">
                <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 bg-atlantis-dark border-atlantis-border text-foreground placeholder:text-muted-foreground"
                  required
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-atlantis-cyan text-atlantis-dark hover:bg-atlantis-teal font-semibold"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
          
          <div className="mt-6 text-center text-xs text-muted-foreground">
            <p>Demo credentials:</p>
            <p>Username: admin | Password: root</p>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
};

export default Admin;