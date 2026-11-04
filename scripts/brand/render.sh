#!/usr/bin/env bash
# Regenerates every icon and the link preview from the sources in this folder.
# Needs chromium and network access (for the Google Fonts). Run from the repo root:
#   scripts/brand/render.sh
set -euo pipefail
here="$(cd "$(dirname "$0")" && pwd)"
root="$(cd "$here/../.." && pwd)"
shot() { # <url> <out.png> <w> <h> [transparent]
  local bg=(); [ "${5:-}" = transparent ] && bg=(--default-background-color=00000000)
  chromium --headless=new --disable-gpu --no-sandbox --hide-scrollbars --force-device-scale-factor=1 "${bg[@]}" \
    --window-size="$3,$4" --virtual-time-budget=4000 --screenshot="$2" "$1" >/dev/null 2>&1
}
cp "$here/mark.svg" "$root/src/app/icon.svg"
tmp="$(mktemp -d)"
printf '<html><body style="margin:0;background:transparent"><img src="%s" style="width:%spx;height:%spx;display:block"></body></html>' "file://$here/mark.svg" 32 32 > "$tmp/m32.html"
printf '<html><body style="margin:0;background:transparent"><img src="%s" style="width:%spx;height:%spx;display:block"></body></html>' "file://$here/mark.svg" 16 16 > "$tmp/m16.html"
shot "file://$tmp/m32.html" "$tmp/32.png" 32 32 transparent
shot "file://$tmp/m16.html" "$tmp/16.png" 16 16 transparent
node "$here/ico.mjs" "$root/src/app/favicon.ico" "$tmp/16.png" "$tmp/32.png"
shot "file://$here/record.html?size=180&pad=0.1" "$root/src/app/apple-icon.png" 180 180
# Android icons: extra padding so "maskable" crops never cut the record
shot "file://$here/record.html?size=192&pad=0.16" "$root/public/icon-192.png" 192 192
shot "file://$here/record.html?size=512&pad=0.16" "$root/public/icon-512.png" 512 512
shot "file://$here/og.html" "$root/src/app/opengraph-image.png" 1200 630
rm -rf "$tmp"
echo "icons written"
