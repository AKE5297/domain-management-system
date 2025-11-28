import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '@/contexts/authContext';
import { 
  Search, Filter, Plus, X, ChevronDown, ArrowUpDown, 
  CheckCircle, AlertTriangle, Clock, Trash2, Edit3
} from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import { toast } from 'sonner';

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
  notes?: string;
  // ICP备案信息
  icpRecordNumber?: string;
  icpRecordStatus?: 'verified' | 'pending' | 'invalid' | 'none';
}

export default function DomainList() {
  const { logout } = useContext(AuthContext);
  const [domains, setDomains] = useState<DomainInfo[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortField, setSortField] = useState<keyof DomainInfo>('expiryDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // 加载域名数据
  useEffect(() => {
    // 模拟API加载延迟
    setTimeout(() => {
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
            notes: '公司主域名'
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
            notes: '测试环境域名'
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
            notes: '演示网站'
          },
          {
            id: '4',
            name: 'api-service.io',
            registrar: 'Namecheap',
            dnsProvider: 'Cloudflare',
            purchaseDate: '2023-09-05',
            expiryDate: '2025-09-05',
            autoRenew: true,
            status: 'active',
            notes: 'API服务端点'
          },
          {
            id: '5',
            name: 'blog-platform.com',
            registrar: '阿里云',
            dnsProvider: '阿里云DNS',
            purchaseDate: '2024-02-28',
            expiryDate: '2025-02-28',
            autoRenew: false,
            status: 'active',
            notes: '博客平台'
          }
        ];
        setDomains(mockDomains);
        localStorage.setItem('domains', JSON.stringify(mockDomains));
      }
      setIsLoading(false);
    }, 800);
  }, []);

  // 删除域名
  const handleDeleteDomain = (id: string) => {
    if (window.confirm('确定要删除这个域名吗？此操作无法撤销。')) {
      const updatedDomains = domains.filter(domain => domain.id !== id);
      setDomains(updatedDomains);
      localStorage.setItem('domains', JSON.stringify(updatedDomains));
      toast.success('域名已成功删除');
    }
  };

  // 应用搜索和筛选
  const filteredDomains = domains.filter(domain => {
    const matchesSearch = 
      domain.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      domain.registrar.toLowerCase().includes(searchTerm.toLowerCase()) ||
      domain.dnsProvider.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || domain.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  // 应用排序
  const sortedDomains = [...filteredDomains].sort((a, b) => {
    let comparison = 0;
    
    if (sortField === 'name') {
      comparison = a.name.localeCompare(b.name);
    } else if (sortField === 'registrar') {
      comparison = a.registrar.localeCompare(b.registrar);
    } else if (sortField === 'expiryDate') {
      comparison = new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime();
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  // 切换排序字段和顺序
  const toggleSort = (field: keyof DomainInfo) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // 获取状态对应的样式和图标
  const getStatusDetails = (status: string) => {
    switch (status) {
      case 'active':
        return {
          className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
          icon: <CheckCircle className="h-4 w-4 mr-1" />
        };
      case 'expiring-soon':
        return {
          className: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
          icon: <AlertTriangle className="h-4 w-4 mr-1" />
        };
      case 'expired':
        return {
          className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
          icon: <Clock className="h-4 w-4 mr-1" />
        };
      default:
        return {
          className: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
          icon: null
        };
    }
  };

  return (
     <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* 侧边栏 */}
      {sidebarOpen && (
        <Sidebar onLogout={logout} currentPage="/domains" />
      )}
      
      {/* 主内容区域 */}
      <div className={`flex-1 ${sidebarOpen ? 'ml-64' : 'ml-0'} transition-all duration-300`}>
        {/* 顶部导航栏 */}
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <i className={`fas ${sidebarOpen ? 'fa-times' : 'fa-bars'}`}></i>
              </button>
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">域名管理</h1>
            </div>
          </div>
      </header>
      
      {/* 主内容区域 */}
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* 页面标题和操作 */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">域名列表</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1">管理您的所有域名资产</p>
          </div>
          
          <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="搜索域名、服务商..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white w-full md:w-auto"
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition duration-200 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <Filter className="h-4 w-4 mr-2" />
              筛选
              <ChevronDown className={`h-4 w-4 ml-1 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
            
            <Link 
              to="/domains/add"
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-200"
            >
              <Plus className="h-4 w-4 mr-2" />
              添加域名
            </Link>
          </div>
        </div>
        
        {/* 筛选面板 */}
        {showFilters && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  状态
                </label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white"
                >
                  <option value="all">全部</option>
                  <option value="active">活跃</option>
                  <option value="expiring-soon">即将到期</option>
                  <option value="expired">已过期</option>
                </select>
              </div>
              
              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  快速筛选
                </label>
                <div className="flex flex-wrap gap-2">
                  <button 
                    onClick={() => {
                      setFilterStatus('active');
                      setShowFilters(false);
                    }}
                    className="px-3 py-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                  >
                    只看活跃域名
                  </button>
                  <button 
                    onClick={() => {
                      setFilterStatus('expiring-soon');
                      setShowFilters(false);
                    }}
                    className="px-3 py-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                  >
                    只看即将到期
                  </button>
                  <button 
                    onClick={() => {
                      setFilterStatus('expired');
                      setShowFilters(false);
                    }}
                    className="px-3 py-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                  >
                    只看已过期
                  </button>
                  <button 
                    onClick={() => {
                      setFilterStatus('all');
                      setSearchTerm('');
                      setShowFilters(false);
                    }}
                    className="px-3 py-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                  >
                    清除所有筛选
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* 域名列表表格 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden mb-8">
          {isLoading ? (
            // 加载状态
            <div className="py-16 flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-gray-500 dark:text-gray-400">加载域名数据中...</p>
            </div>
          ) : sortedDomains.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700 sticky top-0 z-10">
                  <tr>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                      onClick={() => toggleSort('name')}
                    >
                      <div className="flex items-center">
                        域名
                        <ArrowUpDown className="h-3 w-3 ml-1" />
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                      onClick={() => toggleSort('registrar')}
                    >
                      <div className="flex items-center">
                        服务商
                        <ArrowUpDown className="h-3 w-3 ml-1" />
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      DNS托管商
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      购买日期
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                      onClick={() => toggleSort('expiryDate')}
                    >
                      <div className="flex items-center">
                        到期日期
                        <ArrowUpDown className="h-3 w-3 ml-1" />
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      状态
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      自动续费
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      ICP备案
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {sortedDomains.map((domain) => {
                    const statusDetails = getStatusDetails(domain.status);
                    return (
                      <tr 
                        key={domain.id} 
                        className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                          domain.status === 'expired' ? 'bg-red-50 dark:bg-red-900/10' : ''
                        }`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Link 
                            to={`/domains/${domain.id}`}
                            className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            {domain.name}
                          </Link>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500 dark:text-gray-400">{domain.registrar}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500 dark:text-gray-400">{domain.dnsProvider}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500 dark:text-gray-400">{domain.purchaseDate}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500 dark:text-gray-400">{domain.expiryDate}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusDetails.className}`}>
                            {statusDetails.icon}
                            {domain.status === 'active' ? '活跃' : 
                             domain.status === 'expiring-soon' ? '即将到期' : '已过期'}
                          </span>
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
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              domain.icpRecordStatus === 'verified'
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                : domain.icpRecordStatus === 'pending'
                                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                                  : domain.icpRecordStatus === 'invalid'
                                    ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                            }`}>
                              {domain.icpRecordStatus === 'verified' ? '已备案' : 
                               domain.icpRecordStatus === 'pending' ? '审核中' : 
                               domain.icpRecordStatus === 'invalid' ? '未通过' : '未备案'}
                            </span>
                            {domain.icpRecordNumber && (
                              <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                                {domain.icpRecordNumber}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Link 
                            to={`/domains/edit/${domain.id}`}
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mr-3"
                          >
                            <Edit3 className="h-4 w-4 inline mr-1" />
                            编辑
                          </Link>
                          <button
                            onClick={() => handleDeleteDomain(domain.id)}
                            className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                            aria-label="删除"
                          >
                            <Trash2 className="h-4 w-4 inline mr-1" />
                            删除
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            // 空状态
            <div className="py-20 flex flex-col items-center justify-center">
              <div className="h-16 w-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">未找到域名</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4 text-center max-w-md">
                没有找到符合当前筛选条件的域名。尝试更改搜索条件或添加新域名。
              </p>
              <Link 
                to="/domains/add"
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-200"
              >
                <Plus className="h-4 w-4 mr-2" />
                添加域名
              </Link>
            </div>
          )}
        </div>
        
        {/* 分页控制 */}
        {!isLoading && sortedDomains.length > 0 && (
          <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 sm:px-6 rounded-xl shadow-sm">
            <div className="hidden sm:block">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                显示 <span className="font-medium">1</span> 到 <span className="font-medium">{sortedDomains.length}</span> 条，共 <span className="font-medium">{sortedDomains.length}</span> 条结果
              </p>
            </div>
            <div className="flex-1 flex justify-between sm:justify-end">
              <button
                disabled
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 opacity-50 cursor-not-allowed"
              >
                上一页
              </button>
              <button
                disabled
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 opacity-50 cursor-not-allowed"
              >
                下一页
              </button>
            </div>
          </div>
        )}
      </main>
      
      {/* 页脚 */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-6 mt-auto">
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