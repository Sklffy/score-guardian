import { useState, useEffect, useCallback } from 'react';
import { ScoreData } from '@/types/scoring';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

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
      // Fetch real data from Supabase
      const [teamsResult, servicesResult, serviceChecksResult, competitionResult] = await Promise.all([
        supabase.from('teams').select('*'),
        supabase.from('services').select('*'),
        supabase.from('service_checks').select('*'),
        supabase.from('competition_settings').select('*').single()
      ]);

      if (teamsResult.error || servicesResult.error || serviceChecksResult.error) {
        throw new Error('Database error');
      }

      const teams = teamsResult.data || [];
      const services = servicesResult.data || [];
      const serviceChecks = serviceChecksResult.data || [];
      const competition = competitionResult.data;

      // Transform data to match ScoreData interface
      const transformedTeams = teams.map(team => {
        const teamServices = services.map(service => {
          const check = serviceChecks.find(c => c.team_id === team.id && c.service_id === service.id);
          return {
            name: service.name,
            protocol: service.protocol,
            port: service.port,
            status: (check?.status || 'unknown') as 'up' | 'down' | 'unknown',
            lastChecked: check?.last_checked || new Date().toISOString(),
            uptime: check?.uptime_percentage || 0,
            points: check?.points || 0
          };
        });

        const totalScore = teamServices.reduce((acc, service) => 
          acc + (service.status === 'up' ? service.points : 0), 0
        );

        return {
          id: team.id,
          name: team.name,
          ip: team.ip.toString(),
          services: teamServices,
          totalScore,
          rank: 0 // Will be calculated below
        };
      });

      // Calculate ranks
      transformedTeams.sort((a, b) => b.totalScore - a.totalScore);
      transformedTeams.forEach((team, index) => {
        team.rank = index + 1;
      });

      const data: ScoreData = {
        teams: transformedTeams,
        lastUpdate: new Date().toISOString(),
        round: Math.floor((Date.now() - new Date(competition?.start_time || Date.now()).getTime()) / 60000) + 1,
        competition: {
          name: competition?.name || 'CyberDefense Competition',
          startTime: competition?.start_time || new Date().toISOString(),
          duration: (competition?.duration_hours || 8) * 60 * 60
        }
      };

      setScoreData(data);
      setLastUpdate(new Date());
      
    } catch (err) {
      console.error('Error fetching score data:', err);
      setError('Unable to fetch live data');
      toast({
        title: "Error",
        description: "Unable to fetch live data from database",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

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
    { name: "Red Team", ip: "192.168.1.10" },
    { name: "Blue Team", ip: "192.168.1.11" },
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