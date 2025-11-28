import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '@/contexts/authContext';
  import { 
  User, Bell, Shield, Palette, HelpCircle, Info,
  Mail, Lock, CalendarDays, ArrowLeft, Save, AlertTriangle
} from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import { toast } from 'sonner';
import { useTheme } from '@/hooks/useTheme';

// 定义设置接口
interface UserSettings {
  email: string;
  notifications: {
    expiryReminders: boolean;
    renewalConfirmations: boolean;
    securityAlerts: boolean;
    weeklySummary: boolean;
    reminderDays: number[];
    sslExpiryReminders: boolean;
    sslReminderDays: number[];
  };
  preferences: {
    defaultView: 'dashboard' | 'list' | 'calendar';
    autoRefresh: boolean;
    refreshInterval: number;
  };
  emailService: {
    enabled: boolean;
    smtpServer: string;
    smtpPort: number;
    username: string;
    password: string;
    useSSL: boolean;
    senderEmail: string;
  };
}

export default function Settings() {
  const { logout, user, updateUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'account' | 'notifications' | 'emailService' | 'preferences'>('account');
  const [settings, setSettings] = useState<UserSettings>({
    email: 'admin@example.com',
    notifications: {
      expiryReminders: true,
      renewalConfirmations: true,
      securityAlerts: true,
      weeklySummary: false,
      reminderDays: [30, 15, 7, 3, 1],
      sslExpiryReminders: true,
      sslReminderDays: [30, 15, 7, 3, 1]
    },
    preferences: {
      defaultView: 'dashboard',
      autoRefresh: true,
      refreshInterval: 5
    },
    emailService: {
      enabled: false,
      smtpServer: 'smtp.example.com',
      smtpPort: 587,
      username: '',
      password: '',
      useSSL: false,
      senderEmail: ''
    }
  });

  // 从localStorage加载设置
  useEffect(() => {
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error('Failed to load settings:', error);
      }
    }
  }, []);

  // 保存设置
  const saveSettings = () => {
    setIsLoading(true);
    
    // 模拟API请求延迟
    setTimeout(() => {
      localStorage.setItem('userSettings', JSON.stringify(settings));
      setIsLoading(false);
      toast.success('设置已保存！');
    }, 800);
  };

  // 处理设置变更
  const handleSettingChange = (
    section: keyof UserSettings, 
    key: string, 
    value: any
  ) => {
    if (section === 'notifications' && key === 'reminderDays') {
      // 处理提醒天数的变更
      const updatedDays = [...settings.notifications.reminderDays];
      const index = updatedDays.indexOf(value);
      
      if (index > -1) {
        updatedDays.splice(index, 1);
      } else {
        updatedDays.push(value);
        updatedDays.sort((a, b) => b - a); // 降序排序
      }
      
      setSettings(prev => ({
        ...prev,
        notifications: {
          ...prev.notifications,
          reminderDays: updatedDays
        }
      }));
    } else if (section === 'emailService' && key === 'smtpPort') {
      // 确保端口号是数字
      setSettings(prev => ({
        ...prev,
        emailService: {
          ...prev.emailService,
          smtpPort: parseInt(value) || 587
        }
      }));
    } else {
      // 处理其他设置的变更
      setSettings(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [key]: value
        }
      }));
    }
  };

  // 重置为默认设置
  const resetToDefaults = () => {
    if (window.confirm('确定要重置所有设置为默认值吗？')) {
      const defaultSettings: UserSettings = {
        email: 'admin@example.com',
        notifications: {
          expiryReminders: true,
          renewalConfirmations: true,
          securityAlerts: true,
          weeklySummary: false,
          reminderDays: [30, 15, 7, 3, 1],
          sslExpiryReminders: true,
          sslReminderDays: [30, 15, 7, 3, 1]
        },
        preferences: {
          defaultView: 'dashboard',
          autoRefresh: true,
          refreshInterval: 5
        },
        emailService: {
          enabled: false,
          smtpServer: 'smtp.example.com',
          smtpPort: 587,
          username: '',
          password: '',
          useSSL: false,
          senderEmail: ''
        }
      };
      
      setSettings(defaultSettings);
      localStorage.setItem('userSettings', JSON.stringify(defaultSettings));
      toast.success('设置已重置为默认值！');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* 侧边栏 */}
      {sidebarOpen && (
        <Sidebar onLogout={logout} currentPage="/settings" />
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
          {/* 页面标题 */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">系统设置</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">管理您的账户、通知和偏好设置</p>
          </div>
          
           {/* 设置标签页导航 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-1 mb-8 flex overflow-x-auto hide-scrollbar">
            <button
              onClick={() => setActiveTab('account')}
              className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'account'
                  ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
              }`}
            >
              <User className="h-4 w-4 mr-2" />
              账户设置
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'notifications'
                  ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
              }`}
            >
              <Bell className="h-4 w-4 mr-2" />
              通知设置
            </button>
            <button
              onClick={() => setActiveTab('emailService')}
              className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'emailService'
                  ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
              }`}
            >
              <Mail className="h-4 w-4 mr-2" />
              邮箱服务
            </button>
            <button
              onClick={() => setActiveTab('preferences')}
              className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'preferences'
                  ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
              }`}
            >
              <Palette className="h-4 w-4 mr-2" />
              偏好设置
            </button>
          </div>
          
           {/* 设置内容区域 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
             {/* 账户设置 */}
            {activeTab === 'account' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">账户信息</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        用户名
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="text"
                          id="username"
                          value={user?.username || ''}
                          onChange={(e) => {
                            if (updateUser) {
                              updateUser({ username: e.target.value });
                            }
                          }}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition duration-200"
                          placeholder="您的用户名"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        电子邮箱
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="email"
                          id="email"
                          value={settings.email}
                          onChange={(e) => {
                            handleSettingChange('email' as keyof UserSettings, 'email', e.target.value);
                            if (updateUser) {
                              updateUser({ email: e.target.value });
                            }
                          }}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition duration-200"
                          placeholder="您的电子邮箱地址"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">修改密码</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          当前密码
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <input
                            type="password"
                            id="currentPassword"
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition duration-200"
                            placeholder="输入当前密码"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          新密码
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <input
                            type="password"
                            id="newPassword"
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition duration-200"
                            placeholder="输入新密码"
                          />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          确认新密码
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <input
                            type="password"
                            id="confirmPassword"
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition duration-200"
                            placeholder="再次输入新密码"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          const currentPassword = document.getElementById('currentPassword') as HTMLInputElement;
                          const newPassword = document.getElementById('newPassword') as HTMLInputElement;
                          const confirmPassword = document.getElementById('confirmPassword') as HTMLInputElement;
                          
                          if (!currentPassword.value || !newPassword.value || !confirmPassword.value) {
                            toast.error('请填写所有密码字段');
                            return;
                          }
                          
                          if (newPassword.value !== confirmPassword.value) {
                            toast.error('两次输入的新密码不一致');
                            return;
                          }
                          
                          if (newPassword.value.length < 6) {
                            toast.error('新密码长度至少为6个字符');
                            return;
                          }
                          
                          // 模拟密码修改过程
                          setIsLoading(true);
                          setTimeout(() => {
                            if (updateUser) {
                              updateUser({ password: newPassword.value });
                            }
                            toast.success('密码修改成功！');
                            // 清空密码输入框
                            currentPassword.value = '';
                            newPassword.value = '';
                            confirmPassword.value = '';
                            setIsLoading(false);
                          }, 800);
                        }}
                        disabled={isLoading}
                        className="px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 transition duration-200"
                      >
                        {isLoading ? (
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
                </div>
                
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">安全设置</h3>
                  <div className="space-y-6">
                    <button
                      className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex items-center">
                        <Shield className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-3" />
                        <span className="text-gray-900 dark:text-white">双因素认证</span>
                      </div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                        未启用
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* 通知设置 */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">通知首选项</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Bell className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-3" />
                        <label htmlFor="expiryReminders" className="text-gray-900 dark:text-white">域名到期提醒</label>
                      </div>
                      <div className="relative inline-block w-10 align-middle select-none">
                        <input
                          type="checkbox"
                          id="expiryReminders"
                          checked={settings.notifications.expiryReminders}
                          onChange={(e) => handleSettingChange('notifications', 'expiryReminders', e.target.checked)}
                          className="sr-only"
                        />
                        <label
                          htmlFor="expiryReminders"
                          className={`block overflow-hidden h-6 rounded-full cursor-pointer ${
                            settings.notifications.expiryReminders
                              ? 'bg-blue-600'
                              : 'bg-gray-300 dark:bg-gray-600'
                          } transition-colors`}
                        >
                          <span
                            className={`absolute left-0.5 top-0.5 bg-white dark:bg-gray-200 w-5 h-5 rounded-full transition-transform ${
                              settings.notifications.expiryReminders
                                ? 'transform translate-x-4'
                                : ''
                            }`}
                          ></span>
                        </label>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <CalendarDays className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-3" />
                        <label htmlFor="renewalConfirmations" className="text-gray-900 dark:text-white">续费确认通知</label>
                      </div>
                      <div className="relative inline-block w-10 align-middle select-none">
                        <input
                          type="checkbox"
                          id="renewalConfirmations"
                          checked={settings.notifications.renewalConfirmations}
                          onChange={(e) => handleSettingChange('notifications', 'renewalConfirmations', e.target.checked)}
                          className="sr-only"
                        />
                        <label
                          htmlFor="renewalConfirmations"
                          className={`block overflow-hidden h-6 rounded-full cursor-pointer ${
                            settings.notifications.renewalConfirmations
                              ? 'bg-blue-600'
                              : 'bg-gray-300 dark:bg-gray-600'
                          } transition-colors`}
                        >
                          <span
                            className={`absolute left-0.5 top-0.5 bg-white dark:bg-gray-200 w-5 h-5 rounded-full transition-transform ${
                              settings.notifications.renewalConfirmations
                                ? 'transform translate-x-4'
                                : ''
                            }`}
                          ></span>
                        </label>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Shield className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-3" />
                        <label htmlFor="securityAlerts" className="text-gray-900 dark:text-white">安全提醒</label>
                      </div>
                      <div className="relative inline-block w-10 align-middle select-none">
                        <input
                          type="checkbox"
                          id="securityAlerts"
                          checked={settings.notifications.securityAlerts}
                          onChange={(e) => handleSettingChange('notifications', 'securityAlerts', e.target.checked)}
                          className="sr-only"
                        />
                        <label
                          htmlFor="securityAlerts"
                          className={`block overflow-hidden h-6 rounded-full cursor-pointer ${
                            settings.notifications.securityAlerts
                              ? 'bg-blue-600'
                              : 'bg-gray-300 dark:bg-gray-600'
                          } transition-colors`}
                        >
                          <span
                            className={`absolute left-0.5 top-0.5 bg-white dark:bg-gray-200 w-5 h-5 rounded-full transition-transform ${
                              settings.notifications.securityAlerts
                                ? 'transform translate-x-4'
                                : ''
                            }`}
                          ></span>
                        </label>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Mail className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-3" />
                        <label htmlFor="weeklySummary" className="text-gray-900 dark:text-white">每周汇总报告</label>
                      </div>
                      <div className="relative inline-block w-10 align-middle select-none">
                        <input
                          type="checkbox"
                          id="weeklySummary"
                          checked={settings.notifications.weeklySummary}
                          onChange={(e) => handleSettingChange('notifications', 'weeklySummary', e.target.checked)}
                          className="sr-only"
                        />
                        <label
                          htmlFor="weeklySummary"
                          className={`block overflow-hidden h-6 rounded-full cursor-pointer ${
                            settings.notifications.weeklySummary
                              ? 'bg-blue-600'
                              : 'bg-gray-300 dark:bg-gray-600'
                          } transition-colors`}
                        >
                          <span
                            className={`absolute left-0.5 top-0.5 bg-white dark:bg-gray-200 w-5 h-5 rounded-full transition-transform ${
                              settings.notifications.weeklySummary
                                ? 'transform translate-x-4'
                                : ''
                            }`}
                          ></span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                
                 {settings.notifications.expiryReminders && (
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">提醒时间设置</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">选择您希望在域名到期前多少天收到提醒：</p>
                    <div className="flex flex-wrap gap-2">
                      {[30, 15, 7, 3, 1].map((days) => (
                        <button
                          key={days}
                          onClick={() => handleSettingChange('notifications', 'reminderDays', days)}
                          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                            settings.notifications.reminderDays.includes(days)
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                              : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                          }`}
                        >
                          {days} 天
                        </button>
                      ))}
                    </div>
                    <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30 rounded-lg">
                      <div className="flex items-start">
                        <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 mr-2 flex-shrink-0" />
                        <p className="text-sm text-amber-700 dark:text-amber-300">
                          系统会在指定的天数前通过邮件提醒您域名即将到期。请确保您的邮箱服务已正确配置，以便及时收到提醒。
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* SSL证书到期提醒设置 */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">SSL证书到期提醒</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Shield className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-3" />
                    <label htmlFor="sslExpiryReminders" className="text-gray-900 dark:text-white">证书到期提醒</label>
                  </div>
                  <div className="relative inline-block w-10 align-middle select-none">
                    <input
                      type="checkbox"
                      id="sslExpiryReminders"
                      checked={settings.notifications.sslExpiryReminders}
                      onChange={(e) => handleSettingChange('notifications', 'sslExpiryReminders', e.target.checked)}
                      className="sr-only"
                    />
                    <label
                      htmlFor="sslExpiryReminders"
                      className={`block overflow-hidden h-6 rounded-full cursor-pointer ${
                        settings.notifications.sslExpiryReminders
                          ? 'bg-blue-600'
                          : 'bg-gray-300 dark:bg-gray-600'
                      } transition-colors`}
                    >
                      <span
                        className={`absolute left-0.5 top-0.5 bg-white dark:bg-gray-200 w-5 h-5 rounded-full transition-transform ${
                          settings.notifications.sslExpiryReminders
                            ? 'transform translate-x-4'
                            : ''
                        }`}
                      ></span>
                    </label>
                  </div>
                </div>
                
                {settings.notifications.sslExpiryReminders && (
                  <div className="pt-4">
                    <p className="text-gray-500 dark:text-gray-400 mb-4">选择您希望在SSL证书到期前多少天收到提醒：</p>
                    <div className="flex flex-wrap gap-2">
                      {[30, 15, 7, 3, 1].map((days) => (
                        <button
                          key={days}
                          onClick={() => handleSettingChange('notifications', 'sslReminderDays', days)}
                          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                            settings.notifications.sslReminderDays.includes(days)
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                              : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                          }`}
                        >
                          {days} 天
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* 邮箱服务设置 */}
            {activeTab === 'emailService' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">邮箱服务配置</h3>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                      <Mail className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-3" />
                      <label htmlFor="emailServiceEnabled" className="text-gray-900 dark:text-white">启用邮件通知服务</label>
                    </div>
                    <div className="relative inline-block w-10 align-middle select-none">
                      <input
                        type="checkbox"
                        id="emailServiceEnabled"
                        checked={settings.emailService.enabled}
                        onChange={(e) => handleSettingChange('emailService', 'enabled', e.target.checked)}
                        className="sr-only"
                      />
                      <label
                        htmlFor="emailServiceEnabled"
                        className={`block overflow-hidden h-6 rounded-full cursor-pointer ${
                          settings.emailService.enabled
                            ? 'bg-blue-600'
                            : 'bg-gray-300 dark:bg-gray-600'
                        } transition-colors`}
                      >
                        <span
                          className={`absolute left-0.5 top-0.5 bg-white dark:bg-gray-200 w-5 h-5 rounded-full transition-transform ${
                            settings.emailService.enabled
                              ? 'transform translate-x-4'
                              : ''
                          }`}
                        ></span>
                      </label>
                    </div>
                  </div>
                  
                  {settings.emailService.enabled && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="smtpServer" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            SMTP 服务器
                          </label>
                          <input
                            type="text"
                            id="smtpServer"
                            value={settings.emailService.smtpServer}
                            onChange={(e) => handleSettingChange('emailService', 'smtpServer', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition duration-200"
                            placeholder="smtp.example.com"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="smtpPort" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            SMTP 端口
                          </label>
                          <input
                            type="number"
                            id="smtpPort"
                            value={settings.emailService.smtpPort}
                            onChange={(e) => handleSettingChange('emailService', 'smtpPort', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition duration-200"
                            placeholder="587"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            用户名
                          </label>
                          <input
                            type="text"
                            id="username"
                            value={settings.emailService.username}
                            onChange={(e) => handleSettingChange('emailService', 'username', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition duration-200"
                            placeholder="您的邮箱用户名"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            密码
                          </label>
                          <input
                            type="password"
                            id="password"
                            value={settings.emailService.password}
                            onChange={(e) => handleSettingChange('emailService', 'password', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition duration-200"
                            placeholder="您的邮箱密码或授权码"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="senderEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            发件人邮箱
                          </label>
                          <input
                            type="email"
                            id="senderEmail"
                            value={settings.emailService.senderEmail}
                            onChange={(e) => handleSettingChange('emailService', 'senderEmail', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition duration-200"
                            placeholder="from@example.com"
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <label htmlFor="useSSL" className="text-gray-900 dark:text-white">使用 SSL/TLS</label>
                          <div className="relative inline-block w-10 align-middle select-none">
                            <input
                              type="checkbox"
                              id="useSSL"
                              checked={settings.emailService.useSSL}
                              onChange={(e) => handleSettingChange('emailService', 'useSSL', e.target.checked)}
                              className="sr-only"
                            />
                            <label
                              htmlFor="useSSL"
                              className={`block overflow-hidden h-6 rounded-full cursor-pointer ${
                                settings.emailService.useSSL
                                  ? 'bg-blue-600'
                                  : 'bg-gray-300 dark:bg-gray-600'
                              } transition-colors`}
                            >
                              <span
                                className={`absolute left-0.5 top-0.5 bg-white dark:bg-gray-200 w-5 h-5 rounded-full transition-transform ${
                                  settings.emailService.useSSL
                                    ? 'transform translate-x-4'
                                    : ''
                                }`}
                              ></span>
                            </label>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/30 rounded-lg">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <Info className="h-5 w-5 text-blue-500" />
                          </div>
                          <div className="ml-3">
                            <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">配置说明</h3>
                            <div className="mt-2 text-sm text-blue-700 dark:text-blue-400">
                              <ul className="list-disc pl-5 space-y-1">
                                <li>大多数邮件提供商的SMTP端口为587（不使用SSL）或465（使用SSL）</li>
                                <li>对于Gmail、Outlook等服务，您可能需要使用应用专用密码</li>
                                <li>启用SSL/TLS通常会提供更安全的连接</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* 偏好设置 */}
            {activeTab === 'preferences' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">界面设置</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Palette className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-3" />
                        <label className="text-gray-900 dark:text-white">主题模式</label>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            document.documentElement.classList.remove('dark');
                            document.documentElement.classList.add('light');
                            localStorage.setItem('theme', 'light');
                            toggleTheme();
                          }}
                          className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                            theme === 'light'
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                              : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                          }`}
                        >
                          浅色
                        </button>
                        <button
                          onClick={() => {
                            document.documentElement.classList.remove('light');
                            document.documentElement.classList.add('dark');
                            localStorage.setItem('theme', 'dark');
                            toggleTheme();
                          }}
                          className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                            theme === 'dark'
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                              : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                          }`}
                        >
                          深色
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="defaultView" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        默认视图
                      </label>
                      <select
                        id="defaultView"
                        value={settings.preferences.defaultView}
                        onChange={(e) => handleSettingChange('preferences', 'defaultView', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition duration-200"
                      >
                        <option value="dashboard">控制面板</option>
                        <option value="list">域名列表</option>
                        <option value="calendar">续费日历</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">高级设置</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                         <div className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-3">
                           <i className="fas fa-sync-alt"></i>
                         </div>
                         <label htmlFor="autoRefresh" className="text-gray-900 dark:text-white">自动刷新数据</label>
                       </div>
                      <div className="relative inline-block w-10 align-middle select-none">
                        <input
                          type="checkbox"
                          id="autoRefresh"
                          checked={settings.preferences.autoRefresh}
                          onChange={(e) => handleSettingChange('preferences', 'autoRefresh', e.target.checked)}
                          className="sr-only"
                        />
                        <label
                          htmlFor="autoRefresh"
                          className={`block overflow-hidden h-6 rounded-full cursor-pointer ${
                            settings.preferences.autoRefresh
                              ? 'bg-blue-600'
                              : 'bg-gray-300 dark:bg-gray-600'
                          } transition-colors`}
                        >
                          <span
                            className={`absolute left-0.5 top-0.5 bg-white dark:bg-gray-200 w-5 h-5 rounded-full transition-transform ${
                              settings.preferences.autoRefresh
                                ? 'transform translate-x-4'
                                : ''
                            }`}
                          ></span>
                        </label>
                      </div>
                    </div>
                    
                    {settings.preferences.autoRefresh && (
                      <div>
                        <label htmlFor="refreshInterval" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          刷新间隔（分钟）
                        </label>
                        <select
                          id="refreshInterval"
                          value={settings.preferences.refreshInterval}
                          onChange={(e) => handleSettingChange('preferences', 'refreshInterval', parseInt(e.target.value))}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition duration-200"
                        >
                          <option value={1}>1分钟</option>
                          <option value={5}>5分钟</option>
                          <option value={10}>10分钟</option>
                          <option value={15}>15分钟</option>
                          <option value={30}>30分钟</option>
                          <option value={60}>60分钟</option>
                        </select>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {/* 操作按钮 */}
            <div className="pt-6 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row sm:justify-end sm:space-x-3">
              <button
                onClick={resetToDefaults}
                className="w-full sm:w-auto px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 transition duration-200"
              >
                重置为默认值
              </button>
              <button
                onClick={saveSettings}
                disabled={isLoading}
                className="w-full sm:w-auto mt-3 sm:mt-0 px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 transition duration-200 flex items-center justify-center"
              >
                {isLoading ? (
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
                    保存设置
                  </>
                )}
              </button>
            </div>
          </div>
          
          {/* 帮助和支持 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-start">
              <HelpCircle className="h-6 w-6 text-blue-600 dark:text-blue-400 mt-0.5 mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">需要帮助？</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  如果您在使用过程中遇到任何问题，或者有任何建议，请查看我们的帮助文档或联系支持团队。
                </p>
                <div className="flex flex-wrap gap-3">
                  <a 
                    href="#" 
                    className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-200"
                  >
                    查看帮助文档
                  </a>
                  <a 
                    href="#" 
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition duration-200"
                  >
                    联系支持团队
                  </a>
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