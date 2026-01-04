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
            className="block text-sm font-medium text-primary-700 mb-1.5 dark:text-primary-300"
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
              py-2.5
              glass
              bg-white/80
              text-primary-950
              placeholder:text-primary-400
              placeholder:opacity-60
              rounded-lg
              border
              border-white/20
              backdrop-blur-md
              transition-all
              duration-200
              focus:outline-none
              focus:ring-2
              focus:ring-accent-400/50
              focus:border-accent-400/50
              ${error ? 'border-red-400/50 focus:ring-red-400/50' : ''}
              ${className}
            `}
            {...rest}
          />
        </div>

        {error && (
          <p className="mt-1.5 text-sm text-red-500">{error}</p>
        )}

        {helperText && !error && (
          <p className="mt-1.5 text-sm text-primary-500 dark:text-primary-400">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

GlassInput.displayName = 'GlassInput';

export default GlassInput;