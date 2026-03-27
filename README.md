# 🚀 电商数据分析平台

> 一个完全免费的电商数据分析工具，帮助中小电商卖家快速了解业务状况，优化运营策略。

## ✨ 特性亮点

- 💰 **完全免费**：使用Vercel+Railway+Supabase免费套餐
- 🚀 **快速上线**：3周完成MVP开发
- 📊 **专业分析**：ROI、转化率、客单价等关键指标
- 📱 **响应式设计**：手机、平板、电脑完美适配
- 🔒 **数据安全**：Supabase企业级安全保护
- 🎯 **简单易用**：上传Excel，立即获得分析报告

## 🎯 立即体验

### 在线演示
- 🌐 **前端演示**：[Vercel部署链接](https://your-vercel-app.vercel.app)
- 🔧 **API文档**：[Railway部署链接](https://your-railway-app.up.railway.app/api/info)

### 本地运行
```bash
# 1. 克隆项目
git clone https://github.com/yourusername/ecommerce-analytics.git
cd ecommerce-analytics

# 2. 启动后端
cd backend
npm install
npm run dev

# 3. 访问前端
# 使用Live Server打开 public/index.html
# 或使用 python -m http.server 8000
```

## 📋 核心功能

### 1. 用户系统
- 邮箱注册登录
- 个人资料管理
- 数据安全保护

### 2. 数据录入
- Excel模板下载
- 批量数据上传
- 自动数据解析

### 3. 数据分析
- ROI（投资回报率）计算
- 转化率分析
- 客单价统计
- 成本效益分析

### 4. 报告生成
- 可视化图表
- 数据洞察
- 优化建议
- 报告导出

## 🛠 技术架构

### 前端技术栈
- **HTML5** + **CSS3** + **原生JavaScript**
- 无框架依赖，极致轻量
- 响应式设计，移动优先

### 后端技术栈
- **Node.js** + **Express.js**
- **Supabase**（PostgreSQL + Auth + Storage）
- RESTful API设计

### 部署平台
- **Vercel**：前端静态部署
- **Railway**：后端服务部署
- **Supabase**：数据库和认证

## 📊 开发进度

### ✅ 第1周：核心MVP（已完成）
- [x] Day 1：项目初始化（GitHub + Vercel + Railway + Supabase）
- [x] Day 2：用户系统（注册登录）
- [ ] Day 3-4：数据录入（Excel导入）
- [ ] Day 5-7：基础分析功能

### 🔄 第2周：功能完善（进行中）
- [ ] 数据可视化图表
- [ ] 报告生成功能
- [ ] 用户反馈系统
- [ ] 移动端优化

### ⏳ 第3周：优化迭代（计划中）
- [ ] 性能优化
- [ ] UI/UX改进
- [ ] 新功能开发
- [ ] 用户测试

## 🎨 界面预览

### 首页
![首页预览](https://via.placeholder.com/800x400/4361ee/ffffff?text=电商数据分析平台)

### 仪表板
![仪表板预览](https://via.placeholder.com/800x400/3a0ca3/ffffff?text=数据分析仪表板)

### 报告页面
![报告预览](https://via.placeholder.com/800x400/4cc9f0/ffffff?text=分析报告)

## 🔧 API接口

### 基础端点
```http
GET    /api/health          # 健康检查
GET    /api/info           # API信息

POST   /api/auth/register  # 用户注册
POST   /api/auth/login     # 用户登录

POST   /api/data/upload    # 数据上传
POST   /api/data/analyze   # 数据分析
GET    /api/templates/excel # Excel模板
```

## 📁 项目结构

```
ecommerce-analytics/
├── public/                    # 前端静态文件
│   ├── index.html           # 主页面
│   ├── css/                 # 样式文件
│   └── js/                  # JavaScript文件
├── backend/                  # 后端代码
│   ├── server.js           # Express服务器
│   └── package.json        # 依赖配置
├── database/                # 数据库架构
│   └── schema.sql          # SQL表结构
├── docs/                    # 项目文档
└── shared/                  # 共享资源
```

## 🚀 部署指南

### 1. Supabase设置
1. 访问 [supabase.com](https://supabase.com) 创建项目
2. 运行 `database/schema.sql` 创建表
3. 获取 `SUPABASE_URL` 和 `SUPABASE_ANON_KEY`

### 2. Vercel部署（前端）
```bash
# 安装Vercel CLI
npm i -g vercel

# 部署
cd ecommerce-analytics
vercel
```

### 3. Railway部署（后端）
```bash
# 安装Railway CLI
npm i -g @railway/cli

# 部署
cd backend
railway up
```

## 🤝 贡献指南

我们欢迎所有形式的贡献！

1. **报告问题**：使用GitHub Issues
2. **功能建议**：创建Feature Request
3. **代码贡献**：Fork项目并提交PR
4. **文档改进**：帮助完善文档

### 开发流程
```bash
# 1. Fork项目
# 2. 克隆你的分支
git clone https://github.com/yourusername/ecommerce-analytics.git

# 3. 创建功能分支
git checkout -b feature/your-feature

# 4. 提交更改
git commit -m "Add your feature"

# 5. 推送到分支
git push origin feature/your-feature

# 6. 创建Pull Request
```

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 👥 团队介绍

- **包子 (CEO)**：产品愿景、战略规划
- **景天 (CTO)**：技术架构、开发实现
- **晨小 (CMO)**：市场推广、用户增长
- **二话 (COO)**：运营管理、客户支持

## 📞 联系我们

- 📧 邮箱：support@ecommerce-analytics.com
- 🐦 Twitter：@EcommerceAnalytics
- 💬 Discord：[加入社区](https://discord.gg/your-invite-link)
- 📖 文档：[详细文档](https://docs.ecommerce-analytics.com)

## 🌟 特别感谢

- **Supabase**：提供免费的数据库和认证服务
- **Vercel**：提供优秀的前端部署平台
- **Railway**：提供便捷的后端部署服务
- **所有贡献者**：感谢你们的代码和反馈

---

**⭐ 如果这个项目对你有帮助，请给我们一个Star！**

*最后更新：2026年3月26日 | 版本：v1.0.0*