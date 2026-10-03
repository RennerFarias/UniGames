@echo off
setlocal
cd /d "%~dp0frontend"
where node >nul 2>nul
if errorlevel 1 (
  echo Instale o Node.js 22.12 ou superior antes de abrir o UniGames.
  pause
  exit /b 1
)
if not exist ".env" copy ".env.example" ".env" >nul
if not exist "node_modules" (
  call npm.cmd ci
  if errorlevel 1 (
    echo Nao foi possivel instalar as dependencias.
    pause
    exit /b 1
  )
)
echo Abra http://localhost:5173 no navegador.
call npm.cmd run dev
pause
