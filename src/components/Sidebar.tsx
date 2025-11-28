import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Globe, Bell, Search, Plus, Filter, LogOut, 
  CalendarDays, Server, CheckCircle, AlertTriangle, Clock,
  BarChart3, PieChart, Settings, User, HelpCircle
} from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

// 定义域名接口
interface DomainInfo {
  id: string;
  name: string;
  registrar: string;
  dnsProvider: string;
  purchaseDate: string;
  expiryDate: string;
  autoRenew: boolean;
  status: 'active' | 'expired' | 'expiring-soon';
  icpRecordNumber?: string;
  icpRecordStatus?: 'verified' | 'pending' | 'invalid' | 'none';
  sslCertificate?: {
    provider: string;
    issueDate: string;
    expiryDate: string;
    status: 'valid' | 'expiring-soon' | 'expired';
    autoRenew: boolean;
  };
}

interface SidebarProps {
  onLogout: () => void;
  currentPage: string;
}

const Sidebar: React.FC<SidebarProps> = ({ onLogout, currentPage }) => {
  const { theme, toggleTheme } = useTheme();
  const [domains, setDomains] = useState<DomainInfo[]>([]);
  
  // 加载域名数据
  useEffect(() => {
    // 从localStorage加载域名数据
    const savedDomains = localStorage.getItem('domains');
    if (savedDomains) {
      setDomains(JSON.parse(savedDomains));
    } else {
      // 使用模拟数据
        const mockDomains: DomainInfo[] = [
          {
            id: '1',
            name: 'example.com',
            registrar: '阿里云',
            dnsProvider: 'Cloudflare',
            purchaseDate: '2024-01-15',
            expiryDate: '2025-01-15',
            autoRenew: true,
            status: 'active',
            icpRecordNumber: '京ICP备12345678号',
            icpRecordStatus: 'verified',
            sslCertificate: {
              provider: 'Let\'s Encrypt',
              issueDate: '2024-01-15',
              expiryDate: '2024-10-15',
              status: 'valid',
              autoRenew: true
            }
          },
          {
            id: '2',
            name: 'test-domain.org',
            registrar: '腾讯云',
            dnsProvider: 'DNSPod',
            purchaseDate: '2023-06-20',
            expiryDate: '2024-12-20',
            autoRenew: false,
            status: 'expiring-soon',
            icpRecordNumber: '',
            icpRecordStatus: 'pending',
            sslCertificate: {
              provider: 'DigiCert',
              issueDate: '2023-06-20',
              expiryDate: '2024-09-20',
              status: 'expiring-soon',
              autoRenew: false
            }
          },
          {
            id: '3',
            name: 'demo-site.net',
            registrar: 'GoDaddy',
            dnsProvider: 'Route 53',
            purchaseDate: '2022-03-10',
            expiryDate: '2024-03-10',
            autoRenew: true,
            status: 'expired',
            icpRecordNumber: '',
            icpRecordStatus: 'none',
            sslCertificate: {
              provider: 'Comodo',
              issueDate: '2022-03-10',
              expiryDate: '2024-03-10',
              status: 'expired',
              autoRenew: true
            }
          }
        ];
      setDomains(mockDomains);
    }
  }, []);

  // 计算统计数据
  const totalDomains = domains.length;
  const activeDomains = domains.filter(d => d.status === 'active').length;
  const expiringSoonDomains = domains.filter(d => d.status === 'expiring-soon').length;
  const expiredDomains = domains.filter(d => d.status === 'expired').length;

  // 导航菜单项
  const navItems = [
    { icon: <BarChart3 className="h-5 w-5" />, label: '控制面板', path: '/' },
    { icon: <Globe className="h-5 w-5" />, label: '域名管理', path: '/domains' },
    { icon: <PieChart className="h-5 w-5" />, label: '数据分析', path: '/analytics' },
    { icon: <CalendarDays className="h-5 w-5" />, label: '续费日历', path: '/calendar' },
    { icon: <Settings className="h-5 w-5" />, label: '系统设置', path: '/settings' },
  ];

  // 服务快捷方式
  const quickServices = [
    { icon: <Plus className="h-4 w-4" />, label: '添加域名', path: '/domains/add' },
    { icon: <Search className="h-4 w-4" />, label: '搜索域名', action: 'search' },
    { icon: <Bell className="h-4 w-4" />, label: '提醒设置', path: '/settings/reminders' },
  ];

  return (
    <div className="w-64 h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col fixed left-0 top-0 z-20 shadow-md">
      {/* 顶部Logo和标题 */}
      <div className="p-5 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <Globe className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">域名管理</h1>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">管理您的数字资产</p>
      </div>

      {/* 主要导航 */}
      <nav className="flex-grow py-4">
        <div className="px-4 mb-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          主导航
        </div>
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                  currentPage === item.path
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* 域名统计 */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="px-2 mb-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          域名统计
        </div>
        <div className="space-y-3">
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">总域名</span>
              <span className="text-lg font-bold text-gray-900 dark:text-white">{totalDomains}</span>
            </div>
            <div className="flex space-x-2 mt-2">
              <div className="flex items-center">
                <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                <span className="text-xs text-gray-500 dark:text-gray-400">{activeDomains}</span>
              </div>
              <div className="flex items-center">
                <AlertTriangle className="h-3 w-3 text-amber-500 mr-1" />
                <span className="text-xs text-gray-500 dark:text-gray-400">{expiringSoonDomains}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-3 w-3 text-red-500 mr-1" />
                <span className="text-xs text-gray-500 dark:text-gray-400">{expiredDomains}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 快速操作 */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="px-2 mb-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          快速操作
        </div>
        <div className="space-y-2">
          {quickServices.map((service) => {
            if (service.path) {
              return (
                <Link
                  key={service.path}
                  to={service.path}
                  className="flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-md transition-colors"
                >
                  <span className="mr-2">{service.icon}</span>
                  {service.label}
                </Link>
              );
            } else if (service.action === 'search') {
              return (
                <div 
                  key={service.action}
                  className="relative px-3 py-2 text-sm text-gray-700 dark:text-gray-300 rounded-md"
                >
                  <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="搜索域名..." 
                    className="pl-10 pr-4 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm w-full"
                  />
                </div>
              );
            }
            return null;
          })}
        </div>
      </div>

      {/* 底部用户区域 */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900 dark:text-white">管理员</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">admin@example.com</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label={theme === 'light' ? '切换到暗色模式' : '切换到亮色模式'}
          >
             <i className={`fas ${theme === 'light' ? 'fa-moon' : 'fa-sun'}`}></i>
          </button>
          <button 
            onClick={onLogout}
            className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="退出"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;