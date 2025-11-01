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
    通过向上遍历目录结构来动态查找 Bot 和 Napcat 配置文件。
    它会向上搜索最多5个级别，以查找 'Bot'/'MoFox-Bot' 和 'Adapter' 文件夹。
    """
    bot_path = None
    model_path = None
    napcat_path = None

    search_dir = os.path.dirname(os.path.abspath(__file__))

    for _ in range(5):
        # 1. 查找 Bot/MoFox-Bot 目录
        if not bot_path:
            for bot_folder_name in ["Bot", "MoFox-Bot"]:
                bot_candidate_dir = os.path.join(search_dir, bot_folder_name)
                bot_root = None
                
                if bot_folder_name == "MoFox-Bot" and os.path.isdir(bot_candidate_dir):
                    bot_root = os.path.join(bot_candidate_dir, "Bot")
                elif bot_folder_name == "Bot" and os.path.isdir(bot_candidate_dir):
                    bot_root = bot_candidate_dir
                
                if bot_root and os.path.isdir(bot_root):
                    config_dir = os.path.join(bot_root, "config")
                    bot_config_candidate = os.path.join(config_dir, "bot_config.toml")
                    model_config_candidate = os.path.join(config_dir, "model_config.toml")
                    
                    if os.path.exists(bot_config_candidate):
                        bot_path = bot_config_candidate
                        print(f"成功找到 Bot 配置文件: {bot_path}")
                        if os.path.exists(model_config_candidate):
                            model_path = model_config_candidate
                            print(f"成功找到 Model 配置文件: {model_path}")
                        
                        if not napcat_path:
                           standard_napcat_path = os.path.join(config_dir, "plugins", "napcat_adapter", "config.toml")
                           if os.path.exists(standard_napcat_path):
                               napcat_path = standard_napcat_path
                               print(f"在 Bot 目录中找到 Napcat 配置文件: {napcat_path}")
                        break
            
        # 2. 查找 'Adapter' 目录 (作为备选的 Napcat 配置)
        if not napcat_path:
            # 结构: .../MoFox-Bot/Adapter/config/config.toml
            potential_mofox_bot_dir = os.path.join(search_dir, "MoFox-Bot")
            if os.path.isdir(potential_mofox_bot_dir):
                adapter_dir = os.path.join(potential_mofox_bot_dir, "Adapter")
                if os.path.isdir(adapter_dir):
                    napcat_candidate = os.path.join(adapter_dir, "config", "config.toml")
                    if os.path.exists(napcat_candidate):
                        napcat_path = napcat_candidate
                        print(f"成功找到 'Adapter' (Napcat) 配置文件: {napcat_path}")

        if bot_path and napcat_path:
            break

        parent_dir = os.path.dirname(search_dir)
        if parent_dir == search_dir:
            break
        search_dir = parent_dir

    return { "bot": bot_path, "model": model_path, "napcat": napcat_path }

# --- 全局启动错误变量 ---
STARTUP_ERROR = None

try:
    # --- 路径分配 ---
    found_paths = find_config_paths()

    BOT_CONFIG_PATH = found_paths.get("bot")
    MODEL_CONFIG_PATH = found_paths.get("model")
    NAPCAT_CONFIG_PATH = found_paths.get("napcat")

    # --- 路径验证 ---
    if not BOT_CONFIG_PATH or not os.path.exists(BOT_CONFIG_PATH):
        raise FileNotFoundError("错误: 'bot' 配置文件 (bot_config.toml) 未找到。请检查项目结构。")
    if not MODEL_CONFIG_PATH or not os.path.exists(MODEL_CONFIG_PATH):
        raise FileNotFoundError(f"错误: 'model' 配置文件 (model_config.toml) 未找到。预期位置应在与bot配置文件相同的目录中。")

    if not NAPCAT_CONFIG_PATH:
        print("警告: 未找到 'napcat' 适配器配置文件。相关功能将不可用。")

except FileNotFoundError as e:
    STARTUP_ERROR = str(e)
    print(f"!!! 启动错误: {STARTUP_ERROR}")
    # 将路径变量设置为 None 以防止后续操作出错
    BOT_CONFIG_PATH, MODEL_CONFIG_PATH, NAPCAT_CONFIG_PATH, LOG_FILE_PATH = None, None, None, None

# --- 应用状态 API ---
@app.get("/api/status")
def get_app_status():
    """
    检查并报告应用程序的启动状态。
    如果启动时发生错误（例如，找不到配置文件），将返回错误信息。
    """
    if STARTUP_ERROR:
        return {"status": "error", "message": STARTUP_ERROR}
    return {"status": "ok", "message": "应用程序已成功启动"}


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
    如果启动失败，则不执行任何操作。
    """
    if STARTUP_ERROR:
        return {} # 或者返回一个特定的错误响应
    with open(BOT_CONFIG_PATH, "r", encoding="utf-8") as f:
        return tomlkit.load(f)

@app.post("/config/bot")
async def update_bot_config(request: Request):
    """
    更新并保存机器人主配置文件。
    如果启动失败，则不执行任何操作。
    """
    if STARTUP_ERROR:
        return {"status": "error", "message": STARTUP_ERROR}
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
    如果启动失败，则不执行任何操作。
    """
    if STARTUP_ERROR:
        return {}
    with open(MODEL_CONFIG_PATH, "r", encoding="utf-8") as f:
        return tomlkit.load(f)

@app.post("/config/model")
async def update_model_config(request: Request):
    """
    更新并保存模型配置文件。
    如果启动失败，则不执行任何操作。
    """
    if STARTUP_ERROR:
        return {"status": "error", "message": STARTUP_ERROR}
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
    如果未找到配置文件，则返回空字典。
    """
    if not NAPCAT_CONFIG_PATH:
        return {}
    with open(NAPCAT_CONFIG_PATH, "r", encoding="utf-8") as f:
        return tomlkit.load(f)

@app.post("/config/napcat")
async def update_napcat_config(request: Request):
    """
    更新并保存 Napcat 适配器配置文件。
    如果未找到配置文件，则返回错误。
    """
    if not NAPCAT_CONFIG_PATH:
        return {"status": "error", "message": "Napcat 配置文件路径未配置或未找到。"}
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