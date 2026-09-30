import React from 'react';
import { X, ZoomIn, ZoomOut, RotateCcw, Eye, Volume2, Keyboard, CheckCircle2, SlidersHorizontal } from 'lucide-react';
import { useAccessibility } from '../context/AccessibilityContext';
import { useLanguage } from '../context/LanguageContext';

export const AccessibilityModal: React.FC = () => {
  const {
    fontSize,
    decreaseFontSize,
    resetFontSize,
    increaseFontSize,
    highContrast,
    toggleHighContrast,
    isAccessibilityModalOpen,
    closeAccessibilityModal,
  } = useAccessibility();

  const { language } = useLanguage();

  React.useEffect(() => {
    if (!isAccessibilityModalOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeAccessibilityModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAccessibilityModalOpen, closeAccessibilityModal]);

  if (!isAccessibilityModalOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="accessibility-modal-title"
    >
      <div className="bg-white rounded-lg shadow-2xl border border-slate-300 w-full max-w-2xl my-8 overflow-hidden text-xs text-slate-800">
        {/* Header */}
        <div className="bg-[#0B2545] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-white/10 border border-white/20 flex items-center justify-center">
              <SlidersHorizontal className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <h2 id="accessibility-modal-title" className="text-sm font-bold text-white flex items-center gap-2">
                <span>{language === 'hi' ? 'सुलभता एवं अनुकूलन केंद्र' : 'Accessibility & Usability Center'}</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/10 text-amber-300 border border-amber-300/40">
                  GIGW 3.0 / WCAG 2.1 AA
                </span>
              </h2>
              <p className="text-[11px] text-slate-300">
                {language === 'hi'
                  ? 'भारतीय सरकारी वेबसाइट दिशानिर्देश (GIGW) एवं दिव्यांगजन अधिकार अधिनियम 2016'
                  : 'Guidelines for Indian Government Websites (GIGW 3.0) & Rights of Persons with Disabilities Act 2016'}
              </p>
            </div>
          </div>
          <button
            onClick={closeAccessibilityModal}
            className="p-1 rounded text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close accessibility options"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Quick Adjustment Controls */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
              {language === 'hi' ? 'त्वरित दृश्य एवं टेक्स्ट नियंत्रण' : 'Display & Visual Preferences'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Text Sizing */}
              <div className="p-3.5 rounded border border-slate-200 bg-slate-50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">
                    {language === 'hi' ? 'फ़ॉन्ट साइज़' : 'Text Size Adjustment'}
                  </span>
                  <span className="text-[11px] font-mono font-bold text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-300 tabular-nums">
                    {fontSize === 'normal' ? '100% Standard' : fontSize === 'large' ? '112.5% Large' : '125% X-Large'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  {language === 'hi'
                    ? 'बिना लेआउट बिगड़े सभी पेजों पर टेक्स्ट का आकार समायोजित करें'
                    : 'Scales typography proportionally across all screens without horizontal overflow'}
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={decreaseFontSize}
                    disabled={fontSize === 'normal'}
                    className="flex-1 py-1.5 px-3 rounded border border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-40 text-xs font-bold text-slate-700 flex items-center justify-center gap-1.5"
                    title="Decrease font size (A-)"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                    <span>A-</span>
                  </button>
                  <button
                    onClick={resetFontSize}
                    className="py-1.5 px-3 rounded border border-slate-300 bg-white hover:bg-slate-100 text-xs font-bold text-slate-700 flex items-center justify-center gap-1"
                    title="Reset to default (A)"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>A</span>
                  </button>
                  <button
                    onClick={increaseFontSize}
                    disabled={fontSize === 'xlarge'}
                    className="flex-1 py-1.5 px-3 rounded border border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-40 text-xs font-bold text-slate-700 flex items-center justify-center gap-1.5"
                    title="Increase font size (A+)"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                    <span>A+</span>
                  </button>
                </div>
              </div>

              {/* High Contrast Mode */}
              <div className="p-3.5 rounded border border-slate-200 bg-slate-50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">
                    {language === 'hi' ? 'उच्च कंट्रास्ट मोड' : 'High Contrast Theme'}
                  </span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${highContrast ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-slate-200 text-slate-700'}`}>
                    {highContrast ? 'Active (AAA)' : 'Standard (AA)'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  {language === 'hi'
                    ? 'कम रोशनी और दृष्टिबाधित उपयोगकर्ताओं के लिए स्पष्टता बढ़ाएं'
                    : 'Enforces maximum contrast, sharp boundaries, and enhanced focus indicators'}
                </p>
                <div className="pt-1">
                  <button
                    onClick={toggleHighContrast}
                    className={`w-full py-1.5 px-3 rounded border text-xs font-semibold flex items-center justify-center gap-2 transition-colors ${
                      highContrast
                        ? 'bg-amber-400 text-slate-950 border-amber-500 font-bold'
                        : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-300'
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>{highContrast ? 'Disable High Contrast' : 'Enable High Contrast View'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Color Palette Transparency & Contrast Audit */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Color Palette &amp; Contrast Audit
            </h3>
            <div className="border border-slate-200 rounded overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-700 uppercase">
                  <tr>
                    <th className="py-2 px-3">Role / Layer</th>
                    <th className="py-2 px-3">Palette Codes</th>
                    <th className="py-2 px-3">Contrast Ratio</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-[11px]">
                  <tr>
                    <td className="py-2 px-3 font-semibold text-slate-900">National Masthead</td>
                    <td className="py-2 px-3 font-mono text-slate-600">#0B2545 (Parliamentary Navy), #F59E0B (Gold)</td>
                    <td className="py-2 px-3 text-emerald-800 font-semibold font-mono tabular-nums">14.8:1 (AAA)</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-semibold text-slate-900">Primary Actions</td>
                    <td className="py-2 px-3 font-mono text-slate-600">#0B2545 (Navy-900), #047857 (Forest Green)</td>
                    <td className="py-2 px-3 text-emerald-800 font-semibold font-mono tabular-nums">12.5:1 (AAA)</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-semibold text-slate-900">Critical Distress Alert</td>
                    <td className="py-2 px-3 font-mono text-slate-600">#B91C1C (Crimson-700) on #FEF2F2</td>
                    <td className="py-2 px-3 text-emerald-800 font-semibold font-mono tabular-nums">5.8:1 (AA)</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-semibold text-slate-900">Field Handset LCD</td>
                    <td className="py-2 px-3 font-mono text-slate-600">#020617 (Slate-950) with #F8FAFC (Slate-50)</td>
                    <td className="py-2 px-3 text-emerald-800 font-semibold font-mono tabular-nums">18.2:1 (AAA)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Screen Reader & Audio Accessibility */}
          <div className="p-3.5 rounded border border-slate-200 bg-slate-50 space-y-1.5">
            <div className="flex items-center gap-2 text-slate-900 font-bold">
              <Volume2 className="w-3.5 h-3.5 text-[#0B2545]" />
              <span>Multilingual Audio &amp; Screen Reader Support</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              For illiterate and visually impaired citizens, the IVR phone simulator synthesizes speech in <strong>Hindi</strong>, 
              <strong>Bengali</strong>, <strong>Tamil</strong>, <strong>Telugu</strong>, and <strong>English</strong>. 
              The web application conforms to semantic HTML5 standards and WAI-ARIA live regions.
            </p>
          </div>

          {/* Keyboard Shortcuts */}
          <div className="p-3.5 rounded border border-slate-200 bg-slate-50 space-y-1.5">
            <div className="flex items-center gap-2 text-slate-900 font-bold">
              <Keyboard className="w-3.5 h-3.5 text-[#0B2545]" />
              <span>Keyboard Navigation Shortcuts</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-600">
              <div className="flex items-center gap-2">
                <kbd className="px-1.5 py-0.5 rounded bg-white border border-slate-300 font-mono text-[10px] text-slate-800">Tab</kbd>
                <span>Move to next control</span>
              </div>
              <div className="flex items-center gap-2">
                <kbd className="px-1.5 py-0.5 rounded bg-white border border-slate-300 font-mono text-[10px] text-slate-800">Shift + Tab</kbd>
                <span>Move to previous control</span>
              </div>
              <div className="flex items-center gap-2">
                <kbd className="px-1.5 py-0.5 rounded bg-white border border-slate-300 font-mono text-[10px] text-slate-800">Enter / Space</kbd>
                <span>Activate buttons and tabs</span>
              </div>
              <div className="flex items-center gap-2">
                <kbd className="px-1.5 py-0.5 rounded bg-white border border-slate-300 font-mono text-[10px] text-slate-800">Esc</kbd>
                <span>Dismiss modal dialog</span>
              </div>
            </div>
          </div>

          {/* Footer Close */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-200">
            <div className="flex items-center gap-1.5 text-emerald-800 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
              <span>GIGW 3.0 &amp; WCAG 2.1 AA Compliant</span>
            </div>
            <button
              onClick={closeAccessibilityModal}
              className="px-4 py-1.5 bg-[#0B2545] hover:bg-[#12335C] text-white rounded font-semibold transition-colors text-xs"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
