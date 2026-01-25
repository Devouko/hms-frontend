@echo off
echo 🏥 SmartCare Hospital Management System Setup
echo =============================================

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    echo    Download from: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js detected: 
node --version

REM Install dependencies
echo 📦 Installing dependencies...
where yarn >nul 2>&1
if %errorlevel% equ 0 (
    yarn install
) else (
    npm install
)

if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

echo ✅ Dependencies installed successfully

REM Setup options
echo.
echo 🔧 Setup Options:
echo 1. Start with sample data (recommended for testing)
echo 2. Start with empty system
set /p choice="Choose option (1 or 2): "

if "%choice%"=="1" (
    echo 📊 Creating sample data...
    echo. > .sample-data-enabled
    echo ✅ Sample data will be loaded on first run
)

REM Check for Supabase configuration
if exist "src\utils\supabase\info.tsx" (
    echo.
    echo 🔍 Supabase configuration detected
    echo    Make sure to update your Supabase credentials if needed
    echo    See DATABASE_SETUP.md for detailed instructions
) else (
    echo.
    echo ⚠️  No Supabase configuration found
    echo    System will use localStorage for data persistence
    echo    This is fine for development and testing
)

echo.
echo 🎉 Setup completed successfully!
echo.
echo Next steps:
echo 1. Run 'npm run dev' to start the development server
echo 2. Open http://localhost:5173 in your browser
echo 3. Create your first admin account
echo 4. Configure hospital settings in System Settings
echo.
echo 📚 Documentation:
echo    - README.md - Basic usage
echo    - DEPLOYMENT_GUIDE.md - Production deployment
echo    - DATABASE_SETUP.md - Database configuration
echo.
echo 🚀 Ready to launch your hospital management system!
pause