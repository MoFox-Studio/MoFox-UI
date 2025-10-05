import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ScrollArea } from "./ui/scroll-area";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from "recharts";
import { 
  MessageCircle, 
  Users, 
  TrendingUp, 
  Calendar,
  Trophy,
  User,
  Hash,
  Clock,
  RefreshCw
} from "lucide-react";

// 模拟数据
const mockChatData = {
  // 聊天类型统计
  chatTypes: [
    { name: "群聊", value: 12845, percentage: 73.2, color: "#4F46E5" },
    { name: "私聊", value: 4712, percentage: 26.8, color: "#06B6D4" }
  ],
  
  // 用户消息排行 Top 10
  topUsers: [
    { qq: "123456789", nickname: "小明", messages: 2341, chatType: "群聊", lastActive: "2分钟前", avatar: "M" },
    { qq: "987654321", nickname: "小红", messages: 1876, chatType: "私聊", lastActive: "5分钟前", avatar: "H" },
    { qq: "456789123", nickname: "张三", messages: 1654, chatType: "群聊", lastActive: "10分钟前", avatar: "Z" },
    { qq: "789123456", nickname: "李四", messages: 1432, chatType: "群聊", lastActive: "15分钟前", avatar: "L" },
    { qq: "321654987", nickname: "王五", messages: 1287, chatType: "私聊", lastActive: "20分钟前", avatar: "W" },
    { qq: "654987321", nickname: "赵六", messages: 1156, chatType: "群聊", lastActive: "25分钟前", avatar: "Z" },
    { qq: "147258369", nickname: "钱七", messages: 987, chatType: "私聊", lastActive: "30分钟前", avatar: "Q" },
    { qq: "258369147", nickname: "孙八", messages: 854, chatType: "群聊", lastActive: "35分钟前", avatar: "S" },
    { qq: "369147258", nickname: "周九", messages: 743, chatType: "群聊", lastActive: "40分钟前", avatar: "Z" },
    { qq: "159357246", nickname: "吴十", messages: 621, chatType: "私聊", lastActive: "45分钟前", avatar: "W" }
  ],
  
  // 时间分布数据
  timeDistribution: [
    { hour: "00", messages: 234 },
    { hour: "01", messages: 123 },
    { hour: "02", messages: 87 },
    { hour: "03", messages: 45 },
    { hour: "04", messages: 32 },
    { hour: "05", messages: 28 },
    { hour: "06", messages: 156 },
    { hour: "07", messages: 345 },
    { hour: "08", messages: 567 },
    { hour: "09", messages: 789 },
    { hour: "10", messages: 892 },
    { hour: "11", messages: 945 },
    { hour: "12", messages: 1023 },
    { hour: "13", messages: 876 },
    { hour: "14", messages: 734 },
    { hour: "15", messages: 821 },
    { hour: "16", messages: 945 },
    { hour: "17", messages: 1087 },
    { hour: "18", messages: 1234 },
    { hour: "19", messages: 1456 },
    { hour: "20", messages: 1678 },
    { hour: "21", messages: 1543 },
    { hour: "22", messages: 1234 },
    { hour: "23", messages: 876 }
  ],
  
  // 群聊详细统计
  groupChats: [
    { groupId: "111111111", groupName: "技术交流群", members: 156, messages: 4567, avgDaily: 287 },
    { groupId: "222222222", groupName: "日常聊天群", members: 89, messages: 3456, avgDaily: 201 },
    { groupId: "333333333", groupName: "游戏讨论群", members: 234, messages: 2876, avgDaily: 178 },
    { groupId: "444444444", groupName: "学习分享群", members: 67, messages: 1945, avgDaily: 123 },
    { groupId: "555555555", groupName: "工作交流群", members: 45, messages: 1001, avgDaily: 89 }
  ]
};

export function ChatStatistics() {
  const [selectedPeriod, setSelectedPeriod] = useState("7d");
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const refreshData = useCallback(() => {
    setIsLoading(true);
    // 模拟数据刷新
    setTimeout(() => {
      setIsLoading(false);
      setLastUpdate(new Date());
    }, 1000);
  }, []);

  // 监听时间段变化，自动刷新数据
  useEffect(() => {
    refreshData();
  }, [selectedPeriod, refreshData]);

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('zh-CN').format(num);
  };

  const getRankIcon = (index: number) => {
    if (index === 0) return "🥇";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";
    return `#${index + 1}`;
  };

  return (
    <div className="space-y-6">
      {/* 页面头部 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1d">最近24小时</SelectItem>
              <SelectItem value="7d">最近7天</SelectItem>
              <SelectItem value="30d">最近30天</SelectItem>
              <SelectItem value="90d">最近90天</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-sm text-muted-foreground">
            最后更新: {lastUpdate.toLocaleTimeString()}
          </div>
          <Button 
            variant="outline" 
            onClick={refreshData}
            disabled={isLoading}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            刷新数据
          </Button>
        </div>
      </div>

      {/* 概览卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">总消息数</p>
                <p className="text-2xl font-semibold">
                  {formatNumber(mockChatData.chatTypes.reduce((sum, item) => sum + item.value, 0))}
                </p>
              </div>
              <MessageCircle className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">活跃用户</p>
                <p className="text-2xl font-semibold">{mockChatData.topUsers.length}</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">群聊数量</p>
                <p className="text-2xl font-semibold">{mockChatData.groupChats.length}</p>
              </div>
              <Hash className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">日均消息</p>
                <p className="text-2xl font-semibold">2.5K</p>
              </div>
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 主要内容区域 */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">数据概览</TabsTrigger>
          <TabsTrigger value="ranking">用户排行</TabsTrigger>
          <TabsTrigger value="groups">群聊分析</TabsTrigger>
          <TabsTrigger value="timeline">时间分布</TabsTrigger>
        </TabsList>

        {/* 数据概览 */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 聊天类型分布 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  聊天类型分布
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={mockChatData.chatTypes}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, percentage }: { name?: string; percentage?: number }) => `${name}: ${percentage}%`}
                      >
                        {mockChatData.chatTypes.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatNumber(value as number)} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 space-y-2">
                  {mockChatData.chatTypes.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: item.color }}
                        />
                        <span>{item.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{formatNumber(item.value)}</div>
                        <div className="text-sm text-muted-foreground">{item.percentage}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 消息活跃度趋势 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  24小时活跃度
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={mockChatData.timeDistribution}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="hour" />
                      <YAxis />
                      <Tooltip formatter={(value) => formatNumber(value as number)} />
                      <Line 
                        type="monotone" 
                        dataKey="messages" 
                        stroke="#4F46E5" 
                        strokeWidth={2}
                        dot={{ fill: "#4F46E5" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 用户排行 */}
        <TabsContent value="ranking" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                用户消息排行榜 Top 10
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-4">
                  {mockChatData.topUsers.map((user, index) => (
                    <div key={user.qq} className="flex items-center gap-4 p-4 rounded-lg border bg-card">
                      <div className="flex items-center justify-center w-8 h-8 font-semibold text-sm">
                        {getRankIcon(index)}
                      </div>
                      
                      <div className="flex items-center justify-center w-10 h-10 bg-primary text-primary-foreground rounded-full font-semibold">
                        {user.avatar}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{user.nickname}</span>
                          <Badge variant={user.chatType === "群聊" ? "default" : "secondary"} className="text-xs">
                            {user.chatType}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">QQ: {user.qq}</div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-lg font-semibold">{formatNumber(user.messages)}</div>
                        <div className="text-sm text-muted-foreground">条消息</div>
                      </div>
                      
                      <div className="text-right text-sm text-muted-foreground min-w-20">
                        <Clock className="h-3 w-3 inline mr-1" />
                        {user.lastActive}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 群聊分析 */}
        <TabsContent value="groups" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                群聊活跃度统计
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockChatData.groupChats.map((group, index) => (
                  <div key={group.groupId} className="flex items-center gap-4 p-4 rounded-lg border bg-card">
                    <div className="flex items-center justify-center w-10 h-10 bg-primary text-primary-foreground rounded-lg font-semibold">
                      #{index + 1}
                    </div>
                    
                    <div className="flex-1">
                      <div className="font-semibold">{group.groupName}</div>
                      <div className="text-sm text-muted-foreground">
                        群号: {group.groupId} • {group.members} 名成员
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-lg font-semibold">{formatNumber(group.messages)}</div>
                        <div className="text-xs text-muted-foreground">总消息</div>
                      </div>
                      <div>
                        <div className="text-lg font-semibold">{group.avgDaily}</div>
                        <div className="text-xs text-muted-foreground">日均消息</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 时间分布 */}
        <TabsContent value="timeline" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                24小时消息分布
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mockChatData.timeDistribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${formatNumber(value as number)} 条`, "消息数量"]} />
                    <Bar dataKey="messages" fill="#4F46E5" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}