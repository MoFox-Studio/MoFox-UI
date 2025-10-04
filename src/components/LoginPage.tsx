import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { Alert, AlertDescription } from "./ui/alert";
import { Bot, Lock, User, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

interface LoginPageProps {
  onLogin: (credentials: { username: string; password: string; rememberMe: boolean }) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
 
   useEffect(() => {
    const savedUsername = localStorage.getItem("username");
    const savedPassword = localStorage.getItem("password");
    if (savedUsername) {
      setCredentials(prev => ({ ...prev, username: savedUsername, rememberMe: true }));
       if (savedPassword) {
         setCredentials(prev => ({ ...prev, password: savedPassword, rememberMe: true }));
       }
    }
  }, []);

   const handleSubmit = async (e: React.FormEvent) => {
     e.preventDefault();
    setError("");
    
    if (!credentials.username || !credentials.password) {
      setError("请输入用户名和密码");
      return;
    }

    setIsLoading(true);
    
    try {
      // 模拟登录API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 简单的演示登录验证（实际项目中应该调用后端API）
      if (credentials.username === "admin" && credentials.password === "admin123") {
        toast.success("登录成功！");
        if (credentials.rememberMe) {
          localStorage.setItem("username", credentials.username);
          localStorage.setItem("password", credentials.password);
        } else {
          localStorage.removeItem("username");
          localStorage.removeItem("password");
        }
        onLogin(credentials);
      } else {
        setError("用户名或密码错误");
      }
    } catch (error) {
      setError("登录失败，请稍后再试");
    } finally {
      setIsLoading(false);
    }
  };

  const updateCredentials = (key: string, value: any) => {
    setCredentials(prev => ({ ...prev, [key]: value }));
    if (error) setError(""); // 清除错误信息
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/10 p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo和标题 */}
        <div className="text-center space-y-4">
          <div className="mx-auto h-16 w-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
            <Bot className="h-8 w-8 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl">MoFox Bot</h1>
            <p className="text-muted-foreground">管理面板登录</p>
          </div>
        </div>

        {/* 登录表单 */}
        <Card className="shadow-lg border-0 bg-card/80 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-xl text-center">欢迎回来</CardTitle>
            <CardDescription className="text-center">
              请登录您的管理员账户
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="username">用户名</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="请输入用户名"
                    value={credentials.username}
                    onChange={(e) => updateCredentials("username", e.target.value)}
                    className="pl-10"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">密码</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="请输入密码"
                    value={credentials.password}
                    onChange={(e) => updateCredentials("password", e.target.value)}
                    className="pl-10 pr-10"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={credentials.rememberMe}
                  onCheckedChange={(checked: any) => updateCredentials("rememberMe", checked)}
                  disabled={isLoading}
                />
                <Label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer">
                  记住登录状态
                </Label>
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? "登录中..." : "登录"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* 演示信息 */}
        <Card className="bg-muted/50 border-dashed">
          <CardContent className="pt-6">
            <div className="text-center text-sm text-muted-foreground space-y-1">
              <p>演示账户：</p>
              <p>用户名: <code className="px-1 py-0.5 bg-background rounded">admin</code></p>
              <p>密码: <code className="px-1 py-0.5 bg-background rounded">admin123</code></p>
            </div>
          </CardContent>
        </Card>

        {/* 版权信息 */}
        <div className="text-center text-xs text-muted-foreground">
          <p>© 2024 MoFox Bot. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}