import React from 'react';
import { ExternalLink, Shield, FileText, Mail } from 'lucide-react';

const LegalFooter: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" viewBox="0 0 100 100" fill="currentColor">
                  {/* Brain outline - prominent and visible */}
                  <path d="M30 25 Q20 15 25 35 Q15 45 25 55 Q20 65 30 70 Q40 75 50 70 Q60 75 70 70 Q80 65 75 55 Q85 45 75 35 Q80 15 70 25 Q60 20 50 25 Q40 20 30 25 Z" 
                        fill="currentColor" opacity="0.4"/>
                  
                  {/* E letter structure overlaid on brain */}
                  <path d="M25 30 L25 70 L65 70 M25 50 L55 50 M25 30 L65 30" 
                        stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round"/>
                  
                  {/* Alpha symbol (α) clearly positioned in middle line of E */}
                  <path d="M42 45 Q47 40 52 45 Q47 55 42 45 M45 50 L49 50" 
                        stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round"/>
                </svg>
              </div>
              <span className="font-bold text-gray-900">Eidolon</span>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Evidence-based memory training with multi-sensory weaving and spaced retrieval.
            </p>
            <div className="text-xs text-gray-500">
              <p>© {currentYear} Eidolon Technologies</p>
              <p>All rights reserved</p>
            </div>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Legal</h3>
            <div className="space-y-3">
              <a
                href="/privacy-policy.html"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-sm text-gray-600 hover:text-indigo-600 transition-colors"
              >
                <Shield className="w-4 h-4" />
                <span>Privacy Policy</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href="/terms-of-service.html"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-sm text-gray-600 hover:text-indigo-600 transition-colors"
              >
                <FileText className="w-4 h-4" />
                <span>Terms of Service</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Support</h3>
            <div className="space-y-3">
              <a
                href="mailto:support@tryeidolon.com"
                className="flex items-center space-x-2 text-sm text-gray-600 hover:text-indigo-600 transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span>support@tryeidolon.com</span>
              </a>
              <a
                href="mailto:privacy@tryeidolon.com"
                className="flex items-center space-x-2 text-sm text-gray-600 hover:text-indigo-600 transition-colors"
              >
                <Shield className="w-4 h-4" />
                <span>privacy@tryeidolon.com</span>
              </a>
            </div>
          </div>

          {/* Medical Disclaimer */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Medical Notice</h3>
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-xs text-amber-800 leading-relaxed">
                <strong>Not Medical Advice:</strong> Eidolon is for cognitive wellness only. 
                Consult healthcare professionals for medical memory concerns.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-xs text-gray-500">
              <p>Eidolon uses evidence-based cognitive training techniques.</p>
              <p>Data stored locally on your device for privacy protection.</p>
            </div>
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <span>Version 1.0.0</span>
              <span>•</span>
              <span>PWA Enabled</span>
              <span>•</span>
              <span>GDPR Compliant</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default LegalFooter;