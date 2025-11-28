# 域名管理系统

## 项目简介
域名管理系统是一个用于集中管理、监控和分析域名资产的Web应用。该系统提供了直观的界面，帮助用户轻松跟踪域名状态、到期时间、服务商信息等关键数据，并提供提醒功能，确保重要域名不会意外过期。

## 系统架构

### 技术栈
- **前端框架**: React 18+
- **编程语言**: TypeScript
- **构建工具**: Vite
- **样式系统**: Tailwind CSS
- **路由**: React Router
- **状态管理**: React Context API
- **数据可视化**: Recharts
- **表单验证**: Zod
- **UI组件**: 
  - lucide-react (图标库)
  - sonner (通知组件)
  - clsx + tailwind-merge (CSS类名管理)
- **本地存储**: LocalStorage
- **包管理**: pnpm

## 功能特性

### 核心功能
- 🔍 **域名管理**: 添加、编辑、删除和查看域名信息
- 📊 **数据分析**: 提供域名状态分布、服务商分布和月度到期统计
- 📅 **续费日历**: 直观查看各域名到期时间，支持年/月/周视图切换
- 🔔 **通知提醒**: 域名到期前自动提醒，可自定义提醒时间点
- 🔐 **用户认证**: 简单的用户登录和账户管理
- 🌓 **主题切换**: 支持浅色/深色模式切换
- 💾 **本地数据存储**: 使用浏览器LocalStorage保存数据

### 高级特性
- 📋 **ICP备案管理**: 记录和跟踪域名ICP备案状态
- 🚀 **控制面板**: 直观展示关键域名统计数据
- ⚙️ **系统设置**: 自定义通知偏好、视图设置和邮件服务
- 📱 **响应式设计**: 适配不同屏幕尺寸的设备

## 部署指南

### Cloudflare Pages 部署
1. 确保仓库中有有效的 `.npmrc` 文件（项目已包含）

2. 在 Cloudflare Pages 设置中配置构建命令：
   ```bash
   pnpm install --no-frozen-lockfile && pnpm run build
   ```

3. 设置构建输出目录为：`dist/static`

### Docker 部署
1. 项目包含完整的 Docker 配置，可直接使用：
   ```bash
   docker-compose up -d
   ```
   
2. 访问 `http://localhost:3000` 即可使用应用

### 本地开发
1. 克隆仓库并安装依赖：
   ```bash
   git clone [仓库地址]
   cd domain-management-system
   pnpm install
   ```

2. 启动开发服务器：
   ```bash
   pnpm dev
   ```

3. 构建生产版本：
   ```bash
   pnpm build
   ```

## 环境要求
- Node.js >= 16.0.0
- pnpm >= 8.0.0

## 登录信息
默认账户：
- 用户名: admin
- 密码: admin123

## 常见问题解决

### 构建错误处理
如果遇到 `ERR_PNPM_OUTDATED_LOCKFILE` 错误，可以尝试：
1. 确保 `.npmrc` 文件中包含 `frozen-lockfile=false`
2. 使用 `--no-frozen-lockfile` 参数安装依赖：`pnpm install --no-frozen-lockfile`
3. 检查 `.gitignore` 文件，确保没有忽略 `pnpm-lock.yaml`

### 数据持久性
系统使用浏览器的 LocalStorage 存储数据，请注意：
- 清除浏览器数据会导致应用数据丢失
- 不同浏览器之间数据不共享
- 如需长期保存，建议定期导出重要数据

© 2025 域名管理系统. 保留所有权利.

5. **自定义域名（可选）**
   - 在项目设置中导航到 "Custom domains"
   - 按照提示添加您自己的域名

### 常见问题解决

1. **构建失败**
   - 确保构建命令正确设置为 `npm install && npm run build`
   - 检查是否有任何环境变量缺失

2. **页面访问问题**
   - 确认构建输出目录设置为 `dist/static`
   - 检查是否有正确的路由配置

### 技术栈
- React 18+
- TypeScript
- Tailwind CSS
- Vite
- React Router
- Recharts
- Lucide React 图标

## 本地开发

### 安装依赖
```bash
npm install
```

### 启动开发服务器
```bash
npm run dev
```

### 构建生产版本
```bash
npm run build
```