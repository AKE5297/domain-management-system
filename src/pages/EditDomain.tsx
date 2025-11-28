import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '@/contexts/authContext';
import { ArrowLeft, Save } from 'lucide-react';
import { toast } from 'sonner';
import Sidebar from '@/components/Sidebar';
import { z } from 'zod';

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

// 表单验证模式
const domainSchema = z.object({
  name: z.string()
    .min(3, "域名至少需要3个字符")
    .max(63, "域名不能超过63个字符")
    .regex(/^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/, "请输入有效的域名格式"),
  registrar: z.string()
    .min(1, "请输入服务商名称"),
  dnsProvider: z.string()
    .min(1, "请输入DNS托管商名称"),
  purchaseDate: z.string()
    .min(1, "请选择购买日期"),
  expiryDate: z.string()
    .min(1, "请选择到期日期"),
  autoRenew: z.boolean(),
  notes: z.string().optional(),
  // ICP备案信息（非必填）
  icpRecordNumber: z.string().optional(),
  icpRecordStatus: z.enum(['verified', 'pending', 'invalid', 'none']).optional().default('none')
});

type DomainFormData = z.infer<typeof domainSchema>;

export default function EditDomain() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const [formData, setFormData] = useState<DomainFormData>({
    name: '',
    registrar: '',
    dnsProvider: '',
    purchaseDate: '',
    expiryDate: '',
    autoRenew: false,
    notes: '',
    icpRecordNumber: '',
    icpRecordStatus: 'none'
  });
  
  const [errors, setErrors] = useState<Partial<Record<keyof DomainFormData, string>>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 加载域名数据
  useEffect(() => {
    // 模拟API加载延迟
    setTimeout(() => {
      // 从localStorage加载域名数据
      const savedDomains = localStorage.getItem('domains');
      
      if (savedDomains) {
        const domains = JSON.parse(savedDomains) as DomainInfo[];
        const domain = domains.find(d => d.id === id);
        
        if (domain) {
          setFormData({
            name: domain.name,
            registrar: domain.registrar,
            dnsProvider: domain.dnsProvider,
            purchaseDate: domain.purchaseDate,
            expiryDate: domain.expiryDate,
            autoRenew: domain.autoRenew,
            notes: domain.notes || '',
            icpRecordNumber: domain.icpRecordNumber || '',
            icpRecordStatus: domain.icpRecordStatus || 'none'
          });
        } else {
          // 如果找不到域名，显示错误
          toast.error('找不到要编辑的域名');
          navigate('/domains');
        }
      }
      
      setIsLoading(false);
    }, 800);
  }, [id, navigate]);
  
  // 处理输入变化
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // 清除对应字段的错误
    if (errors[name as keyof DomainFormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  // 验证表单
  const validateForm = (): boolean => {
    try {
      domainSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Partial<Record<keyof DomainFormData, string>> = {};
        error.issues.forEach(issue => {
          const fieldName = issue.path[0] as keyof DomainFormData;
          newErrors[fieldName] = issue.message;
        });
        setErrors(newErrors);
      }
      return false;
    }
  };
  
  // 提交表单
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // 如果有表单验证错误，显示第一个错误
      const firstError = Object.values(errors).find(error => error);
      if (firstError) {
        toast.error(firstError);
      }
      return;
    }
    
    // 验证到期日期是否晚于购买日期
    const purchaseDate = new Date(formData.purchaseDate);
    const expiryDate = new Date(formData.expiryDate);
    
    if (expiryDate <= purchaseDate) {
      setErrors(prev => ({
        ...prev,
        expiryDate: "到期日期必须晚于购买日期"
      }));
      toast.error("到期日期必须晚于购买日期");
      return;
    }
    
    // 确定域名状态
    const todayDate = new Date();
    let status: 'active' | 'expired' | 'expiring-soon' = 'active';
    
    if (expiryDate < todayDate) {
      status = 'expired';
    } else {
      // 计算剩余天数
      const timeDiff = expiryDate.getTime() - todayDate.getTime();
      const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));
      
      if (daysRemaining <= 30) {
        status = 'expiring-soon';
      }
    }
    
    setIsSubmitting(true);
    
    // 模拟API请求延迟
    setTimeout(() => {
      // 从localStorage加载现有域名
      const savedDomains = localStorage.getItem('domains');
      
      if (savedDomains) {
        const domains = JSON.parse(savedDomains) as DomainInfo[];
        
        // 找到并更新域名
        const updatedDomains = domains.map(domain => 
          domain.id === id 
            ? {
                ...domain,
                ...formData,
                status,
                updatedAt: new Date().toISOString()
              }
            : domain
        );
        
        // 保存回localStorage
        localStorage.setItem('domains', JSON.stringify(updatedDomains));
        
        setIsSubmitting(false);
        toast.success('域名信息已更新！');
        navigate(`/domains/${id}`);
      } else {
        setIsSubmitting(false);
        toast.error('更新失败，请重试');
      }
    }, 1000);
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
          <p className="text-gray-500 dark:text-gray-400">加载域名信息中...</p>
        </main>
      </div>
    );
  }
  
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
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">编辑域名信息</h1>
            <p className="text-gray-500 dark:text-gray-400">更新域名的详细信息</p>
          </div>
          
          <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <div className="space-y-6">
              {/* 域名 */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  域名 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border ${
                      errors.name 
                        ? 'border-red-300 dark:border-red-700 focus:ring-red-500 focus:border-red-500' 
                        : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500'
                    } rounded-lg dark:bg-gray-700 dark:text-white transition duration-200`}
                    placeholder="例如：example.com"
                  />
                  {errors.name && (
                    <div className="absolute -top-7 left-0 text-xs text-red-500">{errors.name}</div>
                  )}
                </div>
              </div>
              
              {/* 服务商 */}
              <div>
                <label htmlFor="registrar" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  服务商 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    id="registrar"
                    name="registrar"
                    value={formData.registrar}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border ${
                      errors.registrar 
                        ? 'border-red-300 dark:border-red-700 focus:ring-red-500 focus:border-red-500' 
                        : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500'
                    } rounded-lg dark:bg-gray-700 dark:text-white transition duration-200`}
                  >
                    <option value="">请选择服务商</option>
                    <option value="阿里云">阿里云</option>
                    <option value="腾讯云">腾讯云</option>
                    <option value="GoDaddy">GoDaddy</option>
                    <option value="Namecheap">Namecheap</option>
                    <option value="Google Domains">Google Domains</option>
                    <option value="其他">其他</option>
                  </select>
                  {errors.registrar && (
                    <div className="absolute -top-7 left-0 text-xs text-red-500">{errors.registrar}</div>
                  )}
                </div>
              </div>
              
              {/* DNS托管商 */}
              <div>
                <label htmlFor="dnsProvider" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  DNS托管商 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    id="dnsProvider"
                    name="dnsProvider"
                    value={formData.dnsProvider}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border ${
                      errors.dnsProvider 
                        ? 'border-red-300 dark:border-red-700 focus:ring-red-500 focus:border-red-500' 
                        : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500'
                    } rounded-lg dark:bg-gray-700 dark:text-white transition duration-200`}
                  >
                    <option value="">请选择DNS托管商</option>
                    <option value="Cloudflare">Cloudflare</option>
                    <option value="阿里云DNS">阿里云DNS</option>
                    <option value="DNSPod">DNSPod</option>
                    <option value="Route 53">Route 53</option>
                    <option value="Google Cloud DNS">Google Cloud DNS</option>
                    <option value="其他">其他</option>
                  </select>
                  {errors.dnsProvider && (
                    <div className="absolute -top-7 left-0 text-xs text-red-500">{errors.dnsProvider}</div>
                  )}
                </div>
              </div>
              
              {/* 购买日期 */}
              <div>
                <label htmlFor="purchaseDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  购买日期 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    id="purchaseDate"
                    name="purchaseDate"
                    value={formData.purchaseDate}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border ${
                      errors.purchaseDate 
                        ? 'border-red-300 dark:border-red-700 focus:ring-red-500 focus:border-red-500' 
                        : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500'
                    } rounded-lg dark:bg-gray-700 dark:text-white transition duration-200`}
                  />
                  {errors.purchaseDate && (
                    <div className="absolute -top-7 left-0 text-xs text-red-500">{errors.purchaseDate}</div>
                  )}
                </div>
              </div>
              
              {/* 到期日期 */}
              <div>
                <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  到期日期 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    id="expiryDate"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border ${
                      errors.expiryDate 
                        ? 'border-red-300 dark:border-red-700 focus:ring-red-500 focus:border-red-500' 
                        : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500'
                    } rounded-lg dark:bg-gray-700 dark:text-white transition duration-200`}
                  />
                  {errors.expiryDate && (
                    <div className="absolute -top-7 left-0 text-xs text-red-500">{errors.expiryDate}</div>
                  )}
                </div>
              </div>
              
              {/* 自动续费 */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="autoRenew"
                  name="autoRenew"
                  checked={formData.autoRenew}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700"
                />
                <label htmlFor="autoRenew" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  自动续费
                </label>
              </div>
              
              {/* 备注 */}
              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  备注
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition duration-200"
                  placeholder="添加关于此域名的备注信息（可选）"
                ></textarea>
              </div>

              {/* ICP备案信息 */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">ICP备案信息（非必填）</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="icpRecordStatus" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      备案状态
                    </label>
                    <select
                      id="icpRecordStatus"
                      name="icpRecordStatus"
                      value={formData.icpRecordStatus}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition duration-200"
                    >
                      <option value="none">未备案</option>
                      <option value="pending">审核中</option>
                      <option value="verified">已备案</option>
                      <option value="invalid">未通过</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="icpRecordNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      备案号
                    </label>
                    <input
                      type="text"
                      id="icpRecordNumber"
                      name="icpRecordNumber"
                      value={formData.icpRecordNumber}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition duration-200"
                      placeholder="例如：京ICP备12345678号"
                    />
                  </div>
                </div>
              </div>
              
              {/* 操作按钮 */}
              <div className="pt-4 flex flex-col sm:flex-row sm:justify-end sm:space-x-3">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="w-full sm:w-auto px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 transition duration-200"
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto mt-3 sm:mt-0 px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 transition duration-200 flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      保存中...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      保存更改
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
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