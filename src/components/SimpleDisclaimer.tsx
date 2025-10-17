import React from 'react';
import { Shield, AlertCircle } from 'lucide-react';

const SimpleDisclaimer: React.FC = () => {
  return (
    <div className="mt-8 pt-6 border-t border-gray-200">
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-900 mb-1">Not Medical Advice</p>
            <p className="text-xs text-amber-800 leading-relaxed">
              Eidolon is for cognitive wellness and productivity support only. This is not a medical device and does not diagnose, treat, or prevent any medical condition. Always consult qualified healthcare professionals for medical concerns about memory or attention.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-start space-x-3">
          <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-blue-900 mb-1">Your Data is Private</p>
            <p className="text-xs text-blue-800 leading-relaxed">
              All your data is stored locally on your device. We do not have access to your personal information, memories, or training data. Your privacy is protected by design, and no data is transmitted to external servers without your explicit consent.
            </p>
          </div>
        </div>
      </div>

      <div className="text-center mt-4 text-xs text-gray-500">
        Eidolon v1.0 • Not HIPAA covered • For personal wellness use only
      </div>
    </div>
  );
};

export default SimpleDisclaimer;