@echo off
chcp 65001 >nul
echo ========================================
echo   自动部署到 GitHub
echo ========================================
echo.

echo [1/4] 添加文件...
git add .

echo [2/4] 提交更改...
git commit -m "改进博客文章和设置"

echo [3/4] 拉取并合并远程更改...
git pull --rebase origin main

echo [4/4] 推送到 GitHub...
git push --force-with-lease origin main

echo.
echo ========================================
echo   部署完成！
echo ========================================
pause
