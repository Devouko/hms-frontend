@echo off
cd src\components\ui
for %%f in (*.tsx) do (
    powershell -Command "(Get-Content '%%f') -replace '@radix-ui/react-([a-z-]+)@[\d.]+', '@radix-ui/react-$1' | Set-Content '%%f'"
)
echo Fixed all Radix UI imports
