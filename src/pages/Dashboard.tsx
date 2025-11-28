import { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '@/contexts/authContext';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { 
  Globe, Bell, Search, Plus, Filter, 
  CalendarDays, Server, CheckCircle, AlertTriangle, Clock
} from 'lucide-react';
import Sidebar from '@/components/Sidebar';

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
}

export default function Dashboard() {
  const { logout } = useContext(AuthContext);
  const [domains, setDomains] = useState<DomainInfo[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
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
            icpRecordStatus: 'verified'
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
            icpRecordStatus: 'pending'
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
            icpRecordStatus: 'none'
          }
        ];
      setDomains(mockDomains);
      localStorage.setItem('domains', JSON.stringify(mockDomains));
    }
  }, []);

  // 计算统计数据
  const totalDomains = domains.length;
  const activeDomains = domains.filter(d => d.status === 'active').length;
  const expiringSoonDomains = domains.filter(d => d.status === 'expiring-soon').length;
  const expiredDomains = domains.filter(d => d.status === 'expired').length;
  
  // 准备图表数据
  const domainStatusData = [
    { name: '活跃', value: activeDomains, color: '#10b981' },
    { name: '即将到期', value: expiringSoonDomains, color: '#f59e0b' },
    { name: '已过期', value: expiredDomains, color: '#ef4444' }
  ];
  
  // 准备月度到期数据
  const expiryByMonthData = [
    { name: '1月', 数量: 3 },
    { name: '2月', 数量: 1 },
    { name: '3月', 数量: 2 },
    { name: '4月', 数量: 0 },
    { name: '5月', 数量: 1 },
    { name: '6月', 数量: 0 },
    { name: '7月', 数量: 2 },
    { name: '8月', 数量: 1 },
    { name: '9月', 数量: 0 },
    { name: '10月', 数量: 1 },
    { name: '11月', 数量: 0 },
    { name: '12月', 数量: 2 }
  ];
  
  // 获取即将到期的域名
  const upcomingExpirations = domains
    .filter(d => d.status === 'expiring-soon')
    .slice(0, 3);

  return (
     <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* 侧边栏 */}
      {sidebarOpen && (
        <Sidebar onLogout={logout} currentPage="/" />
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
              <Globe className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">控制面板</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <button className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                </button>
              </div>
            </div>
          </div>
        </header>
      
        {/* 主内容区域 */}
        <main className="flex-grow container mx-auto px-4 py-8">
          {/* 页面标题和操作 */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">控制面板</h2>
              <p className="text-gray-500 dark:text-gray-400 mt-1">管理和监控您的所有域名</p>
            </div>
            
            <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="搜索域名..." 
                  className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white w-full md:w-auto"
                />
              </div>
              
              <Link 
                to="/domains/add"
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-200"
              >
                <Plus className="h-4 w-4 mr-2" />
                添加域名
              </Link>
            </div>
          </div>
          
          {/* 统计卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700 transform hover:scale-105 transition-transform">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">域名总数</p>
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{totalDomains}</h3>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Globe className="h-6 w-6 text-blue-600 dark:text-blue-400" />
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
                  <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
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
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700 transform hover:scale-105 transition-transform">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">已过期</p>
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{expiredDomains}</h3>
                </div>
                <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
                  <Clock className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
              </div>
            </div>
          </div>
          
          {/* 图表和即将到期区域 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* 域名状态饼图 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700 lg:col-span-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">域名状态分布</h3>
              <ResponsiveContainer width="100%" height={250}>
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
              </ResponsiveContainer>
            </div>
            
            {/* 月度到期图表 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700 lg:col-span-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">月度到期分布</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart
                  data={expiryByMonthData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="数量" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* 即将到期的域名 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">即将到期的域名</h3>
              <Link 
                to="/domains"
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                查看全部
              </Link>
            </div>
            
            {upcomingExpirations.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">域名</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">服务商</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">到期日期</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">自动续费</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {upcomingExpirations.map((domain) => (
                      <tr key={domain.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{domain.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500 dark:text-gray-400">{domain.registrar}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500 dark:text-gray-400">{domain.expiryDate}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            domain.autoRenew 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                          }`}>
                            {domain.autoRenew ? '是' : '否'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                <CalendarDays className="mx-auto h-12 w-12 mb-4 text-gray-400" />
                <p>暂无即将到期的域名</p>
              </div>
            )}
          </div>
        </main>
        
        {/* 页脚 */}
         <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-6">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-gray-500 dark:text-gray-400 text-sm mb-4 md:mb-0">
                © 2025 域名管理系统. 保留所有权利.
              </div>
              <div className="flex items-center space-x-4">
                <Link to="#" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm">
                  帮助中心
                </Link>
                <Link to="#" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm">
                  隐私政策
                </Link>
                <Link to="#" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm">
                  使用条款
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}