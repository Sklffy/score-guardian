-- Create teams table
CREATE TABLE public.teams (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  ip INET NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create services table
CREATE TABLE public.services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  protocol TEXT NOT NULL,
  port INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create service_checks table to track individual service status per team
CREATE TABLE public.service_checks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('up', 'down', 'unknown')),
  response_time INTEGER, -- in milliseconds
  points INTEGER NOT NULL DEFAULT 0,
  last_checked TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  uptime_percentage DECIMAL(5,2) DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(team_id, service_id)
);

-- Create competition_settings table
CREATE TABLE public.competition_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL DEFAULT 'CyberDefense Competition',
  start_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  duration_hours INTEGER NOT NULL DEFAULT 8,
  check_interval_seconds INTEGER NOT NULL DEFAULT 60,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security (RLS) - making tables public readable since no user auth needed
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competition_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (no authentication required)
CREATE POLICY "Allow public read access on teams" ON public.teams FOR SELECT USING (true);
CREATE POLICY "Allow public insert on teams" ON public.teams FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on teams" ON public.teams FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on teams" ON public.teams FOR DELETE USING (true);

CREATE POLICY "Allow public read access on services" ON public.services FOR SELECT USING (true);
CREATE POLICY "Allow public insert on services" ON public.services FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on services" ON public.services FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on services" ON public.services FOR DELETE USING (true);

CREATE POLICY "Allow public read access on service_checks" ON public.service_checks FOR SELECT USING (true);
CREATE POLICY "Allow public insert on service_checks" ON public.service_checks FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on service_checks" ON public.service_checks FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on service_checks" ON public.service_checks FOR DELETE USING (true);

CREATE POLICY "Allow public read access on competition_settings" ON public.competition_settings FOR SELECT USING (true);
CREATE POLICY "Allow public insert on competition_settings" ON public.competition_settings FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on competition_settings" ON public.competition_settings FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on competition_settings" ON public.competition_settings FOR DELETE USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_teams_updated_at
  BEFORE UPDATE ON public.teams
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default services
INSERT INTO public.services (name, protocol, port) VALUES
  ('SSH', 'tcp', 22),
  ('HTTP', 'http', 80),
  ('HTTPS', 'https', 443),
  ('FTP', 'tcp', 21),
  ('DNS', 'udp', 53),
  ('SMTP', 'tcp', 25),
  ('MySQL', 'tcp', 3306),
  ('PostgreSQL', 'tcp', 5432);

-- Insert default competition settings
INSERT INTO public.competition_settings (name, start_time, duration_hours, check_interval_seconds) 
VALUES ('CyberDefense Championship 2024', now(), 8, 60);