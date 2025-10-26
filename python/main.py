from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import toml
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/config/bot")
def get_bot_config():
    config_path = os.path.join("..", "Bot", "config", "bot_config.toml")
    with open(config_path, "r", encoding="utf-8") as f:
        return toml.load(f)

@app.get("/config/model")
def get_model_config():
    config_path = os.path.join("..", "Bot", "config", "model_config.toml")
    with open(config_path, "r", encoding="utf-8") as f:
        return toml.load(f)

@app.get("/config/napcat")
def get_napcat_config():
    config_path = os.path.join("..", "Bot", "config", "plugins", "napcat_adapter", "config.toml")
    with open(config_path, "r", encoding="utf-8") as f:
        return toml.load(f)