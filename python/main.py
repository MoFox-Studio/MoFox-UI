# 导入 FastAPI 和相关模块，用于构建 Web 服务
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
# 导入 toml 模块，用于处理 .toml 格式的配置文件
import toml
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

# --- 配置文件路径 ---
# 定义机器人主配置文件 (bot_config.toml) 的绝对路径
BOT_CONFIG_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "Bot", "config", "bot_config.toml"))
# 定义模型配置文件 (model_config.toml) 的绝对路径
MODEL_CONFIG_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "Bot", "config", "model_config.toml"))
# 定义 Napcat 适配器配置文件 (config.toml) 的绝对路径
NAPCAT_CONFIG_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "Bot", "config", "plugins", "napcat_adapter", "config.toml"))

# --- 机器人配置 API ---
@app.get("/config/bot")
def get_bot_config():
    """
    提供机器人主配置文件的内容。
    通过 GET 请求访问此端点时，将读取并返回 bot_config.toml 的内容。
    """
    with open(BOT_CONFIG_PATH, "r", encoding="utf-8") as f:
        return toml.load(f)

@app.post("/config/bot")
async def update_bot_config(request: Request):
    """
    更新并保存机器人主配置文件。
    接收来自前端的 POST 请求 (JSON 格式)，并将其写入 bot_config.toml。
    """
    data = await request.json()
    with open(BOT_CONFIG_PATH, "w", encoding="utf-8") as f:
        toml.dump(data, f)
    return {"status": "success"}

# --- 模型配置 API ---
@app.get("/config/model")
def get_model_config():
    """
    提供模型配置文件的内容。
    通过 GET 请求访问此端点时，将读取并返回 model_config.toml 的内容。
    """
    with open(MODEL_CONFIG_PATH, "r", encoding="utf-8") as f:
        return toml.load(f)

@app.post("/config/model")
async def update_model_config(request: Request):
    """
    更新并保存模型配置文件。
    接收来自前端的 POST 请求 (JSON 格式)，并将其写入 model_config.toml。
    """
    data = await request.json()
    with open(MODEL_CONFIG_PATH, "w", encoding="utf-8") as f:
        toml.dump(data, f)
    return {"status": "success"}

# --- Napcat 适配器配置 API ---
@app.get("/config/napcat")
def get_napcat_config():
    """
    提供 Napcat 适配器配置文件的内容。
    通过 GET 请求访问此端点时，将读取并返回 napcat 插件的 config.toml 内容。
    """
    with open(NAPCAT_CONFIG_PATH, "r", encoding="utf-8") as f:
        return toml.load(f)

@app.post("/config/napcat")
async def update_napcat_config(request: Request):
    """
    更新并保存 Napcat 适配器配置文件。
    接收来自前端的 POST 请求 (JSON 格式)，并将其写入 napcat 插件的 config.toml。
    """
    data = await request.json()
    with open(NAPCAT_CONFIG_PATH, "w", encoding="utf-8") as f:
        toml.dump(data, f)
    return {"status": "success"}