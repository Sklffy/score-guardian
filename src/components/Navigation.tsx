import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";

export const Navigation = () => {
  const location = useLocation();
  
  const navItems = [
    { name: "Home", path: "/", active: location.pathname === "/" },
    { name: "About", path: "/about", active: location.pathname === "/about" },
    { name: "Status", path: "/status", active: location.pathname === "/status" },
    { name: "Injects", path: "/injects", active: false },
    { name: "Admin", path: "/admin", active: false },
  ];

  return (
    <nav className="flex items-center justify-between p-4 border-b border-atlantis-border bg-atlantis-dark">
      <Link to="/" className="flex items-center gap-2">
        <Shield className="w-6 h-6 text-atlantis-cyan" />
        <span className="font-bold text-lg text-atlantis-cyan">ATLANTIS</span>
      </Link>
      
      <div className="flex items-center gap-6">
        {navItems.map((item) => (
          item.path ? (
            <Link key={item.name} to={item.path}>
              <Button
                variant="ghost"
                className={`text-sm font-medium transition-colors ${
                  item.active 
                    ? "text-atlantis-cyan border-b-2 border-atlantis-cyan rounded-none" 
                    : "text-muted-foreground hover:text-atlantis-cyan"
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