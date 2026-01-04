/**
 * GlassInput - 玻璃形态输入框组件
 * 使用 Glassmorphism 效果的输入框组件
 */

import { InputHTMLAttributes, forwardRef } from 'react';

export interface GlassInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

/**
 * GlassInput 组件
 * @param label - 输入框标签
 * @param error - 错误信息
 * @param helperText - 帮助文本
 * @param rest - 其他原生 input 属性
 */
export const GlassInput = forwardRef<HTMLInputElement, GlassInputProps>(
  ({ label, error, helperText, className = '', id, ...rest }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-300 mb-1.5"
          >
            {label}
          </label>
        )}

        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            className={`
              w-full
              px-4
              py-3
              glass-subtle
              bg-black/20
              text-white
              placeholder:text-gray-500
              placeholder:font-light
              rounded-xl
              border
              border-white/10
              backdrop-blur-md
              transition-all
              duration-200
              focus:outline-none
              focus:ring-2
              focus:ring-accent-400/50
              focus:border-accent-400/50
              focus:bg-black/40
              ${error ? 'border-red-500/50 focus:ring-red-500/50' : ''}
              ${className}
            `}
            {...rest}
          />
        </div>

        {error && (
          <p className="mt-1.5 text-sm text-red-400">{error}</p>
        )}

        {helperText && !error && (
          <p className="mt-1.5 text-sm text-gray-400">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

GlassInput.displayName = 'GlassInput';

export default GlassInput;