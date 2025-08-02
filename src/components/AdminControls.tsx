import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const AdminControls = () => {
  const [teamName, setTeamName] = useState('');
  const [teamIP, setTeamIP] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const { toast } = useToast();

  const addTeam = async () => {
    if (!teamName || !teamIP) {
      toast({
        title: "Error",
        description: "Please enter both team name and IP address",
        variant: "destructive",
      });
      return;
    }

    setIsAdding(true);
    try {
      const { error } = await supabase
        .from('teams')
        .insert({ name: teamName, ip: teamIP });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Team added successfully",
      });
      
      setTeamName('');
      setTeamIP('');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsAdding(false);
    }
  };

  const runServiceChecks = async () => {
    setIsChecking(true);
    try {
      const { data, error } = await supabase.functions.invoke('check-services');
      
      if (error) throw error;

      toast({
        title: "Service Checks Complete",
        description: `Completed ${data.checks_completed} checks`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add Team</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="teamName">Team Name</Label>
            <Input
              id="teamName"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="e.g., Red Team"
            />
          </div>
          <div>
            <Label htmlFor="teamIP">Team IP Address</Label>
            <Input
              id="teamIP"
              value={teamIP}
              onChange={(e) => setTeamIP(e.target.value)}
              placeholder="e.g., 192.168.1.10"
            />
          </div>
          <Button onClick={addTeam} disabled={isAdding}>
            {isAdding ? 'Adding...' : 'Add Team'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Service Monitoring</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={runServiceChecks} disabled={isChecking}>
            {isChecking ? 'Checking Services...' : 'Run Service Checks'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};