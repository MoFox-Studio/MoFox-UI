// 导入 express 模块，用于创建和管理服务器
import express, { Request, Response } from 'express';
// 导入数据库查询函数
import { getMemoryData } from './memoryDatabase';

// 创建一个新的 express 应用
const app = express();
// 定义服务器运行的端口
const port = 3001;

// 定义一个 GET 路由，用于获取记忆数据
app.get('/api/memory', async (req: Request, res: Response) => {
  try {
    // 调用函数从数据库获取数据
    const data = await getMemoryData();
    // 以 JSON 格式返回成功响应和数据
    res.json({ success: true, data });
  } catch (error: unknown) {
    // 捕获并处理错误
    if (error instanceof Error) {
      // 如果是 Error 实例，返回 500 状态码和错误信息
      res.status(500).json({ success: false, message: error.message });
    } else {
      // 对于未知错误，返回通用错误信息
      res.status(500).json({ success: false, message: 'Unknown error' });
    }
  }
});

// 启动服务器并监听指定端口
app.listen(port, () => {
  // 在控制台输出服务器启动信息
  console.log(`Memory API server running at http://localhost:${port}`);
});