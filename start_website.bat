@echo off
echo Starting 3D Fidget Shop...
echo.
echo NOTE: Browsers cannot load 3D files directly from your hard drive due to security rules.
echo We are starting a small local server to fix this.
echo.
echo When the server starts, it will tell you the address (usually http://localhost:3000)
echo.
call npx serve .
pause
