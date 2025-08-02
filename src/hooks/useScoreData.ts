import { useState, useEffect, useCallback } from 'react';
import { ScoreData } from '@/types/scoring';
import { useToast } from '@/hooks/use-toast';

export const useScoreData = (refreshInterval = 30000) => {
  const [scoreData, setScoreData] = useState<ScoreData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const { toast } = useToast();

  const fetchScoreData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // In a real implementation, this would fetch from your Python backend's scores.json
      // For demo purposes, we'll generate mock data
      const response = await fetch('/scores.json').catch(() => {
        // Fallback to mock data if scores.json doesn't exist
        throw new Error('scores.json not found');
      });

      let data: ScoreData;
      
      if (response.ok) {
        data = await response.json();
      } else {
        // Generate mock data for demonstration
        data = generateMockData();
      }

      setScoreData(data);
      setLastUpdate(new Date());
      
    } catch (err) {
      // Generate mock data for demo
      const mockData = generateMockData();
      setScoreData(mockData);
      setLastUpdate(new Date());
      
      console.warn('Using mock data - place your scores.json in the public folder');
      
      if (error === null) { // Only show error once
        setError('Unable to fetch live data - using demo data');
        toast({
          title: "Demo Mode",
          description: "Place your scores.json file in the public folder for live data",
          variant: "default",
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, [error, toast]);

  useEffect(() => {
    fetchScoreData();
    
    const interval = setInterval(fetchScoreData, refreshInterval);
    
    return () => clearInterval(interval);
  }, [fetchScoreData, refreshInterval]);

  return {
    scoreData,
    isLoading,
    error,
    lastUpdate,
    refetch: fetchScoreData
  };
};

// Mock data generator for demonstration
const generateMockData = (): ScoreData => {
  const teams = [
    { name: "Red Team Alpha", ip: "192.168.1.10" },
    { name: "Blue Team Beta", ip: "192.168.1.11" },
    { name: "Green Team Gamma", ip: "192.168.1.12" },
    { name: "Yellow Team Delta", ip: "192.168.1.13" },
  ];

  const services = [
    { name: "SSH", protocol: "tcp", port: 22 },
    { name: "HTTP", protocol: "http", port: 80 },
    { name: "HTTPS", protocol: "https", port: 443 },
    { name: "FTP", protocol: "tcp", port: 21 },
    { name: "DNS", protocol: "udp", port: 53 },
  ];

  const mockTeams = teams.map((team, index) => ({
    id: `team-${index + 1}`,
    name: team.name,
    ip: team.ip,
    services: services.map(service => ({
      ...service,
      status: Math.random() > 0.3 ? 'up' : (Math.random() > 0.5 ? 'down' : 'unknown') as 'up' | 'down' | 'unknown',
      lastChecked: new Date().toISOString(),
      uptime: Math.round(Math.random() * 100),
      points: Math.round(Math.random() * 100) + 50
    })),
    totalScore: 0,
    rank: 0
  }));

  // Calculate scores and ranks
  mockTeams.forEach(team => {
    team.totalScore = team.services.reduce((acc, service) => 
      acc + (service.status === 'up' ? service.points : 0), 0
    );
  });

  mockTeams.sort((a, b) => b.totalScore - a.totalScore);
  mockTeams.forEach((team, index) => {
    team.rank = index + 1;
  });

  return {
    teams: mockTeams,
    lastUpdate: new Date().toISOString(),
    round: Math.floor(Date.now() / 60000) % 100 + 1,
    competition: {
      name: "CyberDefense Championship 2024",
      startTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      duration: 8 * 60 * 60 // 8 hours
    }
  };
};