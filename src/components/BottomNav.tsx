import React from 'react';
import { LucideIcon } from 'lucide-react';

export interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

interface BottomNavProps {
  items: NavItem[];
  activeTab: string;
  onChangeTab: (id: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ items, activeTab, onChangeTab }) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 glassmorphism shadow-[0_-4px_12px_rgba(0,0,0,0.05)] z-40 border-t border-gray-150">
      <div className="flex justify-around items-center h-16 px-2">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onChangeTab(item.id)}
              className="relative flex flex-col items-center justify-center flex-1 h-full select-none cursor-pointer group focus:outline-none"
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              {/* Circle Icon Container */}
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isActive 
                    ? 'bg-primary-main text-white shadow-md scale-105' 
                    : 'text-text-secondary hover:bg-gray-50'
                }`} 
              >
                <Icon className="w-5 h-5" />
              </div>
              
              {/* Label */}
              <span 
                className={`text-[9px] font-bold tracking-wide mt-0.5 transition-all duration-300 ${
                  isActive 
                    ? 'text-primary font-extrabold' 
                    : 'text-text-secondary group-hover:text-primary'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;
