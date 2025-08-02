import { Navigation } from "@/components/Navigation";
import { Shield, Upload, FileText, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

const Injects = () => {
  const [uploadedFiles, setUploadedFiles] = useState<{[key: string]: File | null}>({});

  const mockInjects = [
    {
      id: '1',
      posted: '2025-05-21T13:00:04:00',
      title: 'Patch OpenSSL Vulnerability',
      due: '2025-05-21T14:30:04:00',
      status: 'open' as const
    },
    {
      id: '2', 
      posted: '2025-05-21T14:34:04:00',
      title: 'Submit Incident Report',
      due: '2025-05-21T15:00:04:00',
      status: 'open' as const
    },
    {
      id: '3',
      posted: '2025-05-21T14:36:04:00',
      title: 'Management Request',
      due: '2025-05-21T16:00:04:00',
      status: 'open' as const
    },
    {
      id: '4',
      posted: '2025-05-21T15:10:04:00',
      title: 'VPN Lockdown',
      due: '2025-05-21T17:00:04:00',
      status: 'open' as const
    }
  ];

  const handleFileSelect = (injectId: string, file: File | null) => {
    setUploadedFiles(prev => ({
      ...prev,
      [injectId]: file
    }));
  };

  const handleUpload = (injectId: string) => {
    const file = uploadedFiles[injectId];
    if (file) {
      // In a real implementation, this would upload to your backend
      console.log(`Uploading file for inject ${injectId}:`, file.name);
      alert(`File "${file.name}" uploaded successfully!`);
      // Reset the file after upload
      setUploadedFiles(prev => ({
        ...prev,
        [injectId]: null
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-bg">
      <Navigation />
      
      {/* Header */}
      <div className="text-center py-12">
        <div className="flex flex-col items-center gap-4 mb-8">
          <div className="relative">
            <Shield className="w-16 h-16 text-atlantis-cyan animate-pulse-glow" />
            <div className="absolute inset-0 w-16 h-16 border-2 border-atlantis-cyan rounded-lg animate-pulse opacity-30"></div>
          </div>
          <h1 className="text-4xl font-bold">
            <span className="text-atlantis-cyan">Inject</span>{" "}
            <span className="text-foreground">Feed</span>
          </h1>
        </div>

        {/* Inject Table */}
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-atlantis-card border border-atlantis-border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-atlantis-border bg-atlantis-border/10">
                    <th className="text-left py-4 px-6 text-atlantis-cyan font-semibold">Posted</th>
                    <th className="text-left py-4 px-6 text-atlantis-cyan font-semibold">Title</th>
                    <th className="text-left py-4 px-6 text-atlantis-cyan font-semibold">Due</th>
                    <th className="text-left py-4 px-6 text-atlantis-cyan font-semibold">Status</th>
                    <th className="text-left py-4 px-6 text-atlantis-cyan font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {mockInjects.map((inject) => {
                    const selectedFile = uploadedFiles[inject.id];
                    return (
                      <tr key={inject.id} className="border-b border-atlantis-border/30 hover:bg-atlantis-border/5">
                        <td className="py-4 px-6 text-sm text-muted-foreground font-mono">
                          {inject.posted}
                        </td>
                        <td className="py-4 px-6 text-sm text-foreground font-medium">
                          {inject.title}
                        </td>
                        <td className="py-4 px-6 text-sm text-muted-foreground font-mono">
                          {inject.due}
                        </td>
                        <td className="py-4 px-6">
                          <Badge className="bg-status-up/20 text-status-up border-status-up/30">
                            OPEN
                          </Badge>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            {!selectedFile ? (
                              <div className="relative">
                                <input
                                  type="file"
                                  id={`file-${inject.id}`}
                                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0] || null;
                                    handleFileSelect(inject.id, file);
                                  }}
                                />
                                <Button 
                                  size="sm" 
                                  className="bg-atlantis-cyan text-atlantis-dark hover:bg-atlantis-teal"
                                >
                                  <FileText className="w-3 h-3 mr-1" />
                                  Choose File
                                </Button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground truncate max-w-20">
                                  {selectedFile.name}
                                </span>
                                <Button 
                                  size="sm" 
                                  className="bg-atlantis-cyan text-atlantis-dark hover:bg-atlantis-teal"
                                  onClick={() => handleUpload(inject.id)}
                                >
                                  <Upload className="w-3 h-3 mr-1" />
                                  Upload
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => handleFileSelect(inject.id, null)}
                                  className="text-xs"
                                >
                                  Cancel
                                </Button>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          
          {mockInjects.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>No injects available</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-atlantis-border py-6 mt-12">
        <div className="max-w-7xl mx-auto px-6 text-center text-muted-foreground">
          <p className="text-sm">© 2025 Jonathan Geisler. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Injects;