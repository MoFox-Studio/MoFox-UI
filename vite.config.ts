// 导入Vite的配置函数
import { defineConfig } from 'vite';
// 导入Vite的React插件 (使用SWC进行转换)
import react from '@vitejs/plugin-react-swc';
// 导入Node.js的path模块，用于处理文件路径
import path from 'path';

// 导出Vite配置对象
export default defineConfig({
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
    port: 3001, // 服务器端口
    open: true, // 自动在浏览器中打开
    // 代理配置，用于将前端请求转发到后端API
    proxy: {
      '/config': {
        target: 'http://127.0.0.1:8001', // 后端API服务器地址
        changeOrigin: true, // 更改源，用于跨域请求
      },
    },
  },
});