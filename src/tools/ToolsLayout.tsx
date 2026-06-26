import React, { useState } from 'react';
import { X } from 'lucide-react';

interface ToolsLayoutProps {
  children: React.ReactNode;
  onHome: () => void;
}

export const ToolsLayout: React.FC<ToolsLayoutProps> = ({ children, onHome }) => {
  const [policyModal, setPolicyModal] = useState<string | null>(null);

  return (
    <div className="flex flex-col h-full overflow-hidden bg-slate-50 font-sans">
      {/* Main */}
      <main className="flex-1 overflow-hidden">
        {children}
      </main>

      {/* Policy Modals */}
      {policyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setPolicyModal(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6 relative" onClick={e => e.stopPropagation()}>
            <button onClick={() => setPolicyModal(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700"><X size={20} /></button>
            {policyModal === 'privacy' && (
              <div>
                <h2 className="text-lg font-bold text-slate-900 mb-4">Privacy Notice</h2>
                <p className="text-xs text-slate-500 mb-3"><strong>Effective Date:</strong> January 1, 2026</p>
                <p className="text-sm text-slate-700 mb-3">ReportsIQ by Zezha Technology Private Limited is committed to protecting your privacy.</p>
                <h3 className="text-sm font-bold text-slate-800 mt-4 mb-1">Data Processing</h3>
                <p className="text-sm text-slate-600">All file processing occurs <strong>entirely within your browser</strong> using WebAssembly (DuckDB). Your data is never uploaded, transmitted, or stored externally.</p>
                <h3 className="text-sm font-bold text-slate-800 mt-4 mb-1">Information We Collect</h3>
                <p className="text-sm text-slate-600">We do not collect or access any data from files you analyze. We may collect basic anonymous usage analytics to improve the product.</p>
                <h3 className="text-sm font-bold text-slate-800 mt-4 mb-1">Third-Party Services</h3>
                <p className="text-sm text-slate-600">ReportsIQ does not share user data with third parties. No advertising, tracking, or third-party cookies are used.</p>
                <h3 className="text-sm font-bold text-slate-800 mt-4 mb-1">Contact</h3>
                <p className="text-sm text-slate-600">For privacy inquiries, contact: <strong>contact@zezha.in</strong>.</p>
              </div>
            )}
            {policyModal === 'terms' && (
              <div>
                <h2 className="text-lg font-bold text-slate-900 mb-4">Site Terms</h2>
                <p className="text-xs text-slate-500 mb-3"><strong>Effective Date:</strong> January 1, 2026</p>
                <h3 className="text-sm font-bold text-slate-800 mt-4 mb-1">Acceptance of Terms</h3>
                <p className="text-sm text-slate-600">By using ReportsIQ, you agree to these terms. ReportsIQ is provided by Zezha Technology Private Limited.</p>
                <h3 className="text-sm font-bold text-slate-800 mt-4 mb-1">Service Description</h3>
                <p className="text-sm text-slate-600">ReportsIQ is a browser-based BI tool that transforms Excel and CSV files into interactive dashboards. All processing is local.</p>
                <h3 className="text-sm font-bold text-slate-800 mt-4 mb-1">Intellectual Property</h3>
                <p className="text-sm text-slate-600">All content, design, and branding are property of Zezha Technology Private Limited. You retain full ownership of your data.</p>
                <h3 className="text-sm font-bold text-slate-800 mt-4 mb-1">Limitation of Liability</h3>
                <p className="text-sm text-slate-600">ReportsIQ is provided "as is" without warranties. Zezha Technology shall not be liable for data loss or damages from use.</p>
              </div>
            )}
            {policyModal === 'cookie' && (
              <div>
                <h2 className="text-lg font-bold text-slate-900 mb-4">Cookie Policy</h2>
                <p className="text-xs text-slate-500 mb-3"><strong>Effective Date:</strong> January 1, 2026</p>
                <h3 className="text-sm font-bold text-slate-800 mt-4 mb-1">What Are Cookies</h3>
                <p className="text-sm text-slate-600">Cookies are small files stored on your device. ReportsIQ uses minimal cookies for essential functionality only.</p>
                <h3 className="text-sm font-bold text-slate-800 mt-4 mb-1">Cookies We Use</h3>
                <p className="text-sm text-slate-600">We use only essential session cookies for authentication . No tracking or advertising cookies are used.</p>
                <h3 className="text-sm font-bold text-slate-800 mt-4 mb-1">Managing Cookies</h3>
                <p className="text-sm text-slate-600">You can manage cookies through your browser settings. Disabling essential cookies may affect functionality.</p>
              </div>
            )}
            {policyModal === 'nodata' && (
              <div>
                <h2 className="text-lg font-bold text-slate-900 mb-4">No Data Saved</h2>
                <p className="text-sm text-slate-700 mb-3">ReportsIQ is designed with a <strong>zero data storage</strong> architecture.</p>
                <h3 className="text-sm font-bold text-slate-800 mt-4 mb-1">How It Works</h3>
                <p className="text-sm text-slate-600">All file processing occurs entirely in your browser using local WebAssembly. Your files and data never leave your device.</p>
                <h3 className="text-sm font-bold text-slate-800 mt-4 mb-1">No Server Storage</h3>
                <p className="text-sm text-slate-600">We do not have servers that store, cache, or process your files. When you close the tab, all data is gone.</p>
                <h3 className="text-sm font-bold text-slate-800 mt-4 mb-1">Verification</h3>
                <p className="text-sm text-slate-600">You can verify this by monitoring your browser's network tab — no file data is transmitted to any server.</p>
              </div>
            )}
            {policyModal === 'faq' && (
              <div>
                <h2 className="text-lg font-bold text-slate-900 mb-4">FAQ</h2>
                <h3 className="text-sm font-bold text-slate-800 mt-4 mb-1">Is my data uploaded to any server?</h3>
                <p className="text-sm text-slate-600">No. All processing happens locally in your browser. Your files never leave your device.</p>
                <h3 className="text-sm font-bold text-slate-800 mt-4 mb-1">What file formats are supported?</h3>
                <p className="text-sm text-slate-600">The tools support PDF, PNG, JPG, WebP, DOCX, and more depending on the specific tool.</p>
                <h3 className="text-sm font-bold text-slate-800 mt-4 mb-1">Is there a file size limit?</h3>
                <p className="text-sm text-slate-600">Most tools support files up to 50 MB. Image to Text supports up to 10 MB.</p>
                <h3 className="text-sm font-bold text-slate-800 mt-4 mb-1">Is ReportsIQ free?</h3>
                <p className="text-sm text-slate-600">Yes, the core tools are free to use. No account is required for file conversion tools.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

