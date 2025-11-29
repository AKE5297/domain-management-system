# 域名管理系统

一个功能完善的域名管理系统，帮助用户管理和监控所有域名资产，包括到期提醒、SSL证书管理和数据分析。

## 技术栈

- React 18+
- TypeScript
- Tailwind CSS
- Vite
- React Router
- Recharts
- Lucide React (图标)
- Sonner (通知)
- Zod (表单验证)

## 快速开始

### 安装依赖

```bash
pnpm install
```

### 开发模式

```bash
pnpm dev
```

### 构建生产版本

```bash
pnpm build
```

## 功能特性

1. **域名管理**
   - 添加、编辑、删除域名
   - 查看域名详情
   - 域名状态监控（活跃、即将到期、已过期）

2. **数据分析**
   - 域名状态分布统计
   - 服务商分布分析
   - 月度到期分布图表
   - 域名活跃度和过期风险评估

3. **提醒功能**
   - 域名到期提醒
   - SSL证书到期提醒
   - 自定义提醒时间点
   - 邮件通知（需配置SMTP）

4. **界面功能**
   - 响应式设计
   - 浅色/深色主题切换
   - 控制面板仪表盘
   - 域名列表与筛选
   - 续费日历视图

## 项目结构

```
src/
├── components/        # 可复用组件
├── contexts/          # React Context
├── hooks/             # 自定义hooks
├── lib/               # 工具函数
├── pages/             # 页面组件
├── App.tsx            # 应用主组件
├── index.css          # 全局样式
└── main.tsx           # 入口文件
```

## 部署指南

### Cloudflare Pages 部署

1. **设置构建命令**
   ```bash
   pnpm install --no-frozen-lockfile && pnpm run build
   ```

2. **设置构建输出目录**
   ```
   dist/static
   ```

3. **环境配置**
   - 确保 `.npmrc` 文件中设置了 `frozen-lockfile=false`
   - 确保 `wrangler.toml` 配置正确

## 开发说明

1. 项目使用 Vite 构建工具，支持热重载
2. 使用 TypeScript 进行类型检查
3. 使用 Tailwind CSS 进行样式设计
4. 使用 localstorage 进行数据存储

## 登录凭证

默认登录凭证：
- 用户名: admin
- 密码: admin123