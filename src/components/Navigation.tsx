import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";

export const Navigation = () => {
  const location = useLocation();
  
  const navItems = [
    { name: "Home", path: "/", active: location.pathname === "/" },
    { name: "About", path: "/about", active: location.pathname === "/about" },
    { name: "Status", path: "/status", active: location.pathname === "/status" },
    { name: "Injects", path: "/injects", active: location.pathname === "/injects" },
    { name: "Admin", path: "/admin", active: location.pathname === "/admin" },
  ];

  return (
    <nav className="flex items-center justify-between p-4 border-b border-atlantis-border bg-atlantis-dark relative overflow-hidden">
      {/* Subtle background animation */}
      <div className="absolute inset-0 bg-gradient-to-r from-atlantis-cyan/5 to-transparent opacity-50"></div>
      
      <Link to="/" className="flex items-center gap-2 relative z-10 group">
        <Shield className="w-6 h-6 text-atlantis-cyan transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-lg" />
        <span className="font-bold text-lg text-atlantis-cyan transition-all duration-300 group-hover:text-atlantis-teal">
          ATLANTIS
        </span>
      </Link>
      
      <div className="flex items-center gap-6 relative z-10">
        {navItems.map((item) => (
          item.path ? (
            <Link key={item.name} to={item.path}>
              <Button
                variant="ghost"
                className={`text-sm font-medium transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 ${
                  item.active 
                    ? "text-atlantis-cyan border-b-2 border-atlantis-cyan rounded-none shadow-glow-cyan" 
                    : "text-muted-foreground hover:text-atlantis-cyan hover:shadow-glow-subtle"
                }`}
              >
                {item.name}
              </Button>
            </Link>
          ) : (
            <Button
              key={item.name}
              variant="ghost"
              className="text-sm font-medium text-muted-foreground hover:text-atlantis-cyan"
            >
              {item.name}
            </Button>
          )
        ))}
      </div>
    </nav>
  );
};