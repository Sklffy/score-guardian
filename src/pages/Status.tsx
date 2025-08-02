import { useScoreData } from "@/hooks/useScoreData";
import { Navigation } from "@/components/Navigation";
import { UptimeChart } from "@/components/UptimeChart";
import { InjectsTable } from "@/components/InjectsTable";
import { Shield, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

const Status = () => {
  const { scoreData, isLoading } = useScoreData(60000);

  // Generate mock chart data
  const generateChartData = () => {
    const times = ['10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00'];
    return times.map((time, i) => ({
      time,
      redTeam: 60 + Math.random() * 40 + i * 5,
      blueTeam: 50 + Math.random() * 50 + i * 7,
    }));
  };

  const mockInjects = [
    {
      id: '1',
      posted: '09:15:00',
      title: 'System Hardening Assessment',
      due: '11:00:00',
      status: 'submitted' as const
    },
    {
      id: '2', 
      posted: '10:30:00',
      title: 'Network Security Audit',
      due: '13:00:00',
      status: 'pending' as const
    },
    {
      id: '3',
      posted: '11:45:00',
      title: 'Incident Response Plan',
      due: '14:30:00',
      status: 'overdue' as const
    }
  ];

  const chartData = generateChartData();

  return (
    <div className="min-h-screen bg-gradient-bg">
      <Navigation />
      
      {/* Header */}
      <div className="text-center py-12">
        <div className="flex flex-col items-center gap-4 mb-8">
          <div className="relative">
            <Shield className="w-16 h-16 text-atlantis-cyan animate-pulse-glow" />
            <div className="absolute inset-0 w-16 h-16 border-2 border-atlantis-cyan rounded-lg animate-pulse opacity-30"></div>
          </div>
          <h1 className="text-4xl font-bold">
            <span className="text-atlantis-cyan">ATLANTIS</span>{" "}
            <span className="text-foreground">SCOREBOARD</span>
          </h1>
        </div>

        {/* Status Section */}
        <div className="max-w-6xl mx-auto px-6 mb-12">
          <h2 className="text-xl font-semibold text-atlantis-cyan mb-6">Status</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {scoreData?.teams.map((team) => {
              const upServices = team.services.filter(s => s.status === 'up').length;
              const downServices = team.services.filter(s => s.status === 'down').length;
              const unknownServices = team.services.filter(s => s.status === 'unknown').length;
              
              return (
                <div 
                  key={team.id}
                  className="bg-atlantis-card border border-atlantis-border rounded-lg p-6"
                >
                  <h3 className="text-lg font-semibold text-foreground mb-4">{team.name}</h3>
                  
                  <div className="space-y-3">
                    {team.services.map((service) => (
                      <div 
                        key={`${service.name}-${service.port}`}
                        className="flex justify-between items-center"
                      >
                        <span className="text-sm text-muted-foreground">{service.name}</span>
                        <span className={cn(
                          "text-sm font-semibold px-2 py-1 rounded text-xs",
                          service.status === 'up' && "text-status-up",
                          service.status === 'down' && "text-status-down", 
                          service.status === 'unknown' && "text-status-unknown"
                        )}>
                          {service.status.toUpperCase()}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Team Stats */}
                  <div className="mt-4 pt-4 border-t border-atlantis-border">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-status-up font-bold text-lg">{upServices}</div>
                        <div className="text-xs text-muted-foreground">UP</div>
                      </div>
                      <div>
                        <div className="text-status-down font-bold text-lg">{downServices}</div>
                        <div className="text-xs text-muted-foreground">DOWN</div>
                      </div>
                      <div>
                        <div className="text-status-unknown font-bold text-lg">{unknownServices}</div>
                        <div className="text-xs text-muted-foreground">UNKNOWN</div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Uptime Section */}
        <div className="max-w-6xl mx-auto px-6 mb-12">
          <h2 className="text-xl font-semibold text-atlantis-cyan mb-6">Uptime</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <UptimeChart data={chartData} title="Score Trends" />
            
            {/* Uptime Table */}
            <div className="bg-atlantis-card border border-atlantis-border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-atlantis-cyan mb-4">Service Uptime</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-atlantis-border">
                      <th className="text-left py-2 text-atlantis-cyan">Team</th>
                      <th className="text-center py-2 text-atlantis-cyan">DNS</th>
                      <th className="text-center py-2 text-atlantis-cyan">FTP</th>
                      <th className="text-center py-2 text-atlantis-cyan">SSH</th>
                      <th className="text-center py-2 text-atlantis-cyan">HTTP</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scoreData?.teams.map((team) => (
                      <tr key={team.id} className="border-b border-atlantis-border/30">
                        <td className="py-2 text-foreground">{team.name}</td>
                        {['DNS', 'FTP', 'SSH', 'HTTP'].map((serviceName) => {
                          const service = team.services.find(s => s.name === serviceName);
                          return (
                            <td key={serviceName} className="text-center py-2">
                              <span className={cn(
                                "text-xs font-mono",
                                service?.status === 'up' && "text-status-up",
                                service?.status === 'down' && "text-status-down",
                                service?.status === 'unknown' && "text-status-unknown"
                              )}>
                                {service?.uptime || 0}%
                              </span>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Injects Section */}
        <div className="max-w-6xl mx-auto px-6 mb-12">
          <InjectsTable injects={mockInjects} />
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-atlantis-border py-6">
        <div className="max-w-7xl mx-auto px-6 text-center text-muted-foreground">
          <p className="text-sm">© 2025 ATLANTIS Cyber Defense Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Status;