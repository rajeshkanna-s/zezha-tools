import React, { useState } from 'react';
import { ShieldCheck, Copy, Check, Info, Terminal, BookOpen } from 'lucide-react';

interface CertExample {
    domain: string;
    issuer: string;
    validFrom: string;
    validTo: string;
    daysRemaining: number;
    protocol: string;
    keySize: number;
    organization: string;
}

const EXAMPLE_CERTS: Record<string, CertExample> = {
    'google.com': {
        domain: 'google.com',
        issuer: 'GTS CA 1C3 (Google Trust Services LLC)',
        validFrom: '2025-12-15',
        validTo: '2026-03-10',
        daysRemaining: 0,
        protocol: 'TLS 1.3',
        keySize: 256,
        organization: 'Google LLC',
    },
    'github.com': {
        domain: 'github.com',
        issuer: 'DigiCert SHA2 High Assurance Server CA',
        validFrom: '2025-03-15',
        validTo: '2026-04-14',
        daysRemaining: 35,
        protocol: 'TLS 1.3',
        keySize: 256,
        organization: 'GitHub, Inc.',
    },
    'amazon.com': {
        domain: 'amazon.com',
        issuer: 'DigiCert Global CA G2',
        validFrom: '2025-08-20',
        validTo: '2026-09-19',
        daysRemaining: 193,
        protocol: 'TLS 1.3',
        keySize: 256,
        organization: 'Amazon.com, Inc.',
    },
    'microsoft.com': {
        domain: 'microsoft.com',
        issuer: 'Microsoft Azure RSA TLS Issuing CA 07',
        validFrom: '2025-10-01',
        validTo: '2026-09-26',
        daysRemaining: 200,
        protocol: 'TLS 1.3',
        keySize: 2048,
        organization: 'Microsoft Corporation',
    },
};

function getDaysColor(days: number): string {
    if (days <= 0) return 'text-red-600 bg-red-50 border-red-200';
    if (days <= 30) return 'text-orange-600 bg-orange-50 border-orange-200';
    if (days <= 90) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-green-600 bg-green-50 border-green-200';
}

function getDaysLabel(days: number): string {
    if (days <= 0) return 'EXPIRED';
    if (days <= 30) return 'Expiring Soon';
    if (days <= 90) return 'Valid';
    return 'Valid';
}

export const SslCertChecker: React.FC = () => {
    const [domain, setDomain] = useState('');
    const [selectedExample, setSelectedExample] = useState<CertExample | null>(null);
    const [copiedCmd, setCopiedCmd] = useState(false);
    const [showGuide, setShowGuide] = useState(false);

    const cleanDomain = domain.trim().replace(/^https?:\/\//, '').replace(/\/.*$/, '').replace(/:.*$/, '');

    const opensslCmd = cleanDomain
        ? `openssl s_client -connect ${cleanDomain}:443 -servername ${cleanDomain} 2>/dev/null | openssl x509 -noout -text`
        : '';

    const copyCommand = async () => {
        if (!opensslCmd) return;
        await navigator.clipboard.writeText(opensslCmd);
        setCopiedCmd(true);
        setTimeout(() => setCopiedCmd(false), 1500);
    };

    const handleCheck = () => {
        const key = Object.keys(EXAMPLE_CERTS).find(k => cleanDomain.includes(k));
        if (key) {
            setSelectedExample(EXAMPLE_CERTS[key]);
        } else {
            setSelectedExample(null);
        }
    };

    return (
        <div className="p-4 space-y-4">
            <div className="flex items-center gap-2 mb-2">
                <ShieldCheck className="w-5 h-5 text-indigo-600" />
                <h2 className="text-sm font-bold text-slate-800">SSL Certificate Checker</h2>
            </div>

            {/* Notice */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2">
                <Info className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-700">
                    Browser JavaScript cannot directly access raw SSL certificate data due to security restrictions.
                    This tool provides educational information and CLI commands you can use to check certificates.
                    For accurate results, check the SSL certificate directly in your browser's address bar or use the openssl command below.
                </p>
            </div>

            {/* Domain Input */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-3">
                <label className="text-xs font-semibold text-slate-600">Domain Name</label>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={domain}
                        onChange={e => setDomain(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleCheck()}
                        placeholder="e.g., google.com"
                        className="flex-1 text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    />
                    <button
                        onClick={handleCheck}
                        disabled={!cleanDomain}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        Check
                    </button>
                </div>

                {/* Quick examples */}
                <div className="flex flex-wrap gap-1.5">
                    <span className="text-xs text-slate-400">Try:</span>
                    {Object.keys(EXAMPLE_CERTS).map(d => (
                        <button
                            key={d}
                            onClick={() => { setDomain(d); }}
                            className="text-xs text-indigo-600 hover:text-indigo-800 underline"
                        >
                            {d}
                        </button>
                    ))}
                </div>
            </div>

            {/* OpenSSL Command */}
            {cleanDomain && (
                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-2">
                    <div className="flex items-center gap-2">
                        <Terminal className="w-4 h-4 text-slate-500" />
                        <h3 className="text-xs font-bold text-slate-700">OpenSSL Command</h3>
                    </div>
                    <div className="bg-slate-900 rounded-lg p-3 relative group">
                        <code className="text-xs font-mono text-green-400 break-all">{opensslCmd}</code>
                        <button
                            onClick={copyCommand}
                            className="absolute top-2 right-2 px-2 py-1 rounded text-xs font-bold text-slate-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            {copiedCmd ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                    </div>
                </div>
            )}

            {/* Example Certificate Display */}
            {selectedExample && (
                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xs font-bold text-slate-700">Example Certificate Info for {selectedExample.domain}</h3>
                        <span className="text-xs text-slate-400 italic">Sample data</span>
                    </div>

                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-bold ${getDaysColor(selectedExample.daysRemaining)}`}>
                        <ShieldCheck className="w-3.5 h-3.5" />
                        {getDaysLabel(selectedExample.daysRemaining)}
                        {selectedExample.daysRemaining > 0 ? ` - ${selectedExample.daysRemaining} days remaining` : ''}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <p className="text-xs text-slate-400 mb-0.5">Domain</p>
                            <p className="text-xs font-semibold text-slate-800 font-mono">{selectedExample.domain}</p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-400 mb-0.5">Organization</p>
                            <p className="text-xs font-semibold text-slate-800">{selectedExample.organization}</p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-400 mb-0.5">Issuer</p>
                            <p className="text-xs font-semibold text-slate-800">{selectedExample.issuer}</p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-400 mb-0.5">Protocol</p>
                            <p className="text-xs font-semibold text-slate-800">{selectedExample.protocol}</p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-400 mb-0.5">Valid From</p>
                            <p className="text-xs font-semibold text-slate-800 font-mono">{selectedExample.validFrom}</p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-400 mb-0.5">Valid To</p>
                            <p className="text-xs font-semibold text-slate-800 font-mono">{selectedExample.validTo}</p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-400 mb-0.5">Key Size</p>
                            <p className="text-xs font-semibold text-slate-800">{selectedExample.keySize}-bit {selectedExample.keySize <= 256 ? 'ECDSA' : 'RSA'}</p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-400 mb-0.5">Days Remaining</p>
                            <p className={`text-xs font-bold ${selectedExample.daysRemaining <= 0 ? 'text-red-600' : selectedExample.daysRemaining <= 30 ? 'text-orange-600' : 'text-green-600'}`}>
                                {selectedExample.daysRemaining <= 0 ? 'EXPIRED' : selectedExample.daysRemaining}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* How to Check Guide */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                <button
                    onClick={() => setShowGuide(!showGuide)}
                    className="flex items-center gap-2 w-full text-left"
                >
                    <BookOpen className="w-4 h-4 text-indigo-600" />
                    <h3 className="text-xs font-bold text-slate-700 flex-1">How to Check SSL Certificates</h3>
                    <span className="text-xs text-slate-400">{showGuide ? 'Hide' : 'Show'}</span>
                </button>

                {showGuide && (
                    <div className="mt-3 space-y-3 text-xs text-slate-600">
                        <div>
                            <h4 className="font-bold text-slate-700 mb-1">1. Browser Method</h4>
                            <p>Click the padlock icon in your browser's address bar, then click "Certificate" or "Connection is secure" to view certificate details.</p>
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-700 mb-1">2. OpenSSL Command Line</h4>
                            <div className="bg-slate-900 rounded-lg p-3 mt-1">
                                <code className="text-xs font-mono text-green-400">
                                    openssl s_client -connect domain:443 -servername domain
                                </code>
                            </div>
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-700 mb-1">3. Check Expiry Only</h4>
                            <div className="bg-slate-900 rounded-lg p-3 mt-1">
                                <code className="text-xs font-mono text-green-400">
                                    echo | openssl s_client -connect domain:443 2&gt;/dev/null | openssl x509 -noout -dates
                                </code>
                            </div>
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-700 mb-1">4. cURL Method</h4>
                            <div className="bg-slate-900 rounded-lg p-3 mt-1">
                                <code className="text-xs font-mono text-green-400">
                                    curl -vI https://domain 2&gt;&amp;1 | grep -A 6 "Server certificate"
                                </code>
                            </div>
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-700 mb-1">Key Things to Check</h4>
                            <ul className="list-disc pl-4 space-y-0.5 mt-1">
                                <li>Certificate is not expired</li>
                                <li>Domain name matches the certificate's CN or SAN</li>
                                <li>Certificate chain is complete and trusted</li>
                                <li>Key size is at least 2048-bit RSA or 256-bit ECDSA</li>
                                <li>TLS 1.2 or 1.3 is used (not older versions)</li>
                                <li>No known vulnerabilities (POODLE, Heartbleed, etc.)</li>
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
