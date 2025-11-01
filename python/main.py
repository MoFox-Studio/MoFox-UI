# 导入 FastAPI 和相关模块
from fastapi import FastAPI, Request, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import asyncio
import tomlkit
import os
import json
import socket
import errno
from typing import List
from pydantic import BaseModel

# --- FastAPI 应用实例 ---
app = FastAPI()

# --- 全局变量 ---
STARTUP_ERROR = None
BOT_CONFIG_PATH = None
MODEL_CONFIG_PATH = None
NAPCAT_CONFIG_PATH = None
LOG_FILE_PATH = None

# --- CORS 中间件 ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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

        # 向上搜索最多5层
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

# --- API Endpoints ---

@app.get("/api/status")
def get_app_status():
    if STARTUP_ERROR:
        return {"status": "error", "message": STARTUP_ERROR}
    return {"status": "ok", "message": "应用程序已成功启动"}

class CheckPortsRequest(BaseModel):
    ports: List[int]

def is_port_in_use(port: int) -> bool:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        try:
            s.bind(("127.0.0.1", port))
            return False
        except OSError as e:
            return e.errno == errno.EADDRINUSE

@app.post("/api/check-ports")
async def check_ports(request: CheckPortsRequest):
    results = []
    for port in request.ports:
        in_use = is_port_in_use(port)
        results.append({"port": port, "status": "occupied" if in_use else "free"})
    return results

@app.get("/config/bot")
def get_bot_config():
    if STARTUP_ERROR or not BOT_CONFIG_PATH: return {}
    with open(BOT_CONFIG_PATH, "r", encoding="utf-8") as f:
        return tomlkit.load(f)

@app.post("/config/bot")
async def update_bot_config(request: Request):
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
    if STARTUP_ERROR or not MODEL_CONFIG_PATH: return {}
    with open(MODEL_CONFIG_PATH, "r", encoding="utf-8") as f:
        return tomlkit.load(f)

@app.post("/config/model")
async def update_model_config(request: Request):
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
    if STARTUP_ERROR or not NAPCAT_CONFIG_PATH: return {}
    with open(NAPCAT_CONFIG_PATH, "r", encoding="utf-8") as f:
        return tomlkit.load(f)

@app.post("/config/napcat")
async def update_napcat_config(request: Request):
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
    await websocket.accept()
    if not LOG_FILE_PATH:
        await websocket.send_text('{"type": "status", "status": "not_found", "message": "未找到日志文件"}')
        await websocket.close()
        return
    try:
        await websocket.send_text('{"type": "status", "status": "connected", "message": "已连接到日志流"}')
        with open(LOG_FILE_PATH, "r", encoding="utf-8") as f:
            f.seek(0, 2)
            while True:
                line = f.readline()
                if not line:
                    await asyncio.sleep(0.5)
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