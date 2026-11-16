@echo off
title The Red Box - Localhost Server
cls
echo ========================================================
echo    THE RED BOX - AUTHENTIC INDO-CHINESE FOOD ON THE GO
echo    Localhost Web Application Launcher
echo ========================================================
echo.

cd /d "%~dp0"

:: 1. Check Python
where python >nul 2>nul
if %ERRORLEVEL% equ 0 (
    echo [INFO] Python detected. Starting Red Box Python server...
    python server.py
    goto end
)

:: 2. Check Node.js
where node >nul 2>nul
if %ERRORLEVEL% equ 0 (
    echo [INFO] Node.js detected. Starting Red Box Node.js server...
    node server.js
    goto end
)

:: 3. Fallback: Python3
where python3 >nul 2>nul
if %ERRORLEVEL% equ 0 (
    echo [INFO] Python3 detected. Starting Red Box Python3 server...
    python3 server.py
    goto end
)

echo [WARNING] Neither Python nor Node.js was found in your PATH.
echo Attempting to open index.html directly in your default browser...
start index.html

:end
pause
