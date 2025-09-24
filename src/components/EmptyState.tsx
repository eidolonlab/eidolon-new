import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';
import AccessibleButton from './AccessibleButton';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  secondaryActionText?: string;
  onSecondaryAction?: () => void;
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionText,
  onAction,
  secondaryActionText,
  onSecondaryAction,
  className = ''
}) => {
  return (
    <div className={`text-center py-12 ${className}`}>
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <Icon className="w-8 h-8 text-gray-400" />
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-4">{title}</h3>
      <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
        {description}
      </p>
      
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        {actionText && onAction && (
          <AccessibleButton
            onClick={onAction}
            variant="primary"
            size="lg"
            ariaLabel={actionText}
          >
            {actionText}
          </AccessibleButton>
        )}
        
        {secondaryActionText && onSecondaryAction && (
          <AccessibleButton
            onClick={onSecondaryAction}
            variant="outline"
            size="lg"
            ariaLabel={secondaryActionText}
          >
            {secondaryActionText}
          </AccessibleButton>
        )}
      </div>
    </div>
  );
};

export default EmptyState;