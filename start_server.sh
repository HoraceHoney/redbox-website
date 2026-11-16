#!/usr/bin/env bash
# The Red Box - macOS / Linux Launcher
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd "$DIR"

echo "========================================================"
echo "   THE RED BOX - AUTHENTIC INDO-CHINESE FOOD ON THE GO   "
echo "   Localhost Web Application Launcher (macOS / Linux)   "
echo "========================================================"

if command -v python3 &>/dev/null; then
    echo "[INFO] Python3 detected. Launching Red Box server..."
    python3 server.py
elif command -v python &>/dev/null; then
    echo "[INFO] Python detected. Launching Red Box server..."
    python server.py
elif command -v node &>/dev/null; then
    echo "[INFO] Node.js detected. Launching Red Box server..."
    node server.js
else
    echo "[WARNING] Neither Python nor Node.js detected. Opening index.html..."
    if command -v open &>/dev/null; then
        open index.html
    elif command -v xdg-open &>/dev/null; then
        xdg-open index.html
    fi
fi
