import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '@/contexts/authContext';
import { CalendarDays } from 'lucide-react';
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

// 定义视图类型
type CalendarView = 'year' | 'month' | 'week';

export default function Calendar() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [domains, setDomains] = useState<DomainInfo[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentWeek, setCurrentWeek] = useState(0);
  const [currentView, setCurrentView] = useState<CalendarView>('month');
  
  // 初始化时计算当前周
  useEffect(() => {
    const today = new Date();
    const firstDayOfYear = new Date(today.getFullYear(), 0, 1);
    const pastDaysOfYear = (today.getTime() - firstDayOfYear.getTime()) / 86400000;
    setCurrentWeek(Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7));
  }, []);

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
        }
      ];
      setDomains(mockDomains);
    }
    
    // 检查即将到期的域名并提醒
    checkExpiringDomains();
  }, []);

  // 检查即将到期的域名并提醒
  const checkExpiringDomains = () => {
    const today = new Date();
    const thirtyDaysLater = new Date(today);
    thirtyDaysLater.setDate(today.getDate() + 30);
    const sevenDaysLater = new Date(today);
    sevenDaysLater.setDate(today.getDate() + 7);
    
    // 从设置中获取通知偏好
    const userSettings = localStorage.getItem('userSettings');
    const notificationSettings = userSettings ? JSON.parse(userSettings).notifications : {
      expiryReminders: true,
      reminderDays: [30, 7] // 默认提前30天和7天提醒
    };
    
    if (notificationSettings.expiryReminders) {
      domains.forEach(domain => {
        const expiryDate = new Date(domain.expiryDate);
        
        // 检查是否需要提前30天提醒
        if (notificationSettings.reminderDays.includes(30) && 
            expiryDate >= today && expiryDate <= thirtyDaysLater && 
            Math.abs(expiryDate.getTime() - thirtyDaysLater.getTime()) < 86400000) {
          // 这里模拟通知，实际应用中应该发送邮件
          console.log(`提醒：域名 ${domain.name} 将在30天后到期`);
        }
        
        // 检查是否需要提前7天提醒
        if (notificationSettings.reminderDays.includes(7) && 
            expiryDate >= today && expiryDate <= sevenDaysLater && 
            Math.abs(expiryDate.getTime() - sevenDaysLater.getTime()) < 86400000) {
          // 这里模拟通知，实际应用中应该发送邮件
          console.log(`提醒：域名 ${domain.name} 将在7天后到期`);
        }
      });
    }
  };

  // 获取月份的天数
  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // 获取月份第一天是星期几
  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  // 生成月视图日历数据
  const generateMonthCalendarData = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDayOfMonth = getFirstDayOfMonth(currentMonth, currentYear);
    const calendarDays: (number | null)[] = [];

    // 添加上个月的占位天数
    for (let i = 0; i < firstDayOfMonth; i++) {
      calendarDays.push(null);
    }

    // 添加当月的天数
    for (let i = 1; i <= daysInMonth; i++) {
      calendarDays.push(i);
    }

    return calendarDays;
  };

  // 生成年视图日历数据
  const generateYearCalendarData = () => {
    const yearData: { month: number; days: number }[] = [];
    for (let month = 0; month < 12; month++) {
      yearData.push({
        month,
        days: getDaysInMonth(month, currentYear)
      });
    }
    return yearData;
  };

  // 生成周视图日历数据
  const generateWeekCalendarData = () => {
    const firstDayOfYear = new Date(currentYear, 0, 1);
    const daysToAdd = (currentWeek - 1) * 7 - firstDayOfYear.getDay();
    const weekStartDate = new Date(firstDayOfYear);
    weekStartDate.setDate(firstDayOfYear.getDate() + daysToAdd);
    
    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(weekStartDate);
      currentDate.setDate(weekStartDate.getDate() + i);
      weekDays.push({
        day: currentDate.getDate(),
        month: currentDate.getMonth(),
        year: currentDate.getFullYear(),
        date: currentDate
      });
    }
    
    return weekDays;
  };

  // 获取特定日期的域名
  const getDomainsForDate = (day: number, month?: number, year?: number) => {
    if (!day) return [];
    
    const targetMonth = month ?? currentMonth;
    const targetYear = year ?? currentYear;
    const dateStr = `${targetYear}-${String(targetMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return domains.filter(domain => domain.expiryDate === dateStr);
  };

  // 获取特定月份的域名数量
  const getDomainCountForMonth = (month: number, year: number) => {
    const monthStr = String(month + 1).padStart(2, '0');
    return domains.filter(domain => domain.expiryDate.startsWith(`${year}-${monthStr}`)).length;
  };

  // 月份名称数组
  const monthNames = [
    '一月', '二月', '三月', '四月', '五月', '六月',
    '七月', '八月', '九月', '十月', '十一月', '十二月'
  ];

  // 切换到上个月
  const prevMonth = () => {
    setCurrentMonth(prev => {
      if (prev === 0) {
        setCurrentYear(currentYear - 1);
        return 11;
      }
      return prev - 1;
    });
  };

  // 切换到下个月
  const nextMonth = () => {
    setCurrentMonth(prev => {
      if (prev === 11) {
        setCurrentYear(currentYear + 1);
        return 0;
      }
      return prev + 1;
    });
  };

  // 切换到上一年
  const prevYear = () => {
    setCurrentYear(currentYear - 1);
  };

  // 切换到下一年
  const nextYear = () => {
    setCurrentYear(currentYear + 1);
  };

  // 切换到上一周
  const prevWeek = () => {
    setCurrentWeek(prev => Math.max(1, prev - 1));
  };

  // 切换到下一周
  const nextWeek = () => {
    setCurrentWeek(prev => Math.min(52, prev + 1));
  };

  // 获取状态对应的样式
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'expiring-soon':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300';
      case 'expired':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  // 渲染月视图
  const renderMonthView = () => {
    const calendarDays = generateMonthCalendarData();
    
    return (
      <div className="grid grid-cols-7 gap-1">
        {/* 星期标题 */}
        {['日', '一', '二', '三', '四', '五', '六'].map((day) => (
          <div 
            key={day} 
            className="text-center text-sm font-medium text-gray-500 dark:text-gray-400 py-2"
          >
            {day}
          </div>
        ))}

        {/* 日期格子 */}
        {calendarDays.map((day, index) => {
          const dayDomains = day ? getDomainsForDate(day) : [];
          const hasExpiringDomains = dayDomains.some(d => d.status === 'expiring-soon');
          
          return (
            <div 
              key={index}
              className={cn(
                "aspect-square p-1 border border-gray-200 dark:border-gray-700 rounded-md relative",
                !day && "bg-gray-50 dark:bg-gray-800/50 opacity-50"
              )}
            >
              {day && (
                <>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {day}
                  </div>
                  
                  {/* 域名标记 */}
                  {dayDomains.length > 0 && (
                    <div className="mt-1 space-y-1">
                      {dayDomains.slice(0, 3).map((domain, idx) => (
                        <div 
                          key={idx}
                          className={`text-xs px-1.5 py-0.5 rounded truncate ${getStatusClass(domain.status)}`}
                          title={domain.name}
                        >
                          {domain.name}
                        </div>
                      ))}
                      {dayDomains.length > 3 && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                          +{dayDomains.length - 3} 更多
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* 有即将到期域名的标记 */}
                  {hasExpiringDomains && (
                    <div className="absolute top-0 right-0 h-2 w-2 bg-amber-500 rounded-full mt-1 mr-1"></div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  // 渲染年视图
  const renderYearView = () => {
    const yearData = generateYearCalendarData();
    
    return (
      <div className="grid grid-cols-4 gap-4">
        {yearData.map((monthData, index) => {
          const domainCount = getDomainCountForMonth(index, currentYear);
          const hasExpiringDomains = domains.some(domain => {
            const expiryDate = new Date(domain.expiryDate);
            return expiryDate.getFullYear() === currentYear && 
                   expiryDate.getMonth() === index && 
                   domain.status === 'expiring-soon';
          });
          
          return (
            <div 
              key={index}
              className={`p-4 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer transition-transform hover:scale-105 ${
                hasExpiringDomains ? 'bg-amber-50 dark:bg-amber-900/10' : ''
              }`}
              onClick={() => {
                setCurrentMonth(index);
                setCurrentView('month');
              }}
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium text-gray-900 dark:text-white">{monthNames[index]}</h3>
                {hasExpiringDomains && (
                  <div className="h-2 w-2 bg-amber-500 rounded-full"></div>
                )}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {domainCount} 个域名到期
              </p>
            </div>
          );
        })}
      </div>
    );
  };

  // 渲染周视图
  const renderWeekView = () => {
    const weekDays = generateWeekCalendarData();
    
    return (
      <div className="grid grid-cols-7 gap-1">
        {/* 星期标题 */}
        {['日', '一', '二', '三', '四', '五', '六'].map((day, index) => (
          <div 
            key={day} 
            className="text-center text-sm font-medium text-gray-500 dark:text-gray-400 py-2"
          >
            {day}
            <br />
            {weekDays[index] && `${weekDays[index].month + 1}月${weekDays[index].day}日`}
          </div>
        ))}

        {/* 日期格子 */}
        {weekDays.map((day, index) => {
          const dayDomains = getDomainsForDate(day.day, day.month, day.year);
          const hasExpiringDomains = dayDomains.some(d => d.status === 'expiring-soon');
          
          return (
            <div 
              key={index}
              className={cn(
                "min-h-[200px] p-1 border border-gray-200 dark:border-gray-700 rounded-md relative"
              )}
            >
              {/* 域名标记 */}
              {dayDomains.length > 0 && (
                <div className="space-y-1">
                  {dayDomains.map((domain, idx) => (
                    <div 
                      key={idx}
                      className={`text-xs px-1.5 py-0.5 rounded truncate ${getStatusClass(domain.status)}`}
                      title={domain.name}
                    >
                      {domain.name}
                    </div>
                  ))}
                </div>
              )}
              
              {/* 有即将到期域名的标记 */}
              {hasExpiringDomains && (
                <div className="absolute top-0 right-0 h-2 w-2 bg-amber-500 rounded-full mt-1 mr-1"></div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* 侧边栏 */}
      {sidebarOpen && (
        <Sidebar onLogout={logout} currentPage="/calendar" />
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
              <CalendarDays className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">续费日历</h1>
            </div>
          </div>
        </header>
        
        {/* 主内容区域 */}
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
            {/* 日历标题和导航 */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 md:mb-0">
                {currentView === 'year' && `${currentYear}`}
                {currentView === 'month' && `${monthNames[currentMonth]} ${currentYear}`}
                {currentView === 'week' && `第${currentWeek}周 ${currentYear}`}
              </h2>
              <div className="flex space-x-2">
                <button
                  onClick={currentView === 'year' ? prevYear : currentView === 'month' ? prevMonth : prevWeek}
                  className="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  disabled={currentView === 'week' && currentWeek === 1}
                >
                  <i className="fas fa-chevron-left"></i>
                </button>
                <button
                  onClick={currentView === 'year' ? nextYear : currentView === 'month' ? nextMonth : nextWeek}
                  className="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  disabled={currentView === 'week' && currentWeek === 52}
                >
                  <i className="fas fa-chevron-right"></i>
                </button>
              </div>
            </div>
            
            {/* 视图切换 */}
            <div className="flex justify-center mb-6">
              <div className="inline-flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                <button
                  onClick={() => setCurrentView('year')}
                  className={`px-3 py-1 rounded-md text-sm ${
                    currentView === 'year'
                      ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-300'
                  }`}
                >
                  年视图
                </button>
                <button
                  onClick={() => setCurrentView('month')}
                  className={`px-3 py-1 rounded-md text-sm ${
                    currentView === 'month'
                      ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-300'
                  }`}
                >
                  月视图
                </button>
                <button
                  onClick={() => setCurrentView('week')}
                  className={`px-3 py-1 rounded-md text-sm ${
                    currentView === 'week'
                      ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-300'
                  }`}
                >
                  周视图
                </button>
              </div>
            </div>

            {/* 日历内容 */}
            {currentView === 'month' && renderMonthView()}
            {currentView === 'year' && renderYearView()}
            {currentView === 'week' && renderWeekView()}
          </div>

          {/* 图例说明 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">图例</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-100 border border-green-300 dark:border-green-700 rounded mr-2"></div>
                <span className="text-sm text-gray-600 dark:text-gray-300">活跃域名</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-amber-100 border border-amber-300 dark:border-amber-700 rounded mr-2"></div>
                <span className="text-sm text-gray-600 dark:text-gray-300">即将到期</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-100 border border-red-300 dark:border-red-700 rounded mr-2"></div>
                <span className="text-sm text-gray-600 dark:text-gray-300">已过期</span>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">通知设置</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                系统会在域名和SSL证书到期前提醒您续费或更新。您可以在
                <a href="/settings" className="text-blue-600 dark:text-blue-400 ml-1">设置</a>
                中调整通知偏好，包括提醒的时间点和通知类型。
              </p>
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