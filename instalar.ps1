<#
.SYNOPSIS
  Instala todo lo necesario para crear Reels de Megahogar desde Claude.

.DESCRIPTION
  1. Comprueba (y, con tu permiso, instala) Git, Node.js 22, Python 3 y FFmpeg con winget.
  2. Descarga el proyecto desde GitHub.
  3. Instala las herramientas de vídeo (HyperFrames) y, si quieres, el modelo de voz local.
  4. Añade a Claude la habilidad "megahogar-reel": basta con decir "hazme un reel de megahogar de ...".

  No pide ni guarda contraseñas ni claves. No publica nada en Instagram.

.PARAMETER Destino
  Carpeta donde se descarga el proyecto. Por defecto: Documentos\Megahogar\megahogar-contenido.
.PARAMETER SkillDir
  Carpeta de habilidades de Claude. Por defecto: ~\.claude\skills
.PARAMETER Yes
  No pregunta: acepta todas las instalaciones.
.PARAMETER SinModelos
  No instala el modelo de voz local (unos cientos de MB). Se puede instalar más tarde.
.PARAMETER SinClips
  No descarga los clips de stock de los Reels existentes.
.PARAMETER Simular
  Solo muestra lo que haría, sin cambiar nada.

.EXAMPLE
  powershell -ExecutionPolicy Bypass -File instalar.ps1
#>
[CmdletBinding()]
param(
  [string]$Destino = (Join-Path ([Environment]::GetFolderPath("MyDocuments")) "Megahogar\megahogar-contenido"),
  [string]$SkillDir = (Join-Path $env:USERPROFILE ".claude\skills"),
  [string]$Repo = "https://github.com/practicas-hugosanz/megahogar-contenido.git",
  [switch]$Yes,
  [switch]$SinModelos,
  [switch]$SinClips,
  [switch]$Simular
)

$ErrorActionPreference = "Stop"

function Paso($t) { Write-Host ""; Write-Host "==> $t" -ForegroundColor Cyan }
function Ok($t) { Write-Host "    OK  $t" -ForegroundColor Green }
function Aviso($t) { Write-Host "    !   $t" -ForegroundColor Yellow }
function Pregunta($t) {
  if ($Yes) { return $true }
  $r = Read-Host "    $t [S/n]"
  return ($r -eq "" -or $r -match "^[sSyY]")
}
function Existe($cmd) { return [bool](Get-Command $cmd -ErrorAction SilentlyContinue) }
function Ejecutar($desc, [scriptblock]$bloque) {
  if ($Simular) { Write-Host "    [simulacion] $desc" -ForegroundColor DarkGray; return }
  & $bloque
}
function ActualizarPath {
  $m = [Environment]::GetEnvironmentVariable("Path", "Machine")
  $u = [Environment]::GetEnvironmentVariable("Path", "User")
  $env:Path = "$m;$u"
}

Write-Host ""
Write-Host "Instalador de Megahogar para Claude" -ForegroundColor White
Write-Host "Carpeta del proyecto: $Destino"
Write-Host "Habilidades de Claude: $SkillDir"
if ($Simular) { Write-Host "(modo simulacion: no se cambia nada)" -ForegroundColor Yellow }

# 1 ------------------------------------------------------------------ requisitos
Paso "Comprobando requisitos"
$requisitos = @(
  @{ Cmd = "git"; Nombre = "Git"; Winget = "Git.Git" },
  @{ Cmd = "node"; Nombre = "Node.js 22"; Winget = "OpenJS.NodeJS.LTS" },
  @{ Cmd = "python"; Nombre = "Python 3"; Winget = "Python.Python.3.12" },
  @{ Cmd = "ffmpeg"; Nombre = "FFmpeg"; Winget = "Gyan.FFmpeg" }
)
$faltan = @()
foreach ($r in $requisitos) {
  if (Existe $r.Cmd) { Ok "$($r.Nombre) ya esta instalado" } else { $faltan += $r; Aviso "$($r.Nombre) no esta instalado" }
}

if ($faltan.Count -gt 0) {
  if (-not (Existe "winget")) {
    Write-Host "No encuentro winget. Instala a mano: $(($faltan | ForEach-Object { $_.Nombre }) -join ', ') y vuelve a ejecutar el instalador." -ForegroundColor Red
    if (-not $Simular) { exit 1 }
  } else {
    foreach ($r in $faltan) {
      if (Pregunta "Instalo $($r.Nombre) con winget?") {
        Ejecutar "winget install --id $($r.Winget)" {
          winget install --id $($r.Winget) -e --accept-package-agreements --accept-source-agreements
        }
      } else {
        Aviso "Sin $($r.Nombre) el flujo no funcionara por completo."
      }
    }
    ActualizarPath
    foreach ($r in $faltan) {
      if (-not $Simular -and -not (Existe $r.Cmd)) {
        Write-Host "    $($r.Nombre) se ha instalado pero esta ventana aun no lo ve. Cierra esta ventana, abre otra y vuelve a ejecutar el instalador." -ForegroundColor Yellow
        exit 0
      }
    }
  }
}

# Node 22 o superior
if (-not $Simular -and (Existe "node")) {
  $v = (node -v) -replace "v", ""
  if ([int]($v.Split(".")[0]) -lt 22) { Aviso "Tienes Node $v. Se recomienda la version 22 o superior; si algo falla, actualizala." }
}

# 2 ------------------------------------------------------------------ proyecto
Paso "Descargando el proyecto"
Ejecutar "git clone/pull $Repo -> $Destino" {
  if (Test-Path (Join-Path $Destino ".git")) {
    git -C $Destino pull --ff-only
    Ok "Proyecto actualizado"
  } else {
    New-Item -ItemType Directory -Force (Split-Path $Destino) | Out-Null
    git clone $Repo $Destino
    Ok "Proyecto descargado en $Destino"
  }
}

# 3 ------------------------------------------------------------------ herramientas de video
Paso "Instalando las herramientas de video (HyperFrames)"
Ejecutar "npx hyperframes skills update general-video" {
  Push-Location $Destino
  try {
    npx --yes hyperframes skills update general-video
    Ok "Habilidades de video instaladas"
  } finally { Pop-Location }
}

if (-not $SinModelos) {
  if (Pregunta "Instalo el modelo de voz local (para sincronizar texto y voz; descarga de cientos de MB)?") {
    Ejecutar "npx hyperframes models install parakeet" {
      Push-Location $Destino
      try { npx --yes hyperframes models install parakeet; Ok "Modelo de voz instalado" } finally { Pop-Location }
    }
  } else {
    Aviso "Sin el modelo no se pueden sincronizar los Reels nuevos. Instalalo luego con: npx hyperframes models install parakeet"
  }
}

if (-not $SinClips) {
  if (Pregunta "Descargo los clips de stock de Pexels de los Reels existentes (unos 100 MB, licencia gratuita comercial)?") {
    Ejecutar "bash megahogar-directo/fetch-stock.sh" {
      $bash = Get-Command bash -ErrorAction SilentlyContinue
      if (-not $bash) {
        $gitBash = Join-Path (Split-Path (Split-Path (Get-Command git).Source)) "bin\bash.exe"
        if (Test-Path $gitBash) { $bash = $gitBash } else { $bash = $null }
      }
      if ($bash) {
        Push-Location (Join-Path $Destino "megahogar-directo")
        try { & $bash "fetch-stock.sh"; Ok "Clips descargados" } finally { Pop-Location }
      } else {
        Aviso "No encuentro bash. Ejecuta fetch-stock.sh desde Git Bash."
      }
    }
  }
}

# 4 ------------------------------------------------------------------ habilidad de Claude
Paso "Anadiendo la habilidad a Claude"
Ejecutar "copiar skill/megahogar-reel a $SkillDir" {
  $origen = Join-Path $Destino "skill\megahogar-reel\SKILL.md"
  if (-not (Test-Path $origen)) { throw "No encuentro $origen" }
  $dir = Join-Path $SkillDir "megahogar-reel"
  New-Item -ItemType Directory -Force $dir | Out-Null
  $texto = [IO.File]::ReadAllText($origen, [Text.Encoding]::UTF8).Replace("__RUTA__", $Destino)
  [IO.File]::WriteAllText((Join-Path $dir "SKILL.md"), $texto, (New-Object Text.UTF8Encoding($false)))
  Ok "Habilidad instalada en $dir"
}

# ------------------------------------------------------------------ final
Write-Host ""
Write-Host "Listo." -ForegroundColor Green
Write-Host ""
Write-Host "Falta un paso, que solo puedes hacer tu:" -ForegroundColor White
Write-Host "  1. En Claude: Ajustes > Conectores > conecta ElevenLabs con tu cuenta (para la voz)."
Write-Host ""
Write-Host "Para crear un Reel, abre Claude (reinicialo si ya estaba abierto) y escribe, por ejemplo:" -ForegroundColor White
Write-Host '  "Hazme un reel de megahogar sobre como elegir una aspiradora"' -ForegroundColor Cyan
Write-Host ""
Write-Host "Claude te propondra el guion, pedira permiso antes de descargar clips y dejara el video y el caption para revisar."
Write-Host "No se publica nada en Instagram sin que tu lo apruebes."
