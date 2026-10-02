import React, { useState, useEffect } from 'react';
import { X, Key, CheckCircle2, AlertCircle, Sparkles, RefreshCw, ExternalLink, ShieldCheck } from 'lucide-react';
import { geminiStylistService } from '../services/geminiStylistService';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose }) => {
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    tested: boolean;
    success: boolean;
    message: string;
    model?: string;
  } | null>(null);

  useEffect(() => {
    if (isOpen) {
      setApiKeyInput(geminiStylistService.getApiKey());
      setTestResult(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTest = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const result = await geminiStylistService.testApiKey(apiKeyInput);
      setTestResult({
        tested: true,
        success: result.success,
        message: result.message,
        model: result.model,
      });
    } catch (e: any) {
      setTestResult({
        tested: true,
        success: false,
        message: e.message || 'Verification test failed.',
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSave = () => {
    geminiStylistService.setApiKey(apiKeyInput);
    onClose();
  };

  const handleClear = () => {
    setApiKeyInput('');
    geminiStylistService.setApiKey('');
    setTestResult(null);
  };

  const currentKey = geminiStylistService.getApiKey();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg rounded-3xl bg-noir-900 border border-gold-500/40 shadow-2xl p-6 sm:p-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-silk-300 hover:text-silk-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gold-500/10 border border-gold-500/30 mx-auto flex items-center justify-center text-gold-400 mb-2">
            <Key className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-gold-400 bg-gold-500/10 px-2.5 py-0.5 rounded-full border border-gold-500/30">
            GOOGLE AI CONFIGURATION
          </span>
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-silk-100 mt-2">
            Gemini API Key & Diagnostics
          </h3>
          <p className="text-xs text-silk-400 mt-1 max-w-sm mx-auto">
            Connect your Gemini API key to activate live generative styling and real-time colorway advice.
          </p>
        </div>

        {/* Current Status Badge */}
        <div className="p-3.5 rounded-2xl bg-noir-850 border border-white/5 flex items-center justify-between mb-4">
          <span className="text-xs font-mono text-silk-400">Current Key Status:</span>
          {currentKey ? (
            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Key Detected ({currentKey.slice(0, 6)}••••)</span>
            </span>
          ) : (
            <span className="text-xs font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
              No Key Configured (Using NIKA Haute Engine)
            </span>
          )}
        </div>

        {/* Input Field */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase text-silk-400 mb-1.5">
              Gemini API Key
            </label>
            <div className="relative">
              <input
                type="text"
                value={apiKeyInput}
                onChange={(e) => {
                  setApiKeyInput(e.target.value);
                  setTestResult(null);
                }}
                placeholder="AIzaSy..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-noir-850 border border-white/10 text-silk-100 text-xs font-mono focus:outline-none focus:border-gold-500/60"
              />
            </div>
            <p className="text-[11px] text-silk-500 mt-1">
              Keys are stored securely in browser memory and passed directly to Google's Generative Language API.
            </p>
          </div>

          {/* Test & Verification Result */}
          {testResult && (
            <div
              className={`p-3.5 rounded-xl border text-xs font-mono flex items-start gap-2.5 ${
                testResult.success
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                  : 'bg-rose-950/50 border-rose-500/40 text-rose-200'
              }`}
            >
              {testResult.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <div className="font-bold">{testResult.success ? 'Verification Succeeded' : 'Verification Issue'}</div>
                <div className="text-[11px] mt-0.5 text-silk-300 leading-relaxed">{testResult.message}</div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2.5 pt-2">
            <button
              type="button"
              onClick={handleTest}
              disabled={isTesting || !apiKeyInput.trim()}
              className="py-2.5 px-3 rounded-xl bg-noir-850 hover:bg-white/5 border border-white/10 text-xs font-mono text-gold-300 font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
              <span>{isTesting ? 'Testing Key...' : 'Test & Verify Key'}</span>
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="py-2.5 px-3 rounded-xl bg-gold-500 hover:bg-gold-400 text-noir-950 font-bold text-xs font-mono uppercase tracking-wider transition-all shadow-luxury-glow flex items-center justify-center gap-1.5"
            >
              <span>Save & Apply</span>
            </button>
          </div>

          {currentKey && (
            <button
              type="button"
              onClick={handleClear}
              className="w-full text-[11px] text-silk-500 hover:text-silk-300 text-center font-mono py-1 transition-colors"
            >
              Clear saved key
            </button>
          )}

          {/* AI Studio Secrets Helper */}
          <div className="p-3.5 rounded-xl bg-gold-500/5 border border-gold-500/20 text-[11px] text-silk-300 space-y-1">
            <div className="font-semibold text-gold-300 font-mono text-[10px] uppercase flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>AI Studio Secrets Panel</span>
            </div>
            <p className="leading-relaxed">
              You can also add your key to the <strong>Secrets panel</strong> in AI Studio with the name{' '}
              <code className="text-gold-300 font-mono bg-black/40 px-1 py-0.5 rounded">GEMINI_API_KEY</code>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
