import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'inverted' | 'outlined';
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  icon,
  className = '',
  ...props 
}) => {
  const baseStyle = 'touch-target px-6 py-3 rounded-btn font-bold text-sm tracking-wide transition-all duration-200 ease-in-out flex items-center justify-center gap-2 select-none active:scale-[0.97] cursor-pointer';
  
  const variants = {
    primary: 'bg-primary hover:bg-[#153F5C] text-white shadow-md',
    secondary: 'bg-secondary hover:bg-[#256B89] text-white shadow-sm',
    inverted: 'bg-white text-primary hover:bg-gray-50 border border-gray-150 shadow-sm',
    outlined: 'bg-transparent text-primary border border-primary hover:bg-surface-soft/30'
  };

  const widthStyle = fullWidth ? 'w-full' : 'w-auto';

  return (
    <button
      className={`${baseStyle} ${variants[variant]} ${widthStyle} ${className}`}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </button>
  );
};

export default Button;
