/**
 * GlassButton - 玻璃形态按钮组件
 * 使用 Glassmorphism 效果的按钮组件
 */

import { ReactNode } from 'react';

export interface GlassButtonProps {
  children: ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

/**
 * GlassButton 组件
 * @param children - 按钮内容
 * @param className - 自定义类名
 * @param variant - 按钮变体 (primary | secondary | ghost)
 * @param size - 按钮尺寸 (sm | md | lg)
 * @param disabled - 是否禁用
 * @param onClick - 点击事件
 * @param type - 按钮类型
 */
export function GlassButton({
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
  type = 'button',
}: GlassButtonProps) {
  // 尺寸配置
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  // 变体配置
  const variantClasses = {
    primary: `
      glass
      bg-accent-600/80
      text-white
      hover:bg-accent-500/80
      hover:glow-gold-sm
      active:scale-95
    `,
    secondary: `
      glass
      bg-white/80
      text-primary-950
      hover:bg-white/90
      hover:border-accent-400/50
      active:scale-95
    `,
    ghost: `
      glass-subtle
      text-primary-950
      hover:bg-white/20
      active:scale-95
    `,
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`
        inline-flex
        items-center
        justify-center
        font-medium
        rounded-lg
        backdrop-blur-md
        border
        border-white/20
        transition-all
        duration-200
        cursor-pointer
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
    >
      {children}
    </button>
  );
}

export default GlassButton;