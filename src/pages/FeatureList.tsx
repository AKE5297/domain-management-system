import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

// 定义功能项接口
interface FeatureItem {
  id: string;
  title: string;
  description: string;
}

// 定义分类接口
interface FeatureCategory {
  id: string;
  name: string;
  features: FeatureItem[];
}

export default function FeatureList() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  
  // 系统功能分类列表
  const featureCategories: FeatureCategory[] = [
    // 认证与用户管理
    {
      id: 'auth',
      name: '认证管理',
      features: [
        {
          id: 'login',
          title: '用户认证',
          description: '登录系统并管理用户认证状态'
        },
        {
          id: 'account-settings',
          title: '账户设置',
          description: '管理用户账户信息和安全设置'
        },
        {
          id: 'password-change',
          title: '密码修改',
          description: '修改用户登录密码'
        }
      ]
    },
    
    // 域名核心管理功能
    {
      id: 'domain',
      name: '域名管理',
      features: [
        {
          id: 'domain-list',
          title: '域名列表',
          description: '查看、搜索和筛选所有域名'
        },
        {
          id: 'add-domain',
          title: '添加域名',
          description: '添加新的域名到系统中'
        },
        {
          id: 'edit-domain',
          title: '编辑域名',
          description: '修改现有域名的详细信息'
        },
        {
          id: 'domain-detail',
          title: '域名详情',
          description: '查看域名的完整详细信息和状态'
        },
        {
          id: 'delete-domain',
          title: '删除域名',
          description: '从系统中删除不需要的域名'
        },
        {
          id: 'icp-management',
          title: 'ICP备案管理',
          description: '管理域名的ICP备案信息和状态'
        },
        {
          id: 'auto-renew',
          title: '自动续费管理',
          description: '设置域名是否自动续费'
        }
      ]
    },
    
    // 数据可视化功能
    {
      id: 'analytics',
      name: '数据分析',
      features: [
        {
          id: 'dashboard',
          title: '控制面板',
          description: '查看域名管理的关键指标和统计数据'
        },
        {
          id: 'analytics',
          title: '数据分析',
          description: '深入分析域名状态分布和到期趋势'
        },
        {
          id: 'status-distribution',
          title: '状态分布统计',
          description: '统计并可视化域名的状态分布情况'
        },
        {
          id: 'registrar-distribution',
          title: '服务商分布',
          description: '分析域名在不同服务商的分布情况'
        },
        {
          id: 'monthly-expiry',
          title: '月度到期分布',
          description: '查看域名每月到期情况的统计图表'
        },
        {
          id: 'domain-activity',
          title: '域名活跃度统计',
          description: '统计域名的活跃状态占比'
        },
        {
          id: 'expiry-risk',
          title: '过期风险评估',
          description: '评估域名的过期风险程度'
        }
      ]
    },
    
    // 日历功能
    {
      id: 'calendar',
      name: '续费日历',
      features: [
        {
          id: 'calendar',
          title: '续费日历',
          description: '通过日历视图查看域名到期时间'
        },
        {
          id: 'calendar-views',
          title: '多视图日历',
          description: '支持年视图、月视图和周视图的切换'
        }
      ]
    },
    
    // 通知功能
    {
      id: 'notification',
      name: '通知提醒',
      features: [
        {
          id: 'expiry-reminder',
          title: '域名到期提醒',
          description: '在域名到期前发送提醒通知'
        },
        {
          id: 'custom-reminder',
          title: '自定义提醒时间',
          description: '设置不同的提醒时间点（30天、7天等）'
        },
        {
          id: 'ssl-reminder',
          title: 'SSL证书到期提醒',
          description: '在SSL证书到期前发送提醒通知'
        },
        {
          id: 'renewal-confirmations',
          title: '续费确认通知',
          description: '接收域名续费成功的确认通知'
        },
        {
          id: 'security-alerts',
          title: '安全提醒',
          description: '接收与域名相关的安全提醒'
        },
        {
          id: 'weekly-summary',
          title: '每周汇总报告',
          description: '接收每周域名状态的汇总报告'
        }
      ]
    },
    
    // 系统设置
    {
      id: 'settings',
      name: '系统设置',
      features: [
        {
          id: 'notification-settings',
          title: '通知设置',
          description: '配置系统通知的类型和方式'
        },
        {
          id: 'email-service',
          title: '邮箱服务配置',
          description: '设置SMTP服务器以发送邮件通知'
        },
        {
          id: 'theme-switch',
          title: '主题切换',
          description: '在浅色模式和深色模式之间切换'
        },
        {
          id: 'preferences',
          title: '偏好设置',
          description: '配置系统默认视图和自动刷新间隔'
        },
        {
          id: 'default-view',
          title: '默认视图设置',
          description: '设置系统默认显示的页面视图'
        },
        {
          id: 'auto-refresh',
          title: '自动刷新设置',
          description: '配置数据自动刷新的间隔时间'
        }
      ]
    },
    
    // 安全功能
    {
      id: 'security',
      name: '安全与存储',
      features: [
        {
          id: 'data-storage',
          title: '数据本地存储',
          description: '使用本地存储保存域名数据'
        }
      ]
    }
  ];
  
  // 分类列表
  const categories = [
    { id: 'all', name: '所有功能' },
    ...featureCategories.map(category => ({ id: category.id, name: category.name }))
  ];
  
  // 计算总功能数
  const totalFeatures = featureCategories.reduce((sum, category) => sum + category.features.length, 0);
  
  // 过滤功能列表
  const getFilteredFeatures = () => {
    if (activeCategory === 'all') {
      // 返回所有功能，按分类组织
      return featureCategories;
    } else {
      // 返回特定分类的功能
      const category = featureCategories.find(cat => cat.id === activeCategory);
      return category ? [category] : [];
    }
  };
  
  const filteredCategories = getFilteredFeatures();
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* 顶部导航 */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center">
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
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">系统功能列表</h1>
            <p className="text-gray-500 dark:text-gray-400">以下是域名管理系统的所有功能模块</p>
          </div>
          
          {/* 分类筛选 */}
          <div className="mb-8 flex flex-wrap justify-center gap-2">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === category.id
                    ? 'bg-blue-600 text-white dark:bg-blue-700'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
          
          {/* 功能列表 - 按分类显示 */}
          <div className="space-y-10">
            {filteredCategories.map(category => (
              <div key={category.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
                  {category.name} ({category.features.length}个功能)
                </h2>
                
                <div className="space-y-4">
                  {category.features.map(feature => (
                    <div key={feature.id} className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{feature.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          {/* 功能统计 */}
          <div className="mt-10 p-5 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 text-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">功能统计</h3>
            <div className="flex justify-center space-x-8 mt-4">
              <div>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{totalFeatures}</p>
                <p className="text-gray-500 dark:text-gray-400">总功能数</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">{featureCategories.length}</p>
                <p className="text-gray-500 dark:text-gray-400">功能分类</p>
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
  );
}