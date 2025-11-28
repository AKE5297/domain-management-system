import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  CalendarDays, Server, CheckCircle, AlertTriangle, Clock, 
  Edit3, ArrowLeft, Info, Globe, Shield, AlertCircle
} from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import { AuthContext } from '@/contexts/authContext';
import { useContext } from 'react';
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
  createdAt: string;
  updatedAt: string;
  // ICP备案信息
  icpRecordNumber?: string;
  icpRecordStatus?: 'verified' | 'pending' | 'invalid' | 'none';
}

export default function DomainDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const [domain, setDomain] = useState<DomainInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // 加载域名详情
  useEffect(() => {
    // 模拟API加载延迟
    setTimeout(() => {
      // 从localStorage加载域名数据
      const savedDomains = localStorage.getItem('domains');
      if (savedDomains) {
        const domains = JSON.parse(savedDomains) as DomainInfo[];
        const foundDomain = domains.find(d => d.id === id);
        
        if (foundDomain) {
          setDomain(foundDomain);
        } else {
          // 如果找不到域名，使用模拟数据
          const mockDomain: DomainInfo = {
            id: id || '1',
            name: 'example.com',
            registrar: '阿里云',
            dnsProvider: 'Cloudflare',
            purchaseDate: '2024-01-15',
            expiryDate: '2025-01-15',
            autoRenew: true,
            status: 'active',
            notes: '公司主域名',
            createdAt: '2024-01-15T10:00:00Z',
            updatedAt: '2024-06-10T15:30:00Z',
            icpRecordNumber: '京ICP备12345678号',
            icpRecordStatus: 'verified'
          };
          setDomain(mockDomain);
        }
      }
      setIsLoading(false);
    }, 800);
  }, [id]);
  
  // 计算域名有效期还剩多少天
  const getDaysRemaining = () => {
    if (!domain) return 0;
    
    const today = new Date();
    const expiryDate = new Date(domain.expiryDate);
    const timeDiff = expiryDate.getTime() - today.getTime();
    const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    return daysRemaining;
  };
  
  // 获取状态对应的样式和图标
  const getStatusDetails = (status: string) => {
    switch (status) {
      case 'active':
        return {
          className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
          icon: <CheckCircle className="h-4 w-4 mr-1" />,
          label: '活跃'
        };
      case 'expiring-soon':
        return {
          className: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
          icon: <AlertTriangle className="h-4 w-4 mr-1" />,
          label: '即将到期'
        };
      case 'expired':
        return {
          className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
          icon: <Clock className="h-4 w-4 mr-1" />,
          label: '已过期'
        };
      default:
        return {
          className: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
          icon: null,
          label: '未知'
        };
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="container mx-auto px-4 py-4">
            <button 
              onClick={() => navigate(-1)} 
              className="inline-flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              返回
            </button>
          </div>
        </header>
        
        <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-500 dark:text-gray-400">加载域名详情中...</p>
        </main>
      </div>
    );
  }
  
  if (!domain) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="container mx-auto px-4 py-4">
            <button 
              onClick={() => navigate(-1)} 
              className="inline-flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              返回
            </button>
          </div>
        </header>
        
        <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">域名不存在</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">找不到ID为 {id} 的域名</p>
            <Link 
              to="/domains" 
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-200"
            >
              查看域名列表
            </Link>
          </div>
        </main>
      </div>
    );
  }
  
  const statusDetails = getStatusDetails(domain.status);
  const daysRemaining = getDaysRemaining();
  
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
          <div className="container mx-auto px-4 py-4 flex items-center">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors mr-2"
            >
              <i className={`fas ${sidebarOpen ? 'fa-times' : 'fa-bars'}`}></i>
            </button>
            <button 
              onClick={() => navigate(-1)} 
              className="inline-flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              返回
            </button>
          </div>
      </header>
      
      {/* 主内容区域 */}
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* 域名头部信息 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center mb-2"><h2 className="text-2xl font-bold text-gray-900 dark:text-white">{domain.name}</h2>
                <span className={`ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusDetails.className}`}>
                  {statusDetails.icon}
                  {statusDetails.label}
                </span>
              </div>
              {domain.status === 'expiring-soon' && (
                <div className="flex items-center text-amber-600 dark:text-amber-400 text-sm">
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  <span>将在 {daysRemaining} 天后到期</span>
                </div>
              )}
              {domain.status === 'expired' && (
                <div className="flex items-center text-red-600 dark:text-red-400 text-sm">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>已过期 {Math.abs(daysRemaining)} 天</span>
                </div>
              )}
              {domain.status === 'active' && daysRemaining <= 30 && daysRemaining > 0 && (
                <div className="flex items-center text-amber-600 dark:text-amber-400 text-sm">
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  <span>将在 {daysRemaining} 天后到期</span>
                </div>
              )}
            </div>
            
            <div className="mt-4 md:mt-0">
              <Link 
                to={`/domains/edit/${domain.id}`}
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-200"
              >
                <Edit3 className="h-4 w-4 mr-2" />
                编辑域名
              </Link>
            </div>
          </div>
        </div>
        
        {/* 域名详情信息 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* 基本信息 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Info className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
              基本信息
            </h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">域名</h4>
                <p className="text-gray-900 dark:text-white">{domain.name}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">服务商</h4>
                <p className="text-gray-900 dark:text-white">{domain.registrar}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">DNS托管商</h4>
                <p className="text-gray-900 dark:text-white">{domain.dnsProvider}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">自动续费</h4>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  domain.autoRenew 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                }`}>
                  {domain.autoRenew ? '是' : '否'}
                </span>
              </div>

              {/* ICP备案信息 */}
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">ICP备案</h4>
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
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      {domain.icpRecordNumber}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* 时间信息 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <CalendarDays className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
              时间信息
            </h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">购买日期</h4>
                <p className="text-gray-900 dark:text-white">{domain.purchaseDate}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">到期日期</h4>
                <p className="text-gray-900 dark:text-white">{domain.expiryDate}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">有效期</h4>
                <p className="text-gray-900 dark:text-white">
                  {daysRemaining > 0 
                    ? `还有 ${daysRemaining} 天` 
                    : daysRemaining === 0 
                      ? '今天到期' 
                      : `已过期 ${Math.abs(daysRemaining)} 天`
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* 备注信息 */}
        {domain.notes && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">备注</h3>
            <p className="text-gray-900 dark:text-white whitespace-pre-wrap">{domain.notes}</p>
          </div>
        )}
        
        {/* 操作建议 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Shield className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
            操作建议
          </h3>
          
          <div className="space-y-4">
            {domain.status === 'expiring-soon' && (
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-amber-800 dark:text-amber-300">域名即将到期</h4>
                    <div className="mt-2 text-sm text-amber-700 dark:text-amber-400">
                      <p>建议您及时续费，避免域名过期导致服务中断。</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {domain.status === 'expired' && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-red-800 dark:text-red-300">域名已过期</h4>
                    <div className="mt-2 text-sm text-red-700 dark:text-red-400">
                      <p>请尽快联系域名服务商进行续费，过期时间越长，恢复难度越大。</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {!domain.autoRenew && domain.status === 'active' && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 rounded-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <Info className="h-5 w-5 text-blue-500" />
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300">自动续费未开启</h4>
                    <div className="mt-2 text-sm text-blue-700 dark:text-blue-400">
                      <p>建议开启自动续费功能，避免因遗忘导致域名过期。</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {domain.status === 'active' && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/50 rounded-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-green-800 dark:text-green-300">域名状态正常</h4>
                    <div className="mt-2 text-sm text-green-700 dark:text-green-400">
                      <p>建议定期检查域名解析状态，确保网站正常访问。</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* 快速操作 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Globe className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
            快速操作
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <a 
              href={`http://${domain.name}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-center"
            >
              <Globe className="h-8 w-8 text-blue-600 dark:text-blue-400 mb-2" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">访问网站</span>
            </a>
            
            <button 
              onClick={() => {
                navigator.clipboard.writeText(domain.name);
                toast.success('域名已复制到剪贴板');
              }}
              className="flex flex-col items-center justify-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-center"
            >
              <Server className="h-8 w-8 text-blue-600 dark:text-blue-400 mb-2" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">复制域名</span>
            </button>
            
            <Link 
              to={`/domains/edit/${domain.id}`}
              className="flex flex-col items-center justify-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-center"
            >
              <Edit3 className="h-8 w-8 text-blue-600 dark:text-blue-400 mb-2" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">编辑信息</span>
            </Link>
            
            <button 
              onClick={() => {
                if (window.confirm('确定要删除这个域名吗？此操作无法撤销。')) {
                  // 从localStorage中删除域名
                  const savedDomains = localStorage.getItem('domains');
                  if (savedDomains) {
                    const domains = JSON.parse(savedDomains) as DomainInfo[];
                    const updatedDomains = domains.filter(d => d.id !== domain.id);
                    localStorage.setItem('domains', JSON.stringify(updatedDomains));
                  }
                  toast.success('域名已成功删除');
                  navigate('/domains');
                }
              }}
              className="flex flex-col items-center justify-center p-4 border border-red-200 dark:border-red-800/50 bg-red-50 dark:bg-red-900/10 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors text-center"
            >
              <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400 mb-2" />
              <span className="text-sm font-medium text-red-900 dark:text-red-300">删除域名</span>
            </button>
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