# 域名管理系统 - 部署指南

## Cloudflare Pages 部署指南

本指南将帮助您在Cloudflare Pages上成功部署域名管理系统。

### 配置文件说明

项目中已经包含了完整的Cloudflare Pages配置：

1. **wrangler.toml** - Cloudflare Pages配置文件，包含：
   - 构建命令：`pnpm install --no-frozen-lockfile && pnpm build`
   - 输出目录：`dist/static`
   - SPA路由支持配置
   - 缓存控制配置

2. **package.json** - 包含专用部署脚本：
   - `deploy` 脚本：使用 `--no-frozen-lockfile` 参数确保依赖安装成功
   - `cf-build` 脚本：Cloudflare Pages专用构建命令

### 部署步骤

1. **准备工作**
   - 确保您的代码已推送到GitHub/GitLab等代码仓库
   - 拥有一个Cloudflare账号

2. **创建Cloudflare Pages项目**
   - 登录Cloudflare控制台
   - 导航到Pages部分
   - 点击"创建项目"
   - 连接您的代码仓库
   - 选择主分支

3. **配置构建设置**
   - 框架预设：选择"None"
   - 构建命令：`pnpm install --no-frozen-lockfile && pnpm build`
   - 构建输出目录：`dist/static`
   - 环境变量：无需额外配置

4. **部署完成**
   - 点击"部署站点"
   - Cloudflare将自动构建和部署您的应用
   - 部署成功后，您将获得一个临时域名

### 重要注意事项

1. **锁文件问题**：项目使用了`--no-frozen-lockfile`参数以避免依赖安装时的锁文件版本不匹配问题
2. **SPA路由**：配置了适当的重定向规则确保单页应用路由正常工作
3. **缓存控制**：设置了适当的缓存策略确保用户总是获取最新版本

### 本地开发

如需本地开发和测试，请使用以下命令：

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

### Docker部署（可选）

项目还支持使用Docker进行部署：

```bash
# 构建Docker镜像
docker-compose build

# 启动容器
docker-compose up -d
```

应用将在 http://localhost:3000 访问。