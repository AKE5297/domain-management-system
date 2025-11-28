import { Routes, Route, Navigate } from "react-router-dom";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import DomainList from "@/pages/DomainList";
import DomainDetail from "@/pages/DomainDetail";
import AddDomain from "@/pages/AddDomain";
import EditDomain from "@/pages/EditDomain";
import { useState, useEffect } from "react";
import { AuthContext } from "@/contexts/authContext";
import Dashboard from "@/pages/Dashboard";
import Calendar from "@/pages/Calendar";
import Analytics from "@/pages/Analytics";
import Settings from "@/pages/Settings";
import FeatureList from "@/pages/FeatureList";
import { toast } from 'sonner';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // 从localStorage检查用户是否已登录
    return localStorage.getItem("isAuthenticated") === "true";
  });

  // 获取用户信息
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : undefined;
  });

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("user"); // 确保完全清除用户数据
  };

  // 更新用户信息
  const updateUser = (userData: { username?: string; password?: string; email?: string }) => {
    // 确保user对象存在
    if (!user) {
      // 如果用户对象不存在，创建一个新的基础用户对象
      const newUser = {
        id: "1",
        username: userData.username || "admin",
        email: userData.email || "admin@example.com"
      };
      
      // 如果提供了密码，也包含在更新中
      if (userData.password) {
        newUser["password"] = userData.password;
      }
      
      setUser(newUser);
      localStorage.setItem("user", JSON.stringify(newUser));
    } else {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
    
    // 如果修改了密码，强制用户重新登录
    if (userData.password) {
      setIsAuthenticated(false);
      localStorage.removeItem("isAuthenticated");
      toast.success('密码已修改，请使用新密码重新登录');
    }
  };

  // 保存认证状态到localStorage
  useEffect(() => {
    if (isAuthenticated) {
      localStorage.setItem("isAuthenticated", "true");
    } else {
      // 确保未认证状态时清除认证标记
      localStorage.removeItem("isAuthenticated");
    }

    // 确保用户信息存在
    if (isAuthenticated && !user) {
        const defaultUser = {
          id: "1",
          username: "user",
          email: "user@example.com"
        };
        setUser(defaultUser);
        localStorage.setItem("user", JSON.stringify(defaultUser));
    }
  }, [isAuthenticated, user]);

  // 定期检查即将到期的域名并提醒
  useEffect(() => {
    const checkExpiringDomains = () => {
      if (!isAuthenticated) return;

      // 加载域名数据
      const savedDomains = localStorage.getItem('domains');
      if (!savedDomains) return;

      const domains = JSON.parse(savedDomains);
      if (!domains || !domains.length) return;

      // 加载用户设置
      const userSettings = localStorage.getItem('userSettings');
      const settings = userSettings ? JSON.parse(userSettings) : {
        email: 'admin@example.com',
        notifications: {
          expiryReminders: true,
          reminderDays: [30, 7]
        }
      };

      if (!settings.notifications.expiryReminders) return;

      const today = new Date();

      // 检查每个域名
      domains.forEach((domain: any) => {
        // 域名到期提醒
        const expiryDate = new Date(domain.expiryDate);
        const timeDiff = expiryDate.getTime() - today.getTime();
        const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));

        // 检查是否需要发送域名到期提醒
        if (settings.notifications.expiryReminders) {
          settings.notifications.reminderDays.forEach((reminderDay: number) => {
            if (daysRemaining === reminderDay) {
              // 这里应该发送实际的邮件通知
              console.log(`提醒：域名 ${domain.name} 将在 ${daysRemaining} 天后到期`);
              // 实际应用中应调用邮件发送函数
              // sendNotification(settings.email, `域名 ${domain.name} 即将到期`, `您的域名 ${domain.name} 将在 ${daysRemaining} 天后到期，请及时续费。`);
            }
          });
        }
      });
    };

    // 初始检查
    checkExpiringDomains();

    // 每天检查一次
    const interval = setInterval(checkExpiringDomains, 24 * 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  // 受保护的路由组件
  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" />;
    }
    return children;
  };

  return (
  <AuthContext.Provider
      value={{ isAuthenticated, setIsAuthenticated, logout, user, updateUser }}
    >
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/domains"
          element={
            <ProtectedRoute>
              <DomainList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/domains/:id"
          element={
            <ProtectedRoute>
              <DomainDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/domains/add"
          element={
            <ProtectedRoute>
              <AddDomain />
            </ProtectedRoute>
          }
        />
        <Route
          path="/domains/edit/:id"
          element={
            <ProtectedRoute>
              <EditDomain />
            </ProtectedRoute>
          }
        />
        <Route
          path="/calendar"
          element={
            <ProtectedRoute>
              <Calendar />
            </ProtectedRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <Analytics />
            </ProtectedRoute>
          }
        />
        <Route
          path="/features"
          element={
            <ProtectedRoute>
              <FeatureList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthContext.Provider>
  );
}
