# ECOMM-001 部署指南

> 目标：2026年3月30日（周一）MVP上线

## 📋 当前状态

| 组件 | 状态 | 说明 |
|------|------|------|
| Git仓库 | ✅ 完成 | 本地已初始化，已commit |
| 前端代码 | ✅ 完成 | `public/` 静态网站 |
| 后端代码 | ✅ 完成 | `backend/` Node.js API |
| Supabase | ✅ 已配置 | 数据库连接就绪 |
| GitHub推送 | ❌ 阻塞 | 需要GitHub PAT |
| Vercel部署 | ❌ 阻塞 | 需要GitHub或Token |
| Railway部署 | ❌ 阻塞 | 需要GitHub或Token |

## 🚨 阻塞问题

**GitHub认证失败** - GitHub不再接受密码认证，需要Personal Access Token (PAT)。

### 需要用户提供：

1. **GitHub Personal Access Token (PAT)**
   - 访问：https://github.com/settings/tokens
   - 生成新token (classic)
   - 权限：✅ repo (全部)
   - 把token发给我

2. **或者 Vercel Token** (可选，用于直接部署)
   - 访问：https://vercel.com/account/tokens
   - 创建新token

## 🔧 本地测试

### 后端测试
```bash
cd ecommerce-analytics/backend
npm install
npm run dev
# 访问 http://localhost:3000/api/health
```

### 前端测试
直接用浏览器打开 `public/index.html`

## 📁 项目结构

```
ecommerce-analytics/
├── public/              # Vercel部署 - 前端静态文件
│   ├── index.html       # 主页
│   ├── css/style.css    # 样式
│   └── js/              # JavaScript
├── backend/             # Railway部署 - Node.js后端
│   ├── server.js        # Express API
│   ├── package.json
│   ├── .env             # 环境变量 (已配置Supabase)
│   └── railway.json     # Railway配置
├── database/
│   └── schema.sql       # 数据库Schema
└── vercel.json          # Vercel配置
```

## 🌐 部署步骤（用户提供PAT后）

### 1. GitHub仓库创建
```bash
cd ecommerce-analytics
git remote add origin https://github.com/diableilualso/ecommerce-analytics.git
git push -u origin main
```

### 2. Vercel部署前端
- 登录 https://vercel.com
- Import GitHub repo: `diableilualso/ecommerce-analytics`
- Framework: Static
- Root Directory: `public`

### 3. Railway部署后端
- 登录 https://railway.app
- New Project → Deploy from GitHub
- 选择 `diableilualso/ecommerce-analytics`
- Root Directory: `backend`
- 添加环境变量：
  - `SUPABASE_URL`: https://bvtjsjrwnqwppgecqgtdd.supabase.co
  - `SUPABASE_ANON_KEY`: (当前已配置)
  - `PORT`: 3000

### 4. Supabase数据库初始化
在Supabase SQL Editor中运行 `database/schema.sql`

## 📊 Supabase配置

当前使用的Supabase项目：
- URL: https://bvtjsjrwnqwppgecqgtdd.supabase.co
- ANON_KEY: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2dGpzanJ3bnF3d3BnZWNxZHRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1ODkxNzAsImV4cCI6MjA5MDE2NTE3MH0.HcqVkdYY0RIGiIJbP0nLPSu7QWfLXmAcd1KfT9L93Uo

## 🔐 安全说明

- `.env` 文件已加入 `.gitignore`，不会被提交
- Supabase ANON_KEY 是公开密钥，客户端使用安全
- 生产环境建议启用Row Level Security (RLS)

## 📝 待完成事项

- [ ] 获取GitHub PAT并推送代码
- [ ] Vercel部署前端
- [ ] Railway部署后端
- [ ] Supabase数据库Schema初始化
- [ ] 配置自定义域名（可选）
- [ ] MVP功能测试

---

*最后更新：2026-03-27 14:55 GMT+8*
*CTO: 景天*
