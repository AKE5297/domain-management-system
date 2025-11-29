# 域名管理系统

一个现代化、功能齐全的域名管理系统，帮助用户轻松管理和监控所有域名资产。

## 📋 项目简介

该域名管理系统是一个基于 React + TypeScript 的单页应用程序，提供直观的界面来管理、跟踪和分析您的所有域名。系统支持域名添加、编辑、删除、状态监控、到期提醒等核心功能，并提供丰富的数据可视化和报表功能。

## 🚀 技术栈

- **前端框架**: React 18+
- **编程语言**: TypeScript
- **路由**: React Router
- **UI 框架**: Tailwind CSS
- **图标**: Lucide React + Font Awesome
- **数据可视化**: Recharts
- **表单验证**: Zod
- **状态管理**: Context API + Local Storage
- **构建工具**: Vite
- **部署平台**: Cloudflare Pages

## 📦 快速开始

### 前提条件

- Node.js >= 16.0.0
- pnpm >= 8.0.0

### 安装步骤

1. 克隆仓库
   ```bash
   git clone https://github.com/AKE5297/domain-management-system.git
   cd domain-management-system
   ```

2. 安装依赖
   ```bash
   pnpm install
   ```

3. 启动开发服务器
   ```bash
   pnpm dev
   ```

4. 构建生产版本
   ```bash
   pnpm build
   ```

## 🎯 功能特性

### 核心功能
- 🔧 **域名管理**: 添加、编辑、删除和查看域名详细信息
- 📅 **到期监控**: 自动检测域名到期状态并提供视觉提示
- 🔔 **通知系统**: 配置域名到期提醒和其他通知
- 🔍 **搜索筛选**: 快速查找域名并根据状态、服务商等进行筛选

### 数据可视化
- 📊 **控制面板**: 直观展示域名统计和关键指标
- 📈 **数据分析**: 域名状态分布、服务商分布和月度到期趋势图表
- 🗓️ **续费日历**: 多视图日历展示域名到期情况

### 用户体验
- 🌓 **深色模式**: 支持浅色和深色主题切换
- 📱 **响应式设计**: 适配不同屏幕尺寸的设备
- ⚡ **本地存储**: 所有数据保存在浏览器本地，无需后端服务

## 📁 项目结构

```
├── src/                  # 源代码目录
│   ├── components/       # 可复用组件
│   ├── contexts/         # React Contexts
│   ├── hooks/            # 自定义 Hooks
│   ├── lib/              # 工具函数
│   ├── pages/            # 页面组件
│   ├── App.tsx           # 应用入口组件
│   └── main.tsx          # 渲染入口
├── public/               # 静态资源
├── Dockerfile            # Docker 构建配置
├── docker-compose.yml    # Docker Compose 配置
├── index.html            # HTML 入口文件
├── nginx.conf            # Nginx 配置
└── package.json          # 项目依赖和脚本
```

## 🔧 开发说明

### 代码规范

- 使用 TypeScript 进行类型检查
- 组件尽量保持独立和可复用
- 使用 Tailwind CSS 进行样式设计
- 遵循 React 最佳实践

### 提交规范

- 提交消息应该简明扼要
- 使用语义化版本号

## 🚀 部署指南

### Cloudflare Pages 部署

1. 确保项目根目录有 `wrangler.toml` 文件（已包含）
2. 将代码推送到 GitHub 仓库
3. 在 Cloudflare Pages 中连接 GitHub 仓库
4. 配置构建命令：`pnpm install --no-frozen-lockfile && pnpm run build`
5. 设置发布目录：`dist/static`
6. 点击 "Deploy site" 开始部署

### Docker 部署

1. 确保安装了 Docker 和 Docker Compose
2. 运行以下命令：
   ```bash
   docker-compose up -d
   ```
3. 访问 `http://localhost:3000` 查看应用

## 🔐 登录凭证

系统默认提供管理员账户：
- 用户名: `admin`
- 密码: `admin123`

您可以在登录后通过设置页面修改密码。

## 🤝 贡献

欢迎贡献代码和提供建议！请遵循以下步骤：

1. Fork 项目仓库
2. 创建功能分支 (`git checkout -b feature/your-feature`)
3. 提交更改 (`git commit -m 'Add your feature'`)
4. 推送到分支 (`git push origin feature/your-feature`)
5. 创建 Pull Request

## 📝 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件

## 📞 支持

如有任何问题或建议，请联系项目维护者。