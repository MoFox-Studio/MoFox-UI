import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

// 打开SQLite数据库连接
export async function openDatabase() {
  return open({
    filename: 'F:/MoFox_Bot/data/MaiBot.db',
    driver: sqlite3.Database
  });
}

// 获取记忆数据示例函数
export async function getMemoryData() {
  const db = await openDatabase();
  try {
    const rows = await db.all('SELECT * FROM memory_table LIMIT 10'); // 假设表名为memory_table
    return rows;
  } finally {
    await db.close();
  }
}