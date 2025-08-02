import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Navigation = () => {
  const navItems = [
    { name: "Home", active: true },
    { name: "About", active: false },
    { name: "Status", active: false },
    { name: "Injects", active: false },
    { name: "Admin", active: false },
  ];

  return (
    <nav className="flex items-center justify-between p-4 border-b border-atlantis-border bg-atlantis-dark">
      <div className="flex items-center gap-2">
        <Shield className="w-6 h-6 text-atlantis-cyan" />
        <span className="font-bold text-lg text-atlantis-cyan">ATLANTIS</span>
      </div>
      
      <div className="flex items-center gap-6">
        {navItems.map((item) => (
          <Button
            key={item.name}
            variant="ghost"
            className={`text-sm font-medium transition-colors ${
              item.active 
                ? "text-atlantis-cyan border-b-2 border-atlantis-cyan rounded-none" 
                : "text-muted-foreground hover:text-atlantis-cyan"
            }`}
          >
            {item.name}
          </Button>
        ))}
      </div>
    </nav>
  );
};