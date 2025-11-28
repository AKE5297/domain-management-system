# 域名管理系统

> 一个功能强大、易于使用的域名资产管理系统，帮助您集中管理、监控和维护所有域名资产。

---

## 📋 目录

- [✨ 特性](#-特性)
- [🚀 快速开始](#-快速开始)
- [📖 使用指南](#-使用指南)
- [🔧 部署教程](#-部署教程)
  - [本地部署](#本地部署)
  - [Docker部署](#docker部署)
  - [NAS部署](#nas部署)
  - [Cloudflare Pages部署](#cloudflare-pages部署)
  - [GitHub Pages部署](#github-pages部署)
  - [服务器部署](#服务器部署)
- [🤝 如何贡献](#-如何贡献)
- [☕ 支持项目](#-支持项目)
- [📄 许可证](#-许可证)
- [📞 联系方式](#-联系方式)
- [🙏 致谢](#-致谢)


## ✨ 特性

- **完整的域名管理**：支持添加、编辑、删除和查看域名信息
- **域名状态监控**：自动检测域名是否活跃、即将到期或已过期
- **数据分析统计**：提供域名状态分布、服务商分布等数据可视化
- **续费日历**：以年/月/周视图展示域名到期时间
- **提醒通知系统**：支持域名到期和SSL证书到期提醒
- **ICP备案管理**：记录和管理域名的ICP备案信息
- **多平台部署**：支持本地、Docker、NAS、Cloudflare Pages、GitHub Pages等多种部署方式
- **响应式设计**：支持桌面和移动设备访问
- **深色模式**：支持浅色/深色主题切换


## 🚀 快速开始

### 前提条件

- 操作系统：Windows、macOS 或 Linux
- 运行环境：Node.js 18+
- 包管理器：pnpm
- 内存：建议至少 4GB
- 磁盘空间：至少 500MB


### 安装步骤

#### 方法一：直接安装

1. 克隆项目代码
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

4. 在浏览器中访问 `http://localhost:3000`


#### 方法二：Docker 安装

1. 克隆项目代码
   ```bash
   git clone https://github.com/AKE5297/domain-management-system.git
   cd domain-management-system
   ```

2. 构建并运行 Docker 容器
   ```bash
   docker-compose up -d
   ```

3. 在浏览器中访问 `http://localhost:3000`


## 📖 使用指南

### 基本用法

1. **登录系统**：使用默认账号 `admin` 和密码 `admin123` 登录
2. **添加域名**：点击"添加域名"按钮，填写域名信息并保存
3. **查看域名列表**：从侧边栏导航到"域名管理"查看所有域名
4. **编辑域名**：在域名列表中选择要编辑的域名，点击"编辑"按钮进行修改
5. **查看数据分析**：从侧边栏导航到"数据分析"查看各项统计数据


### 高级功能

#### 通知设置

- 在"系统设置"中配置邮件通知服务
- 设置域名和SSL证书到期提醒的时间点
- 启用/禁用每周汇总报告


## 🔧 部署教程

### 本地部署

1. 确保安装了 Node.js 18+ 和 pnpm
2. 克隆项目代码
   ```bash
   git clone https://github.com/AKE5297/domain-management-system.git
   cd domain-management-system
   ```
3. 安装依赖
   ```bash
   pnpm install
   ```
4. 构建项目
   ```bash
   pnpm build
   ```
5. 部署静态文件：将 `dist/static` 目录中的文件部署到您的Web服务器


### Docker部署

1. 克隆项目代码
   ```bash
   git clone https://github.com/AKE5297/domain-management-system.git
   cd domain-management-system
   ```
2. 查看 docker-compose.yml 文件（已配置好）
   ```yaml
   version: '3.8'

   services:
     domain-manager:
       build:
         context: .
         dockerfile: Dockerfile
       ports:
         - "3000:80"
       environment:
         - NODE_ENV=production
       restart: unless-stopped
       volumes:
         - ./nginx.conf:/etc/nginx/conf.d/default.conf:ro
   ```
   该配置会：
   - 构建包含应用的Docker镜像
   - 将容器的80端口映射到主机的3000端口
   - 设置容器在退出时自动重启
   - 将本地的nginx.conf挂载到容器中

3. 启动Docker容器
   ```bash
   docker-compose up -d
   ```


### NAS部署

1. 在NAS上安装Docker套件
2. 通过Docker Compose部署
   - 创建一个共享文件夹，如 `domain-manager`
   - 将项目中的 `docker-compose.yml` 和 `nginx.conf` 文件复制到该文件夹
   - 使用NAS的Docker界面或SSH执行：
     ```bash
     cd /volume1/docker/domain-manager
     docker-compose up -d
     ```
3. 通过NAS的IP地址和端口3000访问系统


### Cloudflare Pages部署

1. 确保已将代码推送到GitHub仓库
2. 登录Cloudflare账号，进入Pages页面
3. 点击"Create a project"，选择GitHub连接您的仓库
4. 配置构建设置：
   - 构建命令：`pnpm install --no-frozen-lockfile && pnpm build`
   - 构建输出目录：`dist/static`
5. 点击"Save and Deploy"开始部署
6. 部署完成后，可以通过Cloudflare提供的域名访问系统


### GitHub Pages部署

1. 确保已将代码推送到GitHub仓库
2. 修改 `vite.config.ts` 文件，添加正确的 `base` 配置
3. 在GitHub仓库设置中，启用GitHub Pages功能
4. 配置GitHub Actions工作流文件：
   ```yaml
   name: Deploy to GitHub Pages

   on:
     push:
       branches: [ main ]

   jobs:
     build-and-deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v2
         - uses: actions/setup-node@v2
           with:
             node-version: '18'
         - name: Install pnpm
           run: npm install -g pnpm
         - name: Install dependencies
           run: pnpm install --no-frozen-lockfile
         - name: Build
           run: pnpm build
         - name: Deploy
           uses: peaceiris/actions-gh-pages@v3
           with:
             github_token: ${{ secrets.GITHUB_TOKEN }}
             publish_dir: ./dist/static
   ```
5. 提交并推送工作流文件，GitHub Actions会自动构建和部署


### 服务器部署

1. 在服务器上安装Node.js 18+和Nginx
2. 克隆项目代码到服务器
   ```bash
   git clone https://github.com/AKE5297/domain-management-system.git
   cd domain-management-system
   ```
3. 安装依赖并构建项目
   ```bash
   pnpm install --no-frozen-lockfile
   pnpm build
   ```
4. 配置Nginx服务
   ```bash
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           root /path/to/domain-management-system/dist/static;
           index index.html index.htm;
           try_files $uri $uri/ /index.html;
       }
       
       error_page 404 /index.html;
   }
   ```
5. 重启Nginx服务
   ```bash
   systemctl restart nginx
   ```
6. 通过您的域名访问系统


## 🤝 如何贡献

### 开发环境搭建

1. 克隆项目代码
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


### 提交代码

1. 创建一个新的分支
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. 编写代码并提交
   ```bash
   git add .
   git commit -m "添加新功能：XXX"
   ```

3. 推送到远程仓库并创建Pull Request
   ```bash
   git push origin feature/your-feature-name
   ```


### 贡献类型

- 🐛 修复错误和问题
- 💡 提出新功能建议
- 📝 改进文档和使用指南
- 🔧 优化代码和性能
- 🎨 改进UI/UX设计


## ☕ 支持项目

### 一次性捐赠

| 支付宝 | 微信 |
|-------|------|
| ![支付宝收款码](https://github.com/user-attachments/assets/ce03a5fe-d2f5-4ff4-b8eb-e611aab43f95) | ![微信收款码](https://github.com/user-attachments/assets/1d3bae2a-4f7b-437b-9e79-d3fdfb80af75) |


### 定期赞助

如果您喜欢这个项目并希望持续支持它的开发，可以考虑成为定期赞助商。


## 📄 许可证

本项目基于 [Apache-2.0](LICENSE) 开源许可证。


## 📞 联系方式

- 作者: AKE5297
- 邮箱: 3276618864j@gmail.com
- 项目主页: [https://github.com/AKE5297/domain-management-system](https://github.com/AKE5297/domain-management-system)
- 问题反馈: [GitHub Issues](https://github.com/AKE5297/domain-management-system/issues)


## 🙏 致谢

感谢所有为这个项目做出贡献的开发者和支持者！

特别感谢以下技术和工具的支持：
- React 18+
- TypeScript
- Tailwind CSS
- Vite
- Recharts
- Docker

如果觉得这个项目有帮助，请给它一个 ⭐️ 支持！

> 一个功能完善的现代域名管理系统，帮助您集中管理、监控和跟踪所有域名资产，避免域名过期风险。

---

## 📋 目录

<!-- 根据项目实际情况调整目录结构 -->
- [✨ 特性](#-特性)
- [🚀 快速开始](#-快速开始)
- [📖 使用指南](#-使用指南)
- [🔧 部署教程](#-部署教程)
- [🤝 如何贡献](#-如何贡献)
- [☕ 支持项目](#-支持项目)
- [📄 许可证](#-许可证)
- [📞 联系方式](#-联系方式)
- [🙏 致谢](#-致谢)


## ✨ 特性

<!-- 在此列出项目的主要特性和功能 -->
- **🔍 域名集中管理**：统一管理所有域名资产，包括注册商、DNS提供商、到期日期等关键信息
- **📅 智能续费提醒**：自定义提醒时间点，及时通知域名和SSL证书到期信息
- **📊 数据可视化分析**：直观展示域名状态分布、到期趋势等关键指标
- **🗓️ 多视图日历**：通过年视图、月视图、周视图查看域名到期安排
- **🔒 安全存储**：本地存储确保数据安全，无需担心隐私泄露
- **🌓 响应式设计**：完美适配桌面和移动设备，支持浅色/深色主题切换


## 🚀 快速开始

### 前提条件

<!-- 在此填写系统要求和依赖 -->
- 操作系统：Windows、macOS、Linux
- 运行环境：Node.js 18+
- 内存：至少 2GB
- 磁盘空间：至少 1GB
- Docker（可选，用于容器部署）


### 安装步骤

#### 方法一：本地开发环境

1. 克隆项目仓库
```bash
git clone https://github.com/AKE5297/域名管理系统.git
cd 域名管理系统
```

2. 安装依赖
```bash
npm install -g pnpm
pnpm install
```

3. 启动开发服务器
```bash
pnpm dev
```

4. 访问系统
打开浏览器，访问 `http://localhost:3000`


#### 方法二：Docker容器部署

1. 克隆项目仓库
```bash
git clone https://github.com/AKE5297/域名管理系统.git
cd 域名管理系统
```

2. 使用Docker Compose启动
```bash
docker-compose up -d
```

3. 访问系统
打开浏览器，访问 `http://localhost:3000`


## 📖 使用指南

### 基本用法

1. **登录系统**
   - 默认账号：`admin`
   - 默认密码：`admin123`
   - 首次登录后建议修改密码

2. **添加域名**
   - 点击"添加域名"按钮
   - 填写域名信息，包括域名、注册商、DNS提供商、购买日期、到期日期等
   - 可选择性填写ICP备案信息

3. **管理域名**
   - 在域名列表中可以查看、编辑、删除所有域名
   - 使用搜索和筛选功能快速找到特定域名
   - 设置自动续费选项避免域名过期

4. **查看数据统计**
   - 在控制面板查看域名总数、活跃域名、即将到期等关键指标
   - 通过图表了解域名分布和到期趋势


### 高级功能

#### 通知设置

- 配置域名到期提醒时间点（30天、15天、7天、3天、1天）
- 设置邮件服务器以接收通知
- 启用SSL证书到期提醒功能

#### 系统偏好设置

- 切换浅色/深色主题
- 设置默认视图（控制面板、域名列表、续费日历）
- 配置数据自动刷新间隔


## 🔧 部署教程

<details>
<summary>本地部署</summary>

1. 确保已安装 Node.js 18+ 和 pnpm
2. 克隆代码仓库并进入目录
3. 执行 `pnpm install` 安装依赖
4. 执行 `pnpm build` 构建项目
5. 执行 `pnpm preview` 启动预览服务器
6. 访问 `http://localhost:4173` 查看部署效果
</details>

<details>
<summary>Docker容器部署</summary>

项目包含完整的 Dockerfile 和 docker-compose.yml 文件，可以直接使用容器化部署。

**docker-compose.yml 文件说明：**

```yaml
version: '3.8'  # Docker Compose 版本

services:
  domain-manager:  # 服务名称
    build:  # 构建配置
      context: .  # 构建上下文路径，当前目录
      dockerfile: Dockerfile  # 指定 Dockerfile
    ports:  # 端口映射，将容器的80端口映射到主机的3000端口
      - "3000:80"
    environment:  # 环境变量设置
      - NODE_ENV=production  # 设置为生产环境
    restart: unless-stopped  # 自动重启策略，除非手动停止
    volumes:  # 数据卷挂载，将本地的nginx.conf挂载到容器内
      - ./nginx.conf:/etc/nginx/conf.d/default.conf:ro
```

部署步骤：
1. 安装 Docker 和 Docker Compose
2. 克隆代码仓库并进入目录
3. 执行 `docker-compose up -d` 启动容器
4. 访问 `http://服务器IP:3000` 查看系统
</details>

<details>
<summary>NAS部署（群晖、飞牛OS等）</summary>

1. 登录您的 NAS 管理界面
2. 打开 Docker 应用
3. 点击"注册表"搜索 `nginx` 和 `node` 镜像并下载
4. 点击"容器"，使用 `docker-compose.yml` 文件创建容器
   - 上传项目中的 `docker-compose.yml` 和 `nginx.conf` 文件
   - 根据 NAS 界面提示配置参数
5. 启动容器后，通过 `http://NAS_IP:3000` 访问系统
</details>

<details>
<summary>服务器部署</summary>

1. 在服务器上安装 Node.js 18+ 和 pnpm
2. 克隆代码仓库
3. 安装依赖并构建项目
   ```bash
   pnpm install
   pnpm build
   ```
4. 使用 Nginx 配置静态文件服务
   - 将构建后的 `dist` 目录复制到 Nginx 网站根目录
   - 配置 Nginx 反向代理和静态文件服务
5. 启动 Nginx 服务
6. 访问您的服务器域名或 IP 地址查看系统
</details>

<details>
<summary>GitHub Pages 部署</summary>

1. 确保项目已上传至 GitHub 仓库
2. 在仓库设置中找到 "Pages" 选项
3. 选择部署源为 "GitHub Actions"
4. 创建 `.github/workflows/deploy.yml` 文件，添加构建和部署脚本
5. 提交更改后，GitHub Actions 将自动构建并部署到 GitHub Pages
6. 部署完成后，通过 `https://用户名.github.io/仓库名` 访问系统
</details>

<details>
<summary>Cloudflare Pages 部署</summary>

1. 登录 Cloudflare 账号
2. 在 Cloudflare Dashboard 中找到 "Pages" 选项
3. 点击 "Connect to Git" 连接您的 GitHub 仓库
4. 配置构建参数：
   - Framework preset: React
   - Build command: `pnpm build`
   - Build output directory: `dist`
   - Environment variables: 添加 `NODE_VERSION=18`
5. 点击 "Deploy site" 开始部署
6. 部署完成后，通过 Cloudflare 提供的域名访问系统
</details>

<details>
<summary>Cloudflare Workers 部署</summary>

1. 安装 Wrangler CLI
   ```bash
   npm install -g wrangler
   ```
2. 登录到 Cloudflare
   ```bash
   wrangler login
   ```
3. 初始化一个新的 Workers 项目
4. 将构建好的静态文件上传到 Workers
5. 配置路由规则
6. 部署 Workers
   ```bash
   wrangler deploy
   ```
7. 通过 Workers 域名访问系统
</details>


## 🤝 如何贡献

### 开发环境搭建

1. 克隆项目仓库
```bash
git clone https://github.com/AKE5297/域名管理系统.git
cd 域名管理系统
```

2. 安装依赖
```bash
npm install -g pnpm
pnpm install
```

3. 启动开发服务器
```bash
pnpm dev
```


### 提交代码

<details>
<summary>贡献指南</summary>

1. 创建新分支
```bash
git checkout -b feature/your-feature-name
```

2. 开发功能并提交代码
```bash
git add .
git commit -m "Add: 描述你的改动"
```

3. 推送到远程分支
```bash
git push origin feature/your-feature-name
```

4. 创建 Pull Request
</details>

### 贡献类型

- 🐛 报告 bug 或提交修复
- 💡 提交新功能建议或实现
- 📝 改进文档或添加使用示例


## ☕ 支持项目

### 一次性捐赠

如果您觉得这个项目对您有帮助，可以通过以下方式进行捐赠支持：

| 支付宝 | 微信支付 |
|--------|---------|
| <img src="https://github.com/user-attachments/assets/ce03a5fe-d2f5-4ff4-b8eb-e611aab43f95" alt="支付宝收款码" width="150"> | <img src="https://github.com/user-attachments/assets/1d3bae2a-4f7b-437b-9e79-d3fdfb80af75" alt="微信收款码" width="150"> |

### 定期赞助

您也可以通过 GitHub Sponsors 定期支持项目的开发和维护。


## 📄 许可证

本项目基于 [Apache-2.0](LICENSE) 开源。


## 📞 联系方式

- 作者: AKE5297
- 邮箱: 3276618864j@gmail.com
- 项目主页: [https://github.com/AKE5297/域名管理系统](https://github.com/AKE5297/域名管理系统)
- 问题反馈: [https://github.com/AKE5297/域名管理系统/issues](https://github.com/AKE5297/域名管理系统/issues)
- 讨论区: [https://github.com/AKE5297/域名管理系统/discussions](https://github.com/AKE5297/域名管理系统/discussions)


## 🙏 致谢

感谢所有为项目做出贡献的开发者和用户，以及以下开源项目的支持：

- React
- TypeScript
- Tailwind CSS
- Vite
- Recharts
- Lucide React

如果觉得这个项目有帮助，请给它一个 ⭐️