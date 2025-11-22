// 导入 sqlite3 模块，用于与 SQLite 数据库交互
import sqlite3 from 'sqlite3';
// 导入 sqlite 模块中的 open 函数，用于打开数据库连接
import { open } from 'sqlite';

// 异步函数，用于打开并返回一个 SQLite 数据库连接
export async function openDatabase() {
  // 使用 open 函数配置并打开数据库
  return open({
    // 数据库文件的路径
    filename: 'F:/MoFox_Bot/data/MaiBot.db',
    // 指定使用的数据库驱动
    driver: sqlite3.Database
  });
}

// 异步函数，用于从数据库中获取记忆数据
export async function getMemoryData() {
  // 打开数据库连接
  const db = await openDatabase();
  try {
    // 执行 SQL 查询，从 memory_table 表中选择最多 10 条记录
    const rows = await db.all('SELECT * FROM memory_table LIMIT 10'); // 假设表名为memory_table
    // 返回查询结果
    return rows;
  } finally {
    // 确保数据库连接在使用后关闭
    await db.close();
  }
}