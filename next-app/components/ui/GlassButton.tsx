/**
 * GlassButton - 玻璃形态按钮组件
 * 使用 Glassmorphism 效果的按钮组件，与登录页面风格一致
 */

import { ReactNode } from 'react';

export interface GlassButtonProps {
  children: ReactNode;
  className?: string;
  variant?: 'primary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

/**
 * GlassButton 组件
 * @param children - 按钮内容
 * @param className - 自定义类名
 * @param variant - 按钮变体 (primary | outline | ghost)
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
    sm: 'px-4 py-2 text-sm rounded-full',
    md: 'px-6 py-2.5 text-base rounded-full',
    lg: 'px-8 py-3 text-lg rounded-full',
  };

  // 变体配置 - 使用全局 CSS 变量
  const variantClasses = {
    primary: `
      glass-button
      bg-white
      text-black
      font-medium
    `,
    outline: `
      glass-button-outline
      border border-white/30
      text-white
    `,
    ghost: `
      glass-button-outline
      border-0
      text-white/80
      hover:text-white
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
        backdrop-blur-md
        transition-all
        duration-200
        cursor-pointer
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${disabled ? 'opacity-50 cursor-not-allowed transform-none' : ''}
        ${className}
      `}
    >
      {children}
    </button>
  );
}

export default GlassButton;