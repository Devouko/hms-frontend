@echo off
REM SmartCare Hospital Management System - Next.js Setup Script
REM This script automates the migration from Vite to Next.js

echo ========================================
echo SmartCare Hospital Management System
echo Next.js Migration Setup
echo ========================================
echo.

REM Step 1: Backup current package.json
echo [1/6] Backing up current configuration...
if exist package.json (
    copy package.json package-vite-backup.json >nul
    echo ✓ Backup created: package-vite-backup.json
)

REM Step 2: Replace package.json
echo.
echo [2/6] Updating package.json for Next.js...
if exist package-new.json (
    copy /Y package-new.json package.json >nul
    echo ✓ package.json updated
) else (
    echo ✗ Error: package-new.json not found
    pause
    exit /b 1
)

REM Step 3: Clean old build artifacts
echo.
echo [3/6] Cleaning old build artifacts...
if exist .next rmdir /s /q .next
if exist build rmdir /s /q build
if exist dist rmdir /s /q dist
if exist node_modules\.cache rmdir /s /q node_modules\.cache
echo ✓ Build artifacts cleaned

REM Step 4: Install dependencies
echo.
echo [4/6] Installing Next.js dependencies...
echo This may take a few minutes...
call npm install
if errorlevel 1 (
    echo ✗ Error: npm install failed
    pause
    exit /b 1
)
echo ✓ Dependencies installed

REM Step 5: Verify structure
echo.
echo [5/6] Verifying project structure...
if not exist src\app mkdir src\app
if not exist public mkdir public
echo ✓ Project structure verified

REM Step 6: Final checks
echo.
echo [6/6] Running final checks...
if exist src\app\layout.tsx (
    echo ✓ layout.tsx found
) else (
    echo ✗ Warning: layout.tsx not found
)

if exist src\app\page.tsx (
    echo ✓ page.tsx found
) else (
    echo ✗ Warning: page.tsx not found
)

if exist next.config.js (
    echo ✓ next.config.js found
) else (
    echo ✗ Warning: next.config.js not found
)

echo.
echo ========================================
echo Migration Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Review NEXTJS_MIGRATION_GUIDE.md
echo 2. Update .env file with NEXT_PUBLIC_ prefix
echo 3. Run: npm run dev
echo 4. Access: http://localhost:3000
echo.
echo For rollback, restore: package-vite-backup.json
echo ========================================
pause
