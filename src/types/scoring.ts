export interface Service {
  name: string;
  protocol: string;
  port: number;
  status: 'up' | 'down' | 'unknown';
  lastChecked: string;
  uptime: number;
  points: number;
}

export interface Team {
  id: string;
  name: string;
  ip: string;
  services: Service[];
  totalScore: number;
  rank: number;
}

export interface ScoreData {
  teams: Team[];
  lastUpdate: string;
  round: number;
  competition: {
    name: string;
    startTime: string;
    duration: number;
  };
}