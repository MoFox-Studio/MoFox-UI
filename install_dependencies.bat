@echo off
REM 检测Python是否安装
python --version >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo Python 未安装或未添加到环境变量，请先安装Python并添加到PATH。
    goto check_node
) ELSE (
    echo Python 已安装，开始安装Python依赖...
    python -m pip install --upgrade pip -i https://repo.huaweicloud.com/repository/pypi/simple
    python -m pip install -r python\requirements.txt -i https://repo.huaweicloud.com/repository/pypi/simple
)

:check_node
REM 检测Node.js是否安装
node --version >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo Node.js 未安装或未添加到环境变量，请先安装Node.js并添加到PATH。
    goto end
) ELSE (
    echo Node.js 已安装，开始安装Node.js依赖...
    npm install --registry=https://registry.npmmirror.com
)

:end
echo 依赖安装完成。
pause