# 域名管理系统

> 一个功能强大、界面美观的域名管理系统，帮助您轻松管理、监控和跟踪所有域名资产。

---

## 📋 目录

- [✨ 特性](#-特性)
- [🚀 快速开始](#-快速开始)
- [📖 使用指南](#-使用指南)
- [🔧 部署教程](#-部署教程)
- [🤝 如何贡献](#-如何贡献)
- [☕ 支持项目](#-支持项目)
- [📄 许可证](#-许可证)
- [📞 联系方式](#-联系方式)


## ✨ 特性

- **域名管理**：添加、编辑、删除和查看所有域名信息，包括服务商、DNS托管商、到期日期等
- **状态监控**：实时监控域名状态（活跃、即将到期、已过期），避免因遗忘续费导致域名丢失
- **到期提醒**：自定义域名到期提醒时间，确保及时收到通知
- **数据可视化**：通过直观的图表展示域名分布和到期趋势
- **续费日历**：提供年、月、周多视图日历，查看域名到期安排
- **ICP备案管理**：记录和管理域名ICP备案信息
- **安全保障**：本地存储数据，确保信息安全
- **暗黑模式**：支持浅色和深色主题切换，提升使用体验


## 🚀 快速开始

### 前提条件

- 操作系统：Windows、macOS 或 Linux
- 运行环境：Node.js 18+
- 包管理器：pnpm 10+
- 内存：建议 4GB+
- 磁盘空间：至少 200MB


### 安装步骤

#### 方法一：本地开发环境

1. 克隆仓库
```bash
git clone https://github.com/AKE5297/domain-management-system.git
cd domain-management-system
```

2. 安装依赖
```bash
pnpm install --no-frozen-lockfile
```

3. 启动开发服务器
```bash
pnpm dev
```

4. 在浏览器中访问 [http://localhost:3000](http://localhost:3000)


#### 方法二：Docker 部署

1. 克隆仓库
```bash
git clone https://github.com/AKE5297/domain-management-system.git
cd domain-management-system
```

2. 使用 Docker Compose 启动
```bash
docker-compose up -d
```

3. 在浏览器中访问 [http://localhost:3000](http://localhost:3000)


## 📖 使用指南

### 基本用法

1. **登录系统**：使用默认账号 `admin` 和密码 `admin123` 登录系统
2. **添加域名**：点击"添加域名"按钮，填写域名信息并保存
3. **查看域名列表**：在"域名管理"页面查看所有已添加的域名
4. **设置提醒**：在"系统设置"中配置域名到期提醒选项
5. **查看数据分析**：在"数据分析"页面查看域名统计和图表


### 高级功能

#### 域名管理

- **批量操作**：支持批量搜索和筛选域名
- **自定义字段**：添加域名备注信息，记录重要事项
- **状态跟踪**：自动跟踪域名状态变化


#### 提醒设置

- **多级提醒**：支持设置多个提醒时间点（30天、15天、7天等）
- **邮件通知**：配置SMTP服务器，接收邮件提醒


## 🔧 部署教程

### 本地部署

按照"快速开始"中的方法一操作即可在本地部署开发版本。

### 生产环境部署

#### Docker 部署

1. 准备环境
```bash
git clone https://github.com/AKE5297/domain-management-system.git
cd domain-management-system
```

2. 构建Docker镜像
```bash
docker build -t domain-management-system .
```

3. 运行容器
```bash
docker run -p 3000:80 --name domain-management -d domain-management-system
```

4. 或者使用docker-compose
```bash
docker-compose up -d
```


#### NAS部署（群辉、飞牛OS等）

1. 在NAS上安装Docker
2. 通过Docker套件创建容器
3. 选择"从URL添加"，输入仓库地址：`https://github.com/AKE5297/domain-management-system.git`
4. 配置端口映射（主机端口:80）
5. 点击"应用"启动容器
6. 在浏览器中访问 `http://[NAS-IP]:[映射端口]`


#### 服务器部署

1. 登录您的服务器
2. 安装Node.js和pnpm
```bash
# 安装Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 安装pnpm
npm install -g pnpm
```

3. 克隆仓库并安装依赖
```bash
git clone https://github.com/AKE5297/domain-management-system.git
cd domain-management-system
pnpm install --no-frozen-lockfile
```

4. 构建项目
```bash
pnpm build
```

5. 使用Nginx托管静态文件
```bash
# 安装Nginx
sudo apt-get install nginx

# 复制构建好的文件到Nginx目录
sudo cp -r dist/static/* /var/www/html/

# 启动Nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

6. 在浏览器中访问您的服务器IP


#### GitHub Pages部署

1. 确保项目根目录有`.github/workflows`文件夹
2. 创建`deploy.yml`文件，内容如下：
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Use Node.js
        uses: actions/setup-node@v3
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

3. 提交并推送更改
4. 在GitHub仓库设置中启用GitHub Pages，选择`gh-pages`分支


#### Cloudflare Pages部署

1. 登录Cloudflare账户
2. 点击"Pages"，然后点击"Create a project"
3. 选择"Connect to Git"，连接您的GitHub仓库
4. 配置部署设置：
   - 框架预设：None
   - 构建命令：`pnpm install --no-frozen-lockfile && pnpm build`
   - 构建输出目录：`dist/static`
5. 点击"Save and Deploy"
6. 等待部署完成，访问分配的URL


#### Cloudflare Workers部署

1. 安装Wrangler CLI
```bash
npm install -g wrangler
```

2. 登录Cloudflare
```bash
wrangler login
```

3. 初始化项目
```bash
wrangler init domain-management-system
```

4. 编辑`wrangler.toml`文件：
```toml
name = "domain-management-system"
main = "index.js"
compatibility_date = "2024-06-01"

[site]
bucket = "./dist/static"
```

5. 构建项目并部署
```bash
pnpm build
wrangler publish
```


## 处理pnpm锁文件问题

### 常见问题：pnpm-lock.yaml 与 package.json 不匹配

在部署过程中，您可能会遇到以下错误：
```
ERR_PNPM_OUTDATED_LOCKFILE Cannot install with "frozen-lockfile" because pnpm-lock.yaml is not up to date with <ROOT>/package.json
```

### 解决方案

#### 方法一：使用非冻结锁文件构建（推荐用于CI/CD环境）

在构建命令中添加`--no-frozen-lockfile`参数：
```bash
pnpm install --no-frozen-lockfile && pnpm run build
```

#### 方法二：本地更新锁文件（推荐长期解决方案）

1. 拉取最新代码
```bash
git pull
```

2. 更新锁文件
```bash
pnpm install
```

3. 提交更新的锁文件
```bash
git add pnpm-lock.yaml
git commit -m "fix: update pnpm lockfile to match package.json"
git push
```


## 🤝 如何贡献

### 开发环境搭建

1. 克隆仓库
```bash
git clone https://github.com/AKE5297/domain-management-system.git
cd domain-management-system
```

2. 安装依赖
```bash
pnpm install --no-frozen-lockfile
```

3. 启动开发服务器
```bash
pnpm dev
```

### 提交代码

1. 创建新分支
```bash
git checkout -b feature/your-feature-name
```

2. 开发和测试功能
3. 提交代码
```bash
git add .
git commit -m "feat: 添加新功能描述"
git push origin feature/your-feature-name
```

4. 创建Pull Request

### 贡献类型

- 🐛 报告Bug
- 💡 提出功能建议
- 📝 改进文档


## ☕ 支持项目

### 一次性捐赠

| 支付宝 | 微信 |
|-------|------|
| ![支付宝收款码](https://github.com/user-attachments/assets/ce03a5fe-d2f5-4ff4-b8eb-e611aab43f95) | ![微信收款码](https://github.com/user-attachments/assets/1d3bae2a-4f7b-437b-9e79-d3fdfb80af75) |


## 📄 许可证

本项目基于 [Apache-2.0](LICENSE) 开源许可证。


## 📞 联系方式

- 作者: AKE5297
- 邮箱: 3276618864j@gmail.com
- 项目主页: [https://github.com/AKE5297/domain-management-system](https://github.com/AKE5297/domain-management-system)
- 问题反馈: [https://github.com/AKE5297/domain-management-system/issues](https://github.com/AKE5297/domain-management-system/issues)


感谢您使用域名管理系统！如果您觉得这个项目有帮助，请给它一个 ⭐️ 支持我们！