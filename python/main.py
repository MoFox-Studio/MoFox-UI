# 导入 FastAPI 和相关模块
from fastapi import FastAPI, Request, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import asyncio
import tomlkit
import os
import json
import socket
import errno
from typing import List
from pydantic import BaseModel
import sqlite3

# --- FastAPI 应用实例 ---
# 创建 FastAPI 应用实例，这是所有 API 的基础
app = FastAPI()

# --- 全局变量 ---
# 启动时发生的错误，如果没有错误则为 None
STARTUP_ERROR = None
# 机器人主配置文件的路径
BOT_CONFIG_PATH = None
# 模型配置文件的路径
MODEL_CONFIG_PATH = None
# Napcat 适配器配置文件的路径
NAPCAT_CONFIG_PATH = None
# 日志文件的路径
LOG_FILE_PATH = None

# --- CORS 中间件 ---
# 添加 CORS 中间件以允许跨域请求，这对于 Web UI 与后端 API 的交互至关重要
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 允许所有来源的请求
    allow_credentials=True,  # 允许携带凭证 (cookies, authorization headers)
    allow_methods=["*"],  # 允许所有 HTTP 方法 (GET, POST, etc.)
    allow_headers=["*"],  # 允许所有请求头
)

# --- 核心: 配置文件查找逻辑 ---
def find_config_paths():
    """
    通过向上遍历目录结构来动态查找配置文件。
    此方法旨在适应 MoFox-UI 文件夹与 Bot/MoFox-Bot 文件夹作为同级目录的常见项目结构。
    """
    bot_config, model_config, napcat_config = None, None, None
    bot_root_found = None
    
    try:
        # 从此脚本文件所在的目录 (.../MoFox-UI/python) 的上两级开始搜索
        # e.g., D:\Ksdeath\MoFox-Bot\
        start_search_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

        # 向上搜索最多5层，以避免无限循环或搜索不相关的目录
        for i in range(5):
            # 在当前搜索目录中查找 "Bot" 或 "MoFox-Bot"
            for name in ["Bot", "MoFox-Bot"]:
                potential_path = os.path.join(start_search_dir, name)
                
                if os.path.isdir(potential_path):
                    bot_root = potential_path
                    if name == "MoFox-Bot":
                         # 实际的 Bot 目录在 "MoFox-Bot" 内部
                        bot_root = os.path.join(potential_path, "Bot")

                    if os.path.isdir(bot_root):
                        config_dir = os.path.join(bot_root, "config")
                        if os.path.isdir(config_dir):
                            bot_config_candidate = os.path.join(config_dir, "bot_config.toml")
                            
                            if os.path.exists(bot_config_candidate):
                                print(f"成功在以下位置找到 Bot 配置: {bot_config_candidate}")
                                bot_config = bot_config_candidate
                                model_config = os.path.join(config_dir, "model_config.toml")
                                napcat_config_std = os.path.join(config_dir, "plugins", "napcat_adapter", "config.toml")
                                
                                bot_root_found = bot_root
                                if os.path.exists(napcat_config_std):
                                    napcat_config = napcat_config_std
                                
                                # 只要找到主配置文件，就停止对 Bot 文件夹的搜索
                                break 
            
            # 如果已找到，则跳出外部循环
            if bot_root_found:
                break
            
            # 如果没找到，就向上一层目录
            next_search_dir = os.path.dirname(start_search_dir)
            if next_search_dir == start_search_dir:  # 到达根目录
                break
            start_search_dir = next_search_dir
        
        # --- 如果标准路径中没有，则为 napcat 查找备用 'ada' 路径 ---
        if not napcat_config:
            search_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
            for _ in range(5):
                # 结构: .../MoFox-Bot-false/MoFox-Bot/Adapter/config/config.toml
                ada_root = os.path.join(search_dir, "MoFox-Bot-false")
                if os.path.isdir(ada_root):
                    ada_path = os.path.join(ada_root, "MoFox-Bot", "Adapter", "config", "config.toml")
                    if os.path.exists(ada_path):
                        print(f"成功在备用位置找到 'ada' (napcat) 配置文件: {ada_path}")
                        napcat_config = ada_path
                        break
                
                parent_dir = os.path.dirname(search_dir)
                if parent_dir == search_dir: break
                search_dir = parent_dir

        return {"bot": bot_config, "model": model_config, "napcat": napcat_config, "bot_root": bot_root_found}

    except Exception as e:
        print(f"查找配置文件时发生未知错误: {e}")
        return {}

# --- 启动时执行路径查找和验证 ---
try:
    found_paths = find_config_paths()
    
    BOT_CONFIG_PATH = found_paths.get("bot")
    MODEL_CONFIG_PATH = found_paths.get("model")
    NAPCAT_CONFIG_PATH = found_paths.get("napcat")
    bot_root_dir = found_paths.get("bot_root")

    if not BOT_CONFIG_PATH or not os.path.exists(BOT_CONFIG_PATH):
        raise FileNotFoundError("错误: 'bot_config.toml' 未找到。请确认 'MoFox-UI' 与 'Bot'/'MoFox-Bot' 文件夹在同一目录下。")

    if not MODEL_CONFIG_PATH or not os.path.exists(MODEL_CONFIG_PATH):
        print(f"警告: 'model_config.toml' 未找到。")

    if not NAPCAT_CONFIG_PATH:
        print("警告: 未找到 'napcat' 适配器配置文件。")

    if bot_root_dir:
        log_path_candidate = os.path.join(bot_root_dir, "logs", "Mai.log")
        if os.path.exists(log_path_candidate):
            LOG_FILE_PATH = log_path_candidate
            print(f"成功找到日志文件: {LOG_FILE_PATH}")
        else:
            print(f"警告: 在 {log_path_candidate} 未找到日志文件。")

except Exception as e:
    STARTUP_ERROR = str(e)
    print(f"!!! 启动错误: {STARTUP_ERROR}")

# --- 数据库连接和记忆数据读取 ---
# 数据库文件的硬编码路径，理想情况下应通过配置管理
DATABASE_PATH = r"F:\MoFox_Bot\data\MaiBot.db"

def get_db_connection():
    """
    创建并返回一个到 SQLite 数据库的连接。
    如果连接失败，则打印错误并返回 None。
    """
    try:
        conn = sqlite3.connect(DATABASE_PATH)
        conn.row_factory = sqlite3.Row  # 允许通过列名访问查询结果
        return conn
    except Exception as e:
        print(f"数据库连接失败: {e}")
        return None

@app.get("/api/memory")
def read_memory():
    """
    从数据库中读取记忆数据。
    这是一个示例端点，用于从数据库中获取数据。
    """
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="无法连接数据库")
    try:
        cursor = conn.execute("SELECT * FROM memory_table LIMIT 10")  # 假设表名为memory_table
        rows = cursor.fetchall()
        result = [dict(row) for row in rows]
        return {"success": True, "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"查询数据库失败: {e}")
    finally:
        conn.close()

# --- API Endpoints ---
@app.get("/api/status")
def get_app_status():
    """
    返回应用程序的启动状态。
    如果启动时发生错误，将返回错误信息。
    """
    if STARTUP_ERROR:
        return {"status": "error", "message": STARTUP_ERROR}
    return {"status": "ok", "message": "应用程序已成功启动"}

class CheckPortsRequest(BaseModel):
    """
    定义检查端口请求的数据模型。
    """
    ports: List[int]

def is_port_in_use(port: int) -> bool:
    """
    检查指定端口是否已被占用。
    """
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        try:
            s.bind(("127.0.0.1", port))
            return False
        except OSError as e:
            return e.errno == errno.EADDRINUSE

@app.post("/api/check-ports")
async def check_ports(request: CheckPortsRequest):
    """
    检查请求中指定的端口列表是否被占用。
    """
    results = []
    for port in request.ports:
        in_use = is_port_in_use(port)
        results.append({"port": port, "status": "occupied" if in_use else "free"})
    return results

@app.get("/config/bot")
def get_bot_config():
    """
    获取机器人主配置文件 (bot_config.toml) 的内容。
    """
    if STARTUP_ERROR or not BOT_CONFIG_PATH: return {}
    with open(BOT_CONFIG_PATH, "r", encoding="utf-8") as f:
        return tomlkit.load(f)

@app.post("/config/bot")
async def update_bot_config(request: Request):
    """
    更新机器人主配置文件 (bot_config.toml)。
    """
    if STARTUP_ERROR or not BOT_CONFIG_PATH: return {"status": "error", "message": STARTUP_ERROR or "Bot config path not found"}
    new_data = await request.json()
    with open(BOT_CONFIG_PATH, "r+", encoding="utf-8") as f:
        content = tomlkit.load(f)
        def update_recursive(d, u):
            for k, v in u.items():
                if isinstance(v, dict): d[k] = update_recursive(d.get(k, {}), v)
                else: d[k] = v
            return d
        update_recursive(content, new_data)
        f.seek(0); f.truncate()
        tomlkit.dump(content, f)
    return {"status": "success"}

@app.get("/config/model")
def get_model_config():
    """
    获取模型配置文件 (model_config.toml) 的内容。
    """
    if STARTUP_ERROR or not MODEL_CONFIG_PATH: return {}
    with open(MODEL_CONFIG_PATH, "r", encoding="utf-8") as f:
        return tomlkit.load(f)

@app.post("/config/model")
async def update_model_config(request: Request):
    """
    更新模型配置文件 (model_config.toml)。
    """
    if STARTUP_ERROR or not MODEL_CONFIG_PATH: return {"status": "error", "message": STARTUP_ERROR or "Model config path not found"}
    new_data = await request.json()
    with open(MODEL_CONFIG_PATH, "r+", encoding="utf-8") as f:
        content = tomlkit.load(f)
        def update_recursive(d, u):
            for k, v in u.items():
                if isinstance(v, dict): d[k] = update_recursive(d.get(k, {}), v)
                else: d[k] = v
            return d
        update_recursive(content, new_data)
        f.seek(0); f.truncate()
        tomlkit.dump(content, f)
    return {"status": "success"}

@app.get("/config/napcat")
def get_napcat_config():
    """
    获取 Napcat 适配器配置文件 (config.toml) 的内容。
    """
    if STARTUP_ERROR or not NAPCAT_CONFIG_PATH: return {}
    with open(NAPCAT_CONFIG_PATH, "r", encoding="utf-8") as f:
        return tomlkit.load(f)

@app.post("/config/napcat")
async def update_napcat_config(request: Request):
    """
    更新 Napcat 适配器配置文件 (config.toml)。
    """
    if STARTUP_ERROR or not NAPCAT_CONFIG_PATH: return {"status": "error", "message": STARTUP_ERROR or "Napcat config path not found"}
    new_data = await request.json()
    with open(NAPCAT_CONFIG_PATH, "r+", encoding="utf-8") as f:
        content = tomlkit.load(f)
        def update_recursive(d, u):
            for k, v in u.items():
                if isinstance(v, dict): d[k] = update_recursive(d.get(k, {}), v)
                else: d[k] = v
            return d
        update_recursive(content, new_data)
        f.seek(0); f.truncate()
        tomlkit.dump(content, f)
    return {"status": "success"}

@app.websocket("/ws/logs")
async def websocket_log_endpoint(websocket: WebSocket):
    """
    通过 WebSocket 实时流式传输日志文件内容。
    """
    await websocket.accept()
    if not LOG_FILE_PATH:
        await websocket.send_text('{"type": "status", "status": "not_found", "message": "未找到日志文件"}')
        await websocket.close()
        return
    try:
        await websocket.send_text('{"type": "status", "status": "connected", "message": "已连接到日志流"}')
        with open(LOG_FILE_PATH, "r", encoding="utf-8") as f:
            f.seek(0, 2)  # 移动到文件末尾
            while True:
                line = f.readline()
                if not line:
                    await asyncio.sleep(0.5)  # 如果没有新行，则等待
                    continue
                await websocket.send_text(line.strip())
    except WebSocketDisconnect:
        print("日志流客户端断开连接")
    except Exception as e:
        print(f"日志流发生错误: {e}")
        try:
            await websocket.send_text(f'{{"type": "error", "message": "读取日志时发生错误: {e}"}}')
        except: pass
    finally:
        print("关闭日志流WebSocket连接")