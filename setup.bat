@echo off
REM ChallengeQuest Setup Script for Windows
REM This script sets up both frontend and backend for the ChallengeQuest platform

echo 🚀 Setting up ChallengeQuest Platform...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed. Please install Node.js v18 or higher.
    pause
    exit /b 1
)

echo [SUCCESS] Node.js is installed

REM Setup backend
echo [INFO] Setting up backend...
cd backend

REM Install dependencies
echo [INFO] Installing backend dependencies...
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install backend dependencies
    pause
    exit /b 1
)

REM Setup environment
if not exist .env (
    echo [INFO] Creating backend environment file...
    copy env.example .env
    echo [WARNING] Please edit backend\.env with your database credentials
)

REM Generate Prisma client
echo [INFO] Generating Prisma client...
call npx prisma generate
if %errorlevel% neq 0 (
    echo [ERROR] Failed to generate Prisma client
    pause
    exit /b 1
)

echo [SUCCESS] Backend setup completed
cd ..

REM Setup frontend
echo [INFO] Setting up frontend...

REM Install dependencies
echo [INFO] Installing frontend dependencies...
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install frontend dependencies
    pause
    exit /b 1
)

REM Setup environment
if not exist .env (
    echo [INFO] Creating frontend environment file...
    copy env.example .env
)

echo [SUCCESS] Frontend setup completed

echo.
echo 🎉 Setup completed!
echo.
echo 📋 Next steps:
echo 1. Install PostgreSQL v13 or higher
echo 2. Edit backend\.env with your database credentials
echo 3. Run database setup: cd backend ^&^& npm run db:migrate ^&^& npm run db:seed
echo 4. Start the backend server: cd backend ^&^& npm run dev
echo 5. Start the frontend server: npm run dev
echo 6. Open http://localhost:5173 in your browser
echo.
echo 🔑 Default admin credentials:
echo    Email: admin@challengequest.com
echo    Password: admin123
echo.
echo 📚 For more information, see the README files:
echo    - Frontend: README.md
echo    - Backend: backend\README.md
echo.
pause
