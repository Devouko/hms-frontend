@echo off
echo Fixing motion imports...
powershell -ExecutionPolicy Bypass -File "fix-motion-imports.ps1"
echo.
echo Installing framer-motion...
npm install framer-motion
echo.
echo Done! Please restart your development server.
pause