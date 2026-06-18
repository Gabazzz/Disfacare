import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  onClick, 
  hoverEffect = false 
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-card shadow-premium border border-gray-100 p-5 ${
        hoverEffect ? 'hover:-translate-y-1 hover:shadow-lg transition-all duration-300 cursor-pointer' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
