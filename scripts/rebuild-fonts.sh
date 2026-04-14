#!/bin/bash
# Rebuild pre-converted fonts from node_modules.
# Run this after adding or updating font packages (e.g., @expo-google-fonts).
# Requires: fonttools (pip install fonttools brotli)
#
# Usage: ./scripts/rebuild-fonts.sh

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
APP_DIR="$(dirname "$SCRIPT_DIR")/app"
FONT_DST="$SCRIPT_DIR/fonts"

echo "Building temporary export to collect fonts..."
cd "$APP_DIR"
npx expo export --platform web --clear

DIST_DIR="$APP_DIR/dist"

# Collect all fonts and assets into a temp dir
TEMP_DIR=$(mktemp -d)

# @expo-google-fonts
GOOGLE_FONTS_SRC="$DIST_DIR/assets/node_modules/@expo-google-fonts"
if [ -d "$GOOGLE_FONTS_SRC" ]; then
  find "$GOOGLE_FONTS_SRC" -name "*.ttf" -exec cp {} "$TEMP_DIR/" \;
fi

# @react-navigation
NAV_SRC="$DIST_DIR/assets/node_modules/@react-navigation"
if [ -d "$NAV_SRC" ]; then
  find "$NAV_SRC" \( -name "*.ttf" -o -name "*.png" \) -exec cp {} "$TEMP_DIR/" \;
fi

# expo-router
ROUTER_SRC="$DIST_DIR/assets/node_modules/expo-router/assets"
if [ -d "$ROUTER_SRC" ]; then
  cp "$ROUTER_SRC"/* "$TEMP_DIR/" 2>/dev/null || true
fi

# Convert .ttf to .woff2
echo "Converting fonts to woff2..."
for f in "$TEMP_DIR"/*.ttf; do
  [ -f "$f" ] || continue
  fonttools ttLib.woff2 compress "$f" 2>/dev/null || true
done
rm -f "$TEMP_DIR"/*.ttf

# Lowercase all filenames
echo "Lowercasing filenames..."
for f in "$TEMP_DIR"/*; do
  [ -f "$f" ] || continue
  dir=$(dirname "$f")
  base=$(basename "$f")
  lower=$(echo "$base" | tr '[:upper:]' '[:lower:]')
  if [ "$base" != "$lower" ]; then
    mv "$f" "$dir/$lower"
  fi
done

# Replace fonts dir
rm -rf "$FONT_DST"
mkdir -p "$FONT_DST"
cp "$TEMP_DIR"/* "$FONT_DST/"
rm -rf "$TEMP_DIR"

echo ""
echo "✅ $(ls "$FONT_DST" | wc -l | tr -d ' ') fonts written to scripts/fonts/"
echo "Don't forget to commit the updated fonts."
