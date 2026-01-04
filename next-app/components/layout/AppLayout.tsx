/**
 * AppLayout - 应用布局组件
 * 统一的应用布局，包含导航栏和页脚
 */

'use client';

import { ReactNode } from 'react';

export interface AppLayoutProps {
  children: ReactNode;
  navbar?: ReactNode;
  footer?: ReactNode;
  className?: string;
}

/**
 * AppLayout 组件
 * @param children - 页面内容
 * @param navbar - 自定义导航栏（可选）
 * @param footer - 自定义页脚（可选）
 * @param className - 自定义类名
 */
export function AppLayout({
  children,
  navbar,
  footer,
  className = '',
}: AppLayoutProps) {
  return (
    <div className={`min-h-screen flex flex-col ${className}`}>
      {/* 导航栏 */}
      {navbar && (
        <header className="sticky top-0 z-40 w-full glass border-b border-white/10">
          {navbar}
        </header>
      )}

      {/* 主内容区域 */}
      <main className="flex-1">{children}</main>

      {/* 页脚 */}
      {footer && <footer className="glass border-t border-white/10">{footer}</footer>}
    </div>
  );
}

export default AppLayout;