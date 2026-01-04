# 香水电商 B2B 网站

高端奢侈香水 B2B 电商平台 - 专注于顶级奢侈香水品牌批发

## 📋 项目概述

本平台是一个专门为 B2B 采购商设计的高端奢侈香水批发网站，提供简洁优雅的购物体验和灵活的 B2B 商务模式。

### 🎯 核心特性

- **品牌精选**：专注顶级奢侈香水品牌
- **B2B 优化**：运费和订单总价可协商
- **优雅设计**：Glassmorphism 玻璃形态 UI
- **安全可靠**：基于 Supabase 的完整认证和数据保护

## 🛠 技术栈

- **前端**：Next.js 16 (App Router) + React 18+
- **UI 设计**：Glassmorphism + Tailwind CSS
- **后端**：Supabase (PostgreSQL + Auth + Storage)
- **状态管理**：React Context + Zustand
- **表单处理**：React Hook Form
- **支付**：Creem API

## 🚀 快速开始

### 环境要求

- Node.js 18+
- npm/yarn/pnpm

### 安装步骤

1. 克隆仓库
```bash
git clone https://github.com/715494637/perfume-b2b-ecommerce.git
cd perfume-b2b-ecommerce
```

2. 进入项目目录
```bash
cd next-app
```

3. 安装依赖
```bash
npm install
```

4. 配置环境变量
```bash
cp .env.example .env.local
```

编辑 `.env.local` 文件，填入你的 Supabase 配置：
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Creem 支付
CREEM_API_KEY=your_creem_api_key
CREEM_WEBHOOK_SECRET=your_webhook_secret

# 应用配置
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=香水电商网站
```

5. 启动开发服务器
```bash
npm run dev
```

6. 访问 [http://localhost:3000](http://localhost:3000)

## 📁 项目结构

```
perfume-b2b-ecommerce/
├── next-app/                 # Next.js 应用
│   ├── app/                # App Router 页面
│   │   ├── (auth)/         # 认证相关页面
│   │   ├── (dashboard)/    # 用户中心
│   │   └── admin/          # 管理后台
│   ├── components/         # 可复用组件
│   │   ├── layout/         # 布局组件
│   │   └── ui/             # UI 组件
│   ├── lib/                # 工具库
│   │   └── supabase/       # Supabase 客户端
│   ├── hooks/              # 自定义 Hooks
│   ├── actions/            # Server Actions
│   └── types/              # TypeScript 类型
├── .zcf/                   # 项目配置和文档
│   ├── plan/               # 开发计划
│   └── docs/               # 项目文档
└── CLAUDE.md               # 项目架构文档
```

## 🎨 UI 设计

项目采用 **Glassmorphism（玻璃形态）**设计风格，特点包括：

- 半透明背景
- 模糊效果
- 精致阴影
- 渐变色彩
- Apple UI 级别的质感

## 📊 功能模块

### 用户端
- ✅ 用户认证（邮箱/Google OAuth）
- ✅ 商品浏览和搜索
- ✅ 购物车（localStorage）
- ✅ 订单管理
- ✅ 地址管理
- ✅ 协商功能（B2B 特色）

### 管理端
- ✅ 商品管理
- ✅ 订单管理
- ✅ 用户管理
- ✅ 协商管理
- ✅ 数据统计
- ✅ 操作日志

## 🔐 安全特性

- Supabase Auth JWT 认证
- RLS（行级安全）策略
- API 请求验证
- 支付安全（Webhook 签名）

## 🌐 国际化

支持多语言切换：
- English (en)
- 简体中文 (zh)

## 📈 开发进度

- [x] 第一阶段：基础框架
  - [x] 项目初始化
  - [x] UI 组件库
  - [x] 数据库设计
  - [x] 认证系统
- [ ] 第二阶段：用户端核心
  - [x] 登录功能
  - [ ] 注册功能
  - [ ] 商品展示
  - [ ] 购物车
  - [ ] 订单流程
- [ ] 第三阶段：管理端
- [ ] 第四阶段：优化完善

## 🤝 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📝 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 👥 作者

- [715494637](https://github.com/715494637)

## 🙏 致谢

感谢所有为这个项目做出贡献的开发者和设计师！

---

⭐ 如果这个项目对你有帮助，请给它一个星标！