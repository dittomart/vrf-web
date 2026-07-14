@echo off
title VRF Kitchen - Local Server
echo ============================================
echo   VRF Kitchen - starting local server...
echo ============================================
echo.
echo   App will open at: http://localhost:8080
echo   Keep this window open while using the app.
echo   Close this window to stop the server.
echo.
cd /d "%~dp0"
start "" "http://localhost:8080"
node serve.js
pause
