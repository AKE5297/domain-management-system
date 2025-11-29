# 域名管理系统

一个现代化的域名管理系统，帮助用户轻松管理和监控所有域名资产。

## 功能特性

- 域名列表管理（添加、编辑、删除、查看详情）
- 域名状态监控（活跃、即将到期、已过期）
- 数据分析和可视化图表
- 续费日历视图（年视图、月视图、周视图）
- 域名到期提醒通知
- 支持ICP备案信息管理
- 深色/浅色主题切换
- 本地数据存储

## 技术栈

- React 18+
- TypeScript
- Tailwind CSS
- React Router
- Recharts (数据可视化)
- Lucide React (图标)
- PNPM (包管理)

## 本地开发

### 前提条件

- Node.js >= 16.0.0
- PNPM

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

4. 构建项目
```bash
pnpm build
```

## Cloudflare Pages 部署指南

### 自动部署配置

1. 登录Cloudflare账号，进入Pages控制台
2. 连接您的GitHub仓库
3. 配置构建设置：
   - 框架预设：None
   - 构建命令：`pnpm install && pnpm build`
   - 构建输出目录：`dist`
4. 点击"开始部署"

### 环境变量（可选）

目前项目使用本地存储，不需要特别的环境变量配置。

### 部署常见问题

1. **锁文件不匹配错误**
   - 问题：`ERR_PNPM_OUTDATED_LOCKFILE`
   - 解决方案：项目已配置`.npmrc`文件中的`frozen-lockfile=false`，解决了锁文件不匹配问题

2. **依赖安装失败**
   - 确保使用PNPM作为包管理器
   - 如遇到问题，尝试修改构建命令为：`pnpm install --no-frozen-lockfile && pnpm build`

## 使用说明

### 默认登录凭证
- 用户名：admin
- 密码：admin123

### 主要功能使用
1. **控制面板**：查看域名概览和统计信息
2. **域名管理**：添加、编辑和删除域名
3. **数据分析**：查看域名状态分布和趋势
4. **续费日历**：通过日历视图查看域名到期时间
5. **系统设置**：配置通知、邮箱服务和偏好设置

## 许可证

MIT License