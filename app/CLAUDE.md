# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Spinnerij Oosterveld — an Expo React Native mobile app showcasing a commercial building in Enschede, NL. Features a news feed (RSS), tenant directory (mock data), and contact info. Built for iOS, Android, and web.

## Development Commands

```bash
npx expo start          # Start dev server (press i for iOS, a for Android, w for Web)
npx expo start --ios    # Start on iOS simulator
npx expo start --android # Start on Android emulator
npx expo start --web    # Start in browser
```

No test runner or linter is configured.

## Architecture

- **Expo Router** with file-based routing (similar to Next.js App Router)
- **Tab navigation** with five tabs: Home, Huurders, Vraag & Aanbod, Reserveren, Melding
- **Contact page** as non-tab stack screen, accessible via header icon
- `app/(tabs)/index.tsx` redirects to `/home`
- No detail pages — news links open spinnerijoosterveld.nl, tenant cards link to websites
- State is managed with React hooks only (no external state library)
- Custom hook `useRssFeed` fetches from RSS2JSON API

## Key Conventions

- **Language**: Dutch UI text, English code
- **Typography**: DM Sans font family (Regular 400, Medium 500, Bold 700)
- **Color palette** defined in `constants/Colors.ts`: primary green (#2D5E40), gold accent (#C8A96E), warm beige background (#F5F2ED)
- **Icons**: SF Symbols via `expo-symbols`
- **Styling**: React Native `StyleSheet.create` — no styled-components or NativeWind

## Key Dependencies

- Expo SDK 55 (stable), React 19, React Native 0.83
- After an Expo upgrade, run `scripts/rebuild-fonts.sh`: font hashes change and the build otherwise references woff2 files that `scripts/fonts/` doesn't have
- `expo-router` for navigation
- `react-native-reanimated` for animations
- `react-native-web` for web support
- Typed routes enabled in `app.json`

## Deployment

- **WebHare**: `./dev webhare` (from module root) builds Expo web and copies to `web/dist/` in the module root, then deploy with `wh ww:push https://cms.webwerf.nl/ spinnerij`. `web/dist/` is gitignored, so the push ships whatever is on disk: always build (without `--local`) right before pushing
- **Build**: `scripts/build-webhare.sh` handles font relocation, .ttf→.woff2 conversion, and filename lowercasing for WebHare compatibility
- **Hosting**: Webruleset `spinnerij-app` in `moduledefinition.xml` serves the SPA via `handlebydir` + `handlebyscript` fallbacks. It is mounted on `https://sites.tech42.nl/spinnerij-app/` by an access rule (Toegangsregel) on cms.webwerf.nl, which is not in code; `app.json` `experiments.baseUrl` must match that path
- **Packaging**: `app/`, `scripts/fonts/` and `.playwright-mcp/` are excluded from the module push; the server only needs `web/dist/`
- **GitHub**: `webwerf/spinnerij`

## Project Memory

- Expo Router Stack navigator does NOT animate on web — use `react-native-reanimated` entering animations (SlideInRight) directly on screen components instead
- iOS Safari bottom bar clips the tab bar — remove fixed `height` from tabBarStyle and use padding only, plus `viewport-fit=cover` in meta tag
- RSS feed via rss2json API: `item.content` has full HTML, `item.description` is short — use content for detail pages, description (stripped+truncated) for cards
- `@react-native-picker/picker` renders as an ugly unstyled `<select>` on web — use a custom `Dropdown` component instead (see `components/Dropdown.tsx`)
- Dropdowns in React Native Web need explicit `zIndex` on the parent container, otherwise they render behind sibling elements
- Avoid emoji icons in headers/nav — use SVG icons via `react-native-svg` for a professional look
- WhatsApp number centralized in `constants/api.ts` as `WHATSAPP_NUMBER` / `WHATSAPP_BASE` — all screens import from there
- Huurder/room/vraag-aanbod data fetched from WebHare JSON endpoint (`/spinnerij/data.json`) via `useSpinnerijData` hook — types in `constants/types.ts`, URL in `constants/api.ts`
- CORS for data.json is configured via `<webrule>` in siteprl.xml `<sitesettings>` — needed for cross-origin dev (Expo on different port)
- Tenant logos and room images go through the JSON as host-relative image-cache links (`logourl`, `imageurl`, built with `toResized()` in `js/api.ts`); the app resolves them with `resolveImageUrl()` from `constants/api.ts`. Missing images fall back to ui-avatars (tenants) or a colored block (rooms)
- App lives inside a WebHare module at `installedmodules/spinnerij/app/` — root has WebHare module files (moduledefinition.xml, language/), app has Expo files
- Build uses pre-converted fonts from `scripts/fonts/` — run `scripts/rebuild-fonts.sh` to regenerate after adding/updating font packages
- Production API URL is `https://sites.tech42.nl/spinnerij-app` — fallback in `constants/api.ts`, use `--local` flag in build script for localhost
- `react-native-modal` package is incompatible with React 19 / Expo SDK 55 — uses deprecated `TouchableWithoutFeedback` and old ref API. Don't use it.
- Modal backdrop dismiss on web: use `Pressable` + `StyleSheet.absoluteFill` as a *sibling* of modal content, not as a parent wrapper. Parent wrapper causes form element clicks to close the modal.
- JSON endpoint `data.json` routes camelCase → lowercase: the `.whscr` calls `CallJS(getData)` and `EncodeJSON`s the RECORD, which lowercases all keys. So `../js/api.ts` uses `wrdTitle`, `email`, etc. while `app/constants/types.ts` uses `wrdtitle`, `email`. When adding fields: edit WRD schema → `js/api.ts` (select + Tenant interface, camelCase) → `app/constants/types.ts` (lowercase). The three-file sync is easy to miss.
- The app targets production (`sites.tech42.nl`) by default via `EXPO_PUBLIC_API_URL`. Local backend changes to `js/api.ts` or WRD data don't appear in the app until either (a) you start dev with `./dev start --local` (points to `127.0.0.1:8001/spinnerij`) or (b) deploy via `./dev webhare` / `wh ww:push https://cms.webwerf.nl/ spinnerij`.
- Tenant `description` field may contain WordPress HTML (`<p>`, `<!-- wp:... -->`). `TenantCard.tsx` strips it at render via a local `stripHtml()` helper — keeps source-of-truth in WRD intact so Tollium admins can still paste rich text.
- `data.json` is only republished by edits in the Tollium app (`RepublishDataJson` in `tolliumapps/main.whlib`). A backup restore, an import script or a deploy that changes the JSON shape needs a manual republish (Publisher, or save one tenant in the Tollium app)
