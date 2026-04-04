@echo off
setlocal
cd /d "%~dp0"

where py >nul 2>nul
if %errorlevel%==0 (
  py -3 generate_download_index.py
  goto done
)

where python >nul 2>nul
if %errorlevel%==0 (
  python generate_download_index.py
  goto done
)

echo Khong tim thay Python tren may.
echo Hay cai Python roi chay lai file nay.
pause
exit /b 1

:done
echo.
echo Da cap nhat DownloadLibrary/index.json
pause
