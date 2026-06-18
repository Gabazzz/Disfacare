import React from 'react';
import { Plus } from 'lucide-react';

interface FABProps {
  onClick: () => void;
  icon?: React.ReactNode;
  className?: string;
  title?: string;
}

export const FAB: React.FC<FABProps> = ({ 
  onClick, 
  icon = <Plus className="w-6 h-6" />, 
  className = '',
  title = 'Adicionar' 
}) => {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`fixed bottom-20 right-6 md:bottom-8 md:right-8 z-40 w-14 h-14 bg-primary-main hover:bg-[#153F5C] text-white rounded-full flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 ${className}`}
    >
      {icon}
    </button>
  );
};

export default FAB;
