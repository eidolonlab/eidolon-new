import React from 'react';
import { Brain, Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  fullScreen?: boolean;
  variant?: 'spinner' | 'brain' | 'dots';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  message = 'Loading...', 
  fullScreen = false,
  variant = 'spinner'
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const containerClasses = fullScreen 
    ? 'fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50'
    : 'flex items-center justify-center p-4';

  const renderSpinner = () => {
    switch (variant) {
      case 'brain':
        return (
          <div className="relative">
            <Brain className={`${sizeClasses[size]} text-indigo-600 animate-pulse`} />
            <div className="absolute inset-0 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
          </div>
        );
      case 'dots':
        return (
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" />
            <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
            <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
          </div>
        );
      default:
        return <Loader2 className={`${sizeClasses[size]} text-indigo-600 animate-spin`} />;
    }
  };

  return (
    <div className={containerClasses}>
      <div className="text-center">
        {renderSpinner()}
        {message && (
          <p className={`text-gray-600 mt-3 ${
            size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-lg' : 'text-base'
          }`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default LoadingSpinner;