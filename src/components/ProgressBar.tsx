import React from 'react';

interface ProgressBarProps {
  value: number; // 0 to 100
  max?: number;
  className?: string;
  showText?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ 
  value, 
  max = 100, 
  className = '', 
  showText = false 
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  // Dynamic progress color based on severity levels
  const getColor = () => {
    if (percentage < 50) return 'bg-critical';
    if (percentage < 75) return 'bg-warning';
    return 'bg-success';
  };

  return (
    <div className={`w-full ${className}`}>
      {showText && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-semibold text-text-secondary">Progresso Clínico</span>
          <span className="text-xs font-bold text-primary-main">{Math.round(percentage)}%</span>
        </div>
      )}
      <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
        <div 
          className={`h-full rounded-full transition-all duration-500 ease-out ${getColor()}`} 
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
