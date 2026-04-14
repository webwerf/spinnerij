#!/bin/bash
# Build Expo web app for WebHare hosting
#
# Use './dev webhare' to run this script.
#
# WebHare lowercases URLs on production servers. Linux is case-sensitive,
# so filenames must be lowercase. Pre-converted woff2 fonts live in
# scripts/fonts/ — run scripts/rebuild-fonts.sh to regenerate them.
#
# Usage:
#   ./scripts/build-webhare.sh                # Production build (relative API URL)
#   ./scripts/build-webhare.sh --local        # Local dev API (127.0.0.1:8001)

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
MODULE_DIR="$(dirname "$SCRIPT_DIR")"
APP_DIR="$MODULE_DIR/app"
DIST_DIR="$APP_DIR/dist"
WEB_DIR="$MODULE_DIR/web/dist"

# Parse arguments
API_URL=""

case "${1:-}" in
  --local)
    API_URL="http://127.0.0.1:8001/spinnerij"
    ;;
  "")
    # No API URL = relative (same origin as WebHare site)
    ;;
  *)
    echo "Unknown option: $1"
    echo "Usage: $0 [--local]"
    exit 1
    ;;
esac

cd "$APP_DIR"

# Step 1: Build
echo "Building web export..."
if [ -n "$API_URL" ]; then
  EXPO_PUBLIC_API_URL="$API_URL" npx expo export --platform web --clear
else
  npx expo export --platform web --clear
fi

# Step 2: Inject +html.tsx content into index.html
# (web.output=single ignores +html.tsx, so we must inject manually)
echo "Injecting HTML head content..."
node -e "
  const fs = require('fs');
  let html = fs.readFileSync('$DIST_DIR/index.html', 'utf8');

  // Language
  html = html.replace('<html>', '<html lang=\"nl\">');

  // Viewport with viewport-fit=cover
  html = html.replace(
    /<meta name=\"viewport\"[^>]*>/,
    '<meta name=\"viewport\" content=\"width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover\" />'
  );

  // Theme color + PWA meta tags + manifest
  const headTags = [
    '<meta name=\"theme-color\" content=\"#2D5E40\" />',
    '<meta name=\"apple-mobile-web-app-capable\" content=\"yes\" />',
    '<meta name=\"apple-mobile-web-app-status-bar-style\" content=\"default\" />',
    '<meta name=\"description\" content=\"De app voor huurders en bezoekers van Spinnerij Oosterveld in Enschede\" />',
    '<link rel=\"manifest\" href=\"/manifest.json\" />',
  ].join('\n    ');
  html = html.replace('</head>', '    ' + headTags + '\n  </head>');

  // Body background color
  html = html.replace('<body>', '<body style=\"background-color: #F7F3EE;\">');

  fs.writeFileSync('$DIST_DIR/index.html', html);
"

# Step 3: Copy pre-built fonts and fix JS bundle references
# Fonts are pre-converted (woff2, lowercased) in scripts/fonts/.
# To regenerate after adding/updating font packages, run: ./scripts/rebuild-fonts.sh
echo "Copying pre-built fonts..."

FONT_DST="$DIST_DIR/assets/fonts"
mkdir -p "$FONT_DST"
cp "$SCRIPT_DIR/fonts/"* "$FONT_DST/"

# Remove the node_modules directory from dist (no longer needed)
rm -rf "$DIST_DIR/assets/node_modules"

# Fix JS bundle references: deep node_modules paths → flat assets/fonts/
for js in "$DIST_DIR"/_expo/static/js/web/entry-*.js; do
  [ -f "$js" ] || continue
  # @expo-google-fonts paths
  perl -pi -e 's|assets/node_modules/\@expo-google-fonts/[^/]+/[^/]+/([^"]+\.ttf)|assets/fonts/$1|g' "$js"
  # @react-navigation paths
  perl -pi -e 's|assets/node_modules/\@react-navigation/elements/lib/module/assets/([^"]+)|assets/fonts/$1|g' "$js"
  # expo-router paths
  perl -pi -e 's|assets/node_modules/expo-router/assets/([^"]+)|assets/fonts/$1|g' "$js"
  # .ttf → .woff2
  sed -i '' 's/\.ttf/.woff2/g' "$js"
  # Lowercase references
  perl -pi -e 's|assets/fonts/([^"]+?)\.woff2|"assets/fonts/" . lc($1) . ".woff2"|ge' "$js"
  perl -pi -e 's|assets/fonts/([^"]+?)\.png|"assets/fonts/" . lc($1) . ".png"|ge' "$js"
done

# Step 4: Copy to WebHare module
echo "Copying to WebHare module (web/dist/)..."
rm -rf "$WEB_DIR"
mkdir -p "$WEB_DIR"
cp -R "$DIST_DIR/" "$WEB_DIR/"

# Also copy manifest.json from public/ if it exists
if [ -f "$APP_DIR/public/manifest.json" ]; then
  cp "$APP_DIR/public/manifest.json" "$WEB_DIR/manifest.json"
fi

echo ""
echo "✅ Build complete. Output in $MODULE_DIR/web/dist/"
echo ""
echo "Next steps:"
echo "  wh devkit:push <server-url> spinnerij   # deploy to server"
