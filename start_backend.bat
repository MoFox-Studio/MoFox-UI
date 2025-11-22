@echo off
chcp 65001
set PYTHONUTF8=1
echo Activating virtual environment...
call .venv\Scripts\activate.bat

echo Starting Python backend server...
python -m uvicorn python.main:app --host 127.0.0.1 --port 8001