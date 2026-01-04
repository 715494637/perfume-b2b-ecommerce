/**
 * Footer - 页脚组件
 * 底部页脚，包含必要链接和信息
 */

import Link from 'next/link';
import { Instagram, Twitter, Facebook, Mail } from 'lucide-react';

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterSection {
  title: string;
  links: FooterLink[];
}

const companyLinks: FooterLink[] = [
  { label: '关于我们', href: '/about' },
  { label: '联系我们', href: '/contact' },
  { label: '加入我们', href: '/careers' },
];

const supportLinks: FooterLink[] = [
  { label: '帮助中心', href: '/help' },
  { label: '配送政策', href: '/shipping' },
  { label: '退换货政策', href: '/returns' },
  { label: '隐私政策', href: '/privacy' },
];

const legalLinks: FooterLink[] = [
  { label: '服务条款', href: '/terms' },
  { label: '隐私政策', href: '/privacy' },
  { label: 'Cookie 政策', href: '/cookies' },
];

export interface FooterProps {
  companyName?: string;
  year?: number;
  showSocial?: boolean;
}

/**
 * Footer 组件
 * @param companyName - 公司名称
 * @param year - 版权年份
 * @param showSocial - 是否显示社交媒体链接
 */
export function Footer({
  companyName = 'LINEX',
  year = new Date().getFullYear(),
  showSocial = true,
}: FooterProps) {
  return (
    <footer className="px-4 md:px-6 lg:px-8 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* 公司信息 */}
          <div>
            <h3 className="text-xl font-bold font-heading text-primary-950 dark:text-primary-50 mb-4">
              {companyName}
            </h3>
            <p className="text-primary-600 dark:text-primary-400 text-sm">
              高端奢侈香水 B2B 电商平台<br />
              为您提供最优质的香水批发服务
            </p>
          </div>

          {/* 公司链接 */}
          <div>
            <h4 className="font-semibold text-primary-950 dark:text-primary-50 mb-4">公司</h4>
            <ul className="space-y-2">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-primary-600 dark:text-primary-400 hover:text-accent-600 dark:hover:text-accent-500 text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 客户服务 */}
          <div>
            <h4 className="font-semibold text-primary-950 dark:text-primary-50 mb-4">客户服务</h4>
            <ul className="space-y-2">
              {supportLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-primary-600 dark:text-primary-400 hover:text-accent-600 dark:hover:text-accent-500 text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 法律信息 */}
          <div>
            <h4 className="font-semibold text-primary-950 dark:text-primary-50 mb-4">法律</h4>
            <ul className="space-y-2">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-primary-600 dark:text-primary-400 hover:text-accent-600 dark:hover:text-accent-500 text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 底部栏 */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            {/* 版权信息 */}
            <p className="text-primary-600 dark:text-primary-400 text-sm">
              © {year} {companyName}. 保留所有权利。
            </p>

            {/* 社交媒体链接 */}
            {showSocial && (
              <div className="flex items-center space-x-4">
                <a
                  href="#"
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                </a>
                <a
                  href="#"
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                </a>
                <a
                  href="#"
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                </a>
                <a
                  href="mailto:contact@linex.com"
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                  aria-label="Email"
                >
                  <Mail className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;