/**
 * GlassModal - 玻璃形态弹窗组件
 * 使用 Glassmorphism 效果的弹窗组件
 */

'use client';

import { ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';

export interface GlassModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
  showCloseButton?: boolean;
}

/**
 * GlassModal 组件
 * @param isOpen - 是否打开弹窗
 * @param onClose - 关闭弹窗回调
 * @param title - 弹窗标题
 * @param children - 弹窗内容
 * @param className - 自定义类名
 * @param showCloseButton - 是否显示关闭按钮
 */
export function GlassModal({
  isOpen,
  onClose,
  title,
  children,
  className = '',
  showCloseButton = true,
}: GlassModalProps) {
  // 处理 ESC 键关闭
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  // 阻止背景滚动
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 背景遮罩 */}
      <div
        className="absolute inset-0 bg-primary-950/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* 弹窗内容 */}
      <div
        className={`
          relative
          w-full
          max-w-lg
          mx-4
          glass-dark
          rounded-2xl
          shadow-2xl
          border
          border-white/20
          backdrop-blur-xl
          animate-in
          fade-in
          zoom-in-95
          duration-300
          ${className}
        `}
      >
        {/* 标题栏 */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            {title && (
              <h2 className="text-xl font-semibold text-primary-50 font-heading">
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="p-2 rounded-lg text-primary-400 hover:text-primary-50 hover:bg-white/10 transition-colors duration-200"
                aria-label="关闭"
              >
                <X size={20} />
              </button>
            )}
          </div>
        )}

        {/* 内容区域 */}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

export default GlassModal;