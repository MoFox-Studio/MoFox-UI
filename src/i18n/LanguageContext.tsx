// 导入React的核心库和钩子
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
// 导入翻译文本和类型定义
import { translations, Language, Translations } from './translations';

// 定义语言上下文的类型
interface LanguageContextType {
  language: Language; // 当前语言
  setLanguage: (lang: Language) => void; // 设置语言的函数
  t: Translations; // 当前语言的翻译文本对象
}

// 创建语言上下文
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// 语言提供者组件，用于包裹整个应用，提供国际化支持
export function LanguageProvider({ children }: { children: ReactNode }) {
  // 状态：当前语言，从localStorage初始化以保持持久化
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('mofox-language');
    return (saved as Language) || 'zh'; // 默认为中文
  });

  // 设置语言的函数，同时更新状态和localStorage
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('mofox-language', lang);
  };

  // 副作用钩子：当语言变化时，更新HTML的lang属性，有助于SEO和浏览器功能
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  // 准备要提供给下层组件的上下文值
  const value = {
    language,
    setLanguage,
    t: translations[language],
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

// 自定义钩子，方便在任何组件中使用语言上下文
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    // 如果在LanguageProvider外部使用，则抛出错误
    throw new Error('useLanguage 必须在 LanguageProvider 内部使用');
  }
  return context;
}
