@echo off
setlocal
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo Instale o Node.js 22.12 ou superior.
  pause
  exit /b 1
)

if not exist "frontend\.env" copy "frontend\.env.example" "frontend\.env" >nul

set "unigames_backend=1"
findstr /C:"VITE_DATA_SOURCE=demo" "frontend\.env" >nul
if not errorlevel 1 set "unigames_backend=0"

if "%unigames_backend%"=="1" (
  if not exist "backend\.env" (
    copy "backend\.env.example" "backend\.env" >nul
    echo Configure MONGODB_URI e JWT_SECRET no arquivo backend\.env.
    echo Depois abra este arquivo novamente.
    pause
    exit /b 1
  )

  if not exist "backend\node_modules" (
    call npm.cmd ci --prefix backend
    if errorlevel 1 (
      echo Nao foi possivel instalar as dependencias do backend.
      pause
      exit /b 1
    )
  )

  start "UniGames Backend" /D "%~dp0backend" cmd /k "npm.cmd start"
)

if not exist "frontend\node_modules" (
  call npm.cmd ci --prefix frontend
  if errorlevel 1 (
    echo Nao foi possivel instalar as dependencias do frontend.
    pause
    exit /b 1
  )
)

cd frontend
echo Abra http://localhost:5173 no navegador.
call npm.cmd run dev
pause
