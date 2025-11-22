// 从 react-dom/client 导入 createRoot，用于创建 React 根
import { createRoot } from "react-dom/client";
// 导入主应用组件 App
import App from "./App";
// 导入全局样式表
import "./index.css";

// 使用 createRoot 创建应用的根，并渲染 App 组件
createRoot(document.getElementById("root")!).render(<App />);