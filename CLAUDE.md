# 香水电商网站 - 产品架构文档

## 一、项目概述

### 1.1 产品定位
**高端奢侈香水 B2B 电商网站** - 专注于顶级奢侈香水品牌批发的 B2B 电商平台

### 1.2 核心价值
- 为 B2B 采购商提供高端奢侈香水的批发渠道
- 品牌分类简洁，专注品质
- 运费和订单总价可协商的灵活 B2B 模式

### 1.3 目标用户
- **仅 B2B 批量采购商**

---

## 二、技术架构

### 2.1 技术栈

| 层级 | 技术 | 说明 |
|------|------|------|
| **前端框架** | Next.js 16 | 使用 App Router，React 18+ |
| **UI 设计** | Glassmorphism | 玻璃形态 + Apple UI 高级感 |
| **样式方案** | Tailwind CSS | 响应式设计，支持玻璃特效 |
| **数据库** | Supabase | PostgreSQL + 认证 + 实时订阅 |
| **图片存储** | Supabase Storage | 文件存储 + CDN 加速 |
| **支付网关** | Creem API | 海外支付集成 |
| **国际化** | next-intl | i18n 多语言支持 |
| **SEO** | Next.js Metadata | 动态 meta + sitemap |
| **状态管理** | React Context + Zustand | 轻量级状态管理 |
| **表单处理** | React Hook Form | 高性能表单验证 |

### 2.2 架构图

```
┌─────────────────────────────────────────────────────────────┐
│                         用户端 (Client)                       │
├─────────────────────────────────────────────────────────────┤
│  Next.js 16 (App Router) + Glassmorphism UI                 │
│  ┌──────────┬──────────┬──────────┬──────────┬──────────┐  │
│  │  首页    │ 商品列表 │ 商品详情 │ 购物车   │ 个人中心 │  │
│  └──────────┴──────────┴──────────┴──────────┴──────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      API 层 (Server Actions)                  │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────┬──────────┬──────────┬──────────┬──────────┐  │
│  │ 认证API  │ 商品API  │ 订单API  │ 用户API  │ 支付API  │  │
│  └──────────┴──────────┴──────────┴──────────┴──────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                         数据层 (Supabase)                     │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────┬──────────┬──────────┬──────────┬──────────┐  │
│  │ Auth     │ Database │ Storage  │ Realtime │ Edge     │  │
│  │ 认证服务 │ PostgreSQL│ 文件存储 │ 实时订阅 │ Functions│  │
│  └──────────┴──────────┴──────────┴──────────┴──────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                       第三方服务                             │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────┬──────────┬──────────────────────────────────┐ │
│  │ Creem    │ Cloudflare│ Google OAuth                    │ │
│  │ 支付网关 │ CDN       │ 第三方登录                      │ │
│  └──────────┴──────────┴──────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## 三、功能模块

### 3.1 用户端功能

#### 3.1.1 认证模块
| 功能 | 说明 |
|------|------|
| Google OAuth 登录 | 第三方登录 |
| 邮箱密码登录 | 传统登录方式 |
| 邮箱注册 | 用户注册 |
| 登出 | 安全登出 |
| 会话管理 | Supabase Auth |

#### 3.1.2 商品模块
| 功能 | 说明 |
|------|------|
| 品牌分类 | 品牌作为商品页面的分类选择器（侧边栏），无独立品牌页面 |
| 商品列表 | 可自定义分页展示，按品牌筛选，按销量排序（热销推荐） |
| 商品搜索 | 按商品名称搜索（手动触发） |
| 商品详情 | 图片轮播 + 基本信息 + 品牌信息 + 购物车按钮 |
| 商品收藏 | localStorage 存储 |
| 商品点赞 | 数据库存储 |

#### 3.1.3 购物车模块
| 功能 | 说明 |
|------|------|
| 添加商品 | 添加到购物车 |
| 修改数量 | 增减商品数量 |
| 批量删除 | 删除选中商品 |
| 价格计算 | 自动计算总价 |
| 本地存储 | localStorage 存储 |

#### 3.1.4 订单模块
| 功能 | 说明 |
|------|------|
| 创建订单 | 选择地址、确认订单 |
| 订单列表 | 查看历史订单 |
| 订单详情 | 查看订单详细信息 |
| 订单状态跟踪 | pending_payment → paid → shipped → delivered / cancelled |
| 运费协商 | B2B 运费协商功能 |
| 订单总价协商 | B2B 订单总价协商功能 |

#### 3.1.5 用户中心
| 功能 | 说明 |
|------|------|
| 个人信息 | 编辑用户资料 |
| 头像上传 | 自定义头像 |
| 地址管理 | 多地址增删改查 |
| 收藏列表 | localStorage 查看 |
| 订单列表 | 查看历史订单 |

#### 3.1.6 点赞模块（替代评价）
| 功能 | 说明 |
|------|------|
| 商品点赞 | 点赞/取消点赞 |
| 点赞状态 | 实时显示点赞状态 |

### 3.2 管理端功能

#### 3.2.1 商品管理
| 功能 | 说明 |
|------|------|
| 商品列表 | 分页展示所有商品 |
| 添加商品 | 上传商品信息 |
| 编辑商品 | 修改商品信息 |
| 删除商品 | 删除商品 |
| 批量上架 | 批量设置上架状态 |
| 批量下架 | 批量设置下架状态 |
| 批量删除 | 批量删除商品 |
| 状态管理 | 上架/下架/售罄 |
| 品牌管理 | 商品管理页面内，品牌作为分类 |

#### 3.2.2 订单管理
| 功能 | 说明 |
|------|------|
| 订单列表 | 分页展示所有订单 |
| 订单详情 | 查看订单详细信息 |
| 订单搜索 | 按多种条件筛选 |
| 状态管理 | 更新订单状态 |
| 运费修改 | B2B 运费协商功能 |
| 订单总价修改 | B2B 订单总价协商功能 |

#### 3.2.3 协商管理（新增）
| 功能 | 说明 |
|------|------|
| 协商列表 | 查看所有协商记录 |
| 协商详情 | 查看协商详细信息 |
| 协商处理 | 接受/拒绝/取消协商 |
| 协商状态跟踪 | pending/accepted/cancelled/rejected |

#### 3.2.4 用户管理
| 功能 | 说明 |
|------|------|
| 用户列表 | 分页展示所有用户 |
| 用户详情 | 查看用户详细信息 |
| 用户搜索 | 按条件搜索用户 |
| 角色管理 | 超级管理员/普通用户 |

#### 3.2.5 数据统计
| 功能 | 说明 |
|------|------|
| 销售总额 | 总销售额统计 |
| 订单数量 | 订单总数统计 |
| 用户数量 | 用户总数统计 |
| 销售趋势图 | 日/周/月销售趋势 |
| 热销商品排行 | 按销量排行 |
| 用户增长统计 | 用户增长趋势 |

#### 3.2.6 操作日志
| 功能 | 说明 |
|------|------|
| 日志列表 | 记录所有管理员操作 |
| 日志搜索 | 按条件筛选日志 |
| 日志详情 | 查看操作详情 |

---

## 四、数据库设计

### 4.1 核心表结构

#### 4.1.1 用户表 (profiles)
```sql
profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  email text UNIQUE,
  full_name text,
  avatar_url text,
  role text DEFAULT 'user',  -- 新增: 'admin' | 'user'
  created_at timestamp,
  updated_at timestamp
)
```

#### 4.1.2 品牌表 (brands)
```sql
brands (
  id uuid PRIMARY KEY,
  name text UNIQUE NOT NULL,
  name_en text,  -- 英文名称
  name_zh text,  -- 中文名称
  logo_url text,
  sort_order int,
  created_at timestamp,
  updated_at timestamp
)
```

#### 4.1.3 商品表 (products)
```sql
products (
  id uuid PRIMARY KEY,
  brand_id uuid REFERENCES brands(id),
  name text NOT NULL,
  name_en text,  -- 英文名称
  name_zh text,  -- 中文名称
  specification text,  -- 规格/容量
  price decimal NOT NULL,  -- 美元
  images jsonb,  -- 多图片有序数组（第一张为主图）
  status text DEFAULT 'active',  -- active/inactive/sold_out
  sort_order int,
  created_at timestamp,
  updated_at timestamp
)
```

#### 4.1.4 地址表 (addresses)
```sql
addresses (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES profiles(id),
  recipient_name text NOT NULL,
  phone text NOT NULL,
  country text NOT NULL,
  province text,
  city text,
  address_line1 text NOT NULL,
  address_line2 text,
  postal_code text,
  is_default boolean DEFAULT false,
  created_at timestamp,
  updated_at timestamp
)
```

#### 4.1.5 订单表 (orders)
```sql
orders (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES profiles(id),
  order_number text UNIQUE NOT NULL,
  status text DEFAULT 'pending_payment',  -- pending_payment/paid/shipped/delivered/cancelled
  subtotal decimal NOT NULL,
  shipping_fee decimal DEFAULT 10.00,  -- 原始运费（默认10美金/瓶）
  total_amount decimal NOT NULL,  -- 原始总价
  negotiated_shipping_fee decimal,  -- 协商后的实际运费
  negotiated_total_amount decimal,  -- 协商后的实际总价
  shipping_address_id uuid REFERENCES addresses(id),
  notes text,  -- 订单备注
  payment_method text,
  payment_id text,  -- Creem 支付ID
  paid_at timestamp,  -- 支付时间
  shipped_at timestamp,  -- 发货时间
  delivered_at timestamp,  -- 送达时间
  cancelled_at timestamp,  -- 取消时间
  created_at timestamp,
  updated_at timestamp
)
```

#### 4.1.6 订单商品表 (order_items)
```sql
order_items (
  id uuid PRIMARY KEY,
  order_id uuid REFERENCES orders(id),
  product_id uuid REFERENCES products(id),
  product_name text NOT NULL,
  product_specification text,
  price decimal NOT NULL,
  quantity int NOT NULL,
  created_at timestamp
)
```

#### 4.1.7 点赞表 (likes) - 新增
```sql
likes (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES profiles(id),
  product_id uuid REFERENCES products(id),
  created_at timestamp,
  UNIQUE(user_id, product_id)
)
```

#### 4.1.8 协商记录表 (order_negotiations) - 新增
```sql
order_negotiations (
  id uuid PRIMARY KEY,
  order_id uuid REFERENCES orders(id),
  negotiation_type text NOT NULL,  -- 'shipping_fee' | 'total_amount'
  negotiated_amount decimal NOT NULL,
  status text DEFAULT 'pending',  -- pending/accepted/cancelled/rejected
  notes text,  -- 协商备注
  initiated_by uuid REFERENCES profiles(id),  -- 发起人
  processed_by uuid REFERENCES profiles(id),  -- 处理人（管理员）
  processed_at timestamp,  -- 处理时间
  created_at timestamp,
  updated_at timestamp
)
```

#### 4.1.9 操作日志表 (admin_logs)
```sql
admin_logs (
  id uuid PRIMARY KEY,
  admin_id uuid REFERENCES profiles(id),
  action text NOT NULL,  -- 操作类型
  resource_type text,  -- 资源类型
  resource_id text,  -- 资源ID
  resource_name text,  -- 资源名称（用于搜索）
  details jsonb,  -- 操作详情
  ip_address text,
  user_agent text,
  created_at timestamp
)
```

#### 4.1.10 统计数据表 (statistics) - 新增
```sql
statistics (
  id uuid PRIMARY KEY,
  stat_type text NOT NULL,  -- 'daily_sales' | 'weekly_sales' | 'monthly_sales' | 'product_ranking' | 'user_growth'
  stat_date date NOT NULL,  -- 统计日期
  stat_data jsonb NOT NULL,  -- 统计数据（JSON格式存储）
  created_at timestamp,
  updated_at timestamp,
  UNIQUE(stat_type, stat_date)
)
```

**stat_data 数据结构示例：**
```json
// daily_sales
{
  "total_sales": 15000.00,
  "order_count": 50,
  "user_count": 10,
  "average_order_value": 300.00
}

// product_ranking
{
  "rankings": [
    {"product_id": "uuid", "product_name": "香水A", "sales_count": 100, "sales_amount": 5000.00},
    {"product_id": "uuid", "product_name": "香水B", "sales_count": 80, "sales_amount": 4000.00}
  ]
}

// user_growth
{
  "new_users": 15,
  "active_users": 120
}
```

### 4.2 已移除的表
- ~~favorites~~ - 收藏改用 localStorage
- ~~reviews~~ - B2B 不需要评价系统

### 4.3 索引设计
```sql
-- 商品索引
CREATE INDEX idx_products_brand ON products(brand_id);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_price ON products(price);

-- 订单索引
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at DESC);
CREATE INDEX idx_orders_paid_at ON orders(paid_at DESC);
CREATE INDEX idx_orders_shipped_at ON orders(shipped_at DESC);
CREATE INDEX idx_orders_delivered_at ON orders(delivered_at DESC);

-- 全文搜索索引
CREATE INDEX idx_products_search ON products USING gin(
  to_tsvector('english', name_en || ' ' || COALESCE(name_zh, ''))
);

-- 协商记录索引
CREATE INDEX idx_negotiations_order ON order_negotiations(order_id);
CREATE INDEX idx_negotiations_status ON order_negotiations(status);
CREATE INDEX idx_negotiations_initiated ON order_negotiations(initiated_by);
CREATE INDEX idx_negotiations_processed ON order_negotiations(processed_by);

-- 操作日志索引
CREATE INDEX idx_admin_logs_admin ON admin_logs(admin_id);
CREATE INDEX idx_admin_logs_action ON admin_logs(action);
CREATE INDEX idx_admin_logs_resource ON admin_logs(resource_type);
CREATE INDEX idx_admin_logs_created ON admin_logs(created_at DESC);

-- 统计数据索引
CREATE INDEX idx_statistics_type ON statistics(stat_type);
CREATE INDEX idx_statistics_date ON statistics(stat_date DESC);

-- 点赞索引
CREATE INDEX idx_likes_user ON likes(user_id);
CREATE INDEX idx_likes_product ON likes(product_id);
```

---

## 五、页面结构

### 5.1 用户端路由

```
/                           # 首页
/products                   # 商品列表（含品牌分类筛选）
/products/[id]              # 商品详情
/cart                       # 购物车（localStorage）
/checkout                   # 结算
/account                    # 个人中心
/account/profile            # 个人资料
/account/addresses          # 地址管理
/account/orders             # 订单列表
/account/orders/[id]        # 订单详情
/auth/login                 # 登录
/auth/register              # 注册
/auth/forgot-password       # 忘记密码
```

**导航栏配置：** 首页、商品、关于

### 5.2 管理端路由

```
/admin                      # 管理后台首页
/admin/dashboard            # 数据看板
/admin/products             # 商品管理（含品牌管理）
/admin/products/new         # 添加商品
/admin/products/[id]        # 编辑商品
/admin/orders               # 订单管理
/admin/orders/[id]          # 订单详情
/admin/negotiations         # 协商管理（新增）
/admin/negotiations/[id]    # 协商详情（新增）
/admin/users                # 用户管理
/admin/users/[id]           # 用户详情
/admin/logs                 # 操作日志
/admin/settings             # 系统设置
```

---

## 六、UI/UX 设计规范

### 6.1 设计风格
- **主风格**: Glassmorphism（玻璃形态）
- **参考**: Apple UI 高级感
- **视觉特点**: 半透明、模糊、渐变、精致阴影
- **配色方案**: 需使用 `ui-ux-pro-max` skill 进行专业设计

### 6.2 响应式设计
- **桌面端优先**: 1920px, 1440px, 1280px
- **移动端基础**: 768px, 375px
- **管理后台**: 仅桌面端

### 6.3 动画效果
- 页面切换: 平滑过渡
- 悬停效果: 微妙的玻璃态变化
- 加载状态: 优雅的骨架屏

---

## 七、安全策略

### 7.1 认证安全
- Supabase Auth JWT 认证
- 会话自动刷新
- 安全的密码存储
- 用户角色权限控制（超级管理员/普通用户）

### 7.2 数据安全
- RLS (Row Level Security) 策略
- API 请求验证
- SQL 注入防护

### 7.3 支付安全
- Creem Webhook 签名验证
- 订单状态幂等性
- 敏感信息加密

---

## 八、SEO 优化

### 8.1 Meta 优化
- 动态生成标题和描述
- Open Graph 标签
- Twitter Card 标签

### 8.2 结构化数据
- Product Schema
- Breadcrumb Schema
- Organization Schema

### 8.3 性能优化
- 图片懒加载和优化
- 代码分割
- 静态生成 (ISR)

### 8.4 Sitemap
- 自动生成 XML Sitemap
- 提交给搜索引擎

---

## 九、国际化

### 9.1 支持语言
- English (en)
- 简体中文 (zh)

### 9.2 默认语言
- 根据浏览器语言自动检测

### 9.3 翻译内容
- UI 文本
- 商品信息
- 错误消息
- 邮件模板

---

## 十、部署架构

### 10.1 部署方案
```
Vercel (前端)
  ├── Next.js 应用
  └── 静态资源

Supabase (后端)
  ├── PostgreSQL 数据库
  ├── Auth 认证服务
  ├── Storage 文件存储
  └── Edge Functions

Cloudflare (CDN) - 可选
  ├── 静态资源加速
  └── DDoS 防护
```

### 10.2 环境变量
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Creem 支付
CREEM_API_KEY=
CREEM_WEBHOOK_SECRET=

# Cloudflare CDN (可选)
# CLOUDFLARE_ACCOUNT_ID=
# CLOUDFLARE_ACCESS_KEY=
# CLOUDFLARE_BUCKET=

# 应用配置
NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_APP_NAME=
```

**注意：** Google OAuth 凭证已在 Supabase Dashboard 中配置，无需在项目环境变量中添加 `GOOGLE_CLIENT_ID` 和 `GOOGLE_CLIENT_SECRET`。

---

## 十一、开发计划

### 11.1 第一阶段：基础框架
- [ ] 项目初始化
- [ ] UI 组件库搭建（使用 ui-ux-pro-max 设计配色）
- [ ] 数据库设计
- [ ] 认证系统

### 11.2 第二阶段：用户端核心
- [ ] 商品展示
- [ ] 购物车（localStorage）
- [ ] 订单流程
- [ ] 支付集成
- [ ] 点赞功能

### 11.3 第三阶段：管理端
- [ ] 商品管理（含品牌）
- [ ] 订单管理
- [ ] 协商管理
- [ ] 用户管理
- [ ] 数据统计

### 11.4 第四阶段：优化完善
- [ ] SEO 优化
- [ ] 国际化
- [ ] 性能优化
- [ ] 测试

---

## 十二、附录

### 12.1 订单状态流转
```
pending_payment (待支付)
    ↓ [支付成功]
paid (待发货)
    ↓ [发货]
shipped (已发货)
    ↓ [确认收货]
delivered (已完成)

[任意状态] → cancelled (已取消)
```

### 12.2 协商状态流转
```
pending (协商中)
    ↓ [接受]
accepted (已接受)
    ↓ [拒绝]
rejected (已拒绝)
    ↓ [取消]
cancelled (已取消)
```

### 12.3 商品状态
- `active`: 上架
- `inactive`: 下架
- `sold_out`: 售罄

### 12.4 用户角色
- `admin`: 超级管理员（可访问管理端）
- `user`: 普通用户（B2B采购商）

### 12.5 运费规则
- 默认: 10 美金/瓶
- B2B 模式: 每个订单可单独协商修改

### 12.6 订单总价协商
- B2B 模式: 每个订单可单独协商修改总价
- 需记录协商历史

---

*文档版本: v2.0*
*最后更新: 2026-01-03*
*更新内容: 调整为纯B2B模式，新增协商功能，移除评价系统*