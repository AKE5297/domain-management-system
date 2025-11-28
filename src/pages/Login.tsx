import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '@/contexts/authContext';
import { toast } from 'sonner';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { setIsAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  // 登录验证 - 从localStorage获取用户信息，而不是硬编码凭证
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // 模拟API请求延迟
    setTimeout(() => {
      // 从localStorage获取保存的用户信息
      const savedUser = localStorage.getItem("user");
      const storedCredentials = savedUser ? JSON.parse(savedUser) : null;
      
      // 验证逻辑 - 支持默认凭证和自定义凭证
      let isValid = false;
      let userData = null;
      
      // 检查是否使用默认凭证 admin/admin123
      if (username.toLowerCase() === 'admin' && password === 'admin123') {
        isValid = true;
        userData = {
          id: "1",
          username: "admin",
          email: "admin@example.com"
        };
      } 
      // 检查是否使用localStorage中保存的自定义凭证
      else if (storedCredentials && storedCredentials.username && storedCredentials.password) {
        isValid = username.toLowerCase() === storedCredentials.username.toLowerCase() && 
                 password === storedCredentials.password;
        userData = storedCredentials;
      }

      if (isValid && userData) {
        setIsAuthenticated(true);
        
        // 保存用户信息
        localStorage.setItem("user", JSON.stringify(userData));
        
        // 确保认证状态正确设置
        localStorage.setItem("isAuthenticated", "true");
        
        toast.success('登录成功！');
        navigate('/');
      } else {
        toast.error('用户名或密码错误，请重试');
        console.log(`登录失败: 尝试的用户名: ${username}`);
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">域名管理系统</h1>
          <p className="text-gray-500 dark:text-gray-400">请登录以管理您的域名</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              用户名
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition duration-200"
              placeholder="请输入用户名"
              required
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              密码
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition duration-200"
              placeholder="请输入密码"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <i className="fas fa-circle-notch fa-spin mr-2"></i>
                登录中...
              </>
            ) : (
              "登录"
            )}
          </button>
        </form>
        
         <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            <p>请输入您的账号密码登录系统</p>
          </div>
      </div>
    </div>
  );
}