# 域名管理系统

## Cloudflare Pages 部署指南

### 前提条件
- GitHub/GitLab 账号
- Cloudflare 账号
- 项目已推送到 GitHub/GitLab 仓库

### 详细步骤

1. **登录 Cloudflare 账号**
   - 访问 [Cloudflare 官网](https://dash.cloudflare.com/) 并登录
   - 导航到 Pages 部分

2. **创建新项目**
   - 点击 "Create a project" 按钮
   - 选择 "Connect to Git" 选项
   - 授权 Cloudflare 访问您的 GitHub/GitLab 仓库
   - 选择要部署的域名管理系统仓库

3. **配置构建设置**
   - **Production branch**: 选择您的主分支（通常是 main 或 master）
   - **Build command**: `npm install && npm run build`
   - **Build output directory**: `dist/static`
   - **Environment variables**: 如有需要，添加必要的环境变量

4. **部署项目**
   - 点击 "Save and Deploy" 按钮
   - Cloudflare Pages 将自动开始构建和部署您的项目
   - 部署完成后，您将获得一个 `*.pages.dev` 域名

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