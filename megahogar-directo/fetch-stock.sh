#!/usr/bin/env bash
# Descarga y prepara los clips de stock (Pexels, licencia gratuita para uso comercial) que usan los Reels.
# Los clips no se guardan en el repositorio porque Pexels no permite redistribuirlos como archivos.
# Requiere curl y ffmpeg.   Uso: bash fetch-stock.sh            (todos)
#                                bash fetch-stock.sh 7086406    (solo uno)
set -e
cd "$(dirname "$0")"
mkdir -p assets/stock/raw

# id  ·  uso
CLIPS="7086406 8756952 8756698 5418706 6974071 7127511 7292490 9474125 9462909"
[ $# -gt 0 ] && CLIPS="$*"

for id in $CLIPS; do
  if [ -f "assets/stock/pexels-$id.mp4" ]; then echo "ya existe $id"; continue; fi
  echo "descargando $id"
  curl -sL -A "Mozilla/5.0" -e "https://www.pexels.com/" -o "assets/stock/raw/pexels-$id.mp4" "https://www.pexels.com/download/video/$id/"
  ffmpeg -v error -i "assets/stock/raw/pexels-$id.mp4" -an \
    -vf "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,fps=30" \
    -c:v libx264 -preset medium -crf 23 -pix_fmt yuv420p -movflags +faststart "assets/stock/pexels-$id.mp4" -y
done
echo "listo"
