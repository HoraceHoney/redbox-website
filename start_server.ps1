<#
.SYNOPSIS
    Starts The Red Box Localhost Web Application
#>

Write-Host "========================================================" -ForegroundColor Red
Write-Host "   THE RED BOX - AUTHENTIC INDO-CHINESE FOOD ON THE GO   " -ForegroundColor Yellow
Write-Host "   Localhost Web Application Launcher (PowerShell)       " -ForegroundColor White
Write-Host "========================================================" -ForegroundColor Red

Set-Location -Path $PSScriptRoot

if (Get-Command python -ErrorAction SilentlyContinue) {
    Write-Host "[INFO] Python detected. Starting Red Box server..." -ForegroundColor Green
    python server.py
} elseif (Get-Command node -ErrorAction SilentlyContinue) {
    Write-Host "[INFO] Node.js detected. Starting Red Box server..." -ForegroundColor Green
    node server.js
} else {
    Write-Host "[INFO] Opening index.html in default browser..." -ForegroundColor Cyan
    Start-Process "index.html"
}
