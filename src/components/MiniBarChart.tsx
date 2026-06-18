import React from 'react';

interface ClinicalEvolutionPoint {
  day: string;
  safetyIndex: number;
}

interface MiniBarChartProps {
  data: ClinicalEvolutionPoint[];
  height?: number;
  width?: number;
}

export const MiniBarChart: React.FC<MiniBarChartProps> = ({ 
  data = [], 
  height = 36, 
  width = 72 
}) => {
  // We expect 6-7 bars. Let's slice the latest 7 items
  const points = data.slice(-7);
  
  if (points.length === 0) {
    return <div className="text-[10px] text-text-secondary">Sem dados</div>;
  }

  // Determine trend color based on last two points
  let trendColor = 'fill-success';
  if (points.length >= 2) {
    const last = points[points.length - 1].safetyIndex;
    const prev = points[points.length - 2].safetyIndex;
    if (last < prev) {
      trendColor = 'fill-critical';
    } else if (last === prev) {
      trendColor = 'fill-secondary';
    }
  }

  // SVG parameters
  const barCount = points.length;
  const padding = 3;
  const totalPadding = padding * (barCount - 1);
  const barWidth = (width - totalPadding) / barCount;
  
  // Find max value in data to scale heights (default to 100 as max safety index)
  const maxVal = 100;

  return (
    <svg width={width} height={height} className="overflow-visible">
      {points.map((p, idx) => {
        // Height calculated proportionally (min height 4px for visibility)
        const barHeight = Math.max((p.safetyIndex / maxVal) * height, 4);
        const x = idx * (barWidth + padding);
        const y = height - barHeight;
        
        return (
          <rect
            key={idx}
            x={x}
            y={y}
            width={barWidth}
            height={barHeight}
            className={`${trendColor} opacity-80 hover:opacity-100 transition-opacity rounded-sm`}
            rx={1.5}
            ry={1.5}
          >
            <title>{`${p.day}: ${p.safetyIndex}%`}</title>
          </rect>
        );
      })}
    </svg>
  );
};

export default MiniBarChart;
