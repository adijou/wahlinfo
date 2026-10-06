@echo off
setlocal
cd /d "%~dp0"
set "WAHLINFO_NODE=node"
where node >nul 2>&1
if errorlevel 1 set "WAHLINFO_NODE=%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
echo Der persoenliche Editor ist nur auf diesem Rechner erreichbar.
echo Oeffne nach dem Start http://127.0.0.1:4174/editor.html im Browser.
echo Zum Beenden dieses Fenster schliessen oder Strg+C druecken.
"%WAHLINFO_NODE%" scripts\serve.mjs --editor
pause
