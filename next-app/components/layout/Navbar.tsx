/**
 * Navbar - 导航栏组件
 * 顶部导航栏，支持响应式菜单
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, ShoppingBag, User } from 'lucide-react';
import { GlassButton } from '@/components/ui';

export interface NavItem {
  label: string;
  href: string;
}

export interface NavbarProps {
  logo?: string;
  navItems?: NavItem[];
  showCart?: boolean;
  showUser?: boolean;
  cartCount?: number;
}

const defaultNavItems: NavItem[] = [
  { label: '首页', href: '/' },
  { label: '品牌', href: '/brands' },
  { label: '商品', href: '/products' },
  { label: '关于', href: '/about' },
];

/**
 * Navbar 组件
 * @param logo - Logo 文字或图片
 * @param navItems - 导航链接数组
 * @param showCart - 是否显示购物车图标
 * @param showUser - 是否显示用户图标
 * @param cartCount - 购物车商品数量
 */
export function Navbar({
  logo = 'LINEX',
  navItems = defaultNavItems,
  showCart = true,
  showUser = true,
  cartCount = 0,
}: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="px-4 md:px-6 lg:px-8 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold font-heading text-primary-950 dark:text-primary-50 hover:text-accent-600 dark:hover:text-accent-500 transition-colors">
          {logo}
        </Link>

        {/* 桌面端导航链接 */}
        <div className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-primary-700 dark:text-primary-300 hover:text-accent-600 dark:hover:text-accent-500 font-medium transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* 右侧图标 */}
        <div className="flex items-center space-x-4">
          {/* 购物车图标 */}
          {showCart && (
            <Link href="/cart" className="relative p-2 rounded-lg hover:bg-white/10 transition-colors">
              <ShoppingBag className="w-6 h-6 text-primary-700 dark:text-primary-300" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent-600 text-white text-xs rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          )}

          {/* 用户图标 */}
          {showUser && (
            <Link href="/account" className="p-2 rounded-lg hover:bg-white/10 transition-colors">
              <User className="w-6 h-6 text-primary-700 dark:text-primary-300" />
            </Link>
          )}

          {/* 移动端菜单按钮 */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="打开菜单"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-primary-700 dark:text-primary-300" />
            ) : (
              <Menu className="w-6 h-6 text-primary-700 dark:text-primary-300" />
            )}
          </button>
        </div>
      </div>

      {/* 移动端菜单 */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-4 glass border border-white/20 rounded-lg overflow-hidden">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block px-4 py-3 text-primary-700 dark:text-primary-300 hover:bg-white/10 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}

export default Navbar;