import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Separator } from "./ui/separator";
import { Switch } from "./ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";
import { 
  Users, 
  UserPlus, 
  Edit, 
  Trash2, 
  Shield, 
  Search,
  Filter,
  MoreHorizontal,
  Key,
  Calendar,
  Clock
} from "lucide-react";
import { toast } from "sonner";

interface User {
  id: string;
  username: string;
  displayName: string;
  email: string;
  role: "admin" | "manager" | "user";
  status: "active" | "inactive" | "suspended";
  lastLogin: string;
  createdAt: string;
  permissions: string[];
}

// 模拟用户数据
const mockUsers: User[] = [
  {
    id: "1",
    username: "admin",
    displayName: "系统管理员",
    email: "admin@mofox.com",
    role: "admin",
    status: "active",
    lastLogin: "2024-01-15 14:30:00",
    createdAt: "2024-01-01 09:00:00",
    permissions: ["all"]
  },
  {
    id: "2",
    username: "manager01",
    displayName: "张三",
    email: "zhangsan@mofox.com",
    role: "manager",
    status: "active",
    lastLogin: "2024-01-15 10:15:00",
    createdAt: "2024-01-05 14:00:00",
    permissions: ["config", "logs", "users"]
  },
  {
    id: "3",
    username: "user01",
    displayName: "李四",
    email: "lisi@mofox.com",
    role: "user",
    status: "active",
    lastLogin: "2024-01-14 16:20:00",
    createdAt: "2024-01-10 11:00:00",
    permissions: ["dashboard", "statistics"]
  },
  {
    id: "4",
    username: "user02",
    displayName: "王五",
    email: "wangwu@mofox.com",
    role: "user",
    status: "inactive",
    lastLogin: "2024-01-10 09:45:00",
    createdAt: "2024-01-12 15:30:00",
    permissions: ["dashboard"]
  }
];

const roles = [
  { value: "admin", label: "管理员", description: "拥有所有权限" },
  { value: "manager", label: "管理者", description: "管理配置和用户" },
  { value: "user", label: "普通用户", description: "基础访问权限" }
];

const permissions = [
  { id: "dashboard", name: "控制台", description: "查看系统概览" },
  { id: "config", name: "配置管理", description: "修改系统配置" },
  { id: "logs", name: "日志查看", description: "查看系统日志" },
  { id: "statistics", name: "统计分析", description: "查看数据统计" },
  { id: "users", name: "用户管理", description: "管理用户账户" },
  { id: "theme", name: "主题设置", description: "修改界面主题" }
];

export function UserManagement() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    displayName: "",
    email: "",
    role: "user" as User["role"],
    status: "active" as User["status"],
    permissions: [] as string[]
  });

  // 过滤用户
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800 border-red-200";
      case "manager":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "inactive":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "suspended":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const openEditDialog = (user: User) => {
    setSelectedUser(user);
    setFormData({
      username: user.username,
      displayName: user.displayName,
      email: user.email,
      role: user.role,
      status: user.status,
      permissions: user.permissions
    });
    setIsEditDialogOpen(true);
  };

  const openCreateDialog = () => {
    setFormData({
      username: "",
      displayName: "",
      email: "",
      role: "user",
      status: "active",
      permissions: ["dashboard"]
    });
    setIsCreateDialogOpen(true);
  };

  const handleSaveUser = () => {
    if (selectedUser) {
      // 编辑用户
      setUsers(prev => prev.map(user => 
        user.id === selectedUser.id 
          ? { ...user, ...formData }
          : user
      ));
      toast.success("用户信息已更新");
      setIsEditDialogOpen(false);
    } else {
      // 创建新用户
      const newUser: User = {
        id: Date.now().toString(),
        ...formData,
        lastLogin: "-",
        createdAt: new Date().toLocaleString()
      };
      setUsers(prev => [...prev, newUser]);
      toast.success("用户已创建");
      setIsCreateDialogOpen(false);
    }
    setSelectedUser(null);
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(prev => prev.filter(user => user.id !== userId));
    toast.success("用户已删除");
  };

  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      permissions: checked 
        ? [...prev.permissions, permissionId]
        : prev.permissions.filter(p => p !== permissionId)
    }));
  };

  const UserFormContent = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="username">用户名</Label>
          <Input
            id="username"
            value={formData.username}
            onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
            placeholder="输入用户名"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="displayName">显示名称</Label>
          <Input
            id="displayName"
            value={formData.displayName}
            onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
            placeholder="输入显示名称"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">邮箱地址</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          placeholder="输入邮箱地址"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>角色</Label>
          <Select value={formData.role} onValueChange={(value: User["role"]) => setFormData(prev => ({ ...prev, role: value }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {roles.map(role => (
                <SelectItem key={role.value} value={role.value}>
                  <div>
                    <div>{role.label}</div>
                    <div className="text-xs text-muted-foreground">{role.description}</div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>状态</Label>
          <Select value={formData.status} onValueChange={(value: User["status"]) => setFormData(prev => ({ ...prev, status: value }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">激活</SelectItem>
              <SelectItem value="inactive">未激活</SelectItem>
              <SelectItem value="suspended">已暂停</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-3">
        <Label>权限设置</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {permissions.map(permission => (
            <div key={permission.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex-1">
                <div className="font-medium text-sm">{permission.name}</div>
                <div className="text-xs text-muted-foreground">{permission.description}</div>
              </div>
              <Switch
                checked={formData.permissions.includes(permission.id)}
                onCheckedChange={(checked: boolean) => handlePermissionChange(permission.id, checked)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* 页面头部 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          <div>
            <h2>用户管理</h2>
            <p className="text-muted-foreground">
              管理系统用户账户和权限
            </p>
          </div>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog} className="gap-2">
              <UserPlus className="h-4 w-4" />
              新增用户
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>新增用户</DialogTitle>
            </DialogHeader>
            <UserFormContent />
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                取消
              </Button>
              <Button onClick={handleSaveUser}>
                创建用户
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">总用户数</p>
                <p className="text-xl font-semibold">{users.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                <Shield className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">活跃用户</p>
                <p className="text-xl font-semibold">{users.filter(u => u.status === "active").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <Key className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">管理员</p>
                <p className="text-xl font-semibold">{users.filter(u => u.role === "admin").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-orange-100 flex items-center justify-center">
                <Clock className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">今日登录</p>
                <p className="text-xl font-semibold">{users.filter(u => u.lastLogin.includes("2024-01-15")).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 搜索和筛选 */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索用户名、显示名称或邮箱..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="角色" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部角色</SelectItem>
                  <SelectItem value="admin">管理员</SelectItem>
                  <SelectItem value="manager">管理者</SelectItem>
                  <SelectItem value="user">普通用户</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部状态</SelectItem>
                  <SelectItem value="active">激活</SelectItem>
                  <SelectItem value="inactive">未激活</SelectItem>
                  <SelectItem value="suspended">已暂停</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 用户列表 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">用户列表</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>用户</TableHead>
                <TableHead>角色</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>最后登录</TableHead>
                <TableHead>创建时间</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">
                          {user.displayName.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-sm">{user.displayName}</div>
                        <div className="text-xs text-muted-foreground">
                          @{user.username}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${getRoleBadgeColor(user.role)}`}
                    >
                      {roles.find(r => r.value === user.role)?.label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${getStatusBadgeColor(user.status)}`}
                    >
                      {user.status === "active" ? "激活" : 
                       user.status === "inactive" ? "未激活" : "已暂停"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {user.lastLogin}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {user.createdAt}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Dialog open={isEditDialogOpen && selectedUser?.id === user.id} onOpenChange={setIsEditDialogOpen}>
                        <DialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => openEditDialog(user)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>编辑用户</DialogTitle>
                          </DialogHeader>
                          <UserFormContent />
                          <div className="flex justify-end gap-2 pt-4">
                            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                              取消
                            </Button>
                            <Button onClick={handleSaveUser}>
                              保存更改
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>确认删除</AlertDialogTitle>
                            <AlertDialogDescription>
                              确定要删除用户 "{user.displayName}" 吗？此操作不可撤销。
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>取消</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDeleteUser(user.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              删除
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredUsers.length === 0 && (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">没有找到匹配的用户</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}