import React from 'react';

interface AvatarProps {
  src: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg';
  riskLevel?: 'alto' | 'médio' | 'baixo';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ 
  src, 
  alt, 
  size = 'md', 
  riskLevel, 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  const ringColor = {
    alto: 'ring-critical border-red-50',
    'médio': 'ring-warning border-amber-50',
    baixo: 'ring-success border-emerald-50'
  };

  return (
    <div className={`relative shrink-0 ${className}`}>
      <img
        src={src}
        alt={alt}
        className={`rounded-full object-cover border-2 border-white shadow-sm ${sizeClasses[size]} ${
          riskLevel ? `ring-2 ${ringColor[riskLevel]} ring-offset-1` : ''
        }`}
      />
      {riskLevel && (
        <span 
          className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white ${
            riskLevel === 'alto' 
              ? 'bg-critical' 
              : riskLevel === 'médio' 
                ? 'bg-warning' 
                : 'bg-success'
          }`}
        />
      )}
    </div>
  );
};

export default Avatar;
