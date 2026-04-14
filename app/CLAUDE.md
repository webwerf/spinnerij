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

- Expo SDK 55 (canary), React 19, React Native 0.83
- `expo-router` for navigation
- `react-native-reanimated` for animations
- `react-native-web` for web support
- Typed routes enabled in `app.json`

## Deployment

- **WebHare**: `./dev webhare` (from module root) builds Expo web and copies to `web/dist/` in the module root, then deploy with `wh devkit:push`
- **Build**: `scripts/build-webhare.sh` handles font relocation, .ttf→.woff2 conversion, and filename lowercasing for WebHare compatibility
- **Hosting**: Webruleset `spinnerij-app` in `moduledefinition.xml` serves the SPA via `handlebydir` + `handlebyscript` fallbacks
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
- Images/logos exist in WRD schema but are not yet included in the JSON API — screens use placeholder avatars (ui-avatars.com) and colored blocks
- App lives inside a WebHare module at `installedmodules/spinnerij/app/` — root has WebHare module files (moduledefinition.xml, language/), app has Expo files
- Build uses pre-converted fonts from `scripts/fonts/` — run `scripts/rebuild-fonts.sh` to regenerate after adding/updating font packages
- Production API URL is `https://sites.webwerf.nl/spinnerij-app` — fallback in `constants/api.ts`, use `--local` flag in build script for localhost
- `react-native-modal` package is incompatible with React 19 / Expo SDK 55 — uses deprecated `TouchableWithoutFeedback` and old ref API. Don't use it.
- Modal backdrop dismiss on web: use `Pressable` + `StyleSheet.absoluteFill` as a *sibling* of modal content, not as a parent wrapper. Parent wrapper causes form element clicks to close the modal.
