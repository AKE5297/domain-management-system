# 第一阶段：构建React应用
FROM node:18-alpine AS builder

# 设置工作目录
WORKDIR /app

# 复制package.json
COPY package.json ./

# 安装依赖管理工具
RUN npm install -g pnpm npm-force-resolutions

# 安装项目依赖
RUN pnpm install --no-frozen-lockfile

# 复制所有源代码
COPY . .

# 构建应用
RUN pnpm build

# 第二阶段：使用Nginx提供静态资源
FROM nginx:1.25-alpine

# 复制构建产物到Nginx的html目录
COPY --from=builder /app/dist/static /usr/share/nginx/html

# 复制自定义Nginx配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 暴露80端口
EXPOSE 80

# 启动Nginx
CMD ["nginx", "-g", "daemon off;"]