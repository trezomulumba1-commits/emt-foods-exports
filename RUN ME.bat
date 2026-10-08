@echo off
color 0A
echo ========================================================
echo        STARTING EMT FOODS EXPORTS SERVERS
echo ========================================================
echo.

cd /d "%~dp0"

echo [1/3] Checking for running instances to prevent conflicts...
for %%P in (3003 3001) do (
  for /f "tokens=5" %%I in ('netstat -ano ^| findstr /R /C:":%%P .*LISTENING"') do (
    echo       - Stopping old process on port %%P ^(PID: %%I^)
    taskkill /PID %%I /F >nul 2>nul
  )
)

echo [2/3] Starting Main Storefront on port 3003...
start "EMT Storefront (Main)" cmd /c "title EMT Storefront (Main) && npm run dev"

echo [3/3] Starting Admin Dashboard on port 3001...
start "EMT Admin Dashboard" cmd /c "title EMT Admin Dashboard && npm run dev:admin-app"

echo.
echo ========================================================
echo  All systems go! 
echo  Main Site: http://localhost:3003
echo  Admin Dashboard: http://localhost:3001
echo ========================================================
pause
