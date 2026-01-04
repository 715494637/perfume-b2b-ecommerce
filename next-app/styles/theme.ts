/**
 * 香水电商网站 - 设计令牌 (Design Tokens)
 * Glassmorphism + Luxury 风格
 */

// ==========================================
// 配色方案 - 奢华黑白金
// ==========================================
export const colors = {
  // 主色调 - 深色系
  primary: {
    50: '#fafaf9',
    100: '#f5f5f4',
    200: '#e7e5e4',
    300: '#d6d3d1',
    400: '#a8a29e',
    500: '#78716c',
    600: '#57534e',
    700: '#44403c',
    800: '#292524',
    900: '#1c1917',
    950: '#0c0a09',
  },

  // 强调色 - 金色系
  accent: {
    50: '#fefce8',
    100: '#fef9c3',
    200: '#fef08a',
    300: '#fde047',
    400: '#facc15',
    500: '#eab308',
    600: '#ca8a04',
    700: '#a16207',
    800: '#854d0e',
    900: '#713f12',
    950: '#422006',
  },

  // 奢华金色
  gold: '#D4AF37',
  goldLight: '#F4E5B0',
  goldDark: '#B8860B',

  // Glassmorphism 透明度
  glass: {
    light: 'rgba(255, 255, 255, 0.8)',
    medium: 'rgba(255, 255, 255, 0.6)',
    dark: 'rgba(255, 255, 255, 0.3)',
    subtle: 'rgba(255, 255, 255, 0.1)',
  },

  // 边框颜色
  border: {
    light: 'rgba(255, 255, 255, 0.2)',
    medium: 'rgba(255, 255, 255, 0.3)',
    dark: 'rgba(255, 255, 255, 0.4)',
  },
};

// ==========================================
// 字体配置 - 奢华字体组合
// ==========================================
export const typography = {
  // 标题字体 - Playfair Display (优雅衬线)
  heading: {
    family: 'Playfair Display',
    weights: [400, 500, 600, 700],
  },

  // 正文字体 - Inter (现代无衬线)
  body: {
    family: 'Inter',
    weights: [300, 400, 500, 600, 700],
  },

  // 字体大小
  sizes: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem',    // 48px
    '6xl': '3.75rem', // 60px
  },

  // 行高
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
};

// ==========================================
// Glassmorphism 效果
// ==========================================
export const glass = {
  // 背景模糊
  blur: {
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px',
  },

  // 阴影
  shadow: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px rgba(0, 0, 0, 0.07)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px rgba(0, 0, 0, 0.15)',
  },

  // 内发光效果
  glow: '0 0 20px rgba(212, 175, 55, 0.3)',
};

// ==========================================
// 间距系统
// ==========================================
export const spacing = {
  xs: '0.25rem',  // 4px
  sm: '0.5rem',   // 8px
  md: '1rem',     // 16px
  lg: '1.5rem',   // 24px
  xl: '2rem',     // 32px
  '2xl': '3rem',  // 48px
  '3xl': '4rem',  // 64px
  '4xl': '6rem',  // 96px
};

// ==========================================
// 圆角
// ==========================================
export const borderRadius = {
  none: '0',
  sm: '0.25rem',  // 4px
  md: '0.5rem',   // 8px
  lg: '0.75rem',  // 12px
  xl: '1rem',     // 16px
  '2xl': '1.5rem', // 24px
  full: '9999px',
};

// ==========================================
// 过渡动画
// ==========================================
export const transitions = {
  duration: {
    fast: '150ms',
    normal: '200ms',
    slow: '300ms',
  },
  easing: {
    ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
  },
};

// ==========================================
// 断点
// ==========================================
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

// ==========================================
// Z-Index 层级
// ==========================================
export const zIndex = {
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
};

// ==========================================
// 导出默认主题
// ==========================================
export const theme = {
  colors,
  typography,
  glass,
  spacing,
  borderRadius,
  transitions,
  breakpoints,
  zIndex,
};

export default theme;