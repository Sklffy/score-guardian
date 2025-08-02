import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Github, Mail, Shield } from "lucide-react";
import { Link } from "react-router-dom";

const About = () => {
  const technologies = [
    "HTML",
    "CSS", 
    "JavaScript",
    "TypeScript",
    "React"
  ];

  return (
    <div className="min-h-screen bg-gradient-bg">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-4 border-b border-atlantis-border bg-atlantis-dark">
        <Link to="/" className="flex items-center gap-2">
          <Shield className="w-6 h-6 text-atlantis-cyan" />
          <span className="font-bold text-lg text-atlantis-cyan">ATLANTIS</span>
        </Link>
        
        <div className="flex items-center gap-6">
          <Link to="/">
            <Button variant="ghost" className="text-sm font-medium text-muted-foreground hover:text-atlantis-cyan">
              Home
            </Button>
          </Link>
          <Button variant="ghost" className="text-sm font-medium text-atlantis-cyan border-b-2 border-atlantis-cyan rounded-none">
            About
          </Button>
          <Button variant="ghost" className="text-sm font-medium text-muted-foreground hover:text-atlantis-cyan">
            Status
          </Button>
          <Button variant="ghost" className="text-sm font-medium text-muted-foreground hover:text-atlantis-cyan">
            Injects
          </Button>
          <Button variant="ghost" className="text-sm font-medium text-muted-foreground hover:text-atlantis-cyan">
            Admin
          </Button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-6 py-12">
        {/* Logo */}
        <div className="mb-8">
          <img 
            src="/lovable-uploads/511af799-ea03-4d33-9c1a-452f1ba87c1c.png" 
            alt="ATLANTIS Logo" 
            className="w-24 h-24 animate-pulse-glow"
          />
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold mb-12 text-center">
          About <span className="text-atlantis-cyan">ATLANTIS</span>
        </h1>

        {/* Content Card */}
        <div className="max-w-4xl mx-auto bg-atlantis-card border border-atlantis-border rounded-lg p-8 shadow-glow-subtle">
          <div className="space-y-6 text-foreground">
            <p className="text-lg">
              <span className="text-atlantis-cyan font-semibold">ATLANTIS Scoreboard</span> was developed by{" "}
              <span className="text-atlantis-cyan font-semibold">Jonathan Geisler</span>, with key contributions from{" "}
              <span className="text-atlantis-cyan font-semibold">Christopher Kaldas</span>. It is a fully custom-built Blue Team platform crafted for live cybersecurity competitions and CTF-style events.
            </p>

            <p>
              Born from a passion for cybersecurity and design, ATLANTIS blends powerful service scoring with a futuristic, intuitive interface that mirrors the precision and innovation of cyber defense teams.
            </p>

            <p>
              The platform delivers real-time service monitoring, uptime tracking, and inject management engineered for speed, clarity, and reliability to support both competitors and judges alike.
            </p>

            <p>
              Inspired by platforms like the{" "}
              <span className="text-atlantis-cyan font-semibold underline">DWAYNE-INATOR-5000</span>{" "}
              ATLANTIS is built using modern web technologies including:
            </p>

            {/* Technology Badges */}
            <div className="flex flex-wrap gap-3 justify-center py-4">
              {technologies.map((tech) => (
                <Badge 
                  key={tech}
                  variant="outline" 
                  className="px-4 py-2 border-atlantis-border text-atlantis-cyan hover:bg-atlantis-cyan hover:text-atlantis-dark transition-all duration-300"
                >
                  {tech}
                </Badge>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center pt-6">
              <Button 
                className="bg-atlantis-cyan text-atlantis-dark hover:bg-atlantis-teal transition-colors duration-300 shadow-glow-cyan"
                onClick={() => window.open('https://github.com', '_blank')}
              >
                <Github className="w-4 h-4 mr-2" />
                View GitHub
              </Button>
              
              <Button 
                variant="outline"
                className="border-atlantis-cyan text-atlantis-cyan hover:bg-atlantis-cyan hover:text-atlantis-dark transition-all duration-300"
                onClick={() => window.location.href = 'mailto:contact@atlantis.dev'}
              >
                <Mail className="w-4 h-4 mr-2" />
                Contact Me
              </Button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-muted-foreground text-sm">
          <p>© 2025 ATLANTIS Cyber Defense Platform. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default About;