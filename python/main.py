# 导入 FastAPI 和相关模块，用于构建 Web 服务
from fastapi import FastAPI, Request, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import asyncio
# 导入 tomlkit 模块，用于处理 .toml 格式的配置文件，它可以保留注释和格式
import tomlkit
# 导入 os 模块，用于处理文件和目录路径
import os
# 导入 json 模块 (虽然在此文件中未使用，但通常在 FastAPI 应用中很有用)
import json

# 创建 FastAPI 应用实例
app = FastAPI()

# 添加 CORS (跨源资源共享) 中间件
# 这允许来自任何源的 Web 前端访问此 API
app.add_middleware(
    CORSMiddleware,
    # 允许所有来源的请求
    allow_origins=["*"],
    # 允许请求携带凭据 (如 cookie)
    allow_credentials=True,
    # 允许所有 HTTP 方法 (GET, POST, etc.)
    allow_methods=["*"],
    # 允许所有 HTTP 请求头
    allow_headers=["*"],
)

# --- 动态查找配置文件路径 ---
def find_config_paths():
    """
    通过检查一系列可能的相对路径来动态查找配置文件。
    这使得应用能够适应不同的目录结构。
    返回一个包含有效路径的字典，如果找不到则返回None。
    """
    script_dir = os.path.dirname(__file__)
    
    # 定义两种可能的 "Bot" 目录相对于当前脚本的位置
    # 1. MoFox-UI 和 Bot 都在 core 文件夹内 (../..)
    # 2. MoFox-UI 和 Bot 是兄弟目录 (..)
    possible_bot_roots = [
        os.path.abspath(os.path.join(script_dir, "..", "..", "Bot")),
        os.path.abspath(os.path.join(script_dir, "..", "Bot")),
    ]
    
    for bot_root in possible_bot_roots:
        config_dir = os.path.join(bot_root, "config")
        bot_config_path = os.path.join(config_dir, "bot_config.toml")
        
        # 如果找到了 bot_config.toml，就认为这个路径是正确的
        if os.path.exists(bot_config_path):
            print(f"成功在以下位置找到配置文件目录: {config_dir}")
            return {
                "bot": bot_config_path,
                "model": os.path.join(config_dir, "model_config.toml"),
                "napcat": os.path.join(config_dir, "plugins", "napcat_adapter", "config.toml"),
            }
            
    return None

# 执行查找
found_paths = find_config_paths()

if not found_paths:
    raise FileNotFoundError("错误: 无法在任何预设的目录结构中找到 'Bot/config' 文件夹。请检查项目结构是否正确。")

# 分配路径
BOT_CONFIG_PATH = found_paths["bot"]
MODEL_CONFIG_PATH = found_paths["model"]
NAPCAT_CONFIG_PATH = found_paths["napcat"]

# 检查所有文件是否都存在
for name, path in found_paths.items():
    if not os.path.exists(path):
        # 这个错误理论上不应该发生，因为我们已经基于 bot_config.toml 的存在来确认路径
        raise FileNotFoundError(f"错误: 找到了 'Bot' 目录，但无法找到 '{name}' 配置文件。预期位置: {path}")

def find_log_file():
    """动态查找主日志文件"""
    bot_dir = os.path.dirname(os.path.dirname(BOT_CONFIG_PATH))
    log_path = os.path.join(bot_dir, "logs", "Mai.log")
    if os.path.exists(log_path):
        print(f"成功找到日志文件: {log_path}")
        return log_path
    print(f"警告: 在 {log_path} 未找到日志文件。")
    return None

LOG_FILE_PATH = find_log_file()

# --- 机器人配置 API ---
@app.get("/config/bot")
def get_bot_config():
    """
    提供机器人主配置文件的内容。
    通过 GET 请求访问此端点时，将读取并返回 bot_config.toml 的内容。
    """
    with open(BOT_CONFIG_PATH, "r", encoding="utf-8") as f:
        return tomlkit.load(f)

@app.post("/config/bot")
async def update_bot_config(request: Request):
    """
    更新并保存机器人主配置文件。
    接收来自前端的 POST 请求 (JSON 格式)，并将其写入 bot_config.toml。
    """
    new_data = await request.json()
    with open(BOT_CONFIG_PATH, "r+", encoding="utf-8") as f:
        # 读取现有内容以保留注释和结构
        content = tomlkit.load(f)
        # 递归更新值
        def update_recursive(d, u):
            for k, v in u.items():
                if isinstance(v, dict):
                    d[k] = update_recursive(d.get(k, {}), v)
                else:
                    d[k] = v
            return d
        
        update_recursive(content, new_data)
        
        # 回到文件开头并清空
        f.seek(0)
        f.truncate()
        # 写入更新后的内容
        tomlkit.dump(content, f)
    return {"status": "success"}

# --- 模型配置 API ---
@app.get("/config/model")
def get_model_config():
    """
    提供模型配置文件的内容。
    通过 GET 请求访问此端点时，将读取并返回 model_config.toml 的内容。
    """
    with open(MODEL_CONFIG_PATH, "r", encoding="utf-8") as f:
        return tomlkit.load(f)

@app.post("/config/model")
async def update_model_config(request: Request):
    """
    更新并保存模型配置文件。
    接收来自前端的 POST 请求 (JSON 格式)，并将其写入 model_config.toml。
    """
    new_data = await request.json()
    with open(MODEL_CONFIG_PATH, "r+", encoding="utf-8") as f:
        content = tomlkit.load(f)
        def update_recursive(d, u):
            for k, v in u.items():
                if isinstance(v, dict):
                    d[k] = update_recursive(d.get(k, {}), v)
                else:
                    d[k] = v
            return d
        update_recursive(content, new_data)
        f.seek(0)
        f.truncate()
        tomlkit.dump(content, f)
    return {"status": "success"}

# --- Napcat 适配器配置 API ---
@app.get("/config/napcat")
def get_napcat_config():
    """
    提供 Napcat 适配器配置文件的内容。
    通过 GET 请求访问此端点时，将读取并返回 napcat 插件的 config.toml 内容。
    """
    with open(NAPCAT_CONFIG_PATH, "r", encoding="utf-8") as f:
        return tomlkit.load(f)

@app.post("/config/napcat")
async def update_napcat_config(request: Request):
    """
    更新并保存 Napcat 适配器配置文件。
    接收来自前端的 POST 请求 (JSON 格式)，并将其写入 napcat 插件的 config.toml。
    """
    new_data = await request.json()
    with open(NAPCAT_CONFIG_PATH, "r+", encoding="utf-8") as f:
        content = tomlkit.load(f)
        def update_recursive(d, u):
            for k, v in u.items():
                if isinstance(v, dict):
                    d[k] = update_recursive(d.get(k, {}), v)
                else:
                    d[k] = v
            return d
        update_recursive(content, new_data)
        f.seek(0)
        f.truncate()
        tomlkit.dump(content, f)
    return {"status": "success"}

# --- 日志流 WebSocket API ---
@app.websocket("/ws/logs")
async def websocket_log_endpoint(websocket: WebSocket):
    """
    通过WebSocket实时推送日志文件的最新内容。
    """
    await websocket.accept()
    
    if not LOG_FILE_PATH:
        await websocket.send_text('{"type": "status", "status": "not_found", "message": "未找到日志文件"}')
        await websocket.close()
        return

    try:
        await websocket.send_text('{"type": "status", "status": "connected", "message": "已连接到日志流"}')
        with open(LOG_FILE_PATH, "r", encoding="utf-8") as f:
            # 移动到文件末尾
            f.seek(0, 2)
            while True:
                line = f.readline()
                if not line:
                    # 如果没有新行，则稍作等待
                    await asyncio.sleep(0.5)
                    continue
                # 发送新日志行
                await websocket.send_text(line.strip())
    except WebSocketDisconnect:
        print("日志流客户端断开连接")
    except Exception as e:
        print(f"日志流发生错误: {e}")
        try:
            await websocket.send_text(f'{{"type": "error", "message": "读取日志时发生错误: {e}"}}')
        except:
            pass # 客户端可能已经断开
    finally:
        print("关闭日志流WebSocket连接")