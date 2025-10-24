import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'pt' | 'en';

interface TranslationContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  tt: (themeKey: string) => string;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

// Carregar traduções
const translations: Record<Language, any> = {
  pt: {},
  en: {}
};

// Carregar os arquivos de tradução
const loadTranslations = async () => {
  try {
    const [pt, en] = await Promise.all([
      import('../locales/pt.json'),
      import('../locales/en.json')
    ]);
    translations.pt = pt.default;
    translations.en = en.default;
  } catch (error) {
    console.error('Error loading translations:', error);
  }
};

loadTranslations();

export const TranslationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    // Verificar linguagem salva no localStorage ou usar o navegador como fallback
    const saved = localStorage.getItem('language') as Language;
    if (saved && (saved === 'pt' || saved === 'en')) {
      return saved;
    }
    
    // Detectar linguagem do navegador
    const browserLang = navigator.language.split('-')[0];
    return browserLang === 'pt' ? 'pt' : 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  // Função de tradução principal
  const t = (key: string): string => {
    const keys = key.split('.');
    let value = translations[language];
    
    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) {
        console.warn(`Translation key not found: ${key}`);
        return key;
      }
    }
    
    return value;
  };

  // Função específica para temas
  const tt = (themeKey: string): string => {
    return t(`themes.${themeKey}`) || themeKey;
  };

  return (
    <TranslationContext.Provider value={{ language, setLanguage, t, tt }}>
      {children}
    </TranslationContext.Provider>
  );
};

// Hook personalizado para usar as traduções
export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};