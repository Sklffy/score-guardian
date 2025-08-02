import { Service } from "@/types/scoring";
import { cn } from "@/lib/utils";
import { Shield, ShieldAlert, ShieldQuestion, Clock } from "lucide-react";

interface ServiceStatusProps {
  service: Service;
}

export const ServiceStatus = ({ service }: ServiceStatusProps) => {
  const getStatusIcon = () => {
    switch (service.status) {
      case 'up':
        return <Shield className="w-4 h-4" />;
      case 'down':
        return <ShieldAlert className="w-4 h-4" />;
      default:
        return <ShieldQuestion className="w-4 h-4" />;
    }
  };

  const getStatusColor = () => {
    switch (service.status) {
      case 'up':
        return 'text-status-up border-status-up bg-status-up/10';
      case 'down':
        return 'text-status-down border-status-down bg-status-down/10';
      default:
        return 'text-status-unknown border-status-unknown bg-status-unknown/10';
    }
  };

  return (
    <div className={cn(
      "flex items-center justify-between p-3 rounded-lg border-2 transition-all duration-300",
      "hover:shadow-lg hover:scale-105",
      getStatusColor(),
      service.status === 'up' && "shadow-glow-green animate-pulse-glow",
      service.status === 'down' && "shadow-glow-red"
    )}>
      <div className="flex items-center gap-2">
        {getStatusIcon()}
        <div>
          <div className="font-semibold text-sm">
            {service.name}
          </div>
          <div className="text-xs opacity-70">
            {service.protocol}:{service.port}
          </div>
        </div>
      </div>
      
      <div className="text-right">
        <div className="font-bold text-lg">
          +{service.points}
        </div>
        <div className="flex items-center gap-1 text-xs opacity-70">
          <Clock className="w-3 h-3" />
          {service.uptime}%
        </div>
      </div>
    </div>
  );
};