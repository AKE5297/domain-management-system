# 域名管理系统 - 部署指南

## Cloudflare Pages 部署说明

### 已知问题修复

我已经修复了Cloudflare Pages部署过程中的主要问题，具体修改如下：

1. **wrangler.toml配置优化**：
   - 将`type`从`static`更改为`pages`以确保Cloudflare Pages正确识别
   - 简化了构建配置，使用标准的`output_dir`参数
   - 添加了正确的SPA路由重定向规则

2. **依赖安装优化**：
   - 在`.npmrc`中添加了`frozen-lockfile=false`，确保即使lockfile不匹配也能安装依赖
   - 优化了package.json中的构建脚本，添加了专用的`deploy`命令

3. **页面兼容性优化**：
   - 在`index.html`中添加了`<base href="/" />`标签，确保SPA路由正常工作
   - 添加了缓存控制元信息，优化Cloudflare Pages的缓存行为

### 部署步骤

1. 确保您的代码已推送到GitHub仓库
2. 登录Cloudflare账户，进入Pages部分
3. 点击"连接Git"按钮，选择您的域名管理系统仓库
4. 在配置页面：
   - 构建命令：`pnpm install --no-frozen-lockfile && pnpm build`
   - 构建输出目录：`dist/static`
   - 环境变量：确保设置了`NODE_ENV=production`
5. 点击"保存并部署"，等待构建完成

### 常见问题排查

- **依赖安装失败**：确保使用了`--no-frozen-lockfile`参数
- **路由问题**：检查`wrangler.toml`中的重定向规则是否正确
- **构建输出**：确认构建输出目录与`wrangler.toml`中的配置一致

如果您有任何部署问题，请随时联系支持团队。

一个功能完整的域名管理系统，帮助您轻松管理和监控所有域名资产，及时获取到期提醒，确保您的域名不会意外过期。

## 技术栈

- **前端框架**: React 18+
- **编程语言**: TypeScript
- **样式系统**: Tailwind CSS
- **路由**: React Router
- **图标**: Lucide React
- **图表**: Recharts
- **构建工具**: Vite
- **部署平台**: Cloudflare Pages
- **本地存储**: LocalStorage

## 快速开始

### 本地开发

1. 确保您已安装 Node.js 16 或更高版本
2. 克隆仓库
3. 安装依赖：
   ```bash
   pnpm install
   ```
4. 启动开发服务器：
   ```bash
   pnpm dev
   ```
5. 在浏览器中访问 `http://localhost:3000`

### 构建生产版本

```bash
pnpm build
```

构建后的文件将位于 `dist/static` 目录。

## 功能特性

### 核心功能
- 域名列表管理（添加、编辑、删除域名）
- 域名详细信息查看
- 到期日期跟踪
- 域名状态监控（活跃、即将到期、已过期）
- ICP备案信息管理
- 自动续费设置

### 高级功能
- 数据分析和可视化仪表板
- 多种视图模式（控制面板、列表、日历）
- 到期提醒系统
- 深色/浅色主题切换
- 本地数据存储

## 项目结构

```
├── src/              # 源代码目录
│   ├── components/   # 可复用组件
│   ├── contexts/     # React 上下文
│   ├── hooks/        # 自定义钩子
│   ├── lib/          # 工具函数
│   ├── pages/        # 页面组件
│   ├── App.tsx       # 应用入口组件
│   └── main.tsx      # 渲染入口
├── public/           # 静态资源
├── .gitignore        # Git忽略文件
├── .npmrc            # npm配置
├── package.json      # 项目依赖
├── tailwind.config.js # Tailwind配置
└── vite.config.ts    # Vite配置
```

## 部署指南

### Cloudflare Pages 部署

1. 登录 Cloudflare 账户并导航到 Pages 部分
2. 连接您的 GitHub 仓库
3. 配置构建设置：
   - 构建命令：`pnpm run cf-build` 或使用默认的 `pnpm install --no-frozen-lockfile && pnpm build`
   - 构建输出目录：`dist/static`
4. 点击"部署站点"按钮开始部署过程

### Docker 部署（可选）

项目包含 Dockerfile 和 docker-compose.yml 文件，支持使用 Docker 进行本地部署：

```bash
docker-compose up --build -d
```

然后在浏览器中访问 `http://localhost:3000`

## 登录凭证

默认情况下，您可以使用以下凭证登录：
- 用户名: admin
- 密码: admin123

## 注意事项

1. 系统数据存储在浏览器的 LocalStorage 中，请确保不要清除浏览器数据以保留您的域名信息
2. 为了确保接收到期提醒，请在设置中配置正确的邮箱服务
3. 在生产环境中，建议修改默认的管理员密码

## 支持与反馈

如果您在使用过程中遇到任何问题或有功能建议，请随时提交 issue 或联系我们的支持团队。

© 2025 域名管理系统 - 保留所有权利