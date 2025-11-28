import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '@/contexts/authContext';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BarChart3, PieChart as PieChartIcon, CalendarDays, Server, AlertTriangle } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import { cn } from '@/lib/utils';

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

export default function Analytics() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [domains, setDomains] = useState<DomainInfo[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [chartType, setChartType] = useState<'pie' | 'bar'>('pie');

  // 加载域名数据
  useEffect(() => {
    // 从localStorage加载域名数据，如果没有则使用模拟数据
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
  
  // 准备域名状态分布图表数据
  const domainStatusData = [
    { name: '活跃', value: activeDomains, color: '#10b981' },
    { name: '即将到期', value: expiringSoonDomains, color: '#f59e0b' },
    { name: '已过期', value: expiredDomains, color: '#ef4444' }
  ];

  // 准备按服务商分布的数据
  const registrarData = domains.reduce((acc, domain) => {
    if (acc[domain.registrar]) {
      acc[domain.registrar]++;
    } else {
      acc[domain.registrar] = 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const registrarChartData = Object.entries(registrarData).map(([name, value]) => ({
    name,
    count: value
  }));

  // 准备月度到期数据
  const monthlyExpiryData = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    const monthStr = month < 10 ? `0${month}` : `${month}`;
    
    // 过滤出当前月份到期的域名
    const count = domains.filter(domain => {
      const expiryMonth = domain.expiryDate.split('-')[1];
      return expiryMonth === monthStr;
    }).length;
    
    return { month: `${month}月`, count };
  });

  // 随机颜色生成函数
  const generateColor = (index: number) => {
    const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f97316', '#14b8a6', '#6366f1', '#10b981', '#f59e0b'];
    return colors[index % colors.length];
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* 侧边栏 */}
      {sidebarOpen && (
        <Sidebar onLogout={logout} currentPage="/analytics" />
      )}
      
      {/* 主内容区域 */}
      <div className={`flex-1 ${sidebarOpen ? 'ml-64' : 'ml-0'} transition-all duration-300`}>
        {/* 顶部导航栏 */}
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <i className={`fas ${sidebarOpen ? 'fa-times' : 'fa-bars'}`}></i>
              </button>
              <BarChart3 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">数据分析</h1>
            </div>
          </div>
        </header>
        
        {/* 主内容区域 */}
        <main className="flex-grow container mx-auto px-4 py-8">
          {/* 页面标题和操作 */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">数据分析</h2>
              <p className="text-gray-500 dark:text-gray-400 mt-1">深入了解您的域名资产情况</p>
            </div>
          </div>
          
          {/* 统计卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700 transform hover:scale-105 transition-transform">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">域名总数</p>
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{totalDomains}</h3>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Server className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700 transform hover:scale-105 transition-transform">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">活跃域名</p>
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{activeDomains}</h3>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700 transform hover:scale-105 transition-transform">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">即将到期</p>
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{expiringSoonDomains}</h3>
                </div>
                <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                  <AlertTriangle className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
              </div>
            </div>
          </div>
          
          {/* 域名状态分布图表 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700 mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">域名状态分布</h3>
              <div className="mt-4 md:mt-0 flex space-x-2">
                <button
                  onClick={() => setChartType('pie')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    chartType === 'pie' 
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' 
                      : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                  }`}
                >
                  <PieChartIcon className="h-4 w-4 inline mr-1" />
                  饼图
                </button>
                <button
                  onClick={() => setChartType('bar')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    chartType === 'bar' 
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' 
                      : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                  }`}
                >
                  <BarChart3 className="h-4 w-4 inline mr-1" />
                  柱状图
                </button>
              </div>
            </div>
            
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                {chartType === 'pie' ? (
                  <PieChart>
                    <Pie
                      data={domainStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {domainStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Legend />
                    <Tooltip />
                  </PieChart>
                ) : (
                  <BarChart
                    data={domainStatusData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" name="数量">
                      {domainStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* 服务商分布和月度到期分布 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* 服务商分布 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">按服务商分布</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={registrarChartData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    layout="vertical"
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" />
                    <Tooltip />
                    <Bar dataKey="count" name="域名数量">
                      {registrarChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={generateColor(index)} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            {/* 月度到期分布 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">月度到期分布</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={monthlyExpiryData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" name="到期数量" fill="#8b5cf6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          
          {/* 数据概览 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">数据概览</h3>
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">域名活跃度</h4>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {totalDomains > 0 ? Math.round((activeDomains / totalDomains) * 100) : 0}%
                  </p>
                </div>
                <div className="mt-4 md:mt-0 w-full md:w-1/2">
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
                    <div 
                      className="bg-green-600 dark:bg-green-500 h-2.5 rounded-full" 
                      style={{ width: `${totalDomains > 0 ? (activeDomains / totalDomains) * 100 : 0}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-1 text-xs text-gray-500 dark:text-gray-400">
                    <span>0%</span>
                    <span>100%</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">自动续费率</h4>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {totalDomains > 0 ? Math.round((domains.filter(d => d.autoRenew).length / totalDomains) * 100) : 0}%
                  </p>
                </div>
                <div className="mt-4 md:mt-0 w-full md:w-1/2">
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
                    <div 
                      className="bg-blue-600 dark:bg-blue-500 h-2.5 rounded-full" 
                      style={{ width: `${totalDomains > 0 ? (domains.filter(d => d.autoRenew).length / totalDomains) * 100 : 0}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-1 text-xs text-gray-500 dark:text-gray-400">
                    <span>0%</span>
                    <span>100%</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">过期风险</h4>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {totalDomains > 0 ? Math.round(((expiredDomains + expiringSoonDomains) / totalDomains) * 100) : 0}%
                  </p>
                </div>
                <div className="mt-4 md:mt-0 w-full md:w-1/2">
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
                    <div 
                      className={`h-2.5 rounded-full ${
                        totalDomains > 0 && ((expiredDomains + expiringSoonDomains) / totalDomains) * 100 > 50
                          ? 'bg-red-600 dark:bg-red-500'
                          : 'bg-amber-600 dark:bg-amber-500'
                      }`} 
                      style={{ width: `${totalDomains > 0 ? ((expiredDomains + expiringSoonDomains) / totalDomains) * 100 : 0}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-1 text-xs text-gray-500 dark:text-gray-400">
                    <span>低风险</span>
                    <span>高风险</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        
        {/* 页脚 */}
        <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-6 mt-auto">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-gray-500 dark:text-gray-400 text-sm mb-4 md:mb-0">
                © 2025 域名管理系统. 保留所有权利.
              </div>
              <div className="flex items-center space-x-4">
                <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm">
                  帮助中心
                </a>
                <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm">
                  隐私政策
                </a>
                <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm">
                  使用条款
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}