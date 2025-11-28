import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// 格式化日期
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}

// 计算两个日期之间的天数
export function daysBetween(startDate: string, endDate: string): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const timeDiff = end.getTime() - start.getTime();
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
}

// 生成唯一ID
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// 验证域名格式
export function isValidDomain(domain: string): boolean {
  const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/;
  return domainRegex.test(domain);
}

// 检查域名是否即将到期
export function checkDomainExpiry(domain: { expiryDate: string }, days: number = 30): boolean {
  const today = new Date();
  const expiryDate = new Date(domain.expiryDate);
  const timeDiff = expiryDate.getTime() - today.getTime();
  const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));
  return daysRemaining > 0 && daysRemaining <= days;
}

// 发送通知（模拟）
export function sendNotification(email: string, subject: string, message: string): void {
  // 实际应用中应该调用邮件发送API
  console.log(`发送通知到 ${email}:`);
  console.log(`主题: ${subject}`);
  console.log(`内容: ${message}`);
  // 这里可以集成实际的邮件发送服务
}
