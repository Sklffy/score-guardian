import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Download, Clock } from "lucide-react";

interface Inject {
  id: string;
  posted: string;
  title: string;
  due: string;
  status: 'pending' | 'submitted' | 'graded' | 'overdue';
}

interface InjectsTableProps {
  injects: Inject[];
}

export const InjectsTable = ({ injects }: InjectsTableProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted':
        return 'bg-status-up/20 text-status-up border-status-up/30';
      case 'overdue':
        return 'bg-status-down/20 text-status-down border-status-down/30';
      case 'graded':
        return 'bg-atlantis-cyan/20 text-atlantis-cyan border-atlantis-cyan/30';
      default:
        return 'bg-status-unknown/20 text-status-unknown border-status-unknown/30';
    }
  };

  return (
    <div className="bg-atlantis-card border border-atlantis-border rounded-lg p-6">
      <h3 className="text-lg font-semibold text-atlantis-cyan mb-4">Injects</h3>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-atlantis-border">
              <th className="text-left py-3 px-4 text-atlantis-cyan font-semibold">Posted</th>
              <th className="text-left py-3 px-4 text-atlantis-cyan font-semibold">Inject Title</th>
              <th className="text-left py-3 px-4 text-atlantis-cyan font-semibold">Due</th>
              <th className="text-left py-3 px-4 text-atlantis-cyan font-semibold">Status</th>
              <th className="text-left py-3 px-4 text-atlantis-cyan font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {injects.map((inject) => (
              <tr key={inject.id} className="border-b border-atlantis-border/30 hover:bg-atlantis-border/10">
                <td className="py-3 px-4 text-sm text-muted-foreground font-mono">
                  {inject.posted}
                </td>
                <td className="py-3 px-4 text-sm text-foreground">
                  {inject.title}
                </td>
                <td className="py-3 px-4 text-sm text-muted-foreground font-mono">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {inject.due}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <Badge className={`text-xs ${getStatusColor(inject.status)}`}>
                    {inject.status.toUpperCase()}
                  </Badge>
                </td>
                <td className="py-3 px-4">
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="text-xs">
                      <Eye className="w-3 h-3 mr-1" />
                      View
                    </Button>
                    <Button size="sm" variant="outline" className="text-xs">
                      <Download className="w-3 h-3 mr-1" />
                      Download
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {injects.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No injects posted yet
        </div>
      )}
    </div>
  );
};