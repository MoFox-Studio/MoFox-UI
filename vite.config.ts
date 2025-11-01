// 导入Vite的配置函数
import { defineConfig } from 'vite';
// 导入Vite的React插件 (使用SWC进行转换)
import react from '@vitejs/plugin-react-swc';
// 导入Node.js的path模块，用于处理文件路径
import path from 'path';
// 导入Node.js的net模块，用于检查端口
import { createServer } from 'net';

// 检查端口是否可用的函数
const isPortFree = (port: number): Promise<boolean> =>
  new Promise((resolve) => {
    const server = createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on('error', (err) => {
      // @ts-ignore
      if (err.code === 'EADDRINUSE') {
        resolve(false);
      } else {
        resolve(true); // 如果发生其他错误，我们假设端口是可用的
      }
    });
  });

// 查找可用端口的函数
async function findAvailablePort(ports: number[]): Promise<number> {
  for (const port of ports) {
    const isFree = await isPortFree(port);
    if (isFree) {
      console.log(`[MoFox-UI] 端口 ${port} 可用，将使用此端口。`);
      return port;
    }
    console.log(`[MoFox-UI] 端口 ${port} 被占用。`);
  }
  console.log('[MoFox-UI] 所有首选端口均被占用，将使用随机端口。');
  return 0; // 返回 0 以让 Vite 自动选择一个可用端口
}

// 导出Vite配置对象
export default defineConfig(async () => {
  const portsToTry = [11451, 35023, 31415];
  const port = await findAvailablePort(portsToTry);

  return {
    // 插件配置
    plugins: [react()],
    // 解析配置
    resolve: {
      // 自动解析的文件扩展名
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
      // 路径别名配置，简化导入路径
      alias: {
        // Shadcn UI 和其他库的别名
        // ... 此处省略大量别名配置
        
        // `@` 别名，指向 `src` 目录
        '@': path.resolve(__dirname, './src'),
      },
    },
    // 构建配置
    build: {
      target: 'esnext', // 目标浏览器环境
      outDir: 'build', // 构建输出目录
    },
    // 开发服务器配置
    server: {
      port, // 使用动态选择的端口
      open: true, // 自动在浏览器中打开
      // 代理配置，用于将前端请求转发到后端API
      proxy: {
        // 代理所有 /config 和 /api 的请求到后端
        '/config': {
          target: 'http://127.0.0.1:8001',
          changeOrigin: true,
        },
        '/api': {
          target: 'http://127.0.0.1:8001',
          changeOrigin: true,
        },
      },
    },
  };
});