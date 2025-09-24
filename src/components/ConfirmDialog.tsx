import React from 'react';
import { AlertTriangle, CheckCircle, X } from 'lucide-react';
import AccessibleButton from './AccessibleButton';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  loading?: boolean;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'info',
  loading = false
}) => {
  if (!isOpen) return null;

  const variantStyles = {
    danger: {
      icon: AlertTriangle,
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
      buttonVariant: 'bg-red-600 hover:bg-red-700 focus:ring-red-500' as const
    },
    warning: {
      icon: AlertTriangle,
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
      buttonVariant: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500' as const
    },
    info: {
      icon: CheckCircle,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      buttonVariant: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500' as const
    }
  };

  const style = variantStyles[variant];
  const IconComponent = style.icon;

  // Handle escape key
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Focus management
      const dialog = document.querySelector('[role="dialog"]') as HTMLElement;
      if (dialog) {
        dialog.focus();
      }
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
    >
      <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl">
        <div className="flex items-start space-x-4 mb-6">
          <div className={`w-12 h-12 ${style.iconBg} rounded-lg flex items-center justify-center flex-shrink-0`}>
            <IconComponent className={`w-6 h-6 ${style.iconColor}`} />
          </div>
          <div className="flex-1">
            <h3 id="dialog-title" className="text-lg font-semibold text-gray-900 mb-2">
              {title}
            </h3>
            <p id="dialog-description" className="text-gray-600 leading-relaxed">
              {message}
            </p>
          </div>
        </div>
        
        <div className="flex space-x-3">
          <AccessibleButton
            onClick={onClose}
            variant="outline"
            className="flex-1"
            disabled={loading}
            ariaLabel={cancelText}
          >
            {cancelText}
          </AccessibleButton>
          <AccessibleButton
            onClick={onConfirm}
            className={`flex-1 ${style.buttonVariant}`}
            loading={loading}
            disabled={loading}
            ariaLabel={confirmText}
          >
            {confirmText}
          </AccessibleButton>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;