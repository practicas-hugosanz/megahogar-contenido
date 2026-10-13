# Registra una tarea de Windows que cada hora publica los Reels aprobados cuya hora ya ha llegado.
# Ejecutar UNA vez, cuando publish/.env esté relleno y la cola aprobada:
#   powershell -ExecutionPolicy Bypass -File publish\schedule-windows.ps1
# Para quitarla:  Unregister-ScheduledTask -TaskName "Megahogar Instagram" -Confirm:$false
# El PC debe estar encendido a la hora de publicación.

$project = Split-Path -Parent $PSScriptRoot
$node = (Get-Command node).Source
$action = New-ScheduledTaskAction -Execute $node -Argument "publish\instagram.mjs --due --publish" -WorkingDirectory $project
$trigger = New-ScheduledTaskTrigger -Once -At (Get-Date).Date.AddHours((Get-Date).Hour + 1) -RepetitionInterval (New-TimeSpan -Hours 1)
Register-ScheduledTask -TaskName "Megahogar Instagram" -Action $action -Trigger $trigger -Description "Publica Reels aprobados en Instagram" -Force
Write-Host "Tarea 'Megahogar Instagram' creada en $project"
