import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Shield, Lock, User, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const Admin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { isAdmin, login, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

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
      navigate("/");
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

  if (isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-bg flex items-center justify-center">
        <Card className="w-full max-w-md bg-atlantis-card border-atlantis-border">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Shield className="w-16 h-16 text-atlantis-cyan animate-pulse-glow" />
            </div>
            <CardTitle className="text-2xl">
              <span className="text-atlantis-cyan">Admin</span>{" "}
              <span className="text-foreground">Panel</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <p className="text-muted-foreground">You are logged in as administrator</p>
              
              <div className="grid grid-cols-2 gap-4">
                <Button 
                  onClick={() => navigate("/")}
                  className="bg-atlantis-cyan text-atlantis-dark hover:bg-atlantis-teal"
                >
                  Dashboard
                </Button>
                <Button 
                  onClick={() => navigate("/status")}
                  variant="outline"
                  className="border-atlantis-cyan text-atlantis-cyan hover:bg-atlantis-cyan hover:text-atlantis-dark"
                >
                  Status
                </Button>
              </div>
              
              <Button 
                onClick={handleLogout}
                variant="outline"
                className="w-full mt-4"
              >
                Logout
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-bg flex items-center justify-center">
      <Card className="w-full max-w-md bg-atlantis-card border-atlantis-border shadow-glow-subtle">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Lock className="w-16 h-16 text-atlantis-cyan animate-pulse-glow" />
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
  );
};

export default Admin;