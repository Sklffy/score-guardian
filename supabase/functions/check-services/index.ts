import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ServiceCheck {
  team_id: string;
  service_id: string;
  status: 'up' | 'down' | 'unknown';
  response_time?: number;
  points: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    console.log('Starting service checks...');

    // Get all teams and services
    const { data: teams, error: teamsError } = await supabaseClient
      .from('teams')
      .select('*');

    const { data: services, error: servicesError } = await supabaseClient
      .from('services')
      .select('*');

    if (teamsError || servicesError) {
      throw new Error(`Database error: ${teamsError?.message || servicesError?.message}`);
    }

    if (!teams || !services) {
      throw new Error('No teams or services found');
    }

    const serviceChecks: ServiceCheck[] = [];

    // Check each service for each team
    for (const team of teams) {
      for (const service of services) {
        console.log(`Checking ${service.name} on ${team.ip}:${service.port}`);
        
        const startTime = Date.now();
        let status: 'up' | 'down' | 'unknown' = 'unknown';
        let responseTime: number | undefined;

        try {
          if (service.protocol === 'http' || service.protocol === 'https') {
            // HTTP/HTTPS check
            const url = `${service.protocol}://${team.ip}:${service.port}`;
            const response = await fetch(url, {
              method: 'GET',
              headers: { 'User-Agent': 'CyberDefense-Monitor/1.0' },
              signal: AbortSignal.timeout(5000) // 5 second timeout
            });
            
            status = response.ok ? 'up' : 'down';
            responseTime = Date.now() - startTime;
          } else {
            // TCP/UDP port check using basic connection test
            try {
              const conn = await Deno.connect({
                hostname: team.ip.toString(),
                port: service.port,
              });
              conn.close();
              status = 'up';
              responseTime = Date.now() - startTime;
            } catch (_error) {
              status = 'down';
              responseTime = Date.now() - startTime;
            }
          }
        } catch (error) {
          console.error(`Error checking ${service.name} on ${team.ip}:`, error);
          status = 'down';
          responseTime = Date.now() - startTime;
        }

        // Calculate points (100 points for up services, 0 for down)
        const points = status === 'up' ? 100 : 0;

        serviceChecks.push({
          team_id: team.id,
          service_id: service.id,
          status,
          response_time: responseTime,
          points
        });

        console.log(`${team.name} - ${service.name}: ${status} (${responseTime}ms)`);
      }
    }

    // Update service_checks table
    for (const check of serviceChecks) {
      const { error } = await supabaseClient
        .from('service_checks')
        .upsert({
          ...check,
          last_checked: new Date().toISOString()
        }, {
          onConflict: 'team_id,service_id'
        });

      if (error) {
        console.error('Error updating service check:', error);
      }
    }

    console.log(`Completed ${serviceChecks.length} service checks`);

    return new Response(
      JSON.stringify({
        success: true,
        checks_completed: serviceChecks.length,
        summary: serviceChecks.reduce((acc, check) => {
          acc[check.status] = (acc[check.status] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in check-services function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});