import React, { forwardRef } from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface AccessibleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  children: React.ReactNode;
  ariaLabel?: string;
}

const AccessibleButton = forwardRef<HTMLButtonElement, AccessibleButtonProps>(({
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  loading = false,
  children,
  ariaLabel,
  className = '',
  disabled,
  ...props
}, ref) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500 shadow-sm hover:shadow-md',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500 shadow-sm hover:shadow-md',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-indigo-500',
    ghost: 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:ring-indigo-500'
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2'
  };

  const iconSizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  const isDisabled = disabled || loading;

  return (
    <button
      ref={ref}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={isDisabled}
      aria-label={ariaLabel || (typeof children === 'string' ? children : undefined)}
      aria-busy={loading}
      {...props}
    >
      {loading ? (
        <div className={`${iconSizeClasses[size]} border-2 border-current border-t-transparent rounded-full animate-spin`} />
      ) : (
        Icon && iconPosition === 'left' && <Icon className={iconSizeClasses[size]} />
      )}
      
      <span>{children}</span>
      
      {!loading && Icon && iconPosition === 'right' && <Icon className={iconSizeClasses[size]} />}
    </button>
  );
});

AccessibleButton.displayName = 'AccessibleButton';

export default AccessibleButton;