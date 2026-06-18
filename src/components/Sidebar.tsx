import React from 'react';
import { ChevronLeft, ChevronRight, LogOut, Shield } from 'lucide-react';
import { NavItem } from './BottomNav';

interface SidebarProps {
  items: NavItem[];
  activeTab: string;
  onChangeTab: (id: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  currentRole: string;
  onChangeRole: (role: 'profissional' | 'paciente' | 'cuidador') => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  items,
  activeTab,
  onChangeTab,
  isCollapsed,
  onToggleCollapse,
  currentRole,
  onChangeRole
}) => {
  const roles = [
    { id: 'profissional', name: 'Fonoaudióloga', color: 'bg-primary text-white' },
    { id: 'paciente', name: 'Paciente', color: 'bg-secondary text-white' },
    { id: 'cuidador', name: 'Cuidador', color: 'bg-warning text-white' }
  ];

  return (
    <aside
      className={`hidden md:flex flex-col h-screen bg-white shadow-[2px_0_12px_rgba(0,0,0,0.05)] transition-all duration-300 z-40 border-r border-gray-100 ${
        isCollapsed ? 'w-20' : 'w-72'
      }`}
    >
      {/* Header and Logo */}
      <div className="p-6 flex items-center justify-between border-b border-gray-150">
        <div className="flex items-center gap-3 overflow-hidden">
          {/* Logo SVG (House + swallowing silhoute) */}
          <img
            src="/logo.png"
            alt="DISFACARE Logo"
            className="w-10 h-10 rounded-full object-cover shrink-0 shadow-md"
          />
          
          {!isCollapsed && (
            <div className="flex flex-col animate-fade-in">
              <span className="text-lg font-extrabold text-primary-main tracking-tight leading-none">
                DISFACARE
              </span>
              <span className="text-[9px] text-text-secondary font-medium mt-1 uppercase tracking-wider truncate">
                Cuidar com segurança
              </span>
            </div>
          )}
        </div>

        {/* Toggle Collapse Button */}
        <button
          onClick={onToggleCollapse}
          className="text-text-secondary hover:text-primary-main bg-surface-soft hover:bg-primary-main/10 p-1.5 rounded-full transition-colors duration-200"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Nav List */}
      <nav className="flex-1 px-4 py-6 flex flex-col gap-2 overflow-y-auto">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onChangeTab(item.id)}
              className={`flex items-center gap-4 px-4 py-3.5 rounded-btn text-left select-none transition-all duration-200 group relative ${
                isActive
                  ? 'bg-primary text-white font-bold shadow-md shadow-primary/10 translate-x-1'
                  : 'text-text-secondary hover:bg-surface-soft/40 hover:text-primary'
              }`}
            >
              <Icon
                className={`w-5 h-5 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                  isActive ? 'text-tertiary' : 'text-text-secondary group-hover:text-primary'
                }`}
              />
              {!isCollapsed && (
                <span className="text-sm font-semibold tracking-wide animate-fade-in truncate">
                  {item.label}
                </span>
              )}

              {/* Tooltip for collapsed mode */}
              {isCollapsed && (
                <div className="absolute left-20 bg-[#1F2937] text-white text-xs py-1 px-2.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap shadow-md z-50">
                  {item.label}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Role / Simulator Box */}
      <div className="p-4 border-t border-gray-150 bg-gray-50 flex flex-col gap-2">
        {!isCollapsed && (
          <div className="flex items-center gap-2 mb-1">
            <Shield className="w-4 h-4 text-primary-main" />
            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">
              Simulador de Perfis
            </span>
          </div>
        )}

        <div className={`flex ${isCollapsed ? 'flex-col items-center' : 'flex-col'} gap-1.5`}>
          {roles.map((r) => {
            const isSelected = currentRole === r.id;
            return (
              <button
                key={r.id}
                onClick={() => onChangeRole(r.id as any)}
                className={`w-full py-2 px-3 rounded-btn text-xs font-semibold transition-all duration-200 flex items-center justify-center ${
                  isSelected
                    ? r.color + ' shadow-sm scale-102 font-bold'
                    : 'bg-white hover:bg-gray-100 text-text-primary border border-gray-250'
                }`}
              >
                {isCollapsed ? r.name.charAt(0) : r.name}
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
