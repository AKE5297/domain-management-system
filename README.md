# 域名管理系统

一个现代化的域名管理系统，帮助用户轻松管理域名资产，跟踪到期时间，接收续费提醒。

## 功能特性

- 🎯 域名添加、编辑、删除功能
- 📊 数据统计和可视化分析
- 📅 域名到期日历视图
- ⚙️ 系统设置和通知管理
- 🔒 用户认证和权限管理
- 🎨 支持浅色/深色模式

## 部署指南

### Cloudflare Pages 部署

1. 确保您的项目已经准备好并推送到 GitHub 仓库
2. 登录到 Cloudflare Dashboard
3. 导航到 Pages 部分并连接您的 GitHub 仓库
4. 配置构建设置：
   - 构建命令: `pnpm install --no-frozen-lockfile && pnpm build`
   - 构建输出目录: `dist/static`
5. 点击"部署网站"按钮开始部署过程

### 本地开发

1. 克隆仓库
2. 安装依赖: `pnpm install`
3. 启动开发服务器: `pnpm dev`
4. 打开浏览器访问: `http://localhost:3000`

## 技术栈

- React 18+
- TypeScript
- Tailwind CSS
- React Router
- Recharts (数据可视化)
- Sonner (通知组件)
- Vite (构建工具)

## 默认登录凭据

- 用户名: `admin`
- 密码: `admin123`