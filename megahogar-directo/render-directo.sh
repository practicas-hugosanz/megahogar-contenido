#!/usr/bin/env bash
# Renderiza los Reels "directo": bash render-directo.sh [slug ...]
cd "$(dirname "$0")"
slugs=("$@"); [ ${#slugs[@]} -eq 0 ] && slugs=(lavadora frigorifico lavavajillas)
mkdir -p renders
for s in "${slugs[@]}"; do
  python build-directo.py "$s" || exit 1
  npx -y hyperframes render --fps 30 --quality delivery --output "renders/directo-$s.mp4" --quiet 2>&1 | grep -iE "error|failed"
  echo "renders/directo-$s.mp4 listo"
done
