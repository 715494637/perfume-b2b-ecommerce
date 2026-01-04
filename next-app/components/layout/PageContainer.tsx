/**
 * PageContainer - 页面容器组件
 * 响应式页面容器，自动处理最大宽度和居中
 */

import { ReactNode } from 'react';

export interface PageContainerProps {
  children: ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  padding?: boolean | 'sm' | 'md' | 'lg';
}

/**
 * PageContainer 组件
 * @param children - 页面内容
 * @param className - 自定义类名
 * @param maxWidth - 最大宽度 (sm | md | lg | xl | 2xl | full)
 * @param padding - 是否添加内边距 (boolean | 'sm' | 'md' | 'lg')
 */
export function PageContainer({
  children,
  className = '',
  maxWidth = 'xl',
  padding = 'md',
}: PageContainerProps) {
  // 最大宽度配置
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-6xl',
    '2xl': 'max-w-7xl',
    full: 'max-w-full',
  };

  // 内边距配置
  const paddingClasses = {
    false: '',
    true: 'px-4 md:px-6 lg:px-8 py-6 md:py-8',
    sm: 'px-3 md:px-4 py-4 md:py-6',
    md: 'px-4 md:px-6 py-6 md:py-8',
    lg: 'px-6 md:px-8 py-8 md:py-10',
  };

  return (
    <div
      className={`
        mx-auto
        ${maxWidthClasses[maxWidth]}
        ${paddingClasses[padding]}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

export default PageContainer;