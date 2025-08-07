// Professional 3-Color Design System for DEVHUNT
// 功能区域颜色分配：工具图标(蓝色)、分类标签(灰色)、资讯内容(绿色)

// Color utilities for better maintainability
export const colors = {
  // Primary: Professional Deep Blue (#0052cc) - 工具图标专用
  primary: {
    50: '#e6f2ff',
    100: '#cce5ff', 
    200: '#99ccff',
    300: '#66b3ff',
    400: '#3399ff',
    500: '#0052cc',  // 工具图标主色
    600: '#0041a3',
    700: '#003080', 
    800: '#002066',
    900: '#001a52',
    950: '#00103d',
  },
  // Secondary: Neutral Slate - 分类标签专用
  secondary: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',  // 分类标签主色
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
    950: '#020617',
  },
  // Accent: Success Green (#10b981) - 资讯内容专用
  accent: {
    50: '#ecfdf5',
    100: '#d1fae5',
    200: '#a7f3d0',
    300: '#6ee7b7',
    400: '#34d399',
    500: '#10b981',  // 资讯内容主色
    600: '#059669',
    700: '#047857',
    800: '#065f46',
    900: '#064e3b',
    950: '#022c22',
  },
  // Semantic colors using 3-color palette
  success: '#10b981',  // Uses accent color
  warning: '#f59e0b',  // Minimal usage
  error: '#ef4444',    // Minimal usage
  info: '#0052cc',     // Uses primary color
} as const;

// 功能区域专用颜色配置 - 统一各功能模块颜色
export const categoryColors = {
  // 所有工具类别都使用统一的分类标签颜色 (Secondary Slate)
  ui: {
    start: '#64748b', // 分类标签统一色
    end: '#475569',   // 分类标签深色
    name: 'UI/界面',
    gradient: 'linear-gradient(135deg, #64748b 0%, #475569 100%)',
  },
  saas: {
    start: '#64748b', // 分类标签统一色
    end: '#475569',   // 分类标签深色
    name: 'SaaS/平台', 
    gradient: 'linear-gradient(135deg, #64748b 0%, #475569 100%)',
  },
  plugin: {
    start: '#64748b', // 分类标签统一色
    end: '#475569',   // 分类标签深色
    name: 'Plugin/插件',
    gradient: 'linear-gradient(135deg, #64748b 0%, #475569 100%)',
  },
  agent: {
    start: '#64748b', // 分类标签统一色
    end: '#475569',   // 分类标签深色
    name: 'Agent/代理',
    gradient: 'linear-gradient(135deg, #64748b 0%, #475569 100%)',
  },
  review: {
    start: '#64748b', // 分类标签统一色
    end: '#475569',   // 分类标签深色
    name: 'Review/审查',
    gradient: 'linear-gradient(135deg, #64748b 0%, #475569 100%)',
  },
  test: {
    start: '#64748b', // 分类标签统一色
    end: '#475569',   // 分类标签深色
    name: 'Test/测试', 
    gradient: 'linear-gradient(135deg, #64748b 0%, #475569 100%)',
  },
  chat: {
    start: '#64748b', // 分类标签统一色
    end: '#475569',   // 分类标签深色
    name: 'Chat/对话',
    gradient: 'linear-gradient(135deg, #64748b 0%, #475569 100%)',
  },
} as const;

// Enhanced shadow utilities with branded shadows
export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  soft: '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
  'soft-lg': '0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  // Branded shadows
  primary: '0 4px 14px 0 rgba(0, 82, 204, 0.15)',    // Primary blue shadow
  accent: '0 4px 14px 0 rgba(16, 185, 129, 0.15)',   // Accent green shadow
  secondary: '0 4px 14px 0 rgba(100, 116, 139, 0.1)', // Secondary slate shadow
} as const;

// 功能区域专用渐变配置
export const brandGradients = {
  // DEVHUNT logo gradient - 品牌标识专用
  devhunt: 'linear-gradient(135deg, #0052cc 0%, #64748b 50%, #10b981 100%)',
  
  // 功能区域专用渐变
  tools: 'linear-gradient(135deg, #0052cc 0%, #003d99 100%)',      // 工具图标专用
  categories: 'linear-gradient(135deg, #64748b 0%, #475569 100%)', // 分类标签专用  
  news: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',       // 资讯内容专用
  
  // Legacy gradients for compatibility
  primary: 'linear-gradient(135deg, #0052cc 0%, #003d99 100%)',
  secondary: 'linear-gradient(135deg, #64748b 0%, #475569 100%)',
  accent: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
  
  // Utility gradients
  subtle: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
  glass: 'linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(248, 250, 252, 0.8) 100%)',
  
  // Dark mode variants
  devhuntDark: 'linear-gradient(135deg, #4d9fff 0%, #64748b 50%, #34d399 100%)',
  toolsDark: 'linear-gradient(135deg, #4d9fff 0%, #66a3ff 100%)',
  categoriesDark: 'linear-gradient(135deg, #64748b 0%, #94a3b8 100%)', 
  newsDark: 'linear-gradient(135deg, #34d399 0%, #6ee7b7 100%)',
} as const;

// Animation utilities
export const animations = {
  fadeIn: 'fadeIn 0.5s ease-in-out',
  slideUp: 'slideUp 0.3s ease-out',
  bounceSubtle: 'bounceSubtle 2s infinite',
  shimmer: 'shimmer 1.5s infinite',
  pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
  spin: 'spin 1s linear infinite',
} as const;

// Spacing utilities
export const spacing = {
  xs: '0.5rem',
  sm: '1rem',
  md: '1.5rem',
  lg: '2rem',
  xl: '3rem',
  '2xl': '4rem',
  '3xl': '6rem',
  '4xl': '8rem',
} as const;

// Border radius utilities
export const borderRadius = {
  sm: '0.25rem',
  md: '0.375rem',
  lg: '0.5rem',
  xl: '0.75rem',
  '2xl': '1rem',
  '3xl': '1.5rem',
  full: '9999px',
} as const;

// Typography utilities
export const typography = {
  fontFamily: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
    mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
  },
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
  },
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
} as const;

// Component style generators
export const getGradientStyle = (category: keyof typeof categoryColors) => ({
  background: categoryColors[category].gradient,
});

export const getCategoryStyle = (category: keyof typeof categoryColors) => ({
  ...getGradientStyle(category),
  color: 'white',
});

export const getGlassStyle = (dark = false) => ({
  background: dark ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.8)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  border: dark ? '1px solid rgba(148, 163, 184, 0.2)' : '1px solid rgba(255, 255, 255, 0.2)',
  boxShadow: shadows.lg,
});

export const getCardStyle = (hover = true) => ({
  backgroundColor: 'var(--background)',
  border: '1px solid var(--border)',
  borderRadius: borderRadius.lg,
  boxShadow: shadows.sm,
  transition: 'all 0.15s ease-in-out',
  ...(hover && {
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: shadows.md,
      borderColor: 'var(--border-hover)',
    },
  }),
});

export const getButtonStyle = (variant: 'primary' | 'secondary' | 'outline' = 'primary') => {
  const baseStyle = {
    padding: '0.5rem 1rem',
    borderRadius: borderRadius.md,
    fontWeight: typography.fontWeight.medium,
    transition: 'all 0.15s ease-in-out',
    border: '1px solid transparent',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  };

  switch (variant) {
    case 'primary':
      return {
        ...baseStyle,
        backgroundColor: 'var(--primary)',
        color: 'var(--primary-foreground)',
        '&:hover': {
          backgroundColor: 'var(--primary-hover)',
        },
      };
    case 'secondary':
      return {
        ...baseStyle,
        backgroundColor: 'var(--secondary)',
        color: 'var(--secondary-foreground)',
        '&:hover': {
          backgroundColor: 'var(--secondary-hover)',
        },
      };
    case 'outline':
      return {
        ...baseStyle,
        backgroundColor: 'transparent',
        color: 'var(--primary)',
        borderColor: 'var(--primary)',
        '&:hover': {
          backgroundColor: 'var(--primary-light)',
        },
      };
    default:
      return baseStyle;
  }
};

// Accessibility utilities
export const a11y = {
  getFocusStyles: () => ({
    '&:focus-visible': {
      outline: '2px solid var(--focus)',
      outlineOffset: '2px',
      boxShadow: '0 0 0 4px var(--focus-ring)',
    },
  }),
  getScreenReaderOnly: () => ({
    position: 'absolute',
    width: '1px',
    height: '1px',
    padding: '0',
    margin: '-1px',
    overflow: 'hidden',
    clip: 'rect(0, 0, 0, 0)',
    whiteSpace: 'nowrap',
    border: '0',
  }),
};

// Theme types
export type Theme = 'light' | 'dark';

// Theme utilities
export const theme = {
  isDark: () => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  },
  toggleTheme: () => {
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark-mode');
      document.documentElement.classList.toggle('light-mode');
    }
  },
  setTheme: (theme: Theme) => {
    if (typeof document !== 'undefined') {
      document.documentElement.classList.remove('light-mode', 'dark-mode');
      document.documentElement.classList.add(`${theme}-mode`);
    }
  },
};

// 功能区域专用组件样式生成器
export const componentStyles = {
  // DEVHUNT品牌渐变文字
  brandText: {
    background: brandGradients.devhunt,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    color: 'transparent',
  },
  
  // 工具图标专用样式 (Primary Blue)
  toolIcon: {
    backgroundColor: colors.primary[500],
    color: 'white',
    borderRadius: borderRadius.xl,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: shadows.primary,
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      backgroundColor: colors.primary[600],
      transform: 'scale(1.05)',
    },
  },
  
  toolIconGradient: {
    background: brandGradients.tools,
    color: 'white',
    borderRadius: borderRadius.xl,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: shadows.primary,
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      transform: 'scale(1.05)',
      boxShadow: shadows.lg,
    },
  },
  
  // 分类标签专用样式 (Secondary Slate)
  categoryTag: {
    backgroundColor: colors.secondary[100],
    color: colors.secondary[700],
    padding: '0.25rem 0.75rem',
    borderRadius: borderRadius.full,
    border: `1px solid ${colors.secondary[200]}`,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      backgroundColor: colors.secondary[200],
      borderColor: colors.secondary[300],
    },
  },
  
  categoryBadge: {
    background: brandGradients.categories,
    color: 'white',
    padding: '0.25rem 0.75rem',
    borderRadius: borderRadius.full,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    boxShadow: shadows.secondary,
  },
  
  // 资讯内容专用样式 (Accent Green)
  newsIcon: {
    backgroundColor: colors.accent[500],
    color: 'white',
    borderRadius: borderRadius.xl,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: shadows.accent,
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      backgroundColor: colors.accent[600],
      transform: 'scale(1.05)',
    },
  },
  
  newsIconGradient: {
    background: brandGradients.news,
    color: 'white',
    borderRadius: borderRadius.xl,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: shadows.accent,
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      transform: 'scale(1.05)',
      boxShadow: shadows.lg,
    },
  },
  
  newsTag: {
    backgroundColor: colors.accent[50],
    color: colors.accent[700],
    padding: '0.25rem 0.75rem',
    borderRadius: borderRadius.full,
    border: `1px solid ${colors.accent[200]}`,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      backgroundColor: colors.accent[100],
      borderColor: colors.accent[300],
    },
  },
  
  newsAccent: {
    background: brandGradients.news,
    color: 'transparent',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  
  // Button variants using professional colors
  primaryButton: {
    backgroundColor: colors.primary[500],
    color: 'white',
    padding: '0.5rem 1rem',
    borderRadius: borderRadius.lg,
    border: 'none',
    cursor: 'pointer',
    fontWeight: typography.fontWeight.medium,
    transition: 'all 0.2s ease-in-out',
    boxShadow: shadows.primary,
    '&:hover': {
      backgroundColor: colors.primary[600],
      transform: 'translateY(-1px)',
      boxShadow: shadows.lg,
    },
  },
  
  accentButton: {
    backgroundColor: colors.accent[500],
    color: 'white',
    padding: '0.5rem 1rem',
    borderRadius: borderRadius.lg,
    border: 'none',
    cursor: 'pointer',
    fontWeight: typography.fontWeight.medium,
    transition: 'all 0.2s ease-in-out',
    boxShadow: shadows.accent,
    '&:hover': {
      backgroundColor: colors.accent[600],
      transform: 'translateY(-1px)',
      boxShadow: shadows.lg,
    },
  },
  
  secondaryButton: {
    backgroundColor: colors.secondary[100],
    color: colors.secondary[700],
    padding: '0.5rem 1rem',
    borderRadius: borderRadius.lg,
    border: `1px solid ${colors.secondary[200]}`,
    cursor: 'pointer',
    fontWeight: typography.fontWeight.medium,
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      backgroundColor: colors.secondary[200],
      borderColor: colors.secondary[300],
    },
  },
  
  // Professional card styles
  card: {
    backgroundColor: 'white',
    borderRadius: borderRadius.xl,
    boxShadow: shadows.soft,
    border: `1px solid ${colors.secondary[200]}`,
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
      boxShadow: shadows['soft-lg'],
      borderColor: colors.primary[200],
      transform: 'translateY(-2px)',
    },
  },
  
  // Glass morphism effect
  glass: {
    background: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: shadows.lg,
  },
} as const;

// Responsive utilities
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

export const media = {
  sm: `@media (min-width: ${breakpoints.sm})`,
  md: `@media (min-width: ${breakpoints.md})`,
  lg: `@media (min-width: ${breakpoints.lg})`,
  xl: `@media (min-width: ${breakpoints.xl})`,
  '2xl': `@media (min-width: ${breakpoints['2xl']})`,
} as const;

// CSS custom properties generator
export const generateCSSVariables = () => {
  return `
    :root {
      /* Core Colors */
      --background: #ffffff;
      --foreground: #0f172a;
      --muted: #f8fafc;
      --muted-foreground: #64748b;
      
      /* Primary Colors - Professional Blue */
      --primary: ${colors.primary[500]};
      --primary-foreground: #ffffff;
      --primary-hover: ${colors.primary[600]};
      --primary-light: ${colors.primary[100]};
      
      /* Secondary Colors */
      --secondary: #f1f5f9;
      --secondary-foreground: #0f172a;
      --secondary-hover: #e2e8f0;
      
      /* Accent Colors - Success Green */
      --accent: ${colors.accent[500]};
      --accent-foreground: #ffffff;
      --accent-hover: ${colors.accent[600]};
      
      /* Semantic Colors */
      --success: ${colors.success};
      --warning: ${colors.warning};
      --error: ${colors.error};
      --info: ${colors.info};
      
      /* Borders & Dividers */
      --border: #e2e8f0;
      --border-hover: #cbd5e1;
      --divider: #f1f5f9;
      
      /* Interactive States - Updated for new colors */
      --focus: ${colors.primary[500]};         /* Primary blue for focus */
      --focus-ring: rgba(0, 82, 204, 0.2);    /* Primary blue focus ring */
      --selection: rgba(0, 82, 204, 0.15);    /* Primary blue selection */
      
      /* Shadows */
      --shadow-sm: ${shadows.sm};
      --shadow-md: ${shadows.md};
      --shadow-lg: ${shadows.lg};
      --shadow-xl: ${shadows.xl};
      
      /* Spacing */
      --spacing-xs: ${spacing.xs};
      --spacing-sm: ${spacing.sm};
      --spacing-md: ${spacing.md};
      --spacing-lg: ${spacing.lg};
      --spacing-xl: ${spacing.xl};
      
      /* Border Radius */
      --radius-sm: ${borderRadius.sm};
      --radius-md: ${borderRadius.md};
      --radius-lg: ${borderRadius.lg};
      --radius-xl: ${borderRadius.xl};
      
      /* Transitions */
      --transition-fast: 0.15s ease-in-out;
      --transition-normal: 0.2s ease-in-out;
      --transition-slow: 0.3s ease-in-out;
    }
  `;
};

const designSystem = {
  colors,
  brandGradients,
  categoryColors,
  shadows,
  animations,
  spacing,
  borderRadius,
  typography,
  componentStyles,
  getGradientStyle,
  getCategoryStyle,
  getGlassStyle,
  getCardStyle,
  getButtonStyle,
  a11y,
  theme,
  breakpoints,
  media,
  generateCSSVariables,
};

export default designSystem;