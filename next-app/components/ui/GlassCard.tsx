/**
 * GlassCard - 玻璃形态卡片组件
 * 使用 Glassmorphism 效果的卡片组件
 */

import { ReactNode } from 'react';

export interface GlassCardProps {
  children: ReactNode;
  className?: string;
  variant?: 'light' | 'dark' | 'subtle';
  glow?: boolean;
  onClick?: () => void;
}

/**
 * GlassCard 组件
 * @param children - 卡片内容
 * @param className - 自定义类名
 * @param variant - 玻璃效果变体 (light | dark | subtle)
 * @param glow - 是否添加金色发光效果
 * @param onClick - 点击事件（可选，添加后显示 cursor-pointer）
 */
export function GlassCard({
  children,
  className = '',
  variant = 'light',
  glow = false,
  onClick,
}: GlassCardProps) {
  // 根据变体选择玻璃效果类
  const variantClasses = {
    light: 'glass',
    dark: 'glass-dark',
    subtle: 'glass-subtle',
  };

  // 根据变体调整颜色
  const colorClasses = {
    light: 'bg-white/80 text-primary-950 dark:bg-primary-950/80 dark:text-primary-50',
    dark: 'bg-primary-900/30 text-primary-50',
    subtle: 'bg-white/10 text-primary-950 dark:bg-primary-900/10 dark:text-primary-50',
  };

  return (
    <div
      className={`
        rounded-xl
        ${variantClasses[variant]}
        ${colorClasses[variant]}
        ${glow ? 'glow-gold' : ''}
        ${onClick ? 'cursor-pointer hover:bg-white/90 transition-all duration-200' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

export default GlassCard;