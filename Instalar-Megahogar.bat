@echo off
title Instalador de Megahogar para Claude
echo.
echo Descargando el instalador de Megahogar...
echo (puedes ver su codigo en https://github.com/practicas-hugosanz/megahogar-contenido/blob/main/instalar.ps1)
echo.
powershell -NoProfile -ExecutionPolicy Bypass -Command "$ErrorActionPreference='Stop'; $f=Join-Path $env:TEMP 'instalar-megahogar.ps1'; Invoke-WebRequest -UseBasicParsing 'https://raw.githubusercontent.com/practicas-hugosanz/megahogar-contenido/main/instalar.ps1' -OutFile $f; & powershell -NoProfile -ExecutionPolicy Bypass -File $f"
if errorlevel 1 (
  echo.
  echo Algo ha fallado. Copia el mensaje de arriba y pegaselo a Claude para que te ayude.
)
echo.
pause
