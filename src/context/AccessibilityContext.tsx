import React, { createContext, useContext, useState, useEffect } from 'react';

export type FontSizeLevel = 'normal' | 'large' | 'xlarge';

interface AccessibilityContextType {
  fontSize: FontSizeLevel;
  setFontSize: (size: FontSizeLevel) => void;
  decreaseFontSize: () => void;
  resetFontSize: () => void;
  increaseFontSize: () => void;
  highContrast: boolean;
  toggleHighContrast: () => void;
  isAccessibilityModalOpen: boolean;
  setIsAccessibilityModalOpen: (open: boolean) => void;
  openAccessibilityModal: () => void;
  closeAccessibilityModal: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

const STORAGE_FONT_KEY = 'mosje_font_size';
const STORAGE_CONTRAST_KEY = 'mosje_high_contrast';

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [fontSize, setFontSizeState] = useState<FontSizeLevel>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_FONT_KEY) as FontSizeLevel | null;
      if (saved && ['normal', 'large', 'xlarge'].includes(saved)) {
        return saved;
      }
    }
    return 'normal';
  });

  const [highContrast, setHighContrast] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(STORAGE_CONTRAST_KEY) === 'true';
    }
    return false;
  });

  const [isAccessibilityModalOpen, setIsAccessibilityModalOpen] = useState(false);

  const setFontSize = (size: FontSizeLevel) => {
    setFontSizeState(size);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_FONT_KEY, size);
    }
  };

  const decreaseFontSize = () => {
    if (fontSize === 'xlarge') setFontSize('large');
    else if (fontSize === 'large') setFontSize('normal');
  };

  const resetFontSize = () => {
    setFontSize('normal');
  };

  const increaseFontSize = () => {
    if (fontSize === 'normal') setFontSize('large');
    else if (fontSize === 'large') setFontSize('xlarge');
  };

  const toggleHighContrast = () => {
    setHighContrast((prev) => {
      const next = !prev;
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_CONTRAST_KEY, String(next));
      }
      return next;
    });
  };

  const openAccessibilityModal = () => setIsAccessibilityModalOpen(true);
  const closeAccessibilityModal = () => setIsAccessibilityModalOpen(false);

  // Apply root classes to documentElement for global scaling and contrast
  useEffect(() => {
    const root = document.documentElement;
    
    // Manage font size classes
    root.classList.remove('text-size-normal', 'text-size-large', 'text-size-xlarge');
    root.classList.add(`text-size-${fontSize}`);

    // Manage high contrast class
    if (highContrast) {
      root.classList.add('high-contrast-mode');
    } else {
      root.classList.remove('high-contrast-mode');
    }
  }, [fontSize, highContrast]);

  return (
    <AccessibilityContext.Provider
      value={{
        fontSize,
        setFontSize,
        decreaseFontSize,
        resetFontSize,
        increaseFontSize,
        highContrast,
        toggleHighContrast,
        isAccessibilityModalOpen,
        setIsAccessibilityModalOpen,
        openAccessibilityModal,
        closeAccessibilityModal,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = (): AccessibilityContextType => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};
