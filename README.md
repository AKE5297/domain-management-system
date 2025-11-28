# 域名管理系统 - Cloudflare Pages 部署指南

## 项目简介
一个现代化的域名管理系统，帮助用户轻松管理、监控和分析域名资产，支持域名状态跟踪、到期提醒、数据可视化等功能。

## 系统特点
- 域名添加、编辑、删除和查看功能
- 域名状态监控（活跃、即将到期、已过期）
- 数据可视化和统计分析
- 续费日历和到期提醒设置

## 部署步骤

### 前提条件
- 一个Cloudflare账号
- 已在GitHub或其他支持的git平台上创建了仓库

### 详细步骤

1. **登录Cloudflare并创建Pages项目**
   - 访问[Cloudflare Pages](https://pages.cloudflare.com/)
   - 点击"创建项目"
   - 连接您的git仓库
   - 选择域名管理系统的仓库

2. **配置构建设置**
   - 构建命令：`pnpm install --no-frozen-lockfile && pnpm run build`
   - 输出目录：`dist/static`
   - 环境：Node.js v22
   - 框架预设：None

3. **部署项目**
   - 点击"保存并部署"
   - 等待部署完成

4. **自定义域名（可选）**
   - 在项目设置中配置自定义域名

## 常见问题解决

**问题：pnpm锁文件与package.json不匹配**
**解决方案：** 在构建命令中使用`--no-frozen-lockfile`参数确保即使锁文件不匹配也能正常构建。

**问题：构建失败，提示缺少依赖**
**解决方案：** 确保构建命令中包含`pnpm install --no-frozen-lockfile`以正确安装所有依赖。

## 技术栈
- React 18+
- TypeScript
- Tailwind CSS
- Vite
- React Router
- Recharts
- 多主题支持（浅色/深色模式）
- 用户认证和权限管理
- ICP备案信息管理

## 快速开始 - Cloudflare Pages 部署

### 前提条件
- Cloudflare 账户（免费注册）
- Git 基础知识

### 部署步骤

1. **Fork 项目仓库**
   - 访问 [项目 GitHub 仓库](https://github.com/AKE5297/domain-management-system)
   - 点击右上角 "Fork" 按钮将项目复制到您自己的 GitHub 账户

2. **创建 Cloudflare Pages 项目**
   - 登录 [Cloudflare 控制台](https://dash.cloudflare.com/)
   - 在左侧导航栏中选择 "Pages"
   - 点击 "创建项目" 按钮
   - 选择 "连接到 Git"
   - 选择您 Fork 的项目仓库
   - 点击 "开始设置"

3. **配置构建设置**
   - 项目名称：可自定义，如 `domain-management-system`
   - 生产分支：`main` (或您的主要分支名称)
   - 构建命令：`pnpm install --no-frozen-lockfile && pnpm build`
   - 构建输出目录：`dist/static`
   - 根目录：保持默认
   - 点击 "保存并部署"

4. **环境变量（如需）**
   - 如需配置环境变量，可以在项目设置的 "环境变量" 部分添加
   - 系统默认使用本地存储，不依赖外部数据库或API

5. **等待部署完成**
   - Cloudflare Pages 将自动开始构建和部署过程
   - 部署完成后，您将获得一个免费的 `*.pages.dev` 域名
   - 您可以通过此域名访问您的域名管理系统

## 访问系统
部署完成后，您可以：
1. 使用 Cloudflare Pages 提供的默认域名访问系统
2. 配置自定义域名（可选）
   - 在 Cloudflare Pages 项目设置中，点击 "自定义域"
   - 按照指引添加您自己的域名

## 默认登录凭据
- 用户名：`admin`
- 密码：`admin123`
- 建议首次登录后立即修改密码

## 常见问题解决

### 部署失败
- 确保构建命令设置为 `pnpm install --no-frozen-lockfile && pnpm build`
- 检查输出目录是否为 `dist/static`
- 查看构建日志以获取详细错误信息

### 功能无法正常使用
- 确保浏览器支持现代 JavaScript 特性
- 清除浏览器缓存后重试
- 检查浏览器控制台是否有错误信息

## 技术栈
- React 18+
- TypeScript
- Tailwind CSS
- Vite
- React Router
- Recharts (数据可视化)
- Lucide React (图标)
- LocalStorage (数据持久化)

## 注意事项
- 本系统使用浏览器本地存储来保存数据，请不要在清除浏览器数据时删除相关存储
- 如需更可靠的数据存储，建议自行扩展后端服务
- 系统默认支持中文界面

## 许可证
MIT License