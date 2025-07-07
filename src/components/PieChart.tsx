import React from 'react';

interface PieChartProps {
  data: Array<{
    label: string;
    value: number;
    color: string;
  }>;
  size?: number;
  centerText?: string;
}

const PieChart: React.FC<PieChartProps> = ({ data, size = 80, centerText }) => {
  const radius = size / 2 - 2;
  const centerX = size / 2;
  const centerY = size / 2;
  
  // Calculate total value
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  // Calculate angles for each segment
  let currentAngle = -90; // Start from top
  const segments = data.map(item => {
    const percentage = item.value / total;
    const angle = percentage * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    currentAngle = endAngle;
    
    return {
      ...item,
      percentage,
      startAngle,
      endAngle,
      angle
    };
  });
  
  // Function to convert angle to coordinates
  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  };
  
  // Function to create arc path
  const createArcPath = (centerX: number, centerY: number, radius: number, startAngle: number, endAngle: number) => {
    const start = polarToCartesian(centerX, centerY, radius, endAngle);
    const end = polarToCartesian(centerX, centerY, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    
    return [
      "M", centerX, centerY,
      "L", start.x, start.y,
      "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
      "Z"
    ].join(" ");
  };
  
  return (
    <div className="relative">
      <svg width={size} height={size} className="transform rotate-0">
        {segments.map((segment, index) => (
          <path
            key={index}
            d={createArcPath(centerX, centerY, radius, segment.startAngle, segment.endAngle)}
            fill={segment.color}
            stroke="white"
            strokeWidth="1"
            className="transition-all duration-300 hover:opacity-80"
          />
        ))}
        
        {/* Center circle */}
        <circle
          cx={centerX}
          cy={centerY}
          r={radius * 0.4}
          fill="white"
          stroke="#e5e7eb"
          strokeWidth="1"
        />
        
        {/* Center text */}
        {centerText && (
          <text
            x={centerX}
            y={centerY}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-xs font-bold fill-gray-700"
          >
            {centerText}
          </text>
        )}
      </svg>
    </div>
  );
};

export default PieChart;