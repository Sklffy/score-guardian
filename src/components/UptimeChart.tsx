interface UptimeChartProps {
  data: Array<{
    time: string;
    redTeam: number;
    blueTeam: number;
  }>;
  title: string;
}

export const UptimeChart = ({ data, title }: UptimeChartProps) => {
  const maxValue = Math.max(...data.flatMap(d => [d.redTeam, d.blueTeam]));
  
  return (
    <div className="bg-atlantis-card border border-atlantis-border rounded-lg p-6">
      <h3 className="text-lg font-semibold text-atlantis-cyan mb-4">{title}</h3>
      <div className="h-64 relative">
        {/* Simple SVG Chart */}
        <svg width="100%" height="100%" viewBox="0 0 400 200" className="border border-atlantis-border/30 rounded">
          {/* Grid lines */}
          <defs>
            <pattern id="grid" width="40" height="20" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 20" fill="none" stroke="hsl(var(--atlantis-border))" strokeWidth="0.5" opacity="0.3"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          
          {/* Red Team Line */}
          <polyline
            fill="none"
            stroke="hsl(var(--status-down))"
            strokeWidth="2"
            points={data.map((d, i) => `${(i / (data.length - 1)) * 380 + 10},${190 - (d.redTeam / maxValue) * 170}`).join(' ')}
          />
          
          {/* Blue Team Line */}
          <polyline
            fill="none"
            stroke="hsl(var(--atlantis-cyan))"
            strokeWidth="2"
            points={data.map((d, i) => `${(i / (data.length - 1)) * 380 + 10},${190 - (d.blueTeam / maxValue) * 170}`).join(' ')}
          />
          
          {/* Data points */}
          {data.map((d, i) => (
            <g key={i}>
              <circle
                cx={(i / (data.length - 1)) * 380 + 10}
                cy={190 - (d.redTeam / maxValue) * 170}
                r="3"
                fill="hsl(var(--status-down))"
              />
              <circle
                cx={(i / (data.length - 1)) * 380 + 10}
                cy={190 - (d.blueTeam / maxValue) * 170}
                r="3"
                fill="hsl(var(--atlantis-cyan))"
              />
            </g>
          ))}
        </svg>
        
        {/* Legend */}
        <div className="absolute top-2 right-2 flex gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-status-down rounded-full"></div>
            <span className="text-muted-foreground">Red Team</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-atlantis-cyan rounded-full"></div>
            <span className="text-muted-foreground">Blue Team</span>
          </div>
        </div>
      </div>
    </div>
  );
};