import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export const useRTL = () => {
  const { i18n } = useTranslation();

  useEffect(() => {
    const isRTL = i18n.language === 'ar';
    
    // Update document direction
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
    
    // Update body class for RTL styling
    document.body.classList.toggle('rtl', isRTL);

    // Ensure theme class is applied from localStorage preference
    const storedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = storedTheme || (prefersDark ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', theme === 'dark');
    
    // Update meta tag for language
    const metaLang = document.querySelector('meta[name="language"]');
    if (metaLang) {
      metaLang.setAttribute('content', i18n.language);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'language';
      meta.content = i18n.language;
      document.head.appendChild(meta);
    }

    // Cleanup function
    return () => {
      document.body.classList.remove('rtl');
    };
  }, [i18n.language]);

  return {
    isRTL: i18n.language === 'ar',
    language: i18n.language,
    direction: i18n.language === 'ar' ? 'rtl' : 'ltr'
  };
};

export default useRTL;
