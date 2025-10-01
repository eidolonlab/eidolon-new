import React from 'react';
import { AlertTriangle, TestTube, Shield, Code } from 'lucide-react';

interface EnvironmentIndicatorProps {
  environment: 'development' | 'staging' | 'production';
  className?: string;
}

const EnvironmentIndicator: React.FC<EnvironmentIndicatorProps> = ({ environment, className = '' }) => {
  const getEnvironmentConfig = () => {
    switch (environment) {
      case 'development':
        return {
          icon: Code,
          label: 'Development',
          color: 'yellow',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          textColor: 'text-yellow-800',
          iconColor: 'text-yellow-600',
          description: 'Local development environment'
        };
      case 'staging':
        return {
          icon: TestTube,
          label: 'Staging',
          color: 'blue',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          textColor: 'text-blue-800',
          iconColor: 'text-blue-600',
          description: 'Testing environment - not for production use'
        };
      case 'production':
        return {
          icon: Shield,
          label: 'Production',
          color: 'emerald',
          bgColor: 'bg-emerald-50',
          borderColor: 'border-emerald-200',
          textColor: 'text-emerald-800',
          iconColor: 'text-emerald-600',
          description: 'Live production environment'
        };
      default:
        return {
          icon: AlertTriangle,
          label: 'Unknown',
          color: 'gray',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          textColor: 'text-gray-800',
          iconColor: 'text-gray-600',
          description: 'Unknown environment'
        };
    }
  };

  const config = getEnvironmentConfig();
  const IconComponent = config.icon;

  return (
    <div className={`inline-flex items-center space-x-2 px-3 py-2 rounded-lg border ${config.bgColor} ${config.borderColor} ${className}`}>
      <IconComponent className={`w-4 h-4 ${config.iconColor}`} />
      <div>
        <span className={`text-sm font-medium ${config.textColor}`}>{config.label}</span>
        <div className={`text-xs ${config.textColor} opacity-75`}>{config.description}</div>
      </div>
    </div>
  );
};

export default EnvironmentIndicator;