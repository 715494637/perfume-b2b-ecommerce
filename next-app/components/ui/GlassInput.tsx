/**
 * GlassInput - 玻璃形态输入框组件
 * 使用 Glassmorphism 效果的输入框组件
 */

import { InputHTMLAttributes, forwardRef, useId } from 'react';

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
    // 使用 useId 生成稳定的 ID，避免 hydration 不匹配
    const generatedId = useId();
    const inputId = id || `input-${generatedId}`;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs text-gray-200 mb-1.5 font-light tracking-wide opacity-90 pl-1"
          >
            {label}
          </label>
        )}

        <div className="relative group">
          <input
            ref={ref}
            id={inputId}
            className={`
              w-full
              px-5
              py-3
              bg-white/5
              text-white
              placeholder:text-gray-400/60
              placeholder:font-light
              placeholder:text-sm
              rounded-2xl
              border
              border-white/10
              backdrop-blur-sm
              transition-all
              duration-300
              focus:outline-none
              focus:bg-white/10
              focus:border-white/30
              focus:shadow-[0_0_20px_rgba(255,255,255,0.05)]
              ${error ? 'border-red-400/50' : ''}
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